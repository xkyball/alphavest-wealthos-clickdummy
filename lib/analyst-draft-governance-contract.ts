export const analystDraftGovernanceContractId = "EPIC-09_ANALYST_DRAFT_GOVERNANCE_CONTRACT";

export type AnalystDraftProcessId =
  | "BP-034"
  | "BP-038"
  | "BP-039"
  | "BP-040"
  | "BP-041"
  | "BP-042"
  | "BP-043"
  | "BP-044"
  | "BP-045"
  | "BP-046"
  | "BP-047"
  | "BP-048";

export type AnalystDraftStepId =
  | "signal_intake"
  | "workbench_triage"
  | "action_item_creation"
  | "evidence_gap_identification"
  | "data_quality_issue_routing"
  | "internal_draft_generation"
  | "draft_classification"
  | "unsupported_claim_detection"
  | "draft_rejection"
  | "evidence_backed_rebuild"
  | "internal_only_redaction"
  | "source_evidence_traceability";

export type AnalystDraftState =
  | "SIGNAL_INTAKE_NEW"
  | "WORKBENCH_TRIAGE"
  | "EVIDENCE_GAP_IDENTIFIED"
  | "INTERNAL_DRAFT_GENERATED"
  | "DRAFT_CLASSIFICATION_PENDING"
  | "UNSUPPORTED_CLAIM_BLOCKED"
  | "DRAFT_REJECTED_INTERNAL"
  | "REBUILD_NEEDS_EVIDENCE"
  | "REBUILT_WITH_EVIDENCE"
  | "REDACTED_INTERNAL_ONLY"
  | "TRACEABLE_ADVISOR_CANDIDATE";

export type AnalystDraftRouteOwner = {
  pageFamily: "analyst_signal_hub" | "analyst_trigger_review" | "analyst_workbench";
  pageId: "033" | "034" | "035";
  primaryJob: string;
  processIds: readonly AnalystDraftProcessId[];
  route: string;
  viewportRule: string;
};

export type AnalystDraftRoleGuard = {
  action: string;
  allowedRoles: readonly string[];
  hardNegative: string;
};

export type AnalystDraftAcceptanceCriterion = {
  negative: string;
  positive: string;
  processId: AnalystDraftProcessId;
};

export const analystDraftRouteOwnership = [
  {
    pageFamily: "analyst_signal_hub",
    pageId: "033",
    primaryJob: "Orient signal and draft work around one internal next action without duplicating trigger detail.",
    processIds: ["BP-034", "BP-038", "BP-039", "BP-040", "BP-041"],
    route: "/advisory",
    viewportRule: "Area status, blocker and next action must be visible without scrolling in the target viewport.",
  },
  {
    pageFamily: "analyst_workbench",
    pageId: "034",
    primaryJob: "Select one analyst work item, expose current signal/draft state, blocker and allowed handoff.",
    processIds: ["BP-034", "BP-038", "BP-039", "BP-040", "BP-041", "BP-042", "BP-043", "BP-044"],
    route: "/advisory/review-queue",
    viewportRule: "Queue, selected object, blocker and one primary next action must fit without scrolling in the target viewport.",
  },
  {
    pageFamily: "analyst_trigger_review",
    pageId: "035",
    primaryJob: "Review one trigger/internal draft object and resolve evidence or unsupported-claim blockers.",
    processIds: ["BP-040", "BP-042", "BP-043", "BP-044", "BP-045", "BP-046", "BP-047", "BP-048"],
    route: "/advisory/triggers/:id/review",
    viewportRule: "Trigger identity, draft state, blocker and recovery action must fit without scrolling in the target viewport.",
  },
] as const satisfies readonly AnalystDraftRouteOwner[];

export const analystDraftForbiddenOverclaims = [
  "advice_created",
  "advisor_approved",
  "compliance_released",
  "client_visibility",
  "export_ready",
  "evidence_gap_as_sufficiency",
  "redaction_as_release",
  "route_to_advisor_as_approval",
] as const;

export const analystDraftPayloadVisibility = {
  advisorAllowedFields: [
    "redacted_internal_draft_candidate",
    "evidence_summary",
    "unsupported_claim_status",
    "safe_source_trace_summary",
    "analyst_review_state",
    "required_next_gate",
  ],
  clientSafeAllowedFields: [
    "released_or_compliance_approved_summary",
    "safe_status_label",
    "next_allowed_client_action",
    "released_timestamp_where_applicable",
  ],
  internalOnlyFields: [
    "aiDraft",
    "internalDraftText",
    "internalRationale",
    "analystNotes",
    "advisorNotes",
    "complianceNotes",
    "unsupportedClaims",
    "draftClassificationReason",
    "draftTraceInternals",
    "sourceRefsJson",
    "auditMetadataJson",
    "evidenceInternalIds",
    "rawExtractionPayload",
    "workflowGateDebug",
  ],
} as const;

