export const decisionRecordEvidenceAuditContractId = "EPIC-12_DECISION_RECORD_EVIDENCE_AUDIT_CONTRACT";

export type DecisionRecordEvidenceAuditProcessId =
  | "BP-075"
  | "BP-076"
  | "BP-077"
  | "BP-078"
  | "BP-081"
  | "BP-082"
  | "BP-083";

export type DecisionRecordEvidenceAuditPageId = "043" | "044" | "045" | "046" | "047" | "051";

export type DecisionRecordEvidenceAuditState =
  | "DECISION_REGISTER_OPEN"
  | "DECISION_ROOM_OPEN"
  | "RATIONALE_CAPTURE_REQUIRED"
  | "EVIDENCE_LINK_REQUIRED"
  | "EVIDENCE_VAULT_REVIEW"
  | "AUDIT_HISTORY_REVIEW"
  | "ACTION_CONFIRMATION_REQUIRED"
  | "AUDIT_PERSISTED"
  | "AUDIT_FAILED_CLOSED"
  | "CLIENT_SAFE_PROJECTION_ONLY";

export type DecisionRecordEvidenceAuditStepPendant = {
  blockerOrFailureUi: string;
  gateOrDecisionUi: string;
  inputUi: string;
  outputUi: string;
  stepLabel: "Create decision" | "Link evidence" | "Capture rationale/status" | "Project safely" | "Review history";
  stepSequence: 1 | 2 | 3 | 4 | 5;
};

export type DecisionRecordEvidenceAuditRouteOwner = {
  pageFamily:
    | "audit_history"
    | "decision_register"
    | "decision_room"
    | "decision_success"
    | "evidence_record_detail"
    | "evidence_vault";
  pageId: DecisionRecordEvidenceAuditPageId;
  primaryJob: string;
  processIds: readonly DecisionRecordEvidenceAuditProcessId[];
  route: string;
  stepPendants: readonly DecisionRecordEvidenceAuditStepPendant[];
  viewportRule: string;
};

export type DecisionRecordEvidenceAuditAcceptanceCriterion = {
  negative: string;
  positive: string;
  processId: DecisionRecordEvidenceAuditProcessId;
};

export type DecisionRecordEvidenceAuditProofBoundary = {
  auditPosture: "persisted_action_required" | "read_only_audit_review" | "summary_only_not_audit_record";
  blockedOverclaims: readonly (typeof decisionRecordEvidenceAuditForbiddenOverclaims)[number][];
  clientSafePayload: "decision_released_projection_only" | "none_internal_review_only";
  pageId: DecisionRecordEvidenceAuditPageId;
  proofPlacement:
    | "audit_history_table"
    | "decision_confirmation_modal"
    | "decision_register_selection"
    | "decision_success_summary"
    | "evidence_detail_provenance"
    | "evidence_vault_drawer";
  summary: string;
};

export const decisionRecordEvidenceAuditProcessIds = [
  "BP-075",
  "BP-076",
  "BP-077",
  "BP-078",
  "BP-081",
  "BP-082",
  "BP-083",
] as const satisfies readonly DecisionRecordEvidenceAuditProcessId[];

export const decisionRecordEvidenceAuditPageIds = [
  "043",
  "044",
  "045",
  "046",
  "047",
  "051",
] as const satisfies readonly DecisionRecordEvidenceAuditPageId[];

export const decisionRecordEvidenceAuditForbiddenOverclaims = [
  "advisor_decision_as_compliance_release",
  "decision_submit_as_client_acceptance",
  "evidence_link_as_sufficiency",
  "audit_display_as_persisted_audit",
  "history_view_as_mutation_authority",
  "download_or_share_from_evidence_review",
  "client_visibility_without_release_projection",
  "admin_or_role_override_as_decision_completion",
] as const;

export const decisionRecordEvidenceAuditPayloadVisibility = {
  clientSafeAllowedFields: [
    "decision_id",
    "decision_title",
    "client_safe_summary",
    "released_at",
    "released_state",
    "next_allowed_client_action",
  ],
  internalReviewFields: [
    "decision_options",
    "linked_evidence_summary",
    "rationale_summary",
    "audit_reference",
    "review_history",
    "status_transition_reason",
  ],
  internalOnlyFields: [
    "aiDraft",
    "internalRationale",
    "advisorNotes",
    "complianceNotes",
    "rawEvidencePayload",
    "auditMetadataJson",
    "processCommandDebug",
    "workflowGateDebug",
  ],
} as const;

