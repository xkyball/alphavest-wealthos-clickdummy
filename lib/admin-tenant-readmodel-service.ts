import type { PrismaClient } from "@prisma/client";

import {
  paginateDataSurfaceRows,
  sortDataSurfaceRows,
  type BackendDataSurfaceMeta,
  type DataSurfaceQuery,
} from "@/lib/data-surface-query-contract";
import { demoPlatformTenantId } from "@/lib/demo-session";

export type AdminTenantSnapshot = Awaited<ReturnType<typeof getAdminTenantSnapshot>>;
export type AdminTenantRow = AdminTenantSnapshot["tenantRows"][number];
export type AdminTenantUserRow = AdminTenantSnapshot["userRows"][number];
export type AdminTenantSortKey = "activePolicies" | "activeUsers" | "jurisdiction" | "name" | "onboarding" | "owner" | "readiness" | "status" | "tier";
export type AdminTenantUserSortKey = "invite" | "name" | "role" | "scope" | "status";
export type AdminTenantRowsPage = {
  meta: BackendDataSurfaceMeta<AdminTenantSortKey>;
  tenantRows: AdminTenantRow[];
};
export type AdminTenantUserRowsPage = {
  meta: BackendDataSurfaceMeta<AdminTenantUserSortKey>;
  userRows: AdminTenantUserRow[];
};

function statusLabel(value: unknown) {
  return String(value)
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (match) => match.toUpperCase());
}

function percent(part: number, whole: number) {
  return whole === 0 ? 0 : Math.round((part / whole) * 100);
}

export async function getAdminTenantSnapshot(prisma: PrismaClient) {
  const [tenants, roles, userRoles, users, policies, latestTenantAudit] = await Promise.all([
    prisma.clientTenant.findMany({
      orderBy: { displayName: "asc" },
      select: {
        clientSuccessOwnerUserId: true,
        complianceOwnerUserId: true,
        displayName: true,
        id: true,
        jurisdiction: true,
        onboardingCompletedAt: true,
        primaryAdvisorUserId: true,
        primaryAnalystUserId: true,
        relationshipTier: true,
        status: true,
      },
      where: { platformTenantId: demoPlatformTenantId },
    }),
    prisma.role.findMany({
      orderBy: { name: "asc" },
      select: { clientTenantId: true, id: true, key: true, name: true, scope: true },
      where: { platformTenantId: demoPlatformTenantId },
    }),
    prisma.userRole.findMany({
      include: {
        role: { select: { key: true, name: true, scope: true } },
        user: { select: { displayName: true, email: true, status: true } },
      },
      orderBy: { updatedAt: "desc" },
      where: { role: { platformTenantId: demoPlatformTenantId } },
    }),
    prisma.user.findMany({
      select: { displayName: true, id: true, status: true },
      where: { platformTenantId: demoPlatformTenantId },
    }),
    prisma.policyDefinition.findMany({
      select: { clientTenantId: true, status: true },
      where: { OR: [{ platformTenantId: demoPlatformTenantId }, { clientTenant: { platformTenantId: demoPlatformTenantId } }] },
    }),
    prisma.auditEvent.findMany({
      orderBy: { createdAt: "desc" },
      select: { clientTenantId: true, eventType: true, reason: true, result: true },
      take: 12,
      where: {
        clientTenant: { platformTenantId: demoPlatformTenantId },
        eventType: {
          in: [
            "screencast.tenant.details_saved",
            "screencast.tenant.invitation",
            "tenant_governance.tenant.create_intent",
            "tenant_governance.tenant.details_saved",
            "tenant_governance.tenant.invitation_opened",
            "tenant_governance.tenant.invitation_sent",
            "tenant_governance.tenant.team_assigned",
            "p44.phase2.tenant_create.success",
            "auth.dummy.invitation.created",
          ],
        },
      },
    }),
  ]);

  const userNameById = new Map(users.map((user) => [user.id, user.displayName]));
  const roleCountByTenant = new Map<string, number>();
  const activeUserCountByTenant = new Map<string, number>();
  const policyCountByTenant = new Map<string, number>();

  for (const role of roles) {
    if (!role.clientTenantId) continue;
    roleCountByTenant.set(role.clientTenantId, (roleCountByTenant.get(role.clientTenantId) ?? 0) + 1);
  }

  for (const assignment of userRoles) {
    if (!assignment.clientTenantId || assignment.status !== "active") continue;
    activeUserCountByTenant.set(assignment.clientTenantId, (activeUserCountByTenant.get(assignment.clientTenantId) ?? 0) + 1);
  }

  for (const policy of policies) {
    if (!policy.clientTenantId || policy.status.toLowerCase() === "archived") continue;
    policyCountByTenant.set(policy.clientTenantId, (policyCountByTenant.get(policy.clientTenantId) ?? 0) + 1);
  }

  const tenantRows = tenants.map((tenant) => {
    const ownerId =
      tenant.clientSuccessOwnerUserId ?? tenant.primaryAdvisorUserId ?? tenant.complianceOwnerUserId ?? tenant.primaryAnalystUserId;
    const activeUsers = activeUserCountByTenant.get(tenant.id) ?? 0;
    const activePolicies = policyCountByTenant.get(tenant.id) ?? 0;
    const requiredSignals = [
      Boolean(tenant.jurisdiction),
      Boolean(tenant.relationshipTier),
      activeUsers > 0,
      activePolicies > 0,
      tenant.status === "ACTIVE" || tenant.status === "ONBOARDING",
    ];
    const completeSignals = requiredSignals.filter(Boolean).length;

    return {
      activePolicies,
      activeUsers,
      id: tenant.id,
      jurisdiction: tenant.jurisdiction ?? "Unassigned",
      name: tenant.displayName,
      onboarding: tenant.onboardingCompletedAt ? "Completed" : tenant.status === "DRAFT" ? "Draft" : "In progress",
      owner: ownerId ? userNameById.get(ownerId) ?? "Assigned owner" : "Unassigned",
      readiness: percent(completeSignals, requiredSignals.length),
      roleTemplates: roleCountByTenant.get(tenant.id) ?? 0,
      status: statusLabel(tenant.status),
      tier: tenant.relationshipTier ?? "Standard",
    };
  });

  const morganTenant = tenants.find((tenant) => tenant.id === "7870ddd4-4587-58c6-a30b-ed6710109c17") ?? tenants[0];
  const teamRows = userRoles
    .filter((assignment) => assignment.clientTenantId === morganTenant?.id)
    .slice(0, 8)
    .map((assignment) => ({
      assignee: assignment.user.displayName,
      capacity: assignment.status === "active" ? "Available" : statusLabel(assignment.status),
      id: assignment.id,
      role: assignment.role.name,
      status: statusLabel(assignment.status),
      workload: assignment.role.scope === "TENANT" ? "Tenant scoped" : statusLabel(assignment.role.scope),
    }));

  const userRows = userRoles
    .filter((assignment) => assignment.clientTenantId === morganTenant?.id)
    .slice(0, 12)
    .map((assignment) => ({
      id: assignment.id,
      invite: statusLabel(assignment.user.status),
      name: assignment.user.displayName,
      role: assignment.role.name,
      scope: assignment.role.scope === "TENANT" ? "Tenant workspace" : statusLabel(assignment.role.scope),
      status: statusLabel(assignment.status),
    }));

  const completed = tenantRows.filter((tenant) => tenant.onboarding === "Completed").length;
  const blocked = tenantRows.filter((tenant) => tenant.readiness < 60).length;

  return {
    auditProof: latestTenantAudit.map((event) => ({
      eventType: event.eventType,
      reason: event.reason ?? "",
      result: statusLabel(event.result),
    })),
    metrics: {
      active: tenantRows.filter((tenant) => tenant.status === "Active").length,
      blocked,
      completed,
      inProgress: tenantRows.length - completed,
      readiness: percent(tenantRows.reduce((sum, tenant) => sum + tenant.readiness, 0), tenantRows.length * 100),
      total: tenantRows.length,
    },
    setupChecklist: [
      { item: "Tenant details", owner: "Admin", readiness: morganTenant?.jurisdiction ? "Ready" : "Missing", status: morganTenant?.status ? statusLabel(morganTenant.status) : "Missing" },
      { item: "Team assignments", owner: "Client Success", readiness: teamRows.length > 0 ? "Ready" : "Missing", status: `${teamRows.length} assigned` },
      { item: "Policy profile", owner: "Compliance", readiness: (policyCountByTenant.get(morganTenant?.id ?? "") ?? 0) > 0 ? "Ready" : "Missing", status: `${policyCountByTenant.get(morganTenant?.id ?? "") ?? 0} policies` },
      { item: "Invitation audit", owner: "Admin", readiness: latestTenantAudit.some((event) => event.eventType.includes("invitation")) ? "Ready" : "Locked", status: "Audit checked" },
    ],
    teamRows,
    tenantRows,
    userRows,
  };
}

