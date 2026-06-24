import "dotenv/config";

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

test.describe("Wave 0-2 Journey-first UI", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test("renders dashboard worklist, hold placeholders and safe feedback", async ({ page }) => {
    await authenticate(page);
    await page.goto("/journeys");

    await expect(page.getByTestId("journey-dashboard")).toBeVisible();
    await expect(page.getByTestId("page-header").getByRole("heading", { name: "Journey Dashboard" })).toBeVisible();
    await expect(page.getByText("Client-visible outcomes stay gated")).toBeVisible();
    await expect(page.getByTestId("journey-worklist-card")).toHaveCount(7);
    await expect(page.getByTestId("journey-hold-panel")).toContainText("MJ-004");
    await expect(page.getByTestId("journey-hold-panel")).toContainText("MJ-007");
    await expect(page.getByTestId("journey-hold-panel")).toContainText("HOLD_LOCKED");

    await page.screenshot({
      fullPage: true,
      path: "artifacts/screenshots/wave02-journey-dashboard.png",
    });
  });

  test("renders journey detail rail, evidence, audit and client projection preview", async ({ page }) => {
    await authenticate(page);
    await page.goto("/journeys");

    const exportJourney = page.getByTestId("journey-worklist-card").filter({ hasText: "MJ-005" }).first();
    await exportJourney.getByRole("link", { name: /open detail/i }).click();

    await expect(page.getByTestId("journey-detail")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Stage and step rail/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Evidence requirements" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Audit spine" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Client projection preview" })).toBeVisible();
    await expect(page.getByText("Journey state is not release proof", { exact: true }).first()).toBeVisible();

    await page.screenshot({
      fullPage: true,
      path: "artifacts/screenshots/wave02-journey-detail.png",
    });
  });
});
