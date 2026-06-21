import type { ComponentState } from "@/components/ui/state-panel";
import type { DemoActor, DemoRole, DemoSession } from "@/lib/demo-session";
import { demoPlatformTenantId } from "@/lib/demo-session";
import type {
  ComplianceStatus,
  EvidenceStatus,
  ObjectType,
  PermissionAction,
  RecommendationStatus,
  ReviewStatus,
  UUID,
  VisibilityStatus,
} from "@/lib/domain-types";
import { evidenceService, type EvidenceSufficiencyInput } from "@/lib/evidence-service";
import { permissionEngine, type PermissionDecision } from "@/lib/permission-engine";
import type { ScreenRoute } from "@/lib/route-registry";
import { visibilityEngine, type DecisionVisibilityPayload, type RecommendationVisibilityPayload } from "@/lib/visibility-engine";
import { workflowGate, type WorkflowGateResult } from "@/lib/workflow-gate";

export type UiClickflowState =
  | "LOADING_STATE"
  | "ERROR_STATE"
  | "EMPTY_STATE"
  | "PERMISSION_DENIED_STATE"
  | "DISABLED_GATED_ACTION_STATE"
  | "CLIENT_VISIBILITY_HIDDEN_STATE"
  | "REDACTED_INTERNAL_ONLY_STATE"
  | "BLOCKED_STATE"
  | "VALIDATION_FAILED_STATE"
  | "AUDIT_UNAVAILABLE_STATE"
  | "SUCCESS_STATE";

export type UiActionGuardStatus = "enabled" | "disabled" | "denied" | "hidden";

export type UiActionGuard = {
  allowed: boolean;
  disabled: boolean;
  hidden: boolean;
  reason: string;
  reasonCode: string;
  status: UiActionGuardStatus;
  uiState: UiClickflowState;
};

export type UiRoutePageState = {
  action: UiActionGuard;
  componentState: ComponentState;
  payloadVisible: boolean;
  routeScope: string;
  routeShellAccessible: boolean;
  uiState: UiClickflowState;
};

export type UiPayloadProjection = {
  cleanForClient: boolean;
  hiddenFields: string[];
  payloadKeys: string[];
  reason: string;
  reasonCode: string;
  uiState: UiClickflowState;
  visible: boolean;
};

export type AdvisorComplianceUiState = {
  advisorAction: UiActionGuard;
  advisorApprovalIsClientRelease: false;
  clientVisibility: WorkflowGateResult;
  complianceAction: UiActionGuard;
  complianceRelease: WorkflowGateResult;
  uiState: UiClickflowState;
};

const uiStateToComponentState: Record<UiClickflowState, ComponentState> = {
  AUDIT_UNAVAILABLE_STATE: "audit-unavailable",
  BLOCKED_STATE: "blocked",
  CLIENT_VISIBILITY_HIDDEN_STATE: "hidden",
  DISABLED_GATED_ACTION_STATE: "restricted",
  EMPTY_STATE: "empty",
  ERROR_STATE: "error",
  LOADING_STATE: "loading",
  PERMISSION_DENIED_STATE: "denied",
  REDACTED_INTERNAL_ONLY_STATE: "redacted",
  SUCCESS_STATE: "success",
  VALIDATION_FAILED_STATE: "validation",
};

export const uiClickflowForbiddenClientFields = [
  "aiDraft",
  "assumptionsJson",
  "checksum",
  "clientSummaryDraft",
  "complianceNotes",
  "evidenceRecordId",
  "evidenceStatus",
  "evidenceVisibilityStatus",
  "extractionStatus",
  "fileName",
  "fileSizeBytes",
  "internalRationale",
  "mimeType",
  "storageKey",
  "summaryInternal",
] as const;

export function componentStateForUiState(uiState: UiClickflowState): ComponentState {
  return uiStateToComponentState[uiState];
}

