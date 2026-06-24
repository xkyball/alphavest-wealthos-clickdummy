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

test.describe("UXP3-001 shared modal primitive lifecycle hardening", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page);
  });

  test("modal primitive exposes lifecycle contract without product overclaim", async ({ page }) => {
    await page.goto("/governance/roles/demo?state=base");

    await page.getByRole("button", { name: "Create scoped role" }).click();
    const drawer = page.getByRole("complementary", { name: "Portfolio Manager" });
    await expect(drawer).toBeVisible();

    const reviewScopedChanges = drawer.getByRole("button", { name: "Review scoped changes" });
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
    await expect(dialog.getByTestId("ux-phase10-modal-status")).toContainText(/recover context without submitting/i);
    await expect(dialog).not.toContainText(/client visibility unlocked|release complete|download ready|client accepted/i);
    await expect(dialog).toContainText("cannot release advice, mark evidence review complete, approve export or bypass audit persistence");
  });

  test("Escape and Cancel close the modal without mutating parent drawer state", async ({ page }) => {
    await page.goto("/governance/roles/demo?state=base");

    await page.getByRole("button", { name: "Create scoped role" }).click();
    const drawer = page.getByRole("complementary", { name: "Portfolio Manager" });
    const modalTrigger = drawer.getByRole("button", { name: "Review scoped changes" });
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

    expect(modalSource).toContain('data-ux-lifecycle-close={closeLifecycle}');
    expect(modalSource).toContain('"blocked-while-submitting"');
    expect(modalSource).toContain('data-ux-lifecycle-submit="owner-owned-confirmation-only"');
    expect(ownerSource).toContain('onClose={status === "submitting" ? undefined : resetAndClose}');
  });
});
