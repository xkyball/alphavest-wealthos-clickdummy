import { readFile } from "node:fs/promises";

import { expect, test } from "@playwright/test";

test.describe("E09 operational screenshot audit release policy", () => {
  test("retires legacy capture QA and hardwires operational screenshot audit", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {
      scripts: Record<string, string>;
    };
    const spec = await readFile("docs/ux/ALPHAVEST_OPERATIONAL_UI_NON_NEGOTIABLE.md", "utf8");
    const signoffSource = await readFile("scripts/ux-qa-signoff-report.ts", "utf8");

    expect(packageJson.scripts["visual:audit-operational"]).toBe("playwright test tests/operational-visual-audit.spec.ts --workers=1");
    expect(packageJson.scripts["release:contract-check"]).toContain("pnpm visual:audit-operational");
    expect(packageJson.scripts["visual:capture-qa"]).toBeUndefined();
    expect(packageJson.scripts["visual:capture-qa:release"]).toBeUndefined();
    expect(packageJson.scripts["visual:strict"]).toBeUndefined();
    expect(spec).toContain("Every screenshot used as UI proof must be paired with this visual audit.");
    expect(spec).toContain("screenshot is not proof");
    expect(signoffSource).toContain("Run `pnpm visual:audit-operational`");
    expect(signoffSource).toContain("scripts/capture-qa-contract.ts");
    expect(signoffSource).toContain("scripts/strict-visual-capture.ts");
  });
});
