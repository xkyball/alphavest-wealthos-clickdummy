import {
  AuditResult,
  ComplianceStatus,
  EvidenceStatus,
  ObjectType,
  type Prisma,
  type PrismaClient,
  RecommendationStatus,
  VisibilityStatus,
} from "@prisma/client";

import { auditService } from "@/lib/audit-service";
import { demoPlatformTenantId, requireDemoSession, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";

type OperationalPrisma = PrismaClient | Prisma.TransactionClient;

export type OperationalEvidenceWorkflowSource = "advisor" | "compliance" | "internal";

export type OperationalEvidenceFeedbackState =
  | "loading"
  | "validation_failed"
  | "blocked"
  | "success"
  | "retry_available";

export type OperationalEvidenceLifecycleState =
  | "request_open"
  | "upload_pending"
  | "linked_not_sufficient"
  | "sufficient_for_scoped_gate"
  | "released"
  | "rejected"
  | "closed_history";

export class OperationalStage3ValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super("Invalid Operational Stage 3 evidence lifecycle request.");
  }
}

export class OperationalStage3PermissionError extends Error {
  constructor(public readonly reasonCode: string) {
    super("Operational Stage 3 evidence lifecycle action is not permitted.");
  }
}

const requestRoleAllowlist = new Set<DemoRoleKey>(["analyst", "senior_wealth_advisor", "compliance_officer"]);
const complianceOnlyRoles = new Set<DemoRoleKey>(["compliance_officer"]);

function requireReason(reason: string) {
  if (!reason.trim()) {
    throw new OperationalStage3ValidationError(["reason_required"]);
  }
}

function assertRequestRole(roleKey: DemoRoleKey) {
  if (!requestRoleAllowlist.has(roleKey)) {
    throw new OperationalStage3PermissionError("evidence_request_role_denied");
  }
}

function assertComplianceRole(roleKey: DemoRoleKey) {
  if (!complianceOnlyRoles.has(roleKey)) {
    throw new OperationalStage3PermissionError("compliance_reviewer_required");
  }
}

function metadata(input: Prisma.InputJsonObject): Prisma.InputJsonObject {
  return {
    noAdviceExecution: true,
    noClientRelease: true,
    noEvidenceSufficiency: true,
    noExportApproval: true,
    operationalStage: "PH3",
    ...input,
  };
}

function lifecycleStateForEvidence(status: EvidenceStatus): OperationalEvidenceLifecycleState {
  if (status === EvidenceStatus.PLACEHOLDER) return "request_open";
  if (status === EvidenceStatus.CREATED) return "upload_pending";
  if (status === EvidenceStatus.LINKED) return "linked_not_sufficient";
  if (status === EvidenceStatus.VALIDATED) return "sufficient_for_scoped_gate";
  if (status === EvidenceStatus.RELEASED) return "released";
  if (status === EvidenceStatus.RESTRICTED) return "rejected";
  return "closed_history";
}

export function evidenceRequestFeedbackState(input: {
  blocked?: boolean;
  loading?: boolean;
  retryable?: boolean;
  succeeded?: boolean;
  validationIssues?: string[];
}): OperationalEvidenceFeedbackState {
  if (input.loading) return "loading";
  if (input.validationIssues?.length) return "validation_failed";
  if (input.blocked) return input.retryable ? "retry_available" : "blocked";
  return input.succeeded ? "success" : "blocked";
}

