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

test.describe("UX-CTA-STATE phase 8 one-primary CTA and recovery proof", () => {
  const phase8Routes = [
    { path: "/documents/upload", taskId: "UX-CTA-STATE-001" },
    { path: "/advisory/triggers/demo/review", taskId: "UX-CTA-STATE-002" },
    { path: "/compliance/reviews/demo/decision-room", taskId: "UX-CTA-STATE-003" },
    { path: "/export/demo/approval", taskId: "UX-CTA-STATE-004" },
    { path: "/governance/access-requests/demo", taskId: "UX-CTA-STATE-005" },
    { path: "/ips/demo/decision-room", taskId: "UX-CTA-STATE-006" },
    { path: "/client/home", taskId: "UX-CTA-STATE-007" },
    { path: "/reviews/demo", taskId: "UX-CTA-STATE-008" },
  ];

  test("covers every Phase 8 CTA state task exactly", () => {
    expect(new Set(phase8Routes.map((route) => route.taskId))).toEqual(new Set([
      "UX-CTA-STATE-001",
      "UX-CTA-STATE-002",
      "UX-CTA-STATE-003",
      "UX-CTA-STATE-004",
      "UX-CTA-STATE-005",
      "UX-CTA-STATE-006",
      "UX-CTA-STATE-007",
      "UX-CTA-STATE-008",
    ]));
  });

  for (const route of phase8Routes) {
    test(route.taskId + " " + route.path + " renders one primary CTA, blocked reason and recovery proof", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1200 });
      await authenticate(page);
      await page.goto(route.path);

      const guidance = page.getByTestId("product-guidance").first();
      const actions = guidance.getByTestId("ux-nav-next-actions");
      await expect(actions.locator('[data-ux-primary-cta="true"]')).toHaveCount(1);
      await expect(actions.getByTestId("ux-cta-blocked-reason")).toBeVisible();
      await expect(actions.getByTestId("ux-cta-recovery-action")).toBeVisible();

      const phase8 = actions.locator('[data-testid="ux-phase8-cta-state"][data-ux-phase8-task="' + route.taskId + '"]').first();
      await expect(phase8).toBeVisible();
      await expect(phase8.getByTestId("ux-phase8-primary-count")).toContainText(/Exactly one primary CTA/i);
      await expect(phase8.getByTestId("ux-phase8-blocked-reason")).toContainText(/blocked|bypass|client-safe|does not|internal|separate|sufficiency|release|gates/i);
      await expect(phase8.getByTestId("ux-phase8-recovery")).toContainText(/Open|Resolve|Request|Review|Recover|Continue|Back/i);
      await expect(phase8.getByTestId("ux-phase8-no-overclaim")).toContainText(/keeps downstream gates unresolved until their required evidence, release, export, share, visibility and permission checks are completed/i);
      await expect(guidance).not.toContainText(/client visibility unlocked|download ready|evidence sufficient|release complete|share ready|admin override/i);
    });
  }
});
