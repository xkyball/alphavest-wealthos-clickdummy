export const advisorReviewApprovalContractId = "DOMAIN-10_ADVISOR_REVIEW_APPROVAL_CONTRACT";

export type AdvisorReviewProcessId = "BP-050" | "BP-051" | "BP-052" | "BP-053" | "BP-054" | "BP-055";

export type AdvisorReviewStepId =
  | "queue_triage"
  | "recommendation_detail_review"
  | "option_comparison"
  | "more_evidence_request"
  | "approve_to_compliance"
  | "reject_or_return_to_analyst";

export type AdvisorReviewState =
  | "ADVISOR_QUEUE_PENDING"
  | "ADVISOR_REVIEW_DETAIL_OPEN"
  | "OPTION_COMPARISON_READY"
  | "EVIDENCE_REQUESTED_INTERNAL"
  | "ADVISOR_APPROVED_COMPLIANCE_PENDING"
  | "RETURNED_TO_ANALYST"
  | "ADVISOR_REJECTED_INTERNAL"
  | "BLOCKED_BY_SCOPE_OR_EVIDENCE"
  | "AUDIT_REQUIRED_NO_RELEASE";

export type AdvisorReviewRouteOwner = {
  pageFamily: "advisor_review_detail" | "advisor_review_queue";
  pageId: "036" | "037";
  primaryJob: string;
  processIds: readonly AdvisorReviewProcessId[];
  route: string;
  viewportRule: string;
};

export type AdvisorReviewRoleGuard = {
  action: string;
  allowedRoles: readonly string[];
  hardNegative: string;
};

export type AdvisorReviewAcceptanceCriterion = {
  negative: string;
  positive: string;
  processId: AdvisorReviewProcessId;
};

export type AdvisorReviewProofBoundary = {
  auditPosture: "persisted_action_required" | "summary_only_not_audit_record";
  blockedOverclaims: readonly (typeof advisorReviewForbiddenOverclaims)[number][];
  clientSafePayload: "none_advisor_internal_only" | "compliance_released_projection_only";
  pageId: "036" | "037";
  proofPlacement: "queue_decision_summary" | "detail_decision_rail";
  summary: string;
};

export const advisorReviewRouteOwnership = [
  {
    pageFamily: "advisor_review_queue",
    pageId: "036",
    primaryJob: "Select one advisor review package and open the scoped recommendation detail without implying approval or release.",
    processIds: ["BP-050", "BP-051", "BP-052", "BP-053", "BP-054", "BP-055"],
    route: "/advisor/reviews",
    viewportRule: "Queue, selected recommendation context, blocker and one primary next action must fit without scrolling in the target viewport.",
  },
  {
    pageFamily: "advisor_review_detail",
    pageId: "037",
    primaryJob: "Review one recommendation, compare evidence-backed options, request evidence, return to analyst or approve only to compliance pending.",
    processIds: ["BP-050", "BP-051", "BP-052", "BP-053", "BP-054", "BP-055"],
    route: "/advisor/reviews/:id",
    viewportRule: "Recommendation identity, option comparison, evidence blocker and advisor action rail must fit without scrolling in the target viewport.",
  },
] as const satisfies readonly AdvisorReviewRouteOwner[];

export const advisorReviewForbiddenOverclaims = [
  "advisor_approval_as_release",
  "client_visibility",
  "compliance_released",
  "export_ready",
  "evidence_request_as_sufficiency",
  "advisor_rejection_as_compliance_block",
  "option_comparison_as_advice_execution",
  "queue_visibility_as_permission_to_mutate",
] as const;

export const advisorReviewPayloadVisibility = {
  advisorAllowedFields: [
    "client_safe_recommendation_summary",
    "redacted_internal_rationale",
    "option_comparison",
    "evidence_summary",
    "scope_status",
    "advisor_action_state",
    "required_next_gate",
  ],
  clientSafeAllowedFields: [
    "compliance_released_summary",
    "client_safe_status_label",
    "released_timestamp_where_applicable",
    "next_allowed_client_action",
  ],
  internalOnlyFields: [
    "aiDraft",
    "internalDraftText",
    "internalRationale",
    "analystNotes",
    "advisorNotes",
    "complianceNotes",
    "unsupportedClaims",
    "draftTraceInternals",
    "auditMetadataJson",
    "processCommandDebug",
    "workflowGateDebug",
    "rawEvidencePayload",
  ],
} as const;

export const advisorReviewAuditRequirements = [
  "operational.advisor_queue.triaged",
  "operational.advisor.queue_scope.allowed",
  "operational.advisor.queue_scope.denied",
  "operational.advisor.option_comparison.created",
  "operational.advisor.evidence_request.created",
  "operational.advisor.approved_without_release",
  "operational.advisor.returned_to_analyst",
  "advisor_review.backend_lifecycle.step.completed",
  "advisor_approval.process_step.completed",
  "advisor_review.backend_lifecycle.audit_failed_closed",
  "advisor_approval.audit_failed_closed",
] as const;

