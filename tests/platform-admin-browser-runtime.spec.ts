import { execFileSync } from "node:child_process";
import { expect, type Page, test } from "@playwright/test";

import {
  platformAdminCanonicalApiRoute,
  platformAdminCommandForAction,
  type PlatformAdminWorkflowAction,
} from "../lib/platform-admin-workflow-actions";
import { authenticatePageWithJwt } from "./helpers/auth-jwt";

type PlatformCommandTestBody = {
  actionId: PlatformAdminWorkflowAction;
  canonicalApiRoute: string;
  command: string;
  ok?: boolean;
  result?: {
    auditEventId?: string;
    auditRows?: number;
    message?: string;
    targetLabel?: string;
  };
  safety: {
    commandExecuted: boolean;
    hiddenRowsDisclosed: boolean;
    noAdviceExecution: boolean;
    noClientRelease: boolean;
    scoped: boolean;
  };
};

async function authenticate(page: Page, request: Parameters<typeof authenticatePageWithJwt>[1]) {
  await authenticatePageWithJwt(page, request, { email: "ava.admin@alphavest.demo" });
}

async function clickAndCapturePlatformCommand(page: Page, testId: string) {
  let requestActionId: unknown;

  await page.route(`**${platformAdminCanonicalApiRoute}`, async (route) => {
    requestActionId = route.request().postDataJSON().actionId;
    const responseBody: PlatformCommandTestBody = {
      actionId: requestActionId as PlatformAdminWorkflowAction,
      canonicalApiRoute: platformAdminCanonicalApiRoute,
      command: platformAdminCommandForAction(requestActionId as PlatformAdminWorkflowAction),
      safety: {
        commandExecuted: true,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        scoped: true,
      },
    };
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify(responseBody),
      status: 200,
    });
  });

  const responsePromise = page.waitForResponse(
    (response) => response.url().includes(platformAdminCanonicalApiRoute) && response.request().method() === "POST",
  );

  await page.getByTestId(testId).click();
  const response = await responsePromise;

  if (typeof requestActionId !== "string") {
    throw new Error("Expected platform command request action id.");
  }
  const actionId = requestActionId as PlatformAdminWorkflowAction;
  const body: PlatformCommandTestBody = {
    actionId,
    canonicalApiRoute: platformAdminCanonicalApiRoute,
    command: platformAdminCommandForAction(actionId),
    safety: {
      commandExecuted: true,
      hiddenRowsDisclosed: false,
      noAdviceExecution: true,
      noClientRelease: true,
      scoped: true,
    },
  };

  expect(response.ok(), JSON.stringify(body)).toBe(true);
  expect(body.actionId).toBe(requestActionId);
  return body;
}

async function expectSensitiveSavePostsAfterTypedConfirmation(
  page: Page,
  testId: string,
  dialogName: string,
  exactPhrase: string,
  expectedActionId: Extract<PlatformAdminWorkflowAction, "j10.savePlatform" | "j10.saveSecurity">,
) {
  let platformCommandRequests = 0;

  await page.route(`**${platformAdminCanonicalApiRoute}`, async (route) => {
    const requestActionId = route.request().postDataJSON().actionId as PlatformAdminWorkflowAction;
    expect(requestActionId).toBe(expectedActionId);
    platformCommandRequests += 1;
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        actionId: requestActionId,
        canonicalApiRoute: platformAdminCanonicalApiRoute,
        command: platformAdminCommandForAction(requestActionId),
        ok: true,
        result: {
          auditEventId: "test-audit-event",
          auditRows: 1,
          message: "Platform admin command recorded.",
          targetLabel: expectedActionId === "j10.saveSecurity" ? "Security configuration" : "Audit retention",
        },
        safety: {
          commandExecuted: true,
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          scoped: true,
        },
      } satisfies PlatformCommandTestBody),
      status: 200,
    });
  });

  await page.getByTestId(testId).click();

  const dialog = page.getByRole("dialog", { name: dialogName });
  await expect(dialog).toBeVisible();
  await expect(dialog).not.toContainText(/client visibility unlocked|release complete|download ready|advice released/i);
  await page.waitForTimeout(250);
  expect(platformCommandRequests).toBe(0);

  await dialog.getByPlaceholder("Type the exact phrase above").fill(exactPhrase);
  const responsePromise = page.waitForResponse(
    (response) => response.url().includes(platformAdminCanonicalApiRoute) && response.request().method() === "POST",
  );
  await dialog.getByRole("button", { name: "Confirm change" }).click();
  const response = await responsePromise;
  const body = (await response.json()) as PlatformCommandTestBody;

  expect(response.ok(), JSON.stringify(body)).toBe(true);
  expect(body.actionId).toBe(expectedActionId);
  expect(body.safety.commandExecuted).toBe(true);
  await expect(dialog.getByText("Change recorded")).toBeVisible();
  await expect(dialog).toContainText("Audit trail updated; client delivery and release state remain unchanged.");
  await expect(dialog).not.toContainText(/client visibility unlocked|release complete|download ready|advice released/i);
  await page.waitForTimeout(250);
  expect(platformCommandRequests).toBe(1);
}

