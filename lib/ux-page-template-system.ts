import {
  screenRoutes,
  type RouteScopeLabel,
  type ScreenRoute,
} from "@/lib/route-registry";
import {
  uxOperatingModelForRoute,
  type UxOperatingAudience,
  type UxOperatingMode,
  type UxProofPosture,
} from "@/lib/ux-operating-model";
import {
  uxRoutePolicyForRoute,
  type UxDensityTier,
  type UxPageType,
  type UxWorkspaceKey,
} from "@/lib/ux-route-policy";

export type UxPageTemplateFamily =
  | "dashboard_list"
  | "workbench_master_detail"
  | "detail_decision_room"
  | "workflow_stepper"
  | "client_summary"
  | "reference_hold";

export type UxPageTemplateZone =
  | "header"
  | "summary"
  | "primary_content"
  | "secondary_content"
  | "action_zone"
  | "state_zone"
  | "proof_audit_zone";

export type UxLongPageBehavior =
  | "none"
  | "anchor_navigation"
  | "tabs"
  | "split_view"
  | "sticky_summary_rail"
  | "sticky_action_zone";

export type UxActionZoneBehavior =
  | "none"
  | "inline_next_step"
  | "adjacent_action_rail"
  | "sticky_action_zone"
  | "blocked_state_only";

export type UxProofAuditPlacement =
  | "none"
  | "secondary_context"
  | "primary_detail_zone"
  | "client_safe_summary_only"
  | "protected_state_only";

export type UxPageTemplateRenderer =
  | "WorksurfaceShell"
  | "UxHubPage"
  | "UxDetailStandardPanel"
  | "RouteSkeletonPage"
  | "PageHeader"
  | "WizardStepper";

export type UxPageTemplateDefinition = {
  actionZoneBehavior: UxActionZoneBehavior;
  allowedRenderers: readonly UxPageTemplateRenderer[];
  family: UxPageTemplateFamily;
  forbiddenZones: readonly UxPageTemplateZone[];
  longPageBehavior: UxLongPageBehavior;
  optionalZones: readonly UxPageTemplateZone[];
  proofAuditPlacement: UxProofAuditPlacement;
  requiredZones: readonly UxPageTemplateZone[];
};

export type UxPageTemplateRecord = UxPageTemplateDefinition & {
  audience: UxOperatingAudience;
  densityTier: UxDensityTier;
  mode: UxOperatingMode;
  noOverclaimRule: string;
  pageId: string;
  pageType: UxPageType;
  path: string;
  productiveUxEligible: boolean;
  proofPosture: UxProofPosture;
  routeScope: RouteScopeLabel;
  title: string;
  workspace: UxWorkspaceKey;
};

const allZones = [
  "header",
  "summary",
  "primary_content",
  "secondary_content",
  "action_zone",
  "state_zone",
  "proof_audit_zone",
] as const satisfies readonly UxPageTemplateZone[];

const templateDefinitions = {
  client_summary: {
    actionZoneBehavior: "inline_next_step",
    allowedRenderers: ["WorksurfaceShell", "UxHubPage"],
    family: "client_summary",
    forbiddenZones: [],
    longPageBehavior: "none",
    optionalZones: ["proof_audit_zone"],
    proofAuditPlacement: "client_safe_summary_only",
    requiredZones: ["header", "summary", "primary_content", "action_zone", "state_zone"],
  },
  dashboard_list: {
    actionZoneBehavior: "inline_next_step",
    allowedRenderers: ["WorksurfaceShell", "UxHubPage"],
    family: "dashboard_list",
    forbiddenZones: [],
    longPageBehavior: "sticky_summary_rail",
    optionalZones: ["secondary_content", "proof_audit_zone"],
    proofAuditPlacement: "secondary_context",
    requiredZones: ["header", "summary", "primary_content", "action_zone", "state_zone"],
  },
  detail_decision_room: {
    actionZoneBehavior: "adjacent_action_rail",
    allowedRenderers: ["WorksurfaceShell", "UxDetailStandardPanel"],
    family: "detail_decision_room",
    forbiddenZones: [],
    longPageBehavior: "sticky_summary_rail",
    optionalZones: ["secondary_content"],
    proofAuditPlacement: "primary_detail_zone",
    requiredZones: ["header", "summary", "primary_content", "action_zone", "state_zone", "proof_audit_zone"],
  },
  reference_hold: {
    actionZoneBehavior: "blocked_state_only",
    allowedRenderers: ["RouteSkeletonPage"],
    family: "reference_hold",
    forbiddenZones: ["action_zone", "proof_audit_zone"],
    longPageBehavior: "none",
    optionalZones: ["secondary_content"],
    proofAuditPlacement: "protected_state_only",
    requiredZones: ["header", "summary", "state_zone"],
  },
  workbench_master_detail: {
    actionZoneBehavior: "adjacent_action_rail",
    allowedRenderers: ["WorksurfaceShell"],
    family: "workbench_master_detail",
    forbiddenZones: [],
    longPageBehavior: "split_view",
    optionalZones: ["summary", "proof_audit_zone"],
    proofAuditPlacement: "secondary_context",
    requiredZones: ["header", "primary_content", "secondary_content", "action_zone", "state_zone"],
  },
  workflow_stepper: {
    actionZoneBehavior: "inline_next_step",
    allowedRenderers: ["WorksurfaceShell", "PageHeader", "WizardStepper"],
    family: "workflow_stepper",
    forbiddenZones: [],
    longPageBehavior: "tabs",
    optionalZones: ["secondary_content", "proof_audit_zone"],
    proofAuditPlacement: "secondary_context",
    requiredZones: ["header", "summary", "primary_content", "action_zone", "state_zone"],
  },
} as const satisfies Record<UxPageTemplateFamily, UxPageTemplateDefinition>;

