import { expect, test } from "@playwright/test";

import {
  groupedImplementationScreenRoutes,
  routeImplementationAccessDecision,
  routeSmokeList,
  routeToSmokePath,
  routeWorksetIntegrity,
  routeWorksetPageIds,
  screenRoutes
} from "../lib/route-registry";
import { scfDoNotImplementRegister } from "../lib/scf-foundation";

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

test.describe("registered route smoke", () => {
  for (const route of routeSmokeList) {
    test(`${route.pageId} ${route.path}`, async ({ request }) => {
      const response = await request.get(route.path);
      expect(response.status(), `${route.pageId} ${route.path}`).toBe(200);

      const body = await response.text();
      expect(body).toContain(route.expectedHeading);
    });
  }

  test("unknown catalogue route returns hardened not-found surface", async ({ request }) => {
    const response = await request.get("/not-a-catalogue-route");
    expect([200, 404]).toContain(response.status());

    const body = await response.text();
    expect(body).toContain("Route unavailable");
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
      await page.goto(route.path);

      await expect(page.getByRole("main").getByRole("heading", { name: route.guardHeading })).toBeVisible();
      await expect(page.getByText(route.productText)).toBeVisible();
    }
  });
});

test.describe("mobile route identity", () => {
  const shellRegressionPages = new Set(["008", "011", "012", "013", "014", "015", "016", "017"]);

  for (const route of routeSmokeList.filter((item) => shellRegressionPages.has(item.pageId))) {
    test(`${route.pageId} ${route.path} shows route content before mobile navigation`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route.path);

      const heading = page.getByRole("heading", { name: route.expectedHeading }).first();
      await expect(heading).toBeVisible();

      const box = await heading.boundingBox();
      expect(box?.y, `${route.pageId} heading should be in the first mobile viewport`).toBeLessThan(420);
    });
  }
});
