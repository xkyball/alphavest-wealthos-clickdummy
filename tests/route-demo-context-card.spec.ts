import { expect, type Page, test } from "@playwright/test";
import { readFileSync } from "node:fs";

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

test.describe("UXP1-003 route context containment", () => {
  test("protected route skeleton uses product guard copy without route or scenario explanation", async ({ page }) => {
    await authenticate(page);
    await page.goto("/service-blueprint");

    const emptyState = page.getByTestId("registered-route-empty-state");
    await expect(emptyState).toBeVisible();
    await expect(emptyState.getByRole("heading", { name: "Read only" })).toBeVisible();
    await expect(emptyState).toContainText("This area is read-only. No product controls are available.");
    await expect(page.getByTestId("page-header").locator('[data-ux-affordance="static-status-chip"]', { hasText: "Read-only area" })).toBeVisible();

    await expect(page.locator("body")).not.toContainText(/Route Context|registered route|Scenario Context|controlled scenario inputs|Permission mode|Scenario active/i);
  });

  test("fallback access card source uses product access copy", () => {
    const source = readFileSync("components/route-actor-context-card.tsx", "utf8");

    expect(source).toContain("<CardTitle>Current access</CardTitle>");
    expect(source).toContain("Tenant, actor and workspace role for this area.");
    expect(source).toContain("Workspace role");
    expect(source).not.toMatch(/Route Context|registered route|Scenario Context|controlled scenario inputs|Permission mode|Scenario active/);
  });
});
