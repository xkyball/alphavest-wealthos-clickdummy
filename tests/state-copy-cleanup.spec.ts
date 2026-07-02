import { expect, type Page, test } from "@playwright/test";

import { authenticatePageWithJwt } from "./helpers/auth-jwt";

async function authenticate(page: Page) {
  await authenticatePageWithJwt(page, page.context().request, {
    email: "ava.admin@alphavest.demo",
    roleKey: "admin",
    tenantSlug: "morgan",
  });
}

test.describe("UXP1-010 state copy cleanup", () => {
  test.beforeEach(async ({ page }) => {
    await authenticate(page);
  });

  test("document upload state describes current state without pipeline methodology", async ({ page }) => {
    await page.goto("/documents/upload");

    await expect(page.getByRole("heading", { name: "Upload Status" })).toBeVisible();
    await expect(page.getByText("Select a file to start document intake.")).toBeVisible();
    await expect(page.getByText("Upload can create a pending review item only. It cannot complete evidence review, export approval or client visibility.")).toBeVisible();
    await expect(page.getByText(/Extraction Pipeline|sufficiency acceptance|scanned, validated and queued/i)).toHaveCount(0);
  });

  test("client profile and family state titles avoid implementation-source language", async ({ page }) => {
    await page.goto("/client/profile");

    await expect(page.getByText(/Loading profile|Profile saved|Profile validation failed/).first()).toBeVisible();
    await expect(page.getByText(/Loading DB profile|DB-backed profile/i)).toHaveCount(0);

    await page.goto("/client/family-members");
    await expect(page.getByText("Family edit state")).toBeVisible();
    await expect(page.getByText(/DB-backed family edit/i)).toHaveCount(0);
  });

  test("auth and invite onboarding copy avoids provider implementation language", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: "Workspace sign-in" })).toBeVisible();
    await expect(page.getByLabel("Username")).toBeVisible();
    await expect(page.getByLabel("Sign-in method")).toBeVisible();
    await expect(page.getByText("Demo sign-in checks the workspace account, requires the username as password, then uses MFA code 123456.")).toBeVisible();
    await expect(page.getByText(/DB user JWT|DB-JWT|DB-backed|MVP_LOCAL_DB|stub-123456|Auth provider|local challenge|invite token|DB invite|DB invitation|DB role|active in the DB/i)).toHaveCount(0);

    await page.goto("/onboarding/invite");
    await expect(page.getByText("Invitation status")).toBeVisible();
    await expect(page.getByText(/current invitation ready for acceptance|current invitation is present/i)).toBeVisible();
    await expect(page.getByText(/DB user JWT|DB-JWT|DB-backed|MVP_LOCAL_DB|stub-123456|Auth provider|local challenge|invite token|DB invite|DB invitation|DB role|active in the DB/i)).toHaveCount(0);
  });

  test("support and reference states avoid proof or implementation wording", async ({ page }) => {
    await page.goto("/admin/platform");
    await expect(page.getByText("Change control")).toBeVisible();
    await expect(page.getByText("Platform settings are configuration only. Changes cannot release advice, mark evidence sufficient or expose client data.")).toBeVisible();
    await expect(page.getByText(/P10-P14 implementation state|implementation evidence|P10-P14 proof/i)).toHaveCount(0);

    await page.goto("/states");
    await expect(page.getByRole("heading", { name: "State and Badge Reference" })).toBeVisible();
    await expect(page.getByText("This area is read-only. No product controls are available.").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Reference only" })).toHaveCount(0);
    await expect(page.getByText(/state examples do not change workflow status or complete downstream gates|Loading variants keep table and panel geometry stable/i)).toHaveCount(0);
  });
});
