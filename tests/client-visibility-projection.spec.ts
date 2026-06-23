import { expect, test } from "@playwright/test";

import { projectClientVisibleDecision, projectClientVisibleRecommendation } from "../lib/control-layer/client-visibility";
import { controlLayerActors } from "./fixtures/control-layer-fixtures";

test.describe("WCL WS-06 client visibility projection", () => {
  test("projects released client-safe recommendation payloads", () => {
    const result = projectClientVisibleRecommendation(controlLayerActors.bennettPrincipal, {
      assumptionsJson: { model: "internal-only" },
      clientSummary: "Released client-safe recommendation.",
      clientSummaryDraft: "AI draft must stay hidden.",
      clientTenantId: controlLayerActors.bennettPrincipal.clientTenantId,
      clientVisible: true,
      complianceNotes: "Compliance notes stay hidden.",
      internalRationale: "Internal rationale stays hidden.",
      recommendationStatus: "RELEASED_TO_CLIENT",
      visibilityStatus: "CLIENT_VISIBLE",
    });

    expect(result.allowed).toBe(true);
    if (result.allowed) {
      expect(result.projection.payload).toEqual({
        clientSummary: "Released client-safe recommendation.",
      });
      expect(result.projection.hiddenFields).toEqual([
        "clientSummaryDraft",
        "internalRationale",
        "complianceNotes",
        "assumptionsJson",
      ]);
    }
  });

  test("fails closed for submitted but unreleased decision payloads", () => {
    const result = projectClientVisibleDecision(controlLayerActors.bennettPrincipal, {
      aiDraft: "Internal AI draft.",
      clientSummary: "Not yet released.",
      clientTenantId: controlLayerActors.bennettPrincipal.clientTenantId,
      clientVisible: false,
      complianceNotes: "Compliance notes.",
      decisionState: "SUBMITTED",
      id: "decision:bennett:wcl-client-projection",
      internalRationale: "Internal rationale.",
      title: "Liquidity decision",
      visibilityStatus: "COMPLIANCE_VISIBLE",
    });

    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.reasonCode).toBe("WCL_CLIENT_VISIBILITY_HIDDEN");
      expect(result.hiddenFields).toContain("aiDraft");
      expect(result.hiddenFields).toContain("internalRationale");
      expect(result.hiddenFields).toContain("complianceNotes");
    }
  });
});
