import {
  routeScopeForPageId,
  routeToSmokePath,
  screenRoutes,
  type RouteScopeLabel,
  type ScreenRoute,
} from "@/lib/route-registry";
import {
  uxRoutePolicyForRoute,
  uxWorkspaceLabels,
  type UxDensityTier,
  type UxPageType,
  type UxWorkspaceKey,
} from "@/lib/ux-route-policy";

export type UxPageContract = {
  allowedTreatment: string;
  densityTier: UxDensityTier;
  forbiddenTreatment: string;
  pageId: string;
  pageJob: string;
  pageType: UxPageType;
  path: string;
  p0Obligation: string;
  primaryCtaRule: string;
  productiveUxEligible: boolean;
  routePolicyLabels: string[];
  routeScope: RouteScopeLabel;
  title: string;
  workspace: UxWorkspaceKey;
  workspaceLabel: string;
};

const pageTypeJobs: Record<UxPageType, string> = {
  Detail: "Show one object's facts, evidence or timeline context, and the gated next action without turning the page into a global queue.",
  Drawer: "Expose secondary context only; drawers do not become independent workflows or completion gates.",
  Hold: "Explain the hold state and keep the route blocked until a later explicit scope unlock.",
  Hub: "Orient, prioritize, and route to the next eligible work surface without carrying a complete workflow.",
  Modal: "Resolve one scoped confirmation, validation, or recovery step without silently advancing downstream gates.",
  P1: "Keep the deferred workspace visible as registered-only context without MVP product action.",
  Reference: "Provide internal reference context only, without product workflow or primary MVP CTA.",
  Workbench: "Triage scoped work with queue, selected context, and a safe action rail.",
};

function allowedTreatmentForContract(pageType: UxPageType, routeScope: RouteScopeLabel) {
  if (routeScope === "P1_AFTER_MVP") return "Deferred placeholder, route guard, future label, and primary-navigation exclusion only.";
  if (routeScope === "REFERENCE_ONLY") return "Reference/catalogue/state documentation only; optional utility access without product workflow.";
  if (routeScope === "HOLD_PENDING_DECISION") return "Hold note, blocked state, and guard/no-elevation regression only.";
  if (pageType === "Hub") return "Summary, priority signal, and safe next-work handoff.";
  if (pageType === "Detail") return "Object header, key facts, evidence/timeline, and gated action rail.";
  if (pageType === "Modal") return "One explicit confirmation, validation, or recovery path with cancel/blocked feedback.";
  return "Focus, status context, and one primary next step aligned to route policy.";
}

function forbiddenTreatmentForContract(pageType: UxPageType, routeScope: RouteScopeLabel) {
  if (routeScope === "P1_AFTER_MVP") return "No MVP CTA, no main-flow elevation, no product task, and no client-visible behavior.";
  if (routeScope === "REFERENCE_ONLY") return "No productive workflow, no product CTA, and no client payload.";
  if (routeScope === "HOLD_PENDING_DECISION") return "No MVP implementation, no visual generation, no scope unlock, and no safety finalization.";
  if (pageType === "Hub") return "No full workflow, final release, export approval, download, share, or client acceptance action on the hub.";
  if (pageType === "Detail") return "No unrelated global queue, hidden prerequisites, payload expansion, or completion from visible status alone.";
  return "No route creation, route reclassification, screen generation, state-screen generation, or downstream gate overclaim.";
}

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
  const routeScope = routeScopeForPageId(route.pageId);
  const policy = uxRoutePolicyForRoute(route);

  return {
    allowedTreatment: allowedTreatmentForContract(policy.pageType, routeScope),
    densityTier: policy.densityTier,
    forbiddenTreatment: forbiddenTreatmentForContract(policy.pageType, routeScope),
    pageId: route.pageId,
    pageJob: pageTypeJobs[policy.pageType],
    pageType: policy.pageType,
    path: routeToSmokePath(route.route),
    p0Obligation: p0ObligationForContract(policy.workspace, routeScope),
    primaryCtaRule: policy.primaryCtaRule,
    productiveUxEligible: routeScope === "MVP" || routeScope === "MVP_SUPPORT",
    routePolicyLabels: policy.routePolicyLabels,
    routeScope,
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
