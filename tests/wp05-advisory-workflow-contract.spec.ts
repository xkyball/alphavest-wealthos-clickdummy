import { expect, test } from "@playwright/test";

import {
  recommendationReviewActionToCanonicalCommand,
  recommendationReviewActionToCanonicalState,
  wp05CanonicalJourneyCommandIds,
  wp05CanonicalStates,
  wp05ComplianceReleaseConfirmationPhrase,
  wp05DemoWorkflowCompatibilityMode,
} from "../lib/advisory-workflow-contract";
import {
  recommendationReviewConfirmationText,
  recommendationReviewTransitionFor,
} from "../lib/demo-workflow-validation";
import { journeyCommandIds } from "../lib/journeys/journey-command-registry";

test.describe("WP05 advisory workflow contract", () => {
  test("keeps Journey Commands canonical and demo workflow compatibility mapped", () => {
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

    expect(recommendationReviewActionToCanonicalCommand).toMatchObject({
      advisor_approve: "ADVISOR_APPROVE",
      compliance_block: "COMPLIANCE_BLOCK",
      compliance_release: "COMPLIANCE_RELEASE",
      request_evidence: "COMPLIANCE_REQUEST_EVIDENCE",
    });
    expect(recommendationReviewActionToCanonicalState).toMatchObject({
      advisor_approve: "COMPLIANCE_PENDING",
      compliance_block: "COMPLIANCE_BLOCKED",
      compliance_release: "COMPLIANCE_RELEASED_CLIENT_SAFE",
      request_evidence: "COMPLIANCE_NEEDS_EVIDENCE",
    });

    expect(recommendationReviewTransitionFor("advisor_approve")).toMatchObject({
      canonicalCommand: "ADVISOR_APPROVE",
      canonicalState: "COMPLIANCE_PENDING",
      nextRecommendationStatus: "COMPLIANCE_PENDING",
    });
    expect(recommendationReviewTransitionFor("compliance_release")).toMatchObject({
      canonicalCommand: "COMPLIANCE_RELEASE",
      canonicalState: "COMPLIANCE_RELEASED_CLIENT_SAFE",
      nextRecommendationStatus: "RELEASED_TO_CLIENT",
    });
    expect(recommendationReviewConfirmationText.compliance_release).toBe(wp05ComplianceReleaseConfirmationPhrase);
    expect(wp05DemoWorkflowCompatibilityMode).toBe("DEMO_WORKFLOW_COMPATIBILITY_ONLY");
  });
});

