export const complianceReviewReleaseContractId = "EPIC-11_COMPLIANCE_REVIEW_RELEASE_CONTRACT";

export type ComplianceReviewReleaseProcessId =
  | "BP-058"
  | "BP-059"
  | "BP-060"
  | "BP-061"
  | "BP-062"
  | "BP-063"
  | "BP-064"
  | "BP-066";

export type ComplianceReviewReleaseState =
  | "COMPLIANCE_QUEUE_PENDING"
  | "COMPLIANCE_DECISION_ROOM_OPEN"
  | "PRECONDITIONS_INCOMPLETE"
  | "EVIDENCE_INCOMPLETE"
  | "EVIDENCE_REQUESTED_RELEASE_BLOCKED"
  | "RELEASE_BLOCKED_BY_COMPLIANCE"
  | "RELEASE_READY_AUDIT_REQUIRED"
  | "CLIENT_SAFE_RELEASED"
  | "AUDIT_OR_EXCEPTION_REVIEW_REQUIRED"
  | "RELEASE_NOT_CLIENT_ACCEPTANCE";

export type ComplianceReviewReleasePageId = "038" | "039" | "040" | "041" | "042";

export type ComplianceReviewReleaseRouteOwner = {
  pageFamily:
    | "compliance_audit_exception_review"
    | "compliance_block_or_evidence_request"
    | "compliance_release_confirmation"
    | "compliance_release_decision_room"
    | "compliance_release_queue";
  pageId: ComplianceReviewReleasePageId;
  primaryJob: string;
  processIds: readonly ComplianceReviewReleaseProcessId[];
  route: string;
  viewportRule: string;
};

export type ComplianceReviewReleaseRoleGuard = {
  action: string;
  allowedRoles: readonly string[];
  hardNegative: string;
};

export type ComplianceReviewReleaseAcceptanceCriterion = {
  negative: string;
  positive: string;
  processId: ComplianceReviewReleaseProcessId;
};

export type ComplianceReviewReleaseProofBoundary = {
  auditPosture: "persisted_action_required" | "summary_only_not_audit_record";
  blockedOverclaims: readonly (typeof complianceReviewReleaseForbiddenOverclaims)[number][];
  clientSafePayload: "compliance_released_projection_only" | "none_compliance_internal_only";
  pageId: ComplianceReviewReleasePageId;
  proofPlacement: "audit_exception_table" | "block_reason_panel" | "decision_room_command_slot" | "queue_decision_summary" | "release_confirmation_modal";
  summary: string;
};

export const complianceReviewReleaseRouteOwnership = [
  {
    pageFamily: "compliance_release_queue",
    pageId: "038",
    primaryJob: "Triage one compliance review item and open the scoped decision room without release, export or client-acceptance overclaim.",
    processIds: ["BP-058", "BP-059", "BP-060", "BP-061", "BP-062", "BP-063", "BP-064", "BP-066"],
    route: "/compliance/reviews",
    viewportRule: "Queue, selected review context, blocker and one primary next action must fit without page-scroll in the target operating viewport.",
  },
  {
    pageFamily: "compliance_release_decision_room",
    pageId: "039",
    primaryJob: "Evaluate advisor approval, evidence, payload safety, permission and audit readiness before choosing release, block or evidence request.",
    processIds: ["BP-059", "BP-060", "BP-061", "BP-062", "BP-063", "BP-066"],
    route: "/compliance/reviews/:id/decision-room",
    viewportRule: "Decision context, preconditions, blocker, audit readiness and one command slot must be scannable without burying the primary action.",
  },
  {
    pageFamily: "compliance_release_confirmation",
    pageId: "040",
    primaryJob: "Confirm a release only after all release preconditions pass and the audited command can persist the release state.",
    processIds: ["BP-063", "BP-064", "BP-066"],
    route: "/compliance/reviews/:id/release",
    viewportRule: "Confirmation stays command-focused; policy detail and proof summaries remain concise.",
  },
  {
    pageFamily: "compliance_block_or_evidence_request",
    pageId: "041",
    primaryJob: "Block release or request evidence with reason and audit while preserving release/client/export denial.",
    processIds: ["BP-061", "BP-062", "BP-064", "BP-066"],
    route: "/compliance/reviews/:id/block",
    viewportRule: "Block reason, requested evidence, owner, due date and release-denial state stay above the proof details.",
  },
  {
    pageFamily: "compliance_audit_exception_review",
    pageId: "042",
    primaryJob: "Inspect persisted review, block, release and exception events without treating audit display as the mutation source.",
    processIds: ["BP-064", "BP-066"],
    route: "/compliance/reviews/:id/audit",
    viewportRule: "Audit route is a scan-and-inspect surface, not a long proof wall; persisted AuditEvent references remain the source of truth.",
  },
] as const satisfies readonly ComplianceReviewReleaseRouteOwner[];

