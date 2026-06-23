export const noOverclaimCopy = {
  advisorApprovalNotRelease:
    "Advisor approval alone is not enough; explicit compliance release controls client visibility.",
  auditDisplayNotProof:
    "Audit display is read-only context; persistence is proven only by the audited action response and required audit metadata.",
  complianceReleaseNotClientAcceptance:
    "Compliance release can make approved content client-visible only when its own gates pass; export, download, share and client acceptance remain separate controls.",
  exportPreviewNotApproval:
    "Preview is not approval. Generation, download, share and client acceptance remain separate controlled steps.",
  noDownstreamCompletion:
    "Evidence, release, export, share, visibility and permission gates remain unresolved until their own checks pass.",
  uploadOnly:
    "Upload creates pending internal evidence and audit only; evidence sufficiency, release, export, client visibility and client acceptance remain separate controls.",
} as const;

export type NoOverclaimBoundary = keyof typeof noOverclaimCopy;

export const noOverclaimBoundaryOrder: NoOverclaimBoundary[] = [
  "uploadOnly",
  "advisorApprovalNotRelease",
  "complianceReleaseNotClientAcceptance",
  "auditDisplayNotProof",
  "exportPreviewNotApproval",
  "noDownstreamCompletion",
];
