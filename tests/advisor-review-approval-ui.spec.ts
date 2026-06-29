import { mkdirSync } from "node:fs";
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

test.describe("EPIC-10 advisor review approval UI contract", () => {
  test("S036 exposes a contract-backed area entry with one primary next action and no release overclaim", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1400 });
    await authenticate(page);
    await page.goto("/advisor/reviews");

    const entry = page.getByTestId("epic10-s036-area-entry");
    await expect(entry).toBeVisible();
    await expect(entry).toHaveAttribute("data-epic10-contract", "EPIC-10_ADVISOR_REVIEW_APPROVAL_CONTRACT");
    await expect(entry).toHaveAttribute("data-epic10-page-family", "advisor_review_queue");
    await expect(entry).toHaveAttribute("data-epic10-client-safe-payload", "none_advisor_internal_only");
    await expect(entry).toHaveAttribute("data-epic10-processes", /BP-050/);
    await expect(entry).toHaveAttribute("data-epic10-processes", /BP-055/);

    await expect(page.getByTestId("epic10-s036-primary-next-action")).toHaveCount(1);
    await expect(entry).toContainText("Client visibility remains locked until compliance release.");
    await expect(entry).not.toContainText(/released to client|export ready/i);

    const metrics = await entry.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        top: rect.top,
      };
    });
    expect(metrics.top).toBeGreaterThanOrEqual(0);
    expect(metrics.bottom).toBeLessThanOrEqual(900);

    mkdirSync("artifacts/screenshots/epic-10", { recursive: true });
    await page.screenshot({
      fullPage: false,
      path: "artifacts/screenshots/epic-10/epic10-impl01a-s036-area-entry.png",
    });
  });

  test("S037 exposes a compact advisor step surface without release or export overclaim", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1400 });
    await authenticate(page);
    await page.goto("/advisor/reviews/demo");

    const panel = page.getByTestId("bd07-advisor-decision-room-panel");
    const stepSurface = page.getByTestId("epic10-s037-step-surface");
    await expect(panel).toBeVisible();
    await expect(stepSurface).toBeVisible();
    await expect(panel).toHaveAttribute("data-epic10-contract", "EPIC-10_ADVISOR_REVIEW_APPROVAL_CONTRACT");
    await expect(panel).toHaveAttribute("data-epic10-page-family", "advisor_review_detail");
    await expect(panel).toHaveAttribute("data-epic10-client-safe-payload", "none_advisor_internal_only");
    await expect(panel).toHaveAttribute("data-epic10-processes", /BP-050/);
    await expect(panel).toHaveAttribute("data-epic10-processes", /BP-055/);

    await expect(page.getByRole("button", { name: "Approve for compliance review" })).toHaveCount(1);
    await expect(stepSurface).toContainText("No client release");
    await expect(panel).not.toContainText(/released to client|client visibility unlocked|export ready|client-ready/i);

    const metrics = await stepSurface.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        top: rect.top,
      };
    });
    expect(metrics.top).toBeGreaterThanOrEqual(0);
    expect(metrics.bottom).toBeLessThanOrEqual(900);

    mkdirSync("artifacts/screenshots/epic-10", { recursive: true });
    await page.screenshot({
      fullPage: false,
      path: "artifacts/screenshots/epic-10/epic10-impl01b-s037-advisor-detail.png",
    });
  });
});
