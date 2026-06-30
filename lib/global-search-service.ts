import { ObjectType, Prisma, type PrismaClient } from "@prisma/client";

import { actorRoles, actorTenants, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { stableId } from "@/lib/stable-id";

export type GlobalSearchResult = {
  description: string;
  href: string;
  id: string;
  label: string;
  status: string;
  type: string;
};

type SearchIndexInput = {
  clientTenantId: string | null;
  content: Array<string | null | undefined>;
  href: string;
  objectId: string;
  objectType: ObjectType;
  processInstanceId?: string | null;
  source?: string;
  status: string;
  summary: string;
  title: string;
  typeLabel: string;
  visibilityScope: SearchVisibilityScope;
};

type SearchVisibilityScope = "CLIENT_SAFE" | "PLATFORM_INTERNAL" | "TENANT_INTERNAL";

const maxQueryLength = 80;

export function normalizeGlobalSearchQuery(value: string | null | undefined) {
  return (value ?? "").trim().slice(0, maxQueryLength);
}

function compact(values: Array<string | null | undefined>) {
  return values.map((value) => value?.trim()).filter((value): value is string => Boolean(value));
}

function tenantSlugForId(id: string | null | undefined) {
  return actorTenants.find((tenant) => tenant.id === id)?.slug;
}

function roleFor(roleKey: ActorRoleKey) {
  return actorRoles.find((item) => item.key === roleKey);
}

function roleCanSearchPlatform(roleKey: ActorRoleKey) {
  return roleFor(roleKey)?.scope === "PLATFORM";
}

function visibilityScopesFor(roleKey: ActorRoleKey): SearchVisibilityScope[] {
  const role = roleFor(roleKey);

  if (role?.scope === "PLATFORM") return ["CLIENT_SAFE", "TENANT_INTERNAL", "PLATFORM_INTERNAL"];
  if (role?.internal) return ["CLIENT_SAFE", "TENANT_INTERNAL"];

  return ["CLIENT_SAFE"];
}

function searchDocumentId(input: Pick<SearchIndexInput, "objectId" | "objectType" | "visibilityScope">) {
  return stableId(`search-document:${input.visibilityScope}:${input.objectType}:${input.objectId}`);
}

function toSearchDocument(input: SearchIndexInput): Prisma.SearchDocumentCreateManyInput {
  const content = compact([input.title, input.summary, input.status, input.typeLabel, ...input.content]).join("\n");

  return {
    clientTenantId: input.clientTenantId,
    content,
    href: input.href,
    id: searchDocumentId(input),
    indexedAt: new Date(),
    metadataJson: {
      typeLabel: input.typeLabel,
    },
    objectId: input.objectId,
    objectType: input.objectType,
    processInstanceId: input.processInstanceId ?? null,
    source: input.source ?? "search_index_rebuild",
    status: input.status,
    summary: input.summary,
    title: input.title,
    visibilityScope: input.visibilityScope,
  };
}

function tenantDescription(displayName: string, parts: Array<string | null | undefined>) {
  return compact([displayName, ...parts]).join(" / ");
}

export async function rebuildGlobalSearchIndex(prisma: PrismaClient) {
  const [
    tenants,
    documents,
    familyMembers,
    entities,
    recommendations,
    exportRequests,
    queueItems,
    dataQualityIssues,
    auditEvents,
    processLinks,
  ] = await Promise.all([
    prisma.clientTenant.findMany({
      orderBy: { displayName: "asc" },
      select: {
        displayName: true,
        id: true,
        jurisdiction: true,
        relationshipTier: true,
        riskRating: true,
        status: true,
      },
    }),
    prisma.document.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        clientVisible: true,
        documentType: true,
        fileName: true,
        id: true,
        sensitivity: true,
        status: true,
        title: true,
      },
    }),
    prisma.familyMember.findMany({
      orderBy: { displayName: "asc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        displayName: true,
        id: true,
        relationshipType: true,
        taxResidency: true,
      },
    }),
    prisma.entity.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        entityType: true,
        id: true,
        jurisdiction: true,
        name: true,
        riskRating: true,
        status: true,
      },
    }),
    prisma.recommendation.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        adviceClassification: true,
        clientSummaryDraft: true,
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        clientVisible: true,
        id: true,
        riskSummary: true,
        status: true,
        summaryInternal: true,
        title: true,
      },
    }),
    prisma.exportRequest.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        exportType: true,
        id: true,
        redactionProfile: true,
        status: true,
      },
    }),
    prisma.queueItem.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        assignedRoleKey: true,
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        id: true,
        priority: true,
        queueName: true,
        status: true,
        targetId: true,
        targetType: true,
      },
    }),
    prisma.dataQualityIssue.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        description: true,
        id: true,
        issueType: true,
        severity: true,
        status: true,
      },
    }),
    prisma.auditEvent.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        clientTenant: { select: { displayName: true } },
        clientTenantId: true,
        eventType: true,
        id: true,
        reason: true,
        result: true,
        targetType: true,
      },
      take: 200,
    }),
    prisma.processObjectLink.findMany({
      select: {
        objectId: true,
        objectType: true,
        processInstanceId: true,
      },
      where: {
        objectType: { in: [ObjectType.RECOMMENDATION, ObjectType.DECISION, ObjectType.EVIDENCE_RECORD] },
      },
    }),
  ]);

  const processInstanceByObject = new Map(
    processLinks.map((link) => [`${link.objectType}:${link.objectId}`, link.processInstanceId]),
  );
  const documentsToCreate: Prisma.SearchDocumentCreateManyInput[] = [];

  for (const tenant of tenants) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: tenant.id,
      content: [tenant.displayName, tenant.jurisdiction, tenant.relationshipTier, tenant.riskRating, String(tenant.status)],
      href: `/tenants/${tenantSlugForId(tenant.id) ?? "current"}/setup`,
      objectId: tenant.id,
      objectType: ObjectType.TENANT,
      status: String(tenant.status),
      summary: tenantDescription(tenant.displayName, [tenant.jurisdiction, tenant.relationshipTier]),
      title: tenant.displayName,
      typeLabel: "Tenant",
      visibilityScope: "CLIENT_SAFE",
    }));
  }

  for (const document of documents) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: document.clientTenantId,
      content: [document.clientTenant.displayName, document.documentType, document.fileName, String(document.sensitivity)],
      href: "/documents",
      objectId: document.id,
      objectType: ObjectType.DOCUMENT,
      status: String(document.status),
      summary: tenantDescription(document.clientTenant.displayName, [document.documentType, document.fileName]),
      title: document.title,
      typeLabel: "Document",
      visibilityScope: document.clientVisible ? "CLIENT_SAFE" : "TENANT_INTERNAL",
    }));
  }

  for (const member of familyMembers) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: member.clientTenantId,
      content: [member.clientTenant.displayName, member.displayName, member.relationshipType, member.taxResidency],
      href: "/client/family-members",
      objectId: member.id,
      objectType: ObjectType.FAMILY_MEMBER,
      status: member.relationshipType ?? "Family member",
      summary: tenantDescription(member.clientTenant.displayName, [member.relationshipType, member.taxResidency]),
      title: member.displayName,
      typeLabel: "Family",
      visibilityScope: "CLIENT_SAFE",
    }));
  }

  for (const entity of entities) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: entity.clientTenantId,
      content: [entity.clientTenant.displayName, entity.name, String(entity.entityType), entity.jurisdiction, entity.riskRating, entity.status],
      href: "/entities",
      objectId: entity.id,
      objectType: ObjectType.ENTITY,
      status: entity.status,
      summary: tenantDescription(entity.clientTenant.displayName, [String(entity.entityType), entity.jurisdiction, entity.riskRating]),
      title: entity.name,
      typeLabel: "Entity",
      visibilityScope: "CLIENT_SAFE",
    }));
  }

  for (const recommendation of recommendations) {
    const clientSafe = recommendation.clientVisible;

    documentsToCreate.push(toSearchDocument({
      clientTenantId: recommendation.clientTenantId,
      content: [
        recommendation.clientTenant.displayName,
        recommendation.title,
        clientSafe ? recommendation.clientSummaryDraft : recommendation.summaryInternal,
        recommendation.riskSummary,
        String(recommendation.adviceClassification),
      ],
      href: clientSafe ? "/mobile" : `/advisor/reviews/${recommendation.id}`,
      objectId: recommendation.id,
      objectType: ObjectType.RECOMMENDATION,
      processInstanceId: processInstanceByObject.get(`${ObjectType.RECOMMENDATION}:${recommendation.id}`),
      status: String(recommendation.status),
      summary: tenantDescription(recommendation.clientTenant.displayName, [
        clientSafe ? recommendation.clientSummaryDraft : "Internal advisor/compliance review item",
        String(recommendation.adviceClassification),
      ]),
      title: recommendation.title,
      typeLabel: "Recommendation",
      visibilityScope: clientSafe ? "CLIENT_SAFE" : "TENANT_INTERNAL",
    }));
  }

  for (const request of exportRequests) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: request.clientTenantId,
      content: [request.clientTenant.displayName, String(request.exportType), request.redactionProfile, String(request.status), request.id],
      href: "/export/client-package/download",
      objectId: request.id,
      objectType: ObjectType.EXPORT_REQUEST,
      status: String(request.status),
      summary: tenantDescription(request.clientTenant.displayName, [String(request.exportType), request.redactionProfile]),
      title: `Export ${request.id.slice(0, 8)}`,
      typeLabel: "Export",
      visibilityScope: "TENANT_INTERNAL",
    }));
  }

  for (const item of queueItems) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: item.clientTenantId,
      content: [item.clientTenant.displayName, item.queueName, item.assignedRoleKey, item.priority, String(item.status)],
      href: "/ops",
      objectId: item.id,
      objectType: ObjectType.QUEUE_ITEM,
      status: String(item.status),
      summary: tenantDescription(item.clientTenant.displayName, [item.assignedRoleKey, item.priority]),
      title: item.queueName,
      typeLabel: "Ops",
      visibilityScope: "TENANT_INTERNAL",
    }));
  }

  for (const issue of dataQualityIssues) {
    documentsToCreate.push(toSearchDocument({
      clientTenantId: issue.clientTenantId,
      content: [issue.clientTenant.displayName, issue.issueType, issue.description, issue.severity, String(issue.status)],
      href: "/ops/sla/release-readiness",
      objectId: issue.id,
      objectType: ObjectType.DATA_QUALITY_ISSUE,
      status: `${issue.severity} / ${String(issue.status)}`,
      summary: tenantDescription(issue.clientTenant.displayName, [issue.description]),
      title: issue.issueType,
      typeLabel: "Data quality",
      visibilityScope: "TENANT_INTERNAL",
    }));
  }

  for (const event of auditEvents) {
    if (!event.clientTenantId) continue;

    documentsToCreate.push(toSearchDocument({
      clientTenantId: event.clientTenantId,
      content: [event.clientTenant?.displayName, event.eventType, event.reason, String(event.result), String(event.targetType)],
      href: "/compliance/reviews/current/audit",
      objectId: event.id,
      objectType: ObjectType.AUDIT_EVENT,
      status: String(event.result),
      summary: tenantDescription(event.clientTenant?.displayName ?? "Tenant audit", [event.reason, String(event.targetType)]),
      title: event.eventType,
      typeLabel: "Audit",
      visibilityScope: "TENANT_INTERNAL",
    }));
  }

  await prisma.$transaction([
    prisma.searchDocument.deleteMany(),
    prisma.searchDocument.createMany({
      data: documentsToCreate,
      skipDuplicates: true,
    }),
  ]);

  return {
    count: documentsToCreate.length,
    sourceTruth: "full_text_search_index" as const,
  };
}

