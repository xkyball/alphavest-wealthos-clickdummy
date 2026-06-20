import { expect, test } from "@playwright/test";

test.describe("Phase 03 UI state boundaries", () => {
  test("export delivery state does not imply client acceptance", async ({ page }) => {
    await page.goto("/export/demo/download");

    await expect(page.getByText("Approved export delivery state")).toBeVisible();
    await expect(page.getByText("Download and share actions do not imply client acceptance or downstream advice execution.")).toBeVisible();
  });
});
