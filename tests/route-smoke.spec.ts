import { expect, type Page, test } from "@playwright/test";

import { createDemoSession } from "../lib/demo-session";
import { dummyAuthSessionCookieName } from "../lib/dummy-auth-session";
import { navigationGroupsForRole, productiveNavigationPageIds, uxNavigationPolicyForPageId } from "../lib/navigation";
import {
  eligibleUxPageContracts,
  protectedUxPageContracts,
  uxPageContractIntegrity,
  uxPageContracts,
} from "../lib/ux-page-contract";
import { uxContentHierarchyForPageType } from "../lib/ux-content-hierarchy";
import { uxDensityForPageId, uxDensityTierContracts } from "../lib/ux-density";
import { uxComplexity005SupportPageIds } from "../lib/ux-support-density";
import { productGuidanceForRoute } from "../lib/product-guidance";
import {
  groupedImplementationScreenRoutes,
  routeImplementationAccessDecision,
  routeScopeForPageId,
  routeSmokeList,
  routeToSmokePath,
  routeWorksetIntegrity,
  routeWorksetPageIds,
  screenRoutes
} from "../lib/route-registry";
import { scfDoNotImplementRegister } from "../lib/scf-foundation";
import { uxFlowStepsForPageId } from "../lib/ux-route-policy";

const lockedRouteWorksetCounts = {
  MVP: 31,
  MVP_SUPPORT: 25,
  P1_AFTER_MVP: 5,
  REFERENCE_ONLY: 3,
  HOLD_PENDING_DECISION: 7
};

const mvpPageIds = new Set<string>(routeWorksetPageIds.MVP);
const mvpSupportPageIds = new Set<string>(routeWorksetPageIds.MVP_SUPPORT);
const p1PageIds = new Set<string>(routeWorksetPageIds.P1_AFTER_MVP);
const referencePageIds = new Set<string>(routeWorksetPageIds.REFERENCE_ONLY);
const holdPageIds = new Set<string>(routeWorksetPageIds.HOLD_PENDING_DECISION);

async function authenticateRouteSmokePage(page: Page) {
  await page.context().addCookies([
    {
      httpOnly: true,
      name: dummyAuthSessionCookieName,
      sameSite: "Lax",
      url: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3020",
      value: "av-session-playwright-authenticated",
    },
  ]);
}

test.describe("registered route smoke", () => {
  for (const route of routeSmokeList) {
    test(`${route.pageId} ${route.path}`, async ({ request }) => {
      const response = await request.get(route.path);
      expect(response.status(), `${route.pageId} ${route.path}`).toBe(200);

      const body = await response.text();
      expect(body).toContain("AlphaVest WealthOS");
    });
  }

  test("unknown catalogue route returns hardened not-found surface", async ({ request }) => {
    const response = await request.get("/not-a-catalogue-route");
    expect([200, 404]).toContain(response.status());

    const body = await response.text();
    expect(body).toContain("Route unavailable");
  });
});

test.describe("UX-NAV route policy navigation", () => {
  test("materializes UX route policy metadata for every registered route", () => {
    for (const route of screenRoutes) {
      const policy = uxNavigationPolicyForPageId(route.pageId);

      expect(policy.routePolicyLabels.length, `${route.pageId} policy labels`).toBeGreaterThan(0);
      expect(policy.routePolicyLabels).toContain("NO_ROUTE_RECLASSIFICATION");
      expect(policy.routePolicyLabels).toContain("NO_SCREEN_GENERATION");
    }
  });

  test("keeps productive navigation to MVP and MVP support routes only", () => {
    expect(productiveNavigationPageIds).not.toEqual(expect.arrayContaining(["052", "053", "059", "060", "068"]));
    expect(productiveNavigationPageIds).not.toEqual(expect.arrayContaining(["061", "062", "063"]));
    expect(productiveNavigationPageIds).not.toEqual(expect.arrayContaining(["064", "065", "066", "067", "069", "070", "071"]));

    for (const pageId of productiveNavigationPageIds) {
      expect(["MVP", "MVP_SUPPORT"]).toContain(routeScopeForPageId(pageId));
    }
  });

  test("uses journey-first workspace labels instead of a raw route-list model", () => {
    const admin = createDemoSession({ roleKey: "admin", tenantSlug: "bennett" });
    const labels = navigationGroupsForRole(admin.role).map((group) => group.label);

    expect(labels).toEqual([
      "Setup",
      "Client Workspace",
      "Evidence",
      "Advisory Workbench",
      "Approvals",
      "Compliance",
      "Governance",
      "Decisions",
      "Export",
    ]);
  });

  test("role-aware navigation filtering does not imply action or payload authority", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const groups = navigationGroupsForRole(principal.role);
    const linkedLabels = groups.filter((group) => group.items.length > 0).map((group) => group.label);
    const lockedLabels = groups.filter((group) => group.lockedReason).map((group) => group.label);

    expect(linkedLabels).toEqual(["Client Workspace", "Evidence", "Decisions"]);
    expect(lockedLabels).toEqual(["Setup", "Advisory Workbench", "Approvals", "Compliance", "Governance", "Export"]);
    for (const group of groups.filter((candidate) => candidate.lockedReason)) {
      expect(group.items).toHaveLength(0);
      expect(group.lockedReason).toContain("client-safe navigation view");
    }
  });

  test("preserves route policy page types from the matrix for hub and workbench navigation", () => {
    for (const pageId of ["007", "013", "015", "019", "020", "024", "031", "034", "043", "054"]) {
      expect(uxNavigationPolicyForPageId(pageId).pageType, `${pageId} should be a hub`).toBe("Hub");
    }

    expect(uxNavigationPolicyForPageId("038").pageType).toBe("Workbench");
    expect(uxNavigationPolicyForPageId("048").pageType).toBe("Workbench");
  });

  test("journey rails keep later gates blocked until prerequisites pass", () => {
    const advisorySteps = uxFlowStepsForPageId("038");
    expect(advisorySteps.map((step) => step.status)).toEqual([
      "complete",
      "complete",
      "complete",
      "current",
      "upcoming",
      "blocked",
      "blocked",
    ]);
    expect(advisorySteps.filter((step) => step.status === "complete")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ disabledReason: expect.stringContaining("does not unlock this gate") }),
      ]),
    );
    expect(advisorySteps.filter((step) => step.status === "blocked")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ disabledReason: expect.stringContaining("Future gate stays blocked") }),
      ]),
    );
  });

  test("renders product context, current gate and one primary next step above the desktop fold", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await authenticateRouteSmokePage(page);
    await page.goto("/workbench");

    const guidance = page.getByTestId("product-guidance").first();
    await expect(guidance.getByRole("heading", { name: "Workbench" })).toBeVisible();
    await expect(guidance.getByTestId("ux-nav-gate-guidance")).toBeVisible();
    await expect(guidance.getByTestId("ux-nav-flow-rail")).toBeVisible();
    await expect(guidance.getByTestId("ux-nav-primary-next-step")).toHaveCount(1);
    await expect(page.getByTestId("ux-nav-route-context").first()).toContainText("Workbench");
    await expect(page.getByText("034 · Workbench")).toHaveCount(0);
  });
});

