import { e2eObjectScopeFixtures } from "./e2e-object-scope";

const morgan = e2eObjectScopeFixtures.morgan;

export const e2eVisibilityFixtures = {
  internalDraftRecommendation: {
    assumptionsJson: { aiDraftInternalOnly: true, modelRationale: "internal-only" },
    clientSummary: "Client-safe liquidity summary is not yet released.",
    clientSummaryDraft: "Draft recommendation text for analyst and advisor review.",
    clientTenantId: morgan.clientTenantId,
    clientVisible: false,
    complianceNotes: "Compliance notes remain internal.",
    internalRationale: "Internal rationale must not leak.",
    objectId: morgan.recommendationId,
    recommendationStatus: "AI_DRAFT" as const,
    sensitivity: "CONFIDENTIAL" as const,
    summaryInternal: "Internal analyst summary.",
    visibilityStatus: "INTERNAL_ONLY" as const,
  },
  releasedRecommendation: {
    clientSummary: "Released client-safe liquidity summary.",
    clientTenantId: morgan.clientTenantId,
    clientVisible: true,
    objectId: morgan.recommendationId,
    recommendationStatus: "RELEASED_TO_CLIENT" as const,
    sensitivity: "CONFIDENTIAL" as const,
    visibilityStatus: "CLIENT_VISIBLE" as const,
  },
} as const;

