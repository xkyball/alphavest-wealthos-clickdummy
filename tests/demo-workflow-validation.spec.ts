import { expect, test } from "@playwright/test";

import {
  recommendationReviewConfirmationText,
  recommendationReviewWorkflowStateMachine,
  recommendationReviewTransitionFor,
  type RecommendationReviewWorkflowAction,
} from "../lib/demo-workflow-validation";
import {
  wp05ComplianceReleaseConfirmationPhrase,
  wp05DemoWorkflowCompatibilityMode,
} from "../lib/advisory-workflow-contract";

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
      canonicalCommand: "ADVISOR_APPROVE",
      canonicalState: "COMPLIANCE_PENDING",
      clientVisibleAfterAction: false,
      nextRecommendationStatus: "COMPLIANCE_PENDING",
      permissionAction: "APPROVE",
      requiredRole: "senior_wealth_advisor",
    });

    expect(recommendationReviewTransitionFor("compliance_release")).toMatchObject({
      auditResult: "SUCCESS",
      canonicalCommand: "COMPLIANCE_RELEASE",
      canonicalState: "COMPLIANCE_RELEASED_CLIENT_SAFE",
      clientVisibleAfterAction: true,
      nextRecommendationStatus: "RELEASED_TO_CLIENT",
      permissionAction: "RELEASE",
      requiredRole: "compliance_officer",
    });

    expect(recommendationReviewConfirmationText.compliance_release).toBe(wp05ComplianceReleaseConfirmationPhrase);
    expect(wp05DemoWorkflowCompatibilityMode).toBe("DEMO_WORKFLOW_COMPATIBILITY_ONLY");

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