test.describe("UX-PAGE page type contract", () => {
  test("materializes page type and page job for every registered route", () => {
    expect(uxPageContractIntegrity.totalCount).toBe(71);
    expect(uxPageContractIntegrity.missingPageIds).toEqual([]);
    expect(uxPageContractIntegrity.duplicatePageIds).toEqual([]);

    for (const contract of uxPageContracts) {
      expect(contract.pageType, `${contract.pageId} page type`).toBeTruthy();
      expect(contract.pageJob, `${contract.pageId} page job`).toContain(" ");
      expect(contract.allowedTreatment, `${contract.pageId} allowed treatment`).toContain(" ");
      expect(contract.forbiddenTreatment, `${contract.pageId} forbidden treatment`).toContain("No");
      expect(contract.routePolicyLabels, `${contract.pageId} policy labels`).toEqual(
        expect.arrayContaining(["NO_ROUTE_RECLASSIFICATION", "NO_SCREEN_GENERATION"]),
      );
    }
  });

  test("applies productive contracts only to MVP and MVP support routes", () => {
    expect(uxPageContractIntegrity.eligibleCount).toBe(56);

    for (const contract of eligibleUxPageContracts) {
      expect(["MVP", "MVP_SUPPORT"], `${contract.pageId} scope`).toContain(contract.routeScope);
      expect(["P1", "Reference", "Hold"], `${contract.pageId} page type`).not.toContain(contract.pageType);
      expect(contract.productiveUxEligible, `${contract.pageId} productive eligibility`).toBe(true);
      expect(contract.primaryCtaRule, `${contract.pageId} CTA rule`).not.toContain("No productive MVP CTA");
    }
  });

  test("keeps P1, reference and hold routes out of productive page type work", () => {
    expect(uxPageContractIntegrity.protectedCount).toBe(15);

    for (const contract of protectedUxPageContracts) {
      expect(["P1_AFTER_MVP", "REFERENCE_ONLY", "HOLD_PENDING_DECISION"], `${contract.pageId} protected scope`).toContain(
        contract.routeScope,
      );
      expect(contract.productiveUxEligible, `${contract.pageId} productive eligibility`).toBe(false);
      expect(contract.allowedTreatment, `${contract.pageId} allowed treatment`).toMatch(/Deferred|Reference|Hold/);
      expect(contract.forbiddenTreatment, `${contract.pageId} forbidden treatment`).toMatch(/No MVP|No productive/);
    }
  });
});

test.describe("UX-PAGE workbench structure", () => {
  const uxPage002Routes = [
    "/documents",
    "/documents/upload",
    "/documents/extraction-review",
    "/documents/verification-pending",
    "/signals",
    "/advisor-approval",
    "/compliance",
    "/evidence",
    "/governance/users",
    "/governance/roles",
    "/governance/access-requests",
    "/governance/audit-history",
    "/export/new",
    "/export/demo/scope",
    "/export/demo/redaction",
  ];

  for (const path of uxPage002Routes) {
    test(`${path} renders queue, selected context and action rail above page content`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1100 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      const guidance = page.getByTestId("product-guidance").first();
      const triad = guidance.getByTestId("ux-page-workbench-triad");
      await expect(triad).toBeVisible();
      await expect(triad.getByTestId("ux-page-queue")).toHaveCount(1);
      await expect(triad.getByTestId("ux-page-selected-context")).toHaveCount(1);
      await expect(triad.getByTestId("ux-page-action-rail")).toHaveCount(1);
      await expect(triad.getByText("Controls stay blocked until the required gate passes.")).toBeVisible();
    });
  }
});

test.describe("UX-PAGE detail standard", () => {
  const uxPage003Routes = [
    "/workbench/triggers/demo",
    "/advisor-approval/demo",
    "/compliance/demo/review",
    "/compliance/demo/release",
    "/compliance/demo/block",
    "/decisions/demo",
    "/decisions/demo/success",
    "/evidence/demo",
    "/export/demo/preview",
    "/export/demo/download",
  ];

  for (const path of uxPage003Routes) {
    test(`${path} renders object header, evidence timeline and gated action rail`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1100 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      const detailStandard = page.getByTestId("ux-page-detail-standard").first();
      await expect(detailStandard).toBeVisible();
      await expect(detailStandard.getByTestId("ux-page-detail-object-header")).toHaveCount(1);
      await expect(detailStandard.getByTestId("ux-page-detail-key-facts")).toHaveCount(1);
      await expect(detailStandard.getByTestId("ux-page-detail-evidence-timeline")).toHaveCount(1);
      await expect(detailStandard.getByTestId("ux-page-detail-gated-action-rail")).toHaveCount(1);
    });
  }
});

