import type { UxActionMeaning } from "@/lib/ux-action-hierarchy-contract";
import type { UxComponentState } from "@/lib/ux-lifecycle-state-contract";

export type UxStatusHierarchyLevel =
  | "attention"
  | "blocking"
  | "completed"
  | "informational";

export type UxStatusPrimitiveContract = typeof uxStatusPrimitiveContractId;

export type UxStatusPrimitiveFamily =
  | "action"
  | "blocker"
  | "confirmation"
  | "status";

export type UxRecoveryAction =
  | "accept_sufficiency"
  | "clear_filter"
  | "complete_review"
  | "confirm_scope"
  | "open_decision_room"
  | "provide_evidence"
  | "request_clarification"
  | "retry"
  | "review_policy"
  | "wait";

export type UxCommandHierarchyLevel =
  | "blocked_command"
  | "destructive_command"
  | "primary_command"
  | "recovery_command"
  | "secondary_command"
  | "status_only";

export type UxConfirmationState =
  | "blocked"
  | "cancelled"
  | "confirmed"
  | "ready"
  | "submitting"
  | "validation_failed";

export type UxConfirmationScope =
  | "advisor_review"
  | "client_decision"
  | "compliance_release"
  | "data_quality_recovery"
  | "export_approval"
  | "export_download"
  | "permission_mutation";

export type UxStatusCommandContract = {
  commandLevel: UxCommandHierarchyLevel;
  defaultActionMeaning: UxActionMeaning;
  level: UxStatusHierarchyLevel;
  noOverclaimRule: string;
  requiresReason: boolean;
  requiresRecoveryAction: boolean;
};

export type UxStatusCommandProjectionInput = {
  actionMeaning?: UxActionMeaning;
  componentState: UxComponentState;
  primitiveFamily?: UxStatusPrimitiveFamily;
  reason?: string;
  recoveryAction?: UxRecoveryAction;
};

export type UxStatusCommandRuntimeAttributes = Record<`data-${string}`, string | undefined>;

export type UxConfirmationProjectionInput = {
  actionMeaning?: UxActionMeaning;
  requiresAudit?: boolean;
  scope: UxConfirmationScope;
  state: UxConfirmationState;
};

export const uxStatusPrimitiveContractId = "domain_05_status_action_blocker_confirmation" as const;

export const uxStatusPrimitiveFamilies = [
  "status",
  "action",
  "blocker",
  "confirmation",
] as const satisfies readonly UxStatusPrimitiveFamily[];

export const uxConfirmationStates = [
  "blocked",
  "cancelled",
  "confirmed",
  "ready",
  "submitting",
  "validation_failed",
] as const satisfies readonly UxConfirmationState[];

export const uxConfirmationScopes = [
  "advisor_review",
  "client_decision",
  "compliance_release",
  "data_quality_recovery",
  "export_approval",
  "export_download",
  "permission_mutation",
] as const satisfies readonly UxConfirmationScope[];

export const uxStatusCommandContracts = {
  attention: {
    commandLevel: "recovery_command",
    defaultActionMeaning: "request_evidence",
    level: "attention",
    noOverclaimRule: "Attention states point to recovery work and must not imply a blocker is cleared.",
    requiresReason: true,
    requiresRecoveryAction: true,
  },
  blocking: {
    commandLevel: "blocked_command",
    defaultActionMeaning: "navigate",
    level: "blocking",
    noOverclaimRule: "Blocking states must not imply downstream completion until the named reason and recovery action are resolved.",
    requiresReason: true,
    requiresRecoveryAction: true,
  },
  completed: {
    commandLevel: "status_only",
    defaultActionMeaning: "navigate",
    level: "completed",
    noOverclaimRule: "Completed status is local to the named action and must not imply downstream gates are complete.",
    requiresReason: false,
    requiresRecoveryAction: false,
  },
  informational: {
    commandLevel: "status_only",
    defaultActionMeaning: "navigate",
    level: "informational",
    noOverclaimRule: "Informational status explains context only and must not imply command authority.",
    requiresReason: false,
    requiresRecoveryAction: false,
  },
} as const satisfies Record<UxStatusHierarchyLevel, UxStatusCommandContract>;

export const uxStatusHierarchyLevels = Object.keys(uxStatusCommandContracts) as UxStatusHierarchyLevel[];

const blockingStates = new Set<UxComponentState>([
  "audit-unavailable",
  "blocked",
  "denied",
  "error",
  "export-failed",
  "hold-blocked",
  "restricted",
]);

const attentionStates = new Set<UxComponentState>([
  "export-redaction",
  "hidden",
  "internal-only",
  "p1-deferred",
  "redacted",
  "validation",
]);

const completedStates = new Set<UxComponentState>(["success"]);

export function uxStatusHierarchyLevelForComponentState(componentState: UxComponentState): UxStatusHierarchyLevel {
  if (blockingStates.has(componentState)) return "blocking";
  if (attentionStates.has(componentState)) return "attention";
  if (completedStates.has(componentState)) return "completed";

  return "informational";
}

export function uxStatusCommandContractForLevel(level: UxStatusHierarchyLevel): UxStatusCommandContract {
  return uxStatusCommandContracts[level];
}

export function uxStatusCommandAttributesFor(input: UxStatusCommandProjectionInput): UxStatusCommandRuntimeAttributes {
  const level = uxStatusHierarchyLevelForComponentState(input.componentState);
  const contract = uxStatusCommandContractForLevel(level);
  const missingReason = contract.requiresReason && !input.reason;
  const missingRecovery = contract.requiresRecoveryAction && !input.recoveryAction;
  const primitiveFamily = input.primitiveFamily ?? (level === "blocking" || level === "attention" ? "blocker" : "status");

  return {
    "data-ux-command-default-action": input.actionMeaning ?? contract.defaultActionMeaning,
    "data-ux-command-level": contract.commandLevel,
    "data-ux-status-primitive-contract": uxStatusPrimitiveContractId,
    "data-ux-status-primitive-family": primitiveFamily,
    "data-ux-status-blocker-reason": input.reason,
    "data-ux-status-hierarchy-level": contract.level,
    "data-ux-status-missing-recovery": missingRecovery ? "true" : "false",
    "data-ux-status-missing-reason": missingReason ? "true" : "false",
    "data-ux-status-no-overclaim": contract.noOverclaimRule,
    "data-ux-status-recovery-action": input.recoveryAction,
    "data-ux-status-requires-reason": contract.requiresReason ? "true" : "false",
    "data-ux-status-requires-recovery": contract.requiresRecoveryAction ? "true" : "false",
  };
}

export function uxConfirmationAttributesFor(input: UxConfirmationProjectionInput): UxStatusCommandRuntimeAttributes {
  return {
    "data-ux-action-meaning": input.actionMeaning,
    "data-ux-confirmation-no-overclaim": "true",
    "data-ux-confirmation-requires-audit": input.requiresAudit === false ? "false" : "true",
    "data-ux-confirmation-scope": input.scope,
    "data-ux-confirmation-state": input.state,
    "data-ux-no-overclaim": "true",
    "data-ux-status-primitive-contract": uxStatusPrimitiveContractId,
    "data-ux-status-primitive-family": "confirmation",
  };
}
