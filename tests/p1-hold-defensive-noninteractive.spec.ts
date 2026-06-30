import { expect, type Page, test } from "@playwright/test";

import { localAuthSessionCookieName } from "../lib/auth/local-auth-session";
import {
  routeImplementationAccessDecision,
  routeScopeForPageId,
  routeToSmokePath,
  routeWorksetPageIds,
  screenRoutes,
  type RouteScopeLabel,
} from "../lib/route-registry";

const p1TargetPageIds = ["052", "053"] as const;
const holdTargetPageIds = ["064", "065", "066", "067", "069", "070", "071"] as const;

const reachableProtectedRoutes: Array<{
  actionLabel: "Deferred" | "Held";
  pageId: string;
  scope: Extract<RouteScopeLabel, "P1_AFTER_MVP" | "HOLD_PENDING_DECISION">;
}> = [
  ...p1TargetPageIds.map((pageId) => ({ actionLabel: "Deferred" as const, pageId, scope: "P1_AFTER_MVP" as const })),
  { actionLabel: "Held", pageId: "064", scope: "HOLD_PENDING_DECISION" },
  { actionLabel: "Held", pageId: "067", scope: "HOLD_PENDING_DECISION" },
  { actionLabel: "Held", pageId: "069", scope: "HOLD_PENDING_DECISION" },
  { actionLabel: "Held", pageId: "070", scope: "HOLD_PENDING_DECISION" },
  { actionLabel: "Held", pageId: "071", scope: "HOLD_PENDING_DECISION" },
];

async function authenticate(page: Page) {
  await page.context().addCookies([
    {
      domain: "127.0.0.1",
      httpOnly: true,
      name: localAuthSessionCookieName,
      path: "/",
      sameSite: "Lax",
      value: "av-session-playwright-authenticated",
    },
  ]);
}

function routeByPageId(pageId: string) {
  const route = screenRoutes.find((candidate) => candidate.pageId === pageId);
  if (!route) {
    throw new Error(`Missing route ${pageId}`);
  }
  return route;
}

test.describe("UXP2-009 P1/HOLD defensive non-interactive clarification", () => {
  test.beforeEach(async ({ page }) => {
    await authenticate(page);
  });

  test("keeps every target P1/HOLD page id registered-only and protected", () => {
    expect(Array.from(routeWorksetPageIds.P1_AFTER_MVP)).toEqual(Array.from(p1TargetPageIds));
    expect(Array.from(routeWorksetPageIds.HOLD_PENDING_DECISION)).toEqual(Array.from(holdTargetPageIds));

    for (const pageId of p1TargetPageIds) {
      expect(routeScopeForPageId(pageId), `${pageId} scope`).toBe("P1_AFTER_MVP");
      expect(routeImplementationAccessDecision({ pageId }), `${pageId} access`).toMatchObject({
        exclusionReason: "P1_DEFERRED",
        implementationShellAccessible: false,
        routeScope: "P1_AFTER_MVP",
      });
    }

    for (const pageId of ["059", "060", "068"]) {
      expect(routeScopeForPageId(pageId), `${pageId} scope`).toBe("MVP");
      expect(routeImplementationAccessDecision({ pageId }), `${pageId} access`).toMatchObject({
        accessMode: "FIRST_BUILD",
        implementationShellAccessible: true,
        routeScope: "MVP",
      });
    }

    for (const pageId of holdTargetPageIds) {
      expect(routeScopeForPageId(pageId), `${pageId} scope`).toBe("HOLD_PENDING_DECISION");
      expect(routeImplementationAccessDecision({ pageId }), `${pageId} access`).toMatchObject({
        exclusionReason: "HOLD_PENDING_SCOPE_UNLOCK",
        implementationShellAccessible: false,
        routeScope: "HOLD_PENDING_DECISION",
      });
    }
  });

  for (const target of reachableProtectedRoutes) {
    const route = routeByPageId(target.pageId);

    test(`${target.pageId} ${route.title} exposes static guard status without product controls`, async ({ page }) => {
      await page.goto(routeToSmokePath(route.route));

      const protectedShell = page.locator(`[data-ux-route-scope="${target.scope}"]`);
      const staticStatus = page
        .locator('[data-ux-primary-cta="true"][data-ux-interactive="false"]')
        .filter({ hasText: target.actionLabel });

      await expect(page.getByRole("heading", { name: route.title }).first()).toBeVisible();
      await expect(protectedShell).toHaveAttribute("data-ux-deferred-hold-product-controls", "non-interactive");
      await expect(protectedShell).toHaveAttribute("data-ux-productive-controls", "false");
      await expect(page.getByRole("button", { name: target.actionLabel })).toHaveCount(0);
      await expect(page.locator('button[data-ux-primary-cta="true"], a[data-ux-primary-cta="true"]')).toHaveCount(0);
      await expect(staticStatus).toBeVisible();
      await expect(page.getByTestId("ux-nav-primary-next-step")).toHaveCount(0);
      await expect(page.getByTestId("ux-cta-blocked-reason").first()).toBeVisible();
    });
  }
});
