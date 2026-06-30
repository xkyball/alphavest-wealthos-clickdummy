import {
  AuditResult,
  ComplianceStatus,
  DraftClassificationKind,
  DraftRiskLevel,
  EvidenceStatus,
  InternalDraftStatus,
  ObjectType,
  ProcessInstanceStatus,
  ProcessStepStatus,
  type ObjectType as PrismaObjectType,
  type Prisma,
  type PrismaClient,
  RecommendationStatus,
  ReviewStatus,
  UnsupportedClaimStatus,
  VisibilityStatus,
} from "@prisma/client";

import {
  demoPlatformTenantId,
  demoTenants,
  requireDemoSession,
  type DemoRoleKey,
  type DemoTenantSlug,
} from "@/lib/demo-session";
import { requireActorContext } from "@/lib/control-layer/actor-context";
import { evaluateControlPermission } from "@/lib/control-layer/permission-decision";
import { resolveTenantObjectScope } from "@/lib/control-layer/scope-resolver";
import { auditService, AuditPersistenceRequiredError } from "@/lib/audit-service";
import {
  advisorApprovalConfirmationText,
  advisorApprovalTransitionFor,
  type AdvisorApprovalWorkflowAction,
} from "@/lib/recommendation-review-workflow-validation";
import { workflow05TypedWorkflowBoundaryMode } from "@/lib/advisory-workflow-contract";
import type { PermissionDecision } from "@/lib/permission-engine";
import {
  evaluatePp003DraftLifecycleGate,
  type Pp003DraftLifecycleStatus,
  type Pp003UnsupportedClaimStatus,
} from "@/lib/pp003-advice-boundary-contract";
import { runReleaseSpineCommand } from "@/lib/release-spine-command-surface";
import { transitionProcess, type ProcessRuntime } from "@/lib/process-runtime/process-state-machine";
import { requireProcessDefinition } from "@/lib/process-runtime/process-registry";
import { stableId } from "@/lib/stable-id";
import { visibilityEngine, type RecommendationPayloadProjection } from "@/lib/visibility-engine";
import { workflowGate } from "@/lib/workflow-gate";
import type {
  ObjectType as DomainObjectType,
  PermissionAction,
  RecommendationStatus as DomainRecommendationStatus,
  Sensitivity,
  VisibilityStatus as DomainVisibilityStatus,
  WorkflowStatus,
} from "@/lib/domain-types";

type TypedWorkflowMutationInput = {
  actionId: string;
  auditPersistenceAvailable?: boolean;
  actorRoleKey: DemoRoleKey;
  auditResult?: AuditResult;
  clientTenantId: string;
  eventType: string;
  evidenceRecordId?: string | null;
  metadataJson?: Prisma.InputJsonObject;
  nextState: string;
  permissionAction: PermissionAction;
  permissionObjectType?: DomainObjectType;
  platformTenantId?: string;
  previousState: string;
  reason?: string | null;
  sensitivity?: Sensitivity;
  targetId: string;
  targetType: PrismaObjectType;
  tenantSlug: DemoTenantSlug;
  visibilityStatus?: DomainVisibilityStatus;
  workflowState?: WorkflowStatus;
};

type AdvisorApprovalWorkflowInput = {
  action: AdvisorApprovalWorkflowAction;
  actorRoleKey: DemoRoleKey;
  auditPersistenceAvailable?: boolean;
  confirmationText?: string;
  evidenceIds?: string[];
  reason?: string;
  targetId: string;
};

type AdvisorApprovalState = {
  advisorApproval: {
    approvedAt: string | null;
    id: string | null;
    notes: string | null;
    status: string | null;
  };
  complianceReview: {
    blockedAt: string | null;
    evidenceComplete: boolean | null;
    id: string | null;
    releaseNotes: string | null;
    releasedAt: string | null;
    status: string | null;
  };
  evidence: {
    id: string;
    status: string;
    visibilityStatus: string;
  }[];
  recommendation: {
    clientVisible: boolean;
    id: string;
    status: string;
  };
};

type ComplianceReleasePreconditions = {
  advisorApproval: boolean;
  auditReady: boolean;
  canonicalMissing: string[];
  compliancePermission: boolean;
  evidenceAccepted: boolean;
  evidenceProvided: boolean;
  evidenceScoped: boolean;
  internalDraftId: string | null;
  payloadReady: boolean;
  processRuntime: {
    advisorApprovalProcessInstanceId: string | null;
    advisorApprovalStepId: string | null;
    advisorApprovalStepSatisfied: boolean;
    complianceReleaseProcessInstanceId: string | null;
    complianceReleaseStepActive: boolean;
    complianceReleaseStepId: string | null;
    missing: string[];
  };
  processRuntimeReady: boolean;
  releaseSpineCanRelease: boolean;
  missing: string[];
  selectedEvidenceRecordId: string | null;
};

type AdvisorApprovalWorkflowResult = {
  action: AdvisorApprovalWorkflowAction;
  auditEventId: string;
  auditRows: number;
  canonicalCommand: string;
  canonicalState: string;
  clientVisible: boolean;
  decisionLinkage: {
    decisionRows: number;
    mode: "metadata_only" | "released_to_client";
  };
  gateMissing: string[];
  gatePassed: boolean;
  message: string;
  mutated: boolean;
  permission: {
    allowed: boolean;
    reason: string;
    requiresAudit: boolean;
    requiresComplianceReview: boolean;
  };
  clientProjection: RecommendationPayloadProjection | null;
  releasePreconditions: ComplianceReleasePreconditions | null;
  reloadedState: AdvisorApprovalState;
  workflowType: "advisor-approval";
};

export class AuditPersistenceUnavailableError extends Error {
  constructor(public readonly actionId: string) {
    super("Required audit persistence is unavailable; safety action was not applied.");
  }
}

export class AdvisorApprovalWorkflowError extends Error {
  constructor(
    message: string,
    public readonly status = 409,
    public readonly details?: {
      gateMissing?: string[];
      releasePreconditions?: ComplianceReleasePreconditions;
    },
  ) {
    super(message);
  }
}

type TypedWorkflowMutationHelpers = {
  permission: PermissionDecision;
  session: ReturnType<typeof requireDemoSession>;
};

export type TypedWorkflowMutationResult<T extends Record<string, unknown>> = T & {
  auditEventId: string;
  auditRows: number;
  permission: {
    allowed: boolean;
    reason: string;
    requiresAudit: boolean;
    requiresComplianceReview: boolean;
  };
};

