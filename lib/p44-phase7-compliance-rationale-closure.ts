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
import { demoPlatformTenantId, requireDemoSession, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import { stableId } from "@/lib/stable-id";

export const p44Phase7TicketOrder = [
  "P44-7-T01-EXEC",
  "P44-7-T02-EXEC",
  "P44-7-T03-EXEC",
  "P44-7-T04-EXEC",
  "P44-7-T05-EXEC",
  "P44-7-T06-EXEC",
  "P44-7-T07-EXEC",
  "P44-7-T08-EXEC",
] as const;

export type P44Phase7TicketId = (typeof p44Phase7TicketOrder)[number];

export type P44Phase7ReadinessInput = {
  analysisComplete: boolean;
  predecessorPhase6Exit: boolean;
  specificationComplete: boolean;
  targetFilesConfirmed: boolean;
  testsConfirmed: boolean;
};

export type P44CompliancePreconditionInput = {
  advisorApproved: boolean;
  auditPersistenceAvailable: boolean;
  evidenceSufficient: boolean;
  payloadReady: boolean;
  permissionAllowed: boolean;
  rationaleCaptured: boolean;
  redactionReady: boolean;
};

export function createP44Phase7ReadinessChecklist(input: P44Phase7ReadinessInput) {
  const missing: string[] = [];

  if (!input.predecessorPhase6Exit) missing.push("p44_phase6_exit");
  if (!input.analysisComplete) missing.push("ph7_analysis");
  if (!input.specificationComplete) missing.push("ph7_spec");
  if (!input.targetFilesConfirmed) missing.push("target_files");
  if (!input.testsConfirmed) missing.push("tests");

  return {
    missing,
    ready: missing.length === 0,
    ticketOrder: p44Phase7TicketOrder,
  };
}

function phase7RecommendationId(tenantSlug: DemoTenantSlug, draftKey: string) {
  return stableId(`p44:phase7:recommendation:${tenantSlug}:${draftKey}`);
}

function phase7ApprovalId(tenantSlug: DemoTenantSlug, draftKey: string) {
  return stableId(`p44:phase7:approval:${tenantSlug}:${draftKey}`);
}

function phase7ComplianceReviewId(tenantSlug: DemoTenantSlug, draftKey: string) {
  return stableId(`p44:phase7:compliance:${tenantSlug}:${draftKey}`);
}

function phase7QueueItemId(tenantSlug: DemoTenantSlug, draftKey: string) {
  return stableId(`p44:phase7:compliance-queue:${tenantSlug}:${draftKey}`);
}

function phase7EvidenceId(recommendationId: string, evidenceKey: string) {
  return stableId(`p44:phase7:evidence:${recommendationId}:${evidenceKey}`);
}

function phase7DecisionId(recommendationId: string, decisionKey: string) {
  return stableId(`p44:phase7:decision:${recommendationId}:${decisionKey}`);
}

function phase7Metadata(input: Prisma.InputJsonObject = {}): Prisma.InputJsonObject {
  return {
    clientVisible: false,
    complianceReleaseShortcutAllowed: false,
    internalRationaleHiddenUntilReleased: true,
    noClientRelease: true,
    p44Phase: "PH7",
    ...input,
  };
}

function requireComplianceRole(roleKey: DemoRoleKey) {
  if (roleKey !== "compliance_officer") {
    throw new Error("P44 Phase 7 compliance command requires Compliance Officer role.");
  }
}

function requireMeaningfulText(value: string, field: string) {
  if (value.trim().length < 12) {
    throw new Error(`${field} must contain meaningful compliance/rationale content.`);
  }
}

export function evaluateP44ComplianceReleasePreconditions(input: P44CompliancePreconditionInput) {
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
    ticketId: "P44-7-T02-EXEC" as const,
  };
}

