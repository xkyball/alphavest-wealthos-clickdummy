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

export const wp05CanonicalJourneyCommandApiRoute = "/api/journeys/[id]/commands";

export type Wp05ReleaseProofDirectnessClassification =
  | "CANONICAL_TYPED_JOURNEY_COMMAND"
  | "DOMAIN_BACKED_TYPED_COMPATIBILITY"
  | "LEGACY_DEMO_COMPATIBILITY_ONLY";

export type Wp05ReleaseProofDirectness = {
  canonicalProofRoute: typeof wp05CanonicalJourneyCommandApiRoute;
  classification: Wp05ReleaseProofDirectnessClassification;
  demoWorkflowCompatibilityMode?: typeof wp05DemoWorkflowCompatibilityMode;
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

export const wp05TypedAdvisorWorkflowDirectness = {
  advisor_approve: {
    canonicalProofRoute: wp05CanonicalJourneyCommandApiRoute,
    classification: "DOMAIN_BACKED_TYPED_COMPATIBILITY",
    demoWorkflowCompatibilityMode: wp05DemoWorkflowCompatibilityMode,
    productProofBacked: true,
    pp004CanonicalProofEligible: false,
    proofBackedByStatePayloadAssertions: true,
    releaseBoundary: "advisor_approval_not_release",
    summary:
      "Typed advisor approval is domain-backed compatibility proof only; PP004 canonical proof must use the journey command API and assert state plus client projection payload.",
  },
  compliance_block: {
    canonicalProofRoute: wp05CanonicalJourneyCommandApiRoute,
    classification: "DOMAIN_BACKED_TYPED_COMPATIBILITY",
    demoWorkflowCompatibilityMode: wp05DemoWorkflowCompatibilityMode,
    productProofBacked: true,
    pp004CanonicalProofEligible: false,
    proofBackedByStatePayloadAssertions: true,
    releaseBoundary: "compliance_negative_release_control",
    summary:
      "Typed compliance block is domain-backed compatibility proof only; PP004 canonical proof must use the journey command API and assert state plus client projection payload.",
  },
  compliance_release: {
    canonicalProofRoute: wp05CanonicalJourneyCommandApiRoute,
    classification: "DOMAIN_BACKED_TYPED_COMPATIBILITY",
    demoWorkflowCompatibilityMode: wp05DemoWorkflowCompatibilityMode,
    productProofBacked: true,
    pp004CanonicalProofEligible: false,
    proofBackedByStatePayloadAssertions: true,
    releaseBoundary: "compliance_release",
    summary:
      "Typed compliance release is domain-backed compatibility proof only; PP004 canonical proof must use the journey command API and assert state plus client projection payload.",
  },
  request_evidence: {
    canonicalProofRoute: wp05CanonicalJourneyCommandApiRoute,
    classification: "DOMAIN_BACKED_TYPED_COMPATIBILITY",
    demoWorkflowCompatibilityMode: wp05DemoWorkflowCompatibilityMode,
    productProofBacked: true,
    pp004CanonicalProofEligible: false,
    proofBackedByStatePayloadAssertions: true,
    releaseBoundary: "compliance_negative_release_control",
    summary:
      "Typed evidence request is domain-backed compatibility proof only; PP004 canonical proof must use the journey command API and assert state plus client projection payload.",
  },
} as const satisfies Record<
  "advisor_approve" | "compliance_block" | "compliance_release" | "request_evidence",
  Wp05ReleaseProofDirectness
>;

export const wp05LegacyDemoReleaseActionDirectness = {
  "j01.approveAdvisor": {
    canonicalProofRoute: wp05CanonicalJourneyCommandApiRoute,
    classification: "LEGACY_DEMO_COMPATIBILITY_ONLY",
    demoWorkflowCompatibilityMode: wp05DemoWorkflowCompatibilityMode,
    productProofBacked: false,
    pp004CanonicalProofEligible: false,
    proofBackedByStatePayloadAssertions: false,
    releaseBoundary: "advisor_approval_not_release",
    summary:
      "Legacy demo advisor approval is not PP004 release proof and must not be used to prove client visibility or compliance release.",
  },
  "j02.blockRelease": {
    canonicalProofRoute: wp05CanonicalJourneyCommandApiRoute,
    classification: "LEGACY_DEMO_COMPATIBILITY_ONLY",
    demoWorkflowCompatibilityMode: wp05DemoWorkflowCompatibilityMode,
    productProofBacked: false,
    pp004CanonicalProofEligible: false,
    proofBackedByStatePayloadAssertions: false,
    releaseBoundary: "compliance_negative_release_control",
    summary:
      "Legacy demo compliance block is not PP004 release proof; use typed journey commands for canonical negative release-control proof.",
  },
  "j02.confirmRequestEvidence": {
    canonicalProofRoute: wp05CanonicalJourneyCommandApiRoute,
    classification: "LEGACY_DEMO_COMPATIBILITY_ONLY",
    demoWorkflowCompatibilityMode: wp05DemoWorkflowCompatibilityMode,
    productProofBacked: false,
    pp004CanonicalProofEligible: false,
    proofBackedByStatePayloadAssertions: false,
    releaseBoundary: "compliance_negative_release_control",
    summary:
      "Legacy demo evidence-request confirmation is not PP004 release proof; use typed journey commands for canonical evidence-request proof.",
  },
  "j02.releaseClient": {
    canonicalProofRoute: wp05CanonicalJourneyCommandApiRoute,
    classification: "LEGACY_DEMO_COMPATIBILITY_ONLY",
    demoWorkflowCompatibilityMode: wp05DemoWorkflowCompatibilityMode,
    productProofBacked: false,
    pp004CanonicalProofEligible: false,
    proofBackedByStatePayloadAssertions: false,
    releaseBoundary: "compliance_release",
    summary:
      "Legacy demo client release may support screencast compatibility, but it is not PP004 canonical release proof.",
  },
  "j02.requestEvidence": {
    canonicalProofRoute: wp05CanonicalJourneyCommandApiRoute,
    classification: "LEGACY_DEMO_COMPATIBILITY_ONLY",
    demoWorkflowCompatibilityMode: wp05DemoWorkflowCompatibilityMode,
    productProofBacked: false,
    pp004CanonicalProofEligible: false,
    proofBackedByStatePayloadAssertions: false,
    releaseBoundary: "compliance_negative_release_control",
    summary:
      "Legacy demo evidence request is not PP004 release proof; use typed journey commands for canonical evidence-request proof.",
  },
  "j03.acceptOption": {
    canonicalProofRoute: wp05CanonicalJourneyCommandApiRoute,
    classification: "LEGACY_DEMO_COMPATIBILITY_ONLY",
    demoWorkflowCompatibilityMode: wp05DemoWorkflowCompatibilityMode,
    productProofBacked: false,
    pp004CanonicalProofEligible: false,
    proofBackedByStatePayloadAssertions: false,
    releaseBoundary: "client_decision_after_release",
    summary:
      "Legacy demo client acceptance happens after release and is not PP004 compliance-release proof.",
  },
} as const satisfies Record<string, Wp05ReleaseProofDirectness>;

export function wp05LegacyDemoReleaseActionDirectnessFor(actionId: string) {
  return wp05LegacyDemoReleaseActionDirectness[
    actionId as keyof typeof wp05LegacyDemoReleaseActionDirectness
  ];
}

export function wp05TypedAdvisorWorkflowDirectnessFor(action: string) {
  return wp05TypedAdvisorWorkflowDirectness[
    action as keyof typeof wp05TypedAdvisorWorkflowDirectness
  ];
}

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
