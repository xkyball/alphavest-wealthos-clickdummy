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
    ([storageKey, tenant, role]) => {
      window.localStorage.setItem(storageKey, JSON.stringify({ roleKey: role, tenantSlug: tenant }));
    },
    [actorSessionStorageKey, tenantSlug, roleKey],
  );
}

test.describe("review monitoring workflow UI", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1400 });
    await authenticate(page);
    await setActorSession(page, "northbridge", "analyst");
  });

  test("routes visible review and trigger rows through workflow-backed actions", async ({ page }) => {
    await page.goto("/reviews");

    await expect(page.getByText("Selected review")).toBeVisible();
    await page.getByTestId("j16-schedule-review").click();
    await expect(page.getByText("Human review scheduled. Internal audit state recorded; no client release occurred.")).toBeVisible();
    await expect(page.getByText("Due Soon").first()).toBeVisible();

    await page.goto("/reviews/rebalance-review");
    await page.getByTestId("j17-route-rebalance-review").click();
    await expect(page.getByText("Rebalance trigger routed for human review. No client release occurred.")).toBeVisible();
    await expect(page.getByRole("button", { name: /Routed.*liquidity threshold review/ })).toBeVisible();

    await page.screenshot({
      fullPage: false,
      path: "artifacts/screenshots/review-monitoring-workflow/rebalance-route-human-review-1400x900.png",
    });
  });
});
