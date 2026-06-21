import { expect, test } from "@playwright/test";

const importantNavigationLinks = [
  { path: "/portal", label: "Client portal" },
  { path: "/documents/upload", label: "Evidence intake" },
  { path: "/workbench", label: "Workbench" },
  { path: "/advisor-approval", label: "Advisor approval" },
  { path: "/compliance", label: "Compliance queue" },
  { path: "/documents", label: "Document library" },
  { path: "/evidence", label: "Evidence vault" },
  { path: "/governance/users", label: "Governance users" },
  { path: "/export/new", label: "New export" }
];

test.describe("AlphaVest navigation shell", () => {
  test("desktop renders one primary navigation landmark with the current route marked active", async ({ page }) => {
    await page.goto("/admin/evidence-templates");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(primaryNavigation).toHaveCount(1);

    const activeLink = primaryNavigation.getByRole("link", { name: "Evidence templates" });
    await expect(activeLink).toHaveAttribute("aria-current", "page");
  });

  test("workflow sections replace route-catalogue groups", async ({ page }) => {
    await page.goto("/admin/evidence-templates");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });

    await expect(primaryNavigation.getByRole("region", { name: "Client & Evidence" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Advisory Work" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Compliance & Release" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Setup" })).toBeVisible();
    await expect(primaryNavigation.getByText("Access & Setup")).toHaveCount(0);
    await expect(primaryNavigation.getByText("Platform & Tenant")).toHaveCount(0);

    const primaryEntries = primaryNavigation.locator("[data-navigation-item-tier='primary']");
    await expect(primaryEntries).toHaveCount(22);
  });

  test("dynamic detail routes resolve the matching active parent navigation item", async ({ page }) => {
    await page.goto("/workbench/triggers/demo");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });
    const activeLink = primaryNavigation.getByRole("link", { name: "Workbench" });

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

  test("soft-unlocked P1, reference and held routes appear in support navigation", async ({ page }) => {
    await page.goto("/admin/evidence-templates");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });

    await expect(primaryNavigation.getByRole("region", { name: "Soft-unlocked routes" })).toBeVisible();
    await expect(primaryNavigation.getByRole("link", { name: "Communication Centre" })).toHaveAttribute(
      "href",
      "/communication"
    );
    await expect(primaryNavigation.getByRole("link", { name: "Service Blueprint" })).toHaveAttribute(
      "href",
      "/service-blueprint"
    );
    await expect(primaryNavigation.getByRole("link", { name: "KYC / AML Review" })).toHaveAttribute(
      "href",
      "/kyc/demo/review"
    );
    await expect(primaryNavigation.getByRole("link", { name: "Committee Review Queue" })).toHaveAttribute(
      "href",
      "/committee/reviews"
    );
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

    await expect(page).toHaveURL(/\/workbench$/);
    await expect(page.getByRole("heading", { level: 2, name: "Consultant Workbench" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toHaveCount(0);
  });
});
