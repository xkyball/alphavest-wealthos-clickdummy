import { expect, test } from "@playwright/test";

import {
  recommendationReviewWorkflowStateMachine,
  recommendationReviewTransitionFor,
  type RecommendationReviewWorkflowAction,
} from "../lib/demo-workflow-validation";

const recommendationReviewActions = [
  "submit_review",
  "reject_unsupported_claim",
  "rebuild_with_evidence",
  "advisor_approve",
  "compliance_release",
  "compliance_block",
  "request_evidence",
] satisfies RecommendationReviewWorkflowAction[];

test.describe("recommendation review workflow state machine", () => {
  test("documents deterministic WP-05 transitions without using status chips as gate logic", () => {
    expect(Object.keys(recommendationReviewWorkflowStateMachine).sort()).toEqual([...recommendationReviewActions].sort());

    expect(recommendationReviewTransitionFor("advisor_approve")).toMatchObject({
      auditResult: "SUCCESS",
      clientVisibleAfterAction: false,
      nextRecommendationStatus: "ADVISOR_APPROVED",
      permissionAction: "APPROVE",
      requiredRole: "senior_wealth_advisor",
    });

    expect(recommendationReviewTransitionFor("compliance_release")).toMatchObject({
      auditResult: "SUCCESS",
      clientVisibleAfterAction: true,
      nextRecommendationStatus: "RELEASED_TO_CLIENT",
      permissionAction: "RELEASE",
      requiredRole: "compliance_officer",
    });

    expect(recommendationReviewTransitionFor("compliance_block")).toMatchObject({
      auditResult: "BLOCKED",
      clientVisibleAfterAction: false,
      nextRecommendationStatus: "BLOCKED",
      permissionAction: "BLOCK",
      requiredRole: "compliance_officer",
    });

    expect(recommendationReviewTransitionFor("request_evidence")).toMatchObject({
      auditResult: "PENDING",
      clientVisibleAfterAction: false,
      nextRecommendationStatus: "MORE_DATA_REQUESTED",
      permissionAction: "BLOCK",
      requiredRole: "compliance_officer",
    });
  });
});
