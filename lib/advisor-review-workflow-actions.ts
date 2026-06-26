import { AuditResult, ObjectType, PrismaClient, ReviewStatus, RecommendationStatus } from "@prisma/client";

import {
  advisorReviewCanonicalApiRoute,
  advisorReviewCommandForAction,
  type AdvisorReviewWorkflowAction,
} from "@/lib/advisor-review-action-contract";
import { stableId } from "@/lib/stable-id";
import { runDemoWorkflowMutation } from "@/lib/typed-workflow-command-bus";

export {
  advisorReviewCanonicalApiRoute,
  advisorReviewCommandForAction,
  isAdvisorReviewWorkflowAction,
  type AdvisorReviewWorkflowAction,
} from "@/lib/advisor-review-action-contract";

const northbridgeTenantId = tenantId("northbridge");
const northbridgeTriggerId = triggerId("northbridge", "liquidity");
const northbridgeRecommendationId = recommendationId("northbridge");
const northbridgeApprovalId = approvalId("northbridge");

function tenantId(slug: string) {
  return stableId(`tenant:${slug}`);
}

function triggerId(slug: string, key: string) {
  return stableId(`trigger:${slug}:${key}`);
}

function recommendationId(slug: string) {
  return stableId(`recommendation:${slug}:liquidity-review`);
}

function approvalId(slug: string) {
  return stableId(`approval:${slug}:advisor`);
}

function userId(key: string) {
  return stableId(`user:${key}`);
}

function actionStateFor(actionId: AdvisorReviewWorkflowAction) {
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
        ? "Advisor-review handoff was routed for screencast-like internal workflow continuity."
        : "Advisor review escalated to analyst call as a non-release alternative.",
    targetNext:
      actionId === "j01.routeToAdvisor"
        ? "REVIEW_TO_ADVISOR"
        : "REVIEW_ESCALATED_TO_CALL",
    note:
      actionId === "j01.routeToAdvisor"
        ? "Screencast J01 route-to-advisor handoff without client visibility or release."
        : "Advisor escalated J01 review to call; no client-facing release action created.",
  };
}

async function runJ01RouteToAdvisor(prisma: PrismaClient, actionId: AdvisorReviewWorkflowAction) {
  const actionState = actionStateFor(actionId);

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: actionId === "j01.routeToAdvisor" ? "analyst" : "senior_wealth_advisor",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: northbridgeTenantId,
      eventType: actionState.eventType,
      metadataJson: {
        canonicalApiRoute: advisorReviewCanonicalApiRoute,
        command: actionState.command,
        notes: actionState.note,
        routeToAdvisor: true,
        targetNext: actionState.targetNext,
      },
      nextState: actionState.targetStatus,
      permissionAction: "REVIEW",
      previousState: actionState.previousState,
      reason: actionState.reason,
      targetId: northbridgeRecommendationId,
      targetType: ObjectType.RECOMMENDATION,
      tenantSlug: "northbridge",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "ADVISOR_REVIEW",
    },
    async (tx) => {
      const trigger = await tx.trigger.updateMany({
        where: { id: northbridgeTriggerId, clientTenantId: northbridgeTenantId },
        data: {
          status: "ADVISOR_REVIEW",
          clientVisible: false,
        },
      });

      const recommendation = await tx.recommendation.updateMany({
        where: { id: northbridgeRecommendationId, clientTenantId: northbridgeTenantId },
        data: {
          status: actionState.targetStatus,
          clientVisible: false,
        },
      });

      const approval = await tx.approval.updateMany({
        where: { id: northbridgeApprovalId, clientTenantId: northbridgeTenantId },
        data: {
          notes: actionState.note,
          status: actionState.targetState,
        },
      });

      return {
        clientVisible: false,
        approvalRows: approval.count,
        message:
          actionId === "j01.routeToAdvisor"
            ? "Advisor review route persisted without client release."
            : "Advisor review escalate-to-call persisted without client release.",
        recommendationRows: recommendation.count,
        triggerRows: trigger.count,
      };
    },
  );
}

export async function runAdvisorReviewWorkflowAction(
  prisma: PrismaClient,
  actionId: AdvisorReviewWorkflowAction,
) {
  return runJ01RouteToAdvisor(prisma, actionId);
}