export const decisionRecordEvidenceAuditRequirements = [
  "decision_record.create_or_open",
  "decision_record.link_evidence",
  "decision_record.capture_rationale",
  "decision_record.status_transition",
  "decision_record.confirm_action_with_audit",
  "evidence_vault.open_record_drawer",
  "evidence_vault.block_share_without_release",
  "audit_history.read_persisted_event",
  "audit_history.fail_closed_when_persistence_unavailable",
] as const;

const sharedStepPendants = [
  {
    blockerOrFailureUi: "Role, tenant, scope or missing precondition renders a blocked state without payload leak.",
    gateOrDecisionUi: "Decision register selection and detail open gate.",
    inputUi: "Decision row, selected decision object and action intent.",
    outputUi: "Scoped decision detail or selected decision record.",
    stepLabel: "Create decision",
    stepSequence: 1,
  },
  {
    blockerOrFailureUi: "Missing or unreleased evidence leaves evidence/action controls blocked.",
    gateOrDecisionUi: "Evidence link and source/provenance review gate.",
    inputUi: "Linked evidence package, evidence drawer or source record.",
    outputUi: "Evidence-linked decision context without sufficiency overclaim.",
    stepLabel: "Link evidence",
    stepSequence: 2,
  },
  {
    blockerOrFailureUi: "Rationale absence keeps confirmation unavailable or decision review incomplete.",
    gateOrDecisionUi: "Rationale/status capture and confirmation gate.",
    inputUi: "Decision rationale, selected option, status reason or review comment.",
    outputUi: "Rationale/status summary tied to the decision record.",
    stepLabel: "Capture rationale/status",
    stepSequence: 3,
  },
  {
    blockerOrFailureUi: "Missing release, permission, audit or evidence gate keeps client-safe projection unavailable.",
    gateOrDecisionUi: "Client-safe projection and no-overclaim gate.",
    inputUi: "Released-package state, payload allowlist and permission/audit readiness.",
    outputUi: "Client-safe projection only, never client acceptance or export readiness.",
    stepLabel: "Project safely",
    stepSequence: 4,
  },
  {
    blockerOrFailureUi: "Display-only audit/history cannot mutate state or count as persistence proof.",
    gateOrDecisionUi: "Persisted audit/history review gate.",
    inputUi: "Audit event, history row, lineage or previous/next state.",
    outputUi: "Reviewable history record with source reference and no mutation authority.",
    stepLabel: "Review history",
    stepSequence: 5,
  },
] as const satisfies readonly DecisionRecordEvidenceAuditStepPendant[];

export const decisionRecordEvidenceAuditRouteOwnership = [
  {
    pageFamily: "decision_register",
    pageId: "043",
    primaryJob: "Find and select one decision record without creating release, evidence sufficiency, export or client-acceptance claims.",
    processIds: ["BP-075", "BP-076", "BP-078"],
    route: "/decisions",
    stepPendants: sharedStepPendants.slice(0, 1),
    viewportRule: "Decision rows, selected state and one next action must be visible without a proof-wall or internal process explainer.",
  },
  {
    pageFamily: "decision_room",
    pageId: "044",
    primaryJob: "Review released decision context, options, evidence, rationale and confirmation before recording a scoped decision action.",
    processIds: ["BP-075", "BP-076", "BP-077", "BP-078"],
    route: "/decisions/:id",
    stepPendants: sharedStepPendants,
    viewportRule: "Decision context, rationale, evidence, confirmation and blocker state must be scannable in one operating surface.",
  },
  {
    pageFamily: "decision_success",
    pageId: "045",
    primaryJob: "Show the persisted decision-action result, audit reference, queued evidence package and next review without expanding authority.",
    processIds: ["BP-075", "BP-078", "BP-082", "BP-083"],
    route: "/decisions/:id/success",
    stepPendants: [sharedStepPendants[3], sharedStepPendants[4]],
    viewportRule: "Success state must show result, audit, evidence queue and next review while preserving no-overclaim copy.",
  },
  {
    pageFamily: "evidence_vault",
    pageId: "046",
    primaryJob: "Select evidence, inspect source context and keep sharing/publication blocked until release surfaces authorize it.",
    processIds: ["BP-081"],
    route: "/evidence",
    stepPendants: [sharedStepPendants[1], sharedStepPendants[3]],
    viewportRule: "Evidence master/detail, drawer lifecycle and blocked share state must fit as a review surface.",
  },
  {
    pageFamily: "evidence_record_detail",
    pageId: "047",
    primaryJob: "Inspect one evidence record's provenance, source metadata, timeline and related decision context.",
    processIds: ["BP-081", "BP-082"],
    route: "/evidence/:id/review",
    stepPendants: [sharedStepPendants[1], sharedStepPendants[4]],
    viewportRule: "Evidence detail must show provenance and history without implying download/share/export readiness.",
  },
  {
    pageFamily: "audit_history",
    pageId: "051",
    primaryJob: "Review persisted audit lineage and exceptions as read-only evidence for decision/evidence governance.",
    processIds: ["BP-082", "BP-083"],
    route: "/governance/audit",
    stepPendants: [sharedStepPendants[4]],
    viewportRule: "Audit rows, selected lineage and export/request blocker must remain readable without treating the display as mutation authority.",
  },
] as const satisfies readonly DecisionRecordEvidenceAuditRouteOwner[];

