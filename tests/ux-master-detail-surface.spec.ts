import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const repoRoot = process.cwd();

function readSource(...segments: string[]) {
  return readFileSync(join(repoRoot, ...segments), "utf8");
}

test.describe("E06 master-detail surface adoption", () => {
  test("provides a reusable master-detail adapter backed by the data-surface contract", () => {
    const source = readSource("components", "ui", "master-detail-surface.tsx");
    const exports = readSource("components", "ui", "index.ts");

    expect(source).toContain("export function MasterDetailSurface");
    expect(source).toContain("uxDataSurfaceAttributesFor");
    expect(source).toContain("governancePattern");
    expect(source).toContain("longScreenGovernance");
    expect(source).toContain("targetScreenId");
    expect(source).toContain("masterDetailMode");
    expect(source).toContain("data-ux-master-detail-selected-object");
    expect(source).toContain("data-ux-master-detail-selected-state");
    expect(source).toContain("data-ux-queue-workbench");
    expect(source).toContain("data-ux-queue-selected-object");
    expect(source).toContain("data-ux-queue-proof-placement");
    expect(source).toContain("data-ux-queue-action-rail");
    expect(source).toContain("data-testid=\"ux-master-detail-master\"");
    expect(source).toContain("data-testid=\"ux-master-detail-detail\"");
    expect(source).toContain("data-testid=\"ux-master-detail-selected-summary\"");
    expect(exports).toContain('export * from "@/components/ui/master-detail-surface"');
  });

  test("marks advisor and compliance queues as route-detail handoff surfaces", () => {
    const source = readSource("components", "internal-workflow-screen.tsx");

    expect(source).toContain('family="queue"');
    expect(source).toContain('actionPolicy="route_handoff"');
    expect(source).toContain('masterDetailMode="inline_detail_rail"');
    expect(source).toContain("queueWorkbench");
    expect(source).toContain('proofPlacement="inline_summary"');
    expect(source).toContain("data-ux-queue-selected");
    expect(source).toContain('filterState={searchTerm.length > 0 ? "active_query" : "inactive"}');
    expect(source).toContain("<MasterDetailSurface");
    expect(source).toContain("Advisor queue selection does not approve");
    expect(source).toContain("Compliance queue rows cannot release");
    expect(source).toContain("s038-compliance-master-list");
    expect(source).toContain("s038-compliance-selected-detail");
    expect(source).toContain('governancePattern="queue_workbench"');
    expect(source).toContain('longScreenGovernance="resolved_by_shared_surface"');
    expect(source).toContain('targetScreenId="S038"');
  });

  test("locks EPIC-04 required master-detail slots for the S038 representative migration", () => {
    const contract = JSON.parse(readSource(
      "docs",
      "00-current",
      "ALPHAVEST_MASTER_DETAIL_DATA_SURFACE_LONG_SCREEN_GOVERNANCE_CONTRACT.json",
    )) as {
      runtimeAttributeRequirements: Record<"masterDetail" | "queueWorkbench", string[]>;
    };
    const adapter = readSource("components", "ui", "master-detail-surface.tsx");
    const dataSurfaceContract = readSource("lib", "ux-data-surface-contract.ts");
    const runtimeSources = `${adapter}\n${dataSurfaceContract}`;
    const consumer = readSource("components", "internal-workflow-screen.tsx");

    for (const attribute of contract.runtimeAttributeRequirements.masterDetail) {
      expect(runtimeSources).toContain(attribute);
    }
    for (const attribute of contract.runtimeAttributeRequirements.queueWorkbench) {
      expect(runtimeSources).toContain(attribute);
    }
    expect(adapter).toContain('data-testid="ux-master-detail-master"');
    expect(adapter).toContain('data-testid="ux-master-detail-detail"');
    expect(adapter).toContain('data-testid="ux-master-detail-selected-summary"');
    expect(consumer).toContain('actionPolicy="route_handoff"');
    expect(consumer).toContain('proofPlacement="inline_summary"');
    expect(consumer).not.toContain("Compliance proof drawer");
    expect(consumer).not.toContain("Compliance queue rows can release");
    expect(consumer).not.toContain("Compliance queue rows can export");
    expect(consumer).not.toContain("Compliance queue rows can expose client-visible content");
  });

  test("marks S034 and S036 as process-owned queue workbenches without legacy hub or table fallbacks", () => {
    const source = readSource("components", "internal-workflow-screen.tsx");

    expect(source).toContain("function WorkbenchPage");
    expect(source).toContain("s034-client-master-list");
    expect(source).toContain("s034-client-selected-detail");
    expect(source).toContain("Internal workbench now keeps queue selection");
    expect(source).toContain("uxStatusCommandAttributesFor");
    expect(source).toContain("function AdvisorQueuePage");
    expect(source).toContain("s036-advisor-master-list");
    expect(source).toContain("s036-advisor-selected-detail");
    expect(source).not.toContain('primary={<UxHubPage pageId="034" />}');
    expect(source).not.toContain("<QueueCard rows={clientQueue}");
    expect(source).toContain("<DataTable");
  });

  test("marks S046 evidence vault as a queue workbench with selected evidence context", () => {
    const source = readSource("components", "decisions-governance-screen.tsx");

    expect(source).toContain("function EvidenceVaultPage");
    expect(source).toContain("<MasterDetailSurface");
    expect(source).toContain('actionPolicy="command_handoff"');
    expect(source).toContain('filterState="disabled_static"');
    expect(source).toContain("queueWorkbench");
    expect(source).toContain("s046-evidence-master-list");
    expect(source).toContain("s046-evidence-selected-detail");
    expect(source).toContain("Evidence vault keeps selected evidence");
    expect(source).toContain("uxStatusCommandAttributesFor");
    expect(source).not.toContain("const evidenceColumns");
  });

  test("marks S029 extraction review as a queue workbench with proof drawer handoff", () => {
    const source = readSource("components", "client-intake-screen.tsx");

    expect(source).toContain("function ExtractionReviewWorkbench");
    expect(source).toContain("<MasterDetailSurface");
    expect(source).toContain('actionPolicy="command_handoff"');
    expect(source).toContain('density="compact_operations"');
    expect(source).toContain('proofPlacement="proof_drawer"');
    expect(source).toContain("queueWorkbench");
    expect(source).toContain("data-ux-queue-selected");
    expect(source).toContain("s029-extraction-master-list");
    expect(source).toContain("s029-extraction-selected-detail");
    expect(source).toContain('data-ux-queue-proof-drawer="true"');
  });

  test("marks the wealth action board as the representative board-to-detail surface", () => {
    const source = readSource("components", "wealth-actions-screen.tsx");

    expect(source).toContain("<MasterDetailSurface");
    expect(source).toContain('family="board"');
    expect(source).toContain('filterState="disabled_static"');
    expect(source).toContain("detail={drawerOpen ? <ActionDrawer");
    expect(source).toContain('masterDetailMode={drawerOpen ? "drawer_detail" : "inline_detail_rail"}');
    expect(source).toContain("selectedObjectId={selectedAction.id}");
    expect(source).toContain("selectedObjectState={selectedAction.evidenceState}");
  });
});
