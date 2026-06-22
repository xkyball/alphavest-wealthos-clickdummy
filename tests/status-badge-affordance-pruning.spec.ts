import { expect, type Page, test } from "@playwright/test";
import { readFileSync } from "node:fs";

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

test.describe("UXP2-004 status and badge affordance pruning", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page);
  });

  test("renders shared badges as static indicators without focusable control affordances", async ({ page }) => {
    await page.goto("/actions");

    const badges = page.locator('[data-ux-affordance="static-badge"]');

    await expect(badges.first()).toBeVisible();
    await expect(badges.first()).toHaveAttribute("data-ux-interactive", "false");
    await expect(page.locator('[data-ux-affordance="static-badge"][tabindex]')).toHaveCount(0);
    await expect(page.locator('[data-ux-affordance="static-badge"][role="button"]')).toHaveCount(0);
    await expect(page.locator('a [data-ux-affordance="static-badge"]')).toHaveCount(0);
    await expect(page.locator('button [data-ux-affordance="static-badge"]')).toHaveCount(0);
  });

  test("keeps workflow badge implementation static by contract", () => {
    const source = readFileSync("components/ui/workflow-badge.tsx", "utf8");

    expect(source).toContain('ariaLabel={`Workflow status: ${visibleLabel}`}');
    expect(source).toContain('data-ux-affordance="static-workflow-badge"');
    expect(source).toContain('data-ux-interactive="false"');
    expect(source).not.toMatch(/onClick|type="button"|href=|tabIndex=\{?0/);
  });

  test("keeps route status chips informational on protected route context cards", async ({ page }) => {
    await page.goto("/service-blueprint");

    const card = page.getByTestId("route-reference-context-card");
    const accessStatus = card.locator('[aria-label="Status: Active"]');

    await expect(accessStatus).toBeVisible();
    await expect(accessStatus).toHaveAttribute("data-ux-affordance", "static-badge");
    await expect(accessStatus).toHaveAttribute("data-ux-interactive", "false");
    await expect(card.getByRole("button", { name: /Status: Active/i })).toHaveCount(0);
    await expect(card.getByRole("link", { name: /Status: Active/i })).toHaveCount(0);
  });
});
