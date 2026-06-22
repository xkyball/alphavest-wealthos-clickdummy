import { execFileSync } from "node:child_process";
import "dotenv/config";
import { expect, test } from "@playwright/test";
import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";

test.describe("document upload browser flow", () => {
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

  test("uploads a file through the picker and survives reload", async ({ page }) => {
    const fileName = "playwright-upload-reload-proof.pdf";

    await page.goto("/documents/upload");
    await page.getByLabel("Tenant context").last().selectOption("morgan");
    await page.getByLabel("Role context").last().selectOption("family_cfo");
    await page.getByTestId("document-upload-file-input").setInputFiles({
      buffer: Buffer.from("%PDF-1.4\nPlaywright reload proof\n%%EOF"),
      mimeType: "application/pdf",
      name: fileName,
    });

    await page.getByTestId("real-upload-document").click();
    await expect(page.getByText(`${fileName} upload completed.`)).toBeVisible();
    await expect(page.getByText("Extraction review is the next step;")).toBeVisible();
    await expect(page.getByText("Evidence sufficiency, release and client visibility remain locked.")).toBeVisible();

    await page.reload();
    await expect(page.locator("p:visible, span:visible, td:visible, article:visible", { hasText: fileName }).first()).toBeVisible();

    await page.goto("/documents");
    await expect(page.locator("p:visible, span:visible, td:visible, article:visible", { hasText: fileName }).first()).toBeVisible();
  });

  test("reloads persisted uploads from the selected tenant context", async ({ page }) => {
    const fileName = "playwright-summit-tenant-reload-proof.pdf";

    await page.goto("/documents/upload");
    await page.getByLabel("Tenant context").last().selectOption("summit");
    await page.getByLabel("Role context").last().selectOption("family_cfo");
    await page.getByTestId("document-upload-file-input").setInputFiles({
      buffer: Buffer.from("%PDF-1.4\nPlaywright summit tenant proof\n%%EOF"),
      mimeType: "application/pdf",
      name: fileName,
    });

    await page.getByTestId("real-upload-document").click();
    await expect(page.getByText(`${fileName} upload completed.`)).toBeVisible();
    await expect(page.getByText("Evidence sufficiency, release and client visibility remain locked.")).toBeVisible();

    await page.reload();
    await expect(page.locator("p:visible, span:visible, td:visible, article:visible", { hasText: fileName }).first()).toBeVisible();

    await page.goto("/documents");
    await expect(page.locator("p:visible, span:visible, td:visible, article:visible", { hasText: fileName }).first()).toBeVisible();
    await expect(page.locator("td:visible", { hasText: "Summit Ridge Capital" }).first()).toBeVisible();

    await page.getByLabel("Tenant context").last().selectOption("morgan");
    await expect(page.locator("p:visible, span:visible, td:visible, article:visible", { hasText: fileName })).toHaveCount(0);
  });

  test("shows retry affordance after a blocked upload without creating sufficiency", async ({ page }) => {
    const fileName = "playwright-blocked-retry-proof.exe";

    await page.goto("/documents/upload");
    await page.getByLabel("Tenant context").last().selectOption("morgan");
    await page.getByLabel("Role context").last().selectOption("family_cfo");
    await page.getByTestId("document-upload-file-input").setInputFiles({
      buffer: Buffer.from("unsupported executable payload"),
      mimeType: "application/x-msdownload",
      name: fileName,
    });

    await page.getByTestId("real-upload-document").click();
    await expect(page.getByText("Upload blocked")).toBeVisible();
    await expect(page.getByText("supported_file_type_required").first()).toBeVisible();
    await expect(page.getByTestId("retry-upload-document")).toBeVisible();
    await expect(page.getByText("Evidence sufficiency, release and client visibility remain locked.")).toHaveCount(0);
  });

  test("accepts scoped evidence from extraction review without client release", async ({ page }) => {
    const fileName = "playwright-phase3-evidence-review-proof.pdf";

    await page.goto("/documents/upload");
    await page.getByLabel("Tenant context").last().selectOption("morgan");
    await page.getByLabel("Role context").last().selectOption("family_cfo");
    await page.getByTestId("document-upload-file-input").setInputFiles({
      buffer: Buffer.from("%PDF-1.4\nPlaywright phase 3 review proof\n%%EOF"),
      mimeType: "application/pdf",
      name: fileName,
    });

    await page.getByTestId("real-upload-document").click();
    await expect(page.getByText(`${fileName} upload completed.`)).toBeVisible();

    await page.goto("/documents/extraction-review");
    await page.getByLabel("Tenant context").last().selectOption("morgan");
    await page.getByLabel("Role context").last().selectOption("compliance_officer");
    await expect(page.getByText(fileName)).toBeVisible();

    await page.getByTestId("phase3-accept-sufficiency").click();
    await expect(page.getByText("Evidence accepted for this scoped gate. Release, export and client visibility remain locked.")).toBeVisible();
    await expect(page.getByText(/Evidence: Validated/)).toBeVisible();
    await expect(page.getByText(/Visibility: Redacted/)).toBeVisible();
  });
});
