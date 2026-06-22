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

test.describe("AlphaVest product guidance shell", () => {
  test("topbar exposes controlled tenant and role scenario context without clickdummy wording", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1000 });
    await page.goto("/client/home");

    const topbar = page.getByRole("banner");
    await expect(topbar.getByText("Tenant context", { exact: true })).toBeVisible();
    await expect(topbar.getByText("Controlled scenario context; production auth is not claimed")).toHaveCount(0);
    await expect(topbar.getByLabel("Tenant context")).toBeVisible();
    await expect(topbar.getByLabel("Role context")).toBeVisible();
    await expect(topbar.getByText(/clickdummy|prototype|screen catalogue/i)).toHaveCount(0);
  });

  test("demo actor handoff makes role changes visible in the app chrome", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.removeItem("alphavest.demoSession.v1");
    });
    await page.goto("/documents");

    const handoff = page.getByTestId("demo-actor-handoff");
    await expect(handoff).toContainText("Active actor");
    await expect(page.getByTestId("demo-actor-handoff-current")).toContainText("Compliance Officer");

    await page.getByLabel("Role context").last().selectOption("analyst");
    await expect(handoff).toContainText("Role handoff");
    await expect(handoff).toContainText("Analyst");
    await expect(page.getByTestId("demo-actor-handoff-current")).toContainText("Analyst");

    await page.getByLabel("Role context").last().selectOption("principal");
    await expect(handoff).toContainText("Role handoff");
    await expect(handoff).toContainText("Principal");
    await expect(page.getByTestId("demo-actor-handoff-current")).toContainText("Principal");
  });

  test("workbench guidance explains purpose and next controlled step", async ({ page }) => {
    await page.goto("/advisory/review-queue");

    const guidance = page.getByTestId("product-guidance");
    await expect(guidance.getByTestId("ux-density-page-job").first()).toHaveText("Workbench");
    await expect(guidance.getByText("Advisory workflow").first()).toBeVisible();
    await expect(guidance.getByText("Internal draft only. Advisor approval and compliance release are separate downstream gates.").first()).toBeVisible();
    await expect(guidance.getByRole("link", { name: "Send to advisor review" })).toHaveAttribute("href", "/advisor/reviews");
    await expect(guidance.getByRole("link", { name: "Open compliance queue" }).first()).toHaveAttribute("href", "/compliance/reviews");
  });

  test("document upload guidance keeps upload separate from evidence sufficiency", async ({ page }) => {
    await page.goto("/documents/upload");

    const guidance = page.getByTestId("product-guidance");
    await expect(guidance.getByTestId("ux-density-page-job").first()).toHaveText("Document upload");
    await expect(guidance.getByText("Upload is not evidence sufficiency. Human review, scope, currentness and linkage still have to pass.").first()).toBeVisible();
    await expect(guidance.getByRole("link", { name: "Review extraction" })).toHaveAttribute("href", "/documents/review-queue");
    await expect(guidance.getByText(/release now|client visibility unlocked|evidence sufficiency complete/i)).toHaveCount(0);
  });

  test("client portal guidance communicates client-safe released visibility", async ({ page }) => {
    await page.goto("/client/home");

    const guidance = page.getByTestId("product-guidance");
    await expect(guidance.getByTestId("ux-density-page-job").first()).toHaveText("Client portal");
    await expect(guidance.getByText("Client-facing view: only released, client-safe content should be visible here.").first()).toBeVisible();
    await expect(guidance.getByRole("link", { name: "Upload source for review" })).toHaveAttribute("href", "/documents/upload");
  });

  test("compliance and export guidance preserve release, redaction and approval boundaries", async ({ page }) => {
    await page.goto("/compliance/reviews");

    let guidance = page.getByTestId("product-guidance");
    await expect(guidance.getByText("Compliance release controls client visibility. Missing evidence or audit blocks release.").first()).toBeVisible();
    await expect(guidance.getByRole("link", { name: "Open compliance review" })).toHaveAttribute("href", "/compliance/reviews/demo/decision-room");

    await page.goto("/export/new");
    guidance = page.getByTestId("product-guidance");
    await expect(guidance.getByText("Export starts with scope only; redaction, preview, approval, download and share remain separate.").first()).toBeVisible();
    await expect(guidance.getByRole("link", { name: "Select export scope" })).toHaveAttribute("href", "/export/demo/scope");
  });

  test("support, reference and elevated routes expose current True-UX scope labels", async ({ page }) => {
    await page.goto("/communication/demo/context");
    await expect(page.getByTestId("product-guidance").getByTestId("ux-density-status").first()).toHaveText("P1 / later");
    await expect(page.getByTestId("product-guidance").getByText("Communication adds context only. Advice-like copy and client delivery remain release-controlled.").first()).toBeVisible();

    await page.goto("/service-blueprint");
    await expect(page.getByTestId("product-guidance").getByTestId("ux-density-status").first()).toHaveText("Reference only");

    await page.goto("/committee/reviews");
    await expect(page.getByTestId("product-guidance").getByTestId("ux-density-status").first()).toHaveText("Held / not MVP");
  });
});
