import type { PrismaClient } from "@prisma/client";

import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";

export type GlobalSearchResult = {
  description: string;
  href: string;
  id: string;
  label: string;
  status: string;
  type: string;
};

type SearchableRow = GlobalSearchResult & {
  haystack: string[];
};

const maxQueryLength = 80;

export function normalizeGlobalSearchQuery(value: string | null | undefined) {
  return (value ?? "").trim().slice(0, maxQueryLength);
}

function includesQuery(row: SearchableRow, query: string) {
  const normalized = query.toLowerCase();

  return row.haystack.some((value) => value.toLowerCase().includes(normalized));
}

function roleCanSearchPlatform(roleKey: DemoRoleKey) {
  const role = demoRoles.find((item) => item.key === roleKey);

  return role?.scope === "PLATFORM";
}

export async function searchGlobalDb(
  prisma: PrismaClient,
  tenantSlug: DemoTenantSlug,
  roleKey: DemoRoleKey,
  query: string,
) {
  const tenant = demoTenants.find((item) => item.slug === tenantSlug);
  const normalizedQuery = normalizeGlobalSearchQuery(query);

  if (!tenant || normalizedQuery.length < 2) {
    return [];
  }

  const tenantIds = roleCanSearchPlatform(roleKey) ? demoTenants.map((item) => item.id) : [tenant.id];

  const [tenants, documents, familyMembers, entities, exportRequests, queueItems, dataQualityIssues, auditEvents] =
    await Promise.all([
      prisma.clientTenant.findMany({
        orderBy: { displayName: "asc" },
        select: {
          displayName: true,
          id: true,
          jurisdiction: true,
          relationshipTier: true,
          status: true,
        },
        take: 25,
        where: { id: { in: tenantIds } },
      }),
      prisma.document.findMany({
        orderBy: { updatedAt: "desc" },
        select: {
          documentType: true,
          fileName: true,
          id: true,
          status: true,
          title: true,
        },
        take: 50,
        where: { clientTenantId: { in: tenantIds } },
      }),
      prisma.familyMember.findMany({
        orderBy: { displayName: "asc" },
        select: {
          displayName: true,
          id: true,
          relationshipType: true,
          taxResidency: true,
        },
        take: 50,
        where: { clientTenantId: { in: tenantIds } },
      }),
      prisma.entity.findMany({
        orderBy: { updatedAt: "desc" },
        select: {
          entityType: true,
          id: true,
          jurisdiction: true,
          name: true,
          riskRating: true,
          status: true,
        },
        take: 50,
        where: { clientTenantId: { in: tenantIds } },
      }),
      prisma.exportRequest.findMany({
        orderBy: { updatedAt: "desc" },
        select: {
          exportType: true,
          id: true,
          redactionProfile: true,
          status: true,
        },
        take: 25,
        where: { clientTenantId: { in: tenantIds } },
      }),
      prisma.queueItem.findMany({
        orderBy: { updatedAt: "desc" },
        select: {
          assignedRoleKey: true,
          id: true,
          priority: true,
          queueName: true,
          status: true,
        },
        take: 50,
        where: { clientTenantId: { in: tenantIds } },
      }),
      prisma.dataQualityIssue.findMany({
        orderBy: { updatedAt: "desc" },
        select: {
          description: true,
          id: true,
          issueType: true,
          severity: true,
          status: true,
        },
        take: 40,
        where: { clientTenantId: { in: tenantIds } },
      }),
      prisma.auditEvent.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          eventType: true,
          id: true,
          reason: true,
          result: true,
          targetType: true,
        },
        take: 40,
        where: { clientTenantId: { in: tenantIds } },
      }),
    ]);

  const rows: SearchableRow[] = [
    ...tenants.map((row) => ({
      description: [row.jurisdiction, row.relationshipTier].filter(Boolean).join(" / ") || "Tenant workspace",
      haystack: [row.displayName, row.jurisdiction ?? "", row.relationshipTier ?? "", String(row.status)],
      href: "/tenants",
      id: `tenant-${row.id}`,
      label: row.displayName,
      status: String(row.status),
      type: "Tenant",
    })),
    ...documents.map((row) => ({
      description: [row.documentType, row.fileName].filter(Boolean).join(" / ") || "Document",
      haystack: [row.title, row.documentType, row.fileName ?? "", String(row.status)],
      href: "/documents",
      id: `document-${row.id}`,
      label: row.title,
      status: String(row.status),
      type: "Document",
    })),
    ...familyMembers.map((row) => ({
      description: [row.relationshipType, row.taxResidency].filter(Boolean).join(" / ") || "Family member",
      haystack: [row.displayName, row.relationshipType, row.taxResidency ?? ""],
      href: "/profile",
      id: `family-${row.id}`,
      label: row.displayName,
      status: row.relationshipType,
      type: "Family",
    })),
    ...entities.map((row) => ({
      description: [String(row.entityType), row.jurisdiction, row.riskRating].filter(Boolean).join(" / "),
      haystack: [row.name, String(row.entityType), row.jurisdiction ?? "", row.riskRating ?? "", row.status],
      href: "/structures/entities",
      id: `entity-${row.id}`,
      label: row.name,
      status: row.status,
      type: "Entity",
    })),
    ...exportRequests.map((row) => ({
      description: [String(row.exportType), row.redactionProfile].join(" / "),
      haystack: [String(row.exportType), row.redactionProfile, String(row.status), row.id],
      href: "/export/demo/download",
      id: `export-${row.id}`,
      label: `Export ${row.id.slice(0, 8)}`,
      status: String(row.status),
      type: "Export",
    })),
    ...queueItems.map((row) => ({
      description: [row.assignedRoleKey, row.priority].filter(Boolean).join(" / ") || "Queue item",
      haystack: [row.queueName, row.assignedRoleKey ?? "", row.priority, String(row.status), row.id],
      href: "/ops/queues",
      id: `queue-${row.id}`,
      label: row.queueName,
      status: String(row.status),
      type: "Ops",
    })),
    ...dataQualityIssues.map((row) => ({
      description: row.description,
      haystack: [row.issueType, row.description, row.severity, String(row.status)],
      href: "/ops/sla",
      id: `dq-${row.id}`,
      label: row.issueType,
      status: `${row.severity} / ${String(row.status)}`,
      type: "Data quality",
    })),
    ...auditEvents.map((row) => ({
      description: row.reason ?? String(row.targetType),
      haystack: [row.eventType, row.reason ?? "", String(row.result), String(row.targetType)],
      href: "/audit",
      id: `audit-${row.id}`,
      label: row.eventType,
      status: String(row.result),
      type: "Audit",
    })),
  ];

  return rows.filter((row) => includesQuery(row, normalizedQuery)).slice(0, 12).map((row) => ({
    description: row.description,
    href: row.href,
    id: row.id,
    label: row.label,
    status: row.status,
    type: row.type,
  }));
}
