import "dotenv/config";
import { execFileSync } from "node:child_process";

import { expect, test } from "@playwright/test";

test.describe("Stage 10 P0 API fail-closed contract", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test("invalid recommendation review request fails closed without advice execution or client release", async ({ request }) => {
    const response = await request.post("/api/recommendation-review-workflow", {
      data: { action: "releaseClient" },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.noAdviceExecution).toBe(true);
    expect(body.noClientRelease).toBe(true);
    expect(body.result).toBeUndefined();
  });

  test("invalid document list scope returns an empty no-release payload", async ({ request }) => {
    const response = await request.get("/api/documents?tenantSlug=unknown&roleKey=analyst");
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(401);
    expect(body.ok).toBe(false);
    expect(body.documents).toEqual([]);
    expect(body.mutated).toBe(false);
    expect(body.noClientRelease).toBe(true);
    expect(body.reasonCode).toBe("PERMISSION_DENIED");
    expect(body.safety).toMatchObject({
      authority: "db-user-jwt",
      failClosed: true,
      hiddenRowsDisclosed: false,
      releaseUnlocked: false,
      scoped: false,
      silentStateAdvance: false,
    });
  });

  test("client-safe evidence summary requires an explicit valid tenant scope", async ({ request }) => {
    const missingTenant = await request.get("/api/client-safe-evidence-summary");
    const missingTenantBody = await missingTenant.json();

    expect(missingTenant.status(), JSON.stringify(missingTenantBody)).toBe(400);
    expect(missingTenantBody.ok).toBe(false);
    expect(missingTenantBody.mutated).toBe(false);
    expect(missingTenantBody.noAdviceExecution).toBe(true);
    expect(missingTenantBody.noClientRelease).toBe(true);
    expect(missingTenantBody.issues).toEqual(["valid_tenant_slug_required"]);
    expect(missingTenantBody.summary).toBeUndefined();
    expect(missingTenantBody.safety).toMatchObject({
      failClosed: true,
      hiddenRowsDisclosed: false,
      scoped: false,
      silentStateAdvance: false,
    });

    const invalidTenant = await request.get("/api/client-safe-evidence-summary?tenantSlug=unknown");
    const invalidTenantBody = await invalidTenant.json();

    expect(invalidTenant.status(), JSON.stringify(invalidTenantBody)).toBe(400);
    expect(invalidTenantBody.ok).toBe(false);
    expect(invalidTenantBody.issues).toEqual(["valid_tenant_slug_required"]);
    expect(invalidTenantBody.summary).toBeUndefined();
  });

  test("upload without DB-user JWT cannot mutate, release or imply sufficiency", async ({ request }) => {
    const response = await request.post("/api/documents/upload", {
      multipart: {
        documentType: "financial_statement",
        file: {
          buffer: Buffer.from("%PDF-1.4\nStage 10 invalid metadata\n%%EOF"),
          mimeType: "application/pdf",
          name: "stage10-invalid-metadata.pdf",
        },
        roleKey: "family_cfo",
        tenantSlug: "morgan",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(401);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.noClientRelease).toBe(true);
    expect(body.reasonCode).toBe("PERMISSION_DENIED");
    expect(body.safety).toMatchObject({
      authority: "db-user-jwt",
      failClosed: true,
      scoped: false,
      silentStateAdvance: false,
    });
  });

  test("evidence review without DB-user JWT cannot mutate, release or imply sufficiency", async ({ request }) => {
    const response = await request.post("/api/documents/review", {
      data: {
        action: "accept_sufficiency",
        documentId: "not-a-document",
        roleKey: "pretend_role",
        tenantSlug: "unknown",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(401);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.noClientRelease).toBe(true);
    expect(body.reasonCode).toBe("PERMISSION_DENIED");
    expect(body.safety).toMatchObject({
      authority: "db-user-jwt",
      failClosed: true,
      releaseUnlocked: false,
      scoped: false,
      silentStateAdvance: false,
    });
  });

  test("invalid review monitoring query remains internal and no-advice", async ({ request }) => {
    const response = await request.get("/api/review-monitoring?asOf=not-a-date");
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.noAdviceExecution).toBe(true);
    expect(body.noClientRelease).toBe(true);
    expect(body.issues).toEqual(["valid_as_of_required"]);
  });

  test("unauthenticated export workflow scope fails closed without UI fallback proof", async ({ request }) => {
    const response = await request.get("/api/export-workflow?tenantSlug=unknown&roleKey=pretend_role");
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(401);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.noAdviceExecution).toBe(true);
    expect(body.noClientRelease).toBe(true);
    expect(body.reasonCode).toBe("PERMISSION_DENIED");
    expect(body.safety).toMatchObject({
      authority: "db-user-jwt",
      commandExecuted: false,
      hiddenRowsDisclosed: false,
      noExportApproval: true,
      noExportDownload: true,
      scoped: false,
    });
  });
});
