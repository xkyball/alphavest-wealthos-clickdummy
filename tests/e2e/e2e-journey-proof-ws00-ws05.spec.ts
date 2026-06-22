import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { demoPlatformTenantId, requireDemoSession } from "../../lib/demo-session";
import { evidenceService } from "../../lib/evidence-service";
import { permissionEngine } from "../../lib/permission-engine";
import { visibilityEngine } from "../../lib/visibility-engine";
import { canBecomeClientVisible, canPassComplianceReleaseGate } from "../../lib/workflow-gate";
import { e2eActorFixtures, invalidActorContext } from "../fixtures/e2e-actors";
import { e2eEvidenceFixtures } from "../fixtures/e2e-evidence";
import { e2eExportFixtures } from "../fixtures/e2e-export";
import { e2eObjectScopeFixtures } from "../fixtures/e2e-object-scope";
import { e2eVisibilityFixtures } from "../fixtures/e2e-visibility";
import { e2eWorkflowFixtures } from "../fixtures/e2e-workflow";
import { e2eAuditCorrelationId, expectedAuditProof } from "../helpers/e2e-audit-correlation";
import { isFailClosedEnvelope } from "../helpers/e2e-fail-closed";
import { forbiddenFieldsPresent } from "../helpers/e2e-redaction";

const requiredTargetFiles = [
  "components/auth-onboarding-screen.tsx",
  "components/admin-tenant-setup-screen.tsx",
  "components/client-intake-screen.tsx",
  "components/internal-workflow-screen.tsx",
  "components/decisions-governance-screen.tsx",
  "components/demo-session-provider.tsx",
  "app/api/demo-workflow/route.ts",
  "app/api/documents/route.ts",
  "app/api/documents/upload/route.ts",
  "lib/audit-service.ts",
  "lib/demo-workflow-mutation.ts",
  "lib/demo-workflow-validation.ts",
  "lib/document-storage-adapter.ts",
  "lib/document-upload-service.ts",
  "lib/evidence-service.ts",
  "lib/permission-engine.ts",
  "lib/review-monitoring-service.ts",
  "lib/visibility-engine.ts",
  "lib/workflow-gate.ts",
  "prisma/seed.ts",
];

function repoFile(relativePath: string) {
  return path.join(process.cwd(), relativePath);
}

