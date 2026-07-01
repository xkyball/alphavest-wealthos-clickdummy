import { execFileSync } from "node:child_process";
import { expect, type Page, test } from "@playwright/test";

import { localAuthSessionCookieName } from "../lib/auth/local-auth-session";

const actorSessionStorageKey = "alphavest.actorSession.v1";

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

async function setActorSession(page: Page, tenantSlug: string, roleKey: string) {
  await page.addInitScript(
    ([storageKey, tenant, role]) => {
      window.localStorage.setItem(storageKey, JSON.stringify({ roleKey: role, tenantSlug: tenant }));
    },
    [actorSessionStorageKey, tenantSlug, roleKey],
  );
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);

  expect(overflow).toBe(false);
}

async function rectFor(page: Page, testId: string) {
  return page.getByTestId(testId).evaluate((node) => {
    const rect = node.getBoundingClientRect();

    return {
      bottom: rect.bottom,
      top: rect.top,
    };
  });
}

test.describe("mobile workbench priority", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 844, width: 390 });
    await authenticate(page);
    await setActorSession(page, "bennett", "compliance_officer");
  });

  test("puts selected decision context before the decision register on mobile", async ({ page }) => {
    await page.goto("/decisions");
    await expect(page.getByTestId("domain12-decision-record-entry")).toBeVisible();
    await expect(page.getByTestId("domain12-step-pendant-output")).toBeVisible();
    await expect(page.getByTestId("ux-master-detail-detail")).toBeVisible();
    await expect(page.getByTestId("ux-master-detail-master")).toBeVisible();

    const detail = await rectFor(page, "ux-master-detail-detail");
    const master = await rectFor(page, "ux-master-detail-master");

    expect(detail.top).toBeLessThan(master.top);
    await expect(page.getByTestId("domain12-open-decision-room")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("keeps selected action commands reachable before action-board filters on mobile", async ({ page }) => {
    await page.goto("/actions");
    await expect(page.getByTestId("action-board-command-feedback")).toBeVisible();
    await expect(page.getByTestId("s032-action-board-action-zone")).toBeVisible();
    await expect(page.getByTestId("s032-action-board-real-filters")).toBeVisible();

    const actionZone = await rectFor(page, "s032-action-board-action-zone");
    const filters = await rectFor(page, "s032-action-board-real-filters");

    expect(actionZone.top).toBeLessThan(filters.top);
    expect(actionZone.bottom).toBeLessThanOrEqual(844);
    await expect(page.getByTestId("j05-request-info-board")).toBeVisible();
    await expect(page.getByTestId("j05-mark-ready-board")).toBeVisible();

    await expect(page.getByTestId("s032-open-selected-action")).toBeEnabled();
    await page.getByTestId("s032-open-selected-action").click();
    await expect(page.getByTestId("ux-master-detail-detail")).toBeVisible();
    await expect(page.getByTestId("ux-master-detail-master")).toBeVisible();
    const detail = await rectFor(page, "ux-master-detail-detail");
    const master = await rectFor(page, "ux-master-detail-master");

    expect(detail.top).toBeLessThan(master.top);
    await expectNoHorizontalOverflow(page);
  });
});