export async function runTypedWorkflowMutation<T extends Record<string, unknown>>(
  prisma: PrismaClient,
  input: TypedWorkflowMutationInput,
  mutate: (
    tx: Prisma.TransactionClient,
    helpers: TypedWorkflowMutationHelpers,
  ) => Promise<T>,
): Promise<TypedWorkflowMutationResult<T>> {
  const actorContext = requireActorContext({
    roleKey: input.actorRoleKey,
    tenantSlug: input.tenantSlug,
  });
  const session = actorContext.session;
  const permissionObjectType = input.permissionObjectType ?? (input.targetType as DomainObjectType);
  const subject = {
    objectId: input.targetId,
    objectType: permissionObjectType,
    sensitivity: input.sensitivity ?? "CONFIDENTIAL",
    clientTenantId: input.clientTenantId,
    visibilityStatus: input.visibilityStatus ?? "COMPLIANCE_VISIBLE",
    workflowState: input.workflowState,
  } as const;
  const scopeResolution = resolveTenantObjectScope(actorContext, {
    allowedObjectIds: [input.targetId],
    clientTenantId: input.clientTenantId,
    objectId: input.targetId,
    objectType: permissionObjectType,
    requireObjectScope: true,
  });
  const permission = scopeResolution.allowed
    ? evaluateControlPermission({
        action: input.permissionAction,
        actorContext,
        objectScope: scopeResolution.objectScope,
        subject,
      })
    : {
        allowed: false,
        demoMode: true as const,
        reason: scopeResolution.reason,
        reasonCode: scopeResolution.reasonCode,
        requiresAudit: true,
        requiresComplianceReview: false,
        requiresSecondConfirmation: true,
      };
  const platformTenantId = input.platformTenantId ?? demoPlatformTenantId;

  return prisma.$transaction(async (tx) => {
    if (!permission.allowed) {
      auditService.assertCriticalAuditWritable({
        action: input.permissionAction,
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        auditPersistenceAvailable: input.auditPersistenceAvailable,
        clientTenantId: input.clientTenantId,
        eventType: input.eventType,
        nextState: input.previousState,
        platformTenantId,
        previousState: input.previousState,
        reason: permission.reason,
        result: AuditResult.DENIED,
        targetId: input.targetId,
        targetType: input.targetType as DomainObjectType,
      });

      const deniedAudit = await tx.auditEvent.create({
        data: {
          actorRoleKey: session.role.key,
          actorUserId: session.actor.id,
          clientTenantId: input.clientTenantId,
          eventType: input.eventType,
          evidenceRecordId: input.evidenceRecordId ?? null,
          metadataJson: {
            actionId: input.actionId,
            ...auditService.criticalAuditMetadata({
              action: input.permissionAction,
              actorRoleKey: session.role.key,
              actorUserId: session.actor.id,
              auditPersistenceAvailable: input.auditPersistenceAvailable,
              clientTenantId: input.clientTenantId,
              eventType: input.eventType,
              nextState: input.previousState,
              platformTenantId,
              previousState: input.previousState,
              reason: permission.reason,
              result: AuditResult.DENIED,
              targetId: input.targetId,
              targetType: input.targetType as DomainObjectType,
            }),
            demoMode: true,
            noRealAuth: true,
            permission,
            scopeResolution,
            ...(input.metadataJson ?? {}),
          },
          nextState: input.previousState,
          platformTenantId,
          previousState: input.previousState,
          reason: permission.reason,
          result: AuditResult.DENIED,
          targetId: input.targetId,
          targetType: input.targetType,
        },
      });

      return {
        auditEventId: deniedAudit.id,
        auditRows: 1,
        permission: {
          allowed: permission.allowed,
          reason: permission.reason,
          requiresAudit: permission.requiresAudit,
          requiresComplianceReview: permission.requiresComplianceReview,
        },
      } as TypedWorkflowMutationResult<T>;
    }

    try {
      auditService.assertCriticalAuditWritable({
        action: input.permissionAction,
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        auditPersistenceAvailable: input.auditPersistenceAvailable,
        clientTenantId: input.clientTenantId,
        eventType: input.eventType,
        nextState: input.nextState,
        platformTenantId,
        previousState: input.previousState,
        reason: input.reason ?? permission.reason,
        result: input.auditResult ?? AuditResult.SUCCESS,
        targetId: input.targetId,
        targetType: input.targetType as DomainObjectType,
      });
    } catch (error) {
      if (error instanceof AuditPersistenceRequiredError) {
        throw new AuditPersistenceUnavailableError(input.actionId);
      }

      throw error;
    }

    if (input.auditPersistenceAvailable === false) {
      throw new AuditPersistenceUnavailableError(input.actionId);
    }

    const mutationResult = await mutate(tx, { permission, session });
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: input.clientTenantId,
        eventType: input.eventType,
        evidenceRecordId: input.evidenceRecordId ?? null,
        metadataJson: {
          actionId: input.actionId,
          ...auditService.criticalAuditMetadata({
            action: input.permissionAction,
            actorRoleKey: session.role.key,
            actorUserId: session.actor.id,
            auditPersistenceAvailable: input.auditPersistenceAvailable,
            clientTenantId: input.clientTenantId,
            eventType: input.eventType,
            nextState: input.nextState,
            platformTenantId,
            previousState: input.previousState,
            reason: input.reason ?? permission.reason,
            result: input.auditResult ?? AuditResult.SUCCESS,
            targetId: input.targetId,
            targetType: input.targetType as DomainObjectType,
          }),
          demoMode: true,
          noRealAuth: true,
          permission,
          scopeResolution,
          ...(input.metadataJson ?? {}),
        },
        nextState: input.nextState,
        platformTenantId,
        previousState: input.previousState,
        reason: input.reason ?? permission.reason,
        result: input.auditResult ?? AuditResult.SUCCESS,
        targetId: input.targetId,
        targetType: input.targetType,
      },
    });

    return {
      ...mutationResult,
      auditEventId: audit.id,
      auditRows: 1,
      permission: {
        allowed: permission.allowed,
        reason: permission.reason,
        requiresAudit: permission.requiresAudit,
        requiresComplianceReview: permission.requiresComplianceReview,
      },
    };
  });
}

function typedActionPermission(action: AdvisorApprovalWorkflowAction): PermissionAction {
  return advisorApprovalTransitionFor(action).permissionAction;
}

function expectedTypedRole(action: AdvisorApprovalWorkflowAction): DemoRoleKey {
  return advisorApprovalTransitionFor(action).requiredRole;
}

function typedActionNextState(action: AdvisorApprovalWorkflowAction) {
  return advisorApprovalTransitionFor(action).nextRecommendationStatus as RecommendationStatus;
}

function typedEventType(action: AdvisorApprovalWorkflowAction) {
  return `advisor_approval.${action}`;
}

function typedAuditResult(action: AdvisorApprovalWorkflowAction) {
  return advisorApprovalTransitionFor(action).auditResult as AuditResult;
}

function typedCanonicalCommand(action: AdvisorApprovalWorkflowAction) {
  return advisorApprovalTransitionFor(action).canonicalCommand;
}

function typedCanonicalState(action: AdvisorApprovalWorkflowAction) {
  return advisorApprovalTransitionFor(action).canonicalState;
}

function tenantSlugForId(clientTenantId: string): DemoTenantSlug {
  const tenant = demoTenants.find((item) => item.id === clientTenantId);
  if (!tenant) {
    throw new AdvisorApprovalWorkflowError("Recommendation tenant is not part of the configured tenant set.");
  }

  return tenant.slug;
}

function assertTypedConfirmation(input: AdvisorApprovalWorkflowInput) {
  const requiredConfirmation = advisorApprovalConfirmationText[input.action];

  if (!requiredConfirmation) {
    return;
  }

  if ((input.confirmationText ?? "").trim() !== requiredConfirmation) {
    throw new AdvisorApprovalWorkflowError(
      `${requiredConfirmation} confirmation text is required before ${input.action}.`,
      400,
    );
  }
}

function hasAcceptedEvidence(record: { status: EvidenceStatus }) {
  return record.status === EvidenceStatus.VALIDATED || record.status === EvidenceStatus.RELEASED;
}

function isEvidenceScopedToRecommendation(
  record: {
    items: Array<{
      sourceObjectId: string;
      sourceObjectType: ObjectType;
    }>;
    relatedObjectId: string;
    relatedObjectType: ObjectType;
  },
  targetId: string,
) {
  const directlyScoped = record.relatedObjectType === ObjectType.RECOMMENDATION && record.relatedObjectId === targetId;
  const itemScoped = record.items.some(
    (item) => item.sourceObjectType === ObjectType.RECOMMENDATION && item.sourceObjectId === targetId,
  );

  return directlyScoped || itemScoped;
}

function acceptedScopedEvidenceRecords<
  T extends {
    items: Array<{
      sourceObjectId: string;
      sourceObjectType: ObjectType;
    }>;
    relatedObjectId: string;
    relatedObjectType: ObjectType;
    status: EvidenceStatus;
  },
