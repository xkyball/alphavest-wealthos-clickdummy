import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import {
  wp15CoverageMatrix,
  wp15CoverageSummary,
  wp15ExpectedBlockedOutOfScope,
  wp15RequiredGateIds,
  wp15UnresolvedReleaseBlockers,
  wp15ValidationCommandSet,
} from "../lib/v0-96-p0-true-ux-acceptance";

function fileExists(relativePath: string) {
  return existsSync(path.join(process.cwd(), relativePath));
}

function workspaceText(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test.describe("V0.96 WP-15 P0 + True-UX acceptance suite", () => {
  test("classifies every mandatory WP15 gate without missing or conflicting release blockers", () => {
    expect(wp15CoverageMatrix.map((entry) => entry.gateId)).toEqual([...wp15RequiredGateIds]);
    expect(wp15CoverageMatrix).toHaveLength(27);
    expect(wp15CoverageSummary()).toEqual({
      BLOCKED: 0,
      CONFLICTING: 0,
      COVERED: 27,
      MISSING: 0,
      PARTIAL: 0,
    });
    expect(wp15UnresolvedReleaseBlockers()).toEqual([]);

    for (const entry of wp15CoverageMatrix) {
      expect(entry.evidence, entry.gateId).toBeTruthy();
      expect(entry.nonClaim, entry.gateId).toBeTruthy();
      expect(entry.ownerWp, entry.gateId).toContain("WP");
      expect(entry.proofFiles.length, entry.gateId).toBeGreaterThan(0);
    }
  });

  test("points every WP15 proof entry at an existing test or evidence artifact", () => {
    for (const entry of wp15CoverageMatrix) {
      for (const proofFile of entry.proofFiles) {
        expect(fileExists(proofFile), `${entry.gateId} proof file ${proofFile}`).toBe(true);
      }
    }
  });

  test("keeps route-scope blockers explicit instead of silently elevating P1 or HOLD routes", () => {
    expect(wp15ExpectedBlockedOutOfScope.map((entry) => entry.gateId)).toEqual([
      "WP15-B01-EXTERNAL-ADVISOR-GUEST-FULL-WORKFLOW",
      "WP15-B02-KYC-IPS-COMMITTEE-HELD-ROUTES",
    ]);

    const p0Acceptance = workspaceText("tests/p0-acceptance.spec.ts");
    const navigationShell = workspaceText("tests/navigation-shell.spec.ts");

    expect(p0Acceptance).toContain("P1_AFTER_MVP");
    expect(p0Acceptance).toContain("HOLD_PENDING_DECISION");
    expect(navigationShell).toContain("reference-only routes do not appear in implementation navigation");
    expect(navigationShell).toContain("productiveNavigationPageIds");
  });

  test("requires the deterministic command set that feeds the WP16 evidence handoff", () => {
    expect(wp15ValidationCommandSet).toContain("pnpm typecheck");
    expect(wp15ValidationCommandSet).toContain("pnpm db:validate");
    expect(wp15ValidationCommandSet).toContain("git diff --check");
    expect(wp15ValidationCommandSet.join(" ")).toContain("tests/p0-acceptance.spec.ts");
    expect(wp15ValidationCommandSet.join(" ")).toContain("tests/true-ux-p0-safety.spec.ts");
    expect(wp15ValidationCommandSet.join(" ")).toContain("tests/navigation-shell.spec.ts");
    expect(wp15ValidationCommandSet.join(" ")).toContain("tests/governance-non-bypass.spec.ts");
    expect(wp15ValidationCommandSet.join(" ")).toContain("tests/export-safety.spec.ts");
    expect(wp15ValidationCommandSet.join(" ")).toContain("tests/audit-fail-closed.spec.ts");
  });

  test("registers a package script for the WP15 acceptance aggregation slice", () => {
    const packageJson = JSON.parse(workspaceText("package.json")) as { scripts: Record<string, string> };

    expect(packageJson.scripts["test:v0-96-p0-true-ux"]).toBe(
      "playwright test tests/v0-96-p0-true-ux-acceptance.spec.ts tests/p0-acceptance.spec.ts tests/true-ux-p0-safety.spec.ts --workers=1",
    );
  });
});
