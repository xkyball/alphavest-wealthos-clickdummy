import { execFileSync } from "node:child_process";
import "dotenv/config";
import { expect, test, type APIRequestContext } from "@playwright/test";

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
    id: stableId(`phase8-export-workflow:${label}`),
    name: "Released client-safe decision summary",
    payloadClassifications: ["CLIENT_SAFE_SUMMARY", "RELEASED_EVIDENCE_SUMMARY"],
    selected: true,
    type: "DECISION",
  };
}

async function exportCommand(request: APIRequestContext, data: Record<string, unknown>) {
  return request.post("/api/export-workflow", { data });
}

async function prepareGeneratedExport(request: APIRequestContext) {
  const scope = await exportCommand(request, {
    command: "SET_SCOPE",
    reason: "Select client-safe released objects for phase 8 export proof.",
    redactionProfile: "client-safe-redacted",
    roleKey: "compliance_officer",
    scopeItems: [safeScopeItem("share-boundary")],
    tenantSlug: "summit",
  });
  const scopeBody = await scope.json();

  expect(scope.ok(), JSON.stringify(scopeBody)).toBe(true);

  const exportRequestId = scopeBody.exportRequestId as string;
  for (const command of ["VALIDATE_REDACTION", "PREVIEW", "APPROVE", "GENERATE"] as const) {
    const response = await exportCommand(request, {
      command,
      exportRequestId,
      payload: safeExportPayload,
      reason: `Prepare ${command.toLowerCase()} through canonical export workflow API.`,
      redactionProfile: "client-safe-redacted",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const body = await response.json();

    expect(response.ok(), `${command}: ${JSON.stringify(body)}`).toBe(true);
  }

  return exportRequestId;
}

test.describe.serial("Phase 8 export workflow API", () => {
  test.setTimeout(120_000);

  test.beforeEach(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test("retires legacy export approval simulation from demo workflow", async ({ request }) => {
    const response = await request.post("/api/demo-workflow", {
      data: {
        actionId: "j08.confirmApproval",
        simulateAuditPersistenceFailure: true,
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(410);
    expect(body.reasonCode).toBe("SAFE_ERROR");
    expect(body.legacyReasonCode).toBe("LEGACY_EXPORT_DEMO_ACTION_RETIRED");
    expect(body.canonicalApiRoute).toBe("/api/export-workflow");
    expect(body.mutated).toBe(false);
    expect(body.noClientRelease).toBe(true);
  });

  test("export workflow read model uses fail-closed API envelope for invalid scope", async ({ request }) => {
    const response = await request.get("/api/export-workflow?tenantSlug=unknown&roleKey=pretend_role");
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body).toMatchObject({
      mutated: false,
      noAdviceExecution: true,
      noClientRelease: true,
      ok: false,
      reasonCode: "INVALID_REQUEST",
      retryAllowed: false,
      safety: {
        failClosed: true,
        hiddenRowsDisclosed: false,
        noExportApproval: true,
        noExportDownload: true,
        scoped: false,
        silentStateAdvance: false,
      },
      snapshot: null,
    });
    expect(body.issues).toEqual(["valid_tenant_slug_required", "valid_role_key_required"]);
  });

  test("export workflow snapshot declares service read-model truth instead of demo fallback proof", async ({ request }) => {
    const response = await request.get("/api/export-workflow?tenantSlug=summit&roleKey=principal");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.safety).toMatchObject({
      hiddenRowsDisclosed: false,
      noClientRelease: true,
      scoped: true,
      tenantSlug: "summit",
    });
    expect(body.snapshot.uiTruth).toEqual({
      apiRoute: "/api/export-workflow",
      fallbackDemoData: false,
      noClientRelease: true,
      noDownstreamCompletion: true,
      readModel: "getExportWorkflowSnapshot",
      source: "DB_READMODEL",
    });
    expect(body.snapshot.current).not.toHaveProperty("storageKey");
    expect(body.snapshot.current).not.toHaveProperty("checksum");
    expect(body.snapshot.current).not.toHaveProperty("internalPayload");
  });

  test("blocks share before download and permits it after controlled download", async ({ request }) => {
    const exportRequestId = await prepareGeneratedExport(request);

    const blockedShareResponse = await exportCommand(request, {
      command: "SHARE",
      exportRequestId,
      externalShare: true,
      payload: safeExportPayload,
      reason: "Share must remain blocked before controlled download.",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const blockedShareBody = await blockedShareResponse.json();

    expect(blockedShareResponse.status(), JSON.stringify(blockedShareBody)).toBe(400);
    expect(blockedShareBody.issues).toContain("download_required_before_share");
    expect(blockedShareBody.mutated).toBe(false);
    expect(blockedShareBody.noClientRelease).toBe(true);

    const downloadResponse = await exportCommand(request, {
      command: "DOWNLOAD",
      exportRequestId,
      payload: safeExportPayload,
      reason: "Record controlled download before explicit share.",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const downloadBody = await downloadResponse.json();

    expect(downloadResponse.ok(), JSON.stringify(downloadBody)).toBe(true);
    expect(downloadBody.noClientRelease).toBe(true);

    const shareResponse = await exportCommand(request, {
      command: "SHARE",
      exportRequestId,
      externalShare: true,
      payload: safeExportPayload,
      reason: "Record explicit share after controlled download.",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    });
    const shareBody = await shareResponse.json();

    expect(shareResponse.ok(), JSON.stringify(shareBody)).toBe(true);
    expect(shareBody.noClientRelease).toBe(true);
    expect(shareBody.status).toBe("DOWNLOADED");
  });
});
