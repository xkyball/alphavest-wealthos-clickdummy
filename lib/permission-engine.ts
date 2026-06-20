import { demoTenants, type DemoActor, type DemoRole, type DemoRoleKey } from "@/lib/demo-session";
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
const evidenceSufficiencyRoles = new Set<DemoRoleKey>(["compliance_officer"]);
const exportApprovalRoles = new Set<DemoRoleKey>(["compliance_officer"]);
const advisorApprovalRoles = new Set<DemoRoleKey>(["senior_wealth_advisor"]);
const internalAdvicePayloadRoles = new Set<DemoRoleKey>([
  "analyst",
  "senior_wealth_advisor",
  "compliance_officer",
]);
const governanceRoles = new Set<DemoRoleKey>(["admin", "security_officer"]);
const accessApprovalRoles = new Set<DemoRoleKey>(["admin", "security_officer", "compliance_officer"]);
const tenantAdminRoles = new Set<DemoRoleKey>(["admin", "client_success"]);
const adminNonBypassRoles = new Set<DemoRoleKey>(["admin", "security_officer"]);
const clientVisibilityReleaseObjects = new Set<ObjectType>(["DECISION", "DOCUMENT", "EVIDENCE_RECORD"]);
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

function actorTenantId(actor: DemoActor): UUID | undefined {
  if (!actor.tenantSlug) {
    return undefined;
  }

  return demoTenants.find((tenant) => tenant.slug === actor.tenantSlug)?.id;
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
  const mappedActorTenantId = actorTenantId(actor);
  const missingPayloadTenantContext = Boolean(subject.clientTenantId) && !context.clientTenantId;
  const actorTenantMismatch =
    Boolean(mappedActorTenantId) &&
    Boolean(context.clientTenantId) &&
    mappedActorTenantId !== context.clientTenantId;
  const highSensitivity =
    subject.sensitivity === "RESTRICTED" ||
    subject.sensitivity === "HIGHLY_RESTRICTED" ||
    context.sensitivity === "RESTRICTED" ||
    context.sensitivity === "HIGHLY_RESTRICTED";
  const evidenceSufficiencyAction = action === "APPROVE" && subject.objectType === "EVIDENCE_RECORD";

  if (crossTenant) {
    return deny(
      action,
      subject,
      "DEMO_DENY_CROSS_TENANT",
      `${role?.label ?? actor.displayName} cannot access a different client tenant in demo mode.`,
      true,
    );
  }

  if (missingPayloadTenantContext) {
    return deny(
      action,
      subject,
      "DEMO_DENY_TENANT_CONTEXT_REQUIRED",
      "Tenant context is required before route access can become payload or action access.",
      true,
    );
  }

  if (actorTenantMismatch) {
    return deny(
      action,
      subject,
      "DEMO_DENY_ACTOR_TENANT_CONTEXT_MISMATCH",
      "Mapped client actor tenant does not match the requested action context.",
      true,
    );
  }

  if (
    action === "VIEW" &&
    subject.objectType === "RECOMMENDATION" &&
    (subject.visibilityStatus === "INTERNAL_ONLY" ||
      subject.visibilityStatus === "ADVISOR_VISIBLE" ||
      subject.visibilityStatus === "COMPLIANCE_VISIBLE" ||
      context.clientVisibilityState === "INTERNAL_ONLY" ||
      context.clientVisibilityState === "ADVISOR_VISIBLE" ||
      context.clientVisibilityState === "COMPLIANCE_VISIBLE") &&
    Boolean(role?.internal) &&
    !internalAdvicePayloadRoles.has(roleKey)
  ) {
    return deny(
      action,
      subject,
      adminNonBypassRoles.has(roleKey)
        ? "DEMO_DENY_ADMIN_ADVICE_PAYLOAD_NON_BYPASS"
        : "DEMO_DENY_ADVICE_PAYLOAD_SCOPE_REQUIRED",
      adminNonBypassRoles.has(roleKey)
        ? "Admin and security roles cannot view internal advice payload by route or governance authority alone."
        : "Internal advice payload requires an assigned analyst, advisor or compliance role.",
      adminNonBypassRoles.has(roleKey),
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
    subject.objectType === "RECOMMENDATION" &&
    !advisorApprovalRoles.has(roleKey)
  ) {
    return deny(
      action,
      subject,
      "DEMO_DENY_ADVISOR_APPROVAL_REQUIRED",
      "Senior Wealth Advisor approval is required before a recommendation can move toward compliance review.",
      true,
    );
  }

  if (
    action === "APPROVE" &&
    subject.objectType === "EVIDENCE_RECORD" &&
    adminNonBypassRoles.has(roleKey)
  ) {
    return deny(
      action,
      subject,
      "DEMO_DENY_ADMIN_EVIDENCE_NON_BYPASS",
      "Admin and security roles cannot force evidence sufficiency outside compliance review.",
      true,
    );
  }

  if (
    action === "APPROVE" &&
    subject.objectType === "EVIDENCE_RECORD" &&
    !evidenceSufficiencyRoles.has(roleKey)
  ) {
    return deny(
      action,
      subject,
      "DEMO_DENY_EVIDENCE_APPROVAL_REQUIRED",
      "Compliance Officer approval is required before evidence can satisfy a release or export gate.",
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
    action === "EXPORT" &&
    subject.objectType === "EXPORT_REQUEST" &&
    adminNonBypassRoles.has(roleKey)
  ) {
    return deny(
      action,
      subject,
      "DEMO_DENY_ADMIN_NON_BYPASS",
      "Admin and security roles cannot bypass export approval, redaction and client-visibility gates.",
      true,
    );
  }

  if (
    action === "RELEASE" &&
    clientVisibilityReleaseObjects.has(subject.objectType) &&
    adminNonBypassRoles.has(roleKey)
  ) {
    return deny(
      action,
      subject,
      "DEMO_DENY_ADMIN_VISIBILITY_NON_BYPASS",
      "Admin and security roles cannot directly force client visibility outside compliance release gates.",
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
    requiresComplianceReview: complianceActions.has(action) || evidenceSufficiencyAction,
    demoMode: true,
  };
}

export const permissionEngine = {
  can,
};
