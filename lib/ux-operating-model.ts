import {
  routeScopeForPageId,
  routeToSmokePath,
  screenRoutes,
  type RouteScopeLabel,
  type ScreenRoute,
  type VisualMode,
} from "@/lib/route-registry";
import {
  uxRoutePolicyForRoute,
  type UxPageType,
  type UxWorkspaceKey,
} from "@/lib/ux-route-policy";

export type UxOperatingMode =
  | "OPERATIONAL_INTERNAL"
  | "OPERATIONAL_CLIENT_SAFE"
  | "INTERNAL_PREVIEW"
  | "PROOF_REVIEWER"
  | "REFERENCE_ONLY"
  | "DEFERRED_P1"
  | "HOLD_PENDING_DECISION";

export type UxOperatingAudience = "internal" | "internal_reviewer" | "client_safe" | "reference_reviewer";

export type UxProofPosture =
  | "product_runtime"
  | "client_projection"
  | "internal_preview"
  | "visual_reference"
  | "partial_capture"
  | "blocked_scope";

export type UxOperatingModelRecord = {
  allowedTreatment: string;
  audience: UxOperatingAudience;
  forbiddenTreatment: string;
  mode: UxOperatingMode;
  noOverclaimRule: string;
  pageId: string;
  pageType: UxPageType;
  path: string;
  productiveUxEligible: boolean;
  proofPosture: UxProofPosture;
  routeScope: RouteScopeLabel;
  title: string;
  visualMode: VisualMode;
  workspace: UxWorkspaceKey;
};

const previewVisualModes = new Set<VisualMode>([
  "BLOCK_OR_REQUEST_EVIDENCE_MODAL_STATE",
  "DOWNLOAD_CONFIRMATION_STATE",
  "PAGE_WITH_APPROVAL_DRAWER",
  "PAGE_WITH_APPROVAL_OR_EXPORT_CONFIRMATION_MODAL",
  "PAGE_WITH_DECISION_CONFIRMATION_MODAL_OPTION",
  "PREVIEW_PAGE_OR_PANEL",
  "RELEASE_CONFIRMATION_MODAL_STATE",
]);

const routeScopeModes: Partial<Record<RouteScopeLabel, UxOperatingMode>> = {
  HOLD_PENDING_DECISION: "HOLD_PENDING_DECISION",
  P1_AFTER_MVP: "DEFERRED_P1",
  REFERENCE_ONLY: "REFERENCE_ONLY",
};

