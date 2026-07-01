export const workflow05CanonicalStates = [
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

export type Workflow05CanonicalState = (typeof workflow05CanonicalStates)[number];

export const workflow05CanonicalProcessCommandIds = [
  "AI_DRAFT_INTERNAL",
  "ADVISOR_APPROVE",
  "ADVISOR_REQUEST_EVIDENCE",
  "ADVISOR_RETURN_TO_ANALYST",
  "COMPLIANCE_BLOCK",
  "COMPLIANCE_REQUEST_EVIDENCE",
  "COMPLIANCE_RELEASE",
] as const;

export type Workflow05CanonicalProcessCommandId = (typeof workflow05CanonicalProcessCommandIds)[number];

export const workflow05ComplianceReleaseConfirmationPhrase = "RELEASE CLIENT-SAFE PROCESS";

export const workflow05TypedWorkflowBoundaryMode = "TYPED_WORKFLOW_BOUNDARY";

export const workflow05CanonicalProcessCommandApiRoute = "/api/processes/[id]/commands";

export type Workflow05ReleaseProofDirectnessClassification =
  | "CANONICAL_TYPED_PROCESS_COMMAND"
  | "DOMAIN_BACKED_TYPED_COMPATIBILITY";

export type Workflow05ReleaseProofDirectness = {
  canonicalProofRoute: typeof workflow05CanonicalProcessCommandApiRoute;
  classification: Workflow05ReleaseProofDirectnessClassification;
  typedWorkflowBoundaryMode?: typeof workflow05TypedWorkflowBoundaryMode;
  productProofBacked: boolean;
  pp004CanonicalProofEligible: boolean;
  proofBackedByStatePayloadAssertions: boolean;
  releaseBoundary:
    | "advisor_approval_not_release"
    | "compliance_negative_release_control"
    | "compliance_release"
    | "client_decision_after_release";
  summary: string;
};

export const workflow05TypedAdvisorWorkflowDirectness = {
  advisor_approve: {
    canonicalProofRoute: workflow05CanonicalProcessCommandApiRoute,
    classification: "CANONICAL_TYPED_PROCESS_COMMAND",
    productProofBacked: true,
    pp004CanonicalProofEligible: true,
    proofBackedByStatePayloadAssertions: true,
    releaseBoundary: "advisor_approval_not_release",
    summary:
      "Advisor approval is backed by a linked ProcessInstance step transition; it remains necessary but is not a compliance release.",
  },
  advisor_request_evidence: {
    canonicalProofRoute: workflow05CanonicalProcessCommandApiRoute,
    classification: "CANONICAL_TYPED_PROCESS_COMMAND",
    productProofBacked: true,
    pp004CanonicalProofEligible: true,
    proofBackedByStatePayloadAssertions: true,
    releaseBoundary: "advisor_approval_not_release",
    summary:
      "Advisor evidence request is backed by a typed process command and keeps the recommendation internal for analyst/evidence follow-up.",
  },
  advisor_return_to_analyst: {
    canonicalProofRoute: workflow05CanonicalProcessCommandApiRoute,
    classification: "CANONICAL_TYPED_PROCESS_COMMAND",
    productProofBacked: true,
    pp004CanonicalProofEligible: true,
    proofBackedByStatePayloadAssertions: true,
    releaseBoundary: "advisor_approval_not_release",
    summary:
      "Advisor return-to-analyst is backed by a typed process command and cannot become compliance release, export or client rejection.",
  },
  compliance_block: {
    canonicalProofRoute: workflow05CanonicalProcessCommandApiRoute,
    classification: "DOMAIN_BACKED_TYPED_COMPATIBILITY",
    typedWorkflowBoundaryMode: workflow05TypedWorkflowBoundaryMode,
    productProofBacked: true,
    pp004CanonicalProofEligible: false,
    proofBackedByStatePayloadAssertions: true,
    releaseBoundary: "compliance_negative_release_control",
    summary:
      "Typed compliance block is domain-backed compatibility proof only; PP004 canonical proof must use the process command API and assert state plus client projection payload.",
  },
  compliance_release: {
    canonicalProofRoute: workflow05CanonicalProcessCommandApiRoute,
    classification: "CANONICAL_TYPED_PROCESS_COMMAND",
    productProofBacked: true,
    pp004CanonicalProofEligible: true,
    proofBackedByStatePayloadAssertions: true,
    releaseBoundary: "compliance_release",
    summary:
      "Compliance release is backed by a linked ProcessInstance compliance-release step transition plus client-safe projection checks.",
  },
  request_evidence: {
    canonicalProofRoute: workflow05CanonicalProcessCommandApiRoute,
    classification: "DOMAIN_BACKED_TYPED_COMPATIBILITY",
    typedWorkflowBoundaryMode: workflow05TypedWorkflowBoundaryMode,
    productProofBacked: true,
    pp004CanonicalProofEligible: false,
    proofBackedByStatePayloadAssertions: true,
    releaseBoundary: "compliance_negative_release_control",
    summary:
      "Typed evidence request is domain-backed compatibility proof only; PP004 canonical proof must use the process command API and assert state plus client projection payload.",
  },
} as const satisfies Record<
  | "advisor_approve"
  | "advisor_request_evidence"
  | "advisor_return_to_analyst"
  | "compliance_block"
  | "compliance_release"
  | "request_evidence",
  Workflow05ReleaseProofDirectness
>;

export function workflow05TypedAdvisorWorkflowDirectnessFor(action: string) {
  return workflow05TypedAdvisorWorkflowDirectness[
    action as keyof typeof workflow05TypedAdvisorWorkflowDirectness
  ];
}

export const advisorApprovalActionToCanonicalCommand = {
  submit_review: "AI_DRAFT_INTERNAL",
  reject_unsupported_claim: "AI_DRAFT_INTERNAL",
  rebuild_with_evidence: "AI_DRAFT_INTERNAL",
  advisor_approve: "ADVISOR_APPROVE",
  advisor_request_evidence: "ADVISOR_REQUEST_EVIDENCE",
  advisor_return_to_analyst: "ADVISOR_RETURN_TO_ANALYST",
  compliance_block: "COMPLIANCE_BLOCK",
  compliance_release: "COMPLIANCE_RELEASE",
  request_evidence: "COMPLIANCE_REQUEST_EVIDENCE",
} as const satisfies Record<string, Workflow05CanonicalProcessCommandId>;

export const advisorApprovalActionToCanonicalState = {
  submit_review: "DRAFT_INTERNAL_ONLY",
  reject_unsupported_claim: "UNSUPPORTED_CLAIM_BLOCKED",
  rebuild_with_evidence: "ANALYST_REBUILT_WITH_EVIDENCE",
  advisor_approve: "COMPLIANCE_PENDING",
  advisor_request_evidence: "COMPLIANCE_NEEDS_EVIDENCE",
  advisor_return_to_analyst: "UNSUPPORTED_CLAIM_BLOCKED",
  compliance_block: "COMPLIANCE_BLOCKED",
  compliance_release: "COMPLIANCE_RELEASED_CLIENT_SAFE",
  request_evidence: "COMPLIANCE_NEEDS_EVIDENCE",
} as const satisfies Record<string, Workflow05CanonicalState>;
