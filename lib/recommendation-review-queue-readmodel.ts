import {
  ObjectType,
  type Approval,
  type ClientTenant,
  type ComplianceReview,
  type Decision,
  type EvidenceRecord,
  type EvidenceSufficiencyDecision,
  type PrismaClient,
  type Recommendation,
} from "@prisma/client";

import {
  paginateDataSurfaceRows,
  sortDataSurfaceRows,
  type DataSurfaceQuery,
} from "@/lib/data-surface-query-contract";
import type {
  AnalystWorkbenchPriorityFilter,
  AnalystWorkbenchQueueRow,
  AnalystWorkbenchSortKey,
  AnalystWorkbenchStatusFilter,
  AdvisorReviewPriorityFilter,
  AdvisorReviewQueueRow,
  AdvisorReviewSortKey,
  AdvisorReviewStatusFilter,
  ComplianceReviewPublishFilter,
  ComplianceReleaseQueueRow,
  ComplianceReviewRiskFilter,
  ComplianceReviewSortKey,
  ProcessBackboneState,
  RecommendationReviewQueueReadModel,
} from "@/lib/recommendation-review-queue-types";

type RecommendationWithTenant = Recommendation & {
  clientTenant: Pick<ClientTenant, "displayName" | "relationshipTier" | "riskRating">;
};

type EvidenceWithSufficiency = Pick<EvidenceRecord, "id" | "relatedObjectId" | "status"> & {
  sufficiencyDecisions: Pick<EvidenceSufficiencyDecision, "decision" | "reviewed" | "scopeMatches" | "relevanceConfirmed" | "currentnessConfirmed">[];
};

type DecisionLink = Pick<Decision, "id" | "recommendationId">;

const analystWorkbenchProcessId = "BP-034";
const advisorApprovalProcessId = "BP-054";
const complianceReleaseProcessId = "BP-063";
const defaultAnalystQuery: DataSurfaceQuery<AnalystWorkbenchSortKey> = {
  page: 1,
  pageSize: 6,
  q: "",
  sortDirection: "asc",
  sortKey: "client",
};
const defaultAdvisorQuery: DataSurfaceQuery<AdvisorReviewSortKey> = {
  page: 1,
  pageSize: 6,
  q: "",
  sortDirection: "asc",
  sortKey: "client",
};
const defaultComplianceQuery: DataSurfaceQuery<ComplianceReviewSortKey> = {
  page: 1,
  pageSize: 6,
  q: "",
  sortDirection: "asc",
  sortKey: "displayId",
};

export const analystWorkbenchSortKeys = ["age", "client", "due", "next", "priority", "status", "topic"] as const satisfies readonly AnalystWorkbenchSortKey[];
export const advisorReviewSortKeys = ["client", "due", "priority", "status", "topic", "type"] as const satisfies readonly AdvisorReviewSortKey[];
export const complianceReviewSortKeys = ["displayId", "due", "evidence", "item", "publish", "risk", "sub"] as const satisfies readonly ComplianceReviewSortKey[];
export const analystWorkbenchPriorityFilters = ["all", "high", "medium", "low"] as const satisfies readonly AnalystWorkbenchPriorityFilter[];
export const analystWorkbenchStatusFilters = ["all", "analyst_reviewed", "blocked", "compliance_pending", "draft", "more_data_requested", "ready_for_compliance"] as const satisfies readonly AnalystWorkbenchStatusFilter[];
export const advisorReviewPriorityFilters = ["all", "high", "medium", "low"] as const satisfies readonly AdvisorReviewPriorityFilter[];
export const advisorReviewStatusFilters = ["all", "approved", "blocked", "more_data", "pending", "returned"] as const satisfies readonly AdvisorReviewStatusFilter[];
export const complianceReviewRiskFilters = ["all", "high", "medium", "low"] as const satisfies readonly ComplianceReviewRiskFilter[];
export const complianceReviewPublishFilters = ["all", "blocked", "evidence_needed", "held", "not_released", "released"] as const satisfies readonly ComplianceReviewPublishFilter[];

