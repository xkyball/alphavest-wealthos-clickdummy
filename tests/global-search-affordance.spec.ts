import { expect, type Page, test } from "@playwright/test";

import { localAuthSessionCookieName } from "../lib/auth/local-auth-session";

async function authenticate(page: Page) {
  await page.context().addCookies([
    {
      domain: "127.0.0.1",
      httpOnly: true,
      name: localAuthSessionCookieName,
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

  test("keeps global search DB-backed on MVP routes", async ({ page }) => {
    await page.goto("/client/home");

    const search = page.getByRole("combobox", { name: "Global search" }).first();
    await expect(search).toBeEnabled();

    await search.fill("Bennett");
    await expect(page.getByText(/Searching demo DB rows|Bennett Family Office|No matching rows found/).first()).toBeVisible();
  });

  test("disables global search on registered-only reference routes", async ({ page }) => {
    await page.goto("/states");

    const search = page.getByRole("combobox", { name: "Global search" }).first();
    await expect(search).toBeDisabled();
    await expect(page.getByText("Search is disabled for this registered page.").first()).toBeVisible();
    await expect(page.getByText(/Searching demo DB rows|No matching rows found/)).toHaveCount(0);
  });
});
