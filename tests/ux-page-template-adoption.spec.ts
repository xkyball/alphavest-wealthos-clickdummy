import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { uxPageTemplateForPageId } from "../lib/ux-page-template-system";

const templateAttribute = "data-ux-page-template-family";

function source(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

test.describe("E02 page-template adoption", () => {
  test("shared page-family renderers expose canonical template metadata", () => {
    const renderers = [
      "components/worksurface-shell.tsx",
      "components/ux-hub-page.tsx",
      "components/ux-detail-standard-panel.tsx",
      "components/route-skeleton-page.tsx",
    ];

    for (const renderer of renderers) {
      const contents = source(renderer);

      expect(contents, `${renderer} imports template contract`).toContain("uxPageTemplateFor");
      expect(contents, `${renderer} family attribute`).toContain(templateAttribute);
      expect(contents, `${renderer} long-page attribute`).toContain("data-ux-page-template-long-page");
      expect(contents, `${renderer} action-zone attribute`).toContain("data-ux-page-template-action-zone");
      expect(contents, `${renderer} required-zones attribute`).toContain("data-ux-page-template-required-zones");
      expect(contents, `${renderer} proof/audit attribute`).toContain("data-ux-page-template-proof-audit");
    }
  });

  test("page-id lookup supports representative adopted families", () => {
    expect(uxPageTemplateForPageId("019")).toMatchObject({
      family: "client_summary",
      proofAuditPlacement: "client_safe_summary_only",
    });
    expect(uxPageTemplateForPageId("033")).toMatchObject({
      family: "dashboard_list",
      longPageBehavior: "sticky_summary_rail",
    });
    expect(uxPageTemplateForPageId("039")).toMatchObject({
      actionZoneBehavior: "adjacent_action_rail",
      family: "detail_decision_room",
    });
    expect(uxPageTemplateForPageId("061")).toMatchObject({
      actionZoneBehavior: "blocked_state_only",
      family: "reference_hold",
    });
  });
});
