import {
  AdviceClassification,
  AuditResult,
  ComplianceStatus,
  DecisionStatus,
  EvidenceStatus,
  ObjectType,
  Prisma,
  type PrismaClient,
  RecommendationStatus,
  ReviewStatus,
  VisibilityStatus,
  WorkflowStatus,
} from "@prisma/client";

import { requireActorContext } from "@/lib/control-layer/actor-context";
import { evaluateControlPermission } from "@/lib/control-layer/permission-decision";
import { resolveTenantObjectScope } from "@/lib/control-layer/scope-resolver";
import { actorPlatformTenantId, requireActorSession, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { stableId } from "@/lib/stable-id";

export const operationalStage7TicketOrder = [
  "Operational-7-T01-EXEC",
  "Operational-7-T02-EXEC",
  "Operational-7-T03-EXEC",
  "Operational-7-T04-EXEC",
  "Operational-7-T05-EXEC",
  "Operational-7-T06-EXEC",
  "Operational-7-T07-EXEC",
  "Operational-7-T08-EXEC",
] as const;

export type OperationalStage7TicketId = (typeof operationalStage7TicketOrder)[number];

export type OperationalStage7ReadinessInput = {
  analysisComplete: boolean;
  predecessorStage6Exit: boolean;
  specificationComplete: boolean;
  targetFilesConfirmed: boolean;
  testsConfirmed: boolean;
};

export type OperationalCompliancePreconditionInput = {
  advisorApproved: boolean;
  auditPersistenceAvailable: boolean;
  evidenceSufficient: boolean;
  payloadReady: boolean;
  permissionAllowed: boolean;
  rationaleCaptured: boolean;
  redactionReady: boolean;
};

export function createOperationalStage7ReadinessChecklist(input: OperationalStage7ReadinessInput) {
  const missing: string[] = [];

  if (!input.predecessorStage6Exit) missing.push("operational_stage6_exit");
  if (!input.analysisComplete) missing.push("ph7_analysis");
  if (!input.specificationComplete) missing.push("ph7_spec");
  if (!input.targetFilesConfirmed) missing.push("target_files");
  if (!input.testsConfirmed) missing.push("tests");

  return {
    missing,
    ready: missing.length === 0,
    ticketOrder: operationalStage7TicketOrder,
  };
}

function stage7RecommendationId(tenantSlug: ActorTenantSlug, draftKey: string) {
  return stableId(`operational:stage7:recommendation:${tenantSlug}:${draftKey}`);
}

function stage7ApprovalId(tenantSlug: ActorTenantSlug, draftKey: string) {
  return stableId(`operational:stage7:approval:${tenantSlug}:${draftKey}`);
}

function stage7ComplianceReviewId(tenantSlug: ActorTenantSlug, draftKey: string) {
  return stableId(`operational:stage7:compliance:${tenantSlug}:${draftKey}`);
}

function stage7QueueItemId(tenantSlug: ActorTenantSlug, draftKey: string) {
  return stableId(`operational:stage7:compliance-queue:${tenantSlug}:${draftKey}`);
}

function stage7EvidenceId(recommendationId: string, evidenceKey: string) {
  return stableId(`operational:stage7:evidence:${recommendationId}:${evidenceKey}`);
}

function stage7DecisionId(recommendationId: string, decisionKey: string) {
  return stableId(`operational:stage7:decision:${recommendationId}:${decisionKey}`);
}

function stage7Metadata(input: Prisma.InputJsonObject = {}): Prisma.InputJsonObject {
  return {
    clientVisible: false,
    complianceReleaseShortcutAllowed: false,
    internalRationaleHiddenUntilReleased: true,
    noClientRelease: true,
    operationalStage: "PH7",
    ...input,
  };
}

function requireComplianceRole(roleKey: ActorRoleKey) {
  if (roleKey !== "compliance_officer") {
    throw new Error("Operational Stage 7 compliance command requires Compliance Officer role.");
  }
}

function requireMeaningfulText(value: string, field: string) {
  if (value.trim().length < 12) {
    throw new Error(`${field} must contain meaningful compliance/rationale content.`);
  }
}

export function evaluateOperationalComplianceReleasePreconditions(input: OperationalCompliancePreconditionInput) {
  const missing: string[] = [];

  if (!input.advisorApproved) missing.push("advisor_approval");
  if (!input.evidenceSufficient) missing.push("evidence_sufficiency");
  if (!input.auditPersistenceAvailable) missing.push("audit_persistence");
  if (!input.redactionReady) missing.push("redaction_ready");
  if (!input.rationaleCaptured) missing.push("decision_rationale");
  if (!input.payloadReady) missing.push("payload_ready");
  if (!input.permissionAllowed) missing.push("permission_check");

  return {
    canRelease: missing.length === 0,
    disabled: missing.length > 0,
    missing,
    ticketId: "Operational-7-T02-EXEC" as const,
  };
}

export async function createOperationalComplianceQueueTriage(
  prisma: PrismaClient,
  input: {
    actorRoleKey: ActorRoleKey;
    draftKey: string;
    reason: string;
    tenantSlug: ActorTenantSlug;
    title: string;
  },
) {
  requireComplianceRole(input.actorRoleKey);
  requireMeaningfulText(input.reason, "reason");

  const session = requireActorSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const recommendationId = stage7RecommendationId(input.tenantSlug, input.draftKey);
  const approvalId = stage7ApprovalId(input.tenantSlug, input.draftKey);
  const complianceReviewId = stage7ComplianceReviewId(input.tenantSlug, input.draftKey);
  const queueItemId = stage7QueueItemId(input.tenantSlug, input.draftKey);
  const actorContext = requireActorContext({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });

  return prisma.$transaction(async (tx) => {
    const previousRecommendation = await tx.recommendation.findUnique({ where: { id: recommendationId } });
    const recommendation = await tx.recommendation.upsert({
      create: {
        adviceClassification: AdviceClassification.ADVICE_RELEVANT,
        clientTenantId: session.tenant.id,
        clientVisible: false,
        createdByUserId: session.actor.id,
        id: recommendationId,
        riskSummary: "Compliance queue item. Queue visibility is not release permission.",
        status: RecommendationStatus.COMPLIANCE_PENDING,
        summaryInternal: "Compliance must verify evidence, audit, redaction and rationale before release.",
        title: input.title,
      },
      update: {
        clientVisible: false,
        riskSummary: "Compliance queue item. Queue visibility is not release permission.",
        status: RecommendationStatus.COMPLIANCE_PENDING,
        summaryInternal: "Compliance must verify evidence, audit, redaction and rationale before release.",
        title: input.title,
      },
      where: { id: recommendationId },
    });

    await tx.approval.upsert({
      create: {
        approvalType: "advisor",
        approverRoleKey: "senior_wealth_advisor",
        approverUserId: session.actor.id,
        approvedAt: new Date(),
        clientTenantId: session.tenant.id,
        id: approvalId,
        notes: "Advisor review exit accepted for compliance queue evaluation.",
        status: ReviewStatus.APPROVED,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
      update: {
        approvedAt: new Date(),
        notes: "Advisor review exit accepted for compliance queue evaluation.",
        status: ReviewStatus.APPROVED,
      },
      where: { id: approvalId },
    });

    await tx.complianceReview.upsert({
      create: {
        adviceClassification: AdviceClassification.ADVICE_RELEVANT,
        clientTenantId: session.tenant.id,
        evidenceComplete: false,
        id: complianceReviewId,
        recordOfAdviceRequired: true,
        releaseNotes: "Release blocked until evidence, audit, redaction and rationale preconditions pass.",
        reviewerUserId: session.actor.id,
        status: ComplianceStatus.PENDING,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
      update: {
        evidenceComplete: false,
        releaseNotes: "Release blocked until evidence, audit, redaction and rationale preconditions pass.",
        releasedAt: null,
        status: ComplianceStatus.PENDING,
      },
      where: { id: complianceReviewId },
    });

    const queueItem = await tx.queueItem.upsert({
      create: {
        assignedRoleKey: "compliance_officer",
        assignedToUserId: session.actor.id,
        clientTenantId: session.tenant.id,
        escalated: false,
        id: queueItemId,
        priority: "critical",
        queueName: "compliance_release",
        status: WorkflowStatus.COMPLIANCE_PENDING,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
      update: {
        assignedRoleKey: "compliance_officer",
        assignedToUserId: session.actor.id,
        escalated: false,
        priority: "critical",
        status: WorkflowStatus.COMPLIANCE_PENDING,
      },
      where: { id: queueItemId },
    });

    const scope = resolveTenantObjectScope(actorContext, {
      allowedObjectIds: [recommendation.id],
      clientTenantId: recommendation.clientTenantId,
      objectId: recommendation.id,
      objectType: "RECOMMENDATION",
      requireObjectScope: true,
    });
    const permission = scope.allowed
      ? evaluateControlPermission({
          action: "RELEASE",
          actorContext,
          objectScope: scope.objectScope,
          subject: {
            clientTenantId: recommendation.clientTenantId,
            objectId: recommendation.id,
            objectType: "RECOMMENDATION",
            sensitivity: "CONFIDENTIAL",
            visibilityStatus: "COMPLIANCE_VISIBLE",
            workflowState: "COMPLIANCE_PENDING",
          },
        })
      : null;
    const preconditions = evaluateOperationalComplianceReleasePreconditions({
      advisorApproved: true,
      auditPersistenceAvailable: true,
      evidenceSufficient: false,
      payloadReady: false,
      permissionAllowed: permission?.allowed ?? false,
      rationaleCaptured: false,
      redactionReady: false,
    });
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: recommendation.clientTenantId,
        eventType: "operational.compliance_queue.triaged",
        metadataJson: stage7Metadata({
          preconditions,
          queueItemId: queueItem.id,
          ticketId: "Operational-7-T01-EXEC",
        }),
        nextState: RecommendationStatus.COMPLIANCE_PENDING,
        platformTenantId: actorPlatformTenantId,
        previousState: previousRecommendation?.status,
        reason: input.reason,
        result: AuditResult.PENDING,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
    });

    return {
      auditEventId: audit.id,
      clientVisible: recommendation.clientVisible,
      complianceReviewId,
      preconditions,
      queueItemId: queueItem.id,
      queueStatus: queueItem.status,
      recommendationId: recommendation.id,
      releasePermissionVisible: permission?.allowed ?? false,
      status: recommendation.status,
    };
  });
}

export async function requestOperationalComplianceEvidence(
  prisma: PrismaClient,
  input: {
    actorRoleKey: ActorRoleKey;
    evidenceKey: string;
    reason: string;
    recommendationId: string;
    targetRoleKey: "analyst" | "senior_wealth_advisor";
    tenantSlug: ActorTenantSlug;
  },
) {
  requireComplianceRole(input.actorRoleKey);
  requireMeaningfulText(input.reason, "reason");
  const session = requireActorSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: input.recommendationId } });
  const evidenceId = stage7EvidenceId(recommendation.id, input.evidenceKey);

  return prisma.$transaction(async (tx) => {
    const evidence = await tx.evidenceRecord.upsert({
      create: {
        clientTenantId: recommendation.clientTenantId,
        createdByUserId: session.actor.id,
        id: evidenceId,
        relatedObjectId: recommendation.id,
        relatedObjectType: ObjectType.RECOMMENDATION,
        status: EvidenceStatus.PLACEHOLDER,
        summary: input.reason,
        title: "Compliance requested evidence",
        visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
      },
      update: {
        relatedObjectId: recommendation.id,
        relatedObjectType: ObjectType.RECOMMENDATION,
        status: EvidenceStatus.PLACEHOLDER,
        summary: input.reason,
        visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
      },
      where: { id: evidenceId },
    });

    await tx.complianceReview.updateMany({
      data: {
        blockedAt: new Date(),
        evidenceComplete: false,
        releaseNotes: input.reason,
        releasedAt: null,
        status: ComplianceStatus.NEEDS_EVIDENCE,
      },
      where: { targetId: recommendation.id, targetType: ObjectType.RECOMMENDATION },
    });
    await tx.recommendation.update({
      data: {
        clientVisible: false,
        status: RecommendationStatus.MORE_DATA_REQUESTED,
      },
      where: { id: recommendation.id },
    });
    await tx.queueItem.updateMany({
      data: {
        assignedRoleKey: input.targetRoleKey,
        status: WorkflowStatus.AWAITING_INFO,
      },
      where: { targetId: recommendation.id, targetType: ObjectType.RECOMMENDATION },
    });
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: recommendation.clientTenantId,
        eventType: "operational.compliance.requested_evidence",
        evidenceRecordId: evidence.id,
        metadataJson: stage7Metadata({
          requestEvidenceIsNotRelease: true,
          targetRoleKey: input.targetRoleKey,
          ticketId: "Operational-7-T03-EXEC",
        }),
        nextState: RecommendationStatus.MORE_DATA_REQUESTED,
        platformTenantId: actorPlatformTenantId,
        previousState: recommendation.status,
        reason: input.reason,
        result: AuditResult.BLOCKED,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
    });

    return {
      auditEventId: audit.id,
      clientVisible: false,
      complianceStatus: ComplianceStatus.NEEDS_EVIDENCE,
      evidenceId: evidence.id,
      releaseBlocked: true,
      status: RecommendationStatus.MORE_DATA_REQUESTED,
    };
  });
}

