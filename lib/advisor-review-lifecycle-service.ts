import {
  AdviceClassification,
  AuditResult,
  ComplianceStatus,
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
import { evaluateControlPermission, type ControlPermissionDecision } from "@/lib/control-layer/permission-decision";
import { resolveTenantObjectScope } from "@/lib/control-layer/scope-resolver";
import { actorPlatformTenantId, requireActorSession, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { stableId } from "@/lib/stable-id";

export const operationalStage6TicketOrder = [
  "Operational-6-T01-EXEC",
  "Operational-6-T02-EXEC",
  "Operational-6-T03-EXEC",
  "Operational-6-T04-EXEC",
  "Operational-6-T05-EXEC",
  "Operational-6-T06-EXEC",
  "Operational-6-T07-EXEC",
  "Operational-6-T08-EXEC",
  "Operational-6-T09-EXEC",
  "Operational-6-T10-EXEC",
] as const;

export type OperationalStage6TicketId = (typeof operationalStage6TicketOrder)[number];

export type OperationalStage6ReadinessInput = {
  analysisComplete: boolean;
  predecessorStage5Exit: boolean;
  specificationComplete: boolean;
  targetFilesConfirmed: boolean;
  testsConfirmed: boolean;
};

export function createOperationalStage6ReadinessChecklist(input: OperationalStage6ReadinessInput) {
  const missing: string[] = [];

  if (!input.predecessorStage5Exit) missing.push("operational_stage5_exit");
  if (!input.analysisComplete) missing.push("ph6_analysis");
  if (!input.specificationComplete) missing.push("ph6_spec");
  if (!input.targetFilesConfirmed) missing.push("target_files");
  if (!input.testsConfirmed) missing.push("tests");

  return {
    missing,
    ready: missing.length === 0,
    ticketOrder: operationalStage6TicketOrder,
  };
}

export type OperationalAdvisorReviewInput = {
  actorRoleKey: ActorRoleKey;
  draftKey: string;
  internalRationale: string;
  reason: string;
  sourceRefs: string[];
  tenantSlug: ActorTenantSlug;
  title: string;
};

export type OperationalOptionInput = {
  cons: string[];
  description: string;
  evidenceSummary: string;
  label: string;
  optionKey: string;
  pros: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
};

export type OperationalAdvisorFeedbackLifecycle =
  | "loading"
  | "validation"
  | "success"
  | "error"
  | "blocked"
  | "retry";

function stage6RecommendationId(tenantSlug: ActorTenantSlug, draftKey: string) {
  return stableId(`operational:stage6:recommendation:${tenantSlug}:${draftKey}`);
}

function stage6ApprovalId(tenantSlug: ActorTenantSlug, draftKey: string) {
  return stableId(`operational:stage6:approval:${tenantSlug}:${draftKey}`);
}

function stage6ComplianceReviewId(tenantSlug: ActorTenantSlug, draftKey: string) {
  return stableId(`operational:stage6:compliance:${tenantSlug}:${draftKey}`);
}

function stage6QueueItemId(tenantSlug: ActorTenantSlug, draftKey: string) {
  return stableId(`operational:stage6:advisor-queue:${tenantSlug}:${draftKey}`);
}

function stage6OptionId(recommendationId: string, optionKey: string) {
  return stableId(`operational:stage6:option:${recommendationId}:${optionKey}`);
}

function stage6EvidenceId(recommendationId: string, evidenceKey: string) {
  return stableId(`operational:stage6:evidence:${recommendationId}:${evidenceKey}`);
}

function stage6Metadata(input: Prisma.InputJsonObject = {}): Prisma.InputJsonObject {
  return {
    advisorReviewClosure: true,
    advisorReviewIsNotRelease: true,
    clientVisible: false,
    noClientRelease: true,
    operationalStage: "PH6",
    ...input,
  };
}

function requireAdvisorRole(roleKey: ActorRoleKey) {
  if (roleKey !== "senior_wealth_advisor") {
    throw new Error("Operational Stage 6 advisor review command requires Senior Wealth Advisor role.");
  }
}

function requireInternalRole(roleKey: ActorRoleKey) {
  if (!["analyst", "senior_wealth_advisor", "compliance_officer"].includes(roleKey)) {
    throw new Error("Operational Stage 6 read model requires an internal workflow role.");
  }
}

function requireMeaningfulText(value: string, field: string) {
  if (value.trim().length < 12) {
    throw new Error(`${field} must contain meaningful advisor-review content.`);
  }
}

function acceptedEvidenceStatus(status: EvidenceStatus) {
  return status === EvidenceStatus.VALIDATED || status === EvidenceStatus.RELEASED;
}

function evidenceIsScopedToRecommendation(
  record: {
    items: Array<{ sourceObjectId: string; sourceObjectType: ObjectType }>;
    relatedObjectId: string;
    relatedObjectType: ObjectType;
  },
  recommendationId: string,
) {
  return (
    (record.relatedObjectType === ObjectType.RECOMMENDATION && record.relatedObjectId === recommendationId) ||
    record.items.some(
      (item) => item.sourceObjectType === ObjectType.RECOMMENDATION && item.sourceObjectId === recommendationId,
    )
  );
}

export async function createOperationalAdvisorQueueTriage(prisma: PrismaClient, input: OperationalAdvisorReviewInput) {
  requireInternalRole(input.actorRoleKey);
  requireMeaningfulText(input.internalRationale, "internalRationale");
  requireMeaningfulText(input.reason, "reason");

  const session = requireActorSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const recommendationId = stage6RecommendationId(input.tenantSlug, input.draftKey);
  const approvalId = stage6ApprovalId(input.tenantSlug, input.draftKey);
  const complianceReviewId = stage6ComplianceReviewId(input.tenantSlug, input.draftKey);
  const queueItemId = stage6QueueItemId(input.tenantSlug, input.draftKey);

  return prisma.$transaction(async (tx) => {
    const previousRecommendation = await tx.recommendation.findUnique({ where: { id: recommendationId } });
    const recommendation = await tx.recommendation.upsert({
      create: {
        adviceClassification: AdviceClassification.ADVICE_RELEVANT,
        clientTenantId: session.tenant.id,
        clientVisible: false,
        createdByUserId: session.actor.id,
        id: recommendationId,
        riskSummary: "Advisor review in progress. Advisor action cannot release client visibility.",
        status: RecommendationStatus.ADVISOR_PENDING,
        summaryInternal: input.internalRationale,
        title: input.title,
      },
      update: {
        clientVisible: false,
        riskSummary: "Advisor review in progress. Advisor action cannot release client visibility.",
        status: RecommendationStatus.ADVISOR_PENDING,
        summaryInternal: input.internalRationale,
        title: input.title,
      },
      where: { id: recommendationId },
    });

    await tx.approval.upsert({
      create: {
        approvalType: "advisor",
        approverRoleKey: "senior_wealth_advisor",
        approverUserId: session.actor.id,
        clientTenantId: session.tenant.id,
        id: approvalId,
        notes: "Advisor queue triage pending.",
        status: ReviewStatus.IN_REVIEW,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
      update: {
        approvedAt: null,
        notes: "Advisor queue triage pending.",
        status: ReviewStatus.IN_REVIEW,
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
        releaseNotes: "Advisor review is not compliance release.",
        reviewerUserId: session.actor.id,
        status: ComplianceStatus.PENDING,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
      update: {
        evidenceComplete: false,
        releaseNotes: "Advisor review is not compliance release.",
        releasedAt: null,
        status: ComplianceStatus.PENDING,
      },
      where: { id: complianceReviewId },
    });

    const queueItem = await tx.queueItem.upsert({
      create: {
        assignedRoleKey: "senior_wealth_advisor",
        assignedToUserId: session.actor.id,
        clientTenantId: session.tenant.id,
        escalated: false,
        id: queueItemId,
        priority: "high",
        queueName: "advisor_approval",
        status: WorkflowStatus.ADVISOR_REVIEW,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
      update: {
        assignedRoleKey: "senior_wealth_advisor",
        assignedToUserId: session.actor.id,
        escalated: false,
        priority: "high",
        status: WorkflowStatus.ADVISOR_REVIEW,
      },
      where: { id: queueItemId },
    });

    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: session.tenant.id,
        eventType: "operational.advisor_queue.triaged",
        metadataJson: stage6Metadata({
          queueItemId: queueItem.id,
          sourceRefs: input.sourceRefs,
          ticketId: "Operational-6-T01-EXEC",
        }),
        nextState: RecommendationStatus.ADVISOR_PENDING,
        platformTenantId: actorPlatformTenantId,
        previousState: previousRecommendation?.status,
        reason: input.reason,
        result: AuditResult.PENDING,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
    });

    return {
      approvalId,
      auditEventId: audit.id,
      clientVisible: recommendation.clientVisible,
      complianceReviewId,
      queueItemId: queueItem.id,
      queueStatus: queueItem.status,
      recommendationId: recommendation.id,
      status: recommendation.status,
    };
  });
}

export async function evaluateOperationalAdvisorQueueScope(
  prisma: PrismaClient,
  input: {
    actorRoleKey: ActorRoleKey;
    allowedObjectIds?: string[];
    queueItemId: string;
    tenantSlug: ActorTenantSlug;
  },
) {
  requireInternalRole(input.actorRoleKey);
  const actorContext = requireActorContext({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const queueItem = await prisma.queueItem.findUniqueOrThrow({ where: { id: input.queueItemId } });
  const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: queueItem.targetId } });
  const scope = resolveTenantObjectScope(actorContext, {
    allowedObjectIds: input.allowedObjectIds ?? [recommendation.id],
    clientTenantId: recommendation.clientTenantId,
    objectId: recommendation.id,
    objectType: "RECOMMENDATION",
    requireObjectScope: true,
  });

  if (!scope.allowed) {
    return {
      allowedActions: [] as string[],
      canViewPayload: false,
      deniedReasonCode: scope.reasonCode,
      queueVisible: false,
      scopedRecommendationIds: [] as string[],
    };
  }

  const viewPermission = evaluateControlPermission({
    action: "VIEW",
    actorContext,
    objectScope: scope.objectScope,
    subject: {
      clientTenantId: recommendation.clientTenantId,
      objectId: recommendation.id,
      objectType: "RECOMMENDATION",
      sensitivity: "CONFIDENTIAL",
      visibilityStatus: "COMPLIANCE_VISIBLE",
      workflowState: "ADVISOR_REVIEW",
    },
  });
  const approvePermission = evaluateControlPermission({
    action: "APPROVE",
    actorContext,
    objectScope: scope.objectScope,
    subject: {
      clientTenantId: recommendation.clientTenantId,
      objectId: recommendation.id,
      objectType: "RECOMMENDATION",
      sensitivity: "CONFIDENTIAL",
      visibilityStatus: "COMPLIANCE_VISIBLE",
      workflowState: "ADVISOR_REVIEW",
    },
  });

  return {
    allowedActions: [viewPermission.allowed ? "VIEW" : null, approvePermission.allowed ? "APPROVE" : null].filter(
      Boolean,
    ) as string[],
    canViewPayload: viewPermission.allowed,
    deniedReasonCode: !viewPermission.allowed ? viewPermission.reasonCode : null,
    permissions: {
      approve: approvePermission,
      view: viewPermission,
    },
    queueVisible: viewPermission.allowed,
    scopedRecommendationIds: viewPermission.allowed ? [recommendation.id] : [],
  };
}

export async function createOperationalOptionComparison(
  prisma: PrismaClient,
  input: {
    actorRoleKey: ActorRoleKey;
    options: OperationalOptionInput[];
    reason: string;
    recommendationId: string;
    tenantSlug: ActorTenantSlug;
  },
) {
  requireAdvisorRole(input.actorRoleKey);
  requireMeaningfulText(input.reason, "reason");
  if (input.options.length < 2) {
    throw new Error("Option comparison requires at least two durable options.");
  }

  const session = requireActorSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: input.recommendationId } });

  return prisma.$transaction(async (tx) => {
    await tx.recommendation.update({
      data: {
        clientVisible: false,
        status: RecommendationStatus.ADVISOR_PENDING,
      },
      where: { id: recommendation.id },
    });

    const optionRows = [];
    const evidenceRows = [];
    for (const [index, option] of input.options.entries()) {
      const optionRow = await tx.recommendationOption.upsert({
        create: {
          consJson: option.cons,
          description: option.description,
          id: stage6OptionId(recommendation.id, option.optionKey),
          isPreferred: index === 0,
          label: option.label,
          prosJson: option.pros,
          recommendationId: recommendation.id,
          riskLevel: option.riskLevel,
          sortOrder: index + 1,
        },
        update: {
          consJson: option.cons,
          description: option.description,
          isPreferred: index === 0,
          label: option.label,
          prosJson: option.pros,
          riskLevel: option.riskLevel,
          sortOrder: index + 1,
        },
        where: { id: stage6OptionId(recommendation.id, option.optionKey) },
      });
      optionRows.push(optionRow);

      const evidence = await tx.evidenceRecord.upsert({
        create: {
          clientTenantId: recommendation.clientTenantId,
          createdByUserId: session.actor.id,
          id: stage6EvidenceId(recommendation.id, option.optionKey),
          relatedObjectId: recommendation.id,
          relatedObjectType: ObjectType.RECOMMENDATION,
          status: EvidenceStatus.VALIDATED,
          summary: option.evidenceSummary,
          title: `Evidence for ${option.label}`,
          visibilityStatus: VisibilityStatus.REDACTED,
        },
        update: {
          relatedObjectId: recommendation.id,
          relatedObjectType: ObjectType.RECOMMENDATION,
          status: EvidenceStatus.VALIDATED,
          summary: option.evidenceSummary,
          visibilityStatus: VisibilityStatus.REDACTED,
        },
        where: { id: stage6EvidenceId(recommendation.id, option.optionKey) },
      });
      await tx.evidenceItem.create({
        data: {
          evidenceRecordId: evidence.id,
          itemType: "advisor_option_comparison",
          sourceObjectId: recommendation.id,
          sourceObjectType: ObjectType.RECOMMENDATION,
          title: `Advisor comparison support for ${option.label}`,
          visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
        },
      });
      evidenceRows.push(evidence);
    }

    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: recommendation.clientTenantId,
        eventType: "operational.advisor_options.comparison_persisted",
        metadataJson: stage6Metadata({
          optionIds: optionRows.map((option) => option.id),
          ticketId: "Operational-6-T03-EXEC",
        }),
        nextState: RecommendationStatus.ADVISOR_PENDING,
        platformTenantId: actorPlatformTenantId,
        previousState: recommendation.status,
        reason: input.reason,
        result: AuditResult.PENDING,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
    });

    return {
      auditEventId: audit.id,
      clientSafeProjection: {
        internalRationaleVisible: false,
        optionCount: optionRows.length,
        recommendationId: recommendation.id,
      },
      evidenceIds: evidenceRows.map((evidence) => evidence.id),
      options: optionRows.map((option) => ({
        id: option.id,
        label: option.label,
        riskLevel: option.riskLevel,
      })),
      recommendationId: recommendation.id,
    };
  });
}

