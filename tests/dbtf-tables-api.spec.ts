import { execFileSync } from "node:child_process";
import "dotenv/config";
import { expect, test, type APIRequestContext } from "@playwright/test";
import { AuditResult, ObjectType, Sensitivity } from "@prisma/client";

import { authJwtCookieName } from "../lib/auth/auth-jwt";
import { actorTenants, createActorSession } from "../lib/actor-session";
import { rebuildGlobalSearchIndex, searchAccessibleObjectIdsByFullText } from "../lib/global-search-service";
import {
  allowedSearchRoleKeysForIndexedObject,
  assertSearchPolicyCanReachRow,
  buildSearchAccessMetadata,
  resolveGlobalSearchAccessPolicy,
} from "../lib/global-search-access-policy";
import { prismaClient } from "../lib/prisma";
import { stableId } from "../lib/stable-id";
import { tenantGovernanceScopeForAction } from "../lib/tenant-governance-workflow-actions";

const prisma = prismaClient();

type SearchDocumentMetadata = {
  nextActionLabel?: string;
  processLabel?: string;
  searchAccess?: {
    allowedActorIds?: string[];
    allowedRoleKeys?: string[];
    objectGrantRequiredRoleKeys?: string[];
    tenantId?: string;
    version?: string;
  };
  typeLabel?: string;
};

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

