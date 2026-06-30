export type AdvisorReviewQueueRow = {
  client: string;
  detailHref: string;
  due: string;
  id: string;
  priority: string;
  recommendationId: string;
  status: string;
  structure: string;
  submitted: string;
  topic: string;
  type: string;
};

export type ComplianceReleaseQueueRow = {
  advisor: string;
  age: string;
  classification: string;
  decisionRoomHref: string;
  due: string;
  evidence: string;
  displayId: string;
  id: string;
  item: string;
  publish: string;
  recommendationId: string;
  risk: string;
  sub: string;
};

export type RecommendationReviewQueueReadModel = {
  advisorQueue: AdvisorReviewQueueRow[];
  complianceQueue: ComplianceReleaseQueueRow[];
  generatedAt: string;
  source: "workflow_db";
};