export const decisionRecordEvidenceAuditRoleGuards = [
  {
    action: "open_decision_record",
    allowedRoles: ["principal", "family_cfo", "trustee", "senior_wealth_advisor", "compliance_officer"],
    hardNegative: "Wrong role, tenant or object scope must hide or deny the decision body without internal payload leak.",
  },
  {
    action: "record_decision_action",
    allowedRoles: ["principal", "family_cfo", "trustee"],
    hardNegative: "Decision submission cannot bypass release, evidence, permission, exact confirmation or audit persistence.",
  },
  {
    action: "inspect_evidence_record",
    allowedRoles: ["principal", "family_cfo", "trustee", "senior_wealth_advisor", "compliance_officer"],
    hardNegative: "Evidence inspection cannot become evidence sufficiency, export, download, share or client visibility.",
  },
  {
    action: "review_audit_history",
    allowedRoles: ["compliance_officer", "admin", "security_officer"],
    hardNegative: "Audit history display cannot create, suppress or replace a persisted audit event.",
  },
] as const;

export const decisionRecordEvidenceAuditStateMachine = [
  { from: "DECISION_REGISTER_OPEN", guard: "scoped_user_selects_decision", to: "DECISION_ROOM_OPEN" },
  { from: "DECISION_ROOM_OPEN", guard: "rationale_missing_or_status_unclear", to: "RATIONALE_CAPTURE_REQUIRED" },
  { from: "RATIONALE_CAPTURE_REQUIRED", guard: "evidence_missing_or_unlinked", to: "EVIDENCE_LINK_REQUIRED" },
  { from: "EVIDENCE_LINK_REQUIRED", guard: "evidence_selected_for_review", to: "EVIDENCE_VAULT_REVIEW" },
  { from: "DECISION_ROOM_OPEN", guard: "decision_action_needs_exact_confirmation", to: "ACTION_CONFIRMATION_REQUIRED" },
  { from: "ACTION_CONFIRMATION_REQUIRED", guard: "audit_persistence_unavailable", to: "AUDIT_FAILED_CLOSED" },
  { from: "ACTION_CONFIRMATION_REQUIRED", guard: "audited_decision_action_persists", to: "AUDIT_PERSISTED" },
  { from: "AUDIT_PERSISTED", guard: "client_projection_allowlist_only", to: "CLIENT_SAFE_PROJECTION_ONLY" },
  { from: "AUDIT_PERSISTED", guard: "review_history_requested", to: "AUDIT_HISTORY_REVIEW" },
] as const satisfies readonly { from: DecisionRecordEvidenceAuditState; guard: string; to: DecisionRecordEvidenceAuditState }[];

