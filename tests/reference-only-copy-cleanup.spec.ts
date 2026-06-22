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

test.describe("UXP1-007 reference-only route cleanup", () => {
  test.beforeEach(async ({ page }) => {
    await authenticate(page);
  });

  test("service blueprint is marked read-only and exposes no product controls", async ({ page }) => {
    await page.goto("/service-blueprint");

    await expect(page.getByRole("heading", { name: "Reference Workspace" })).toBeVisible();
    await expect(page.getByText("Read-only internal reference. No product workflow, mutation, release, export, advice or client-visible change is available.").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Reference only" })).toBeDisabled();
    await expect(page.getByText(/Stage focus|Default blueprint|Plan, sequence and control scope|Product action locked|Related Workspaces/i)).toHaveCount(0);
  });

  test("roadmap stays an internal scope reference without workflow overclaim", async ({ page }) => {
    await page.goto("/roadmap");

    await expect(page.getByRole("heading", { name: "Reference Workspace" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reference only" })).toBeDisabled();
    await expect(page.getByText("No product controls are available for reference-only routes.")).toBeVisible();
    await expect(page.getByText(/Plan, sequence and control scope|Blocked roadmap items cannot become client-visible|Product action locked|Related Workspaces/i)).toHaveCount(0);
  });

  test("state catalogue examples remain non-mutating reference content", async ({ page }) => {
    await page.goto("/states");

    await expect(page.getByRole("heading", { name: "Reference Workspace" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reference only" })).toBeDisabled();
    await expect(page.getByText("No product action, release, export, mutation or client visibility is available from this route.")).toBeVisible();
    await expect(page.getByText(/Default controls are ready for interaction|role cannot continue|Product action locked|Related Workspaces/i)).toHaveCount(0);
  });
});
