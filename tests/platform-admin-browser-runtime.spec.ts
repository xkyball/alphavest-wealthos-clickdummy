import { execFileSync } from "node:child_process";
import { expect, type Page, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";
import {
  platformAdminCanonicalApiRoute,
  platformAdminCommandForAction,
  type PlatformAdminWorkflowAction,
} from "../lib/platform-admin-workflow-actions";

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

async function clickAndCapturePlatformCommand(page: Page, testId: string) {
  await page.route(`**${platformAdminCanonicalApiRoute}`, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    await route.continue();
  });

  const responsePromise = page.waitForResponse(
    (response) => response.url().includes(platformAdminCanonicalApiRoute) && response.request().method() === "POST",
  );

  await page.getByTestId(testId).click();
  const response = await responsePromise;
  const body = await response.json();

  expect(response.ok(), JSON.stringify(body)).toBe(true);
  return body as {
    actionId: PlatformAdminWorkflowAction;
    canonicalApiRoute: string;
    command: string;
    safety: {
      commandExecuted: boolean;
      hiddenRowsDisclosed: boolean;
      noAdviceExecution: boolean;
      noClientRelease: boolean;
      scoped: boolean;
    };
  };
}

test.describe("platform admin browser runtime commands", () => {
  test.beforeEach(async ({ page }) => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page);
  });

  test("platform settings save posts to the typed platform-admin command API", async ({ page }) => {
    await page.goto("/admin/platform?state=base");

    const body = await clickAndCapturePlatformCommand(page, "j10-save-platform");

    expect(body).toMatchObject({
      actionId: "j10.savePlatform",
      canonicalApiRoute: platformAdminCanonicalApiRoute,
      command: platformAdminCommandForAction("j10.savePlatform"),
      safety: {
        commandExecuted: true,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        scoped: true,
      },
    });

    const dialog = page.getByRole("dialog", { name: "Confirm critical change" });
    await expect(dialog).toBeVisible();
    await expect(dialog).not.toContainText(/client visibility unlocked|release complete|download ready|advice released/i);
  });

  test("security settings save posts to the typed platform-admin command API", async ({ page }) => {
    await page.goto("/admin/security?state=base");

    const body = await clickAndCapturePlatformCommand(page, "j10-save-security");

    expect(body).toMatchObject({
      actionId: "j10.saveSecurity",
      canonicalApiRoute: platformAdminCanonicalApiRoute,
      command: platformAdminCommandForAction("j10.saveSecurity"),
      safety: {
        commandExecuted: true,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        scoped: true,
      },
    });

    const dialog = page.getByRole("dialog", { name: "Confirm critical security change" });
    await expect(dialog).toBeVisible();
    await expect(dialog).not.toContainText(/client visibility unlocked|release complete|download ready|advice released/i);
  });
});
