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
  complianceQueue: ComplianceReleaseQueueRow[];
  generatedAt: string;
  processBackbone: true;
  source: "workflow_process_db";
};
