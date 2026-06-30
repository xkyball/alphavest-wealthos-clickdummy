import {
  AdviceClassification,
  AuditResult,
  ComplianceStatus,
  DraftClassificationKind,
  DraftRiskLevel,
  EvidenceStatus,
  InternalDraftStatus,
  ObjectType,
  Prisma,
  type PrismaClient,
  RecommendationStatus,
  ReviewStatus,
  UnsupportedClaimStatus,
  VisibilityStatus,
} from "@prisma/client";

import { actorPlatformTenantId, requireActorSession, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { inspectClientVisibilityStage6ClientPayload } from "@/lib/client-visibility-payload-contract";
import { exportService } from "@/lib/export-service";
import { stableId } from "@/lib/stable-id";

export const operationalStage5TicketOrder = [
  "Operational-5-T01-EXEC",
  "Operational-5-T02-EXEC",
  "Operational-5-T03-EXEC",
  "Operational-5-T04-EXEC",
  "Operational-5-T05-EXEC",
  "Operational-5-T06-EXEC",
  "Operational-5-T07-EXEC",
  "Operational-5-T08-EXEC",
  "Operational-5-T09-EXEC",
  "Operational-5-T10-EXEC",
  "Operational-5-T11-EXEC",
  "Operational-5-T12-EXEC",
  "Operational-5-T13-EXEC",
  "Operational-5-T14-EXEC",
] as const;

export type OperationalStage5TicketId = (typeof operationalStage5TicketOrder)[number];

export type OperationalStage5ReadinessInput = {
  analysisComplete: boolean;
  humanGoNoGo: boolean;
  predecessorStage4Exit: boolean;
  specificationComplete: boolean;
  targetFilesConfirmed: boolean;
  testsConfirmed: boolean;
};

export type OperationalStage5ReadinessResult = {
  ready: boolean;
  missing: string[];
  ticketOrder: readonly OperationalStage5TicketId[];
};

export function createOperationalStage5ReadinessChecklist(
  input: OperationalStage5ReadinessInput,
): OperationalStage5ReadinessResult {
  const missing: string[] = [];

  if (!input.predecessorStage4Exit) missing.push("operational_stage4_exit");
  if (!input.analysisComplete) missing.push("ph5_analysis");
  if (!input.specificationComplete) missing.push("ph5_spec");
  if (!input.targetFilesConfirmed) missing.push("target_files");
  if (!input.testsConfirmed) missing.push("tests");
  if (!input.humanGoNoGo) missing.push("human_go_no_go");

  return {
    missing,
    ready: missing.length === 0,
    ticketOrder: operationalStage5TicketOrder,
  };
}

export type OperationalInternalDraftSourceContext = {
  processId: string;
  sourceObjectId: string;
  sourceObjectType: ObjectType;
  sourceRefs: string[];
};

export type OperationalInternalDraftInput = {
  actorRoleKey: ActorRoleKey;
  clientSummaryDraft: string;
  draftKey: string;
  internalRationale: string;
  reason: string;
  sourceContext: OperationalInternalDraftSourceContext;
  tenantSlug: ActorTenantSlug;
  title: string;
};

export type OperationalDraftClassification = {
  classification: "advice_relevant" | "guidance" | "information" | "out_of_scope";
  riskLevel: "low" | "medium" | "high" | "critical";
  unsupportedClaimStatus: "clear" | "unsupported_claims_detected";
};

export type OperationalUnsupportedClaimInput = {
  actorRoleKey: ActorRoleKey;
  claimKey: string;
  evidenceRequirement: string;
  reason: string;
  recommendationId: string;
  sourceRef: string;
  tenantSlug: ActorTenantSlug;
};

function operationalDraftRecommendationId(tenantSlug: ActorTenantSlug, draftKey: string) {
  return stableId(`operational:stage5:recommendation:${tenantSlug}:${draftKey}`);
}

function operationalDraftApprovalId(tenantSlug: ActorTenantSlug, draftKey: string) {
  return stableId(`operational:stage5:approval:${tenantSlug}:${draftKey}`);
}

function operationalDraftComplianceReviewId(tenantSlug: ActorTenantSlug, draftKey: string) {
  return stableId(`operational:stage5:compliance:${tenantSlug}:${draftKey}`);
}

function operationalUnsupportedClaimEvidenceId(recommendationId: string, claimKey: string) {
  return stableId(`operational:stage5:unsupported-claim:${recommendationId}:${claimKey}`);
}

function operationalDraftMetadata(input: Prisma.InputJsonObject): Prisma.InputJsonObject {
  return {
    aiDraftInternalOnly: true,
    clientVisible: false,
    noAutonomousAdvice: true,
    noClientRelease: true,
    operationalStage: "PH5",
    ...input,
  };
}

function toDraftClassificationKind(classification: OperationalDraftClassification["classification"]) {
  return {
    advice_relevant: DraftClassificationKind.ADVICE_RELEVANT,
    guidance: DraftClassificationKind.GUIDANCE,
    information: DraftClassificationKind.INFORMATION,
    out_of_scope: DraftClassificationKind.OUT_OF_SCOPE,
  }[classification];
}

function toDraftRiskLevel(riskLevel: OperationalDraftClassification["riskLevel"]) {
  return {
    critical: DraftRiskLevel.CRITICAL,
    high: DraftRiskLevel.HIGH,
    low: DraftRiskLevel.LOW,
    medium: DraftRiskLevel.MEDIUM,
  }[riskLevel];
}

type OperationalDraftGateInput = {
  classified: boolean;
  evidenceBackedRebuild: boolean;
  rejected: boolean;
  status: RecommendationStatus;
  unsupportedClaimStatus: "clear" | "unsupported_claims_detected";
};

export type OperationalDraftGovernanceState = OperationalDraftGateInput & {
  draftId: string | null;
  canonicalSpineUsed: boolean;
  processId: string | null;
  sourceRefs: string[];
};

function requireInternalDraftRole(roleKey: ActorRoleKey) {
  if (!["analyst", "senior_wealth_advisor"].includes(roleKey)) {
    throw new Error("Operational Stage 5 internal draft command requires an internal analyst or advisor role.");
  }
}

function requireDraftText(value: string, field: string) {
  if (value.trim().length < 12) {
    throw new Error(`${field} must contain meaningful internal draft content.`);
  }
}

function evidenceIsAccepted(record: { status: EvidenceStatus }) {
  return record.status === EvidenceStatus.VALIDATED || record.status === EvidenceStatus.RELEASED;
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

async function createDraftTrace(
  tx: Prisma.TransactionClient,
  input: {
    actorRoleKey: ActorRoleKey;
    actorUserId?: string | null;
    auditEventId?: string | null;
    evidenceRecordId?: string | null;
    internalDraftId: string;
    metadataJson?: Prisma.InputJsonObject;
    reason: string;
    traceType: string;
  },
) {
  const trace = await tx.draftTrace.create({
    data: {
      actorRoleKey: input.actorRoleKey,
      actorUserId: input.actorUserId ?? null,
      auditEventId: input.auditEventId ?? null,
      evidenceRecordId: input.evidenceRecordId ?? null,
      internalDraftId: input.internalDraftId,
      metadataJson: input.metadataJson,
      reason: input.reason,
      traceType: input.traceType,
    },
  });

  await tx.internalDraft.update({
    data: { currentTraceId: trace.id },
    where: { id: input.internalDraftId },
  });

  return trace;
}

export async function getOperationalInternalDraftGovernanceState(
  prisma: PrismaClient | Prisma.TransactionClient,
  recommendationId: string,
): Promise<OperationalDraftGovernanceState> {
  const internalDraft = await prisma.internalDraft.findFirst({
    include: {
      classifications: { orderBy: { createdAt: "desc" }, take: 1 },
      unsupportedClaims: {
        where: { status: UnsupportedClaimStatus.NEEDS_EVIDENCE },
      },
    },
    orderBy: { createdAt: "desc" },
    where: { recommendationId },
  });

  if (internalDraft) {
    const latestClassification = internalDraft.classifications[0] ?? null;
    return {
      classified: Boolean(latestClassification),
      draftId: internalDraft.id,
      evidenceBackedRebuild:
        internalDraft.status === InternalDraftStatus.REBUILT_WITH_EVIDENCE ||
        internalDraft.status === InternalDraftStatus.ADVISOR_READY,
      canonicalSpineUsed: true,
      processId: internalDraft.processId,
      rejected: internalDraft.status === InternalDraftStatus.REJECTED,
      sourceRefs: Array.isArray(internalDraft.sourceRefsJson) ? internalDraft.sourceRefsJson.filter((ref): ref is string => typeof ref === "string") : [],
      status: internalDraft.recommendationId ? (await prisma.recommendation.findUniqueOrThrow({ where: { id: recommendationId } })).status : RecommendationStatus.DRAFT,
      unsupportedClaimStatus:
        latestClassification?.unsupportedClaimsClear === true && internalDraft.unsupportedClaims.length === 0
          ? "clear"
          : "unsupported_claims_detected",
    };
  }

  return {
    classified: false,
    draftId: null,
    evidenceBackedRebuild: false,
    canonicalSpineUsed: false,
    processId: null,
    rejected: false,
    sourceRefs: [],
    status: RecommendationStatus.DRAFT,
    unsupportedClaimStatus: "unsupported_claims_detected",
  };
}

export async function createOperationalInternalAiDraft(prisma: PrismaClient, input: OperationalInternalDraftInput) {
  requireInternalDraftRole(input.actorRoleKey);
  requireDraftText(input.clientSummaryDraft, "clientSummaryDraft");
  requireDraftText(input.internalRationale, "internalRationale");
  requireDraftText(input.reason, "reason");

  const session = requireActorSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const recommendationId = operationalDraftRecommendationId(input.tenantSlug, input.draftKey);
  const approvalId = operationalDraftApprovalId(input.tenantSlug, input.draftKey);
  const complianceReviewId = operationalDraftComplianceReviewId(input.tenantSlug, input.draftKey);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.recommendation.findUnique({ where: { id: recommendationId } });
    const recommendation = await tx.recommendation.upsert({
      create: {
        adviceClassification: AdviceClassification.ADVICE_RELEVANT,
        clientTenantId: session.tenant.id,
        clientVisible: false,
        createdByUserId: session.actor.id,
        id: recommendationId,
        riskSummary: "Internal AI/rules draft. Human review and evidence gates are mandatory before release.",
        status: RecommendationStatus.AI_DRAFT,
        summaryInternal: input.internalRationale,
        title: input.title,
      },
      update: {
        adviceClassification: AdviceClassification.ADVICE_RELEVANT,
        clientVisible: false,
        riskSummary: "Internal AI/rules draft. Human review and evidence gates are mandatory before release.",
        status: RecommendationStatus.AI_DRAFT,
        summaryInternal: input.internalRationale,
        title: input.title,
      },
      where: { id: recommendationId },
    });
    const internalDraft = await tx.internalDraft.upsert({
      create: {
        clientTenantId: session.tenant.id,
        createdByUserId: session.actor.id,
        draftClientSummary: input.clientSummaryDraft,
        draftKey: input.draftKey,
        id: stableId(`operational:stage5:internal-draft:${input.tenantSlug}:${input.draftKey}`),
        internalRationale: input.internalRationale,
        processId: input.sourceContext.processId,
        recommendationId: recommendation.id,
        sourceObjectId: input.sourceContext.sourceObjectId,
        sourceObjectType: input.sourceContext.sourceObjectType,
        sourceRefsJson: input.sourceContext.sourceRefs,
        status: InternalDraftStatus.CREATED,
        title: input.title,
      },
      update: {
        draftClientSummary: input.clientSummaryDraft,
        internalRationale: input.internalRationale,
        processId: input.sourceContext.processId,
        sourceObjectId: input.sourceContext.sourceObjectId,
        sourceObjectType: input.sourceContext.sourceObjectType,
        sourceRefsJson: input.sourceContext.sourceRefs,
        status: InternalDraftStatus.CREATED,
        title: input.title,
      },
      where: {
        recommendationId_draftKey: {
          draftKey: input.draftKey,
          recommendationId: recommendation.id,
        },
      },
    });
    await tx.approval.upsert({
      create: {
        approvalType: "advisor",
        approverRoleKey: "senior_wealth_advisor",
        approverUserId: session.actor.id,
        clientTenantId: session.tenant.id,
        id: approvalId,
        notes: "Internal AI/rules draft awaiting advisor review.",
        status: ReviewStatus.PENDING,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
      update: {
        approvedAt: null,
        notes: "Internal AI/rules draft awaiting advisor review.",
        status: ReviewStatus.PENDING,
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
        releaseNotes: "Internal AI/rules draft cannot be released before advisor, evidence, payload and compliance gates.",
        reviewerUserId: session.actor.id,
        status: ComplianceStatus.PENDING,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
      update: {
        adviceClassification: AdviceClassification.ADVICE_RELEVANT,
        evidenceComplete: false,
        releaseNotes: "Internal AI/rules draft cannot be released before advisor, evidence, payload and compliance gates.",
        status: ComplianceStatus.PENDING,
      },
      where: { id: complianceReviewId },
    });
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: session.tenant.id,
        eventType: "operational.ai_draft.created_internal",
        metadataJson: operationalDraftMetadata({
          draftKey: input.draftKey,
          sourceContext: input.sourceContext,
          ticketId: "Operational-5-T01-EXEC",
        }),
        nextState: recommendation.status,
        platformTenantId: actorPlatformTenantId,
        previousState: existing?.status,
        reason: input.reason,
        result: AuditResult.PENDING,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
    });
    await createDraftTrace(tx, {
      actorRoleKey: session.role.key,
      actorUserId: session.actor.id,
      auditEventId: audit.id,
      internalDraftId: internalDraft.id,
      metadataJson: operationalDraftMetadata({
        draftKey: input.draftKey,
        sourceContext: input.sourceContext,
        storage: "internal_drafts",
        ticketId: "Operational-5-T01-EXEC",
      }),
      reason: input.reason,
      traceType: "operational.ai_draft.created_internal",
    });

    return {
      auditEventId: audit.id,
      clientVisible: recommendation.clientVisible,
      complianceReviewId,
      internalDraftId: internalDraft.id,
      noAutonomousAdvice: true,
      recommendationId: recommendation.id,
      status: recommendation.status,
      ticketId: "Operational-5-T01-EXEC" as const,
    };
  });
}

