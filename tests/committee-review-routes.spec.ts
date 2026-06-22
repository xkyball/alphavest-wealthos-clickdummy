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
  test("queue renders as internal committee review surface without client release", async ({ page }) => {
    await page.goto("/committee/reviews");

    await expect(page.getByRole("heading", { name: "Committee Review Queue" }).first()).toBeVisible();
    await expect(page.getByText("Committee queue routes elevated reviews without becoming final decision room.")).toBeVisible();
    await expect(page.getByText("Committee queue cannot release to client or bypass compliance.")).toBeVisible();
    await expect(page.getByText("Committee approval is a separate internal gate before compliance can consider client release.")).toBeVisible();
    await expect(page.getByText("Must remain zero on this route.")).toBeVisible();
  });

  test("detail renders committee decision room without release bypass", async ({ page }) => {
    await page.goto("/committee/reviews/demo/decision-room");

    await expect(page.getByRole("heading", { name: "Committee Review Detail" }).first()).toBeVisible();
    await expect(page.locator('[data-testid="ux-phase6-decision-room"][data-ux-phase6-task="UX-DECISION-ROOM-004"]')).toBeVisible();
    await expect(page.getByText("Committee approval remains blocked until all votes are present, dissent is resolved and evidence is complete.")).toBeVisible();
    await expect(page.getByText("No release, export or advice effect can occur without gate preconditions and audit proof.")).toBeVisible();
  });
});
