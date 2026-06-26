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

test.describe("UXP3-009 decision confirmation lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    await authenticate(page);
  });

  test("opens from a decision action and cancels without API mutation", async ({ page }) => {
    const workflowRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/advice-release-history/actions")) {
        workflowRequests.push(request.method());
      }
    });

    await page.goto("/decisions/demo?state=base");
    await expect(page.getByRole("dialog", { name: "Confirm client decision" })).toHaveCount(0);

    await page.getByTestId("j03-accept-option").click();

    const dialog = page.getByRole("dialog", { name: "Confirm client decision" });
    const lifecycle = page.getByTestId("uxp3-decision-confirmation-lifecycle");
    await expect(dialog).toBeVisible();
    await expect(lifecycle).toHaveAttribute("data-ux-decision-action", "accept");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "idle");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "blocked-acknowledgement-required");
    await expect(lifecycle).toHaveAttribute("data-ux-no-overclaim", "true");
    await expect(page.getByTestId("j03-confirm-decision")).toBeDisabled();

    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toBeHidden();
    expect(workflowRequests).toEqual([]);
  });

  test("requires exact confirmation and records only the selected decision action", async ({ page }) => {
    await page.goto("/decisions/demo?state=base");
    await page.getByTestId("j03-request-more-information").click();

    const dialog = page.getByRole("dialog", { name: "Confirm client decision" });
    const lifecycle = page.getByTestId("uxp3-decision-confirmation-lifecycle");
    await expect(dialog).toBeVisible();
    await expect(lifecycle).toHaveAttribute("data-ux-decision-action", "request_more_information");
    await expect(page.getByTestId("j03-confirm-decision")).toBeDisabled();

    await dialog.locator("input[type='checkbox']").check();
    await page.getByTestId("j03-decision-confirmation").fill("CONFIRM");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "blocked-exact-phrase-required");
    await expect(page.getByTestId("j03-confirm-decision")).toBeDisabled();

    await page.getByTestId("j03-decision-confirmation").fill("CONFIRM DECISION");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "valid-confirmation");
    await expect(page.getByTestId("j03-confirm-decision")).toHaveAttribute(
      "data-ux-lifecycle-result",
      "submits-audited-client-decision",
    );

    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/advice-release-history/actions") && response.request().method() === "POST",
    );

    await page.getByTestId("j03-confirm-decision").click();
    const response = await responsePromise;
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.result.auditEventId).toBeTruthy();
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "success");
    await expect(page.getByTestId("j03-decision-success-state")).toContainText("Request more information");
    await expect(page.getByTestId("j03-decision-success-state")).toContainText(
      "compliance release, evidence sufficiency, export/download/share and follow-up advice remain separate controls.",
    );
    await expect(dialog.getByText(/release complete|evidence sufficient|download ready|share ready|follow-up advice approved/i)).toHaveCount(0);
  });
});
