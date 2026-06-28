import { execFileSync } from "node:child_process";
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

test.describe("UXP3-011 governance user drawer lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    await authenticate(page);
  });

  test("opens governance user drawer without workflow mutation and cancels safely", async ({ page }) => {
    const workflowRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/tenant-governance/actions")) {
        workflowRequests.push(request.method());
      }
    });

    await page.goto("/governance?state=base");
    await expect(page.getByRole("complementary", { name: "Invite User" })).toHaveCount(0);

    const trigger = page.getByTestId("j07-invite-user");
    await expect(trigger).toHaveAttribute("data-ux-lifecycle-trigger", "governance-user-drawer");
    await expect(trigger).toHaveAttribute("data-ux-lifecycle-result", "opens-governance-user-drawer");
    await trigger.click();

    const drawer = page.getByRole("complementary", { name: "Invite User" });
    const lifecycle = page.getByTestId("uxp3-governance-user-drawer-lifecycle");
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("data-ux-interaction-lifecycle", "drawer");
    await expect(drawer).toHaveAttribute("data-ux-lifecycle-cancel", "no-submit-no-mutation");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "idle");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "blocked-acknowledgement-required");
    await expect(lifecycle).toHaveAttribute("data-ux-no-overclaim", "true");
    await expect(page.getByTestId("j07-send-invitation")).toBeDisabled();

    await drawer.getByRole("button", { name: "Cancel" }).click();
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
    expect(workflowRequests).toEqual([]);
  });

  test("requires acknowledgement and submits only the governance invite", async ({ page }) => {
    await page.goto("/governance?state=base");
    await page.getByTestId("j07-invite-user").click();

    const drawer = page.getByRole("complementary", { name: "Invite User" });
    const lifecycle = page.getByTestId("uxp3-governance-user-drawer-lifecycle");
    await expect(drawer).toBeVisible();
    await expect(page.getByTestId("j07-governance-user-validation-state")).toContainText(
      "Tick the box to enable invitation.",
    );

    await drawer.locator("input[type='checkbox']").check();
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "valid-scoped-invite");
    await expect(page.getByTestId("j07-send-invitation")).toHaveAttribute(
      "data-ux-lifecycle-result",
      "submits-governance-invite",
    );

    await page.route("**/api/tenant-governance/actions", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 150));
      await route.continue();
    });

    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/tenant-governance/actions") && response.request().method() === "POST",
    );

    await page.getByTestId("j07-send-invitation").click();
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "loading");
    const response = await responsePromise;
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "success");
    await expect(page.getByTestId("j07-governance-user-success-state")).toContainText(
      "role activation, consent, evidence review, release and export sharing stay separate.",
    );
    await expect(page).toHaveURL(/\/governance\?state=base$/);
    await expect(drawer.getByText(/role active|access expanded|release complete|evidence sufficient|download ready|client accepted/i)).toHaveCount(0);
  });

  test("Escape closes the drawer without submitting", async ({ page }) => {
    const workflowRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/tenant-governance/actions")) {
        workflowRequests.push(request.method());
      }
    });

    await page.goto("/governance?state=base");
    await page.getByTestId("j07-invite-user").click();

    const drawer = page.getByRole("complementary", { name: "Invite User" });
    await expect(drawer).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    expect(workflowRequests).toEqual([]);
  });
});
