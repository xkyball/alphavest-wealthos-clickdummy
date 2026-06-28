import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  uxPageTemplateDefinitions,
  uxPageTemplateRecords,
  uxShellSlotPolicyForTemplate,
} from "../lib/ux-page-template-system";

function source(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

test.describe("E02 long-page and sticky action-zone patterns", () => {
  test("template definitions declare long-page behavior for workbench and detail families", () => {
    expect(uxPageTemplateDefinitions.dashboard_list.longPageBehavior).toBe("sticky_summary_rail");
    expect(uxPageTemplateDefinitions.workbench_master_detail.longPageBehavior).toBe("split_view");
    expect(uxPageTemplateDefinitions.detail_decision_room.longPageBehavior).toBe("sticky_summary_rail");
    expect(uxPageTemplateDefinitions.workflow_stepper.longPageBehavior).toBe("tabs");
    expect(uxPageTemplateDefinitions.reference_hold.longPageBehavior).toBe("none");
  });

  test("shared renderers expose long-page anchors and template zones", () => {
    const pageTemplate = source("components/ui/page-template.tsx");
    const worksurface = source("components/worksurface-shell.tsx");
    const hub = source("components/ux-hub-page.tsx");
    const detail = source("components/ux-detail-standard-panel.tsx");
    const skeleton = source("components/route-skeleton-page.tsx");

    expect(pageTemplate).toContain("PageTemplateFrame");
    expect(pageTemplate).toContain("PageTemplateSectionNav");
    expect(pageTemplate).toContain("PageTemplateSummaryRail");
    expect(pageTemplate).toContain("data-ux-long-page-section-nav");
    expect(pageTemplate).toContain("data-ux-page-template-summary-rail");
    expect(source("components/ui/index.ts")).toContain('export * from "@/components/ui/page-template"');
    expect(worksurface).toContain("PageTemplateFrame");
    expect(worksurface).toContain("PageTemplateSectionNav");
    expect(worksurface).toContain("PageTemplateSummaryRail");
    expect(pageTemplate).toContain("data-ux-shell-allowed-zones");
    expect(pageTemplate).toContain("data-ux-shell-command-zone");
    expect(pageTemplate).toContain("data-ux-shell-freeform-children");
    expect(pageTemplate).toContain("data-ux-shell-long-screen-exception-required");

    for (const contents of [worksurface, hub, detail, skeleton]) {
      expect(contents).toContain("data-ux-long-page-anchor");
      expect(contents).toContain("data-ux-template-zone");
    }

    expect(worksurface).toContain('data-ux-long-page-region="sticky_rail"');
    expect(worksurface).toContain("data-ux-sticky-action-zone");
    expect(hub).toContain('data-ux-long-page-region="sticky_action"');
    expect(detail).toContain('data-ux-long-page-region="sticky_action"');
    expect(detail).toContain('data-ux-template-zone="proof_audit_zone"');
  });

  test("shell slot policies classify productive P0 children and long-screen exceptions", () => {
    const productiveTemplates = uxPageTemplateRecords.filter((record) => record.productiveUxEligible);

    expect(productiveTemplates.length).toBeGreaterThan(0);

    for (const template of productiveTemplates) {
      const policy = uxShellSlotPolicyForTemplate(template);

      expect(policy.pageJob, `${template.pageId} page job`).toBe(template.pageJob);
      expect(policy.activeStep, `${template.pageId} active step`).toBe(template.activeStep);
      expect(policy.allowedZones, `${template.pageId} allowed zones`).toContain("primary_content");
      expect(policy.freeformChildrenPolicy, `${template.pageId} freeform children`).toBe("classified_slot_only");
      expect(policy.requiresLongScreenExceptionMetadata, `${template.pageId} exception metadata`).toBe(template.longPageBehavior !== "none");

      if (template.requiredZones.includes("action_zone")) {
        expect(policy.commandZone, `${template.pageId} command zone`).toBe("action_zone");
      }
    }
  });
});