export async function evaluateOperationalOptionDecisionGuard(
  prisma: PrismaClient,
  input: {
    actorRoleKey: ActorRoleKey;
    evidenceIds: string[];
    optionId: string;
    recommendationId: string;
    tenantSlug: ActorTenantSlug;
  },
) {
  let permission: ControlPermissionDecision | null = null;
  const missing: string[] = [];
  const actorContext = requireActorContext({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const [recommendation, option, evidenceRecords] = await Promise.all([
    prisma.recommendation.findUniqueOrThrow({ where: { id: input.recommendationId } }),
    prisma.recommendationOption.findUnique({ where: { id: input.optionId } }),
    prisma.evidenceRecord.findMany({
      include: { items: { select: { sourceObjectId: true, sourceObjectType: true } } },
      where: { id: { in: input.evidenceIds } },
    }),
  ]);
  const scope = resolveTenantObjectScope(actorContext, {
    allowedObjectIds: [recommendation.id],
    clientTenantId: recommendation.clientTenantId,
    objectId: recommendation.id,
    objectType: "RECOMMENDATION",
    requireObjectScope: true,
  });

  if (!scope.allowed) {
    missing.push(scope.reasonCode);
  } else {
    permission = evaluateControlPermission({
      action: "APPROVE",
      actorContext,
      objectScope: scope.objectScope,
      subject: {
        clientTenantId: recommendation.clientTenantId,
        objectId: recommendation.id,
        objectType: "RECOMMENDATION",
        sensitivity: "CONFIDENTIAL",
        visibilityStatus: "COMPLIANCE_VISIBLE",
        workflowState: "ADVISOR_REVIEW",
      },
    });
    if (!permission.allowed) missing.push(permission.reasonCode);
  }

  if (!option || option.recommendationId !== recommendation.id) missing.push("option_scope");
  if (input.actorRoleKey !== "senior_wealth_advisor") missing.push("advisor_role");
  if (evidenceRecords.length === 0) missing.push("evidence_provided");
  if (!evidenceRecords.some((record) => acceptedEvidenceStatus(record.status))) missing.push("accepted_evidence");
  if (!evidenceRecords.some((record) => evidenceIsScopedToRecommendation(record, recommendation.id))) {
    missing.push("scoped_evidence");
  }
  if (recommendation.clientVisible) missing.push("already_client_visible");

  return {
    allowed: missing.length === 0,
    missing: [...new Set(missing)],
    permission,
    ticketId: "Operational-6-T04-EXEC" as const,
  };
}

export async function requestOperationalAdvisorMoreEvidence(
  prisma: PrismaClient,
  input: {
    actorRoleKey: ActorRoleKey;
    evidenceKey: string;
    reason: string;
    recommendationId: string;
    targetRoleKey: "analyst" | "compliance_officer";
    tenantSlug: ActorTenantSlug;
  },
) {
  requireAdvisorRole(input.actorRoleKey);
  requireMeaningfulText(input.reason, "reason");
  const session = requireActorSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: input.recommendationId } });
  const evidenceId = stage6EvidenceId(recommendation.id, input.evidenceKey);

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
        title: "Advisor requested evidence",
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

    await tx.recommendation.update({
      data: {
        clientVisible: false,
        status: RecommendationStatus.MORE_DATA_REQUESTED,
      },
      where: { id: recommendation.id },
    });
    await tx.approval.updateMany({
      data: {
        approvedAt: null,
        notes: input.reason,
        status: ReviewStatus.REQUEST_MORE_DATA,
      },
      where: { targetId: recommendation.id, targetType: ObjectType.RECOMMENDATION },
    });
    await tx.complianceReview.updateMany({
      data: {
        evidenceComplete: false,
        releaseNotes: input.reason,
        releasedAt: null,
        status: ComplianceStatus.NEEDS_EVIDENCE,
      },
      where: { targetId: recommendation.id, targetType: ObjectType.RECOMMENDATION },
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
        eventType: "operational.advisor.requested_evidence",
        evidenceRecordId: evidence.id,
        metadataJson: stage6Metadata({
          evidenceRequestIsNotBlock: true,
          targetRoleKey: input.targetRoleKey,
          ticketId: "Operational-6-T05-EXEC",
        }),
        nextState: RecommendationStatus.MORE_DATA_REQUESTED,
        platformTenantId: actorPlatformTenantId,
        previousState: recommendation.status,
        reason: input.reason,
        result: AuditResult.PENDING,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
    });

    return {
      auditEventId: audit.id,
      clientVisible: false,
      complianceReleased: false,
      evidenceId: evidence.id,
      status: RecommendationStatus.MORE_DATA_REQUESTED,
    };
  });
}

