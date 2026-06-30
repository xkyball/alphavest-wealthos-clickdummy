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
    id: stableId(`export-download-lifecycle:${label}`),
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

async function prepareGeneratedExport(request: APIRequestContext) {
  const exportRequestId = await prepareApprovedExport(request);
  const response = await exportCommand(request, {
    command: "GENERATE",
    exportRequestId,
    payload: safeExportPayload,
    reason: "Prepare generate before controlled download.",
    redactionProfile: "client-safe-redacted",
    roleKey: "compliance_officer",
    tenantSlug: "bennett",
  });
  const body = await response.json();

  expect(response.ok(), `GENERATE: ${JSON.stringify(body)}`).toBe(true);
}

async function prepareApprovedExport(request: APIRequestContext) {
  const scope = await exportCommand(request, {
    command: "SET_SCOPE",
    reason: "Select client-safe released objects for export download lifecycle proof.",
    redactionProfile: "client-safe-redacted",
    roleKey: "compliance_officer",
    scopeItems: [safeScopeItem("generated-download")],
    tenantSlug: "bennett",
  });
  const scopeBody = await scope.json();

  expect(scope.ok(), JSON.stringify(scopeBody)).toBe(true);

  const exportRequestId = scopeBody.exportRequestId as string;
  for (const command of ["VALIDATE_REDACTION", "PREVIEW", "APPROVE"] as const) {
    const response = await exportCommand(request, {
      command,
      exportRequestId,
      payload: safeExportPayload,
      reason: `Prepare ${command.toLowerCase()} before controlled download.`,
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "bennett",
    });
    const body = await response.json();

    expect(response.ok(), `${command}: ${JSON.stringify(body)}`).toBe(true);
  }

  return exportRequestId;
}

test.describe("UXP3-015 export download confirmation lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    await authenticate(page);
  });

  test("opens download confirmation without workflow mutation and cancels safely", async ({ page, request }) => {
    const mutationRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/export-workflow") && request.method() !== "GET") {
        mutationRequests.push(request.method());
      }
    });

    await prepareGeneratedExport(request);
    await page.goto("/export/client-package/download?state=base");
    await expect(page.getByRole("dialog", { name: "Package Download" })).toHaveCount(0);

    const trigger = page.getByTestId("j08-open-download-confirmation");
    await expect(trigger).toHaveAttribute("data-ux-lifecycle-trigger", "export-download-confirmation-modal");
    await expect(trigger).toHaveAttribute("data-ux-lifecycle-result", "opens-export-download-confirmation");
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Package Download" });
    const lifecycle = page.getByTestId("uxp3-export-download-lifecycle");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("data-ux-interaction-lifecycle", "modal");
    await expect(dialog).toHaveAttribute("data-ux-lifecycle-cancel", "no-submit-no-mutation");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "idle");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "download-review-required");
    await expect(lifecycle).toHaveAttribute("data-ux-no-overclaim", "true");
    await expect(page.getByTestId("j08-download-export")).toBeDisabled();

    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    expect(mutationRequests).toEqual([]);
  });

  test("records package generation as a separate step before download", async ({ page, request }) => {
    await prepareApprovedExport(request);
    await page.goto("/export/client-package/download?state=base");

    const generate = page.getByTestId("j08-generate-export-package");
    await expect(generate).toHaveAttribute("data-ux-action-meaning", "export_generate");
    await expect(page.getByTestId("j08-open-download-confirmation")).toBeDisabled();

    await page.route("**/api/export-workflow", async (route) => {
      const payload = route.request().postDataJSON() as { command: string };
      expect(payload.command).toBe("GENERATE");
      await route.continue();
    });

    await generate.click();
    await expect(page.getByTestId("j08-export-generation-success-state")).toContainText("Export package generation was recorded.");
  });

  test("requires acknowledgement and records only the controlled download event", async ({ page, request }) => {
    await prepareGeneratedExport(request);
    await page.goto("/export/client-package/download?state=base");
    await page.getByTestId("j08-open-download-confirmation").click();

    const dialog = page.getByRole("dialog", { name: "Package Download" });
    const lifecycle = page.getByTestId("uxp3-export-download-lifecycle");
    await expect(dialog).toBeVisible();
    await expect(page.getByTestId("j08-export-download-validation-state")).toContainText(
      "Tick the box to enable download.",
    );

    await dialog.locator("input[type='checkbox']").check();
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "valid-export-download-review");
    await expect(page.getByTestId("j08-download-export")).toHaveAttribute(
      "data-ux-lifecycle-result",
      "submits-controlled-download-only",
    );

    await page.route("**/api/export-workflow", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 150));
      await route.continue();
    });

    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/export-workflow") && response.request().method() === "POST",
    );

    await page.getByTestId("j08-download-export").click();
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "loading");
    const response = await responsePromise;
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "success");
    await expect(page.getByTestId("j08-export-download-success-state")).toContainText(
      "secure share, client acceptance and advice release remain separate controls.",
    );
    await expect(page).toHaveURL(/\/export\/demo\/download\?state=base$/);
    await expect(
      dialog.getByText(/share created|share link ready|client accepted|recipient accepted|advice released/i),
    ).toHaveCount(0);
  });

  test("blocks opening download when package generation is missing", async ({ page }) => {
    await page.goto("/export/client-package/download?state=base");

    await expect(page.getByTestId("j08-open-download-confirmation")).toBeDisabled();
    await expect(page.getByTestId("j08-open-download-confirmation")).toHaveAttribute("data-ux-action-availability", "disabled");
    await expect(page.getByRole("dialog", { name: "Package Download" })).toHaveCount(0);
    await expect(page).toHaveURL(/\/export\/demo\/download\?state=base$/);
  });

  test("Escape closes download confirmation without submitting", async ({ page, request }) => {
    const mutationRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/export-workflow") && request.method() !== "GET") {
        mutationRequests.push(request.method());
      }
    });

    await prepareGeneratedExport(request);
    await page.goto("/export/client-package/download?state=base");
    await page.getByTestId("j08-open-download-confirmation").click();

    const dialog = page.getByRole("dialog", { name: "Package Download" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    expect(mutationRequests).toEqual([]);
  });
});