async function authHeadersForSearch(request: APIRequestContext, email: string) {
  const startResponse = await request.post("/api/auth/provider-login", {
    data: { email, providerId: "db-user-jwt" },
  });
  const startBody = await startResponse.json();

  expect(startResponse.ok(), JSON.stringify(startBody)).toBe(true);

  const mfaResponse = await request.post("/api/auth/mfa/verify", {
    data: { code: "123456", email, providerId: "db-user-jwt" },
  });
  const mfaBody = await mfaResponse.json();

  expect(mfaResponse.ok(), JSON.stringify(mfaBody)).toBe(true);
  expect(mfaBody.jwt).toBeTruthy();

  return { cookie: `${authJwtCookieName}=${mfaBody.jwt as string}` };
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

    const restrictedFamilySearchRoles = allowedSearchRoleKeysForIndexedObject({
      objectType: ObjectType.FAMILY_MEMBER,
      sensitivity: Sensitivity.RESTRICTED,
      visibilityScope: "CLIENT_SAFE",
    });
    expect(restrictedFamilySearchRoles).toEqual(expect.arrayContaining(["analyst", "family_cfo", "principal"]));
    expect(restrictedFamilySearchRoles).not.toEqual(expect.arrayContaining(["external_advisor", "next_gen", "trustee"]));
    expect(buildSearchAccessMetadata({
      allowedActorIds: [],
      allowedRoleKeys: restrictedFamilySearchRoles,
      clientTenantId: bennettTenant!.id,
      objectType: ObjectType.FAMILY_MEMBER,
      visibilityScope: "CLIENT_SAFE",
    })).toMatchObject({
      allowedRoleKeys: [...restrictedFamilySearchRoles].sort(),
      objectGrantRequiredRoleKeys: [],
      version: "search_acl_v1",
    });

    const adminPolicy = resolveGlobalSearchAccessPolicy(
      createActorSession({ roleKey: "admin", tenantSlug: "bennett" }),
    );
    expect(adminPolicy.tenantIds).toEqual(actorTenants.map((tenant) => tenant.id));
    expect(adminPolicy.visibilityScopes).toEqual(["CLIENT_SAFE", "TENANT_INTERNAL", "PLATFORM_INTERNAL"]);
    expect(adminPolicy.objectTypes).toContain(ObjectType.POLICY);
  });

  test("keeps full-text ACL enforcement inside the search index query path", async () => {
    const searchSource = await import("node:fs/promises").then((fs) =>
      fs.readFile("lib/global-search-service.ts", "utf8"),
    );
    const indexes = await prisma.$queryRaw<Array<{ indexname: string; indexdef: string }>>`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND tablename = 'search_documents'
        AND indexname IN (
          'search_documents_fulltext_idx',
          'search_documents_acl_roles_idx',
          'search_documents_acl_object_grants_idx',
          'search_documents_acl_actors_idx',
          'search_documents_acl_prefilter_idx'
        )
      ORDER BY indexname
    `;

    const aclWhereCalls = searchSource.match(/searchIndexAclWhere\(/g) ?? [];

    expect(searchSource).toContain("function searchIndexAclWhere");
    expect(aclWhereCalls.length).toBe(3);
    expect(searchSource).toContain("searchIndexAclWhere(searchAccessPolicy)");
    expect(searchSource).toContain("searchIndexAclWhere(searchAccessPolicy, allowedObjectTypes)");
    expect(searchSource).toContain("\"metadataJson\"->'searchAccess'->'allowedActorIds'");
    expect(searchSource).toContain("\"metadataJson\"->'searchAccess'->'allowedRoleKeys'");

    expect(indexes.map((index) => index.indexname)).toEqual([
      "search_documents_acl_actors_idx",
      "search_documents_acl_object_grants_idx",
      "search_documents_acl_prefilter_idx",
      "search_documents_acl_roles_idx",
      "search_documents_fulltext_idx",
    ]);
    expect(indexes.find((index) => index.indexname === "search_documents_fulltext_idx")?.indexdef).toContain("USING gin");
    expect(indexes.find((index) => index.indexname === "search_documents_acl_roles_idx")?.indexdef).toContain("searchAccess");
    expect(indexes.find((index) => index.indexname === "search_documents_acl_actors_idx")?.indexdef).toContain("allowedActorIds");
  });

  test("keeps payload visibility restrictions inside object-id full-text index queries", async () => {
    await rebuildGlobalSearchIndex(prisma);

    const restrictedFamilyMember = await prisma.familyMember.findFirstOrThrow({
      include: { clientTenant: true },
      orderBy: { displayName: "asc" },
      where: {
        sensitivity: { in: [Sensitivity.RESTRICTED, Sensitivity.HIGHLY_RESTRICTED, Sensitivity.INTERNAL_ONLY] },
      },
    });
    const familyTenantSlug = actorTenants.find((tenant) => tenant.id === restrictedFamilyMember.clientTenantId)?.slug;

    expect(familyTenantSlug).toBeTruthy();

    const familyIndex = await prisma.searchDocument.findFirstOrThrow({
      where: {
        objectId: restrictedFamilyMember.id,
        objectType: ObjectType.FAMILY_MEMBER,
        visibilityScope: "CLIENT_SAFE",
      },
    });
    const familyMetadata = familyIndex.metadataJson as SearchDocumentMetadata;

    expect(familyMetadata.searchAccess?.allowedRoleKeys).not.toEqual(expect.arrayContaining(["next_gen", "trustee"]));

    const internalFamilyIds = await searchAccessibleObjectIdsByFullText(
      prisma,
      createActorSession({ roleKey: "analyst", tenantSlug: familyTenantSlug! }),
      restrictedFamilyMember.displayName,
      [ObjectType.FAMILY_MEMBER],
    );
    const limitedFamilyIds = await searchAccessibleObjectIdsByFullText(
      prisma,
      createActorSession({ roleKey: "next_gen", tenantSlug: familyTenantSlug! }),
      restrictedFamilyMember.displayName,
      [ObjectType.FAMILY_MEMBER],
    );

    expect(internalFamilyIds).toContain(restrictedFamilyMember.id);
    expect(limitedFamilyIds).not.toContain(restrictedFamilyMember.id);

    const restrictedEntity = await prisma.entity.findFirstOrThrow({
      include: { clientTenant: true },
      orderBy: { name: "asc" },
      where: {
        sensitivity: { in: [Sensitivity.RESTRICTED, Sensitivity.HIGHLY_RESTRICTED, Sensitivity.INTERNAL_ONLY] },
      },
    });
    const entityTenantSlug = actorTenants.find((tenant) => tenant.id === restrictedEntity.clientTenantId)?.slug;

    expect(entityTenantSlug).toBeTruthy();

    const entityIndex = await prisma.searchDocument.findFirstOrThrow({
      where: {
        objectId: restrictedEntity.id,
        objectType: ObjectType.ENTITY,
        visibilityScope: "CLIENT_SAFE",
      },
    });
    const entityMetadata = entityIndex.metadataJson as SearchDocumentMetadata;

    expect(entityMetadata.searchAccess?.allowedRoleKeys).not.toEqual(expect.arrayContaining(["next_gen", "trustee"]));

    const internalEntityIds = await searchAccessibleObjectIdsByFullText(
      prisma,
      createActorSession({ roleKey: "analyst", tenantSlug: entityTenantSlug! }),
      restrictedEntity.name,
      [ObjectType.ENTITY],
    );
    const limitedEntityIds = await searchAccessibleObjectIdsByFullText(
      prisma,
      createActorSession({ roleKey: "next_gen", tenantSlug: entityTenantSlug! }),
      restrictedEntity.name,
      [ObjectType.ENTITY],
    );

    expect(internalEntityIds).toContain(restrictedEntity.id);
    expect(limitedEntityIds).not.toContain(restrictedEntity.id);
  });

  test("links audit search results to object-specific workspaces instead of current aliases", async () => {
    const review = await prisma.complianceReview.findFirstOrThrow({
      orderBy: { updatedAt: "desc" },
      select: {
        clientTenantId: true,
        id: true,
        targetId: true,
      },
      where: {
        targetType: ObjectType.RECOMMENDATION,
      },
    });
    const auditId = stableId(`audit:global-search:compliance:${review.id}`);

    await prisma.auditEvent.upsert({
      create: {
        actorRoleKey: "compliance_officer",
        actorUserId: stableId("user:compliance"),
        clientTenantId: review.clientTenantId,
        eventType: "search.audit.route.contract",
        id: auditId,
        nextState: "ROUTED_TO_AUDIT_WORKSPACE",
        platformTenantId: stableId("platform:alphavest"),
        previousState: "AUDIT_RECORDED",
        reason: "Audit route contract uses the selected compliance review workspace.",
        result: AuditResult.SUCCESS,
        targetId: review.targetId,
        targetType: ObjectType.RECOMMENDATION,
      },
      update: {
        clientTenantId: review.clientTenantId,
        reason: "Audit route contract uses the selected compliance review workspace.",
        targetId: review.targetId,
        targetType: ObjectType.RECOMMENDATION,
      },
      where: { id: auditId },
    });

    await rebuildGlobalSearchIndex(prisma);

    const auditDocument = await prisma.searchDocument.findFirstOrThrow({
      select: { href: true },
      where: {
        objectId: auditId,
        objectType: ObjectType.AUDIT_EVENT,
      },
    });
    const auditDocuments = await prisma.searchDocument.findMany({
      select: { href: true },
      where: { objectType: ObjectType.AUDIT_EVENT },
    });

    expect(auditDocument.href).toBe(`/compliance/reviews/${review.id}/audit`);
    expect(auditDocuments.length).toBeGreaterThan(0);
    expect(auditDocuments.every((document) => !document.href.includes("/current/"))).toBe(true);
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
    const response = await request.get("/api/family-members", {
      headers: await authHeadersForSearch(request, "cfo.morgan@example.demo"),
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.safety.authority).toBe("db-user-jwt");
    expect(body.safety.scoped).toBe(true);
    expect(body.familyMembers.length).toBeGreaterThan(0);
    expect(body.familyMembers.every((row: { id?: string; name?: string; relationship?: string }) => row.id && row.name && row.relationship)).toBe(true);
  });

  test("family member API derives scope from JWT and rejects missing auth", async ({ request }) => {
    const missingAuth = await request.get("/api/family-members?tenantSlug=morgan&roleKey=family_cfo&pageSize=1");
    const missingAuthBody = await missingAuth.json();

    expect(missingAuth.status(), JSON.stringify(missingAuthBody)).toBe(401);
    expect(missingAuthBody.ok).toBe(false);
    expect(missingAuthBody.safety.hiddenRowsDisclosed).toBe(false);

    const headers = await authHeadersForSearch(request, "cfo.bennett@example.demo");
    const scopedResponse = await request.get("/api/family-members?tenantSlug=morgan&roleKey=next_gen&pageSize=25", {
      headers,
    });
    const scopedBody = await scopedResponse.json();

    expect(scopedResponse.ok(), JSON.stringify(scopedBody)).toBe(true);
    expect(scopedBody.safety).toMatchObject({
      authority: "db-user-jwt",
      roleKey: "family_cfo",
      tenantSlug: "bennett",
    });
    expect(JSON.stringify(scopedBody)).toContain("Bennett");
    expect(JSON.stringify(scopedBody)).not.toContain("Morgan");
  });

  test("returns DB-backed entity rows with no cross-tenant leakage", async ({ request }) => {
    const bennettResponse = await request.get("/api/entities", {
      headers: await authHeadersForSearch(request, "cfo.bennett@example.demo"),
    });
    const summitResponse = await request.get("/api/entities", {
      headers: await authHeadersForSearch(request, "cfo.summit@example.demo"),
    });
    const bennettBody = await bennettResponse.json();
    const summitBody = await summitResponse.json();

    expect(bennettResponse.ok(), JSON.stringify(bennettBody)).toBe(true);
    expect(summitResponse.ok(), JSON.stringify(summitBody)).toBe(true);
    expect(bennettBody.safety).toMatchObject({
      authority: "db-user-jwt",
      roleKey: "family_cfo",
      tenantSlug: "bennett",
    });
    expect(summitBody.safety).toMatchObject({
      authority: "db-user-jwt",
      roleKey: "family_cfo",
      tenantSlug: "summit",
    });
    expect(bennettBody.entities.length).toBeGreaterThan(0);
    expect(summitBody.entities.length).toBeGreaterThan(0);

    const bennettIds = new Set(bennettBody.entities.map((row: { id: string }) => row.id));
    const leakedSummitIds = summitBody.entities.filter((row: { id: string }) => bennettIds.has(row.id));

    expect(leakedSummitIds).toEqual([]);
  });

  test("returns tenant-scoped DB-backed entity detail and denies actor-tenant mismatch", async ({ request }) => {
    const bennettHeaders = await authHeadersForSearch(request, "cfo.bennett@example.demo");
    const detailResponse = await request.get("/api/entities?targetId=philanthropy-trust", {
      headers: bennettHeaders,
    });
    const detailBody = await detailResponse.json();

    expect(detailResponse.ok(), JSON.stringify(detailBody)).toBe(true);
    expect(detailBody.ok).toBe(true);
    expect(detailBody.safety).toMatchObject({
      authority: "db-user-jwt",
      roleKey: "family_cfo",
      tenantSlug: "bennett",
    });
    expect(detailBody.entity.sourceTruth).toBe("entity_db_readmodel");
    expect(detailBody.entity.name).toBe("Bennett Legacy Trust");
    expect(detailBody.entity.participants.length).toBeGreaterThan(0);
    expect(detailBody.entity.documents.length).toBeGreaterThan(0);
    expect(detailBody.entity.href).toBe("/entities/bennett-legacy-trust");
    expect(detailBody.meta.sourceTruth).toBe("backend_query_backed");
    expect(detailBody.safety.hiddenRowsDisclosed).toBe(false);

    const missingAuth = await request.get("/api/entities?tenantSlug=bennett&actorTenantSlug=summit&roleKey=compliance_officer&targetId=philanthropy-trust", {
      headers: { cookie: "" },
    });
    const missingAuthBody = await missingAuth.json();

    expect(missingAuth.status(), JSON.stringify(missingAuthBody)).toBe(401);
    expect(missingAuthBody.ok).toBe(false);
    expect(missingAuthBody.safety.hiddenRowsDisclosed).toBe(false);

    const spoofedResponse = await request.get("/api/entities?tenantSlug=summit&roleKey=compliance_officer&targetId=philanthropy-trust", {
      headers: bennettHeaders,
    });
    const spoofedBody = await spoofedResponse.json();

    expect(spoofedResponse.ok(), JSON.stringify(spoofedBody)).toBe(true);
    expect(spoofedBody.safety).toMatchObject({
      authority: "db-user-jwt",
      roleKey: "family_cfo",
      tenantSlug: "bennett",
    });
    expect(spoofedBody.entity.name).toBe("Bennett Legacy Trust");
  });

  test("returns tenant-scoped DB-backed relationship rows with backend pagination", async ({ request }) => {
    await request.post("/api/data-maintenance/actions", {
      data: {
        actionId: "j09.addRelationship",
        roleKey: "principal",
        tenantSlug: "bennett",
      },
    });

    const cfoBennettHeaders = await authHeadersForSearch(request, "cfo.bennett@example.demo");
    const response = await request.get("/api/relationships?pageSize=1&sortKey=from", {
      headers: cfoBennettHeaders,
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.safety).toMatchObject({
      authority: "db-user-jwt",
      roleKey: "family_cfo",
      tenantSlug: "bennett",
    });
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

    const queryResponse = await request.get("/api/relationships?q=Principal", {
      headers: cfoBennettHeaders,
    });
    const queryBody = await queryResponse.json();

    expect(queryResponse.ok(), JSON.stringify(queryBody)).toBe(true);
    expect(queryBody.relationships.some((row: { from: string; to: string }) => `${row.from} ${row.to}`.includes("Principal"))).toBe(true);

    const relationshipId = queryBody.relationships.find((row: { from: string; id: string; to: string }) =>
      `${row.from} ${row.to}`.includes("Principal"),
    )?.id;
    expect(relationshipId).toBeTruthy();

    const relationshipIndex = await prisma.searchDocument.findFirstOrThrow({
      where: {
        objectId: relationshipId,
        objectType: ObjectType.RELATIONSHIP,
        visibilityScope: "CLIENT_SAFE",
      },
    });
    const relationshipMetadata = relationshipIndex.metadataJson as SearchDocumentMetadata;

    await prisma.searchDocument.update({
      data: {
        metadataJson: {
          ...relationshipMetadata,
          searchAccess: {
            ...(relationshipMetadata.searchAccess ?? {}),
            allowedRoleKeys: [],
          },
        },
      },
      where: { id: relationshipIndex.id },
    });

    const tamperedRelationshipIndexResponse = await request.get("/api/relationships?q=Principal", {
      headers: cfoBennettHeaders,
    });
    const tamperedRelationshipIndexBody = await tamperedRelationshipIndexResponse.json();

    expect(tamperedRelationshipIndexResponse.ok(), JSON.stringify(tamperedRelationshipIndexBody)).toBe(true);
    expect(tamperedRelationshipIndexBody.relationships.some((row: { id: string }) => row.id === relationshipId)).toBe(false);

    await prisma.searchDocument.update({
      data: { metadataJson: relationshipMetadata },
      where: { id: relationshipIndex.id },
    });

    const missingAuth = await request.get("/api/relationships?tenantSlug=bennett&actorTenantSlug=summit&roleKey=family_cfo", {
      headers: { cookie: "" },
    });
    const missingAuthBody = await missingAuth.json();

    expect(missingAuth.status(), JSON.stringify(missingAuthBody)).toBe(401);
    expect(missingAuthBody.relationships).toEqual([]);
    expect(missingAuthBody.safety.hiddenRowsDisclosed).toBe(false);

    const spoofedResponse = await request.get("/api/relationships?tenantSlug=morgan&roleKey=next_gen&q=Principal", {
      headers: cfoBennettHeaders,
    });
    const spoofedBody = await spoofedResponse.json();

    expect(spoofedResponse.ok(), JSON.stringify(spoofedBody)).toBe(true);
    expect(spoofedBody.safety).toMatchObject({
      authority: "db-user-jwt",
      roleKey: "family_cfo",
      tenantSlug: "bennett",
    });
    expect(JSON.stringify(spoofedBody)).toContain("Bennett");
    expect(JSON.stringify(spoofedBody)).not.toContain("Morgan");
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
    const cfoBennettHeaders = await authHeadersForSearch(request, "cfo.bennett@example.demo");
    const response = await request.get("/api/client-work-items?tenantSlug=morgan&roleKey=next_gen", {
      headers: cfoBennettHeaders,
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.sourceTruth).toBe("workflow_db_readmodel");
    expect(body.safety).toMatchObject({
      authority: "db-user-jwt",
      roleKey: "family_cfo",
      tenantSlug: "bennett",
    });
    expect(body.safety.scoped).toBe(true);
    expect(body.safety.hiddenRowsDisclosed).toBe(false);
    expect(body.safety.noClientRelease).toBe(true);
    expect(body.openWork.length).toBeGreaterThan(0);
    expect(body.openWork.every((row: { href?: string; id?: string; label?: string; meta?: string; status?: string }) =>
      row.id && row.label && row.meta && row.status && row.href?.startsWith("/"),
    )).toBe(true);
    expect(JSON.stringify(body)).not.toContain("blocked-release");
    expect(JSON.stringify(body)).not.toContain("Resolve release gate");

    const missingAuth = await request.get("/api/client-work-items?tenantSlug=bennett&roleKey=family_cfo", {
      headers: { cookie: "" },
    });
    const missingAuthBody = await missingAuth.json();

    expect(missingAuth.status(), JSON.stringify(missingAuthBody)).toBe(401);
    expect(missingAuthBody.openWork).toEqual([]);
    expect(missingAuthBody.activities).toEqual([]);
    expect(missingAuthBody.safety.hiddenRowsDisclosed).toBe(false);
  });

  test("rejects invalid table scopes fail-closed", async ({ request }) => {
    const response = await request.get("/api/entities?tenantSlug=main&roleKey=compliance_officer", {
      headers: { cookie: "" },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(401);
    expect(body.ok).toBe(false);
    expect(body.entities).toEqual([]);
    expect(body.safety.hiddenRowsDisclosed).toBe(false);
  });

  test("saves and reloads the DB-backed client profile form", async ({ request }) => {
    const cfoBennettHeaders = await authHeadersForSearch(request, "cfo.bennett@example.demo");
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
      headers: cfoBennettHeaders,
    });
    const saveBody = await saveResponse.json();

    expect(saveResponse.ok(), JSON.stringify(saveBody)).toBe(true);
    expect(saveBody.ok).toBe(true);
    expect(saveBody.result.mutated).toBe(true);
    expect(saveBody.result.profile.firstName).toBe(firstName);
    expect(saveBody.safety).toMatchObject({
      authority: "db-user-jwt",
      scoped: true,
    });
    expect(saveBody.searchIndex.sourceTruth).toBe("full_text_search_index");

    const reloadResponse = await request.get("/api/profile?tenantSlug=morgan&roleKey=next_gen", {
      headers: cfoBennettHeaders,
    });
    const reloadBody = await reloadResponse.json();

    expect(reloadResponse.ok(), JSON.stringify(reloadBody)).toBe(true);
    expect(reloadBody.safety).toMatchObject({
      authority: "db-user-jwt",
      roleKey: "family_cfo",
      tenantSlug: "bennett",
    });
    expect(reloadBody.profile.firstName).toBe(firstName);

    const searchResponse = await request.get(`/api/global-search?q=${encodeURIComponent(firstName)}`, {
      headers: await authHeadersForSearch(request, "cfo.bennett@example.demo"),
    });
    const searchBody = await searchResponse.json();

    expect(searchResponse.ok(), JSON.stringify(searchBody)).toBe(true);
    expect(searchBody.results.some((row: { label: string; type: string }) => row.label.includes(firstName) && row.type === "Profile")).toBe(true);
  });

  test("rejects invalid or unauthorized profile edits without mutation success", async ({ request }) => {
    const cfoBennettHeaders = await authHeadersForSearch(request, "cfo.bennett@example.demo");
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
      headers: cfoBennettHeaders,
    });
    const invalidBody = await invalidResponse.json();

    expect(invalidResponse.status(), JSON.stringify(invalidBody)).toBe(400);
    expect(invalidBody.ok).toBe(false);
    expect(invalidBody.mutated).toBe(false);
    expect(invalidBody.issues).toContain("first_name_required");

    const missingAuthResponse = await request.patch("/api/profile", {
      data: {
        action: "save_draft",
        countryOfResidence: "South Africa",
        firstName: "Missing",
        lastName: "Auth",
        relationshipLabel: "Principal",
        roleKey: "family_cfo",
        tenantSlug: "bennett",
      },
      headers: { cookie: "" },
    });
    const missingAuthBody = await missingAuthResponse.json();

    expect(missingAuthResponse.status(), JSON.stringify(missingAuthBody)).toBe(401);
    expect(missingAuthBody.ok).toBe(false);
    expect(missingAuthBody.mutated).toBe(false);
    expect(missingAuthBody.safety.hiddenRowsDisclosed).toBe(false);

    const deniedResponse = await request.patch("/api/profile", {
      data: {
        action: "save_draft",
        countryOfResidence: "South Africa",
        firstName: "Denied",
        lastName: "Next Gen",
        relationshipLabel: "Next Gen",
        roleKey: "family_cfo",
        tenantSlug: "bennett",
      },
      headers: await authHeadersForSearch(request, "nextgen.bennett@example.demo"),
    });
    const deniedBody = await deniedResponse.json();

    expect(deniedResponse.status(), JSON.stringify(deniedBody)).toBe(403);
    expect(deniedBody.ok).toBe(false);
    expect(deniedBody.mutated).toBe(false);
  });

  test("saves a family member row with RBAC and reload proof", async ({ request }) => {
    const familyCfoHeaders = await authHeadersForSearch(request, "cfo.morgan@example.demo");
    const listResponse = await request.get("/api/family-members", { headers: familyCfoHeaders });
    const listBody = await listResponse.json();
    const target = listBody.familyMembers.find((row: { relationship: string }) => row.relationship === "Spouse") ?? listBody.familyMembers[0];
    const nextName = `${target.name} DBTF`;
    const saveResponse = await request.patch("/api/family-members", {
      data: {
        displayName: nextName,
        id: target.id,
        relationshipType: target.relationship,
        taxResidency: target.taxResidency,
      },
      headers: familyCfoHeaders,
    });
    const saveBody = await saveResponse.json();

    expect(saveResponse.ok(), JSON.stringify(saveBody)).toBe(true);
    expect(saveBody.ok).toBe(true);
    expect(saveBody.result.mutated).toBe(true);

    const reloadResponse = await request.get("/api/family-members?q=DBTF", { headers: familyCfoHeaders });
    const reloadBody = await reloadResponse.json();

    expect(reloadResponse.ok(), JSON.stringify(reloadBody)).toBe(true);
    expect(reloadBody.familyMembers.some((row: { name: string }) => row.name === nextName)).toBe(true);

    const familyIndex = await prisma.searchDocument.findFirstOrThrow({
      where: {
        objectId: target.id,
        objectType: ObjectType.FAMILY_MEMBER,
        visibilityScope: "CLIENT_SAFE",
      },
    });
    const familyMetadata = familyIndex.metadataJson as SearchDocumentMetadata;

    await prisma.searchDocument.update({
      data: {
        metadataJson: {
          ...familyMetadata,
          searchAccess: {
            ...(familyMetadata.searchAccess ?? {}),
            allowedRoleKeys: [],
          },
        },
      },
      where: { id: familyIndex.id },
    });

    const tamperedIndexResponse = await request.get("/api/family-members?q=DBTF", { headers: familyCfoHeaders });
    const tamperedIndexBody = await tamperedIndexResponse.json();

    expect(tamperedIndexResponse.ok(), JSON.stringify(tamperedIndexBody)).toBe(true);
    expect(tamperedIndexBody.familyMembers.some((row: { id: string }) => row.id === target.id)).toBe(false);

    await prisma.searchDocument.update({
      data: { metadataJson: familyMetadata },
      where: { id: familyIndex.id },
    });
  });

  test("denies limited-role family row actions", async ({ request }) => {
    const listResponse = await request.get("/api/family-members", {
      headers: await authHeadersForSearch(request, "cfo.bennett@example.demo"),
    });
    const listBody = await listResponse.json();
    const target = listBody.familyMembers[0];
    const deniedResponse = await request.patch("/api/family-members", {
      data: {
        displayName: "Unauthorized Update",
        id: target.id,
        relationshipType: target.relationship,
        taxResidency: target.taxResidency,
      },
      headers: await authHeadersForSearch(request, "nextgen.bennett@example.demo"),
    });
    const deniedBody = await deniedResponse.json();

    expect(deniedResponse.status(), JSON.stringify(deniedBody)).toBe(403);
    expect(deniedBody.ok).toBe(false);
    expect(deniedBody.mutated).toBe(false);
  });

  test("validates and persists the DB-backed entity wizard lifecycle", async ({ request }) => {
    const summitHeaders = await authHeadersForSearch(request, "cfo.summit@example.demo");
    const invalidResponse = await request.post("/api/entities", {
      data: {
        action: "submit",
        entityType: "COMPANY",
        jurisdiction: "",
        name: "",
        roleKey: "family_cfo",
        tenantSlug: "summit",
      },
      headers: summitHeaders,
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
      headers: summitHeaders,
    });
    const submitBody = await submitResponse.json();

    expect(submitResponse.ok(), JSON.stringify(submitBody)).toBe(true);
    expect(submitBody.result.mutated).toBe(true);
    expect(submitBody.result.entity.name).toBe(entityName);
    expect(submitBody.searchIndex.sourceTruth).toBe("full_text_search_index");
    expect(submitBody.searchIndex.count).toBeGreaterThan(0);

    const listResponse = await request.get(`/api/entities?q=${encodeURIComponent(entityName)}`, {
      headers: summitHeaders,
    });
    const listBody = await listResponse.json();

    expect(listResponse.ok(), JSON.stringify(listBody)).toBe(true);
    expect(listBody.entities).toHaveLength(1);
    expect(listBody.entities[0].name).toBe(entityName);

    const entityIndex = await prisma.searchDocument.findFirstOrThrow({
      where: {
        objectId: submitBody.result.entity.id,
        objectType: ObjectType.ENTITY,
        visibilityScope: "CLIENT_SAFE",
      },
    });
    const entityMetadata = entityIndex.metadataJson as SearchDocumentMetadata;

    await prisma.searchDocument.update({
      data: {
        metadataJson: {
          ...entityMetadata,
          searchAccess: {
            ...(entityMetadata.searchAccess ?? {}),
            allowedRoleKeys: [],
          },
        },
      },
      where: { id: entityIndex.id },
    });

    const tamperedEntityIndexResponse = await request.get(`/api/entities?q=${encodeURIComponent(entityName)}`, {
      headers: summitHeaders,
    });
    const tamperedEntityIndexBody = await tamperedEntityIndexResponse.json();

    expect(tamperedEntityIndexResponse.ok(), JSON.stringify(tamperedEntityIndexBody)).toBe(true);
    expect(tamperedEntityIndexBody.entities).toEqual([]);

    await prisma.searchDocument.update({
      data: { metadataJson: entityMetadata },
      where: { id: entityIndex.id },
    });

    const searchResponse = await request.get(`/api/global-search?q=${encodeURIComponent(entityName)}`, {
      headers: await authHeadersForSearch(request, "cfo.summit@example.demo"),
    });
    const searchBody = await searchResponse.json();

    expect(searchResponse.ok(), JSON.stringify(searchBody)).toBe(true);
    expect(searchBody.sourceTruth).toBe("full_text_search_index");
    expect(searchBody.results.some((row: { label: string }) => row.label === entityName)).toBe(true);
  });

  test("derives dashboard metrics from tenant-scoped DB rows", async ({ request }) => {
    const cfoBennettHeaders = await authHeadersForSearch(request, "cfo.bennett@example.demo");
    const response = await request.get("/api/dashboard-metrics?tenantSlug=morgan&roleKey=next_gen", {
      headers: cfoBennettHeaders,
    });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.safety).toMatchObject({
      authority: "db-user-jwt",
      roleKey: "family_cfo",
      tenantSlug: "bennett",
    });
    expect(body.metrics.readiness).toBeGreaterThanOrEqual(0);
    expect(body.metrics.cards.some((card: { label: string; value: string }) => card.label === "Documents linked" && card.value.includes("/"))).toBe(true);
    expect(body.safety.noClientRelease).toBe(true);

    const missingAuth = await request.get("/api/dashboard-metrics?tenantSlug=bennett&roleKey=compliance_officer", {
      headers: { cookie: "" },
    });
    const missingAuthBody = await missingAuth.json();

    expect(missingAuth.status(), JSON.stringify(missingAuthBody)).toBe(401);
    expect(missingAuthBody.metrics).toBeNull();
    expect(missingAuthBody.safety.hiddenRowsDisclosed).toBe(false);
  });

  test("runs tenant-scoped global search without cross-tenant leakage", async ({ request }) => {
    const unauthenticatedResponse = await request.get("/api/global-search?q=Bennett", { headers: { cookie: "" } });
    const unauthenticatedBody = await unauthenticatedResponse.json();

    expect(unauthenticatedResponse.status(), JSON.stringify(unauthenticatedBody)).toBe(401);
    expect(unauthenticatedBody.results).toEqual([]);
    expect(unauthenticatedBody.safety.hiddenRowsDisclosed).toBe(false);

    const cfoBennettHeaders = await authHeadersForSearch(request, "cfo.bennett@example.demo");
    const externalBennettHeaders = await authHeadersForSearch(request, "external.bennett@example.demo");
    const externalNorthbridgeHeaders = await authHeadersForSearch(request, "external.northbridge@example.demo");
    const response = await request.get("/api/global-search?q=Bennett", { headers: cfoBennettHeaders });
    const body = await response.json();

    expect(response.ok(), JSON.stringify(body)).toBe(true);
    expect(body.ok).toBe(true);
    expect(body.safety.scoped).toBe(true);
    expect(body.results.length).toBeGreaterThan(0);
    expect(body.results.every((row: { label: string; description: string }) => `${row.label} ${row.description}`.toLowerCase().includes("bennett"))).toBe(true);
    expect(body.results.every((row: { href: string }) => row.href.startsWith("/") && !row.href.includes(":"))).toBe(true);

    const hiddenInternalResponse = await request.get("/api/global-search?q=internal%20advisor", { headers: cfoBennettHeaders });
    const hiddenInternalBody = await hiddenInternalResponse.json();

    expect(hiddenInternalResponse.ok(), JSON.stringify(hiddenInternalBody)).toBe(true);
    expect(hiddenInternalBody.sourceTruth).toBe("full_text_search_index");
    expect(hiddenInternalBody.results).toEqual([]);
    expect(hiddenInternalBody.safety.hiddenRowsDisclosed).toBe(false);

    const externalAdvisorInternalResponse = await request.get("/api/global-search?q=internal%20advisor", { headers: externalBennettHeaders });
    const externalAdvisorInternalBody = await externalAdvisorInternalResponse.json();

    expect(externalAdvisorInternalResponse.ok(), JSON.stringify(externalAdvisorInternalBody)).toBe(true);
    expect(externalAdvisorInternalBody.sourceTruth).toBe("full_text_search_index");
    expect(externalAdvisorInternalBody.results).toEqual([]);
    expect(externalAdvisorInternalBody.safety.hiddenRowsDisclosed).toBe(false);

    const externalAdvisorAssetResponse = await request.get("/api/global-search?q=asset", { headers: externalBennettHeaders });
    const externalAdvisorAssetBody = await externalAdvisorAssetResponse.json();

    expect(externalAdvisorAssetResponse.ok(), JSON.stringify(externalAdvisorAssetBody)).toBe(true);
    expect(externalAdvisorAssetBody.results.every((row: { type: string }) => row.type !== "Asset")).toBe(true);
    expect(externalAdvisorAssetBody.safety.hiddenRowsDisclosed).toBe(false);

    const externalAdvisorBeforeGrantResponse = await request.get("/api/global-search?q=statement", { headers: externalNorthbridgeHeaders });
    const externalAdvisorBeforeGrantBody = await externalAdvisorBeforeGrantResponse.json();

    expect(externalAdvisorBeforeGrantResponse.ok(), JSON.stringify(externalAdvisorBeforeGrantBody)).toBe(true);
    expect(externalAdvisorBeforeGrantBody.results).toEqual([]);

    const northbridgeStatementDocumentId = stableId("document:northbridge:statement");
    const externalAdvisorSession = createActorSession({ roleKey: "external_advisor", tenantSlug: "northbridge" });
    const externalAdvisorObjectIdsBeforeGrant = await searchAccessibleObjectIdsByFullText(
      prisma,
      externalAdvisorSession,
      "statement",
      [ObjectType.DOCUMENT],
    );

    expect(externalAdvisorObjectIdsBeforeGrant).not.toContain(northbridgeStatementDocumentId);

    const northbridgeExternalActorId = stableId("user:northbridge:external");
    const statementIndexBeforeGrant = await prisma.searchDocument.findFirstOrThrow({
      where: {
        objectId: northbridgeStatementDocumentId,
        objectType: ObjectType.DOCUMENT,
        visibilityScope: "TENANT_INTERNAL",
      },
    });
    const statementAccessBeforeGrant = (statementIndexBeforeGrant.metadataJson as {
      searchAccess?: {
        allowedActorIds?: string[];
        allowedRoleKeys?: string[];
        objectGrantRequiredRoleKeys?: string[];
        version?: string;
      };
    }).searchAccess;

    expect(statementAccessBeforeGrant).toMatchObject({
      allowedActorIds: [],
      allowedRoleKeys: expect.arrayContaining(["external_advisor"]),
      objectGrantRequiredRoleKeys: expect.arrayContaining(["external_advisor"]),
      version: "search_acl_v1",
    });

    const grantResponse = await request.post("/api/tenant-governance/actions", {
      data: { actionId: "j07.approveAccess", ...tenantGovernanceScopeForAction("j07.approveAccess") },
    });
    const grantBody = await grantResponse.json();

    expect(grantResponse.ok(), JSON.stringify(grantBody)).toBe(true);
    expect(grantBody.searchIndex.sourceTruth).toBe("full_text_search_index");

    const statementIndexAfterGrant = await prisma.searchDocument.findFirstOrThrow({
      where: {
        objectId: northbridgeStatementDocumentId,
        objectType: ObjectType.DOCUMENT,
        visibilityScope: "TENANT_INTERNAL",
      },
    });
    const statementMetadataAfterGrant = statementIndexAfterGrant.metadataJson as {
      nextActionLabel?: string;
      processLabel?: string;
      searchAccess?: {
        allowedActorIds?: string[];
        allowedRoleKeys?: string[];
        objectGrantRequiredRoleKeys?: string[];
        tenantId?: string;
        version?: string;
      };
      typeLabel?: string;
    };

    expect(statementMetadataAfterGrant.searchAccess?.allowedActorIds).toContain(northbridgeExternalActorId);

    const externalAdvisorAfterGrantResponse = await request.get("/api/global-search?q=statement", { headers: externalNorthbridgeHeaders });
    const externalAdvisorAfterGrantBody = await externalAdvisorAfterGrantResponse.json();

    expect(externalAdvisorAfterGrantResponse.ok(), JSON.stringify(externalAdvisorAfterGrantBody)).toBe(true);
    expect(externalAdvisorAfterGrantBody.results.some((row: { type: string }) => row.type === "Document")).toBe(true);
    expect(JSON.stringify(externalAdvisorAfterGrantBody.results)).toContain("Northbridge");
    expect(externalAdvisorAfterGrantBody.safety.hiddenRowsDisclosed).toBe(false);

    const externalAdvisorObjectIdsAfterGrant = await searchAccessibleObjectIdsByFullText(
      prisma,
      externalAdvisorSession,
      "statement",
      [ObjectType.DOCUMENT],
    );

    expect(externalAdvisorObjectIdsAfterGrant).toContain(northbridgeStatementDocumentId);

    await prisma.searchDocument.update({
      data: {
        metadataJson: {
          ...statementMetadataAfterGrant,
          searchAccess: {
            ...statementMetadataAfterGrant.searchAccess,
            allowedRoleKeys: [],
          },
        },
      },
      where: { id: statementIndexAfterGrant.id },
    });

    const externalAdvisorTamperedIndexResponse = await request.get("/api/global-search?q=statement", { headers: externalNorthbridgeHeaders });
    const externalAdvisorTamperedIndexBody = await externalAdvisorTamperedIndexResponse.json();

    expect(externalAdvisorTamperedIndexResponse.ok(), JSON.stringify(externalAdvisorTamperedIndexBody)).toBe(true);
    expect(externalAdvisorTamperedIndexBody.results).toEqual([]);

    const externalAdvisorObjectIdsAfterTamper = await searchAccessibleObjectIdsByFullText(
      prisma,
      externalAdvisorSession,
      "statement",
      [ObjectType.DOCUMENT],
    );

    expect(externalAdvisorObjectIdsAfterTamper).not.toContain(northbridgeStatementDocumentId);

    await prisma.searchDocument.update({
      data: { metadataJson: statementMetadataAfterGrant },
      where: { id: statementIndexAfterGrant.id },
    });

    const relationshipResponse = await request.post("/api/data-maintenance/actions", {
      data: {
        actionId: "j09.addRelationship",
        roleKey: "principal",
        tenantSlug: "bennett",
      },
    });
    const relationshipBody = await relationshipResponse.json();

    expect(relationshipResponse.ok(), JSON.stringify(relationshipBody)).toBe(true);
    expect(relationshipBody.searchIndex.sourceTruth).toBe("full_text_search_index");

    const relationshipSearchResponse = await request.get("/api/global-search?q=parent%20child%20governance", { headers: cfoBennettHeaders });
    const relationshipSearchBody = await relationshipSearchResponse.json();

    expect(relationshipSearchResponse.ok(), JSON.stringify(relationshipSearchBody)).toBe(true);
    expect(relationshipSearchBody.results.some((row: { type: string }) => row.type === "Relationship")).toBe(true);

    const invalidResponse = await request.get("/api/global-search?tenantSlug=unknown&roleKey=family_cfo&q=Bennett");
    const invalidBody = await invalidResponse.json();

    expect(invalidResponse.status(), JSON.stringify(invalidBody)).toBe(400);
    expect(invalidBody.results).toEqual([]);
    expect(invalidBody.safety.hiddenRowsDisclosed).toBe(false);

    const invalidTenantResponse = await request.get("/api/global-search?tenantSlug=unknown&q=Bennett", { headers: cfoBennettHeaders });
    const invalidTenantBody = await invalidTenantResponse.json();

    expect(invalidTenantResponse.status(), JSON.stringify(invalidTenantBody)).toBe(400);
    expect(invalidTenantBody.results).toEqual([]);
    expect(invalidTenantBody.safety.hiddenRowsDisclosed).toBe(false);

    const spoofedTenantResponse = await request.get("/api/global-search?tenantSlug=summit&q=Bennett", { headers: cfoBennettHeaders });
    const spoofedTenantBody = await spoofedTenantResponse.json();

    expect(spoofedTenantResponse.status(), JSON.stringify(spoofedTenantBody)).toBe(403);
    expect(spoofedTenantBody.results).toEqual([]);
    expect(spoofedTenantBody.safety.hiddenRowsDisclosed).toBe(false);
  });

  test("searches workflow-backed business objects without leaking internal process hits to client roles", async ({ request }) => {
    const analystHeaders = await authHeadersForSearch(request, "mira.analyst@alphavest.demo");
    const cfoMorganHeaders = await authHeadersForSearch(request, "cfo.morgan@example.demo");
    const internalProcessResponse = await request.get("/api/global-search?tenantSlug=morgan&roleKey=analyst&q=work", { headers: analystHeaders });
    const internalProcessBody = await internalProcessResponse.json();

    expect(internalProcessResponse.ok(), JSON.stringify(internalProcessBody)).toBe(true);
    expect(internalProcessBody.sourceTruth).toBe("full_text_search_index");
    expect(internalProcessBody.results.some((row: { type: string }) => row.type === "Work item")).toBe(true);
    expect(internalProcessBody.results.every((row: { href: string }) => row.href.startsWith("/") && !row.href.includes(":"))).toBe(true);
    expect(internalProcessBody.results.some((row: { nextActionLabel?: string; processLabel?: string }) => row.nextActionLabel && row.processLabel)).toBe(true);
    expect(JSON.stringify(internalProcessBody.results)).not.toMatch(/BP-\d+|PROCESS_DEFERRED_BY_MATRIX/);

    const clientProcessResponse = await request.get("/api/global-search?q=work", { headers: cfoMorganHeaders });
    const clientProcessBody = await clientProcessResponse.json();

    expect(clientProcessResponse.ok(), JSON.stringify(clientProcessBody)).toBe(true);
    expect(clientProcessBody.results.every((row: { type: string }) => row.type !== "Process")).toBe(true);
    expect(clientProcessBody.safety.hiddenRowsDisclosed).toBe(false);

    const internalEvidenceResponse = await request.get("/api/global-search?tenantSlug=morgan&roleKey=analyst&q=evidence", { headers: analystHeaders });
    const internalEvidenceBody = await internalEvidenceResponse.json();

    expect(internalEvidenceResponse.ok(), JSON.stringify(internalEvidenceBody)).toBe(true);
    expect(internalEvidenceBody.results.some((row: { type: string }) => row.type === "Evidence")).toBe(true);
    expect(internalEvidenceBody.results.some((row: { nextActionLabel?: string }) => row.nextActionLabel?.startsWith("Open "))).toBe(true);

    const assetResponse = await request.get("/api/global-search?q=asset", { headers: cfoMorganHeaders });
    const assetBody = await assetResponse.json();

    expect(assetResponse.ok(), JSON.stringify(assetBody)).toBe(true);
    expect(assetBody.results.some((row: { type: string }) => row.type === "Asset")).toBe(true);
  });

  test("surfaces J06 tenant wizard mutations in the admin tenant snapshot", async ({ request }) => {
    const mutationResponse = await request.post("/api/tenant-governance/actions", {
      data: { actionId: "j06.continueTenant", ...tenantGovernanceScopeForAction("j06.continueTenant") },
    });
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