export function createOperationalAdvisorEvidenceRequestFeedbackState(input: {
  lifecycle: OperationalAdvisorFeedbackLifecycle;
  reason?: string;
}) {
  const retryable = input.lifecycle === "error" || input.lifecycle === "retry";

  return {
    advisorVisible: true,
    analystVisible: input.lifecycle === "success" || input.lifecycle === "blocked",
    canAdvanceApproval: false,
    clientVisible: false,
    lifecycle: input.lifecycle,
    message:
      input.reason ??
      {
        blocked: "Evidence request is blocked; approval cannot advance.",
        error: "Evidence request failed; retry before changing approval state.",
        loading: "Evidence request is being prepared.",
        retry: "Evidence request can be retried without advancing approval.",
        success: "Evidence request recorded for analyst follow-up.",
        validation: "Evidence request needs a specific reason and target role.",
      }[input.lifecycle],
    retryable,
  };
}

export async function returnOperationalAdvisorReviewToAnalyst(
  prisma: PrismaClient,
  input: {
    actorRoleKey: ActorRoleKey;
    reason: string;
    recommendationId: string;
    tenantSlug: ActorTenantSlug;
  },
) {
  requireAdvisorRole(input.actorRoleKey);
  requireMeaningfulText(input.reason, "reason");
  const session = requireActorSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: input.recommendationId } });

  return prisma.$transaction(async (tx) => {
    await tx.recommendation.update({
      data: {
        clientVisible: false,
        status: RecommendationStatus.REVISION_REQUESTED,
      },
      where: { id: recommendation.id },
    });
    await tx.approval.updateMany({
      data: {
        approvedAt: null,
        notes: input.reason,
        status: ReviewStatus.REJECTED,
      },
      where: { targetId: recommendation.id, targetType: ObjectType.RECOMMENDATION },
    });
    await tx.complianceReview.updateMany({
      data: {
        evidenceComplete: false,
        releaseNotes: input.reason,
        releasedAt: null,
        status: ComplianceStatus.BLOCKED,
      },
      where: { targetId: recommendation.id, targetType: ObjectType.RECOMMENDATION },
    });
    await tx.queueItem.updateMany({
      data: {
        assignedRoleKey: "analyst",
        status: WorkflowStatus.ANALYST_REVIEW,
      },
      where: { targetId: recommendation.id, targetType: ObjectType.RECOMMENDATION },
    });
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: recommendation.clientTenantId,
        eventType: "operational.advisor.returned_to_analyst",
        metadataJson: stage6Metadata({
          targetRoleKey: "analyst",
          ticketId: "Operational-6-T07-EXEC",
        }),
        nextState: RecommendationStatus.REVISION_REQUESTED,
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
      downstreamReleaseBlocked: true,
      returnedToRoleKey: "analyst" as const,
      status: RecommendationStatus.REVISION_REQUESTED,
    };
  });
}

