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

test.describe("UX-CTA-STATE phase 8 one-primary CTA and recovery state", () => {
  const productivePhase8Routes = [
    { path: "/documents/upload", taskId: "UX-CTA-STATE-001" },
    { path: "/advisory/triggers/demo/review", taskId: "UX-CTA-STATE-002" },
    { path: "/compliance/reviews/demo/decision-room", taskId: "UX-CTA-STATE-003" },
    { path: "/export/demo/approval", taskId: "UX-CTA-STATE-004" },
    { path: "/governance/access-requests/demo", taskId: "UX-CTA-STATE-005" },
    { path: "/client/home", taskId: "UX-CTA-STATE-007" },
  ];
  const lockedPhase8Routes = [
    { path: "/ips/demo/decision-room", taskId: "UX-CTA-STATE-006" },
    { path: "/reviews/demo", taskId: "UX-CTA-STATE-008" },
  ];
  const phase8Routes = [...productivePhase8Routes, ...lockedPhase8Routes];

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

  for (const route of productivePhase8Routes) {
    test(route.taskId + " " + route.path + " renders one primary CTA, blocked reason and recovery state", async ({ page }) => {
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
      await expect(phase8).toContainText("Next action state");
      await expect(phase8.getByTestId("ux-phase8-primary-count")).toContainText(/Next action/i);
      await expect(phase8.getByTestId("ux-phase8-blocked-reason")).toContainText(/blocked|bypass|client-safe|does not|internal|separate|sufficiency|release|gates/i);
      await expect(phase8.getByTestId("ux-phase8-recovery")).toContainText(/Open|Resolve|Request|Review|Recover|Continue|Back/i);
      await expect(phase8.getByTestId("ux-phase8-no-overclaim")).toContainText(/gates remain unresolved until their own checks pass/i);
      await expect(phase8).not.toContainText(/proof|Exactly one primary CTA/i);
      await expect(guidance).not.toContainText(/client visibility unlocked|download ready|evidence sufficient|release complete|share ready|admin override/i);
    });
  }

  for (const route of lockedPhase8Routes) {
    test(route.taskId + " " + route.path + " renders locked CTA state without productive recovery", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1200 });
      await authenticate(page);
      await page.goto(route.path);

      const guidance = page.getByTestId("product-guidance").first();
      const actions = guidance.getByTestId("ux-nav-next-actions");
      await expect(actions).toHaveAttribute("data-ux-cta-state", "locked");
      await expect(actions.locator('[data-ux-primary-cta="true"]')).toHaveCount(0);
      await expect(actions.getByTestId("ux-cta-blocked-reason")).toBeVisible();
      await expect(actions.getByTestId("ux-cta-recovery-action")).toHaveCount(0);

      const phase8 = actions.locator('[data-testid="ux-phase8-cta-state"][data-ux-phase8-task="' + route.taskId + '"]').first();
      await expect(phase8).toBeVisible();
      await expect(phase8.getByTestId("ux-phase8-primary-count")).toContainText(/Locked until the required gate is resolved/i);
      await expect(phase8.getByTestId("ux-phase8-no-overclaim")).toContainText(/gates remain unresolved until their own checks pass/i);
      await expect(phase8).not.toContainText(/proof|Exactly one primary CTA/i);
      await expect(guidance).not.toContainText(/client visibility unlocked|download ready|evidence sufficient|release complete|share ready|admin override/i);
    });
  }
});