export function buildUiActionGuard(input: {
  auditPersistenceAvailable?: boolean;
  gate?: Pick<WorkflowGateResult, "missing" | "passed" | "blockedReason">;
  hidden?: boolean;
  permission: Pick<PermissionDecision, "allowed" | "reason" | "reasonCode">;
  validationPassed?: boolean;
}): UiActionGuard {
  if (input.hidden) {
    return {
      allowed: false,
      disabled: true,
      hidden: true,
      reason: "Action is hidden because payload visibility or route scope is not sufficient.",
      reasonCode: "UI_ACTION_HIDDEN",
      status: "hidden",
      uiState: "CLIENT_VISIBILITY_HIDDEN_STATE",
    };
  }

  if (!input.permission.allowed) {
    return {
      allowed: false,
      disabled: true,
      hidden: false,
      reason: input.permission.reason,
      reasonCode: input.permission.reasonCode,
      status: "denied",
      uiState: "PERMISSION_DENIED_STATE",
    };
  }

  if (input.validationPassed === false) {
    return {
      allowed: false,
      disabled: true,
      hidden: false,
      reason: "Required confirmation or validation input is missing.",
      reasonCode: "UI_VALIDATION_REQUIRED",
      status: "disabled",
      uiState: "VALIDATION_FAILED_STATE",
    };
  }

  if (input.auditPersistenceAvailable === false) {
    return {
      allowed: false,
      disabled: true,
      hidden: false,
      reason: "Audit persistence is required before this critical action can complete.",
      reasonCode: "UI_AUDIT_UNAVAILABLE",
      status: "disabled",
      uiState: "AUDIT_UNAVAILABLE_STATE",
    };
  }

  if (input.gate && !input.gate.passed) {
    return {
      allowed: false,
      disabled: true,
      hidden: false,
      reason: input.gate.blockedReason ?? `Missing gates: ${input.gate.missing.join(", ")}`,
      reasonCode: "UI_WORKFLOW_GATE_BLOCKED",
      status: "disabled",
      uiState: "DISABLED_GATED_ACTION_STATE",
    };
  }

  return {
    allowed: true,
    disabled: false,
    hidden: false,
    reason: input.permission.reason,
    reasonCode: input.permission.reasonCode,
    status: "enabled",
    uiState: "SUCCESS_STATE",
  };
}

export function evaluateRoutePageState(input: {
  clientTenantId?: UUID;
  error?: boolean;
  loading?: boolean;
  objectId?: UUID;
  objectScopeIds?: UUID[];
  route: ScreenRoute;
  session: DemoSession;
}): UiRoutePageState {
  if (input.loading) {
    return {
      action: buildUiActionGuard({
        hidden: true,
        permission: { allowed: false, reason: "Loading route context.", reasonCode: "UI_LOADING" },
      }),
      componentState: componentStateForUiState("LOADING_STATE"),
      payloadVisible: false,
      routeScope: "UNKNOWN",
      routeShellAccessible: false,
      uiState: "LOADING_STATE",
    };
  }

  if (input.error) {
    return {
      action: buildUiActionGuard({
        permission: { allowed: false, reason: "Route context failed to load.", reasonCode: "UI_ROUTE_ERROR" },
      }),
      componentState: componentStateForUiState("ERROR_STATE"),
      payloadVisible: false,
      routeScope: "UNKNOWN",
      routeShellAccessible: false,
      uiState: "ERROR_STATE",
    };
  }

  const boundary = permissionEngine.evaluateRouteBoundary(input.session.actor, input.session.role, input.route, {
    clientTenantId: input.clientTenantId ?? input.session.tenant.id,
    objectId: input.objectId,
    objectScopeIds: input.objectScopeIds,
    platformTenantId: demoPlatformTenantId,
  });

  const actionDecision =
    input.objectId && input.objectScopeIds
      ? permissionEngine.can(
          input.session.actor,
          input.route.permissionAction,
          {
            clientTenantId: input.clientTenantId ?? input.session.tenant.id,
            objectId: input.objectId,
            objectType: input.route.objectType,
            visibilityStatus: input.route.clientVisibilitySensitive ? "COMPLIANCE_VISIBLE" : undefined,
          },
          {
            clientTenantId: input.clientTenantId ?? input.session.tenant.id,
            clientVisibilityState: input.route.clientVisibilitySensitive ? "COMPLIANCE_VISIBLE" : undefined,
            objectScope: {
              clientTenantId: input.clientTenantId ?? input.session.tenant.id,
              objectIds: input.objectScopeIds,
              objectType: input.route.objectType,
            },
            platformTenantId: demoPlatformTenantId,
          },
          input.session.role,
        )
      : boundary.actionDecision;
  const action = buildUiActionGuard({ permission: actionDecision });
  const uiState = boundary.routeShellAccessible
    ? boundary.payloadDecision.allowed
      ? action.uiState
      : "PERMISSION_DENIED_STATE"
    : "BLOCKED_STATE";

  return {
    action,
    componentState: componentStateForUiState(uiState),
    payloadVisible: boundary.payloadDecision.allowed,
    routeScope: boundary.routeScope,
    routeShellAccessible: boundary.routeShellAccessible,
    uiState,
  };
}

