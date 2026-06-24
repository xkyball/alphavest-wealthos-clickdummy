import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, type Page, test } from "@playwright/test";

import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";
import { noOverclaimBoundaryOrder, noOverclaimCopy } from "../lib/no-overclaim-copy";

const repoRoot = process.cwd();

function readSource(...segments: string[]) {
  return readFileSync(join(repoRoot, ...segments), "utf8");
}

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

test.describe("V0.96 WP-12 no-overclaim microcopy and state feedback", () => {
  test("canonical vocabulary covers every WP12 feedback category without downstream claims", () => {
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

    expect(noOverclaimCopy.uploadOnly).toContain("Upload creates pending internal evidence");
    expect(noOverclaimCopy.evidenceReviewPending).toContain("Evidence is awaiting review");
    expect(noOverclaimCopy.evidenceInsufficient).toContain("review, scope, currentness, acceptance");
    expect(noOverclaimCopy.evidenceSufficientAfterReview).toContain("reviewed, linked and accepted");
    expect(noOverclaimCopy.aiDraftInternalOnly).toContain("not client visible");
    expect(noOverclaimCopy.advisorApprovalNotRelease).toContain("Advisor approval alone is not enough");
    expect(noOverclaimCopy.complianceReleaseNotClientAcceptance).toContain("client acceptance remain separate");
    expect(noOverclaimCopy.complianceReleasedClientSafeOnly).toContain("client-safe summary");
    expect(noOverclaimCopy.clientVisibilityHidden).toContain("No released client-safe content");
    expect(noOverclaimCopy.auditDisplayNotProof).toContain("Audit display is read-only context");
    expect(noOverclaimCopy.auditUnavailableFailClosed).toContain("required audit logging is unavailable");
    expect(noOverclaimCopy.adminNonBypassDenied).toContain("cannot bypass release");
    expect(noOverclaimCopy.exportPreviewNotApproval).toContain("Preview is not approval");
    expect(noOverclaimCopy.exportApprovalNotDownload).toContain("approval gate");
    expect(noOverclaimCopy.downloadNotClientAcceptance).toContain("does not confirm client acceptance");

    for (const copy of Object.values(noOverclaimCopy)) {
      expect(copy).not.toMatch(/evidence sufficiency complete|client visibility unlocked|approved for client|download ready|share ready|fully audited/i);
    }
  });

  test("status and workflow badges declare that chips are visual summaries, not completion gates", () => {
    const statusChip = readSource("components", "ui", "status-chip.tsx");
    const workflowBadge = readSource("components", "ui", "workflow-badge.tsx");
    const demoSessionPanel = readSource("components", "demo-session-panel.tsx");
    const reviewMonitoringScreen = readSource("components", "review-monitoring-screen.tsx");

    expect(statusChip).toContain("Status chip is a visual summary, not a completion gate.");
    expect(statusChip).toContain('data-ux-completion-gate="false"');
    expect(statusChip).toContain("data-ux-state-source");

    expect(workflowBadge).toContain("Workflow badge is a visual summary, not a completion gate.");
    expect(workflowBadge).toContain('data-ux-completion-gate="false"');
    expect(workflowBadge).toContain("Advisor approved, release pending");
    expect(workflowBadge).toContain("Compliance release recorded");
    expect(workflowBadge).toContain("Evidence review ready");

    expect(demoSessionPanel).toContain("Client-safe available");
    expect(demoSessionPanel).toContain("Client-safe blocked");

    expect(reviewMonitoringScreen).toContain("Client-safe visible");
    expect(reviewMonitoringScreen).not.toContain("Client visible");
  });

  test("route copy uses client-safe and evidence-review labels instead of ambiguous gate shortcuts", async ({ page }) => {
    await authenticate(page);

    await page.goto("/client/home");
    await expect(page.getByText("Client-safe summary").first()).toBeVisible();
    await expect(page.getByText("Client-safe summary is now available").first()).toBeVisible();
    await expect(page.getByText("Client visible", { exact: true })).toHaveCount(0);

    await page.goto("/compliance/reviews/demo/decision-room");
    await expect(page.getByText("Evidence review state").first()).toBeVisible();
    await expect(page.getByText("Evidence completeness", { exact: true })).toHaveCount(0);

    await page.goto("/committee/reviews");
    await expect(page.getByText("No client-visible payload is exposed from this held route.").first()).toBeVisible();
    await expect(page.getByText("Client visible", { exact: true })).toHaveCount(0);

    await page.goto("/actions");
    await expect(page.getByText("Client-safe visible", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Must stay evidence-backed and release-controlled").first()).toBeVisible();

    await page.goto("/reviews/demo");
    await expect(page.getByText("No client-visible payload is exposed from this held route.").first()).toBeVisible();
    await expect(page.getByText("Client visible", { exact: true })).toHaveCount(0);
  });
});
