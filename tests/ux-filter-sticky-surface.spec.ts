import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const repoRoot = process.cwd();

function readSource(...segments: string[]) {
  return readFileSync(join(repoRoot, ...segments), "utf8");
}

test.describe("E07 filter and sticky data-surface conventions", () => {
  test("FilterBar projects inactive active and disabled-static filter metadata", () => {
    const source = readSource("components", "ui", "filter-bar.tsx");

    expect(source).toContain("type UxDataSurfaceFilterState");
    expect(source).toContain("uxDataSurfaceAttributesFor");
    expect(source).toContain('filters.length > 0 ? "disabled_static" : tabs.length > 0 ? "active_filter" : "inactive"');
    expect(source).toContain('data-ux-data-surface-filter-state="active_filter"');
    expect(source).toContain('data-ux-data-surface-filter-state={resolvedFilterState}');
    expect(source).toContain('data-ux-data-surface-filter-state="disabled_static"');
  });

  test("DataTable exposes sticky-header convention without forcing all tables sticky", () => {
    const source = readSource("components", "ui", "data-table.tsx");

    expect(source).toContain("stickyHeader?: boolean");
    expect(source).toContain("stickyHeader = false");
    expect(source).toContain("stickyHeader && \"sticky top-0 z-10\"");
    expect(source).toContain("stickyHeader,");
  });

  test("representative consumers expose active and disabled filter states", () => {
    const internalWorkflow = readSource("components", "internal-workflow-screen.tsx");
    const wealthActions = readSource("components", "wealth-actions-screen.tsx");

    expect(internalWorkflow).toContain('filterState={searchTerm.length > 0 ? "active_query" : "inactive"}');
    expect(wealthActions).toContain('filterState="disabled_static"');
  });
});
