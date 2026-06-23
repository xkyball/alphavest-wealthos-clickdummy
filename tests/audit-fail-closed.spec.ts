import { expect, test } from "@playwright/test";

import { evaluateAuditGuard } from "../lib/control-layer/audit-guard";

const baseAuditInput = {
  action: "RELEASE" as const,
  actorRoleKey: "compliance_officer",
  actorUserId: "actor-1",
  clientTenantId: "tenant-1",
  correlationId: "wcl-audit-correlation-1",
  eventType: "recommendation.release",
  nextState: "RELEASED_TO_CLIENT",
  platformTenantId: "platform-1",
  previousState: "COMPLIANCE_PENDING",
  reason: "Compliance release requires audit persistence.",
  result: "SUCCESS" as const,
  targetId: "recommendation-1",
  targetType: "RECOMMENDATION" as const,
};

test.describe("WCL WS-05 audit guard", () => {
  test("allows critical actions only when audit minimum fields and persistence are available", () => {
    const allowed = evaluateAuditGuard({
      ...baseAuditInput,
      auditPersistenceAvailable: true,
    });

    expect(allowed.allowed).toBe(true);
    if (allowed.allowed) {
      expect(allowed.reasonCode).toBe("WCL_AUDIT_GUARD_ALLOWED");
      expect(allowed.metadata.auditMinimumFields).toContain("correlationId");
      expect(allowed.metadata.correlationId).toBe(baseAuditInput.correlationId);
      expect(allowed.metadata.failClosedOnAuditPersistence).toBe(true);
      expect(allowed.metadata.criticalActionFamily).toBe("release");
    }
  });

  test("blocks critical actions when audit persistence is unavailable", () => {
    const blocked = evaluateAuditGuard({
      ...baseAuditInput,
      auditPersistenceAvailable: false,
    });

    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.reasonCode).toBe("WCL_AUDIT_GUARD_BLOCKED");
      expect(blocked.missingFields).toEqual(["auditPersistenceAvailable"]);
      expect(blocked.reason).toContain("Required audit persistence is unavailable");
    }
  });

  test("blocks critical actions when audit minimum fields are missing", () => {
    const blocked = evaluateAuditGuard({
      ...baseAuditInput,
      actorUserId: "",
      auditPersistenceAvailable: true,
      targetId: "",
    });

    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.missingFields).toContain("actorUserId");
      expect(blocked.missingFields).toContain("targetId");
    }
  });
});
