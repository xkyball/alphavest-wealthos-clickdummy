import { execFileSync } from "node:child_process";
import "dotenv/config";
import { expect, test } from "@playwright/test";

test.describe("DBTF P00-P10 DB-backed table/form APIs", () => {
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

  test("saves and reloads the DB-backed client profile form", async ({ request }) => {
    const firstName = `Bennett ${Date.now()}`;
    const saveResponse = await request.patch("/api/profile", {
      data: {
        action: "save_draft",
        countryOfResidence: "South Africa",
        firstName,
        lastName: "Principal",
        phone: "+27 10 555 0199",
        relationshipLabel: "Principal",
        roleKey: "family_cfo",
        tenantSlug: "bennett",
      },
    });
    const saveBody = await saveResponse.json();

    expect(saveResponse.ok(), JSON.stringify(saveBody)).toBe(true);
    expect(saveBody.ok).toBe(true);
    expect(saveBody.result.mutated).toBe(true);
    expect(saveBody.result.profile.firstName).toBe(firstName);

    const reloadResponse = await request.get("/api/profile?tenantSlug=bennett&roleKey=family_cfo");
    const reloadBody = await reloadResponse.json();

    expect(reloadResponse.ok(), JSON.stringify(reloadBody)).toBe(true);
    expect(reloadBody.profile.firstName).toBe(firstName);
  });

  test("rejects invalid or unauthorized profile edits without mutation success", async ({ request }) => {
    const invalidResponse = await request.patch("/api/profile", {
      data: {
        action: "save_draft",
        countryOfResidence: "",
        firstName: "",
        lastName: "",
        relationshipLabel: "",
        roleKey: "family_cfo",
        tenantSlug: "bennett",
      },
    });
    const invalidBody = await invalidResponse.json();

    expect(invalidResponse.status(), JSON.stringify(invalidBody)).toBe(400);
    expect(invalidBody.ok).toBe(false);
    expect(invalidBody.mutated).toBe(false);
    expect(invalidBody.issues).toContain("first_name_required");

    const deniedResponse = await request.patch("/api/profile", {
      data: {
        action: "save_draft",
        countryOfResidence: "South Africa",
        firstName: "Denied",
        lastName: "Next Gen",
        relationshipLabel: "Next Gen",
        roleKey: "next_gen",
        tenantSlug: "bennett",
      },
    });
    const deniedBody = await deniedResponse.json();

    expect(deniedResponse.status(), JSON.stringify(deniedBody)).toBe(403);
    expect(deniedBody.ok).toBe(false);
    expect(deniedBody.mutated).toBe(false);
  });

  test("saves a family member row with RBAC and reload proof", async ({ request }) => {
    const listResponse = await request.get("/api/family-members?tenantSlug=morgan&roleKey=family_cfo");
    const listBody = await listResponse.json();
    const target = listBody.familyMembers.find((row: { relationship: string }) => row.relationship === "Spouse") ?? listBody.familyMembers[0];
    const nextName = `${target.name} DBTF`;
    const saveResponse = await request.patch("/api/family-members", {
      data: {
        displayName: nextName,
        id: target.id,
        relationshipType: target.relationship,
        roleKey: "family_cfo",
        taxResidency: target.taxResidency,
        tenantSlug: "morgan",
      },
    });
    const saveBody = await saveResponse.json();

    expect(saveResponse.ok(), JSON.stringify(saveBody)).toBe(true);
    expect(saveBody.ok).toBe(true);
    expect(saveBody.result.mutated).toBe(true);

    const reloadResponse = await request.get("/api/family-members?tenantSlug=morgan&roleKey=family_cfo&q=DBTF");
    const reloadBody = await reloadResponse.json();

    expect(reloadResponse.ok(), JSON.stringify(reloadBody)).toBe(true);
    expect(reloadBody.familyMembers.some((row: { name: string }) => row.name === nextName)).toBe(true);
  });

  test("denies limited-role family row actions", async ({ request }) => {
    const listResponse = await request.get("/api/family-members?tenantSlug=bennett&roleKey=family_cfo");
    const listBody = await listResponse.json();
    const target = listBody.familyMembers[0];
    const deniedResponse = await request.patch("/api/family-members", {
      data: {
        displayName: "Unauthorized Update",
        id: target.id,
        relationshipType: target.relationship,
        roleKey: "next_gen",
        taxResidency: target.taxResidency,
        tenantSlug: "bennett",
      },
    });
    const deniedBody = await deniedResponse.json();

    expect(deniedResponse.status(), JSON.stringify(deniedBody)).toBe(403);
    expect(deniedBody.ok).toBe(false);
    expect(deniedBody.mutated).toBe(false);
  });

  test("validates and persists the DB-backed entity wizard lifecycle", async ({ request }) => {
    const invalidResponse = await request.post("/api/entities", {
      data: {
        action: "submit",
        entityType: "COMPANY",
        jurisdiction: "",
        name: "",
        roleKey: "family_cfo",
        tenantSlug: "summit",
      },
    });
    const invalidBody = await invalidResponse.json();

    expect(invalidResponse.status(), JSON.stringify(invalidBody)).toBe(400);
    expect(invalidBody.issues).toContain("legal_name_required");

    const entityName = `Summit DBTF Holdings ${Date.now()}`;
    const submitResponse = await request.post("/api/entities", {
      data: {
        action: "submit",
        entityType: "COMPANY",
        jurisdiction: "United States",
        name: entityName,
        ownerSummary: "Focused DBTF wizard entity.",
        registrationNumber: "DBTF-2026",
        riskRating: "Medium",
        roleKey: "family_cfo",
        tenantSlug: "summit",
      },
    });
    const submitBody = await submitResponse.json();

    expect(submitResponse.ok(), JSON.stringify(submitBody)).toBe(true);
    expect(submitBody.result.mutated).toBe(true);
    expect(submitBody.result.entity.name).toBe(entityName);

    const listResponse = await request.get(`/api/entities?tenantSlug=summit&roleKey=family_cfo&q=${encodeURIComponent(entityName)}`);
    const listBody = await listResponse.json();

    expect(listResponse.ok(), JSON.stringify(listBody)).toBe(true);
    expect(listBody.entities).toHaveLength(1);
    expect(listBody.entities[0].name).toBe(entityName);
  });

  test("derives dashboard metrics from tenant-scoped DB rows", async ({ request }) => {
    const response = await request.get("/api/dashboard-metrics?tenantSlug=bennett&roleKey=compliance_officer");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.metrics.readiness).toBeGreaterThanOrEqual(0);
    expect(body.metrics.cards.some((card: { label: string; value: string }) => card.label === "Documents linked" && card.value.includes("/"))).toBe(true);
    expect(body.safety.noClientRelease).toBe(true);
  });

  test("runs tenant-scoped global search without cross-tenant leakage", async ({ request }) => {
    const response = await request.get("/api/global-search?tenantSlug=bennett&roleKey=family_cfo&q=Bennett");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.safety.scoped).toBe(true);
    expect(body.results.length).toBeGreaterThan(0);
    expect(body.results.every((row: { label: string; description: string }) => `${row.label} ${row.description}`.toLowerCase().includes("bennett"))).toBe(true);
    expect(body.results.every((row: { href: string }) => row.href.startsWith("/") && !row.href.includes(":"))).toBe(true);

    const invalidResponse = await request.get("/api/global-search?tenantSlug=unknown&roleKey=family_cfo&q=Bennett");
    const invalidBody = await invalidResponse.json();

    expect(invalidResponse.status(), JSON.stringify(invalidBody)).toBe(400);
    expect(invalidBody.results).toEqual([]);
    expect(invalidBody.safety.hiddenRowsDisclosed).toBe(false);
  });

  test("surfaces J06 tenant wizard mutations in the admin tenant snapshot", async ({ request }) => {
    const mutationResponse = await request.post("/api/demo-workflow", { data: { actionId: "j06.continueTenant" } });
    const mutationBody = await mutationResponse.json();

    expect(mutationResponse.ok(), JSON.stringify(mutationBody)).toBe(true);
    expect(mutationBody.result.tenantRows).toBeGreaterThan(0);

    const snapshotResponse = await request.get("/api/admin-tenants");
    const snapshotBody = await snapshotResponse.json();

    expect(snapshotResponse.ok(), JSON.stringify(snapshotBody)).toBe(true);
    expect(snapshotBody.snapshot.tenantRows.some((row: { name: string; status: string }) => row.name.includes("Morgan") && row.status === "Onboarding")).toBe(true);
    expect(snapshotBody.snapshot.auditProof.some((event: { eventType: string }) => event.eventType === "screencast.tenant.details_saved")).toBe(true);
  });

  test("surfaces J08 export wizard lifecycle from ExportRequest rows", async ({ request }) => {
    for (const actionId of ["j08.selectDataExtract", "j08.clearScope", "j08.confirmApproval"]) {
      const response = await request.post("/api/demo-workflow", { data: { actionId } });
      const body = await response.json();

      expect(response.ok(), `${actionId}: ${JSON.stringify(body)}`).toBe(true);
    }

    const response = await request.get("/api/export-workflow?tenantSlug=summit&roleKey=principal");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.safety.noClientRelease).toBe(true);
    expect(body.snapshot.current.status).toBe("Generated");
    expect(body.snapshot.current.realFileGenerated).toBe(false);
    expect(body.snapshot.summary.included).toBeGreaterThan(0);
    expect(body.snapshot.timeline.some((item: { title: string }) => item.title.toLowerCase().includes("approved"))).toBe(true);
  });

  test("derives Ops/SLA metrics from queue and data-quality rows", async ({ request }) => {
    const response = await request.get("/api/ops-sla?tenantSlug=summit&roleKey=client_success&asOf=2026-06-17T12:00:00.000Z");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.safety.noAdviceExecution).toBe(true);
    expect(body.snapshot.metrics.some((metric: { label: string; value: string }) => metric.label === "SLA Met" && metric.value.endsWith("%"))).toBe(true);
    expect(body.snapshot.queueRows.length).toBeGreaterThan(0);
    expect(body.snapshot.breachRows.every((row: { client: string }) => row.client.includes("Summit"))).toBe(true);
  });
});
