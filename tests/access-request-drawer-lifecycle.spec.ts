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

test.describe("UXP3-013 access request drawer lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    await authenticate(page);
  });

  test("opens access request drawer without workflow mutation and cancels safely", async ({ page }) => {
    const commandRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/tenant-governance/actions")) {
        commandRequests.push(request.method());
      }
    });

    await page.goto("/governance/access-requests/external-advisor?state=base");
    await expect(page.getByRole("complementary", { name: "AR-2025-0612" })).toHaveCount(0);

    const trigger = page.getByTestId("j07-open-access-request-drawer");
    await expect(trigger).toHaveAttribute("data-ux-lifecycle-trigger", "access-request-drawer");
    await expect(trigger).toHaveAttribute("data-ux-lifecycle-result", "opens-access-request-drawer");
    await trigger.click();

    const drawer = page.getByRole("complementary", { name: "AR-2025-0612" });
    const lifecycle = page.getByTestId("uxp3-access-request-drawer-lifecycle");
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("data-ux-interaction-lifecycle", "drawer");
    await expect(drawer).toHaveAttribute("data-ux-lifecycle-cancel", "no-submit-no-mutation");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "idle");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "blocked-acknowledgement-required");
    await expect(lifecycle).toHaveAttribute("data-ux-no-overclaim", "true");
    await expect(page.getByTestId("j07-approve-access")).toBeDisabled();

    await drawer.getByRole("button", { name: "Cancel review" }).click();
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
    expect(commandRequests).toEqual([]);
  });

  test("requires acknowledgement and submits only the scoped access review", async ({ page }) => {
    await page.goto("/governance/access-requests/external-advisor?state=base");
    await page.getByTestId("j07-open-access-request-drawer").click();

    const drawer = page.getByRole("complementary", { name: "AR-2025-0612" });
    const lifecycle = page.getByTestId("uxp3-access-request-drawer-lifecycle");
    await expect(drawer).toBeVisible();
    await expect(page.getByTestId("j07-access-request-validation-state")).toContainText(
      "Access approval remains blocked until the scoped access acknowledgement is checked.",
    );

    await drawer.locator("input[type='checkbox']").check();
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "valid-scoped-access-review");
    await expect(page.getByTestId("j07-approve-access")).toHaveAttribute(
      "data-ux-lifecycle-result",
      "submits-scoped-access-review",
    );

    await page.route("**/api/tenant-governance/actions", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 150));
      await route.continue();
    });

    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/tenant-governance/actions") && response.request().method() === "POST",
    );

    await page.getByTestId("j07-approve-access").click();
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "loading");
    const response = await responsePromise;
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "success");
    await expect(page.getByTestId("j07-access-request-success-state")).toContainText(
      "access expansion, role activation, release, evidence sufficiency, export/share and client visibility remain separate controls.",
    );
    await expect(page).toHaveURL(/\/governance\/access-requests\/demo\?state=base$/);
    await expect(
      drawer.getByText(
        /access has expanded|role is active|release complete|evidence is sufficient|download ready|client accepted/i,
      ),
    ).toHaveCount(0);
  });

  test("Escape, escalation and denial close without submitting", async ({ page }) => {
    const commandRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/tenant-governance/actions")) {
        commandRequests.push(request.method());
      }
    });

    await page.goto("/governance/access-requests/external-advisor?state=base");
    await page.getByTestId("j07-open-access-request-drawer").click();

    let drawer = page.getByRole("complementary", { name: "AR-2025-0612" });
    await expect(drawer).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();

    await page.getByTestId("j07-open-access-request-drawer").click();
    drawer = page.getByRole("complementary", { name: "AR-2025-0612" });
    await expect(drawer).toBeVisible();
    await drawer.getByRole("button", { name: "Escalate request" }).click();
    await expect(drawer).toBeHidden();

    await page.getByTestId("j07-open-access-request-drawer").click();
    drawer = page.getByRole("complementary", { name: "AR-2025-0612" });
    await expect(drawer).toBeVisible();
    await drawer.getByRole("button", { name: "Deny request" }).click();
    await expect(drawer).toBeHidden();
    expect(commandRequests).toEqual([]);
  });
});
