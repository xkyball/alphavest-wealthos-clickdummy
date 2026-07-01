import { execFileSync } from "node:child_process";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AuditResult,
  ComplianceStatus,
  EvidenceStatus,
  ObjectType,
  PrismaClient,
  RecommendationStatus,
  ReviewStatus,
  VisibilityStatus,
  WorkflowStatus,
} from "@prisma/client";
import { expect, test } from "@playwright/test";

import {
  buildOperationalAdvisorReturnNegativeMatrix,
  certifyOperationalAdvisorReviewExit,
  createOperationalAdvisorEvidenceRequestFeedbackState,
  createOperationalAdvisorQueueTriage,
  createOperationalOptionComparison,
  createOperationalStage6ReadinessChecklist,
  evaluateOperationalAdvisorQueueScope,
  evaluateOperationalOptionDecisionGuard,
  operationalStage6TicketOrder,
  recordOperationalAdvisorApprovalWithoutRelease,
  requestOperationalAdvisorMoreEvidence,
  returnOperationalAdvisorReviewToAnalyst,
  sweepOperationalAdvisorNotRelease,
} from "../lib/advisor-review-lifecycle-service";
import { stableId } from "../lib/stable-id";

const draftKey = "advisor-review-liquidity";
const recommendationId = stableId(`operational:stage6:recommendation:morgan:${draftKey}`);

test.describe.configure({ mode: "serial" });