export const operationalInternalDraftFieldClassification = {
  aiDraft: "AI_DRAFT",
  clientSummaryDraft: "AI_DRAFT",
  complianceNotes: "COMPLIANCE_NOTES",
  internalRationale: "INTERNAL_RATIONALE",
  modelOutput: "AI_DRAFT",
  modelPrompt: "AI_DRAFT",
  sourceContext: "INTERNAL_RATIONALE",
  sourceRefs: "INTERNAL_RATIONALE",
  unsupportedClaims: "INTERNAL_RATIONALE",
} as const;

export type OperationalInternalDraftField = keyof typeof operationalInternalDraftFieldClassification;

export function tagOperationalInternalDraftPayload(payload: Record<string, unknown>) {
  return Object.keys(payload)
    .filter((field): field is OperationalInternalDraftField => field in operationalInternalDraftFieldClassification)
    .map((field) => ({
      classification: operationalInternalDraftFieldClassification[field],
      field,
      internalOnly: true,
      ticketId: "Operational-5-T02-EXEC" as const,
    }));
}

export function inspectOperationalInternalDraftProjection(payload: Record<string, unknown>) {
  const fieldTags = tagOperationalInternalDraftPayload(payload);
  const clientInspection = inspectClientVisibilityStage6ClientPayload(payload, { surface: "api" });
  const exportInspection = exportService.inspectClientExportPayload(payload);

  return {
    cleanForClient: clientInspection.clean && fieldTags.length === 0,
    cleanForExport: exportInspection.clean && fieldTags.length === 0,
    clientForbiddenFields: clientInspection.forbiddenFields,
    exportForbiddenFields: exportInspection.forbiddenFields,
    fieldTags,
    ticketId: "Operational-5-T02-EXEC" as const,
  };
}