export const analystDraftAuditRequirements = [
  "p44.signal.intake.created",
  "p44.workbench.assign_review",
  "p44.workbench.block_signal",
  "p44.workbench.request_evidence",
  "p44.workbench.route_to_advisor",
  "p44.action_item.created_from_signal",
  "p44.evidence_gap.blocked_no_target",
  "p44.evidence_gap.converted_to_request",
  "internal_draft.generated",
  "internal_draft.classified",
  "internal_draft.unsupported_claim.flagged",
  "internal_draft.rejected",
  "internal_draft.rebuild.blocked",
  "internal_draft.rebuilt_with_evidence",
  "internal_draft.redacted_internal_only",
  "internal_draft.trace.created",
  "internal_draft.route_to_advisor",
] as const;

export const analystDraftRoleGuards = [
  {
    action: "intake_signal",
    allowedRoles: ["analyst", "client_success", "compliance_officer", "senior_wealth_advisor"],
    hardNegative: "Signal intake creates no autonomous advice, release, export approval or client visibility.",
  },
  {
    action: "triage_workbench_item",
    allowedRoles: ["analyst", "compliance_officer", "senior_wealth_advisor"],
    hardNegative: "Wrong role or wrong tenant gets deny/blocked/hidden without payload leak or mutation.",
  },
  {
    action: "rebuild_internal_draft",
    allowedRoles: ["analyst"],
    hardNegative: "Rebuild without accepted scoped evidence is blocked and audited.",
  },
  {
    action: "route_to_advisor",
    allowedRoles: ["analyst"],
    hardNegative: "Route-to-advisor may set advisor-pending only; it cannot release, export or set clientVisible.",
  },
] as const satisfies readonly AnalystDraftRoleGuard[];

export const analystDraftAcceptanceCriteria = [
  {
    processId: "BP-034",
    positive: "A valid signal creates an internal trigger, queue item and audit event with no autonomous advice.",
    negative: "Unsupported source, confidence, severity, role or tenant scope is rejected without mutation or payload leak.",
  },
  {
    processId: "BP-038",
    positive: "Workbench triage moves one selected signal through assign, block, request-evidence or advisor-handoff states with audit.",
    negative: "Triage cannot approve advice, release content, export content or create client visibility.",
  },
  {
    processId: "BP-039",
    positive: "Action item creation records owner, reason, source trigger and internal-only visibility.",
    negative: "Action creation cannot create client-visible recommendation, evidence sufficiency or downstream release.",
  },
  {
    processId: "BP-040",
    positive: "Evidence gap identification creates a scoped request or blocks the signal/draft with recoverable reason.",
    negative: "Evidence gap state cannot be treated as sufficiency, advisor readiness or client-safe advice.",
  },
  {
    processId: "BP-041",
    positive: "Data-quality issue routing creates an internal work item with owner, priority, blocker and recovery path.",
    negative: "Data-quality routing cannot silently skip evidence, advisor or compliance gates.",
  },
  {
    processId: "BP-042",
    positive: "Internal draft generation creates an internal state with source context and explicit no-client boundary.",
    negative: "Generated draft cannot appear in client, export or client-safe API payloads.",
  },
  {
    processId: "BP-043",
    positive: "Draft classification marks type, review state, forbidden-payload boundary and next safe action.",
    negative: "Classification cannot mark content client-safe, advisor-approved or compliance-released.",
  },
  {
    processId: "BP-044",
    positive: "Unsupported claims are surfaced as blockers with request-evidence, reject or rebuild recovery path.",
    negative: "Unsupported claims cannot be routed to advisor or export/client projections.",
  },
  {
    processId: "BP-045",
    positive: "Draft rejection records reason, actor, audit event and internal-only recovery state.",
    negative: "Draft rejection cannot imply client rejection, advisor rejection, compliance block or export failure.",
  },
  {
    processId: "BP-046",
    positive: "Rebuild succeeds only when scoped evidence is accepted and source trace is preserved.",
    negative: "Rebuild without evidence fails closed and leaves advisor/compliance/client/export states unchanged.",
  },
  {
    processId: "BP-047",
    positive: "Internal-only redaction removes forbidden payloads from downstream candidates while preserving internal proof.",
    negative: "Redaction cannot be treated as compliance release, export approval or client acceptance.",
  },
  {
    processId: "BP-048",
    positive: "Source traceability ties a draft candidate to safe evidence/source references before advisor handoff.",
    negative: "Missing source trace blocks handoff and never exposes raw trace internals to clients.",
  },
] as const satisfies readonly AnalystDraftAcceptanceCriterion[];

export function analystDraftRouteOwnershipForPageId(pageId: "033" | "034" | "035") {
  return analystDraftRouteOwnership.find((owner) => owner.pageId === pageId);
}
