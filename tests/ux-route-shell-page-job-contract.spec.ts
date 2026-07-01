import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { screenRoutes } from "../lib/route-registry";
import {
  uxPageTemplateForPageId,
  uxPageTemplateForRoute,
} from "../lib/ux-page-template-system";
import {
  uxRouteShellPageJobAllowedJobs,
  uxRouteShellPageJobContractForTemplate,
  uxRouteShellPageJobContractId,
  uxRouteShellPageJobDataAttributesForTemplate,
  uxRouteShellPageJobTemplateFamilyJobs,
} from "../lib/ux-route-shell-page-job-contract";

function source(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

test.describe("DOMAIN-03 route registry, shell and page-job contract", () => {
  test("declares the canonical page-job vocabulary and family mapping", () => {
    expect([...uxRouteShellPageJobAllowedJobs]).toEqual([
      "audit_reference",
      "client_summary",
      "decision_room",
      "queue",
      "queue_detail",
      "stepper",
    ]);
    expect(uxRouteShellPageJobTemplateFamilyJobs).toEqual({
      client_summary: "client_summary",
      dashboard_list: "queue",
      detail_decision_room: "decision_room",
      reference_hold: "audit_reference",
      workbench_master_detail: "queue_detail",
      workflow_stepper: "stepper",
    });
  });

  test("materializes source-level contract records for every registered route", () => {
    for (const route of screenRoutes) {
      const template = uxPageTemplateForRoute(route);
      const contract = uxRouteShellPageJobContractForTemplate(template);
      const attrs = uxRouteShellPageJobDataAttributesForTemplate(template);

      expect(contract.contractId, `${route.pageId} contract id`).toBe(uxRouteShellPageJobContractId);
      expect(contract.pageId, `${route.pageId} page id`).toBe(route.pageId);
      expect(contract.pageJob, `${route.pageId} page job`).toBe(template.pageJob);
      expect(contract.family, `${route.pageId} family`).toBe(template.family);
      expect(contract.allowedZones.length, `${route.pageId} allowed zones`).toBeGreaterThan(0);
      expect(attrs["data-ux-contract-id"], `${route.pageId} data contract`).toBe(uxRouteShellPageJobContractId);
      expect(attrs["data-ux-route-contract"], `${route.pageId} route contract`).toBe("registered_route_policy");
      expect(attrs["data-ux-page-job-contract"], `${route.pageId} job attr`).toBe(template.pageJob);
      expect(attrs["data-ux-contract-workspace"], `${route.pageId} workspace attr`).toBe(template.workspace);
      expect(attrs["data-ux-contract-no-overclaim"], `${route.pageId} no-overclaim attr`).toBe(template.noOverclaimRule);
    }
  });

  test("keeps protected routes non-productive in the shared contract", () => {
    const protectedTemplate = uxPageTemplateForPageId("061");
    const contract = uxRouteShellPageJobContractForTemplate(protectedTemplate);
    const attrs = uxRouteShellPageJobDataAttributesForTemplate(protectedTemplate);

    expect(contract.pageJob).toBe("audit_reference");
    expect(contract.family).toBe("reference_hold");
    expect(contract.commandZone).toBe("none");
    expect(contract.freeformChildrenPolicy).toBe("reference_context_only");
    expect(contract.productiveUxEligible).toBe(false);
    expect(attrs["data-ux-contract-productive"]).toBe("false");
    expect(attrs["data-ux-shell-contract"]).toBe("reference_context_only");
  });

  test("pins representative routes to the intended page-job contract", () => {
    expect(uxRouteShellPageJobContractForTemplate(uxPageTemplateForPageId("020"))).toMatchObject({
      family: "client_summary",
      pageJob: "client_summary",
    });
    expect(uxRouteShellPageJobContractForTemplate(uxPageTemplateForPageId("033"))).toMatchObject({
      family: "dashboard_list",
      pageJob: "queue",
    });
    expect(uxRouteShellPageJobContractForTemplate(uxPageTemplateForPageId("039"))).toMatchObject({
      commandZone: "action_zone",
      family: "detail_decision_room",
      pageJob: "decision_room",
    });
    expect(uxRouteShellPageJobContractForTemplate(uxPageTemplateForPageId("054"))).toMatchObject({
      family: "workflow_stepper",
      pageJob: "stepper",
    });
  });

  test("prevents required slots from falling back to unclassified stacking", () => {
    for (const route of screenRoutes) {
      const template = uxPageTemplateForRoute(route);
      const contract = uxRouteShellPageJobContractForTemplate(template);
      const attrs = uxRouteShellPageJobDataAttributesForTemplate(template);

      for (const zone of template.requiredZones) {
        expect(contract.allowedZones, `${route.pageId} required zone ${zone}`).toContain(zone);
        expect(attrs["data-ux-contract-allowed-zones"], `${route.pageId} attr zone ${zone}`).toContain(zone);
      }

      if (template.productiveUxEligible) {
        expect(contract.freeformChildrenPolicy, `${route.pageId} productive freeform policy`).toBe("classified_slot_only");
        expect(contract.allowedZones, `${route.pageId} productive state zone`).toContain("state_zone");
      } else {
        expect(contract.freeformChildrenPolicy, `${route.pageId} protected freeform policy`).toBe("reference_context_only");
      }
    }
  });

  test("pins no-overclaim rules for representative safety boundaries", () => {
    expect(uxRouteShellPageJobContractForTemplate(uxPageTemplateForPageId("020")).noOverclaimRule).toContain("released, redacted and client-safe");
    expect(uxRouteShellPageJobContractForTemplate(uxPageTemplateForPageId("033")).noOverclaimRule).toContain("Internal drafts");
    expect(uxRouteShellPageJobContractForTemplate(uxPageTemplateForPageId("039")).noOverclaimRule).toContain("client-safe output");
    expect(uxRouteShellPageJobContractForTemplate(uxPageTemplateForPageId("054")).noOverclaimRule).toContain("Export preview");
    expect(uxRouteShellPageJobContractForTemplate(uxPageTemplateForPageId("061")).noOverclaimRule).toContain("must not imply product workflow");
  });

  test("PageTemplateFrame exposes the contract as runtime attributes", () => {
    const pageTemplateFrame = source("components/ui/page-template.tsx");

    expect(pageTemplateFrame).toContain("uxRouteShellPageJobDataAttributesForTemplate");
    expect(pageTemplateFrame).toContain("routeShellPageJobAttributes");
    expect(pageTemplateFrame).toContain("{...routeShellPageJobAttributes}");
  });
});
