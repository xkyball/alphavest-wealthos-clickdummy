export type PlatformAdminWorkflowAction =
  | "j10.savePlatform"
  | "j10.viewAudit"
  | "j10.reviewPermission"
  | "j10.saveSecurity";

export type PlatformAdminCommand =
  | "PLATFORM_SAVE_SETTINGS"
  | "PLATFORM_VIEW_AUDIT"
  | "PLATFORM_REVIEW_PERMISSION"
  | "PLATFORM_SAVE_SECURITY";

export const platformAdminCanonicalApiRoute = "/api/platform-admin/actions" as const;

export const platformAdminWorkflowActionIds = [
  "j10.savePlatform",
  "j10.viewAudit",
  "j10.reviewPermission",
  "j10.saveSecurity",
] as const satisfies readonly PlatformAdminWorkflowAction[];

export const platformAdminCommandByAction = {
  "j10.savePlatform": "PLATFORM_SAVE_SETTINGS",
  "j10.viewAudit": "PLATFORM_VIEW_AUDIT",
  "j10.reviewPermission": "PLATFORM_REVIEW_PERMISSION",
  "j10.saveSecurity": "PLATFORM_SAVE_SECURITY",
} satisfies Record<PlatformAdminWorkflowAction, PlatformAdminCommand>;

const platformAdminWorkflowActions = new Set<string>(platformAdminWorkflowActionIds);

export function isPlatformAdminWorkflowAction(value: unknown): value is PlatformAdminWorkflowAction {
  return typeof value === "string" && platformAdminWorkflowActions.has(value);
}

export function platformAdminCommandForAction(actionId: PlatformAdminWorkflowAction) {
  return platformAdminCommandByAction[actionId];
}
