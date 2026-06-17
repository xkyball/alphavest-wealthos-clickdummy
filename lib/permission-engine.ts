import type { DemoActor, DemoRole, DemoRoleKey } from "@/lib/demo-session";
import type {
  ObjectType,
  PermissionAction,
  Sensitivity,
  UUID,
  VisibilityStatus,
  WorkflowStatus,
} from "@/lib/domain-types";

export type PermissionSubject = {
  objectType: ObjectType;
  objectId?: UUID;
  clientTenantId?: UUID;
  sensitivity?: Sensitivity;
  visibilityStatus?: VisibilityStatus;
  workflowState?: WorkflowStatus | string;
};

export type PermissionContext = {
  platformTenantId: UUID;
  clientTenantId?: UUID;
  entityScopeId?: UUID;
  engagementId?: UUID;
  sensitivity?: Sensitivity;
  workflowState?: WorkflowStatus | string;
  clientVisibilityState?: VisibilityStatus;
};

export type PermissionDecision = {
  allowed: boolean;
  reasonCode: string;
  reason: string;
  requiresAudit: boolean;
  requiresSecondConfirmation: boolean;
  requiresComplianceReview: boolean;
  demoMode: true;
};

const auditActions = new Set<PermissionAction>([
  "CREATE",
  "EDIT",
  "DELETE",
  "UPLOAD",
  "REVIEW",
  "APPROVE",
  "RELEASE",
  "BLOCK",
  "EXPORT",
  "INVITE",
  "ASSIGN",
  "REVOKE",
  "MANAGE",
]);

const secondConfirmationActions = new Set<PermissionAction>(["ASSIGN", "REVOKE", "RELEASE", "MANAGE"]);
const complianceActions = new Set<PermissionAction>(["RELEASE", "BLOCK", "EXPORT"]);

const complianceReleaseRoles = new Set<DemoRoleKey>(["compliance_officer"]);
const exportApprovalRoles = new Set<DemoRoleKey>(["compliance_officer"]);
const governanceRoles = new Set<DemoRoleKey>(["admin", "security_officer"]);
const accessApprovalRoles = new Set<DemoRoleKey>(["admin", "security_officer", "compliance_officer"]);
const tenantAdminRoles = new Set<DemoRoleKey>(["admin", "client_success"]);
const forbiddenExportRoles = new Set<DemoRoleKey>([
  "analyst",
  "external_advisor",
  "next_gen",
  "trustee",
]);
const externallyScopedRoles = new Set<DemoRoleKey>(["external_advisor", "next_gen", "trustee"]);

function deny(
  action: PermissionAction,
  subject: PermissionSubject,
  reasonCode: string,
  reason: string,
  requiresSecondConfirmation = false
): PermissionDecision {
  const highSensitivity =
    subject.sensitivity === "RESTRICTED" || subject.sensitivity === "HIGHLY_RESTRICTED";

  return {
    allowed: false,
    reasonCode,
    reason,
    requiresAudit: true,
    requiresSecondConfirmation: requiresSecondConfirmation || secondConfirmationActions.has(action),
    requiresComplianceReview: complianceActions.has(action) || highSensitivity,
    demoMode: true,
  };
}

function can(
  actor: DemoActor,
  action: PermissionAction,
  subject: PermissionSubject,
  context: PermissionContext,
  role?: DemoRole
): PermissionDecision {
  const roleKey = role?.key ?? actor.roleKey;
  const crossTenant =
    Boolean(subject.clientTenantId) &&
    Boolean(context.clientTenantId) &&
    subject.clientTenantId !== context.clientTenantId;
  const highSensitivity =
    subject.sensitivity === "RESTRICTED" ||
    subject.sensitivity === "HIGHLY_RESTRICTED" ||
    context.sensitivity === "RESTRICTED" ||
    context.sensitivity === "HIGHLY_RESTRICTED";

  if (crossTenant) {
    return deny(
      action,
      subject,
      "DEMO_DENY_CROSS_TENANT",
      `${role?.label ?? actor.displayName} cannot access a different client tenant in demo mode.`,
      true,
    );
  }

  if (
    (action === "RELEASE" || action === "BLOCK") &&
    subject.objectType === "RECOMMENDATION" &&
    !complianceReleaseRoles.has(roleKey)
  ) {
    return deny(
      action,
      subject,
      "DEMO_DENY_COMPLIANCE_RELEASE_REQUIRED",
      "Compliance Officer is required before advice-like content can be released or blocked for the client.",
      true,
    );
  }

  if (
    action === "APPROVE" &&
    subject.objectType === "EXPORT_REQUEST" &&
    !exportApprovalRoles.has(roleKey)
  ) {
    return deny(
      action,
      subject,
      "DEMO_DENY_EXPORT_APPROVAL_REQUIRED",
      "Compliance Officer approval is required before a restricted export package can be generated.",
      true,
    );
  }

  if (
    action === "MANAGE" &&
    (subject.objectType === "ROLE" || subject.objectType === "POLICY") &&
    !governanceRoles.has(roleKey)
  ) {
    return deny(
      action,
      subject,
      "DEMO_DENY_GOVERNANCE_ROLE_REQUIRED",
      "Admin or Security Officer is required for sensitive role and policy management.",
      true,
    );
  }

  if (
    (action === "ASSIGN" || action === "REVOKE") &&
    (subject.objectType === "PERMISSION" || subject.objectType === "ROLE") &&
    !accessApprovalRoles.has(roleKey)
  ) {
    return deny(
      action,
      subject,
      "DEMO_DENY_ACCESS_APPROVER_REQUIRED",
      "Admin, Security Officer or Compliance Officer approval is required for permission assignment.",
      true,
    );
  }

  if (
    action === "INVITE" &&
    (subject.objectType === "USER" || subject.objectType === "TENANT") &&
    !tenantAdminRoles.has(roleKey) &&
    roleKey !== "security_officer"
  ) {
    return deny(
      action,
      subject,
      "DEMO_DENY_TENANT_ADMIN_REQUIRED",
      "Admin, Security Officer or Client Success is required for tenant and user invitations.",
    );
  }

  if (
    action === "EXPORT" &&
    subject.objectType === "EXPORT_REQUEST" &&
    forbiddenExportRoles.has(roleKey)
  ) {
    return deny(
      action,
      subject,
      "DEMO_DENY_EXPORT_ROLE_FORBIDDEN",
      "This role cannot create, download or share restricted export packages.",
      true,
    );
  }

  if (
    (action === "VIEW" || action === "EXPORT") &&
    (subject.objectType === "DOCUMENT" ||
      subject.objectType === "EVIDENCE_RECORD" ||
      subject.objectType === "AUDIT_EVENT") &&
    (subject.visibilityStatus === "INTERNAL_ONLY" || context.clientVisibilityState === "INTERNAL_ONLY") &&
    externallyScopedRoles.has(roleKey)
  ) {
    return deny(
      action,
      subject,
      "DEMO_DENY_INTERNAL_OBJECT_ACCESS",
      "This external or limited role cannot access internal-only objects.",
    );
  }

  return {
    allowed: true,
    reasonCode: "DEMO_ROLE_AWARE_ALLOW",
    reason: role
      ? `${role.label} is allowed by the Phase 16 demo role policy.`
      : `${actor.displayName} is allowed by the Phase 16 demo role policy.`,
    requiresAudit: auditActions.has(action) || highSensitivity,
    requiresSecondConfirmation: secondConfirmationActions.has(action),
    requiresComplianceReview: complianceActions.has(action),
    demoMode: true,
  };
}

export const permissionEngine = {
  can,
};
