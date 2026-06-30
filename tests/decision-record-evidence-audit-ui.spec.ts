import { mkdirSync } from "node:fs";
import { expect, type Locator, type Page, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";

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

const forbiddenVisibleInternalCopy = /DOMAIN-|BP-\d+|process-first|proof boundary|route id|page id|data-testid|client acceptance|export ready|evidence sufficient|released to client/i;

async function expectNoVisibleInternalCopy(scope: Locator) {
  const visibleText = await scope.evaluate((node) => (node as HTMLElement).innerText);
  expect(visibleText).not.toMatch(forbiddenVisibleInternalCopy);
}

async function expectPrimarySurfaceVisualAudit(page: Page, testId: string) {
  const audit = await page.evaluate((surfaceTestId) => {
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const surface = document.querySelector(`[data-testid="${surfaceTestId}"]`);
    const surfaceRect = surface?.getBoundingClientRect();
    const nodes = Array.from(surface?.querySelectorAll("p, span, div, h1, h2, h3, h4") ?? []);
    const narrowTextBlocks = nodes.filter((node) => {
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
    const internalScrollContainers = [surface, ...Array.from(surface?.querySelectorAll("*") ?? [])].filter((node) => {
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);
      const scrolls = /(auto|scroll)/.test(`${style.overflowY} ${style.overflow}`);
      return scrolls && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < viewportHeight && node.scrollHeight > node.clientHeight + 1;
    }).length;

    return {
      bottom: surfaceRect?.bottom ?? 9999,
      horizontalOverflow: document.documentElement.scrollWidth > viewportWidth + 1,
      internalScrollContainers,
      narrowTextBlocks,
      overflowingElements,
      summaryBannerCount: document.querySelectorAll('[data-testid="workflow02-worksurface-summary-banner"]').length,
      top: surfaceRect?.top ?? -9999,
      viewportHeight,
    };
  }, testId);

  expect(audit.top, `${testId} must start in the viewport`).toBeGreaterThanOrEqual(0);
  expect(audit.bottom, `${testId} primary task must fit the 1400x900 viewport`).toBeLessThanOrEqual(audit.viewportHeight);
  expect(audit.horizontalOverflow, `${testId} must not create horizontal overflow`).toBe(false);
  expect(audit.overflowingElements, `${testId} must not render off-canvas content`).toBe(0);
  expect(audit.narrowTextBlocks, `${testId} must not clip labels or values into narrow word fragments`).toBe(0);
  expect(audit.summaryBannerCount, `${testId} must not render an operational summary banner`).toBe(0);
  expect(audit.internalScrollContainers, `${testId} must not hide content behind internal scroll containers`).toBe(0);
}

test.describe("DOMAIN-12 decision record evidence audit UI", () => {
  test("S043 exposes a real decision-record workbench entry with step pendants and one next action", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1400 });
    await authenticate(page);
    await page.goto("/decisions");

    const entry = page.getByTestId("domain12-decision-record-entry");
    await expect(entry).toBeVisible();
    await expect(entry).toHaveAttribute("data-domain12-contract", "DOMAIN-12_DECISION_RECORD_EVIDENCE_AUDIT_CONTRACT");
    await expect(entry).toHaveAttribute("data-domain12-page-family", "decision_register");
    await expect(entry).toHaveAttribute("data-domain12-processes", /BP-075/);
    await expect(entry).toHaveAttribute("data-domain12-processes", /BP-076/);
    await expect(entry).toHaveAttribute("data-domain12-processes", /BP-078/);
    await expect(entry).toHaveAttribute("data-domain12-step-pendants", /Decision row, selected decision object and action intent/);
    await expect(entry).toHaveAttribute("data-domain12-step-pendants", /Decision register selection and detail open gate/);
    await expect(entry).toHaveAttribute("data-domain12-step-pendants", /Scoped decision detail or selected decision record/);
    await expect(entry).toHaveAttribute("data-domain12-step-pendants", /Role, tenant, scope or missing precondition/);
    await expect(entry).toHaveAttribute("data-domain12-proof-blocked-overclaims", /client_visibility_without_release_projection/);

    await expect(page.getByTestId("domain12-open-decision-room")).toHaveCount(1);
    await expect(page.getByTestId("domain12-open-decision-room")).toHaveAttribute("href", "/decisions/demo");

    await expect(page.getByTestId("domain12-step-pendant-input")).toBeVisible();
    await expect(page.getByTestId("domain12-step-pendant-output")).toBeVisible();
    await expect(page.getByTestId("domain12-step-pendant-blocker")).toBeVisible();
    await expect(entry).toContainText("Action restricted");
    await expect(page.getByTestId("domain12-rationale-pendant")).toHaveCount(0);
    await expect(page.getByTestId("domain12-evidence-pendant")).toHaveCount(0);
    await expect(page.getByTestId("domain12-audit-history-pendant")).toHaveCount(0);

    await expectNoVisibleInternalCopy(entry);
    await expectNoVisibleInternalCopy(page.locator("body"));
    await expectPrimarySurfaceVisualAudit(page, "domain12-decision-record-entry");

    const metrics = await entry.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        top: rect.top,
      };
    });
    expect(metrics.top).toBeGreaterThanOrEqual(0);
    expect(metrics.bottom).toBeLessThanOrEqual(900);

    mkdirSync("artifacts/screenshots/domain-12", { recursive: true });
    await page.screenshot({
      fullPage: false,
      path: "artifacts/screenshots/domain-12/domain12-impl01a-s043-decision-entry.png",
    });
  });

  test("S044-S047 and S051 expose core process surfaces with route-owned step pendants", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1400 });
    await authenticate(page);

    const routeChecks = [
      { family: "decision_room", path: "/decisions/demo", processes: [/BP-075/, /BP-076/, /BP-077/, /BP-078/], testId: "domain12-decision-room-core" },
      { family: "decision_success", path: "/decisions/demo/success", processes: [/BP-075/, /BP-078/, /BP-082/, /BP-083/], testId: "domain12-decision-success-core" },
      { family: "evidence_vault", path: "/evidence", processes: [/BP-081/], testId: "domain12-evidence-vault-core" },
      { family: "evidence_record_detail", path: "/evidence/demo/review", processes: [/BP-081/, /BP-082/], testId: "domain12-evidence-detail-core" },
      { family: "audit_history", path: "/governance/audit", processes: [/BP-082/, /BP-083/], testId: "domain12-audit-history-core" },
    ];

    for (const route of routeChecks) {
      await page.goto(route.path);
      const core = page.getByTestId(route.testId);
      await expect(core, route.path).toBeVisible();
      await expect(core, route.path).toHaveAttribute("data-domain12-contract", "DOMAIN-12_DECISION_RECORD_EVIDENCE_AUDIT_CONTRACT");
      await expect(core, route.path).toHaveAttribute("data-domain12-page-family", route.family);
      await expect(core, route.path).toHaveAttribute("data-domain12-step-pendants", /input|Decision|Evidence|Audit|Rationale|history|projection/i);
      for (const processPattern of route.processes) {
        await expect(core, route.path).toHaveAttribute("data-domain12-processes", processPattern);
      }
      await expectNoVisibleInternalCopy(core);
      await expectPrimarySurfaceVisualAudit(page, route.testId);
    }

    await page.goto("/evidence");
    const vault = page.getByTestId("domain12-evidence-vault-core");
    await expect(vault).toHaveAttribute("data-c3-vault-readmodel-state", "ready");
    await expect(vault).toHaveAttribute("data-c3-vault-source-state", "backend_readmodel");
    await expect(page.getByTestId("s046-evidence-master-list").locator("[data-c3-vault-row-source='backend_readmodel']").first()).toBeVisible();
    const selectedDetail = page.getByTestId("s046-evidence-selected-detail");
    await expect(selectedDetail).toContainText("Tenant document list");
    const selectedObject = await page.locator("[data-ux-master-detail-selected-object]").first().getAttribute("data-ux-master-detail-selected-object");
    expect(selectedObject).toBeTruthy();

    await page.getByTestId("s046-open-selected-evidence").click();
    const drawer = page.getByTestId("uxp3-evidence-drawer-lifecycle");
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText(selectedObject?.slice(0, 8) ?? "");

    await page.goto("/decisions/demo");
    await expect(page.getByTestId("domain12-s044-input")).toBeVisible();
    await expect(page.getByTestId("domain12-s044-gate")).toBeVisible();
    await expect(page.getByTestId("domain12-s044-output")).toBeVisible();
    await expect(page.getByTestId("domain12-s044-blocker")).toBeVisible();
    const cancelDecisionModal = page.getByRole("button", { name: "Cancel" }).first();
    if (await cancelDecisionModal.isVisible()) {
      await cancelDecisionModal.click();
    }
    await expect(page.getByTestId("domain12-decision-room-core")).toBeVisible();

    mkdirSync("artifacts/screenshots/domain-12", { recursive: true });
    await page.screenshot({
      fullPage: false,
      path: "artifacts/screenshots/domain-12/domain12-impl01b-s044-decision-room-core.png",
    });
  });
});
