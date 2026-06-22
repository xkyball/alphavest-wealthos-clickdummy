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
    const search = page.getByRole("combobox", { name: "Tenant-scoped global search" }).first();

    await expect(headerStatus).toHaveAttribute("data-ux-disabled-message", "accessible");
    await expect(headerStatus).toHaveAttribute("data-ux-disabled-reason", /Payload visibility and audit gates remain separate from visible navigation/);
    await expect(headerStatus).toHaveAttribute("aria-describedby", /page-header-reference-only-disabled-reason/);
    await expect(search).toBeDisabled();
    await expect(search).toHaveAttribute("data-ux-disabled-message", "visible");
    await expect(search).toHaveAttribute("data-ux-disabled-reason", "Search is disabled on registered-only routes.");
    await expect(page.getByTestId("ux-disabled-control-reason").filter({ hasText: "Search is disabled on registered-only routes." }).first()).toBeVisible();
  });

  test("keeps static filter controls non-focusable while naming the unavailable reason", async ({ page }) => {
    await page.goto("/actions");

    const priorityFilter = page.getByLabel("Priority filter is static in this action board");

    await expect(priorityFilter).toHaveAttribute("role", "status");
    await expect(priorityFilter).toHaveAttribute("data-ux-interactive", "false");
    await expect(priorityFilter).toHaveAttribute("data-ux-disabled-message", "accessible");
    await expect(priorityFilter).toHaveAttribute("data-ux-disabled-reason", "Action board filters are not wired in this release.");
    await expect(priorityFilter).toHaveAttribute("aria-describedby", /action-priority-filter-disabled-reason/);
    await expect(page.getByRole("button", { name: "Priority filter is static in this action board" })).toHaveCount(0);
  });

  test("keeps disabled table row actions understandable without adding focus traps", async ({ page }) => {
    await page.goto("/export/demo/redaction");

    const rowAction = page.getByTestId("ux-data-table-row-action").first();

    await expect(rowAction).toBeDisabled();
    await expect(rowAction).toHaveAttribute("data-ux-row-action-state", "disabled");
    await expect(rowAction).toHaveAttribute("data-ux-disabled-message", "accessible");
    await expect(rowAction).toHaveAttribute("data-ux-disabled-reason", "No scoped row action for this table state.");
    await expect(rowAction).toHaveAttribute("aria-describedby", /row-action-/);
  });

  test("keeps disabled-control messaging centralized in shared primitives", () => {
    const sources = [
      "components/page-header.tsx",
      "components/ux-cta-cluster.tsx",
      "components/ui/data-table.tsx",
      "components/ui/filter-bar.tsx",
      "components/ui/guarded-action-button.tsx",
      "components/ui/kanban.tsx",
      "components/global-search-box.tsx",
    ];

    for (const sourcePath of sources) {
      const source = readFileSync(sourcePath, "utf8");
      expect(source, sourcePath).toContain("data-ux-disabled-reason");
      expect(source, sourcePath).toContain("data-ux-disabled-message");
    }
  });
});