test.describe("E2E-WS-00..05 canonical journey proof harness", () => {
  test("@e2e-ws-00 verifies repo reality, source lock and validation scripts", () => {
    for (const relativePath of requiredTargetFiles) {
      expect(existsSync(repoFile(relativePath)), relativePath).toBe(true);
    }

    const pack = readFileSync(repoFile("ALPHAVEST_E2E_JOURNEY_PROOF_25_CODEX_TASK_PACK.md"), "utf8");
    const trueUxHandoff = readFileSync(repoFile("ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md"), "utf8");
    const packageJson = JSON.parse(readFileSync(repoFile("package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };

    expect(pack).toContain("SUPERSEDED_BY_TRUE_UX_HANDOFF");
    expect(pack).toContain("ALPHAVEST_TRUE_UX_IMPLEMENTATION_HANDOFF.md");
    expect(trueUxHandoff).toContain("Final execution authority created here.");
    expect(trueUxHandoff).toContain("Full validation suite");
    expect(packageJson.scripts.typecheck).toBe("tsc --noEmit");
    expect(packageJson.scripts.lint).toBe("eslint .");
    expect(packageJson.scripts["db:validate"]).toBe("prisma validate");
    expect(packageJson.scripts["test:workflow-api"]).toContain("tests/demo-workflow-api.spec.ts");
    expect(packageJson.scripts["test:permissions"]).toContain("tests/permission-engine.spec.ts");
  });

  test("@e2e-ws-01 @e2e-cj-001 maps invited actors and denies unknown actor contexts", () => {
    expect(e2eActorFixtures.bennettPrincipal.roleKey).toBe("principal");
    expect(e2eActorFixtures.bennettPrincipal.clientTenantId).not.toBe(
      e2eObjectScopeFixtures.morgan.clientTenantId,
    );
    expect(e2eActorFixtures.morganCfo.roleKey).toBe("family_cfo");
    expect(e2eActorFixtures.morganCfo.clientTenantId).toBe(e2eObjectScopeFixtures.morgan.clientTenantId);

    expect(invalidActorContext.allowed).toBe(false);
    if (!invalidActorContext.allowed) {
      expect(invalidActorContext.reasonCode).toBe("WCL_ACTOR_CONTEXT_DENIED");
      expect(invalidActorContext.auditRequired).toBe(true);
      expect(invalidActorContext.issues).toContain("valid_role_key_required");
    }
  });

  test("@e2e-ws-02 @e2e-cj-002 proves tenant setup authority does not imply unsafe activation", () => {
    const admin = requireDemoSession({ roleKey: "admin", tenantSlug: "morgan" });
    const client = requireDemoSession({ roleKey: "principal", tenantSlug: "morgan" });

    const adminAssign = permissionEngine.can(
      admin.actor,
      "ASSIGN",
      {
        clientTenantId: admin.tenant.id,
        objectType: "ROLE",
        sensitivity: "RESTRICTED",
      },
      {
        clientTenantId: admin.tenant.id,
        platformTenantId: demoPlatformTenantId,
        sensitivity: "RESTRICTED",
      },
      admin.role,
    );
    const clientAssign = permissionEngine.can(
      client.actor,
      "ASSIGN",
      {
        clientTenantId: client.tenant.id,
        objectType: "ROLE",
        sensitivity: "RESTRICTED",
      },
      {
        clientTenantId: client.tenant.id,
        platformTenantId: demoPlatformTenantId,
        sensitivity: "RESTRICTED",
      },
      client.role,
    );

    expect(adminAssign.allowed).toBe(true);
    expect(adminAssign.requiresAudit).toBe(true);
    expect(adminAssign.requiresSecondConfirmation).toBe(true);
    expect(clientAssign.allowed).toBe(false);
    expect(clientAssign.reasonCode).toBe("DEMO_DENY_ACCESS_APPROVER_REQUIRED");
  });

  test("@e2e-ws-02 @e2e-cj-003 proves context payloads are tenant-scoped and client-redacted", () => {
    const morganCfo = requireDemoSession({ roleKey: "family_cfo", tenantSlug: "morgan" });
    const summitPrincipal = requireDemoSession({ roleKey: "principal", tenantSlug: "summit" });
    const documentPayload = {
      checksum: "internal-checksum",
      clientTenantId: e2eObjectScopeFixtures.morgan.clientTenantId,
      clientVisible: false,
      documentType: "financial_statement",
      evidenceRecordId: e2eObjectScopeFixtures.morgan.evidenceRecordId,
      evidenceStatus: "CREATED",
      evidenceVisibilityStatus: "INTERNAL_ONLY" as const,
      extractionStatus: "pending",
      fileName: "morgan-proof.pdf",
      fileSizeBytes: 1200,
      id: e2eObjectScopeFixtures.morgan.documentId,
      sensitivity: "CONFIDENTIAL" as const,
      status: "UPLOADED",
      storageKey: "demo/morgan/documents/morgan-proof.pdf",
      title: "Morgan source document",
    };

    const morganProjection = visibilityEngine.projectDocumentPayload(
      morganCfo.actor,
      morganCfo.role,
      documentPayload,
      demoPlatformTenantId,
      morganCfo.tenant.id,
    );
    const wrongTenantProjection = visibilityEngine.projectDocumentPayload(
      summitPrincipal.actor,
      summitPrincipal.role,
      documentPayload,
      demoPlatformTenantId,
      summitPrincipal.tenant.id,
    );

    expect(morganProjection.visible).toBe(true);
    expect(morganProjection.reasonCode).toBe("DEMO_CLIENT_SOURCE_DOCUMENT_PROJECTION");
    expect(morganProjection.payload).not.toHaveProperty("storageKey");
    expect(morganProjection.payload).not.toHaveProperty("checksum");
    expect(morganProjection.payload).not.toHaveProperty("evidenceStatus");
    expect(morganProjection.hiddenFields).toEqual(
      expect.arrayContaining(["storageKey", "checksum", "evidenceStatus", "evidenceVisibilityStatus"]),
    );

    expect(wrongTenantProjection.visible).toBe(false);
    expect(wrongTenantProjection.permission.reasonCode).toBe("DEMO_DENY_CROSS_TENANT");
    expect(wrongTenantProjection.payload).toEqual({});
  });

  test("@e2e-ws-03 @e2e-cj-004 @e2e-cj-025 proves upload intake remains upload-only and fail-closed", () => {
    expect(e2eEvidenceFixtures.uploadedOnlyLifecycle.stage).toBe("UPLOAD_RECEIVED");
    expect(e2eEvidenceFixtures.uploadedOnlyLifecycle.canEnterReviewQueue).toBe(true);
    expect(e2eEvidenceFixtures.uploadedOnlyLifecycle.canSupportComplianceRelease).toBe(false);
    expect(e2eEvidenceFixtures.uploadedOnlyLifecycle.noUploadToReleaseShortcut).toBe(true);
    expect(e2eEvidenceFixtures.uploadedOnlyLifecycle.missing).toContain("evidence_review");

    expect(
      isFailClosedEnvelope({
        mutated: false,
        noClientRelease: true,
        ok: false,
        releaseUnlocked: false,
        sufficiency: false,
      }),
    ).toBe(true);
  });

  test("@e2e-ws-03 @e2e-cj-005 proves only reviewed scoped current evidence can support release gates", () => {
    expect(e2eEvidenceFixtures.linkedSufficient.sufficient).toBe(true);
    expect(e2eEvidenceFixtures.linkedSufficient.releaseImpact).toBe("RELEASE_ALLOWED_FOR_SCOPED_GATE");

    for (const blocked of [e2eEvidenceFixtures.staleLinked, e2eEvidenceFixtures.wrongScope]) {
      expect(blocked.sufficient).toBe(false);
      expect(blocked.releaseImpact).toBe("RELEASE_BLOCKED_NEEDS_EVIDENCE");
      expect(blocked.exportImpact).toBe("EXPORT_BLOCKED_NEEDS_EVIDENCE");
    }

    expect(e2eEvidenceFixtures.staleLinked.missing).toContain("evidence_current");
    expect(e2eEvidenceFixtures.wrongScope.missing).toContain("evidence_object_id_scope");
  });

  test("@e2e-ws-04 @e2e-cj-006 creates internal trigger authority without client release", () => {
    const analyst = requireDemoSession({ roleKey: "analyst", tenantSlug: "morgan" });
    const triggerPermission = permissionEngine.can(
      analyst.actor,
      "CREATE",
      {
        clientTenantId: analyst.tenant.id,
        objectType: "TRIGGER",
        sensitivity: "CONFIDENTIAL",
      },
      {
        clientTenantId: analyst.tenant.id,
        platformTenantId: demoPlatformTenantId,
        sensitivity: "CONFIDENTIAL",
      },
      analyst.role,
    );
    const clientGate = canBecomeClientVisible(e2eWorkflowFixtures.aiDraftInternalOnly);

    expect(triggerPermission.allowed).toBe(true);
    expect(triggerPermission.requiresAudit).toBe(true);
    expect(clientGate.passed).toBe(false);
    expect(clientGate.missing).toContain("ai_draft_internal_only");
  });

  test("@e2e-ws-04 @e2e-cj-007 keeps AI/rules drafts internal-only across gate and projection", () => {
    const analyst = requireDemoSession({ roleKey: "analyst", tenantSlug: "morgan" });
    const principal = requireDemoSession({ roleKey: "principal", tenantSlug: "morgan" });

    const internalProjection = visibilityEngine.projectRecommendationPayload(
      analyst.actor,
      analyst.role,
      e2eVisibilityFixtures.internalDraftRecommendation,
      demoPlatformTenantId,
      analyst.tenant.id,
    );
    const clientProjection = visibilityEngine.projectRecommendationPayload(
      principal.actor,
      principal.role,
      e2eVisibilityFixtures.internalDraftRecommendation,
      demoPlatformTenantId,
      principal.tenant.id,
    );
    const gate = canBecomeClientVisible(e2eWorkflowFixtures.aiDraftInternalOnly);

    expect(internalProjection.visible).toBe(true);
    expect(internalProjection.payload.clientSummaryDraft).toBeTruthy();
    expect(clientProjection.visible).toBe(false);
    expect(clientProjection.payload).toEqual({});
    expect(gate.passed).toBe(false);
    expect(gate.missing).toContain("internal_rationale_hidden");
  });

  test("@e2e-ws-04 @e2e-cj-008 blocks unsupported draft advancement until analyst rebuild", () => {
    const gate = canBecomeClientVisible(e2eWorkflowFixtures.unsupportedClaimRejected);
    const auditProof = expectedAuditProof({
      action: "reject_unsupported_claim",
      critical: true,
      result: "BLOCKED",
    });

    expect(gate.passed).toBe(false);
    expect(gate.missing).toContain("recommendation_released_to_client");
    expect(gate.missing).toContain("ai_draft_internal_only");
    expect(auditProof.failClosedWhenUnavailable).toBe(true);
    expect(e2eAuditCorrelationId("E2E-CJ-008", auditProof.action)).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  test("@e2e-ws-05 @e2e-cj-009 proves advisor approval is not compliance release", () => {
    const gate = canBecomeClientVisible(e2eWorkflowFixtures.advisorApprovedNotReleased);

    expect(gate.passed).toBe(false);
    expect(gate.missing).toContain("recommendation_released_to_client");
    expect(gate.missing).toContain("compliance_release");
    expect(gate.missing).not.toContain("advisor_approval");
  });

  test("@e2e-ws-05 @e2e-cj-010 proves compliance release requires advisor, evidence, permission and audit", () => {
    const ready = canPassComplianceReleaseGate(e2eWorkflowFixtures.complianceReleaseReady);
    const auditBlocked = canPassComplianceReleaseGate(e2eWorkflowFixtures.complianceReleaseBlockedByAudit);
    const missingEvidence = canPassComplianceReleaseGate({
      advisorApprovalStatus: "APPROVED",
      auditPersistenceAvailable: true,
      compliancePermission: { allowed: true, reasonCode: "E2E_ALLOWED" },
      evidenceDecision: evidenceService.evaluateEvidenceSufficiency({
        accepted: false,
        current: true,
        relatedObjectId: e2eObjectScopeFixtures.morgan.recommendationId,
        relatedObjectType: "RECOMMENDATION",
        requiredObjectId: e2eObjectScopeFixtures.morgan.recommendationId,
        requiredObjectType: "RECOMMENDATION",
        reviewed: false,
        status: "CREATED",
        visibilityStatus: "INTERNAL_ONLY",
      }),
      payloadReady: true,
    });

    expect(ready.passed).toBe(true);
    expect(ready.missing).toEqual([]);
    expect(auditBlocked.passed).toBe(false);
    expect(auditBlocked.missing).toContain("audit_persistence");
    expect(missingEvidence.passed).toBe(false);
    expect(missingEvidence.missing).toContain("evidence_sufficiency");
  });

  test("@e2e-har-005 @e2e-har-006 keeps future visibility/export fixtures non-mutating for WS-06+", () => {
    const principal = requireDemoSession({ roleKey: "principal", tenantSlug: "morgan" });
    const releasedProjection = visibilityEngine.projectRecommendationPayload(
      principal.actor,
      principal.role,
      e2eVisibilityFixtures.releasedRecommendation,
      demoPlatformTenantId,
      principal.tenant.id,
    );

    expect(releasedProjection.visible).toBe(true);
    expect(forbiddenFieldsPresent(releasedProjection.payload)).toEqual([]);
    expect(e2eExportFixtures.morganPreviewOnly.previewed).toBe(true);
    expect(e2eExportFixtures.morganPreviewOnly.approved).toBe(false);
    expect(e2eExportFixtures.morganPreviewOnly.downloaded).toBe(false);
  });
});
