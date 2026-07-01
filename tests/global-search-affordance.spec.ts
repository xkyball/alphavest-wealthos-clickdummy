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

async function fillHydratedSearch(page: Page, value: string) {
  const search = page.getByRole("combobox", { name: "Global search" }).first();

  await expect(search).toBeEnabled();
  await expect
    .poll(async () => {
      await search.fill("");
      await search.fill(value);
      await page.waitForTimeout(200);
      return page.getByRole("listbox", { name: "Global search results" }).count();
    })
    .toBe(1);
  await expect(search).toHaveValue(value);

  return search;
}

test.describe("UXP2-001 global search affordance", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await authenticate(page);
  });

  test("keeps global search DB-backed on MVP routes", async ({ page }) => {
    await page.goto("/client/home");

    const search = await fillHydratedSearch(page, "Bennett");
    await expect.poll(async () => (await search.boundingBox())?.width ?? 0).toBeGreaterThan(400);

    await expect(page.getByRole("listbox", { name: "Global search results" })).toBeVisible();
    await expect(page.getByText(/Searching tenant records|workspace matches|No matching rows found/).first()).toBeVisible();
    await expect(page.getByRole("listbox", { name: "Global search results" })).toContainText(/Open work queue|Review blocker|Open /);
  });

  test("keeps global search available on registered-only reference routes without exposing protected page actions", async ({ page }) => {
    await page.goto("/states");

    await fillHydratedSearch(page, "Bennett");
    await expect(page.getByRole("listbox", { name: "Global search results" })).toBeVisible();
    await expect(page.getByText(/Searching tenant records|workspace matches|No matching rows found/).first()).toBeVisible();

    const headerStatus = page
      .locator('[data-ux-primary-cta="true"][data-ux-interactive="false"]')
      .filter({ hasText: "Reference only" });

    await expect(headerStatus).toBeVisible();
  });
});
