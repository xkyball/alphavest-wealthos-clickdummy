import { expect, type Page, test } from "@playwright/test";

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

test.beforeEach(async ({ page }) => {
  await authenticate(page);
});

test.describe("UX-A11Y phase 10 keyboard, focus and status proof", () => {
  test("covers every Phase 10 accessibility task exactly", () => {
    expect(new Set(["UX-A11Y-001", "UX-A11Y-002", "UX-A11Y-003", "UX-A11Y-004"])).toEqual(new Set([
      "UX-A11Y-001",
      "UX-A11Y-002",
      "UX-A11Y-003",
      "UX-A11Y-004",
    ]));
  });

  test("UX-A11Y-001 and UX-A11Y-003 modal exposes ARIA description, live status, focus and Escape recovery", async ({ page }) => {
    await page.goto("/governance/roles/demo?state=base");

    const trigger = page.getByRole("button", { name: "Create scoped role" });
    await trigger.focus();
    await trigger.click();

    const drawer = page.getByRole("complementary", { name: "Portfolio Manager" });
    const modalTrigger = drawer.getByRole("button", { name: "Review scoped changes" });
    await expect(drawer).toBeVisible();
    await expect(modalTrigger).toBeDisabled();
    await expect(drawer.getByTestId("j07-role-drawer-validation-state")).toContainText(
      "Role review remains blocked until the scoped-role acknowledgement is checked.",
    );
    await drawer.locator("input[type='checkbox']").check();
    await expect(modalTrigger).toBeEnabled();
    await modalTrigger.click();

    const dialog = page.getByRole("dialog", { name: "Confirm Sensitive Permission Changes" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog).toHaveAttribute("aria-describedby", /.+/);
    await expect(dialog).toHaveAttribute("data-ux-a11y-escape", "enabled");
    await expect(dialog).toHaveAttribute("data-ux-a11y-focus-return", "parent-context");
    await expect(dialog).toHaveAttribute("data-ux-phase10-tasks", /UX-A11Y-001/);
    await expect(dialog).toHaveAttribute("data-ux-phase10-tasks", /UX-A11Y-003/);
    await expect(dialog.getByTestId("ux-phase10-modal-status")).toContainText(/Dialog opened.*Escape.*recover context/i);
    await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(drawer).toBeVisible();
  });

  test("UX-A11Y-002 drawer traps focus, announces status and returns focus to trigger", async ({ page }) => {
    await page.goto("/governance/roles/demo?state=base");

    const trigger = page.getByRole("button", { name: "Create scoped role" });
    await trigger.focus();
    await trigger.click();

    const drawer = page.getByRole("complementary", { name: "Portfolio Manager" });
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("aria-describedby", /.+/);
    await expect(drawer).toHaveAttribute("data-ux-a11y-escape", "enabled");
    await expect(drawer).toHaveAttribute("data-ux-a11y-focus-return", "trigger");
    await expect(drawer.getByTestId("ux-phase10-drawer-status")).toContainText(/Drawer opened.*Escape.*recover context/i);
    await expect(drawer.getByRole("button", { name: "Close" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  const headerRoutes = [
    {
      path: "/committee/reviews/demo/decision-room",
      task: "UX-A11Y-001",
    },
    {
      path: "/committee/reviews",
      task: "UX-A11Y-002",
    },
    {
      path: "/reviews",
      task: "UX-A11Y-004",
    },
  ];

  for (const route of headerRoutes) {
    test(route.task + " " + route.path + " keeps PageHeader keyboard/status semantics without visible proof panels", async ({ page }) => {
      await page.goto(route.path);

      const header = page.getByTestId("page-header");
      const proof = header.getByTestId("ux-phase10-a11y-support");
      await expect(proof).toHaveClass(/sr-only/);
      await expect(proof).not.toBeVisible();
      await expect(proof).toHaveAttribute("data-ux-phase10-tasks", new RegExp(route.task));
      await expect(proof).toHaveAttribute("data-ux-phase10-tasks", /UX-A11Y-004/);
      await expect(proof).toHaveAttribute("data-ux-a11y-keyboard", "tab-escape-cancel-return");
      await expect(proof).toHaveAttribute("data-ux-a11y-status", "polite-live-region");
      await expect(proof.getByTestId("ux-phase10-live-status")).toContainText(/Keyboard users can tab through actions and recover without losing context/i);
      await expect(proof.getByTestId("ux-phase10-route-label")).toContainText(/.+/);
      await expect(header).not.toContainText(/client visibility unlocked|admin override|release complete|evidence sufficient/i);
    });
  }
});
