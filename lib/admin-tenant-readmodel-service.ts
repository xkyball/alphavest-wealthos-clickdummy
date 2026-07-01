import type { PrismaClient } from "@prisma/client";

import {
  paginateDataSurfaceRows,
  sortDataSurfaceRows,
  type BackendDataSurfaceMeta,
  type DataSurfaceQuery,
} from "@/lib/data-surface-query-contract";
import { actorPlatformTenantId } from "@/lib/actor-session";

export type AdminTenantSnapshot = Awaited<ReturnType<typeof getAdminTenantSnapshot>>;
export type AdminTenantRow = AdminTenantSnapshot["tenantRows"][number];
export type AdminTenantRoleRow = AdminTenantSnapshot["roleRows"][number];
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

const permissionMatrixColumns = [
  "Platform",
  "Tenant",
  "Users",
  "Evidence",
  "Advice",
  "Client release",
  "Export",
  "Audit",
] as const;

function permissionGroupForKey(permissionKey: string): (typeof permissionMatrixColumns)[number] | null {
  if (permissionKey.startsWith("platform.") || permissionKey.startsWith("roles.") || permissionKey.startsWith("access.")) {
    return "Platform";
  }

  if (permissionKey.startsWith("tenants.") || permissionKey.startsWith("process.")) {
    return "Tenant";
  }

  if (permissionKey.startsWith("users.")) {
    return "Users";
  }

  if (permissionKey.startsWith("documents.") || permissionKey.startsWith("evidence.")) {
    return "Evidence";
  }

  if (permissionKey.startsWith("recommendations.approve") || permissionKey.startsWith("triggers.")) {
    return "Advice";
  }

  if (permissionKey.startsWith("recommendations.release") || permissionKey.startsWith("decisions.")) {
    return "Client release";
  }

  if (permissionKey.startsWith("exports.")) {
    return "Export";
  }

  if (permissionKey.startsWith("audit.")) {
    return "Audit";
  }

  return null;
}

function permissionAccessForGroup(permissionKeys: string[], column: (typeof permissionMatrixColumns)[number]) {
  const groupPermissions = permissionKeys.filter((permissionKey) => permissionGroupForKey(permissionKey) === column);

  if (groupPermissions.length === 0) {
    return "none" as const;
  }

  if (groupPermissions.some((permissionKey) => permissionKey.endsWith(".manage") || permissionKey.endsWith(".release") || permissionKey.endsWith(".approve"))) {
    return "full" as const;
  }

  return "limited" as const;
}

