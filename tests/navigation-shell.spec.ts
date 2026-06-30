import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import { localAuthSessionCookieName } from "../lib/auth/local-auth-session";
import { createActorSession } from "../lib/actor-session";
import { navigationGroupsForRole, productiveNavigationPageIds } from "../lib/navigation";
import { uxFlowStepsForPageId, uxPageflowForPageId, uxPageflows } from "../lib/ux-route-policy";

const importantNavigationLinks = [
  { path: "/tenants/morgan/setup", label: "Foundation" },
  { path: "/client/home", label: "Client Context" },
  { path: "/documents/upload", label: "Evidence Lifecycle" },
  { path: "/advisory/review-queue", label: "Analyst Workbench" },
  { path: "/advisor/reviews", label: "Advisor Review" },
  { path: "/compliance/reviews", label: "Compliance Release" },
  { path: "/decisions/liquidity-governance", label: "Decision Record" },
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
  "stage13Nav",
  "shellNav",
  "kycNav",
];

test.beforeEach(async ({ page }) => {
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
    const internalSession = createActorSession({ roleKey: "compliance_officer", tenantSlug: "bennett" });
    const labels = navigationGroupsForRole(internalSession.role).map((group) => group.label);
    const processLabels = [
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

    for (const label of processLabels) {
      expect(labels).toContain(label);
    }

    const positions = processLabels.map((label) => labels.indexOf(label));
    expect(positions).toEqual([...positions].sort((left, right) => left - right));
    expect(productiveNavigationPageIds).toEqual(["015", "019", "028", "034", "036", "038", "044", "020", "054", "059"]);
    expect(productiveNavigationPageIds).not.toEqual(expect.arrayContaining(["052", "053", "061", "062", "063", "064", "065", "066", "067"]));
  });

  test("maps the visible app journey to user workstreams without exposing process metadata", () => {
    expect(uxPageflows.map((flow) => flow.label)).toEqual([
      "Client context to evidence",
      "Evidence to advisory",
      "Advisory to compliance",
      "Advisor review to release",
      "Released client view",
      "Export delivery",
      "Governance and operations",
    ]);

    expect(uxPageflowForPageId("019")?.label).toBe("Client context to evidence");
    expect(uxPageflowForPageId("054")?.label).toBe("Export delivery");
    expect(uxPageflowForPageId("010")?.supportLane).toBe(true);

    expect(uxFlowStepsForPageId("019").map((step) => step.href)).toEqual([
      "/client/home",
      "/client/family-members",
      "/relationships",
      "/entities",
      "/documents/upload",
      "/documents/review-queue",
    ]);
    expect(uxFlowStepsForPageId("054").map((step) => step.href)).toEqual([
      "/export/new",
      "/export/client-package/scope",
      "/export/client-package/redaction",
      "/export/client-package/approval",
      "/export/client-package/download",
    ]);
  });

  test("keeps client-role navigation client-safe while naming locked internal workspaces", () => {
    const principalSession = createActorSession({ roleKey: "principal", tenantSlug: "bennett" });
    const groups = navigationGroupsForRole(principalSession.role);
    const visibleGroups = groups.filter((group) => group.items.length > 0).map((group) => group.label);
    const lockedGroups = groups.filter((group) => group.lockedReason).map((group) => group.label);

    expect(visibleGroups).toEqual(expect.arrayContaining(["Client Context", "Evidence Lifecycle", "Decision Record", "Client Visibility"]));
    expect(lockedGroups).toEqual(expect.arrayContaining(["Foundation", "Analyst Workbench", "Advisor Review", "Compliance Release", "Export & Delivery", "Operations", "Protected Work"]));

    for (const group of groups.filter((candidate) => candidate.lockedReason)) {
      expect(group.items).toHaveLength(0);
      if (group.label === "Protected Work") {
        expect(group.lockedReason).toContain("current delivery");
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

  test("workspace sections replace route-catalogue groups", async ({ page }) => {
    await page.goto("/admin/evidence-templates");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });

    await expect(primaryNavigation.getByRole("region", { name: "Foundation" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Client Context" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Evidence Lifecycle" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Analyst Workbench" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Advisor Review" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Compliance Release" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Decision Record" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Client Visibility" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Export & Delivery" })).toBeVisible();
    await expect(primaryNavigation.getByRole("region", { name: "Operations", exact: true })).toBeVisible();
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
    await page.goto("/documents/morgan-tax-residency/review");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });
    const activeLink = primaryNavigation.getByRole("link", { name: "Evidence Lifecycle" });

    await expect(activeLink).toHaveAttribute("aria-current", "page");
  });

  test("success and setup states stay folded into workspace parents", async ({ page }) => {
    await page.goto("/decisions/liquidity-governance/success");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(primaryNavigation.getByRole("link", { name: /Decision Record/ })).toHaveAttribute(
      "aria-current",
      "page"
    );

    await page.goto("/tenants/morgan/team");
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
    await expect(primaryNavigation.getByText("Protected lane")).toHaveCount(0);
    await expect(page.getByTestId("role-gated-workspace")).toHaveCount(0);
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