type RecommendationReviewQueueOptions = {
  analystFilters?: {
    priority?: AnalystWorkbenchPriorityFilter;
    status?: AnalystWorkbenchStatusFilter;
  };
  analystQuery?: DataSurfaceQuery<AnalystWorkbenchSortKey>;
  advisorFilters?: {
    priority?: AdvisorReviewPriorityFilter;
    status?: AdvisorReviewStatusFilter;
  };
  advisorQuery?: DataSurfaceQuery<AdvisorReviewSortKey>;
  complianceFilters?: {
    publish?: ComplianceReviewPublishFilter;
    risk?: ComplianceReviewRiskFilter;
  };
  complianceQuery?: DataSurfaceQuery<ComplianceReviewSortKey>;
  focusId?: string;
};

type ProcessRuntimeLink = Awaited<ReturnType<typeof loadProcessRuntimeLinks>>[number];

function titleCaseFromEnum(value: string | null | undefined) {
  if (!value) return "Not set";

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function productActionLabel(value: string | null | undefined) {
  if (!value) return "Awaiting next review action";

  return value
    .replace("Request evidence/reject/approve", "Request evidence, reject or approve")
    .replace("Block/request evidence/release", "Block, request evidence or release")
    .replaceAll("/", ", ");
}

function displayDate(value: Date | null | undefined) {
  if (!value) return "Not scheduled";

  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function reviewAge(value: Date) {
  const days = Math.max(0, Math.floor((Date.now() - value.getTime()) / (24 * 60 * 60 * 1000)));

  if (days === 0) return "Today";
  if (days === 1) return "1d";

  return `${days}d`;
}

function shortRecommendationTopic(title: string) {
  return title
    .replace(/\s+recommendation$/i, "")
    .replace(/\s+liquidity governance$/i, " liquidity governance")
    .replace(/\bfamily office\b/gi, "")
    .trim() || "Recommendation review";
}

function latestApprovalFor(recommendationId: string, approvals: Approval[]) {
  return approvals.find((approval) => approval.targetId === recommendationId);
}

function latestComplianceFor(recommendationId: string, reviews: ComplianceReview[]) {
  return reviews.find((review) => review.targetId === recommendationId);
}

function evidenceFor(recommendationId: string, evidence: EvidenceWithSufficiency[], decisions: DecisionLink[]) {
  const decisionIds = new Set(
    decisions
      .filter((decision) => decision.recommendationId === recommendationId)
      .map((decision) => decision.id),
  );

  return evidence.filter((record) => record.relatedObjectId === recommendationId || decisionIds.has(record.relatedObjectId));
}

function advisorPriority(recommendation: RecommendationWithTenant, approval?: Approval, review?: ComplianceReview) {
  if (recommendation.status === "BLOCKED" || approval?.status === "REQUEST_MORE_DATA" || review?.status === "BLOCKED") return "High";
  if (recommendation.clientTenant.riskRating?.toLowerCase() === "high") return "High";
  if (recommendation.status === "COMPLIANCE_PENDING" || recommendation.status === "ADVISOR_APPROVED") return "Medium";

  return "Low";
}

function advisorStatus(recommendation: RecommendationWithTenant, approval?: Approval) {
  if (approval?.status === "REQUEST_MORE_DATA") return "More data";
  if (approval?.status === "APPROVED") return "Approved";
  if (approval?.status === "REJECTED") return "Returned";
  if (recommendation.status === "BLOCKED") return "Blocked";

  return "Pending review";
}

function analystStatus(recommendation: RecommendationWithTenant) {
  if (recommendation.status === "ADVISOR_APPROVED") return "Ready for compliance";
  if (recommendation.status === "COMPLIANCE_PENDING") return "Compliance pending";

  return titleCaseFromEnum(recommendation.status);
}

function complianceRisk(recommendation: RecommendationWithTenant, review?: ComplianceReview) {
  if (review?.status === "BLOCKED" || review?.status === "NEEDS_EVIDENCE") return "High";
  if (recommendation.clientTenant.riskRating?.toLowerCase() === "high") return "High";
  if (review?.status === "PENDING") return "Medium";

  return "Low";
}

function compliancePublish(recommendation: RecommendationWithTenant, review?: ComplianceReview) {
  if (recommendation.clientVisible || review?.status === "RELEASED") return "Released";
  if (review?.status === "BLOCKED") return "Blocked";
  if (review?.status === "NEEDS_EVIDENCE") return "Evidence needed";
  if (review?.status === "PENDING") return "Held";

  return "Not released";
}

function evidenceStatusFor(records: EvidenceWithSufficiency[], review?: ComplianceReview) {
  if (review?.evidenceComplete) return "Complete";
  if (records.some((record) => record.sufficiencyDecisions.some((decision) => decision.decision === "SUFFICIENT"))) return "Sufficient";
  if (records.length > 0) return `${records.length} linked`;

  return "Missing";
}

async function loadProcessRuntimeLinks(prisma: PrismaClient, recommendationIds: string[]) {
  if (recommendationIds.length === 0) return [];

  return prisma.processObjectLink.findMany({
    include: {
      processInstance: {
        include: {
          _count: {
            select: {
              commandRuns: true,
            },
          },
          processDefinition: {
            select: {
              processId: true,
            },
          },
          steps: {
            orderBy: { sequence: "asc" },
            select: {
              sequence: true,
              status: true,
              stepId: true,
              stepLabel: true,
            },
          },
        },
      },
    },
    where: {
      objectId: { in: recommendationIds },
      objectType: ObjectType.RECOMMENDATION,
      processInstance: {
        processDefinition: {
          processId: { in: [analystWorkbenchProcessId, advisorApprovalProcessId, complianceReleaseProcessId] },
        },
      },
    },
  });
}

function workflowFor(
  recommendationId: string,
  processId: string,
  processLinks: ProcessRuntimeLink[],
): ProcessBackboneState {
  const processLink = processLinks.find(
    (link) =>
      link.objectId === recommendationId &&
      link.processInstance.processDefinition.processId === processId,
  );

  if (!processLink) {
    return {
      blockerReason: "This review package is not available right now.",
      commandHistoryCount: 0,
      currentActionLabel: "Action unavailable",
      currentStepId: null,
      processId,
      processInstanceId: "",
      status: "Review unavailable",
      visibleState: "Review unavailable",
    };
  }

  const instance = processLink.processInstance;
  const currentStep =
    instance.steps.find((step) => step.stepId === instance.currentStepId) ??
    instance.steps.find((step) => step.status === "ACTIVE") ??
    instance.steps[0] ??
    null;
  const visibleState =
    instance.blockerReason ??
    (currentStep ? productActionLabel(currentStep.stepLabel) : titleCaseFromEnum(instance.status));

  return {
    blockerReason: instance.blockerReason,
    commandHistoryCount: instance._count.commandRuns,
    currentActionLabel: productActionLabel(currentStep?.stepLabel),
    currentStepId: currentStep?.stepId ?? instance.currentStepId,
    processId: instance.processDefinition.processId,
    processInstanceId: instance.id,
    status: titleCaseFromEnum(instance.status),
    visibleState,
  };
}

function buildAnalystRow(
  recommendation: RecommendationWithTenant,
  approvals: Approval[],
  reviews: ComplianceReview[],
  evidence: EvidenceWithSufficiency[],
  decisions: DecisionLink[],
  processLinks: ProcessRuntimeLink[],
): AnalystWorkbenchQueueRow {
  const approval = latestApprovalFor(recommendation.id, approvals);
  const review = latestComplianceFor(recommendation.id, reviews);
  const linkedEvidence = evidenceFor(recommendation.id, evidence, decisions);
  const workflow = workflowFor(recommendation.id, analystWorkbenchProcessId, processLinks);

  return {
    age: reviewAge(recommendation.updatedAt),
    client: recommendation.clientTenant.displayName,
    detailHref: "/advisory/triggers/liquidity-drift/review",
    due: displayDate(review?.createdAt ?? approval?.createdAt ?? recommendation.updatedAt),
    evidenceCount: linkedEvidence.length,
    id: recommendation.id,
    next: workflow.currentActionLabel,
    priority: advisorPriority(recommendation, approval, review),
    recommendationId: recommendation.id,
    segment: recommendation.clientTenant.relationshipTier ?? titleCaseFromEnum(recommendation.clientTenant.riskRating),
    status: analystStatus(recommendation),
    topic: shortRecommendationTopic(recommendation.title),
    type: titleCaseFromEnum(recommendation.adviceClassification),
    workflow,
  };
}

function buildAdvisorRow(
  recommendation: RecommendationWithTenant,
  approvals: Approval[],
  reviews: ComplianceReview[],
  evidence: EvidenceWithSufficiency[],
  decisions: DecisionLink[],
  processLinks: ProcessRuntimeLink[],
): AdvisorReviewQueueRow {
  const approval = latestApprovalFor(recommendation.id, approvals);
  const review = latestComplianceFor(recommendation.id, reviews);
  const linkedEvidence = evidenceFor(recommendation.id, evidence, decisions);

  return {
    client: recommendation.clientTenant.displayName,
    detailHref: `/advisor/reviews/${recommendation.id}`,
    due: displayDate(review?.createdAt ?? approval?.createdAt ?? recommendation.updatedAt),
    evidenceCount: linkedEvidence.length,
    evidenceIds: linkedEvidence.map((record) => record.id),
    id: recommendation.id,
    priority: advisorPriority(recommendation, approval, review),
    recommendationId: recommendation.id,
    recommendationSummary: recommendation.summaryInternal ?? recommendation.clientSummaryDraft ?? recommendation.title,
    status: advisorStatus(recommendation, approval),
    structure: recommendation.clientTenant.relationshipTier ?? titleCaseFromEnum(recommendation.clientTenant.riskRating),
    submitted: displayDate(recommendation.createdAt),
    topic: shortRecommendationTopic(recommendation.title),
    type: titleCaseFromEnum(recommendation.adviceClassification),
    workflow: workflowFor(recommendation.id, advisorApprovalProcessId, processLinks),
  };
}

function buildComplianceRow(
  recommendation: RecommendationWithTenant,
  approvals: Approval[],
  reviews: ComplianceReview[],
  evidence: EvidenceWithSufficiency[],
  decisions: DecisionLink[],
  processLinks: ProcessRuntimeLink[],
  index: number,
): ComplianceReleaseQueueRow | null {
  const review = latestComplianceFor(recommendation.id, reviews);

  if (!review) return null;

  const approval = latestApprovalFor(recommendation.id, approvals);
  const linkedEvidence = evidenceFor(recommendation.id, evidence, decisions);

  return {
    advisor: titleCaseFromEnum(approval?.approverRoleKey ?? "advisor_review"),
    age: reviewAge(review.updatedAt),
    classification: titleCaseFromEnum(review.adviceClassification),
    decisionRoomHref: `/compliance/reviews/${review.id}/decision-room`,
    due: displayDate(review.createdAt),
    evidence: evidenceStatusFor(linkedEvidence, review),
    evidenceIds: linkedEvidence.map((record) => record.id),
    displayId: `Release review ${String(index + 1).padStart(2, "0")}`,
    id: review.id,
    item: recommendation.title,
    publish: compliancePublish(recommendation, review),
    recommendationId: recommendation.id,
    risk: complianceRisk(recommendation, review),
    sub: recommendation.clientTenant.displayName,
    workflow: workflowFor(recommendation.id, complianceReleaseProcessId, processLinks),
  };
}

function analystValueFor(row: AnalystWorkbenchQueueRow, sortKey: AnalystWorkbenchSortKey) {
  return row[sortKey];
}

function advisorValueFor(row: AdvisorReviewQueueRow, sortKey: AdvisorReviewSortKey) {
  return row[sortKey];
}

function complianceValueFor(row: ComplianceReleaseQueueRow, sortKey: ComplianceReviewSortKey) {
  return row[sortKey];
}

function matchesAnalystFilters(
  row: AnalystWorkbenchQueueRow,
  filters: NonNullable<RecommendationReviewQueueOptions["analystFilters"]>,
) {
  const priority = filters.priority ?? "all";
  const status = filters.status ?? "all";
  const normalizedStatus = row.status.toLowerCase().replaceAll(" ", "_");

  return (
    (priority === "all" || row.priority.toLowerCase() === priority) &&
    (status === "all" || normalizedStatus === status)
  );
}

function matchesAdvisorFilters(
  row: AdvisorReviewQueueRow,
  filters: NonNullable<RecommendationReviewQueueOptions["advisorFilters"]>,
) {
  const priority = filters.priority ?? "all";
  const status = filters.status ?? "all";
  const normalizedStatus = row.status.toLowerCase().replaceAll(" ", "_");

  return (
    (priority === "all" || row.priority.toLowerCase() === priority) &&
    (status === "all" || normalizedStatus === status)
  );
}

function matchesComplianceFilters(
  row: ComplianceReleaseQueueRow,
  filters: NonNullable<RecommendationReviewQueueOptions["complianceFilters"]>,
) {
  const publish = filters.publish ?? "all";
  const risk = filters.risk ?? "all";
  const normalizedPublish = row.publish.toLowerCase().replaceAll(" ", "_");

  return (
    (publish === "all" || normalizedPublish === publish) &&
    (risk === "all" || row.risk.toLowerCase() === risk)
  );
}

function matchesAnalystQuery(row: AnalystWorkbenchQueueRow, query: DataSurfaceQuery<AnalystWorkbenchSortKey>) {
  const q = query.q.toLowerCase();
  if (!q) return true;

  return [row.client, row.segment, row.topic, row.type, row.priority, row.status, row.next, row.workflow.visibleState]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

function matchesAdvisorQuery(row: AdvisorReviewQueueRow, query: DataSurfaceQuery<AdvisorReviewSortKey>) {
  const q = query.q.toLowerCase();
  if (!q) return true;

  return [row.client, row.structure, row.type, row.topic, row.priority, row.status, row.workflow.visibleState]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

function matchesComplianceQuery(row: ComplianceReleaseQueueRow, query: DataSurfaceQuery<ComplianceReviewSortKey>) {
  const q = query.q.toLowerCase();
  if (!q) return true;

  return [row.displayId, row.item, row.sub, row.classification, row.risk, row.advisor, row.evidence, row.publish, row.workflow.visibleState]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

export async function loadRecommendationReviewQueueReadModel(
  prisma: PrismaClient,
  options: RecommendationReviewQueueOptions = {},
): Promise<RecommendationReviewQueueReadModel> {
  const analystQuery = options.analystQuery ?? defaultAnalystQuery;
  const advisorQuery = options.advisorQuery ?? defaultAdvisorQuery;
  const complianceQuery = options.complianceQuery ?? defaultComplianceQuery;
  const analystFilters = options.analystFilters ?? {};
  const advisorFilters = options.advisorFilters ?? {};
  const complianceFilters = options.complianceFilters ?? {};
  const recommendations = await prisma.recommendation.findMany({
    include: {
      clientTenant: {
        select: {
          displayName: true,
          relationshipTier: true,
          riskRating: true,
        },
      },
    },
    orderBy: [{ clientVisible: "asc" }, { updatedAt: "desc" }],
    take: 25,
  });
  const recommendationIds = recommendations.map((recommendation) => recommendation.id);

  const [approvals, reviews, decisions, processLinks] = await Promise.all([
    prisma.approval.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        targetId: { in: recommendationIds },
        targetType: ObjectType.RECOMMENDATION,
      },
    }),
    prisma.complianceReview.findMany({
      orderBy: { updatedAt: "desc" },
      where: {
        targetId: { in: recommendationIds },
        targetType: ObjectType.RECOMMENDATION,
      },
    }),
    prisma.decision.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        recommendationId: true,
      },
      where: {
        recommendationId: { in: recommendationIds },
      },
    }),
    loadProcessRuntimeLinks(prisma, recommendationIds),
  ]);
  const decisionIds = decisions.map((decision) => decision.id);
  const evidence = await prisma.evidenceRecord.findMany({
    include: {
      sufficiencyDecisions: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
    where: {
      OR: [
        {
          relatedObjectId: { in: recommendationIds },
          relatedObjectType: ObjectType.RECOMMENDATION,
        },
        {
          relatedObjectId: { in: decisionIds },
          relatedObjectType: ObjectType.DECISION,
        },
      ],
    },
  });

  const allAnalystRows = recommendations
    .filter((recommendation) => !recommendation.clientVisible)
    .map((recommendation) => buildAnalystRow(recommendation, approvals, reviews, evidence, decisions, processLinks));
  const allAdvisorRows = recommendations
    .filter((recommendation) => !recommendation.clientVisible)
    .map((recommendation) => buildAdvisorRow(recommendation, approvals, reviews, evidence, decisions, processLinks));
  const allComplianceRows = recommendations
    .map((recommendation, index) => buildComplianceRow(recommendation, approvals, reviews, evidence, decisions, processLinks, index))
    .filter((row): row is ComplianceReleaseQueueRow => Boolean(row));
  const filteredAnalystRows = allAnalystRows
    .filter((row) => matchesAnalystFilters(row, analystFilters))
    .filter((row) => matchesAnalystQuery(row, analystQuery));
  const filteredAdvisorRows = allAdvisorRows
    .filter((row) => matchesAdvisorFilters(row, advisorFilters))
    .filter((row) => matchesAdvisorQuery(row, advisorQuery));
  const filteredComplianceRows = allComplianceRows
    .filter((row) => matchesComplianceFilters(row, complianceFilters))
    .filter((row) => matchesComplianceQuery(row, complianceQuery));
  const analystPage = paginateDataSurfaceRows(
    sortDataSurfaceRows(filteredAnalystRows, analystQuery, analystValueFor),
    analystQuery,
  );
  const advisorPage = paginateDataSurfaceRows(
    sortDataSurfaceRows(filteredAdvisorRows, advisorQuery, advisorValueFor),
    advisorQuery,
  );
  const compliancePage = paginateDataSurfaceRows(
    sortDataSurfaceRows(filteredComplianceRows, complianceQuery, complianceValueFor),
    complianceQuery,
  );
  const focusId = options.focusId;

  return {
    analystQueue: analystPage.rows,
    analystQueueMeta: analystPage.meta,
    advisorQueue: advisorPage.rows,
    advisorQueueMeta: advisorPage.meta,
    complianceQueue: compliancePage.rows,
    complianceQueueMeta: compliancePage.meta,
    focusedAdvisorRow: focusId
      ? allAdvisorRows.find((row) => row.id === focusId || row.recommendationId === focusId) ?? null
      : null,
    focusedComplianceRow: focusId
      ? allComplianceRows.find((row) => row.id === focusId || row.recommendationId === focusId) ?? null
      : null,
    generatedAt: new Date().toISOString(),
    processBackbone: true,
    source: "workflow_process_db",
  };
}
