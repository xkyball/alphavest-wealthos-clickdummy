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

test.describe("Stage E committee review routes", () => {
  test("queue renders as internal committee review surface without client release", async ({ page }) => {
    await page.goto("/committee/reviews");

    await expect(page.getByRole("heading", { name: "Committee Review Queue" }).first()).toBeVisible();
    await expect(page.getByTestId("ux-stage5-detail-split")).toHaveCount(0);
  });

  test("detail renders committee decision room without release bypass", async ({ page }) => {
    await page.goto("/committee/reviews/rebalance-review/decision-room");

    await expect(page.getByRole("heading", { name: "Committee Review Detail" }).first()).toBeVisible();
    await expect(page.getByTestId("ux-stage6-decision-room")).toHaveCount(0);
    await expect(page.getByText("Dissent")).toBeVisible();
  });
});
