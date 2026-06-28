import { expect, type Page, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";

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

test.describe("UXP3-010 evidence drawer lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    await authenticate(page);
  });

  test("opens evidence drawer with loading, ready and blocked states", async ({ page }) => {
    await page.goto("/evidence?state=base");
    await expect(page.getByRole("complementary", { name: "Risk Tolerance Questionnaire" })).toHaveCount(0);

    const trigger = page.getByTestId("j03-open-evidence-drawer");
    await expect(trigger).toHaveAttribute("data-ux-lifecycle-trigger", "evidence-drawer");
    await expect(trigger).toHaveAttribute("data-ux-lifecycle-result", "opens-evidence-drawer");
    await trigger.click();

    const drawer = page.getByRole("complementary", { name: "Risk Tolerance Questionnaire" });
    const lifecycle = page.getByTestId("uxp3-evidence-drawer-lifecycle");
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("data-ux-interaction-lifecycle", "drawer");
    await expect(drawer).toHaveAttribute("data-ux-lifecycle-cancel", "no-submit-no-mutation");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "loading");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-validation", "blocked-client-visibility-gates");
    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-submit", "blocked-no-authorized-download-action");
    await expect(lifecycle).toHaveAttribute("data-ux-no-overclaim", "true");
    await expect(page.getByTestId("j03-evidence-loading-state")).toContainText("Retrieving source context for review.");

    await expect(lifecycle).toHaveAttribute("data-ux-lifecycle-status", "success");
    await expect(page.getByTestId("j03-evidence-success-state")).toContainText("Source context is loaded for the selected record.");
    await expect(page.getByTestId("j03-evidence-blocked-state")).toContainText("Publication and external sharing continue from the release workspace.");
    await expect(page.getByTestId("j03-evidence-download-blocked")).toBeDisabled();
  });

  test("cancel, Escape and backdrop close without workflow mutation", async ({ page }) => {
    const workflowRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/advice-release-history/actions")) {
        workflowRequests.push(request.method());
      }
    });

    await page.goto("/evidence?state=base");
    const trigger = page.getByTestId("j03-open-evidence-drawer");

    await trigger.click();
    let drawer = page.getByRole("complementary", { name: "Risk Tolerance Questionnaire" });
    await expect(drawer).toBeVisible();
    await drawer.getByRole("button", { name: "Cancel" }).click();
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    drawer = page.getByRole("complementary", { name: "Risk Tolerance Questionnaire" });
    await expect(drawer).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();

    await trigger.click();
    drawer = page.getByRole("complementary", { name: "Risk Tolerance Questionnaire" });
    await expect(drawer).toBeVisible();
    await page.mouse.click(24, 24);
    await expect(drawer).toBeHidden();

    expect(workflowRequests).toEqual([]);
  });

  test("drawer copy does not overclaim downstream gates", async ({ page }) => {
    await page.goto("/evidence?state=base");
    await page.getByTestId("j03-open-evidence-drawer").click();

    const drawer = page.getByRole("complementary", { name: "Risk Tolerance Questionnaire" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText(/release complete|evidence sufficient|download ready|share ready|client accepted/i)).toHaveCount(0);
  });
});
