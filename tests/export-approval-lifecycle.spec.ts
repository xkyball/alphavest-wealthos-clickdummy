import { execFileSync } from "node:child_process";
import { expect, type APIRequestContext, type Page, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";
import { stableId } from "../lib/stable-id";

const safeExportPayload = {
  clientSummary: "Released client-safe export summary.",
  decisionState: "Released",
  releasedAt: "2026-06-24T00:00:00.000Z",
  status: "RELEASED_TO_CLIENT",
  title: "Liquidity governance decision",
};

function safeScopeItem(label: string) {
  return {
    access: "Allowed",
    id: stableId(`export-approval-lifecycle:${label}`),
    name: "Released client-safe decision summary",
    payloadClassifications: ["CLIENT_SAFE_SUMMARY", "RELEASED_EVIDENCE_SUMMARY"],
    selected: true,
    type: "DECISION",
  };
}

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

async function exportCommand(request: APIRequestContext, data: Record<string, unknown>) {
  return request.post("/api/export-workflow", { data });
}

async function prepareApprovalRequiredExport(request: APIRequestContext) {
  const scope = await exportCommand(request, {
    command: "SET_SCOPE",
    reason: "Select client-safe released objects for export approval lifecycle proof.",
    redactionProfile: "client-safe-redacted",
    roleKey: "compliance_officer",
    scopeItems: [safeScopeItem("approval-required")],
    tenantSlug: "bennett",
  });
  const scopeBody = await scope.json();

  expect(scope.ok(), JSON.stringify(scopeBody)).toBe(true);

  const exportRequestId = scopeBody.exportRequestId as string;
  for (const command of ["VALIDATE_REDACTION", "PREVIEW"] as const) {
    const response = await exportCommand(request, {
      command,
      exportRequestId,
      payload: safeExportPayload,
      reason: `Prepare ${command.toLowerCase()} before export approval lifecycle proof.`,
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "bennett",
    });
    const body = await response.json();

    expect(response.ok(), `${command}: ${JSON.stringify(body)}`).toBe(true);
  }
}

test.describe("UXP3-014 export approval lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    await authenticate(page);
  });

  test("opens approval modal without workflow mutation and cancels safely", async ({ page }) => {
    const workflowRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/export-workflow")) {
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

  test("requires acknowledgement and records only the typed approval event", async ({ page, request }) => {
    await prepareApprovalRequiredExport(request);
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

    await page.route("**/api/export-workflow", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 150));
      await route.continue();
    });

    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/export-workflow") && response.request().method() === "POST",
    );

    await page.getByTestId("j08-confirm-approval").click();
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "loading");
    const response = await responsePromise;
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "success");
    await expect(page.getByTestId("j08-export-approval-success-state")).toContainText(
      "generation, download, share, client acceptance and advice release remain separate controls.",
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

    await page.route("**/api/export-workflow", async (route) => {
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
      if (request.url().includes("/api/export-workflow")) {
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
