import { expect, type Page, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";

async function authenticate(page: Page) {
  await page.context().addCookies([
    {
      httpOnly: true,
      domain: "127.0.0.1",
      name: demoAuthSessionCookieName,
      path: "/",
      sameSite: "Lax",
      value: "av-session-playwright-authenticated",
    },
  ]);
}

test.beforeEach(async ({ page }) => {
  await authenticate(page);
});

test.describe("Phase E committee review routes", () => {
  test("queue renders through the SCF held-route guard", async ({ page }) => {
    await page.goto("/committee/reviews");

    await expect(page.getByRole("heading", { name: "Committee Review Queue" }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Held Workspace" })).toBeVisible();
    await expect(page.getByText("held until a later explicit scope").first()).toBeVisible();
    await expect(page.getByText("Advisor approval alone never unlocks client visibility.")).toBeVisible();
  });

  test("detail renders through the SCF held-route guard", async ({ page }) => {
    await page.goto("/committee/reviews/demo");

    await expect(page.getByRole("heading", { name: "Committee Review Detail" }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Held Workspace" })).toBeVisible();
    await expect(page.getByText("held until a later explicit scope").first()).toBeVisible();
    await expect(page.getByText("Advisor approval alone never unlocks client visibility.")).toBeVisible();
  });
});
