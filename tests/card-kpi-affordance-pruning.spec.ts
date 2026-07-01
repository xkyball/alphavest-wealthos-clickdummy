import { expect, type Page, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import { authenticatePageWithJwt } from "./helpers/auth-jwt";

async function authenticate(page: Page, request: Parameters<typeof authenticatePageWithJwt>[1]) {
  await authenticatePageWithJwt(page, request, { email: "ava.admin@alphavest.demo" });
}

test.describe("UXP2-005 card and KPI affordance pruning", () => {
  test.beforeEach(async ({ page, request }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page, request);
  });

  test("keeps dashboard cards static and non-focusable on action surfaces", async ({ page }) => {
    await page.goto("/actions");

    const cards = page.locator('[data-ux-affordance="static-card"]');

    await expect(cards.first()).toBeVisible();
    await expect(cards.first()).toHaveAttribute("data-ux-interactive", "false");
    await expect(page.locator('[data-ux-affordance="static-card"][tabindex]')).toHaveCount(0);
    await expect(page.locator('[data-ux-affordance="static-card"][role="button"]')).toHaveCount(0);
    await expect(page.locator('a [data-ux-affordance="static-card"]')).toHaveCount(0);
    await expect(page.locator('button [data-ux-affordance="static-card"]')).toHaveCount(0);
  });

  test("keeps tenant KPI cards informational while explicit buttons remain separate", async ({ page }) => {
    await page.goto("/tenants/morgan/users");

    const metricCards = page.locator('[data-ux-affordance="static-metric-card"]');

    await expect(metricCards.first()).toBeVisible();
    await expect(metricCards.first()).toHaveAttribute("data-ux-interactive", "false");
    await expect(metricCards.filter({ hasText: "Total users" })).toBeVisible();
    await expect(page.locator('[data-ux-affordance="static-metric-card"][tabindex]')).toHaveCount(0);
    await expect(page.locator('[data-ux-affordance="static-metric-card"][role="button"]')).toHaveCount(0);
    await expect(page.locator('a [data-ux-affordance="static-metric-card"]')).toHaveCount(0);
    await expect(page.locator('button [data-ux-affordance="static-metric-card"]')).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Invite User" })).toBeEnabled();
  });

  test("keeps shared card components static by source contract", () => {
    const cardSource = readFileSync("components/ui/card.tsx", "utf8");
    const metricSource = readFileSync("components/ui/metric-card.tsx", "utf8");

    expect(cardSource).toContain('data-ux-affordance="static-card"');
    expect(cardSource).toContain('data-ux-interactive="false"');
    expect(metricSource).toContain('data-ux-affordance="static-metric-card"');
    expect(metricSource).toContain('data-ux-interactive="false"');
    expect(cardSource).not.toMatch(/onClick|type="button"|href=|tabIndex=\{?0/);
    expect(metricSource).not.toMatch(/onClick|type="button"|href=|tabIndex=\{?0/);
  });
});