export const decisionRecordEvidenceAuditAcceptanceCriteria = [
  {
    processId: "BP-075",
    positive: "Decision creation produces a scoped decision record with linked evidence/rationale context and no downstream release overclaim.",
    negative: "Missing role, tenant, evidence, confirmation or audit persistence blocks mutation without client visibility or payload leak.",
  },
  {
    processId: "BP-076",
    positive: "Decision room assembly shows decision, options, evidence, rationale, confirmation and blockers in one governed surface.",
    negative: "A decision room cannot create release, evidence sufficiency, export readiness or client acceptance by display alone.",
  },
  {
    processId: "BP-077",
    positive: "Rationale capture has an explicit UI pendant and persisted/auditable output reference before decision completion is claimed.",
    negative: "Rationale copy, internal notes or status badges cannot stand in for captured rationale or audit-backed decision state.",
  },
  {
    processId: "BP-078",
    positive: "Decision status transition records previous/next state and audit reference while keeping release/export boundaries separate.",
    negative: "Status transition cannot bypass exact confirmation, permission, audit persistence, evidence gates or client-safe projection controls.",
  },
  {
    processId: "BP-081",
    positive: "Evidence vault linkage ties selected evidence to decision context with provenance and blocked share/publication state.",
    negative: "Linked or uploaded evidence cannot count as sufficiency, release, export, download, share or client visibility.",
  },
  {
    processId: "BP-082",
    positive: "Audit timeline display reads persisted/source-backed events and exposes lineage for review.",
    negative: "Display-only audit rows cannot create, replace, suppress or count as a persisted audit event.",
  },
  {
    processId: "BP-083",
    positive: "Exception and review history exposes previous/next state, actor, reason and result for decision/evidence governance review.",
    negative: "History review cannot mutate decisions, hide exceptions, approve exports or expand client visibility.",
  },
] as const satisfies readonly DecisionRecordEvidenceAuditAcceptanceCriterion[];

export const decisionRecordEvidenceAuditProofBoundaries = [
  {
    auditPosture: "summary_only_not_audit_record",
    blockedOverclaims: ["advisor_decision_as_compliance_release", "decision_submit_as_client_acceptance", "client_visibility_without_release_projection"],
    clientSafePayload: "none_internal_review_only",
    pageId: "043",
    proofPlacement: "decision_register_selection",
    summary: "Decision register is selection/triage only; it does not mutate decision, evidence, release or export state.",
  },
  {
    auditPosture: "persisted_action_required",
    blockedOverclaims: ["decision_submit_as_client_acceptance", "evidence_link_as_sufficiency", "client_visibility_without_release_projection"],
    clientSafePayload: "decision_released_projection_only",
    pageId: "044",
    proofPlacement: "decision_confirmation_modal",
    summary: "Decision-room action requires exact confirmation and audit persistence, and still records only the scoped decision action.",
  },
  {
    auditPosture: "persisted_action_required",
    blockedOverclaims: ["decision_submit_as_client_acceptance", "audit_display_as_persisted_audit"],
    clientSafePayload: "decision_released_projection_only",
    pageId: "045",
    proofPlacement: "decision_success_summary",
    summary: "Success route can show a persisted audit reference and next review; it is not broader client acceptance or export authority.",
  },
  {
    auditPosture: "summary_only_not_audit_record",
    blockedOverclaims: ["evidence_link_as_sufficiency", "download_or_share_from_evidence_review", "client_visibility_without_release_projection"],
    clientSafePayload: "none_internal_review_only",
    pageId: "046",
    proofPlacement: "evidence_vault_drawer",
    summary: "Evidence vault can inspect selected records and drawer state; sharing/publication remains blocked until release surfaces authorize it.",
  },
  {
    auditPosture: "read_only_audit_review",
    blockedOverclaims: ["evidence_link_as_sufficiency", "download_or_share_from_evidence_review", "history_view_as_mutation_authority"],
    clientSafePayload: "none_internal_review_only",
    pageId: "047",
    proofPlacement: "evidence_detail_provenance",
    summary: "Evidence detail shows provenance and timeline as review context, not mutation or export authority.",
  },
  {
    auditPosture: "read_only_audit_review",
    blockedOverclaims: ["audit_display_as_persisted_audit", "history_view_as_mutation_authority", "admin_or_role_override_as_decision_completion"],
    clientSafePayload: "none_internal_review_only",
    pageId: "051",
    proofPlacement: "audit_history_table",
    summary: "Audit-history route reviews persisted/source-backed lineage and must not replace the action's audit persistence proof.",
  },
] as const satisfies readonly DecisionRecordEvidenceAuditProofBoundary[];

export function decisionRecordEvidenceAuditRouteOwnershipForPageId(pageId: DecisionRecordEvidenceAuditPageId) {
  return decisionRecordEvidenceAuditRouteOwnership.find((owner) => owner.pageId === pageId);
}

export function decisionRecordEvidenceAuditProofBoundaryForPageId(pageId: DecisionRecordEvidenceAuditPageId) {
  return decisionRecordEvidenceAuditProofBoundaries.find((boundary) => boundary.pageId === pageId);
}
