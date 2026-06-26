export type TenantGovernanceWorkflowAction =
  | "j06.newTenant"
  | "j06.continueTenant"
  | "j06.assignTeam"
  | "j06.openInvitation"
  | "j06.sendInvitation"
  | "j07.inviteUser"
  | "j07.sendInvitation"
  | "j07.saveRoleChanges"
  | "j07.approveAccess"
  | "j07.exportAudit";

export type TenantGovernanceCommand =
  | "TENANT_CREATE_DRAFT"
  | "TENANT_SAVE_DETAILS"
  | "TENANT_ASSIGN_TEAM"
  | "TENANT_OPEN_INVITATION"
  | "TENANT_SEND_INVITATION"
  | "GOVERNANCE_OPEN_INVITE"
  | "GOVERNANCE_SEND_INVITATION"
  | "GOVERNANCE_SAVE_ROLE_CHANGES"
  | "GOVERNANCE_APPROVE_ACCESS"
  | "GOVERNANCE_EXPORT_AUDIT";

export const tenantGovernanceCanonicalApiRoute = "/api/tenant-governance/actions" as const;

export const tenantGovernanceWorkflowActionIds = [
  "j06.newTenant",
  "j06.continueTenant",
  "j06.assignTeam",
  "j06.openInvitation",
  "j06.sendInvitation",
  "j07.inviteUser",
  "j07.sendInvitation",
  "j07.saveRoleChanges",
  "j07.approveAccess",
  "j07.exportAudit",
] as const satisfies readonly TenantGovernanceWorkflowAction[];

export const tenantGovernanceCommandByAction = {
  "j06.newTenant": "TENANT_CREATE_DRAFT",
  "j06.continueTenant": "TENANT_SAVE_DETAILS",
  "j06.assignTeam": "TENANT_ASSIGN_TEAM",
  "j06.openInvitation": "TENANT_OPEN_INVITATION",
  "j06.sendInvitation": "TENANT_SEND_INVITATION",
  "j07.inviteUser": "GOVERNANCE_OPEN_INVITE",
  "j07.sendInvitation": "GOVERNANCE_SEND_INVITATION",
  "j07.saveRoleChanges": "GOVERNANCE_SAVE_ROLE_CHANGES",
  "j07.approveAccess": "GOVERNANCE_APPROVE_ACCESS",
  "j07.exportAudit": "GOVERNANCE_EXPORT_AUDIT",
} satisfies Record<TenantGovernanceWorkflowAction, TenantGovernanceCommand>;

const tenantGovernanceWorkflowActions = new Set<string>(tenantGovernanceWorkflowActionIds);

export function isTenantGovernanceWorkflowAction(value: unknown): value is TenantGovernanceWorkflowAction {
  return typeof value === "string" && tenantGovernanceWorkflowActions.has(value);
}

export function tenantGovernanceCommandForAction(actionId: TenantGovernanceWorkflowAction) {
  return tenantGovernanceCommandByAction[actionId];
}
