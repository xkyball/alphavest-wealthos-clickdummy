import {
  AuditResult,
  ObjectType,
  type Prisma,
  PrismaClient,
  ReviewStatus,
  RecommendationStatus,
  WorkflowStatus,
} from "@prisma/client";

import { actorTenants, type ActorTenantSlug } from "@/lib/actor-session";
import {
  advisorReviewCanonicalApiRoute,
  advisorReviewCommandForAction,
  type AdvisorReviewWorkflowAction,
} from "@/lib/advisor-review-action-contract";
import { runTypedWorkflowMutation } from "@/lib/typed-workflow-command-bus";

export {
  advisorReviewCanonicalApiRoute,
  advisorReviewCommandForAction,
  isAdvisorReviewWorkflowAction,
  type AdvisorReviewWorkflowAction,
} from "@/lib/advisor-review-action-contract";

export type AdvisorReviewCommandTargetType = "TRIGGER" | "RECOMMENDATION";

export type AdvisorReviewWorkflowActionInput = {
  actionId: AdvisorReviewWorkflowAction;
  targetId: string;
  targetType: AdvisorReviewCommandTargetType;
};

export class AdvisorReviewWorkflowActionError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
    public readonly reasonCode = "ADVISOR_REVIEW_ACTION_INVALID_TARGET",
  ) {
    super(message);
  }
}

function tenantSlugForClientTenantId(clientTenantId: string): ActorTenantSlug {
  const tenant = actorTenants.find((candidate) => candidate.id === clientTenantId);
  if (!tenant) {
    throw new AdvisorReviewWorkflowActionError(
      "Advisor-review target tenant is not available to the actor session.",
      404,
      "ADVISOR_REVIEW_TARGET_TENANT_NOT_FOUND",
    );
  }

  return tenant.slug;
}

function actionStateFor(actionId: AdvisorReviewWorkflowAction) {
  if (actionId === "j01.requestData") {
    return {
      command: advisorReviewCommandForAction(actionId),
      eventType: "advisor_review.request_data",
      previousState: WorkflowStatus.ANALYST_REVIEW,
      reason: "Advisor-review intake requested ownership, wire purpose and source-of-funds confirmation before routing.",
      targetNext: "REQUEST_DATA",
      note: "J01 request-data persisted through typed advisor-review command boundary; no client-facing release action created.",
    };
  }

  return {
    command: advisorReviewCommandForAction(actionId),
    eventType:
      actionId === "j01.routeToAdvisor"
        ? "advisor_review.advise_to_advisor"
        : "advisor_review.escalated_to_call",
    previousState: actionId === "j01.routeToAdvisor" ? RecommendationStatus.BLOCKED : ReviewStatus.IN_REVIEW,
    targetStatus:
      actionId === "j01.routeToAdvisor"
        ? RecommendationStatus.ADVISOR_PENDING
        : RecommendationStatus.BLOCKED,
    targetState:
      actionId === "j01.routeToAdvisor"
        ? ReviewStatus.IN_REVIEW
        : ReviewStatus.ESCALATED_TO_CALL,
    reason:
      actionId === "j01.routeToAdvisor"
        ? "Advisor-review handoff was routed from the selected internal workflow object."
        : "Advisor review escalated to analyst call as a non-release alternative.",
    targetNext:
      actionId === "j01.routeToAdvisor"
        ? "REVIEW_TO_ADVISOR"
        : "REVIEW_ESCALATED_TO_CALL",
    note:
      actionId === "j01.routeToAdvisor"
        ? "J01 route-to-advisor handoff without client visibility or release."
        : "Advisor escalated J01 review to call; no client-facing release action created.",
  };
}

async function resolveTriggerTarget(prisma: PrismaClient, targetId: string) {
  const trigger = await prisma.trigger.findUnique({
    where: { id: targetId },
    select: {
      clientTenantId: true,
      id: true,
      status: true,
    },
  });

  if (!trigger) {
    throw new AdvisorReviewWorkflowActionError(
      "Advisor-review trigger target was not found.",
      404,
      "ADVISOR_REVIEW_TRIGGER_NOT_FOUND",
    );
  }

  return trigger;
}

async function resolveRecommendationTarget(
  prisma: PrismaClient,
  input: Pick<AdvisorReviewWorkflowActionInput, "targetId" | "targetType">,
) {
  const recommendation =
    input.targetType === ObjectType.RECOMMENDATION
      ? await prisma.recommendation.findUnique({
          where: { id: input.targetId },
          select: {
            clientTenantId: true,
            id: true,
            status: true,
            triggerId: true,
          },
        })
      : await prisma.recommendation.findFirst({
          where: { triggerId: input.targetId },
          orderBy: { createdAt: "desc" },
          select: {
            clientTenantId: true,
            id: true,
            status: true,
            triggerId: true,
          },
        });

  if (!recommendation) {
    throw new AdvisorReviewWorkflowActionError(
      "Advisor-review recommendation target was not found.",
      404,
      "ADVISOR_REVIEW_RECOMMENDATION_NOT_FOUND",
    );
  }

  return recommendation;
}

