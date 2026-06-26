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

  if (workspace === "client_workspace") return "Client visibility must fail closed; released/redacted/client-safe content only.";
  if (workspace === "advisory_workbench") return "AI drafts and internal rationale stay internal; no unapproved advice reaches the client.";
  if (workspace === "communication") return "Communication context must not generate advice, send client copy, or bypass release.";
  if (workspace === "evidence") return "Upload success must not imply evidence sufficiency.";
  if (workspace === "elevated_workflows") return "KYC, suitability, committee and review monitoring stay internal until safety, evidence and release gates pass.";
  if (workspace === "compliance") return "Compliance release, block, evidence request, audit, and client visibility remain gated.";
  if (workspace === "governance") return "Admin route access must not bypass RBAC, payload, audit, evidence, release, or export gates.";
  if (workspace === "ops") return "Operations support must not bypass advice, compliance, evidence, export or client visibility gates.";
  if (workspace === "export") return "Export preview, approval, download/share, and client acceptance remain separate.";

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
