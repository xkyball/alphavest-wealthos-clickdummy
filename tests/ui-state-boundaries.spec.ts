import { expect, type Page, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";
import { noOverclaimBoundaryOrder, noOverclaimCopy, noOverclaimForbiddenSuccessPattern } from "../lib/no-overclaim-copy";

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

test.describe("Phase 03 UI state boundaries", () => {
  test("client-facing routes fail closed for unreleased recommendation states", async ({ page }) => {
    await page.goto("/client/home");

    await expect(page.getByText("Client-safe projection")).toBeVisible();
    await expect(page.getByText("Released client-safe state only")).toBeVisible();
    await expect(page.getByText("Client projection cannot expose internal payloads.")).toBeVisible();
    await expect(page.getByText("No internal payload, manual override, unreleased evidence, AI Draft, compliance notes or storage keys.")).toBeVisible();
  });

  test("internal workflow separates advisor approval from compliance release", async ({ page }) => {
    await page.goto("/compliance/reviews/demo/decision-room");

    await expect(page.getByText("Release Gates Summary")).toBeVisible();
    await expect(page.getByText(/Release is disabled until evidence, policy, reviewer and approver gates pass\./)).toBeVisible();

    await page.goto("/compliance/reviews/demo/release?state=release");
    await expect(page.getByText("Advisor approval alone is not enough.")).toBeVisible();
  });

  test("document upload state keeps upload separate from evidence sufficiency", async ({ page }) => {
    await page.goto("/documents/upload");

    await expect(page.getByText("Ready", { exact: true })).toBeVisible();
    await expect(page.getByText("Select a file to start document intake.")).toBeVisible();
    await expect(page.getByText("Upload blocked")).toBeVisible();
    await expect(page.getByText("Select a supported source file before an extraction review item can be queued.")).toBeVisible();
    await expect(page.getByText("Evidence sufficiency complete")).toHaveCount(0);
    await expect(page.getByText("Client visibility unlocked")).toHaveCount(0);
  });

  test("export setup and preview states keep permission, redaction and approval separate", async ({ page }) => {
    await page.goto("/export/new");

    await expect(page.getByText("Scope first").first()).toBeVisible();
    await expect(page.getByText("Start export scope before redaction, preview, approval or delivery.")).toBeVisible();
    await expect(page.getByText("Select export scope").first()).toBeVisible();

    await page.goto("/export/demo/approval?state=approval");
    await expect(page.getByRole("dialog", { name: "Approve Export Package" })).toBeVisible();
    await expect(page.getByText("Approval confirmation")).toBeVisible();
    await expect(page.getByText("Approval can record only the export approval step through /api/export-workflow. Generation, download, share, client acceptance and advice release remain separate controlled events.")).toBeVisible();
  });

  test("export delivery state does not imply client acceptance", async ({ page }) => {
    await page.goto("/export/demo/download");

    await expect(page.getByText("Export approved, download pending")).toBeVisible();
    await expect(page.getByText("The metadata-only export package is approved. Download is the next controlled event; share and client acceptance remain separate.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Download package" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Share after download" })).toBeDisabled();
  });
});

test.describe("Phase 05 feedback no-overclaim boundaries", () => {
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
    await page.goto("/compliance/reviews/demo/release?state=release");

    const releaseDialog = page.getByRole("dialog", { name: "Release client-safe process" });

    await expect(releaseDialog).toBeVisible();
    await expect(releaseDialog.getByText("Release action pending")).toBeVisible();
    await expect(page.getByText("Release has not been completed in this modal state.")).toBeVisible();
    await expect(page.getByText("Released successfully")).toHaveCount(0);
  });

  test("export approval copy separates approval from generation and delivery", async ({ page }) => {
    await page.goto("/export/demo/approval?state=approval");

    await expect(page.getByRole("dialog", { name: "Approve Export Package" })).toBeVisible();
    await expect(page.getByTestId("j08-confirm-approval")).toBeVisible();
    await expect(page.getByText("Generation, download and share remain separate controlled steps.")).toBeVisible();
    await expect(page.getByText("Approval can record only the export approval step through /api/export-workflow.")).toBeVisible();
  });

  test("audit-sensitive feedback states audit requirements rather than claiming persistence", async ({ page }) => {
    await page.goto("/governance/roles/demo?state=confirm");

    await expect(page.getByRole("dialog", { name: "Confirm Sensitive Permission Changes" })).toBeVisible();
    await expect(page.getByText("This change requires audit logging before it can be accepted.")).toBeVisible();
    await expect(page.getByText("This change will be logged in the audit trail.")).toHaveCount(0);
  });

  test("decision success feedback avoids audit and evidence completeness overclaim", async ({ page }) => {
    await page.goto("/decisions/demo/success");

    await expect(page.getByText("The decision has been recorded for review. Audit persistence remains a controlled gate.")).toBeVisible();
    await expect(page.getByText("Recorded for Review", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Persisted Audit Record" })).toBeVisible();
    await expect(page.getByText("Compliance release and evidence controls remain the source of client visibility.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Evidence Package Queued" })).toBeVisible();
    await expect(page.getByText("Evidence sufficiency still requires review and release gates.")).toBeVisible();
    await expect(page.getByText("immutable audit trail")).toHaveCount(0);
    await expect(page.getByText("A complete evidence package has been generated for this decision.")).toHaveCount(0);
  });

  test("static audit-facing panels describe audit requirements instead of persistence proof", async ({ page }) => {
    await page.goto("/advisory/triggers/demo/review");

    await expect(page.getByText("Audit logging required", { exact: true })).toBeVisible();
    await expect(page.getByText("Audit logging required before accepted save")).toBeVisible();
    await expect(page.getByText("All notes are audit logged")).toHaveCount(0);

    await page.goto("/tenants/demo/policies");
    await expect(page.getByText("Policy overrides require Compliance approval and audit confirmation before activation.")).toBeVisible();
    await expect(page.getByText("fully audited")).toHaveCount(0);
  });

  test("audit history and export delivery avoid persistence and binary-delivery overclaim", async ({ page }) => {
    await page.goto("/compliance/reviews/demo/audit");

    await expect(page.getByTestId("p04-p06-audit-gate").getByText("Audit Persistence Gate")).toBeVisible();
    await expect(page.getByText(/Critical gate actions must persist audit rows/)).toBeVisible();
    await expect(page.getByText("SCF-P04-P06-CRITICAL-GATE-AUDIT")).toBeVisible();
    await expect(page.getByText("Read-only and immutable")).toHaveCount(0);
    await expect(page.getByText("tamper-evident")).toHaveCount(0);
    await expect(page.getByText("live events")).toHaveCount(0);

    await page.goto("/export/demo/download");
    await expect(page.getByRole("term").filter({ hasText: "Prepared" })).toBeVisible();
    await expect(page.getByText("Download pending, delivery action controlled")).toBeVisible();
    await expect(page.getByText("Share blocked", { exact: true })).toBeVisible();
    await expect(page.getByText("Binary status")).toBeVisible();
    await expect(page.getByText("Blocked until download", { exact: true })).toBeVisible();
    await expect(page.getByText("downloaded May 21, 2025 09:45")).toHaveCount(0);
    await expect(page.getByText("Demo package scan marked clear")).toHaveCount(0);
  });
});
