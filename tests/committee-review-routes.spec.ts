import { expect, test } from "@playwright/test";

test.describe("Phase E committee review routes", () => {
  test("queue remains registered but held behind the route workset gate", async ({ page }) => {
    await page.goto("/committee/reviews");

    await expect(page.getByRole("heading", { name: "Committee Review Queue" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Held Workspace" })).toBeVisible();
    await expect(page.getByText("Second review required")).toHaveCount(0);
    await expect(page.getByText("Client visibility blocked")).toBeVisible();
  });

  test("detail remains registered but held behind the route workset gate", async ({ page }) => {
    await page.goto("/committee/reviews/demo");

    await expect(page.getByRole("heading", { name: "Committee Review Detail" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Held Workspace" })).toBeVisible();
    await expect(page.getByText("Committee gate proof")).toHaveCount(0);
    await expect(page.getByText("Committee votes")).toHaveCount(0);
    await expect(page.getByText("Dissent resolution")).toHaveCount(0);
    await expect(page.getByText("Client visibility blocked")).toBeVisible();
  });
});
