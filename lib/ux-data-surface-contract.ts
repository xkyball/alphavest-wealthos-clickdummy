import type { UxActionMeaning } from "@/lib/ux-action-hierarchy-contract";

export type UxDataSurfaceFamily =
  | "table"
  | "list"
  | "queue"
  | "board"
  | "audit_log"
  | "redaction_table"
  | "permission_matrix"
  | "detail_support_list";

export type UxDataSurfaceDensity =
  | "compact_operations"
  | "standard_review"
  | "spacious_detail_support"
  | "mobile_card_projection";

export type UxDataSurfaceDensityPreset =
  | "compact"
  | "default"
  | "comfortable";

export type UxDataSurfaceDensityInput = UxDataSurfaceDensity | UxDataSurfaceDensityPreset;

export type UxDataFieldPriority =
  | "identity"
  | "primary_status"
  | "risk_due"
  | "evidence_gate"
  | "secondary_metadata"
  | "mobile_hidden"
  | "action";

export type UxDataSurfaceActionPolicy =
  | "none"
  | "open_detail"
  | "preview"
  | "route_handoff"
  | "command_handoff"
  | "blocked_static"
  | "disabled_unavailable";

export type UxDataSurfaceFilterState =
  | "inactive"
  | "active_query"
  | "active_filter"
  | "active_query_and_filter"
  | "disabled_static"
  | "unsupported_hidden";

export type UxMasterDetailMode =
  | "none"
  | "inline_detail_rail"
  | "drawer_detail"
  | "route_detail";

export type UxSurfaceGovernanceContract = typeof uxSurfaceGovernanceContractId;

export type UxSurfaceGovernancePattern =
  | "queue_workbench"
  | "governance_master_detail"
  | "board_detail_surface"
  | "table_detail_surface"
  | "workbench_master_detail_or_stepper";

export type UxLongScreenGovernancePolicy =
  | "not_applicable"
  | "resolved_by_shared_surface"
  | "split_or_extract_required"
  | "exception_required";

export type UxDataSurfaceRuntimeAttributes = Record<`data-${string}`, string | undefined>;

export type UxDataSurfaceActionContract = {
  actionMeaning: UxActionMeaning;
  actionPolicy: UxDataSurfaceActionPolicy;
  downstreamForbidden: string;
  noOverclaimRule: string;
  rendersAffordance: boolean;
};

export type UxDataSurfaceProjectionInput = {
  actionPolicy?: UxDataSurfaceActionPolicy;
  density: UxDataSurfaceDensityInput;
  densityPreset?: UxDataSurfaceDensityPreset;
  family: UxDataSurfaceFamily;
  filterState?: UxDataSurfaceFilterState;
  governancePattern?: UxSurfaceGovernancePattern;
  longScreenGovernance?: UxLongScreenGovernancePolicy;
  masterDetailMode?: UxMasterDetailMode;
  stickyHeader?: boolean;
  stickyRail?: boolean;
  targetScreenId?: string;
};

export type UxSurfaceGovernanceProjectionInput = Pick<
  UxDataSurfaceProjectionInput,
  "governancePattern" | "longScreenGovernance" | "targetScreenId"
>;

export const uxSurfaceGovernanceContractId = "domain_04_master_detail_data_surface_long_screen" as const;

export const uxDataSurfaceFamilies = [
  "table",
  "list",
  "queue",
  "board",
  "audit_log",
  "redaction_table",
  "permission_matrix",
  "detail_support_list",
] as const satisfies readonly UxDataSurfaceFamily[];

export const uxDataSurfaceDensities = [
  "compact_operations",
  "standard_review",
  "spacious_detail_support",
  "mobile_card_projection",
] as const satisfies readonly UxDataSurfaceDensity[];

export const uxDataSurfaceDensityPresets = [
  "compact",
  "default",
  "comfortable",
] as const satisfies readonly UxDataSurfaceDensityPreset[];

export const uxDataFieldPriorities = [
  "identity",
  "primary_status",
  "risk_due",
  "evidence_gate",
  "secondary_metadata",
  "mobile_hidden",
  "action",
] as const satisfies readonly UxDataFieldPriority[];

export const uxDataSurfaceActionPolicies = [
  "none",
  "open_detail",
  "preview",
  "route_handoff",
  "command_handoff",
  "blocked_static",
  "disabled_unavailable",
] as const satisfies readonly UxDataSurfaceActionPolicy[];

export const uxDataSurfaceFilterStates = [
  "inactive",
  "active_query",
  "active_filter",
  "active_query_and_filter",
  "disabled_static",
  "unsupported_hidden",
] as const satisfies readonly UxDataSurfaceFilterState[];

export const uxMasterDetailModes = [
  "none",
  "inline_detail_rail",
  "drawer_detail",
  "route_detail",
] as const satisfies readonly UxMasterDetailMode[];

export const uxSurfaceGovernancePatterns = [
  "queue_workbench",
  "governance_master_detail",
  "board_detail_surface",
  "table_detail_surface",
  "workbench_master_detail_or_stepper",
] as const satisfies readonly UxSurfaceGovernancePattern[];

export const uxLongScreenGovernancePolicies = [
  "not_applicable",
  "resolved_by_shared_surface",
  "split_or_extract_required",
  "exception_required",
] as const satisfies readonly UxLongScreenGovernancePolicy[];