>(records: T[], targetId: string) {
  return records.filter((record) => hasAcceptedEvidence(record) && isEvidenceScopedToRecommendation(record, targetId));
}

const advisorApprovalInternalDraftKey = "typed-advisor-approval-release-spine";
const advisorApprovalClientSafeSummary =
  "Compliance-ready client summary for a released liquidity governance next step.";

function pp003DraftStatus(status: InternalDraftStatus): Pp003DraftLifecycleStatus {
  return status;
}

function pp003UnsupportedClaimStatus(status: UnsupportedClaimStatus): Pp003UnsupportedClaimStatus {
  return status;
}

async function upsertAdvisorApprovalInternalDraft(
  tx: Prisma.TransactionClient,
  input: {
    actorRoleKey: DemoRoleKey;
    actorUserId: string | null;
    clientSafeSummary?: string;
    recommendation: {
      clientTenantId: string;
      id: string;
      title: string;
    };
    reason: string;
    status: InternalDraftStatus;
    traceType: string;
  },
) {
  const draft = await tx.internalDraft.upsert({
    create: {
      clientTenantId: input.recommendation.clientTenantId,
      createdByUserId: input.actorUserId,
      draftClientSummary:
        input.clientSafeSummary ?? "Internal draft awaiting evidence-backed rebuild. Compliance release remains required.",
      draftKey: advisorApprovalInternalDraftKey,
      id: stableId(`internal-draft:advisor-approval:${input.recommendation.id}`),
      internalRationale: input.reason,
      processId: "typed-advisor-approval",
      recommendationId: input.recommendation.id,
      sourceObjectId: input.recommendation.id,
      sourceObjectType: ObjectType.RECOMMENDATION,
      sourceRefsJson: ["typed-workflow-command-bus", "advisor-approval", "release-spine"],
      status: input.status,
      title: `${input.recommendation.title} internal draft spine`,
    },
    update: {
      draftClientSummary:
        input.clientSafeSummary ?? "Internal draft awaiting evidence-backed rebuild. Compliance release remains required.",
      internalRationale: input.reason,
      processId: "typed-advisor-approval",
      sourceObjectId: input.recommendation.id,
      sourceObjectType: ObjectType.RECOMMENDATION,
      sourceRefsJson: ["typed-workflow-command-bus", "advisor-approval", "release-spine"],
      status: input.status,
      title: `${input.recommendation.title} internal draft spine`,
    },
    where: {
      recommendationId_draftKey: {
        draftKey: advisorApprovalInternalDraftKey,
        recommendationId: input.recommendation.id,
      },
    },
  });

  await tx.draftClassification.create({
    data: {
      classifiedByRoleKey: input.actorRoleKey,
      classifiedByUserId: input.actorUserId,
      classification: DraftClassificationKind.ADVICE_RELEVANT,
      internalDraftId: draft.id,
      reason: input.reason,
      riskLevel: DraftRiskLevel.MEDIUM,
      unsupportedClaimsClear: true,
    },
  });

  await tx.draftTrace.create({
    data: {
      actorRoleKey: input.actorRoleKey,
      actorUserId: input.actorUserId,
      internalDraftId: draft.id,
      metadataJson: {
        commandBus: "typed-workflow-command-bus",
        releaseSpine: true,
        storage: "internal_drafts",
      },
      reason: input.reason,
      traceType: input.traceType,
    },
  });

  return draft;
}

