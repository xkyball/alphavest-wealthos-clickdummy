import { execFileSync } from "node:child_process";
import "dotenv/config";
import { expect, test } from "@playwright/test";

test.describe("document upload browser flow", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
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
});
