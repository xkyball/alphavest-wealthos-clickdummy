import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

import {
  uxDataFieldAttributesFor,
  uxDataSurfaceActionAttributesFor,
  uxDataSurfaceActionContractFor,
  uxDataSurfaceAttributesFor,
  uxDataSurfaceDensityForPreset,
  uxDataSurfaceDensityPresets,
  uxDataSurfaceActionPolicies,
  uxDataSurfaceDensities,
  uxDataSurfaceFamilies,
  uxDataSurfaceFilterStates,
  uxMasterDetailModes,
} from "../lib/ux-data-surface-contract";

const repoRoot = process.cwd();

function readSource(...segments: string[]) {
  return readFileSync(join(repoRoot, ...segments), "utf8");
}

test.describe("E06 data surface contract", () => {
  test("defines the canonical surface vocabulary approved by E06", () => {
    expect(uxDataSurfaceFamilies).toEqual([
      "table",
      "list",
      "queue",
      "board",
      "audit_log",
      "redaction_table",
      "permission_matrix",
      "detail_support_list",
    ]);
    expect(uxDataSurfaceDensities).toEqual([
      "compact_operations",
      "standard_review",
      "spacious_detail_support",
      "mobile_card_projection",
    ]);
    expect(uxDataSurfaceDensityPresets).toEqual([
      "compact",
      "default",
      "comfortable",
    ]);
    expect(uxDataSurfaceDensityForPreset("compact")).toBe("compact_operations");
    expect(uxDataSurfaceDensityForPreset("default")).toBe("standard_review");
    expect(uxDataSurfaceDensityForPreset("comfortable")).toBe("spacious_detail_support");
    expect(uxDataSurfaceActionPolicies).toEqual([
      "none",
      "open_detail",
      "preview",
      "route_handoff",
      "command_handoff",
      "blocked_static",
      "disabled_unavailable",
    ]);
    expect(uxDataSurfaceFilterStates).toContain("disabled_static");
    expect(uxMasterDetailModes).toContain("route_detail");
  });

  test("projects proof attributes for surfaces fields and row actions", () => {
    expect(uxDataSurfaceAttributesFor({
      actionPolicy: "open_detail",
      density: "standard_review",
      family: "queue",
      filterState: "active_query",
      masterDetailMode: "route_detail",
      stickyHeader: false,
      stickyRail: false,
    })).toMatchObject({
      "data-ux-data-surface-action-policy": "open_detail",
      "data-ux-data-surface-density": "standard_review",
      "data-ux-data-surface-density-preset": "default",
      "data-ux-data-surface-family": "queue",
      "data-ux-data-surface-filter-state": "active_query",
      "data-ux-master-detail-mode": "route_detail",
      "data-ux-no-overclaim": "true",
    });

    expect(uxDataFieldAttributesFor("identity")).toEqual({
      "data-ux-data-surface-field-priority": "identity",
    });

    expect(uxDataSurfaceActionAttributesFor("open_detail")).toMatchObject({
      "data-ux-action-meaning": "navigate",
      "data-ux-data-surface-action-policy": "open_detail",
      "data-ux-data-surface-action-renders-affordance": "true",
      "data-ux-no-overclaim": "true",
    });
  });

  test("keeps row actions from implying downstream gates", () => {
    expect(uxDataSurfaceActionContractFor("open_detail")).toMatchObject({
      actionMeaning: "navigate",
      downstreamForbidden: expect.stringContaining("release"),
      rendersAffordance: true,
    });
    expect(uxDataSurfaceActionContractFor("none")).toMatchObject({
      downstreamForbidden: "any row or card action authority",
      rendersAffordance: false,
    });
    expect(uxDataSurfaceActionContractFor("command_handoff").noOverclaimRule).toContain("explicit action contract");
  });

  test("DataTable projects E06 density field priority and row action metadata", () => {
    const dataTable = readSource("components", "ui", "data-table.tsx");

    expect(dataTable).toContain("type UxDataSurfaceDensity");
    expect(dataTable).toContain("type UxDataSurfaceActionPolicy");
    expect(dataTable).toContain("priority?: UxDataFieldPriority");
    expect(dataTable).toContain("uxDataSurfaceAttributesFor");
    expect(dataTable).toContain("uxDataFieldAttributesFor");
    expect(dataTable).toContain("uxDataSurfaceActionAttributesFor");
    expect(dataTable).toContain('uxDataSurfaceDensityForPreset(density ?? (compact ? "compact" : "default"))');
    expect(dataTable).toContain("data-ux-data-surface-row-action-priority");
    expect(dataTable).toContain('resolvedActionPolicy = actionPolicy ?? (onRowAction ? "open_detail" : "disabled_unavailable")');
    expect(dataTable).toContain('data-ux-row-action-state={actionEnabled ? "enabled" : "disabled"}');
    expect(dataTable).toContain('"mobile_card_projection"');
  });
});
