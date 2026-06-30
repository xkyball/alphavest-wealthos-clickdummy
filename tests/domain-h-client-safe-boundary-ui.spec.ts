import { expect, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";

const domainHRoutes = [
  { boundary: "domain-h-s044-client-safe-boundary", path: "/decisions/liquidity-governance" },
  { boundary: "domain-h-s045-client-safe-boundary", path: "/decisions/liquidity-governance/success" },
  { boundary: "workflow07-client-safe-projection-card", path: "/mobile" },
];

const forbiddenVisibleDomainHText =
  /DOMAIN_H|BP-067|BP-068|BP-069|step contract|proof boundary|proof panel|payload keys|hidden fields|internalRationale|complianceNotes|auditMetadata|assumptionsJson|evidenceRecordId|Client-safe summary|projection rules|client projection|fail-closed fallback|permitted metadata|Controlled visibility|Sensitive actions are audit logged|Client material|No released content is available yet/i;

async function authenticate(page: import("@playwright/test").Page) {
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

test.describe("DOMAIN-H client-safe boundary UI", () => {
  for (const route of domainHRoutes) {
    test(`${route.path} keeps proof/audit details out of visible UI`, async ({ page }) => {
      await authenticate(page);
      await page.goto(route.path);

      await expect(page.getByTestId(route.boundary)).toHaveCount(1);
      await expect(page.locator("body")).not.toContainText(forbiddenVisibleDomainHText);
    });
  }

  test("decision summary boundaries expose machine-readable client-safe attributes only", async ({ page }) => {
    await authenticate(page);
    await page.goto("/decisions/liquidity-governance");

    const boundary = page.getByTestId("domain-h-s044-client-safe-boundary");
    await expect(boundary).toHaveAttribute("data-e07-client-safe-family", "decision_client_summary");
    await expect(boundary).toHaveAttribute("data-e07-client-safe-mode", "client_safe_ui");
    await expect(boundary).toHaveAttribute("data-e07-backend-security-scope", "ui_projection_only_not_rbac");
    await expect(boundary).toHaveAttribute("data-e07-suppressed-classes", /internal_rationale/);
  });
});
