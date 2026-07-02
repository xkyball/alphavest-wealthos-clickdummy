import {
  clientPortalProjectionState,
  type ClientPortalProjectionState,
} from "@/lib/client-portal-projection-state";
import {
  createActorSession,
  actorPlatformTenantId,
  type ActorSession,
} from "@/lib/actor-session";
import {
  visibilityEngine,
  type DecisionVisibilityPayload,
} from "@/lib/visibility-engine";
import { evaluateAuditGuard, type AuditGuardResult } from "@/lib/control-layer/audit-guard";

export type DomainHProcessId = "BP-067" | "BP-068" | "BP-069";
export type DomainHScreenId = "S019" | "S020" | "S043" | "S044" | "S045" | "S058";
export type DomainHStepId =
  | "BP-067-S01"
  | "BP-067-S02"
  | "BP-067-S03"
  | "BP-068-S01"
  | "BP-068-S02"
  | "BP-068-S03"
  | "BP-069-S01"
  | "BP-069-S02"
  | "BP-069-S03";

export type DomainHStepContract = {
  negativeAcceptance: string;
  positiveAcceptance: string;
  processId: DomainHProcessId;
  requiredScreens: DomainHScreenId[];
  serviceBoundary: string;
  stepId: DomainHStepId;
};

export type DomainHReleasedProjectionUiModel = {
  blockerCopy: string;
  hiddenMaterialCopy: string;
  nextActionEnabled: boolean;
  nextActionHref: string;
  nextActionLabel: string;
  releasedAt: string;
  safe: boolean;
  state: ClientPortalProjectionState;
  statusLabel: string;
  summary: string;
  title: string;
};

export type DomainHReleasedDecisionReadModel = {
  contractId: "DOMAIN_H_RELEASED_PROJECTION_CONTRACT";
  auditLifecycle: DomainHAuditLifecycleProof;
  hiddenFields: string[];
  payloadKeys: string[];
  proof: {
    forbiddenFieldsPresent: string[];
    stepContracts: DomainHStepContract[];
  };
  ui: DomainHReleasedProjectionUiModel;
};

export type DomainHAuditLifecycleProof = {
  auditGuard: AuditGuardResult;
  evidenceRecordId: string | null;
  failClosedOnAuditPersistence: boolean;
  persistedModel: "AuditEvent";
  projectionAllowed: boolean;
  reasonCode: "DOMAIN_H_AUDIT_READY" | "DOMAIN_H_AUDIT_BLOCKED";
};

export const domainHReleasedProjectionStepContracts: DomainHStepContract[] = [
  {
    negativeAcceptance: "Unreleased, advisor-only, compliance-only or wrong-tenant payload projects no client payload.",
    positiveAcceptance: "Released client-visible payload projects only client-safe fields.",
    processId: "BP-067",
    requiredScreens: ["S019"],
    serviceBoundary: "visibilityEngine.projectRecommendationPayload/projectDecisionPayload/projectDocumentPayload",
    stepId: "BP-067-S01",
  },
  {
    negativeAcceptance: "Payload containing internal rationale, compliance notes, draft summary, audit metadata or storage/checksum fields fails the client-safe check.",
    positiveAcceptance: "Hidden/internal fields are absent from client payload and testable as hidden fields.",
    processId: "BP-067",
    requiredScreens: ["S019"],
    serviceBoundary: "visibilityEngine.assertClientProjectionClean",
    stepId: "BP-067-S02",
  },
  {
    negativeAcceptance: "Pending or fail-closed projection does not display approved/released communication language.",
    positiveAcceptance: "Client communication/update action is available only when a safe projection is visible.",
    processId: "BP-067",
    requiredScreens: ["S019"],
    serviceBoundary: "released projection readmodel",
    stepId: "BP-067-S03",
  },
  {
    negativeAcceptance: "Mobile view hides unreleased internal decision/evidence payload.",
    positiveAcceptance: "Mobile view renders only released client-safe summary state.",
    processId: "BP-068",
    requiredScreens: ["S020"],
    serviceBoundary: "visibilityEngine.projectDecisionPayload",
    stepId: "BP-068-S01",
  },
  {
    negativeAcceptance: "Internal notes, draft fields, audit metadata and evidence internals are absent from mobile client role UI.",
    positiveAcceptance: "Mobile fail-closed state is explicit and non-leaky.",
    processId: "BP-068",
    requiredScreens: ["S020"],
    serviceBoundary: "visibilityEngine.assertClientProjectionClean",
    stepId: "BP-068-S02",
  },
  {
    negativeAcceptance: "Mobile next-step cannot imply advice release, export approval or client acceptance.",
    positiveAcceptance: "Mobile next-step copy reflects released-safe status only.",
    processId: "BP-068",
    requiredScreens: ["S020"],
    serviceBoundary: "released projection readmodel",
    stepId: "BP-068-S03",
  },
  {
    negativeAcceptance: "Summary does not render from internal draft, submitted-only decision or export preview-only state.",
    positiveAcceptance: "Summary is derived from released safe payload only.",
    processId: "BP-069",
    requiredScreens: ["S019", "S044", "S045"],
    serviceBoundary: "DOMAIN-H released projection readmodel wrapping visibilityEngine",
    stepId: "BP-069-S01",
  },
  {
    negativeAcceptance: "Any forbidden client field produces a failed proof state and no client-visible summary.",
    positiveAcceptance: "Internal fields are hidden/redacted and the hidden-field list is testable outside operational UI.",
    processId: "BP-069",
    requiredScreens: ["S019", "S044", "S045"],
    serviceBoundary: "DOMAIN-H hidden-field proof adapter",
    stepId: "BP-069-S02",
  },
  {
    negativeAcceptance: "Approved/communicated language is absent for fail-closed, pending, internal or wrong-scope projections.",
    positiveAcceptance: "Approved client-safe summary can be communicated only when safe projection is visible.",
    processId: "BP-069",
    requiredScreens: ["S019", "S020"],
    serviceBoundary: "released projection readmodel",
    stepId: "BP-069-S03",
  },
];

