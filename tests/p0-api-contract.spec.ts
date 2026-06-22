import "dotenv/config";
import { execFileSync } from "node:child_process";

import { expect, test } from "@playwright/test";

test.describe("Phase 10 P0 API fail-closed contract", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test("invalid demo workflow request fails closed without advice execution or client release", async ({ request }) => {
    const response = await request.post("/api/demo-workflow", {
      data: { actionId: "releaseClient" },
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

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.documents).toEqual([]);
    expect(body.mutated).toBe(false);
    expect(body.noClientRelease).toBe(true);
    expect(body.issues).toEqual(["valid_tenant_slug_required"]);
  });

  test("invalid upload metadata cannot mutate, release or imply sufficiency", async ({ request }) => {
    const response = await request.post("/api/documents/upload", {
      multipart: {
        documentType: "financial_statement",
        file: {
          buffer: Buffer.from("%PDF-1.4\nPhase 10 invalid metadata\n%%EOF"),
          mimeType: "application/pdf",
          name: "phase10-invalid-metadata.pdf",
        },
        roleKey: "pretend_role",
        tenantSlug: "unknown",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.noClientRelease).toBe(true);
    expect(body.issues).toEqual(["valid_role_key_required", "valid_tenant_slug_required"]);
    expect(body.safety).toMatchObject({
      failClosed: true,
      silentStateAdvance: false,
    });
  });

  test("invalid evidence review request fails closed before evidence mutation", async ({ request }) => {
    const response = await request.post("/api/documents/review", {
      data: {
        action: "accept_sufficiency",
        documentId: "not-a-document",
        roleKey: "pretend_role",
        tenantSlug: "unknown",
      },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.mutated).toBe(false);
    expect(body.noClientRelease).toBe(true);
    expect(body.issues).toEqual(["valid_role_key_required", "valid_tenant_slug_required"]);
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
});
