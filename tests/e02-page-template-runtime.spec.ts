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

test.describe("E02 page-template runtime adoption", () => {
  const routes = [
    {
      family: "client_summary",
      path: "/client/home",
      requiredZone: "state_zone",
    },
    {
      family: "dashboard_list",
      path: "/advisory",
      requiredZone: "action_zone",
    },
    {
      family: "detail_decision_room",
      path: "/compliance/reviews/demo/decision-room",
      requiredZone: "proof_audit_zone",
    },
  ];

  for (const route of routes) {
    test(`${route.path} exposes canonical E02 page-template metadata`, async ({ page }) => {
      await authenticate(page);
      await page.goto(route.path);

      const templateRoot = page.locator(`[data-ux-page-template-family="${route.family}"]`).first();

      await expect(templateRoot).toBeVisible();
      await expect(templateRoot).toHaveAttribute("data-ux-page-template-required-zones", new RegExp(route.requiredZone));
      await expect(templateRoot).toHaveAttribute("data-ux-page-template-action-zone", /^(inline_next_step|adjacent_action_rail|blocked_state_only|sticky_action_zone)$/);
      await expect(page.locator("[data-ux-template-zone]").first()).toBeVisible();
      await expect(page.locator("[data-ux-long-page-anchor]").first()).toBeVisible();
    });
  }
});
