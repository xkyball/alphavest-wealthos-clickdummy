import { expect, test } from "@playwright/test";

test.describe("Phase E committee review routes", () => {
  test("queue renders through the SCF held-route guard", async ({ page }) => {
    await page.goto("/committee/reviews");

    await expect(page.getByRole("heading", { name: "Committee Review Queue" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Held Workspace" })).toBeVisible();
    await expect(page.getByText("held until a later explicit scope")).toBeVisible();
    await expect(page.getByText("Advisor approval alone never unlocks client visibility.")).toBeVisible();
  });

  test("detail renders through the SCF held-route guard", async ({ page }) => {
    await page.goto("/committee/reviews/demo");

    await expect(page.getByRole("heading", { name: "Committee Review Detail" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Held Workspace" })).toBeVisible();
    await expect(page.getByText("held until a later explicit scope")).toBeVisible();
    await expect(page.getByText("Advisor approval alone never unlocks client visibility.")).toBeVisible();
  });
});
