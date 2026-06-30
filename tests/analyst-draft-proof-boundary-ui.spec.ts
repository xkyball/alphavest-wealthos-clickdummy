import { expect, type Page, test } from "@playwright/test";

import { localAuthSessionCookieName } from "../lib/auth/local-auth-session";

async function authenticate(page: Page) {
  await page.context().addCookies([
    {
      httpOnly: true,
      domain: "127.0.0.1",
      name: localAuthSessionCookieName,
      path: "/",
      sameSite: "Lax",
      value: "av-session-playwright-authenticated",
    },
  ]);
}

test.describe("DOMAIN-4 analyst workflow operational boundaries", () => {
  test("S034 keeps analyst work operational without proof panels or release overclaim", async ({ page }) => {
    await authenticate(page);
    await page.goto("/advisory/review-queue");

    await expect(page.getByTestId("domain09-s034-draft-step-surface")).toHaveCount(0);
    await expect(page.getByTestId("s034-client-master-list")).toBeVisible();
    await expect(page.getByTestId("s034-analyst-real-filters")).toBeVisible();
    await expect(page.getByTestId("ux-data-table-pagination")).toHaveAttribute("data-ux-data-surface-source-truth", "backend_query_backed");
    await expect(page.getByTestId("s034-client-selected-detail")).toBeVisible();
    await expect(page.getByTestId("ux-filter-active-state")).toContainText("Analyst workbench is current.");
    const selectableRows = page.getByTestId("ux-data-table").locator('[data-ux-row-selected]');
    await expect(selectableRows.first()).toHaveAttribute("data-ux-row-selected", "true");
    if (await selectableRows.count() > 1) {
      const secondRow = selectableRows.nth(1);
      const selectedClient = (await secondRow.locator("td").first().innerText()).trim();
      await secondRow.click();
      await expect(secondRow).toHaveAttribute("data-ux-row-selected", "true");
      await expect(page.getByTestId("s034-client-selected-detail")).toContainText(selectedClient);
    }
    await page.getByRole("button", { name: /Sort by Priority/i }).click();
    await expect(page.getByTestId("ux-data-table-pagination")).toContainText(/Showing \d+ of \d+ records/);
    const reviewWorkLink = page.getByRole("link", { name: "Open review work" });
    await expect(reviewWorkLink).toBeVisible();
    await expect(reviewWorkLink).toHaveAttribute("href", "/advisory/triggers/liquidity-drift/review");

    await expect(page.locator('[data-workflow02-route-id="034"]')).not.toContainText(/advisor approved|compliance released|release complete|export ready|client visibility unlocked/i);
    await expect(page.locator('[data-workflow02-route-id="034"]')).not.toContainText(/proof|contract|processes mapped|gates remain controlled/i);
  });

  test("S035 keeps trigger review internal without proof panel or downstream overclaim", async ({ page }) => {
    await authenticate(page);
    await page.goto("/advisory/triggers/liquidity-drift/review");

    await expect(page.getByTestId("domain09-s035-draft-step-surface")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Route to advisor review" })).toBeVisible();

    await expect(page.locator('[data-workflow02-route-id="035"]')).not.toContainText(/all notes are audit logged|advisor approved|compliance released|release complete|export ready|client visibility unlocked/i);
    await expect(page.locator('[data-workflow02-route-id="035"]')).not.toContainText(/proof|contract|processes mapped|gates remain controlled/i);
  });
});
