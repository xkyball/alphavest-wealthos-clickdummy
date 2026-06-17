import { expect, test } from "@playwright/test";

test.describe("Phase E committee review routes", () => {
  test("queue shows second-review gate and blocks client visibility", async ({ page }) => {
    await page.goto("/committee/reviews");

    await expect(page.getByRole("heading", { name: "Committee Review Queue" })).toBeVisible();
    await expect(page.getByText("Second review required")).toBeVisible();
    await expect(page.getByText("Client visible")).toBeVisible();
    await expect(page.getByText("0", { exact: true }).first()).toBeVisible();
  });

  test("detail shows votes, dissent and evidence proof labels", async ({ page }) => {
    await page.goto("/committee/reviews/demo");

    await expect(page.getByRole("heading", { name: "Committee Review Detail" })).toBeVisible();
    await expect(page.getByText("Committee gate proof")).toBeVisible();
    await expect(page.getByText("Committee votes")).toBeVisible();
    await expect(page.getByText("Dissent resolution")).toBeVisible();
    await expect(page.getByText("Committee vote record")).toBeVisible();
  });
});
