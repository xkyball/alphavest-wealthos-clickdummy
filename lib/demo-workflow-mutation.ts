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
  createDemoSession,
  demoPlatformTenantId,
  demoTenants,
  type DemoRoleKey,
  type DemoTenantSlug,
} from "@/lib/demo-session";
import {
  recommendationReviewConfirmationText,
  type RecommendationReviewWorkflowAction,
} from "@/lib/demo-workflow-validation";
import { permissionEngine } from "@/lib/permission-engine";
import { workflowGate } from "@/lib/workflow-gate";
import type {
  ObjectType as DomainObjectType,
  PermissionAction,
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

type RecommendationReviewWorkflowResult = {
  action: RecommendationReviewWorkflowAction;
  auditEventId: string;
  auditRows: number;
  clientVisible: boolean;
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
  ) {
    super(message);
  }
}

type DemoWorkflowMutationHelpers = {
  permission: Awaited<ReturnType<typeof permissionEngine.can>>;
  session: ReturnType<typeof createDemoSession>;
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
  const session = createDemoSession({
    roleKey: input.actorRoleKey,
    tenantSlug: input.tenantSlug,
  });
  const permission = await permissionEngine.can(
    session.actor,
    input.permissionAction,
    {
      objectId: input.targetId,
      objectType: input.permissionObjectType ?? (input.targetType as DomainObjectType),
      sensitivity: input.sensitivity ?? "CONFIDENTIAL",
      clientTenantId: input.clientTenantId,
      visibilityStatus: input.visibilityStatus ?? "COMPLIANCE_VISIBLE",
      workflowState: input.workflowState,
    },
    {
      platformTenantId: input.platformTenantId ?? demoPlatformTenantId,
      clientTenantId: input.clientTenantId,
      workflowState: input.workflowState,
    },
    session.role,
  );

  return prisma.$transaction(async (tx) => {
    if (!permission.allowed) {
      const deniedAudit = await tx.auditEvent.create({
        data: {
          actorRoleKey: session.role.key,
          actorUserId: session.actor.id,
          clientTenantId: input.clientTenantId,
          eventType: input.eventType,
          evidenceRecordId: input.evidenceRecordId ?? null,
          metadataJson: {
            actionId: input.actionId,
            demoMode: true,
            noRealAuth: true,
            permission,
            ...(input.metadataJson ?? {}),
          },
          nextState: input.previousState,
          platformTenantId: input.platformTenantId ?? demoPlatformTenantId,
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
          demoMode: true,
          noRealAuth: true,
          permission,
          ...(input.metadataJson ?? {}),
        },
        nextState: input.nextState,
        platformTenantId: input.platformTenantId ?? demoPlatformTenantId,
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
  switch (action) {
    case "advisor_approve":
      return "APPROVE";
    case "compliance_release":
      return "RELEASE";
    case "compliance_block":
    case "request_evidence":
      return "BLOCK";
    case "reject_unsupported_claim":
    case "rebuild_with_evidence":
    case "submit_review":
      return "REVIEW";
  }
}

function expectedTypedRole(action: RecommendationReviewWorkflowAction): DemoRoleKey {
  switch (action) {
    case "reject_unsupported_claim":
    case "rebuild_with_evidence":
    case "submit_review":
      return "analyst";
    case "advisor_approve":
      return "senior_wealth_advisor";
    case "compliance_release":
    case "compliance_block":
    case "request_evidence":
      return "compliance_officer";
  }
}

function typedActionNextState(action: RecommendationReviewWorkflowAction) {
  switch (action) {
    case "submit_review":
    case "rebuild_with_evidence":
      return RecommendationStatus.ANALYST_REVIEWED;
    case "reject_unsupported_claim":
      return RecommendationStatus.REVISION_REQUESTED;
    case "advisor_approve":
      return RecommendationStatus.ADVISOR_APPROVED;
    case "compliance_release":
      return RecommendationStatus.RELEASED_TO_CLIENT;
    case "compliance_block":
      return RecommendationStatus.BLOCKED;
    case "request_evidence":
      return RecommendationStatus.MORE_DATA_REQUESTED;
  }
}

function typedEventType(action: RecommendationReviewWorkflowAction) {
  return `recommendation_review.${action}`;
}

function typedAuditResult(action: RecommendationReviewWorkflowAction) {
  switch (action) {
    case "compliance_block":
    case "reject_unsupported_claim":
      return AuditResult.BLOCKED;
    case "request_evidence":
      return AuditResult.PENDING;
    default:
      return AuditResult.SUCCESS;
  }
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
  const session = createDemoSession({
    roleKey: input.actorRoleKey,
    tenantSlug,
  });
  const permissionAction = typedActionPermission(input.action);
  const permission = permissionEngine.can(
    session.actor,
    permissionAction,
    {
      clientTenantId: recommendation.clientTenantId,
      objectId: input.targetId,
      objectType: "RECOMMENDATION",
      sensitivity: "CONFIDENTIAL",
      visibilityStatus: "COMPLIANCE_VISIBLE",
      workflowState: "COMPLIANCE_PENDING",
    },
    {
      clientTenantId: recommendation.clientTenantId,
      platformTenantId: demoPlatformTenantId,
      workflowState: "COMPLIANCE_PENDING",
    },
    session.role,
  );
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
            demoMode: true,
            noRealAuth: true,
            permission,
            roleAllowed,
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
        clientVisible: reloadedState.recommendation.clientVisible,
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
      const acceptedEvidenceRecords = evidenceRecords.filter((record) => hasAcceptedEvidence(record));

      if (!input.evidenceIds?.length || acceptedEvidenceRecords.length === 0) {
        throw new RecommendationReviewWorkflowError(
          "Accepted scoped evidence is required before rebuilding an internal draft.",
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
          status: RecommendationStatus.ADVISOR_APPROVED,
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
      const evidenceRecord = evidenceRecords[0];

      if (advisorApproval.status !== ReviewStatus.APPROVED) {
        throw new RecommendationReviewWorkflowError("Advisor approval is required before compliance release.");
      }

      if (!evidenceRecord) {
        throw new RecommendationReviewWorkflowError("Evidence record is required before compliance release.");
      }

      const gate = workflowGate.canBecomeClientVisible({
        advisorApprovalStatus: advisorApproval.status,
        complianceStatus: "RELEASED",
        evidenceStatus: evidenceRecord.status,
        permission,
        recommendationStatus: "RELEASED_TO_CLIENT",
      });

      if (!gate.passed) {
        throw new RecommendationReviewWorkflowError(`Client visibility gate failed: ${gate.missing.join(", ")}`);
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
        where: { id: { in: evidenceRecords.map((record) => record.id) } },
      });
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
          confirmationText: input.confirmationText ?? null,
          demoMode: true,
          evidenceIds: input.evidenceIds ?? [],
          noRealAuth: true,
          permission,
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

    return {
      action: input.action,
      auditEventId: audit.id,
      auditRows: 1,
      clientVisible: reloadedState.recommendation.clientVisible,
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
      reloadedState,
      workflowType: "recommendation-review",
    };
  });
}

export { RecommendationReviewWorkflowError };
