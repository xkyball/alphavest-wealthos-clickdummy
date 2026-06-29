import { expect, type Page, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";

async function authenticate(page: Page) {
  await page.context().addCookies([
    {
      domain: "127.0.0.1",
      httpOnly: true,
      name: demoAuthSessionCookieName,
      path: "/",
      sameSite: "Lax",
      value: "av-session-playwright-authenticated",
    },
  ]);
}

test.describe("UXP1-004 demo session copy compression", () => {
  test("demo session panel keeps operational labels without scenario proof copy", async () => {
    const source = await readFile("components/demo-session-panel.tsx", "utf8");

    expect(source).toContain("Session context");
    expect(source).toContain("Active context");
    expect(source).toContain("Access state");
    expect(source).toContain("Audit state");
    expect(source).toContain("Evidence state");
    expect(source).not.toMatch(/Scenario context|Controlled scenario|Permission mode|Audit draft|Evidence draft/);
  });

  test("client topbar hides tenant and role switchers after login", async ({ page }) => {
    await authenticate(page);
    await page.goto("/client/home");

    const topbar = page.getByRole("banner");
    await expect(topbar.getByLabel("Tenant context")).toHaveCount(0);
    await expect(topbar.getByLabel("Role context")).toHaveCount(0);
    await expect(topbar.getByText("Tenant context", { exact: true })).toHaveCount(0);
    await expect(topbar.getByText("Role context", { exact: true })).toHaveCount(0);
    await expect(topbar.getByText(/Controlled scenario context|production auth|Scenario role/i)).toHaveCount(0);
  });
});
