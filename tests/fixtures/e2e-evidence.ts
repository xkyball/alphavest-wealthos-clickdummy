import { evidenceService } from "../../lib/evidence-service";
import { e2eObjectScopeFixtures } from "./e2e-object-scope";

const morgan = e2eObjectScopeFixtures.morgan;

export const e2eEvidenceFixtures = {
  linkedSufficient: evidenceService.evaluateEvidenceSufficiency({
    accepted: true,
    current: true,
    relatedObjectId: morgan.recommendationId,
    relatedObjectType: "RECOMMENDATION",
    requiredObjectId: morgan.recommendationId,
    requiredObjectType: "RECOMMENDATION",
    reviewed: true,
    status: "VALIDATED",
    visibilityStatus: "REDACTED",
  }),
  staleLinked: evidenceService.evaluateEvidenceSufficiency({
    accepted: true,
    current: false,
    relatedObjectId: morgan.recommendationId,
    relatedObjectType: "RECOMMENDATION",
    requiredObjectId: morgan.recommendationId,
    requiredObjectType: "RECOMMENDATION",
    reviewed: true,
    status: "VALIDATED",
    visibilityStatus: "REDACTED",
  }),
  uploadedOnlyLifecycle: evidenceService.evaluateEvidenceLifecycle({
    accepted: false,
    current: true,
    relatedObjectId: morgan.documentId,
    relatedObjectType: "DOCUMENT",
    requiredObjectId: morgan.documentId,
    requiredObjectType: "DOCUMENT",
    reviewed: false,
    status: "CREATED",
    uploaded: true,
    visibilityStatus: "INTERNAL_ONLY",
  }),
  wrongScope: evidenceService.evaluateEvidenceSufficiency({
    accepted: true,
    current: true,
    relatedObjectId: e2eObjectScopeFixtures.summit.recommendationId,
    relatedObjectType: "RECOMMENDATION",
    requiredObjectId: morgan.recommendationId,
    requiredObjectType: "RECOMMENDATION",
    reviewed: true,
    status: "VALIDATED",
    visibilityStatus: "REDACTED",
  }),
} as const;

