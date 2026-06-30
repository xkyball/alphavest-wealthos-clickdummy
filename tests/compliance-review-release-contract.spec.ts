import { expect, test } from "@playwright/test";

import {
  complianceReviewReleaseAcceptanceCriteria,
  complianceReviewReleaseAuditRequirements,
  complianceReviewReleaseContractId,
  complianceReviewReleaseForbiddenOverclaims,
  complianceReviewReleasePayloadVisibility,
  complianceReviewReleaseProofBoundaries,
  complianceReviewReleaseRoleGuards,
  complianceReviewReleaseRouteOwnership,
  complianceReviewReleaseRouteOwnershipForPageId,
  complianceReviewReleaseStateMachine,
} from "../lib/compliance-review-release-contract";

const requiredProcesses = ["BP-058", "BP-059", "BP-060", "BP-061", "BP-062", "BP-063", "BP-064", "BP-066"] as const;

test.describe("DOMAIN-11 compliance review release contract", () => {
  test("owns S038 through S042 and covers all DOMAIN-G processes from the area entry", () => {
    expect(complianceReviewReleaseContractId).toBe("DOMAIN-11_COMPLIANCE_REVIEW_RELEASE_CONTRACT");
    expect(complianceReviewReleaseRouteOwnership.map((owner) => owner.pageId)).toEqual(["038", "039", "040", "041", "042"]);

    const areaEntry = complianceReviewReleaseRouteOwnershipForPageId("038");
    expect(areaEntry).toMatchObject({
      pageFamily: "compliance_release_queue",
      route: "/compliance/reviews",
    });
    expect(areaEntry?.processIds).toEqual(requiredProcesses);
    expect(areaEntry?.primaryJob).toMatch(/without release, export or client-acceptance overclaim/i);
    expect(areaEntry?.viewportRule).toContain("without page-scroll");
  });

  test("keeps internal payload out of client-safe release projection", () => {
    expect(complianceReviewReleasePayloadVisibility.internalOnlyFields).toEqual(expect.arrayContaining([
      "aiDraft",
      "internalDraftText",
      "internalRationale",
      "advisorNotes",
      "complianceNotes",
      "workflowGateDebug",
      "rawEvidencePayload",
    ]));
    expect(complianceReviewReleasePayloadVisibility.clientSafeAllowedFields).not.toEqual(expect.arrayContaining([
      "aiDraft",
      "internalRationale",
      "advisorNotes",
      "complianceNotes",
    ]));
    expect(complianceReviewReleaseForbiddenOverclaims).toEqual(expect.arrayContaining([
      "client_visibility_without_compliance_release",
      "compliance_release_as_client_acceptance",
      "release_preview_as_download_or_export",
      "audit_display_as_persisted_audit",
    ]));
  });

  test("defines role guards, audit events and state transitions for release, block and evidence request", () => {
    expect(complianceReviewReleaseAuditRequirements).toEqual(expect.arrayContaining([
      "advisor_approval.request_evidence",
      "advisor_approval.compliance_block",
      "advisor_approval.compliance_release",
      "process.compliance_release.step.completed",
      "compliance_release.audit_failed_closed",
    ]));

    const release = complianceReviewReleaseRoleGuards.find((guard) => guard.action === "release_to_client");
    expect(release?.allowedRoles).toEqual(["compliance_officer"]);
    expect(release?.hardNegative).toContain("client-acceptance separation");

    expect(complianceReviewReleaseStateMachine).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: "RELEASE_READY_AUDIT_REQUIRED",
        guard: "audited_release_command_persists",
        to: "CLIENT_SAFE_RELEASED",
      }),
      expect.objectContaining({
        from: "CLIENT_SAFE_RELEASED",
        guard: "client_decision_not_recorded",
        to: "RELEASE_NOT_CLIENT_ACCEPTANCE",
      }),
    ]));
  });

  test("names positive and negative acceptance criteria for every DOMAIN-G process", () => {
    expect(complianceReviewReleaseAcceptanceCriteria.map((criterion) => criterion.processId)).toEqual(requiredProcesses);

    for (const criterion of complianceReviewReleaseAcceptanceCriteria) {
      expect(criterion.positive.trim(), criterion.processId).not.toBe("");
      expect(criterion.negative.trim(), criterion.processId).not.toBe("");
      expect(criterion.negative, criterion.processId).toMatch(/cannot|blocks|denied|missing|wrong|without/i);
    }
  });

  test("defines proof boundaries without treating queue, release or audit display as broader authority", () => {
    expect(complianceReviewReleaseProofBoundaries.map((boundary) => boundary.pageId)).toEqual(["038", "039", "040", "041", "042"]);

    const areaEntry = complianceReviewReleaseProofBoundaries.find((boundary) => boundary.pageId === "038");
    expect(areaEntry).toMatchObject({
      auditPosture: "summary_only_not_audit_record",
      clientSafePayload: "none_compliance_internal_only",
      proofPlacement: "queue_decision_summary",
    });
    expect(areaEntry?.blockedOverclaims).toEqual(expect.arrayContaining([
      "client_visibility_without_compliance_release",
      "compliance_release_as_client_acceptance",
      "release_preview_as_download_or_export",
    ]));

    const release = complianceReviewReleaseProofBoundaries.find((boundary) => boundary.pageId === "040");
    expect(release?.clientSafePayload).toBe("compliance_released_projection_only");
    expect(release?.blockedOverclaims).toEqual(expect.arrayContaining([
      "release_preview_as_download_or_export",
      "compliance_release_as_client_acceptance",
    ]));
  });
});
