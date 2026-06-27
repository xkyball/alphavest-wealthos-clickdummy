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
  successMessage: string;
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
    successMessage: "Advisor approval was recorded for compliance review only; compliance release, export, client visibility and client acceptance remain separate controls.",
  },
  audit_persistence: {
    audience: "operational_internal",
    boundary: "auditDisplayNotProof",
    downstreamForbidden: "audit persistence proof without an accepted audited action response",
    stateFamily: "audit_unavailable",
    subject: "audit_persistence",
    successMessage: "Audit metadata was recorded for this action only; audit display and downstream gates remain separate controls.",
  },
  client_acceptance: {
    actionMeaning: "client_acceptance",
    audience: "client_safe",
    boundary: "noDownstreamCompletion",
    downstreamForbidden: "internal approval, export, release or download standing in for client acceptance",
    stateFamily: "success",
    subject: "client_acceptance",
    successMessage: "Client acceptance was recorded for this explicit acceptance step only; internal approval, release, export and download remain separate history.",
  },
  client_visibility: {
    audience: "client_safe",
    boundary: "clientVisibilityHidden",
    downstreamForbidden: "client acceptance or advice execution",
    stateFamily: "hidden",
    subject: "client_visibility",
    successMessage: "Client-safe visibility was updated for released or redacted content only; client acceptance and advice execution remain separate controls.",
  },
  compliance_release: {
    actionMeaning: "release",
    audience: "operational_internal",
    boundary: "complianceReleaseNotClientAcceptance",
    downstreamForbidden: "export, download, share and client acceptance",
    stateFamily: "restricted",
    subject: "compliance_release",
    successMessage: "Compliance release persisted for this reviewed package only; export, download, share and client acceptance remain separate controls.",
  },
  download: {
    actionMeaning: "download",
    audience: "operational_internal",
    boundary: "downloadNotClientAcceptance",
    downstreamForbidden: "share, client acceptance or advice finality",
    stateFamily: "export_pending",
    subject: "download",
    successMessage: "Controlled export download was recorded through the export workflow only; secure share, client acceptance and advice release remain separate controls.",
  },
  evidence_review: {
    audience: "operational_internal",
    boundary: "evidenceReviewPending",
    downstreamForbidden: "evidence sufficiency, release or client visibility",
    stateFamily: "validation",
    subject: "evidence_review",
    successMessage: "Evidence review feedback was recorded for this review step only; evidence sufficiency, release and client visibility remain separate controls.",
  },
  evidence_sufficiency: {
    audience: "operational_internal",
    boundary: "evidenceInsufficient",
    downstreamForbidden: "release or client visibility without explicit review gates",
    stateFamily: "blocked",
    subject: "evidence_sufficiency",
    successMessage: "Evidence sufficiency was recorded for the scoped evidence gate only; release, export and client visibility remain separate controls.",
  },
  export_approval: {
    actionMeaning: "export_approval",
    audience: "operational_internal",
    boundary: "exportApprovalNotDownload",
    downstreamForbidden: "generation, download, share and client acceptance",
    stateFamily: "export_pending",
    subject: "export_approval",
    successMessage: "Export approval was recorded through the export workflow only; generation, download, share, client acceptance and advice release remain separate controls.",
  },
  export_generation: {
    actionMeaning: "export_generate",
    audience: "operational_internal",
    boundary: "noDownstreamCompletion",
    downstreamForbidden: "download, share and client acceptance",
    stateFamily: "export_pending",
    subject: "export_generation",
    successMessage: "Export generation was recorded for the package only; download, share and client acceptance remain separate controls.",
  },
  export_redaction: {
    actionMeaning: "export_redaction",
    audience: "operational_internal",
    boundary: "exportPreviewNotApproval",
    downstreamForbidden: "export approval, download, share and client acceptance",
    stateFamily: "export_redaction",
    subject: "export_redaction",
    successMessage: "Export redaction review was recorded for the preview package only; export approval, download, share and client acceptance remain separate controls.",
  },
  export_scope: {
    actionMeaning: "export_scope",
    audience: "operational_internal",
    boundary: "exportPreviewNotApproval",
    downstreamForbidden: "redaction, approval, generation, download and share",
    stateFamily: "restricted",
    subject: "export_scope",
    successMessage: "Export scope was recorded for this package only; redaction, approval, generation, download and share remain separate controls.",
  },
  generic_action: {
    audience: "audience_neutral",
    boundary: "noDownstreamCompletion",
    downstreamForbidden: "any downstream gate not explicitly named by the action",
    stateFamily: "restricted",
    subject: "generic_action",
    successMessage: "Action recorded for this control only; evidence, release, export, share, visibility and permission gates remain separate unless explicitly completed.",
  },
  permission_scope: {
    audience: "audience_neutral",
    boundary: "adminNonBypassDenied",
    downstreamForbidden: "release, evidence sufficiency, export, audit or client visibility bypass",
    stateFamily: "permission_denied",
    subject: "permission_scope",
    successMessage: "Permission-scope feedback was recorded for this control only; release, evidence sufficiency, export, audit and client visibility remain separately gated.",
  },
  share: {
    actionMeaning: "share",
    audience: "operational_internal",
    boundary: "downloadNotClientAcceptance",
    downstreamForbidden: "client acceptance or advice finality",
    stateFamily: "export_pending",
    subject: "share",
    successMessage: "Secure share was recorded for this share step only; client acceptance and advice finality remain separate controls.",
  },
  upload: {
    audience: "operational_internal",
    boundary: "uploadOnly",
    downstreamForbidden: "evidence sufficiency, release, export, client visibility and client acceptance",
    stateFamily: "validation",
    subject: "upload",
    successMessage: "Upload completed as pending internal evidence only; evidence sufficiency, release, export and client visibility remain locked.",
  },
} as const satisfies Record<UxFeedbackSubject, UxFeedbackSubjectContract>;

export function uxFeedbackSubjectContractFor(subject: UxFeedbackSubject): UxFeedbackSubjectContract {
  return uxFeedbackSubjectContracts[subject];
}

export function uxFeedbackCopyForBoundary(boundary: NoOverclaimBoundary): string {
  return noOverclaimCopy[boundary];
}

export function uxFeedbackSuccessMessageForSubject(
  subject: UxFeedbackSubject,
  options: { auditEventId?: string; prefix?: string } = {},
): string {
  const message = uxFeedbackSubjectContractFor(subject).successMessage;
  const auditPrefix = options.auditEventId ? `Audit recorded: ${options.auditEventId}. ` : "";
  const customPrefix = options.prefix ? `${options.prefix} ` : "";

  return `${auditPrefix}${customPrefix}${message}`;
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
