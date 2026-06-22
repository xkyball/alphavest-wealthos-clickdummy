import { execFileSync } from "node:child_process";
import { expect, type Page, test } from "@playwright/test";

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

test.describe("UXP3-014 export approval lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    await authenticate(page);
  });

  test("opens approval modal without workflow mutation and cancels safely", async ({ page }) => {
    const workflowRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/demo-workflow")) {
        workflowRequests.push(request.method());
      }
    });

    await page.goto("/export/demo/approval?state=base");
    await expect(page.getByRole("dialog", { name: "Approve Export Package" })).toHaveCount(0);
    await expect(page.getByTestId("uxp3-export-preview-step-separation")).toHaveAttribute("data-ux-no-overclaim", "true");

    const trigger = page.getByTestId("j08-open-export-approval");
    await expect(trigger).toHaveAttribute("data-ux-lifecycle-trigger", "export-approval-modal");
    await expect(trigger).toHaveAttribute("data-ux-lifecycle-result", "opens-export-approval-modal");
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Approve Export Package" });
    const lifecycle = page.getByTestId("uxp3-export-approval-lifecycle");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("data-ux-interaction-lifecycle", "modal");
    await expect(dialog).toHaveAttribute("data-ux-lifecycle-cancel", "no-submit-no-mutation");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "idle");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "blocked-acknowledgement-required");
    await expect(lifecycle).toHaveAttribute("data-ux-no-overclaim", "true");
    await expect(page.getByTestId("j08-confirm-approval")).toBeDisabled();

    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    expect(workflowRequests).toEqual([]);
  });

  test("requires acknowledgement and records only approval plus metadata generation", async ({ page, request }) => {
    for (const actionId of ["j08.selectDataExtract", "j08.clearScope"]) {
      const setupResponse = await request.post("/api/demo-workflow", { data: { actionId } });
      const setupBody = await setupResponse.json();

      expect(setupResponse.ok(), `${actionId}: ${JSON.stringify(setupBody)}`).toBe(true);
    }

    await page.goto("/export/demo/approval?state=base");
    await page.getByTestId("j08-open-export-approval").click();

    const dialog = page.getByRole("dialog", { name: "Approve Export Package" });
    const lifecycle = page.getByTestId("uxp3-export-approval-lifecycle");
    await expect(dialog).toBeVisible();
    await expect(page.getByTestId("j08-export-approval-validation-state")).toContainText(
      "Export approval remains blocked until the scoped approval acknowledgement is checked.",
    );

    await dialog.locator("input[type='checkbox']").check();
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "valid-export-approval-review");
    await expect(page.getByTestId("j08-confirm-approval")).toHaveAttribute(
      "data-ux-lifecycle-result",
      "submits-export-approval-only",
    );

    await page.route("**/api/demo-workflow", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 150));
      await route.continue();
    });

    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/demo-workflow") && response.request().method() === "POST",
    );

    await page.getByTestId("j08-confirm-approval").click();
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "loading");
    const response = await responsePromise;
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "success");
    await expect(page.getByTestId("j08-export-approval-success-state")).toContainText(
      "download, share, client acceptance and advice release remain separate controls.",
    );
    await expect(page).toHaveURL(/\/export\/demo\/approval\?state=base$/);
    await expect(
      dialog.getByText(
        /download ready|download complete|share created|client accepted|recipient accepted|advice released/i,
      ),
    ).toHaveCount(0);
  });

  test("shows fail-closed error feedback without downstream delivery overclaim", async ({ page }) => {
    await page.goto("/export/demo/approval?state=base");
    await page.getByTestId("j08-open-export-approval").click();

    const dialog = page.getByRole("dialog", { name: "Approve Export Package" });
    const lifecycle = page.getByTestId("uxp3-export-approval-lifecycle");
    await dialog.locator("input[type='checkbox']").check();

    await page.route("**/api/demo-workflow", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        status: 409,
        body: JSON.stringify({
          error: "Audit persistence unavailable.",
          mutated: false,
          noClientRelease: true,
        }),
      });
    });

    await page.getByTestId("j08-confirm-approval").click();
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "error");
    await expect(page.getByTestId("j08-export-approval-error-state")).toContainText(
      "No download, share, client acceptance or advice release change was completed.",
    );
    await expect(page).toHaveURL(/\/export\/demo\/approval\?state=base$/);
  });

  test("Escape closes approval modal without submitting", async ({ page }) => {
    const workflowRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/demo-workflow")) {
        workflowRequests.push(request.method());
      }
    });

    await page.goto("/export/demo/approval?state=base");
    await page.getByTestId("j08-open-export-approval").click();

    const dialog = page.getByRole("dialog", { name: "Approve Export Package" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    expect(workflowRequests).toEqual([]);
  });
});
