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

test.describe("SCF P07-P09 client visibility, governance and export controls", () => {
  test("keeps the client portal free of deprecated P07 trust-panel copy", async ({ page }) => {
    await authenticate(page);
    await page.goto("/client/home");

    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).not.toContainText(/Client projection stays separated|internal payload|release gates|manual override|storage keys/i);
  });

  test("keeps P07 projection proof out of visible decision surfaces", async ({ page }) => {
    await authenticate(page);
    await page.goto("/decisions/demo");

    await expect(page.getByTestId("p07-p09-decision-trust")).toHaveCount(0);
    await expect(page.getByTestId("ux-phase7-client-projection")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText(/Client view stays fail-closed|client projection|projection rules|internal payload/i);

    await page.goto("/decisions/demo/success");
    await expect(page.getByTestId("p07-p09-decision-trust")).toHaveCount(0);
    await expect(page.getByTestId("epic12-decision-success-core")).toBeVisible();
    await expect(page.locator("body")).not.toContainText(/Controlled visibility|Sensitive actions are audit logged|Client material|projection rules/i);
  });

  test("keeps governance surfaces on product controls instead of deprecated P08 trust panels", async ({ page }) => {
    await authenticate(page);
    await page.goto("/governance");

    const governanceSurface = page.getByTestId("wp02-worksurface-shell");
    await expect(governanceSurface).toBeVisible();
    await expect(page.getByTestId("p07-p09-governance-trust")).toHaveCount(0);
    await expect(governanceSurface).not.toContainText(/Governance action gate|Advice payload|Tenant scope|DEMO_DENY|DEMO DENY/i);

    await page.goto("/admin/platform");
    await expect(page.getByTestId("p07-p09-governance-trust")).toHaveCount(0);
    await expect(page.getByTestId("wp02-worksurface-shell")).not.toContainText(/Governance action gate|Advice payload|Tenant scope|DEMO_DENY|DEMO DENY/i);
  });

  test("keeps export surfaces on product controls instead of deprecated P09 trust panels", async ({ page }) => {
    await authenticate(page);
    await page.goto("/export/demo/redaction");

    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.getByTestId("p07-p09-export-trust")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText(/Export Redaction Lifecycle|Scope selected|Forbidden payloads|Payload Redaction Operations/i);

    await page.goto("/export/demo/approval");
    await expect(page.getByTestId("p07-p09-export-trust")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText(/Export Redaction Lifecycle|Scope selected|Forbidden payloads|Payload Redaction Operations/i);
  });
});
