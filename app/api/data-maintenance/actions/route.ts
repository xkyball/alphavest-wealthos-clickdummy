import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  actorRoles,
  actorTenants,
  type ActorRoleKey,
  type ActorTenantSlug,
} from "@/lib/actor-session";
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

function roleKey(value: unknown): ActorRoleKey | undefined {
  return typeof value === "string" && actorRoles.some((role) => role.key === value)
    ? (value as ActorRoleKey)
    : undefined;
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

  const parsedRoleKey = roleKey(body.roleKey);
  const parsedTenantSlug = tenantSlug(body.tenantSlug);
  if (!parsedRoleKey || !parsedTenantSlug) {
    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        error: "Data maintenance actions require an explicit actor role and tenant scope.",
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

  const fixedScope = fixedScopeForAction(body.actionId);
  if (fixedScope && (fixedScope.roleKey !== parsedRoleKey || fixedScope.tenantSlug !== parsedTenantSlug)) {
    return failClosedJson(
      {
        actionId: body.actionId,
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        error: "Data maintenance action scope does not match the selected workflow object.",
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
          canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
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
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        error: "Data maintenance action failed.",
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
