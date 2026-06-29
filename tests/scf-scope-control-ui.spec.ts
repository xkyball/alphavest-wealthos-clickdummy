import { expect, type Page, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";

async function authenticate(page: Page) {
  await page.context().addCookies([
    {
      httpOnly: true,
      domain: "127.0.0.1",
      name: demoAuthSessionCookieName,
      path: "/",
      sameSite: "Lax",
      value: "av-session-playwright-authenticated",
    },
  ]);
}

test.describe("SCF P01-P03 application availability controls", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
    await authenticate(page);
  });

  test("renders release access control and disables static workspace search", async ({ page }) => {
    await page.goto("/admin/platform");

    const scopeControl = page.getByTestId("release-scope-control");
    await expect(scopeControl.getByText("Release Access Control")).toBeVisible();
    await expect(scopeControl.getByText("First-build workspaces")).toBeVisible();
    await expect(scopeControl.getByText("Registered-only workspaces")).toBeVisible();
    await expect(scopeControl.getByText("Static Control Treatment", { exact: true })).toBeVisible();
    await expect(scopeControl.getByRole("cell", { name: "Workspace search" })).toBeVisible();
    await expect(scopeControl.getByText("No false affordance")).toBeVisible();
  });

  test("evaluates route shell and action authority for the selected role", async ({ page }) => {
    await page.goto("/admin/roles");
    await page.getByLabel("Role context").last().selectOption("compliance_officer");

    const boundary = page.getByTestId("permission-boundary-panel");
    await expect(boundary.getByText("Page access", { exact: true })).toBeVisible();
    await expect(boundary.getByText("Available", { exact: true })).toBeVisible();
    await expect(boundary.getByText("Action authority", { exact: true })).toBeVisible();
    await expect(boundary.getByText("Denied", { exact: true })).toBeVisible();
    await expect(boundary.getByText("The selected role cannot use the current action.")).toBeVisible();

    await page.getByLabel("Role context").selectOption("admin");
    await expect(boundary.getByText("Allowed", { exact: true }).first()).toBeVisible();
    await expect(boundary.getByText("The selected role may use the current action.").first()).toBeVisible();
  });

  test("renders mapped actor tenant role and membership access on tenant users", async ({ page }) => {
    await page.goto("/tenants/demo/users");
    await page.getByLabel("Tenant context").last().selectOption("morgan");
    await page.getByLabel("Role context").last().selectOption("family_cfo");

    const mappedScope = page.getByTestId("mapped-session-scope");
    await expect(mappedScope.getByText("Mapped Session Access")).toBeVisible();
    await expect(mappedScope.getByText("Morgan Family CFO")).toBeVisible();
    await expect(mappedScope.getByText("Family CFO", { exact: true })).toBeVisible();
    await expect(mappedScope.getByText("Morgan Family Office")).toBeVisible();
    await expect(mappedScope.getByText("morgan / TENANT")).toBeVisible();
  });
});
