import type { ActorContext } from "@/lib/control-layer/actor-context";
import type {
  DecisionPayloadProjection,
  DecisionVisibilityPayload,
  DocumentPayloadProjection,
  DocumentVisibilityPayload,
  RecommendationPayloadProjection,
  RecommendationVisibilityPayload,
} from "@/lib/visibility-engine";
import { visibilityEngine } from "@/lib/visibility-engine";

export type ClientVisibilityResult =
  | {
      allowed: true;
      controlLayer: "WCL-04";
      projection:
        | DecisionPayloadProjection
        | DocumentPayloadProjection
        | RecommendationPayloadProjection;
      reasonCode: "WCL_CLIENT_VISIBILITY_PROJECTED";
    }
  | {
      allowed: false;
      controlLayer: "WCL-04";
      hiddenFields: string[];
      reason: string;
      reasonCode: "WCL_CLIENT_VISIBILITY_HIDDEN";
    };

function normalizeProjection(
  projection: DecisionPayloadProjection | DocumentPayloadProjection | RecommendationPayloadProjection,
): ClientVisibilityResult {
  if (!projection.visible) {
    return {
      allowed: false,
      controlLayer: "WCL-04",
      hiddenFields: projection.hiddenFields,
      reason: projection.reason,
      reasonCode: "WCL_CLIENT_VISIBILITY_HIDDEN",
    };
  }

  return {
    allowed: true,
    controlLayer: "WCL-04",
    projection,
    reasonCode: "WCL_CLIENT_VISIBILITY_PROJECTED",
  };
}

export function projectClientVisibleRecommendation(
  actorContext: ActorContext,
  payload: RecommendationVisibilityPayload,
): ClientVisibilityResult {
  return normalizeProjection(
    visibilityEngine.projectRecommendationPayload(
      actorContext.session.actor,
      actorContext.session.role,
      payload,
      actorContext.platformTenantId,
      actorContext.clientTenantId,
    ),
  );
}

export function projectClientVisibleDecision(
  actorContext: ActorContext,
  payload: DecisionVisibilityPayload,
): ClientVisibilityResult {
  return normalizeProjection(
    visibilityEngine.projectDecisionPayload(
      actorContext.session.actor,
      actorContext.session.role,
      payload,
      actorContext.platformTenantId,
      actorContext.clientTenantId,
    ),
  );
}

export function projectClientVisibleDocument(
  actorContext: ActorContext,
  payload: DocumentVisibilityPayload,
): ClientVisibilityResult {
  return normalizeProjection(
    visibilityEngine.projectDocumentPayload(
      actorContext.session.actor,
      actorContext.session.role,
      payload,
      actorContext.platformTenantId,
      actorContext.clientTenantId,
    ),
  );
}
