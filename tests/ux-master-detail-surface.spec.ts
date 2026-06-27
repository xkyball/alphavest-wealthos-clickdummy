import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const repoRoot = process.cwd();

function readSource(...segments: string[]) {
  return readFileSync(join(repoRoot, ...segments), "utf8");
}

test.describe("E07 master-detail surface adoption", () => {
  test("provides a reusable master-detail adapter backed by the data-surface contract", () => {
    const source = readSource("components", "ui", "master-detail-surface.tsx");
    const exports = readSource("components", "ui", "index.ts");

    expect(source).toContain("export function MasterDetailSurface");
    expect(source).toContain("uxDataSurfaceAttributesFor");
    expect(source).toContain("masterDetailMode");
    expect(source).toContain("data-ux-master-detail-selected-object");
    expect(source).toContain("data-ux-master-detail-selected-state");
    expect(exports).toContain('export * from "@/components/ui/master-detail-surface"');
  });

  test("marks advisor and compliance queues as route-detail handoff surfaces", () => {
    const source = readSource("components", "internal-workflow-screen.tsx");

    expect(source).toContain('family="queue"');
    expect(source).toContain('actionPolicy="route_handoff"');
    expect(source).toContain('masterDetailMode="route_detail"');
    expect(source).toContain('filterState={searchTerm.length > 0 ? "active_query" : "inactive"}');
  });

  test("marks the wealth action board as the representative board-to-detail surface", () => {
    const source = readSource("components", "wealth-actions-screen.tsx");

    expect(source).toContain("<MasterDetailSurface");
    expect(source).toContain('family="board"');
    expect(source).toContain('filterState="disabled_static"');
    expect(source).toContain('masterDetailMode={drawerOpen ? "drawer_detail" : "inline_detail_rail"}');
    expect(source).toContain("selectedObjectId={selectedAction.id}");
    expect(source).toContain("selectedObjectState={selectedAction.evidenceState}");
  });
});