export async function refreshGlobalSearchIndexAfterMutation(prisma: PrismaClient, reason: string) {
  const result = await rebuildGlobalSearchIndex(prisma);

  return {
    ...result,
    refreshedAt: new Date().toISOString(),
    refreshReason: reason,
  };
}

type SearchRow = {
  href: string;
  id: string;
  objectType: ObjectType;
  rank: number;
  status: string;
  summary: string;
  title: string;
  typeLabel: string | null;
};

export async function searchGlobalDb(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  query: string,
) {
  const tenant = actorTenants.find((item) => item.slug === tenantSlug);
  const normalizedQuery = normalizeGlobalSearchQuery(query);

  if (!tenant || normalizedQuery.length < 2) {
    return [];
  }

  if (await prisma.searchDocument.count() === 0) {
    await rebuildGlobalSearchIndex(prisma);
  }

  const tenantIds = roleCanSearchPlatform(roleKey) ? actorTenants.map((item) => item.id) : [tenant.id];
  const visibilityScopes = visibilityScopesFor(roleKey);
  const rows = await prisma.$queryRaw<SearchRow[]>`
    SELECT
      "id",
      "title",
      "summary",
      "href",
      "status",
      "objectType",
      "metadataJson"->>'typeLabel' AS "typeLabel",
      ts_rank(
        to_tsvector('english', coalesce("title", '') || ' ' || coalesce("summary", '') || ' ' || coalesce("content", '') || ' ' || coalesce("status", '')),
        websearch_to_tsquery('english', ${normalizedQuery})
      ) AS "rank"
    FROM "search_documents"
    WHERE
      "clientTenantId" IN (${Prisma.join(tenantIds)})
      AND "visibilityScope" IN (${Prisma.join(visibilityScopes)})
      AND to_tsvector('english', coalesce("title", '') || ' ' || coalesce("summary", '') || ' ' || coalesce("content", '') || ' ' || coalesce("status", ''))
        @@ websearch_to_tsquery('english', ${normalizedQuery})
    ORDER BY "rank" DESC, "updatedAt" DESC
    LIMIT 12
  `;

  return rows.map((row) => ({
    description: row.summary,
    href: row.href,
    id: row.id,
    label: row.title,
    status: row.status,
    type: row.typeLabel ?? row.objectType,
  }));
}
