import { createHash } from "node:crypto";
import {
  AuditResult,
  ObjectType,
  PrismaClient,
  RecommendationStatus,
  ReviewSchedule,
  Trigger,
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

type ReviewMonitoringAuditWriter = Pick<PrismaClient, "auditEvent">;

export type ReviewMonitoringWorkflowTarget = {
  targetId?: string;
  targetType?: "REVIEW_SCHEDULE" | "TRIGGER";
};

export class ReviewMonitoringWorkflowTargetError extends Error {
  reasonCode: "TARGET_REQUIRED" | "TARGET_NOT_FOUND" | "TARGET_TYPE_MISMATCH";

  constructor(reasonCode: ReviewMonitoringWorkflowTargetError["reasonCode"], message: string) {
    super(message);
    this.name = "ReviewMonitoringWorkflowTargetError";
    this.reasonCode = reasonCode;
  }
}

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

function userId(key: string) {
  return stableId(`user:${key}`);
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

async function resolveReviewScheduleTarget(
  prisma: PrismaClient,
  actionId: ReviewMonitoringWorkflowAction,
  target?: ReviewMonitoringWorkflowTarget,
): Promise<ReviewSchedule> {
  if (target?.targetType && target.targetType !== ObjectType.REVIEW_SCHEDULE) {
    throw new ReviewMonitoringWorkflowTargetError("TARGET_TYPE_MISMATCH", "Review calendar actions require a review schedule target.");
  }
  if (!target?.targetId) {
    throw new ReviewMonitoringWorkflowTargetError("TARGET_REQUIRED", "Review calendar actions require a selected review schedule.");
  }

  const targetReviewScheduleId = target.targetId;
  const reviewSchedule = await prisma.reviewSchedule.findUnique({
    where: {
      id: targetReviewScheduleId,
    },
  });

  if (!reviewSchedule) {
    throw new ReviewMonitoringWorkflowTargetError("TARGET_NOT_FOUND", "Review schedule target was not found.");
  }

  return reviewSchedule;
}

async function resolveTriggerTarget(
  prisma: PrismaClient,
  target?: ReviewMonitoringWorkflowTarget,
): Promise<Trigger> {
  if (target?.targetType && target.targetType !== ObjectType.TRIGGER) {
    throw new ReviewMonitoringWorkflowTargetError("TARGET_TYPE_MISMATCH", "Rebalance monitoring actions require a trigger target.");
  }
  if (!target?.targetId) {
    throw new ReviewMonitoringWorkflowTargetError("TARGET_REQUIRED", "Rebalance monitoring actions require a selected trigger.");
  }

  const targetTriggerId = target.targetId;
  const trigger = await prisma.trigger.findUnique({
    where: {
      id: targetTriggerId,
    },
  });

  if (!trigger || trigger.triggerType !== "liquidity_review") {
    throw new ReviewMonitoringWorkflowTargetError("TARGET_NOT_FOUND", "Rebalance trigger target was not found.");
  }

  return trigger;
}

async function runReviewCalendarWorkflow(
  prisma: PrismaClient,
  actionId: ReviewMonitoringWorkflowAction,
  target?: ReviewMonitoringWorkflowTarget,
) {
  const now = new Date();
  const isEscalation = actionId === "j16.escalateOverdueReview";
  const reviewScheduleTarget = await resolveReviewScheduleTarget(prisma, actionId, target);
  const targetReviewScheduleId = reviewScheduleTarget.id;
  const targetTenantId = reviewScheduleTarget.clientTenantId;
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
        targetId: reviewScheduleTarget.targetId,
        targetType: reviewScheduleTarget.targetType,
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

async function runRebalanceMonitoringWorkflow(
  prisma: PrismaClient,
  actionId: ReviewMonitoringWorkflowAction,
  target?: ReviewMonitoringWorkflowTarget,
) {
  const isBlockAction = actionId === "j17.blockRebalanceTrigger";
  const triggerTarget = await resolveTriggerTarget(prisma, target);
  const targetTriggerId = triggerTarget.id;
  const targetTenantId = triggerTarget.clientTenantId;
  const recommendationTarget = await prisma.recommendation.findFirst({
    select: {
      id: true,
    },
    where: {
      clientTenantId: targetTenantId,
      triggerId: targetTriggerId,
    },
  });
  const result = await prisma.$transaction(async (tx) => {
    const trigger = await tx.trigger.updateMany({
      where: {
        clientTenantId: targetTenantId,
        id: targetTriggerId,
      },
      data: {
        clientVisible: false,
        status: isBlockAction ? WorkflowStatus.BLOCKED : WorkflowStatus.ADVISOR_REVIEW,
      },
    });
    const actionItem = await tx.actionItem.updateMany({
      where: {
        clientTenantId: targetTenantId,
        triggerId: targetTriggerId,
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
        clientTenantId: targetTenantId,
        targetId: recommendationTarget?.id ?? "00000000-0000-0000-0000-000000000000",
        targetType: ObjectType.RECOMMENDATION,
      },
      data: {
        escalated: isBlockAction,
        status: isBlockAction ? WorkflowStatus.BLOCKED : WorkflowStatus.ADVISOR_REVIEW,
      },
    });
    const recommendation = await tx.recommendation.updateMany({
      where: {
        clientTenantId: targetTenantId,
        triggerId: targetTriggerId,
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
      targetId: targetTriggerId,
      clientTenantId: targetTenantId,
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
    targetTriggerId,
    ...result,
  };
}

export function runReviewMonitoringWorkflowAction(
  prisma: PrismaClient,
  actionId: ReviewMonitoringWorkflowAction,
  target?: ReviewMonitoringWorkflowTarget,
) {
  return actionId.startsWith("j16.")
    ? runReviewCalendarWorkflow(prisma, actionId, target)
    : runRebalanceMonitoringWorkflow(prisma, actionId, target);
}
