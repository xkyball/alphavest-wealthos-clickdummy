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

export type AuditResult = "SUCCESS" | "DENIED" | "BLOCKED" | "FAILED" | "PENDING" | "WARNING";

export type UUID = string;

