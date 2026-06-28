import { expect, type Page, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";

async function authenticate(page: Page) {
  await page.context().addCookies([
    {
      httpOnly: true,
      domain: "127.0.0.1",
      name: demoAuthSessionCookieName,
      path: "/",
      sameSite: "Lax",
      value: "av-session-playwright-authenticated",
    },
  ]);
}

test.describe("EPIC-09 proof and client-safe boundaries", () => {
  test("S034 exposes concise internal proof without client-safe or release overclaim", async ({ page }) => {
    await authenticate(page);
    await page.goto("/advisory/review-queue");

    const proof = page.getByTestId("epic09-s034-draft-step-surface");
    await expect(proof).toHaveAttribute("data-epic09-proof-placement", "queue_summary_strip");
    await expect(proof).toHaveAttribute("data-epic09-proof-client-safe-payload", "none_internal_only");
    await expect(proof).toHaveAttribute("data-epic09-proof-audit-posture", "summary_only_not_audit_record");
    await expect(proof).toHaveAttribute("data-epic09-proof-blocked-overclaims", /client_visibility/);
    await expect(proof).toHaveAttribute("data-epic09-proof-blocked-overclaims", /evidence_gap_as_sufficiency/);

    await expect(page.locator('[data-wp02-route-id="034"]')).not.toContainText(/advisor approved|compliance released|release complete|export ready|client visibility unlocked/i);
  });

  test("S035 keeps trigger audit proof required and internal-only without persisted-audit claim", async ({ page }) => {
    await authenticate(page);
    await page.goto("/advisory/triggers/demo/review");

    const proof = page.getByTestId("epic09-s035-draft-step-surface");
    await expect(proof).toHaveAttribute("data-epic09-proof-placement", "trigger_audit_strip");
    await expect(proof).toHaveAttribute("data-epic09-proof-client-safe-payload", "none_internal_only");
    await expect(proof).toHaveAttribute("data-epic09-proof-audit-posture", "required_not_claimed_persisted");
    await expect(proof).toHaveAttribute("data-epic09-proof-blocked-overclaims", /route_to_advisor_as_approval/);
    await expect(proof).toHaveAttribute("data-epic09-proof-blocked-overclaims", /redaction_as_release/);

    await expect(page.getByText("Audit logging required before accepted save")).toBeVisible();
    await expect(page.locator('[data-wp02-route-id="035"]')).not.toContainText(/all notes are audit logged|advisor approved|compliance released|release complete|export ready|client visibility unlocked/i);
  });
});
