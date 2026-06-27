import type { NoOverclaimBoundary } from "@/lib/no-overclaim-copy";
import { noOverclaimCopy } from "@/lib/no-overclaim-copy";
import type { UxActionMeaning } from "@/lib/ux-action-hierarchy-contract";
import type { UxStateFamily } from "@/lib/ux-lifecycle-state-contract";

export type UxFeedbackIntent =
  | "status"
  | "pending"
  | "validation"
  | "blocked"
  | "denied"
  | "fail_closed"
  | "retry"
  | "success";

export type UxFeedbackSubject =
  | "upload"
  | "evidence_review"
  | "evidence_sufficiency"
  | "advisor_approval"
  | "compliance_release"
  | "client_visibility"
  | "client_acceptance"
  | "audit_persistence"
  | "permission_scope"
  | "export_scope"
  | "export_redaction"
  | "export_approval"
  | "export_generation"
  | "download"
  | "share"
  | "generic_action";

export type UxFeedbackPlacement =
  | "page_state"
  | "modal_body"
  | "modal_status"
  | "field"
  | "inline_cluster"
  | "action_rail"
  | "screen_reader";

export type UxFeedbackAudience =
  | "operational_internal"
  | "reviewer_proof"
  | "client_safe"
  | "audience_neutral";

export type UxFeedbackSubjectContract = {
  actionMeaning?: UxActionMeaning;
  audience: UxFeedbackAudience;
  boundary: NoOverclaimBoundary;
  downstreamForbidden: string;
  stateFamily: UxStateFamily;
  subject: UxFeedbackSubject;
};

export type UxFeedbackRuntimeAttributes = Record<`data-${string}`, string | undefined>;

export type UxFeedbackProjectionInput = {
  actionMeaning?: UxActionMeaning;
  audience?: UxFeedbackAudience;
  boundary?: NoOverclaimBoundary;
  downstreamForbidden?: string;
  intent: UxFeedbackIntent;
  placement: UxFeedbackPlacement;
  stateFamily?: UxStateFamily;
  subject: UxFeedbackSubject;
};

export const uxFeedbackIntents = [
  "status",
  "pending",
  "validation",
  "blocked",
  "denied",
  "fail_closed",
  "retry",
  "success",
] as const satisfies readonly UxFeedbackIntent[];

export const uxFeedbackSubjects = [
  "upload",
  "evidence_review",
  "evidence_sufficiency",
  "advisor_approval",
  "compliance_release",
  "client_visibility",
  "client_acceptance",
  "audit_persistence",
  "permission_scope",
  "export_scope",
  "export_redaction",
  "export_approval",
  "export_generation",
  "download",
  "share",
  "generic_action",
] as const satisfies readonly UxFeedbackSubject[];

