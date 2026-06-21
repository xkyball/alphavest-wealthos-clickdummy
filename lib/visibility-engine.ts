import type { DemoActor, DemoRole } from "@/lib/demo-session";
import type {
  ClientVisibilityCandidate,
  WorkflowGateResult,
} from "@/lib/workflow-gate";
import { canBecomeClientVisible } from "@/lib/workflow-gate";
import type { ObjectType, RecommendationStatus, Sensitivity, UUID, VisibilityStatus } from "@/lib/domain-types";
import type { PermissionDecision } from "@/lib/permission-engine";
import { permissionEngine } from "@/lib/permission-engine";

type ClientProjectionState =
  | "CLIENT_SAFE"
  | "NO_AVAILABLE_CONTENT"
  | "PERMISSION_DENIED"
  | "INTERNAL_PROJECTION";

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

export type DocumentVisibilityPayload = {
  id: UUID;
  clientTenantId?: UUID;
  title: string;
  documentType: string;
  status: string;
  sensitivity?: Sensitivity;
  clientVisible: boolean;
  evidenceRecordId?: UUID | null;
  evidenceStatus?: string | null;
  evidenceVisibilityStatus?: VisibilityStatus | string | null;
  extractionStatus?: string | null;
  fileName?: string | null;
  fileSizeBytes?: number | null;
  mimeType?: string | null;
  checksum?: string | null;
  storageKey?: string | null;
  uploadedAt?: string;
};

export type DocumentPayloadProjection = {
  visible: boolean;
  reasonCode: string;
  reason: string;
  permission: PermissionDecision;
  visibilityState: ClientProjectionState;
  payload: Partial<DocumentVisibilityPayload>;
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

const internalDocumentFields = [
  "fileName",
  "fileSizeBytes",
  "mimeType",
  "checksum",
  "storageKey",
  "evidenceRecordId",
  "evidenceStatus",
  "evidenceVisibilityStatus",
  "extractionStatus",
] as const;

const clientSafeDocumentEvidenceStatuses = new Set(["VALIDATED", "RELEASED"]);
const clientSafeDocumentVisibilityStatuses = new Set(["CLIENT_VISIBLE", "REDACTED"]);

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

function presentDocumentInternalFields(payload: DocumentVisibilityPayload) {
  return internalDocumentFields.filter((field) => payload[field] !== undefined && payload[field] !== null);
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
      ...(payload.objectId
        ? {
            objectScope: {
              clientTenantId: payload.clientTenantId,
              objectIds: [payload.objectId],
              objectType: "RECOMMENDATION" as const,
            },
          }
        : {}),
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

function projectDocumentPayload(
  actor: DemoActor,
  role: DemoRole,
  payload: DocumentVisibilityPayload,
  platformTenantId: UUID,
  clientTenantId?: UUID
): DocumentPayloadProjection {
  const permission = permissionEngine.can(
    actor,
    "VIEW",
    {
      objectType: "DOCUMENT",
      objectId: payload.id,
      clientTenantId: payload.clientTenantId,
      sensitivity: payload.sensitivity,
      visibilityStatus:
        payload.evidenceVisibilityStatus === "CLIENT_VISIBLE" || payload.evidenceVisibilityStatus === "REDACTED"
          ? payload.evidenceVisibilityStatus
          : "INTERNAL_ONLY",
    },
    {
      platformTenantId,
      clientTenantId,
      objectScope: {
        clientTenantId: payload.clientTenantId,
        objectIds: [payload.id],
        objectType: "DOCUMENT",
      },
      sensitivity: payload.sensitivity,
      clientVisibilityState:
        payload.evidenceVisibilityStatus === "CLIENT_VISIBLE" || payload.evidenceVisibilityStatus === "REDACTED"
          ? payload.evidenceVisibilityStatus
          : "INTERNAL_ONLY",
    },
    role,
  );
  const hiddenFields = presentDocumentInternalFields(payload);

  if (!permission.allowed) {
    return {
      visible: false,
      reasonCode: permission.reasonCode,
      reason: permission.reason,
      permission,
      visibilityState: "PERMISSION_DENIED",
      payload: {},
      hiddenFields: ["title", "documentType", "status", ...hiddenFields],
    };
  }

  if (!role.internal) {
    const clientSafeDocument =
      payload.clientVisible &&
      clientSafeDocumentEvidenceStatuses.has(payload.evidenceStatus ?? "") &&
      clientSafeDocumentVisibilityStatuses.has(payload.evidenceVisibilityStatus ?? "");

    if (!clientSafeDocument) {
      return {
        visible: false,
        reasonCode: "DEMO_CLIENT_DOCUMENT_FAIL_CLOSED",
        reason: "Client-side demo roles can only receive released or redacted document summaries.",
        permission,
        visibilityState: "NO_AVAILABLE_CONTENT",
        payload: {},
        hiddenFields: ["title", "documentType", "status", ...hiddenFields],
      };
    }

    return {
      visible: true,
      reasonCode: "DEMO_CLIENT_DOCUMENT_SAFE_PROJECTION",
      reason: "Client-side demo document payload includes only released or redacted summary fields.",
      permission,
      visibilityState: "CLIENT_SAFE",
      payload: {
        id: payload.id,
        title: payload.title,
        documentType: payload.documentType,
        status: payload.status,
        uploadedAt: payload.uploadedAt,
      },
      hiddenFields,
    };
  }

  return {
    visible: true,
    reasonCode: "DEMO_INTERNAL_DOCUMENT_PROJECTION",
    reason: "Internal demo role can view scoped document operational metadata.",
    permission,
    visibilityState: "INTERNAL_PROJECTION",
    payload,
    hiddenFields: [],
  };
}

function clientRelease(candidate: ClientVisibilityCandidate): WorkflowGateResult {
  return canBecomeClientVisible(candidate);
}

export const visibilityEngine = {
  canView,
  canBecomeClientVisible: clientRelease,
  projectDocumentPayload,
  projectRecommendationPayload,
};
