import { expect, type Page, test } from "@playwright/test";

import { authenticatePageWithJwt } from "./helpers/auth-jwt";

async function authenticate(page: Page, request: Parameters<typeof authenticatePageWithJwt>[1]) {
  await authenticatePageWithJwt(page, request);
}

test.beforeEach(async ({ page, request }) => {
  await authenticate(page, request);
});

test.describe("AlphaVest product guidance shell", () => {
  test("topbar hides tenant and role switchers after login", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1000 });
    await page.goto("/client/home");

    const topbar = page.getByRole("banner");
    await expect(topbar.getByText("Tenant context", { exact: true })).toHaveCount(0);
    await expect(topbar.getByText("Controlled scenario context; production auth is not claimed")).toHaveCount(0);
    await expect(topbar.getByLabel("Tenant context")).toHaveCount(0);
    await expect(topbar.getByLabel("Role context")).toHaveCount(0);
    await expect(topbar.getByText(/clickdummy|prototype|screen catalogue/i)).toHaveCount(0);
  });

  test("demo actor handoff is not rendered as in-app session switching chrome", async ({ page }) => {
    await page.goto("/documents");

    await expect(page.getByTestId("actor-handoff")).toHaveCount(0);
    await expect(page.getByTestId("actor-handoff-current")).toHaveCount(0);
    await expect(page.getByRole("banner").getByLabel("Role context")).toHaveCount(0);
  });

  test("account context follows DB JWT instead of browser-local actor storage", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "alphavest.actorSession.v1",
        JSON.stringify({ roleKey: "family_cfo", tenantSlug: "morgan" }),
      );
    });

    await page.setViewportSize({ width: 1600, height: 1000 });
    await page.goto("/client/home");

    const main = page.getByRole("main");
    await expect(main.getByText("Bennett Family Office").first()).toBeVisible();
    await expect(main.getByText("Bennett Family CFO").first()).toBeVisible();
    await expect(page.getByText("Morgan Family Office")).toHaveCount(0);
  });

  test("default operational shell suppresses retired guidance and reviewer surfaces", async ({ page }) => {
    await page.goto("/advisory/review-queue");

    const operationalSurface = page.getByTestId("ux-operational-default-surface").first();
    await expect(operationalSurface).toHaveAttribute("data-ux-operational-default", "true");
    await expect(page.getByTestId("product-guidance")).toHaveCount(0);
    await expect(page.getByTestId("ux-proof-reviewer-secondary-surface")).toHaveCount(0);
    await expect(page.getByTestId("proof-reviewer-panel")).toHaveCount(0);
    await expect(page.getByTestId("page-header-route-context")).toHaveCount(0);
  });

  test("operational family surfaces no longer import legacy product guidance wrappers", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const operationalFiles = [
      "components/app-shell.tsx",
      "components/client-intake-screen.tsx",
      "components/communication-export-ops-screen.tsx",
      "components/decisions-governance-screen.tsx",
      "components/internal-workflow-screen.tsx",
      "components/kyc-aml-workflow-screen.tsx",
      "components/wealth-actions-screen.tsx",
    ];

    for (const file of operationalFiles) {
      const source = readFileSync(join(process.cwd(), file), "utf8");

      expect(source, file).toContain("OperationalDefaultSurface");
      expect(source, file).not.toContain("ProductGuidanceContent");
      expect(source, file).not.toContain("@/components/product-guidance-panel");
      expect(source, file).not.toContain("ProofReviewerModeSlot");
    }
  });

  test("topbar hides operational route context chips in the default workflow", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1000 });
    await page.goto("/compliance/reviews");

    const topbar = page.getByRole("banner");
    await expect(topbar.getByTestId("ux-nav-route-context")).toHaveCount(0);
    await expect(topbar.getByText("Compliance queue")).toHaveCount(0);
    await expect(topbar.getByText("Bennett Family Office")).toHaveCount(0);
    await expect(topbar.getByText("Compliance Officer")).toHaveCount(0);
  });

  test("client portal default workflow stays free of reviewer-only metadata", async ({ page }) => {
    await page.goto("/client/home");

    await expect(page.getByTestId("product-guidance")).toHaveCount(0);
    await expect(page.getByTestId("ux-proof-reviewer-secondary-surface")).toHaveCount(0);
    await expect(page.getByTestId("proof-reviewer-panel")).toHaveCount(0);
    await expect(page.getByTestId("ux-nav-route-context")).toHaveCount(0);
    await expect(page.getByTestId("ux-stage5-detail-split")).toHaveCount(0);
    await expect(page.getByTestId("ux-stage7-client-projection")).toHaveCount(0);
    await expect(page.getByText(/route id|ux proof tag|capture warning|debug metadata|internal rationale/i)).toHaveCount(0);

    const clientBoundary = page.getByTestId("e07-client-safe-ui-boundary").first();
    await expect(clientBoundary).toHaveAttribute("data-e07-client-safe-ui-boundary", "true");
    await expect(clientBoundary).toHaveAttribute("data-e07-client-safe-family", "client_portal");
    await expect(clientBoundary).toHaveAttribute("data-e07-suppressed-classes", /ux_task_id/);
    await expect(clientBoundary).toHaveAttribute("data-e07-suppressed-classes", /proof_scaffolding/);
  });

  test("explicit reviewer query cannot reopen a proof surface", async ({ page }) => {
    await page.goto("/advisory?proofMode=reviewer", { waitUntil: "networkidle" });

    await expect(page.getByTestId("proof-reviewer-panel")).toHaveCount(0);
    await expect(page.getByTestId("ux-proof-reviewer-secondary-surface")).toHaveCount(0);
    await expect(page.getByText(/reviewer metadata|reviewer traceability|traceability only/i)).toHaveCount(0);

    await page.goto("/client/home?proofMode=reviewer", { waitUntil: "networkidle" });
    await expect(page.getByTestId("proof-reviewer-panel")).toHaveCount(0);
    await expect(page.getByTestId("proof-reviewer-mode-client-suppressed")).toHaveCount(0);
  });
});
