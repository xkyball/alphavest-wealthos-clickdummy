import { stableId } from "../../lib/stable-id";

export const e2eObjectScopeFixtures = {
  morgan: {
    clientTenantId: "7870ddd4-4587-58c6-a30b-ed6710109c17",
    decisionId: stableId("decision:morgan:liquidity-review"),
    documentId: stableId("document:morgan:liquidity-review"),
    evidenceRecordId: stableId("evidence:morgan:liquidity-review"),
    exportRequestId: stableId("export:morgan:liquidity-review"),
    recommendationId: stableId("recommendation:morgan:liquidity-review"),
    tenantSlug: "morgan" as const,
  },
  summit: {
    clientTenantId: "68c2dd2e-2322-526f-8a48-2fdadf996c40",
    decisionId: stableId("decision:summit:liquidity-review"),
    documentId: stableId("document:summit:liquidity-review"),
    evidenceRecordId: stableId("evidence:summit:liquidity-review"),
    exportRequestId: stableId("export:summit:liquidity-review"),
    recommendationId: stableId("recommendation:summit:liquidity-review"),
    tenantSlug: "summit" as const,
  },
} as const;