const protectedScopes = new Set<RouteScopeLabel>(["HOLD_PENDING_DECISION", "P1_AFTER_MVP", "REFERENCE_ONLY"]);
const wizardVisualModes = new Set<ScreenRoute["visualMode"]>(["WIZARD_OR_STEP_PAGE", "MODAL_CAPABLE_AUTH_PAGE"]);

export const uxPageTemplateDefinitions: Record<UxPageTemplateFamily, UxPageTemplateDefinition> = templateDefinitions;
export const uxPageTemplateZones = allZones;

function templateFamilyForRoute(route: ScreenRoute): UxPageTemplateFamily {
  const operatingModel = uxOperatingModelForRoute(route);
  const policy = uxRoutePolicyForRoute(route);

  if (protectedScopes.has(operatingModel.routeScope)) return "reference_hold";
  if (policy.workspace === "client_workspace" && operatingModel.audience === "client_safe") return "client_summary";
  if (wizardVisualModes.has(route.visualMode) || policy.pageType === "Modal") return "workflow_stepper";
  if (policy.pageType === "Detail") return "detail_decision_room";
  if (policy.pageType === "Hub") return "dashboard_list";

  return "workbench_master_detail";
}

export function uxPageTemplateForRoute(route: ScreenRoute): UxPageTemplateRecord {
  const operatingModel = uxOperatingModelForRoute(route);
  const policy = uxRoutePolicyForRoute(route);
  const family = templateFamilyForRoute(route);
  const definition = uxPageTemplateDefinitions[family];

  return {
    ...definition,
    audience: operatingModel.audience,
    densityTier: policy.densityTier,
    mode: operatingModel.mode,
    noOverclaimRule: operatingModel.noOverclaimRule,
    pageId: route.pageId,
    pageType: policy.pageType,
    path: operatingModel.path,
    productiveUxEligible: operatingModel.productiveUxEligible,
    proofPosture: operatingModel.proofPosture,
    routeScope: operatingModel.routeScope,
    title: route.title,
    workspace: policy.workspace,
  };
}

export function uxPageTemplateForPageId(pageId: string): UxPageTemplateRecord {
  const route = screenRoutes.find((candidate) => candidate.pageId === pageId);

  if (!route) {
    throw new Error(`UX page template route ${pageId} is missing from the route registry.`);
  }

  return uxPageTemplateForRoute(route);
}

export const uxPageTemplateRecords = screenRoutes.map(uxPageTemplateForRoute);

export const eligibleUxPageTemplateRecords = uxPageTemplateRecords.filter((record) => record.productiveUxEligible);
export const protectedUxPageTemplateRecords = uxPageTemplateRecords.filter((record) => !record.productiveUxEligible);

export const uxPageTemplateIntegrity = {
  duplicatePageIds: uxPageTemplateRecords
    .map((record) => record.pageId)
    .filter((pageId, index, pageIds) => pageIds.indexOf(pageId) !== index),
  missingPageIds: screenRoutes
    .map((route) => route.pageId)
    .filter((pageId) => !uxPageTemplateRecords.some((record) => record.pageId === pageId)),
  protectedRoutesWithProductiveTemplate: protectedUxPageTemplateRecords
    .filter((record) => record.family !== "reference_hold" || record.actionZoneBehavior !== "blocked_state_only")
    .map((record) => record.pageId),
  templateFamilies: Array.from(new Set(uxPageTemplateRecords.map((record) => record.family))).sort(),
  totalCount: uxPageTemplateRecords.length,
};
