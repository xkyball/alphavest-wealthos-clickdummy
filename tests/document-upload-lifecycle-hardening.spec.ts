import { execFileSync } from "node:child_process";
import "dotenv/config";
import { expect, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";

test.describe("UXP3-006 document upload lifecycle hardening", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test.beforeEach(async ({ page }) => {
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
  });

  test("blocks upload until a source file is selected", async ({ page }) => {
    await page.goto("/documents/upload");

    const lifecycle = page.getByTestId("uxp3-document-upload-lifecycle");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "idle");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "blocked-file-required");
    await expect(lifecycle).toHaveAttribute("data-ux-no-overclaim", "true");
    await expect(page.getByTestId("real-upload-document")).toBeDisabled();
    await expect(page.getByTestId("document-upload-validation-state")).toContainText(
      "Upload remains blocked until a source file is selected.",
    );
    await expect(page.getByText("No evidence, audit, release, export or client visibility changes occur.")).toBeVisible();
  });

  test("keeps upload success scoped to pending review without release or export claims", async ({ page }) => {
    const fileName = "uxp3-006-upload-lifecycle-proof.pdf";

    await page.goto("/documents/upload");
    await page.getByLabel("Tenant context").last().selectOption("morgan");
    await page.getByLabel("Role context").last().selectOption("family_cfo");
    await page.getByTestId("document-upload-file-input").setInputFiles({
      buffer: Buffer.from("%PDF-1.4\nUXP3-006 lifecycle proof\n%%EOF"),
      mimeType: "application/pdf",
      name: fileName,
    });

    const lifecycle = page.getByTestId("uxp3-document-upload-lifecycle");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "valid-file-selected");
    await expect(page.getByTestId("real-upload-document")).toBeEnabled();
    await expect(page.getByTestId("document-upload-validation-state")).toContainText(
      "Upload creates pending internal evidence and audit only; upload complete means evidence review pending.",
    );

    await page.getByTestId("real-upload-document").click();
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "success");
    await expect(page.getByText(`${fileName} upload completed.`)).toBeVisible();
    await expect(page.getByText("Upload complete - evidence review pending.")).toBeVisible();
    await expect(page.getByText("Evidence sufficiency, release, export and client visibility remain locked.")).toBeVisible();
    await expect(page.getByText(/client accepted|released to client|export approved/i)).toHaveCount(0);
  });

  test("keeps blocked upload errors out of success lifecycle", async ({ page }) => {
    await page.goto("/documents/upload");
    await page.getByLabel("Tenant context").last().selectOption("morgan");
    await page.getByLabel("Role context").last().selectOption("family_cfo");
    await page.getByTestId("document-upload-file-input").setInputFiles({
      buffer: Buffer.from("unsupported payload"),
      mimeType: "application/x-msdownload",
      name: "uxp3-006-blocked-upload.exe",
    });

    await page.getByTestId("real-upload-document").click();
    await expect(page.getByTestId("uxp3-document-upload-lifecycle")).toHaveAttribute("data-ux-lifecycle-status", "error");
    await expect(page.getByText("Upload blocked")).toBeVisible();
    await expect(page.getByText("supported_file_type_required").first()).toBeVisible();
    await expect(page.getByTestId("retry-upload-document")).toBeVisible();
    await expect(page.getByText(/^Upload complete$/)).toHaveCount(0);
  });
});