export function summarizeClientProjection(input: {
  hiddenFields: string[];
  payload: Record<string, unknown>;
  reason: string;
  reasonCode: string;
  visible: boolean;
}): UiPayloadProjection {
  const safety = visibilityEngine.assertClientProjectionClean({
    hiddenFields: input.hiddenFields,
    payload: input.payload,
    visible: input.visible,
  });

  const internalFieldsHidden = input.hiddenFields.some((field) =>
    (uiClickflowForbiddenClientFields as readonly string[]).includes(field),
  );

  return {
    cleanForClient: safety.clean,
    hiddenFields: input.hiddenFields,
    payloadKeys: Object.keys(input.payload),
    reason: input.reason,
    reasonCode: input.reasonCode,
    uiState: input.visible
      ? safety.clean
        ? "SUCCESS_STATE"
        : "REDACTED_INTERNAL_ONLY_STATE"
      : internalFieldsHidden
        ? "CLIENT_VISIBILITY_HIDDEN_STATE"
        : "PERMISSION_DENIED_STATE",
    visible: input.visible,
  };
}

export function projectRecommendationForUi(input: {
  payload: RecommendationVisibilityPayload;
  session: DemoSession;
}): UiPayloadProjection {
  const projection = visibilityEngine.projectRecommendationPayload(
    input.session.actor,
    input.session.role,
    input.payload,
    demoPlatformTenantId,
    input.session.tenant.id,
  );

  return summarizeClientProjection(projection);
}

export function projectDecisionForUi(input: {
  payload: DecisionVisibilityPayload;
  session: DemoSession;
}): UiPayloadProjection {
  const projection = visibilityEngine.projectDecisionPayload(
    input.session.actor,
    input.session.role,
    input.payload,
    demoPlatformTenantId,
    input.session.tenant.id,
  );

  return summarizeClientProjection(projection);
}

export function evaluateEvidenceUiState(input: EvidenceSufficiencyInput & { uploaded?: boolean }) {
  const lifecycle = evidenceService.evaluateEvidenceLifecycle(input);

  return {
    ...lifecycle,
    uiState: lifecycle.canSupportComplianceRelease
      ? "SUCCESS_STATE"
      : lifecycle.canEnterReviewQueue
        ? "DISABLED_GATED_ACTION_STATE"
        : "BLOCKED_STATE",
  } satisfies typeof lifecycle & { uiState: UiClickflowState };
}

export function evaluateAdvisorComplianceUi(input: {
  advisorPermission: PermissionDecision;
  advisorApprovalStatus: ReviewStatus;
  auditPersistenceAvailable: boolean;
  compliancePermission: PermissionDecision;
  complianceStatus: ComplianceStatus;
  containsAiDraft?: boolean;
  containsInternalRationale?: boolean;
  evidence: EvidenceSufficiencyInput;
  payloadReady: boolean;
  recommendationStatus: RecommendationStatus;
}): AdvisorComplianceUiState {
  const evidenceDecision = evidenceService.evaluateEvidenceSufficiency(input.evidence);
  const complianceRelease = workflowGate.canPassComplianceReleaseGate({
    advisorApprovalStatus: input.advisorApprovalStatus,
    auditPersistenceAvailable: input.auditPersistenceAvailable,
    compliancePermission: input.compliancePermission,
    evidenceDecision,
    payloadReady: input.payloadReady,
  });
  const clientVisibility = workflowGate.canBecomeClientVisible({
    advisorApprovalStatus: input.advisorApprovalStatus,
    complianceStatus: input.complianceStatus,
    containsAiDraft: input.containsAiDraft,
    containsInternalRationale: input.containsInternalRationale,
    evidenceStatus: input.evidence.status as EvidenceStatus,
    permission: input.compliancePermission,
    recommendationStatus: input.recommendationStatus,
  });
  const advisorAction = buildUiActionGuard({ permission: input.advisorPermission });
  const complianceAction = buildUiActionGuard({
    auditPersistenceAvailable: input.auditPersistenceAvailable,
    gate: complianceRelease,
    permission: input.compliancePermission,
  });

  return {
    advisorAction,
    advisorApprovalIsClientRelease: false,
    clientVisibility,
    complianceAction,
    complianceRelease,
    uiState: complianceRelease.passed ? "SUCCESS_STATE" : complianceAction.uiState,
  };
}

export function permissionForUiAction(input: {
  action: PermissionAction;
  actor: DemoActor;
  clientTenantId: UUID;
  objectId?: UUID;
  objectScopeType?: ObjectType;
  objectType: ObjectType;
  role: DemoRole;
  visibilityStatus?: VisibilityStatus;
}): PermissionDecision {
  return permissionEngine.can(
    input.actor,
    input.action,
    {
      clientTenantId: input.clientTenantId,
      objectId: input.objectId,
      objectType: input.objectType,
      visibilityStatus: input.visibilityStatus,
    },
    {
      clientTenantId: input.clientTenantId,
      objectScope: input.objectId
        ? {
            clientTenantId: input.clientTenantId,
            objectIds: [input.objectId],
            objectType: input.objectScopeType ?? input.objectType,
          }
        : undefined,
      platformTenantId: demoPlatformTenantId,
    },
    input.role,
  );
}
