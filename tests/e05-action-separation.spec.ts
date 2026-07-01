import { execFileSync } from "node:child_process";
import { expect, type APIRequestContext, type Page, test } from "@playwright/test";

import { localAuthSessionCookieName } from "../lib/auth/local-auth-session";
import { stableId } from "../lib/stable-id";

const safeExportPayload = {
  clientSummary: "Released client-safe export summary.",
  decisionState: "Released",
  releasedAt: "2026-06-24T00:00:00.000Z",
  status: "RELEASED_TO_CLIENT",
  title: "Liquidity governance decision",
};

function safeScopeItem(label: string) {
  return {
    access: "Allowed",
    id: stableId(`e05-action-separation:${label}`),
    name: "Released client-safe decision summary",
    payloadClassifications: ["CLIENT_SAFE_SUMMARY", "RELEASED_EVIDENCE_SUMMARY"],
    selected: true,
    type: "DECISION",
  };
}

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

async function exportCommand(request: APIRequestContext, data: Record<string, unknown>) {
  return request.post("/api/export-workflow", { data });
}

async function prepareApprovalRequiredExport(request: APIRequestContext) {
  const scope = await exportCommand(request, {
    command: "SET_SCOPE",
    reason: "Select client-safe released objects for export action-separation proof.",
    redactionProfile: "client-safe-redacted",
    roleKey: "compliance_officer",
    scopeItems: [safeScopeItem("approval-required")],
    tenantSlug: "bennett",
  });
  const scopeBody = await scope.json();

  expect(scope.ok(), JSON.stringify(scopeBody)).toBe(true);

  const exportRequestId = scopeBody.exportRequestId as string;
  for (const command of ["VALIDATE_REDACTION", "PREVIEW"] as const) {
    const response = await exportCommand(request, {
      command,
      exportRequestId,
      payload: safeExportPayload,
      reason: `Prepare ${command.toLowerCase()} before export action-separation proof.`,
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "bennett",
    });
    const body = await response.json();

    expect(response.ok(), `${command}: ${JSON.stringify(body)}`).toBe(true);
  }

  return exportRequestId;
}

async function prepareGeneratedExport(request: APIRequestContext) {
  const exportRequestId = await prepareApprovalRequiredExport(request);

  for (const command of ["APPROVE", "GENERATE"] as const) {
    const response = await exportCommand(request, {
      command,
      exportRequestId,
      payload: safeExportPayload,
      reason: `Prepare ${command.toLowerCase()} before export action-separation proof.`,
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "bennett",
    });
    const body = await response.json();

    expect(response.ok(), `${command}: ${JSON.stringify(body)}`).toBe(true);
  }
}

test.describe("E05 action meaning separation", () => {
  test.beforeEach(async ({ page }) => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
    await page.setViewportSize({ height: 1000, width: 1440 });
    await authenticate(page);
  });

  test("separates compliance request-evidence, block and release actions", async ({ page }) => {
    await page.goto("/compliance/reviews/current/decision-room");

    await expect(page.getByTestId("workflow06-release-blocked-control")).toHaveAttribute("data-ux-action-meaning", "release");
    await expect(page.getByTestId("workflow06-release-blocked-control")).toHaveAttribute("data-ux-action-availability", "blocked_static");
    await expect(page.getByTestId("e05-compliance-release-action-zone")).toHaveAttribute("data-ux-action-zone-placement", "sticky_rail");
    await expect(page.getByTestId("j02-request-evidence")).toHaveAttribute("data-ux-action-meaning", "request_evidence");
    await expect(page.getByTestId("j02-request-evidence")).toHaveAttribute("data-ux-action-placement", "sticky_rail");
    await expect(page.getByTestId("j02-request-evidence")).toHaveAttribute("data-ux-action-priority", "primary");
    await expect(page.getByTestId("j02-block-release")).toHaveAttribute("data-ux-action-meaning", "block");
    await expect(page.getByTestId("j02-block-release")).toHaveAttribute("data-ux-action-priority", "destructive");

    await page.goto("/compliance/reviews/current/release?state=release");
    await expect(page.getByRole("dialog", { name: "Release review package" })).toBeVisible();
    await expect(page.getByTestId("j02-release-client")).toHaveAttribute("data-ux-action-meaning", "release");
    await expect(page.getByTestId("j02-release-client")).toHaveAttribute("data-ux-action-placement", "modal_footer");
    await expect(page.getByTestId("j02-release-client")).toHaveAttribute("data-ux-action-separation", /not export/i);
  });

  test("separates export approval, download and share actions", async ({ page, request }) => {
    await prepareApprovalRequiredExport(request);
    await page.goto("/export/client-package/approval?state=base");

    await expect(page.getByTestId("e05-export-approval-open-zone")).toHaveAttribute("data-ux-action-zone-placement", "inline_cluster");
    await expect(page.getByTestId("j08-open-export-approval")).toHaveAttribute("data-ux-action-meaning", "export_approval");
    await page.getByTestId("j08-open-export-approval").click();
    await expect(page.getByRole("dialog", { name: "Sign off package" })).toBeVisible();
    await expect(page.getByTestId("j08-confirm-approval")).toHaveAttribute("data-ux-action-meaning", "export_approval");
    await expect(page.getByTestId("j08-confirm-approval")).toHaveAttribute("data-ux-action-placement", "modal_footer");
    await expect(page.getByTestId("j08-confirm-approval")).toHaveAttribute("data-ux-action-separation", /not generation/i);

    await prepareGeneratedExport(request);
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
