import { mkdirSync } from "node:fs";
import path from "node:path";
import { expect, type Page, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";
import { processFirstUxRouteContracts } from "../lib/process-first-ux-contract";

const screenshotDirectory = path.join(
  process.cwd(),
  "artifacts/screenshots/process-first-non-negotiable-2026-06-28/audited-1400x900",
);

type OperationalVisualRoute = {
  name: string;
  pageFamily: string;
  pageId: string;
  path: string;
};

const operationalVisualRoutes: OperationalVisualRoute[] = processFirstUxRouteContracts.map((contract) => ({
  name: `${contract.pageId}-${contract.pageFamily}`,
  pageFamily: contract.pageFamily,
  pageId: contract.pageId,
  path: contract.route,
}));

async function authenticateOperationalAuditPage(page: Page) {
  await page.context().addCookies([
    {
      httpOnly: true,
      domain: "127.0.0.1",
      name: demoAuthSessionCookieName,
      path: "/",
      sameSite: "Lax",
      value: "av-session-playwright-authenticated",
    },
  ]);
}

test.describe("operational visual audit non-negotiable", () => {
  for (const route of operationalVisualRoutes) {
    test(`${route.name} passes audited 1400x900 screenshot contract`, async ({ page }) => {
      mkdirSync(screenshotDirectory, { recursive: true });
      await page.setViewportSize({ height: 900, width: 1400 });
      await authenticateOperationalAuditPage(page);
      await page.goto(route.path);

      await expect(page.getByTestId("wp02-worksurface-shell")).toBeVisible();
      await expect(page.getByTestId("wp02-worksurface-shell").first()).toHaveAttribute("data-wp02-route-id", route.pageId);

      const audit = await page.evaluate(() => {
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = document.documentElement.clientHeight;
        const workSurface = document.querySelector('[data-testid="wp02-worksurface-shell"]');
        const visibleText = document.body.innerText;
        const badgeNodes = Array.from(workSurface?.querySelectorAll('[data-ux-affordance="static-badge"]') ?? []);
        const badgeClusterCount = Array.from(workSurface?.querySelectorAll("*") ?? []).filter(
          (node) => node.querySelectorAll?.('[data-ux-affordance="static-badge"]').length > 3,
        ).length;
        const narrowTableCells = Array.from(document.querySelectorAll("td, th")).filter((node) => {
          const rect = node.getBoundingClientRect();
          const text = node.textContent?.trim() ?? "";
          return text.length > 3 && rect.width > 0 && rect.width < 42;
        }).length;
        const narrowTextBlocks = Array.from(workSurface?.querySelectorAll("p, span, div, h1, h2, h3, h4") ?? []).filter((node) => {
          const text = node.textContent?.replace(/\s+/g, " ").trim() ?? "";
          const rect = node.getBoundingClientRect();
          const hasLongWord = text.split(" ").some((word) => word.length >= 8);
          const hasElementChildren = Array.from(node.children).some((child) => child.getBoundingClientRect().width > 0);
          return hasLongWord && !hasElementChildren && rect.width > 0 && rect.width < 86 && rect.height > 32;
        }).length;
        const overflowingElements = Array.from(document.body.querySelectorAll("*")).filter((node) => {
          const rect = node.getBoundingClientRect();
          return rect.width > 0 && (rect.left < -1 || rect.right > viewportWidth + 1);
        }).length;
        const contentArea = workSurface?.getBoundingClientRect();
        const visibleOperationalBlocks = Array.from(
          workSurface?.querySelectorAll("table, [role='table'], [data-testid='ux-data-table'], button, a, [data-ux-affordance], [data-ux-template-zone]") ?? [],
        ).filter((node) => {
          const rect = node.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < viewportHeight;
        }).length;
        const auditSurfaces = Array.from(document.querySelectorAll('[data-testid="wp02-worksurface-shell"], [data-testid="ux-a11y-drawer"], [role="dialog"], [role="complementary"]'));
        const internalScrollContainers = auditSurfaces.flatMap((surface) => [surface, ...Array.from(surface.querySelectorAll("*"))]).filter((node) => {
          const rect = node.getBoundingClientRect();
          const style = window.getComputedStyle(node);
          const scrolls = /(auto|scroll)/.test(`${style.overflowY} ${style.overflow}`);
          return scrolls && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < viewportHeight && node.scrollHeight > node.clientHeight + 1;
        }).length;
        const meaningfulContentBlocks = Array.from(workSurface?.querySelectorAll("p, span, h1, h2, h3, h4") ?? []).filter((node) => {
          const rect = node.getBoundingClientRect();
          const text = node.textContent?.replace(/\s+/g, " ").trim() ?? "";
          return text.length >= 12 && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < viewportHeight;
        }).length;
        const visibleSurfaceHeight = contentArea ? Math.min(contentArea.bottom, viewportHeight) - Math.max(contentArea.top, 0) : 0;

        return {
          badgeClusterCount,
          forbiddenOperationalText: /Payload Redaction Operations|Payload:|Stage:|Redactions:|Approval blocked until preview|Approval blocked until|blocked until .*gates? pass|release gates? pass|visibility gates? pass|Scope\s+Scope|Dense operations safety gate|Workflow Badges|workflow proof|proof drawer|command spine|drawer handoff|Access request gate|Export redaction gate|Selected\s+Queue|Scoped\s+Detail|Gated\s+Step|Advisor approval is not release|Compliance pending|Client blocked|Draft contained|Release not set|Advisor candidate only|Not released/i.test(visibleText),
          horizontalOverflow: document.documentElement.scrollWidth > viewportWidth + 1,
          internalScrollContainers,
          narrowTableCells,
          narrowTextBlocks,
          overflowingElements,
          pageScroll: document.documentElement.scrollHeight > viewportHeight + 1,
          scrollHeight: document.documentElement.scrollHeight,
          staticBadgeCount: badgeNodes.length,
          summaryBannerCount: document.querySelectorAll('[data-testid="wp02-worksurface-summary-banner"]').length,
          meaningfulContentBlocks,
          totalOperationalSignals: visibleOperationalBlocks + meaningfulContentBlocks,
          visibleOperationalBlocks,
          visibleSurfaceHeight,
          viewportHeight,
        };
      });

      await page.screenshot({
        fullPage: false,
        path: path.join(screenshotDirectory, `${route.name}.png`),
      });

      expect(audit.pageScroll, `${route.name} must not need page scroll at 1400x900 (${audit.scrollHeight}px page / ${audit.viewportHeight}px viewport)`).toBe(false);
      expect(audit.horizontalOverflow, `${route.name} must not create horizontal overflow`).toBe(false);
      expect(audit.overflowingElements, `${route.name} must not render off-canvas content`).toBe(0);
      expect(audit.narrowTableCells, `${route.name} must not clip table text into vertical fragments`).toBe(0);
      expect(audit.narrowTextBlocks, `${route.name} must not clip labels or values into narrow word fragments`).toBe(0);
      expect(audit.summaryBannerCount, `${route.name} must not render an operational summary banner`).toBe(0);
      expect(audit.forbiddenOperationalText, `${route.name} must not expose proof or operations scaffolding`).toBe(false);
      expect(audit.internalScrollContainers, `${route.name} must not hide overflowing content behind internal scroll containers`).toBe(0);
      expect(audit.badgeClusterCount, `${route.name} must not render badge clusters in the worksurface`).toBe(0);
      expect(audit.staticBadgeCount, `${route.name} must not use badges as primary state guidance`).toBeLessThanOrEqual(3);
      expect(audit.totalOperationalSignals, `${route.name} must not be an empty shell`).toBeGreaterThanOrEqual(14);
      expect(audit.meaningfulContentBlocks, `${route.name} must show meaningful operational content`).toBeGreaterThanOrEqual(8);
      expect(audit.visibleSurfaceHeight, `${route.name} must not be artificially short or sparse`).toBeGreaterThanOrEqual(340);
    });
  }
});