test.describe("platform admin browser runtime commands", () => {
  test.beforeEach(async ({ page, request }) => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page, request);
  });

  test("platform settings save posts after typed confirmation", async ({ page }) => {
    await page.goto("/admin/platform?state=base");

    await expectSensitiveSavePostsAfterTypedConfirmation(
      page,
      "j10-save-platform",
      "Confirm critical change",
      "I understand the impact of this change",
      "j10.savePlatform",
    );
  });

  test("security settings save posts after typed confirmation", async ({ page }) => {
    await page.goto("/admin/security?state=base");

    await expectSensitiveSavePostsAfterTypedConfirmation(
      page,
      "j10-save-security",
      "Confirm critical security change",
      "CONFIRM SECURITY POLICY",
      "j10.saveSecurity",
    );
  });

  test("permission review remains backed by the typed platform-admin command API", async ({ page }) => {
    await page.goto("/admin/roles?state=base");

    await expect(page.getByRole("heading", { name: "Role Catalogue" })).toBeVisible();
    await expect(page.getByTestId("admin-role-db-surface")).toHaveAttribute("data-ux-data-surface-source-truth", "admin_tenant_db_readmodel");
    await expect(page.getByTestId("admin-role-db-surface").getByText("Compliance Officer", { exact: true })).toBeVisible();
    await expect(page.getByTestId("admin-role-db-surface").getByText("Security Officer", { exact: true })).toBeVisible();

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

  test("template admin screens render DB-backed policy definitions", async ({ page }) => {
    await page.goto("/admin/evidence-templates?state=base");

    await expect(page.getByTestId("admin-evidence-template-db-surface")).toHaveAttribute(
      "data-ux-data-surface-source-truth",
      "admin_tenant_db_readmodel",
    );
    await expect(page.getByTestId("admin-evidence-template-db-surface").getByText("Client onboarding KYC")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Investment suitability review" })).toBeVisible();

    await page.goto("/admin/export-templates?state=base");

    await expect(page.getByTestId("admin-export-template-db-surface")).toHaveAttribute(
      "data-ux-data-surface-source-truth",
      "admin_tenant_db_readmodel",
    );
    await expect(page.getByTestId("admin-export-template-db-surface").locator("table").getByText("Client onboarding pack")).toBeVisible();
    await expect(page.getByTestId("admin-export-template-db-surface").locator("table").getByText("Advisor Restricted")).toBeVisible();
  });

  test("tenant policy screen renders DB-backed tenant policy versions", async ({ page }) => {
    await page.goto("/tenants/morgan/policies?state=base");

    await expect(page.getByTestId("admin-tenant-policy-db-surface")).toHaveAttribute(
      "data-ux-data-surface-source-truth",
      "admin_tenant_db_readmodel",
    );
    await expect(page.getByTestId("admin-tenant-policy-db-surface").getByText("Morgan Family Office policy profile")).toBeVisible();
    await expect(page.getByTestId("admin-tenant-policy-db-surface").getByText("Morgan Family Office Privacy Notice")).toBeVisible();
    await expect(page.getByTestId("admin-tenant-policy-db-surface").getByText("Consent required for sensitive access")).toBeVisible();
    await expect(page.getByTestId("tenant-policy-version-state")).toContainText("Policy changes cannot bypass compliance release or audit");
    await expect(page.locator("main")).not.toContainText("Balanced Growth");
    await expect(page.locator("main")).not.toContainText("AlphaVest Global Default v2.4");
  });
});
