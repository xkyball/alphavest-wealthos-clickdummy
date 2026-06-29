import { expect, test } from "@playwright/test";

import {
  advisorReviewAcceptanceCriteria,
  advisorReviewApprovalContractId,
  advisorReviewAuditRequirements,
  advisorReviewForbiddenOverclaims,
  advisorReviewPayloadVisibility,
  advisorReviewProofBoundaries,
  advisorReviewRoleGuards,
  advisorReviewRouteOwnership,
  advisorReviewStateMachine,
} from "../lib/advisor-review-approval-contract";

const requiredProcesses = ["BP-050", "BP-051", "BP-052", "BP-053", "BP-054", "BP-055"] as const;

test.describe("EPIC-10 advisor review approval contract", () => {
  test("owns S036 and S037 with complete DOMAIN-F process coverage", () => {
    expect(advisorReviewApprovalContractId).toBe("EPIC-10_ADVISOR_REVIEW_APPROVAL_CONTRACT");
    expect(advisorReviewRouteOwnership.map((owner) => owner.pageId)).toEqual(["036", "037"]);

    const coveredProcesses = new Set(advisorReviewRouteOwnership.flatMap((owner) => owner.processIds));
    for (const processId of requiredProcesses) {
      expect(coveredProcesses.has(processId), processId).toBe(true);
    }

    for (const owner of advisorReviewRouteOwnership) {
      expect(owner.primaryJob.trim(), owner.pageId).not.toBe("");
      expect(owner.viewportRule, owner.pageId).toContain("without scrolling");
    }
  });

  test("keeps advisor payload internal and blocks advisor-approval-as-release overclaim", () => {
    expect(advisorReviewPayloadVisibility.internalOnlyFields).toEqual(expect.arrayContaining([
      "aiDraft",
      "internalDraftText",
      "internalRationale",
      "advisorNotes",
      "complianceNotes",
      "workflowGateDebug",
    ]));
    expect(advisorReviewPayloadVisibility.clientSafeAllowedFields).not.toEqual(expect.arrayContaining([
      "aiDraft",
      "internalRationale",
      "advisorNotes",
      "complianceNotes",
    ]));
    expect(advisorReviewForbiddenOverclaims).toEqual(expect.arrayContaining([
      "advisor_approval_as_release",
      "client_visibility",
      "compliance_released",
      "export_ready",
    ]));
  });

  test("requires role guards, audit events and state transitions for sensitive advisor actions", () => {
    expect(advisorReviewAuditRequirements).toEqual(expect.arrayContaining([
      "p44.advisor_queue.triaged",
      "p44.advisor.evidence_request.created",
      "p44.advisor.approved_without_release",
      "p44.advisor.returned_to_analyst",
      "advisor_approval.process_step.completed",
    ]));

    const approve = advisorReviewRoleGuards.find((guard) => guard.action === "approve_to_compliance");
    expect(approve?.allowedRoles).toEqual(["senior_wealth_advisor"]);
    expect(approve?.hardNegative).toContain("compliance pending only");

    const evidenceRequestTransition = advisorReviewStateMachine.find((transition) => transition.to === "EVIDENCE_REQUESTED_INTERNAL");
    expect(evidenceRequestTransition).toMatchObject({
      from: "OPTION_COMPARISON_READY",
      guard: "evidence_missing_or_stale",
    });
  });

  test("names positive and negative acceptance criteria for every DOMAIN-F process", () => {
    expect(advisorReviewAcceptanceCriteria.map((criterion) => criterion.processId)).toEqual(requiredProcesses);

    for (const criterion of advisorReviewAcceptanceCriteria) {
      expect(criterion.positive.trim(), criterion.processId).not.toBe("");
      expect(criterion.negative.trim(), criterion.processId).not.toBe("");
      expect(criterion.negative, criterion.processId).toMatch(/cannot|denies|wrong|without|bypass/i);
    }
  });

  test("defines proof boundaries for queue and detail without release or client-safe payload claims", () => {
    expect(advisorReviewProofBoundaries.map((boundary) => boundary.pageId)).toEqual(["036", "037"]);

    for (const boundary of advisorReviewProofBoundaries) {
      expect(boundary.clientSafePayload, boundary.pageId).toBe("none_advisor_internal_only");
      expect(boundary.summary, boundary.pageId).toMatch(/not|keeps|until|requires/i);
      expect(boundary.blockedOverclaims, boundary.pageId).toEqual(expect.arrayContaining([
        "advisor_approval_as_release",
        "client_visibility",
        "export_ready",
      ]));
    }

    const detailBoundary = advisorReviewProofBoundaries.find((boundary) => boundary.pageId === "037");
    expect(detailBoundary?.auditPosture).toBe("persisted_action_required");
    expect(detailBoundary?.blockedOverclaims).toEqual(expect.arrayContaining([
      "evidence_request_as_sufficiency",
      "advisor_rejection_as_compliance_block",
      "option_comparison_as_advice_execution",
    ]));
  });
});