export const advisorReviewRoleGuards = [
  {
    action: "open_advisor_queue",
    allowedRoles: ["senior_wealth_advisor"],
    hardNegative: "Wrong role or object scope must hide or deny queue mutation without leaking recommendation payload.",
  },
  {
    action: "compare_options",
    allowedRoles: ["senior_wealth_advisor"],
    hardNegative: "Option comparison cannot execute advice, release content, export content or create client visibility.",
  },
  {
    action: "request_more_evidence",
    allowedRoles: ["senior_wealth_advisor"],
    hardNegative: "Evidence request cannot be treated as evidence sufficiency, compliance release or client-safe advice.",
  },
  {
    action: "approve_to_compliance",
    allowedRoles: ["senior_wealth_advisor"],
    hardNegative: "Advisor approval may complete BP-054-S03 and set compliance pending only; it cannot release or expose client payload.",
  },
  {
    action: "return_to_analyst",
    allowedRoles: ["senior_wealth_advisor"],
    hardNegative: "Return/reject must keep release, export and client visibility blocked and preserve audit reason.",
  },
] as const satisfies readonly AdvisorReviewRoleGuard[];

export const advisorReviewStateMachine = [
  {
    from: "ADVISOR_QUEUE_PENDING",
    guard: "scoped_advisor_can_view_recommendation",
    to: "ADVISOR_REVIEW_DETAIL_OPEN",
  },
  {
    from: "ADVISOR_REVIEW_DETAIL_OPEN",
    guard: "accepted_scoped_evidence_available",
    to: "OPTION_COMPARISON_READY",
  },
  {
    from: "OPTION_COMPARISON_READY",
    guard: "evidence_missing_or_stale",
    to: "EVIDENCE_REQUESTED_INTERNAL",
  },
  {
    from: "OPTION_COMPARISON_READY",
    guard: "advisor_approves_with_reason_and_audit",
    to: "ADVISOR_APPROVED_COMPLIANCE_PENDING",
  },
  {
    from: "OPTION_COMPARISON_READY",
    guard: "advisor_rejects_or_returns_with_reason_and_audit",
    to: "RETURNED_TO_ANALYST",
  },
  {
    from: "ADVISOR_REVIEW_DETAIL_OPEN",
    guard: "role_scope_evidence_or_audit_missing",
    to: "BLOCKED_BY_SCOPE_OR_EVIDENCE",
  },
] as const satisfies readonly { from: AdvisorReviewState; guard: string; to: AdvisorReviewState }[];

export const advisorReviewAcceptanceCriteria = [
  {
    processId: "BP-050",
    positive: "A scoped senior wealth advisor can open the queue, select a recommendation and see only advisor-authorized context.",
    negative: "Wrong role, wrong tenant or wrong object scope denies queue mutation without payload leak or client visibility.",
  },
  {
    processId: "BP-051",
    positive: "Advisor detail review shows recommendation, rationale, evidence state, blocker and next safe action.",
    negative: "Detail review cannot release content, export content, mark compliance released or expose internal draft payloads to clients.",
  },
  {
    processId: "BP-052",
    positive: "Option comparison persists evidence-backed options and keeps projection client-safe.",
    negative: "Option comparison cannot execute advice, bypass advisor/compliance gates or treat missing evidence as sufficient.",
  },
  {
    processId: "BP-053",
    positive: "Advisor can request more evidence with target role, reason and audit while recommendation remains internal.",
    negative: "Evidence request cannot create evidence sufficiency, compliance release, export readiness or client visibility.",
  },
  {
    processId: "BP-054",
    positive: "Advisor approval completes the advisor process step and moves the recommendation to compliance pending.",
    negative: "Advisor approval alone cannot release to client, download/export, satisfy compliance release or bypass audit.",
  },
  {
    processId: "BP-055",
    positive: "Advisor can reject or return the recommendation to analyst with reason, target role and audit.",
    negative: "Return/reject cannot become compliance block, client rejection, export failure or released client-safe status.",
  },
] as const satisfies readonly AdvisorReviewAcceptanceCriterion[];

export const advisorReviewProofBoundaries = [
  {
    auditPosture: "summary_only_not_audit_record",
    blockedOverclaims: [
      "advisor_approval_as_release",
      "client_visibility",
      "compliance_released",
      "export_ready",
      "queue_visibility_as_permission_to_mutate",
    ],
    clientSafePayload: "none_advisor_internal_only",
    pageId: "036",
    proofPlacement: "queue_decision_summary",
    summary: "Queue proof can show scoped advisor work only; it is not approval, release, export or client visibility.",
  },
  {
    auditPosture: "persisted_action_required",
    blockedOverclaims: [
      "advisor_approval_as_release",
      "client_visibility",
      "compliance_released",
      "export_ready",
      "evidence_request_as_sufficiency",
      "advisor_rejection_as_compliance_block",
      "option_comparison_as_advice_execution",
    ],
    clientSafePayload: "none_advisor_internal_only",
    pageId: "037",
    proofPlacement: "detail_decision_rail",
    summary: "Detail proof requires persisted advisor action audit and keeps every action internal until compliance release.",
  },
] as const satisfies readonly AdvisorReviewProofBoundary[];

export function advisorReviewRouteOwnershipForPageId(pageId: "036" | "037") {
  return advisorReviewRouteOwnership.find((owner) => owner.pageId === pageId);
}

export function advisorReviewProofBoundaryForPageId(pageId: "036" | "037") {
  return advisorReviewProofBoundaries.find((boundary) => boundary.pageId === pageId);
}
