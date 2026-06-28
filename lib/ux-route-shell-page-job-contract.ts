import type {
  RouteScopeLabel,
} from "@/lib/route-registry";
import {
  uxShellSlotPolicyForTemplate,
  type UxPageJob,
  type UxPageTemplateFamily,
  type UxPageTemplateRecord,
  type UxPageTemplateZone,
  type UxShellSlotPolicy,
} from "@/lib/ux-page-template-system";
import type {
  UxDensityTier,
  UxPageType,
  UxWorkspaceKey,
} from "@/lib/ux-route-policy";

export const uxRouteShellPageJobContractId = "EPIC-03_ROUTE_SHELL_PAGE_JOB_CONTRACT";

export const uxRouteShellPageJobAllowedJobs = [
  "audit_reference",
  "client_summary",
  "decision_room",
  "queue",
  "queue_detail",
  "stepper",
] as const satisfies readonly UxPageJob[];

export const uxRouteShellPageJobTemplateFamilyJobs = {
  client_summary: "client_summary",
  dashboard_list: "queue",
  detail_decision_room: "decision_room",
  reference_hold: "audit_reference",
  workbench_master_detail: "queue_detail",
  workflow_stepper: "stepper",
} as const satisfies Record<UxPageTemplateFamily, UxPageJob>;

export type UxRouteShellPageJobContractRecord = {
  activeStep: string;
  allowedRenderers: readonly string[];
  allowedZones: readonly UxPageTemplateZone[];
  commandZone: UxShellSlotPolicy["commandZone"];
  contractId: typeof uxRouteShellPageJobContractId;
  densityTier: UxDensityTier;
  family: UxPageTemplateFamily;
  freeformChildrenPolicy: UxShellSlotPolicy["freeformChildrenPolicy"];
  noOverclaimRule: string;
  pageId: string;
  pageJob: UxPageJob;
  pageType: UxPageType;
  productiveUxEligible: boolean;
  proofAuditPlacement: string;
  routeScope: RouteScopeLabel;
  workspace: UxWorkspaceKey;
};

export type UxRouteShellPageJobDataAttributes = {
  "data-ux-contract-active-step": string;
  "data-ux-contract-allowed-renderers": string;
  "data-ux-contract-allowed-zones": string;
  "data-ux-contract-command-zone": UxShellSlotPolicy["commandZone"];
  "data-ux-contract-density-tier": UxDensityTier;
  "data-ux-contract-id": typeof uxRouteShellPageJobContractId;
  "data-ux-contract-no-overclaim": string;
  "data-ux-contract-page-type": UxPageType;
  "data-ux-contract-productive": "true" | "false";
  "data-ux-contract-proof-audit": string;
  "data-ux-contract-route-scope": RouteScopeLabel;
  "data-ux-contract-workspace": UxWorkspaceKey;
  "data-ux-page-job-contract": UxPageJob;
  "data-ux-route-contract": "registered_route_policy";
  "data-ux-shell-contract": UxShellSlotPolicy["freeformChildrenPolicy"];
  "data-ux-template-family-contract": UxPageTemplateFamily;
};

export function uxRouteShellPageJobContractForTemplate(
  template: UxPageTemplateRecord,
): UxRouteShellPageJobContractRecord {
  const shellSlotPolicy = uxShellSlotPolicyForTemplate(template);

  return {
    activeStep: template.activeStep,
    allowedRenderers: template.allowedRenderers,
    allowedZones: shellSlotPolicy.allowedZones,
    commandZone: shellSlotPolicy.commandZone,
    contractId: uxRouteShellPageJobContractId,
    densityTier: template.densityTier,
    family: template.family,
    freeformChildrenPolicy: shellSlotPolicy.freeformChildrenPolicy,
    noOverclaimRule: template.noOverclaimRule,
    pageId: template.pageId,
    pageJob: template.pageJob,
    pageType: template.pageType,
    productiveUxEligible: template.productiveUxEligible,
    proofAuditPlacement: template.proofAuditPlacement,
    routeScope: template.routeScope,
    workspace: template.workspace,
  };
}

export function uxRouteShellPageJobDataAttributesForTemplate(
  template: UxPageTemplateRecord,
): UxRouteShellPageJobDataAttributes {
  const contract = uxRouteShellPageJobContractForTemplate(template);

  return {
    "data-ux-contract-active-step": contract.activeStep,
    "data-ux-contract-allowed-renderers": contract.allowedRenderers.join(" "),
    "data-ux-contract-allowed-zones": contract.allowedZones.join(" "),
    "data-ux-contract-command-zone": contract.commandZone,
    "data-ux-contract-density-tier": contract.densityTier,
    "data-ux-contract-id": contract.contractId,
    "data-ux-contract-no-overclaim": contract.noOverclaimRule,
    "data-ux-contract-page-type": contract.pageType,
    "data-ux-contract-productive": contract.productiveUxEligible ? "true" : "false",
    "data-ux-contract-proof-audit": contract.proofAuditPlacement,
    "data-ux-contract-route-scope": contract.routeScope,
    "data-ux-contract-workspace": contract.workspace,
    "data-ux-page-job-contract": contract.pageJob,
    "data-ux-route-contract": "registered_route_policy",
    "data-ux-shell-contract": contract.freeformChildrenPolicy,
    "data-ux-template-family-contract": contract.family,
  };
}
