import { execFileSync } from "node:child_process";
import "dotenv/config";
import { expect, test } from "@playwright/test";

test.describe("DBTF P00-P03 DB-backed table APIs", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test("returns tenant-scoped DB-backed documents without requiring demo arrays", async ({ request }) => {
    const response = await request.get("/api/documents?tenantSlug=bennett&roleKey=compliance_officer&source=all");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.safety.scoped).toBe(true);
    expect(body.documents.length).toBeGreaterThan(0);
    expect(body.documents.every((document: { id?: string; documentType?: string; status?: string }) => document.id && document.documentType && document.status)).toBe(true);
  });

  test("returns tenant-scoped DB-backed family member rows", async ({ request }) => {
    const response = await request.get("/api/family-members?tenantSlug=morgan&roleKey=compliance_officer");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.safety.scoped).toBe(true);
    expect(body.familyMembers.length).toBeGreaterThan(0);
    expect(body.familyMembers.every((row: { id?: string; name?: string; relationship?: string }) => row.id && row.name && row.relationship)).toBe(true);
  });

  test("returns DB-backed entity rows with no cross-tenant leakage", async ({ request }) => {
    const bennettResponse = await request.get("/api/entities?tenantSlug=bennett&roleKey=compliance_officer");
    const summitResponse = await request.get("/api/entities?tenantSlug=summit&roleKey=compliance_officer");
    const bennettBody = await bennettResponse.json();
    const summitBody = await summitResponse.json();

    expect(bennettResponse.ok(), JSON.stringify(bennettBody)).toBe(true);
    expect(summitResponse.ok(), JSON.stringify(summitBody)).toBe(true);
    expect(bennettBody.entities.length).toBeGreaterThan(0);
    expect(summitBody.entities.length).toBeGreaterThan(0);

    const bennettIds = new Set(bennettBody.entities.map((row: { id: string }) => row.id));
    const leakedSummitIds = summitBody.entities.filter((row: { id: string }) => bennettIds.has(row.id));

    expect(leakedSummitIds).toEqual([]);
  });

  test("returns tenant-scoped DB-backed audit events", async ({ request }) => {
    const response = await request.get("/api/audit-events?tenantSlug=bennett&roleKey=compliance_officer");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.safety.scoped).toBe(true);
    expect(body.auditEvents.length).toBeGreaterThan(0);
    expect(body.auditEvents.every((row: { id?: string; action?: string; result?: string }) => row.id && row.action && row.result)).toBe(true);
  });

  test("rejects invalid table scopes fail-closed", async ({ request }) => {
    const response = await request.get("/api/entities?tenantSlug=main&roleKey=compliance_officer");
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.entities).toEqual([]);
    expect(body.safety.hiddenRowsDisclosed).toBe(false);
  });
});