test.describe("UX-COMPLEXITY priority hierarchy", () => {
  const uxComplexity001Routes = [
    "/actions",
    "/signals",
    "/compliance/demo/review",
    "/compliance/demo/audit",
    "/export/demo/redaction",
  ];

  for (const path of uxComplexity001Routes) {
    test(`${path} renders summary strip, priority queue and action rail`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1100 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      const panel = page.getByTestId("ux-complexity-priority-panel").first();
      await expect(panel).toBeVisible();
      await expect(panel.getByTestId("ux-complexity-summary-strip")).toHaveCount(1);
      await expect(panel.getByTestId("ux-complexity-priority-queue")).toHaveCount(1);
      await expect(panel.getByTestId("ux-complexity-action-rail")).toHaveCount(1);
    });
  }
});

test.describe("UX-COMPLEXITY secondary context drawers and tabs", () => {
  const uxComplexity002Routes = [
    "/wealth-map?state=drawer",
    "/evidence?state=drawer",
    "/governance/users?state=drawer",
    "/governance/access-requests?state=drawer",
    "/governance/audit-history?state=drawer",
  ];

  for (const path of uxComplexity002Routes) {
    test(`${path} keeps secondary context in tabs with visible safety notes`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1100 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      const tabs = page.getByTestId("ux-complexity-secondary-tabs").first();
      await expect(tabs).toBeVisible();
      await expect(tabs.getByTestId("ux-complexity-secondary-tablist")).toBeVisible();
      expect(await tabs.getByTestId("ux-complexity-secondary-tab").count()).toBeGreaterThan(1);
      await expect(tabs.getByTestId("ux-complexity-secondary-safety-note")).toBeVisible();
      await expect(tabs.getByTestId("ux-complexity-secondary-active-panel")).toBeVisible();
    });
  }
});

test.describe("UX-COMPLEXITY content priority hierarchy", () => {
  test("defines Must-see, Secondary and Tertiary content for every page type", () => {
    for (const contract of uxPageContracts) {
      const hierarchy = uxContentHierarchyForPageType(contract.pageType);

      expect(hierarchy.mustSee.length, `${contract.pageId} must-see`).toBeGreaterThan(0);
      expect(hierarchy.secondary.length, `${contract.pageId} secondary`).toBeGreaterThan(0);
      expect(hierarchy.tertiary.length, `${contract.pageId} tertiary`).toBeGreaterThan(0);
    }
  });

  const representativeRoutes = [
    "/wealth-map",
    "/actions",
    "/compliance/demo/review",
    "/evidence?state=drawer",
  ];

  for (const path of representativeRoutes) {
    test(`${path} exposes visible priority tiers without surfacing handbook copy`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1100 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      await expect(page.locator('[data-ux-content-tier="must-see"]').first()).toBeVisible();
      await expect(page.locator('[data-ux-content-tier="secondary"]').first()).toBeVisible();
      await expect(page.getByText(/gate-completion proof|visual proof|Workflow step|complexity reduction/i)).toHaveCount(0);
    });
  }
});

test.describe("UX-COMPLEXITY CTA clusters", () => {
  const ctaRoutes = [
    "/actions",
    "/actions?state=drawer",
    "/evidence/demo",
    "/governance/access-requests?state=drawer",
    "/export/demo/redaction",
  ];

  for (const path of ctaRoutes) {
    test(`${path} exposes one primary CTA with contextual secondary actions`, async ({ page }) => {
      await page.setViewportSize({ height: 900, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      const cluster = page.getByTestId("ux-complexity-cta-cluster").first();
      await expect(cluster).toBeVisible();
      await expect(cluster.locator('[data-ux-primary-cta="true"]')).toHaveCount(1);
      await expect(cluster.locator('[data-ux-secondary-cta="true"]').first()).toBeVisible();
      await expect(cluster.getByTestId("ux-complexity-cta-blocked-reason")).toBeVisible();
    });
  }
});

test.describe("UX-COMPLEXITY support density", () => {
  const supportDensityPaths = screenRoutes
    .filter((route) => uxComplexity005SupportPageIds.includes(route.pageId as (typeof uxComplexity005SupportPageIds)[number]))
    .map((route) => routeToSmokePath(route.route));

  for (const path of supportDensityPaths) {
    test(`${path} exposes page job, status and meaningful next step without safety hiding`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width: 1440 });
      if (path !== "/login") {
        await authenticateRouteSmokePage(page);
      }
      await page.goto(path);

      const strip = page.getByTestId("ux-complexity-support-density").first();
      await expect(strip).toBeVisible();
      await expect(strip.getByTestId("ux-complexity-support-job")).toBeVisible();
      await expect(strip.getByTestId("ux-complexity-support-status")).toBeVisible();
      await expect(strip.getByTestId("ux-complexity-support-next-step")).toBeVisible();
      await expect(strip.getByTestId("ux-complexity-support-safety")).toContainText("required gate passes");
    });
  }
});

test.describe("UX-DENSITY tier contract", () => {
  test("defines D1-D4 density layout patterns", () => {
    expect(Object.keys(uxDensityTierContracts).sort()).toEqual(["D1", "D2", "D3", "D4"]);

    for (const contract of Object.values(uxDensityTierContracts)) {
      expect(contract.pattern).toMatch(/^[a-z-]+$/);
      expect(contract.description.length).toBeGreaterThan(20);
      expect(contract.shellClassName.length).toBeGreaterThan(0);
    }
  });

  const representatives = [
    { path: "/portal", pattern: "calm-executive", tier: "D1" },
    { path: "/actions", pattern: "productive-workbench", tier: "D2" },
    { path: "/export/demo/redaction", pattern: "dense-operations", tier: "D3" },
    { path: "/evidence/demo", pattern: "focused-detail", tier: "D4" },
  ];

  for (const representative of representatives) {
    test(`${representative.path} exposes ${representative.tier} density metadata`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(representative.path);

      const densitySurface = page.locator(`[data-ux-density-tier="${representative.tier}"]`).first();
      await expect(densitySurface).toBeVisible();
      await expect(densitySurface).toHaveAttribute("data-ux-density-pattern", representative.pattern);
    });
  }
});

