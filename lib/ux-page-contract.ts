import {
  screenRoutes,
  type RouteScopeLabel,
  type ScreenRoute,
} from "@/lib/route-registry";
import {
  uxOperatingModelForRoute,
  uxPageJobForPageType,
  type UxOperatingAudience,
  type UxOperatingMode,
  type UxProofPosture,
} from "@/lib/ux-operating-model";
import {
  uxRoutePolicyForRoute,
  uxWorkspaceLabels,
  type UxDensityTier,
  type UxPageType,
  type UxWorkspaceKey,
} from "@/lib/ux-route-policy";

export type UxPageContract = {
  allowedTreatment: string;
  audience: UxOperatingAudience;
  densityTier: UxDensityTier;
  forbiddenTreatment: string;
  mode: UxOperatingMode;
  noOverclaimRule: string;
  pageId: string;
  pageJob: string;
  pageType: UxPageType;
  path: string;
  p0Obligation: string;
  primaryCtaRule: string;
  productiveUxEligible: boolean;
  proofPosture: UxProofPosture;
  routePolicyLabels: string[];
  routeScope: RouteScopeLabel;
  title: string;
  workspace: UxWorkspaceKey;
  workspaceLabel: string;
};

function p0ObligationForContract(workspace: UxWorkspaceKey, routeScope: RouteScopeLabel) {
  if (routeScope === "P1_AFTER_MVP" || routeScope === "REFERENCE_ONLY" || routeScope === "HOLD_PENDING_DECISION") {
    return "Guard and no-elevation regression proof if touched.";
  }

  if (workspace === "area_01_foundation") return "Foundation and governance access must not bypass RBAC, payload, audit, evidence, release, or export gates.";
  if (workspace === "area_02_client_context") return "Client context must not imply evidence sufficiency, advice release or client-safe projection.";
  if (workspace === "area_03_evidence_lifecycle") return "Upload success must not imply evidence sufficiency.";
  if (workspace === "area_04_analyst_workbench") return "AI drafts and internal rationale stay internal; no unapproved advice reaches the client.";
  if (workspace === "area_05_advisor_review") return "Advisor approval is a human review gate only; it must not release content.";
  if (workspace === "area_06_compliance_release") return "Compliance release, block, evidence request, audit, and client visibility remain gated.";
  if (workspace === "area_08_client_visibility") return "Client visibility must fail closed; released/redacted/client-safe content only.";
  if (workspace === "area_09_export_delivery") return "Export preview, approval, download/share, and client acceptance remain separate.";
  if (workspace === "area_10_operations") return "Operations support must not bypass advice, compliance, evidence, export or client visibility gates.";
  if (workspace === "area_11_protected_work") return "Protected KYC, suitability, committee, monitoring and reference work must not imply MVP readiness.";

  return "Route access, payload visibility, action authority, and audit gates remain separate.";
}

export function uxPageContractForRoute(route: ScreenRoute): UxPageContract {
  const operatingModel = uxOperatingModelForRoute(route);
  const policy = uxRoutePolicyForRoute(route);

  return {
    allowedTreatment: operatingModel.allowedTreatment,
    audience: operatingModel.audience,
    densityTier: policy.densityTier,
    forbiddenTreatment: operatingModel.forbiddenTreatment,
    mode: operatingModel.mode,
    noOverclaimRule: operatingModel.noOverclaimRule,
    pageId: route.pageId,
    pageJob: uxPageJobForPageType(policy.pageType),
    pageType: policy.pageType,
    path: operatingModel.path,
    p0Obligation: p0ObligationForContract(policy.workspace, operatingModel.routeScope),
    primaryCtaRule: policy.primaryCtaRule,
    productiveUxEligible: operatingModel.productiveUxEligible,
    proofPosture: operatingModel.proofPosture,
    routePolicyLabels: policy.routePolicyLabels,
    routeScope: operatingModel.routeScope,
    title: route.title,
    workspace: policy.workspace,
    workspaceLabel: uxWorkspaceLabels[policy.workspace],
  };
}

export const uxPageContracts = screenRoutes.map(uxPageContractForRoute);

export const eligibleUxPageContracts = uxPageContracts.filter((contract) => contract.productiveUxEligible);

export const protectedUxPageContracts = uxPageContracts.filter((contract) => !contract.productiveUxEligible);

export const uxPageContractIntegrity = {
  duplicatePageIds: uxPageContracts
    .map((contract) => contract.pageId)
    .filter((pageId, index, pageIds) => pageIds.indexOf(pageId) !== index),
  eligibleCount: eligibleUxPageContracts.length,
  missingPageIds: screenRoutes
    .map((route) => route.pageId)
    .filter((pageId) => !uxPageContracts.some((contract) => contract.pageId === pageId)),
  protectedCount: protectedUxPageContracts.length,
  totalCount: uxPageContracts.length,
};
