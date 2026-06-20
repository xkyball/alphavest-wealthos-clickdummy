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
});
