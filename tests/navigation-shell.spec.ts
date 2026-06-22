import { expect, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";

const importantNavigationLinks = [
  { path: "/client/home", label: "Client portal" },
  { path: "/documents/upload", label: "Evidence intake" },
  { path: "/advisory/review-queue", label: "Workbench" },
  { path: "/advisor/reviews", label: "Advisor approval" },
  { path: "/compliance/reviews", label: "Compliance queue" },
  { path: "/documents", label: "Document library" },
  { path: "/evidence", label: "Evidence vault" },
  { path: "/governance", label: "Governance users" },
  { path: "/export/new", label: "New export" }
];

test.beforeEach(async ({ page }) => {
  await page.context().addCookies([
    {
      httpOnly: true,
      domain: "127.0.0.1",
      name: demoAuthSessionCookieName,
      path: "/",
      sameSite: "Lax",
      value: "av-session-playwright-authenticated",
    },
  ]);
});

test.describe("AlphaVest navigation shell", () => {
  test("desktop renders one primary navigation landmark with the current route marked active", async ({ page }) => {
    await page.goto("/documents/upload");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(primaryNavigation).toHaveCount(1);

    const activeLink = primaryNavigation.getByRole("link", { name: "Evidence intake" });
    await expect(activeLink).toHaveAttribute("aria-current", "page");
  });

  test("workflow sections replace route-catalogue groups", async ({ page }) => {
    await page.goto("/admin/evidence-templates");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });

    await expect(primaryNavigation.getByRole("region", { name: "Setup" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Client Workspace" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Evidence" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Advisory Workbench" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Compliance" })).toBeVisible();
    await expect(primaryNavigation.getByText("Access & Setup")).toHaveCount(0);
    await expect(primaryNavigation.getByText("Platform & Tenant")).toHaveCount(0);

    const primaryEntries = primaryNavigation.locator("[data-navigation-item-tier='primary']");
    await expect(primaryEntries).toHaveCount(29);
  });

  test("dynamic detail routes resolve the matching active parent navigation item", async ({ page }) => {
    await page.goto("/documents/demo/review");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });
    const activeLink = primaryNavigation.getByRole("link", { name: "Evidence intake" });

    await expect(activeLink).toHaveAttribute("aria-current", "page");
  });

  test("success and setup states stay folded into workflow parents", async ({ page }) => {
    await page.goto("/decisions/demo/success");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(primaryNavigation.getByRole("link", { name: "Decisions" })).toHaveAttribute(
      "aria-current",
      "page"
    );

    await page.goto("/tenants/demo/team");
    await expect(primaryNavigation.getByRole("link", { name: "Tenant setup" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("important MVP navigation links remain available in the intended shell", async ({ page }) => {
    await page.goto("/admin/evidence-templates");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });

    for (const item of importantNavigationLinks) {
      const link = primaryNavigation.getByRole("link", { name: item.label });
      await expect(link).toHaveAttribute("href", item.path);
    }
  });

  test("reference-only routes do not appear in implementation navigation", async ({ page }) => {
    await page.goto("/admin/evidence-templates");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });

    await expect(primaryNavigation.getByRole("region", { name: "Registered-only routes" })).toHaveCount(0);
    await expect(primaryNavigation.getByRole("link", { name: "Service Blueprint" })).toHaveCount(0);
    await expect(primaryNavigation.getByRole("link", { name: "Trigger Detail", exact: true })).toHaveCount(0);
    await expect(primaryNavigation.getByRole("link", { name: "Decision Submitted", exact: true })).toHaveCount(0);
  });
});

test.describe("AlphaVest mobile navigation shell", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("mobile navigation opens, closes and closes again after route navigation", async ({ page }) => {
    await page.goto("/admin/evidence-templates");
    await page.waitForLoadState("networkidle").catch(() => undefined);
    await page.waitForTimeout(250);

    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toHaveCount(0);

    await page.getByRole("button", { name: "Open navigation" }).click();
    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(primaryNavigation).toHaveCount(1);

    await page.getByRole("button", { name: "Close navigation" }).click();
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toHaveCount(0);

    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Workbench" }).click();

    await expect(page).toHaveURL(/\/advisory\/review-queue$/);
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toHaveCount(0);
  });
});
