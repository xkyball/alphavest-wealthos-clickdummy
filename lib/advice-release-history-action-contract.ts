export type AdviceReleaseHistoryWorkflowAction =
  | "j02.requestEvidence"
  | "j02.confirmRequestEvidence"
  | "j02.blockRelease"
  | "j02.releaseClient"
  | "j02.exportControlled"
  | "j03.requestMoreInformation"
  | "j03.deferDecision"
  | "j03.rejectDecision"
  | "j03.acceptOption"
  | "j03.viewEvidenceRecord"
  | "j03.downloadEvidence";

export type AdviceReleaseHistoryCommand =
  | "COMPLIANCE_REQUEST_EVIDENCE"
  | "COMPLIANCE_CONFIRM_EVIDENCE_REQUEST"
  | "COMPLIANCE_BLOCK_RELEASE"
  | "COMPLIANCE_RELEASE_CLIENT_SAFE"
  | "RELEASE_HISTORY_EXPORT_CONTROLLED"
  | "CLIENT_DECISION_REQUEST_MORE_INFORMATION"
  | "CLIENT_DECISION_DEFER"
  | "CLIENT_DECISION_REJECT"
  | "CLIENT_DECISION_ACCEPT"
  | "EVIDENCE_RECORD_VIEW"
  | "EVIDENCE_RECORD_DOWNLOAD";

export const adviceReleaseHistoryCanonicalApiRoute = "/api/advice-release-history/actions" as const;

export const adviceReleaseHistoryWorkflowActionIds = [
  "j02.requestEvidence",
  "j02.confirmRequestEvidence",
  "j02.blockRelease",
  "j02.releaseClient",
  "j02.exportControlled",
  "j03.requestMoreInformation",
  "j03.deferDecision",
  "j03.rejectDecision",
  "j03.acceptOption",
  "j03.viewEvidenceRecord",
  "j03.downloadEvidence",
] as const satisfies readonly AdviceReleaseHistoryWorkflowAction[];

export const adviceReleaseHistoryCommandByAction = {
  "j02.requestEvidence": "COMPLIANCE_REQUEST_EVIDENCE",
  "j02.confirmRequestEvidence": "COMPLIANCE_CONFIRM_EVIDENCE_REQUEST",
  "j02.blockRelease": "COMPLIANCE_BLOCK_RELEASE",
  "j02.releaseClient": "COMPLIANCE_RELEASE_CLIENT_SAFE",
  "j02.exportControlled": "RELEASE_HISTORY_EXPORT_CONTROLLED",
  "j03.requestMoreInformation": "CLIENT_DECISION_REQUEST_MORE_INFORMATION",
  "j03.deferDecision": "CLIENT_DECISION_DEFER",
  "j03.rejectDecision": "CLIENT_DECISION_REJECT",
  "j03.acceptOption": "CLIENT_DECISION_ACCEPT",
  "j03.viewEvidenceRecord": "EVIDENCE_RECORD_VIEW",
  "j03.downloadEvidence": "EVIDENCE_RECORD_DOWNLOAD",
} satisfies Record<AdviceReleaseHistoryWorkflowAction, AdviceReleaseHistoryCommand>;

const adviceReleaseHistoryWorkflowActions = new Set<string>(adviceReleaseHistoryWorkflowActionIds);

export function isAdviceReleaseHistoryWorkflowAction(
  value: unknown,
): value is AdviceReleaseHistoryWorkflowAction {
  return typeof value === "string" && adviceReleaseHistoryWorkflowActions.has(value);
}

export function adviceReleaseHistoryCommandForAction(actionId: AdviceReleaseHistoryWorkflowAction) {
  return adviceReleaseHistoryCommandByAction[actionId];
}
