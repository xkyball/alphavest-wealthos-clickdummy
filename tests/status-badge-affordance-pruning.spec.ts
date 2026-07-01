import { expect, type Page, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import { authenticatePageWithJwt } from "./helpers/auth-jwt";

async function authenticate(page: Page, request: Parameters<typeof authenticatePageWithJwt>[1]) {
  await authenticatePageWithJwt(page, request, { email: "ava.admin@alphavest.demo" });
}

test.describe("UXP2-004 status and badge affordance pruning", () => {
  test.beforeEach(async ({ page, request }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page, request);
  });

  test("renders shared badges as static indicators without focusable control affordances", async ({ page }) => {
    await page.goto("/service-blueprint");

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

    expect(source).toContain("ariaLabel={`Workflow status: ${visibleLabel}. ${sourceDescription}`}");
    expect(source).toContain('data-ux-affordance="static-workflow-badge"');
    expect(source).toContain('data-ux-interactive="false"');
    expect(source).not.toMatch(/onClick|type="button"|href=|tabIndex=\{?0/);
  });

  test("keeps protected route status chips informational", async ({ page }) => {
    await page.goto("/service-blueprint");

    const header = page.getByTestId("page-header");
    const accessStatus = header.locator('[aria-label^="Status: Read-only area"]');

    await expect(accessStatus).toBeVisible();
    await expect(accessStatus).toHaveAttribute("data-ux-affordance", "static-badge");
    await expect(accessStatus).toHaveAttribute("data-ux-interactive", "false");
    await expect(header.getByRole("button", { name: /Status: Read-only area/i })).toHaveCount(0);
    await expect(header.getByRole("link", { name: /Status: Read-only area/i })).toHaveCount(0);
  });
});
