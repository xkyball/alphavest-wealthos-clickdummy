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

test.beforeEach(async ({ page }) => {
  await authenticate(page);
});

test.describe("SCF P04-P06 application flow controls", () => {
  test("renders P04 evidence lifecycle on upload and review surfaces", async ({ page }) => {
    await page.goto("/documents/upload");

    const uploadGate = page.getByTestId("p04-p06-evidence-gate").first();
    await expect(uploadGate.getByText("Evidence Lifecycle Gate")).toBeVisible();
    await expect(uploadGate.getByText("Upload received, review pending")).toBeVisible();
    await expect(uploadGate.getByText("Not sufficient")).toBeVisible();
    await expect(uploadGate.getByText("evidence review").first()).toBeVisible();

    await page.goto("/documents/review-queue");
    const reviewGate = page.getByTestId("p04-p06-evidence-gate").first();
    await expect(reviewGate.getByText("Evidence Lifecycle Gate")).toBeVisible();
    await expect(reviewGate.getByText("Sufficiency requires review, scope, currentness, acceptance and client-safe visibility.")).toBeVisible();
  });

  test("renders P05 advisory boundary on signal and advisor surfaces", async ({ page }) => {
    await page.goto("/advisory/triggers/demo/review");

    const signalGate = page.getByTestId("p04-p06-advisory-gate").first();
    await expect(signalGate.getByText("Advisory Signal Boundary")).toBeVisible();
    await expect(signalGate.getByText("Hidden from client")).toBeVisible();
    await expect(signalGate.getByText("ai draft internal only")).toBeVisible();

    await page.goto("/advisor/reviews/demo");
    const advisorGate = page.getByTestId("p04-p06-advisory-gate").first();
    await expect(advisorGate.getByText("Advisor approval moves the item to compliance pending; it does not release content.")).toBeVisible();
    await expect(page.getByText("Advisor approval saved. Compliance release is still required.")).toHaveCount(0);
  });

  test("renders P06 compliance and audit gates on compliance surfaces", async ({ page }) => {
    await page.goto("/compliance/reviews");

    const complianceGate = page.getByTestId("p04-p06-compliance-gate").first();
    await expect(complianceGate.getByText("Compliance Release Gate")).toBeVisible();
    await expect(complianceGate.getByText("Release blocked until prerequisites pass")).toBeVisible();
    await expect(complianceGate.getByText("advisor approval").first()).toBeVisible();
    await expect(complianceGate.getByText("payload ready").first()).toBeVisible();

    await page.goto("/compliance/reviews/demo/audit");
    const auditGate = page.getByTestId("p04-p06-audit-gate").first();
    await expect(auditGate.getByText("Audit Persistence Gate")).toBeVisible();
    await expect(auditGate.getByText("SCF-P04-P06-CRITICAL-GATE-AUDIT")).toBeVisible();
    await expect(auditGate.getByText("audit persistence").first()).toBeVisible();
  });
});
