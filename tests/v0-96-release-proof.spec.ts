import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test, expect } from "@playwright/test";

const repoRoot = process.cwd();
const releaseProofPath = join(
  repoRoot,
  "ALPHAVEST_V0_96_CORE_JOURNEY_UX_IA_REFACTOR_RELEASE_PROOF.md",
);
const reportPath = join(repoRoot, "V0_96_WP16_RELEASE_EVIDENCE_HANDOFF_UPDATE_REPORT.md");
const registerPath = join(repoRoot, "V0_96_UX_IA_DELTA_REGISTER.md");

function read(path: string) {
  return readFileSync(path, "utf8");
}

test.describe("V0.96 WP-16 release evidence handoff", () => {
  test("keeps the release proof scoped to evidence closure and non-GA boundaries", () => {
    const proof = read(releaseProofPath);

    expect(proof).toContain("WP-16 - Release Evidence / Handoff Update");
    expect(proof).toContain("ACCEPTED_WITH_RELEASE_PROOF_AND_EXPLICIT_NON_GA_BOUNDARIES");
    expect(proof).toContain("NOT_GA_PRODUCTION_READY");
    expect(proof).toContain("NOT_PRODUCTION_AUTH");
    expect(proof).toContain("NOT_BINARY_EXPORT_DELIVERY");
    expect(proof).toContain("No generated screen/image/state-screen assets");
    expect(proof).toContain("No P1/HOLD/reference route promotion");
  });

  test("indexes every V0.96 work package in the release proof", () => {
    const proof = read(releaseProofPath);

    for (let index = 0; index <= 16; index += 1) {
      expect(proof).toContain(`| WP-${String(index).padStart(2, "0")} |`);
    }

    expect(proof).toContain("advisor-owned reject/request-change remains not fully accepted");
    expect(proof).toContain("27 covered P0/True-UX acceptance gates");
  });

  test("updates the report and delta register away from missing WP-16 status", () => {
    const report = read(reportPath);
    const register = read(registerPath);

    expect(report).toContain("ACCEPTED_WITH_RELEASE_PROOF_AND_EXPLICIT_NON_GA_BOUNDARIES");
    expect(register).toContain("## WP-16 Release Evidence Handoff Reality Classification");
    expect(register).toContain("| WP-16 | Release Evidence / Handoff Update | `ACCEPTED_WITH_RELEASE_PROOF_AND_EXPLICIT_NON_GA_BOUNDARIES` |");
    expect(register).not.toContain("| WP-16 | Release Evidence / Handoff Update | `MISSING` |");
  });
});
