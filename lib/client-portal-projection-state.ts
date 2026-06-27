import type {
  DecisionPayloadProjection,
  DocumentPayloadProjection,
  RecommendationPayloadProjection,
} from "@/lib/visibility-engine";
import type { UxComponentState } from "@/lib/ux-lifecycle-state-contract";
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

export type ClientPortalProjectionStatePanelCopy = {
  componentState: UxComponentState;
  detail: string;
  title: string;
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

export function clientPortalProjectionStatePanelCopy(model: ClientPortalProjectionViewModel): ClientPortalProjectionStatePanelCopy {
  if (model.state === "released") {
    return {
      componentState: "success",
      detail: "This view is derived from release and projection rules. Release does not mean client acceptance.",
      title: "Client-safe summary is now available",
    };
  }

  if (model.state === "permission_denied") {
    return {
      componentState: "denied",
      detail: "This account cannot view the requested client-safe projection. No internal object detail is disclosed.",
      title: "Access restricted",
    };
  }

  if (model.state === "redacted") {
    return {
      componentState: "redacted",
      detail: "Only redacted client-safe metadata is available in this view.",
      title: "Redacted summary available",
    };
  }

  if (model.state === "source_upload") {
    return {
      componentState: "validation",
      detail: "Your upload is available as source-document status only. It is not evidence sufficiency, release readiness or advice.",
      title: "Source upload received",
    };
  }

  if (model.state === "hidden") {
    return {
      componentState: "hidden",
      detail: "This item is not available in the client view yet. No supporting detail is shown until a released projection exists.",
      title: "Content unavailable",
    };
  }

  return {
    componentState: model.state === "blocked" ? "blocked" : "empty",
    detail: "Your AlphaVest team is still reviewing this item. No decision body or supporting detail is shown until a released projection exists.",
    title: "No released content is available yet",
  };
}
