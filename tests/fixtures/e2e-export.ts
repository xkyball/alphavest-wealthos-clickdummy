import { e2eObjectScopeFixtures } from "./e2e-object-scope";

export const e2eExportFixtures = {
  morganPreviewOnly: {
    approved: false,
    clientTenantId: e2eObjectScopeFixtures.morgan.clientTenantId,
    downloaded: false,
    exportRequestId: e2eObjectScopeFixtures.morgan.exportRequestId,
    forbiddenPayloadFields: ["internalRationale", "aiDraft", "complianceNotes"],
    generated: false,
    previewed: true,
    redactionProfile: "client-safe-preview",
    shared: false,
    stage: "preview",
  },
} as const;