export const uxDataSurfaceActionContracts = {
  blocked_static: {
    actionMeaning: "navigate",
    actionPolicy: "blocked_static",
    downstreamForbidden: "approval, release, export, download, share, evidence sufficiency, permission mutation and client acceptance",
    noOverclaimRule: "Blocked data-surface affordances render status only and cannot imply workflow authority.",
    rendersAffordance: true,
  },
  command_handoff: {
    actionMeaning: "submit_review",
    actionPolicy: "command_handoff",
    downstreamForbidden: "commands without E05 action hierarchy, permission and audit preconditions",
    noOverclaimRule: "Command handoff must use an explicit action contract before it can mutate workflow state.",
    rendersAffordance: true,
  },
  disabled_unavailable: {
    actionMeaning: "navigate",
    actionPolicy: "disabled_unavailable",
    downstreamForbidden: "hidden mutation authority or unsupported workflow completion",
    noOverclaimRule: "Unavailable row actions must expose why no scoped action can run.",
    rendersAffordance: true,
  },
  none: {
    actionMeaning: "navigate",
    actionPolicy: "none",
    downstreamForbidden: "any row or card action authority",
    noOverclaimRule: "No data-surface action is available or implied.",
    rendersAffordance: false,
  },
  open_detail: {
    actionMeaning: "navigate",
    actionPolicy: "open_detail",
    downstreamForbidden: "approval, release, export, download, share, evidence sufficiency, permission mutation and client acceptance",
    noOverclaimRule: "Opening detail only changes context and cannot complete downstream gates.",
    rendersAffordance: true,
  },
  preview: {
    actionMeaning: "navigate",
    actionPolicy: "preview",
    downstreamForbidden: "approval, release, export, download, share and client-safe publication",
    noOverclaimRule: "Preview is read-only context and cannot imply approval or release.",
    rendersAffordance: true,
  },
  route_handoff: {
    actionMeaning: "navigate",
    actionPolicy: "route_handoff",
    downstreamForbidden: "route navigation standing in for workflow completion",
    noOverclaimRule: "Route handoff transfers context only; the destination route owns any next action.",
    rendersAffordance: true,
  },
} as const satisfies Record<UxDataSurfaceActionPolicy, UxDataSurfaceActionContract>;

export function uxDataSurfaceActionContractFor(policy: UxDataSurfaceActionPolicy) {
  return uxDataSurfaceActionContracts[policy];
}

export function uxDataSurfaceDensityForPreset(density: UxDataSurfaceDensityInput): UxDataSurfaceDensity {
  if (density === "compact") return "compact_operations";
  if (density === "default") return "standard_review";
  if (density === "comfortable") return "spacious_detail_support";
  return density;
}

export function uxDataSurfacePresetForDensity(
  density: UxDataSurfaceDensityInput,
  explicitPreset?: UxDataSurfaceDensityPreset,
): UxDataSurfaceDensityPreset {
  if (explicitPreset) return explicitPreset;
  if (density === "compact" || density === "default" || density === "comfortable") return density;
  if (density === "compact_operations") return "compact";
  if (density === "spacious_detail_support" || density === "mobile_card_projection") return "comfortable";
  return "default";
}

export function uxSurfaceGovernanceAttributesFor(
  input: UxSurfaceGovernanceProjectionInput,
): UxDataSurfaceRuntimeAttributes {
  if (!input.governancePattern && !input.longScreenGovernance && !input.targetScreenId) return {};

  return {
    "data-ux-surface-governance-contract": uxSurfaceGovernanceContractId,
    "data-ux-surface-governance-long-screen": input.longScreenGovernance,
    "data-ux-surface-governance-pattern": input.governancePattern,
    "data-ux-surface-governance-target-screen": input.targetScreenId,
  };
}

export function uxDataSurfaceAttributesFor(input: UxDataSurfaceProjectionInput): UxDataSurfaceRuntimeAttributes {
  const actionPolicy = input.actionPolicy ?? "none";
  const density = uxDataSurfaceDensityForPreset(input.density);
  const densityPreset = uxDataSurfacePresetForDensity(input.density, input.densityPreset);

  return {
    "data-ux-data-surface-action-policy": actionPolicy,
    "data-ux-data-surface-density": density,
    "data-ux-data-surface-density-preset": densityPreset,
    "data-ux-data-surface-family": input.family,
    "data-ux-data-surface-filter-state": input.filterState,
    "data-ux-master-detail-mode": input.masterDetailMode,
    "data-ux-no-overclaim": "true",
    "data-ux-sticky-header": input.stickyHeader ? "true" : "false",
    "data-ux-sticky-rail": input.stickyRail ? "true" : "false",
    ...uxSurfaceGovernanceAttributesFor(input),
  };
}

export function uxDataFieldAttributesFor(priority: UxDataFieldPriority): UxDataSurfaceRuntimeAttributes {
  return {
    "data-ux-data-surface-field-priority": priority,
  };
}

export function uxDataSurfaceActionAttributesFor(policy: UxDataSurfaceActionPolicy): UxDataSurfaceRuntimeAttributes {
  const contract = uxDataSurfaceActionContractFor(policy);

  return {
    "data-ux-action-meaning": contract.actionMeaning,
    "data-ux-data-surface-action-policy": policy,
    "data-ux-data-surface-action-renders-affordance": contract.rendersAffordance ? "true" : "false",
    "data-ux-data-surface-action-separation": contract.downstreamForbidden,
    "data-ux-data-surface-no-overclaim-rule": contract.noOverclaimRule,
    "data-ux-no-overclaim": "true",
  };
}
