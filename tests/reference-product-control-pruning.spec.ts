import { expect, type Page, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";

const referenceRoutes = [
  { path: "/service-blueprint", title: "Service Blueprint" },
  { path: "/roadmap", title: "MVP vs Future Scope" },
  { path: "/states", title: "State and Badge Reference" },
] as const;

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

test.describe("UXP2-008 reference product-control pruning", () => {
  test.beforeEach(async ({ page }) => {
    await authenticate(page);
  });

  for (const route of referenceRoutes) {
    test(`${route.title} exposes reference status without product controls`, async ({ page }) => {
      await page.goto(route.path);

      const referenceShell = page.locator('[data-ux-route-scope="REFERENCE_ONLY"]');
      const staticReferenceStatus = page
        .locator('[data-ux-primary-cta="true"][data-ux-interactive="false"]')
        .filter({ hasText: "Reference only" });

      await expect(page.getByRole("heading", { name: route.title })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Reference Workspace" })).toBeVisible();
      await expect(referenceShell).toHaveAttribute("data-ux-reference-product-controls", "removed");
      await expect(referenceShell).toHaveAttribute("data-ux-productive-controls", "false");
      await expect(page.getByRole("button", { name: "Reference only" })).toHaveCount(0);
      await expect(page.locator('button[data-ux-primary-cta="true"], a[data-ux-primary-cta="true"]')).toHaveCount(0);
      await expect(staticReferenceStatus).toBeVisible();
      await expect(page.getByText("No product controls are available for reference-only routes.")).toBeVisible();
    });
  }

});
