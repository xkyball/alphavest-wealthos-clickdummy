import { DecisionStatus, type Prisma, type PrismaClient } from "@prisma/client";

import { requireActorSession, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import type { BackendDataSurfaceMeta, DataSurfaceQuery } from "@/lib/data-surface-query-contract";

export const decisionRecordSortKeys = ["reviewDate", "status", "title", "updatedAt"] as const;
export type DecisionRecordSortKey = (typeof decisionRecordSortKeys)[number];

export const decisionRecordStatusFilters = ["all", ...Object.values(DecisionStatus)] as const;
export type DecisionRecordStatusFilter = (typeof decisionRecordStatusFilters)[number];

export type DecisionRecordRow = {
  client: string;
  decisionAction: string | null;
  decisionAt: string | null;
  decisionReason: string | null;
  evidenceRecordId: string | null;
  href: string;
  id: string;
  participantCount: number;
  releasedToClientAt: string | null;
  reviewDate: string | null;
  status: string;
  title: string;
  updatedAt: string;
};

export type DecisionRecordPage = {
  meta: BackendDataSurfaceMeta<DecisionRecordSortKey>;
  rows: DecisionRecordRow[];
  sourceTruth: "decision_db_readmodel";
  tenantSlug: ActorTenantSlug;
};

export type DecisionRecordFilters = {
  status: DecisionRecordStatusFilter;
};

function labelFromValue(value: string | null | undefined, fallback = "Recorded") {
  if (!value) return fallback;
  if (value === "RELEASED_TO_CLIENT") return "Client ready";

  return value
    .toLowerCase()
    .split(/[._-]+|_/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function decisionWhere(input: {
  filters: DecisionRecordFilters;
  query: DataSurfaceQuery<DecisionRecordSortKey>;
  roleKey: ActorRoleKey;
  tenantSlug: ActorTenantSlug;
}) {
  const session = requireActorSession({ roleKey: input.roleKey, tenantSlug: input.tenantSlug });
  const where: Prisma.DecisionWhereInput = {
    clientTenantId: session.tenant.id,
    ...(session.role.internal ? {} : { releasedToClientAt: { not: null } }),
    ...(input.filters.status !== "all" ? { status: input.filters.status as DecisionStatus } : {}),
  };

  if (input.query.q) {
    where.OR = [
      { title: { contains: input.query.q, mode: "insensitive" } },
      { decisionAction: { contains: input.query.q, mode: "insensitive" } },
      { decisionReason: { contains: input.query.q, mode: "insensitive" } },
      { clientTenant: { displayName: { contains: input.query.q, mode: "insensitive" } } },
      { recommendation: { title: { contains: input.query.q, mode: "insensitive" } } },
    ];
  }

  return where;
}

function decisionOrderBy(query: DataSurfaceQuery<DecisionRecordSortKey>): Prisma.DecisionOrderByWithRelationInput[] {
  return [
    { [query.sortKey]: query.sortDirection },
    { updatedAt: "desc" },
  ];
}

function isoDate(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : null;
}

export async function listDecisionRecordPage(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  query: DataSurfaceQuery<DecisionRecordSortKey>,
  filters: DecisionRecordFilters,
): Promise<DecisionRecordPage> {
  const where = decisionWhere({ filters, query, roleKey, tenantSlug });
  const [totalRows, rows] = await Promise.all([
    prisma.decision.count({ where }),
    prisma.decision.findMany({
      include: {
        _count: { select: { participants: true } },
        clientTenant: { select: { displayName: true } },
      },
      orderBy: decisionOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      where,
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalRows / query.pageSize));

  return {
    meta: {
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1,
      page: query.page,
      pageSize: query.pageSize,
      query: query.q,
      returnedRows: rows.length,
      sortDirection: query.sortDirection,
      sortKey: query.sortKey,
      sourceTruth: "backend_query_backed",
      totalPages,
      totalRows,
    },
    rows: rows.map((row) => ({
      client: row.clientTenant.displayName,
      decisionAction: labelFromValue(row.decisionAction, "No client action yet"),
      decisionAt: isoDate(row.decisionAt),
      decisionReason: row.decisionReason,
      evidenceRecordId: row.evidenceRecordId,
      href: "/decisions/liquidity-governance",
      id: row.id,
      participantCount: row._count.participants,
      releasedToClientAt: isoDate(row.releasedToClientAt),
      reviewDate: isoDate(row.reviewDate),
      status: labelFromValue(row.status),
      title: row.title,
      updatedAt: isoDate(row.updatedAt) ?? "Current",
    })),
    sourceTruth: "decision_db_readmodel",
    tenantSlug,
  };
}