export const complianceReviewReleaseForbiddenOverclaims = [
  "advisor_approval_as_release",
  "client_visibility_without_compliance_release",
  "compliance_release_as_client_acceptance",
  "upload_or_evidence_request_as_sufficiency",
  "release_preview_as_download_or_export",
  "audit_display_as_persisted_audit",
  "admin_or_role_override_as_release",
  "block_as_client_rejection",
] as const;

export const complianceReviewReleasePayloadVisibility = {
  clientSafeAllowedFields: [
    "compliance_released_summary",
    "client_safe_status_label",
    "released_at",
    "next_allowed_client_action",
    "redacted_evidence_summary",
  ],
  complianceAllowedFields: [
    "advisor_approval_state",
    "evidence_sufficiency_state",
    "release_preconditions",
    "audit_readiness",
    "client_safe_preview_candidate",
    "block_or_evidence_request_reason",
  ],
  internalOnlyFields: [
    "aiDraft",
    "internalDraftText",
    "internalRationale",
    "analystNotes",
    "advisorNotes",
    "complianceNotes",
    "auditMetadataJson",
    "processCommandDebug",
    "workflowGateDebug",
    "rawEvidencePayload",
  ],
} as const;

export const complianceReviewReleaseAuditRequirements = [
  "advisor_approval.request_evidence",
  "advisor_approval.compliance_block",
  "advisor_approval.compliance_release",
  "process.compliance_release.step.completed",
  "release_spine.preconditions.passed",
  "release_spine.preconditions.failed",
  "compliance_release.audit_failed_closed",
] as const;

export const complianceReviewReleaseRoleGuards = [
  {
    action: "open_compliance_queue",
    allowedRoles: ["compliance_officer"],
    hardNegative: "Wrong role, tenant or object scope must deny queue mutation without payload leak.",
  },
  {
    action: "evaluate_release_preconditions",
    allowedRoles: ["compliance_officer"],
    hardNegative: "Missing advisor approval, evidence, client-safe payload, permission or audit readiness blocks release.",
  },
  {
    action: "request_evidence",
    allowedRoles: ["compliance_officer"],
    hardNegative: "Requesting evidence cannot create evidence sufficiency, release, export readiness or client visibility.",
  },
  {
    action: "block_release",
    allowedRoles: ["compliance_officer"],
    hardNegative: "Block release must clear release state and keep client/export projection denied.",
  },
  {
    action: "release_to_client",
    allowedRoles: ["compliance_officer"],
    hardNegative: "Compliance release cannot bypass release spine, audit persistence, payload safety or client-acceptance separation.",
  },
] as const satisfies readonly ComplianceReviewReleaseRoleGuard[];

export const complianceReviewReleaseStateMachine = [
  {
    from: "COMPLIANCE_QUEUE_PENDING",
    guard: "scoped_compliance_officer_opens_review",
    to: "COMPLIANCE_DECISION_ROOM_OPEN",
  },
  {
    from: "COMPLIANCE_DECISION_ROOM_OPEN",
    guard: "advisor_evidence_payload_permission_or_audit_missing",
    to: "PRECONDITIONS_INCOMPLETE",
  },
  {
    from: "PRECONDITIONS_INCOMPLETE",
    guard: "evidence_missing_or_stale",
    to: "EVIDENCE_INCOMPLETE",
  },
  {
    from: "EVIDENCE_INCOMPLETE",
    guard: "compliance_requests_evidence_with_reason_and_audit",
    to: "EVIDENCE_REQUESTED_RELEASE_BLOCKED",
  },
  {
    from: "COMPLIANCE_DECISION_ROOM_OPEN",
    guard: "compliance_blocks_with_reason_and_audit",
    to: "RELEASE_BLOCKED_BY_COMPLIANCE",
  },
  {
    from: "COMPLIANCE_DECISION_ROOM_OPEN",
    guard: "release_spine_preconditions_pass_and_audit_required",
    to: "RELEASE_READY_AUDIT_REQUIRED",
  },
  {
    from: "RELEASE_READY_AUDIT_REQUIRED",
    guard: "audited_release_command_persists",
    to: "CLIENT_SAFE_RELEASED",
  },
  {
    from: "CLIENT_SAFE_RELEASED",
    guard: "client_decision_not_recorded",
    to: "RELEASE_NOT_CLIENT_ACCEPTANCE",
  },
] as const satisfies readonly { from: ComplianceReviewReleaseState; guard: string; to: ComplianceReviewReleaseState }[];