export async function createOperationalEvidenceRequest(
  prisma: PrismaClient,
  input: {
    actorRoleKey: DemoRoleKey;
    auditPersistenceAvailable?: boolean;
    reason: string;
    source: OperationalEvidenceWorkflowSource;
    targetRecommendationId: string;
    tenantSlug: DemoTenantSlug;
  },
) {
  requireReason(input.reason);
  assertRequestRole(input.actorRoleKey);

  const session = requireDemoSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const recommendation = await prisma.recommendation.findFirst({
    where: { clientTenantId: session.tenant.id, id: input.targetRecommendationId },
  });

  if (!recommendation) {
    throw new OperationalStage3ValidationError(["recommendation_scope_required"]);
  }

  return prisma.$transaction(async (tx) => {
    auditService.assertCriticalAuditWritable({
      action: "BLOCK",
      actorRoleKey: session.role.key,
      actorUserId: session.actor.id,
      auditPersistenceAvailable: input.auditPersistenceAvailable,
      clientTenantId: session.tenant.id,
      eventType: "operational.evidence.request.created",
      nextState: ComplianceStatus.NEEDS_EVIDENCE,
      platformTenantId: demoPlatformTenantId,
      previousState: recommendation.status,
      reason: input.reason,
      result: AuditResult.PENDING,
      targetId: recommendation.id,
      targetType: ObjectType.RECOMMENDATION,
    });

    const review = await tx.complianceReview.upsert({
      create: {
        adviceClassification: recommendation.adviceClassification,
        clientTenantId: session.tenant.id,
        evidenceComplete: false,
        releaseNotes: input.reason,
        reviewerUserId: session.actor.id,
        status: ComplianceStatus.NEEDS_EVIDENCE,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
      update: {
        blockedAt: null,
        evidenceComplete: false,
        releaseNotes: input.reason,
        releasedAt: null,
        reviewerUserId: session.actor.id,
        status: ComplianceStatus.NEEDS_EVIDENCE,
      },
      where: {
        id:
          (
            await tx.complianceReview.findFirst({
              select: { id: true },
              where: { targetId: recommendation.id, targetType: ObjectType.RECOMMENDATION },
            })
          )?.id ?? "00000000-0000-0000-0000-000000000000",
      },
    });
    const evidence = await tx.evidenceRecord.upsert({
      create: {
        clientTenantId: session.tenant.id,
        createdByUserId: session.actor.id,
        relatedObjectId: recommendation.id,
        relatedObjectType: ObjectType.RECOMMENDATION,
        status: EvidenceStatus.PLACEHOLDER,
        summary: input.reason,
        title: "Operational evidence request",
        visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
      },
      update: {
        status: EvidenceStatus.PLACEHOLDER,
        summary: input.reason,
        visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
      },
      where: {
        id:
          (
            await tx.evidenceRecord.findFirst({
              select: { id: true },
              where: { clientTenantId: session.tenant.id, relatedObjectId: recommendation.id, relatedObjectType: ObjectType.RECOMMENDATION },
            })
          )?.id ?? "00000000-0000-0000-0000-000000000000",
      },
    });
    const item = await tx.evidenceItem.create({
      data: {
        evidenceRecordId: evidence.id,
        itemType: "operational_stage3_evidence_request",
        sourceObjectId: recommendation.id,
        sourceObjectType: ObjectType.RECOMMENDATION,
        title: `Evidence requested from ${input.source} workflow`,
        visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
      },
    });

    await tx.recommendation.update({
      data: {
        clientVisible: false,
        status: RecommendationStatus.MORE_DATA_REQUESTED,
      },
      where: { id: recommendation.id },
    });

    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: session.tenant.id,
        eventType: "operational.evidence.request.created",
        evidenceRecordId: evidence.id,
        metadataJson: metadata({
          assigneeRoleKey: "compliance_officer",
          complianceReviewId: review.id,
          evidenceItemId: item.id,
          requestSource: input.source,
        }),
        nextState: ComplianceStatus.NEEDS_EVIDENCE,
        platformTenantId: demoPlatformTenantId,
        previousState: recommendation.status,
        reason: input.reason,
        result: AuditResult.PENDING,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
    });

    return {
      auditEventId: audit.id,
      complianceReviewId: review.id,
      evidenceItemId: item.id,
      evidenceRecordId: evidence.id,
      lifecycleState: lifecycleStateForEvidence(evidence.status),
      releaseReady: false,
      scopedRequestState: ComplianceStatus.NEEDS_EVIDENCE,
      sufficiency: false,
    };
  });
}

