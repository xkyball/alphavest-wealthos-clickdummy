import { expect, test } from "@playwright/test";

import { routeToSmokePath, screenRoutes } from "../lib/route-registry";

const releaseRoute = screenRoutes.find((route) => route.pageId === "040");

test.describe("Phase 04 interaction lifecycle", () => {
  test("release confirmation supports cancel and Escape close paths", async ({ page }) => {
    expect(releaseRoute).toBeDefined();
    const releasePath = routeToSmokePath(releaseRoute!.route);

    await page.goto(`${releasePath}?state=release`);

    const releaseDialog = page.getByRole("dialog", { name: "Release to client" });
    await expect(releaseDialog).toBeVisible();
    await releaseDialog.getByRole("button", { name: "Cancel" }).click();
    await expect(releaseDialog).toBeHidden();

    await page.goto(`${releasePath}?state=release`);
    await expect(releaseDialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(releaseDialog).toBeHidden();
  });
});
