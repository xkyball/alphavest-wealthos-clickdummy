import { mkdirSync } from "node:fs";
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

test.describe("DOMAIN-4 advisor review operational UI", () => {
  test("S036 exposes advisor queue with one primary next action and no release overclaim", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1400 });
    await authenticate(page);
    await page.goto("/advisor/reviews");

    const queue = page.getByTestId("s036-advisor-master-list");
    await expect(queue).toBeVisible();

    await expect(page.getByTestId("domain10-s036-primary-next-action")).toHaveCount(1);
    await expect(page.getByTestId("s036-open-selected-review")).toBeVisible();
    await expect(page.locator('[data-workflow02-route-id="036"]')).not.toContainText(/released to client|export ready|proof|contract|processes mapped/i);

    const metrics = await queue.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        top: rect.top,
      };
    });
    expect(metrics.top).toBeGreaterThanOrEqual(0);
    expect(metrics.bottom).toBeLessThanOrEqual(900);

    mkdirSync("artifacts/screenshots/domain-4", { recursive: true });
    await page.screenshot({
      fullPage: false,
      path: "artifacts/screenshots/domain-4/domain4-d3-s036-advisor-queue.png",
    });
  });

  test("S037 requires advisor rationale and exposes approval plus negative workflow paths", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1400 });
    await authenticate(page);
    await page.goto("/advisor/reviews/liquidity-package");

    const panel = page.getByTestId("bd07-advisor-decision-room-panel");
    const stepSurface = page.getByTestId("domain10-s037-step-surface");
    await expect(panel).toBeVisible();
    await expect(stepSurface).toBeVisible();
    await expect(panel).toHaveAttribute("data-domain10-page-family", "advisor_review_detail");

    const approve = page.getByRole("button", { name: "Approve for compliance review" });
    const requestEvidence = page.getByRole("button", { name: "Request evidence follow-up" });
    const returnToAnalyst = page.getByRole("button", { name: "Return to analyst" });
    await expect(approve).toBeDisabled();
    await expect(requestEvidence).toBeDisabled();
    await expect(returnToAnalyst).toBeDisabled();
    await page.getByTestId("advisor-rationale-input").fill("Advisor reviewed the options and needs this next workflow step.");
    await expect(approve).toBeEnabled();
    await expect(requestEvidence).toBeEnabled();
    await expect(returnToAnalyst).toBeEnabled();
    await expect(stepSurface).toContainText("No client release");
    await expect(panel).not.toContainText(/released to client|client visibility unlocked|export ready|client-ready/i);
    await expect(page.locator('[data-workflow02-route-id="037"]')).not.toContainText(/proof|contract|processes mapped|gate ids/i);

    const metrics = await stepSurface.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        top: rect.top,
      };
    });
    expect(metrics.top).toBeGreaterThanOrEqual(0);
    expect(metrics.bottom).toBeLessThanOrEqual(900);

    mkdirSync("artifacts/screenshots/domain-4", { recursive: true });
    await page.screenshot({
      fullPage: false,
      path: "artifacts/screenshots/domain-4/domain4-d3-s037-advisor-detail.png",
    });
  });
});
