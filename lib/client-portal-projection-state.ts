import type {
  DecisionPayloadProjection,
  DocumentPayloadProjection,
  RecommendationPayloadProjection,
} from "@/lib/visibility-engine";
import { visibilityEngine } from "@/lib/visibility-engine";

export type ClientPortalProjectionKind = "decision" | "document" | "recommendation";

export type ClientPortalProjectionState =
  | "blocked"
  | "empty"
  | "hidden"
  | "permission_denied"
  | "redacted"
  | "released"
  | "source_upload";

export type ClientPortalProjectionViewModel = {
  allowedPayloadKeys: string[];
  forbiddenFieldsPresent: string[];
  hiddenFields: string[];
  kind: ClientPortalProjectionKind;
  payload: Record<string, unknown>;
  reason: string;
  reasonCode: string;
  safe: boolean;
  state: ClientPortalProjectionState;
  visible: boolean;
};

type ClientPortalProjection =
  | DecisionPayloadProjection
  | DocumentPayloadProjection
  | RecommendationPayloadProjection;

const sourceUploadMetadataFields = new Set(["fileName", "fileSizeBytes"]);

function stateForProjection(projection: ClientPortalProjection): ClientPortalProjectionState {
  if (!projection.permission.allowed) {
    return "permission_denied";
  }

  if (!projection.visible) {
    if (projection.reasonCode.includes("FAIL_CLOSED")) {
      return "empty";
    }

    return "hidden";
  }

  if ("visibilityState" in projection) {
    if (projection.visibilityState === "SOURCE_DOCUMENT_AVAILABLE") {
      return "source_upload";
    }

    if (projection.visibilityState === "CLIENT_SAFE" && projection.payload.evidenceVisibilityStatus === "REDACTED") {
      return "redacted";
    }
  }

  return "released";
}

export function clientPortalProjectionState(
  kind: ClientPortalProjectionKind,
  projection: ClientPortalProjection,
): ClientPortalProjectionViewModel {
  const payload = projection.payload as Record<string, unknown>;
  const state = stateForProjection(projection);
  const safety = visibilityEngine.assertClientProjectionClean({
    hiddenFields: projection.hiddenFields,
    payload,
    visible: projection.visible,
  });
  const forbiddenFieldsPresent =
    state === "source_upload"
      ? safety.forbiddenFieldsPresent.filter((field) => !sourceUploadMetadataFields.has(field))
      : safety.forbiddenFieldsPresent;

  return {
    allowedPayloadKeys: Object.keys(payload).sort(),
    forbiddenFieldsPresent,
    hiddenFields: projection.hiddenFields,
    kind,
    payload,
    reason: projection.reason,
    reasonCode: projection.reasonCode,
    safe: projection.visible ? forbiddenFieldsPresent.length === 0 : forbiddenFieldsPresent.length === 0,
    state,
    visible: projection.visible,
  };
}
