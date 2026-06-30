import { execFileSync } from "node:child_process";
import { expect, test } from "@playwright/test";

import { workflow05ComplianceReleaseConfirmationPhrase } from "../lib/advisory-workflow-contract";
import { createDemoSession, demoPlatformTenantId } from "../lib/demo-session";
import { inspectPp003PayloadSurface } from "../lib/pp003-advice-boundary-contract";
import { visibilityEngine } from "../lib/visibility-engine";

const pp003ForbiddenNeedles = [
  "AI Draft",
  "internal rationale",
  "internal-only model assumption",
  "Unsupported claim",
] as const;

const summitAdvisorApprovalTarget = {
  evidenceId: "cd681455-89ef-5ebb-96c7-8464f0dcb721",
  recommendationId: "b0b09a4b-8067-530d-a45a-2ad04d9c4b1d",
} as const;

function serialized(value: unknown) {
  return JSON.stringify(value);
}

function expectNoPp003Needles(payload: unknown) {
  const json = serialized(payload);

  for (const needle of pp003ForbiddenNeedles) {
    expect(json).not.toContain(needle);
  }
}

test.describe("PP-003 leakage negative contract", () => {
  test("IMPL-1.6.1 keeps AI draft and internal rationale out of client portal/mobile projections", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const recommendationProjection = visibilityEngine.projectRecommendationPayload(
      principal.actor,
      principal.role,
      {
        assumptionsJson: { note: "internal-only model assumption" },
        clientSummary: "Released client-safe summary.",
        clientSummaryDraft: "AI Draft: rebalance to an unsupported asset allocation.",
        clientTenantId: principal.tenant.id,
        clientVisible: true,
        complianceNotes: "Compliance-only draft note.",
        internalRationale: "internal rationale for advisor review.",
        objectId: "recommendation:bennett:pp003-client-no-leak",
        recommendationStatus: "RELEASED_TO_CLIENT",
        summaryInternal: "Unsupported claim awaiting canonical evidence.",
        visibilityStatus: "CLIENT_VISIBLE",
      },
      demoPlatformTenantId,
      principal.tenant.id,
    );
    const decisionProjection = visibilityEngine.projectDecisionPayload(
      principal.actor,
      principal.role,
      {
        aiDraft: "AI Draft decision text.",
        assumptionsJson: { note: "internal-only model assumption" },
        clientSummary: "Released client-safe decision.",
        clientTenantId: principal.tenant.id,
        clientVisible: true,
        complianceNotes: "Compliance-only decision note.",
        decisionState: "RELEASED",
        id: "decision:bennett:pp003-client-no-leak",
        internalRationale: "internal rationale for decision review.",
        releasedAt: "2026-06-26T08:30:00.000Z",
        title: "Released client-safe decision",
        visibilityStatus: "CLIENT_VISIBLE",
      },
      demoPlatformTenantId,
      principal.tenant.id,
    );

    expect(recommendationProjection.visible).toBe(true);
    expect(decisionProjection.visible).toBe(true);
    expect(recommendationProjection.hiddenFields).toEqual(
      expect.arrayContaining(["clientSummaryDraft", "internalRationale", "assumptionsJson"]),
    );
    expect(decisionProjection.hiddenFields).toEqual(
      expect.arrayContaining(["aiDraft", "internalRationale", "assumptionsJson"]),
    );

    const recommendationInspection = inspectPp003PayloadSurface(
      "client_portal_mobile",
      recommendationProjection.payload,
    );
    const decisionInspection = inspectPp003PayloadSurface("client_portal_mobile", decisionProjection.payload);

    expect(recommendationInspection.clean).toBe(true);
    expect(decisionInspection.clean).toBe(true);
    expect(recommendationProjection.payload).toEqual({ clientSummary: "Released client-safe summary." });
    expect(decisionProjection.payload).toEqual({
      clientSummary: "Released client-safe decision.",
      decisionState: "RELEASED",
      id: "decision:bennett:pp003-client-no-leak",
      releasedAt: "2026-06-26T08:30:00.000Z",
      title: "Released client-safe decision",
    });
    expectNoPp003Needles(recommendationProjection.payload);
    expectNoPp003Needles(decisionProjection.payload);
  });

  test("IMPL-1.6.2 keeps typed workflow API clientProjection free of internal draft payload", async ({ request }) => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });

    for (const command of [
      {
        action: "submit_review",
        actorRole: "analyst",
        reason: "PP003 submit review before API redaction proof.",
      },
      {
        action: "rebuild_with_evidence",
        actorRole: "analyst",
        evidenceIds: [summitAdvisorApprovalTarget.evidenceId],
        reason: "PP003 rebuild with canonical scoped evidence before API redaction proof.",
      },
      {
        action: "advisor_approve",
        actorRole: "senior_wealth_advisor",
        reason: "PP003 advisor approval remains non-release before API redaction proof.",
      },
    ] as const) {
      const response = await request.post("/api/recommendation-review-workflow", {
        data: {
          ...command,
          targetId: summitAdvisorApprovalTarget.recommendationId,
          workflowType: "advisor-approval",
        },
      });
      const body = await response.json();

      expect(response.ok(), JSON.stringify(body)).toBe(true);
      expect(body.noClientRelease).toBe(true);
    }

    const releaseResponse = await request.post("/api/recommendation-review-workflow", {
      data: {
        action: "compliance_release",
        actorRole: "compliance_officer",
        confirmationText: workflow05ComplianceReleaseConfirmationPhrase,
        evidenceIds: [summitAdvisorApprovalTarget.evidenceId],
        reason: "PP003 compliance release exposes only client-safe API projection.",
        targetId: summitAdvisorApprovalTarget.recommendationId,
        workflowType: "advisor-approval",
      },
    });
    const releaseBody = await releaseResponse.json();

    expect(releaseResponse.ok(), JSON.stringify(releaseBody)).toBe(true);
    expect(releaseBody.noClientRelease).toBe(false);
    expect(releaseBody.result.clientProjection.visible).toBe(true);

    const apiInspection = inspectPp003PayloadSurface("client_api", releaseBody.result.clientProjection.payload);

    expect(apiInspection.clean).toBe(true);
    expect(apiInspection.forbiddenFields).toEqual([]);
    expect(releaseBody.result.clientProjection.payload).toEqual({
      clientSummary: "Compliance-ready client summary for a released liquidity governance next step.",
    });
    expect(releaseBody.result.clientProjection.payload).not.toHaveProperty("clientSummaryDraft");
    expect(releaseBody.result.clientProjection.payload).not.toHaveProperty("internalRationale");
    expect(releaseBody.result.clientProjection.payload).not.toHaveProperty("complianceNotes");
    expectNoPp003Needles(releaseBody.result.clientProjection.payload);
  });

  test("IMPL-1.6.3 fails closed before decision projection can expose unapproved AI advice", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const unreleasedProjection = visibilityEngine.projectDecisionPayload(
      principal.actor,
      principal.role,
      {
        aiDraft: "AI Draft decision advice that must stay internal.",
        assumptionsJson: { note: "internal-only model assumption" },
        clientSummary: "Not released yet.",
        clientTenantId: principal.tenant.id,
        clientVisible: false,
        complianceNotes: "Compliance-only note.",
        decisionState: "SUBMITTED",
        evidenceRecordId: "evidence:bennett:pp003-decision-no-leak",
        id: "decision:bennett:pp003-decision-no-leak",
        internalRationale: "internal rationale for committee review.",
        submittedAt: "2026-06-26T08:45:00.000Z",
        title: "Submitted decision awaiting release",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      demoPlatformTenantId,
      principal.tenant.id,
    );

    expect(unreleasedProjection.visible).toBe(false);
    expect(unreleasedProjection.reasonCode).toBe("DEMO_CLIENT_DECISION_FAIL_CLOSED");
    expect(unreleasedProjection.payload).toEqual({});
    expect(unreleasedProjection.hiddenFields).toEqual(
      expect.arrayContaining(["clientSummary", "aiDraft", "internalRationale", "assumptionsJson"]),
    );

    const decisionInspection = inspectPp003PayloadSurface("decision_projection", unreleasedProjection.payload);

    expect(decisionInspection.clean).toBe(true);
    expect(decisionInspection.forbiddenFields).toEqual([]);
    expectNoPp003Needles(unreleasedProjection.payload);
  });
});
