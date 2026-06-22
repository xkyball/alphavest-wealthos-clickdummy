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
    await page.goto("/export/demo/redaction");

    const table = page.getByTestId("ux-data-table").first();
    const rowAction = table.getByTestId("ux-data-table-row-action").first();

    await expect(rowAction).toBeDisabled();
    await expect(rowAction).toHaveAttribute("data-ux-affordance", "row-action");
    await expect(rowAction).toHaveAttribute("data-ux-interactive", "false");
    await expect(rowAction).toHaveAttribute("data-ux-row-action-state", "disabled");
    await expect(rowAction).toHaveAttribute("title", "No scoped row action for this table state.");
  });

  test("disables role matrix row and sort actions without route-scope expansion", async ({ page }) => {
    await page.goto("/governance/roles/demo");

    const sortAction = page.getByRole("button", {
      name: "Role matrix sorting by Role is held until governed role workflow is selected",
    });
    const rowAction = page.getByRole("button", {
      name: "Role matrix actions for Portfolio Manager are held until governed role workflow is selected",
    });

    await expect(sortAction).toBeDisabled();
    await expect(sortAction).toHaveAttribute("data-ux-interactive", "false");
    await expect(rowAction).toBeDisabled();
    await expect(rowAction).toHaveAttribute("data-ux-affordance", "row-action");
    await expect(rowAction).toHaveAttribute("data-ux-interactive", "false");
    await expect(rowAction).toHaveAttribute("data-ux-row-action-state", "disabled");
  });

  test("marks evidence and audit timeline lists static on the action drawer", async ({ page }) => {
    await page.goto("/actions");

    await page.getByRole("button", { name: "Open selected action" }).first().click();

    await expect(page.getByRole("button", { name: "Related evidence view-all is not wired in this release" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Timeline view-all is not wired in this release" })).toBeDisabled();
    await expect(page.getByTestId("ux-phase5-audit-timeline")).toHaveAttribute("data-ux-affordance", "static-audit-timeline");
    await expect(page.getByTestId("ux-phase5-audit-timeline")).toHaveAttribute("data-ux-interactive", "false");
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
