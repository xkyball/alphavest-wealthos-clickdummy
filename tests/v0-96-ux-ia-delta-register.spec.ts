import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test, expect } from "@playwright/test";

const repoRoot = process.cwd();
const registerPath = join(repoRoot, "V0_96_UX_IA_DELTA_REGISTER.md");

function readRegister() {
  return readFileSync(registerPath, "utf8");
}

test.describe("V0.96 WP-00 UX/IA delta register", () => {
  test("preserves True-UX authority and the observed V0.96 work package range", () => {
    const register = readRegister();

    expect(register).toContain("ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md");
    expect(register).toContain("WP-00");
    expect(register).toContain("WP-16");
    expect(register).toContain("does not contain `WP-146`");
    expect(register).toContain("V0.96 is used as a companion work package description only");
  });

  test("records the moving baseline and current route inventory", () => {
    const register = readRegister();

    expect(register).toContain("`full-workflow`");
    expect(register).toContain("`159bebd docs(pilot): add V1 buyer proof package`");
    expect(register).toContain("Registered screen routes | 71");
    expect(register).toContain("Implementation-shell accessible routes | 56");
    expect(register).toContain("MVP routes | 31");
    expect(register).toContain("MVP support routes | 25");
    expect(register).toContain("P1/deferred routes | 5");
    expect(register).toContain("Reference-only routes | 3");
    expect(register).toContain("Hold-pending-decision routes | 7");
  });

  test("classifies every V0.96 work package before implementation continues", () => {
    const register = readRegister();

    for (let index = 0; index <= 16; index += 1) {
      expect(register).toContain(`| WP-${String(index).padStart(2, "0")} |`);
    }

    expect(register).toContain("| WP-16 | Release Evidence / Handoff Update | `ACCEPTED_WITH_RELEASE_PROOF_AND_EXPLICIT_NON_GA_BOUNDARIES` |");
    expect(register).toContain("## WP-16 Release Evidence Handoff Reality Classification");
    expect(register).toContain("Proceed only with a user-authorized successor phase");
  });
});
