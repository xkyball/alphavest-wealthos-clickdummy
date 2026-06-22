import { execFileSync } from "node:child_process";
import { expect, type Page, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";

async function authenticate(page: Page) {
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

test.describe("Prompt 04 sensitive confirmation lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    await authenticate(page);
  });

  test("release confirmation cannot submit while invalid and cancel performs no API mutation", async ({ page }) => {
    const workflowRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/demo-workflow")) {
        workflowRequests.push(request.method());
      }
    });

    await page.goto("/compliance/reviews/demo/release?state=release");

    const releaseDialog = page.getByRole("dialog", { name: "Release to client" });
    const lifecycle = page.getByTestId("uxp3-compliance-release-lifecycle");
    await expect(releaseDialog).toBeVisible();
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "idle");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "blocked-acknowledgement-required");
    await expect(lifecycle).toHaveAttribute("data-ux-no-overclaim", "true");
    await expect(page.getByTestId("j02-release-client")).toBeDisabled();
    await expect(page.getByTestId("j02-release-validation-state")).toContainText(
      "Release is blocked until the compliance acknowledgement is checked",
    );

    await releaseDialog.locator("input[type='checkbox']").check();
    await page.getByTestId("j02-release-confirmation").fill("CONFIRM");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "blocked-exact-phrase-required");
    await expect(page.getByTestId("j02-release-validation-state")).toContainText("exactly matches RELEASE TO CLIENT");
    await expect(page.getByTestId("j02-release-client")).toBeDisabled();

    await releaseDialog.getByRole("button", { name: "Cancel" }).click();
    await expect(releaseDialog).toBeHidden();
    expect(workflowRequests).toEqual([]);
  });

  test("valid release confirmation calls the API and shows success feedback", async ({ page }) => {
    await page.goto("/compliance/reviews/demo/release?state=release");

    const releaseDialog = page.getByRole("dialog", { name: "Release to client" });
    const lifecycle = page.getByTestId("uxp3-compliance-release-lifecycle");
    await expect(releaseDialog).toBeVisible();
    await releaseDialog.locator("input[type='checkbox']").check();
    await page.getByTestId("j02-release-confirmation").fill("RELEASE TO CLIENT");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "valid-confirmation");
    await expect(page.getByTestId("j02-release-validation-state")).toContainText("Confirmation is valid.");
    await expect(page.getByTestId("j02-release-client")).toHaveAttribute("data-ux-lifecycle-result", "submits-audited-release");

    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/demo-workflow") && response.request().method() === "POST",
    );

    await page.getByTestId("j02-release-client").click();
    const response = await responsePromise;
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.result.auditEventId).toBeTruthy();
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "success");
    await expect(releaseDialog.getByText("Released successfully")).toBeVisible();
    await expect(releaseDialog.getByText("Audit recorded:")).toBeVisible();
    await expect(page.getByTestId("j02-release-success-state")).toContainText(
      "export, download, share and client acceptance remain separate controls.",
    );
    await expect(releaseDialog.getByText(/client accepted|export approved|download ready|share ready/i)).toHaveCount(0);
  });

  test("request evidence confirmation requires controlled reason and phrase before submit", async ({ page }) => {
    await page.goto("/compliance/reviews/demo/block?state=base");

    await page.getByRole("button", { name: "Manage Block" }).click();
    const evidenceDialog = page.getByRole("dialog", { name: "Block or Request Evidence" });
    await expect(evidenceDialog).toBeVisible();
    await expect(page.getByTestId("j02-confirm-request-evidence")).toBeDisabled();

    await evidenceDialog.locator("input[type='checkbox']").check();
    await page.getByTestId("j02-request-evidence-confirmation").fill("REQUEST EVIDENCE");
    await expect(page.getByTestId("j02-confirm-request-evidence")).toBeDisabled();

    await evidenceDialog.getByRole("textbox").first().fill("Compliance needs refreshed source proof before release.");
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/demo-workflow") && response.request().method() === "POST",
    );

    await page.getByTestId("j02-confirm-request-evidence").click();
    const response = await responsePromise;
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.result.auditEventId).toBeTruthy();
    await expect(evidenceDialog.getByText("Evidence request persisted")).toBeVisible();
  });
});
