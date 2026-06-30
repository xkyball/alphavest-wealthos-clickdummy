import { WorkflowStatus, type Prisma, type PrismaClient } from "@prisma/client";

import { requireActorSession, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import type { BackendDataSurfaceMeta, DataSurfaceQuery } from "@/lib/data-surface-query-contract";

export const actionBoardSortKeys = ["dueDate", "priority", "status", "title", "updatedAt"] as const;
export type ActionBoardSortKey = (typeof actionBoardSortKeys)[number];

export const actionBoardStatusFilters = ["all", ...Object.values(WorkflowStatus)] as const;
export type ActionBoardStatusFilter = (typeof actionBoardStatusFilters)[number];

export const actionBoardPriorityFilters = ["all", "critical", "high", "medium", "low"] as const;
export type ActionBoardPriorityFilter = (typeof actionBoardPriorityFilters)[number];

export type ActionBoardRow = {
  assignedRoleLabel: string;
  blockedReason: string | null;
  clientVisible: boolean;
  description: string;
  dueDate: string | null;
  evidenceStatus: string;
  href: string;
  id: string;
  priority: string;
  status: string;
  title: string;
  updatedAt: string;
};

export type ActionBoardPage = {
  meta: BackendDataSurfaceMeta<ActionBoardSortKey>;
  rows: ActionBoardRow[];
  sourceTruth: "workflow_db_readmodel";
  tenantSlug: ActorTenantSlug;
};

export type ActionBoardFilters = {
  priority: ActionBoardPriorityFilter;
  status: ActionBoardStatusFilter;
};

const clientVisibleStatuses = [
  WorkflowStatus.NEW,
  WorkflowStatus.IN_REVIEW,
  WorkflowStatus.AWAITING_INFO,
  WorkflowStatus.BLOCKED,
  WorkflowStatus.COMPLETED,
] as const;

function labelFromValue(value: string | null | undefined, fallback = "Unassigned") {
  if (!value) return fallback;

  return value
    .toLowerCase()
    .split(/[._-]+|_/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function hrefForAction(row: { evidenceStatus: string | null; title: string; triggerId: string | null }) {
  const title = row.title.toLowerCase();

  if (row.evidenceStatus || title.includes("evidence") || title.includes("document") || title.includes("certificate")) {
    return "/documents/upload";
  }

  if (title.includes("relationship")) return "/relationships";
  if (title.includes("entity") || title.includes("trust") || title.includes("holding")) return "/entities";
  if (title.includes("profile") || title.includes("family")) return "/client/family-members";
  if (row.triggerId) return "/advisory";

  return "/client/home";
}

function actionBoardWhere(input: {
  filters: ActionBoardFilters;
  query: DataSurfaceQuery<ActionBoardSortKey>;
  roleKey: ActorRoleKey;
  tenantSlug: ActorTenantSlug;
}) {
  const session = requireActorSession({ roleKey: input.roleKey, tenantSlug: input.tenantSlug });
  const where: Prisma.ActionItemWhereInput = {
    clientTenantId: session.tenant.id,
    ...(session.role.internal ? {} : { clientVisible: true, status: { in: [...clientVisibleStatuses] } }),
    ...(input.filters.status !== "all" ? { status: input.filters.status as WorkflowStatus } : {}),
    ...(input.filters.priority !== "all" ? { priority: input.filters.priority } : {}),
  };

  if (input.query.q) {
    where.OR = [
      { title: { contains: input.query.q, mode: "insensitive" } },
      { description: { contains: input.query.q, mode: "insensitive" } },
      { assignedRoleKey: { contains: input.query.q, mode: "insensitive" } },
      { blockedReason: { contains: input.query.q, mode: "insensitive" } },
    ];
  }

  return where;
}

function actionBoardOrderBy(query: DataSurfaceQuery<ActionBoardSortKey>): Prisma.ActionItemOrderByWithRelationInput[] {
  return [
    { [query.sortKey]: query.sortDirection },
    { updatedAt: "desc" },
  ];
}

export async function listActionBoardPage(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  query: DataSurfaceQuery<ActionBoardSortKey>,
  filters: ActionBoardFilters,
): Promise<ActionBoardPage> {
  const where = actionBoardWhere({ filters, query, roleKey, tenantSlug });
  const [totalRows, rows] = await Promise.all([
    prisma.actionItem.count({ where }),
    prisma.actionItem.findMany({
      orderBy: actionBoardOrderBy(query),
      select: {
        assignedRoleKey: true,
        blockedReason: true,
        clientVisible: true,
        description: true,
        dueDate: true,
        evidenceStatus: true,
        id: true,
        priority: true,
        status: true,
        title: true,
        triggerId: true,
        updatedAt: true,
      },
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
      assignedRoleLabel: labelFromValue(row.assignedRoleKey),
      blockedReason: row.blockedReason,
      clientVisible: row.clientVisible,
      description: row.description ?? "Tracked action item",
      dueDate: row.dueDate ? row.dueDate.toISOString().slice(0, 10) : null,
      evidenceStatus: labelFromValue(row.evidenceStatus, "Evidence pending"),
      href: hrefForAction(row),
      id: row.id,
      priority: labelFromValue(row.priority, "Medium"),
      status: labelFromValue(row.status),
      title: row.title,
      updatedAt: row.updatedAt.toISOString().slice(0, 10),
    })),
    sourceTruth: "workflow_db_readmodel",
    tenantSlug,
  };
}
