import { execFileSync } from "node:child_process";
import { expect, type Page, test } from "@playwright/test";

import { localAuthSessionCookieName } from "../lib/auth/local-auth-session";

const actorSessionStorageKey = "alphavest.actorSession.v1";

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

async function setActorSession(page: Page, tenantSlug: string, roleKey: string) {
  await page.addInitScript(
    ({ key, role, tenant }) => {
      window.localStorage.setItem(key, JSON.stringify({ roleKey: role, tenantSlug: tenant }));
    },
    { key: actorSessionStorageKey, role: roleKey, tenant: tenantSlug },
  );
}

test.describe("UXP3-012 role drawer and confirmation lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    execFileSync("./node_modules/.bin/tsx", ["prisma/seed.ts"], { stdio: "inherit" });
    await authenticate(page);
  });

  test("opens role drawer without service mutation and discards safely", async ({ page }) => {
    const commandRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/tenant-governance/actions")) {
        commandRequests.push(request.method());
      }
    });

    await page.goto("/governance/roles/portfolio-manager?state=base");
    await expect(page.getByRole("complementary", { name: "Portfolio Manager" })).toHaveCount(0);

    const trigger = page.getByTestId("j07-open-role-drawer");
    await expect(trigger).toHaveAttribute("data-ux-lifecycle-trigger", "role-drawer");
    await expect(trigger).toHaveAttribute("data-ux-lifecycle-result", "opens-role-drawer");
    await trigger.click();

    const drawer = page.getByRole("complementary", { name: "Portfolio Manager" });
    const lifecycle = page.getByTestId("uxp3-role-drawer-lifecycle");
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("data-ux-interaction-lifecycle", "drawer");
    await expect(drawer).toHaveAttribute("data-ux-lifecycle-cancel", "no-submit-no-mutation");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "idle");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "blocked-acknowledgement-required");
    await expect(lifecycle).toHaveAttribute("data-ux-no-overclaim", "true");
    await expect(page.getByTestId("j07-review-role-changes")).toBeDisabled();

    await drawer.getByRole("button", { name: "Discard changes" }).click();
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
    expect(commandRequests).toEqual([]);
  });

  test("requires drawer acknowledgement and exact second confirmation phrase", async ({ page }) => {
    await setActorSession(page, "northbridge", "security_officer");
    await page.goto("/governance/roles/portfolio-manager?state=base");
    await page.getByTestId("j07-open-role-drawer").click();

    const drawer = page.getByRole("complementary", { name: "Portfolio Manager" });
    const drawerLifecycle = page.getByTestId("uxp3-role-drawer-lifecycle");
    await expect(drawer).toBeVisible();
    await expect(page.getByTestId("j07-role-drawer-validation-state")).toContainText(
      "Role review remains blocked until the required acknowledgement is checked.",
    );

    await drawer.locator("input[type='checkbox']").check();
    await expect(drawerLifecycle).toHaveAttribute("data-ux-lifecycle-validation", "valid-scoped-role-review");
    await expect(page.getByTestId("j07-review-role-changes")).toHaveAttribute(
      "data-ux-lifecycle-result",
      "opens-typed-confirmation",
    );
    await page.getByTestId("j07-review-role-changes").click();

    const dialog = page.getByRole("dialog", { name: "Confirm Sensitive Permission Changes" });
    const modalLifecycle = page.getByTestId("uxp3-role-confirmation-lifecycle");
    await expect(dialog).toBeVisible();
    await expect(modalLifecycle).toHaveAttribute("data-ux-lifecycle-status", "idle");
    await expect(modalLifecycle).toHaveAttribute("data-ux-lifecycle-validation", "blocked-exact-phrase-required");
    await expect(page.getByTestId("j07-save-role-changes")).toBeDisabled();

    await page.getByTestId("j07-role-confirmation-phrase").fill("PORTFOLIO MANAGER");
    await expect(modalLifecycle).toHaveAttribute("data-ux-lifecycle-validation", "blocked-exact-phrase-required");
    await expect(page.getByTestId("j07-save-role-changes")).toBeDisabled();

    await page.getByTestId("j07-role-confirmation-phrase").fill("CONFIRM ROLE CHANGE");
    await expect(modalLifecycle).toHaveAttribute("data-ux-lifecycle-validation", "valid-second-confirmation");
    await expect(page.getByTestId("j07-save-role-changes")).toHaveAttribute(
      "data-ux-lifecycle-result",
      "submits-scoped-role-review",
    );
  });

  test("submits through governed service without downstream overclaim", async ({ page }) => {
    await setActorSession(page, "northbridge", "security_officer");
    await page.goto("/governance/roles/portfolio-manager?state=base");
    await page.getByTestId("j07-open-role-drawer").click();

    const drawer = page.getByRole("complementary", { name: "Portfolio Manager" });
    await drawer.locator("input[type='checkbox']").check();
    await page.getByTestId("j07-review-role-changes").click();
    await page.getByTestId("j07-role-confirmation-phrase").fill("CONFIRM ROLE CHANGE");

    await page.route("**/api/tenant-governance/actions", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 150));
      await route.continue();
    });

    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/tenant-governance/actions") && response.request().method() === "POST",
    );

    const modalLifecycle = page.getByTestId("uxp3-role-confirmation-lifecycle");
    await page.getByTestId("j07-save-role-changes").click();
    await expect(modalLifecycle).toHaveAttribute("data-ux-lifecycle-status", "loading");
    const response = await responsePromise;
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    await expect(modalLifecycle).toHaveAttribute("data-ux-lifecycle-status", "success");
    await expect(page.getByTestId("j07-role-confirmation-success-state")).toContainText(
      "role activation, access expansion, release, evidence sufficiency and export/share remain separate tasks.",
    );
    await expect(page).toHaveURL(/\/governance\/roles\/portfolio-manager\?state=base$/);
    await expect(
      page.getByRole("dialog", { name: "Confirm Sensitive Permission Changes" }).getByText(
        /role is active|access has expanded|release complete|evidence is sufficient|download ready|client accepted/i,
      ),
    ).toHaveCount(0);
  });

  test("Escape closes drawer and modal without submitting", async ({ page }) => {
    const commandRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/tenant-governance/actions")) {
        commandRequests.push(request.method());
      }
    });

    await page.goto("/governance/roles/portfolio-manager?state=base");
    await page.getByTestId("j07-open-role-drawer").click();

    let drawer = page.getByRole("complementary", { name: "Portfolio Manager" });
    await expect(drawer).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();

    await page.getByTestId("j07-open-role-drawer").click();
    drawer = page.getByRole("complementary", { name: "Portfolio Manager" });
    await drawer.locator("input[type='checkbox']").check();
    await page.getByTestId("j07-review-role-changes").click();

    const dialog = page.getByRole("dialog", { name: "Confirm Sensitive Permission Changes" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(drawer).toBeVisible();
    expect(commandRequests).toEqual([]);
  });
});
