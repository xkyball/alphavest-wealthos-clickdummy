import { execFileSync } from "node:child_process";
import "dotenv/config";
import { expect, test } from "@playwright/test";

test.describe.serial("Phase 8 export workflow API", () => {
  test.setTimeout(120_000);

  test.beforeEach(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test("fails closed when export approval audit persistence is unavailable", async ({ request }) => {
    const response = await request.post("/api/demo-workflow", {
      data: {
        actionId: "j08.confirmApproval",
        simulateAuditPersistenceFailure: true,
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(409);
    expect(body.reasonCode).toBe("AUDIT_PERSISTENCE_UNAVAILABLE");
    expect(body.auditPersistenceRequired).toBe(true);
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
    for (const actionId of ["j08.selectDataExtract", "j08.clearScope", "j08.confirmApproval"]) {
      const response = await request.post("/api/demo-workflow", { data: { actionId } });
      const body = await response.json();

      expect(response.ok(), `${actionId}: ${JSON.stringify(body)}`).toBe(true);
      expect(body.noClientRelease).toBe(true);
    }

    const blockedShareResponse = await request.post("/api/demo-workflow", {
      data: { actionId: "j08.shareExport" },
    });
    const blockedShareBody = await blockedShareResponse.json();

    expect(blockedShareResponse.status(), JSON.stringify(blockedShareBody)).toBe(409);
    expect(blockedShareBody.mutated).toBe(false);
    expect(blockedShareBody.noClientRelease).toBe(true);

    const downloadResponse = await request.post("/api/demo-workflow", {
      data: { actionId: "j08.downloadExport" },
    });
    const downloadBody = await downloadResponse.json();

    expect(downloadResponse.ok(), JSON.stringify(downloadBody)).toBe(true);
    expect(downloadBody.noClientRelease).toBe(true);

    const shareResponse = await request.post("/api/demo-workflow", {
      data: { actionId: "j08.shareExport" },
    });
    const shareBody = await shareResponse.json();

    expect(shareResponse.ok(), JSON.stringify(shareBody)).toBe(true);
    expect(shareBody.noClientRelease).toBe(true);
    expect(shareBody.result.shareToken).toBe("SHARE-9F3B-7A2C");
  });
});
