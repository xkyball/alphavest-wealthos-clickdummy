import { expect, type Page, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import { authenticatePageWithJwt } from "./helpers/auth-jwt";

async function authenticate(page: Page, request: Parameters<typeof authenticatePageWithJwt>[1]) {
  await authenticatePageWithJwt(page, request, { email: "ava.admin@alphavest.demo" });
}

test.describe("UXP1-003 route context containment", () => {
  test("protected route skeleton uses product guard copy without route or scenario explanation", async ({ page, request }) => {
    await authenticate(page, request);
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
