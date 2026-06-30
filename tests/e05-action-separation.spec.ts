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

test.describe("E05 action meaning separation", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page);
  });

  test("separates compliance request-evidence, block and release actions", async ({ page }) => {
    await page.goto("/compliance/reviews/liquidity-release/decision-room");

    await expect(page.getByTestId("workflow06-release-blocked-control")).toHaveAttribute("data-ux-action-meaning", "release");
    await expect(page.getByTestId("workflow06-release-blocked-control")).toHaveAttribute("data-ux-action-availability", "blocked_static");
    await expect(page.getByTestId("e05-compliance-release-action-zone")).toHaveAttribute("data-ux-action-zone-placement", "sticky_rail");
    await expect(page.getByTestId("j02-request-evidence")).toHaveAttribute("data-ux-action-meaning", "request_evidence");
    await expect(page.getByTestId("j02-request-evidence")).toHaveAttribute("data-ux-action-placement", "sticky_rail");
    await expect(page.getByTestId("j02-request-evidence")).toHaveAttribute("data-ux-action-priority", "primary");
    await expect(page.getByTestId("j02-block-release")).toHaveAttribute("data-ux-action-meaning", "block");
    await expect(page.getByTestId("j02-block-release")).toHaveAttribute("data-ux-action-priority", "destructive");

    await page.goto("/compliance/reviews/liquidity-release/release?state=release");
    await expect(page.getByRole("dialog", { name: "Release client-safe review" })).toBeVisible();
    await expect(page.getByTestId("j02-release-client")).toHaveAttribute("data-ux-action-meaning", "release");
    await expect(page.getByTestId("j02-release-client")).toHaveAttribute("data-ux-action-placement", "modal_footer");
    await expect(page.getByTestId("j02-release-client")).toHaveAttribute("data-ux-action-separation", /not export/i);
  });

  test("separates export approval, download and share actions", async ({ page }) => {
    await page.goto("/export/client-package/approval?state=base");

    await expect(page.getByTestId("e05-export-approval-open-zone")).toHaveAttribute("data-ux-action-zone-placement", "inline_cluster");
    await expect(page.getByTestId("j08-open-export-approval")).toHaveAttribute("data-ux-action-meaning", "export_approval");
    await page.getByTestId("j08-open-export-approval").click();
    await expect(page.getByRole("dialog", { name: "Approve Package" })).toBeVisible();
    await expect(page.getByTestId("j08-confirm-approval")).toHaveAttribute("data-ux-action-meaning", "export_approval");
    await expect(page.getByTestId("j08-confirm-approval")).toHaveAttribute("data-ux-action-placement", "modal_footer");
    await expect(page.getByTestId("j08-confirm-approval")).toHaveAttribute("data-ux-action-separation", /not generation/i);

    await page.goto("/export/client-package/download?state=base");

    await expect(page.getByTestId("j08-open-download-confirmation")).toHaveAttribute("data-ux-action-meaning", "download");
    await expect(page.getByTestId("j08-share-export")).toHaveAttribute("data-ux-action-meaning", "share");
    await expect(page.getByTestId("j08-share-export")).toHaveAttribute("data-ux-action-availability", "disabled");
    await page.getByTestId("j08-open-download-confirmation").click();
    await expect(page.getByRole("dialog", { name: "Package Download" })).toBeVisible();
    await expect(page.getByTestId("j08-download-export")).toHaveAttribute("data-ux-action-meaning", "download");
    await expect(page.getByTestId("j08-download-export")).toHaveAttribute("data-ux-action-placement", "modal_footer");
    await expect(page.getByTestId("j08-download-export")).toHaveAttribute("data-ux-action-separation", /not share/i);
  });
});
