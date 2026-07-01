import { expect, type Locator, type Page, test } from "@playwright/test";

import { authenticatePageWithJwt } from "./helpers/auth-jwt";

async function authenticateAdmin(page: Page, request: Parameters<typeof authenticatePageWithJwt>[1]) {
  await authenticatePageWithJwt(page, request, { email: "ava.admin@alphavest.demo" });
}

async function authenticateCompliance(page: Page, request: Parameters<typeof authenticatePageWithJwt>[1]) {
  await authenticatePageWithJwt(page, request, {
    email: "naledi.compliance@alphavest.demo",
    roleKey: "compliance_officer",
    tenantSlug: "bennett",
  });
}

async function firstColumnTexts(table: Locator) {
  return table.locator("tbody tr td:first-child").allInnerTexts();
}

function sorted(values: string[], direction: "ascending" | "descending") {
  const sortedValues = [...values].sort((left, right) => left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" }));

  return direction === "descending" ? sortedValues.reverse() : sortedValues;
}

test.describe("UXP2-003 sort affordance pruning", () => {
  test.beforeEach(async ({ page, request }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateAdmin(page, request);
  });

  test("keeps document table sort interactive only where row order changes visibly", async ({ page, request }) => {
    await authenticateCompliance(page, request);
    await page.goto("/documents");

    const table = page.getByTestId("ux-data-table").first();
    const sortButton = table.getByRole("button", { name: /Sort by Document Name/ });
    const sortableHeader = table.locator("th").filter({ hasText: "Document Name" });

    await expect(sortButton).toBeVisible();
    await expect(sortableHeader).toHaveAttribute("aria-sort", "none");
    const initialNames = await firstColumnTexts(table);

    await sortButton.click();
    await expect(sortableHeader).toHaveAttribute("aria-sort", "ascending");
    await expect.poll(async () => firstColumnTexts(table)).not.toEqual(initialNames);
    const ascendingNames = await firstColumnTexts(table);
    expect(ascendingNames).toEqual(sorted(ascendingNames, "ascending"));

    await sortButton.click();
    await expect(sortableHeader).toHaveAttribute("aria-sort", "descending");
    await expect.poll(async () => firstColumnTexts(table)).not.toEqual(ascendingNames);
    const descendingNames = await firstColumnTexts(table);
    expect(descendingNames).toEqual(sorted(descendingNames, "descending"));
  });

  test("keeps tenant table sort functional without enabling row actions", async ({ page }) => {
    await page.goto("/admin/tenants");

    const table = page.getByTestId("ux-data-table").first();
    const sortButton = table.getByRole("button", { name: /Sort by Tenant/ });
    const sortableHeader = table.locator("th").filter({ hasText: "Tenant" });

    await expect(sortButton).toBeVisible();
    await expect(sortableHeader).toHaveAttribute("aria-sort", "ascending");
    const ascendingFields = await firstColumnTexts(table);
    expect(ascendingFields).toEqual(sorted(ascendingFields, "ascending"));

    await sortButton.click();
    await expect(sortableHeader).toHaveAttribute("aria-sort", "descending");
    const descendingFields = await firstColumnTexts(table);
    expect(descendingFields).toEqual(sorted(descendingFields, "descending"));

    await expect(table.getByRole("button", { name: "No row action is available for this table state." }).first()).toBeDisabled();
  });
});
