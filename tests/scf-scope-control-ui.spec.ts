import { expect, test } from "@playwright/test";

test.describe("SCF P01-P03 application scope controls", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
  });

  test("renders release scope control and disables static workspace search", async ({ page }) => {
    await page.goto("/admin/platform");

    await expect(page.getByPlaceholder("Search pending scoped indexing").first()).toBeDisabled();
    const scopeControl = page.getByTestId("release-scope-control");
    await expect(scopeControl.getByText("Release Scope Control")).toBeVisible();
    await expect(scopeControl.getByText("First-build workspaces")).toBeVisible();
    await expect(scopeControl.getByText("Registered-only workspaces")).toBeVisible();
    await expect(scopeControl.getByText("Static controls", { exact: true })).toBeVisible();
    await expect(scopeControl.getByRole("cell", { name: "Workspace search" })).toBeVisible();
    await expect(scopeControl.getByText("No false affordance")).toBeVisible();
  });

  test("evaluates route shell and action authority for the selected role", async ({ page }) => {
    await page.goto("/admin/roles");
    await page.getByLabel("Role context").selectOption("compliance_officer");

    const boundary = page.getByTestId("permission-boundary-panel");
    await expect(boundary.getByText("Route shell", { exact: true })).toBeVisible();
    await expect(boundary.getByText("Available", { exact: true })).toBeVisible();
    await expect(boundary.getByText("Action authority", { exact: true })).toBeVisible();
    await expect(boundary.getByText("Denied", { exact: true })).toBeVisible();
    await expect(boundary.getByText(/Admin or Security Officer is required/)).toBeVisible();

    await page.getByLabel("Role context").selectOption("admin");
    await expect(boundary.getByText("Allowed", { exact: true }).first()).toBeVisible();
    await expect(boundary.getByText(/Admin is allowed by the current demo role policy/).first()).toBeVisible();
  });

  test("renders mapped actor tenant role and membership scope on tenant users", async ({ page }) => {
    await page.goto("/tenants/demo/users");
    await page.getByLabel("Tenant context").selectOption("morgan");
    await page.getByLabel("Role context").selectOption("family_cfo");

    const mappedScope = page.getByTestId("mapped-session-scope");
    await expect(mappedScope.getByText("Mapped Session Scope")).toBeVisible();
    await expect(mappedScope.getByText("Morgan Family CFO")).toBeVisible();
    await expect(mappedScope.getByText("Family CFO", { exact: true })).toBeVisible();
    await expect(mappedScope.getByText("Morgan Family Office")).toBeVisible();
    await expect(mappedScope.getByText("morgan / TENANT")).toBeVisible();
    await expect(page.getByRole("button", { name: "Filters" })).toBeDisabled();
  });
});
