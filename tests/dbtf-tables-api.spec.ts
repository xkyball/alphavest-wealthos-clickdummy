import { execFileSync } from "node:child_process";
import "dotenv/config";
import { expect, test, type APIRequestContext } from "@playwright/test";
import { ObjectType } from "@prisma/client";

import { actorTenants, createActorSession } from "../lib/actor-session";
import {
  assertSearchPolicyCanReachRow,
  buildSearchAccessMetadata,
  resolveGlobalSearchAccessPolicy,
} from "../lib/global-search-access-policy";
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
    id: stableId(`dbtf-export-workflow:${label}`),
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
    reason: "Select client-safe released objects for DBTF readmodel proof.",
    redactionProfile: "client-safe-redacted",
    roleKey: "compliance_officer",
    scopeItems: [safeScopeItem("generated-readmodel")],
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
}

test.describe("DBTF P00-P10 DB-backed table/form APIs", () => {
  test.beforeAll(() => {
    execFileSync("pnpm", ["db:seed"], { stdio: "inherit" });
  });

  test("derives global search access policy from mapped actor sessions before querying", async () => {
    const bennettTenant = actorTenants.find((tenant) => tenant.slug === "bennett");
    expect(bennettTenant).toBeTruthy();

    const principalPolicy = resolveGlobalSearchAccessPolicy(
      createActorSession({ roleKey: "principal", tenantSlug: "bennett" }),
    );
    expect(principalPolicy.tenantIds).toEqual([bennettTenant!.id]);
    expect(principalPolicy.visibilityScopes).toEqual(["CLIENT_SAFE"]);
    expect(principalPolicy.objectTypes).toContain(ObjectType.FAMILY_MEMBER);
    expect(principalPolicy.objectTypes).not.toContain(ObjectType.AUDIT_EVENT);
    expect(assertSearchPolicyCanReachRow(principalPolicy, {
      clientTenantId: bennettTenant!.id,
      objectType: ObjectType.FAMILY_MEMBER,
      visibilityScope: "CLIENT_SAFE",
    })).toBe(true);
    expect(assertSearchPolicyCanReachRow(principalPolicy, {
      clientTenantId: bennettTenant!.id,
      objectType: ObjectType.FAMILY_MEMBER,
      visibilityScope: "TENANT_INTERNAL",
    })).toBe(false);

    const analystPolicy = resolveGlobalSearchAccessPolicy(
      createActorSession({ roleKey: "analyst", tenantSlug: "bennett" }),
    );
    expect(analystPolicy.tenantIds).toEqual([bennettTenant!.id]);
    expect(analystPolicy.visibilityScopes).toEqual(["CLIENT_SAFE", "TENANT_INTERNAL"]);
    expect(analystPolicy.objectTypes).toContain(ObjectType.PROCESS);
    expect(analystPolicy.objectTypes).toContain(ObjectType.AUDIT_EVENT);
    expect(analystPolicy.visibilityScopes).not.toContain("PLATFORM_INTERNAL");

    const externalAdvisorPolicy = resolveGlobalSearchAccessPolicy(
      createActorSession({ roleKey: "external_advisor", tenantSlug: "bennett" }),
    );
    expect(externalAdvisorPolicy.visibilityScopes).toEqual(["CLIENT_SAFE", "TENANT_INTERNAL"]);
    expect(externalAdvisorPolicy.objectTypes).toEqual([
      ObjectType.DOCUMENT,
      ObjectType.DECISION,
      ObjectType.EVIDENCE_RECORD,
    ]);
    expect(assertSearchPolicyCanReachRow(externalAdvisorPolicy, {
      clientTenantId: bennettTenant!.id,
      objectType: ObjectType.ASSET,
      visibilityScope: "CLIENT_SAFE",
    })).toBe(false);
    expect(buildSearchAccessMetadata({
      allowedActorIds: [],
      clientTenantId: bennettTenant!.id,
      objectType: ObjectType.DOCUMENT,
      visibilityScope: "TENANT_INTERNAL",
    })).toMatchObject({
      allowedActorIds: [],
      objectGrantRequiredRoleKeys: expect.arrayContaining(["external_advisor"]),
      version: "search_acl_v1",
    });

    const adminPolicy = resolveGlobalSearchAccessPolicy(
      createActorSession({ roleKey: "admin", tenantSlug: "bennett" }),
    );
    expect(adminPolicy.tenantIds).toEqual(actorTenants.map((tenant) => tenant.id));
    expect(adminPolicy.visibilityScopes).toEqual(["CLIENT_SAFE", "TENANT_INTERNAL", "PLATFORM_INTERNAL"]);
    expect(adminPolicy.objectTypes).toContain(ObjectType.POLICY);
  });

  test("returns tenant-scoped DB-backed documents without requiring demo arrays", async ({ request }) => {
    const response = await request.get("/api/documents?tenantSlug=bennett&roleKey=compliance_officer&source=all");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.sourceTruth).toBe("document_readmodel_db");
    expect(body.safety.scoped).toBe(true);
    expect(body.documents.length).toBeGreaterThan(0);
    expect(body.documents.every((document: { id?: string; documentType?: string; status?: string }) => document.id && document.documentType && document.status)).toBe(true);
  });

  test("returns tenant-scoped workflow-backed action board rows", async ({ request }) => {
    const response = await request.get("/api/action-board?tenantSlug=bennett&roleKey=compliance_officer&pageSize=2&sortKey=dueDate&sortDirection=asc");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.noAdviceExecution).toBe(true);
    expect(body.noClientRelease).toBe(true);
    expect(body.meta).toMatchObject({
      page: 1,
      pageSize: 2,
      sourceTruth: "backend_query_backed",
    });
    expect(body.safety).toMatchObject({
      hiddenRowsDisclosed: false,
      noAdviceExecution: true,
      noClientRelease: true,
      scoped: true,
      tenantSlug: "bennett",
    });
    expect(body.rows.length).toBeGreaterThan(0);
    expect(body.rows.every((row: { id?: string; status?: string; title?: string }) => row.id && row.status && row.title)).toBe(true);
  });

  test("returns tenant-scoped DB-backed wealth map readmodel", async ({ request }) => {
    const response = await request.get("/api/wealth-map?tenantSlug=bennett&roleKey=compliance_officer");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.noAdviceExecution).toBe(true);
    expect(body.noClientRelease).toBe(true);
    expect(body.readModel.sourceTruth).toBe("wealth_map_db_readmodel");
    expect(body.readModel.meta.sourceTruth).toBe("wealth_map_db_readmodel");
    expect(body.readModel.workspace.household).toBe("Bennett Family Office");
    expect(body.readModel.nodes.length).toBeGreaterThan(0);
    expect(body.readModel.connections.length).toBeGreaterThan(0);
    expect(body.readModel.nodes.every((node: { id?: string; label?: string; status?: string }) => node.id && node.label && node.status)).toBe(true);
    expect(body.safety).toMatchObject({
      hiddenRowsDisclosed: false,
      noAdviceExecution: true,
      noClientRelease: true,
      scope: "tenant-role-wealth-map",
      scoped: true,
      tenantSlug: "bennett",
    });

    const deniedResponse = await request.get("/api/wealth-map?tenantSlug=bennett&actorTenantSlug=summit&roleKey=compliance_officer");
    const deniedBody = await deniedResponse.json();

    expect(deniedResponse.status(), JSON.stringify(deniedBody)).toBe(403);
    expect(deniedBody.ok).toBe(false);
    expect(deniedBody.safety.hiddenRowsDisclosed).toBe(false);
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

  test("returns tenant-scoped DB-backed entity detail and denies actor-tenant mismatch", async ({ request }) => {
    const detailResponse = await request.get("/api/entities?tenantSlug=bennett&roleKey=compliance_officer&targetId=philanthropy-trust");
    const detailBody = await detailResponse.json();

    expect(detailResponse.ok(), JSON.stringify(detailBody)).toBe(true);
    expect(detailBody.ok).toBe(true);
    expect(detailBody.entity.sourceTruth).toBe("entity_db_readmodel");
    expect(detailBody.entity.name).toBe("Bennett Legacy Trust");
    expect(detailBody.entity.participants.length).toBeGreaterThan(0);
    expect(detailBody.entity.documents.length).toBeGreaterThan(0);
    expect(detailBody.entity.href).toBe("/entities/bennett-legacy-trust");
    expect(detailBody.meta.sourceTruth).toBe("backend_query_backed");
    expect(detailBody.safety.hiddenRowsDisclosed).toBe(false);

    const deniedResponse = await request.get("/api/entities?tenantSlug=bennett&actorTenantSlug=summit&roleKey=compliance_officer&targetId=philanthropy-trust");
    const deniedBody = await deniedResponse.json();

    expect(deniedResponse.status()).toBe(403);
    expect(deniedBody.ok).toBe(false);
    expect(deniedBody.safety.hiddenRowsDisclosed).toBe(false);
  });

  test("returns tenant-scoped DB-backed relationship rows with backend pagination", async ({ request }) => {
    await request.post("/api/data-maintenance/actions", {
      data: { actionId: "j09.addRelationship" },
    });

    const response = await request.get("/api/relationships?tenantSlug=bennett&roleKey=family_cfo&pageSize=1&sortKey=from");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.safety.scoped).toBe(true);
    expect(body.safety.hiddenRowsDisclosed).toBe(false);
    expect(body.meta.sourceTruth).toBe("backend_query_backed");
    expect(body.meta.pageSize).toBe(1);
    expect(body.meta.totalRows).toBeGreaterThan(0);
    expect(body.relationships).toHaveLength(1);
    expect(body.relationships[0].from).toBeTruthy();
    expect(body.relationships[0].to).toBeTruthy();
    expect(body.relationships[0].relationship).toBeTruthy();
    expect(body.relationships[0].evidence).toBeTruthy();
    expect(body.relationships[0].updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const queryResponse = await request.get("/api/relationships?tenantSlug=bennett&roleKey=family_cfo&q=Principal");
    const queryBody = await queryResponse.json();

    expect(queryResponse.ok(), JSON.stringify(queryBody)).toBe(true);
    expect(queryBody.relationships.some((row: { from: string; to: string }) => `${row.from} ${row.to}`.includes("Principal"))).toBe(true);

    const deniedResponse = await request.get("/api/relationships?tenantSlug=bennett&actorTenantSlug=summit&roleKey=family_cfo");
    const deniedBody = await deniedResponse.json();

    expect(deniedResponse.status(), JSON.stringify(deniedBody)).toBe(403);
    expect(deniedBody.relationships).toEqual([]);
    expect(deniedBody.safety.hiddenRowsDisclosed).toBe(false);
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

  test("returns tenant-scoped workflow-backed client home work items", async ({ request }) => {
    const response = await request.get("/api/client-work-items?tenantSlug=bennett&roleKey=family_cfo");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.sourceTruth).toBe("workflow_db_readmodel");
    expect(body.safety.scoped).toBe(true);
    expect(body.safety.hiddenRowsDisclosed).toBe(false);
    expect(body.safety.noClientRelease).toBe(true);
    expect(body.openWork.length).toBeGreaterThan(0);
    expect(body.openWork.every((row: { href?: string; id?: string; label?: string; meta?: string; status?: string }) =>
      row.id && row.label && row.meta && row.status && row.href?.startsWith("/"),
    )).toBe(true);
    expect(JSON.stringify(body)).not.toContain("blocked-release");
    expect(JSON.stringify(body)).not.toContain("Resolve release gate");
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
    expect(saveBody.searchIndex.sourceTruth).toBe("full_text_search_index");

    const reloadResponse = await request.get("/api/profile?tenantSlug=bennett&roleKey=family_cfo");
    const reloadBody = await reloadResponse.json();

    expect(reloadResponse.ok(), JSON.stringify(reloadBody)).toBe(true);
    expect(reloadBody.profile.firstName).toBe(firstName);

    const searchResponse = await request.get(`/api/global-search?tenantSlug=bennett&roleKey=family_cfo&q=${encodeURIComponent(firstName)}`);
    const searchBody = await searchResponse.json();

    expect(searchResponse.ok(), JSON.stringify(searchBody)).toBe(true);
    expect(searchBody.results.some((row: { label: string; type: string }) => row.label.includes(firstName) && row.type === "Profile")).toBe(true);
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
    expect(submitBody.searchIndex.sourceTruth).toBe("full_text_search_index");
    expect(submitBody.searchIndex.count).toBeGreaterThan(0);

    const listResponse = await request.get(`/api/entities?tenantSlug=summit&roleKey=family_cfo&q=${encodeURIComponent(entityName)}`);
    const listBody = await listResponse.json();

    expect(listResponse.ok(), JSON.stringify(listBody)).toBe(true);
    expect(listBody.entities).toHaveLength(1);
    expect(listBody.entities[0].name).toBe(entityName);

    const searchResponse = await request.get(`/api/global-search?tenantSlug=summit&roleKey=family_cfo&q=${encodeURIComponent(entityName)}`);
    const searchBody = await searchResponse.json();

    expect(searchResponse.ok(), JSON.stringify(searchBody)).toBe(true);
    expect(searchBody.sourceTruth).toBe("full_text_search_index");
    expect(searchBody.results.some((row: { label: string }) => row.label === entityName)).toBe(true);
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

    const hiddenInternalResponse = await request.get("/api/global-search?tenantSlug=bennett&roleKey=family_cfo&q=internal%20advisor");
    const hiddenInternalBody = await hiddenInternalResponse.json();

    expect(hiddenInternalResponse.ok(), JSON.stringify(hiddenInternalBody)).toBe(true);
    expect(hiddenInternalBody.sourceTruth).toBe("full_text_search_index");
    expect(hiddenInternalBody.results).toEqual([]);
    expect(hiddenInternalBody.safety.hiddenRowsDisclosed).toBe(false);

    const externalAdvisorInternalResponse = await request.get("/api/global-search?tenantSlug=bennett&roleKey=external_advisor&q=internal%20advisor");
    const externalAdvisorInternalBody = await externalAdvisorInternalResponse.json();

    expect(externalAdvisorInternalResponse.ok(), JSON.stringify(externalAdvisorInternalBody)).toBe(true);
    expect(externalAdvisorInternalBody.sourceTruth).toBe("full_text_search_index");
    expect(externalAdvisorInternalBody.results).toEqual([]);
    expect(externalAdvisorInternalBody.safety.hiddenRowsDisclosed).toBe(false);

    const externalAdvisorAssetResponse = await request.get("/api/global-search?tenantSlug=bennett&roleKey=external_advisor&q=asset");
    const externalAdvisorAssetBody = await externalAdvisorAssetResponse.json();

    expect(externalAdvisorAssetResponse.ok(), JSON.stringify(externalAdvisorAssetBody)).toBe(true);
    expect(externalAdvisorAssetBody.results.every((row: { type: string }) => row.type !== "Asset")).toBe(true);
    expect(externalAdvisorAssetBody.safety.hiddenRowsDisclosed).toBe(false);

    const externalAdvisorBeforeGrantResponse = await request.get("/api/global-search?tenantSlug=northbridge&roleKey=external_advisor&q=statement");
    const externalAdvisorBeforeGrantBody = await externalAdvisorBeforeGrantResponse.json();

    expect(externalAdvisorBeforeGrantResponse.ok(), JSON.stringify(externalAdvisorBeforeGrantBody)).toBe(true);
    expect(externalAdvisorBeforeGrantBody.results).toEqual([]);

    const grantResponse = await request.post("/api/tenant-governance/actions", {
      data: { actionId: "j07.approveAccess" },
    });
    const grantBody = await grantResponse.json();

    expect(grantResponse.ok(), JSON.stringify(grantBody)).toBe(true);
    expect(grantBody.searchIndex.sourceTruth).toBe("full_text_search_index");

    const externalAdvisorAfterGrantResponse = await request.get("/api/global-search?tenantSlug=northbridge&roleKey=external_advisor&q=statement");
    const externalAdvisorAfterGrantBody = await externalAdvisorAfterGrantResponse.json();

    expect(externalAdvisorAfterGrantResponse.ok(), JSON.stringify(externalAdvisorAfterGrantBody)).toBe(true);
    expect(externalAdvisorAfterGrantBody.results.some((row: { type: string }) => row.type === "Document")).toBe(true);
    expect(JSON.stringify(externalAdvisorAfterGrantBody.results)).toContain("Northbridge");
    expect(externalAdvisorAfterGrantBody.safety.hiddenRowsDisclosed).toBe(false);

    const relationshipResponse = await request.post("/api/data-maintenance/actions", {
      data: { actionId: "j09.addRelationship" },
    });
    const relationshipBody = await relationshipResponse.json();

    expect(relationshipResponse.ok(), JSON.stringify(relationshipBody)).toBe(true);
    expect(relationshipBody.searchIndex.sourceTruth).toBe("full_text_search_index");

    const relationshipSearchResponse = await request.get("/api/global-search?tenantSlug=bennett&roleKey=family_cfo&q=parent%20child%20governance");
    const relationshipSearchBody = await relationshipSearchResponse.json();

    expect(relationshipSearchResponse.ok(), JSON.stringify(relationshipSearchBody)).toBe(true);
    expect(relationshipSearchBody.results.some((row: { type: string }) => row.type === "Relationship")).toBe(true);

    const invalidResponse = await request.get("/api/global-search?tenantSlug=unknown&roleKey=family_cfo&q=Bennett");
    const invalidBody = await invalidResponse.json();

    expect(invalidResponse.status(), JSON.stringify(invalidBody)).toBe(400);
    expect(invalidBody.results).toEqual([]);
    expect(invalidBody.safety.hiddenRowsDisclosed).toBe(false);

    const spoofedTenantResponse = await request.get("/api/global-search?tenantSlug=bennett&actorTenantSlug=summit&roleKey=family_cfo&q=Bennett");
    const spoofedTenantBody = await spoofedTenantResponse.json();

    expect(spoofedTenantResponse.status(), JSON.stringify(spoofedTenantBody)).toBe(403);
    expect(spoofedTenantBody.results).toEqual([]);
    expect(spoofedTenantBody.safety.hiddenRowsDisclosed).toBe(false);
  });

  test("searches workflow-backed business objects without leaking internal process hits to client roles", async ({ request }) => {
    const internalProcessResponse = await request.get("/api/global-search?tenantSlug=morgan&roleKey=analyst&q=work");
    const internalProcessBody = await internalProcessResponse.json();

    expect(internalProcessResponse.ok(), JSON.stringify(internalProcessBody)).toBe(true);
    expect(internalProcessBody.sourceTruth).toBe("full_text_search_index");
    expect(internalProcessBody.results.some((row: { type: string }) => row.type === "Work item")).toBe(true);
    expect(internalProcessBody.results.every((row: { href: string }) => row.href.startsWith("/") && !row.href.includes(":"))).toBe(true);
    expect(internalProcessBody.results.some((row: { nextActionLabel?: string; processLabel?: string }) => row.nextActionLabel && row.processLabel)).toBe(true);
    expect(JSON.stringify(internalProcessBody.results)).not.toMatch(/BP-\d+|PROCESS_DEFERRED_BY_MATRIX/);

    const clientProcessResponse = await request.get("/api/global-search?tenantSlug=morgan&roleKey=family_cfo&q=work");
    const clientProcessBody = await clientProcessResponse.json();

    expect(clientProcessResponse.ok(), JSON.stringify(clientProcessBody)).toBe(true);
    expect(clientProcessBody.results.every((row: { type: string }) => row.type !== "Process")).toBe(true);
    expect(clientProcessBody.safety.hiddenRowsDisclosed).toBe(false);

    const internalEvidenceResponse = await request.get("/api/global-search?tenantSlug=morgan&roleKey=analyst&q=evidence");
    const internalEvidenceBody = await internalEvidenceResponse.json();

    expect(internalEvidenceResponse.ok(), JSON.stringify(internalEvidenceBody)).toBe(true);
    expect(internalEvidenceBody.results.some((row: { type: string }) => row.type === "Evidence")).toBe(true);
    expect(internalEvidenceBody.results.some((row: { nextActionLabel?: string }) => row.nextActionLabel?.startsWith("Open "))).toBe(true);

    const assetResponse = await request.get("/api/global-search?tenantSlug=morgan&roleKey=family_cfo&q=asset");
    const assetBody = await assetResponse.json();

    expect(assetResponse.ok(), JSON.stringify(assetBody)).toBe(true);
    expect(assetBody.results.some((row: { type: string }) => row.type === "Asset")).toBe(true);
  });

  test("surfaces J06 tenant wizard mutations in the admin tenant snapshot", async ({ request }) => {
    const mutationResponse = await request.post("/api/tenant-governance/actions", { data: { actionId: "j06.continueTenant" } });
    const mutationBody = await mutationResponse.json();

    expect(mutationResponse.ok(), JSON.stringify(mutationBody)).toBe(true);
    expect(mutationBody.result.tenantRows).toBeGreaterThan(0);

    const snapshotResponse = await request.get("/api/admin-tenants");
    const snapshotBody = await snapshotResponse.json();

    expect(snapshotResponse.ok(), JSON.stringify(snapshotBody)).toBe(true);
    expect(snapshotBody.snapshot.sourceTruth).toBe("admin_tenant_db_readmodel");
    expect(snapshotBody.snapshot.meta.sourceTruth).toBe("admin_tenant_db_readmodel");
    expect(snapshotBody.snapshot.setupChecklist.length).toBeGreaterThan(0);
    expect(snapshotBody.snapshot.teamRows.length).toBeGreaterThan(0);
    expect(snapshotBody.snapshot.tenantRows.some((row: { name: string; status: string }) => row.name.includes("Morgan") && row.status === "Onboarding")).toBe(true);
    expect(snapshotBody.snapshot.auditProof.some((event: { eventType: string }) => event.eventType === "tenant_governance.tenant.details_saved")).toBe(true);
  });

  test("surfaces J08 export wizard lifecycle from ExportRequest rows", async ({ request }) => {
    await prepareGeneratedExport(request);

    const response = await request.get("/api/export-workflow?tenantSlug=summit&roleKey=principal");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.safety.noClientRelease).toBe(true);
    expect(body.snapshot.uiTruth.source).toBe("DB_READMODEL");
    expect(body.snapshot.uiTruth.fallbackSeedData).toBe(false);
    expect(body.snapshot.current.status).toBe("Generated");
    expect(body.snapshot.current.realFileGenerated).toBe(false);
    expect(body.snapshot.summary.included).toBeGreaterThan(0);
    expect(body.snapshot.protection.items.length).toBeGreaterThan(0);
    expect(body.snapshot.protection.policyHighlights.length).toBeGreaterThan(0);
    expect(body.snapshot.timeline.some((item: { title: string }) => item.title.toLowerCase().includes("approve"))).toBe(true);
  });

  test("derives Ops/SLA metrics from queue and data-quality rows", async ({ request }) => {
    const response = await request.get("/api/ops-sla?tenantSlug=summit&roleKey=client_success&asOf=2026-06-17T12:00:00.000Z");
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.safety.noAdviceExecution).toBe(true);
    expect(body.snapshot.sourceTruth).toBe("ops_sla_db_readmodel");
    expect(body.snapshot.meta.sourceTruth).toBe("ops_sla_db_readmodel");
    expect(body.snapshot.metrics.some((metric: { label: string; value: string }) => metric.label === "SLA Met" && metric.value.endsWith("%"))).toBe(true);
    expect(body.snapshot.queueRows.length).toBeGreaterThan(0);
    expect(body.snapshot.releaseControls.length).toBeGreaterThan(0);
    expect(body.snapshot.breachRows.every((row: { client: string }) => row.client.includes("Summit"))).toBe(true);
  });
});
