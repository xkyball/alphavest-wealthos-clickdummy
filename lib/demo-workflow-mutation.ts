import {
  ComplianceStatus,
  EvidenceStatus,
  AuditResult,
  ObjectType,
  type ObjectType as PrismaObjectType,
  type Prisma,
  type PrismaClient,
  RecommendationStatus,
  ReviewStatus,
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
  recommendationReviewConfirmationText,
  recommendationReviewTransitionFor,
  type RecommendationReviewWorkflowAction,
} from "@/lib/demo-workflow-validation";
import { wp05DemoWorkflowCompatibilityMode } from "@/lib/advisory-workflow-contract";
import type { PermissionDecision } from "@/lib/permission-engine";
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

type DemoWorkflowMutationInput = {
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

type RecommendationReviewWorkflowInput = {
  action: RecommendationReviewWorkflowAction;
  actorRoleKey: DemoRoleKey;
  auditPersistenceAvailable?: boolean;
  confirmationText?: string;
  evidenceIds?: string[];
  reason?: string;
  targetId: string;
};

type RecommendationReviewState = {
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
  compliancePermission: boolean;
  evidenceAccepted: boolean;
  evidenceProvided: boolean;
  evidenceScoped: boolean;
  payloadReady: boolean;
  missing: string[];
  selectedEvidenceRecordId: string | null;
};

type RecommendationReviewWorkflowResult = {
  action: RecommendationReviewWorkflowAction;
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
  reloadedState: RecommendationReviewState;
  workflowType: "recommendation-review";
};

export class AuditPersistenceUnavailableError extends Error {
  constructor(public readonly actionId: string) {
    super("Required audit persistence is unavailable; safety action was not applied.");
  }
}

class RecommendationReviewWorkflowError extends Error {
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

type DemoWorkflowMutationHelpers = {
  permission: PermissionDecision;
  session: ReturnType<typeof requireDemoSession>;
};

export type DemoWorkflowMutationResult<T extends Record<string, unknown>> = T & {
  auditEventId: string;
  auditRows: number;
  permission: {
    allowed: boolean;
    reason: string;
    requiresAudit: boolean;
    requiresComplianceReview: boolean;
  };
};

export async function runDemoWorkflowMutation<T extends Record<string, unknown>>(
  prisma: PrismaClient,
  input: DemoWorkflowMutationInput,
  mutate: (
    tx: Prisma.TransactionClient,
    helpers: DemoWorkflowMutationHelpers,
  ) => Promise<T>,
): Promise<DemoWorkflowMutationResult<T>> {
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
      } as DemoWorkflowMutationResult<T>;
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

function typedActionPermission(action: RecommendationReviewWorkflowAction): PermissionAction {
  return recommendationReviewTransitionFor(action).permissionAction;
}

function expectedTypedRole(action: RecommendationReviewWorkflowAction): DemoRoleKey {
  return recommendationReviewTransitionFor(action).requiredRole;
}

function typedActionNextState(action: RecommendationReviewWorkflowAction) {
  return recommendationReviewTransitionFor(action).nextRecommendationStatus as RecommendationStatus;
}

function typedEventType(action: RecommendationReviewWorkflowAction) {
  return `recommendation_review.${action}`;
}

function typedAuditResult(action: RecommendationReviewWorkflowAction) {
  return recommendationReviewTransitionFor(action).auditResult as AuditResult;
}

function typedCanonicalCommand(action: RecommendationReviewWorkflowAction) {
  return recommendationReviewTransitionFor(action).canonicalCommand;
}

function typedCanonicalState(action: RecommendationReviewWorkflowAction) {
  return recommendationReviewTransitionFor(action).canonicalState;
}

function tenantSlugForId(clientTenantId: string): DemoTenantSlug {
  const tenant = demoTenants.find((item) => item.id === clientTenantId);
  if (!tenant) {
    throw new RecommendationReviewWorkflowError("Recommendation tenant is not part of the demo tenant set.");
  }

  return tenant.slug;
}

function assertTypedConfirmation(input: RecommendationReviewWorkflowInput) {
  const requiredConfirmation = recommendationReviewConfirmationText[input.action];

  if (!requiredConfirmation) {
    return;
  }

  if ((input.confirmationText ?? "").trim() !== requiredConfirmation) {
    throw new RecommendationReviewWorkflowError(
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

function isRecord(value: Prisma.JsonValue | null | undefined): value is Prisma.JsonObject {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function hasReleaseReadyPayload(recommendation: {
  assumptionsJson: Prisma.JsonValue | null;
  clientSummaryDraft: string | null;
}) {
  if (!recommendation.clientSummaryDraft?.trim()) {
    return false;
  }

  if (isRecord(recommendation.assumptionsJson) && recommendation.assumptionsJson.aiDraftInternalOnly === true) {
    return false;
  }

  return true;
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
  permissionAllowed: boolean;
  payloadReady: boolean;
  targetId: string;
  auditReady?: boolean;
}) {
  const selectedEvidence = acceptedScopedEvidenceRecords(input.evidenceRecords, input.targetId)[0] ?? null;

  const preconditions: ComplianceReleasePreconditions = {
    advisorApproval: input.advisorApprovalStatus === ReviewStatus.APPROVED,
    auditReady: input.auditReady ?? true,
    compliancePermission: input.permissionAllowed,
    evidenceAccepted: Boolean(selectedEvidence),
    evidenceProvided: input.evidenceRecords.length > 0,
    evidenceScoped: Boolean(selectedEvidence),
    payloadReady: input.payloadReady,
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

  return preconditions;
}

function buildClientRecommendationProjection(input: {
  clientSummaryDraft: string | null;
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
      clientSummary: input.clientSummaryDraft,
      clientSummaryDraft: input.clientSummaryDraft,
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

async function reloadRecommendationReviewState(
  tx: Prisma.TransactionClient,
  targetId: string,
  evidenceIds: string[] = [],
): Promise<RecommendationReviewState> {
  const recommendation = await tx.recommendation.findUnique({
    where: { id: targetId },
  });

  if (!recommendation) {
    throw new RecommendationReviewWorkflowError("Recommendation target was not found.", 404);
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

export async function runRecommendationReviewWorkflowMutation(
  prisma: PrismaClient,
  input: RecommendationReviewWorkflowInput,
): Promise<RecommendationReviewWorkflowResult> {
  assertTypedConfirmation(input);

  const recommendation = await prisma.recommendation.findUnique({
    where: { id: input.targetId },
  });

  if (!recommendation) {
    throw new RecommendationReviewWorkflowError("Recommendation target was not found.", 404);
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
            demoWorkflowCompatibilityMode: wp05DemoWorkflowCompatibilityMode,
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
            workflowType: "recommendation-review",
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
      const reloadedState = await reloadRecommendationReviewState(tx, input.targetId, input.evidenceIds);

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
        workflowType: "recommendation-review",
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
      throw new RecommendationReviewWorkflowError("Recommendation review fixture is incomplete.");
    }

    let gateMissing: string[] = [];
    let gatePassed = false;
    let decisionRows = 0;
    let decisionLinkageMode: "metadata_only" | "released_to_client" = "metadata_only";
    let releasePreconditions: ComplianceReleasePreconditions | null = null;

    if (input.action === "reject_unsupported_claim") {
      await tx.recommendation.update({
        data: {
          assumptionsJson: {
            aiDraftInternalOnly: true,
            phase4UnsupportedClaimRejected: true,
            rejectionReason: reason,
            requiresEvidenceLinkedRebuild: true,
          },
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
        throw new RecommendationReviewWorkflowError(
          "Accepted evidence scoped to this recommendation is required before rebuilding an internal draft.",
        );
      }

      await tx.recommendation.update({
        data: {
          assumptionsJson: {
            aiDraftInternalOnly: true,
            evidenceBackedRebuild: true,
            phase4RebuildEvidenceIds: acceptedEvidenceRecords.map((record) => record.id),
            rebuildReason: reason,
          },
          clientSummaryDraft: "Internal draft rebuilt with accepted evidence. Compliance release remains required.",
          clientVisible: false,
          status: RecommendationStatus.ANALYST_REVIEWED,
          summaryInternal: `Evidence-backed internal draft rebuilt by analyst: ${reason}`,
        },
        where: { id: input.targetId },
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
          title: "Evidence linked to Phase 4 internal draft rebuild",
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
      releasePreconditions = evaluateComplianceReleasePreconditions({
        advisorApprovalStatus: advisorApproval.status,
        auditReady: input.auditPersistenceAvailable !== false,
        evidenceRecords,
        permissionAllowed: permission.allowed,
        payloadReady: hasReleaseReadyPayload(recommendation),
        targetId: input.targetId,
      });

      if (releasePreconditions.missing.length > 0) {
        throw new RecommendationReviewWorkflowError(
          `Compliance release preconditions failed: ${releasePreconditions.missing.join(", ")}`,
          409,
          {
            gateMissing: releasePreconditions.missing,
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
        throw new RecommendationReviewWorkflowError(`Client visibility gate failed: ${gate.missing.join(", ")}`, 409, {
          gateMissing: gate.missing,
          releasePreconditions,
        });
      }

      gateMissing = gate.missing;
      gatePassed = gate.passed;
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

    if (input.action === "request_evidence" || input.action === "compliance_block") {
      const decisionUpdate = await tx.decision.updateMany({
        data: {
          evidenceRecordId: evidenceRecords[0]?.id ?? null,
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
        evidenceRecordId: evidenceRecords[0]?.id ?? null,
        metadataJson: {
          action: input.action,
          canonicalCommand: typedCanonicalCommand(input.action),
          canonicalState: typedCanonicalState(input.action),
          demoWorkflowCompatibilityMode: wp05DemoWorkflowCompatibilityMode,
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
          phase: "SCF-P04-P06",
          releasePreconditions,
          noRealAuth: true,
          permission,
          scopeResolution,
          workflowType: "recommendation-review",
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
    const reloadedState = await reloadRecommendationReviewState(tx, input.targetId, input.evidenceIds);
    const clientProjection =
      input.action === "compliance_release"
        ? buildClientRecommendationProjection({
            clientSummaryDraft: recommendation.clientSummaryDraft,
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
      message: `${input.action} persisted for recommendation review workflow.`,
      mutated: true,
      permission: {
        allowed: permission.allowed,
        reason: permission.reason,
        requiresAudit: permission.requiresAudit,
        requiresComplianceReview: permission.requiresComplianceReview,
      },
      releasePreconditions,
      reloadedState,
      workflowType: "recommendation-review",
    };
  });
}

export { RecommendationReviewWorkflowError };
