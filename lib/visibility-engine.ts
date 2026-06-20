import type { DemoActor, DemoRole } from "@/lib/demo-session";
import type {
  ClientVisibilityCandidate,
  WorkflowGateResult,
} from "@/lib/workflow-gate";
import { canBecomeClientVisible } from "@/lib/workflow-gate";
import type { ObjectType, RecommendationStatus, Sensitivity, UUID, VisibilityStatus } from "@/lib/domain-types";
import type { PermissionDecision } from "@/lib/permission-engine";
import { permissionEngine } from "@/lib/permission-engine";

export type VisibilitySubject = {
  objectType: ObjectType;
  objectId?: UUID;
  clientTenantId?: UUID;
  sensitivity?: Sensitivity;
  visibilityStatus: VisibilityStatus;
  clientVisible?: boolean;
};

export type VisibilityDecision = {
  visible: boolean;
  reasonCode: string;
  reason: string;
  permission: PermissionDecision;
};

export type RecommendationVisibilityPayload = {
  objectId?: UUID;
  clientTenantId?: UUID;
  sensitivity?: Sensitivity;
  visibilityStatus: VisibilityStatus;
  clientVisible: boolean;
  recommendationStatus: RecommendationStatus;
  clientSummary?: string | null;
  clientSummaryDraft?: string | null;
  summaryInternal?: string | null;
  internalRationale?: string | null;
  complianceNotes?: string | null;
  assumptionsJson?: unknown;
};

export type RecommendationPayloadProjection = {
  visible: boolean;
  reasonCode: string;
  reason: string;
  permission: PermissionDecision;
  payload: {
    clientSummary?: string;
    clientSummaryDraft?: string;
    summaryInternal?: string;
    internalRationale?: string;
    complianceNotes?: string;
    assumptionsJson?: unknown;
  };
  hiddenFields: string[];
};

const releasedRecommendationStatuses = new Set<RecommendationStatus>([
  "RELEASED_TO_CLIENT",
  "CLIENT_ACCEPTED",
  "CLIENT_DEFERRED",
  "CLIENT_REJECTED",
]);

const internalRecommendationFields = [
  "clientSummaryDraft",
  "summaryInternal",
  "internalRationale",
  "complianceNotes",
  "assumptionsJson",
] as const;

function canView(
  actor: DemoActor,
  role: DemoRole,
  subject: VisibilitySubject,
  platformTenantId: UUID,
  clientTenantId?: UUID
): VisibilityDecision {
  const permission = permissionEngine.can(
    actor,
    "VIEW",
    subject,
    {
      platformTenantId,
      clientTenantId,
      sensitivity: subject.sensitivity,
      clientVisibilityState: subject.visibilityStatus,
    },
    role
  );

  const restrictedClientView =
    !role.internal && ["INTERNAL_ONLY", "ADVISOR_VISIBLE", "COMPLIANCE_VISIBLE"].includes(subject.visibilityStatus);

  return {
    visible: permission.allowed && !restrictedClientView,
    reasonCode: restrictedClientView ? "DEMO_CLIENT_RESTRICTED" : permission.reasonCode,
    reason: restrictedClientView
      ? "Client-side demo roles cannot view internal-only, advisor-only or compliance-only records."
      : permission.reason,
    permission,
  };
}

function presentInternalFields(payload: RecommendationVisibilityPayload) {
  return internalRecommendationFields.filter((field) => payload[field] !== undefined && payload[field] !== null);
}

function projectRecommendationPayload(
  actor: DemoActor,
  role: DemoRole,
  payload: RecommendationVisibilityPayload,
  platformTenantId: UUID,
  clientTenantId?: UUID
): RecommendationPayloadProjection {
  const permission = permissionEngine.can(
    actor,
    "VIEW",
    {
      objectType: "RECOMMENDATION",
      objectId: payload.objectId,
      clientTenantId: payload.clientTenantId,
      sensitivity: payload.sensitivity,
      visibilityStatus: payload.visibilityStatus,
    },
    {
      platformTenantId,
      clientTenantId,
      sensitivity: payload.sensitivity,
      clientVisibilityState: payload.visibilityStatus,
    },
    role
  );
  const hiddenFields = presentInternalFields(payload);

  if (!permission.allowed) {
    return {
      visible: false,
      reasonCode: permission.reasonCode,
      reason: permission.reason,
      permission,
      payload: {},
      hiddenFields: ["clientSummary", ...hiddenFields],
    };
  }

  if (!role.internal) {
    const clientSafeReleased =
      payload.clientVisible &&
      payload.visibilityStatus === "CLIENT_VISIBLE" &&
      releasedRecommendationStatuses.has(payload.recommendationStatus);

    if (!clientSafeReleased) {
      return {
        visible: false,
        reasonCode: "DEMO_CLIENT_VISIBILITY_FAIL_CLOSED",
        reason: "Client-side demo roles can only receive released, client-visible recommendation payloads.",
        permission,
        payload: {},
        hiddenFields: ["clientSummary", ...hiddenFields],
      };
    }

    return {
      visible: true,
      reasonCode: "DEMO_CLIENT_SAFE_PROJECTION",
      reason: "Client-side demo payload includes only released client-safe fields.",
      permission,
      payload: payload.clientSummary ? { clientSummary: payload.clientSummary } : {},
      hiddenFields,
    };
  }

  return {
    visible: true,
    reasonCode: "DEMO_INTERNAL_PROJECTION",
    reason: "Internal demo role can view scoped internal recommendation payload.",
    permission,
    payload: {
      ...(payload.clientSummary ? { clientSummary: payload.clientSummary } : {}),
      ...(payload.clientSummaryDraft ? { clientSummaryDraft: payload.clientSummaryDraft } : {}),
      ...(payload.summaryInternal ? { summaryInternal: payload.summaryInternal } : {}),
      ...(payload.internalRationale ? { internalRationale: payload.internalRationale } : {}),
      ...(payload.complianceNotes ? { complianceNotes: payload.complianceNotes } : {}),
      ...(payload.assumptionsJson !== undefined && payload.assumptionsJson !== null
        ? { assumptionsJson: payload.assumptionsJson }
        : {}),
    },
    hiddenFields: [],
  };
}

function clientRelease(candidate: ClientVisibilityCandidate): WorkflowGateResult {
  return canBecomeClientVisible(candidate);
}

export const visibilityEngine = {
  canView,
  canBecomeClientVisible: clientRelease,
  projectRecommendationPayload,
};
