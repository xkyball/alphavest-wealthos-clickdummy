import { expect, type APIRequestContext, type Page, test } from "@playwright/test";

import { authJwtCookieName } from "../lib/auth/auth-jwt";

async function authenticate(page: Page, request: APIRequestContext) {
  const email = "cfo.bennett@example.demo";
  const startResponse = await request.post("/api/auth/provider-login", {
    data: { email, providerId: "db-user-jwt" },
  });
  const startBody = await startResponse.json();

  expect(startResponse.ok(), JSON.stringify(startBody)).toBe(true);

  const mfaResponse = await request.post("/api/auth/mfa/verify", {
    data: { code: "123456", email, providerId: "db-user-jwt" },
  });
  const mfaBody = await mfaResponse.json();

  expect(mfaResponse.ok(), JSON.stringify(mfaBody)).toBe(true);
  expect(mfaBody.jwt).toBeTruthy();

  await page.context().addCookies([
    {
      domain: "127.0.0.1",
      httpOnly: true,
      name: authJwtCookieName,
      path: "/",
      sameSite: "Lax",
      value: mfaBody.jwt as string,
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
  test.beforeEach(async ({ page, request }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await authenticate(page, request);
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

    await expect(page.getByRole("heading", { name: "State and Badge Reference" })).toBeVisible();
    await expect(page.getByText("This area is read-only. No product controls are available.").first()).toBeVisible();
    await expect(page.locator('[data-ux-primary-cta="true"][data-ux-interactive="true"]')).toHaveCount(0);
  });
});