export async function classifyOperationalInternalDraft(
  prisma: PrismaClient,
  input: {
    actorRoleKey: ActorRoleKey;
    classification: OperationalDraftClassification;
    reason: string;
    recommendationId: string;
    tenantSlug: ActorTenantSlug;
  },
) {
  requireInternalDraftRole(input.actorRoleKey);
  requireDraftText(input.reason, "reason");

  const session = requireActorSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const existing = await prisma.recommendation.findUniqueOrThrow({ where: { id: input.recommendationId } });
  const nextStatus =
    input.classification.unsupportedClaimStatus === "clear"
      ? RecommendationStatus.ANALYST_REVIEWED
      : RecommendationStatus.REVISION_REQUESTED;

  return prisma.$transaction(async (tx) => {
    const internalDraft = await tx.internalDraft.findFirstOrThrow({
      orderBy: { createdAt: "desc" },
      where: { recommendationId: input.recommendationId },
    });
    const recommendation = await tx.recommendation.update({
      data: {
        clientVisible: false,
        status: nextStatus,
      },
      where: { id: input.recommendationId },
    });
    const classification = await tx.draftClassification.create({
      data: {
        classification: toDraftClassificationKind(input.classification.classification),
        classifiedByRoleKey: session.role.key,
        classifiedByUserId: session.actor.id,
        internalDraftId: internalDraft.id,
        reason: input.reason,
        riskLevel: toDraftRiskLevel(input.classification.riskLevel),
        unsupportedClaimsClear: input.classification.unsupportedClaimStatus === "clear",
      },
    });
    await tx.internalDraft.update({
      data: {
        status:
          input.classification.unsupportedClaimStatus === "clear"
            ? internalDraft.status === InternalDraftStatus.REBUILT_WITH_EVIDENCE
              ? InternalDraftStatus.ADVISOR_READY
              : InternalDraftStatus.CLASSIFIED
            : InternalDraftStatus.REVISION_REQUESTED,
      },
      where: { id: internalDraft.id },
    });
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: session.tenant.id,
        eventType: "operational.ai_draft.classified",
        metadataJson: operationalDraftMetadata({
          classification: input.classification,
          ticketId: "Operational-5-T03-EXEC",
        }),
        nextState: recommendation.status,
        platformTenantId: actorPlatformTenantId,
        previousState: existing.status,
        reason: input.reason,
        result: input.classification.unsupportedClaimStatus === "clear" ? AuditResult.SUCCESS : AuditResult.WARNING,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
    });
    await createDraftTrace(tx, {
      actorRoleKey: session.role.key,
      actorUserId: session.actor.id,
      auditEventId: audit.id,
      internalDraftId: internalDraft.id,
      metadataJson: operationalDraftMetadata({
        classificationId: classification.id,
        classification: input.classification,
        storage: "draft_classifications",
        ticketId: "Operational-5-T03-EXEC",
      }),
      reason: input.reason,
      traceType: "operational.ai_draft.classified",
    });

    return {
      auditEventId: audit.id,
      classificationId: classification.id,
      clientVisible: recommendation.clientVisible,
      nextReviewState:
        input.classification.unsupportedClaimStatus === "clear"
          ? "advisor_review_ready_after_evidence_check"
          : "unsupported_claim_review_required",
      recommendationId: recommendation.id,
      status: recommendation.status,
      ticketId: "Operational-5-T03-EXEC" as const,
    };
  });
}

