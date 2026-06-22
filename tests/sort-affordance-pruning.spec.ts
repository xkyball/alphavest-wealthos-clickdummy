import { expect, type Locator, type Page, test } from "@playwright/test";

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

async function firstColumnTexts(table: Locator) {
  return table.locator("tbody tr td:first-child").allInnerTexts();
}

function sorted(values: string[], direction: "ascending" | "descending") {
  const sortedValues = [...values].sort((left, right) => left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" }));

  return direction === "descending" ? sortedValues.reverse() : sortedValues;
}

test.describe("UXP2-003 sort affordance pruning", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page);
  });

  test("keeps document table sort interactive only where row order changes visibly", async ({ page }) => {
    await page.goto("/documents");
    await page.getByLabel("Tenant context").last().selectOption("bennett");
    await page.getByLabel("Role context").last().selectOption("compliance_officer");

    const table = page.getByTestId("ux-data-table").first();
    const sortButton = table.getByRole("button", { name: /Sort by Document Name/ });
    const sortableHeader = table.locator("th").filter({ hasText: "Document Name" });

    await expect(sortButton).toBeVisible();
    await expect(sortableHeader).toHaveAttribute("aria-sort", "none");

    await sortButton.click();
    await expect(sortableHeader).toHaveAttribute("aria-sort", "ascending");
    const ascendingNames = await firstColumnTexts(table);
    expect(ascendingNames).toEqual(sorted(ascendingNames, "ascending"));

    await sortButton.click();
    await expect(sortableHeader).toHaveAttribute("aria-sort", "descending");
    const descendingNames = await firstColumnTexts(table);
    expect(descendingNames).toEqual(sorted(descendingNames, "descending"));
  });

  test("keeps dense export table sort functional without enabling row actions", async ({ page }) => {
    await page.goto("/export/demo/redaction");

    const operations = page.getByTestId("ux-d3-dense-operations").first();
    const table = operations.getByTestId("ux-data-table").first();
    const sortButton = table.getByRole("button", { name: /Sort by Payload field/ });
    const sortableHeader = table.locator("th").filter({ hasText: "Payload field" });

    await expect(operations.getByTestId("ux-d3-filter-sort-controls").getByRole("button")).toHaveCount(0);
    await expect(sortButton).toBeVisible();
    await expect(sortableHeader).toHaveAttribute("aria-sort", "ascending");
    const ascendingFields = await firstColumnTexts(table);
    expect(ascendingFields).toEqual(sorted(ascendingFields, "ascending"));

    await sortButton.click();
    await expect(sortableHeader).toHaveAttribute("aria-sort", "descending");
    const descendingFields = await firstColumnTexts(table);
    expect(descendingFields).toEqual(sorted(descendingFields, "descending"));

    await expect(table.getByRole("button", { name: "No scoped row action for this table state." }).first()).toBeDisabled();
  });
});
