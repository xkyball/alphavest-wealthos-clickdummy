import { expect, test } from "@playwright/test";

test.describe("Phase E committee review routes", () => {
  test("queue renders through the soft-unlocked committee UI", async ({ page }) => {
    await page.goto("/committee/reviews");

    await expect(page.getByRole("heading", { name: "Committee Review Queue" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Held Workspace" })).toHaveCount(0);
    await expect(page.getByText("Second review required")).toBeVisible();
    await expect(page.getByText("clientVisible=false until committee, compliance, evidence and permission gates pass.")).toBeVisible();
  });

  test("detail renders through the soft-unlocked committee UI", async ({ page }) => {
    await page.goto("/committee/reviews/demo");

    await expect(page.getByRole("heading", { name: "Committee Review Detail" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Held Workspace" })).toHaveCount(0);
    await expect(page.getByText("Committee gate proof")).toBeVisible();
    await expect(page.getByText("Committee votes")).toBeVisible();
    await expect(page.getByText("Dissent resolution")).toBeVisible();
    await expect(page.getByText("Committee review never releases advice to the client")).toBeVisible();
  });
});
