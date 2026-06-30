import { readFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test } from "@playwright/test";

import { createDemoSession } from "../lib/demo-session";
import { screenRoutes } from "../lib/route-registry";
import {
  componentStateForUiState,
  evaluateClientDecisionRoomUi,
  evaluateDeferredRouteUiState,
  evaluateExportUiState,
  evaluateOffboardingUiState,
  evaluateRoutePageState,
  permissionForUiAction,
} from "../lib/ui-clickflow-guards";
import { controlLayerActors, safeExportFile } from "./fixtures/control-layer-fixtures";

function routeByPageId(pageId: string) {
  const route = screenRoutes.find((candidate) => candidate.pageId === pageId);
  if (!route) {
    throw new Error(`Missing route ${pageId}`);
  }
  return route;
}

test.describe("UI Clickflow Stage 06-10 guard implementation", () => {
  test("Stage 06 keeps the client decision room fail-closed until released-only gates pass", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const compliance = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "bennett" });
    const recommendationId = "recommendation:bennett:client-room";
    const compliancePermission = permissionForUiAction({
      action: "RELEASE",
      actor: compliance.actor,
      clientTenantId: compliance.tenant.id,
      objectId: recommendationId,
      objectType: "RECOMMENDATION",
      role: compliance.role,
      visibilityStatus: "COMPLIANCE_VISIBLE",
    });

    const unreleased = evaluateClientDecisionRoomUi({
      advisorApprovalStatus: "APPROVED",
      compliancePermission,
      complianceStatus: "PENDING",
      containsAiDraft: true,
      containsInternalRationale: true,
      evidenceStatus: "VALIDATED",
      payload: {
        clientSummary: "Draft summary must remain hidden.",
        clientSummaryDraft: "AI draft must not reach the client.",
        clientTenantId: principal.tenant.id,
        clientVisible: false,
        complianceNotes: "Compliance-only note.",
        internalRationale: "Internal rationale.",
        objectId: recommendationId,
        recommendationStatus: "ADVISOR_APPROVED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      recommendationStatus: "ADVISOR_APPROVED",
      session: principal,
    });
    const released = evaluateClientDecisionRoomUi({
      advisorApprovalStatus: "APPROVED",
      compliancePermission,
      complianceStatus: "RELEASED",
      evidenceStatus: "VALIDATED",
      payload: {
        clientSummary: "Released client-safe summary.",
        clientTenantId: principal.tenant.id,
        clientVisible: true,
        objectId: recommendationId,
        recommendationStatus: "RELEASED_TO_CLIENT",
        visibilityStatus: "CLIENT_VISIBLE",
      },
      recommendationStatus: "RELEASED_TO_CLIENT",
      session: principal,
    });

    expect(unreleased.releasedOnly).toBe(false);
    expect(unreleased.clientProjection.visible).toBe(false);
    expect(unreleased.clientVisibility.missing).toContain("recommendation_released_to_client");
    expect(unreleased.clientVisibility.missing).toContain("ai_draft_internal_only");
    expect(unreleased.clientVisibility.missing).toContain("internal_rationale_hidden");
    expect(unreleased.uiState).toBe("CLIENT_VISIBILITY_HIDDEN_STATE");
    expect(componentStateForUiState(unreleased.uiState)).toBe("hidden");

    expect(released.releasedOnly).toBe(true);
    expect(released.clientProjection.visible).toBe(true);
    expect(released.clientProjection.cleanForClient).toBe(true);
    expect(released.clientProjection.payloadKeys).toEqual(["clientSummary"]);
    expect(released.uiState).toBe("SUCCESS_STATE");
  });

  test("Stage 07 proves governance negative safety without admin release/export/evidence bypass", () => {
    const admin = createDemoSession({ roleKey: "admin", tenantSlug: "bennett" });
    const compliance = createDemoSession({ roleKey: "compliance_officer", tenantSlug: "bennett" });
    const morganPrincipal = createDemoSession({ roleKey: "principal", tenantSlug: "morgan" });
    const recommendationId = "recommendation:bennett:admin-bypass";
    const exportId = "export:bennett:admin-bypass";
    const evidenceId = "evidence:bennett:admin-bypass";

    const adminRelease = permissionForUiAction({
      action: "RELEASE",
      actor: admin.actor,
      clientTenantId: admin.tenant.id,
      objectId: recommendationId,
      objectType: "RECOMMENDATION",
      role: admin.role,
      visibilityStatus: "COMPLIANCE_VISIBLE",
    });
    const adminExport = permissionForUiAction({
      action: "EXPORT",
      actor: admin.actor,
      clientTenantId: admin.tenant.id,
      objectId: exportId,
      objectType: "EXPORT_REQUEST",
      role: admin.role,
      visibilityStatus: "REDACTED",
    });
    const adminEvidence = permissionForUiAction({
      action: "APPROVE",
      actor: admin.actor,
      clientTenantId: admin.tenant.id,
      objectId: evidenceId,
      objectType: "EVIDENCE_RECORD",
      role: admin.role,
      visibilityStatus: "REDACTED",
    });
    const complianceEvidence = permissionForUiAction({
      action: "APPROVE",
      actor: compliance.actor,
      clientTenantId: compliance.tenant.id,
      objectId: evidenceId,
      objectType: "EVIDENCE_RECORD",
      role: compliance.role,
      visibilityStatus: "REDACTED",
    });
    const wrongTenant = evaluateRoutePageState({
      clientTenantId: morganPrincipal.tenant.id,
      route: routeByPageId("043"),
      session: createDemoSession({ roleKey: "principal", tenantSlug: "bennett" }),
    });

    expect(adminRelease.allowed).toBe(false);
    expect(adminRelease.reasonCode).toBe("DEMO_DENY_COMPLIANCE_RELEASE_REQUIRED");
    expect(adminExport.allowed).toBe(false);
    expect(adminExport.reasonCode).toBe("DEMO_DENY_ADMIN_NON_BYPASS");
    expect(adminEvidence.allowed).toBe(false);
    expect(adminEvidence.reasonCode).toBe("DEMO_DENY_ADMIN_EVIDENCE_NON_BYPASS");
    expect(complianceEvidence.allowed).toBe(true);
    expect(wrongTenant.uiState).toBe("PERMISSION_DENIED_STATE");
    expect(wrongTenant.payloadVisible).toBe(false);
  });

  test("Stage 08 separates export preview, approval, generation, download/share and forbidden payloads", () => {
    const unsafePreview = evaluateExportUiState({
      actorContext: controlLayerActors.summitCompliance,
      approvalComplete: false,
      auditPersistenceAvailable: true,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY", "AI_DRAFT"],
      redactionProfile: "client-safe-redacted",
      scopeItems: [
        {
          access: "Allowed",
          id: "recommendation:summit:unsafe-preview",
          name: "Internal draft",
          payloadClassifications: ["AI_DRAFT"],
          selected: true,
          type: "recommendation",
        },
      ],
      targetId: "export:summit:unsafe-preview",
    });
    const safeApproved = evaluateExportUiState({
      actorContext: controlLayerActors.summitCompliance,
      approvalComplete: true,
      auditPersistenceAvailable: true,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY", "RELEASED_EVIDENCE_SUMMARY"],
      redactionProfile: "client-safe-redacted",
      scopeItems: [
        {
          access: "Allowed",
          id: "recommendation:summit:safe-export",
          name: "Released recommendation",
          payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
          selected: true,
          type: "recommendation",
        },
      ],
      targetId: "export:summit:safe-export",
    });
    const auditUnavailable = evaluateExportUiState({
      actorContext: controlLayerActors.summitCompliance,
      approvalComplete: true,
      auditPersistenceAvailable: false,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
      redactionProfile: "client-safe-redacted",
      scopeItems: [
        {
          access: "Allowed",
          id: "recommendation:summit:audit-export",
          name: "Released recommendation",
          payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
          selected: true,
          type: "recommendation",
        },
      ],
      targetId: "export:summit:audit-export",
    });

    expect(unsafePreview.previewIsApproval).toBe(false);
    expect(unsafePreview.exportSafety.lifecycle.canApprove).toBe(true);
    expect(unsafePreview.exportSafety.lifecycle.canGenerate).toBe(false);
    expect(unsafePreview.exportSafety.lifecycle.canDownload).toBe(false);
    expect(unsafePreview.exportSafety.lifecycle.canShare).toBe(false);
    expect(unsafePreview.forbiddenPayloads).toContain("AI_DRAFT");
    expect(unsafePreview.uiState).toBe("REDACTED_INTERNAL_ONLY_STATE");

    expect(safeApproved.exportSafety.exportGate.allowedToGenerate).toBe(true);
    expect(safeApproved.uiState).toBe("SUCCESS_STATE");
    expect(auditUnavailable.uiState).toBe("AUDIT_UNAVAILABLE_STATE");
  });

  test("Stage 09 reflects True-UX registered-only route scopes and offboarding guard-only state", () => {
    const communication = evaluateDeferredRouteUiState(routeByPageId("052"));
    const reviewMonitoring = evaluateDeferredRouteUiState(routeByPageId("068"));
    const kycReview = evaluateDeferredRouteUiState(routeByPageId("064"));
    const committeeReview = evaluateDeferredRouteUiState(routeByPageId("070"));
    const reference = evaluateDeferredRouteUiState(routeByPageId("061"));
    const offboarding = evaluateOffboardingUiState({
      actorContext: controlLayerActors.summitCompliance,
      affectedUserIds: ["user:summit:external-advisor"],
      auditCorrelationId: "offboarding:summit:ui-clickflow",
      finalExportPackage: {
        approvalRequired: true,
        approved: true,
        auditPersistenceAvailable: true,
        expiresAt: new Date("2026-06-30T00:00:00.000Z"),
        exportRequestId: "export:summit:offboarding-ui",
        externalShare: false,
        file: safeExportFile,
        payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
        redactionProfile: "offboarding-redacted",
        selectedObjectCount: 1,
        tenantSlug: "summit",
        watermark: true,
      },
      finalExportScopeItems: [
        {
          access: "Allowed",
          id: "decision:summit:released",
          name: "Released decision",
          payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
          selected: true,
          type: "decision",
        },
      ],
      legalHoldFlag: true,
      payloadClassifications: ["CLIENT_SAFE_SUMMARY"],
      retentionPolicy: "wealthos_retention_7y",
    });

    for (const deferred of [communication]) {
      expect(deferred.uiState).toBe("P1_DEFERRED_STATE");
      expect(deferred.routeScope).toBe("P1_AFTER_MVP");
      expect(deferred.reasonCode).toBe("P1_DEFERRED");
      expect(deferred.routeShellAccessible).toBe(false);
      expect(deferred.action.hidden).toBe(true);
      expect(deferred.productiveActionsEnabled).toBe(false);
    }

    expect(reviewMonitoring.uiState).toBe("SUCCESS_STATE");
    expect(reviewMonitoring.routeScope).toBe("MVP");
    expect(reviewMonitoring.reasonCode).toBe("UI_ROUTE_IMPLEMENTATION_SCOPE_ALLOWED");
    expect(reviewMonitoring.routeShellAccessible).toBe(true);
    expect(reviewMonitoring.productiveActionsEnabled).toBe(true);

    for (const held of [kycReview, committeeReview]) {
      expect(held.uiState).toBe("HOLD_BLOCKED_STATE");
      expect(held.routeScope).toBe("HOLD_PENDING_DECISION");
      expect(held.reasonCode).toBe("HOLD_PENDING_SCOPE_UNLOCK");
      expect(held.routeShellAccessible).toBe(false);
      expect(held.action.hidden).toBe(true);
      expect(held.productiveActionsEnabled).toBe(false);
    }

    expect(reference.uiState).toBe("REFERENCE_ONLY_STATE");
    expect(reference.routeShellAccessible).toBe(false);
    expect(reference.productiveActionsEnabled).toBe(false);
    expect(reference.action.hidden).toBe(true);

    expect(offboarding.control.status).toBe("OFFBOARDING_CONTROL_READY");
    expect(offboarding.guardOnly).toBe(true);
    expect(offboarding.productiveActionsEnabled).toBe(false);
    expect(offboarding.uiState).toBe("P1_DEFERRED_STATE");
  });

  test("Stage 10 records that UIF pack has no executable Stage 11-15 definitions", () => {
    const pack = readFileSync(
      join(process.cwd(), "ALPHAVEST_UI_CLICKFLOW_PAGEFLOW_STATE_VISIBILITY_INTERACTION_SOURCE_WORK_PACK.md"),
      "utf8",
    );

    expect(pack).toContain("| Stage 10 | Full UI/pageflow regression and reporting | all UIF tasks | final report |");
    expect(pack).not.toContain("| Stage 11 |");
    expect(pack).not.toContain("| Stage 12 |");
    expect(pack).not.toContain("| Stage 13 |");
    expect(pack).not.toContain("| Stage 14 |");
    expect(pack).not.toContain("| Stage 15 |");
  });
});