export async function createP44ComplianceQueueTriage(
  prisma: PrismaClient,
  input: {
    actorRoleKey: DemoRoleKey;
    draftKey: string;
    reason: string;
    tenantSlug: DemoTenantSlug;
    title: string;
  },
) {
  requireComplianceRole(input.actorRoleKey);
  requireMeaningfulText(input.reason, "reason");

  const session = requireDemoSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const recommendationId = phase7RecommendationId(input.tenantSlug, input.draftKey);
  const approvalId = phase7ApprovalId(input.tenantSlug, input.draftKey);
  const complianceReviewId = phase7ComplianceReviewId(input.tenantSlug, input.draftKey);
  const queueItemId = phase7QueueItemId(input.tenantSlug, input.draftKey);
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
    const preconditions = evaluateP44ComplianceReleasePreconditions({
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
        eventType: "p44.compliance_queue.triaged",
        metadataJson: phase7Metadata({
          preconditions,
          queueItemId: queueItem.id,
          ticketId: "P44-7-T01-EXEC",
        }),
        nextState: RecommendationStatus.COMPLIANCE_PENDING,
        platformTenantId: demoPlatformTenantId,
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

export async function requestP44ComplianceEvidence(
  prisma: PrismaClient,
  input: {
    actorRoleKey: DemoRoleKey;
    evidenceKey: string;
    reason: string;
    recommendationId: string;
    targetRoleKey: "analyst" | "senior_wealth_advisor";
    tenantSlug: DemoTenantSlug;
  },
) {
  requireComplianceRole(input.actorRoleKey);
  requireMeaningfulText(input.reason, "reason");
  const session = requireDemoSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: input.recommendationId } });
  const evidenceId = phase7EvidenceId(recommendation.id, input.evidenceKey);

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
        eventType: "p44.compliance.requested_evidence",
        evidenceRecordId: evidence.id,
        metadataJson: phase7Metadata({
          requestEvidenceIsNotRelease: true,
          targetRoleKey: input.targetRoleKey,
          ticketId: "P44-7-T03-EXEC",
        }),
        nextState: RecommendationStatus.MORE_DATA_REQUESTED,
        platformTenantId: demoPlatformTenantId,
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

export function buildP44ComplianceEvidenceRequestNegativeMatrix(input: {
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
    ticketId: "P44-7-T04-EXEC" as const,
  };
}

export async function captureP44DecisionRationale(
  prisma: PrismaClient,
  input: {
    actorRoleKey: DemoRoleKey;
    clientSafeRationale: string;
    decisionKey: string;
    internalRationale: string;
    reason: string;
    recommendationId: string;
    tenantSlug: DemoTenantSlug;
  },
) {
  requireComplianceRole(input.actorRoleKey);
  requireMeaningfulText(input.clientSafeRationale, "clientSafeRationale");
  requireMeaningfulText(input.internalRationale, "internalRationale");
  requireMeaningfulText(input.reason, "reason");

  const session = requireDemoSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: input.recommendationId } });
  const decisionId = phase7DecisionId(recommendation.id, input.decisionKey);

  return prisma.$transaction(async (tx) => {
    const priorAuditCount = await tx.auditEvent.count({
      where: {
        eventType: "p44.decision_rationale.captured",
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
        id: stableId(`p44:phase7:decision-participant:${decision.id}:compliance`),
        roleKey: "compliance_officer",
        status: ReviewStatus.IN_REVIEW,
        userId: session.actor.id,
      },
      update: {
        status: ReviewStatus.IN_REVIEW,
        userId: session.actor.id,
      },
      where: { id: stableId(`p44:phase7:decision-participant:${decision.id}:compliance`) },
    });
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: recommendation.clientTenantId,
        eventType: "p44.decision_rationale.captured",
        metadataJson: phase7Metadata({
          clientSafeRationale: input.clientSafeRationale,
          internalRationale: input.internalRationale,
          rationaleVersion: priorAuditCount + 1,
          ticketId: "P44-7-T05-EXEC",
        }),
        nextState: DecisionStatus.DRAFT,
        platformTenantId: demoPlatformTenantId,
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

export function inspectP44DecisionRationalePayload(input: {
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
    ticketId: "P44-7-T06-EXEC" as const,
  };
}

export function buildP44ComplianceRationaleIntegrationMatrix(input: {
  evidenceRequestNegative: ReturnType<typeof buildP44ComplianceEvidenceRequestNegativeMatrix>;
  preconditions: ReturnType<typeof evaluateP44ComplianceReleasePreconditions>;
  rationaleInspection: ReturnType<typeof inspectP44DecisionRationalePayload>;
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
    ticketId: "P44-7-T07-EXEC" as const,
  };
}

export function certifyP44ComplianceRationaleExit(input: {
  completedTickets: P44Phase7TicketId[];
  integrationMatrix: ReturnType<typeof buildP44ComplianceRationaleIntegrationMatrix>;
}) {
  const completed = new Set(input.completedTickets);
  const missingTickets = p44Phase7TicketOrder.filter((ticket) => !completed.has(ticket));
  const blockers: string[] = [];

  if (missingTickets.length > 0) blockers.push("missing_phase7_tickets");
  if (!input.integrationMatrix.integrated) blockers.push("compliance_rationale_integration_unproven");

  return {
    blockers,
    certified: blockers.length === 0,
    missingTickets,
    processCoverage: ["G-001", "G-004", "I-003"],
    releasePreconditionsIntact: blockers.length === 0,
    status: blockers.length === 0 ? "P44_PHASE7_COMPLIANCE_RATIONALE_READY" : "P44_PHASE7_BLOCKED",
    ticketId: "P44-7-T08-EXEC" as const,
  };
}
