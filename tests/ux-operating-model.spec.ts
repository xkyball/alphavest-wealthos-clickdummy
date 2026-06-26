import { test, expect } from "@playwright/test";

import { captureModelContextForRoute } from "../lib/capture-screen-model-context";
import { routeScopeForPageId, screenRoutes } from "../lib/route-registry";
import {
  uxOperatingModelForRoute,
  uxOperatingModelIntegrity,
  uxOperatingModelRecords,
  type UxOperatingMode,
} from "../lib/ux-operating-model";
import { uxPageContractForRoute } from "../lib/ux-page-contract";

test.describe("E01 canonical UX operating model", () => {
  test("materializes one canonical operating record for every registered route", () => {
    expect(uxOperatingModelIntegrity.totalCount).toBe(71);
    expect(uxOperatingModelIntegrity.missingPageIds).toEqual([]);
    expect(uxOperatingModelIntegrity.duplicatePageIds).toEqual([]);

    for (const route of screenRoutes) {
      const record = uxOperatingModelForRoute(route);
      expect(record.pageId).toBe(route.pageId);
      expect(record.routeScope).toBe(routeScopeForPageId(route.pageId));
      expect(record.mode, `${route.pageId} mode`).toBeTruthy();
      expect(record.audience, `${route.pageId} audience`).toBeTruthy();
      expect(record.proofPosture, `${route.pageId} proof posture`).toBeTruthy();
      expect(record.noOverclaimRule, `${route.pageId} no-overclaim rule`).toContain(" ");
      expect(record.allowedTreatment, `${route.pageId} allowed treatment`).toContain(" ");
      expect(record.forbiddenTreatment, `${route.pageId} forbidden treatment`).toContain("No");
    }
  });

  test("keeps protected route scopes non-productive and mechanically labeled", () => {
    const expectedModes: Record<string, UxOperatingMode> = {
      HOLD_PENDING_DECISION: "HOLD_PENDING_DECISION",
      P1_AFTER_MVP: "DEFERRED_P1",
      REFERENCE_ONLY: "REFERENCE_ONLY",
    };

    for (const record of uxOperatingModelRecords.filter((candidate) => !candidate.productiveUxEligible)) {
      expect(["P1_AFTER_MVP", "REFERENCE_ONLY", "HOLD_PENDING_DECISION"], `${record.pageId} protected scope`).toContain(record.routeScope);
      expect(record.mode, `${record.pageId} protected mode`).toBe(expectedModes[record.routeScope]);
      expect(record.proofPosture, `${record.pageId} protected proof posture`).toMatch(/^(visual_reference|blocked_scope)$/);
      expect(record.audience, `${record.pageId} protected audience`).toMatch(/^(internal|reference_reviewer)$/);
      expect(record.forbiddenTreatment, `${record.pageId} forbidden treatment`).toMatch(/No (productive|MVP)/);
    }
  });

  test("makes page contracts projections of the canonical operating model", () => {
    for (const route of screenRoutes) {
      const model = uxOperatingModelForRoute(route);
      const pageContract = uxPageContractForRoute(route);

      expect(pageContract.mode, `${route.pageId} page contract mode`).toBe(model.mode);
      expect(pageContract.audience, `${route.pageId} page contract audience`).toBe(model.audience);
      expect(pageContract.proofPosture, `${route.pageId} page contract proof posture`).toBe(model.proofPosture);
      expect(pageContract.productiveUxEligible, `${route.pageId} page contract productive eligibility`).toBe(model.productiveUxEligible);
      expect(pageContract.noOverclaimRule, `${route.pageId} page contract no-overclaim rule`).toBe(model.noOverclaimRule);
      expect(pageContract.allowedTreatment, `${route.pageId} page contract allowed treatment`).toBe(model.allowedTreatment);
      expect(pageContract.forbiddenTreatment, `${route.pageId} page contract forbidden treatment`).toBe(model.forbiddenTreatment);
    }
  });

  test("projects operating mode into capture metadata without complete-slice overclaim", () => {
    for (const route of screenRoutes) {
      const model = uxOperatingModelForRoute(route);
      const context = captureModelContextForRoute(route);

      expect(context.uxOperatingModel.mode, `${route.pageId} capture mode`).toBe(model.mode);
      expect(context.uxOperatingModel.audience, `${route.pageId} capture audience`).toBe(model.audience);
      expect(context.uxOperatingModel.proofPosture, `${route.pageId} capture proof posture`).toBe(model.proofPosture);
      expect(context.uxOperatingModel.productiveUxEligible, `${route.pageId} capture productive eligibility`).toBe(model.productiveUxEligible);
      expect(context.uxOperatingModel.noOverclaimRule, `${route.pageId} capture no-overclaim rule`).toBe(model.noOverclaimRule);
      expect(context.capability.status, `${route.pageId} capture status`).not.toBe("COMPLETE_VERTICAL_SLICE");
    }
  });

  test("does not let client-safe records carry internal preview proof posture", () => {
    for (const record of uxOperatingModelRecords.filter((candidate) => candidate.audience === "client_safe")) {
      expect(record.mode, `${record.pageId} client-safe mode`).toBe("OPERATIONAL_CLIENT_SAFE");
      expect(record.proofPosture, `${record.pageId} client-safe proof posture`).toBe("client_projection");
      expect(record.noOverclaimRule, `${record.pageId} client-safe no-overclaim`).toMatch(/Client|client|released|redacted|safe/);
    }
  });
});
