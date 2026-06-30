import { expect, type Page, test } from "@playwright/test";

import { localAuthSessionCookieName } from "../lib/auth/local-auth-session";
import {
  routeImplementationAccessDecision,
  routeScopeForPageId,
  routeToSmokePath,
  screenRoutes,
} from "../lib/route-registry";

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

test.describe("UXP1-008 hold and deferred route cleanup", () => {
  test("keeps elevated HOLD and P1 routes registered-only without product-shell access", () => {
    for (const pageId of ["064", "065", "066", "067"]) {
      expect(routeScopeForPageId(pageId), `${pageId} scope`).toBe("HOLD_PENDING_DECISION");
      expect(routeImplementationAccessDecision({ pageId }), `${pageId} access`).toMatchObject({
        exclusionReason: "HOLD_PENDING_SCOPE_UNLOCK",
        implementationShellAccessible: false,
        routeScope: "HOLD_PENDING_DECISION",
      });
    }

    for (const pageId of ["052", "053"]) {
      expect(routeScopeForPageId(pageId), `${pageId} scope`).toBe("P1_AFTER_MVP");
      expect(routeImplementationAccessDecision({ pageId }), `${pageId} access`).toMatchObject({
      exclusionReason: "P1_DEFERRED",
      implementationShellAccessible: false,
      routeScope: "P1_AFTER_MVP",
      });
    }

    for (const pageId of ["059", "060", "068", "069", "070", "071"]) {
      expect(routeScopeForPageId(pageId), `${pageId} scope`).toBe(["069", "070", "071"].includes(pageId) ? "MVP_SUPPORT" : "MVP");
      expect(routeImplementationAccessDecision({ pageId }), `${pageId} access`).toMatchObject({
        implementationShellAccessible: true,
        routeScope: ["069", "070", "071"].includes(pageId) ? "MVP_SUPPORT" : "MVP",
      });
    }
  });

  test("shows concise held context without MVP or productive action language", async ({ page }) => {
    await authenticate(page);

    for (const pageId of ["064", "067"]) {
      const route = routeByPageId(pageId);
      await page.goto(routeToSmokePath(route.route));

      await expect(page.getByRole("heading", { name: "Held Workspace" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Held" })).toHaveCount(0);
      await expect(page.locator('[data-ux-primary-cta="true"][data-ux-interactive="false"]').filter({ hasText: "Held" })).toBeVisible();
      await expect(page.getByText("Held routes expose no MVP controls until access and safety are explicitly decided.")).toBeVisible();
      await expect(page.getByText("No client-visible content is exposed from this held route.")).toBeVisible();
      await expect(page.getByText(/Product action locked|Related Workspaces|Continue to|implementation proof|visual proof|gate-completion proof/i)).toHaveCount(0);
    }
  });

  test("renders review calendar as a productive operations surface", async ({ page }) => {
    await authenticate(page);
    await page.goto(routeToSmokePath(routeByPageId("068").route));

    await expect(page.getByRole("heading", { name: "Review Calendar" })).toBeVisible();
    await expect(page.getByTestId("route-skeleton-page")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Due Reviews" })).toBeVisible();
    await expect(page.getByTestId("ux-data-table-pagination")).toHaveAttribute("data-ux-data-surface-source-truth", "backend_query_backed");
    await expect(page.getByText(/Deferred Workspace|Deferred Guard|No product action, release, export, mutation or client visibility is available from this deferred route/i)).toHaveCount(0);
  });

  test("renders rebalance monitoring as productive internal support without execution unlock", async ({ page }) => {
    await authenticate(page);
    await page.goto(routeToSmokePath(routeByPageId("069").route));

    await expect(page.getByRole("heading", { name: "Rebalance Monitoring" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Held Workspace" })).toHaveCount(0);
    await expect(page.getByTestId("route-skeleton-page")).toHaveCount(0);
    await expect(page.getByTestId("ux-data-list-pagination")).toHaveAttribute("data-ux-data-surface-source-truth", "backend_query_backed");
    await expect(page.getByRole("button", { name: "Execute rebalance" })).toBeDisabled();
    await expect(page.getByText(/client visibility unlocked|release complete|download ready|share ready/i)).toHaveCount(0);
  });
});
