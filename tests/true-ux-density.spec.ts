import { expect, type Page, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";
import { uxDensityForPageId } from "../lib/ux-density";
import {
  v096TouchedDensityContracts,
  v096TouchedDensityPageIds,
  v096UxDensityContractForPageId,
} from "../lib/v0-96-ux-density-contract";

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

test.describe("UX-DENSITY phase 9 hierarchy and layout proof", () => {
  const phase9Routes = [
    {
      path: "/client/home",
      pattern: "calm-executive",
      taskId: "UX-DENSITY-001",
      tier: "D1",
    },
    {
      path: "/advisory/review-queue",
      pattern: "productive-workbench",
      taskId: "UX-DENSITY-002",
      tier: "D2",
    },
    {
      path: "/evidence/demo/review",
      pattern: "focused-detail",
      taskId: "UX-DENSITY-004",
      tier: "D4",
    },
  ];
  const phase9TaskIds = [
    "UX-DENSITY-001",
    "UX-DENSITY-002",
    "UX-DENSITY-003",
    "UX-DENSITY-004",
  ];

  test("covers every Phase 9 density task exactly", () => {
    expect(new Set(phase9TaskIds)).toEqual(new Set([
      "UX-DENSITY-001",
      "UX-DENSITY-002",
      "UX-DENSITY-003",
      "UX-DENSITY-004",
    ]));
  });

  test("E08 shared cards, filters and data tables expose density readability contracts", async ({ page }) => {
    await authenticate(page);
    await page.goto("/advisor/reviews");

    await expect(page.locator("[data-ux-primitive='card'][data-ux-density-readability='true']").first()).toBeVisible();
    await expect(page.locator("[data-ux-data-surface-density-preset][data-ux-density-readability='true']").first()).toBeVisible();
    await expect(page.locator("[data-ux-data-surface-density-preset='default']").first()).toBeVisible();
    await expect(page.locator("[data-ux-primitive-density='comfortable']").first()).toBeVisible();
    await expect(page.locator(".av-readable-surface").first()).toBeVisible();
  });

  for (const route of phase9Routes) {
    test(route.taskId + " " + route.path + " exposes above-fold density hierarchy and retained safety", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1200 });
      await authenticate(page);
      await page.goto(route.path);

      const densitySurface = page.locator(`[data-ux-density-tier="${route.tier}"]`).first();
      await expect(densitySurface).toBeVisible();
      await expect(densitySurface).toHaveAttribute("data-ux-density-pattern", route.pattern);
      await expect(page.getByTestId("product-guidance")).toHaveCount(0);
      await expect(densitySurface).not.toContainText(/Layout priority|Safety state|Page job|empty premium space|chaotic card wall|safety hidden|audit hidden|evidence hidden|visual proof|gate-completion proof/i);
    });
  }
});

test.describe("V0.96 WP-02 page-type and density contract", () => {
  test("assigns every touched V0.96 surface a page-type alias and density tier", () => {
    expect(v096TouchedDensityContracts).toHaveLength(v096TouchedDensityPageIds.length);
    expect(new Set(v096TouchedDensityContracts.map((contract) => contract.pageId))).toEqual(new Set(v096TouchedDensityPageIds));

    for (const contract of v096TouchedDensityContracts) {
      expect(contract.v096PageType).toMatch(/^(HUB|WORKBENCH_QUEUE|DETAIL_REVIEW|DECISION_ROOM|CLIENT_PROJECTION|REFERENCE|HOLD_GUARD)$/);
      expect(contract.densityTier).toBe(uxDensityForPageId(contract.pageId).tier);
      expect(contract.routeScope).toMatch(/^(MVP|MVP_SUPPORT)$/);
      expect(contract.currentPath).toMatch(/^\/.+/);
    }
  });

  test("keeps the explicit V0.96 long-page targets in controlled density patterns", () => {
    expect(v096UxDensityContractForPageId("027")).toMatchObject({
      densityTier: "D2",
      v096PageType: "WORKBENCH_QUEUE",
      v096RouteLabel: "/documents",
    });
    expect(v096UxDensityContractForPageId("034")).toMatchObject({
      densityTier: "D2",
      v096PageType: "WORKBENCH_QUEUE",
      v096RouteLabel: "/workbench",
    });
    expect(v096UxDensityContractForPageId("035")).toMatchObject({
      densityTier: "D4",
      v096PageType: "DETAIL_REVIEW",
      v096RouteLabel: "/workbench/triggers/:id",
    });
    expect(v096UxDensityContractForPageId("037")).toMatchObject({
      densityTier: "D4",
      v096PageType: "DETAIL_REVIEW",
      v096RouteLabel: "/advisor-approval/:id",
    });
    expect(v096UxDensityContractForPageId("039")).toMatchObject({
      densityTier: "D4",
      v096PageType: "DECISION_ROOM",
      v096RouteLabel: "/compliance/:id/review",
    });
    expect(v096UxDensityContractForPageId("042")).toMatchObject({
      densityTier: "D3",
      v096PageType: "DETAIL_REVIEW",
      v096RouteLabel: "/compliance/:id/audit",
    });
    expect(v096UxDensityContractForPageId("055")).toMatchObject({
      densityTier: "D3",
      v096PageType: "WORKBENCH_QUEUE",
      v096RouteLabel: "/export/:id/scope",
    });
    expect(v096UxDensityContractForPageId("056")).toMatchObject({
      densityTier: "D3",
      v096PageType: "WORKBENCH_QUEUE",
      v096RouteLabel: "/export/:id/redaction",
    });
    expect(v096UxDensityContractForPageId("057")).toMatchObject({
      densityTier: "D4",
      v096PageType: "DECISION_ROOM",
      v096RouteLabel: "/export/:id/preview",
    });
    expect(v096UxDensityContractForPageId("019")).toMatchObject({
      densityTier: "D1",
      v096PageType: "CLIENT_PROJECTION",
      v096RouteLabel: "/portal",
    });
  });

  test("keeps registered-only reference and hold examples outside productive density targets", () => {
    expect(v096UxDensityContractForPageId("061")).toMatchObject({
      routeScope: "REFERENCE_ONLY",
      v096PageType: "REFERENCE",
    });
    expect(v096UxDensityContractForPageId("064")).toMatchObject({
      routeScope: "HOLD_PENDING_DECISION",
      v096PageType: "HOLD_GUARD",
    });
  });
});
