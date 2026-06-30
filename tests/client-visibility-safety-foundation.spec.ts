import { expect, test } from "@playwright/test";

import {
  clientVisibilitySafetyProcessContracts,
  clientVisibilitySelectedProcessIds,
  buildClientVisibilitySafetyCoverageReport,
} from "../lib/client-visibility-safety-foundation";
import { evaluateAuditGuard } from "../lib/control-layer/audit-guard";
import { resolveActorContext } from "../lib/control-layer/actor-context";
import { resolveTenantObjectScope } from "../lib/control-layer/scope-resolver";
import { createActorSession, actorPlatformTenantId } from "../lib/actor-session";
import { permissionEngine } from "../lib/permission-engine";

function expectAllowedActorContext(roleKey: string) {
  const result = resolveActorContext({
    correlationId: `clientVisibility-stage1-${roleKey}`,
    roleKey,
    tenantSlug: "bennett",
  });

  expect(result.allowed).toBe(true);
  if (!result.allowed) throw new Error(result.reason);

  return result.actorContext;
}

test.describe("CLIENT_VISIBILITY Stage 1 safety foundation closure", () => {
  test("P1-T01 maps route/action/object/payload permission contracts to all 27 processes", () => {
    const coverage = buildClientVisibilitySafetyCoverageReport();

    expect(coverage.processCount).toBe(27);
    expect(coverage.missingProcessIds).toEqual([]);
    expect(coverage.duplicateProcessIds).toEqual([]);
    expect(clientVisibilitySafetyProcessContracts.map((contract) => contract.processId)).toEqual(
      clientVisibilitySelectedProcessIds,
    );
    expect(coverage.ticketCoverage["P1-T01"]).toHaveLength(27);

    for (const contract of clientVisibilitySafetyProcessContracts) {
      const session = createActorSession({
        roleKey: contract.allowedRole,
        tenantSlug: contract.tenantSlug,
      });
      const context = {
        clientTenantId: session.tenant.id,
        objectScope:
          contract.requiredScope === "OBJECT" || contract.requiredScope === "PAYLOAD"
            ? {
                clientTenantId: session.tenant.id,
                objectIds: [contract.objectId],
                objectType: contract.objectType,
              }
            : undefined,
        platformTenantId: actorPlatformTenantId,
      };
      const decision = permissionEngine.can(
        session.actor,
        contract.permissionAction,
        {
          clientTenantId: session.tenant.id,
          objectId:
            contract.requiredScope === "OBJECT" || contract.requiredScope === "PAYLOAD"
              ? contract.objectId
              : undefined,
          objectType: contract.objectType,
          sensitivity: contract.sensitivity,
          visibilityStatus: contract.visibilityStatus,
        },
        context,
        session.role,
      );

      expect(decision.allowed, `${contract.processId} expected allowed scoped action`).toBe(true);
      expect(decision.requiresAudit, `${contract.processId} audit contract`).toBe(
        contract.requiresAuditTrace,
      );
    }

    const routeOnlySession = createActorSession({ roleKey: "compliance_officer", tenantSlug: "bennett" });
    const routeOnlyDecision = permissionEngine.can(
      routeOnlySession.actor,
      "RELEASE",
      {
        clientTenantId: routeOnlySession.tenant.id,
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: routeOnlySession.tenant.id,
        platformTenantId: actorPlatformTenantId,
      },
      routeOnlySession.role,
    );

    expect(routeOnlyDecision.allowed).toBe(false);
    expect(routeOnlyDecision.reasonCode).toBe("DEMO_DENY_OBJECT_TARGET_REQUIRED");
    expect(routeOnlyDecision.requiresAudit).toBe(true);
  });

  test("P1-T02 proves tenant and object scope pass correctly and fail closed", () => {
    const actorContext = expectAllowedActorContext("compliance_officer");
    const contract = clientVisibilitySafetyProcessContracts.find((candidate) => candidate.processId === "G-006");
    expect(contract).toBeDefined();
    if (!contract) throw new Error("Missing G-006 safety contract");

    const validScope = resolveTenantObjectScope(actorContext, {
      allowedObjectIds: [contract.objectId],
      clientTenantId: actorContext.clientTenantId,
      objectId: contract.objectId,
      objectType: contract.objectType,
      requireObjectScope: true,
    });
    const crossTenant = resolveTenantObjectScope(actorContext, {
      clientTenantId: "tenant:outside",
    });
    const wrongObject = resolveTenantObjectScope(actorContext, {
      allowedObjectIds: ["clientVisibility:wrong-object"],
      clientTenantId: actorContext.clientTenantId,
      objectId: contract.objectId,
      objectType: contract.objectType,
      requireObjectScope: true,
    });

    expect(validScope.allowed).toBe(true);
    expect(crossTenant.allowed).toBe(false);
    if (!crossTenant.allowed) {
      expect(crossTenant.reasonCode).toBe("WCL_SCOPE_CROSS_TENANT_DENIED");
    }
    expect(wrongObject.allowed).toBe(false);
    if (!wrongObject.allowed) {
      expect(wrongObject.reasonCode).toBe("WCL_SCOPE_OBJECT_DENIED");
    }
  });

  test("P1-T03 allows admin governance management and blocks safety gate bypass", () => {
    const admin = createActorSession({ roleKey: "admin", tenantSlug: "bennett" });

    const governanceManage = permissionEngine.can(
      admin.actor,
      "MANAGE",
      {
        clientTenantId: admin.tenant.id,
        objectType: "ROLE",
        sensitivity: "RESTRICTED",
        visibilityStatus: "INTERNAL_ONLY",
      },
      {
        clientTenantId: admin.tenant.id,
        platformTenantId: actorPlatformTenantId,
      },
      admin.role,
    );

    expect(governanceManage.allowed).toBe(true);
    expect(governanceManage.requiresAudit).toBe(true);

    for (const bypassAttempt of [
      {
        action: "RELEASE" as const,
        objectType: "RECOMMENDATION" as const,
        reasonCode: "DEMO_DENY_COMPLIANCE_RELEASE_REQUIRED",
        visibilityStatus: "COMPLIANCE_VISIBLE" as const,
      },
      {
        action: "APPROVE" as const,
        objectType: "EVIDENCE_RECORD" as const,
        reasonCode: "DEMO_DENY_ADMIN_EVIDENCE_NON_BYPASS",
        visibilityStatus: "COMPLIANCE_VISIBLE" as const,
      },
      {
        action: "EXPORT" as const,
        objectType: "EXPORT_REQUEST" as const,
        reasonCode: "DEMO_DENY_ADMIN_NON_BYPASS",
        visibilityStatus: "REDACTED" as const,
      },
    ]) {
      const decision = permissionEngine.can(
        admin.actor,
        bypassAttempt.action,
        {
          clientTenantId: admin.tenant.id,
          objectType: bypassAttempt.objectType,
          sensitivity: "RESTRICTED",
          visibilityStatus: bypassAttempt.visibilityStatus,
        },
        {
          clientTenantId: admin.tenant.id,
          platformTenantId: actorPlatformTenantId,
        },
        admin.role,
      );

      expect(decision.allowed).toBe(false);
      expect(decision.reasonCode).toBe(bypassAttempt.reasonCode);
      expect(decision.requiresAudit).toBe(true);
    }
  });

  test("P1-T04 proves critical actions require durable audit trace", () => {
    const allowed = evaluateAuditGuard({
      action: "RELEASE",
      actorRoleKey: "compliance_officer",
      actorUserId: "clientVisibility-actor",
      auditPersistenceAvailable: true,
      clientTenantId: "clientVisibility-tenant",
      correlationId: "clientVisibility-p1-t04",
      eventType: "clientVisibility.stage1.release",
      nextState: "RELEASED_TO_CLIENT",
      platformTenantId: actorPlatformTenantId,
      previousState: "COMPLIANCE_PENDING",
      reason: "CLIENT_VISIBILITY Stage 1 critical release proof.",
      result: "SUCCESS",
      targetId: "clientVisibility:G-006:stage1-object",
      targetType: "RECOMMENDATION",
    });
    const blocked = evaluateAuditGuard({
      action: "RELEASE",
      actorRoleKey: "compliance_officer",
      actorUserId: "clientVisibility-actor",
      auditPersistenceAvailable: false,
      clientTenantId: "clientVisibility-tenant",
      correlationId: "clientVisibility-p1-t04",
      eventType: "clientVisibility.stage1.release",
      nextState: "RELEASED_TO_CLIENT",
      platformTenantId: actorPlatformTenantId,
      previousState: "COMPLIANCE_PENDING",
      reason: "CLIENT_VISIBILITY Stage 1 critical release proof.",
      result: "SUCCESS",
      targetId: "clientVisibility:G-006:stage1-object",
      targetType: "RECOMMENDATION",
    });

    expect(allowed.allowed).toBe(true);
    if (allowed.allowed) {
      expect(allowed.reasonCode).toBe("WCL_AUDIT_GUARD_ALLOWED");
      expect(allowed.metadata.failClosedOnAuditPersistence).toBe(true);
    }
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.reasonCode).toBe("WCL_AUDIT_GUARD_BLOCKED");
      expect(blocked.missingFields).toEqual(["auditPersistenceAvailable"]);
    }
  });

  test("P1-T05 resolves current user/session context before action and denies unknown actors", () => {
    const mapped = resolveActorContext({
      correlationId: "clientVisibility-p1-t05",
      roleKey: "compliance_officer",
      tenantSlug: "bennett",
    });
    const unknown = resolveActorContext({
      roleKey: "unknown_role",
      tenantSlug: "bennett",
    });

    expect(mapped.allowed).toBe(true);
    if (mapped.allowed) {
      expect(mapped.actorContext.actorUserId).toBe(mapped.actorContext.userId);
      expect(mapped.actorContext.clientTenantId).toBe(mapped.actorContext.scopes.tenant.clientTenantId);
      expect(mapped.actorContext.roleKey).toBe("compliance_officer");
      expect(mapped.actorContext.roleKeys).toEqual(["compliance_officer"]);
      expect(mapped.actorContext.tenantSlug).toBe("bennett");
    }

    expect(unknown.allowed).toBe(false);
    if (!unknown.allowed) {
      expect(unknown.auditRequired).toBe(true);
      expect(unknown.reasonCode).toBe("WCL_ACTOR_CONTEXT_DENIED");
      expect(unknown.issues).toContain("valid_role_key_required");
    }
  });
});
