import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import {
  uxActionAttributesFor,
  uxActionClassForPriority,
  uxActionMeaningContractFor,
  uxActionMeanings,
  uxActionPriorities,
} from "../lib/ux-action-hierarchy-contract";

test.describe("E05 canonical action hierarchy contract", () => {
  test("defines the approved action priorities", () => {
    expect(uxActionPriorities).toEqual([
      "primary",
      "secondary",
      "tertiary",
      "recovery",
      "destructive",
      "blocked",
    ]);
  });

  test("defines distinct action meanings for high-risk workflow gates", () => {
    expect(uxActionMeanings).toEqual(expect.arrayContaining([
      "approve",
      "release",
      "block",
      "request_evidence",
      "export_approval",
      "export_generate",
      "download",
      "share",
      "client_acceptance",
    ]));

    expect(uxActionMeaningContractFor("approve").downstreamSeparation).toContain("not release");
    expect(uxActionMeaningContractFor("release").downstreamSeparation).toContain("not export approval");
    expect(uxActionMeaningContractFor("export_approval").downstreamSeparation).toContain("not generation");
    expect(uxActionMeaningContractFor("download").downstreamSeparation).toContain("not share");
    expect(uxActionMeaningContractFor("request_evidence").noOverclaimRule).toContain("evidence sufficiency");
    expect(uxActionMeaningContractFor("block").defaultPriority).toBe("destructive");
  });

  test("projects runtime action attributes from the canonical contract", () => {
    expect(uxActionAttributesFor({
      availability: "enabled",
      meaning: "release",
      placement: "modal_footer",
      priority: "primary",
    })).toMatchObject({
      "data-ux-action-availability": "enabled",
      "data-ux-action-meaning": "release",
      "data-ux-action-placement": "modal_footer",
      "data-ux-action-priority": "primary",
      "data-ux-no-overclaim": "true",
      "data-ux-primary-cta": "true",
      "data-ux-requires-audit": "true",
      "data-ux-requires-confirmation": "true",
    });

    expect(uxActionAttributesFor({
      availability: "blocked_static",
      disabledReason: "Release remains blocked until evidence gates pass.",
      meaning: "block",
      placement: "sticky_rail",
      priority: "blocked",
      requiresPermission: false,
    })).toMatchObject({
      "data-ux-action-availability": "blocked_static",
      "data-ux-action-meaning": "block",
      "data-ux-action-placement": "sticky_rail",
      "data-ux-action-priority": "blocked",
      "data-ux-disabled-message": "accessible",
      "data-ux-disabled-reason": "Release remains blocked until evidence gates pass.",
      "data-ux-interactive": "false",
      "data-ux-requires-permission": "false",
    });
  });

  test("keeps visual class families centralized by action priority", () => {
    expect(uxActionClassForPriority("primary")).toContain("bg-alphavest-gold");
    expect(uxActionClassForPriority("secondary")).toContain("border-alphavest-border");
    expect(uxActionClassForPriority("recovery")).toContain("text-alphavest-gold-soft");
    expect(uxActionClassForPriority("destructive")).toContain("text-alphavest-red");
    expect(uxActionClassForPriority("blocked")).toContain("cursor-default");
  });

  test("shared primitives import and project the canonical action contract", () => {
    const sources = [
      "components/page-header.tsx",
      "components/ui/guarded-action-button.tsx",
      "components/ui/action-zone.tsx",
    ];

    for (const sourcePath of sources) {
      const source = readFileSync(sourcePath, "utf8");

      expect(source, sourcePath).toContain("uxActionAttributesFor");
      expect(source, sourcePath).toContain("uxActionClassForPriority");
      expect(source, sourcePath).not.toContain("const primaryClass =");
      expect(source, sourcePath).not.toContain("const secondaryClass =");
    }
  });

  test("ActionZone is the shared E05 route-family action primitive", () => {
    const source = readFileSync("components/ui/action-zone.tsx", "utf8");

    expect(source).toContain("export function ActionZone");
    expect(source).toContain("export function StickyActionZone");
    expect(source).toContain("export function ActionButton");
    expect(source).toContain("uxActionAttributesFor");
    expect(source).toContain("DisabledControlReason");
    expect(source).toContain("data-ux-action-zone");
  });
});
