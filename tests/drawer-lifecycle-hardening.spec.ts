import { expect, type Page, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import { authenticatePageWithJwt } from "./helpers/auth-jwt";

async function authenticate(page: Page, request: Parameters<typeof authenticatePageWithJwt>[1]) {
  await authenticatePageWithJwt(page, request, { email: "ava.admin@alphavest.demo" });
}

test.describe("UXP3-002 shared drawer primitive lifecycle hardening", () => {
  test.beforeEach(async ({ page, request }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page, request);
  });

  test("drawer primitive exposes lifecycle contract without product overclaim", async ({ page }) => {
    await page.goto("/governance/roles/portfolio-manager?state=base");

    const trigger = page.getByTestId("j07-open-role-drawer");
    await trigger.click();

    const drawer = page.getByRole("complementary", { name: "Portfolio Manager" });
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("data-ux-interaction-lifecycle", "drawer");
    await expect(drawer).toHaveAttribute("data-ux-lifecycle-open", "controlled-by-owner-state");
    await expect(drawer).toHaveAttribute("data-ux-lifecycle-close", "escape-backdrop-close-button-safe");
    await expect(drawer).toHaveAttribute("data-ux-lifecycle-cancel", "no-submit-no-mutation");
    await expect(drawer).toHaveAttribute("data-ux-lifecycle-submit", "owner-owned-where-present");
    await expect(drawer).toHaveAttribute("data-ux-lifecycle-status", "owner-handles-validation-loading-success-error-blocked");
    await expect(drawer).toHaveAttribute("data-ux-no-overclaim", "true");
    await expect(drawer).toHaveAttribute("data-ux-capture-file-kind", "drawer");
    await expect(drawer).toHaveAttribute("data-ux-capture-is-overlay", "true");
    await expect(drawer).toHaveAttribute("data-ux-capture-state-label", "drawer");
    await expect(drawer).toHaveAttribute("data-ux-capture-variant-kind", "drawer");
    await expect(drawer.getByTestId("ux-stage10-drawer-status")).toContainText(/recover context without submitting/i);
    await expect(drawer).not.toContainText(/client visibility unlocked|release complete|download ready|client accepted/i);
    await expect(drawer).toContainText("Sensitive permission changes stay role-limited and require confirmation plus audit logging.");
  });

  test("Escape, backdrop and Cancel close the drawer without submitting", async ({ page }) => {
    await page.goto("/governance/roles/portfolio-manager?state=base");

    const trigger = page.getByTestId("j07-open-role-drawer");
    await trigger.focus();
    await trigger.click();
    let drawer = page.getByRole("complementary", { name: "Portfolio Manager" });
    await expect(drawer).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    drawer = page.getByRole("complementary", { name: "Portfolio Manager" });
    await expect(drawer).toBeVisible();
    await page.mouse.click(24, 24);
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    drawer = page.getByRole("complementary", { name: "Portfolio Manager" });
    await expect(drawer).toBeVisible();
    await drawer.getByRole("button", { name: "Discard changes" }).click();
    await expect(drawer).toBeHidden();
    await expect(page.getByRole("dialog", { name: "Confirm Sensitive Permission Changes" })).toHaveCount(0);
  });

  test("drawer source keeps close blocking available to owner workflows", () => {
    const drawerSource = readFileSync("components/ui/drawer.tsx", "utf8");
    const ownerSource = readFileSync("components/decisions-governance-screen.tsx", "utf8");
    const contractSource = readFileSync("lib/ux-lifecycle-state-contract.ts", "utf8");

    expect(drawerSource).toContain('uxLifecycleAttributesForKind("drawer"');
    expect(drawerSource).toContain("{...lifecycleAttributes}");
    expect(contractSource).toContain('"data-ux-lifecycle-close": uxLifecycleCloseForOwner(kind, options.closeAvailable)');
    expect(contractSource).toContain('"blocked-while-submitting"');
    expect(contractSource).toContain('submit: "owner-owned-where-present"');
    expect(ownerSource).toContain("function closeRoleDrawer()");
    expect(ownerSource).toContain('onClose={status === "submitting" ? undefined : closeRoleDrawer}');
  });
});
