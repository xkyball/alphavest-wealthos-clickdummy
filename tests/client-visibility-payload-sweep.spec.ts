import { expect, test } from "@playwright/test";

import {
  clientVisibilityStage6AllowedClientPayloadFields,
  clientVisibilityStage6AllowedExportPayloadFields,
  clientVisibilityStage6ForbiddenPayloadFields,
  clientVisibilityStage6TicketOrder,
  inspectClientVisibilityStage6ClientPayload,
  sweepClientVisibilityStage6PayloadSurfaces,
} from "../lib/client-visibility-payload-contract";
import { createDemoSession, demoPlatformTenantId } from "../lib/demo-session";
import { exportService } from "../lib/export-service";
import { visibilityEngine, type DecisionVisibilityPayload, type RecommendationVisibilityPayload } from "../lib/visibility-engine";

function recommendationPayload(overrides: Partial<RecommendationVisibilityPayload> = {}): RecommendationVisibilityPayload {
  const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });

  return {
    assumptionsJson: { model: "internal" },
    clientSummary: "Released client-safe summary.",
    clientSummaryDraft: "AI Draft: internal-only language.",
    clientTenantId: principal.tenant.id,
    clientVisible: false,
    complianceNotes: "Compliance-only note.",
    internalRationale: "Internal rationale.",
    recommendationStatus: "AI_DRAFT",
    sensitivity: "RESTRICTED",
    summaryInternal: "Analyst-only summary.",
    visibilityStatus: "ADVISOR_VISIBLE",
    ...overrides,
  };
}

function decisionPayload(overrides: Partial<DecisionVisibilityPayload> = {}): DecisionVisibilityPayload {
  const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });

  return {
    aiDraft: "AI Draft: decision text.",
    assumptionsJson: { confidence: "internal" },
    clientSummary: "Released decision summary.",
    clientTenantId: principal.tenant.id,
    clientVisible: false,
    complianceNotes: "Internal compliance note.",
    decisionState: "SUBMITTED",
    evidenceRecordId: "ed6ecbad-2016-5cfd-9c91-c47189afaa0d",
    id: "decision:bennett:clientVisibility-stage6",
    internalRationale: "Internal rationale.",
    releasedAt: null,
    sensitivity: "RESTRICTED",
    submittedAt: "2026-06-25T08:00:00.000Z",
    title: "CLIENT_VISIBILITY stage 6 decision",
    visibilityStatus: "COMPLIANCE_VISIBLE",
    ...overrides,
  };
}

