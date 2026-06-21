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

  test("journey rails do not treat visual position as gate completion proof", () => {
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
        expect.objectContaining({ disabledReason: expect.stringContaining("not gate-completion proof") }),
      ]),
    );
    expect(advisorySteps.filter((step) => step.status === "blocked")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ disabledReason: expect.stringContaining("Future gate stays blocked") }),
      ]),
    );
  });

  test("renders page job, topbar route context and one primary next step above the desktop fold", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await authenticateRouteSmokePage(page);
    await page.goto("/workbench");

    const guidance = page.getByTestId("product-guidance").first();
    await expect(guidance.getByRole("heading", { name: "Page job and next step" })).toBeVisible();
    await expect(guidance.getByTestId("ux-nav-gate-guidance")).toBeVisible();
    await expect(guidance.getByTestId("ux-nav-flow-rail")).toBeVisible();
    await expect(guidance.getByTestId("ux-nav-primary-next-step")).toHaveCount(1);
    await expect(page.getByText("034 · Workbench").first()).toBeVisible();
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
      await expect(triad.getByText("not gate-completion proof")).toBeVisible();
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
    test(`${path} exposes Must-see, Secondary and Tertiary tiers without hiding safety`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1100 });
      await authenticateRouteSmokePage(page);
      await page.goto(path);

      await expect(page.locator('[data-ux-content-tier="must-see"]').first()).toBeVisible();
      await expect(page.locator('[data-ux-content-tier="secondary"]').first()).toBeVisible();
      await expect(page.locator('[data-ux-content-tier="tertiary"]').first()).toBeVisible();
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

      const heading = page.getByRole("heading", { name: route.expectedHeading }).first();
      await expect(heading).toBeVisible();

      const box = await heading.boundingBox();
      expect(box?.y, `${route.pageId} heading should be in the first mobile viewport`).toBeLessThan(420);
    });
  }
});
