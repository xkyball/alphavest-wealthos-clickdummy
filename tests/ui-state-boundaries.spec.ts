import { expect, type Page, test } from "@playwright/test";

import { localAuthSessionCookieName } from "../lib/auth/local-auth-session";
import { noOverclaimBoundaryOrder, noOverclaimCopy, noOverclaimForbiddenSuccessPattern } from "../lib/no-overclaim-copy";

async function authenticate(page: Page) {
  await page.context().addCookies([
    {
      httpOnly: true,
      domain: "127.0.0.1",
      name: localAuthSessionCookieName,
      path: "/",
      sameSite: "Lax",
      value: "av-session-playwright-authenticated",
    },
  ]);
}

test.beforeEach(async ({ page }) => {
  await authenticate(page);
});

test.describe("Stage 03 UI state boundaries", () => {
  test("client-facing routes fail closed for unreleased recommendation states", async ({ page }) => {
    await page.goto("/client/home");

    await expect(page.getByRole("heading", { name: "Client Web Dashboard" })).toBeVisible();
    await expect(page.locator("main")).toContainText("Only released evidence status is shown here.");
    await expect(page.locator("main")).toContainText("Not ready");
    await expect(page.locator("main")).not.toContainText(/internal payload|manual override|AI Draft|compliance notes|storage keys/i);
  });

  test("internal workflow separates advisor approval from compliance release", async ({ page }) => {
    await page.goto("/compliance/reviews/current/decision-room");

    await expect(page.getByTestId("bd08-compliance-decision-room-panel")).toContainText("Release checks");
    await expect(page.getByTestId("workflow06-release-blocked-control")).toHaveAttribute("data-ux-action-availability", "blocked_static");
    await expect(page.getByTestId("workflow06-release-blocked-control")).toHaveAttribute("data-ux-interactive", "false");
    await expect(page.getByTestId("bd08-compliance-decision-room-panel")).toContainText(/Release: Evidence needed|Evidence is incomplete or missing/i);

    await page.goto("/compliance/reviews/current/release?state=release");
    await expect(page.getByRole("dialog", { name: "Release client-safe review" })).toBeVisible();
    await expect(page.getByTestId("uxp3-compliance-release-lifecycle")).toHaveAttribute("data-ux-no-overclaim", "true");
  });

  test("document upload state keeps upload separate from evidence sufficiency", async ({ page }) => {
    await page.goto("/documents/upload");

    await expect(page.getByText("Ready", { exact: true })).toBeVisible();
    await expect(page.getByText("Select a file to start document intake.")).toBeVisible();
    await expect(page.getByTestId("document-upload-validation-state")).toContainText("Source file required before upload can start.");
    await expect(page.getByTestId("document-upload-latest-card")).toContainText(/Preview (generated|pending)/);
    await expect(page.getByText("Preview fallback shown")).toHaveCount(0);
    await expect(page.getByText("Evidence sufficiency complete")).toHaveCount(0);
    await expect(page.getByText("Client visibility unlocked")).toHaveCount(0);
  });

  test("export setup and preview states keep permission, redaction and approval separate", async ({ page }) => {
    await page.goto("/export/new");

    await expect(page.getByText("Name the request, choose contents and continue to review.")).toBeVisible();
    await expect(page.getByText("Bennett Q2 report")).toBeVisible();
    await expect(page.getByText("Select contents").first()).toBeVisible();

    await page.goto("/export/client-package/approval?state=approval");
    await expect(page.getByRole("dialog", { name: "Approve Package" })).toBeVisible();
    await expect(page.getByText("Review confirmation")).toBeVisible();
    await expect(page.getByText("Approval records review intent only. Delivery and sharing remain separate actions.")).toBeVisible();
  });

  test("export delivery state does not imply client acceptance", async ({ page }) => {
    await page.goto("/export/client-package/download");

    await expect(page.getByRole("heading", { name: "Download Package" })).toBeVisible();
    await expect(page.getByText("Download the package. External sharing stays separate.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Download package" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Share link off" })).toBeDisabled();
  });
});

test.describe("Stage 05 feedback no-overclaim boundaries", () => {
  test("canonical no-overclaim copy covers V1 blocking boundaries without downstream success claims", () => {
    expect(noOverclaimBoundaryOrder).toEqual([
      "uploadOnly",
      "evidenceReviewPending",
      "evidenceInsufficient",
      "evidenceSufficientAfterReview",
      "aiDraftInternalOnly",
      "advisorApprovalNotRelease",
      "complianceReleaseNotClientAcceptance",
      "complianceReleasedClientSafeOnly",
      "clientVisibilityHidden",
      "auditDisplayNotProof",
      "auditUnavailableFailClosed",
      "adminNonBypassDenied",
      "exportPreviewNotApproval",
      "exportApprovalNotDownload",
      "downloadNotClientAcceptance",
      "noDownstreamCompletion",
    ]);

    expect(noOverclaimCopy.uploadOnly).toContain("evidence sufficiency");
    expect(noOverclaimCopy.evidenceReviewPending).toContain("awaiting review");
    expect(noOverclaimCopy.evidenceSufficientAfterReview).toContain("reviewed, linked and accepted");
    expect(noOverclaimCopy.aiDraftInternalOnly).toContain("not client visible");
    expect(noOverclaimCopy.advisorApprovalNotRelease).toContain("compliance release controls client visibility");
    expect(noOverclaimCopy.complianceReleaseNotClientAcceptance).toContain("client acceptance remain separate");
    expect(noOverclaimCopy.complianceReleasedClientSafeOnly).toContain("client-safe summary");
    expect(noOverclaimCopy.clientVisibilityHidden).toContain("No released client-safe content");
    expect(noOverclaimCopy.auditDisplayNotProof).toContain("persistence is proven only by the audited action response");
    expect(noOverclaimCopy.auditUnavailableFailClosed).toContain("required audit logging is unavailable");
    expect(noOverclaimCopy.adminNonBypassDenied).toContain("cannot bypass release");
    expect(noOverclaimCopy.exportPreviewNotApproval).toContain("Preview is not approval");
    expect(noOverclaimCopy.exportApprovalNotDownload).toContain("download and share remain separate");
    expect(noOverclaimCopy.downloadNotClientAcceptance).toContain("does not confirm client acceptance");
    expect(noOverclaimCopy.noDownstreamCompletion).toContain("gates remain unresolved");

    for (const copy of Object.values(noOverclaimCopy)) {
      expect(copy).not.toMatch(noOverclaimForbiddenSuccessPattern);
    }
  });

  test("release modal does not show release success before submit", async ({ page }) => {
    await page.goto("/compliance/reviews/current/release?state=release");

    const releaseDialog = page.getByRole("dialog", { name: "Release client-safe review" });

    await expect(releaseDialog).toBeVisible();
    await expect(releaseDialog.getByText("Release action pending")).toBeVisible();
    await expect(page.getByTestId("j02-release-validation-state")).toContainText("Release confirmation blocked");
    await expect(page.getByText("Released successfully")).toHaveCount(0);
  });

  test("export approval copy separates approval from generation and delivery", async ({ page }) => {
    await page.goto("/export/client-package/approval?state=approval");

    await expect(page.getByRole("dialog", { name: "Approve Package" })).toBeVisible();
    await expect(page.getByTestId("j08-confirm-approval")).toBeVisible();
    await expect(page.getByText("Confirm review of this protected export package.")).toBeVisible();
    await expect(page.getByText("Approval records review intent only. Delivery and sharing remain separate actions.")).toBeVisible();
  });

  test("audit-sensitive feedback states audit requirements rather than claiming persistence", async ({ page }) => {
    await page.goto("/governance/roles/portfolio-manager?state=confirm");

    await expect(page.getByRole("dialog", { name: "Confirm Sensitive Permission Changes" })).toBeVisible();
    await expect(page.getByText("This change requires audit logging before it can be accepted.")).toBeVisible();
    await expect(page.getByText("This change will be logged in the audit trail.")).toHaveCount(0);
  });

  test("decision success feedback avoids audit and evidence completeness overclaim", async ({ page }) => {
    await page.goto("/decisions/liquidity-governance/success");

    await expect(page.getByRole("heading", { name: "Decision Submitted" })).toBeVisible();
    await expect(page.getByText("Decision recorded for review.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Audit record" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Evidence package" })).toBeVisible();
    await expect(page.getByText("Evidence package queued for review.")).toBeVisible();
    await expect(page.getByText("immutable audit trail")).toHaveCount(0);
    await expect(page.getByText("A complete evidence package has been generated for this decision.")).toHaveCount(0);
  });

  test("static audit-facing panels describe audit requirements instead of persistence proof", async ({ page }) => {
    await page.goto("/advisory/triggers/liquidity-drift/review");

    await expect(page.getByRole("heading", { name: "Trigger Detail" })).toBeVisible();
    await expect(page.getByText("Route to advisor review")).toBeVisible();
    await expect(page.getByText("Request missing evidence")).toBeVisible();
    await expect(page.getByText("All notes are audit logged")).toHaveCount(0);

    await page.goto("/tenants/morgan/policies");
    await expect(page.getByText("Change held for review")).toBeVisible();
    await expect(page.getByText("Tenant policies remain permitted to the selected tenant. Policy changes cannot bypass compliance release or audit.")).toBeVisible();
    await expect(page.getByText("fully audited")).toHaveCount(0);
  });

  test("audit history and export delivery avoid persistence and binary-delivery overclaim", async ({ page }) => {
    await page.goto("/compliance/reviews/current/audit");

    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.getByTestId("p04-p06-audit-gate")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText(/Audit Persistence Gate|Critical gate actions must persist audit rows|SCF-P04-P06-CRITICAL-GATE-AUDIT/i);
    await expect(page.getByText("Read-only and immutable")).toHaveCount(0);
    await expect(page.getByText("tamper-evident")).toHaveCount(0);
    await expect(page.getByText("live events")).toHaveCount(0);

    await page.goto("/export/client-package/download");
    await expect(page.getByText("Prepared")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Download Package" })).toBeVisible();
    await expect(page.getByText("No external link yet")).toBeVisible();
    await expect(page.getByRole("button", { name: "Share link off" })).toBeDisabled();
    await expect(page.getByText("downloaded May 21, 2025 09:45")).toHaveCount(0);
    await expect(page.getByText("Demo package scan marked clear")).toHaveCount(0);
  });
});
