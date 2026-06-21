import { e2eEvidenceFixtures } from "./e2e-evidence";

export const e2eWorkflowFixtures = {
  advisorApprovedNotReleased: {
    advisorApprovalStatus: "APPROVED" as const,
    complianceStatus: "PENDING" as const,
    currentVisibility: "ADVISOR_VISIBLE" as const,
    evidenceStatus: "VALIDATED" as const,
    permission: { allowed: true, reasonCode: "E2E_ALLOWED" },
    recommendationStatus: "ADVISOR_APPROVED" as const,
  },
  aiDraftInternalOnly: {
    advisorApprovalStatus: "PENDING" as const,
    complianceStatus: "PENDING" as const,
    containsAiDraft: true,
    containsInternalRationale: true,
    currentVisibility: "INTERNAL_ONLY" as const,
    evidenceStatus: "CREATED" as const,
    permission: { allowed: true, reasonCode: "E2E_ALLOWED" },
    recommendationStatus: "AI_DRAFT" as const,
  },
  complianceReleaseBlockedByAudit: {
    advisorApprovalStatus: "APPROVED" as const,
    auditPersistenceAvailable: false,
    compliancePermission: { allowed: true, reasonCode: "E2E_ALLOWED" },
    evidenceDecision: e2eEvidenceFixtures.linkedSufficient,
    payloadReady: true,
  },
  complianceReleaseReady: {
    advisorApprovalStatus: "APPROVED" as const,
    auditPersistenceAvailable: true,
    compliancePermission: { allowed: true, reasonCode: "E2E_ALLOWED" },
    evidenceDecision: e2eEvidenceFixtures.linkedSufficient,
    payloadReady: true,
  },
  unsupportedClaimRejected: {
    advisorApprovalStatus: "PENDING" as const,
    complianceStatus: "PENDING" as const,
    containsAiDraft: true,
    containsInternalRationale: true,
    currentVisibility: "INTERNAL_ONLY" as const,
    evidenceStatus: "CREATED" as const,
    permission: { allowed: true, reasonCode: "E2E_ALLOWED" },
    recommendationStatus: "REVISION_REQUESTED" as const,
  },
} as const;