export function canOperationalDraftAdvanceToAdvisor(input: OperationalDraftGateInput) {
  const missing: string[] = [];

  if (!input.classified) missing.push("draft_classification");
  if (input.unsupportedClaimStatus !== "clear") missing.push("unsupported_claim_clearance");

  return {
    allowed: missing.length === 0,
    missing,
    ticketId: "Operational-5-T03-EXEC" as const,
  };
}

export async function persistOperationalUnsupportedClaim(prisma: PrismaClient, input: OperationalUnsupportedClaimInput) {
  requireInternalDraftRole(input.actorRoleKey);
  requireDraftText(input.evidenceRequirement, "evidenceRequirement");
  requireDraftText(input.reason, "reason");

  const session = requireActorSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const existing = await prisma.recommendation.findUniqueOrThrow({ where: { id: input.recommendationId } });
  const claim = {
    claimKey: input.claimKey,
    evidenceRequirement: input.evidenceRequirement,
    sourceRef: input.sourceRef,
    status: "needs_evidence",
  };
  const evidenceRecordId = operationalUnsupportedClaimEvidenceId(input.recommendationId, input.claimKey);

  return prisma.$transaction(async (tx) => {
    const internalDraft = await tx.internalDraft.findFirstOrThrow({
      orderBy: { createdAt: "desc" },
      where: { recommendationId: input.recommendationId },
    });
    const evidence = await tx.evidenceRecord.upsert({
      create: {
        clientTenantId: session.tenant.id,
        createdByUserId: session.actor.id,
        id: evidenceRecordId,
        relatedObjectId: input.recommendationId,
        relatedObjectType: ObjectType.RECOMMENDATION,
        retentionPolicy: "internal_ai_draft_claim_evidence",
        status: EvidenceStatus.PLACEHOLDER,
        summary: input.evidenceRequirement,
        title: `Evidence required for unsupported claim ${input.claimKey}`,
        visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
      },
      update: {
        status: EvidenceStatus.PLACEHOLDER,
        summary: input.evidenceRequirement,
        visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
      },
      where: { id: evidenceRecordId },
    });
    const recommendation = await tx.recommendation.update({
      data: {
        clientVisible: false,
        status: RecommendationStatus.REVISION_REQUESTED,
      },
      where: { id: input.recommendationId },
    });
    const unsupportedClaim = await tx.unsupportedClaim.upsert({
      create: {
        claimKey: input.claimKey,
        createdByRoleKey: session.role.key,
        createdByUserId: session.actor.id,
        evidenceRecordId: evidence.id,
        evidenceRequirement: input.evidenceRequirement,
        id: stableId(`operational:stage5:unsupported-claim-row:${input.recommendationId}:${input.claimKey}`),
        internalDraftId: internalDraft.id,
        sourceRef: input.sourceRef,
        status: UnsupportedClaimStatus.NEEDS_EVIDENCE,
      },
      update: {
        evidenceRecordId: evidence.id,
        evidenceRequirement: input.evidenceRequirement,
        sourceRef: input.sourceRef,
        status: UnsupportedClaimStatus.NEEDS_EVIDENCE,
      },
      where: {
        internalDraftId_claimKey: {
          claimKey: input.claimKey,
          internalDraftId: internalDraft.id,
        },
      },
    });
    await tx.internalDraft.update({
      data: { status: InternalDraftStatus.REVISION_REQUESTED },
      where: { id: internalDraft.id },
    });
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: session.tenant.id,
        eventType: "operational.ai_draft.unsupported_claim_recorded",
        evidenceRecordId: evidence.id,
        metadataJson: operationalDraftMetadata({
          claim,
          evidenceRecordId: evidence.id,
          storage: "unsupported_claims",
          unsupportedClaimId: unsupportedClaim.id,
          ticketId: "Operational-5-T04-EXEC",
        }),
        nextState: recommendation.status,
        platformTenantId: actorPlatformTenantId,
        previousState: existing.status,
        reason: input.reason,
        result: AuditResult.BLOCKED,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
    });
    await createDraftTrace(tx, {
      actorRoleKey: session.role.key,
      actorUserId: session.actor.id,
      auditEventId: audit.id,
      evidenceRecordId: evidence.id,
      internalDraftId: internalDraft.id,
      metadataJson: operationalDraftMetadata({
        claim,
        evidenceRecordId: evidence.id,
        storage: "unsupported_claims",
        ticketId: "Operational-5-T04-EXEC",
        unsupportedClaimId: unsupportedClaim.id,
      }),
      reason: input.reason,
      traceType: "operational.ai_draft.unsupported_claim_recorded",
    });

    return {
      auditEventId: audit.id,
      clientVisible: recommendation.clientVisible,
      evidenceRecordId: evidence.id,
      recommendationId: recommendation.id,
      status: recommendation.status,
      ticketId: "Operational-5-T04-EXEC" as const,
      unsupportedClaim: claim,
      unsupportedClaimId: unsupportedClaim.id,
    };
  });
}

