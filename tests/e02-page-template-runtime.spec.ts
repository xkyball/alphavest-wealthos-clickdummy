import { expect, type APIRequestContext, type Page, test } from "@playwright/test";

import { authenticatePageWithJwt } from "./helpers/auth-jwt";
import { openComplianceReviewDetail } from "./helpers/compliance-review-flow";

async function authenticate(page: Page, request: APIRequestContext) {
  await authenticatePageWithJwt(page, request);
}

test.describe("E02 page-template runtime adoption", () => {
  const routes = [
    {
      family: "dashboard_list",
      path: "/advisory",
      requiredZone: "action_zone",
    },
    {
      family: "detail_decision_room",
      openComplianceSurface: "decision-room" as const,
      path: "/compliance/reviews",
      requiredZone: "proof_audit_zone",
    },
  ];

  for (const route of routes) {
    test(`${route.path} exposes canonical E02 page-template metadata`, async ({ page, request }) => {
      await authenticate(page, request);
      if ("openComplianceSurface" in route) {
        await openComplianceReviewDetail(page, route.openComplianceSurface);
      } else {
        await page.goto(route.path);
      }

      const templateRoot = page.locator(`[data-ux-page-template-family="${route.family}"]`).first();

      await expect(templateRoot).toBeVisible();
      await expect(templateRoot).toHaveAttribute("data-ux-page-template-required-zones", new RegExp(route.requiredZone));
      await expect(templateRoot).toHaveAttribute("data-ux-page-template-action-zone", /^(inline_next_step|adjacent_action_rail|blocked_state_only|sticky_action_zone)$/);
      await expect(templateRoot).toHaveAttribute("data-ux-contract-id", "DOMAIN-03_ROUTE_SHELL_PAGE_JOB_CONTRACT");
      await expect(templateRoot).toHaveAttribute("data-ux-route-contract", "registered_route_policy");
      await expect(templateRoot).toHaveAttribute("data-ux-page-job-contract", /^(audit_reference|client_summary|decision_room|queue|queue_detail|stepper)$/);
      await expect(templateRoot).toHaveAttribute("data-ux-contract-allowed-zones", /^(?!$).+/);
      await expect(page.locator("[data-ux-template-zone]").first()).toBeVisible();
      await expect(page.locator("[data-ux-long-page-anchor]").first()).toBeVisible();

      if ("openComplianceSurface" in route) {
        const complianceGate = page.getByTestId("bd08-compliance-decision-room-panel");

        await expect(complianceGate).toHaveAttribute("data-ux-route-shell-page-job-consumer", "true");
        await expect(complianceGate).toHaveAttribute("data-ux-route-shell-page-job-contract", "DOMAIN-03_ROUTE_SHELL_PAGE_JOB_CONTRACT");
        await expect(complianceGate).toHaveAttribute("data-ux-route-shell-page-job-id", "039");
        await expect(complianceGate).toHaveAttribute("data-ux-route-shell-page-job-value", "decision_room");
      }
    });
  }
});
