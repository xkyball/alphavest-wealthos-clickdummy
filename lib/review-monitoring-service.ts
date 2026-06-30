import {
  type ActionItem,
  type AuditEvent,
  AuditResult,
  type ClientTenant,
  type PrismaClient,
  type QueueItem,
  type ReviewSchedule,
  type Trigger,
  WorkflowStatus,
} from "@prisma/client";

import {
  type BackendDataSurfaceMeta,
  type DataSurfaceQuery,
  paginateDataSurfaceRows,
  sortDataSurfaceRows,
} from "@/lib/data-surface-query-contract";

export const reviewMonitoringDefaultAsOf = new Date("2026-06-17T12:00:00.000Z");

type TenantScoped<T> = T & {
  clientTenant: Pick<ClientTenant, "displayName" | "riskRating">;
};

export type ReviewDueState = "completed" | "due_soon" | "overdue" | "scheduled" | "upcoming";
export type RebalanceTriggerState = "awaiting_info" | "blocked" | "in_review" | "new" | "routed";

export type ReviewCalendarRow = {
  cadence: string;
  client: string;
  dueState: ReviewDueState;
  escalated: boolean;
  id: string;
  nextReviewDate: string;
  owner: string;
  queueState: ReviewDueState;
  status: string;
  targetId: string;
  targetType: string;
};

export type RebalanceTriggerRow = {
  actionStatus: string;
  client: string;
  clientVisible: boolean;
  confidence: string;
  dueState: ReviewDueState;
  id: string;
  priority: string;
  queueEscalated: boolean;
  slaDueAt: string | null;
  state: RebalanceTriggerState;
  title: string;
  triggerType: string;
};

export type ReviewMonitoringSnapshot = {
  asOf: string;
  auditProof: {
    latestEventTypes: string[];
    recentStageDAuditRows: number;
  };
  rebalance: {
    blocked: number;
    clientVisible: number;
    inReview: number;
    overdue: number;
    rows: RebalanceTriggerRow[];
    routed: number;
    total: number;
  };
  reviews: {
    completed: number;
    dueSoon: number;
    overdue: number;
    rows: ReviewCalendarRow[];
    scheduled: number;
    total: number;
  };
};

export type ReviewMonitoringReviewSortKey =
  | "cadence"
  | "client"
  | "dueState"
  | "nextReviewDate"
  | "owner"
  | "queueState"
  | "status";

export type ReviewMonitoringRebalanceSortKey =
  | "actionStatus"
  | "client"
  | "confidence"
  | "dueState"
  | "priority"
  | "slaDueAt"
  | "state"
  | "title"
  | "triggerType";

export type ReviewMonitoringReviewRowsPage = {
  meta: BackendDataSurfaceMeta<ReviewMonitoringReviewSortKey>;
  reviewRows: ReviewCalendarRow[];
};

export type ReviewMonitoringRebalanceRowsPage = {
  meta: BackendDataSurfaceMeta<ReviewMonitoringRebalanceSortKey>;
  rebalanceRows: RebalanceTriggerRow[];
};

function daysUntil(date: Date | null | undefined, asOf: Date) {
  if (!date) return Number.POSITIVE_INFINITY;
  const dayMs = 24 * 60 * 60 * 1000;
  const dateOnly = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const asOfOnly = Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), asOf.getUTCDate());

  return Math.floor((dateOnly - asOfOnly) / dayMs);
}

function dueStateFor(date: Date | null | undefined, status: WorkflowStatus, asOf: Date): ReviewDueState {
  if (status === WorkflowStatus.COMPLETED) return "completed";

  const days = daysUntil(date, asOf);
  if (days < 0) return "overdue";
  if (days <= 14) return "due_soon";
  if (days <= 45) return "upcoming";

  return "scheduled";
}

function triggerStateFor(trigger: Trigger, action?: ActionItem | null): RebalanceTriggerState {
  if (trigger.status === WorkflowStatus.BLOCKED || action?.status === WorkflowStatus.BLOCKED) {
    return "blocked";
  }

  if (trigger.status === WorkflowStatus.ADVISOR_REVIEW) {
    return "routed";
  }

  if (trigger.status === WorkflowStatus.AWAITING_INFO || action?.status === WorkflowStatus.AWAITING_INFO) {
    return "awaiting_info";
  }

  if (trigger.status === WorkflowStatus.ANALYST_REVIEW || trigger.status === WorkflowStatus.IN_REVIEW) {
    return "in_review";
  }

  return "new";
}

