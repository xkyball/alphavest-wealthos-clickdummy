import { expect, type Page, test } from "@playwright/test";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

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

function enabledButtonsWithoutLifecycle() {
  const files = execSync("rg --files components app | rg '\\.(tsx)$'", { encoding: "utf8" }).trim().split("\n");
  const offenders: string[] = [];

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    const buttonPattern = /<button\b[\s\S]*?<\/button>/g;
    let match: RegExpExecArray | null;

    while ((match = buttonPattern.exec(source))) {
      const buttonSource = match[0];
      const line = source.slice(0, match.index).split("\n").length;
      const hasLifecycle = /onClick=/.test(buttonSource);
      const isDisabled = /disabled|aria-disabled/.test(buttonSource);

      if (!hasLifecycle && !isDisabled) {
        offenders.push(`${file}:${line}`);
      }
    }
  }

  return offenders;
}

test.describe("UXP2-007 button and CTA lifecycle pruning", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page);
  });

  test("keeps component buttons either lifecycle-backed or disabled", () => {
    expect(enabledButtonsWithoutLifecycle()).toEqual([]);
  });

  test("removes unwired action-board buttons while preserving the real selected-action path", async ({ page }) => {
    await page.goto("/actions");

    await expect(page.getByRole("button", { name: "Open selected action" })).toBeEnabled();
    await expect(page.getByRole("button", { name: /New wealth action|Add action/ })).toHaveCount(0);
    await expect(page.getByText("Column actions locked").first()).toBeVisible();
  });

  test("removes unwired auth and global notification buttons", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/login");

    await expect(page.getByRole("button", { name: /Sign in with SSO/ })).toHaveCount(0);
    await expect(page.getByText("Sign in with SSO")).toBeVisible();

    await page.goto("/client/home");
    await expect(page.getByRole("button", { name: /Notifications/ })).toHaveCount(0);
  });

  test("keeps handler-backed advisor decision CTA active and removes fake secondary buttons", async ({ page }) => {
    await page.goto("/advisor/reviews/demo");

    await expect(page.getByRole("button", { name: "Approve for compliance review" })).toBeEnabled();
    await expect(page.locator('button[data-testid="ux-cta-ai-rebuild"]')).toHaveCount(0);
    await expect(page.getByTestId("ux-cta-ai-rebuild")).toHaveText("Draft rebuild held for Phase 3");
  });
});
