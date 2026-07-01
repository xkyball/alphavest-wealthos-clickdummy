import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { actorTenants, isActorRoleKey, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { resolveCurrentUserFromRequest, type CurrentUserContext } from "@/lib/auth/current-user";
import { failClosedJson } from "@/lib/control-layer/error-envelope";
import { refreshGlobalSearchIndexAfterMutation } from "@/lib/global-search-service";
import {
  assertPlatformAdminActionScope,
  isPlatformAdminWorkflowAction,
  PlatformAdminScopeMismatchError,
  platformAdminCanonicalApiRoute,
  runPlatformAdminWorkflowAction,
} from "@/lib/platform-admin-workflow-actions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PlatformAdminActionsPrismaGlobal = typeof globalThis & {
  alphaVestPlatformAdminActionsPrisma?: PrismaClient;
};

function prismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return undefined;

  const globalForPrisma = globalThis as PlatformAdminActionsPrismaGlobal;
  globalForPrisma.alphaVestPlatformAdminActionsPrisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  return globalForPrisma.alphaVestPlatformAdminActionsPrisma;
}

function tenantSlug(value: unknown): ActorTenantSlug | undefined {
  return typeof value === "string" && actorTenants.some((tenant) => tenant.slug === value)
    ? (value as ActorTenantSlug)
    : undefined;
}

function currentUserRoleKey(currentUser: CurrentUserContext): ActorRoleKey | undefined {
  return isActorRoleKey(currentUser.role?.key) ? currentUser.role.key : undefined;
}

function authErrorResponse(status = 401) {
  return failClosedJson(
    {
      canonicalApiRoute: platformAdminCanonicalApiRoute,
      error: "Platform admin action is not available for this user.",
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
        error: "DATABASE_URL is required for platform admin actions.",
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
  if (!body || !isPlatformAdminWorkflowAction(body.actionId)) {
    return failClosedJson(
      {
        canonicalApiRoute: platformAdminCanonicalApiRoute,
        error: "Platform admin actions only support J10 platform, audit, permission and security commands.",
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
  const parsedTenantSlug = tenantSlug(body.tenantSlug) ?? "morgan";
  if (!parsedRoleKey) {
    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: platformAdminCanonicalApiRoute,
        error: "Platform admin actions require an authenticated actor role.",
        issues: ["valid_actor_role_required"],
        reasonCode: "INVALID_REQUEST",
        safety: {
          authority: "db-user-jwt",
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

  try {
    assertPlatformAdminActionScope(body.actionId, {
      roleKey: parsedRoleKey,
      tenantSlug: parsedTenantSlug,
    });
  } catch (error) {
    if (error instanceof PlatformAdminScopeMismatchError) {
      return failClosedJson(
        {
          actionId: body.actionId,
          canonicalApiRoute: platformAdminCanonicalApiRoute,
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
            tenantSlug: parsedTenantSlug,
          },
        },
        { status: 403 },
      );
    }

    throw error;
  }

  try {
    const result = await runPlatformAdminWorkflowAction(prisma, body.actionId, {
      roleKey: parsedRoleKey,
      tenantSlug: parsedTenantSlug,
    });
    const searchIndex = await refreshGlobalSearchIndexAfterMutation(prisma, `platform-admin:${body.actionId}`);

    return NextResponse.json({
      actionId: body.actionId,
      canonicalApiRoute: platformAdminCanonicalApiRoute,
      clientVisible: false,
      command: result.command,
      noClientRelease: true,
      ok: true,
      result,
      searchIndex,
      safety: {
        authority: "db-user-jwt",
        commandExecuted: true,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        roleKey: parsedRoleKey,
        scoped: true,
        tenantSlug: parsedTenantSlug,
      },
    });
  } catch {
    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: platformAdminCanonicalApiRoute,
        error: "Platform admin action failed.",
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
