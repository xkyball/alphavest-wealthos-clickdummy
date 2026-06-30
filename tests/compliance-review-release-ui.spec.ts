import { mkdirSync } from "node:fs";
import { expect, type Locator, type Page, test } from "@playwright/test";

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

const forbiddenVisibleProcessCopy =
  /decision-room handoff only|release-control worksurface|release-gated|advisor approval alone|separate controls|display-only audit|audit visibility is not audit persistence|does not itself prove persistence|permission approval|process-first|proof boundary|typed workflow command|existing audited .*workflow|client acceptance/i;

async function expectNoVisibleProcessExplanation(scope: Locator) {
  const visibleText = await scope.evaluate((node) => (node as HTMLElement).innerText);
  expect(visibleText).not.toMatch(forbiddenVisibleProcessCopy);
}

test.describe("DOMAIN-11 compliance review release UI contract", () => {
  test("S038 exposes a contract-backed area entry with one selected review and no release overclaim", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1400 });
    await authenticate(page);
    await page.goto("/compliance/reviews");

    const entry = page.getByTestId("domain11-s038-area-entry");
    await expect(entry).toBeVisible();
    await expect(entry).toHaveAttribute("data-domain11-contract-id", "DOMAIN-11_COMPLIANCE_REVIEW_RELEASE_CONTRACT");
    await expect(entry).toHaveAttribute("data-domain11-page-family", "compliance_release_queue");
    await expect(entry).toHaveAttribute("data-domain11-client-safe-payload", "none_compliance_internal_only");
    await expect(entry).toHaveAttribute("data-domain11-owned-processes", /BP-058/);
    await expect(entry).toHaveAttribute("data-domain11-owned-processes", /BP-066/);

    await expect(page.getByTestId("s038-open-selected-review")).toHaveCount(1);
    await expect(entry).toContainText("Review selected");
    await expect(entry).not.toContainText(/released to client|export ready|client acceptance/i);
    await expectNoVisibleProcessExplanation(entry);
    await expectNoVisibleProcessExplanation(page.locator("body"));

    const metrics = await entry.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        top: rect.top,
      };
    });
    expect(metrics.top).toBeGreaterThanOrEqual(0);
    expect(metrics.bottom).toBeLessThanOrEqual(900);

    mkdirSync("artifacts/screenshots/domain-11", { recursive: true });
    await page.screenshot({
      fullPage: false,
      path: "artifacts/screenshots/domain-11/domain11-impl01a-s038-area-entry.png",
    });
  });

  test("S039 exposes a compact compliance precondition surface without client acceptance or export overclaim", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1400 });
    await authenticate(page);
    await page.goto("/compliance/reviews/liquidity-release/decision-room");

    const panel = page.getByTestId("bd08-compliance-decision-room-panel");
    const stepSurface = page.getByTestId("workflow06-compliance-precondition-checklist");
    await expect(panel).toBeVisible();
    await expect(stepSurface).toBeVisible();
    await expect(panel).toHaveAttribute("data-domain11-contract", "DOMAIN-11_COMPLIANCE_REVIEW_RELEASE_CONTRACT");
    await expect(panel).toHaveAttribute("data-domain11-page-family", "compliance_release_decision_room");
    await expect(panel).toHaveAttribute("data-domain11-client-safe-payload", "none_compliance_internal_only");
    await expect(panel).toHaveAttribute("data-domain11-processes", /BP-059/);
    await expect(panel).toHaveAttribute("data-domain11-processes", /BP-066/);

    await expect(stepSurface).toHaveAttribute("data-workflow06-release-ready", "false");
    await expect(stepSurface).toHaveAttribute("data-domain11-precondition-negative", /keeps release blocked/i);
    await expect(stepSurface).toHaveAttribute("data-domain11-evidence-negative", /cannot satisfy release/i);
    await expect(page.getByTestId("j02-request-evidence")).toHaveCount(1);
    await expect(page.getByTestId("j02-block-release")).toHaveCount(1);
    await expect(panel).not.toContainText(/client accepted|export ready|download ready|client visibility unlocked/i);
    await expectNoVisibleProcessExplanation(panel);
    await expectNoVisibleProcessExplanation(page.locator("body"));

    const metrics = await stepSurface.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        top: rect.top,
      };
    });
    expect(metrics.top).toBeGreaterThanOrEqual(0);
    expect(metrics.bottom).toBeLessThanOrEqual(900);

    mkdirSync("artifacts/screenshots/domain-11", { recursive: true });
    await page.screenshot({
      fullPage: false,
      path: "artifacts/screenshots/domain-11/domain11-impl01b-s039-core-surface.png",
    });
  });

  test("S039 submits evidence request with the selected review and evidence payload", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1400 });
    await authenticate(page);
    await page.goto("/compliance/reviews/liquidity-release/decision-room");

    await page.getByTestId("j02-request-evidence").click();
    const lifecycle = page.getByTestId("uxp3-compliance-sensitive-action-lifecycle");
    await expect(lifecycle).toHaveAttribute("data-ux-selected-review-id", "CMP-2025-0137");
    const selectedTargetId = await lifecycle.getAttribute("data-ux-selected-target-id");
    const selectedEvidenceIds = (await lifecycle.getAttribute("data-ux-selected-evidence-ids"))?.split(" ") ?? [];
    expect(selectedTargetId).toBeTruthy();
    expect(selectedEvidenceIds.length).toBeGreaterThan(0);

    await page.route("**/api/recommendation-review-workflow", async (route) => {
      const payload = route.request().postDataJSON() as {
        action: string;
        evidenceIds: string[];
        targetId: string;
        workflowType: string;
      };

      expect(payload).toMatchObject({
        action: "request_evidence",
        targetId: selectedTargetId,
        workflowType: "advisor-approval",
      });
      expect(payload.evidenceIds).toEqual(selectedEvidenceIds);

      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          result: {
            auditEventId: "audit-selected-review-evidence-request",
            reloadedState: {
              complianceReview: { status: "NEEDS_EVIDENCE" },
              recommendation: { clientVisible: false, status: "MORE_DATA_REQUESTED" },
            },
          },
        }),
        status: 200,
      });
    });

    await lifecycle.getByRole("checkbox").check();
    await page.getByRole("textbox", { name: /Reason/i }).fill("Request missing risk disclosure evidence.");
    await page.getByTestId("j02-request-evidence-confirmation").fill("REQUEST EVIDENCE");
    await page.getByTestId("j02-confirm-request-evidence").click();
    await expect(page.getByTestId("j02-sensitive-action-success-state")).toContainText("audit-selected-review-evidence-request");
  });

  test("S040 release confirmation keeps release, export and client acceptance boundaries separate", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1400 });
    await authenticate(page);
    await page.goto("/compliance/reviews/liquidity-release/release?state=release");

    const boundary = page.getByTestId("domain11-s040-release-boundary");
    const lifecycle = page.getByTestId("uxp3-compliance-release-lifecycle");
    await expect(boundary).toBeVisible();
    await expect(lifecycle).toBeVisible();
    await expect(boundary).toHaveAttribute("data-domain11-contract", "DOMAIN-11_COMPLIANCE_REVIEW_RELEASE_CONTRACT");
    await expect(boundary).toHaveAttribute("data-domain11-page-family", "compliance_release_confirmation");
    await expect(lifecycle).toHaveAttribute("data-domain11-client-safe-payload", "compliance_released_projection_only");
    await expect(lifecycle).toHaveAttribute("data-domain11-proof-blocked-overclaims", /compliance_release_as_client_acceptance/);
    await expect(lifecycle).not.toContainText(/client accepted|export ready|download ready/i);
    await expectNoVisibleProcessExplanation(lifecycle);
    await expectNoVisibleProcessExplanation(page.locator("body"));

    mkdirSync("artifacts/screenshots/domain-11", { recursive: true });
    await page.screenshot({
      fullPage: false,
      path: "artifacts/screenshots/domain-11/domain11-impl01c-s040-release-boundary.png",
    });
  });

  test("S041 block and evidence request preserve release-denial boundaries", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1400 });
    await authenticate(page);
    await page.goto("/compliance/reviews/liquidity-release/block?state=block");

    const boundary = page.getByTestId("domain11-s041-block-boundary");
    const lifecycle = page.getByTestId("uxp3-block-request-evidence-lifecycle");
    await expect(boundary).toBeVisible();
    await expect(lifecycle).toBeVisible();
    await expect(lifecycle).toHaveAttribute("data-ux-selected-review-id", /CR-/);
    const selectedTargetId = await lifecycle.getAttribute("data-ux-selected-target-id");
    const selectedEvidenceIds = (await lifecycle.getAttribute("data-ux-selected-evidence-ids"))?.split(" ") ?? [];
    expect(selectedTargetId).toBeTruthy();
    expect(selectedEvidenceIds.length).toBeGreaterThan(0);
    await expect(boundary).toHaveAttribute("data-domain11-page-family", "compliance_block_or_evidence_request");
    await expect(lifecycle).toHaveAttribute("data-domain11-evidence-request-negative", /cannot be treated as sufficiency/i);
    await expect(lifecycle).toHaveAttribute("data-domain11-block-negative", /cannot become client rejection/i);
    await expect(lifecycle).not.toContainText(/released to client|client accepted|export ready|download ready/i);
    await expectNoVisibleProcessExplanation(lifecycle);
    await expectNoVisibleProcessExplanation(page.locator("body"));

    await page.route("**/api/recommendation-review-workflow", async (route) => {
      const payload = route.request().postDataJSON() as {
        action: string;
        evidenceIds: string[];
        targetId: string;
        workflowType: string;
      };

      expect(payload).toMatchObject({
        action: "request_evidence",
        targetId: selectedTargetId,
        workflowType: "advisor-approval",
      });
      expect(payload.evidenceIds).toEqual(selectedEvidenceIds);

      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          result: {
            auditEventId: "audit-s041-selected-evidence-request",
            reloadedState: {
              complianceReview: { status: "NEEDS_EVIDENCE" },
              recommendation: { clientVisible: false, status: "MORE_DATA_REQUESTED" },
            },
          },
        }),
        status: 200,
      });
    });

    await lifecycle.getByRole("checkbox").check();
    await lifecycle.getByRole("textbox", { name: /Reason/i }).fill("Request the missing block evidence.");
    await page.getByTestId("j02-request-evidence-confirmation").fill("REQUEST EVIDENCE");
    await page.getByTestId("j02-confirm-request-evidence").click();
    await expect(page.getByTestId("j02-block-request-success-state")).toContainText("audit-s041-selected-evidence-request");

    mkdirSync("artifacts/screenshots/domain-11", { recursive: true });
    await page.screenshot({
      fullPage: false,
      path: "artifacts/screenshots/domain-11/domain11-impl01c-s041-block-boundary.png",
    });
  });

  test("S042 audit surface treats display rows as review context, not persisted release proof", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1400 });
    await authenticate(page);
    await page.goto("/compliance/reviews/liquidity-release/audit");

    const boundary = page.getByTestId("domain11-s042-audit-boundary");
    await expect(boundary).toBeVisible();
    await expect(boundary).toHaveAttribute("data-domain11-page-family", "compliance_audit_exception_review");
    await expect(boundary).toHaveAttribute("data-domain11-audit-negative", /Display-only audit rows/i);
    await expect(boundary).toHaveAttribute("data-domain11-proof-blocked-overclaims", /audit_display_as_persisted_audit/);
    await expect(boundary).not.toContainText(/client accepted|client visibility unlocked|download ready/i);
    await expectNoVisibleProcessExplanation(boundary);
    await expectNoVisibleProcessExplanation(page.locator("body"));

    mkdirSync("artifacts/screenshots/domain-11", { recursive: true });
    await page.screenshot({
      fullPage: false,
      path: "artifacts/screenshots/domain-11/domain11-impl01c-s042-audit-boundary.png",
    });
  });
});
