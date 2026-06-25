export const wp05CanonicalStates = [
  "DRAFT_INTERNAL_ONLY",
  "UNSUPPORTED_CLAIM_BLOCKED",
  "EVIDENCE_GAP",
  "ANALYST_REBUILT_WITH_EVIDENCE",
  "ADVISOR_APPROVED_FOR_COMPLIANCE",
  "COMPLIANCE_PENDING",
  "COMPLIANCE_NEEDS_EVIDENCE",
  "COMPLIANCE_BLOCKED",
  "COMPLIANCE_RELEASED_CLIENT_SAFE",
  "CLIENT_ACCEPTANCE_SEPARATE",
] as const;

export type Wp05CanonicalState = (typeof wp05CanonicalStates)[number];

export const wp05CanonicalJourneyCommandIds = [
  "AI_DRAFT_INTERNAL",
  "ADVISOR_APPROVE",
  "COMPLIANCE_BLOCK",
  "COMPLIANCE_REQUEST_EVIDENCE",
  "COMPLIANCE_RELEASE",
] as const;

export type Wp05CanonicalJourneyCommandId = (typeof wp05CanonicalJourneyCommandIds)[number];

export const wp05ComplianceReleaseConfirmationPhrase = "RELEASE CLIENT-SAFE JOURNEY";

export const wp05DemoWorkflowCompatibilityMode = "DEMO_WORKFLOW_COMPATIBILITY_ONLY";

export const advisorApprovalActionToCanonicalCommand = {
  submit_review: "AI_DRAFT_INTERNAL",
  reject_unsupported_claim: "AI_DRAFT_INTERNAL",
  rebuild_with_evidence: "AI_DRAFT_INTERNAL",
  advisor_approve: "ADVISOR_APPROVE",
  compliance_block: "COMPLIANCE_BLOCK",
  compliance_release: "COMPLIANCE_RELEASE",
  request_evidence: "COMPLIANCE_REQUEST_EVIDENCE",
} as const satisfies Record<string, Wp05CanonicalJourneyCommandId>;

export const advisorApprovalActionToCanonicalState = {
  submit_review: "DRAFT_INTERNAL_ONLY",
  reject_unsupported_claim: "UNSUPPORTED_CLAIM_BLOCKED",
  rebuild_with_evidence: "ANALYST_REBUILT_WITH_EVIDENCE",
  advisor_approve: "COMPLIANCE_PENDING",
  compliance_block: "COMPLIANCE_BLOCKED",
  compliance_release: "COMPLIANCE_RELEASED_CLIENT_SAFE",
  request_evidence: "COMPLIANCE_NEEDS_EVIDENCE",
} as const satisfies Record<string, Wp05CanonicalState>;