test.describe("UX-DENSITY calm executive client views", () => {
  for (const path of ["/portal", "/mobile"]) {
    test(`${path} applies D1 calm executive density without client leakage`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      const calmSurface = page.locator('[data-ux-d1-calm-executive="true"]');
      await expect(calmSurface).toBeVisible();
      await expect(calmSurface).toHaveAttribute("data-ux-density-tier", "D1");
      await expect(calmSurface).toHaveAttribute("data-ux-density-pattern", "calm-executive");

      await expect(page.getByTestId("ux-d1-state-card")).toHaveCount(3);
      await expect(page.getByTestId("ux-d1-next-step-panel")).toHaveCount(1);
      await expect(page.getByTestId("ux-d1-source-summary")).toBeVisible();
      await expect(page.getByTestId("ux-hub-queue")).toHaveCount(0);

      await expect(calmSurface).toContainText(/released|Released/);
      await expect(calmSurface).toContainText(/hidden|Hidden|internal/i);
      await expect(calmSurface).toContainText(/not expose|must not leak|hidden/i);
    });
  }
});

test.describe("UX-DENSITY productive workbench routes", () => {
  const d2WorkbenchRoutes = [
    "/documents",
    "/documents/upload",
    "/documents/extraction-review",
    "/documents/verification-pending",
    "/signals",
    "/workbench",
    "/advisor-approval",
    "/compliance",
    "/evidence",
  ];

  for (const path of d2WorkbenchRoutes) {
    test(`${path} applies D2 queue context action rail density`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      const d2Surface = page.locator('[data-ux-d2-productive-workbench="true"]').first();
      await expect(d2Surface).toBeVisible();
      await expect(d2Surface).toHaveAttribute("data-ux-density-tier", "D2");
      await expect(d2Surface).toHaveAttribute("data-ux-density-pattern", "productive-workbench");

      const triad = page.getByTestId("ux-page-workbench-triad").first();
      await expect(triad).toBeVisible();
      await expect(triad.getByTestId("ux-page-queue")).toBeVisible();
      await expect(triad.getByTestId("ux-page-selected-context")).toBeVisible();
      await expect(triad.getByTestId("ux-page-action-rail")).toBeVisible();
      await expect(triad.getByTestId("ux-page-action-rail")).toContainText(/gate|authority|selected|visible status|release/i);
    });
  }

  test("keeps D4 detail routes in the related range out of D2 workbench coercion", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);

    expect(uxDensityForPageId("039").tier).toBe("D4");
    expect(uxDensityForPageId("047").tier).toBe("D4");

    for (const path of ["/compliance/demo/review", "/evidence/demo"]) {
      await page.goto(path);
      await expect(page.locator('[data-ux-d2-productive-workbench="true"]')).toHaveCount(0);
    }
  });
});

test.describe("UX-DENSITY dense operations routes", () => {
  const d3OperationsRoutes = [
    { pageId: "042", path: "/compliance/demo/audit" },
    { pageId: "048", path: "/governance/users" },
    { pageId: "049", path: "/governance/roles" },
    { pageId: "050", path: "/governance/access-requests" },
    { pageId: "051", path: "/governance/audit-history" },
    { pageId: "055", path: "/export/demo/scope" },
    { pageId: "056", path: "/export/demo/redaction" },
  ];

  test("keeps export-new as D2 hub/wizard rather than D3 operations table", async ({ page }) => {
    expect(uxDensityForPageId("054").tier).toBe("D2");

    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/export/new");

    await expect(page.getByTestId("ux-d3-dense-operations")).toHaveCount(0);
    await expect(page.getByTestId("ux-hub-page")).toBeVisible();
  });

  for (const route of d3OperationsRoutes) {
    test(`${route.path} applies D3 table-first operations density`, async ({ page }) => {
      expect(uxDensityForPageId(route.pageId).tier).toBe("D3");

      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(route.path);

      const operations = page.getByTestId("ux-d3-dense-operations").first();
      await expect(operations).toBeVisible();
      await expect(operations).toHaveAttribute("data-ux-density-tier", "D3");
      await expect(operations).toHaveAttribute("data-ux-density-pattern", "dense-operations");
      await expect(operations.getByTestId("ux-d3-filter-sort-controls")).toBeVisible();
      await expect(operations.getByTestId("ux-data-table").first()).toBeVisible();
      await expect(operations.getByTestId("ux-data-table-sort").first()).toBeVisible();
      await expect(operations.getByTestId("ux-data-table-row-action").first()).toBeVisible();
      await expect(operations).toContainText(/blocked|gate|approval|audit|payload|permission|redaction|release/i);
      await expect(operations).not.toContainText(/complexity reduction|gate-completion proof|Workflow step|visual proof/i);
    });
  }
});