test.describe("Operational Stage 6 advisor review closure certification", () => {
  let prisma: PrismaClient;
  let queueItemId: string;
  let selectedOptionId: string;
  let selectedEvidenceId: string;
  let advisorApprovalSnapshot: {
    clientVisible: boolean;
    complianceStatus: ComplianceStatus;
    recommendationStatus: RecommendationStatus;
  };
  let evidenceRequestSnapshot: {
    clientVisible: boolean;
    complianceStatus: ComplianceStatus;
    recommendationStatus: RecommendationStatus;
  };
  let returnSnapshot: {
    clientVisible: boolean;
    complianceStatus: ComplianceStatus;
    recommendationStatus: RecommendationStatus;
  };
  let returnAuditCreated = false;

  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required for Operational Stage 6 certification tests.");
    }

    prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  });

  test.afterAll(async () => {
    await prisma?.$disconnect();
  });

  test("PH6-EXEC creates ordered readiness after analysis/spec and Stage 5 exit", () => {
    const blocked = createOperationalStage6ReadinessChecklist({
      analysisComplete: true,
      predecessorStage5Exit: false,
      specificationComplete: true,
      targetFilesConfirmed: true,
      testsConfirmed: true,
    });
    const ready = createOperationalStage6ReadinessChecklist({
      analysisComplete: true,
      predecessorStage5Exit: true,
      specificationComplete: true,
      targetFilesConfirmed: true,
      testsConfirmed: true,
    });

    expect(blocked.ready).toBe(false);
    expect(blocked.missing).toEqual(["operational_stage5_exit"]);
    expect(ready.ready).toBe(true);
    expect(ready.ticketOrder).toEqual(operationalStage6TicketOrder);
  });

  test("Operational-6-T01 persists advisor queue triage/readiness and does not release", async () => {
    const result = await createOperationalAdvisorQueueTriage(prisma, {
      actorRoleKey: "analyst",
      draftKey,
      internalRationale: "Advisor should review liquidity options and evidence without releasing client visibility.",
      reason: "Stage 5 AI governance exit produced an advisor-review candidate.",
      sourceRefs: ["PH5-QA", "Operational-5-T14"],
      tenantSlug: "morgan",
      title: "Operational Stage 6 advisor review candidate",
    });
    queueItemId = result.queueItemId;

    const queueItem = await prisma.queueItem.findUniqueOrThrow({ where: { id: queueItemId } });
    const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: result.recommendationId } });
    const audit = await prisma.auditEvent.findUniqueOrThrow({ where: { id: result.auditEventId } });

    expect(queueItem.status).toBe(WorkflowStatus.ADVISOR_REVIEW);
    expect(queueItem.assignedRoleKey).toBe("senior_wealth_advisor");
    expect(recommendation.status).toBe(RecommendationStatus.ADVISOR_PENDING);
    expect(recommendation.clientVisible).toBe(false);
    expect(audit.eventType).toBe("operational.advisor_queue.triaged");
    expect(audit.result).toBe(AuditResult.PENDING);
  });

  test("Operational-6-T02 allows scoped advisor queue access and denies wrong object scope", async () => {
    const scoped = await evaluateOperationalAdvisorQueueScope(prisma, {
      actorRoleKey: "senior_wealth_advisor",
      allowedObjectIds: [recommendationId],
      queueItemId,
      tenantSlug: "morgan",
    });
    const wrongObject = await evaluateOperationalAdvisorQueueScope(prisma, {
      actorRoleKey: "senior_wealth_advisor",
      allowedObjectIds: [stableId("operational:stage6:not-the-recommendation")],
      queueItemId,
      tenantSlug: "morgan",
    });

    expect(scoped.queueVisible).toBe(true);
    expect(scoped.scopedRecommendationIds).toEqual([recommendationId]);
    expect(scoped.allowedActions).toEqual(["VIEW", "APPROVE"]);
    expect(wrongObject.queueVisible).toBe(false);
    expect(wrongObject.deniedReasonCode).toBe("WCL_SCOPE_OBJECT_DENIED");
  });

  test("Operational-6-T03 persists option comparison rows and scoped evidence with client-safe projection", async () => {
    const result = await createOperationalOptionComparison(prisma, {
      actorRoleKey: "senior_wealth_advisor",
      options: [
        {
          cons: ["Requires follow-up cashflow evidence"],
          description: "Keep allocation stable while requesting updated liquidity evidence.",
          evidenceSummary: "Validated liquidity schedule supports holding current allocation for review.",
          label: "Hold allocation",
          optionKey: "hold",
          pros: ["Avoids premature implementation", "Keeps review reversible"],
          riskLevel: "medium",
        },
        {
          cons: ["Higher transaction risk", "Requires compliance evidence before release"],
          description: "Rebalance once evidence and compliance release are complete.",
          evidenceSummary: "Validated target allocation comparison exists for advisor review only.",
          label: "Evidence-backed rebalance",
          optionKey: "rebalance",
          pros: ["Improves liquidity alignment", "Creates clear compliance evidence trail"],
          riskLevel: "high",
        },
      ],
      reason: "Advisor compares durable options before any release decision.",
      recommendationId,
      tenantSlug: "morgan",
    });
    selectedOptionId = result.options[0].id;
    selectedEvidenceId = result.evidenceIds[0];

    const optionRows = await prisma.recommendationOption.findMany({ where: { recommendationId } });
    const evidenceRows = await prisma.evidenceRecord.findMany({ where: { id: { in: result.evidenceIds } } });

    expect(optionRows).toHaveLength(2);
    expect(evidenceRows.map((record) => record.status)).toEqual([EvidenceStatus.VALIDATED, EvidenceStatus.VALIDATED]);
    expect(result.clientSafeProjection.internalRationaleVisible).toBe(false);
  });

  test("Operational-6-T04 lets advisor proceed only with scoped accepted evidence", async () => {
    const accepted = await evaluateOperationalOptionDecisionGuard(prisma, {
      actorRoleKey: "senior_wealth_advisor",
      evidenceIds: [selectedEvidenceId],
      optionId: selectedOptionId,
      recommendationId,
      tenantSlug: "morgan",
    });
    const missingEvidence = await evaluateOperationalOptionDecisionGuard(prisma, {
      actorRoleKey: "senior_wealth_advisor",
      evidenceIds: [],
      optionId: selectedOptionId,
      recommendationId,
      tenantSlug: "morgan",
    });
    const wrongRole = await evaluateOperationalOptionDecisionGuard(prisma, {
      actorRoleKey: "analyst",
      evidenceIds: [selectedEvidenceId],
      optionId: selectedOptionId,
      recommendationId,
      tenantSlug: "morgan",
    });

    expect(accepted.allowed).toBe(true);
    expect(accepted.missing).toEqual([]);
    expect(missingEvidence.allowed).toBe(false);
    expect(missingEvidence.missing).toEqual(["evidence_provided", "accepted_evidence", "scoped_evidence"]);
    expect(wrongRole.allowed).toBe(false);
    expect(wrongRole.missing).toContain("advisor_role");
    expect(wrongRole.missing).toContain("DEMO_DENY_ADVISOR_APPROVAL_REQUIRED");
  });

  test("Operational-6-T05 records advisor evidence request with audit and no release", async () => {
    const result = await requestOperationalAdvisorMoreEvidence(prisma, {
      actorRoleKey: "senior_wealth_advisor",
      evidenceKey: "updated-custodian-statement",
      reason: "Updated custodian statement is required before advisor approval can continue.",
      recommendationId,
      targetRoleKey: "analyst",
      tenantSlug: "morgan",
    });
    const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: recommendationId } });
    const complianceReview = await prisma.complianceReview.findFirstOrThrow({
      where: { targetId: recommendationId, targetType: ObjectType.RECOMMENDATION },
    });
    const audit = await prisma.auditEvent.findUniqueOrThrow({ where: { id: result.auditEventId } });
    const evidence = await prisma.evidenceRecord.findUniqueOrThrow({ where: { id: result.evidenceId } });
    evidenceRequestSnapshot = {
      clientVisible: recommendation.clientVisible,
      complianceStatus: complianceReview.status,
      recommendationStatus: recommendation.status,
    };

    expect(evidence.status).toBe(EvidenceStatus.PLACEHOLDER);
    expect(evidence.visibilityStatus).toBe(VisibilityStatus.COMPLIANCE_VISIBLE);
    expect(recommendation.status).toBe(RecommendationStatus.MORE_DATA_REQUESTED);
    expect(recommendation.clientVisible).toBe(false);
    expect(complianceReview.status).toBe(ComplianceStatus.NEEDS_EVIDENCE);
    expect(complianceReview.releasedAt).toBeNull();
    expect(audit.eventType).toBe("operational.advisor.requested_evidence");
  });

  test("Operational-6-T06 exposes request feedback states and failed state cannot advance approval", () => {
    const states = ["loading", "validation", "success", "error", "blocked", "retry"] as const;
    const feedback = states.map((lifecycle) => createOperationalAdvisorEvidenceRequestFeedbackState({ lifecycle }));
    const errorState = feedback.find((state) => state.lifecycle === "error");
    const successState = feedback.find((state) => state.lifecycle === "success");

    expect(feedback.map((state) => state.lifecycle)).toEqual(states);
    expect(errorState?.retryable).toBe(true);
    expect(errorState?.canAdvanceApproval).toBe(false);
    expect(successState?.analystVisible).toBe(true);
    expect(successState?.clientVisible).toBe(false);
  });

  test("Operational-6-T07 returns advisor review to analyst with reason, target role and audit", async () => {
    const result = await returnOperationalAdvisorReviewToAnalyst(prisma, {
      actorRoleKey: "senior_wealth_advisor",
      reason: "Advisor rejects current option set and returns it for analyst rebuild.",
      recommendationId,
      tenantSlug: "morgan",
    });
    const recommendation = await prisma.recommendation.findUniqueOrThrow({ where: { id: recommendationId } });
    const approval = await prisma.approval.findFirstOrThrow({
      where: { targetId: recommendationId, targetType: ObjectType.RECOMMENDATION },
    });
    const complianceReview = await prisma.complianceReview.findFirstOrThrow({
      where: { targetId: recommendationId, targetType: ObjectType.RECOMMENDATION },
    });
    const audit = await prisma.auditEvent.findUniqueOrThrow({ where: { id: result.auditEventId } });
    returnSnapshot = {
      clientVisible: recommendation.clientVisible,
      complianceStatus: complianceReview.status,
      recommendationStatus: recommendation.status,
    };
    returnAuditCreated = audit.eventType === "operational.advisor.returned_to_analyst";

    expect(result.returnedToRoleKey).toBe("analyst");
    expect(recommendation.status).toBe(RecommendationStatus.REVISION_REQUESTED);
    expect(recommendation.clientVisible).toBe(false);
    expect(approval.status).toBe(ReviewStatus.REJECTED);
    expect(complianceReview.status).toBe(ComplianceStatus.BLOCKED);
    expect(complianceReview.releasedAt).toBeNull();
    expect(audit.result).toBe(AuditResult.BLOCKED);
  });

  test("Operational-6-T08 proves reject/return blocks release and client/export projection", () => {
    const matrix = buildOperationalAdvisorReturnNegativeMatrix({
      clientProjectionVisible: returnSnapshot.clientVisible,
      complianceReleased: returnSnapshot.complianceStatus === ComplianceStatus.RELEASED,
      returnAuditCreated,
      returnStatus: returnSnapshot.recommendationStatus,
    });

    expect(matrix.allNegativeCasesCovered).toBe(true);
    expect(matrix.rows.map((row) => row.caseId)).toEqual([
      "release_blocked_after_return",
      "client_projection_hidden_after_return",
      "return_audit_created",
    ]);
  });

  test("Operational-6-T09 proves advisor approval, evidence request and reject do not release", async () => {
    const approval = await recordOperationalAdvisorApprovalWithoutRelease(prisma, {
      actorRoleKey: "senior_wealth_advisor",
      reason: "Advisor approval may move to compliance pending but cannot release.",
      recommendationId,
      tenantSlug: "morgan",
    });
    advisorApprovalSnapshot = {
      clientVisible: approval.clientVisible,
      complianceStatus: approval.complianceStatus,
      recommendationStatus: approval.status,
    };
    const sweep = sweepOperationalAdvisorNotRelease({
      advisorApproval: advisorApprovalSnapshot,
      evidenceRequest: evidenceRequestSnapshot,
      returnToAnalyst: returnSnapshot,
    });

    expect(sweep.advisorNotReleaseProven).toBe(true);
    expect(sweep.rows.every((row) => row.passed)).toBe(true);
  });

  test("Operational-6-T10 certifies Stage 6 exit only with all tickets and no advisor bypass", () => {
    const returnNegativeMatrix = buildOperationalAdvisorReturnNegativeMatrix({
      clientProjectionVisible: returnSnapshot.clientVisible,
      complianceReleased: returnSnapshot.complianceStatus === ComplianceStatus.RELEASED,
      returnAuditCreated,
      returnStatus: returnSnapshot.recommendationStatus,
    });
    const notReleaseSweep = sweepOperationalAdvisorNotRelease({
      advisorApproval: advisorApprovalSnapshot,
      evidenceRequest: evidenceRequestSnapshot,
      returnToAnalyst: returnSnapshot,
    });
    const certification = certifyOperationalAdvisorReviewExit({
      completedTickets: [...operationalStage6TicketOrder],
      notReleaseSweep,
      returnNegativeMatrix,
    });

    expect(certification.certified).toBe(true);
    expect(certification.status).toBe("Operational_PHASE6_ADVISOR_REVIEW_READY");
    expect(certification.processCoverage).toEqual(["F-001", "F-003", "F-004", "F-006"]);
  });
});
