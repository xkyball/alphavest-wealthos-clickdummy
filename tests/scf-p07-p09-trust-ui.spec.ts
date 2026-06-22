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
  test("renders P07 client-safe visibility projection on the client portal", async ({ page }) => {
    await authenticate(page);
    await page.goto("/client/home");

    await expect(page.getByText("Phase 7 client-safe projection")).toBeVisible();
    await expect(page.getByText("Client projection stays separated from internal review and release gates.")).toBeVisible();
    await expect(page.getByText("Client projection cannot expose internal payloads.")).toBeVisible();
    await expect(page.getByText("No internal payload, manual override, unreleased evidence, AI Draft, compliance notes or storage keys.")).toBeVisible();
  });

  test("renders P07 decision submitted/released projection on decision surfaces", async ({ page }) => {
    await authenticate(page);
    await page.goto("/decisions/demo");

    const decisionGate = page.getByTestId("p07-p09-decision-trust").first();
    await expect(decisionGate.getByText("Decision State Projection")).toBeVisible();
    await expect(decisionGate.getByText("Submitted stays internal")).toBeVisible();
    await expect(decisionGate.getByText("Released projection")).toBeVisible();
    await expect(decisionGate.getByText("DEMO_CLIENT_DECISION_SAFE_PROJECTION").first()).toBeVisible();

    await page.goto("/decisions/demo/success");
    await expect(page.getByTestId("p07-p09-decision-trust").first().getByText("Internal fields")).toBeVisible();
  });

  test("renders P08 governance non-bypass controls on governance and admin surfaces", async ({ page }) => {
    await authenticate(page);
    await page.goto("/governance");

    const governanceGate = page.getByTestId("p07-p09-governance-trust").first();
    await expect(governanceGate.getByText("Governance action gate").first()).toBeVisible();
    await expect(governanceGate.getByText("Advice payload", { exact: true })).toBeVisible();
    await expect(governanceGate.getByText("Tenant scope", { exact: true })).toBeVisible();
    await expect(governanceGate.getByText("Controlled export", { exact: true })).toBeVisible();
    await expect(governanceGate.getByText("Advice payload blocked").first()).toBeVisible();
    await expect(governanceGate).not.toContainText(/DEMO_DENY|DEMO DENY/);

    await page.goto("/admin/platform");
    await expect(page.getByTestId("p07-p09-governance-trust").first().getByText("Governance action gate").first()).toBeVisible();
  });

  test("renders P09 export scope, redaction and approval lifecycle controls", async ({ page }) => {
    await authenticate(page);
    await page.goto("/export/demo/redaction");

    const exportGate = page.getByTestId("p07-p09-export-trust").first();
    await expect(exportGate.getByText("Export Redaction Lifecycle")).toBeVisible();
    await expect(exportGate.getByText("Scope selected")).toBeVisible();
    await expect(exportGate.getByText("Forbidden payloads")).toBeVisible();
    await expect(exportGate.getByText("Step separation")).toBeVisible();
    await expect(exportGate.getByText("approval required before generation").first()).toBeVisible();

    await page.goto("/export/demo/approval");
    await expect(page.getByTestId("p07-p09-export-trust").first().getByText("Forbidden fields detected")).toBeVisible();
  });
});
