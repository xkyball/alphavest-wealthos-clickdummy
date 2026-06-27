import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

test.describe("E05 canonical action rail contract", () => {
  test("implements action rail metadata through the shared primitive", () => {
    const source = readFileSync("components/ux-action-rail.tsx", "utf8");

    expect(source).toContain("uxActionAttributesFor");
    expect(source).toContain('placement = "adjacent_rail"');
    expect(source).toContain('availability: "blocked_static"');
    expect(source).toContain("data-ux-rail-kind");
    expect(source).toContain('data-ux-content-tier="must-see"');
  });

  test("migrates the complexity priority rail through the shared primitive", () => {
    const source = readFileSync("components/ux-complexity-priority-panel.tsx", "utf8");

    expect(source).toContain("UxActionRail");
    expect(source).toContain('testId="ux-complexity-action-rail"');
    expect(source).not.toContain('data-testid="ux-complexity-action-rail" data-ux-content-tier="must-see"');
  });

  test("projects worksurface sticky rails through E02 template and E05 action metadata", () => {
    const source = readFileSync("components/worksurface-shell.tsx", "utf8");

    expect(source).toContain("uxActionAttributesFor");
    expect(source).toContain('template.actionZoneBehavior === "sticky_action_zone" ? "sticky_rail" : "adjacent_rail"');
    expect(source).toContain("railActionAttributes");
    expect(source).toContain('data-testid="wp02-worksurface-rail"');
    expect(source).toContain('data-ux-template-zone="action_zone"');
  });
});
