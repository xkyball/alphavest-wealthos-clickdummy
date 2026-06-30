import { createHash } from "node:crypto";
import {
  AuditResult,
  ObjectType,
  PrismaClient,
  RecommendationStatus,
  WorkflowStatus,
} from "@prisma/client";

export type ReviewMonitoringWorkflowAction =
  | "j16.scheduleReview"
  | "j16.escalateOverdueReview"
  | "j17.blockRebalanceTrigger"
  | "j17.routeRebalanceReview";

const reviewMonitoringWorkflowActions = new Set<string>([
  "j16.scheduleReview",
  "j16.escalateOverdueReview",
  "j17.blockRebalanceTrigger",
  "j17.routeRebalanceReview",
]);

const platformTenantId = stableId("platform:alphavest");
const morganTenantId = tenantId("morgan");
const northbridgeTenantId = tenantId("northbridge");
const morganReviewScheduleId = stableId("review-schedule:morgan:decision");
const northbridgeReviewScheduleId = stableId("review-schedule:northbridge:decision");
const northbridgeComplianceQueueId = stableId("queue:northbridge:compliance");
const northbridgeTriggerId = triggerId("northbridge", "liquidity");
const northbridgeRecommendationId = recommendationId("northbridge");

type ReviewMonitoringAuditWriter = Pick<PrismaClient, "auditEvent">;

export function isReviewMonitoringWorkflowAction(value: unknown): value is ReviewMonitoringWorkflowAction {
  return typeof value === "string" && reviewMonitoringWorkflowActions.has(value);
}

function stableId(label: string) {
  const hash = createHash("sha1").update(`alphavest-wealthos:${label}`).digest("hex");
  const variant = ((Number.parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, "0");

  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    `5${hash.slice(13, 16)}`,
    `${variant}${hash.slice(18, 20)}`,
    hash.slice(20, 32),
  ].join("-");
}

function tenantId(slug: string) {
  return stableId(`tenant:${slug}`);
}

function userId(key: string) {
  return stableId(`user:${key}`);
}

function triggerId(slug: string, key: string) {
  return stableId(`trigger:${slug}:${key}`);
}

function actionItemId(slug: string, key: string) {
  return stableId(`action:${slug}:${key}`);
}

function recommendationId(slug: string) {
  return stableId(`recommendation:${slug}:liquidity-review`);
}

async function writeReviewMonitoringAuditEvent(
  prisma: ReviewMonitoringAuditWriter,
  input: {
    actorUserId: string;
    actorRoleKey: string;
    eventType: string;
    targetType: ObjectType;
    targetId: string;
    clientTenantId: string;
    previousState: string;
    nextState: string;
    reason: string;
    actionId: ReviewMonitoringWorkflowAction;
  },
) {
  await prisma.auditEvent.create({
    data: {
      platformTenantId,
      clientTenantId: input.clientTenantId,
      actorUserId: input.actorUserId,
      actorRoleKey: input.actorRoleKey,
      eventType: input.eventType,
      targetType: input.targetType,
      targetId: input.targetId,
      previousState: input.previousState,
      nextState: input.nextState,
      result: AuditResult.SUCCESS,
      reason: input.reason,
      metadataJson: {
        actionId: input.actionId,
        apiRoute: "/api/review-monitoring/actions",
        noClientRelease: true,
      },
    },
  });
}

async function runReviewCalendarWorkflow(prisma: PrismaClient, actionId: ReviewMonitoringWorkflowAction) {
  const now = new Date();
  const isEscalation = actionId === "j16.escalateOverdueReview";
  const targetReviewScheduleId = isEscalation ? northbridgeReviewScheduleId : morganReviewScheduleId;
  const targetTenantId = isEscalation ? northbridgeTenantId : morganTenantId;
  const targetQueueId = isEscalation ? northbridgeComplianceQueueId : stableId("queue:morgan:compliance");
  const nextReviewDate = isEscalation ? new Date("2026-06-16T00:00:00.000Z") : new Date("2026-06-24T00:00:00.000Z");

  const result = await prisma.$transaction(async (tx) => {
    const reviewSchedule = await tx.reviewSchedule.updateMany({
      where: {
        clientTenantId: targetTenantId,
        id: targetReviewScheduleId,
      },
      data: {
        nextReviewDate,
        status: WorkflowStatus.IN_REVIEW,
        lastCompletedAt: isEscalation ? null : now,
      },
    });
    const queueItem = await tx.queueItem.updateMany({
      where: {
        clientTenantId: targetTenantId,
        id: targetQueueId,
      },
      data: {
        escalated: isEscalation,
        slaDueAt: isEscalation ? new Date("2026-06-16T12:00:00.000Z") : new Date("2026-06-24T12:00:00.000Z"),
        status: isEscalation ? WorkflowStatus.BLOCKED : WorkflowStatus.IN_REVIEW,
      },
    });
    await writeReviewMonitoringAuditEvent(tx, {
      actorUserId: userId("analyst"),
      actorRoleKey: "analyst",
      eventType: isEscalation ? "stage_d.review_calendar.escalate_overdue" : "stage_d.review_calendar.schedule_human_review",
      targetType: ObjectType.REVIEW_SCHEDULE,
      targetId: targetReviewScheduleId,
      clientTenantId: targetTenantId,
      previousState: isEscalation ? "DUE_SOON" : "SCHEDULED",
      nextState: isEscalation ? "OVERDUE_ESCALATED" : "HUMAN_REVIEW_SCHEDULED",
      reason: isEscalation
        ? "Stage D overdue review escalated for internal follow-up. No client release occurred."
        : "Stage D human review was scheduled from review calendar. No client release occurred.",
      actionId,
    });

    return {
      queueRows: queueItem.count,
      reviewRows: reviewSchedule.count,
    };
  });

  return {
    auditRows: 1,
    clientVisible: false,
    message: isEscalation
      ? "Overdue review escalated. Internal audit state recorded; no client release occurred."
      : "Human review scheduled. Internal audit state recorded; no client release occurred.",
    noClientRelease: true,
    targetReviewScheduleId,
    ...result,
  };
}

