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

test.describe("UX-DENSITY phase 9 D1-D4 hierarchy and layout proof", () => {
  const phase9Routes = [
    {
      path: "/client/home",
      pattern: "calm-executive",
      taskId: "UX-DENSITY-001",
      tier: "D1",
    },
    {
      path: "/advisory/review-queue",
      pattern: "productive-workbench",
      taskId: "UX-DENSITY-002",
      tier: "D2",
    },
    {
      path: "/governance",
      pattern: "dense-operations",
      taskId: "UX-DENSITY-003",
      tier: "D3",
    },
    {
      path: "/ips/demo/decision-room",
      pattern: "focused-detail",
      taskId: "UX-DENSITY-004",
      tier: "D4",
    },
  ];

  test("covers every Phase 9 density task exactly", () => {
    expect(new Set(phase9Routes.map((route) => route.taskId))).toEqual(new Set([
      "UX-DENSITY-001",
      "UX-DENSITY-002",
      "UX-DENSITY-003",
      "UX-DENSITY-004",
    ]));
  });

  for (const route of phase9Routes) {
    test(route.taskId + " " + route.path + " exposes above-fold density hierarchy and retained safety", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1200 });
      await authenticate(page);
      await page.goto(route.path);

      const guidance = page.getByTestId("product-guidance").first();
      await expect(guidance).toBeVisible();
      await expect(guidance).toHaveAttribute("data-ux-density-above-fold", "true");
      await expect(guidance).toHaveAttribute("data-ux-density-pattern", route.pattern);
      await expect(guidance).toHaveAttribute("data-ux-density-tier", route.tier);

      const phase9 = guidance
        .locator('[data-testid="ux-phase9-density-proof"][data-ux-phase9-task="' + route.taskId + '"]')
        .first();
      await expect(phase9).toBeVisible();
      await expect(phase9).toHaveAttribute("data-ux-density-pattern", route.pattern);
      await expect(phase9).toHaveAttribute("data-ux-density-tier", route.tier);
      await expect(phase9.getByTestId("ux-phase9-page-job")).toContainText(/Page job/i);
      await expect(phase9.getByTestId("ux-phase9-status")).toContainText(/Status/i);
      await expect(phase9.getByTestId("ux-phase9-next-step")).toContainText(/Next step/i);
      await expect(phase9.getByTestId("ux-phase9-hierarchy")).toContainText(/hierarchy|queue|summary|table|decision|above-fold|surface|frame/i);
      await expect(phase9.getByTestId("ux-phase9-safety-retained")).toContainText(/safety|audit|evidence|blocker|release|recovery|export|visibility/i);
      await expect(guidance).not.toContainText(/empty premium space|chaotic card wall|safety hidden|audit hidden|evidence hidden/i);
    });
  }
});