test.describe("UX-DENSITY focused detail routes", () => {
  const d4DetailRoutes = [
    { pageId: "035", path: "/workbench/triggers/demo" },
    { pageId: "037", path: "/advisor-approval/demo" },
    { pageId: "039", path: "/compliance/demo/review" },
    { pageId: "044", path: "/decisions/demo" },
    { pageId: "047", path: "/evidence/demo" },
    { pageId: "057", path: "/export/demo/preview" },
    { pageId: "058", path: "/export/demo/download" },
  ];

  for (const route of d4DetailRoutes) {
    test(`${route.path} applies D4 focused detail density`, async ({ page }) => {
      expect(uxDensityForPageId(route.pageId).tier).toBe("D4");

      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(route.path);

      const detail = page.getByTestId("ux-page-detail-standard").first();
      await expect(detail).toBeVisible();
      await expect(detail).toHaveAttribute("data-ux-density-tier", "D4");
      await expect(detail).toHaveAttribute("data-ux-density-pattern", "focused-detail");
      await expect(detail).toHaveAttribute("data-ux-d4-focused-detail", "true");
      await expect(detail.getByTestId("ux-d4-focused-status-strip")).toBeVisible();
      await expect(detail.getByTestId("ux-page-detail-object-header")).toBeVisible();
      await expect(detail.getByTestId("ux-page-detail-key-facts")).toBeVisible();
      await expect(detail.getByTestId("ux-page-detail-evidence-timeline")).toBeVisible();
      await expect(detail.getByTestId("ux-page-detail-gated-action-rail")).toBeVisible();
      await expect(detail).toContainText(/Object|Status|Next action|Gate/i);
      await expect(detail).toContainText(/client|compliance|evidence|audit|approval|release|share|download|gate/i);
      await expect(detail).not.toContainText(/D4|Focused Detail|Workflow step|route policy|gate-completion proof|visual proof|complexity reduction/i);
      await expect(page.locator('[data-ux-d2-productive-workbench="true"]')).toHaveCount(0);
      await expect(page.getByTestId("ux-d3-dense-operations")).toHaveCount(0);
    });
  }
});

test.describe("UX-DENSITY above-the-fold route job", () => {
  const authAndOnboardingSupportPageIds = new Set(["001", "002", "003", "004", "005", "006"]);
  const aboveFoldRoutes = routeSmokeList.filter((route) => {
    const scope = routeScopeForPageId(route.pageId);
    return (scope === "MVP" || scope === "MVP_SUPPORT") && !authAndOnboardingSupportPageIds.has(route.pageId);
  });

  for (const route of aboveFoldRoutes) {
    test(`${route.pageId} ${route.path} shows job, status, gate and primary next step above the fold`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(route.path);

      const guidance = page.getByTestId("product-guidance").first();
      await expect(guidance).toBeVisible();
      await expect(guidance).toHaveAttribute("data-ux-density-above-fold", "true");
      await expect(guidance.getByTestId("ux-density-page-job")).toBeVisible();
      await expect(guidance.getByTestId("ux-density-status")).toBeVisible();
      await expect(guidance.getByTestId("ux-nav-gate-guidance")).toBeVisible();
      await expect(guidance.getByTestId("ux-nav-primary-next-step")).toHaveCount(1);
      await expect(guidance).not.toContainText(/Workflow step|route policy|gate-completion proof|visual proof|complexity reduction/i);

      for (const locator of [
        guidance.getByTestId("ux-density-page-job"),
        guidance.getByTestId("ux-density-status"),
        guidance.getByTestId("ux-nav-gate-guidance"),
        guidance.getByTestId("ux-nav-primary-next-step"),
      ]) {
        const box = await locator.first().boundingBox();
        expect(box?.y, `${route.pageId} above-fold contract`).toBeLessThan(420);
      }
    });
  }
});

test.describe("UX-CTA one-primary page-state pattern", () => {
  const authAndOnboardingSupportPageIds = new Set(["001", "002", "003", "004", "005", "006"]);
  const eligibleGuidanceRoutes = screenRoutes.filter((route) => {
    const scope = routeScopeForPageId(route.pageId);
    return (scope === "MVP" || scope === "MVP_SUPPORT") && !authAndOnboardingSupportPageIds.has(route.pageId);
  });

  test("maps eligible routes to exactly one guarded primary CTA and protected routes to locked state", () => {
    for (const route of eligibleGuidanceRoutes) {
      const guidance = productGuidanceForRoute(route);

      expect(guidance.ctaState.state, `${route.pageId} CTA state`).toBe("guarded");
      expect(guidance.ctaState.primaryAction, `${route.pageId} primary action`).toBeDefined();
      expect(guidance.ctaState.blockedReason, `${route.pageId} blocked reason`).toMatch(
        /blocked|bypass|client-safe|does not|internal|separate|sufficiency|release|gates/i,
      );
      expect(guidance.ctaState.primaryAction?.label, `${route.pageId} primary label`).not.toMatch(
        /approve export|download ready|evidence sufficient|release to client|admin override/i,
      );
    }

    for (const route of screenRoutes.filter((candidate) => !eligibleGuidanceRoutes.includes(candidate))) {
      const scope = routeScopeForPageId(route.pageId);
      if (scope === "P1_AFTER_MVP" || scope === "REFERENCE_ONLY" || scope === "HOLD_PENDING_DECISION") {
        const guidance = productGuidanceForRoute(route);
        expect(guidance.ctaState.state, `${route.pageId} locked CTA state`).toBe("locked");
        expect(guidance.ctaState.primaryAction, `${route.pageId} no productive primary`).toBeUndefined();
      }
    }
  });

  const priorityCtaRoutes = [
    "/documents/upload",
    "/workbench",
    "/advisor-approval",
    "/compliance",
    "/governance/users",
    "/export/demo/preview",
  ];

  for (const path of priorityCtaRoutes) {
    test(`${path} renders one primary page CTA with blocked reason and recovery`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      const guidance = page.getByTestId("product-guidance").first();
      const actions = guidance.getByTestId("ux-nav-next-actions");
      await expect(actions).toBeVisible();
      await expect(actions).toHaveAttribute("data-ux-cta-state", "guarded");
      await expect(actions.locator('[data-ux-primary-cta="true"]')).toHaveCount(1);
      await expect(actions.locator('[data-ux-secondary-cta="true"]').first()).toBeVisible();
      await expect(actions.getByTestId("ux-cta-blocked-reason")).toBeVisible();
      await expect(actions.getByTestId("ux-cta-recovery-action")).toBeVisible();
      await expect(actions).not.toContainText(/approve export|download ready|evidence sufficient|release to client|admin override/i);
      await expect(guidance).not.toContainText(/route policy|Workflow step|gate-completion proof|visual proof|complexity reduction/i);
    });
  }
});

