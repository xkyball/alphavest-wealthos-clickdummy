import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { actorRoles, actorTenants, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
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

  const parsedRoleKey = roleKey(body.roleKey);
  const parsedTenantSlug = tenantSlug(body.tenantSlug);
  if (!parsedRoleKey || !parsedTenantSlug) {
    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        error: "Tenant governance actions require an explicit actor role and tenant scope.",
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
    assertTenantGovernanceActionScope(body.actionId, {
      roleKey: parsedRoleKey,
      tenantSlug: parsedTenantSlug,
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
    const outcome = await runTenantGovernanceWorkflowAction(prisma, body.actionId, {
      roleKey: parsedRoleKey,
      tenantSlug: parsedTenantSlug,
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
        commandExecuted: true,
        hiddenRowsDisclosed: false,
        noAdviceExecution: true,
        noClientRelease: true,
        scoped: true,
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

    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        error: "Tenant governance action failed.",
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
