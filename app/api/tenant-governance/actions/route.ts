import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { actorPlatformTenantId, actorTenants, isActorRoleKey, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { resolveCurrentUserFromRequest, type CurrentUserContext } from "@/lib/auth/current-user";
import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { refreshGlobalSearchIndexAfterMutation } from "@/lib/global-search-service";
import { AuditPersistenceUnavailableError } from "@/lib/typed-workflow-command-bus";
import {
  assertTenantGovernanceActionScope,
  isTenantGovernanceWorkflowAction,
  runTenantGovernanceWorkflowAction,
  tenantGovernanceCanonicalApiRoute,
  TenantGovernanceScopeMismatchError,
} from "@/lib/tenant-governance-workflow-actions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type TenantGovernanceActionsPrismaGlobal = typeof globalThis & {
  alphaVestTenantGovernanceActionsPrisma?: PrismaClient;
};

function prismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return undefined;

  const globalForPrisma = globalThis as TenantGovernanceActionsPrismaGlobal;
  globalForPrisma.alphaVestTenantGovernanceActionsPrisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  return globalForPrisma.alphaVestTenantGovernanceActionsPrisma;
}

type ResolvedTenantGovernanceScope = {
  tenantId: string;
  tenantName: string;
  tenantSlug: ActorTenantSlug;
  tenantStatus?: string | null;
};

function tenantSlug(value: unknown): ActorTenantSlug | undefined {
  const slug = typeof value === "string" ? value.trim() : "";

  return slug || undefined;
}

function currentUserRoleKey(currentUser: CurrentUserContext): ActorRoleKey | undefined {
  return isActorRoleKey(currentUser.role?.key) ? currentUser.role.key : undefined;
}

function currentUserTenantSlug(currentUser: CurrentUserContext): ActorTenantSlug | undefined {
  const tenant = currentUser.tenant;
  if (!tenant?.id) return undefined;

  return tenant.slug ?? actorTenants.find((candidate) => candidate.id === tenant.id)?.slug;
}

function currentUserHasTenantMembership(currentUser: CurrentUserContext, tenantSlug: ActorTenantSlug) {
  return currentUser.memberships.some((membership) => membership.tenant?.slug === tenantSlug);
}

function isPlatformScoped(currentUser: CurrentUserContext) {
  return currentUser.role?.scope === "PLATFORM";
}

function clientSuccessMayOperateOnOnboardingTenant(
  actionId: unknown,
  roleKey: ActorRoleKey | undefined,
  tenantScope: ResolvedTenantGovernanceScope | undefined,
) {
  return (
    roleKey === "client_success" &&
    typeof actionId === "string" &&
    actionId.startsWith("j06.") &&
    (tenantScope?.tenantStatus === "DRAFT" || tenantScope?.tenantStatus === "ONBOARDING")
  );
}

async function resolveTenantGovernanceScope(
  prisma: PrismaClient,
  value: unknown,
): Promise<ResolvedTenantGovernanceScope | undefined> {
  const slug = tenantSlug(value);
  if (!slug) return undefined;

  const dbTenant = await prisma.clientTenant.findFirst({
    select: {
      displayName: true,
      id: true,
      slug: true,
      status: true,
    },
    where: { platformTenantId: actorPlatformTenantId, slug },
  });
  if (dbTenant) {
    return {
      tenantId: dbTenant.id,
      tenantName: dbTenant.displayName,
      tenantSlug: dbTenant.slug,
      tenantStatus: dbTenant.status,
    };
  }

  const seeded = actorTenants.find((tenant) => tenant.slug === slug);
  if (!seeded) return undefined;

  return {
    tenantId: seeded.id,
    tenantName: seeded.displayName,
    tenantSlug: seeded.slug,
    tenantStatus: seeded.status,
  };
}

function authErrorResponse(status = 401) {
  return failClosedJson(
    {
      canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
      error: "Tenant governance action is not available for this user.",
      reasonCode: status === 401 ? "PERMISSION_DENIED" : "SCOPE_DENIED",
      safety: {
        authority: "db-user-jwt",
        commandExecuted: false,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        scoped: false,
      },
    },
    { status },
  );
}

