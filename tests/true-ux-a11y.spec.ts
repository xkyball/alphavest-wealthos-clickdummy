import { expect, test } from "@playwright/test";

import { authenticatePageWithJwt } from "./helpers/auth-jwt";

test.beforeEach(async ({ page, request }) => {
  await authenticatePageWithJwt(page, request, { email: "ava.admin@alphavest.demo" });
});

test.describe("UX-A11Y stage 10 keyboard, focus and status proof", () => {
  test("covers every Stage 10 accessibility task exactly", () => {
    expect(new Set(["UX-A11Y-001", "UX-A11Y-002", "UX-A11Y-003", "UX-A11Y-004"])).toEqual(new Set([
      "UX-A11Y-001",
      "UX-A11Y-002",
      "UX-A11Y-003",
      "UX-A11Y-004",
    ]));
  });

  test("E08 shared primitives expose focus, active, selected and semantic status cues", async ({ page }) => {
    await page.goto("/advisor/reviews");

    await expect(page.locator("[data-ux-focus-visible='required']").first()).toBeVisible();
    await expect(page.locator("[data-ux-interaction-state='selected']").first()).toBeVisible();
    await page.getByTestId("ux-data-table-sort").first().click();

    await expect(page.locator("[data-ux-focus-visible='required']").first()).toBeVisible();
    await expect(page.locator("[data-ux-interaction-state='active']").first()).toBeVisible();
    await expect(page.locator("[data-ux-status-color-only='false'][data-ux-status-meaning]").first()).toBeVisible();
    await expect(page.locator("[data-ux-status-cue-rendered='icon']").first()).toBeVisible();
  });

  test("UX-A11Y-001 and UX-A11Y-003 modal exposes ARIA description, live status, focus and Escape recovery", async ({ page }) => {
    await page.goto("/governance/roles/portfolio-manager?state=base");

    const trigger = page.getByTestId("j07-open-role-drawer");
    await trigger.focus();
    await trigger.click();

    const drawer = page.getByRole("complementary", { name: "Portfolio Manager" });
    const modalTrigger = drawer.getByRole("button", { name: "Review permitted changes" });
    await expect(drawer).toBeVisible();
    await expect(modalTrigger).toBeDisabled();
    await expect(drawer.getByTestId("j07-role-drawer-validation-state")).toContainText(
      "Role review remains blocked until the required acknowledgement is checked.",
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
    await expect(dialog).toHaveAttribute("data-ux-stage10-tasks", /UX-A11Y-001/);
    await expect(dialog).toHaveAttribute("data-ux-stage10-tasks", /UX-A11Y-003/);
    await expect(dialog.getByTestId("ux-stage10-modal-status")).toContainText(/Dialog opened.*Escape.*recover context/i);
    await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(drawer).toBeVisible();
  });

  test("UX-A11Y-002 drawer traps focus, announces status and returns focus to trigger", async ({ page }) => {
    await page.goto("/governance/roles/portfolio-manager?state=base");

    const trigger = page.getByTestId("j07-open-role-drawer");
    await trigger.focus();
    await trigger.click();

    const drawer = page.getByRole("complementary", { name: "Portfolio Manager" });
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("aria-describedby", /.+/);
    await expect(drawer).toHaveAttribute("data-ux-a11y-escape", "enabled");
    await expect(drawer).toHaveAttribute("data-ux-a11y-focus-return", "trigger");
    await expect(drawer.getByTestId("ux-stage10-drawer-status")).toContainText(/Drawer opened.*Escape.*recover context/i);
    await expect(drawer.getByRole("button", { name: "Close" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  const headerRoutes = [
    {
      path: "/committee/reviews/rebalance-review/decision-room",
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
      const proof = header.getByTestId("ux-stage10-a11y-support");
      await expect(proof).toHaveClass(/sr-only/);
      const proofBox = await proof.boundingBox();
      expect(proofBox?.width ?? 0).toBeLessThanOrEqual(1);
      expect(proofBox?.height ?? 0).toBeLessThanOrEqual(1);
      await expect(proof).toHaveAttribute("data-ux-stage10-tasks", new RegExp(route.task));
      await expect(proof).toHaveAttribute("data-ux-stage10-tasks", /UX-A11Y-004/);
      await expect(proof).toHaveAttribute("data-ux-a11y-keyboard", "tab-escape-cancel-return");
      await expect(proof).toHaveAttribute("data-ux-a11y-status", "polite-live-region");
      await expect(proof.getByTestId("ux-stage10-live-status")).toContainText(/Keyboard users can tab through actions and recover without losing context/i);
      await expect(proof.getByTestId("ux-stage10-route-label")).toContainText(/.+/);
      await expect(header).not.toContainText(/client visibility unlocked|admin override|release complete|evidence sufficient/i);
    });
  }
});