export async function linkOperationalEvidenceToObject(
  prisma: PrismaClient,
  input: {
    actorRoleKey: DemoRoleKey;
    evidenceRecordId: string;
    reason: string;
    targetObjectId: string;
    targetObjectType: ObjectType;
    tenantSlug: DemoTenantSlug;
  },
) {
  requireReason(input.reason);
  assertRequestRole(input.actorRoleKey);
  const session = requireDemoSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const evidence = await prisma.evidenceRecord.findFirst({
    where: { clientTenantId: session.tenant.id, id: input.evidenceRecordId },
  });

  if (!evidence) {
    throw new OperationalStage3ValidationError(["evidence_scope_required"]);
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.evidenceRecord.update({
      data: {
        relatedObjectId: input.targetObjectId,
        relatedObjectType: input.targetObjectType,
        status: evidence.status === EvidenceStatus.PLACEHOLDER ? EvidenceStatus.LINKED : evidence.status,
      },
      where: { id: evidence.id },
    });
    const item = await tx.evidenceItem.create({
      data: {
        evidenceRecordId: evidence.id,
        itemType: "operational_stage3_evidence_link",
        sourceObjectId: input.targetObjectId,
        sourceObjectType: input.targetObjectType,
        title: "Evidence linked to scoped object",
        visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
      },
    });
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: session.tenant.id,
        eventType: "operational.evidence.linked",
        evidenceRecordId: evidence.id,
        metadataJson: metadata({ evidenceItemId: item.id, targetObjectType: input.targetObjectType }),
        nextState: updated.status,
        platformTenantId: demoPlatformTenantId,
        previousState: evidence.status,
        reason: input.reason,
        result: AuditResult.SUCCESS,
        targetId: evidence.id,
        targetType: ObjectType.EVIDENCE_RECORD,
      },
    });

    return {
      auditEventId: audit.id,
      evidenceItemId: item.id,
      evidenceRecordId: updated.id,
      gateSupport: updated.status === EvidenceStatus.VALIDATED || updated.status === EvidenceStatus.RELEASED,
      lifecycleState: lifecycleStateForEvidence(updated.status),
    };
  });
}

export async function getOperationalEvidenceVault(prisma: OperationalPrisma, input: { actorRoleKey: DemoRoleKey; tenantSlug: DemoTenantSlug }) {
  const session = requireDemoSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const records = await prisma.evidenceRecord.findMany({
    include: { items: { orderBy: { createdAt: "asc" } } },
    orderBy: { updatedAt: "desc" },
    where: { clientTenantId: session.tenant.id },
  });

  return records.map((record) => ({
    id: record.id,
    itemCount: record.items.length,
    lifecycleState: lifecycleStateForEvidence(record.status),
    relatedObjectId: record.relatedObjectId,
    relatedObjectType: record.relatedObjectType,
    status: record.status,
    title: record.title,
    visibilityStatus: record.visibilityStatus,
  }));
}

export async function projectOperationalClientSafeEvidenceSummary(prisma: OperationalPrisma, input: { evidenceRecordId: string; tenantSlug: DemoTenantSlug }) {
  const session = requireDemoSession({ roleKey: "principal", tenantSlug: input.tenantSlug });
  const record = await prisma.evidenceRecord.findFirst({
    where: { clientTenantId: session.tenant.id, id: input.evidenceRecordId },
  });

  if (!record || record.status !== EvidenceStatus.RELEASED || record.visibilityStatus !== VisibilityStatus.CLIENT_VISIBLE) {
    return {
      allowed: false,
      fields: ["title", "status"],
      reasonCode: "Operational_CLIENT_SAFE_EVIDENCE_UNRELEASED",
    };
  }

  return {
    allowed: true,
    fields: ["title", "status", "summary"],
    summary: record.summary,
    title: record.title,
  };
}

