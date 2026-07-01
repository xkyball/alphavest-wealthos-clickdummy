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

test.describe("action board workflow UI", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1400 });
    await authenticate(page);
    await setActorSession(page, "bennett", "compliance_officer");
  });

  test("shows service-backed state after request-info and ready-gate commands", async ({ page }) => {
    await page.goto("/actions");

    const feedback = page.getByTestId("action-board-command-feedback");
    await expect(feedback).toContainText("Action state");

    await page.getByTestId("j05-request-info-board").click();
    await expect(feedback).toContainText("Missing information requested without release.");
    await expect(feedback).toContainText("Action moved to awaiting info");
    await expect(page.getByText("Awaiting Info").first()).toBeVisible();

    await page.getByTestId("j05-mark-ready-board").click();
    await expect(feedback).toContainText("Action ready state blocked by missing evidence.");
    await expect(feedback).toContainText("Action moved to blocked");
    await expect(page.getByText("Blocked").first()).toBeVisible();
  });
});
