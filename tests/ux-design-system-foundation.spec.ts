import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

import {
  uxPrimitiveAttributesFor,
  uxPrimitiveDensities,
  uxPrimitiveDensityClassFor,
  uxPrimitiveStatusAttributesFor,
  uxPrimitiveStatusClassFor,
  uxPrimitiveStatusFamilies,
  uxPrimitiveTextClassFor,
  uxPrimitiveTextRoles,
} from "../lib/ux-design-system-foundation";

test.describe("E01 design-system foundation", () => {
  test("defines compact default and comfortable primitive density contracts", () => {
    expect(uxPrimitiveDensities).toEqual(["compact", "default", "comfortable"]);
    expect(uxPrimitiveDensityClassFor("compact")).toBe("av-density-compact");
    expect(uxPrimitiveDensityClassFor("default")).toBe("av-density-default");
    expect(uxPrimitiveDensityClassFor("comfortable")).toBe("av-density-comfortable");

    expect(uxPrimitiveAttributesFor({ density: "comfortable", primitive: "state-panel", textRole: "body" })).toMatchObject({
      "data-ux-primitive": "state-panel",
      "data-ux-primitive-density": "comfortable",
      "data-ux-primitive-spacing": "relaxed",
      "data-ux-text-role": "body",
    });
  });

  test("defines text roles without viewport scaled or negative letter spacing", () => {
    expect(uxPrimitiveTextRoles).toEqual(["body", "caption", "eyebrow", "heading", "metadata"]);
    expect(uxPrimitiveTextClassFor("eyebrow")).toBe("av-text-eyebrow");
    expect(uxPrimitiveTextClassFor("heading")).toBe("av-text-heading");

    const globals = readFileSync("app/globals.css", "utf8");

    for (const token of [
      "--av-text-eyebrow-size",
      "--av-text-heading-size",
      "--av-text-body-size",
      "--av-text-metadata-size",
      "--av-text-caption-size",
    ]) {
      expect(globals).toContain(token);
    }

    expect(globals).not.toContain("letter-spacing: -");
    expect(globals).not.toMatch(/font-size:\s*[0-9.]+vw/);
  });

  test("defines semantic status families with non-color runtime cues", () => {
    expect(uxPrimitiveStatusFamilies).toEqual([
      "critical",
      "info",
      "internal",
      "neutral",
      "restricted",
      "success",
      "warning",
    ]);
    expect(uxPrimitiveStatusClassFor("critical")).toBe("av-status-critical");
    expect(uxPrimitiveStatusAttributesFor("critical")).toMatchObject({
      "data-ux-status-color-only": "false",
      "data-ux-status-family": "critical",
      "data-ux-status-non-color-cue": "icon-and-label",
      "data-ux-status-severity": "critical",
    });
  });

  test("shared primitives project E01 foundation metadata from the canonical contract", () => {
    const badge = readFileSync("components/ui/badge.tsx", "utf8");
    const statusChip = readFileSync("components/ui/status-chip.tsx", "utf8");
    const workflowBadge = readFileSync("components/ui/workflow-badge.tsx", "utf8");
    const statePanel = readFileSync("components/ui/state-panel.tsx", "utf8");
    const uiIndex = readFileSync("components/ui/index.ts", "utf8");

    expect(badge).toContain("uxPrimitiveAttributesFor");
    expect(badge).toContain("uxPrimitiveStatusAttributesFor");
    expect(statusChip).toContain("family: \"success\"");
    expect(statusChip).toContain("statusFamily={meta.family}");
    expect(workflowBadge).toContain("statusFamily={meta.family}");
    expect(statePanel).toContain("uxPrimitiveDensityClassFor(\"comfortable\")");
    expect(statePanel).toContain("uxPrimitiveStatusAttributesFor(primitiveStatusFamily)");
    expect(uiIndex).toContain('export * from "@/components/ui/a11y-status";');
    expect(uiIndex).toContain('export * from "@/components/ui/disabled-control-reason";');
  });
});
