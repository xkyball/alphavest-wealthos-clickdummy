import { expect, test } from "@playwright/test";

test.describe("Phase 03 UI state boundaries", () => {
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
