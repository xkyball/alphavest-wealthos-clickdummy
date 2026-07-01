import { expect, test } from "@playwright/test";

import {
  analystDraftAcceptanceCriteria,
  analystDraftAuditRequirements,
  analystDraftForbiddenOverclaims,
  analystDraftGovernanceContractId,
  analystDraftPayloadVisibility,
  analystDraftProofBoundaries,
  analystDraftRoleGuards,
  analystDraftRouteOwnership,
} from "../lib/analyst-draft-governance-contract";

const requiredProcesses = [
  "BP-034",
  "BP-038",
  "BP-039",
  "BP-040",
  "BP-041",
  "BP-042",
  "BP-043",
  "BP-044",
  "BP-045",
  "BP-046",
  "BP-047",
  "BP-048",
] as const;

test.describe("DOMAIN-09 analyst draft governance contract", () => {
  test("owns S033, S034 and S035 with complete process coverage", () => {
    expect(analystDraftGovernanceContractId).toBe("DOMAIN-09_ANALYST_DRAFT_GOVERNANCE_CONTRACT");
    expect(analystDraftRouteOwnership.map((owner) => owner.pageId)).toEqual(["033", "034", "035"]);

    const coveredProcesses = new Set(analystDraftRouteOwnership.flatMap((owner) => owner.processIds));
    for (const processId of requiredProcesses) {
      expect(coveredProcesses.has(processId), processId).toBe(true);
    }

    for (const owner of analystDraftRouteOwnership) {
      expect(owner.primaryJob.trim(), owner.pageId).not.toBe("");
      expect(owner.viewportRule).toContain("without scrolling");
    }
  });

  test("keeps internal draft payload fields out of client-safe and export-safe claims", () => {
    expect(analystDraftPayloadVisibility.internalOnlyFields).toEqual(expect.arrayContaining([
      "aiDraft",
      "internalDraftText",
      "internalRationale",
      "analystNotes",
      "unsupportedClaims",
      "draftTraceInternals",
    ]));
    expect(analystDraftPayloadVisibility.clientSafeAllowedFields).not.toEqual(expect.arrayContaining([
      "aiDraft",
      "analystNotes",
      "unsupportedClaims",
      "draftTraceInternals",
    ]));
    expect(analystDraftForbiddenOverclaims).toEqual(expect.arrayContaining([
      "advisor_approved",
      "compliance_released",
      "client_visibility",
      "route_to_advisor_as_approval",
    ]));
  });

  test("requires audit and role guards for sensitive analyst actions", () => {
    expect(analystDraftAuditRequirements).toEqual(expect.arrayContaining([
      "operational.signal.intake.created",
      "operational.workbench.request_evidence",
      "operational.workbench.route_to_advisor",
      "internal_draft.rebuilt_with_evidence",
      "internal_draft.redacted_internal_only",
    ]));

    const routeToAdvisor = analystDraftRoleGuards.find((guard) => guard.action === "route_to_advisor");
    expect(routeToAdvisor?.allowedRoles).toEqual(["analyst"]);
    expect(routeToAdvisor?.hardNegative).toContain("advisor-pending only");

    const rebuild = analystDraftRoleGuards.find((guard) => guard.action === "rebuild_internal_draft");
    expect(rebuild?.hardNegative).toContain("accepted scoped evidence");
  });

  test("names positive and negative acceptance criteria for every DOMAIN-09 process", () => {
    expect(analystDraftAcceptanceCriteria.map((criterion) => criterion.processId)).toEqual(requiredProcesses);

    for (const criterion of analystDraftAcceptanceCriteria) {
      expect(criterion.positive.trim(), criterion.processId).not.toBe("");
      expect(criterion.negative.trim(), criterion.processId).not.toBe("");
    }
  });

  test("defines concise proof boundaries without client-safe payload or downstream overclaim", () => {
    expect(analystDraftProofBoundaries.map((boundary) => boundary.pageId)).toEqual(["033", "034", "035"]);

    for (const boundary of analystDraftProofBoundaries) {
      expect(boundary.clientSafePayload, boundary.pageId).toBe("none_internal_only");
      expect(boundary.summary, boundary.pageId).toMatch(/not|cannot|does not/i);
      expect(boundary.blockedOverclaims, boundary.pageId).toEqual(expect.arrayContaining([
        "client_visibility",
        "export_ready",
      ]));
    }

    const triggerBoundary = analystDraftProofBoundaries.find((boundary) => boundary.pageId === "035");
    expect(triggerBoundary?.auditPosture).toBe("required_not_claimed_persisted");
    expect(triggerBoundary?.blockedOverclaims).toEqual(expect.arrayContaining([
      "route_to_advisor_as_approval",
      "redaction_as_release",
    ]));
  });
});