test.describe("UX-CTA MJ-001 setup-to-release chain", () => {
  const routeByPageId = new Map<string, (typeof screenRoutes)[number]>(screenRoutes.map((route) => [route.pageId, route]));
  const expectedPrimaryHrefs: Record<string, string> = {
    "013": "/tenants/new",
    "014": "/tenants/demo/setup",
    "015": "/tenants/demo/users",
    "018": "/documents",
    "027": "/documents/upload",
    "028": "/documents/extraction-review",
    "029": "/documents/verification-pending",
    "030": "/signals",
    "033": "/workbench",
    "034": "/advisor-approval",
    "035": "/advisor-approval",
    "036": "/advisor-approval/demo",
    "037": "/compliance",
    "038": "/compliance/demo/review",
    "039": "/compliance/demo/release",
    "040": "/decisions",
    "041": "/documents/upload",
    "042": "/decisions",
    "043": "/decisions/demo",
    "044": "/decisions/demo/success",
    "045": "/portal",
  };

  test("maps MJ-001 primary CTAs from setup through released client-safe endpoint", () => {
    for (const [pageId, href] of Object.entries(expectedPrimaryHrefs)) {
      const route = routeByPageId.get(pageId);
      expect(route, `${pageId} registered route`).toBeDefined();
      const guidance = productGuidanceForRoute(route!);

      expect(guidance.ctaState.primaryAction?.href, `${pageId} primary href`).toBe(href);
      expect(guidance.ctaState.state, `${pageId} guarded state`).toBe("guarded");
      expect(guidance.ctaState.blockedReason, `${pageId} blocked reason`).toMatch(
        /blocked|bypass|client-safe|does not|internal|separate|sufficiency|release|gates|audit|authority/i,
      );
      expect(guidance.ctaState.primaryAction?.label, `${pageId} primary label`).not.toMatch(
        /evidence sufficient|client accepted|release complete|download ready|admin override/i,
      );
    }
  });

  const mj001ProofRoutes = [
    "/admin/tenants",
    "/tenants/new",
    "/documents/upload",
    "/workbench/triggers/demo",
    "/compliance/demo/release",
    "/decisions/demo/success",
  ];

  for (const path of mj001ProofRoutes) {
    test(`${path} renders the MJ-001 guarded CTA state`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      const guidance = page.getByTestId("product-guidance").first();
      const actions = guidance.getByTestId("ux-nav-next-actions");
      await expect(actions).toBeVisible();
      await expect(actions).toHaveAttribute("data-ux-cta-state", "guarded");
      await expect(actions.locator('[data-ux-primary-cta="true"]')).toHaveCount(1);
      await expect(actions.getByTestId("ux-cta-blocked-reason")).toBeVisible();
      await expect(actions).not.toContainText(/evidence sufficient|client accepted|release complete|download ready|admin override/i);
      await expect(guidance).not.toContainText(/route policy|Workflow step|gate-completion proof|visual proof|complexity reduction/i);
    });
  }
});

test.describe("UX-CTA evidence upload and review chain", () => {
  const routeByPageId = new Map<string, (typeof screenRoutes)[number]>(screenRoutes.map((route) => [route.pageId, route]));
  const evidencePrimaryHrefs: Record<string, string> = {
    "027": "/documents/upload",
    "028": "/documents/extraction-review",
    "029": "/documents/verification-pending",
    "030": "/signals",
    "038": "/compliance/demo/review",
    "039": "/compliance/demo/release",
    "040": "/decisions",
    "041": "/documents/upload",
    "047": "/evidence/demo",
  };

  test("keeps upload and review CTAs separate from evidence sufficiency", () => {
    for (const [pageId, href] of Object.entries(evidencePrimaryHrefs)) {
      const route = routeByPageId.get(pageId);
      expect(route, `${pageId} registered route`).toBeDefined();
      const guidance = productGuidanceForRoute(route!);

      expect(guidance.ctaState.primaryAction?.href, `${pageId} evidence primary href`).toBe(href);
      expect(guidance.ctaState.blockedReason, `${pageId} evidence blocked reason`).toMatch(
        /sufficiency|release|client visibility|separate|blocked|review|gates/i,
      );
      expect(guidance.ctaState.primaryAction?.label, `${pageId} evidence primary label`).not.toMatch(
        /evidence sufficient|sufficiency accepted|release ready|client visible|export ready/i,
      );
    }
  });

  const evidenceProofRoutes = [
    "/documents",
    "/documents/upload",
    "/documents/extraction-review",
    "/documents/verification-pending",
    "/compliance/demo/block",
    "/evidence/demo",
  ];

  for (const path of evidenceProofRoutes) {
    test(`${path} renders evidence CTA without sufficiency overclaim`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      const guidance = page.getByTestId("product-guidance").first();
      const actions = guidance.getByTestId("ux-nav-next-actions");
      await expect(actions).toBeVisible();
      await expect(actions.locator('[data-ux-primary-cta="true"]')).toHaveCount(1);
      await expect(actions.getByTestId("ux-cta-blocked-reason")).toBeVisible();
      await expect(actions).not.toContainText(/evidence sufficient|sufficiency accepted|release ready|client visible|export ready/i);
      await expect(page.getByText(/Evidence sufficiency complete|Release ready from upload|Client visibility unlocked/i)).toHaveCount(0);
    });
  }
});

