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

  test("keeps global search DB-backed on MVP routes", async ({ page }) => {
    await page.goto("/client/home");

    const search = page.getByRole("combobox", { name: "Global search" }).first();
    await expect(search).toBeEnabled();

    await search.fill("Bennett");
    await expect(page.getByText(/Searching product records|Bennett Family Office|No matching rows found/).first()).toBeVisible();
    await expect(page.getByText(/ANALYST_REVIEW_PENDING|NEEDS_CLARIFICATION|AI_EXTRACTED|LINKED_TO_EVIDENCE|family_cfo/)).toHaveCount(0);
  });

  test("disables global search on registered-only reference routes", async ({ page }) => {
    await page.goto("/states");

    const search = page.getByRole("combobox", { name: "Global search" }).first();
    await expect(search).toBeDisabled();
    await expect(page.getByText("Search is disabled for this registered page.").first()).toBeVisible();
    await expect(page.getByText(/Searching product records|No matching rows found/)).toHaveCount(0);
  });
});
