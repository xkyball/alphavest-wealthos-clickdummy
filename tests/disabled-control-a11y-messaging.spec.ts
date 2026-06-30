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

test.describe("UXP2-010 accessibility-safe disabled-control messaging", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page);
  });

  test("marks registered-only header and global search locks with accessible reasons", async ({ page }) => {
    await page.goto("/states");

    const headerStatus = page
      .locator('[data-ux-primary-cta="true"][data-ux-interactive="false"]')
      .filter({ hasText: "Reference only" });
    const search = page.getByRole("combobox", { name: "Global search" }).first();

    await expect(headerStatus).toHaveAttribute("data-ux-disabled-message", "accessible");
    await expect(headerStatus).toHaveAttribute("data-ux-disabled-reason", /Protected routes remain deferred, reference-only or held until explicitly unlocked/);
    await expect(headerStatus).toHaveAttribute("aria-describedby", /page-header-reference-only-disabled-reason/);
    await expect(search).toBeDisabled();
    await expect(search).toHaveAttribute("data-ux-disabled-message", "visible");
    await expect(search).toHaveAttribute("data-ux-disabled-reason", "Search is disabled for this registered page.");
    await expect(page.getByTestId("ux-disabled-control-reason").filter({ hasText: "Search is disabled for this registered page." }).first()).toBeVisible();
  });

  test("removes action-board filter controls instead of exposing static unavailable controls", async ({ page }) => {
    await page.goto("/actions");

    await expect(page.getByLabel("Priority filter is static in this action board")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Priority filter is static in this action board" })).toHaveCount(0);
  });

  test("keeps disabled table row actions understandable without adding focus traps", async ({ page }) => {
    await page.goto("/admin/tenants");

    const rowAction = page.getByTestId("ux-data-table-row-action").first();

    await expect(rowAction).toBeDisabled();
    await expect(rowAction).toHaveAttribute("data-ux-row-action-state", "disabled");
    await expect(rowAction).toHaveAttribute("data-ux-disabled-message", "accessible");
    await expect(rowAction).toHaveAttribute("data-ux-disabled-reason", "No row action is available for this table state.");
    await expect(rowAction).toHaveAttribute("aria-describedby", /row-action-/);
  });

  test("keeps disabled-control messaging centralized in shared primitives", () => {
    const sources = [
      "components/page-header.tsx",
      "components/ui/data-table.tsx",
      "components/ui/filter-bar.tsx",
      "components/ui/guarded-action-button.tsx",
      "components/ui/kanban.tsx",
      "components/global-search-box.tsx",
    ];

    for (const sourcePath of sources) {
      const source = readFileSync(sourcePath, "utf8");
      const usesActionContractProjection = source.includes("uxActionAttributesFor");

      expect(source.includes("data-ux-disabled-reason") || usesActionContractProjection, sourcePath).toBe(true);
      expect(source.includes("data-ux-disabled-message") || usesActionContractProjection, sourcePath).toBe(true);
    }
  });
});
