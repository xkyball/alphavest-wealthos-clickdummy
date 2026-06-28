import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";
import { createDemoSession } from "../lib/demo-session";
import { navigationGroupsForRole, productiveNavigationPageIds } from "../lib/navigation";

const importantNavigationLinks = [
  { path: "/journeys", label: "Command Center" },
  { path: "/tenants/demo/setup", label: "Foundation" },
  { path: "/client/home", label: "Client Context" },
  { path: "/documents/upload", label: "Evidence Lifecycle" },
  { path: "/advisory/review-queue", label: "Analyst Workbench" },
  { path: "/advisor/reviews", label: "Advisor Review" },
  { path: "/compliance/reviews", label: "Compliance Release" },
  { path: "/decisions/demo", label: "Decision Record" },
  { path: "/mobile", label: "Client Visibility" },
  { path: "/export/new", label: "Export & Delivery" }
];

const routeSpecificShellFiles = [
  "components/client-intake-screen.tsx",
  "components/internal-workflow-screen.tsx",
  "components/decisions-governance-screen.tsx",
  "components/communication-export-ops-screen.tsx",
  "components/wealth-actions-screen.tsx",
  "components/kyc-aml-workflow-screen.tsx",
];

const legacyLocalNavigationNames = [
  "processNav",
  "clientNav",
  "internalNav",
  "decisionNav",
  "phase13Nav",
  "shellNav",
  "kycNav",
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
  test("route-specific shells share the process sidebar renderer", () => {
    for (const filePath of routeSpecificShellFiles) {
      const source = readFileSync(filePath, "utf8");

      expect(source, `${filePath} must render the shared process sidebar`).toContain("ProcessSidebar");
      expect(source, `${filePath} must not declare a legacy NavItem type`).not.toMatch(/\btype\s+(NavItem|ShellNavItem)\b/);

      for (const legacyName of legacyLocalNavigationNames) {
        expect(source, `${filePath} must not keep local ${legacyName} links`).not.toMatch(
          new RegExp(`\\bconst\\s+${legacyName}\\b`)
        );
      }
    }
  });

  test("orders the approved process-first app areas from command center through export", () => {
    const internalSession = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "bennett" });
    const labels = navigationGroupsForRole(internalSession.role).map((group) => group.label);
    const journeyLabels = [
      "Command Center",
      "Foundation",
      "Client Context",
      "Evidence Lifecycle",
      "Analyst Workbench",
      "Advisor Review",
      "Compliance Release",
      "Decision Record",
      "Client Visibility",
      "Export & Delivery",
      "Operations",
      "Protected Work",
    ];

    for (const label of journeyLabels) {
      expect(labels).toContain(label);
    }

    const positions = journeyLabels.map((label) => labels.indexOf(label));
    expect(positions).toEqual([...positions].sort((left, right) => left - right));
    expect(productiveNavigationPageIds).toEqual(["015", "019", "028", "034", "036", "038", "044", "020", "054"]);
    expect(productiveNavigationPageIds).not.toEqual(expect.arrayContaining(["052", "053", "059", "060", "061", "062", "063", "064", "065", "066", "067", "068", "069", "070", "071"]));
  });

  test("keeps client-role navigation client-safe while naming locked internal workspaces", () => {
    const principalSession = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const groups = navigationGroupsForRole(principalSession.role);
    const visibleGroups = groups.filter((group) => group.items.length > 0).map((group) => group.label);
    const lockedGroups = groups.filter((group) => group.lockedReason).map((group) => group.label);

    expect(visibleGroups).toEqual(expect.arrayContaining(["Command Center", "Client Context", "Evidence Lifecycle", "Decision Record", "Client Visibility"]));
    expect(lockedGroups).toEqual(expect.arrayContaining(["Foundation", "Analyst Workbench", "Advisor Review", "Compliance Release", "Export & Delivery", "Operations", "Protected Work"]));

    for (const group of groups.filter((candidate) => candidate.lockedReason)) {
      expect(group.items).toHaveLength(0);
      if (group.label === "Operations" || group.label === "Protected Work") {
        expect(group.lockedReason).toMatch(/deep-link|completion proof/);
      } else {
        expect(group.lockedReason).toContain("client-safe navigation view");
      }
    }
  });

  test("desktop renders one primary navigation landmark with the current route marked active", async ({ page }) => {
    await page.goto("/documents/upload");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(primaryNavigation).toHaveCount(1);

    const activeLink = primaryNavigation.getByRole("link", { name: "Evidence Lifecycle" });
    await expect(activeLink).toHaveAttribute("aria-current", "page");
  });

  test("workflow sections replace route-catalogue groups", async ({ page }) => {
    await page.goto("/admin/evidence-templates");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });

    await expect(primaryNavigation.getByRole("region", { name: "Command Center" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Foundation" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Client Context" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Evidence Lifecycle" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Analyst Workbench" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Advisor Review" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Compliance Release" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Decision Record" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Client Visibility" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Export & Delivery" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Operations" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Protected Work" })).toBeVisible();
    await expect(primaryNavigation.getByText("Access & Setup")).toHaveCount(0);
    await expect(primaryNavigation.getByText("Platform & Tenant")).toHaveCount(0);

    const primaryEntries = primaryNavigation.locator("[data-navigation-item-tier='primary']");
    await expect(primaryEntries).toHaveCount(10);
    await expect(primaryNavigation.locator("[data-navigation-item-tier='secondary']")).toHaveCount(0);
    await expect(primaryNavigation.getByRole("link", { name: "Source library" })).toHaveCount(0);
    await expect(primaryNavigation.getByRole("link", { name: "Evidence intake" })).toHaveCount(0);
    await expect(primaryNavigation.getByRole("link", { name: "Reviewed evidence vault" })).toHaveCount(0);
    await expect(primaryNavigation.getByRole("link", { name: "Advisor approval", exact: true })).toHaveCount(0);
    await expect(primaryNavigation.getByRole("link", { name: "New export" })).toHaveCount(0);
  });

  test("dynamic detail routes resolve the matching active parent navigation item", async ({ page }) => {
    await page.goto("/documents/demo/review");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });
    const activeLink = primaryNavigation.getByRole("link", { name: "Evidence Lifecycle" });

    await expect(activeLink).toHaveAttribute("aria-current", "page");
  });

  test("success and setup states stay folded into workflow parents", async ({ page }) => {
    await page.goto("/decisions/demo/success");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(primaryNavigation.getByRole("link", { name: /Decision Record/ })).toHaveAttribute(
      "aria-current",
      "page"
    );

    await page.goto("/tenants/demo/team");
    await expect(primaryNavigation.getByRole("link", { name: "Foundation" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("important MVP navigation links remain available in the intended shell", async ({ page }) => {
    await page.goto("/admin/evidence-templates");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });

    for (const item of importantNavigationLinks) {
      const link = primaryNavigation.locator(`a[href="${item.path}"]`);
      await expect(link).toHaveAttribute("href", item.path);
      await expect(link).toContainText(item.label);
    }
  });

  test("reference-only routes do not appear in implementation navigation", async ({ page }) => {
    await page.goto("/admin/evidence-templates");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });

    await expect(primaryNavigation.getByRole("region", { name: "Protected Work" })).toBeVisible();
    await expect(primaryNavigation.getByRole("link", { name: "Service Blueprint" })).toHaveCount(0);
    await expect(primaryNavigation.getByRole("link", { name: "Trigger Detail", exact: true })).toHaveCount(0);
    await expect(primaryNavigation.getByRole("link", { name: "Decision Submitted", exact: true })).toHaveCount(0);
    await expect(primaryNavigation.getByRole("link", { name: "Ops Queues" })).toHaveCount(0);
    await expect(primaryNavigation.getByText("Protected lane")).toBeVisible();
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
    await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Analyst Workbench" }).click();

    await expect(page).toHaveURL(/\/advisory\/review-queue$/);
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toHaveCount(0);
  });
});