export async function recordOperationalAdvisorApprovalWithoutRelease(
  prisma: PrismaClient,
  input: {
    actorRoleKey: ActorRoleKey;
    reason: string;
    recommendationId: string;
    tenantSlug: ActorTenantSlug;
  },
) {
  requireAdvisorRole(input.actorRoleKey);
  requireMeaningfulText(input.reason, "reason");
  const session = requireActorSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: input.recommendationId } });

  return prisma.$transaction(async (tx) => {
    await tx.approval.updateMany({
      data: {
        approvedAt: new Date(),
        notes: input.reason,
        status: ReviewStatus.APPROVED,
      },
      where: { targetId: recommendation.id, targetType: ObjectType.RECOMMENDATION },
    });
    await tx.recommendation.update({
      data: {
        clientVisible: false,
        status: RecommendationStatus.COMPLIANCE_PENDING,
      },
      where: { id: recommendation.id },
    });
    await tx.complianceReview.updateMany({
      data: {
        releasedAt: null,
        status: ComplianceStatus.PENDING,
      },
      where: { targetId: recommendation.id, targetType: ObjectType.RECOMMENDATION },
    });
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: recommendation.clientTenantId,
        eventType: "operational.advisor.approved_not_released",
        metadataJson: stage6Metadata({
          advisorApprovalIsNotRelease: true,
          ticketId: "Operational-6-T09-EXEC",
        }),
        nextState: RecommendationStatus.COMPLIANCE_PENDING,
        platformTenantId: actorPlatformTenantId,
        previousState: recommendation.status,
        reason: input.reason,
        result: AuditResult.SUCCESS,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
    });

    return {
      auditEventId: audit.id,
      clientVisible: false,
      complianceStatus: ComplianceStatus.PENDING,
      status: RecommendationStatus.COMPLIANCE_PENDING,
    };
  });
}

