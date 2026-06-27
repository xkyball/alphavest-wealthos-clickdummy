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

  test("default operational shell suppresses retired guidance and reviewer surfaces", async ({ page }) => {
    await page.goto("/advisory/review-queue");

    const operationalSurface = page.getByTestId("ux-operational-default-surface").first();
    await expect(operationalSurface).toHaveAttribute("data-ux-proof-mode", "operational_default");
    await expect(operationalSurface).toHaveAttribute("data-ux-proof-debug-default-visible", "false");
    await expect(operationalSurface).toHaveAttribute("data-ux-reviewer-secondary-surface", "not-rendered");
    await expect(page.getByTestId("product-guidance")).toHaveCount(0);
    await expect(page.getByTestId("ux-proof-reviewer-secondary-surface")).toHaveCount(0);
    await expect(page.getByTestId("page-header-route-context")).toHaveCount(0);
  });

  test("topbar keeps only operational route context in the default workflow", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1000 });
    await page.goto("/advisory/review-queue");

    const routeContext = page.getByTestId("ux-nav-route-context").first();
    await expect(routeContext).toBeVisible();
    await expect(routeContext).toHaveAttribute("data-ux-proof-mode", "operational_default");
    await expect(routeContext).toHaveAttribute("data-ux-proof-content-class", "route_context");
    await expect(routeContext).toContainText("Workbench");
    await expect(routeContext).not.toContainText(/034|route id|ux proof|debug|capture/i);
  });

  test("client portal default workflow stays free of reviewer-only metadata", async ({ page }) => {
    await page.goto("/client/home");

    await expect(page.getByTestId("product-guidance")).toHaveCount(0);
    await expect(page.getByTestId("ux-proof-reviewer-secondary-surface")).toHaveCount(0);
    await expect(page.getByText(/route id|ux proof tag|capture warning|debug metadata|internal rationale/i)).toHaveCount(0);

    const hub = page.getByTestId("ux-hub-page").first();
    await expect(hub).toHaveAttribute("data-ux-client-mode", "client_mode");
    await expect(hub).toHaveAttribute("data-ux-client-mode-missing-suppression", "");
    await expect(hub).toHaveAttribute("data-ux-client-mode-suppressed", /route_id/);
    await expect(hub).toHaveAttribute("data-ux-client-mode-suppressed", /ux_proof_tag/);
    await expect(hub).toHaveAttribute("data-ux-client-mode-suppressed", /debug_metadata/);
  });
});