async function markAdvisorApprovalInternalDraftReady(
  tx: Prisma.TransactionClient,
  input: {
    actorRoleKey: DemoRoleKey;
    actorUserId: string | null;
    reason: string;
    recommendationId: string;
  },
) {
  const draft = await tx.internalDraft.findFirst({
    include: {
      classifications: { orderBy: { createdAt: "desc" }, take: 1 },
      unsupportedClaims: true,
    },
    orderBy: { updatedAt: "desc" },
    where: {
      draftKey: advisorApprovalInternalDraftKey,
      recommendationId: input.recommendationId,
    },
  });

  if (!draft) {
    return null;
  }

  const evidenceRecords = await tx.evidenceRecord.findMany({
    include: { items: true },
    where: {
      OR: [
        {
          relatedObjectId: input.recommendationId,
          relatedObjectType: ObjectType.RECOMMENDATION,
        },
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
  });
  const canonicalEvidenceReady = acceptedScopedEvidenceRecords(evidenceRecords, input.recommendationId).length > 0;
  const lifecycleGate = evaluatePp003DraftLifecycleGate({
    canonicalEvidenceAudited: canonicalEvidenceReady,
    canonicalEvidencePath: canonicalEvidenceReady ? "PP002_CANONICAL_PROCESS" : "NONE",
    canonicalEvidenceSufficient: canonicalEvidenceReady,
    classified: Boolean(draft.classifications[0]),
    clientVisible: false,
    draftStatus: pp003DraftStatus(draft.status),
    promotionTarget: "advisor_candidate",
    unsupportedClaims: draft.unsupportedClaims.map((claim) => ({
      status: pp003UnsupportedClaimStatus(claim.status),
    })),
  });

  if (!lifecycleGate.allowed) {
    return null;
  }

  const updatedDraft = await tx.internalDraft.update({
    data: { status: InternalDraftStatus.ADVISOR_READY },
    where: { id: draft.id },
  });

  await tx.draftTrace.create({
    data: {
      actorRoleKey: input.actorRoleKey,
      actorUserId: input.actorUserId,
      internalDraftId: draft.id,
      metadataJson: {
        commandBus: "typed-workflow-command-bus",
        releaseSpine: true,
        storage: "internal_drafts",
      },
      reason: input.reason,
      traceType: "advisor_approval.internal_draft_ready",
    },
  });

  return updatedDraft;
}

async function getReleaseReadyInternalDraftPayload(tx: Prisma.TransactionClient, recommendationId: string) {
  const draft = await tx.internalDraft.findFirst({
    include: {
      classifications: { orderBy: { createdAt: "desc" }, take: 1 },
      unsupportedClaims: { where: { status: UnsupportedClaimStatus.NEEDS_EVIDENCE } },
    },
    orderBy: { updatedAt: "desc" },
    where: {
      draftKey: advisorApprovalInternalDraftKey,
      recommendationId,
    },
  });
  const latestClassification = draft?.classifications[0] ?? null;
  const clientSummary = draft?.draftClientSummary.trim() ? draft.draftClientSummary : null;
  const rationaleCaptured = Boolean(draft?.internalRationale.trim());
  const unsupportedClaimsClear =
    latestClassification?.unsupportedClaimsClear === true && (draft?.unsupportedClaims.length ?? 0) === 0;
  const ready =
    Boolean(clientSummary) &&
    rationaleCaptured &&
    unsupportedClaimsClear &&
    draft?.status === InternalDraftStatus.ADVISOR_READY;

  return {
    clientSummary,
    internalDraftId: draft?.id ?? null,
    rationaleCaptured,
    ready,
  };
}

const advisorApprovalProcessId = "BP-054";
const advisorApprovalProcessStepId = "BP-054-S03";
const complianceReleaseProcessId = "BP-063";
const complianceReleaseProcessStepId = "BP-063-S03";

type AdvisorWorkflowProcessInstance = Prisma.ProcessInstanceGetPayload<{
  include: {
    processDefinition: true;
    steps: { orderBy: { sequence: "asc" } };
  };
}>;

type ProcessRuntimeGate = {
  advisorApprovalProcessInstanceId: string | null;
  advisorApprovalStepId: string | null;
  advisorApprovalStepSatisfied: boolean;
  complianceReleaseProcessInstanceId: string | null;
  complianceReleaseStepActive: boolean;
  complianceReleaseStepId: string | null;
  missing: string[];
};

function processRuntimeFromInstance(instance: AdvisorWorkflowProcessInstance): ProcessRuntime {
  return {
    blockerCode: instance.blockerCode ?? undefined,
    blockerReason: instance.blockerReason ?? undefined,
    currentStepId: instance.currentStepId ?? undefined,
    definition: requireProcessDefinition(instance.processDefinition.processId),
    processId: instance.processDefinition.processId,
    status: instance.status as ProcessRuntime["status"],
    steps: instance.steps.map((step) => ({
      actor: step.actor,
      blockerCode: step.blockerCode ?? undefined,
      blockerReason: step.blockerReason ?? undefined,
      sequence: step.sequence,
      status: step.status as ProcessRuntime["steps"][number]["status"],
      stepId: step.stepId,
      stepLabel: step.stepLabel,
    })),
  };
}

async function loadRecommendationProcessInstance(
  tx: Prisma.TransactionClient,
  input: {
    clientTenantId: string;
    processId: string;
    recommendationId: string;
  },
) {
  const link = await tx.processObjectLink.findFirst({
    include: {
      processInstance: {
        include: {
          processDefinition: true,
          steps: { orderBy: { sequence: "asc" } },
        },
      },
    },
    where: {
      objectId: input.recommendationId,
      objectType: ObjectType.RECOMMENDATION,
      processInstance: {
        clientTenantId: input.clientTenantId,
        processDefinition: { processId: input.processId },
      },
    },
  });

  return link?.processInstance ?? null;
}

async function evaluateProcessRuntimeGate(
  tx: Prisma.TransactionClient,
  input: { clientTenantId: string; recommendationId: string },
): Promise<ProcessRuntimeGate> {
  const [advisorProcess, complianceProcess] = await Promise.all([
    loadRecommendationProcessInstance(tx, {
      clientTenantId: input.clientTenantId,
      processId: advisorApprovalProcessId,
      recommendationId: input.recommendationId,
    }),
    loadRecommendationProcessInstance(tx, {
      clientTenantId: input.clientTenantId,
      processId: complianceReleaseProcessId,
      recommendationId: input.recommendationId,
    }),
  ]);
  const advisorStep = advisorProcess?.steps.find((step) => step.stepId === advisorApprovalProcessStepId) ?? null;
  const complianceStep = complianceProcess?.steps.find((step) => step.stepId === complianceReleaseProcessStepId) ?? null;
  const advisorApprovalStepSatisfied = advisorStep?.status === ProcessStepStatus.COMPLETED;
  const complianceReleaseStepActive = complianceStep?.status === ProcessStepStatus.ACTIVE;
  const missing: string[] = [];

  if (!advisorProcess || !complianceProcess) missing.push("process_instance");
  if (!advisorApprovalStepSatisfied) missing.push("process_advisor_approval_step");
  if (!complianceReleaseStepActive) missing.push("process_compliance_release_step");

  return {
    advisorApprovalProcessInstanceId: advisorProcess?.id ?? null,
    advisorApprovalStepId: advisorStep?.stepId ?? null,
    advisorApprovalStepSatisfied,
    complianceReleaseProcessInstanceId: complianceProcess?.id ?? null,
    complianceReleaseStepActive,
    complianceReleaseStepId: complianceStep?.stepId ?? null,
    missing: [...new Set(missing)],
  };
}

async function completeAdvisorWorkflowProcessStep(
  tx: Prisma.TransactionClient,
  input: {
    actorRoleKey: DemoRoleKey;
    actorUserId: string | null;
    auditPersistenceAvailable?: boolean;
    clientTenantId: string;
    processId: string;
    reason: string;
    recommendationId: string;
    stepId: string;
  },
) {
  if (input.auditPersistenceAvailable === false) {
    throw new AdvisorApprovalWorkflowError("Audit persistence unavailable; process mutation blocked.", 409, {
      gateMissing: ["audit_persistence"],
    });
  }

  const instance = await loadRecommendationProcessInstance(tx, input);
  const currentStep = instance?.steps.find((step) => step.stepId === input.stepId) ?? null;

  if (!instance || !currentStep) {
    throw new AdvisorApprovalWorkflowError("Recommendation is not linked to the required process runtime step.", 409, {
      gateMissing: ["process_instance", "process_step"],
    });
  }

  if (currentStep.status === ProcessStepStatus.COMPLETED) {
    return {
      fromStepId: currentStep.stepId,
      processId: instance.processDefinition.processId,
      processInstanceId: instance.id,
      result: AuditResult.SUCCESS,
      toStepId: instance.currentStepId,
    };
  }

  const previousRuntime = processRuntimeFromInstance(instance);
  const transitionedRuntime = transitionProcess({
    actor: {
      permissions: ["process.manage"],
      roleKey: input.actorRoleKey,
    },
    command: "COMPLETE_STEP",
    fromStepId: input.stepId,
    process: previousRuntime,
    reason: input.reason,
  }).process;
  const nextStep = transitionedRuntime.currentStepId
    ? transitionedRuntime.steps.find((step) => step.stepId === transitionedRuntime.currentStepId)
    : undefined;
  const audit = await tx.auditEvent.create({
    data: {
      actorRoleKey: input.actorRoleKey,
      actorUserId: input.actorUserId,
      clientTenantId: input.clientTenantId,
      eventType:
        input.processId === complianceReleaseProcessId
          ? "process.compliance_release.step.completed"
          : "process.advisor_approval.step.completed",
      metadataJson: {
        command: "COMPLETE_STEP",
        fromStepId: input.stepId,
        processId: instance.processDefinition.processId,
        processRuntimeBackbone: true,
        recommendationId: input.recommendationId,
        toStepId: transitionedRuntime.currentStepId ?? null,
      },
      nextState: transitionedRuntime.status,
      platformTenantId: demoPlatformTenantId,
      previousState: instance.status,
      reason: input.reason,
      result: AuditResult.SUCCESS,
      targetId: instance.id,
      targetType: ObjectType.PROCESS,
    },
  });

  await tx.processInstance.update({
    data: {
      blockerCode: transitionedRuntime.blockerCode ?? null,
      blockerReason: transitionedRuntime.blockerReason ?? null,
      completedAt: transitionedRuntime.status === ProcessInstanceStatus.COMPLETED ? new Date() : null,
      currentSequence: nextStep?.sequence ?? null,
      currentStepId: transitionedRuntime.currentStepId ?? null,
      status: transitionedRuntime.status as ProcessInstanceStatus,
    },
    where: { id: instance.id },
  });

  for (const step of transitionedRuntime.steps) {
    const previousStep = instance.steps.find((candidate) => candidate.stepId === step.stepId);
    if (!previousStep || previousStep.status === step.status) continue;

    await tx.processStepInstance.update({
      data: {
        blockerCode: step.blockerCode ?? null,
        blockerReason: step.blockerReason ?? null,
        completedAt: step.status === ProcessStepStatus.COMPLETED ? new Date() : null,
        startedAt: step.status === ProcessStepStatus.ACTIVE && previousStep.status !== ProcessStepStatus.ACTIVE ? new Date() : undefined,
        status: step.status as ProcessStepStatus,
      },
      where: {
        processInstanceId_stepId: {
          processInstanceId: instance.id,
          stepId: step.stepId,
        },
      },
    });
  }

  await tx.processCommandRun.create({
    data: {
      actorRoleKey: input.actorRoleKey,
      actorUserId: input.actorUserId,
      auditEventId: audit.id,
      commandKey: "COMPLETE_STEP",
      fromStepId: input.stepId,
      metadataJson: {
        processRuntimeBackbone: true,
        recommendationId: input.recommendationId,
      },
      nextState: transitionedRuntime.status,
      previousState: instance.status,
      processInstanceId: instance.id,
      reason: input.reason,
      result: AuditResult.SUCCESS,
      toStepId: transitionedRuntime.currentStepId ?? null,
    },
  });

  return {
    auditEventId: audit.id,
    fromStepId: input.stepId,
    processId: instance.processDefinition.processId,
    processInstanceId: instance.id,
    result: AuditResult.SUCCESS,
    toStepId: transitionedRuntime.currentStepId ?? null,
  };
}

function evaluateComplianceReleasePreconditions(input: {
  advisorApprovalStatus: ReviewStatus;
  evidenceRecords: Array<{
    id: string;
    items: Array<{
      sourceObjectId: string;
      sourceObjectType: ObjectType;
    }>;
    relatedObjectId: string;
    relatedObjectType: ObjectType;
    status: EvidenceStatus;
  }>;
  internalDraftId: string | null;
  permissionAllowed: boolean;
  payloadReady: boolean;
  processRuntime: ProcessRuntimeGate;
  rationaleCaptured: boolean;
  targetId: string;
  auditReady?: boolean;
}) {
  const selectedEvidence = acceptedScopedEvidenceRecords(input.evidenceRecords, input.targetId)[0] ?? null;
  const evidenceMissing = !input.evidenceRecords.length
    ? ["evidence_record"]
    : selectedEvidence
      ? []
      : ["accepted_evidence", "scoped_evidence"];
  const releaseSpine = runReleaseSpineCommand({
    command: "EVALUATE_RELEASE_PRECONDITIONS",
    input: {
      advisor: { approved: input.advisorApprovalStatus === ReviewStatus.APPROVED },
      audit: { persistenceAvailable: input.auditReady ?? true },
      compliance: { permissionAllowed: input.permissionAllowed },
      evidence: {
        exportImpact: selectedEvidence ? "EXPORT_ALLOWED_FOR_SCOPED_GATE" : "EXPORT_BLOCKED_NEEDS_EVIDENCE",
        label: selectedEvidence ? "EVIDENCE_SUFFICIENT" : "EVIDENCE_INSUFFICIENT",
        missing: evidenceMissing,
        releaseImpact: selectedEvidence ? "RELEASE_ALLOWED_FOR_SCOPED_GATE" : "RELEASE_BLOCKED_NEEDS_EVIDENCE",
        sufficient: Boolean(selectedEvidence),
      },
      payload: { ready: input.payloadReady },
      processRuntime: {
        advisorApprovalStepSatisfied: input.processRuntime.advisorApprovalStepSatisfied,
        complianceReleaseStepActive: input.processRuntime.complianceReleaseStepActive,
        processId: complianceReleaseProcessId,
        processInstanceId: input.processRuntime.complianceReleaseProcessInstanceId,
      },
      rationale: { captured: input.rationaleCaptured },
      redaction: { ready: true },
    },
  });

  const preconditions: ComplianceReleasePreconditions = {
    advisorApproval: input.advisorApprovalStatus === ReviewStatus.APPROVED,
    auditReady: input.auditReady ?? true,
    canonicalMissing: releaseSpine.preconditions.missing,
    compliancePermission: input.permissionAllowed,
    evidenceAccepted: Boolean(selectedEvidence),
    evidenceProvided: input.evidenceRecords.length > 0,
    evidenceScoped: Boolean(selectedEvidence),
    internalDraftId: input.internalDraftId,
    payloadReady: input.payloadReady,
    processRuntime: input.processRuntime,
    processRuntimeReady:
      input.processRuntime.advisorApprovalStepSatisfied && input.processRuntime.complianceReleaseStepActive,
    releaseSpineCanRelease: releaseSpine.preconditions.canRelease,
    missing: [],
    selectedEvidenceRecordId: selectedEvidence?.id ?? null,
  };

  if (!preconditions.advisorApproval) {
    preconditions.missing.push("advisor_approval");
  }

  if (!preconditions.evidenceProvided) {
    preconditions.missing.push("evidence_record");
  } else {
    if (!preconditions.evidenceAccepted) {
      preconditions.missing.push("accepted_evidence");
    }

    if (!preconditions.evidenceScoped) {
      preconditions.missing.push("scoped_evidence");
    }
  }

  if (!preconditions.payloadReady) {
    preconditions.missing.push("payload_ready");
  }

  if (!preconditions.compliancePermission) {
    preconditions.missing.push("permission_check");
  }

  if (!preconditions.auditReady) {
    preconditions.missing.push("audit_persistence");
  }

  if (!preconditions.processRuntimeReady) {
    preconditions.missing.push(...preconditions.processRuntime.missing);
  }

  return preconditions;
}

function buildClientRecommendationProjection(input: {
  clientSummary: string | null;
  clientTenantId: string;
  clientVisible: boolean;
  id: string;
  status: string;
  tenantSlug: DemoTenantSlug;
}) {
  const clientSession = requireDemoSession({
    roleKey: "principal",
    tenantSlug: input.tenantSlug,
  });

  return visibilityEngine.projectRecommendationPayload(
    clientSession.actor,
    clientSession.role,
    {
      clientSummary: input.clientSummary,
      clientTenantId: input.clientTenantId,
      clientVisible: input.clientVisible,
      objectId: input.id,
      recommendationStatus: input.status as DomainRecommendationStatus,
      sensitivity: "CONFIDENTIAL",
      visibilityStatus: input.clientVisible ? "CLIENT_VISIBLE" : "COMPLIANCE_VISIBLE",
    },
    demoPlatformTenantId,
    input.clientTenantId,
  );
}

async function reloadAdvisorApprovalState(
  tx: Prisma.TransactionClient,
  targetId: string,
  evidenceIds: string[] = [],
): Promise<AdvisorApprovalState> {
  const recommendation = await tx.recommendation.findUnique({
    where: { id: targetId },
  });

  if (!recommendation) {
    throw new AdvisorApprovalWorkflowError("Recommendation target was not found.", 404);
  }

  const [advisorApproval, complianceReview, evidence] = await Promise.all([
    tx.approval.findFirst({
      where: {
        clientTenantId: recommendation.clientTenantId,
        targetId,
        targetType: ObjectType.RECOMMENDATION,
      },
      orderBy: { createdAt: "desc" },
    }),
    tx.complianceReview.findFirst({
      where: {
        clientTenantId: recommendation.clientTenantId,
        targetId,
        targetType: ObjectType.RECOMMENDATION,
      },
      orderBy: { createdAt: "desc" },
    }),
    tx.evidenceRecord.findMany({
      where: {
        clientTenantId: recommendation.clientTenantId,
        OR: [
          { relatedObjectId: targetId, relatedObjectType: ObjectType.RECOMMENDATION },
          ...(evidenceIds.length > 0 ? [{ id: { in: evidenceIds } }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    advisorApproval: {
      approvedAt: advisorApproval?.approvedAt?.toISOString() ?? null,
      id: advisorApproval?.id ?? null,
      notes: advisorApproval?.notes ?? null,
      status: advisorApproval?.status ?? null,
    },
    complianceReview: {
      blockedAt: complianceReview?.blockedAt?.toISOString() ?? null,
      evidenceComplete: complianceReview?.evidenceComplete ?? null,
      id: complianceReview?.id ?? null,
      releaseNotes: complianceReview?.releaseNotes ?? null,
      releasedAt: complianceReview?.releasedAt?.toISOString() ?? null,
      status: complianceReview?.status ?? null,
    },
    evidence: evidence.map((record) => ({
      id: record.id,
      status: record.status,
      visibilityStatus: record.visibilityStatus,
    })),
    recommendation: {
      clientVisible: recommendation.clientVisible,
      id: recommendation.id,
      status: recommendation.status,
    },
  };
}

export async function runAdvisorApprovalWorkflowMutation(
  prisma: PrismaClient,
  input: AdvisorApprovalWorkflowInput,
): Promise<AdvisorApprovalWorkflowResult> {
  assertTypedConfirmation(input);

  const recommendation = await prisma.recommendation.findUnique({
    where: { id: input.targetId },
  });

  if (!recommendation) {
    throw new AdvisorApprovalWorkflowError("Recommendation target was not found.", 404);
  }

  const tenantSlug = tenantSlugForId(recommendation.clientTenantId);
  const actorContext = requireActorContext({
    roleKey: input.actorRoleKey,
    tenantSlug,
  });
  const session = actorContext.session;
  const permissionAction = typedActionPermission(input.action);
  const scopeResolution = resolveTenantObjectScope(actorContext, {
    allowedObjectIds: [input.targetId],
    clientTenantId: recommendation.clientTenantId,
    objectId: input.targetId,
    objectType: "RECOMMENDATION",
    requireObjectScope: true,
  });
  const permission = scopeResolution.allowed
    ? evaluateControlPermission({
        action: permissionAction,
        actorContext,
        objectScope: scopeResolution.objectScope,
        subject: {
          clientTenantId: recommendation.clientTenantId,
          objectId: input.targetId,
          objectType: "RECOMMENDATION",
          sensitivity: "CONFIDENTIAL",
          visibilityStatus: "COMPLIANCE_VISIBLE",
          workflowState: "COMPLIANCE_PENDING",
        },
      })
    : {
        allowed: false,
        demoMode: true as const,
        reason: scopeResolution.reason,
        reasonCode: scopeResolution.reasonCode,
        requiresAudit: true,
        requiresComplianceReview: false,
        requiresSecondConfirmation: true,
      };
  const roleAllowed = expectedTypedRole(input.action) === input.actorRoleKey;
  const deniedReason = roleAllowed
    ? permission.reason
    : `${expectedTypedRole(input.action)} is required for ${input.action}.`;

  return prisma.$transaction(async (tx) => {
    if (!permission.allowed || !roleAllowed) {
      const audit = await tx.auditEvent.create({
        data: {
          actorRoleKey: session.role.key,
          actorUserId: session.actor.id,
          clientTenantId: recommendation.clientTenantId,
          eventType: typedEventType(input.action),
          metadataJson: {
            action: input.action,
            canonicalCommand: typedCanonicalCommand(input.action),
            canonicalState: typedCanonicalState(input.action),
            typedWorkflowBoundaryMode: workflow05TypedWorkflowBoundaryMode,
            ...auditService.criticalAuditMetadata({
              action: permissionAction,
              actorRoleKey: session.role.key,
              actorUserId: session.actor.id,
              auditPersistenceAvailable: input.auditPersistenceAvailable,
              clientTenantId: recommendation.clientTenantId,
              eventType: typedEventType(input.action),
              nextState: recommendation.status,
              platformTenantId: demoPlatformTenantId,
              previousState: recommendation.status,
              reason: deniedReason,
              result: AuditResult.DENIED,
              targetId: input.targetId,
              targetType: ObjectType.RECOMMENDATION,
            }),
            demoMode: true,
            noRealAuth: true,
            permission,
            roleAllowed,
            scopeResolution,
            workflowType: "advisor-approval",
          },
          nextState: recommendation.status,
          platformTenantId: demoPlatformTenantId,
          previousState: recommendation.status,
          reason: deniedReason,
          result: AuditResult.DENIED,
          targetId: input.targetId,
          targetType: ObjectType.RECOMMENDATION,
        },
      });
      const reloadedState = await reloadAdvisorApprovalState(tx, input.targetId, input.evidenceIds);

      return {
        action: input.action,
        auditEventId: audit.id,
        auditRows: 1,
        canonicalCommand: typedCanonicalCommand(input.action),
        canonicalState: typedCanonicalState(input.action),
        clientProjection: null,
        clientVisible: reloadedState.recommendation.clientVisible,
        decisionLinkage: {
          decisionRows: 0,
          mode: "metadata_only",
        },
        gateMissing: ["permission_check"],
        gatePassed: false,
        message: deniedReason,
        mutated: false,
        permission: {
          allowed: false,
          reason: deniedReason,
          requiresAudit: true,
          requiresComplianceReview: true,
        },
        releasePreconditions: null,
        reloadedState,
        workflowType: "advisor-approval",
      };
    }

    const now = new Date();
    const reason = input.reason ?? permission.reason;
    const [advisorApproval, complianceReview, evidenceRecords] = await Promise.all([
      tx.approval.findFirst({
        where: {
          clientTenantId: recommendation.clientTenantId,
          targetId: input.targetId,
          targetType: ObjectType.RECOMMENDATION,
        },
        orderBy: { createdAt: "desc" },
      }),
      tx.complianceReview.findFirst({
        where: {
          clientTenantId: recommendation.clientTenantId,
          targetId: input.targetId,
          targetType: ObjectType.RECOMMENDATION,
        },
        orderBy: { createdAt: "desc" },
      }),
      tx.evidenceRecord.findMany({
        include: {
          items: {
            select: {
              sourceObjectId: true,
              sourceObjectType: true,
            },
          },
        },
        where: {
          clientTenantId: recommendation.clientTenantId,
          OR: [
            { relatedObjectId: input.targetId, relatedObjectType: ObjectType.RECOMMENDATION },
            ...(input.evidenceIds?.length ? [{ id: { in: input.evidenceIds } }] : []),
          ],
        },
      }),
    ]);

    if (!advisorApproval || !complianceReview) {
      throw new AdvisorApprovalWorkflowError("Advisor approval fixture is incomplete.");
    }

    const selectedEvidenceRecordId =
      input.evidenceIds?.map((id) => evidenceRecords.find((record) => record.id === id)?.id).find(Boolean) ??
      evidenceRecords[0]?.id ??
      null;

    let gateMissing: string[] = [];
    let gatePassed = false;
    let decisionRows = 0;
    let decisionLinkageMode: "metadata_only" | "released_to_client" = "metadata_only";
    let releasePreconditions: ComplianceReleasePreconditions | null = null;
    let releasePayload: Awaited<ReturnType<typeof getReleaseReadyInternalDraftPayload>> | null = null;
    let processRuntimeMutation: Awaited<ReturnType<typeof completeAdvisorWorkflowProcessStep>> | null = null;

    if (
      (
        input.action === "request_evidence" ||
        input.action === "compliance_block" ||
        input.action === "advisor_request_evidence" ||
        input.action === "advisor_return_to_analyst"
      ) &&
      input.auditPersistenceAvailable === false
    ) {
      throw new AdvisorApprovalWorkflowError(
        "Required audit persistence is unavailable; safety action was not applied.",
        409,
        {
          gateMissing: ["audit_persistence"],
        },
      );
    }

    if (input.action === "reject_unsupported_claim") {
      await tx.recommendation.update({
        data: {
          clientVisible: false,
          status: RecommendationStatus.REVISION_REQUESTED,
          summaryInternal: `Unsupported claim rejected by analyst: ${reason}`,
        },
        where: { id: input.targetId },
      });
      await tx.approval.update({
        data: {
          approvedAt: null,
          notes: reason,
          status: ReviewStatus.REQUEST_MORE_DATA,
        },
        where: { id: advisorApproval.id },
      });
      await tx.complianceReview.update({
        data: {
          evidenceComplete: false,
          releaseNotes: reason,
          status: ComplianceStatus.NEEDS_EVIDENCE,
        },
        where: { id: complianceReview.id },
      });
      if (evidenceRecords.length > 0) {
        await tx.evidenceRecord.updateMany({
          data: {
            status: EvidenceStatus.PLACEHOLDER,
            summary: `Evidence required for rejected unsupported claim: ${reason}`,
            visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
          },
          where: { id: { in: evidenceRecords.map((record) => record.id) } },
        });
      }
      gateMissing = ["evidence_record", "advisor_approval", "compliance_release"];
    }

    if (input.action === "rebuild_with_evidence") {
      const acceptedEvidenceRecords = acceptedScopedEvidenceRecords(evidenceRecords, input.targetId);

      if (!input.evidenceIds?.length || acceptedEvidenceRecords.length === 0) {
        throw new AdvisorApprovalWorkflowError(
          "Accepted evidence scoped to this recommendation is required before rebuilding an internal draft.",
        );
      }

      await tx.recommendation.update({
        data: {
          clientVisible: false,
          status: RecommendationStatus.ANALYST_REVIEWED,
          summaryInternal: `Evidence-backed internal draft rebuilt by analyst: ${reason}`,
        },
        where: { id: input.targetId },
      });
      await upsertAdvisorApprovalInternalDraft(tx, {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientSafeSummary: advisorApprovalClientSafeSummary,
        recommendation,
        reason,
        status: InternalDraftStatus.REBUILT_WITH_EVIDENCE,
        traceType: "advisor_approval.internal_draft_rebuilt_with_evidence",
      });
      await tx.unsupportedClaim.updateMany({
        data: { status: UnsupportedClaimStatus.RESOLVED },
        where: {
          internalDraft: { is: { draftKey: advisorApprovalInternalDraftKey, recommendationId: input.targetId } },
        },
      });
      await tx.approval.update({
        data: {
          approvedAt: null,
          notes: reason,
          status: ReviewStatus.IN_REVIEW,
        },
        where: { id: advisorApproval.id },
      });
      await tx.complianceReview.update({
        data: {
          evidenceComplete: true,
          releaseNotes: "Evidence-backed internal draft rebuilt; advisor and compliance release still required.",
          status: ComplianceStatus.PENDING,
        },
        where: { id: complianceReview.id },
      });
      await tx.evidenceItem.createMany({
        data: acceptedEvidenceRecords.map((record) => ({
          evidenceRecordId: record.id,
          itemType: "internal_draft_rebuild",
          sourceObjectId: input.targetId,
          sourceObjectType: ObjectType.RECOMMENDATION,
          title: "Evidence linked to Stage 4 internal draft rebuild",
          visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
        })),
      });
      gateMissing = ["advisor_approval", "compliance_release"];
    }

    if (input.action === "submit_review") {
      await tx.recommendation.update({
        data: {
          clientVisible: false,
          status: RecommendationStatus.ANALYST_REVIEWED,
        },
        where: { id: input.targetId },
      });
      await upsertAdvisorApprovalInternalDraft(tx, {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        recommendation,
        reason,
        status: InternalDraftStatus.CLASSIFIED,
        traceType: "advisor_approval.internal_draft_submitted_for_review",
      });
      await tx.approval.update({
        data: {
          notes: reason,
          status: ReviewStatus.IN_REVIEW,
        },
        where: { id: advisorApproval.id },
      });
      gateMissing = ["advisor_approval", "compliance_release"];
    }

    if (input.action === "advisor_approve") {
      processRuntimeMutation = await completeAdvisorWorkflowProcessStep(tx, {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        auditPersistenceAvailable: input.auditPersistenceAvailable,
        clientTenantId: recommendation.clientTenantId,
        processId: advisorApprovalProcessId,
        reason,
        recommendationId: input.targetId,
        stepId: advisorApprovalProcessStepId,
      });
      await markAdvisorApprovalInternalDraftReady(tx, {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        reason,
        recommendationId: input.targetId,
      });
      await tx.approval.update({
        data: {
          approvedAt: now,
          notes: reason,
          status: ReviewStatus.APPROVED,
        },
        where: { id: advisorApproval.id },
      });
      await tx.recommendation.update({
        data: {
          clientVisible: false,
          status: RecommendationStatus.COMPLIANCE_PENDING,
        },
        where: { id: input.targetId },
      });
      await tx.complianceReview.update({
        data: {
          blockedAt: null,
          releasedAt: null,
          status: ComplianceStatus.PENDING,
        },
        where: { id: complianceReview.id },
      });
      gateMissing = ["compliance_release"];
    }

    if (input.action === "advisor_request_evidence") {
      await tx.approval.update({
        data: {
          approvedAt: null,
          notes: reason,
          status: ReviewStatus.REQUEST_MORE_DATA,
        },
        where: { id: advisorApproval.id },
      });
      await tx.recommendation.update({
        data: {
          clientVisible: false,
          status: RecommendationStatus.MORE_DATA_REQUESTED,
          summaryInternal: `Advisor requested more evidence: ${reason}`,
        },
        where: { id: input.targetId },
      });
      await tx.complianceReview.update({
        data: {
          blockedAt: null,
          evidenceComplete: false,
          releaseNotes: reason,
          releasedAt: null,
          status: ComplianceStatus.NEEDS_EVIDENCE,
        },
        where: { id: complianceReview.id },
      });
      if (evidenceRecords.length > 0) {
        await tx.evidenceRecord.updateMany({
          data: {
            status: EvidenceStatus.PLACEHOLDER,
            summary: reason,
            visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
          },
          where: { id: { in: evidenceRecords.map((record) => record.id) } },
        });
        await tx.evidenceItem.createMany({
          data: evidenceRecords.map((record) => ({
            evidenceRecordId: record.id,
            itemType: "advisor_evidence_request",
            sourceObjectId: input.targetId,
            sourceObjectType: ObjectType.RECOMMENDATION,
            title: "Advisor requested additional evidence",
            visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
          })),
        });
      }
      gateMissing = ["evidence_record", "advisor_approval", "compliance_release"];
    }

    if (input.action === "advisor_return_to_analyst") {
      await tx.approval.update({
        data: {
          approvedAt: null,
          notes: reason,
          status: ReviewStatus.REVISED,
        },
        where: { id: advisorApproval.id },
      });
      await tx.recommendation.update({
        data: {
          clientVisible: false,
          status: RecommendationStatus.REVISION_REQUESTED,
          summaryInternal: `Advisor returned package to analyst: ${reason}`,
        },
        where: { id: input.targetId },
      });
      await tx.complianceReview.update({
        data: {
          blockedAt: null,
          evidenceComplete: false,
          releaseNotes: reason,
          releasedAt: null,
          status: ComplianceStatus.PENDING,
        },
        where: { id: complianceReview.id },
      });
      await upsertAdvisorApprovalInternalDraft(tx, {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        recommendation,
        reason,
        status: InternalDraftStatus.REVISION_REQUESTED,
        traceType: "advisor_approval.returned_to_analyst",
      });
      gateMissing = ["advisor_approval", "compliance_release"];
    }

    if (input.action === "request_evidence") {
      await tx.complianceReview.update({
        data: {
          blockedAt: null,
          evidenceComplete: false,
          releaseNotes: reason,
          releasedAt: null,
          status: ComplianceStatus.NEEDS_EVIDENCE,
        },
        where: { id: complianceReview.id },
      });
      await tx.recommendation.update({
        data: {
          clientVisible: false,
          status: RecommendationStatus.MORE_DATA_REQUESTED,
        },
        where: { id: input.targetId },
      });
      if (evidenceRecords.length > 0) {
        await tx.evidenceRecord.updateMany({
          data: {
            status: EvidenceStatus.PLACEHOLDER,
            summary: reason,
            visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
          },
          where: { id: { in: evidenceRecords.map((record) => record.id) } },
        });
      }
      gateMissing = ["evidence_record", "compliance_release"];
    }

    if (input.action === "compliance_block") {
      await tx.complianceReview.update({
        data: {
          blockedAt: now,
          evidenceComplete: false,
          releaseNotes: reason,
          releasedAt: null,
          status: ComplianceStatus.BLOCKED,
        },
        where: { id: complianceReview.id },
      });
      await tx.recommendation.update({
        data: {
          clientVisible: false,
          status: RecommendationStatus.BLOCKED,
        },
        where: { id: input.targetId },
      });
      gateMissing = ["compliance_release"];
    }

    if (input.action === "compliance_release") {
      releasePayload = await getReleaseReadyInternalDraftPayload(tx, input.targetId);
      const processRuntime = await evaluateProcessRuntimeGate(tx, {
        clientTenantId: recommendation.clientTenantId,
        recommendationId: input.targetId,
      });
      releasePreconditions = evaluateComplianceReleasePreconditions({
        advisorApprovalStatus: advisorApproval.status,
        auditReady: input.auditPersistenceAvailable !== false,
        evidenceRecords,
        internalDraftId: releasePayload.internalDraftId,
        permissionAllowed: permission.allowed,
        payloadReady: releasePayload.ready,
        processRuntime,
        rationaleCaptured: releasePayload.rationaleCaptured,
        targetId: input.targetId,
      });

      if (releasePreconditions.missing.length > 0 || !releasePreconditions.releaseSpineCanRelease) {
        throw new AdvisorApprovalWorkflowError(
          `Compliance release preconditions failed: ${[
            ...new Set([...releasePreconditions.missing, ...releasePreconditions.canonicalMissing]),
          ].join(", ")}`,
          409,
          {
            gateMissing: [...new Set([...releasePreconditions.missing, ...releasePreconditions.canonicalMissing])],
            releasePreconditions,
          },
        );
      }

      const gate = workflowGate.canBecomeClientVisible({
        advisorApprovalStatus: advisorApproval.status,
        complianceStatus: "RELEASED",
        evidenceStatus: EvidenceStatus.RELEASED,
        permission,
        recommendationStatus: "RELEASED_TO_CLIENT",
      });

      if (!gate.passed) {
        throw new AdvisorApprovalWorkflowError(`Client visibility gate failed: ${gate.missing.join(", ")}`, 409, {
          gateMissing: gate.missing,
          releasePreconditions,
        });
      }

      gateMissing = gate.missing;
      gatePassed = gate.passed;
      processRuntimeMutation = await completeAdvisorWorkflowProcessStep(tx, {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        auditPersistenceAvailable: input.auditPersistenceAvailable,
        clientTenantId: recommendation.clientTenantId,
        processId: complianceReleaseProcessId,
        reason,
        recommendationId: input.targetId,
        stepId: complianceReleaseProcessStepId,
      });
      await tx.complianceReview.update({
        data: {
          blockedAt: null,
          evidenceComplete: true,
          releaseNotes: reason,
          releasedAt: now,
          status: ComplianceStatus.RELEASED,
        },
        where: { id: complianceReview.id },
      });
      await tx.recommendation.update({
        data: {
          clientVisible: true,
          status: RecommendationStatus.RELEASED_TO_CLIENT,
        },
        where: { id: input.targetId },
      });
      await tx.evidenceRecord.updateMany({
        data: {
          status: EvidenceStatus.RELEASED,
          visibilityStatus: VisibilityStatus.CLIENT_VISIBLE,
        },
        where: { id: releasePreconditions.selectedEvidenceRecordId! },
      });
      const decisionUpdate = await tx.decision.updateMany({
        data: {
          evidenceRecordId: releasePreconditions.selectedEvidenceRecordId,
          releasedToClientAt: now,
          status: "RELEASED_TO_CLIENT",
        },
        where: {
          clientTenantId: recommendation.clientTenantId,
          recommendationId: input.targetId,
        },
      });
      decisionRows = decisionUpdate.count;
      decisionLinkageMode = "released_to_client";
    }

    if (input.action === "request_evidence" || input.action === "advisor_request_evidence" || input.action === "compliance_block") {
      const decisionUpdate = await tx.decision.updateMany({
        data: {
          evidenceRecordId: selectedEvidenceRecordId,
        },
        where: {
          clientTenantId: recommendation.clientTenantId,
          recommendationId: input.targetId,
        },
      });
      decisionRows = decisionUpdate.count;
    }

    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: recommendation.clientTenantId,
        eventType: typedEventType(input.action),
        evidenceRecordId: selectedEvidenceRecordId,
        metadataJson: {
          action: input.action,
          canonicalCommand: typedCanonicalCommand(input.action),
          canonicalState: typedCanonicalState(input.action),
          ...(input.action === "advisor_approve" || input.action === "compliance_release"
            ? { processRuntimeBoundaryMode: "PROCESS_INSTANCE_STEP_STATE" }
            : { typedWorkflowBoundaryMode: workflow05TypedWorkflowBoundaryMode }),
          ...auditService.criticalAuditMetadata({
            action: permissionAction,
            actorRoleKey: session.role.key,
            actorUserId: session.actor.id,
            auditPersistenceAvailable: input.auditPersistenceAvailable,
            clientTenantId: recommendation.clientTenantId,
            eventType: typedEventType(input.action),
            nextState: typedActionNextState(input.action),
            platformTenantId: demoPlatformTenantId,
            previousState: recommendation.status,
            reason,
            result: typedAuditResult(input.action),
            targetId: input.targetId,
            targetType: ObjectType.RECOMMENDATION,
          }),
          confirmationText: input.confirmationText ?? null,
          demoMode: true,
          decisionLinkage: {
            decisionRows,
            mode: decisionLinkageMode,
          },
          evidenceIds: input.evidenceIds ?? [],
          selectedEvidenceRecordId,
          stage: "SCF-P04-P06",
          processRuntimeMutation,
          releasePreconditions,
          noRealAuth: true,
          permission,
          scopeResolution,
          workflowType: "advisor-approval",
        },
        nextState: typedActionNextState(input.action),
        platformTenantId: demoPlatformTenantId,
        previousState: recommendation.status,
        reason,
        result: typedAuditResult(input.action),
        targetId: input.targetId,
        targetType: ObjectType.RECOMMENDATION,
      },
    });
    const reloadedState = await reloadAdvisorApprovalState(tx, input.targetId, input.evidenceIds);
    const clientProjection =
      input.action === "compliance_release"
        ? buildClientRecommendationProjection({
            clientSummary: releasePayload?.clientSummary ?? null,
            clientTenantId: recommendation.clientTenantId,
            clientVisible: reloadedState.recommendation.clientVisible,
            id: recommendation.id,
            status: reloadedState.recommendation.status,
            tenantSlug,
          })
        : null;

    return {
      action: input.action,
      auditEventId: audit.id,
      auditRows: 1,
      canonicalCommand: typedCanonicalCommand(input.action),
      canonicalState: typedCanonicalState(input.action),
      clientProjection,
      clientVisible: reloadedState.recommendation.clientVisible,
      decisionLinkage: {
        decisionRows,
        mode: decisionLinkageMode,
      },
      gateMissing,
      gatePassed,
      message: `${input.action} persisted for advisor approval workflow.`,
      mutated: true,
      permission: {
        allowed: permission.allowed,
        reason: permission.reason,
        requiresAudit: permission.requiresAudit,
        requiresComplianceReview: permission.requiresComplianceReview,
      },
      releasePreconditions,
      reloadedState,
      workflowType: "advisor-approval",
    };
  });
}
