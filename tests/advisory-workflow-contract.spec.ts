import { expect, test } from "@playwright/test";

import {
  advisorApprovalActionToCanonicalCommand,
  advisorApprovalActionToCanonicalState,
  workflow05CanonicalProcessCommandIds,
  workflow05CanonicalStates,
  workflow05ComplianceReleaseConfirmationPhrase,
  workflow05TypedWorkflowBoundaryMode,
} from "../lib/advisory-workflow-contract";
import {
  advisorApprovalConfirmationText,
  advisorApprovalTransitionFor,
} from "../lib/recommendation-review-workflow-validation";

test.describe("WORKFLOW05 advisory workflow contract", () => {
  test("keeps Process Commands canonical and recommendation review boundary mapped", () => {
    expect(workflow05CanonicalProcessCommandIds).toEqual([
      "AI_DRAFT_INTERNAL",
      "ADVISOR_APPROVE",
      "ADVISOR_REQUEST_EVIDENCE",
      "ADVISOR_RETURN_TO_ANALYST",
      "COMPLIANCE_BLOCK",
      "COMPLIANCE_REQUEST_EVIDENCE",
      "COMPLIANCE_RELEASE",
    ]);
    expect(workflow05CanonicalStates).toEqual([
      "DRAFT_INTERNAL_ONLY",
      "UNSUPPORTED_CLAIM_BLOCKED",
      "EVIDENCE_GAP",
      "ANALYST_REBUILT_WITH_EVIDENCE",
      "ADVISOR_APPROVED_FOR_COMPLIANCE",
      "COMPLIANCE_PENDING",
      "COMPLIANCE_NEEDS_EVIDENCE",
      "COMPLIANCE_BLOCKED",
      "COMPLIANCE_RELEASED_CLIENT_SAFE",
      "CLIENT_ACCEPTANCE_SEPARATE",
    ]);

    expect(advisorApprovalActionToCanonicalCommand).toMatchObject({
      advisor_approve: "ADVISOR_APPROVE",
      compliance_block: "COMPLIANCE_BLOCK",
      compliance_release: "COMPLIANCE_RELEASE",
      request_evidence: "COMPLIANCE_REQUEST_EVIDENCE",
    });
    expect(advisorApprovalActionToCanonicalState).toMatchObject({
      advisor_approve: "COMPLIANCE_PENDING",
      compliance_block: "COMPLIANCE_BLOCKED",
      compliance_release: "COMPLIANCE_RELEASED_CLIENT_SAFE",
      request_evidence: "COMPLIANCE_NEEDS_EVIDENCE",
    });

    expect(advisorApprovalTransitionFor("advisor_approve")).toMatchObject({
      canonicalCommand: "ADVISOR_APPROVE",
      canonicalState: "COMPLIANCE_PENDING",
      nextRecommendationStatus: "COMPLIANCE_PENDING",
    });
    expect(advisorApprovalTransitionFor("compliance_release")).toMatchObject({
      canonicalCommand: "COMPLIANCE_RELEASE",
      canonicalState: "COMPLIANCE_RELEASED_CLIENT_SAFE",
      nextRecommendationStatus: "RELEASED_TO_CLIENT",
    });
    expect(advisorApprovalConfirmationText.compliance_release).toBe(workflow05ComplianceReleaseConfirmationPhrase);
    expect(workflow05TypedWorkflowBoundaryMode).toBe("TYPED_WORKFLOW_BOUNDARY");
  });
});
