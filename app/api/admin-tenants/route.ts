import { NextResponse } from "next/server";

import { LocalAuthProviderError, inviteLocalAuthUser } from "@/lib/auth/local-auth-provider-service";
import { actorPlatformTenantId, actorTenants, actorTenantSlugForClientTenant, isActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { resolveCurrentUserFromRequest, type CurrentUserContext } from "@/lib/auth/current-user";
import {
  getAdminTenantSnapshot,
  listAdminTenantRowsPage,
  listAdminTenantUserRowsPage,
  type AdminTenantSortKey,
  type AdminTenantUserSortKey,
} from "@/lib/admin-tenant-readmodel-service";
import { parseDataSurfaceQuery } from "@/lib/data-surface-query-contract";
import {
  assignOperationalTeamMember,
  createOperationalClientTenant,
  createOperationalPolicyVersion,
  OperationalStage2PermissionError,
  OperationalStage2ValidationError,
  requireOperationalEffectivePolicy,
  updateOperationalPlatformSetting,
  updateOperationalSecurityConfiguration,
  refreshUserInvite,
  revokeUserInvite,
  setUserStatus,
  updateUserAssignment,
} from "@/lib/admin-tenant-governance-service";
import { prismaClient } from "@/lib/prisma";

const adminTenantSortKeys = ["activePolicies", "activeUsers", "jurisdiction", "name", "onboarding", "owner", "readiness", "status", "tier"] as const satisfies readonly AdminTenantSortKey[];
const adminTenantUserSortKeys = ["invite", "name", "role", "scope", "status"] as const satisfies readonly AdminTenantUserSortKey[];
const adminTenantReadRoles = new Set(["admin", "client_success"]);

function currentUserTenantSlug(currentUser: CurrentUserContext): ActorTenantSlug | undefined {
  const tenant = currentUser.tenant;
  if (!tenant?.id) return undefined;

  return tenant.slug ?? actorTenants.find((candidate) => candidate.id === tenant.id)?.slug ?? actorTenantSlugForClientTenant(tenant);
}

function currentUserHasTenantMembership(currentUser: CurrentUserContext, tenantSlug: ActorTenantSlug) {
  return currentUser.memberships.some((membership) => membership.tenant?.slug === tenantSlug);
}

function isPlatformScoped(currentUser: CurrentUserContext) {
  return currentUser.role?.scope === "PLATFORM";
}

function targetTenantSlugForAction(payload: Record<string, unknown>): ActorTenantSlug | undefined {
  const value = payload.action === "create_policy_version" || payload.action === "require_effective_policy"
    ? payload.clientTenantSlug
    : payload.tenantSlug;

  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

async function resolveTenantSlug(prisma: ReturnType<typeof prismaClient>, value?: string | null): Promise<ActorTenantSlug | undefined> {
  const slug = value?.trim();
  if (!slug) return undefined;
  if (actorTenants.some((tenant) => tenant.slug === slug)) return slug;

  const tenant = await prisma.clientTenant.findFirst({
    select: { slug: true },
    where: { platformTenantId: actorPlatformTenantId, slug },
  });

  return tenant?.slug;
}

function tenantSlugFromQuery(searchParams: URLSearchParams): string | undefined {
  const value = searchParams.get("tenantSlug");
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function authErrorResponse(status = 401) {
  return NextResponse.json(
    {
      error: "Admin tenant action is not available for this user.",
      ok: false,
      reasonCode: status === 401 ? "PERMISSION_DENIED" : "SCOPE_DENIED",
      safety: {
        authority: "db-user-jwt",
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        productionAuthClaim: false,
        scoped: false,
      },
    },
    { status },
  );
}

async function resolveAdminTenantReadAccess(request: Request, requestedTenantSlug?: ActorTenantSlug) {
  const currentUser = await resolveCurrentUserFromRequest(prismaClient(), request).catch(() => undefined);

  if (!currentUser) {
    return { response: authErrorResponse(401) };
  }

  const roleKey = currentUser.role?.key;
  if (!isActorRoleKey(roleKey) || !adminTenantReadRoles.has(roleKey)) {
    return {
      response: NextResponse.json(
        {
          error: "Admin tenant readmodel is not available for this user.",
          ok: false,
          reasonCode: "PERMISSION_DENIED",
          safety: {
            authority: "db-user-jwt",
            hiddenRowsDisclosed: false,
            noClientRelease: true,
            productionAuthClaim: false,
            scoped: false,
          },
        },
        { status: 403 },
      ),
    };
  }

  const currentTenantSlug = currentUserTenantSlug(currentUser);
  if (
    requestedTenantSlug &&
    !isPlatformScoped(currentUser) &&
    currentTenantSlug !== requestedTenantSlug &&
    !currentUserHasTenantMembership(currentUser, requestedTenantSlug)
  ) {
    return {
      response: NextResponse.json(
        {
          error: "Admin tenant readmodel scope does not match the authenticated tenant membership.",
          issues: ["actor_tenant_scope_mismatch"],
          ok: false,
          reasonCode: "SCOPE_DENIED",
          safety: {
            authority: "db-user-jwt",
            hiddenRowsDisclosed: false,
            noClientRelease: true,
            productionAuthClaim: false,
            roleKey,
            scoped: false,
            tenantSlug: requestedTenantSlug,
          },
        },
        { status: 403 },
      ),
    };
  }

  return {
    currentUser,
    tenantSlug: isPlatformScoped(currentUser) ? requestedTenantSlug : requestedTenantSlug ?? currentTenantSlug,
  };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const surface = url.searchParams.get("surface");
    const prisma = prismaClient();
    const requestedTenantSlug = await resolveTenantSlug(prisma, tenantSlugFromQuery(url.searchParams));
    const readAccess = await resolveAdminTenantReadAccess(request, requestedTenantSlug);

    if ("response" in readAccess) {
      return readAccess.response;
    }

    if (surface === "tenants") {
      const page = await listAdminTenantRowsPage(prisma, parseDataSurfaceQuery(url.searchParams, {
        allowedSortKeys: adminTenantSortKeys,
        defaultPageSize: 10,
        defaultSortKey: "name",
        maxPageSize: 25,
      }), {
        jurisdiction: url.searchParams.get("jurisdiction") ?? undefined,
        serviceType: url.searchParams.get("serviceType") ?? undefined,
        status: url.searchParams.get("status") ?? undefined,
      }, {
        tenantSlug: readAccess.tenantSlug,
      });

      return NextResponse.json({
        meta: page.meta,
        ok: true,
        safety: {
          authority: "db-user-jwt",
          hiddenRowsDisclosed: false,
          noClientRelease: true,
          productionAuthClaim: false,
          roleKey: readAccess.currentUser.role?.key,
          returnedRows: page.meta.returnedRows,
          scoped: true,
          ...(readAccess.tenantSlug ? { tenantSlug: readAccess.tenantSlug } : {}),
          totalRows: page.meta.totalRows,
        },
        tenantRows: page.tenantRows,
      });
    }

    if (surface === "users") {
      const page = await listAdminTenantUserRowsPage(prisma, parseDataSurfaceQuery(url.searchParams, {
        allowedSortKeys: adminTenantUserSortKeys,
        defaultPageSize: 10,
        defaultSortKey: "name",
        maxPageSize: 25,
      }), {
        status: url.searchParams.get("status") ?? undefined,
      }, {
        tenantSlug: readAccess.tenantSlug,
      });

      return NextResponse.json({
        meta: page.meta,
        ok: true,
        safety: {
          authority: "db-user-jwt",
          hiddenRowsDisclosed: false,
          noClientRelease: true,
          productionAuthClaim: false,
          roleKey: readAccess.currentUser.role?.key,
          returnedRows: page.meta.returnedRows,
          scoped: true,
          ...(readAccess.tenantSlug ? { tenantSlug: readAccess.tenantSlug } : {}),
          totalRows: page.meta.totalRows,
        },
        userRows: page.userRows,
      });
    }

    const snapshot = await getAdminTenantSnapshot(prisma, { tenantSlug: readAccess.tenantSlug });

    return NextResponse.json({
      ok: true,
      safety: {
        authority: "db-user-jwt",
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        productionAuthClaim: false,
        roleKey: readAccess.currentUser.role?.key,
        scoped: true,
        ...(readAccess.tenantSlug ? { tenantSlug: readAccess.tenantSlug } : {}),
      },
      snapshot,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Admin tenant snapshot could not be loaded.",
        ok: false,
        safety: { hiddenRowsDisclosed: false, scoped: false },
        snapshot: null,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => undefined);
  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  try {
    const prisma = prismaClient();
    const currentUser = await resolveCurrentUserFromRequest(prisma, request).catch(() => undefined);
    if (!currentUser) {
      return authErrorResponse(401);
    }

    if (!isActorRoleKey(currentUser.role?.key)) {
      return NextResponse.json(
        {
          error: "Admin tenant action requires an authenticated actor role.",
          issues: ["valid_actor_role_required"],
          ok: false,
          reasonCode: "INVALID_REQUEST",
          safety: {
            authority: "db-user-jwt",
            hiddenRowsDisclosed: false,
            noClientRelease: true,
            productionAuthClaim: false,
            scoped: false,
          },
        },
        { status: 400 },
      );
    }

    const targetTenantSlug = await resolveTenantSlug(prisma, targetTenantSlugForAction(payload));
    const currentTenantSlug = currentUserTenantSlug(currentUser);
    if (
      targetTenantSlug &&
      !isPlatformScoped(currentUser) &&
      currentTenantSlug !== targetTenantSlug &&
      !currentUserHasTenantMembership(currentUser, targetTenantSlug)
    ) {
      return NextResponse.json(
        {
          error: "Admin tenant action scope does not match the authenticated tenant membership.",
          issues: ["actor_tenant_scope_mismatch"],
          ok: false,
          reasonCode: "SCOPE_DENIED",
          safety: {
            authority: "db-user-jwt",
            hiddenRowsDisclosed: false,
            noClientRelease: true,
            productionAuthClaim: false,
            roleKey: currentUser.role.key,
            scoped: false,
            tenantSlug: targetTenantSlug,
          },
        },
        { status: 403 },
      );
    }

    const authorizedPayload = {
      ...payload,
      actorRoleKey: currentUser.role.key,
      actorUserId: currentUser.actor.id,
    };
    const result = await handleAdminTenantAction(prisma, authorizedPayload);
    const snapshot = await getAdminTenantSnapshot(prismaClient(), { tenantSlug: targetTenantSlug });

    return NextResponse.json({
      ok: true,
      result,
      safety: {
        authority: "db-user-jwt",
        hiddenRowsDisclosed: false,
        noClientRelease: true,
        productionAuthClaim: false,
        roleKey: currentUser.role.key,
        scoped: true,
        ...(targetTenantSlug ? { tenantSlug: targetTenantSlug } : {}),
      },
      snapshot,
    });
  } catch (error) {
    if (error instanceof LocalAuthProviderError) {
      return NextResponse.json(
        {
          error: error.message,
          ok: false,
          reasonCode: error.reasonCode,
          safety: {
            authority: "db-user-jwt",
            hiddenRowsDisclosed: false,
            noClientRelease: true,
            productionAuthClaim: false,
            scoped: false,
          },
        },
        { status: error.status },
      );
    }

    if (error instanceof OperationalStage2ValidationError) {
      return NextResponse.json(
        {
          error: "Admin tenant action failed validation.",
          issues: error.issues,
          ok: false,
          reasonCode: "INVALID_REQUEST",
          safety: { authority: "db-user-jwt", hiddenRowsDisclosed: false, noClientRelease: true, scoped: false },
        },
        { status: 400 },
      );
    }

    if (error instanceof OperationalStage2PermissionError) {
      return NextResponse.json(
        {
          auditEventId: error.auditEventId,
          error: error.message,
          ok: false,
          reasonCode: error.reasonCode,
          safety: { authority: "db-user-jwt", hiddenRowsDisclosed: false, noClientRelease: true, scoped: false },
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        error: "Invitation could not be created.",
        ok: false,
        safety: {
          authority: "db-user-jwt",
          hiddenRowsDisclosed: false,
          noClientRelease: true,
          productionAuthClaim: false,
          scoped: false,
        },
      },
      { status: 500 },
    );
  }
}

async function handleAdminTenantAction(prisma: ReturnType<typeof prismaClient>, payload: Record<string, unknown>) {
  switch (payload.action) {
    case "invite_user":
      return inviteLocalAuthUser(prisma, payload);
    case "create_tenant":
      return createOperationalClientTenant(prisma, payload);
    case "update_platform_setting":
      return updateOperationalPlatformSetting(prisma, payload);
    case "update_security_configuration":
      return updateOperationalSecurityConfiguration(prisma, payload);
    case "create_policy_version":
      return createOperationalPolicyVersion(prisma, payload);
    case "require_effective_policy":
      return requireOperationalEffectivePolicy(prisma, payload);
    case "assign_team_member":
      return assignOperationalTeamMember(prisma, payload);
    case "set_user_status":
      return setUserStatus(prisma, payload);
    case "update_user_assignment":
      return updateUserAssignment(prisma, payload);
    case "refresh_user_invite":
      return refreshUserInvite(prisma, payload);
    case "revoke_user_invite":
      return revokeUserInvite(prisma, payload);
    default:
      throw new OperationalStage2ValidationError(["unsupported_admin_tenant_action"]);
  }
}
