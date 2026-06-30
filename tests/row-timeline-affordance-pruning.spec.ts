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

test.describe("UXP2-006 row and timeline action pruning", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page);
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
    await expect(page).toHaveURL(/\/advisor\/reviews\/demo/);
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
    await expect(page.getByRole("button", { name: "Review permitted changes" })).toBeVisible();
    await expect(page.locator("body")).not.toContainText(/command spine|downstream checks|governed role workflow/i);
  });

  test("marks evidence and audit timeline lists static on the action drawer", async ({ page }) => {
    await page.goto("/actions");

    await page.getByRole("button", { name: "Open selected action" }).first().click();

    await expect(page.getByRole("button", { name: /Related evidence view-all|Timeline view-all/ })).toHaveCount(0);
    await expect(page.getByText("Permitted list")).toBeVisible();
    await expect(page.getByText("Permitted timeline")).toBeVisible();
    await expect(page.getByTestId("ux-stage5-audit-timeline")).toHaveAttribute("data-ux-affordance", "static-audit-timeline");
    await expect(page.getByTestId("ux-stage5-audit-timeline")).toHaveAttribute("data-ux-interactive", "false");
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