test.describe("UX-CTA AI draft internal-only chain", () => {
  test("advisor detail exposes reject/rebuild as internal-only without client release", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/advisor-approval/demo");

    await expect(page.getByRole("heading", { name: "Internal Draft Recommendation" })).toBeVisible();
    await expect(page.getByText("Internal draft only. Rejection or rebuild keeps client visibility blocked until advisor and compliance gates pass.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Approve for compliance review" })).toBeVisible();
    await expect(page.getByTestId("ux-cta-ai-rebuild")).toBeVisible();
    await expect(page.getByRole("button", { name: "Request evidence for rebuild" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reject unsupported draft claim" })).toBeVisible();
    await expect(page.getByText(/release to client|client visibility unlocked|client-ready draft|approved for client/i)).toHaveCount(0);
    await expect(page.getByText("82% Success")).toHaveCount(0);
  });
});

test.describe("UX-CTA governance admin non-bypass chain", () => {
  const governancePageIds = ["009", "048", "049", "050", "051"] as const;

  test("maps admin and governance routes to scoped non-bypass CTA states", () => {
    for (const pageId of governancePageIds) {
      const route = screenRoutes.find((candidate) => candidate.pageId === pageId);
      expect(route, `${pageId} route`).toBeDefined();

      const guidance = productGuidanceForRoute(route!);
      expect(guidance.ctaState.state, `${pageId} CTA state`).toBe("guarded");
      expect(guidance.ctaState.primaryAction?.label, `${pageId} primary label`).not.toMatch(
        /admin override|force release|release to client|evidence sufficient|approve export|download ready|suppress audit/i,
      );
      expect(`${guidance.gateHint} ${guidance.ctaState.blockedReason}`, `${pageId} safety copy`).toMatch(
        /cannot|does not|separate|scoped|audit|bypass/i,
      );
    }
  });

  const governanceScreens = [
    { path: "/admin/roles?state=permission", required: "Confirm scoped permission change" },
    { path: "/governance/users?state=invite", required: "Send scoped invitation" },
    { path: "/governance/roles?state=confirm", required: "Confirm scoped role change" },
    { path: "/governance/access-requests?state=approval", required: "Approve access request" },
    { path: "/governance/audit-history?state=drawer", required: "Export audit events" },
  ];

  for (const { path, required } of governanceScreens) {
    test(`${path} keeps admin authority bounded`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      await expect(page.getByText(required).first()).toBeVisible();
      await expect(page.locator("body")).toContainText(/cannot|does not|separate|scoped|controlled|audit/i);
      await expect(page.locator("body")).not.toContainText(
        /admin override|release to client|release ready|client visibility unlocked|download ready|audit suppressed/i,
      );
    });
  }
});

