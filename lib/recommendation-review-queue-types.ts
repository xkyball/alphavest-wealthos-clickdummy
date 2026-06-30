import type { BackendDataSurfaceMeta } from "@/lib/data-surface-query-contract";

export type ProcessBackboneState = {
  blockerReason: string | null;
  commandHistoryCount: number;
  currentActionLabel: string;
  currentStepId: string | null;
  processId: string;
  processInstanceId: string;
  status: string;
  visibleState: string;
};

export type AdvisorReviewQueueRow = {
  client: string;
  detailHref: string;
  due: string;
  evidenceCount: number;
  evidenceIds: string[];
  id: string;
  priority: string;
  recommendationId: string;
  recommendationSummary: string;
  status: string;
  structure: string;
  submitted: string;
  topic: string;
  type: string;
  workflow: ProcessBackboneState;
};

export type ComplianceReleaseQueueRow = {
  advisor: string;
  age: string;
  classification: string;
  decisionRoomHref: string;
  due: string;
  evidence: string;
  evidenceIds: string[];
  displayId: string;
  id: string;
  item: string;
  publish: string;
  recommendationId: string;
  risk: string;
  sub: string;
  workflow: ProcessBackboneState;
};

export type RecommendationReviewQueueReadModel = {
  advisorQueue: AdvisorReviewQueueRow[];
  advisorQueueMeta: BackendDataSurfaceMeta<AdvisorReviewSortKey>;
  complianceQueue: ComplianceReleaseQueueRow[];
  complianceQueueMeta: BackendDataSurfaceMeta<ComplianceReviewSortKey>;
  focusedAdvisorRow: AdvisorReviewQueueRow | null;
  focusedComplianceRow: ComplianceReleaseQueueRow | null;
  generatedAt: string;
  processBackbone: true;
  source: "workflow_process_db";
};

export type AdvisorReviewSortKey = "client" | "due" | "priority" | "status" | "topic" | "type";
export type ComplianceReviewSortKey = "displayId" | "due" | "evidence" | "item" | "publish" | "risk" | "sub";
export type AdvisorReviewPriorityFilter = "all" | "high" | "medium" | "low";
export type AdvisorReviewStatusFilter = "all" | "approved" | "blocked" | "more_data" | "pending" | "returned";
export type ComplianceReviewRiskFilter = "all" | "high" | "medium" | "low";
export type ComplianceReviewPublishFilter = "all" | "blocked" | "evidence_needed" | "held" | "not_released" | "released";
