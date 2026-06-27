import { readFile } from "node:fs/promises";

import { expect, test } from "@playwright/test";

test.describe("E09 capture release evidence policy", () => {
  test("codifies legacy evidence quarantine and hard release capture QA", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {
      scripts: Record<string, string>;
    };
    const spec = await readFile("docs/ux/ALPHAVEST_E09_CAPTURE_QA_SPEC.md", "utf8");
    const signoffSource = await readFile("scripts/ux-qa-signoff-report.ts", "utf8");

    expect(packageJson.scripts["visual:capture-qa:release"]).toContain("CAPTURE_QA_FAIL_ON_WARNINGS=1");
    expect(packageJson.scripts["visual:capture-qa:release"]).toContain("scripts/capture-qa-contract.ts");
    expect(spec).toContain("Legacy capture bundles are historical evidence only");
    expect(spec).toContain("must run with `CAPTURE_QA_FAIL_ON_WARNINGS=1`");
    expect(spec).toContain("Do not downgrade the gate by default");
    expect(signoffSource).toContain("Treat legacy capture bundles as historical evidence only");
  });
});