export function buildOperationalAdvisorReturnNegativeMatrix(input: {
  clientProjectionVisible: boolean;
  complianceReleased: boolean;
  returnAuditCreated: boolean;
  returnStatus: RecommendationStatus | string;
}) {
  const rows = [
    {
      caseId: "release_blocked_after_return",
      passed: input.returnStatus === RecommendationStatus.REVISION_REQUESTED && !input.complianceReleased,
    },
    {
      caseId: "client_projection_hidden_after_return",
      passed: !input.clientProjectionVisible,
    },
    {
      caseId: "return_audit_created",
      passed: input.returnAuditCreated,
    },
  ];

  return {
    allNegativeCasesCovered: rows.every((row) => row.passed),
    rows,
    ticketId: "Operational-6-T08-EXEC" as const,
  };
}

export function sweepOperationalAdvisorNotRelease(input: {
  advisorApproval?: {
    clientVisible: boolean;
    complianceStatus: ComplianceStatus | string;
    recommendationStatus: RecommendationStatus | string;
  };
  evidenceRequest?: {
    clientVisible: boolean;
    complianceStatus: ComplianceStatus | string;
    recommendationStatus: RecommendationStatus | string;
  };
  returnToAnalyst?: {
    clientVisible: boolean;
    complianceStatus: ComplianceStatus | string;
    recommendationStatus: RecommendationStatus | string;
  };
}) {
  const cases = [
    ["advisor_approval", input.advisorApproval],
    ["evidence_request", input.evidenceRequest],
    ["return_to_analyst", input.returnToAnalyst],
  ] as const;
  const rows = cases.map(([caseId, state]) => {
    const released =
      state?.clientVisible === true ||
      state?.complianceStatus === ComplianceStatus.RELEASED ||
      state?.recommendationStatus === RecommendationStatus.RELEASED_TO_CLIENT;
    return {
      caseId,
      passed: Boolean(state) && !released,
    };
  });

  return {
    advisorNotReleaseProven: rows.every((row) => row.passed),
    rows,
    ticketId: "Operational-6-T09-EXEC" as const,
  };
}

export function certifyOperationalAdvisorReviewExit(input: {
  completedTickets: OperationalStage6TicketId[];
  notReleaseSweep: ReturnType<typeof sweepOperationalAdvisorNotRelease>;
  returnNegativeMatrix: ReturnType<typeof buildOperationalAdvisorReturnNegativeMatrix>;
}) {
  const completed = new Set(input.completedTickets);
  const missingTickets = operationalStage6TicketOrder.filter((ticket) => !completed.has(ticket));
  const blockers: string[] = [];

  if (missingTickets.length > 0) blockers.push("missing_stage6_tickets");
  if (!input.notReleaseSweep.advisorNotReleaseProven) blockers.push("advisor_not_release_unproven");
  if (!input.returnNegativeMatrix.allNegativeCasesCovered) blockers.push("advisor_return_negative_cases_unproven");

  return {
    blockers,
    certified: blockers.length === 0,
    missingTickets,
    processCoverage: ["F-001", "F-003", "F-004", "F-006"],
    status: blockers.length === 0 ? "Operational_PHASE6_ADVISOR_REVIEW_READY" : "Operational_PHASE6_BLOCKED",
    ticketId: "Operational-6-T10-EXEC" as const,
  };
}