export function operationalUnsupportedClaimFeedbackState(input: {
  actorRoleKey: ActorRoleKey;
  evidenceRequirement: string;
  reason: string;
  sourceRef: string;
  unsupportedClaimStatus: "clear" | "unsupported_claims_detected";
}) {
  const internalRole = ["analyst", "senior_wealth_advisor", "compliance_officer"].includes(input.actorRoleKey);
  const hasUnsupportedClaim = input.unsupportedClaimStatus === "unsupported_claims_detected";

  return {
    analystVisible: internalRole && hasUnsupportedClaim,
    clientVisible: false,
    feedbackState: hasUnsupportedClaim ? "unsupported_claim_blocked" : "clear",
    hiddenFromClientFields: ["reason", "sourceRef", "evidenceRequirement"],
    internalDetails:
      internalRole && hasUnsupportedClaim
        ? {
            evidenceRequirement: input.evidenceRequirement,
            reason: input.reason,
            sourceRef: input.sourceRef,
          }
        : null,
    ticketId: "Operational-5-T05-EXEC" as const,
  };
}

export async function rejectOperationalInternalDraft(
  prisma: PrismaClient,
  input: {
    actorRoleKey: ActorRoleKey;
    reason: string;
    recommendationId: string;
    tenantSlug: ActorTenantSlug;
  },
) {
  requireInternalDraftRole(input.actorRoleKey);
  requireDraftText(input.reason, "reason");

  const session = requireActorSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const existing = await prisma.recommendation.findUniqueOrThrow({ where: { id: input.recommendationId } });

  return prisma.$transaction(async (tx) => {
    const internalDraft = await tx.internalDraft.findFirstOrThrow({
      orderBy: { createdAt: "desc" },
      where: { recommendationId: input.recommendationId },
    });
    const recommendation = await tx.recommendation.update({
      data: {
        clientVisible: false,
        status: RecommendationStatus.REVISION_REQUESTED,
        summaryInternal: `Internal draft rejected: ${input.reason}`,
      },
      where: { id: input.recommendationId },
    });
    await tx.internalDraft.update({
      data: { status: InternalDraftStatus.REJECTED },
      where: { id: internalDraft.id },
    });
    await tx.approval.updateMany({
      data: {
        approvedAt: null,
        notes: input.reason,
        status: ReviewStatus.REQUEST_MORE_DATA,
      },
      where: {
        targetId: input.recommendationId,
        targetType: ObjectType.RECOMMENDATION,
      },
    });
    await tx.complianceReview.updateMany({
      data: {
        evidenceComplete: false,
        releaseNotes: input.reason,
        status: ComplianceStatus.NEEDS_EVIDENCE,
      },
      where: {
        targetId: input.recommendationId,
        targetType: ObjectType.RECOMMENDATION,
      },
    });
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: session.tenant.id,
        eventType: "operational.ai_draft.rejected",
        metadataJson: operationalDraftMetadata({
          rejectionReason: input.reason,
          storage: "internal_drafts",
          ticketId: "Operational-5-T06-EXEC",
        }),
        nextState: recommendation.status,
        platformTenantId: actorPlatformTenantId,
        previousState: existing.status,
        reason: input.reason,
        result: AuditResult.BLOCKED,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
    });
    await createDraftTrace(tx, {
      actorRoleKey: session.role.key,
      actorUserId: session.actor.id,
      auditEventId: audit.id,
      internalDraftId: internalDraft.id,
      metadataJson: operationalDraftMetadata({
        rejectionReason: input.reason,
        storage: "internal_drafts",
        ticketId: "Operational-5-T06-EXEC",
      }),
      reason: input.reason,
      traceType: "operational.ai_draft.rejected",
    });

    return {
      auditEventId: audit.id,
      clientVisible: recommendation.clientVisible,
      recommendationId: recommendation.id,
      status: recommendation.status,
      ticketId: "Operational-5-T06-EXEC" as const,
    };
  });
}