export async function listAdminTenantRowsPage(
  prisma: PrismaClient,
  query: DataSurfaceQuery<AdminTenantSortKey>,
  filters: { status?: string } = {},
): Promise<AdminTenantRowsPage> {
  const snapshot = await getAdminTenantSnapshot(prisma);
  const normalizedQuery = query.q.toLowerCase();
  const rows = snapshot.tenantRows.filter((row) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [row.name, row.jurisdiction, row.tier, row.owner, row.onboarding, row.status].some((value) =>
        String(value).toLowerCase().includes(normalizedQuery),
      );
    const matchesStatus = !filters.status || filters.status === "all" || row.status === filters.status;

    return matchesQuery && matchesStatus;
  });
  const sortedRows = sortDataSurfaceRows(rows, query, (row, sortKey) => row[sortKey]);
  const page = paginateDataSurfaceRows(sortedRows, query);

  return { meta: page.meta, tenantRows: page.rows };
}

export async function listAdminTenantUserRowsPage(
  prisma: PrismaClient,
  query: DataSurfaceQuery<AdminTenantUserSortKey>,
  filters: { status?: string } = {},
): Promise<AdminTenantUserRowsPage> {
  const snapshot = await getAdminTenantSnapshot(prisma);
  const normalizedQuery = query.q.toLowerCase();
  const rows = snapshot.userRows.filter((row) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [row.name, row.invite, row.role, row.scope, row.status].some((value) =>
        String(value).toLowerCase().includes(normalizedQuery),
      );
    const matchesStatus = !filters.status || filters.status === "all" || row.status === filters.status;

    return matchesQuery && matchesStatus;
  });
  const sortedRows = sortDataSurfaceRows(rows, query, (row, sortKey) => row[sortKey]);
  const page = paginateDataSurfaceRows(sortedRows, query);

  return { meta: page.meta, userRows: page.rows };
}
