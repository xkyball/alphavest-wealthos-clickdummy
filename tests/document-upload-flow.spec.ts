import { execFileSync } from "node:child_process";
import "dotenv/config";
import { expect, test, type Page } from "@playwright/test";
import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";

const actorSessionStorageKey = "alphavest.actorSession.v1";

async function setDemoSession(page: Page, tenantSlug: string, roleKey: string) {
  await page.addInitScript(
    ([storageKey, tenant, role]) => {
      window.localStorage.setItem(storageKey, JSON.stringify({ roleKey: role, tenantSlug: tenant }));
    },
    [actorSessionStorageKey, tenantSlug, roleKey],
  );
  await page.evaluate(
    ([storageKey, tenant, role]) => {
      window.localStorage.setItem(storageKey, JSON.stringify({ roleKey: role, tenantSlug: tenant }));
    },
    [actorSessionStorageKey, tenantSlug, roleKey],
  ).catch(() => undefined);
}

async function setUploadFile(page: Page, input: { buffer: Buffer; mimeType: string; name: string }) {
  await page.waitForLoadState("networkidle");
  await expect(page.getByTestId("document-upload-target-object")).toBeVisible();
  await page.getByTestId("document-upload-file-input").setInputFiles(input);

  if (input.mimeType === "application/pdf") {
    await expect(page.getByTestId("document-upload-validation-state")).toContainText("Ready to upload");
    await expect(page.getByTestId("real-upload-document")).toBeEnabled();
  }
}

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

    await setDemoSession(page, "morgan", "family_cfo");
    await page.goto("/documents/upload");
    await setUploadFile(page, {
      buffer: Buffer.from("%PDF-1.4\nPlaywright reload proof\n%%EOF"),
      mimeType: "application/pdf",
      name: fileName,
    });

    await page.getByTestId("real-upload-document").click();
    await expect(page.getByText(`${fileName} upload completed.`)).toBeVisible();
    await expect(page.getByText(fileName, { exact: true })).toBeVisible();
    await expect(page.getByText("Version: v1 of 1 · checksum evidence stored internally", { exact: true })).toBeVisible();
    await expect(page.getByText("Lifecycle: Extraction Pending", { exact: true })).toBeVisible();
    await expect(page.getByText("Evidence sufficiency, release, export and client visibility remain locked.")).toBeVisible();

    await page.reload();
    await expect(page.getByText(fileName, { exact: true })).toBeVisible();
    await expect(page.getByText("Version: v1 of 1 · checksum evidence stored internally", { exact: true })).toBeVisible();

    await page.goto("/documents");
    await expect(page.locator("p:visible, span:visible, td:visible, article:visible", { hasText: fileName }).first()).toBeVisible();
  });

  test("reloads persisted uploads from the selected tenant context", async ({ page }) => {
    const fileName = "playwright-summit-tenant-reload-proof.pdf";

    await setDemoSession(page, "summit", "family_cfo");
    await page.goto("/documents/upload");
    await setUploadFile(page, {
      buffer: Buffer.from("%PDF-1.4\nPlaywright summit tenant proof\n%%EOF"),
      mimeType: "application/pdf",
      name: fileName,
    });

    await page.getByTestId("real-upload-document").click();
    await expect(page.getByText(`${fileName} upload completed.`)).toBeVisible();
    await expect(page.getByText(fileName, { exact: true })).toBeVisible();
    await expect(page.getByText("Version: v1 of 1 · checksum evidence stored internally", { exact: true })).toBeVisible();
    await expect(page.getByText("Lifecycle: Extraction Pending", { exact: true })).toBeVisible();
    await expect(page.getByText("Evidence sufficiency, release, export and client visibility remain locked.")).toBeVisible();

    await page.reload();
    await expect(page.getByText(fileName, { exact: true })).toBeVisible();
    await expect(page.getByText("Version: v1 of 1 · checksum evidence stored internally", { exact: true })).toBeVisible();

    await page.goto("/documents");
    await expect(page.locator("p:visible, span:visible, td:visible, article:visible", { hasText: fileName }).first()).toBeVisible();
    await expect(page.locator("td:visible", { hasText: "Summit Ridge Capital" }).first()).toBeVisible();

    await setDemoSession(page, "morgan", "family_cfo");
    await page.goto("/documents");
    await expect(page.locator("p:visible, span:visible, td:visible, article:visible", { hasText: fileName })).toHaveCount(0);
  });

  test("shows retry affordance after a blocked upload without creating sufficiency", async ({ page }) => {
    const fileName = "playwright-blocked-retry-proof.exe";

    await setDemoSession(page, "morgan", "family_cfo");
    await page.goto("/documents/upload");
    await setUploadFile(page, {
      buffer: Buffer.from("unsupported executable payload"),
      mimeType: "application/x-msdownload",
      name: fileName,
    });

    await page.getByTestId("real-upload-document").click();
    await expect(page.getByText("Upload unavailable")).toBeVisible();
    await expect(page.getByText("supported_file_type_required").first()).toBeVisible();
    await expect(page.getByTestId("retry-upload-document")).toBeVisible();
    await expect(page.getByText("Evidence sufficiency, release, export and client visibility remain locked.")).toHaveCount(0);
  });

  test("accepts scoped evidence from extraction review without client release", async ({ page }) => {
    const fileName = "playwright-stage3-evidence-review-proof.pdf";

    await setDemoSession(page, "morgan", "family_cfo");
    await page.goto("/documents/upload");
    await setUploadFile(page, {
      buffer: Buffer.from("%PDF-1.4\nPlaywright stage 3 review proof\n%%EOF"),
      mimeType: "application/pdf",
      name: fileName,
    });

    await page.getByTestId("real-upload-document").click();
    await expect(page.getByText(`${fileName} upload completed.`)).toBeVisible();

    await setDemoSession(page, "morgan", "compliance_officer");
    await page.goto("/documents/review-queue");
    await expect(page.getByText(fileName)).toBeVisible();
    await expect(page.getByTestId("document-review-latest-card")).toContainText("Version: v1 of 1");
    await expect(page.getByTestId("document-review-latest-card")).toContainText("checksum evidence stored internally");

    await page.getByTestId("stage3-accept-sufficiency").click();
    await expect(page.getByText("Evidence accepted for this review check. Release, export and client visibility remain locked.")).toBeVisible();
    await expect(page.getByText("Lifecycle: Sufficient")).toBeVisible();
    await expect(page.getByText(/Evidence: Validated/)).toBeVisible();
    await expect(page.getByText(/Visibility: Redacted/)).toBeVisible();
  });

  test("renders clarification as insufficient without client release", async ({ page }) => {
    const fileName = "playwright-stage3-clarification-proof.pdf";

    await setDemoSession(page, "morgan", "family_cfo");
    await page.goto("/documents/upload");
    await setUploadFile(page, {
      buffer: Buffer.from("%PDF-1.4\nPlaywright stage 3 clarification proof\n%%EOF"),
      mimeType: "application/pdf",
      name: fileName,
    });

    await page.getByTestId("real-upload-document").click();
    await expect(page.getByText(`${fileName} upload completed.`)).toBeVisible();

    await setDemoSession(page, "morgan", "analyst");
    await page.goto("/documents/review-queue");
    await expect(page.getByText(fileName)).toBeVisible();

    await page.getByTestId("stage3-request-clarification").click();
    await expect(page.getByText("Clarification requested. Evidence is insufficient and release, export and client visibility remain locked.")).toBeVisible();
    await expect(page.getByText("Lifecycle: Insufficient")).toBeVisible();
  });
});
