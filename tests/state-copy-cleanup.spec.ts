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

test.describe("UXP1-010 state copy cleanup", () => {
  test.beforeEach(async ({ page }) => {
    await authenticate(page);
  });

  test("document upload state describes current state without pipeline methodology", async ({ page }) => {
    await page.goto("/documents/upload");

    await expect(page.getByText("Extraction queued")).toBeVisible();
    await expect(page.getByText("The document is queued for validation and human extraction review.")).toBeVisible();
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

  test("support and reference states avoid proof or implementation wording", async ({ page }) => {
    await page.goto("/admin/platform");
    await expect(page.getByText("Closure state")).toBeVisible();
    await expect(page.getByText(/P10-P14 implementation state|implementation evidence|P10-P14 proof/i)).toHaveCount(0);

    await page.goto("/states");
    await expect(page.getByRole("heading", { name: "Reference Workspace" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reference only" })).toBeDisabled();
    await expect(page.getByText(/state examples do not change workflow status or complete downstream gates|Loading variants keep table and panel geometry stable/i)).toHaveCount(0);
  });
});
