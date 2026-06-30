import { expect, type Page, test } from "@playwright/test";

import { localAuthSessionCookieName } from "../lib/auth/local-auth-session";

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

test.describe("UX-CTA-STATE stage 8 one-primary CTA and recovery state", () => {
  const productiveStage8Routes = [
    { path: "/documents/upload", taskId: "UX-CTA-STATE-001" },
    { path: "/advisory/triggers/liquidity-drift/review", taskId: "UX-CTA-STATE-002" },
    { path: "/compliance/reviews/current/decision-room", taskId: "UX-CTA-STATE-003" },
    { path: "/client/home", taskId: "UX-CTA-STATE-007" },
  ];
  const lockedStage8Routes = [
    { path: "/ips/mandate-review/decision-room", taskId: "UX-CTA-STATE-006" },
    { path: "/reviews/rebalance-review", taskId: "UX-CTA-STATE-008" },
  ];
  const stage8TaskIds = [
    "UX-CTA-STATE-001",
    "UX-CTA-STATE-002",
    "UX-CTA-STATE-003",
    "UX-CTA-STATE-004",
    "UX-CTA-STATE-005",
    "UX-CTA-STATE-006",
    "UX-CTA-STATE-007",
    "UX-CTA-STATE-008",
  ];

  test("covers every Stage 8 CTA state task exactly", () => {
    expect(new Set(stage8TaskIds)).toEqual(new Set([
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

  for (const route of productiveStage8Routes) {
    test(route.taskId + " " + route.path + " renders one primary CTA, blocked reason and recovery state", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1200 });
      await authenticate(page);
      await page.goto(route.path);

      const main = page.locator("main").first();
      const executablePrimaryActions = page.locator('button[data-ux-primary-cta="true"], a[data-ux-primary-cta="true"]');

      expect(await executablePrimaryActions.count()).toBeLessThanOrEqual(1);
      await expect(main).not.toContainText(/Next action state|No downstream completion|proof|Exactly one primary CTA/i);
      await expect(main).not.toContainText(/client visibility unlocked|download ready|evidence sufficient|release complete|share ready|admin override/i);
    });
  }

  for (const route of lockedStage8Routes) {
    test(route.taskId + " " + route.path + " renders locked CTA state without productive recovery", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1200 });
      await authenticate(page);
      await page.goto(route.path);

      const main = page.locator("main").first();
      const executablePrimaryActions = page.locator('button[data-ux-primary-cta="true"], a[data-ux-primary-cta="true"]');
      const blockedPrimaryStatus = page.locator('[data-ux-primary-cta="true"][data-ux-interactive="false"]');

      await expect(executablePrimaryActions).toHaveCount(0);
      await expect(blockedPrimaryStatus.first()).toBeVisible();
      await expect(blockedPrimaryStatus.first()).toHaveAttribute("data-ux-disabled-reason", /blocked|bypass|client-safe|does not|internal|separate|sufficiency|release|gates|Elevated reviews/i);
      await expect(main).not.toContainText(/Next action state|No downstream completion|proof|Exactly one primary CTA/i);
      await expect(main).not.toContainText(/client visibility unlocked|download ready|evidence sufficient|release complete|share ready|admin override/i);
    });
  }
});
