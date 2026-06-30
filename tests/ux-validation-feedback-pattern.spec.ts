import { expect, type Page, test } from "@playwright/test";
import { readFileSync } from "node:fs";

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

test.describe("E06 validation feedback pattern", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page);
  });

  test("centralizes validation summary and field feedback primitives", () => {
    const validationSource = readFileSync("components/ui/validation-feedback.tsx", "utf8");
    const uiIndexSource = readFileSync("components/ui/index.ts", "utf8");
    const uploadSource = readFileSync("components/client-intake-screen.tsx", "utf8");
    const releaseSource = readFileSync("components/internal-workflow-screen.tsx", "utf8");
    const exportSource = readFileSync("components/communication-export-ops-screen.tsx", "utf8");

    expect(validationSource).toContain("uxFeedbackAttributesFor");
    expect(validationSource).toContain("data-ux-validation-summary");
    expect(validationSource).toContain("data-ux-field-feedback");
    expect(uiIndexSource).toContain("validation-feedback");

    expect(uploadSource).toContain("<NoOverclaimFeedback");
    expect(releaseSource).toContain("<FieldFeedback");
    expect(exportSource).toContain('placement: "modal_status"');
    expect(exportSource).toContain('subject: "export_approval"');
    expect(exportSource).toContain('subject: "download"');
  });

  test("projects upload validation summary through the E06 contract", async ({ page }) => {
    await page.goto("/documents/upload");

    const validation = page.getByTestId("document-upload-validation-state");

    await expect(validation).toHaveAttribute("data-ux-validation-summary", "true");
    await expect(validation).toHaveAttribute("data-ux-feedback-subject", "upload");
    await expect(validation).toHaveAttribute("data-ux-feedback-intent", "validation");
    await expect(validation).toHaveAttribute("data-ux-feedback-placement", "page_state");
    await expect(validation).toHaveAttribute("data-ux-feedback-boundary", "uploadOnly");
    await expect(validation).toContainText("No evidence, audit, release, export or client visibility changes occur.");
  });

  test("projects release field feedback and modal validation through the E06 contract", async ({ page }) => {
    await page.goto("/compliance/reviews/liquidity-release/release?state=release");

    const fieldFeedback = page.getByTestId("ux-field-feedback");
    const validationState = page.getByTestId("j02-release-validation-state");

    await expect(fieldFeedback).toHaveAttribute("data-ux-field-feedback", "true");
    await expect(fieldFeedback).toHaveAttribute("data-ux-feedback-subject", "compliance_release");
    await expect(fieldFeedback).toHaveAttribute("data-ux-feedback-placement", "field");
    await expect(fieldFeedback).toHaveAttribute("data-ux-feedback-boundary", "complianceReleaseNotClientAcceptance");

    await expect(validationState).toHaveAttribute("data-ux-feedback-subject", "compliance_release");
    await expect(validationState).toHaveAttribute("data-ux-feedback-intent", "validation");
    await expect(validationState).toHaveAttribute("data-ux-feedback-placement", "modal_status");
  });

  test("projects export approval and download modal validation through E06 feedback metadata", async ({ page }) => {
    await page.goto("/export/client-package/approval?state=approval");
    await expect(page.getByRole("dialog", { name: "Approve Package" })).toBeVisible();
    await expect(page.getByTestId("j08-export-approval-validation-state")).toHaveAttribute("data-ux-feedback-subject", "export_approval");
    await expect(page.getByTestId("j08-export-approval-validation-state")).toHaveAttribute("data-ux-feedback-placement", "modal_status");

    await page.goto("/export/client-package/download?state=confirm");
    await expect(page.getByRole("dialog", { name: "Package Download" })).toBeVisible();
    await expect(page.getByTestId("j08-export-download-validation-state")).toHaveAttribute("data-ux-feedback-subject", "download");
    await expect(page.getByTestId("j08-export-download-validation-state")).toHaveAttribute("data-ux-feedback-placement", "modal_status");
  });
});
