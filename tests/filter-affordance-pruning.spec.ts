import { expect, type Page, test } from "@playwright/test";

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

test.describe("UXP2-002 filter affordance pruning", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page);
  });

  test("removes fake actions-board filters from the compact board", async ({ page }) => {
    await page.goto("/actions");

    await expect(page.getByRole("button", { name: "Open selected action" })).toBeEnabled();
    await expect(page.getByRole("button", { name: "Filters" }).first()).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Priority filter is static in this action board" })).toHaveCount(0);
    await expect(page.getByLabel("Priority filter is static in this action board")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Board grouping is fixed to workflow stage" })).toHaveCount(0);
    await expect(page.getByLabel("Board grouping is fixed to workflow stage")).toHaveCount(0);
  });

  test("keeps real tenant filters active and disables generic filter drawer affordances", async ({ page }) => {
    await page.goto("/admin/tenants");

    await expect(page.getByRole("heading", { name: "Tenant Directory" })).toBeVisible();
    await expect(page.getByTestId("ux-data-table-pagination")).toHaveAttribute("data-ux-data-surface-source-truth", "backend_query_backed");
    await expect(page.getByRole("button", { name: /^Filters$/ })).toHaveCount(0);

    await page.goto("/tenants/demo/users");
    await expect(page.getByPlaceholder("Search DB tenant users...")).toBeVisible();
    await expect(page.getByTestId("ux-data-table-pagination")).toHaveAttribute("data-ux-data-surface-source-truth", "backend_query_backed");
  });

  test("disables unwired evidence filters while preserving document filter lifecycle", async ({ page }) => {
    await page.goto("/evidence");

    await expect(page.getByPlaceholder("Evidence search unavailable")).toBeDisabled();
    await expect(page.getByRole("button", { name: "Category filter is static in this evidence list" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Additional evidence filters are not wired in this release" })).toBeDisabled();

    await page.goto("/documents");
    await page.getByLabel("Tenant context").last().selectOption("bennett");
    await page.getByLabel("Role context").last().selectOption("compliance_officer");
    await page.getByTestId("p10-document-type-filter").selectOption("source_of_funds");
    await expect(page.getByTestId("ux-data-table-pagination")).toHaveAttribute("data-ux-data-surface-source-truth", "backend_query_backed");
    await expect(page.getByTestId("p10-document-filter-summary")).toContainText("backend-scoped documents visible");
    await expect(page.getByRole("button", { name: "Permitted Entities" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Accessible to Me" })).toBeDisabled();
  });
});