export const uxFeedbackSubjectContracts = {
  advisor_approval: {
    actionMeaning: "approve",
    audience: "operational_internal",
    boundary: "advisorApprovalNotRelease",
    downstreamForbidden: "compliance release, export, client visibility and client acceptance",
    stateFamily: "restricted",
    subject: "advisor_approval",
  },
  audit_persistence: {
    audience: "operational_internal",
    boundary: "auditDisplayNotProof",
    downstreamForbidden: "audit persistence proof without an accepted audited action response",
    stateFamily: "audit_unavailable",
    subject: "audit_persistence",
  },
  client_acceptance: {
    actionMeaning: "client_acceptance",
    audience: "client_safe",
    boundary: "noDownstreamCompletion",
    downstreamForbidden: "internal approval, export, release or download standing in for client acceptance",
    stateFamily: "success",
    subject: "client_acceptance",
  },
  client_visibility: {
    audience: "client_safe",
    boundary: "clientVisibilityHidden",
    downstreamForbidden: "client acceptance or advice execution",
    stateFamily: "hidden",
    subject: "client_visibility",
  },
  compliance_release: {
    actionMeaning: "release",
    audience: "operational_internal",
    boundary: "complianceReleaseNotClientAcceptance",
    downstreamForbidden: "export, download, share and client acceptance",
    stateFamily: "restricted",
    subject: "compliance_release",
  },
  download: {
    actionMeaning: "download",
    audience: "operational_internal",
    boundary: "downloadNotClientAcceptance",
    downstreamForbidden: "share, client acceptance or advice finality",
    stateFamily: "export_pending",
    subject: "download",
  },
  evidence_review: {
    audience: "operational_internal",
    boundary: "evidenceReviewPending",
    downstreamForbidden: "evidence sufficiency, release or client visibility",
    stateFamily: "validation",
    subject: "evidence_review",
  },
  evidence_sufficiency: {
    audience: "operational_internal",
    boundary: "evidenceInsufficient",
    downstreamForbidden: "release or client visibility without explicit review gates",
    stateFamily: "blocked",
    subject: "evidence_sufficiency",
  },
  export_approval: {
    actionMeaning: "export_approval",
    audience: "operational_internal",
    boundary: "exportApprovalNotDownload",
    downstreamForbidden: "generation, download, share and client acceptance",
    stateFamily: "export_pending",
    subject: "export_approval",
  },
  export_generation: {
    actionMeaning: "export_generate",
    audience: "operational_internal",
    boundary: "noDownstreamCompletion",
    downstreamForbidden: "download, share and client acceptance",
    stateFamily: "export_pending",
    subject: "export_generation",
  },
  export_redaction: {
    actionMeaning: "export_redaction",
    audience: "operational_internal",
    boundary: "exportPreviewNotApproval",
    downstreamForbidden: "export approval, download, share and client acceptance",
    stateFamily: "export_redaction",
    subject: "export_redaction",
  },
  export_scope: {
    actionMeaning: "export_scope",
    audience: "operational_internal",
    boundary: "exportPreviewNotApproval",
    downstreamForbidden: "redaction, approval, generation, download and share",
    stateFamily: "restricted",
    subject: "export_scope",
  },
  generic_action: {
    audience: "audience_neutral",
    boundary: "noDownstreamCompletion",
    downstreamForbidden: "any downstream gate not explicitly named by the action",
    stateFamily: "restricted",
    subject: "generic_action",
  },
  permission_scope: {
    audience: "audience_neutral",
    boundary: "adminNonBypassDenied",
    downstreamForbidden: "release, evidence sufficiency, export, audit or client visibility bypass",
    stateFamily: "permission_denied",
    subject: "permission_scope",
  },
  share: {
    actionMeaning: "share",
    audience: "operational_internal",
    boundary: "downloadNotClientAcceptance",
    downstreamForbidden: "client acceptance or advice finality",
    stateFamily: "export_pending",
    subject: "share",
  },
  upload: {
    audience: "operational_internal",
    boundary: "uploadOnly",
    downstreamForbidden: "evidence sufficiency, release, export, client visibility and client acceptance",
    stateFamily: "validation",
    subject: "upload",
  },
} as const satisfies Record<UxFeedbackSubject, UxFeedbackSubjectContract>;

export function uxFeedbackSubjectContractFor(subject: UxFeedbackSubject): UxFeedbackSubjectContract {
  return uxFeedbackSubjectContracts[subject];
}

export function uxFeedbackCopyForBoundary(boundary: NoOverclaimBoundary): string {
  return noOverclaimCopy[boundary];
}

export function uxFeedbackAttributesFor(input: UxFeedbackProjectionInput): UxFeedbackRuntimeAttributes {
  const subjectContract = uxFeedbackSubjectContractFor(input.subject);
  const boundary = input.boundary ?? subjectContract.boundary;
  const actionMeaning = input.actionMeaning ?? subjectContract.actionMeaning;
  const stateFamily = input.stateFamily ?? subjectContract.stateFamily;
  const downstreamForbidden = input.downstreamForbidden ?? subjectContract.downstreamForbidden;

  return {
    "data-ux-feedback-action-meaning": actionMeaning,
    "data-ux-feedback-audience": input.audience ?? subjectContract.audience,
    "data-ux-feedback-boundary": boundary,
    "data-ux-feedback-downstream-forbidden": downstreamForbidden,
    "data-ux-feedback-intent": input.intent,
    "data-ux-feedback-placement": input.placement,
    "data-ux-feedback-state-family": stateFamily,
    "data-ux-feedback-subject": input.subject,
    "data-ux-no-overclaim": "true",
  };
}