function roleDescription(role: { description: string | null; name: string; scope: unknown }) {
  if (!role.description) {
    return `${statusLabel(role.scope)} role`;
  }

  return role.description
    .replace(/\s*demo role for AlphaVest WealthOS\.?$/i, " role")
    .replace(/^(.+?) role$/i, "$1 access role");
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
      where: { platformTenantId: actorPlatformTenantId },
    }),
    prisma.role.findMany({
      orderBy: { name: "asc" },
      select: {
        clientTenantId: true,
        description: true,
        id: true,
        isSystemRole: true,
        key: true,
        name: true,
        requiresSecondConfirmation: true,
        rolePermissions: {
          include: {
            permission: {
              select: {
                key: true,
                requiresAudit: true,
                requiresComplianceReview: true,
                requiresSecondConfirmation: true,
              },
            },
          },
          orderBy: { permission: { key: "asc" } },
        },
        scope: true,
        segregationGroup: true,
      },
      where: { platformTenantId: actorPlatformTenantId },
    }),
    prisma.userRole.findMany({
      include: {
        role: { select: { key: true, name: true, scope: true } },
        user: { select: { displayName: true, email: true, status: true } },
      },
      orderBy: { updatedAt: "desc" },
      where: { role: { platformTenantId: actorPlatformTenantId } },
    }),
    prisma.user.findMany({
      select: { displayName: true, id: true, status: true },
      where: { platformTenantId: actorPlatformTenantId },
    }),
    prisma.policyDefinition.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      select: {
        category: true,
        clientTenantId: true,
        createdAt: true,
        name: true,
        policyKey: true,
        status: true,
        updatedAt: true,
        version: true,
      },
      where: { OR: [{ platformTenantId: actorPlatformTenantId }, { clientTenant: { platformTenantId: actorPlatformTenantId } }] },
    }),
    prisma.auditEvent.findMany({
      orderBy: { createdAt: "desc" },
      select: { clientTenantId: true, eventType: true, reason: true, result: true },
      take: 12,
      where: {
        clientTenant: { platformTenantId: actorPlatformTenantId },
        eventType: {
          in: [
            "screencast.tenant.details_saved",
            "screencast.tenant.invitation",
            "tenant_governance.tenant.create_intent",
            "tenant_governance.tenant.details_saved",
            "tenant_governance.tenant.invitation_opened",
            "tenant_governance.tenant.invitation_sent",
            "tenant_governance.tenant.team_assigned",
            "operational.stage2.tenant_create.success",
            "auth.local.invitation.created",
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

  const roleRows = roles.map((role) => {
    const permissionKeys = role.rolePermissions.map((rolePermission) => rolePermission.permission.key);
    const auditPermissionCount = role.rolePermissions.filter((rolePermission) => rolePermission.permission.requiresAudit).length;
    const secondConfirmationCount = role.rolePermissions.filter((rolePermission) =>
      rolePermission.permission.requiresSecondConfirmation || role.requiresSecondConfirmation,
    ).length;
    const complianceReviewCount = role.rolePermissions.filter((rolePermission) => rolePermission.permission.requiresComplianceReview).length;
    const assignedUsers = userRoles.filter((assignment) => assignment.role.key === role.key && assignment.status === "active").length;

    return {
      assignedUsers,
      auditPermissionCount,
      complianceReviewCount,
      description: roleDescription(role),
      id: role.id,
      matrix: permissionMatrixColumns.map((column) => permissionAccessForGroup(permissionKeys, column)),
      name: role.name,
      permissionCount: permissionKeys.length,
      secondConfirmationCount,
      segregationGroup: role.segregationGroup ?? "standard",
      scope: statusLabel(role.scope),
      status: role.isSystemRole ? "Active" : "Custom",
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
      workload: assignment.role.scope === "TENANT" ? "Tenant workspace" : statusLabel(assignment.role.scope),
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
    meta: {
      sourceTruth: "admin_tenant_db_readmodel" as const,
      totalPolicies: policies.length,
      totalRoleAssignments: userRoles.length,
      totalRoles: roles.length,
      totalTenants: tenants.length,
      totalUsers: users.length,
    },
    permissionMatrixColumns,
    setupChecklist: [
      { item: "Tenant details", owner: "Admin", readiness: morganTenant?.jurisdiction ? "Ready" : "Missing", status: morganTenant?.status ? statusLabel(morganTenant.status) : "Missing" },
      { item: "Team assignments", owner: "Client Success", readiness: teamRows.length > 0 ? "Ready" : "Missing", status: `${teamRows.length} assigned` },
      { item: "Policy profile", owner: "Compliance", readiness: (policyCountByTenant.get(morganTenant?.id ?? "") ?? 0) > 0 ? "Ready" : "Missing", status: `${policyCountByTenant.get(morganTenant?.id ?? "") ?? 0} policies` },
      { item: "Invitation audit", owner: "Admin", readiness: latestTenantAudit.some((event) => event.eventType.includes("invitation")) ? "Ready" : "Locked", status: "Audit checked" },
    ],
    policyVersionRows: policies
      .filter((policy) => !policy.clientTenantId || policy.clientTenantId === morganTenant?.id)
      .slice(0, 6)
      .map((policy) => ({
        category: policy.category,
        date: new Intl.DateTimeFormat("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(policy.updatedAt ?? policy.createdAt),
        id: `${policy.policyKey}:${policy.version}`,
        name: policy.name,
        owner: "Admin",
        policyKey: policy.policyKey,
        status: statusLabel(policy.status),
        version: policy.version,
      })),
    teamRows,
    tenantRows,
    roleRows,
    sourceTruth: "admin_tenant_db_readmodel" as const,
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
