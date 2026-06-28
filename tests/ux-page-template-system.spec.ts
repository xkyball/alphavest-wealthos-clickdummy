import { expect, test } from "@playwright/test";

import { screenRoutes } from "../lib/route-registry";
import { uxOperatingModelForRoute } from "../lib/ux-operating-model";
import { uxPageContractForRoute } from "../lib/ux-page-contract";
import {
  uxPageTemplateDefinitions,
  uxPageTemplateForRoute,
  uxPageTemplateIntegrity,
  uxPageTemplateRecords,
  uxPageTemplateZones,
  uxShellSlotPolicyForRoute,
  type UxPageTemplateFamily,
} from "../lib/ux-page-template-system";

test.describe("E02 canonical page template system", () => {
  test("defines the approved template families and zone vocabulary", () => {
    expect(Object.keys(uxPageTemplateDefinitions).sort()).toEqual([
      "client_summary",
      "dashboard_list",
      "detail_decision_room",
      "reference_hold",
      "workbench_master_detail",
      "workflow_stepper",
    ]);
    expect([...uxPageTemplateZones]).toEqual([
      "header",
      "summary",
      "primary_content",
      "secondary_content",
      "action_zone",
      "state_zone",
      "proof_audit_zone",
    ]);
  });

  test("materializes one approved template record for every registered route", () => {
    expect(uxPageTemplateIntegrity.totalCount).toBe(71);
    expect(uxPageTemplateIntegrity.missingPageIds).toEqual([]);
    expect(uxPageTemplateIntegrity.duplicatePageIds).toEqual([]);
    expect(uxPageTemplateIntegrity.templateFamilies).toEqual([
      "client_summary",
      "dashboard_list",
      "detail_decision_room",
      "reference_hold",
      "workbench_master_detail",
      "workflow_stepper",
    ]);

    for (const route of screenRoutes) {
      const template = uxPageTemplateForRoute(route);

      expect(template.pageId).toBe(route.pageId);
      expect(template.family, `${route.pageId} template family`).toBeTruthy();
      expect(template.requiredZones.length, `${route.pageId} required zones`).toBeGreaterThan(0);
      expect(template.allowedRenderers.length, `${route.pageId} renderers`).toBeGreaterThan(0);
      expect(template.noOverclaimRule, `${route.pageId} no-overclaim`).toContain(" ");
      expect(template.longPageBehavior, `${route.pageId} long-page behavior`).toBeTruthy();
      expect(template.actionZoneBehavior, `${route.pageId} action-zone behavior`).toBeTruthy();
      expect(template.proofAuditPlacement, `${route.pageId} proof/audit placement`).toBeTruthy();
      expect(template.pageJob, `${route.pageId} page job`).toMatch(/^(audit_reference|client_summary|decision_room|queue|queue_detail|stepper)$/);
      expect(template.activeStep, `${route.pageId} active step`).toMatch(/^(approval|audit|blocked|confirmation|decision|download|intake|overview|redaction|review|scope|triage)$/);
    }
  });

  test("projects from the E01 operating model and page contract", () => {
    for (const route of screenRoutes) {
      const model = uxOperatingModelForRoute(route);
      const pageContract = uxPageContractForRoute(route);
      const template = uxPageTemplateForRoute(route);

      expect(template.mode, `${route.pageId} mode`).toBe(model.mode);
      expect(template.audience, `${route.pageId} audience`).toBe(model.audience);
      expect(template.proofPosture, `${route.pageId} proof posture`).toBe(model.proofPosture);
      expect(template.productiveUxEligible, `${route.pageId} productive eligibility`).toBe(model.productiveUxEligible);
      expect(template.noOverclaimRule, `${route.pageId} no-overclaim`).toBe(model.noOverclaimRule);
      expect(template.densityTier, `${route.pageId} density tier`).toBe(pageContract.densityTier);
      expect(template.pageType, `${route.pageId} page type`).toBe(pageContract.pageType);
      expect(template.workspace, `${route.pageId} workspace`).toBe(pageContract.workspace);
    }
  });

  test("exposes shell slot governance for every registered route", () => {
    for (const route of screenRoutes) {
      const template = uxPageTemplateForRoute(route);
      const policy = uxShellSlotPolicyForRoute(route);

      expect(policy.pageId, `${route.pageId} policy page`).toBe(route.pageId);
      expect(policy.pageJob, `${route.pageId} policy job`).toBe(template.pageJob);
      expect(policy.activeStep, `${route.pageId} policy step`).toBe(template.activeStep);
      expect(policy.allowedZones.length, `${route.pageId} allowed zones`).toBeGreaterThan(0);
      expect(policy.proofAuditPlacement, `${route.pageId} proof placement`).toBe(template.proofAuditPlacement);
      expect(policy.freeformChildrenPolicy, `${route.pageId} children policy`).toBe(template.productiveUxEligible ? "classified_slot_only" : "reference_context_only");
    }
  });

  test("keeps protected scopes mechanically non-productive through reference_hold", () => {
    expect(uxPageTemplateIntegrity.protectedRoutesWithProductiveTemplate).toEqual([]);

    for (const template of uxPageTemplateRecords.filter((record) => !record.productiveUxEligible)) {
      expect(template.family, `${template.pageId} protected template`).toBe("reference_hold");
      expect(template.actionZoneBehavior, `${template.pageId} protected action zone`).toBe("blocked_state_only");
      expect(template.requiredZones, `${template.pageId} protected zones`).toEqual(["header", "summary", "state_zone"]);
      expect(template.forbiddenZones, `${template.pageId} protected forbidden zones`).toContain("action_zone");
      expect(template.forbiddenZones, `${template.pageId} protected forbidden zones`).toContain("proof_audit_zone");
      expect(template.proofAuditPlacement, `${template.pageId} protected proof/audit`).toBe("protected_state_only");
    }
  });

  test("maps representative routes to the intended page-template families", () => {
    const expectedFamilies: Record<string, UxPageTemplateFamily> = {
      "004": "workflow_stepper",
      "019": "dashboard_list",
      "020": "client_summary",
      "027": "workbench_master_detail",
      "033": "dashboard_list",
      "039": "detail_decision_room",
      "040": "workflow_stepper",
      "042": "detail_decision_room",
      "054": "workflow_stepper",
      "061": "reference_hold",
    };

    for (const [pageId, family] of Object.entries(expectedFamilies)) {
      const route = screenRoutes.find((candidate) => candidate.pageId === pageId);

      expect(route, `${pageId} registered`).toBeTruthy();
      expect(uxPageTemplateForRoute(route!).family).toBe(family);
    }
  });

  test("keeps client summaries client-safe and away from proof/debug authority", () => {
    for (const template of uxPageTemplateRecords.filter((record) => record.family === "client_summary")) {
      expect(template.audience, `${template.pageId} client audience`).toBe("client_safe");
      expect(template.mode, `${template.pageId} client mode`).toBe("OPERATIONAL_CLIENT_SAFE");
      expect(template.proofAuditPlacement, `${template.pageId} proof placement`).toBe("client_safe_summary_only");
      expect(template.requiredZones, `${template.pageId} client zones`).toContain("state_zone");
      expect(template.optionalZones, `${template.pageId} client optional proof`).toContain("proof_audit_zone");
    }
  });
});
