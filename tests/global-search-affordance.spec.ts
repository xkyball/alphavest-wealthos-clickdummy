import { expect, type Page, test } from "@playwright/test";

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

test.describe("UXP2-001 global search affordance", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await authenticate(page);
  });

  test("keeps global search only as scoped DB-backed lifecycle on MVP routes", async ({ page }) => {
    await page.goto("/client/home");

    const search = page.getByRole("combobox", { name: "Tenant-scoped global search" }).first();
    await expect(search).toBeEnabled();

    await search.fill("Bennett");
    await expect(page.getByText(/Searching scoped DB rows|Bennett Family Office|No tenant-scoped rows found/).first()).toBeVisible();
  });

  test("disables global search on registered-only reference routes", async ({ page }) => {
    await page.goto("/states");

    const search = page.getByRole("combobox", { name: "Tenant-scoped global search" }).first();
    await expect(search).toBeDisabled();
    await expect(page.getByText("Search is disabled on registered-only routes.").first()).toBeVisible();
    await expect(page.getByText(/Searching scoped DB rows|No tenant-scoped rows found/)).toHaveCount(0);
  });
});
