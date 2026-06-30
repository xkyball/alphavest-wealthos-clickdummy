import { expect, type Page, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import { localAuthSessionCookieName } from "../lib/auth/local-auth-session";

async function authenticate(page: Page) {
  await page.context().addCookies([
    {
      domain: "127.0.0.1",
      httpOnly: true,
      name: localAuthSessionCookieName,
      path: "/",
      sameSite: "Lax",
      value: "av-session-playwright-authenticated",
    },
  ]);
}

test.describe("UXP3-001 shared modal primitive lifecycle hardening", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page);
  });

  test("modal primitive exposes lifecycle contract without product overclaim", async ({ page }) => {
    await page.goto("/governance/roles/portfolio-manager?state=base");

    await page.getByRole("button", { name: "Create permitted role" }).click();
    const drawer = page.getByRole("complementary", { name: "Portfolio Manager" });
    await expect(drawer).toBeVisible();

    const reviewScopedChanges = drawer.getByRole("button", { name: "Review permitted changes" });
    await expect(reviewScopedChanges).toBeDisabled();
    await drawer.locator("input[type='checkbox']").check();
    await expect(reviewScopedChanges).toBeEnabled();
    await reviewScopedChanges.click();
    const dialog = page.getByRole("dialog", { name: "Confirm Sensitive Permission Changes" });

    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("data-ux-interaction-lifecycle", "modal");
    await expect(dialog).toHaveAttribute("data-ux-lifecycle-open", "controlled-by-owner-state");
    await expect(dialog).toHaveAttribute("data-ux-lifecycle-close", "escape-backdrop-close-button-safe");
    await expect(dialog).toHaveAttribute("data-ux-lifecycle-cancel", "no-submit-no-mutation");
    await expect(dialog).toHaveAttribute("data-ux-lifecycle-submit", "owner-owned-confirmation-only");
    await expect(dialog).toHaveAttribute("data-ux-lifecycle-status", "owner-handles-validation-loading-success-error-blocked");
    await expect(dialog).toHaveAttribute("data-ux-no-overclaim", "true");
    await expect(dialog).toHaveAttribute("data-ux-capture-file-kind", "modal");
    await expect(dialog).toHaveAttribute("data-ux-capture-is-overlay", "true");
    await expect(dialog).toHaveAttribute("data-ux-capture-state-label", "modal");
    await expect(dialog).toHaveAttribute("data-ux-capture-variant-kind", "modal");
    await expect(dialog.getByTestId("ux-stage10-modal-status")).toContainText(/recover context without submitting/i);
    await expect(dialog).not.toContainText(/client visibility unlocked|release complete|download ready|client accepted/i);
    await expect(dialog).toContainText("cannot release advice, mark evidence review complete, approve export or bypass audit persistence");
  });

  test("Escape and Cancel close the modal without mutating parent drawer state", async ({ page }) => {
    await page.goto("/governance/roles/portfolio-manager?state=base");

    await page.getByRole("button", { name: "Create permitted role" }).click();
    const drawer = page.getByRole("complementary", { name: "Portfolio Manager" });
    const modalTrigger = drawer.getByRole("button", { name: "Review permitted changes" });
    await expect(drawer).toBeVisible();
    await expect(modalTrigger).toBeDisabled();
    await drawer.locator("input[type='checkbox']").check();
    await expect(modalTrigger).toBeEnabled();

    await modalTrigger.click();
    let dialog = page.getByRole("dialog", { name: "Confirm Sensitive Permission Changes" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(drawer).toBeVisible();
    await expect(modalTrigger).toBeVisible();

    await modalTrigger.click();
    dialog = page.getByRole("dialog", { name: "Confirm Sensitive Permission Changes" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toBeHidden();
    await expect(drawer).toBeVisible();
    await expect(modalTrigger).toBeVisible();
  });

  test("modal source keeps close blocking delegated to owner submitting state", () => {
    const modalSource = readFileSync("components/ui/modal.tsx", "utf8");
    const ownerSource = readFileSync("components/internal-workflow-screen.tsx", "utf8");
    const contractSource = readFileSync("lib/ux-lifecycle-state-contract.ts", "utf8");

    expect(modalSource).toContain('uxLifecycleAttributesForKind("modal"');
    expect(modalSource).toContain("{...lifecycleAttributes}");
    expect(contractSource).toContain('"data-ux-lifecycle-close": uxLifecycleCloseForOwner(kind, options.closeAvailable)');
    expect(contractSource).toContain('"blocked-while-submitting"');
    expect(contractSource).toContain('submit: "owner-owned-confirmation-only"');
    expect(ownerSource).toContain('onClose={status === "submitting" ? undefined : resetAndClose}');
  });
});