function confidenceLabel(trigger: Trigger) {
  if (!trigger.confidenceScore) return "Not scored";
  return `${trigger.confidenceScore.toFixed(0)}%`;
}

function ownerLabel(value?: string | null) {
  if (!value) return "Unassigned";

  return value
    .split("_")
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export async function getReviewMonitoringSnapshot(
  prisma: PrismaClient,
  asOf = reviewMonitoringDefaultAsOf,
): Promise<ReviewMonitoringSnapshot> {
  const [reviewSchedules, triggers, actionItems, queueItems, stageDAuditEvents] = await Promise.all([
    prisma.reviewSchedule.findMany({
      include: {
        clientTenant: {
          select: {
            displayName: true,
            riskRating: true,
          },
        },
      },
      orderBy: [{ nextReviewDate: "asc" }, { updatedAt: "desc" }],
    }),
    prisma.trigger.findMany({
      include: {
        clientTenant: {
          select: {
            displayName: true,
            riskRating: true,
          },
        },
      },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      where: {
        triggerType: {
          in: ["liquidity_review", "missing_document"],
        },
      },
    }),
    prisma.actionItem.findMany({
      include: {
        clientTenant: {
          select: {
            displayName: true,
            riskRating: true,
          },
        },
      },
      orderBy: [{ dueDate: "asc" }, { updatedAt: "desc" }],
      where: {
        triggerId: {
          not: null,
        },
      },
    }),
    prisma.queueItem.findMany({
      include: {
        clientTenant: {
          select: {
            displayName: true,
            riskRating: true,
          },
        },
      },
      orderBy: [{ slaDueAt: "asc" }, { updatedAt: "desc" }],
    }),
    prisma.auditEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      where: {
        eventType: {
          startsWith: "stage_d.",
        },
        result: {
          in: [AuditResult.SUCCESS, AuditResult.PENDING],
        },
      },
    }),
  ]);

  const queueByTenant = new Map<string, TenantScoped<QueueItem>>();
  for (const queue of queueItems as Array<TenantScoped<QueueItem>>) {
    if (!queueByTenant.has(queue.clientTenantId) || queue.escalated) {
      queueByTenant.set(queue.clientTenantId, queue);
    }
  }

  const reviewRows = (reviewSchedules as Array<TenantScoped<ReviewSchedule>>).map((review) => {
    const queue = queueByTenant.get(review.clientTenantId);
    const dueState = dueStateFor(review.nextReviewDate, review.status, asOf);

    return {
      cadence: review.cadence,
      client: review.clientTenant.displayName,
      dueState,
      escalated: Boolean(queue?.escalated) || dueState === "overdue",
      id: review.id,
      nextReviewDate: review.nextReviewDate.toISOString(),
      owner: ownerLabel(queue?.assignedRoleKey ?? (review.ownerUserId ? "advisor" : null)),
      queueState: dueStateFor(queue?.slaDueAt, queue?.status ?? review.status, asOf),
      status: review.status,
      targetId: review.targetId,
      targetType: review.targetType,
    } satisfies ReviewCalendarRow;
  });

  const actionByTriggerId = new Map<string, TenantScoped<ActionItem>>();
  for (const action of actionItems as Array<TenantScoped<ActionItem>>) {
    if (action.triggerId && !actionByTriggerId.has(action.triggerId)) {
      actionByTriggerId.set(action.triggerId, action);
    }
  }

  const rebalanceRows = (triggers as Array<TenantScoped<Trigger>>)
    .filter((trigger) => trigger.triggerType === "liquidity_review")
    .map((trigger) => {
      const action = actionByTriggerId.get(trigger.id);
      const queue = queueByTenant.get(trigger.clientTenantId);
      const slaDueAt = action?.dueDate ?? queue?.slaDueAt ?? null;
      const dueState = dueStateFor(slaDueAt, action?.status ?? queue?.status ?? trigger.status, asOf);
      const state = triggerStateFor(trigger, action);

      return {
        actionStatus: action?.status ?? "not_started",
        client: trigger.clientTenant.displayName,
        clientVisible: trigger.clientVisible,
        confidence: confidenceLabel(trigger),
        dueState,
        id: trigger.id,
        priority: action?.priority ?? trigger.severity,
        queueEscalated: Boolean(queue?.escalated) || dueState === "overdue" || state === "blocked",
        slaDueAt: slaDueAt ? slaDueAt.toISOString() : null,
        state,
        title: trigger.title,
        triggerType: trigger.triggerType,
      } satisfies RebalanceTriggerRow;
    });

  return {
    asOf: asOf.toISOString(),
    auditProof: {
      latestEventTypes: (stageDAuditEvents as AuditEvent[]).map((event) => event.eventType),
      recentStageDAuditRows: stageDAuditEvents.length,
    },
    rebalance: {
      blocked: rebalanceRows.filter((row) => row.state === "blocked").length,
      clientVisible: rebalanceRows.filter((row) => row.clientVisible).length,
      inReview: rebalanceRows.filter((row) => row.state === "in_review").length,
      overdue: rebalanceRows.filter((row) => row.dueState === "overdue").length,
      rows: rebalanceRows,
      routed: rebalanceRows.filter((row) => row.state === "routed").length,
      total: rebalanceRows.length,
    },
    reviews: {
      completed: reviewRows.filter((row) => row.dueState === "completed").length,
      dueSoon: reviewRows.filter((row) => row.dueState === "due_soon").length,
      overdue: reviewRows.filter((row) => row.dueState === "overdue").length,
      rows: reviewRows,
      scheduled: reviewRows.filter((row) => row.dueState === "scheduled" || row.dueState === "upcoming").length,
      total: reviewRows.length,
    },
  };
}

