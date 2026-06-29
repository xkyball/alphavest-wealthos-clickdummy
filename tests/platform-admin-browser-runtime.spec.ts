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
  let requestActionId: unknown;

  await page.route(`**${platformAdminCanonicalApiRoute}`, async (route) => {
    requestActionId = route.request().postDataJSON().actionId;
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        actionId: requestActionId,
        canonicalApiRoute: platformAdminCanonicalApiRoute,
        command: platformAdminCommandForAction(requestActionId as PlatformAdminWorkflowAction),
        safety: {
          commandExecuted: true,
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          scoped: true,
        },
      }),
      status: 200,
    });
  });

  const responsePromise = page.waitForResponse(
    (response) => response.url().includes(platformAdminCanonicalApiRoute) && response.request().method() === "POST",
  );

  await page.getByTestId(testId).click();
  const response = await responsePromise;
  const body = await response.json();

  expect(response.ok(), JSON.stringify(body)).toBe(true);
  expect(body.actionId).toBe(requestActionId);
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

async function expectSensitiveSaveDoesNotPostWithoutBackendAuthority(
  page: Page,
  testId: string,
  dialogName: string,
  exactPhrase: string,
) {
  let platformCommandRequests = 0;

  await page.route(`**${platformAdminCanonicalApiRoute}`, async (route) => {
    platformCommandRequests += 1;
    await route.abort();
  });

  await page.getByTestId(testId).click();

  const dialog = page.getByRole("dialog", { name: dialogName });
  await expect(dialog).toBeVisible();
  await expect(dialog).not.toContainText(/client visibility unlocked|release complete|download ready|advice released/i);
  await page.waitForTimeout(250);
  expect(platformCommandRequests).toBe(0);

  await dialog.getByPlaceholder("Type the exact phrase above").fill(exactPhrase);
  await dialog.getByRole("button", { name: "Confirm change" }).click();

  await expect(dialog.getByText("Mutation blocked")).toBeVisible();
  await expect(dialog).toContainText("no platform or security setting changed");
  await expect(dialog).toContainText("no client visibility or downstream release state changed");
  await expect(dialog).not.toContainText(/client visibility unlocked|release complete|download ready|advice released/i);
  await page.waitForTimeout(250);
  expect(platformCommandRequests).toBe(0);
}

test.describe("platform admin browser runtime commands", () => {
  test.beforeEach(async ({ page }) => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page);
  });

  test("platform settings save opens confirmation without posting a command", async ({ page }) => {
    await page.goto("/admin/platform?state=base");

    await expectSensitiveSaveDoesNotPostWithoutBackendAuthority(
      page,
      "j10-save-platform",
      "Confirm critical change",
      "I understand the impact of this change",
    );
  });

  test("security settings save opens confirmation without posting a command", async ({ page }) => {
    await page.goto("/admin/security?state=base");

    await expectSensitiveSaveDoesNotPostWithoutBackendAuthority(
      page,
      "j10-save-security",
      "Confirm critical security change",
      "DISABLE MFA",
    );
  });

  test("permission review remains backed by the typed platform-admin command API", async ({ page }) => {
    await page.goto("/admin/roles?state=base");

    const body = await clickAndCapturePlatformCommand(page, "j10-review-permission");

    expect(body).toMatchObject({
      actionId: "j10.reviewPermission",
      canonicalApiRoute: platformAdminCanonicalApiRoute,
      command: platformAdminCommandForAction("j10.reviewPermission"),
      safety: {
        commandExecuted: true,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        scoped: true,
      },
    });
  });
});
