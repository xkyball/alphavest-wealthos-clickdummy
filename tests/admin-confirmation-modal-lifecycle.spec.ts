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

test.describe("UXP3-004 admin confirmation modal lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page);
  });

  test("platform confirmation validates exact phrase and records the guarded change", async ({ page }) => {
    await page.goto("/admin/platform?state=base");

    await page.getByRole("button", { name: "Save changes" }).click();
    const dialog = page.getByRole("dialog", { name: "Confirm critical change" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("data-ux-interaction-lifecycle", "modal");
    await expect(dialog).toHaveAttribute("data-ux-lifecycle-cancel", "no-submit-no-mutation");
    await expect(dialog.getByTestId("uxp3-admin-confirmation-lifecycle")).toHaveAttribute("data-ux-lifecycle-validation", "exact-phrase-required");
    await expect(dialog.getByRole("button", { name: "Confirm change" })).toBeDisabled();
    await expect(dialog).toContainText("Confirm remains blocked until the exact phrase is entered.");

    await dialog.getByPlaceholder("Type the exact phrase above").fill("I understand the impact of this change");
    await expect(dialog.getByTestId("uxp3-admin-confirmation-lifecycle")).toHaveAttribute("data-ux-lifecycle-validation", "exact-phrase-matched");
    await expect(dialog.getByRole("button", { name: "Confirm change" })).toBeEnabled();

    await dialog.getByRole("button", { name: "Confirm change" }).click();
    await expect(dialog).toContainText("Change recorded");
    await expect(dialog).toContainText("Audit retention saved. Audit trail updated; client visibility and release state remain unchanged.");
    await expect(dialog.getByRole("button", { name: "Confirm change" })).toHaveAttribute("data-ux-lifecycle-result", "authorized-command-recorded");
    await expect(page).toHaveURL(/\/admin\/platform\?state=base$/);
    await expect(dialog).not.toContainText(/admin override|client visibility unlocked|release complete|evidence sufficient|download ready|audit suppressed/i);

    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/\/admin\/platform\?state=base$/);
  });

  test("security confirmation supports Escape and records policy after exact phrase", async ({ page }) => {
    await page.goto("/admin/security?state=base");

    await page.getByRole("button", { name: "Save changes" }).click();
    let dialog = page.getByRole("dialog", { name: "Confirm critical security change" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Security changes require exact-phrase validation");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/\/admin\/security\?state=base$/);

    await page.getByRole("button", { name: "Save changes" }).click();
    dialog = page.getByRole("dialog", { name: "Confirm critical security change" });
    await expect(dialog).toBeVisible();
    await dialog.getByPlaceholder("Type the exact phrase above").fill("CONFIRM SECURITY POLICY");
    await dialog.getByRole("button", { name: "Confirm change" }).click();

    await expect(dialog).toContainText("Change recorded");
    await expect(dialog).toContainText("Security configuration saved. Audit trail updated; client visibility and release state remain unchanged.");
    await expect(page).toHaveURL(/\/admin\/security\?state=base$/);
    await expect(dialog).not.toContainText(/admin override|client visibility unlocked|release complete|evidence sufficient|download ready|audit suppressed/i);
  });

  test("admin confirmation source keeps sensitive saves behind confirmation and typed commands", () => {
    const source = readFileSync("components/admin-tenant-setup-screen.tsx", "utf8");

    expect(source).toContain('data-testid="uxp3-admin-confirmation-lifecycle"');
    expect(source).toContain('"j10.saveSecurity"');
    expect(source).toContain('"j10.savePlatform"');
    expect(source).toContain("Exact phrase matched. Confirming records the guarded change and audit trail.");
    expect(source).toContain("Audit trail updated; client visibility and release state remain unchanged.");
  });
});