export async function rebuildOperationalDraftWithEvidence(
  prisma: PrismaClient,
  input: {
    actorRoleKey: ActorRoleKey;
    evidenceIds: string[];
    reason: string;
    recommendationId: string;
    tenantSlug: ActorTenantSlug;
  },
) {
  requireInternalDraftRole(input.actorRoleKey);
  requireDraftText(input.reason, "reason");

  if (input.evidenceIds.length === 0) {
    throw new Error("Accepted scoped evidence is required before rebuilding an internal draft.");
  }

  const session = requireActorSession({ roleKey: input.actorRoleKey, tenantSlug: input.tenantSlug });
  const existing = await prisma.recommendation.findUniqueOrThrow({ where: { id: input.recommendationId } });

  return prisma.$transaction(async (tx) => {
    const internalDraft = await tx.internalDraft.findFirstOrThrow({
      orderBy: { createdAt: "desc" },
      where: { recommendationId: input.recommendationId },
    });
    const evidenceRecords = await tx.evidenceRecord.findMany({
      include: {
        items: {
          select: {
            sourceObjectId: true,
            sourceObjectType: true,
          },
        },
      },
      where: {
        id: { in: input.evidenceIds },
      },
    });
    const acceptedScopedEvidence = evidenceRecords.filter(
      (record) => evidenceIsAccepted(record) && evidenceIsScopedToRecommendation(record, input.recommendationId),
    );

    if (acceptedScopedEvidence.length === 0) {
      throw new Error("Rebuild requires accepted evidence scoped to this recommendation.");
    }

    const recommendation = await tx.recommendation.update({
      data: {
        clientVisible: false,
        status: RecommendationStatus.ANALYST_REVIEWED,
        summaryInternal: `Evidence-backed internal draft rebuilt: ${input.reason}`,
      },
      where: { id: input.recommendationId },
    });
    await tx.internalDraft.update({
      data: {
        draftClientSummary: "Internal draft rebuilt with accepted evidence. Client release remains blocked.",
        status: InternalDraftStatus.REBUILT_WITH_EVIDENCE,
      },
      where: { id: internalDraft.id },
    });
    await tx.unsupportedClaim.updateMany({
      data: { status: UnsupportedClaimStatus.RESOLVED },
      where: { internalDraftId: internalDraft.id },
    });
    await tx.evidenceItem.createMany({
      data: acceptedScopedEvidence.map((record) => ({
        evidenceRecordId: record.id,
        itemType: "internal_draft_rebuild",
        sourceObjectId: input.recommendationId,
        sourceObjectType: ObjectType.RECOMMENDATION,
        title: "Evidence linked to Operational Stage 5 internal draft rebuild",
        visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
      })),
    });
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: session.tenant.id,
        eventType: "operational.ai_draft.rebuilt_with_evidence",
        evidenceRecordId: acceptedScopedEvidence[0]?.id,
        metadataJson: operationalDraftMetadata({
          evidenceIds: acceptedScopedEvidence.map((record) => record.id),
          storage: "internal_drafts",
          ticketId: "Operational-5-T07-EXEC",
        }),
        nextState: recommendation.status,
        platformTenantId: actorPlatformTenantId,
        previousState: existing.status,
        reason: input.reason,
        result: AuditResult.SUCCESS,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
      },
    });
    await createDraftTrace(tx, {
      actorRoleKey: session.role.key,
      actorUserId: session.actor.id,
      auditEventId: audit.id,
      evidenceRecordId: acceptedScopedEvidence[0]?.id,
      internalDraftId: internalDraft.id,
      metadataJson: operationalDraftMetadata({
        evidenceIds: acceptedScopedEvidence.map((record) => record.id),
        storage: "internal_drafts",
        ticketId: "Operational-5-T07-EXEC",
      }),
      reason: input.reason,
      traceType: "operational.ai_draft.rebuilt_with_evidence",
    });

    return {
      auditEventId: audit.id,
      clientVisible: recommendation.clientVisible,
      evidenceIds: acceptedScopedEvidence.map((record) => record.id),
      recommendationId: recommendation.id,
      status: recommendation.status,
      ticketId: "Operational-5-T07-EXEC" as const,
    };
  });
}

