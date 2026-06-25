export const noOverclaimCopy = {
  advisorApprovalNotRelease:
    "Advisor approval alone is not enough; explicit compliance release controls client visibility.",
  adminNonBypassDenied:
    "This admin role cannot bypass release, evidence sufficiency, export, audit or client-visibility gates.",
  auditDisplayNotProof:
    "Audit display is read-only context; persistence is proven only by the audited action response and required audit metadata.",
  auditUnavailableFailClosed:
    "Action cannot complete because required audit logging is unavailable.",
  clientVisibilityHidden:
    "No released client-safe content is available yet.",
  complianceReleaseNotClientAcceptance:
    "Compliance release can make approved content client-visible only when its own gates pass; export, download, share and client acceptance remain separate controls.",
  complianceReleasedClientSafeOnly:
    "Compliance released a client-safe summary; client acceptance and advice execution remain separate.",
  downloadNotClientAcceptance:
    "Package downloaded or shared. This does not confirm client acceptance.",
  evidenceInsufficient:
    "Evidence remains insufficient until review, scope, currentness, acceptance and client-safe visibility checks pass.",
  evidenceReviewPending:
    "Evidence is awaiting review; sufficiency and release remain separate gates.",
  evidenceSufficientAfterReview:
    "Evidence reviewed, linked and accepted for this decision.",
  exportPreviewNotApproval:
    "Preview is not approval. Generation, download, share and client acceptance remain separate controlled steps.",
  exportApprovalNotDownload:
    "Export approval records only the approval gate; download and share remain separate controlled steps.",
  aiDraftInternalOnly:
    "Internal AI/rules draft - not client visible.",
  noDownstreamCompletion:
    "Evidence, release, export, share, visibility and permission gates remain unresolved until their own checks pass.",
  uploadOnly:
    "Upload creates pending internal evidence and audit only; evidence sufficiency, release, export, client visibility and client acceptance remain separate controls.",
} as const;

export type NoOverclaimBoundary = keyof typeof noOverclaimCopy;

export const noOverclaimBoundaryOrder: NoOverclaimBoundary[] = [
  "uploadOnly",
  "evidenceReviewPending",
  "evidenceInsufficient",
  "evidenceSufficientAfterReview",
  "aiDraftInternalOnly",
  "advisorApprovalNotRelease",
  "complianceReleaseNotClientAcceptance",
  "complianceReleasedClientSafeOnly",
  "clientVisibilityHidden",
  "auditDisplayNotProof",
  "auditUnavailableFailClosed",
  "adminNonBypassDenied",
  "exportPreviewNotApproval",
  "exportApprovalNotDownload",
  "downloadNotClientAcceptance",
  "noDownstreamCompletion",
];

export const noOverclaimForbiddenSuccessPattern =
  /evidence sufficiency complete|client visibility unlocked|approved for client|download ready|share ready|client accepted|fully audited/i;
