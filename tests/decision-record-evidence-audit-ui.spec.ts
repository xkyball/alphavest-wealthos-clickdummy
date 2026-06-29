import { mkdirSync } from "node:fs";
import { expect, type Locator, type Page, test } from "@playwright/test";

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

const forbiddenVisibleInternalCopy = /EPIC-|BP-\d+|process-first|proof boundary|route id|page id|data-testid|client acceptance|export ready|evidence sufficient|released to client/i;

async function expectNoVisibleInternalCopy(scope: Locator) {
  const visibleText = await scope.evaluate((node) => (node as HTMLElement).innerText);
  expect(visibleText).not.toMatch(forbiddenVisibleInternalCopy);
}

test.describe("EPIC-12 decision record evidence audit UI", () => {
  test("S043 exposes a real decision-record workbench entry with step pendants and one next action", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1400 });
    await authenticate(page);
    await page.goto("/decisions");

    const entry = page.getByTestId("epic12-decision-record-entry");
    await expect(entry).toBeVisible();
    await expect(entry).toHaveAttribute("data-epic12-contract", "EPIC-12_DECISION_RECORD_EVIDENCE_AUDIT_CONTRACT");
    await expect(entry).toHaveAttribute("data-epic12-page-family", "decision_register");
    await expect(entry).toHaveAttribute("data-epic12-processes", /BP-075/);
    await expect(entry).toHaveAttribute("data-epic12-processes", /BP-076/);
    await expect(entry).toHaveAttribute("data-epic12-processes", /BP-078/);
    await expect(entry).toHaveAttribute("data-epic12-step-pendants", /Decision row, selected decision object and action intent/);
    await expect(entry).toHaveAttribute("data-epic12-step-pendants", /Decision register selection and detail open gate/);
    await expect(entry).toHaveAttribute("data-epic12-step-pendants", /Scoped decision detail or selected decision record/);
    await expect(entry).toHaveAttribute("data-epic12-step-pendants", /Role, tenant, scope or missing precondition/);
    await expect(entry).toHaveAttribute("data-epic12-proof-blocked-overclaims", /client_visibility_without_release_projection/);

    await expect(page.getByTestId("epic12-open-decision-room")).toHaveCount(1);
    await expect(page.getByTestId("epic12-open-decision-room")).toHaveAttribute("href", "/decisions/demo");
    await expect(page.getByTestId("epic12-audit-history-pendant")).toHaveAttribute("href", "/governance/audit");

    await expect(page.getByTestId("epic12-step-pendant-input")).toBeVisible();
    await expect(page.getByTestId("epic12-step-pendant-output")).toBeVisible();
    await expect(page.getByTestId("epic12-step-pendant-blocker")).toBeVisible();
    await expect(entry).toContainText("Rationale");
    await expect(entry).toContainText("Evidence");
    await expect(entry).toContainText("Audit history");
    await expect(entry).toContainText("Action restricted");

    await expectNoVisibleInternalCopy(entry);
    await expectNoVisibleInternalCopy(page.locator("body"));

    const metrics = await entry.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        top: rect.top,
      };
    });
    expect(metrics.top).toBeGreaterThanOrEqual(0);
    expect(metrics.bottom).toBeLessThanOrEqual(900);

    mkdirSync("artifacts/screenshots/epic-12", { recursive: true });
    await page.screenshot({
      fullPage: false,
      path: "artifacts/screenshots/epic-12/epic12-impl01a-s043-decision-entry.png",
    });
  });
});
