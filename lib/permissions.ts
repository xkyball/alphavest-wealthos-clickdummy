import { roleDefinitions, type Role } from "./roles";

export type ObjectType =
  | "family"
  | "entity"
  | "asset"
  | "document"
  | "decision"
  | "recommendation"
  | "communication"
  | "evidence"
  | "audit"
  | "permission"
  | "call";

export type ObjectScope =
  | "global"
  | "family"
  | "assigned"
  | "own"
  | "selected_accounts"
  | "internal_queue";

export type PermissionAction =
  | "view_client_dashboard"
  | "view_entities"
  | "view_documents"
  | "upload_documents"
  | "edit_profile"
  | "create_decision"
  | "review_recommendation"
  | "approve_advice"
  | "release_to_client"
  | "manage_permissions"
  | "view_restricted_evidence"
  | "export_audit_logs"
  | "grant_external_access"
  | "send_client_message";

export type Sensitivity = "standard" | "sensitive" | "restricted" | "high_risk";

export type PermissionDecision = {
  allowed: boolean;
  allowedByRole: boolean;
  relationshipAllowed: boolean;
  secondConfirmationRequired: boolean;
  complianceReviewRequired: boolean;
  clientVisible: boolean;
  internalOnly: boolean;
  blockedReason: "allowed" | "role_denied" | "relationship_denied" | "second_confirmation_required" | "compliance_review_required" | "internal_only" | "client_visibility_denied";
  notes: string[];
};

export type PermissionContext = {
  role: Role;
  objectType: ObjectType;
  objectScope: ObjectScope;
  action: PermissionAction;
  sensitivity?: Sensitivity;
  clientVisible?: boolean;
  internalOnly?: boolean;
  secondConfirmation?: boolean;
  complianceReview?: boolean;
  relationshipAllowed?: boolean;
};

export const sensitivePermissionActions: PermissionAction[] = [
  "approve_advice",
  "release_to_client",
  "manage_permissions",
  "view_restricted_evidence",
  "export_audit_logs",
  "grant_external_access",
  "send_client_message"
];

export const rolePermissions: Record<Role, PermissionAction[]> = {
  Principal: [
    "view_client_dashboard",
    "view_entities",
    "view_documents",
    "upload_documents",
    "edit_profile",
    "create_decision",
    "view_restricted_evidence",
    "manage_permissions",
    "grant_external_access"
  ],
  Spouse: ["view_client_dashboard", "view_entities", "view_documents", "create_decision"],
  "Next Gen": ["view_client_dashboard", "view_entities", "view_documents"],
  Trustee: [
    "view_client_dashboard",
    "view_entities",
    "view_documents",
    "create_decision",
    "review_recommendation",
    "view_restricted_evidence"
  ],
  "Family CFO": [
    "view_client_dashboard",
    "view_entities",
    "view_documents",
    "upload_documents",
    "create_decision",
    "review_recommendation",
    "view_restricted_evidence"
  ],
  "External Advisor": ["view_client_dashboard", "view_entities", "view_documents", "upload_documents"],
  "AlphaVest Analyst": [
    "view_client_dashboard",
    "view_entities",
    "view_documents",
    "upload_documents",
    "review_recommendation",
    "view_restricted_evidence"
  ],
  "Senior Advisor": [
    "view_client_dashboard",
    "view_entities",
    "view_documents",
    "review_recommendation",
    "approve_advice",
    "view_restricted_evidence",
    "send_client_message"
  ],
  "Compliance Officer": [
    "view_client_dashboard",
    "view_entities",
    "view_documents",
    "review_recommendation",
    "release_to_client",
    "view_restricted_evidence",
    "export_audit_logs",
    "send_client_message"
  ],
  "Client Success": ["view_client_dashboard", "view_entities", "view_documents", "send_client_message"],
  "Admin / Operations": ["view_client_dashboard", "view_entities", "view_documents", "manage_permissions"],
  "Security / Privacy Officer": [
    "view_client_dashboard",
    "view_entities",
    "view_documents",
    "view_restricted_evidence",
    "export_audit_logs"
  ]
};

export function requiresSecondConfirmation(action: PermissionAction, sensitivity: Sensitivity = "standard") {
  return sensitivePermissionActions.includes(action) || sensitivity === "sensitive" || sensitivity === "restricted" || sensitivity === "high_risk";
}

export function requiresComplianceReview(action: PermissionAction, sensitivity: Sensitivity = "standard") {
  return action === "release_to_client" || action === "approve_advice" || sensitivity === "high_risk";
}

export function canRolePerform(role: Role, action: PermissionAction) {
  return rolePermissions[role].includes(action);
}

export function evaluateAccessControl(context: PermissionContext): PermissionDecision {
  const roleDefinition = roleDefinitions.find((definition) => definition.role === context.role);
  const sensitivity = context.sensitivity ?? "standard";
  const allowedByRole = canRolePerform(context.role, context.action);
  const relationshipAllowed = context.relationshipAllowed ?? true;
  const secondConfirmationRequired =
    requiresSecondConfirmation(context.action, sensitivity) && !context.secondConfirmation;
  const complianceReviewRequired =
    requiresComplianceReview(context.action, sensitivity) && !context.complianceReview;
  const internalOnly = context.internalOnly ?? roleDefinition?.internalOnly ?? false;
  const clientVisible = context.clientVisible ?? false;
  const clientVisibilityDenied = clientVisible && internalOnly;

  const blockedReason: PermissionDecision["blockedReason"] = !allowedByRole
    ? "role_denied"
    : !relationshipAllowed
      ? "relationship_denied"
      : secondConfirmationRequired
        ? "second_confirmation_required"
        : complianceReviewRequired
          ? "compliance_review_required"
          : clientVisibilityDenied
            ? "client_visibility_denied"
            : "allowed";

  const notes = [
    sensitivity !== "standard" ? "Sensitive permission changes are audited." : "",
    secondConfirmationRequired ? "Second confirmation is required before applying the change." : "",
    complianceReviewRequired ? "Compliance review is required before client visibility." : "",
    clientVisibilityDenied ? "Internal-only content cannot become client-visible by styling." : ""
  ].filter(Boolean);

  return {
    allowed: blockedReason === "allowed",
    allowedByRole,
    relationshipAllowed,
    secondConfirmationRequired,
    complianceReviewRequired,
    clientVisible,
    internalOnly,
    blockedReason,
    notes
  };
}

export function evaluatePermission(context: {
  role: Role;
  action: PermissionAction;
  objectSensitive?: boolean;
  secondConfirmation?: boolean;
  relationshipAllowed?: boolean;
}) {
  const decision = evaluateAccessControl({
    role: context.role,
    action: context.action,
    objectType: context.action === "view_restricted_evidence" ? "evidence" : "permission",
    objectScope: "assigned",
    sensitivity: context.objectSensitive ? "sensitive" : "standard",
    secondConfirmation: context.secondConfirmation,
    relationshipAllowed: context.relationshipAllowed,
    complianceReview: context.action === "approve_advice" || context.action === "release_to_client" ? false : true
  });

  return {
    allowed: decision.allowed,
    allowedByRole: decision.allowedByRole,
    relationshipAllowed: decision.relationshipAllowed,
    needsSecondConfirmation: decision.secondConfirmationRequired,
    reason: decision.blockedReason
  } as const;
}
