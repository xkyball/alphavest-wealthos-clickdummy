import { expect, type Page, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import { localAuthSessionCookieName } from "../lib/auth/local-auth-session";

async function authenticate(page: Page) {
  await page.context().addCookies([
    {
      domain: "127.0.0.1",
      httpOnly: true,
      name: localAuthSessionCookieName,
      path: "/",
      sameSite: "Lax",
      value: "av-session-playwright-authenticated",
    },
  ]);
}

test.describe("UXP3-003 consent and policy modal lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page);
  });

  test("policy triggers open the selected review-only modal without consent overclaim", async ({ page }) => {
    await page.goto("/onboarding/consent");

    const termsTrigger = page.getByRole("button", { name: /Terms of Use/ });
    await expect(termsTrigger).toHaveAttribute("data-ux-lifecycle-trigger", "policy-review-modal");
    await expect(termsTrigger).toHaveAttribute("data-ux-lifecycle-result", "opens-review-only-policy-modal");

    await termsTrigger.click();

    const dialog = page.getByRole("dialog", { name: "Terms of Use" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("data-ux-interaction-lifecycle", "modal");
    await expect(dialog).toHaveAttribute("data-ux-lifecycle-close", "escape-backdrop-close-button-safe");
    await expect(dialog).toHaveAttribute("data-ux-lifecycle-cancel", "no-submit-no-mutation");
    await expect(dialog).toHaveAttribute("data-ux-lifecycle-submit", "owner-owned-confirmation-only");
    await expect(dialog).toHaveAttribute("data-ux-no-overclaim", "true");
    await expect(dialog.getByTestId("uxp3-consent-policy-modal")).toContainText("The terms that govern access to and use of AlphaVest WealthOS.");
    await expect(dialog).toContainText("Review-only policy modal");
    await expect(dialog).toContainText("Closing this modal does not accept terms, store consent records, create audit events or change role access.");
    await expect(dialog).not.toContainText(/consent stored|audit created|role active|client visibility unlocked|release complete|download ready|client accepted/i);
  });

  test("Close, Escape and backdrop return to consent page without advancing onboarding", async ({ page }) => {
    await page.goto("/onboarding/consent");

    const reviewPolicyButton = page.getByRole("button", { name: "Review policy" });
    await reviewPolicyButton.focus();
    await reviewPolicyButton.click();
    let dialog = page.getByRole("dialog", { name: "Privacy Notice" });
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "Close policy review" }).click();
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/\/onboarding\/consent$/);
    await expect(reviewPolicyButton).toBeFocused();

    await reviewPolicyButton.click();
    dialog = page.getByRole("dialog", { name: "Privacy Notice" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/\/onboarding\/consent$/);

    await reviewPolicyButton.click();
    dialog = page.getByRole("dialog", { name: "Privacy Notice" });
    await expect(dialog).toBeVisible();
    await page.mouse.click(24, 24);
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/\/onboarding\/consent$/);
  });

  test("consent policy source keeps review-only lifecycle local to the onboarding owner", () => {
    const source = readFileSync("components/auth-onboarding-screen.tsx", "utf8");

    expect(source).toContain("const [selectedPolicy, setSelectedPolicy] = useState(policyDocuments[0]);");
    expect(source).toContain('data-ux-lifecycle-trigger="policy-review-modal"');
    expect(source).toContain("Review-only policy modal. Closing this modal does not accept terms");
    expect(source).toContain('data-testid="uxp3-consent-policy-modal"');
  });
});
