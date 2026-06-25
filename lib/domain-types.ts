export type TenantStatus = "DRAFT" | "ONBOARDING" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export type RoleScope = "PLATFORM" | "TENANT" | "ENTITY" | "ENGAGEMENT" | "DOCUMENT" | "DECISION";

export type ObjectType =
  | "PLATFORM"
  | "TENANT"
  | "USER"
  | "ROLE"
  | "PERMISSION"
  | "FAMILY_MEMBER"
  | "RELATIONSHIP"
  | "ENGAGEMENT"
  | "JOURNEY"
  | "ENTITY"
  | "ASSET"
  | "DOCUMENT"
  | "TRIGGER"
  | "ACTION_ITEM"
  | "RECOMMENDATION"
  | "DECISION"
  | "EVIDENCE_RECORD"
  | "AUDIT_EVENT"
  | "EXPORT_REQUEST"
  | "MESSAGE"
  | "REVIEW_SCHEDULE"
  | "POLICY"
  | "QUEUE_ITEM"
  | "DATA_QUALITY_ISSUE";

export type PermissionAction =
  | "VIEW"
  | "CREATE"
  | "EDIT"
  | "DELETE"
  | "UPLOAD"
  | "REVIEW"
  | "APPROVE"
  | "RELEASE"
  | "BLOCK"
  | "EXPORT"
  | "INVITE"
  | "ASSIGN"
  | "REVOKE"
  | "COMMENT"
  | "SCHEDULE"
  | "ESCALATE"
  | "MANAGE";

export type Sensitivity =
  | "PUBLIC"
  | "CLIENT_VISIBLE"
  | "CONFIDENTIAL"
  | "RESTRICTED"
  | "HIGHLY_RESTRICTED"
  | "INTERNAL_ONLY";

export type VisibilityStatus =
  | "INTERNAL_ONLY"
  | "ADVISOR_VISIBLE"
  | "COMPLIANCE_VISIBLE"
  | "CLIENT_VISIBLE"
  | "RESTRICTED"
  | "REDACTED";

export type WorkflowStatus =
  | "DRAFT"
  | "NEW"
  | "IN_REVIEW"
  | "AWAITING_INFO"
  | "ANALYST_REVIEW"
  | "ADVISOR_REVIEW"
  | "COMPLIANCE_PENDING"
  | "READY_FOR_CLIENT"
  | "CLIENT_VISIBLE"
  | "COMPLETED"
  | "DEFERRED"
  | "BLOCKED"
  | "REJECTED"
  | "ARCHIVED";

export type RecommendationStatus =
  | "DRAFT"
  | "AI_DRAFT"
  | "ANALYST_REVIEWED"
  | "ADVISOR_PENDING"
  | "ADVISOR_APPROVED"
  | "REVISION_REQUESTED"
  | "MORE_DATA_REQUESTED"
  | "COMPLIANCE_PENDING"
  | "RELEASED_TO_CLIENT"
  | "BLOCKED"
  | "CLIENT_ACCEPTED"
  | "CLIENT_DEFERRED"
  | "CLIENT_REJECTED"
  | "ARCHIVED";

export type ReviewStatus =
  | "NOT_STARTED"
  | "PENDING"
  | "IN_REVIEW"
  | "APPROVED"
  | "REVISED"
  | "REJECTED"
  | "REQUEST_MORE_DATA"
  | "ESCALATED_TO_CALL"
  | "COMPLETED";

export type ComplianceStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "IN_REVIEW"
  | "RELEASED"
  | "BLOCKED"
  | "NEEDS_EVIDENCE"
  | "EXCEPTION"
  | "EXPIRED";

export type EvidenceStatus =
  | "PLACEHOLDER"
  | "CREATED"
  | "LINKED"
  | "VALIDATED"
  | "RELEASED"
  | "RESTRICTED"
  | "ARCHIVED"
  | "SUPERSEDED";

export type ExportStatus =
  | "DRAFT"
  | "SCOPE_SELECTED"
  | "REDACTION_PENDING"
  | "APPROVAL_REQUIRED"
  | "APPROVED"
  | "GENERATED"
  | "DOWNLOADED"
  | "EXPIRED"
  | "REVOKED"
  | "FAILED";

export type SchemaUsageClassification =
  | "CANONICAL"
  | "PARTIAL"
  | "STRING_TAXONOMY"
  | "JSON_POLICY"
  | "SERVICE_DERIVED"
  | "MISSING"
  | "CONFLICTING";

export type ExportUiLifecycleStage =
  | "scope"
  | "redaction"
  | "preview"
  | "approval"
  | "generated"
  | "downloaded"
  | "terminal";

export type ExportStatusUiTruth = {
  allowedNextActions: Array<"scope" | "redaction" | "preview" | "approve" | "generate" | "download" | "recover">;
  canApprove: boolean;
  canDownload: boolean;
  canGenerate: boolean;
  label: string;
  lifecycleStage: ExportUiLifecycleStage;
  noOverclaimDetail: string;
  schemaUsage: SchemaUsageClassification;
};

