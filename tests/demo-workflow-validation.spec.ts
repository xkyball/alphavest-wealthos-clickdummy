import { expect, test } from "@playwright/test";

import {
  advisorApprovalConfirmationText,
  advisorApprovalWorkflowStateMachine,
  advisorApprovalTransitionFor,
  parseDemoWorkflowRequestBody,
  type AdvisorApprovalWorkflowAction,
} from "../lib/demo-workflow-validation";
import {
  wp05ComplianceReleaseConfirmationPhrase,
  wp05DemoWorkflowCompatibilityMode,
} from "../lib/advisory-workflow-contract";

const advisorApprovalActions = [
  "submit_review",
  "reject_unsupported_claim",
  "rebuild_with_evidence",
  "advisor_approve",
  "compliance_release",
  "compliance_block",
  "request_evidence",
] satisfies AdvisorApprovalWorkflowAction[];

test.describe("advisor approval workflow state machine", () => {
  test("documents deterministic WP-05 transitions without using status chips as gate logic", () => {
    expect(Object.keys(advisorApprovalWorkflowStateMachine).sort()).toEqual([...advisorApprovalActions].sort());

    expect(advisorApprovalTransitionFor("advisor_approve")).toMatchObject({
      auditResult: "SUCCESS",
      canonicalCommand: "ADVISOR_APPROVE",
      canonicalState: "COMPLIANCE_PENDING",
      clientVisibleAfterAction: false,
      nextRecommendationStatus: "COMPLIANCE_PENDING",
      permissionAction: "APPROVE",
      requiredRole: "senior_wealth_advisor",
    });

    expect(advisorApprovalTransitionFor("compliance_release")).toMatchObject({
      auditResult: "SUCCESS",
      canonicalCommand: "COMPLIANCE_RELEASE",
      canonicalState: "COMPLIANCE_RELEASED_CLIENT_SAFE",
      clientVisibleAfterAction: true,
      nextRecommendationStatus: "RELEASED_TO_CLIENT",
      permissionAction: "RELEASE",
      requiredRole: "compliance_officer",
    });

    expect(advisorApprovalConfirmationText.compliance_release).toBe(wp05ComplianceReleaseConfirmationPhrase);
    expect(wp05DemoWorkflowCompatibilityMode).toBe("DEMO_WORKFLOW_COMPATIBILITY_ONLY");

    expect(advisorApprovalTransitionFor("compliance_block")).toMatchObject({
      auditResult: "BLOCKED",
      clientVisibleAfterAction: false,
      nextRecommendationStatus: "BLOCKED",
      permissionAction: "BLOCK",
      requiredRole: "compliance_officer",
    });

    expect(advisorApprovalTransitionFor("request_evidence")).toMatchObject({
      auditResult: "PENDING",
      clientVisibleAfterAction: false,
      nextRecommendationStatus: "MORE_DATA_REQUESTED",
      permissionAction: "BLOCK",
      requiredRole: "compliance_officer",
    });
  });

  test("normalizes the legacy recommendation-review workflow type to advisor approval", () => {
    const parsed = parseDemoWorkflowRequestBody({
      action: "advisor_approve",
      actorRole: "senior_wealth_advisor",
      targetId: "3f164151-0bc4-54ff-a5a4-b7521c41826b",
      workflowType: "recommendation-review",
    });

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      throw new Error(parsed.issues.map((issue) => issue.message).join("; "));
    }

    expect(parsed.value).toMatchObject({
      action: "advisor_approve",
      workflowType: "advisor-approval",
    });
  });
});
