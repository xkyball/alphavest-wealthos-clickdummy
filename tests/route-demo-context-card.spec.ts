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

test.describe("UXP1-003 route context containment", () => {
  test("route skeleton card uses functional context copy without scenario explanation", async ({ page }) => {
    await authenticate(page);
    await page.goto("/service-blueprint");

    const card = page.getByTestId("route-reference-context-card");
    await expect(card).toBeVisible();
    await expect(card.getByRole("heading", { name: "Route Context" })).toBeVisible();
    await expect(card).toContainText("Current tenant, actor and role family for this registered route.");
    await expect(card).toContainText("Tenant");
    await expect(card).toContainText("Actor");
    await expect(card).toContainText("Role family");
    await expect(card).toContainText("Access context");
    await expect(card).toContainText("Active");

    await expect(card).not.toContainText(/Scenario Context|controlled scenario inputs|Permission mode|Scenario active/i);
  });
});
