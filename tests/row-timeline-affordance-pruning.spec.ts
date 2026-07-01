import { expect, type Page, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import { authenticatePageWithJwt } from "./helpers/auth-jwt";

async function authenticate(page: Page, request: Parameters<typeof authenticatePageWithJwt>[1]) {
  await authenticatePageWithJwt(page, request, { email: "ava.admin@alphavest.demo" });
}

test.describe("UXP2-006 row and timeline action pruning", () => {
  test.beforeEach(async ({ page, request }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page, request);
  });

  test("keeps real queue row actions enabled with explicit lifecycle state", async ({ page }) => {
    await page.goto("/advisor/reviews");

    const table = page.getByTestId("ux-data-table").first();
    const rowAction = table.getByTestId("ux-data-table-row-action").first();

    await expect(rowAction).toBeEnabled();
    await expect(rowAction).toHaveAttribute("data-ux-affordance", "row-action");
    await expect(rowAction).toHaveAttribute("data-ux-interactive", "true");
    await expect(rowAction).toHaveAttribute("data-ux-row-action-state", "enabled");

    await rowAction.click();
    await expect(page).toHaveURL(/\/advisor\/reviews\/[0-9a-f-]{36}|\/advisor\/reviews\/current/);
  });

  test("keeps no-lifecycle table row actions disabled", async ({ page }) => {
    await page.goto("/admin/tenants");

    const table = page.getByTestId("ux-data-table").first();
    const rowAction = table.getByTestId("ux-data-table-row-action").first();

    await expect(rowAction).toBeDisabled();
    await expect(rowAction).toHaveAttribute("data-ux-affordance", "row-action");
    await expect(rowAction).toHaveAttribute("data-ux-interactive", "false");
    await expect(rowAction).toHaveAttribute("data-ux-row-action-state", "disabled");
    await expect(rowAction).toHaveAttribute("title", "No row action is available for this table state.");
  });

  test("keeps role review on product controls without stale role-matrix affordances", async ({ page }) => {
    await page.goto("/governance/roles/portfolio-manager");

    await expect(page.getByRole("button", { name: /Role matrix sorting|Role matrix actions/ })).toHaveCount(0);
    await expect(page.getByTestId("j07-open-role-review-rail")).toBeVisible();
    await expect(page.locator("body")).not.toContainText(/command spine|downstream checks|governed role workflow/i);
  });

  test("marks evidence and audit timeline lists static on the action drawer", async ({ page }) => {
    await page.goto("/actions");

    await page.getByRole("button", { name: "Open selected action" }).first().click();

    await expect(page.getByRole("button", { name: /Related evidence view-all|Timeline view-all/ })).toHaveCount(0);
    await expect(page.getByRole("complementary", { name: "Action Details" })).toBeVisible();
    await expect(page.getByText("Evidence check is tracked")).toBeVisible();
    await expect(
      page.getByText("The action remains governed by action state, evidence status and release controls."),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Request Info" })).toBeVisible();
    await expect(page.locator("body")).not.toContainText(
      /Permitted list|Permitted timeline|Related evidence view-all|Timeline view-all/,
    );
    await expect(page.locator('[data-ux-affordance="static-timeline-item"][role="button"]')).toHaveCount(0);
  });

  test("keeps shared evidence and timeline source static by contract", () => {
    const evidenceSource = readFileSync("components/ui/evidence-list.tsx", "utf8");
    const timelineSource = readFileSync("components/ui/audit-timeline.tsx", "utf8");

    expect(evidenceSource).toContain('data-ux-affordance="static-evidence-list"');
    expect(evidenceSource).toContain('data-ux-affordance="static-evidence-item"');
    expect(evidenceSource).not.toMatch(/onClick|type="button"|href=|tabIndex=\{?0/);
    expect(timelineSource).toContain('data-ux-affordance="static-audit-timeline"');
    expect(timelineSource).toContain('data-ux-affordance="static-timeline-item"');
    expect(timelineSource).not.toMatch(/onClick|type="button"|href=|tabIndex=\{?0/);
  });
});
