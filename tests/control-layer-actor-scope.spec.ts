import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

import { resolveActorContext } from "../lib/control-layer/actor-context";
import { evaluateControlPermission } from "../lib/control-layer/permission-decision";
import { resolveTenantObjectScope } from "../lib/control-layer/scope-resolver";
import { projectPayloadVisibility } from "../lib/control-layer/visibility-projection";
import { evidenceService } from "../lib/evidence-service";
import { canPassComplianceReleaseGate } from "../lib/workflow-gate";

test.describe("WCL WS-00 to WS-04 control layer spine", () => {
  test("WS-00 verifies current package scripts for the control-layer implementation run", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts.typecheck).toBe("tsc --noEmit");
    expect(packageJson.scripts.lint).toBe("eslint .");
    expect(packageJson.scripts["db:validate"]).toBe("prisma validate");
    expect(packageJson.scripts["test:permissions"]).toContain("tests/permission-engine.spec.ts");
    expect(packageJson.scripts["test:workflow-gate"]).toContain("tests/workflow-gate.spec.ts");
    expect(packageJson.scripts["test:workflow-api"]).toContain("tests/recommendation-review-workflow-api.spec.ts");
    expect(packageJson.scripts["phase:check"]).toContain("pnpm typecheck");
  });

  test("WS-01 resolves mapped actors and denies unknown actor contexts fail-closed", () => {
    const mapped = resolveActorContext({
      correlationId: "wp01-providerless-scope-test",
      roleKey: "compliance_officer",
      tenantSlug: "bennett",
    });
    const unknown = resolveActorContext({ roleKey: "unknown_role", tenantSlug: "bennett" });

    expect(mapped.allowed).toBe(true);
    if (mapped.allowed) {
      expect(mapped.actorContext.actorUserId).toBe(mapped.actorContext.userId);
      expect(mapped.actorContext.correlationId).toBe("wp01-providerless-scope-test");
      expect(mapped.actorContext.demoMode).toBe(true);
      expect(mapped.actorContext.pilotMode).toBe("controlled_paid_pilot_candidate");
      expect(mapped.actorContext.roleKey).toBe("compliance_officer");
      expect(mapped.actorContext.roleKeys).toEqual(["compliance_officer"]);
      expect(mapped.actorContext.scopes).toEqual({
        roleScope: "TENANT",
        tenant: {
          clientTenantId: mapped.actorContext.clientTenantId,
          platformTenantId: mapped.actorContext.platformTenantId,
          tenantSlug: "bennett",
        },
      });
      expect(mapped.actorContext.tenantSlug).toBe("bennett");
    }

    expect(unknown.allowed).toBe(false);
    if (!unknown.allowed) {
      expect(unknown.reasonCode).toBe("WCL_ACTOR_CONTEXT_DENIED");
      expect(unknown.auditRequired).toBe(true);
      expect(unknown.issues).toContain("valid_role_key_required");
    }
  });

  test("WS-01/WS-02 separates tenant scope, object scope and mutation permission", () => {
    const actorResult = resolveActorContext({ roleKey: "compliance_officer", tenantSlug: "bennett" });
    expect(actorResult.allowed).toBe(true);
    if (!actorResult.allowed) throw new Error(actorResult.reason);

    const recommendationId = "recommendation:bennett:wcl-spine";
    const scope = resolveTenantObjectScope(actorResult.actorContext, {
      allowedObjectIds: [recommendationId],
      clientTenantId: actorResult.actorContext.clientTenantId,
      objectId: recommendationId,
      objectType: "RECOMMENDATION",
      requireObjectScope: true,
    });
    const wrongTenant = resolveTenantObjectScope(actorResult.actorContext, {
      clientTenantId: "wrong-tenant-id",
    });

    expect(scope.allowed).toBe(true);
    expect(wrongTenant.allowed).toBe(false);
    if (!wrongTenant.allowed) {
      expect(wrongTenant.reasonCode).toBe("WCL_SCOPE_CROSS_TENANT_DENIED");
    }

    if (!scope.allowed) throw new Error(scope.reason);
    const permission = evaluateControlPermission({
      action: "RELEASE",
      actorContext: actorResult.actorContext,
      objectScope: scope.objectScope,
      subject: {
        clientTenantId: actorResult.actorContext.clientTenantId,
        objectId: recommendationId,
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
    });

    expect(permission.allowed).toBe(true);
    expect(permission.controlLayer).toBe("WCL-03");
    expect(permission.guardDecision).toEqual({
      action: "RELEASE",
      allowed: true,
      auditRequired: true,
      layer: "action",
      objectId: recommendationId,
      objectType: "RECOMMENDATION",
      reason: permission.reason,
      reasonCode: "DEMO_ROLE_AWARE_ALLOW",
      redactionMode: "none",
      secondConfirmationRequired: true,
    });
    expect(permission.objectScopeApplied).toBe(true);
    expect(permission.requiresAudit).toBe(true);
    expect(permission.requiresComplianceReview).toBe(true);

    const deniedPermission = evaluateControlPermission({
      action: "RELEASE",
      actorContext: actorResult.actorContext,
      objectScope: scope.objectScope,
      subject: {
        clientTenantId: actorResult.actorContext.clientTenantId,
        objectId: "recommendation:bennett:outside-scope",
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
    });

    expect(deniedPermission.allowed).toBe(false);
    expect(deniedPermission.guardDecision.layer).toBe("object");
    expect(deniedPermission.guardDecision.auditRequired).toBe(true);
    expect(deniedPermission.guardDecision.reasonCode).toBe("DEMO_DENY_OBJECT_SCOPE_MISMATCH");
  });

  test("WS-02 projects payload fields as visible, redacted or hidden", () => {
    const projection = projectPayloadVisibility(
      {
        clientSummary: "Client-safe released summary.",
        complianceNotes: "Compliance internal notes.",
        riskScore: "high",
      },
      {
        clientSummary: "visible",
        complianceNotes: "hidden",
        riskScore: "redacted",
      },
    );

    expect(projection.visible).toBe(true);
    expect(projection.payload).toEqual({
      clientSummary: "Client-safe released summary.",
      riskScore: "[redacted]",
    });
    expect(projection.hiddenFields).toEqual(["complianceNotes"]);
    expect(projection.redactionMode).toBe("mixed");
    expect(projection.redactedFields).toEqual(["riskScore"]);
  });

  test("WS-03/WS-04 blocks upload-created evidence and audit-missing release gates", () => {
    const evidenceDecision = evidenceService.evaluateEvidenceSufficiency({
      accepted: false,
      current: true,
      relatedObjectId: "recommendation:bennett:wcl-spine",
      relatedObjectType: "RECOMMENDATION",
      requiredObjectId: "recommendation:bennett:wcl-spine",
      requiredObjectType: "RECOMMENDATION",
      reviewed: false,
      status: "CREATED",
      visibilityStatus: "INTERNAL_ONLY",
    });
    const releaseGate = canPassComplianceReleaseGate({
      advisorApprovalStatus: "APPROVED",
      auditPersistenceAvailable: false,
      compliancePermission: { allowed: true, reasonCode: "DEMO_ALLOWED" },
      evidenceDecision,
      payloadReady: true,
    });

    expect(evidenceDecision.sufficient).toBe(false);
    expect(evidenceDecision.releaseImpact).toBe("RELEASE_BLOCKED_NEEDS_EVIDENCE");
    expect(evidenceDecision.exportImpact).toBe("EXPORT_BLOCKED_NEEDS_EVIDENCE");
    expect(releaseGate.passed).toBe(false);
    expect(releaseGate.missing).toContain("evidence_sufficiency");
    expect(releaseGate.missing).toContain("audit_persistence");
  });
});