export async function listReviewMonitoringReviewRowsPage(
  prisma: PrismaClient,
  asOf: Date,
  query: DataSurfaceQuery<ReviewMonitoringReviewSortKey>,
  filters: { dueState?: string } = {},
): Promise<ReviewMonitoringReviewRowsPage> {
  const snapshot = await getReviewMonitoringSnapshot(prisma, asOf);
  const normalizedQuery = query.q.toLowerCase();
  const rows = snapshot.reviews.rows.filter((row) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [row.cadence, row.client, row.dueState, row.owner, row.queueState, row.status].some((value) =>
        String(value).toLowerCase().includes(normalizedQuery),
      );
    const matchesDueState = !filters.dueState || filters.dueState === "all" || row.dueState === filters.dueState;

    return matchesQuery && matchesDueState;
  });
  const sortedRows = sortDataSurfaceRows(rows, query, (row, sortKey) => row[sortKey]);
  const page = paginateDataSurfaceRows(sortedRows, query);

  return { meta: page.meta, reviewRows: page.rows };
}

export async function listReviewMonitoringRebalanceRowsPage(
  prisma: PrismaClient,
  asOf: Date,
  query: DataSurfaceQuery<ReviewMonitoringRebalanceSortKey>,
  filters: { state?: string } = {},
): Promise<ReviewMonitoringRebalanceRowsPage> {
  const snapshot = await getReviewMonitoringSnapshot(prisma, asOf);
  const normalizedQuery = query.q.toLowerCase();
  const rows = snapshot.rebalance.rows.filter((row) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [row.actionStatus, row.client, row.confidence, row.dueState, row.priority, row.state, row.title, row.triggerType].some((value) =>
        String(value).toLowerCase().includes(normalizedQuery),
      );
    const matchesState = !filters.state || filters.state === "all" || row.state === filters.state;

    return matchesQuery && matchesState;
  });
  const sortedRows = sortDataSurfaceRows(rows, query, (row, sortKey) => row[sortKey] ?? "");
  const page = paginateDataSurfaceRows(sortedRows, query);

  return { meta: page.meta, rebalanceRows: page.rows };
}

export const reviewMonitoringProofLabels = {
  dueState: "Derived from ReviewSchedule.nextReviewDate, QueueItem.slaDueAt and ActionItem.dueDate.",
  noClientRelease: "Rebalance trigger rows remain internal unless trigger.clientVisible is true; Stage D actions keep it false.",
  persistence: "Only POST /api/review-monitoring/actions J16/J17 actions claim mutations, and tests assert the API response plus GET snapshot.",
};
