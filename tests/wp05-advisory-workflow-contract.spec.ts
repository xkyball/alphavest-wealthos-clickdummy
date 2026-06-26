import { expect, test } from "@playwright/test";

import {
  advisorApprovalActionToCanonicalCommand,
  advisorApprovalActionToCanonicalState,
  wp05CanonicalJourneyCommandIds,
  wp05CanonicalStates,
  wp05ComplianceReleaseConfirmationPhrase,
  wp05TypedWorkflowBoundaryMode,
} from "../lib/advisory-workflow-contract";
import {
  advisorApprovalConfirmationText,
  advisorApprovalTransitionFor,
} from "../lib/recommendation-review-workflow-validation";
import { journeyCommandIds } from "../lib/journeys/journey-command-registry";

test.describe("WP05 advisory workflow contract", () => {
  test("keeps Journey Commands canonical and recommendation review boundary mapped", () => {
    expect(journeyCommandIds).toEqual(expect.arrayContaining([...wp05CanonicalJourneyCommandIds]));
    expect(wp05CanonicalStates).toEqual([
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
    expect(advisorApprovalConfirmationText.compliance_release).toBe(wp05ComplianceReleaseConfirmationPhrase);
    expect(wp05TypedWorkflowBoundaryMode).toBe("TYPED_WORKFLOW_BOUNDARY");
  });
});
