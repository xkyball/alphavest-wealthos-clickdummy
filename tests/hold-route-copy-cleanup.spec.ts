import { expect, type Page, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";
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
      name: demoAuthSessionCookieName,
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
    for (const pageId of ["064", "065", "066", "067", "069", "070", "071"]) {
      expect(routeScopeForPageId(pageId), `${pageId} scope`).toBe("HOLD_PENDING_DECISION");
      expect(routeImplementationAccessDecision({ pageId }), `${pageId} access`).toMatchObject({
        exclusionReason: "HOLD_PENDING_SCOPE_UNLOCK",
        implementationShellAccessible: false,
        routeScope: "HOLD_PENDING_DECISION",
      });
    }

    expect(routeScopeForPageId("068")).toBe("P1_AFTER_MVP");
    expect(routeImplementationAccessDecision({ pageId: "068" })).toMatchObject({
      exclusionReason: "P1_DEFERRED",
      implementationShellAccessible: false,
      routeScope: "P1_AFTER_MVP",
    });
  });

  test("shows concise held context without MVP or productive action language", async ({ page }) => {
    await authenticate(page);

    for (const pageId of ["064", "067", "069", "070", "071"]) {
      const route = routeByPageId(pageId);
      await page.goto(routeToSmokePath(route.route));

      await expect(page.getByRole("heading", { name: "Held Workspace" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Held" })).toBeDisabled();
      await expect(page.getByText("Hold Guard")).toBeVisible();
      await expect(page.getByText("No product action, release, export, mutation or client visibility is available from this held route.")).toBeVisible();
      await expect(page.getByText(/Product action locked|Related Workspaces|Continue to|implementation proof|visual proof|gate-completion proof/i)).toHaveCount(0);
    }
  });

  test("shows concise deferred context for review calendar without promotion", async ({ page }) => {
    await authenticate(page);
    await page.goto(routeToSmokePath(routeByPageId("068").route));

    await expect(page.getByRole("heading", { name: "Deferred Workspace" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Deferred" })).toBeDisabled();
    await expect(page.getByText("Deferred Guard")).toBeVisible();
    await expect(page.getByText("No product action, release, export, mutation or client visibility is available from this deferred route.")).toBeVisible();
    await expect(page.getByText(/Open rebalance monitoring|Product action locked|Related Workspaces|Continue to|current release workflow/i)).toHaveCount(0);
  });
});
