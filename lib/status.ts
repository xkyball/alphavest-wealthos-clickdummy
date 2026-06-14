export type WorkflowBadge =
  | "AUTO"
  | "AI-DRAFT"
  | "ANALYST"
  | "ADVISOR"
  | "COMPLIANCE"
  | "CLIENT"
  | "CALL"
  | "F2F"
  | "EVIDENCE"
  | "BLOCKED"
  | "REVIEW";

export type StatusTone =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "review";

export const badgeTone: Record<WorkflowBadge, StatusTone> = {
  AUTO: "info",
  "AI-DRAFT": "review",
  ANALYST: "review",
  ADVISOR: "warning",
  COMPLIANCE: "success",
  CLIENT: "info",
  CALL: "warning",
  F2F: "danger",
  EVIDENCE: "success",
  BLOCKED: "danger",
  REVIEW: "review"
};

export const statusLabels = {
  foundationReady: "Foundation ready",
  detailPending: "Detailed screen pending",
  interactionPending: "Interactions pending"
} as const;
