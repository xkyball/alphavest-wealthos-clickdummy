import type { RebalanceTriggerRow, ReviewCalendarRow, ReviewDueState, RebalanceTriggerState } from "@/lib/review-monitoring-service";

export const reviewMonitoringPageIds = ["068", "069"] as const;

export type ReviewMonitoringPageId = (typeof reviewMonitoringPageIds)[number];

export function isReviewMonitoringPageId(pageId: string): pageId is ReviewMonitoringPageId {
  return reviewMonitoringPageIds.includes(pageId as ReviewMonitoringPageId);
}

export const reviewCalendarRows: ReviewCalendarRow[] = [
  {
    cadence: "Quarterly",
    client: "Northbridge Family Office",
    dueState: "due_soon",
    escalated: true,
    id: "REV-NB-001",
    nextReviewDate: "2026-06-21T00:00:00.000Z",
    owner: "Senior Wealth Advisor",
    queueState: "overdue",
    status: "IN_REVIEW",
    targetId: "decision:northbridge:liquidity-review",
    targetType: "DECISION",
  },
  {
    cadence: "Quarterly",
    client: "Morgan Family Trust",
    dueState: "upcoming",
    escalated: false,
    id: "REV-MG-001",
    nextReviewDate: "2026-07-05T00:00:00.000Z",
    owner: "Analyst",
    queueState: "due_soon",
    status: "NEW",
    targetId: "decision:morgan:liquidity-review",
    targetType: "DECISION",
  },
  {
    cadence: "Quarterly",
    client: "Summit Growth Fund",
    dueState: "scheduled",
    escalated: false,
    id: "REV-SG-001",
    nextReviewDate: "2026-09-12T00:00:00.000Z",
    owner: "Compliance Officer",
    queueState: "scheduled",
    status: "NEW",
    targetId: "decision:summit:liquidity-review",
    targetType: "DECISION",
  },
  {
    cadence: "Quarterly",
    client: "Bennett Family Trust",
    dueState: "completed",
    escalated: false,
    id: "REV-BN-001",
    nextReviewDate: "2026-06-14T00:00:00.000Z",
    owner: "Advisor",
    queueState: "completed",
    status: "COMPLETED",
    targetId: "decision:bennett:liquidity-review",
    targetType: "DECISION",
  },
];

export const rebalanceTriggerRows: RebalanceTriggerRow[] = [
  {
    actionStatus: "BLOCKED",
    client: "Northbridge Family Office",
    clientVisible: false,
    confidence: "88%",
    dueState: "overdue",
    id: "TRG-NB-LIQ",
    priority: "critical",
    queueEscalated: true,
    slaDueAt: "2026-06-13T12:00:00.000Z",
    state: "blocked",
    title: "Northbridge liquidity threshold review",
    triggerType: "liquidity_review",
  },
  {
    actionStatus: "COMPLIANCE_PENDING",
    client: "Morgan Family Trust",
    clientVisible: false,
    confidence: "88%",
    dueState: "due_soon",
    id: "TRG-MG-LIQ",
    priority: "high",
    queueEscalated: false,
    slaDueAt: "2026-06-19T12:00:00.000Z",
    state: "in_review",
    title: "Morgan liquidity threshold review",
    triggerType: "liquidity_review",
  },
  {
    actionStatus: "IN_REVIEW",
    client: "Summit Growth Fund",
    clientVisible: false,
    confidence: "88%",
    dueState: "upcoming",
    id: "TRG-SG-LIQ",
    priority: "high",
    queueEscalated: false,
    slaDueAt: "2026-06-21T00:00:00.000Z",
    state: "awaiting_info",
    title: "Summit liquidity threshold review",
    triggerType: "liquidity_review",
  },
];

export function dueStateLabel(state: ReviewDueState) {
  const labels: Record<ReviewDueState, string> = {
    completed: "Completed",
    due_soon: "Due soon",
    overdue: "Overdue",
    scheduled: "Scheduled",
    upcoming: "Upcoming",
  };

  return labels[state];
}

export function triggerStateLabel(state: RebalanceTriggerState) {
  const labels: Record<RebalanceTriggerState, string> = {
    awaiting_info: "Awaiting info",
    blocked: "Blocked",
    in_review: "In review",
    new: "New",
    routed: "Routed",
  };

  return labels[state];
}

