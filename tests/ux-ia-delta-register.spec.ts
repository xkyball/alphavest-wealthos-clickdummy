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

test.describe("canonical UX and IA cleanup register", () => {
  test("retains the operative True-UX authority chain", () => {
    const manifest = readManifest();
    const summary = readWorkspace(canonicalSummaryPath);
    const retainedAuthority = manifest.entries.filter(
      (entry) =>
        entry.tracked &&
        entry.action === "keep" &&
        (entry.file === "AGENTS.md" ||
          entry.file === "README.md" ||
          entry.file.startsWith("ALPHAVEST_TRUE_UX_")),
    );

    expect(retainedAuthority.map((entry) => entry.file).sort()).toEqual([
      "AGENTS.md",
      trueUxPackPath,
      "ALPHAVEST_TRUE_UX_DECISION_GOVERNANCE_AND_ROUTE_EVOLUTION_POLICY.md",
      "ALPHAVEST_TRUE_UX_FLOW_REFACTORING_PLAN.md",
      "ALPHAVEST_TRUE_UX_FLOW_REFACTORING_STRATEGY_AND_CODEX_DERIVATION_PLAN.md",
      "ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md",
      "ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF_REPO_LOCAL_BUNDLE_MANIFEST.md",
      "ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF_REPO_LOCAL_REFERENCE_REWRITE_REPORT.md",
      "ALPHAVEST_TRUE_UX_ROUTE_EVOLUTION_POLICY_MATRIX.md",
      "README.md",
    ]);
    expect(summary).toContain("The repository keeps one operative product authority chain at the root");
  });

  test("classifies deleted historical registers as extracted into canonical current docs", () => {
    const manifest = readManifest();
    const extractedTrackedDocs = manifest.entries.filter(
      (entry) =>
        entry.tracked &&
        entry.action === "extract_then_delete" &&
        entry.replacement === canonicalSummaryPath,
    );

    expect(extractedTrackedDocs.length).toBe(manifest.summary.extract_then_delete);
    expect(manifest.byTop.reports.extract_then_delete).toBeGreaterThan(0);
    expect(manifest.byTop.artifacts.extract_then_delete).toBeGreaterThan(0);
  });

  test("keeps current source, scripts, and tests as the executable surface", () => {
    const manifest = readManifest();
    const summary = readWorkspace(canonicalSummaryPath);

    expect(manifest.byTop.app.keep).toBeGreaterThan(0);
    expect(manifest.byTop.components.keep).toBeGreaterThan(0);
    expect(manifest.byTop.lib.keep).toBeGreaterThan(0);
    expect(manifest.byTop.tests.keep).toBeGreaterThan(0);
    expect(manifest.byTop.scripts.keep).toBeGreaterThan(0);
    expect(summary).toContain("Active code and public test contracts must use product/domain names");
  });
});
