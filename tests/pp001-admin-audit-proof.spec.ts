import { expect, test } from "@playwright/test";

import { evaluateAuditGuard } from "../lib/control-layer/audit-guard";
import { createDemoSession, demoPlatformTenantId } from "../lib/demo-session";
import { permissionEngine, type PermissionSubject } from "../lib/permission-engine";
import type { PermissionAction } from "../lib/domain-types";

type ForbiddenAdminCase = {
  action: PermissionAction;
  expectedReasonCode: string;
  subject: PermissionSubject;
};

test.describe("PP-001 admin non-bypass and denied audit proof", () => {
  test("denies admin attempts to force evidence, release and export gates", () => {
    const admin = createDemoSession({ roleKey: "admin", tenantSlug: "bennett" });
    const forbiddenCases: ForbiddenAdminCase[] = [
      {
        action: "APPROVE",
        expectedReasonCode: "DEMO_DENY_ADMIN_EVIDENCE_NON_BYPASS",
        subject: {
          clientTenantId: admin.tenant.id,
          objectType: "EVIDENCE_RECORD",
          sensitivity: "RESTRICTED",
          visibilityStatus: "COMPLIANCE_VISIBLE",
        },
      },
      {
        action: "RELEASE",
        expectedReasonCode: "DEMO_DENY_COMPLIANCE_RELEASE_REQUIRED",
        subject: {
          clientTenantId: admin.tenant.id,
          objectType: "RECOMMENDATION",
          sensitivity: "RESTRICTED",
          visibilityStatus: "COMPLIANCE_VISIBLE",
        },
      },
      {
        action: "EXPORT",
        expectedReasonCode: "DEMO_DENY_ADMIN_NON_BYPASS",
        subject: {
          clientTenantId: admin.tenant.id,
          objectType: "EXPORT_REQUEST",
          sensitivity: "RESTRICTED",
          visibilityStatus: "REDACTED",
        },
      },
    ];

    for (const item of forbiddenCases) {
      const decision = permissionEngine.can(
        admin.actor,
        item.action,
        item.subject,
        {
          clientTenantId: admin.tenant.id,
          platformTenantId: demoPlatformTenantId,
        },
        admin.role,
      );

      expect(decision.allowed, item.expectedReasonCode).toBe(false);
      expect(decision.reasonCode).toBe(item.expectedReasonCode);
      expect(decision.requiresAudit).toBe(true);
      expect(decision.requiresSecondConfirmation).toBe(true);
    }
  });

  test("requires audit proof or fail-closed behavior for denied admin evidence action", () => {
    const admin = createDemoSession({ roleKey: "admin", tenantSlug: "bennett" });
    const denied = permissionEngine.can(
      admin.actor,
      "APPROVE",
      {
        clientTenantId: admin.tenant.id,
        objectType: "EVIDENCE_RECORD",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: admin.tenant.id,
        platformTenantId: demoPlatformTenantId,
      },
      admin.role,
    );

    expect(denied.allowed).toBe(false);
    expect(denied.requiresAudit).toBe(true);

    const auditInput = {
      action: "APPROVE" as const,
      actorRoleKey: admin.role.key,
      actorUserId: admin.actor.id,
      auditPersistenceAvailable: true,
      clientTenantId: admin.tenant.id,
      correlationId: "pp001-admin-denied-evidence",
      eventType: "pp001.admin.denied_evidence_sufficiency",
      nextState: "LINKED",
      platformTenantId: demoPlatformTenantId,
      previousState: "LINKED",
      reason: denied.reason,
      result: "DENIED" as const,
      targetId: "evidence:bennett:pp001-denied",
      targetType: "EVIDENCE_RECORD" as const,
    };
    const auditAllowed = evaluateAuditGuard(auditInput);

    expect(auditAllowed.allowed).toBe(true);
    if (auditAllowed.allowed) {
      expect(auditAllowed.metadata.criticalActionFamily).toBe("access-denial");
      expect(auditAllowed.metadata.failClosedOnAuditPersistence).toBe(true);
      expect(auditAllowed.metadata.auditMinimumFields).toEqual(
        expect.arrayContaining([
          "actorUserId",
          "actorRoleKey",
          "clientTenantId",
          "targetType",
          "targetId",
          "previousState",
          "nextState",
          "result",
          "reason",
          "correlationId",
        ]),
      );
    }

    const blockedPersistence = evaluateAuditGuard({
      ...auditInput,
      auditPersistenceAvailable: false,
    });
    expect(blockedPersistence.allowed).toBe(false);
    if (!blockedPersistence.allowed) {
      expect(blockedPersistence.reasonCode).toBe("WCL_AUDIT_GUARD_BLOCKED");
      expect(blockedPersistence.missingFields).toEqual(["auditPersistenceAvailable"]);
    }

    const blockedMinimumFields = evaluateAuditGuard({
      ...auditInput,
      targetId: "",
    });
    expect(blockedMinimumFields.allowed).toBe(false);
    if (!blockedMinimumFields.allowed) {
      expect(blockedMinimumFields.missingFields).toContain("targetId");
    }
  });
});