test.describe("UX-CTA export lifecycle separation", () => {
  const routeByPageId = new Map<string, (typeof screenRoutes)[number]>(screenRoutes.map((route) => [route.pageId, route]));

  test("maps export routes to separate lifecycle CTA states", () => {
    const expectedPrimaryLabels: Record<string, RegExp> = {
      "054": /Select export scope/,
      "055": /Review redaction/,
      "056": /Inspect preview/,
      "057": /Open delivery controls after approval/,
      "058": /Review approval context/,
    };

    for (const [pageId, labelPattern] of Object.entries(expectedPrimaryLabels)) {
      const route = routeByPageId.get(pageId);
      expect(route, `${pageId} route`).toBeDefined();
      const guidance = productGuidanceForRoute(route!);

      expect(guidance.ctaState.state, `${pageId} CTA state`).toBe("guarded");
      expect(guidance.ctaState.primaryAction?.label, `${pageId} primary label`).toMatch(labelPattern);
      expect(guidance.gateHint, `${pageId} gate hint`).toMatch(/scope|redaction|preview|approval|download|share|separate/i);
      expect(guidance.ctaState.primaryAction?.label, `${pageId} no collapsed delivery label`).not.toMatch(
        /download ready|share ready|approved and downloaded|preview approved/i,
      );
    }
  });

  const exportScreens = [
    { path: "/export/new", required: "Start export scope before redaction, preview, approval or delivery." },
    { path: "/export/demo/scope", required: "Scope selection is not preview, approval, download or share" },
    { path: "/export/demo/redaction", required: "Approval blocked until preview" },
    { path: "/export/demo/preview?state=approval", required: "Generation, download and share remain separate controlled steps." },
    { path: "/export/demo/download", required: "Share after download" },
  ];

  for (const { path, required } of exportScreens) {
    test(`${path} keeps export lifecycle steps separate`, async ({ page }) => {
      await page.setViewportSize({ height: 1000, width: 1440 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      await expect(page.getByText(required).first()).toBeVisible();
      await expect(page.locator("body")).toContainText(/scope|redaction|preview|approval|download|share|separate/i);
      await expect(page.locator("body")).not.toContainText(
        /download ready|share ready|client accepted|client visibility unlocked|preview approved/i,
      );
    });
  }

  test("download page blocks share until download is recorded", async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticateRouteSmokePage(page);
    await page.goto("/export/demo/download");

    await expect(page.getByRole("button", { name: "Download package" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Share after download" })).toBeDisabled();
    await expect(page.getByText("Secure share is blocked until the download event is recorded and audited.")).toBeVisible();
  });
});

test.describe("locked route workset preservation", () => {
  test("all registered routes are classified exactly once", () => {
    expect(routeWorksetIntegrity.counts).toEqual(lockedRouteWorksetCounts);
    expect(routeWorksetIntegrity.missingPageIds).toEqual([]);
    expect(routeWorksetIntegrity.unknownPageIds).toEqual([]);
    expect(routeWorksetIntegrity.duplicatePageIds).toEqual([]);
    expect(routeSmokeList).toHaveLength(71);
  });

  test("P1, reference and held routes stay outside implementation navigation", () => {
    const implementationPageIds = new Set(
      groupedImplementationScreenRoutes.flatMap((group) => group.routes.map((route) => route.pageId))
    );

    const doNotImplementPageIds = [
      ...routeWorksetPageIds.P1_AFTER_MVP,
      ...routeWorksetPageIds.REFERENCE_ONLY,
      ...routeWorksetPageIds.HOLD_PENDING_DECISION
    ];

    for (const pageId of doNotImplementPageIds) {
      expect(implementationPageIds.has(pageId), `${pageId} should not be implementation navigation`).toBe(false);
    }
  });

  test("route access decisions preserve SCF provenance without elevating held worksets", () => {
    for (const route of screenRoutes) {
      const decision = routeImplementationAccessDecision(route);

      if (mvpPageIds.has(route.pageId) || mvpSupportPageIds.has(route.pageId)) {
        expect(decision.accessMode).toBe("FIRST_BUILD");
        expect(decision.exclusionReason).toBeUndefined();
        expect(decision.implementationShellAccessible, `${route.pageId} implementation access`).toBe(true);
        expect(decision.safetyBoundary).toBe("FULL_FIRST_BUILD_SCOPE");
      } else {
        expect(decision.accessMode).toBe("REGISTERED_ONLY");
        expect(decision.implementationShellAccessible, `${route.pageId} implementation access`).toBe(false);
        expect(decision.safetyBoundary).toBe("SCF_DO_NOT_IMPLEMENT_REGISTER");
        if (p1PageIds.has(route.pageId)) {
          expect(decision.exclusionReason).toBe("P1_DEFERRED");
        } else if (referencePageIds.has(route.pageId)) {
          expect(decision.exclusionReason).toBe("REFERENCE_ONLY_NO_PRODUCT_TASK");
        } else if (holdPageIds.has(route.pageId)) {
          expect(decision.exclusionReason).toBe("HOLD_PENDING_SCOPE_UNLOCK");
        }
      }
    }
  });

  test("SCF Do-Not-Implement register covers every non-MVP workset route", () => {
    const registeredDniPageIds = new Set(scfDoNotImplementRegister.flatMap((entry) => entry.pageIds));
    const expectedPageIds = [
      ...routeWorksetPageIds.P1_AFTER_MVP,
      ...routeWorksetPageIds.REFERENCE_ONLY,
      ...routeWorksetPageIds.HOLD_PENDING_DECISION
    ];

    for (const pageId of expectedPageIds) {
      expect(registeredDniPageIds.has(pageId), `${pageId} should be in the SCF DNI register`).toBe(true);
    }
  });

  test("deferred, reference and held routes remain registered smoke routes only", () => {
    const routePathsByPageId = new Map(screenRoutes.map((route) => [route.pageId, routeToSmokePath(route.route)]));
    const smokePathsByPageId = new Map(routeSmokeList.map((route) => [route.pageId, route.path]));

    const excludedPageIds = [
      ...routeWorksetPageIds.P1_AFTER_MVP,
      ...routeWorksetPageIds.REFERENCE_ONLY,
      ...routeWorksetPageIds.HOLD_PENDING_DECISION
    ];

    for (const pageId of excludedPageIds) {
      expect(smokePathsByPageId.get(pageId), `${pageId} smoke path should remain registered`).toBe(
        routePathsByPageId.get(pageId)
      );
    }
  });

  test("deferred, reference and held routes do not receive productive UX-PAGE surfaces", async ({ page }) => {
    const p1ProtectedPageIds = new Set<string>(routeWorksetPageIds.P1_AFTER_MVP);
    const referenceProtectedPageIds = new Set<string>(routeWorksetPageIds.REFERENCE_ONLY);
    const holdProtectedPageIds = new Set<string>(routeWorksetPageIds.HOLD_PENDING_DECISION);
    const excludedRoutes = routeSmokeList.filter((route) => {
      return (
        p1ProtectedPageIds.has(route.pageId) ||
        referenceProtectedPageIds.has(route.pageId) ||
        holdProtectedPageIds.has(route.pageId)
      );
    });

    expect(excludedRoutes).toHaveLength(15);

    for (const route of excludedRoutes) {
      await authenticateRouteSmokePage(page);
      await page.goto(route.path);

      await expect(page.getByTestId("ux-page-workbench-triad"), `${route.pageId} workbench triad`).toHaveCount(0);
      await expect(page.getByTestId("ux-page-detail-standard"), `${route.pageId} detail standard`).toHaveCount(0);
      await expect(page.getByRole("button", { name: "Product action locked" }), `${route.pageId} locked action`).toBeDisabled();
    }
  });

  test("deferred, reference and held requests render registered-only guard screens", async ({ page }) => {
    const registeredOnlyScreens = [
      {
        path: "/communication",
        guardHeading: "Deferred Workspace",
        productText: "not active in the current release"
      },
      {
        path: "/service-blueprint",
        guardHeading: "Reference Workspace",
        productText: "not treated as product implementation"
      },
      {
        path: "/kyc/demo/review",
        guardHeading: "Held Workspace",
        productText: "held until a later explicit scope"
      },
      {
        path: "/committee/reviews",
        guardHeading: "Held Workspace",
        productText: "held until a later explicit scope"
      }
    ];

    for (const route of registeredOnlyScreens) {
      await authenticateRouteSmokePage(page);
      await page.goto(route.path);

      const main = page.getByRole("main");
      await expect(main.getByRole("heading", { name: route.guardHeading })).toBeVisible();
      await expect(main.getByText(route.productText).first()).toBeVisible();
    }
  });
});

test.describe("mobile route identity", () => {
  const shellRegressionPages = new Set(["008", "011", "012", "013", "014", "015", "016", "017"]);

  for (const route of routeSmokeList.filter((item) => shellRegressionPages.has(item.pageId))) {
    test(`${route.pageId} ${route.path} shows route content before mobile navigation`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await authenticateRouteSmokePage(page);
      await page.goto(route.path);

      const registryRoute = screenRoutes.find((item) => item.pageId === route.pageId);
      const productHeading = page
        .getByTestId("page-header")
        .getByRole("heading", { name: registryRoute?.title ?? route.expectedHeading })
        .first();
      const contentHeading = page.getByRole("heading", { name: route.expectedHeading }).first();

      await expect(productHeading).toBeVisible();
      await expect(contentHeading).toBeVisible();

      const box = await productHeading.boundingBox();
      expect(box?.y, `${route.pageId} product heading should be in the first mobile viewport`).toBeLessThan(420);
    });
  }
});
