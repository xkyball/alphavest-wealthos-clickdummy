import { execFileSync } from "node:child_process";
import { expect, type Page, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import { localAuthSessionCookieName } from "../lib/auth/local-auth-session";
import { routeToSmokePath, screenRoutes } from "../lib/route-registry";

const tenantUsersRoute = screenRoutes.find((route) => route.pageId === "018");

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

test.describe("UXP3-005 invite user drawer lifecycle", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page);
  });

  test("invite trigger opens drawer with explicit lifecycle and no-overclaim copy", async ({ page }) => {
    expect(tenantUsersRoute).toBeDefined();
    await page.goto(`${routeToSmokePath(tenantUsersRoute!.route)}?state=base`);

    const trigger = page.getByRole("button", { name: "Invite user" });
    await expect(trigger).toHaveAttribute("data-ux-lifecycle-trigger", "invite-user-drawer");
    await expect(trigger).toHaveAttribute("data-ux-lifecycle-result", "opens-invite-user-drawer");
    await trigger.click();

    const drawer = page.getByRole("complementary", { name: "Invite User" });
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("data-ux-interaction-lifecycle", "drawer");
    await expect(drawer).toHaveAttribute("data-ux-lifecycle-cancel", "no-submit-no-mutation");
    await expect(drawer).toHaveAttribute("data-ux-lifecycle-submit", "owner-owned-where-present");
    await expect(drawer.getByTestId("uxp3-invite-user-drawer-lifecycle")).toHaveAttribute("data-ux-lifecycle-status", "idle");
    await expect(drawer.getByTestId("uxp3-invite-user-drawer-lifecycle")).toHaveAttribute("data-ux-lifecycle-validation", "valid");
    await expect(drawer).toContainText("Ready to create a DB-backed invitation with pending role assignment and audit event.");
    await expect(drawer).not.toContainText(/admin override|client visibility unlocked|release complete|evidence sufficient|download ready|client accepted/i);
  });

  test("validation blocks submit and Cancel closes without mutation", async ({ page }) => {
    expect(tenantUsersRoute).toBeDefined();
    await page.goto(`${routeToSmokePath(tenantUsersRoute!.route)}?state=base`);

    const trigger = page.getByRole("button", { name: "Invite user" });
    await trigger.click();
    let drawer = page.getByRole("complementary", { name: "Invite User" });
    await expect(drawer).toBeVisible();

    await drawer.getByLabel("Email address").fill("not-an-email");
    await expect(drawer.getByRole("button", { name: "Send invitation" })).toBeDisabled();
    await expect(drawer.getByTestId("uxp3-invite-user-drawer-lifecycle")).toHaveAttribute("data-ux-lifecycle-validation", "blocked");
    await expect(drawer).toContainText("Invitation remains blocked until email and display name are valid");

    await drawer.getByRole("button", { name: "Cancel" }).click();
    await expect(drawer).toBeHidden();
    await expect(page).toHaveURL(new RegExp(`${routeToSmokePath(tenantUsersRoute!.route)}\\?state=base$`));

    await trigger.click();
    drawer = page.getByRole("complementary", { name: "Invite User" });
    await expect(drawer).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
  });

  test("successful invite shows success state in drawer without immediate navigation", async ({ page }) => {
    expect(tenantUsersRoute).toBeDefined();
    const path = routeToSmokePath(tenantUsersRoute!.route);
    const email = `uxp3.invite.${Date.now()}@example.demo`;
    await page.goto(`${path}?state=base`);

    await page.getByRole("button", { name: "Invite user" }).click();
    const drawer = page.getByRole("complementary", { name: "Invite User" });
    await expect(drawer).toBeVisible();

    await drawer.getByLabel("Email address").fill(email);
    await drawer.getByLabel("Display name").fill("UXP3 Invite User");
    await drawer.getByRole("button", { name: "Send invitation" }).click();

    await expect(drawer.getByRole("button", { name: "Sending" })).toBeDisabled();
    await expect(drawer.getByTestId("uxp3-invite-user-drawer-lifecycle")).toHaveAttribute("data-ux-lifecycle-status", "submitting");
    await expect(drawer.getByTestId("uxp3-invite-user-drawer-lifecycle")).toHaveAttribute("data-ux-lifecycle-status", "success", { timeout: 15000 });
    await expect(drawer).toContainText(`${email} is now invited`);
    await expect(drawer.getByTestId("local-invite-link")).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`${path}\\?state=base$`));
    await expect(drawer).not.toContainText(/admin override|client visibility unlocked|release complete|evidence sufficient|download ready|client accepted/i);
  });

  test("invite drawer source keeps close blocking and no auto-navigation local to owner", () => {
    const source = readFileSync("components/admin-tenant-setup-screen.tsx", "utf8");

    expect(source).toContain('data-testid="uxp3-invite-user-drawer-lifecycle"');
    expect(source).toContain('data-ux-lifecycle-trigger="invite-user-drawer"');
    expect(source).toContain('onClose={status === "submitting" ? undefined : handleClose}');
    expect(source).toContain('void runTenantGovernanceCommand("j06.sendInvitation");');
  });
});