async function runJ01RequestData(
  prisma: PrismaClient,
  input: Pick<AdvisorReviewWorkflowActionInput, "targetId" | "targetType">,
) {
  if (input.targetType !== ObjectType.TRIGGER) {
    throw new AdvisorReviewWorkflowActionError(
      "Request-data advisor-review commands require a trigger target.",
      400,
      "ADVISOR_REVIEW_TRIGGER_TARGET_REQUIRED",
    );
  }

  const actionId = "j01.requestData" satisfies AdvisorReviewWorkflowAction;
  const actionState = actionStateFor(actionId);
  const triggerTarget = await resolveTriggerTarget(prisma, input.targetId);
  const tenantSlug = tenantSlugForClientTenantId(triggerTarget.clientTenantId);

  return runTypedWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "analyst",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: triggerTarget.clientTenantId,
      eventType: actionState.eventType,
      metadataJson: {
        canonicalApiRoute: advisorReviewCanonicalApiRoute,
        command: actionState.command,
        notes: actionState.note,
        requestData: true,
        targetNext: actionState.targetNext,
      },
      nextState: WorkflowStatus.AWAITING_INFO,
      permissionAction: "REVIEW",
      previousState: triggerTarget.status,
      reason: actionState.reason,
      targetId: triggerTarget.id,
      targetType: ObjectType.TRIGGER,
      tenantSlug,
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "ADVISOR_REVIEW",
    },
    async (tx) => {
      const trigger = await tx.trigger.update({
        where: { id: triggerTarget.id },
        data: {
          status: WorkflowStatus.AWAITING_INFO,
          clientVisible: false,
        },
      });

      const actionItem = await tx.actionItem.updateMany({
        where: {
          triggerId: triggerTarget.id,
          clientTenantId: triggerTarget.clientTenantId,
          clientVisible: false,
        },
        data: {
          status: WorkflowStatus.AWAITING_INFO,
          clientVisible: false,
          blockedReason: "Typed J01 advisor-review command requested ownership, wire purpose and source-of-funds confirmation.",
        },
      });

      return {
        actionItemRows: actionItem.count,
        clientVisible: false,
        message: "Advisor-review request-data persisted without client release.",
        targetId: trigger.id,
        targetType: ObjectType.TRIGGER,
        triggerRows: 1,
      };
    },
  );
}

async function updateTriggerForRecommendation(
  tx: Prisma.TransactionClient,
  recommendation: { clientTenantId: string; triggerId: string | null },
) {
  if (!recommendation.triggerId) return { count: 0 };

  return tx.trigger.updateMany({
    where: { id: recommendation.triggerId, clientTenantId: recommendation.clientTenantId },
    data: {
      status: "ADVISOR_REVIEW",
      clientVisible: false,
    },
  });
}

async function runJ01RouteToAdvisor(
  prisma: PrismaClient,
  actionId: Exclude<AdvisorReviewWorkflowAction, "j01.requestData">,
  input: Pick<AdvisorReviewWorkflowActionInput, "targetId" | "targetType">,
) {
  if (actionId === "j01.escalateAdvisor" && input.targetType !== ObjectType.RECOMMENDATION) {
    throw new AdvisorReviewWorkflowActionError(
      "Escalate-advisor commands require a recommendation target.",
      400,
      "ADVISOR_REVIEW_RECOMMENDATION_TARGET_REQUIRED",
    );
  }

  const actionState = actionStateFor(actionId);
  if (!("targetStatus" in actionState)) {
    throw new Error("Request-data must use the typed advisor-review request-data command path.");
  }
  const targetStatus = actionState.targetStatus;
  const targetState = actionState.targetState;
  if (!targetStatus || !targetState) {
    throw new Error("Advisor-review route command target state is missing.");
  }
  const recommendationTarget = await resolveRecommendationTarget(prisma, input);
  const tenantSlug = tenantSlugForClientTenantId(recommendationTarget.clientTenantId);

  return runTypedWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: actionId === "j01.routeToAdvisor" ? "analyst" : "senior_wealth_advisor",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: recommendationTarget.clientTenantId,
      eventType: actionState.eventType,
      metadataJson: {
        canonicalApiRoute: advisorReviewCanonicalApiRoute,
        command: actionState.command,
        notes: actionState.note,
        routeToAdvisor: true,
        targetNext: actionState.targetNext,
      },
      nextState: targetStatus,
      permissionAction: "REVIEW",
      previousState: recommendationTarget.status,
      reason: actionState.reason,
      targetId: recommendationTarget.id,
      targetType: ObjectType.RECOMMENDATION,
      tenantSlug,
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "ADVISOR_REVIEW",
    },
    async (tx) => {
      const trigger = await updateTriggerForRecommendation(tx, recommendationTarget);

      const recommendation = await tx.recommendation.update({
        where: { id: recommendationTarget.id },
        data: {
          status: targetStatus,
          clientVisible: false,
        },
      });

      const approval = await tx.approval.updateMany({
        where: {
          clientTenantId: recommendationTarget.clientTenantId,
          targetId: recommendationTarget.id,
          targetType: ObjectType.RECOMMENDATION,
          approvalType: "advisor",
        },
        data: {
          notes: actionState.note,
          status: targetState,
          approvedAt: actionId === "j01.routeToAdvisor" ? null : undefined,
        },
      });

      return {
        clientVisible: false,
        approvalRows: approval.count,
        message:
          actionId === "j01.routeToAdvisor"
            ? "Advisor review route persisted without client release."
            : "Advisor review escalate-to-call persisted without client release.",
        recommendationRows: 1,
        targetId: recommendation.id,
        targetType: ObjectType.RECOMMENDATION,
        triggerId: recommendation.triggerId,
        triggerRows: trigger.count,
      };
    },
  );
}

export async function runAdvisorReviewWorkflowAction(
  prisma: PrismaClient,
  input: AdvisorReviewWorkflowActionInput,
) {
  if (input.actionId === "j01.requestData") {
    return runJ01RequestData(prisma, input);
  }

  return runJ01RouteToAdvisor(prisma, input.actionId, input);
}
