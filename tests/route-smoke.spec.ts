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

  test("P1, reference and held routes are explicitly soft-unlocked into implementation navigation", () => {
    const implementationPageIds = new Set(
      groupedImplementationScreenRoutes.flatMap((group) => group.routes.map((route) => route.pageId))
    );

    const softUnlockedPageIds = [
      ...routeWorksetPageIds.P1_AFTER_MVP,
      ...routeWorksetPageIds.REFERENCE_ONLY,
      ...routeWorksetPageIds.HOLD_PENDING_DECISION
    ];

    for (const pageId of softUnlockedPageIds) {
      expect(implementationPageIds.has(pageId), `${pageId} should be soft-unlocked`).toBe(true);
    }
  });

  test("route access decisions preserve route provenance while soft-unlocking every route shell", () => {
    for (const route of screenRoutes) {
      const decision = routeImplementationAccessDecision(route);

      expect(decision.implementationShellAccessible, `${route.pageId} implementation access`).toBe(
        true
      );

      if (mvpPageIds.has(route.pageId) || mvpSupportPageIds.has(route.pageId)) {
        expect(decision.accessMode).toBe("FIRST_BUILD");
        expect(decision.exclusionReason).toBeUndefined();
        expect(decision.safetyBoundary).toBe("FULL_FIRST_BUILD_SCOPE");
      } else {
        expect(decision.accessMode).toBe("SOFT_UNLOCKED");
        expect(decision.safetyBoundary).toBe("UI_ONLY_NO_RELEASE_OR_ADVICE_UNLOCK");
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

  test("deferred, reference and held requests render soft-unlocked product screens", async ({ page }) => {
    const softUnlockedScreens = [
      {
        path: "/communication",
        routeHeading: "Communication Centre",
        routeHeadingLevel: 2,
        productText: "Release gate required"
      },
      {
        path: "/service-blueprint",
        routeHeading: "Service Blueprint",
        routeHeadingLevel: 2,
        productText: "End-to-end service blueprint"
      },
      {
        path: "/kyc/demo/review",
        routeHeading: "KYC / AML Review",
        routeHeadingLevel: 2,
        productText: "No client release from KYC review"
      },
      {
        path: "/committee/reviews",
        routeHeading: "Committee Review Queue",
        routeHeadingLevel: 1,
        productText: "Second review required"
      }
    ];

    for (const route of softUnlockedScreens) {
      await page.goto(route.path);

      await expect(
        page.getByRole("main").getByRole("heading", { level: route.routeHeadingLevel, name: route.routeHeading })
      ).toBeVisible();
      await expect(page.getByRole("heading", { name: "Deferred Workspace" })).toHaveCount(0);
      await expect(page.getByRole("heading", { name: "Reference Workspace" })).toHaveCount(0);
      await expect(page.getByRole("heading", { name: "Held Workspace" })).toHaveCount(0);
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