export async function POST(request: Request) {
  const prisma = prismaClient();
  if (!prisma) {
    return failClosedJson(
      {
        error: "DATABASE_URL is required for tenant governance actions.",
        reasonCode: "DATABASE_URL_REQUIRED",
        retryAllowed: true,
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => undefined)) as {
    actionId?: unknown;
    roleKey?: unknown;
    tenantSlug?: unknown;
  } | undefined;
  if (!body || !isTenantGovernanceWorkflowAction(body.actionId)) {
    return failClosedJson(
      {
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        error: "Tenant governance actions only support J06/J07 tenant, user, role and governance commands.",
        reasonCode: "INVALID_REQUEST",
        safety: {
          commandExecuted: false,
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          scoped: false,
        },
      },
      { status: 400 },
    );
  }

  const currentUser = await resolveCurrentUserFromRequest(prisma, request).catch(() => undefined);
  if (!currentUser) {
    return authErrorResponse(401);
  }

  const parsedRoleKey = currentUserRoleKey(currentUser);
  const resolvedTenantScope = await resolveTenantGovernanceScope(prisma, body.tenantSlug);
  const parsedTenantSlug = resolvedTenantScope?.tenantSlug;
  if (!parsedRoleKey || !resolvedTenantScope) {
    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        error: "Tenant governance actions require an authenticated actor role and a valid target tenant.",
        issues: [
          ...(!parsedRoleKey ? ["valid_actor_role_required"] : []),
          ...(!parsedTenantSlug ? ["valid_tenant_scope_required"] : []),
        ],
        reasonCode: "INVALID_REQUEST",
        safety: {
          authority: "db-user-jwt",
          commandExecuted: false,
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          roleKey: parsedRoleKey,
          scoped: false,
          tenantSlug: parsedTenantSlug,
        },
      },
      { status: 400 },
    );
  }
  const targetTenantSlug = resolvedTenantScope.tenantSlug;

  const currentTenantSlug = currentUserTenantSlug(currentUser);
  if (
    !isPlatformScoped(currentUser) &&
    currentTenantSlug !== targetTenantSlug &&
    !currentUserHasTenantMembership(currentUser, targetTenantSlug) &&
    !clientSuccessMayOperateOnOnboardingTenant(body.actionId, parsedRoleKey, resolvedTenantScope)
  ) {
    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        error: "Tenant governance action scope does not match the authenticated tenant membership.",
        issues: ["actor_tenant_scope_mismatch"],
        reasonCode: "SCOPE_DENIED",
        safety: {
          authority: "db-user-jwt",
          commandExecuted: false,
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          roleKey: parsedRoleKey,
          scoped: false,
          tenantSlug: targetTenantSlug,
        },
      },
      { status: 403 },
    );
  }

  try {
    assertTenantGovernanceActionScope(body.actionId, {
      roleKey: parsedRoleKey,
      tenantSlug: targetTenantSlug,
    });
  } catch (error) {
    if (error instanceof TenantGovernanceScopeMismatchError) {
      return failClosedJson(
        {
          actionId: body.actionId,
          canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
          error: error.message,
          issues: ["actor_scope_mismatch"],
          reasonCode: "SCOPE_DENIED",
          safety: {
            authority: "db-user-jwt",
            commandExecuted: false,
            hiddenRowsDisclosed: false,
            noAdviceExecution: true,
            noClientRelease: true,
            roleKey: parsedRoleKey,
            scoped: false,
            tenantSlug: targetTenantSlug,
          },
        },
        { status: 403 },
      );
    }

    throw error;
  }

  try {
    const outcome = await runTenantGovernanceWorkflowAction(prisma, body.actionId, {
      tenantId: resolvedTenantScope.tenantId,
      tenantName: resolvedTenantScope.tenantName,
      roleKey: parsedRoleKey,
      tenantSlug: targetTenantSlug,
    });
    const searchIndex = await refreshGlobalSearchIndexAfterMutation(prisma, `tenant-governance:${body.actionId}`);
    return NextResponse.json({
      actionId: body.actionId,
      canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
      clientVisible: false,
      command: outcome.command,
      noClientRelease: true,
      ok: true,
      result: {
        ...outcome.result,
        clientVisible: false,
      },
      searchIndex,
      safety: {
        authority: "db-user-jwt",
        commandExecuted: true,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        roleKey: parsedRoleKey,
        scoped: true,
        tenantSlug: targetTenantSlug,
      },
    });
  } catch (error) {
    if (error instanceof AuditPersistenceUnavailableError) {
      return failClosedJson(
        {
          actionId: body.actionId,
          auditPersistenceRequired: true,
          canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
          error: error.message,
          reasonCode: "AUDIT_PERSISTENCE_UNAVAILABLE",
          safety: {
            authority: "db-user-jwt",
            commandExecuted: false,
            hiddenRowsDisclosed: false,
            noAdviceExecution: true,
            noClientRelease: true,
            roleKey: parsedRoleKey,
            scoped: true,
            tenantSlug: parsedTenantSlug,
          },
        },
        { status: 409 },
      );
    }

    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        error: "Tenant governance action failed.",
        reasonCode: "SAFE_ERROR",
        safety: {
          authority: "db-user-jwt",
          commandExecuted: false,
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          roleKey: parsedRoleKey,
          scoped: true,
          tenantSlug: parsedTenantSlug,
        },
      },
      { status: 409 },
    );
  }
}
