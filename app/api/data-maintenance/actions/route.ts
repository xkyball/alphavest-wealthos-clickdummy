import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  actorTenants,
  isActorRoleKey,
  type ActorRoleKey,
  type ActorTenantSlug,
} from "@/lib/actor-session";
import { resolveCurrentUserFromRequest, type CurrentUserContext } from "@/lib/auth/current-user";
import {
  dataMaintenanceCanonicalApiRoute,
  dataMaintenanceCommandForAction,
  isDataMaintenanceWorkflowAction,
  runDataMaintenanceWorkflowAction,
  type DataMaintenanceWorkflowAction,
} from "@/lib/data-maintenance-workflow-actions";
import { refreshGlobalSearchIndexAfterMutation } from "@/lib/global-search-service";
import { AuditPersistenceUnavailableError } from "@/lib/typed-workflow-command-bus";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type DataMaintenanceActionsPrismaGlobal = typeof globalThis & {
  alphaVestDataMaintenanceActionsPrisma?: PrismaClient;
};

function prismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return undefined;

  const globalForPrisma = globalThis as DataMaintenanceActionsPrismaGlobal;
  globalForPrisma.alphaVestDataMaintenanceActionsPrisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  return globalForPrisma.alphaVestDataMaintenanceActionsPrisma;
}

function tenantSlug(value: unknown): ActorTenantSlug | undefined {
  return typeof value === "string" && actorTenants.some((tenant) => tenant.slug === value)
    ? (value as ActorTenantSlug)
    : undefined;
}

function currentUserRoleKey(currentUser: CurrentUserContext): ActorRoleKey | undefined {
  return isActorRoleKey(currentUser.role?.key) ? currentUser.role.key : undefined;
}

function currentUserTenantSlug(currentUser: CurrentUserContext): ActorTenantSlug | undefined {
  const tenantId = currentUser.tenant?.id;
  return actorTenants.find((tenant) => tenant.id === tenantId)?.slug;
}

function authErrorResponse(status = 401) {
  return failClosedJson(
    {
      canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
      error: "Data maintenance action is not available for this user.",
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

function fixedScopeForAction(actionId: DataMaintenanceWorkflowAction):
  | { roleKey: ActorRoleKey; tenantSlug: ActorTenantSlug }
  | undefined {
  if (
    actionId === "j04.portalUpload" ||
    actionId === "j04.openUploadDocument" ||
    actionId === "j04.uploadDocument" ||
    actionId === "j04.confirmFinalize" ||
    actionId === "j04.viewDetails" ||
    actionId === "j04.refreshReviewQueue" ||
    actionId === "j04.requestClarification"
  ) {
    return { roleKey: "family_cfo", tenantSlug: "morgan" };
  }

  if (actionId === "j04.clientSafeEvidenceSummary") {
    return { roleKey: "client_success", tenantSlug: "morgan" };
  }

  if (actionId === "j05.createEntity" || actionId === "j05.continueEntity" || actionId === "j05.editEntity") {
    return { roleKey: "principal", tenantSlug: "summit" };
  }

  if (actionId === "j09.startClientIntake") {
    return { roleKey: "principal", tenantSlug: "morgan" };
  }

  if (
    actionId === "j09.portalUpload" ||
    actionId === "j09.submitProfile" ||
    actionId === "j09.addMember" ||
    actionId === "j09.saveFamilyChanges" ||
    actionId === "j09.openFamilyMap" ||
    actionId === "j09.addRelationship"
  ) {
    return { roleKey: "principal", tenantSlug: "bennett" };
  }

  return undefined;
}

export async function POST(request: Request) {
  const prisma = prismaClient();
  if (!prisma) {
    return failClosedJson(
      {
        error: "DATABASE_URL is required for data maintenance actions.",
        reasonCode: "DATABASE_URL_REQUIRED",
        retryAllowed: true,
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => undefined)) as {
    actionId?: unknown;
    actionItemId?: unknown;
    roleKey?: unknown;
    simulateAuditPersistenceFailure?: unknown;
    tenantSlug?: unknown;
  } | undefined;
  if (!body || !isDataMaintenanceWorkflowAction(body.actionId)) {
    return failClosedJson(
      {
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        error: "Data maintenance actions only support J04 document, J05 entity/action and J09 profile/family/relationship commands.",
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
  if (
    body.simulateAuditPersistenceFailure !== undefined &&
    typeof body.simulateAuditPersistenceFailure !== "boolean"
  ) {
    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        error: "simulateAuditPersistenceFailure must be boolean when provided.",
        reasonCode: "INVALID_REQUEST",
        safety: {
          commandExecuted: false,
          hiddenRowsDisclosed: false,
          noAdviceExecution: true,
          noClientRelease: true,
          scoped: true,
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
  const actorTenantSlug = currentUserTenantSlug(currentUser);
  const targetTenantSlug = tenantSlug(body.tenantSlug);
  const fixedScope = fixedScopeForAction(body.actionId);
  const parsedTenantSlug = fixedScope?.tenantSlug ?? actorTenantSlug ?? targetTenantSlug;
  if (!parsedRoleKey || !parsedTenantSlug) {
    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        error: "Data maintenance actions require an authenticated actor role and tenant scope.",
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

  if (fixedScope && (fixedScope.roleKey !== parsedRoleKey || fixedScope.tenantSlug !== parsedTenantSlug)) {
    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        error: "Data maintenance action scope does not match the selected workflow object.",
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

  if (actorTenantSlug !== parsedTenantSlug) {
    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        error: "Data maintenance action scope does not match the authenticated tenant membership.",
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
          tenantSlug: parsedTenantSlug,
        },
      },
      { status: 403 },
    );
  }

  if (!fixedScope && targetTenantSlug && actorTenantSlug !== targetTenantSlug) {
    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        error: "Data maintenance action scope does not match the authenticated tenant membership.",
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
    const result = await runDataMaintenanceWorkflowAction(prisma, body.actionId, {
      actionItemId: typeof body.actionItemId === "string" ? body.actionItemId : undefined,
      roleKey: parsedRoleKey,
      simulateAuditPersistenceFailure: body.simulateAuditPersistenceFailure === true,
      tenantSlug: parsedTenantSlug,
    });
    const searchIndex = await refreshGlobalSearchIndexAfterMutation(prisma, `data-maintenance:${body.actionId}`);

    return NextResponse.json({
      actionId: body.actionId,
      canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
      clientVisible: false,
      command: dataMaintenanceCommandForAction(body.actionId),
      noAdviceExecution: true,
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
  } catch (error) {
    if (error instanceof AuditPersistenceUnavailableError) {
      return failClosedJson(
        {
          actionId: body.actionId,
          auditPersistenceRequired: true,
          canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
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
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        error: "Data maintenance action failed.",
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
