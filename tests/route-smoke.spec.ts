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

  test("P1, reference and held routes stay out of implementation navigation", () => {
    const implementationPageIds = new Set(
      groupedImplementationScreenRoutes.flatMap((group) => group.routes.map((route) => route.pageId))
    );

    const excludedPageIds = [
      ...routeWorksetPageIds.P1_AFTER_MVP,
      ...routeWorksetPageIds.REFERENCE_ONLY,
      ...routeWorksetPageIds.HOLD_PENDING_DECISION
    ];

    for (const pageId of excludedPageIds) {
      expect(implementationPageIds.has(pageId), `${pageId} should stay excluded`).toBe(false);
    }
  });

  test("route access decisions keep implementation shells limited to MVP and MVP support", () => {
    for (const route of screenRoutes) {
      const decision = routeImplementationAccessDecision(route);
      const shouldRenderImplementation = mvpPageIds.has(route.pageId) || mvpSupportPageIds.has(route.pageId);

      expect(decision.implementationShellAccessible, `${route.pageId} implementation access`).toBe(
        shouldRenderImplementation
      );

      if (p1PageIds.has(route.pageId)) {
        expect(decision.exclusionReason).toBe("P1_DEFERRED");
      } else if (referencePageIds.has(route.pageId)) {
        expect(decision.exclusionReason).toBe("REFERENCE_ONLY_NO_PRODUCT_TASK");
      } else if (holdPageIds.has(route.pageId)) {
        expect(decision.exclusionReason).toBe("HOLD_PENDING_SCOPE_UNLOCK");
      } else {
        expect(decision.exclusionReason).toBeUndefined();
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

  test("deferred, reference and held requests render exclusion shells instead of product screens", async ({ page }) => {
    const exclusionShells = [
      {
        path: "/communication",
        shellHeading: "Deferred Workspace",
        routeHeading: "Communication Centre",
        forbiddenProductText: "Communication path selected"
      },
      {
        path: "/service-blueprint",
        shellHeading: "Reference Workspace",
        routeHeading: "Service Blueprint",
        forbiddenProductText: "Plan, sequence and control scope"
      },
      {
        path: "/kyc/demo/review",
        shellHeading: "Held Workspace",
        routeHeading: "KYC / AML Review",
        forbiddenProductText: "Enhanced due diligence"
      },
      {
        path: "/committee/reviews",
        shellHeading: "Held Workspace",
        routeHeading: "Committee Review Queue",
        forbiddenProductText: "Second review required"
      }
    ];

    for (const route of exclusionShells) {
      await page.goto(route.path);

      await expect(page.getByRole("heading", { name: route.routeHeading })).toBeVisible();
      await expect(page.getByRole("heading", { name: route.shellHeading })).toBeVisible();
      await expect(page.getByText(route.forbiddenProductText)).toHaveCount(0);
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