export function buildOperationalComplianceEvidenceRequestNegativeMatrix(input: {
  adminOverrideAttempted: boolean;
  advisorOverrideAttempted: boolean;
  complianceStatus: ComplianceStatus | string;
  evidenceStatus: EvidenceStatus | string;
  recommendationClientVisible: boolean;
  releasedAt: Date | null;
}) {
  const rows = [
    {
      caseId: "request_blocks_release_until_sufficiency",
      passed:
        input.complianceStatus === ComplianceStatus.NEEDS_EVIDENCE &&
        input.evidenceStatus === EvidenceStatus.PLACEHOLDER &&
        input.releasedAt === null,
    },
    {
      caseId: "request_hidden_from_client_projection",
      passed: !input.recommendationClientVisible,
    },
    {
      caseId: "admin_advisor_override_denied",
      passed: !input.adminOverrideAttempted && !input.advisorOverrideAttempted,
    },
  ];

  return {
    allNegativeCasesCovered: rows.every((row) => row.passed),
    rows,
    ticketId: "Operational-7-T04-EXEC" as const,
  };
}

export async function captureOperationalDecisionRationale(
  prisma: PrismaClient,
  input: {
    actorRoleKey: ActorRoleKey;
    clientSafeRationale: string;
    decisionKey: string;
    internalRationale: string;
    reason: string;
    recommendationId: string;
    tenantSlug: ActorTenantSlug;
  },
) {
  requireComplianceRole(input.actorRoleKey);
  requireMeaningfulText(input.clientSafeRationale, "clientSafeRationale");
  requireMeaningfulText(input.internalRationale, "internalRationale");
  requireMeaningfulText(input.reason, "reason");

  const session = requireActorSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: input.recommendationId } });
  const decisionId = stage7DecisionId(recommendation.id, input.decisionKey);

  return prisma.$transaction(async (tx) => {
    const priorAuditCount = await tx.auditEvent.count({
      where: {
        eventType: "operational.decision_rationale.captured",
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
    });
    const decision = await tx.decision.upsert({
      create: {
        clientTenantId: recommendation.clientTenantId,
        decisionByUserId: session.actor.id,
        decisionReason: input.clientSafeRationale,
        decisionAction: "COMPLIANCE_RATIONALE_CAPTURED",
        id: decisionId,
        recommendationId: recommendation.id,
        status: DecisionStatus.DRAFT,
        title: "Compliance decision rationale",
      },
      update: {
        decisionByUserId: session.actor.id,
        decisionReason: input.clientSafeRationale,
        decisionAction: "COMPLIANCE_RATIONALE_CAPTURED",
        status: DecisionStatus.DRAFT,
        title: "Compliance decision rationale",
      },
      where: { id: decisionId },
    });
    await tx.decisionParticipant.upsert({
      create: {
        decisionId: decision.id,
        id: stableId(`operational:stage7:decision-participant:${decision.id}:compliance`),
        roleKey: "compliance_officer",
        status: ReviewStatus.IN_REVIEW,
        userId: session.actor.id,
      },
      update: {
        status: ReviewStatus.IN_REVIEW,
        userId: session.actor.id,
      },
      where: { id: stableId(`operational:stage7:decision-participant:${decision.id}:compliance`) },
    });
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: recommendation.clientTenantId,
        eventType: "operational.decision_rationale.captured",
        metadataJson: stage7Metadata({
          clientSafeRationale: input.clientSafeRationale,
          internalRationale: input.internalRationale,
          rationaleVersion: priorAuditCount + 1,
          ticketId: "Operational-7-T05-EXEC",
        }),
        nextState: DecisionStatus.DRAFT,
        platformTenantId: actorPlatformTenantId,
        previousState: null,
        reason: input.reason,
        result: AuditResult.PENDING,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
    });

    return {
      auditEventId: audit.id,
      clientSafeRationale: decision.decisionReason,
      decisionId: decision.id,
      internalRationaleClientVisible: false,
      rationaleVersion: priorAuditCount + 1,
      status: decision.status,
    };
  });
}