export async function buildOperationalDraftTraceMap(
  prisma: PrismaClient,
  input: {
    actorRoleKey: ActorRoleKey;
    recommendationId: string;
    tenantSlug: ActorTenantSlug;
  },
) {
  requireInternalDraftRole(input.actorRoleKey);

  const recommendation = await prisma.recommendation.findUniqueOrThrow({
    where: { id: input.recommendationId },
  });
  const draftState = await getOperationalInternalDraftGovernanceState(prisma, input.recommendationId);
  const evidenceRecords = await prisma.evidenceRecord.findMany({
    include: {
      items: true,
    },
    where: {
      OR: [
        { relatedObjectId: input.recommendationId, relatedObjectType: ObjectType.RECOMMENDATION },
        {
          items: {
            some: {
              sourceObjectId: input.recommendationId,
              sourceObjectType: ObjectType.RECOMMENDATION,
            },
          },
        },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  return {
    clientSafeProjection: {
      recommendationId: recommendation.id,
      traceAvailable: false,
    },
    internalTrace: {
      evidenceRecordIds: evidenceRecords.map((record) => record.id),
      canonicalSpineUsed: draftState.canonicalSpineUsed,
      processId: draftState.processId,
      recommendationId: recommendation.id,
      sourceRefs: draftState.sourceRefs,
    },
    ticketId: "Operational-5-T08-EXEC" as const,
  };
}

export async function getOperationalDraftTraceAudit(
  prisma: PrismaClient,
  input: {
    recommendationId: string;
    requiredEvents?: string[];
  },
) {
  const requiredEvents = input.requiredEvents ?? [
    "operational.ai_draft.classified",
    "operational.ai_draft.rejected",
    "operational.ai_draft.rebuilt_with_evidence",
  ];
  const auditRows = await prisma.auditEvent.findMany({
    where: {
      eventType: { in: requiredEvents },
      targetId: input.recommendationId,
      targetType: ObjectType.RECOMMENDATION,
    },
    orderBy: { createdAt: "asc" },
  });
  const presentEvents = new Set(auditRows.map((row) => row.eventType));
  const missing = requiredEvents.filter((eventType) => !presentEvents.has(eventType));

  return {
    auditRows: auditRows.length,
    blocksCompletionClaim: missing.length > 0,
    missing,
    ticketId: "Operational-5-T09-EXEC" as const,
  };
}

export function sweepOperationalAiDraftLeakageSurfaces(
  surfaces: Array<{
    name: string;
    payload: Record<string, unknown>;
    surface: "api" | "client_route" | "export";
  }>,
) {
  return surfaces.map((surface) => {
    const inspection = inspectOperationalInternalDraftProjection(surface.payload);
    return {
      ...surface,
      blocked: !inspection.cleanForClient || !inspection.cleanForExport,
      forbiddenFields: [...new Set([...inspection.clientForbiddenFields, ...inspection.exportForbiddenFields])],
      internalTags: inspection.fieldTags,
      ticketId: "Operational-5-T10-EXEC" as const,
    };
  });
}

export function canOperationalEvidenceBackedDraftMoveToAdvisor(input: OperationalDraftGateInput) {
  const classificationGate = canOperationalDraftAdvanceToAdvisor(input);
  const missing = [...classificationGate.missing];

  if (!input.evidenceBackedRebuild) missing.push("evidence_backed_rebuild");
  if (input.rejected) missing.push("draft_not_rejected");
  if (input.status !== RecommendationStatus.ANALYST_REVIEWED) missing.push("analyst_reviewed_state");

  return {
    allowed: missing.length === 0,
    missing: [...new Set(missing)],
    ticketId: "Operational-5-T11-EXEC" as const,
  };
}

export function buildOperationalDraftNegativeGateMatrix(input: {
  rejectedDraftGate: ReturnType<typeof canOperationalEvidenceBackedDraftMoveToAdvisor>;
  unclassifiedDraftGate: ReturnType<typeof canOperationalDraftAdvanceToAdvisor>;
  unsupportedClaimFeedback: ReturnType<typeof operationalUnsupportedClaimFeedbackState>;
  leakageSweep: ReturnType<typeof sweepOperationalAiDraftLeakageSurfaces>;
}) {
  const rows = [
    {
      caseId: "unsupported_claim",
      blocked: input.unsupportedClaimFeedback.clientVisible === false,
      negativeProof: "unsupported claim details are internal-only",
    },
    {
      caseId: "unclassified_draft",
      blocked: !input.unclassifiedDraftGate.allowed,
      negativeProof: "unclassified draft cannot advance to advisor approval",
    },
    {
      caseId: "rejected_draft",
      blocked: !input.rejectedDraftGate.allowed,
      negativeProof: "rejected draft cannot move to advisor/compliance handoff",
    },
    {
      caseId: "client_or_export_leakage",
      blocked: input.leakageSweep.some((entry) => entry.blocked),
      negativeProof: "AI draft/internal rationale payload is blocked from client/export surfaces",
    },
  ];

  return {
    allNegativeCasesCovered: rows.every((row) => row.blocked),
    rows,
    ticketId: "Operational-5-T12-EXEC" as const,
  };
}

export function createOperationalDraftWorkflowClosureNotes(input: {
  serviceFiles: string[];
  testFiles: string[];
  routeFiles: string[];
  proofNotes: string[];
}) {
  const missing: string[] = [];

  if (input.serviceFiles.length === 0) missing.push("service_files");
  if (input.testFiles.length === 0) missing.push("test_files");
  if (input.proofNotes.length === 0) missing.push("proof_notes");

  return {
    claimUsesDemoOnlyBehavior: false,
    files: {
      routes: input.routeFiles,
      services: input.serviceFiles,
      tests: input.testFiles,
    },
    missing,
    proofNotes: input.proofNotes,
    readyForCompletionClaim: missing.length === 0,
    ticketId: "Operational-5-T13-EXEC" as const,
  };
}

export function certifyOperationalAiDraftGovernanceExit(input: {
  completedTickets: OperationalStage5TicketId[];
  closureNotes: ReturnType<typeof createOperationalDraftWorkflowClosureNotes>;
  negativeGateMatrix: ReturnType<typeof buildOperationalDraftNegativeGateMatrix>;
  payloadBlockers: string[];
}) {
  const completed = new Set(input.completedTickets);
  const missingTickets = operationalStage5TicketOrder.filter((ticketId) => !completed.has(ticketId));
  const missing: string[] = [];

  if (missingTickets.length > 0) missing.push("stage5_ticket_coverage");
  if (!input.negativeGateMatrix.allNegativeCasesCovered) missing.push("negative_gate_matrix");
  if (!input.closureNotes.readyForCompletionClaim) missing.push("closure_notes");
  if (input.payloadBlockers.length > 0) missing.push("payload_blockers_explicit");

  return {
    certified: missing.length === 0,
    missing,
    missingTickets,
    payloadBlockers: input.payloadBlockers,
    status: missing.length === 0 ? "Operational_PHASE5_AI_GOVERNANCE_READY" : "Operational_PHASE5_AI_GOVERNANCE_BLOCKED",
    ticketId: "Operational-5-T14-EXEC" as const,
  };
}