export async function rejectOperationalEvidence(
  prisma: PrismaClient,
  input: {
    actorRoleKey: DemoRoleKey;
    evidenceRecordId: string;
    reason: string;
    tenantSlug: DemoTenantSlug;
  },
) {
  requireReason(input.reason);
  assertComplianceRole(input.actorRoleKey);
  const session = requireDemoSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const evidence = await prisma.evidenceRecord.findFirst({
    where: { clientTenantId: session.tenant.id, id: input.evidenceRecordId },
  });

  if (!evidence) {
    throw new OperationalStage3ValidationError(["evidence_scope_required"]);
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.evidenceRecord.update({
      data: {
        status: EvidenceStatus.RESTRICTED,
        summary: `Rejected evidence: ${input.reason}`,
        visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
      },
      where: { id: evidence.id },
    });
    const item = await tx.evidenceItem.create({
      data: {
        evidenceRecordId: evidence.id,
        itemType: "operational_stage3_evidence_rejection",
        sourceObjectId: evidence.relatedObjectId,
        sourceObjectType: evidence.relatedObjectType,
        title: "Evidence rejected with reviewer reason",
        visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
      },
    });
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: session.tenant.id,
        eventType: "operational.evidence.rejected",
        evidenceRecordId: evidence.id,
        metadataJson: metadata({ evidenceItemId: item.id, rejectedByRoleKey: session.role.key }),
        nextState: updated.status,
        platformTenantId: demoPlatformTenantId,
        previousState: evidence.status,
        reason: input.reason,
        result: AuditResult.BLOCKED,
        targetId: evidence.id,
        targetType: ObjectType.EVIDENCE_RECORD,
      },
    });

    return {
      auditEventId: audit.id,
      evidenceItemId: item.id,
      evidenceRecordId: updated.id,
      gateSupport: false,
      lifecycleState: lifecycleStateForEvidence(updated.status),
    };
  });
}

export async function rerequestOperationalEvidenceAfterRejection(
  prisma: PrismaClient,
  input: {
    actorRoleKey: DemoRoleKey;
    originalEvidenceRecordId: string;
    reason: string;
    tenantSlug: DemoTenantSlug;
  },
) {
  requireReason(input.reason);
  assertComplianceRole(input.actorRoleKey);
  const session = requireDemoSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const original = await prisma.evidenceRecord.findFirst({
    where: { clientTenantId: session.tenant.id, id: input.originalEvidenceRecordId },
  });

  if (!original) {
    throw new OperationalStage3ValidationError(["evidence_scope_required"]);
  }

  if (original.status !== EvidenceStatus.RESTRICTED) {
    throw new OperationalStage3ValidationError(["rejected_evidence_required"]);
  }

  return prisma.$transaction(async (tx) => {
    const followUp = await tx.evidenceRecord.create({
      data: {
        clientTenantId: session.tenant.id,
        createdByUserId: session.actor.id,
        relatedObjectId: original.relatedObjectId,
        relatedObjectType: original.relatedObjectType,
        status: EvidenceStatus.PLACEHOLDER,
        summary: input.reason,
        title: `Follow-up request for ${original.title}`,
        visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
      },
    });
    const item = await tx.evidenceItem.create({
      data: {
        evidenceRecordId: followUp.id,
        itemType: "operational_stage3_evidence_re_request",
        sourceObjectId: original.id,
        sourceObjectType: ObjectType.EVIDENCE_RECORD,
        title: "Follow-up evidence request after rejection",
        visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
      },
    });
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: session.tenant.id,
        eventType: "operational.evidence.re_requested",
        evidenceRecordId: followUp.id,
        metadataJson: metadata({ evidenceItemId: item.id, originalEvidenceRecordId: original.id }),
        nextState: EvidenceStatus.PLACEHOLDER,
        platformTenantId: demoPlatformTenantId,
        previousState: original.status,
        reason: input.reason,
        result: AuditResult.PENDING,
        targetId: followUp.id,
        targetType: ObjectType.EVIDENCE_RECORD,
      },
    });

    return {
      auditEventId: audit.id,
      followUpEvidenceRecordId: followUp.id,
      originalEvidenceRecordId: original.id,
      originalLifecycleState: lifecycleStateForEvidence(original.status),
      reRequestLifecycleState: lifecycleStateForEvidence(followUp.status),
    };
  });
}

export function certifyOperationalEvidenceExit(input: {
  lifecycleStates: OperationalEvidenceLifecycleState[];
  negativeProofs: string[];
  ticketIds: string[];
}) {
  const requiredProofs = [
    "request_not_sufficient",
    "failed_request_no_advance",
    "unlinked_never_unlocks",
    "rejected_never_unlocks",
    "rerequest_preserves_rejection",
    "upload_only_never_releases",
  ];

  return {
    missingProofs: requiredProofs.filter((proof) => !input.negativeProofs.includes(proof)),
    stage: "PH3",
    ready:
      input.ticketIds.length >= 12 &&
      requiredProofs.every((proof) => input.negativeProofs.includes(proof)) &&
      !input.lifecycleStates.includes("closed_history"),
  };
}