export function inspectOperationalDecisionRationalePayload(input: {
  auditWritten: boolean;
  clientPayload: Record<string, unknown>;
  exportPayload: Record<string, unknown>;
}) {
  const forbiddenFields = ["internalRationale", "complianceNotes", "auditMetadata", "assumptionsJson"];
  const clientForbiddenFields = forbiddenFields.filter((field) => field in input.clientPayload);
  const exportForbiddenFields = forbiddenFields.filter((field) => field in input.exportPayload);

  return {
    auditWritten: input.auditWritten,
    cleanForClient: clientForbiddenFields.length === 0,
    cleanForExport: exportForbiddenFields.length === 0,
    clientForbiddenFields,
    exportForbiddenFields,
    ticketId: "Operational-7-T06-EXEC" as const,
  };
}

export function buildOperationalComplianceRationaleIntegrationMatrix(input: {
  evidenceRequestNegative: ReturnType<typeof buildOperationalComplianceEvidenceRequestNegativeMatrix>;
  preconditions: ReturnType<typeof evaluateOperationalComplianceReleasePreconditions>;
  rationaleInspection: ReturnType<typeof inspectOperationalDecisionRationalePayload>;
}) {
  const rows = [
    {
      caseId: "compliance_request_integrates_with_release_guard",
      passed: input.evidenceRequestNegative.allNegativeCasesCovered && input.preconditions.disabled,
    },
    {
      caseId: "rationale_payload_integrates_with_decision_record",
      passed:
        input.rationaleInspection.auditWritten &&
        input.rationaleInspection.cleanForClient &&
        input.rationaleInspection.cleanForExport,
    },
    {
      caseId: "missing_rationale_or_evidence_cannot_release_silently",
      passed: input.preconditions.missing.includes("evidence_sufficiency") || input.preconditions.missing.includes("decision_rationale"),
    },
  ];

  return {
    integrated: rows.every((row) => row.passed),
    rows,
    ticketId: "Operational-7-T07-EXEC" as const,
  };
}

export function certifyOperationalComplianceRationaleExit(input: {
  completedTickets: OperationalStage7TicketId[];
  integrationMatrix: ReturnType<typeof buildOperationalComplianceRationaleIntegrationMatrix>;
}) {
  const completed = new Set(input.completedTickets);
  const missingTickets = operationalStage7TicketOrder.filter((ticket) => !completed.has(ticket));
  const blockers: string[] = [];

  if (missingTickets.length > 0) blockers.push("missing_stage7_tickets");
  if (!input.integrationMatrix.integrated) blockers.push("compliance_rationale_integration_unproven");

  return {
    blockers,
    certified: blockers.length === 0,
    missingTickets,
    processCoverage: ["G-001", "G-004", "I-003"],
    releasePreconditionsIntact: blockers.length === 0,
    status: blockers.length === 0 ? "Operational_PHASE7_COMPLIANCE_RATIONALE_READY" : "Operational_PHASE7_BLOCKED",
    ticketId: "Operational-7-T08-EXEC" as const,
  };
}