export const canonicalExportStatuses: readonly ExportStatus[] = [
  "DRAFT",
  "SCOPE_SELECTED",
  "REDACTION_PENDING",
  "APPROVAL_REQUIRED",
  "APPROVED",
  "GENERATED",
  "DOWNLOADED",
  "EXPIRED",
  "REVOKED",
  "FAILED",
] as const;

export const exportStatusUiTruth: Record<ExportStatus, ExportStatusUiTruth> = {
  DRAFT: {
    allowedNextActions: ["scope"],
    canApprove: false,
    canDownload: false,
    canGenerate: false,
    label: "Draft",
    lifecycleStage: "scope",
    noOverclaimDetail: "Export scope has not been selected; preview, approval, generation and download remain unavailable.",
    schemaUsage: "CANONICAL",
  },
  SCOPE_SELECTED: {
    allowedNextActions: ["redaction"],
    canApprove: false,
    canDownload: false,
    canGenerate: false,
    label: "Scope selected",
    lifecycleStage: "redaction",
    noOverclaimDetail: "Scope is selected, but redaction and preview review still have to pass before approval.",
    schemaUsage: "CANONICAL",
  },
  REDACTION_PENDING: {
    allowedNextActions: ["redaction"],
    canApprove: false,
    canDownload: false,
    canGenerate: false,
    label: "Redaction pending",
    lifecycleStage: "redaction",
    noOverclaimDetail: "Redaction is still pending; preview, approval, generation and download remain blocked.",
    schemaUsage: "CANONICAL",
  },
  APPROVAL_REQUIRED: {
    allowedNextActions: ["approve"],
    canApprove: true,
    canDownload: false,
    canGenerate: false,
    label: "Approval required",
    lifecycleStage: "approval",
    noOverclaimDetail: "Preview can be inspected, but approval has not been recorded and download/share remain blocked.",
    schemaUsage: "CANONICAL",
  },
  APPROVED: {
    allowedNextActions: ["generate"],
    canApprove: false,
    canDownload: false,
    canGenerate: true,
    label: "Approved",
    lifecycleStage: "generated",
    noOverclaimDetail: "Approval is recorded; package generation and download are separate controlled events.",
    schemaUsage: "CANONICAL",
  },
  GENERATED: {
    allowedNextActions: ["download"],
    canApprove: false,
    canDownload: true,
    canGenerate: false,
    label: "Generated",
    lifecycleStage: "generated",
    noOverclaimDetail: "Package metadata is generated; download, share and client acceptance remain separate.",
    schemaUsage: "CANONICAL",
  },
  DOWNLOADED: {
    allowedNextActions: [],
    canApprove: false,
    canDownload: false,
    canGenerate: false,
    label: "Downloaded",
    lifecycleStage: "downloaded",
    noOverclaimDetail: "Download is recorded; share and client acceptance are not implied.",
    schemaUsage: "CANONICAL",
  },
  EXPIRED: {
    allowedNextActions: ["recover"],
    canApprove: false,
    canDownload: false,
    canGenerate: false,
    label: "Expired",
    lifecycleStage: "terminal",
    noOverclaimDetail: "Export is expired; a new controlled scope, redaction and approval path is required.",
    schemaUsage: "CANONICAL",
  },
  REVOKED: {
    allowedNextActions: ["recover"],
    canApprove: false,
    canDownload: false,
    canGenerate: false,
    label: "Revoked",
    lifecycleStage: "terminal",
    noOverclaimDetail: "Export access is revoked; no download/share action is available from this state.",
    schemaUsage: "CANONICAL",
  },
  FAILED: {
    allowedNextActions: ["recover"],
    canApprove: false,
    canDownload: false,
    canGenerate: false,
    label: "Failed",
    lifecycleStage: "terminal",
    noOverclaimDetail: "Export workflow failed closed; no approval, generation, download or share is completed.",
    schemaUsage: "CANONICAL",
  },
};

export function isExportStatus(value: unknown): value is ExportStatus {
  return typeof value === "string" && canonicalExportStatuses.includes(value as ExportStatus);
}

export function exportStatusUiTruthFor(value: unknown): ExportStatusUiTruth & { schemaStatus: ExportStatus | "UNKNOWN" } {
  if (isExportStatus(value)) {
    return {
      ...exportStatusUiTruth[value],
      schemaStatus: value,
    };
  }

  return {
    allowedNextActions: ["recover"],
    canApprove: false,
    canDownload: false,
    canGenerate: false,
    label: "Unknown export state",
    lifecycleStage: "terminal",
    noOverclaimDetail: "Export status is not recognized by the canonical schema taxonomy; workflow controls stay fail-closed.",
    schemaStatus: "UNKNOWN",
    schemaUsage: "CONFLICTING",
  };
}

export type AuditResult = "SUCCESS" | "DENIED" | "BLOCKED" | "FAILED" | "PENDING" | "WARNING";

export type UUID = string;
