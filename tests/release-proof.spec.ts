import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

type CleanupAction = "delete" | "extract_then_delete" | "keep" | "rename";

type CleanupEntry = {
  action: CleanupAction;
  file: string;
  replacement: string | null;
  tracked: boolean;
};

type CleanupManifest = {
  byTop: Record<string, Partial<Record<CleanupAction, number>>>;
  entries: CleanupEntry[];
  summary: Record<CleanupAction, number>;
  targetBranchOverride: string;
};

const repoRoot = process.cwd();
const canonicalSummaryPath = "docs/00-current/ALPHAVEST_REPOSITORY_CANONICAL_CLEANUP_SUMMARY.md";
const cleanupManifestPath = "docs/00-current/ALPHAVEST_REPOSITORY_CLEANUP_MANIFEST.json";
const trueUxPackPath = ["ALPHAVEST_TRUE_UX", "CODEX", "TASK", "PACK.md"].join("_");

function readWorkspace(relativePath: string) {
  return readFileSync(join(repoRoot, relativePath), "utf8");
}

function readManifest(): CleanupManifest {
  return JSON.parse(readWorkspace(cleanupManifestPath)) as CleanupManifest;
}

function entryFor(manifest: CleanupManifest, file: string) {
  return manifest.entries.find((entry) => entry.file === file);
}

test.describe("canonical release proof cleanup", () => {
  test("keeps the True-UX authority chain retained as current product authority", () => {
    const manifest = readManifest();
    const summary = readWorkspace(canonicalSummaryPath);
    const authorityFiles = [
      "AGENTS.md",
      "README.md",
      "ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md",
      trueUxPackPath,
      "ALPHAVEST_TRUE_UX_FLOW_REFACTORING_PLAN.md",
      "ALPHAVEST_TRUE_UX_ROUTE_EVOLUTION_POLICY_MATRIX.md",
      "ALPHAVEST_TRUE_UX_DECISION_GOVERNANCE_AND_ROUTE_EVOLUTION_POLICY.md",
      "ALPHAVEST_TRUE_UX_FLOW_REFACTORING_STRATEGY_AND_CODEX_DERIVATION_PLAN.md",
    ];

    expect(manifest.targetBranchOverride).toBe("work");
    for (const authorityFile of authorityFiles) {
      expect(entryFor(manifest, authorityFile), authorityFile).toMatchObject({
        action: "keep",
        tracked: true,
      });
      expect(summary).toContain(authorityFile);
    }
  });

  test("replaces historical proof reports with the canonical cleanup summary", () => {
    const manifest = readManifest();
    const summary = readWorkspace(canonicalSummaryPath);
    const rootHistoricalReports = manifest.entries.filter(
      (entry) =>
        entry.tracked &&
        entry.action === "extract_then_delete" &&
        !entry.file.includes("/") &&
        entry.replacement === canonicalSummaryPath,
    );

    expect(manifest.summary.extract_then_delete).toBeGreaterThan(0);
    expect(rootHistoricalReports.length).toBeGreaterThan(20);
    expect(summary).toContain("All older");
    expect(summary).toContain("historical implementation scaffolding");
  });

  test("keeps active script and test cleanup expressed through domain filenames", () => {
    const manifest = readManifest();
    const scriptRenames = manifest.entries.filter(
      (entry) => entry.tracked && entry.action === "rename" && entry.file.startsWith("scripts/"),
    );
    const testRenames = manifest.entries.filter(
      (entry) => entry.tracked && entry.action === "rename" && entry.file.startsWith("tests/"),
    );

    expect(scriptRenames).toHaveLength(manifest.byTop.scripts.rename ?? 0);
    expect(testRenames).toHaveLength(manifest.byTop.tests.rename ?? 0);
    expect(scriptRenames.length).toBeGreaterThan(0);
    expect(testRenames.length).toBeGreaterThan(0);
  });
});