async function runRebalanceMonitoringWorkflow(prisma: PrismaClient, actionId: ReviewMonitoringWorkflowAction) {
  const isBlockAction = actionId === "j17.blockRebalanceTrigger";
  const result = await prisma.$transaction(async (tx) => {
    const trigger = await tx.trigger.updateMany({
      where: {
        clientTenantId: northbridgeTenantId,
        id: northbridgeTriggerId,
      },
      data: {
        clientVisible: false,
        status: isBlockAction ? WorkflowStatus.BLOCKED : WorkflowStatus.ADVISOR_REVIEW,
      },
    });
    const actionItem = await tx.actionItem.updateMany({
      where: {
        clientTenantId: northbridgeTenantId,
        id: actionItemId("northbridge", "blocked-release"),
      },
      data: {
        blockedReason: isBlockAction
          ? "Stage D rebalance monitoring blocked productive action pending human review."
          : "Stage D rebalance monitoring routed for human advisor review.",
        clientVisible: false,
        status: isBlockAction ? WorkflowStatus.BLOCKED : WorkflowStatus.IN_REVIEW,
      },
    });
    const queueItem = await tx.queueItem.updateMany({
      where: {
        clientTenantId: northbridgeTenantId,
        id: northbridgeComplianceQueueId,
      },
      data: {
        escalated: isBlockAction,
        status: isBlockAction ? WorkflowStatus.BLOCKED : WorkflowStatus.ADVISOR_REVIEW,
      },
    });
    const recommendation = await tx.recommendation.updateMany({
      where: {
        clientTenantId: northbridgeTenantId,
        id: northbridgeRecommendationId,
      },
      data: {
        clientVisible: false,
        status: isBlockAction ? RecommendationStatus.BLOCKED : RecommendationStatus.ADVISOR_PENDING,
      },
    });
    await writeReviewMonitoringAuditEvent(tx, {
      actorUserId: userId("analyst"),
      actorRoleKey: "analyst",
      eventType: isBlockAction ? "stage_d.rebalance_monitoring.block_trigger" : "stage_d.rebalance_monitoring.route_human_review",
      targetType: ObjectType.TRIGGER,
      targetId: northbridgeTriggerId,
      clientTenantId: northbridgeTenantId,
      previousState: "ANALYST_REVIEW",
      nextState: isBlockAction ? "BLOCKED" : "ADVISOR_REVIEW",
      reason: isBlockAction
        ? "Stage D rebalance trigger was blocked before any advice or execution path."
        : "Stage D rebalance trigger was routed for human review without client release.",
      actionId,
    });

    return {
      actionItemRows: actionItem.count,
      queueRows: queueItem.count,
      recommendationRows: recommendation.count,
      triggerRows: trigger.count,
    };
  });

  return {
    auditRows: 1,
    clientVisible: false,
    message: isBlockAction
      ? "Rebalance trigger blocked. Trigger/action/queue state recorded; no client release occurred."
      : "Rebalance trigger routed for human review. No client release occurred.",
    noClientRelease: true,
    targetTriggerId: northbridgeTriggerId,
    ...result,
  };
}

export function runReviewMonitoringWorkflowAction(prisma: PrismaClient, actionId: ReviewMonitoringWorkflowAction) {
  return actionId.startsWith("j16.")
    ? runReviewCalendarWorkflow(prisma, actionId)
    : runRebalanceMonitoringWorkflow(prisma, actionId);
}
