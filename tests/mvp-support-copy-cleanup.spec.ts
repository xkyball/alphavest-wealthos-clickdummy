import { expect, type Page, test } from "@playwright/test";

import { authenticatePageWithJwt } from "./helpers/auth-jwt";

async function authenticate(page: Page, request: Parameters<typeof authenticatePageWithJwt>[1]) {
  await authenticatePageWithJwt(page, request, { email: "ava.admin@alphavest.demo" });
}

test.describe("UXP1-006 MVP_SUPPORT copy cleanup", () => {
  test("access screens use operational copy without demo provider explanation", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByText("Access check", { exact: true })).toBeVisible();
    await expect(page.getByText("Access pending")).toBeVisible();
    await expect(page.getByText(/Local provider|DB-backed dummy|Demo access|demo audit preview/i)).toHaveCount(0);
  });

  test("admin setup and action support screens keep concise context copy", async ({ page, request }) => {
    await authenticate(page, request);

    await page.goto("/admin/platform");
    await expect(page.getByText("Change control")).toBeVisible();
    await expect(page.getByText("Permission boundary")).toBeVisible();
    await expect(page.getByText(/Proof and Handoff Closure|P10-P14 proof|implementation evidence|demo tenants/i)).toHaveCount(0);

    await page.goto("/actions");
    await expect(page.locator("aside").getByText("Tenant context", { exact: true })).toBeVisible();
    await expect(page.getByText(/Demo tenant context|readiness proof/i)).toHaveCount(0);
  });
});
