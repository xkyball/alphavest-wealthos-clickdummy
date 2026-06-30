import { expect, test } from "@playwright/test";

import { createActorSession } from "../lib/actor-session";
import { routeToSmokePath, screenRoutes } from "../lib/route-registry";
import {
  buildUiActionGuard,
  componentStateForUiState,
  evaluateAdvisorComplianceUi,
  evaluateEvidenceUiState,
  evaluateRoutePageState,
  permissionForUiAction,
  projectRecommendationForUi,
} from "../lib/ui-clickflow-guards";

function routeByPageId(pageId: string) {
  const route = screenRoutes.find((candidate) => candidate.pageId === pageId);
  if (!route) {
    throw new Error(`Missing route ${pageId}`);
  }
  return route;
}

test.describe("UI Clickflow Stage 01-05 shared guard implementation", () => {
  test("Stage 01 separates route shell, action permission, payload visibility and StatePanel mapping", () => {
    const compliance = createActorSession({ roleKey: "compliance_officer", tenantSlug: "bennett" });
    const advisor = createActorSession({ roleKey: "senior_wealth_advisor", tenantSlug: "bennett" });
    const releaseRoute = routeByPageId("040");
    const recommendationId = "recommendation:bennett:ui-clickflow-release";

    const complianceState = evaluateRoutePageState({
      objectId: recommendationId,
      objectScopeIds: [recommendationId],
      route: releaseRoute,
      session: compliance,
    });
    const advisorState = evaluateRoutePageState({
      objectId: recommendationId,
      objectScopeIds: [recommendationId],
      route: releaseRoute,
      session: advisor,
    });
    const validationGuard = buildUiActionGuard({
      permission: complianceState.action,
      validationPassed: false,
    });

    expect(complianceState.routeShellAccessible).toBe(true);
    expect(complianceState.payloadVisible).toBe(true);
    expect(complianceState.action.status).toBe("enabled");
    expect(complianceState.uiState).toBe("SUCCESS_STATE");
    expect(componentStateForUiState(complianceState.uiState)).toBe("success");

    expect(advisorState.routeShellAccessible).toBe(true);
    expect(advisorState.payloadVisible).toBe(true);
    expect(advisorState.action.status).toBe("denied");
    expect(advisorState.action.reasonCode).toBe("DEMO_DENY_COMPLIANCE_RELEASE_REQUIRED");
    expect(advisorState.uiState).toBe("PERMISSION_DENIED_STATE");
    expect(componentStateForUiState(advisorState.uiState)).toBe("denied");

    expect(validationGuard.status).toBe("disabled");
    expect(validationGuard.uiState).toBe("VALIDATION_FAILED_STATE");
    expect(componentStateForUiState("AUDIT_UNAVAILABLE_STATE")).toBe("audit-unavailable");
  });

  test("Stage 02 keeps access and foundation pageflows scoped to mapped tenant context", () => {
    const bennettPrincipal = createActorSession({ roleKey: "principal", tenantSlug: "bennett" });
    const morganPrincipal = createActorSession({ roleKey: "principal", tenantSlug: "morgan" });
    const clientProfileRoute = routeByPageId("021");
    const roleConfirmationRoute = routeByPageId("006");

    const ownClientContext = evaluateRoutePageState({
      route: clientProfileRoute,
      session: bennettPrincipal,
    });
    const wrongTenantContext = evaluateRoutePageState({
      clientTenantId: morganPrincipal.tenant.id,
      route: clientProfileRoute,
      session: bennettPrincipal,
    });
    const roleConfirmation = evaluateRoutePageState({
      route: roleConfirmationRoute,
      session: bennettPrincipal,
    });

    expect(routeToSmokePath(clientProfileRoute.route)).toBe("/client/profile");
    expect(ownClientContext.routeScope).toBe("MVP_SUPPORT");
    expect(ownClientContext.uiState).toBe("SUCCESS_STATE");

    expect(wrongTenantContext.uiState).toBe("PERMISSION_DENIED_STATE");
    expect(wrongTenantContext.action.reasonCode).toBe("DEMO_DENY_ACTOR_TENANT_CONTEXT_MISMATCH");
    expect(wrongTenantContext.payloadVisible).toBe(false);

    expect(roleConfirmation.routeScope).toBe("MVP_SUPPORT");
    expect(roleConfirmation.routeShellAccessible).toBe(true);
  });

  test("Stage 03 models upload and evidence review without upload-to-sufficiency shortcut", () => {
    const uploadOnly = evaluateEvidenceUiState({
      accepted: false,
      current: true,
      relatedObjectId: "document:bennett:upload",
      relatedObjectType: "DOCUMENT",
      requiredObjectId: "document:bennett:upload",
      requiredObjectType: "DOCUMENT",
      reviewed: false,
      status: "CREATED",
      uploaded: true,
      visibilityStatus: "INTERNAL_ONLY",
    });
    const sufficient = evaluateEvidenceUiState({
      accepted: true,
      current: true,
      relatedObjectId: "recommendation:bennett:release",
      relatedObjectType: "RECOMMENDATION",
      requiredObjectId: "recommendation:bennett:release",
      requiredObjectType: "RECOMMENDATION",
      reviewed: true,
      status: "VALIDATED",
      uploaded: true,
      visibilityStatus: "REDACTED",
    });

    expect(uploadOnly.stage).toBe("UPLOAD_RECEIVED");
    expect(uploadOnly.canEnterReviewQueue).toBe(true);
    expect(uploadOnly.canSupportComplianceRelease).toBe(false);
    expect(uploadOnly.noUploadToReleaseShortcut).toBe(true);
    expect(uploadOnly.uiState).toBe("DISABLED_GATED_ACTION_STATE");
    expect(uploadOnly.missing).toEqual(["evidence_review", "evidence_acceptance", "client_safe_visibility"]);

    expect(sufficient.stage).toBe("SUFFICIENT_FOR_SCOPED_GATE");
    expect(sufficient.canSupportComplianceRelease).toBe(true);
    expect(sufficient.uiState).toBe("SUCCESS_STATE");
  });

  test("Stage 04 keeps AI/rules drafts internal and hides them from client projections", () => {
    const analyst = createActorSession({ roleKey: "analyst", tenantSlug: "bennett" });
    const principal = createActorSession({ roleKey: "principal", tenantSlug: "bennett" });
    const draftPayload = {
      clientSummary: "Potential liquidity path.",
      clientSummaryDraft: "AI draft with unsupported claim.",
      clientTenantId: analyst.tenant.id,
      clientVisible: false,
      complianceNotes: "Compliance must not leak.",
      internalRationale: "Internal rationale must not leak.",
      objectId: "recommendation:bennett:ai-draft",
      recommendationStatus: "AI_DRAFT" as const,
      summaryInternal: "Internal-only draft.",
      visibilityStatus: "INTERNAL_ONLY" as const,
    };

    const internalProjection = projectRecommendationForUi({
      payload: draftPayload,
      session: analyst,
    });
    const clientProjection = projectRecommendationForUi({
      payload: draftPayload,
      session: principal,
    });

    expect(internalProjection.visible).toBe(true);
    expect(internalProjection.payloadKeys).toContain("clientSummaryDraft");
    expect(internalProjection.cleanForClient).toBe(false);
    expect(internalProjection.uiState).toBe("REDACTED_INTERNAL_ONLY_STATE");

    expect(clientProjection.visible).toBe(false);
    expect(clientProjection.payloadKeys).toEqual([]);
    expect(clientProjection.hiddenFields).toEqual([
      "clientSummary",
      "clientSummaryDraft",
      "summaryInternal",
      "internalRationale",
      "complianceNotes",
    ]);
    expect(clientProjection.uiState).toBe("CLIENT_VISIBILITY_HIDDEN_STATE");
  });

  test("Stage 05 separates advisor approval from compliance release and audit persistence", () => {
    const advisor = createActorSession({ roleKey: "senior_wealth_advisor", tenantSlug: "bennett" });
    const compliance = createActorSession({ roleKey: "compliance_officer", tenantSlug: "bennett" });
    const recommendationId = "recommendation:bennett:advisor-compliance";
    const advisorPermission = permissionForUiAction({
      action: "APPROVE",
      actor: advisor.actor,
      clientTenantId: advisor.tenant.id,
      objectId: recommendationId,
      objectType: "RECOMMENDATION",
      role: advisor.role,
      visibilityStatus: "ADVISOR_VISIBLE",
    });
    const compliancePermission = permissionForUiAction({
      action: "RELEASE",
      actor: compliance.actor,
      clientTenantId: compliance.tenant.id,
      objectId: recommendationId,
      objectType: "RECOMMENDATION",
      role: compliance.role,
      visibilityStatus: "COMPLIANCE_VISIBLE",
    });

    const pendingCompliance = evaluateAdvisorComplianceUi({
      advisorApprovalStatus: "APPROVED",
      advisorPermission,
      auditPersistenceAvailable: true,
      compliancePermission,
      complianceStatus: "PENDING",
      evidence: {
        accepted: true,
        current: true,
        relatedObjectId: recommendationId,
        relatedObjectType: "RECOMMENDATION",
        requiredObjectId: recommendationId,
        requiredObjectType: "RECOMMENDATION",
        reviewed: true,
        status: "VALIDATED",
        visibilityStatus: "REDACTED",
      },
      payloadReady: true,
      recommendationStatus: "ADVISOR_APPROVED",
    });
    const auditUnavailable = evaluateAdvisorComplianceUi({
      ...pendingComplianceInput(advisorPermission, compliancePermission, recommendationId),
      auditPersistenceAvailable: false,
    });
    const released = evaluateAdvisorComplianceUi({
      ...pendingComplianceInput(advisorPermission, compliancePermission, recommendationId),
      auditPersistenceAvailable: true,
      complianceStatus: "RELEASED",
      recommendationStatus: "RELEASED_TO_CLIENT",
    });

    expect(advisorPermission.allowed).toBe(true);
    expect(compliancePermission.allowed).toBe(true);
    expect(pendingCompliance.advisorAction.status).toBe("enabled");
    expect(pendingCompliance.advisorApprovalIsClientRelease).toBe(false);
    expect(pendingCompliance.complianceRelease.passed).toBe(true);
    expect(pendingCompliance.clientVisibility.passed).toBe(false);
    expect(pendingCompliance.clientVisibility.missing).toContain("recommendation_released_to_client");
    expect(pendingCompliance.clientVisibility.missing).toContain("compliance_release");

    expect(auditUnavailable.complianceAction.status).toBe("disabled");
    expect(auditUnavailable.complianceAction.uiState).toBe("AUDIT_UNAVAILABLE_STATE");
    expect(auditUnavailable.complianceRelease.missing).toContain("audit_persistence");

    expect(released.complianceRelease.passed).toBe(true);
    expect(released.clientVisibility.passed).toBe(true);
    expect(released.uiState).toBe("SUCCESS_STATE");
  });
});

function pendingComplianceInput(
  advisorPermission: ReturnType<typeof permissionForUiAction>,
  compliancePermission: ReturnType<typeof permissionForUiAction>,
  recommendationId: string,
) {
  return {
    advisorApprovalStatus: "APPROVED" as const,
    advisorPermission,
    compliancePermission,
    complianceStatus: "PENDING" as const,
    evidence: {
      accepted: true,
      current: true,
      relatedObjectId: recommendationId,
      relatedObjectType: "RECOMMENDATION" as const,
      requiredObjectId: recommendationId,
      requiredObjectType: "RECOMMENDATION" as const,
      reviewed: true,
      status: "VALIDATED" as const,
      visibilityStatus: "REDACTED" as const,
    },
    payloadReady: true,
    recommendationStatus: "ADVISOR_APPROVED" as const,
  };
}
