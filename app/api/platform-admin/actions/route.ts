import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { actorRoles, actorTenants, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
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

function roleKey(value: unknown): ActorRoleKey | undefined {
  return typeof value === "string" && actorRoles.some((role) => role.key === value)
    ? (value as ActorRoleKey)
    : undefined;
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

  const parsedRoleKey = roleKey(body.roleKey);
  const parsedTenantSlug = tenantSlug(body.tenantSlug);
  if (!parsedRoleKey || !parsedTenantSlug) {
    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: platformAdminCanonicalApiRoute,
        error: "Platform admin actions require an explicit actor role and tenant scope.",
        issues: ["valid_actor_role_required", "valid_tenant_scope_required"],
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
            commandExecuted: false,
            hiddenRowsDisclosed: false,
            noAdviceExecution: true,
            noClientRelease: true,
            scoped: false,
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
        commandExecuted: true,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        scoped: true,
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
          commandExecuted: false,
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          scoped: true,
        },
      },
      { status: 409 },
    );
  }
}