export const domainHClientProjectionSession = createActorSession({ roleKey: "principal", tenantSlug: "bennett" });

export const domainHReleasedDecisionPayload: DecisionVisibilityPayload = {
  aiDraft: "Internal draft text remains outside the client projection.",
  assumptionsJson: { source: "domain-h-internal-model" },
  clientSummary: "Reviewed governance update available for client view.",
  clientTenantId: domainHClientProjectionSession.tenant.id,
  clientVisible: true,
  complianceNotes: "Compliance-only release notes remain internal.",
  decisionState: "RELEASED",
  id: "decision:bennett:domain-h-client-safe",
  internalRationale: "Internal rationale remains hidden.",
  evidenceRecordId: "evidence:bennett:domain-h-client-safe",
  releasedAt: "2026-06-23T09:15:00.000Z",
  sensitivity: "RESTRICTED",
  submittedAt: "2026-06-23T08:30:00.000Z",
  title: "Governance update decision",
  visibilityStatus: "CLIENT_VISIBLE",
};

export const domainHUnreleasedDecisionPayload: DecisionVisibilityPayload = {
  ...domainHReleasedDecisionPayload,
  clientSummary: "Draft summary not available to the client.",
  clientVisible: false,
  decisionState: "SUBMITTED",
  releasedAt: null,
  visibilityStatus: "COMPLIANCE_VISIBLE",
};

export function evaluateDomainHProjectionAuditLifecycle(input: {
  auditPersistenceAvailable?: boolean;
  payload?: DecisionVisibilityPayload;
} = {}): DomainHAuditLifecycleProof {
  const payload = input.payload ?? domainHReleasedDecisionPayload;
  const auditGuard = evaluateAuditGuard({
    action: "RELEASE",
    actorRoleKey: "compliance_officer",
    actorUserId: "6d8e29de-a4c5-5c23-9f3a-a10566d5fe76",
    auditPersistenceAvailable: input.auditPersistenceAvailable ?? true,
    clientTenantId: payload.clientTenantId ?? domainHClientProjectionSession.tenant.id,
    correlationId: "7c0d9a28-b17d-52d3-9b7d-6a0ad33fda25",
    eventType: "domain_h.client_projection.release",
    nextState: "CLIENT_VISIBLE",
    platformTenantId: actorPlatformTenantId,
    previousState: payload.visibilityStatus,
    reason: "DOMAIN-H client projection requires persisted audit before released client-safe communication.",
    result: "SUCCESS",
    targetId: payload.id,
    targetType: "DECISION",
  });

  return {
    auditGuard,
    evidenceRecordId: payload.evidenceRecordId ?? null,
    failClosedOnAuditPersistence: auditGuard.allowed ? auditGuard.metadata.failClosedOnAuditPersistence : true,
    persistedModel: "AuditEvent",
    projectionAllowed: auditGuard.allowed,
    reasonCode: auditGuard.allowed ? "DOMAIN_H_AUDIT_READY" : "DOMAIN_H_AUDIT_BLOCKED",
  };
}

export function buildDomainHReleasedDecisionReadModel(
  payload: DecisionVisibilityPayload = domainHReleasedDecisionPayload,
  session: ActorSession = domainHClientProjectionSession,
  auditLifecycle: DomainHAuditLifecycleProof = evaluateDomainHProjectionAuditLifecycle({ payload }),
): DomainHReleasedDecisionReadModel {
  const projection = visibilityEngine.projectDecisionPayload(
    session.actor,
    session.role,
    payload,
    actorPlatformTenantId,
    session.tenant.id,
  );
  const state = clientPortalProjectionState("decision", projection);
  const projectedPayload = state.payload;
  const title = state.visible ? String(projectedPayload.title ?? payload.title) : payload.title;
  const summary = state.visible
    ? String(projectedPayload.clientSummary ?? "No released summary is available.")
    : "This update is still being reviewed.";
  const releasedAt = state.visible ? String(projectedPayload.releasedAt ?? "Release date unavailable") : "Pending release";

  return {
    contractId: "DOMAIN_H_RELEASED_PROJECTION_CONTRACT",
    auditLifecycle,
    hiddenFields: state.hiddenFields,
    payloadKeys: state.allowedPayloadKeys,
    proof: {
      forbiddenFieldsPresent: state.forbiddenFieldsPresent,
      stepContracts: domainHReleasedProjectionStepContracts,
    },
    ui: {
      blockerCopy: state.visible
        ? "Draft notes are not part of this client update."
        : "This update is not ready for the client yet.",
      hiddenMaterialCopy: "Documents and messages remain in their own work queues.",
      nextActionEnabled: state.visible && state.safe && auditLifecycle.projectionAllowed,
      nextActionHref: "/client/home",
      nextActionLabel: "Open client update",
      releasedAt,
      safe: state.safe,
      state: state.state,
      statusLabel: state.visible ? "Available" : "Not ready",
      summary,
      title,
    },
  };
}