const routeScopeProofPostures: Partial<Record<RouteScopeLabel, UxProofPosture>> = {
  HOLD_PENDING_DECISION: "blocked_scope",
  P1_AFTER_MVP: "blocked_scope",
  REFERENCE_ONLY: "visual_reference",
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

export function uxPageJobForPageType(pageType: UxPageType) {
  return pageTypeJobs[pageType];
}

function allowedTreatmentForModel(pageType: UxPageType, routeScope: RouteScopeLabel) {
  if (routeScope === "P1_AFTER_MVP") return "Deferred placeholder, route guard, future label, and primary-navigation exclusion only.";
  if (routeScope === "REFERENCE_ONLY") return "Reference/catalogue/state documentation only; optional utility access without product workflow.";
  if (routeScope === "HOLD_PENDING_DECISION") return "Hold note, blocked state, and guard/no-elevation regression only.";
  if (pageType === "Hub") return "Summary, priority signal, and safe next-work handoff.";
  if (pageType === "Detail") return "Object header, key facts, evidence/timeline, and gated action rail.";
  if (pageType === "Modal") return "One explicit confirmation, validation, or recovery path with cancel/blocked feedback.";
  return "Focus, status context, and one primary next step aligned to route policy.";
}

function forbiddenTreatmentForModel(pageType: UxPageType, routeScope: RouteScopeLabel) {
  if (routeScope === "P1_AFTER_MVP") return "No MVP CTA, no main-flow elevation, no product task, and no client-visible behavior.";
  if (routeScope === "REFERENCE_ONLY") return "No productive workflow, no product CTA, and no client payload.";
  if (routeScope === "HOLD_PENDING_DECISION") return "No MVP implementation, no visual generation, no scope unlock, and no safety finalization.";
  if (pageType === "Hub") return "No full workflow, final release, export approval, download, share, or client acceptance action on the hub.";
  if (pageType === "Detail") return "No unrelated global queue, hidden prerequisites, payload expansion, or completion from visible status alone.";
  return "No route creation, route reclassification, screen generation, state-screen generation, or downstream gate overclaim.";
}

function noOverclaimRuleForModel(workspace: UxWorkspaceKey, routeScope: RouteScopeLabel, clientVisibilitySensitive: boolean | undefined) {
  if (routeScope === "P1_AFTER_MVP") return "Deferred routes are registered context only and must not imply MVP readiness.";
  if (routeScope === "REFERENCE_ONLY") return "Reference routes are visual/context proof only and must not imply product workflow capability.";
  if (routeScope === "HOLD_PENDING_DECISION") return "Hold routes remain blocked until an explicit scope unlock decision exists.";
  if (clientVisibilitySensitive && workspace !== "client_workspace") {
    return "Client-sensitive internal route; no internal draft, note, evidence, release or payload may be treated as client-safe output.";
  }
  if (workspace === "client_workspace") return "Client-facing content must be released, redacted and client-safe before it is presented as client output.";
  if (workspace === "advisory_workbench") return "Internal drafts and unsupported rationale remain internal; advisor review is not client release.";
  if (workspace === "communication") return "Communication context cannot become advice, release or delivery authority.";
  if (workspace === "evidence") return "Upload or evidence visibility is not evidence sufficiency.";
  if (workspace === "elevated_workflows") return "Elevated review visibility does not create client-facing advice or automatic release.";
  if (workspace === "compliance") return "Compliance release controls client visibility, but release is not client acceptance.";
  if (workspace === "governance") return "Admin access cannot bypass RBAC, payload, audit, evidence, release or export gates.";
  if (workspace === "ops") return "Operations support cannot bypass advice, compliance, evidence, export or client visibility gates.";
  if (workspace === "export") return "Export preview, approval, download/share and client acceptance remain separate.";
  return "Visible navigation or status is not proof of payload visibility, action authority or audit completion.";
}

function operatingModeForRoute(route: ScreenRoute, routeScope: RouteScopeLabel, workspace: UxWorkspaceKey): UxOperatingMode {
  const protectedMode = routeScopeModes[routeScope];
  if (protectedMode) return protectedMode;
  if (previewVisualModes.has(route.visualMode)) return "INTERNAL_PREVIEW";
  if (workspace === "client_workspace") return "OPERATIONAL_CLIENT_SAFE";
  return "OPERATIONAL_INTERNAL";
}

function audienceForMode(mode: UxOperatingMode): UxOperatingAudience {
  if (mode === "OPERATIONAL_CLIENT_SAFE") return "client_safe";
  if (mode === "PROOF_REVIEWER" || mode === "REFERENCE_ONLY") return "reference_reviewer";
  if (mode === "INTERNAL_PREVIEW") return "internal_reviewer";
  return "internal";
}

function proofPostureForRoute(mode: UxOperatingMode, routeScope: RouteScopeLabel): UxProofPosture {
  const protectedPosture = routeScopeProofPostures[routeScope];
  if (protectedPosture) return protectedPosture;
  if (mode === "OPERATIONAL_CLIENT_SAFE") return "client_projection";
  if (mode === "INTERNAL_PREVIEW") return "internal_preview";
  if (mode === "PROOF_REVIEWER") return "partial_capture";
  return "product_runtime";
}

export function uxOperatingModelForRoute(route: ScreenRoute): UxOperatingModelRecord {
  const routeScope = routeScopeForPageId(route.pageId);
  const policy = uxRoutePolicyForRoute(route);
  const mode = operatingModeForRoute(route, routeScope, policy.workspace);

  return {
    allowedTreatment: allowedTreatmentForModel(policy.pageType, routeScope),
    audience: audienceForMode(mode),
    forbiddenTreatment: forbiddenTreatmentForModel(policy.pageType, routeScope),
    mode,
    noOverclaimRule: noOverclaimRuleForModel(policy.workspace, routeScope, route.clientVisibilitySensitive),
    pageId: route.pageId,
    pageType: policy.pageType,
    path: routeToSmokePath(route.route),
    productiveUxEligible: routeScope === "MVP" || routeScope === "MVP_SUPPORT",
    proofPosture: proofPostureForRoute(mode, routeScope),
    routeScope,
    title: route.title,
    visualMode: route.visualMode,
    workspace: policy.workspace,
  };
}

export const uxOperatingModelRecords = screenRoutes.map(uxOperatingModelForRoute);

export const uxOperatingModelIntegrity = {
  duplicatePageIds: uxOperatingModelRecords
    .map((record) => record.pageId)
    .filter((pageId, index, pageIds) => pageIds.indexOf(pageId) !== index),
  missingPageIds: screenRoutes
    .map((route) => route.pageId)
    .filter((pageId) => !uxOperatingModelRecords.some((record) => record.pageId === pageId)),
  productiveCount: uxOperatingModelRecords.filter((record) => record.productiveUxEligible).length,
  protectedCount: uxOperatingModelRecords.filter((record) => !record.productiveUxEligible).length,
  totalCount: uxOperatingModelRecords.length,
};
