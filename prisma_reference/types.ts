// AlphaVest WealthOS — TypeScript types draft V3
// Use as a starting point for application contracts and validation schemas.

export type TenantStatus = "draft" | "onboarding" | "active" | "suspended" | "archived";
export type UserStatus = "invited" | "active" | "suspended" | "locked" | "archived";
export type RoleScope = "platform" | "tenant" | "entity" | "engagement" | "document" | "decision";
export type ObjectType = "platform" | "tenant" | "user" | "role" | "permission" | "family_member" | "relationship" | "entity" | "asset" | "document" | "trigger" | "action_item" | "recommendation" | "decision" | "evidence_record" | "audit_event" | "export_request" | "message" | "review_schedule";
export type PermissionAction = "view" | "create" | "edit" | "delete" | "upload" | "review" | "approve" | "release" | "block" | "export" | "invite" | "assign" | "revoke" | "comment" | "schedule" | "escalate" | "manage";
export type Sensitivity = "public" | "client_visible" | "confidential" | "restricted" | "highly_restricted" | "internal_only";
export type VisibilityStatus = "internal_only" | "advisor_visible" | "compliance_visible" | "client_visible" | "restricted" | "redacted";
export type WorkflowStatus = "draft" | "new" | "in_review" | "awaiting_info" | "analyst_review" | "advisor_review" | "compliance_pending" | "ready_for_client" | "client_visible" | "completed" | "deferred" | "blocked" | "rejected" | "archived";
export type DocumentStatus = "empty" | "uploading" | "uploaded" | "ai_extracted" | "client_confirmed" | "analyst_review_pending" | "verified" | "needs_clarification" | "blocked" | "linked_to_evidence" | "archived";
export type ReviewStatus = "not_started" | "pending" | "in_review" | "approved" | "revised" | "rejected" | "request_more_data" | "escalated_to_call" | "completed";
export type ComplianceStatus = "not_required" | "pending" | "in_review" | "released" | "blocked" | "needs_evidence" | "exception" | "expired";
export type AdviceClassification = "information" | "workflow" | "guidance" | "advice_relevant" | "advice" | "out_of_scope";
export type RecommendationStatus = "draft" | "ai_draft" | "analyst_reviewed" | "advisor_pending" | "advisor_approved" | "revision_requested" | "more_data_requested" | "compliance_pending" | "released_to_client" | "blocked" | "client_accepted" | "client_deferred" | "client_rejected" | "archived";
export type DecisionStatus = "draft" | "released_to_client" | "awaiting_family_approval" | "accepted" | "deferred" | "rejected" | "evidence_created" | "review_scheduled" | "archived";
export type EvidenceStatus = "placeholder" | "created" | "linked" | "validated" | "released" | "restricted" | "archived" | "superseded";
export type ExportStatus = "draft" | "scope_selected" | "redaction_pending" | "approval_required" | "approved" | "generated" | "downloaded" | "expired" | "revoked" | "failed";
export type CommunicationChannel = "secure_message" | "email" | "phone" | "video" | "in_person" | "system_notification";
export type EscalationType = "none" | "request_data" | "advisor_call" | "f2f_workshop" | "external_specialist" | "compliance_escalation" | "security_privacy_review";
export type AuditResult = "success" | "denied" | "blocked" | "failed" | "pending" | "warning";
export type EntityType = "trust" | "company" | "foundation" | "partnership" | "individual" | "family_office" | "other";
export type AssetType = "portfolio" | "bank_account" | "real_estate" | "insurance_policy" | "business_interest" | "liquidity" | "tax_residency" | "other";
export type ExportType = "client_decision_pack" | "evidence_package" | "compliance_audit_pack" | "external_advisor_data_room" | "tenant_data_inventory" | "user_access_report" | "activity_log_export" | "pilot_metrics_export";

export type UUID = string;
export type ISODate = string;
export type ISODateTime = string;

export interface PermissionContext {
  platformTenantId: UUID;
  clientTenantId?: UUID;
  entityScopeId?: UUID;
  engagementId?: UUID;
  actorUserId: UUID;
  actorRoles: string[];
  sensitivity?: Sensitivity;
  workflowState?: string;
  clientVisibilityState?: VisibilityStatus;
}

export interface PermissionDecision {
  allowed: boolean;
  reasonCode?: string;
  requiresSecondConfirmation?: boolean;
  requiresComplianceReview?: boolean;
  auditRequired: boolean;
}

export interface WorkflowGateResult {
  gateName: string;
  passed: boolean;
  missing: string[];
  blockedReason?: string;
}

export interface ClientVisibilityGate {
  advisorApprovalComplete: boolean;
  complianceReleased: boolean;
  evidenceRecordComplete: boolean;
  permissionValid: boolean;
  canBecomeClientVisible: boolean;
}