export const complianceReviewReleaseAcceptanceCriteria = [
  {
    processId: "BP-058",
    positive: "Compliance queue produces one scoped compliance review item and can open the correct decision room.",
    negative: "Queue visibility cannot release, export, block, mutate client visibility or leak internal payload.",
  },
  {
    processId: "BP-059",
    positive: "Precondition check returns pass/fail for advisor approval, evidence, payload, permission, audit and release-spine readiness.",
    negative: "Any missing precondition keeps release blocked and records no client-safe release.",
  },
  {
    processId: "BP-060",
    positive: "Evidence completeness requires reviewed, scoped, current and client-safe evidence for the specific gate.",
    negative: "Upload success, stale evidence, unlinked evidence or internal-only evidence cannot satisfy release.",
  },
  {
    processId: "BP-061",
    positive: "Compliance can request evidence with reason, target ownership and audit while release remains blocked.",
    negative: "Evidence request cannot be treated as sufficiency, release, export or client visibility.",
  },
  {
    processId: "BP-062",
    positive: "Compliance can block release with reason and audit and keep release/client/export state denied.",
    negative: "Block cannot become client rejection, client acceptance, export action or hidden release.",
  },
  {
    processId: "BP-063",
    positive: "Compliance release can persist only when release spine, process runtime, evidence, payload, permission and audit preconditions pass.",
    negative: "Missing evidence, missing advisor approval, inactive compliance step, audit failure, forbidden payload or admin override blocks release.",
  },
  {
    processId: "BP-064",
    positive: "Exception/audit handling exposes persisted action outcomes and exception state for review.",
    negative: "Display-only audit rows, missing audit persistence or debug metadata cannot count as release proof.",
  },
  {
    processId: "BP-066",
    positive: "UI, service and tests state that compliance release controls client visibility but is not client acceptance.",
    negative: "Released content cannot be labelled accepted by client, advice executed, downloaded/exported or client decisioned by compliance release alone.",
  },
] as const satisfies readonly ComplianceReviewReleaseAcceptanceCriterion[];

export const complianceReviewReleaseProofBoundaries = [
  {
    auditPosture: "summary_only_not_audit_record",
    blockedOverclaims: [
      "client_visibility_without_compliance_release",
      "compliance_release_as_client_acceptance",
      "release_preview_as_download_or_export",
    ],
    clientSafePayload: "none_compliance_internal_only",
    pageId: "038",
    proofPlacement: "queue_decision_summary",
    summary: "Queue proof can show compliance work intake only; it is not release, export, download or client acceptance.",
  },
  {
    auditPosture: "persisted_action_required",
    blockedOverclaims: [
      "advisor_approval_as_release",
      "client_visibility_without_compliance_release",
      "upload_or_evidence_request_as_sufficiency",
      "admin_or_role_override_as_release",
    ],
    clientSafePayload: "none_compliance_internal_only",
    pageId: "039",
    proofPlacement: "decision_room_command_slot",
    summary: "Decision-room proof requires preconditions, permission and audit readiness before any release action can persist.",
  },
  {
    auditPosture: "persisted_action_required",
    blockedOverclaims: [
      "release_preview_as_download_or_export",
      "compliance_release_as_client_acceptance",
      "audit_display_as_persisted_audit",
    ],
    clientSafePayload: "compliance_released_projection_only",
    pageId: "040",
    proofPlacement: "release_confirmation_modal",
    summary: "Release confirmation can persist only a client-safe projection and never records client acceptance.",
  },
  {
    auditPosture: "persisted_action_required",
    blockedOverclaims: [
      "block_as_client_rejection",
      "upload_or_evidence_request_as_sufficiency",
      "client_visibility_without_compliance_release",
    ],
    clientSafePayload: "none_compliance_internal_only",
    pageId: "041",
    proofPlacement: "block_reason_panel",
    summary: "Block or evidence request proof keeps release, export and client visibility denied until the missing gate is resolved.",
  },
  {
    auditPosture: "summary_only_not_audit_record",
    blockedOverclaims: [
      "audit_display_as_persisted_audit",
      "compliance_release_as_client_acceptance",
    ],
    clientSafePayload: "none_compliance_internal_only",
    pageId: "042",
    proofPlacement: "audit_exception_table",
    summary: "Audit display is review context; persisted AuditEvent references remain the source of truth.",
  },
] as const satisfies readonly ComplianceReviewReleaseProofBoundary[];

export function complianceReviewReleaseRouteOwnershipForPageId(pageId: ComplianceReviewReleasePageId) {
  return complianceReviewReleaseRouteOwnership.find((owner) => owner.pageId === pageId);
}

export function complianceReviewReleaseProofBoundaryForPageId(pageId: ComplianceReviewReleasePageId) {
  return complianceReviewReleaseProofBoundaries.find((boundary) => boundary.pageId === pageId);
}
