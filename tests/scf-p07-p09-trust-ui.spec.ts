import { expect, test } from "@playwright/test";

test.describe("SCF P07-P09 client visibility, governance and export controls", () => {
  test("renders P07 client-safe visibility projection on the client portal", async ({ page }) => {
    await page.goto("/portal");

    const visibilityGate = page.getByTestId("p07-p09-visibility-trust").first();
    await expect(visibilityGate.getByText("Client Visibility Projection")).toBeVisible();
    await expect(visibilityGate.getByText("Released summary")).toBeVisible();
    await expect(visibilityGate.getByText("Internal fields hidden")).toBeVisible();
    await expect(visibilityGate.getByText("Unreleased content")).toBeVisible();
    await expect(visibilityGate.getByText("DEMO_CLIENT_SAFE_PROJECTION").first()).toBeVisible();
  });

  test("renders P07 decision submitted/released projection on decision surfaces", async ({ page }) => {
    await page.goto("/decisions");

    const decisionGate = page.getByTestId("p07-p09-decision-trust").first();
    await expect(decisionGate.getByText("Decision State Projection")).toBeVisible();
    await expect(decisionGate.getByText("Submitted stays internal")).toBeVisible();
    await expect(decisionGate.getByText("Released projection")).toBeVisible();
    await expect(decisionGate.getByText("DEMO_CLIENT_DECISION_SAFE_PROJECTION").first()).toBeVisible();

    await page.goto("/decisions/demo/success");
    await expect(page.getByTestId("p07-p09-decision-trust").first().getByText("Internal fields")).toBeVisible();
  });

  test("renders P08 governance non-bypass controls on governance and admin surfaces", async ({ page }) => {
    await page.goto("/governance/users");

    const governanceGate = page.getByTestId("p07-p09-governance-trust").first();
    await expect(governanceGate.getByText("Governance Non-Bypass")).toBeVisible();
    await expect(governanceGate.getByText("Admin cannot force advice")).toBeVisible();
    await expect(governanceGate.getByText("Cross-tenant rows")).toBeVisible();
    await expect(governanceGate.getByText("Export non-bypass")).toBeVisible();
    await expect(governanceGate.getByText("DEMO DENY ADMIN ADVICE PAYLOAD NON BYPASS").first()).toBeVisible();

    await page.goto("/admin/platform");
    await expect(page.getByTestId("p07-p09-governance-trust").first().getByText("Governance Non-Bypass")).toBeVisible();
  });

  test("renders P09 export scope, redaction and approval lifecycle controls", async ({ page }) => {
    await page.goto("/export/demo/redaction");

    const exportGate = page.getByTestId("p07-p09-export-trust").first();
    await expect(exportGate.getByText("Export Redaction Lifecycle")).toBeVisible();
    await expect(exportGate.getByText("Scope selected")).toBeVisible();
    await expect(exportGate.getByText("Forbidden payloads")).toBeVisible();
    await expect(exportGate.getByText("Step separation")).toBeVisible();
    await expect(exportGate.getByText("approval required before generation").first()).toBeVisible();

    await page.goto("/export/demo/preview");
    await expect(page.getByTestId("p07-p09-export-trust").first().getByText("Forbidden fields detected")).toBeVisible();
  });
});
