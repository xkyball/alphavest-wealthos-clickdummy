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

import type {
  AdvisorReviewQueueRow,
  ComplianceReleaseQueueRow,
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

const advisorApprovalProcessId = "BP-054";
const complianceReleaseProcessId = "BP-063";

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
  if (!value) return "Awaiting next workflow action";

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
          processId: { in: [advisorApprovalProcessId, complianceReleaseProcessId] },
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
      blockerReason: "This work item is not linked to the expected workflow runtime.",
      commandHistoryCount: 0,
      currentActionLabel: "Workflow link missing",
      currentStepId: null,
      processId,
      processInstanceId: "",
      status: "Missing workflow",
      visibleState: "Workflow link missing",
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

export async function loadRecommendationReviewQueueReadModel(prisma: PrismaClient): Promise<RecommendationReviewQueueReadModel> {
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

  return {
    advisorQueue: recommendations
      .filter((recommendation) => !recommendation.clientVisible)
      .map((recommendation) => buildAdvisorRow(recommendation, approvals, reviews, evidence, decisions, processLinks)),
    complianceQueue: recommendations
      .map((recommendation, index) => buildComplianceRow(recommendation, approvals, reviews, evidence, decisions, processLinks, index))
      .filter((row): row is ComplianceReleaseQueueRow => Boolean(row)),
    generatedAt: new Date().toISOString(),
    processBackbone: true,
    source: "workflow_process_db",
  };
}
