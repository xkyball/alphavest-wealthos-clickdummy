import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import {
  workflow15CoverageMatrix,
  workflow15CoverageSummary,
  workflow15ExpectedBlockedOutOfScope,
  workflow15RequiredGateIds,
  workflow15UnresolvedReleaseBlockers,
  workflow15ValidationCommandSet,
} from "../lib/p0-true-ux-acceptance";

type CleanupEntry = {
  action: "delete" | "extract_then_delete" | "keep" | "rename";
  file: string;
  replacement: string | null;
};

type CleanupManifest = {
  entries: CleanupEntry[];
};

const canonicalSummaryPath = "docs/00-current/ALPHAVEST_REPOSITORY_CANONICAL_CLEANUP_SUMMARY.md";
const cleanupManifestPath = "docs/00-current/ALPHAVEST_REPOSITORY_CLEANUP_MANIFEST.json";

function fileExists(relativePath: string) {
  return existsSync(path.join(process.cwd(), relativePath));
}

function workspaceText(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

function readManifest(): CleanupManifest {
  return JSON.parse(workspaceText(cleanupManifestPath)) as CleanupManifest;
}

function hasCurrentDomainProof(entryGateId: string) {
  if (entryGateId === "WORKFLOW15-G19-DENSITY-CONTRACT") {
    return fileExists("lib/ux-density.ts");
  }

  return false;
}

test.describe("P0 and True-UX acceptance suite", () => {
  test("classifies every mandatory WORKFLOW15 gate without missing or conflicting release blockers", () => {
    expect(workflow15CoverageMatrix.map((entry) => entry.gateId)).toEqual([...workflow15RequiredGateIds]);
    expect(workflow15CoverageMatrix).toHaveLength(27);
    expect(workflow15CoverageSummary()).toEqual({
      BLOCKED: 0,
      CONFLICTING: 0,
      COVERED: 27,
      MISSING: 0,
      PARTIAL: 0,
    });
    expect(workflow15UnresolvedReleaseBlockers()).toEqual([]);

    for (const entry of workflow15CoverageMatrix) {
      expect(entry.evidence, entry.gateId).toBeTruthy();
      expect(entry.nonClaim, entry.gateId).toBeTruthy();
      expect(entry.ownerWp, entry.gateId).toMatch(/^WORKFLOW/);
      expect(entry.proofFiles.length, entry.gateId).toBeGreaterThan(0);
    }
  });

  test("points WORKFLOW15 proof entries at live tests or canonical cleanup truth", () => {
    const manifest = readManifest();
    const summary = workspaceText(canonicalSummaryPath);

    for (const entry of workflow15CoverageMatrix) {
      let liveProofCount = 0;
      let retiredProofCount = 0;

      for (const proofFile of entry.proofFiles) {
        if (fileExists(proofFile)) {
          liveProofCount += 1;
          continue;
        }

        const cleanupEntry = manifest.entries.find((candidate) => candidate.file === proofFile);
        if (cleanupEntry) {
          expect(cleanupEntry, `${entry.gateId} retired proof ${proofFile}`).toMatchObject({
            action: "extract_then_delete",
            replacement: canonicalSummaryPath,
          });
          retiredProofCount += 1;
        }
      }

      expect(
        liveProofCount + retiredProofCount + (hasCurrentDomainProof(entry.gateId) ? 1 : 0),
        `${entry.gateId} current or canonicalized proof count`,
      ).toBeGreaterThan(0);
    }

    expect(summary).toContain("Generated screenshots, capture folders, previous report bundles");
  });

  test("keeps route-scope blockers explicit instead of silently elevating P1 or HOLD routes", () => {
    expect(workflow15ExpectedBlockedOutOfScope.map((entry) => entry.gateId)).toEqual([
      "WORKFLOW15-B01-EXTERNAL-ADVISOR-GUEST-FULL-WORKFLOW",
      "WORKFLOW15-B02-KYC-IPS-COMMITTEE-HELD-ROUTES",
    ]);

    const p0Acceptance = workspaceText("tests/p0-acceptance.spec.ts");
    const navigationShell = workspaceText("tests/navigation-shell.spec.ts");

    expect(p0Acceptance).toContain("P1_AFTER_MVP");
    expect(p0Acceptance).toContain("HOLD_PENDING_DECISION");
    expect(navigationShell).toContain("reference-only routes do not appear in implementation navigation");
    expect(navigationShell).toContain("productiveNavigationPageIds");
  });

  test("requires the deterministic command set that feeds the WORKFLOW16 evidence handoff", () => {
    expect(workflow15ValidationCommandSet).toContain("pnpm typecheck");
    expect(workflow15ValidationCommandSet).toContain("pnpm db:validate");
    expect(workflow15ValidationCommandSet).toContain("git diff --check");
    expect(workflow15ValidationCommandSet.join(" ")).toContain("tests/p0-acceptance.spec.ts");
    expect(workflow15ValidationCommandSet.join(" ")).toContain("tests/true-ux-p0-safety.spec.ts");
    expect(workflow15ValidationCommandSet.join(" ")).toContain("tests/navigation-shell.spec.ts");
    expect(workflow15ValidationCommandSet.join(" ")).toContain("tests/governance-non-bypass.spec.ts");
    expect(workflow15ValidationCommandSet.join(" ")).toContain("tests/export-safety.spec.ts");
    expect(workflow15ValidationCommandSet.join(" ")).toContain("tests/audit-fail-closed.spec.ts");
  });

  test("registers a package script for the WORKFLOW15 acceptance aggregation slice", () => {
    const packageJson = JSON.parse(workspaceText("package.json")) as { scripts: Record<string, string> };

    expect(packageJson.scripts["test:p0-true-ux"]).toBe(
      "playwright test tests/p0-true-ux-acceptance.spec.ts tests/p0-acceptance.spec.ts tests/true-ux-p0-safety.spec.ts --workers=1",
    );
  });
});
