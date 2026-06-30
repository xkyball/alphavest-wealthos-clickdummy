import { expect, type Page, test } from "@playwright/test";

import { localAuthSessionCookieName } from "../lib/auth/local-auth-session";
import { routeToSmokePath, screenRoutes } from "../lib/route-registry";

const releaseRoute = screenRoutes.find((route) => route.pageId === "040");

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

test.beforeEach(async ({ page }) => {
  await authenticate(page);
});

test.describe("Stage 04 interaction lifecycle", () => {
  test("release confirmation supports cancel and Escape close paths", async ({ page }) => {
    expect(releaseRoute).toBeDefined();
    const releasePath = routeToSmokePath(releaseRoute!.route);

    await page.goto(`${releasePath}?state=release`);

    const releaseDialog = page.getByRole("dialog", { name: "Release client-safe review" });
    await expect(releaseDialog).toBeVisible();
    await expect(releaseDialog.getByRole("button", { name: "Close" })).toBeFocused();
    await releaseDialog.getByRole("button", { name: "Cancel" }).click();
    await expect(releaseDialog).toBeHidden();

    await page.goto(`${releasePath}?state=release`);
    await expect(releaseDialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(releaseDialog).toBeHidden();
  });

  test("compliance block modal has explicit trigger and cancel lifecycle", async ({ page }) => {
    await page.goto("/compliance/reviews/current/block?state=base");

    const blockDialog = page.getByRole("dialog", { name: "Block or Request Evidence" });
    await expect(blockDialog).toHaveCount(0);

    await page.getByRole("button", { name: "Manage Block" }).click();
    await expect(blockDialog).toBeVisible();
    await blockDialog.getByRole("button", { name: "Cancel" }).click();
    await expect(blockDialog).toBeHidden();
  });

  test("governance role confirmation opens from drawer and cancels without mutation", async ({ page }) => {
    await page.goto("/governance/roles/portfolio-manager?state=base");

    const createRoleButton = page.getByRole("button", { name: "Create permitted role" });
    await createRoleButton.click();
    const roleDrawer = page.getByRole("complementary", { name: "Portfolio Manager" });
    await expect(roleDrawer).toBeVisible();
    await expect(roleDrawer.getByRole("button", { name: "Close" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(roleDrawer).toBeHidden();
    await expect(createRoleButton).toBeFocused();

    await createRoleButton.click();
    await expect(roleDrawer).toBeVisible();

    const reviewScopedChanges = roleDrawer.getByRole("button", { name: "Review permitted changes" });
    await expect(reviewScopedChanges).toBeDisabled();
    await expect(roleDrawer.getByTestId("j07-role-drawer-validation-state")).toContainText(
      "Role review remains blocked until the required acknowledgement is checked.",
    );
    await roleDrawer.locator("input[type='checkbox']").check();
    await expect(reviewScopedChanges).toBeEnabled();

    await reviewScopedChanges.click();
    const confirmationDialog = page.getByRole("dialog", { name: "Confirm Sensitive Permission Changes" });
    await expect(confirmationDialog).toBeVisible();

    await confirmationDialog.getByRole("button", { name: "Cancel" }).click();
    await expect(confirmationDialog).toBeHidden();
    await expect(roleDrawer).toBeVisible();
  });

  test("wealth map stays a hub and action details close instead of acting as permanent fake drawers", async ({ page }) => {
    await page.goto("/wealth-map?state=drawer");

    const wealthDrawer = page.locator('aside[aria-label="Bennett Family Trust"]');
    await expect(page.getByTestId("ux-hub-page")).toBeVisible();
    await expect(wealthDrawer).toHaveCount(0);

    await page.goto("/actions?state=drawer");
    const actionDrawer = page.locator('aside[aria-label="Action Details"]');
    await expect(actionDrawer).toBeVisible();
    await actionDrawer.getByRole("button", { name: "Close action drawer" }).click();
    await expect(actionDrawer).toBeHidden();

    await page.getByRole("button", { name: "Open selected action" }).click();
    await expect(actionDrawer).toBeVisible();
  });
});