test.describe("CLIENT_VISIBILITY Stage 6 client visibility and export closure", () => {
  test("CLIENT_VISIBILITY-P6-T01 keeps AI/rules draft internal-only across client and export payloads", () => {
    const analyst = createDemoSession({ roleKey: "analyst", tenantSlug: "bennett" });
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const internalProjection = visibilityEngine.projectRecommendationPayload(
      analyst.actor,
      analyst.role,
      recommendationPayload({ clientTenantId: analyst.tenant.id }),
      demoPlatformTenantId,
      analyst.tenant.id,
    );
    const clientProjection = visibilityEngine.projectRecommendationPayload(
      principal.actor,
      principal.role,
      recommendationPayload({ clientTenantId: principal.tenant.id }),
      demoPlatformTenantId,
      principal.tenant.id,
    );
    const exportInspection = exportService.inspectClientExportPayload({
      clientSummary: "Released client-safe summary.",
      clientSummaryDraft: "AI Draft: internal-only language.",
      internalRationale: "Internal rationale.",
    });

    expect(internalProjection.visible).toBe(true);
    expect(internalProjection.payload).toMatchObject({
      clientSummaryDraft: "AI Draft: internal-only language.",
      internalRationale: "Internal rationale.",
    });
    expect(clientProjection.visible).toBe(false);
    expect(clientProjection.payload).toEqual({});
    expect(clientProjection.hiddenFields).toEqual(expect.arrayContaining(["clientSummaryDraft", "internalRationale", "complianceNotes"]));
    expect(exportInspection.clean).toBe(false);
    expect(exportInspection.forbiddenFields).toEqual(["clientSummaryDraft", "internalRationale"]);
    expect(exportInspection.payloadClassifications).toEqual(["CLIENT_SAFE_SUMMARY", "AI_DRAFT", "INTERNAL_RATIONALE"]);
  });

  test("CLIENT_VISIBILITY-P6-T02 projects only released client-safe recommendation and decision payloads", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const releasedRecommendation = visibilityEngine.projectRecommendationPayload(
      principal.actor,
      principal.role,
      recommendationPayload({
        clientTenantId: principal.tenant.id,
        clientVisible: true,
        recommendationStatus: "RELEASED_TO_CLIENT",
        visibilityStatus: "CLIENT_VISIBLE",
      }),
      demoPlatformTenantId,
      principal.tenant.id,
    );
    const releasedDecision = visibilityEngine.projectDecisionPayload(
      principal.actor,
      principal.role,
      decisionPayload({
        clientTenantId: principal.tenant.id,
        clientVisible: true,
        decisionState: "RELEASED",
        releasedAt: "2026-06-25T09:00:00.000Z",
        visibilityStatus: "CLIENT_VISIBLE",
      }),
      demoPlatformTenantId,
      principal.tenant.id,
    );

    expect(releasedRecommendation.payload).toEqual({ clientSummary: "Released client-safe summary." });
    expect(releasedDecision.payload).toEqual({
      clientSummary: "Released decision summary.",
      decisionState: "RELEASED",
      id: "decision:bennett:clientVisibility-stage6",
      releasedAt: "2026-06-25T09:00:00.000Z",
      title: "CLIENT_VISIBILITY stage 6 decision",
    });
    expect(visibilityEngine.assertClientProjectionClean(releasedRecommendation).clean).toBe(true);
    expect(visibilityEngine.assertClientProjectionClean(releasedDecision).clean).toBe(true);
  });

  test("CLIENT_VISIBILITY-P6-T03 treats client-safe summary as release-derived and blocks draft summary fields", () => {
    const safeSummary = inspectClientVisibilityStage6ClientPayload({ clientSummary: "Released client-safe summary." }, { surface: "api" });
    const unsafeSummary = inspectClientVisibilityStage6ClientPayload({
      clientSummary: "Released client-safe summary.",
      clientSummaryDraft: "AI Draft: internal wording.",
      complianceNotes: "Compliance-only notes.",
    }, { surface: "api" });

    expect(safeSummary.clean).toBe(true);
    expect(safeSummary.allowedFields).toEqual(["clientSummary"]);
    expect(unsafeSummary.clean).toBe(false);
    expect(unsafeSummary.forbiddenFields).toEqual(["clientSummaryDraft", "complianceNotes"]);
    expect(unsafeSummary.missing).toEqual([
      "forbidden_projection_field:clientSummaryDraft",
      "forbidden_projection_field:complianceNotes",
    ]);
  });

  test("CLIENT_VISIBILITY-P6-T04 excludes forbidden internal payloads from export surfaces", () => {
    const inspection = exportService.inspectClientExportPayload({
      analystNotes: "Internal analyst note.",
      clientSummary: "Released client-safe summary.",
      complianceReviewNotes: "Compliance review note.",
      manualOverride: true,
      modelPrompt: "Internal prompt.",
      unreleasedEvidence: "Pending evidence.",
    });
    const blockedProjection = exportService.canUseClientProjectionForExport({
      payload: {
        clientSummary: "Released client-safe summary.",
        modelOutput: "Internal model output.",
      },
      visible: true,
    });

    expect(inspection.clean).toBe(false);
    expect(inspection.forbiddenFields).toEqual(["analystNotes", "complianceReviewNotes", "manualOverride", "modelPrompt", "unreleasedEvidence"]);
    expect(inspection.payloadClassifications).toEqual([
      "INTERNAL_RATIONALE",
      "CLIENT_SAFE_SUMMARY",
      "COMPLIANCE_NOTES",
      "HIDDEN_FIELD",
      "AI_DRAFT",
      "UNRELEASED_EVIDENCE",
    ]);
    expect(blockedProjection.allowed).toBe(false);
    expect(blockedProjection.missing).toContain("forbidden_projection_field:modelOutput");
    expect(blockedProjection.payloadClassifications).toEqual(["CLIENT_SAFE_SUMMARY", "AI_DRAFT"]);
  });

  test("CLIENT_VISIBILITY-P6-T05 sweeps API, UI and export payloads with one ordered ticket matrix", () => {
    const sweep = sweepClientVisibilityStage6PayloadSurfaces([
      {
        name: "api released decision",
        payload: { clientSummary: "Released decision summary.", decisionState: "RELEASED", id: "decision-1", title: "Released decision" },
        surface: "api",
      },
      {
        name: "ui released summary",
        payload: { clientSummary: "Released client-safe summary." },
        surface: "ui",
      },
      {
        name: "export manifest",
        payload: { clientSummary: "Released client-safe summary.", releasedAt: "2026-06-25T09:00:00.000Z" },
        surface: "export",
      },
      {
        name: "api unsafe draft",
        payload: { aiDraft: "AI Draft.", complianceNotes: "Compliance-only.", unreleasedEvidence: "Pending evidence." },
        surface: "api",
      },
    ]);

    expect(clientVisibilityStage6TicketOrder).toEqual(["CLIENT_VISIBILITY-P6-T01", "CLIENT_VISIBILITY-P6-T02", "CLIENT_VISIBILITY-P6-T03", "CLIENT_VISIBILITY-P6-T04", "CLIENT_VISIBILITY-P6-T05"]);
    expect(clientVisibilityStage6AllowedClientPayloadFields).toEqual(expect.arrayContaining(["clientSummary", "decisionState", "title"]));
    expect(clientVisibilityStage6AllowedExportPayloadFields).toEqual(expect.arrayContaining(["clientSummary", "releasedAt"]));
    expect(clientVisibilityStage6ForbiddenPayloadFields).toEqual(expect.arrayContaining([
      "aiDraft",
      "analystNotes",
      "clientSummaryDraft",
      "complianceNotes",
      "internalRationale",
      "manualOverride",
      "modelOutput",
      "storageKey",
      "unreleasedEvidence",
    ]));
    expect(sweep.slice(0, 3).every((entry) => entry.inspection.clean)).toBe(true);
    expect(sweep[3].inspection.clean).toBe(false);
    expect(sweep[3].inspection.forbiddenFields).toEqual(["aiDraft", "complianceNotes", "unreleasedEvidence"]);
  });
});
