import { expect, test } from "@playwright/test";

test.describe("Phase 03 UI state boundaries", () => {
  test("client-facing routes fail closed for unreleased recommendation states", async ({ page }) => {
    await page.goto("/mobile");

    await expect(page.getByText("Recommendations blocked")).toBeVisible();
    await expect(page.getByText("Recommendations are blocked while compliance items are pending.")).toBeVisible();
    await expect(page.getByText("Complete compliance to unlock recommendations")).toBeVisible();
    await expect(page.getByText("AI Draft")).toHaveCount(0);
  });

  test("internal workflow separates advisor approval from compliance release", async ({ page }) => {
    await page.goto("/compliance/demo/review");

    await expect(page.getByText("Release Gates Summary")).toBeVisible();
    await expect(page.getByText(/Release is disabled until evidence, policy, reviewer and approver gates pass\./)).toBeVisible();

    await page.goto("/compliance/demo/release?state=release");
    await expect(page.getByText("Advisor approval alone is not enough.")).toBeVisible();
  });

  test("document upload state keeps upload separate from evidence sufficiency", async ({ page }) => {
    await page.goto("/documents/upload");

    await expect(page.getByText("Ready")).toBeVisible();
    await expect(page.getByText("Select a file to start document intake.")).toBeVisible();
    await expect(page.getByText("Extraction Pipeline")).toBeVisible();
    await expect(page.getByText("Your document will be scanned, validated and queued for human extraction review.")).toBeVisible();
    await expect(page.getByText("Evidence sufficiency complete")).toHaveCount(0);
    await expect(page.getByText("Client visibility unlocked")).toHaveCount(0);
  });

  test("export setup and preview states keep permission, redaction and approval separate", async ({ page }) => {
    await page.goto("/export/new");

    await expect(page.getByText("Export permission required")).toBeVisible();
    await expect(page.getByText("Export permission is required to configure and run exports. This demo state keeps the permission block visible.")).toBeVisible();
    await expect(page.getByText("Permission required", { exact: true })).toBeVisible();

    await page.goto("/export/demo/preview?state=approval");
    await expect(page.getByRole("dialog", { name: "Approve Export Package" })).toBeVisible();
    await expect(page.getByText("Approval confirmation")).toBeVisible();
    await expect(page.getByText("This demo approval records the approval step only. Download, share and client acceptance remain separate.")).toBeVisible();
  });

  test("export delivery state does not imply client acceptance", async ({ page }) => {
    await page.goto("/export/demo/download");

    await expect(page.getByText("Export approved for delivery")).toBeVisible();
    await expect(page.getByText("Download and share actions do not imply client acceptance or downstream advice execution.")).toBeVisible();
  });
});

test.describe("Phase 05 feedback no-overclaim boundaries", () => {
  test("release modal does not show release success before submit", async ({ page }) => {
    await page.goto("/compliance/demo/release?state=release");

    await expect(page.getByRole("dialog", { name: "Release to client" })).toBeVisible();
    await expect(page.getByText("Release action pending")).toBeVisible();
    await expect(page.getByText("Release has not been completed in this modal state.")).toBeVisible();
    await expect(page.getByText("Released successfully")).toHaveCount(0);
  });

  test("export approval copy separates approval from generation and delivery", async ({ page }) => {
    await page.goto("/export/demo/preview?state=approval");

    await expect(page.getByRole("dialog", { name: "Approve Export Package" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Confirm Export Approval" })).toBeVisible();
    await expect(page.getByText("Generation, download and share remain separate controlled steps.")).toBeVisible();
    await expect(page.getByText("This demo approval records the approval step only.")).toBeVisible();
  });

  test("audit-sensitive feedback states audit requirements rather than claiming persistence", async ({ page }) => {
    await page.goto("/governance/roles?state=confirm");

    await expect(page.getByRole("dialog", { name: "Confirm Sensitive Permission Changes" })).toBeVisible();
    await expect(page.getByText("This change requires audit logging before it can be accepted.")).toBeVisible();
    await expect(page.getByText("This change will be logged in the audit trail.")).toHaveCount(0);
  });

  test("decision success feedback avoids audit and evidence completeness overclaim", async ({ page }) => {
    await page.goto("/decisions/demo/success");

    await expect(page.getByText("The decision has been recorded for review. Audit persistence remains a controlled gate.")).toBeVisible();
    await expect(page.getByText("Recorded for Review", { exact: true })).toBeVisible();
    await expect(page.getByText("Audit gate pending")).toBeVisible();
    await expect(page.getByText("Evidence Package Queued")).toBeVisible();
    await expect(page.getByText("Evidence sufficiency still requires review and release gates.")).toBeVisible();
    await expect(page.getByText("immutable audit trail")).toHaveCount(0);
    await expect(page.getByText("A complete evidence package has been generated for this decision.")).toHaveCount(0);
  });

  test("static audit-facing panels describe audit requirements instead of persistence proof", async ({ page }) => {
    await page.goto("/workbench/triggers/demo");

    await expect(page.getByText("Audit logging required", { exact: true })).toBeVisible();
    await expect(page.getByText("Audit logging required before accepted save")).toBeVisible();
    await expect(page.getByText("All notes are audit logged")).toHaveCount(0);

    await page.goto("/tenants/demo/policies");
    await expect(page.getByText("Policy overrides require Compliance approval and audit confirmation before activation.")).toBeVisible();
    await expect(page.getByText("fully audited")).toHaveCount(0);
  });

  test("audit history and export delivery avoid persistence and binary-delivery overclaim", async ({ page }) => {
    await page.goto("/governance/audit-history");

    await expect(page.getByText("Audit persistence gate")).toBeVisible();
    await expect(page.getByText("Audit immutability depends on the retention and persistence gates; this view does not prove those gates by itself.")).toBeVisible();
    await expect(page.getByText("Showing 1-25 of 1,248 demo audit-event rows.")).toBeVisible();
    await expect(page.getByText("Read-only and immutable")).toHaveCount(0);
    await expect(page.getByText("tamper-evident")).toHaveCount(0);
    await expect(page.getByText("live events")).toHaveCount(0);

    await page.goto("/export/demo/download");
    await expect(page.getByText("Prepared")).toBeVisible();
    await expect(page.getByText("8.7 MB demo package metadata, delivery action pending")).toBeVisible();
    await expect(page.getByText("Audit logging still requires confirmation")).toBeVisible();
    await expect(page.getByText("downloaded May 21, 2025 09:45")).toHaveCount(0);
    await expect(page.getByText("Demo package scan marked clear")).toHaveCount(0);
  });
});
