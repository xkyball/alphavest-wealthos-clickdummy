import type { DemoRole } from "@/lib/demo-session";
import {
  routeScopeForPageId,
  type RouteScopeLabel,
  type ScreenRoute,
} from "@/lib/route-registry";

export type UxWorkspaceKey =
  | "area_00_command_center"
  | "area_01_foundation"
  | "area_02_client_context"
  | "area_03_evidence_lifecycle"
  | "area_04_analyst_workbench"
  | "area_05_advisor_review"
  | "area_06_compliance_release"
  | "area_07_decision_record"
  | "area_08_client_visibility"
  | "area_09_export_delivery"
  | "area_10_operations"
  | "area_11_protected_work";

export type UxDensityTier = "D1" | "D2" | "D3" | "D4";
export type UxPageType = "Hub" | "Workbench" | "Detail" | "Drawer" | "Modal" | "Reference" | "P1" | "Hold";

export type UxRoutePolicy = {
  densityTier: UxDensityTier;
  pageType: UxPageType;
  primaryCtaRule: string;
  routePolicyLabels: string[];
  safetyReminder: string;
  workspace: UxWorkspaceKey;
};

export type UxFlowStep = {
  disabledReason?: string;
  href: string;
  label: string;
  pageId: string;
  status: "complete" | "current" | "upcoming" | "blocked";
};

export const uxWorkspaceLabels: Record<UxWorkspaceKey, string> = {
  area_00_command_center: "Command Center",
  area_01_foundation: "Foundation",
  area_02_client_context: "Client Context",
  area_03_evidence_lifecycle: "Evidence Lifecycle",
  area_04_analyst_workbench: "Analyst Workbench",
  area_05_advisor_review: "Advisor Review",
  area_06_compliance_release: "Compliance Release",
  area_07_decision_record: "Decision Record",
  area_08_client_visibility: "Client Visibility",
  area_09_export_delivery: "Export & Delivery",
  area_10_operations: "Operations",
  area_11_protected_work: "Protected Work",
};

export const uxWorkspaceDescriptions: Record<UxWorkspaceKey, string> = {
  area_00_command_center: "Current work, process health, blocked gates and next legitimate actions.",
  area_01_foundation: "Setup, identity, tenant administration, governance and RBAC controls.",
  area_02_client_context: "Client and family context without claiming evidence sufficiency or release.",
  area_03_evidence_lifecycle: "Document intake, extraction, review and sufficiency preparation.",
  area_04_analyst_workbench: "Signals, trigger triage and internal draft work before advisor review.",
  area_05_advisor_review: "Human advisor review and approval candidate handling without client release.",
  area_06_compliance_release: "Compliance release, block, evidence request and audit exception gates.",
  area_07_decision_record: "Decision record and evidence vault surfaces after governed review.",
  area_08_client_visibility: "Released-only client visibility and fail-closed client-safe projection.",
  area_09_export_delivery: "Export scope, redaction, preview, approval, generation and delivery gates.",
  area_10_operations: "Operations and data-quality support without approval, release or export powers.",
  area_11_protected_work: "Deferred, elevated, held and reference surfaces outside completion proof.",
};

export const v096CoreWorkspaceKeys = [
  "area_03_evidence_lifecycle",
  "area_04_analyst_workbench",
  "area_05_advisor_review",
  "area_06_compliance_release",
  "area_07_decision_record",
  "area_08_client_visibility",
  "area_09_export_delivery",
] as const satisfies readonly UxWorkspaceKey[];

export const v096SupportWorkspaceKeys = [
  "area_00_command_center",
  "area_01_foundation",
  "area_02_client_context",
  "area_10_operations",
] as const satisfies readonly UxWorkspaceKey[];

export const v096DeferredWorkspaceKeys = [
  "area_11_protected_work",
] as const satisfies readonly UxWorkspaceKey[];

export function isV096CoreWorkspace(workspace: UxWorkspaceKey) {
  return v096CoreWorkspaceKeys.includes(workspace as (typeof v096CoreWorkspaceKeys)[number]);
}

const workspacePageIds: Record<UxWorkspaceKey, readonly string[]> = {
  area_00_command_center: [],
  area_01_foundation: ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012", "013", "014", "015", "016", "017", "018", "048", "049", "050", "051"],
  area_02_client_context: ["019", "021", "022", "023", "024", "025", "026", "031", "032"],
  area_03_evidence_lifecycle: ["027", "028", "029", "030", "046", "047"],
  area_04_analyst_workbench: ["033", "034", "035"],
  area_05_advisor_review: ["036", "037"],
  area_06_compliance_release: ["038", "039", "040", "041", "042"],
  area_07_decision_record: ["043", "044", "045"],
  area_08_client_visibility: ["020"],
  area_09_export_delivery: ["054", "055", "056", "057", "058"],
  area_10_operations: ["059", "060"],
  area_11_protected_work: ["052", "053", "061", "062", "063", "064", "065", "066", "067", "068", "069", "070", "071"],
};

const workspaceByPageId = new Map<string, UxWorkspaceKey>(
  Object.entries(workspacePageIds).flatMap(([workspace, pageIds]) =>
    pageIds.map((pageId) => [pageId, workspace as UxWorkspaceKey])
  )
);

const detailPageIds = new Set(["035", "037", "039", "040", "041", "042", "044", "045", "047", "056", "057", "065", "066", "067", "069", "071"]);
const hubPageIds = new Set(["007", "015", "019", "020", "024", "031", "033", "034", "043", "046", "048", "052", "054", "059", "064", "068", "070"]);
const modalPageIds = new Set(["002", "005", "009", "010", "040", "041", "045", "049", "057", "058"]);
const d1PageIds = new Set(["019", "020", "061", "062", "063"]);
const d2PageIds = new Set(["054", "058"]);
const d3PageIds = new Set(["042"]);
const d4PageIds = detailPageIds;
const d3Workspaces = new Set<UxWorkspaceKey>(["area_01_foundation", "area_09_export_delivery", "area_11_protected_work"]);

function workspaceForPageId(pageId: string) {
  const workspace = workspaceByPageId.get(pageId);
  if (!workspace) {
    throw new Error(`UX route policy missing workspace mapping for page ${pageId}.`);
  }

  return workspace;
}

function pageTypeForPageId(pageId: string, scope: RouteScopeLabel): UxPageType {
  if (scope === "REFERENCE_ONLY") return "Reference";
  if (scope === "P1_AFTER_MVP") return "P1";
  if (scope === "HOLD_PENDING_DECISION") return "Hold";
  if (modalPageIds.has(pageId)) return "Modal";
  if (detailPageIds.has(pageId)) return "Detail";
  if (hubPageIds.has(pageId)) return "Hub";

  return "Workbench";
}

function densityForPageId(pageId: string, workspace: UxWorkspaceKey): UxDensityTier {
  if (d1PageIds.has(pageId)) return "D1";
  if (d2PageIds.has(pageId)) return "D2";
  if (d3PageIds.has(pageId)) return "D3";
  if (d4PageIds.has(pageId)) return "D4";
  if (d3Workspaces.has(workspace)) return "D3";
  return "D2";
}

function routePolicyLabelsForScope(scope: RouteScopeLabel, route: Pick<ScreenRoute, "clientVisibilitySensitive">) {
  if (scope === "P1_AFTER_MVP") return ["UX_P1_DEFERRED", "NO_ROUTE_RECLASSIFICATION", "NO_SCREEN_GENERATION"];
  if (scope === "REFERENCE_ONLY") return ["UX_REFERENCE_ONLY_NO_PRODUCT_TASK", "NO_ROUTE_RECLASSIFICATION", "NO_SCREEN_GENERATION"];
  if (scope === "HOLD_PENDING_DECISION") return ["UX_HOLD_BLOCKED_NO_TASK", "NO_ROUTE_RECLASSIFICATION", "NO_SCREEN_GENERATION"];

  return [
    route.clientVisibilitySensitive ? "CLIENT_SAFE_ONLY" : "INTERNAL_ONLY",
    "UX_TASK_ELIGIBLE_WITH_SAFETY_TESTS",
    "RBAC_PAYLOAD_CRITICAL",
    "STATUS_CHIP_NOT_GATE_PROOF",
    "VISUAL_NOT_BEHAVIOUR_PROOF",
    "NO_ROUTE_RECLASSIFICATION",
    "NO_SCREEN_GENERATION",
  ];
}

function primaryCtaRuleForWorkspace(workspace: UxWorkspaceKey) {
  if (workspace === "area_00_command_center") return "One process recovery or routing step; cards never claim process completion.";
  if (workspace === "area_01_foundation") return "One foundation next step; admin actions never bypass release, evidence, audit or export gates.";
  if (workspace === "area_03_evidence_lifecycle") return "One evidence next step; upload never claims sufficiency.";
  if (workspace === "area_04_analyst_workbench") return "One analyst next step; internal drafts stay internal.";
  if (workspace === "area_05_advisor_review") return "One advisor review next step; advisor approval is not release.";
  if (workspace === "area_06_compliance_release") return "One compliance next step; release, block and evidence request stay gated.";
  if (workspace === "area_08_client_visibility") return "One released-only client visibility step; fail closed when release or redaction is missing.";
  if (workspace === "area_09_export_delivery") return "One export lifecycle next step; preview, approval and delivery stay separate.";
  if (workspace === "area_10_operations") return "One recovery next step; ops cannot approve, release or export advice.";
  if (workspace === "area_11_protected_work") return "No productive MVP CTA; render deferred, reference or hold state only.";
  return "One primary next step with blocked reason and recovery where needed.";
}

function safetyReminderForWorkspace(workspace: UxWorkspaceKey) {
  if (workspace === "area_01_foundation") return "Visible access does not expand action or payload authority.";
  if (workspace === "area_02_client_context") return "Client context is not evidence sufficiency or client-visible release.";
  if (workspace === "area_03_evidence_lifecycle") return "Upload is intake only; sufficiency requires reviewed, linked and current evidence.";
  if (workspace === "area_04_analyst_workbench") return "Internal drafts stay internal; no unapproved advice reaches the client.";
  if (workspace === "area_05_advisor_review") return "Advisor approval routes work to compliance; it is not client release.";
  if (workspace === "area_06_compliance_release") return "Compliance release controls client visibility.";
  if (workspace === "area_08_client_visibility") return "Client visibility fails closed until release, redaction and payload safety pass.";
  if (workspace === "area_09_export_delivery") return "Export preview is not approval, download or client acceptance.";
  if (workspace === "area_10_operations") return "Operations can escalate recovery work but cannot bypass advice or release gates.";
  if (workspace === "area_11_protected_work") return "Protected routes remain deferred, reference-only or held until explicitly unlocked.";
  return "Payload visibility and audit gates remain separate from visible navigation.";
}

export function uxRoutePolicyForPageId(pageId: string, route: Pick<ScreenRoute, "clientVisibilitySensitive"> = {}) {
  const scope = routeScopeForPageId(pageId);
  const workspace = workspaceForPageId(pageId);

  return {
    densityTier: densityForPageId(pageId, workspace),
    pageType: pageTypeForPageId(pageId, scope),
    primaryCtaRule: primaryCtaRuleForWorkspace(workspace),
    routePolicyLabels: routePolicyLabelsForScope(scope, route),
    safetyReminder: safetyReminderForWorkspace(workspace),
    workspace,
  } satisfies UxRoutePolicy;
}

export function uxRoutePolicyForRoute(route: Pick<ScreenRoute, "pageId" | "clientVisibilitySensitive">) {
  return uxRoutePolicyForPageId(route.pageId, route);
}

export function isUxNavigationWorkspaceVisibleForRole(workspace: UxWorkspaceKey, role: DemoRole) {
  if (workspace === "area_11_protected_work") return false;
  if (role.internal) return true;

  return (
    workspace === "area_00_command_center" ||
    workspace === "area_02_client_context" ||
    workspace === "area_03_evidence_lifecycle" ||
    workspace === "area_07_decision_record" ||
    workspace === "area_08_client_visibility"
  );
}

export function uxNavigationLockedReason(workspace: UxWorkspaceKey, role: DemoRole) {
  if (workspace === "area_11_protected_work") return "Deferred, reference and held routes stay outside productive MVP navigation.";
  if (isUxNavigationWorkspaceVisibleForRole(workspace, role)) return undefined;

  return `${role.label} uses a client-safe navigation view. ${uxWorkspaceLabels[workspace]} remains governed by role, object and payload permissions.`;
}

const flowChains: readonly string[][] = [
  ["027", "028", "029", "030", "046"],
  ["033", "034", "036", "038", "039", "040", "043"],
  ["064", "067", "070", "071", "038"],
  ["068", "069", "034", "038"],
  ["052", "053", "034", "038"],
  ["054", "055", "056", "057", "058"],
  ["059", "060", "041", "038"],
] as const;

const flowLabels: Record<string, string> = {
  "027": "Documents",
  "028": "Upload",
  "029": "Extract",
  "030": "Verify",
  "033": "Signals",
  "034": "Draft",
  "036": "Advisor",
  "038": "Compliance",
  "039": "Review",
  "040": "Release",
  "043": "Decision",
  "046": "Evidence",
  "052": "Context",
  "053": "Trigger",
  "054": "Export",
  "055": "Content",
  "056": "Protect",
  "057": "Preview",
  "058": "Deliver",
  "059": "Ops",
  "060": "SLA",
  "064": "KYC",
  "067": "IPS",
  "068": "Reviews",
  "069": "Monitor",
  "070": "Committee",
  "071": "Decision",
};

const flowHrefs: Record<string, string> = {
  "027": "/documents",
  "028": "/documents/upload",
  "029": "/documents/review-queue",
  "030": "/documents/:id/review",
  "033": "/advisory",
  "034": "/advisory/review-queue",
  "036": "/advisor/reviews",
  "038": "/compliance/reviews",
  "039": "/compliance/reviews/:id/decision-room",
  "040": "/compliance/reviews/:id/release",
  "043": "/decisions",
  "046": "/evidence",
  "052": "/communication/demo/context",
  "053": "/communication/call-trigger",
  "054": "/export/new",
  "055": "/export/demo/scope",
  "056": "/export/demo/redaction",
  "057": "/export/demo/preview",
  "058": "/export/demo/download",
  "059": "/ops",
  "060": "/ops/sla/demo",
  "064": "/kyc/reviews",
  "067": "/ips/demo/decision-room",
  "068": "/reviews",
  "069": "/reviews/demo",
  "070": "/committee/reviews",
  "071": "/committee/reviews/demo/decision-room",
};

export function uxFlowStepsForPageId(pageId: string): UxFlowStep[] {
  const chain = flowChains.find((candidate) => candidate.includes(pageId));
  if (!chain) return [];

  const currentIndex = chain.indexOf(pageId);

  return chain.map((stepPageId, index) => {
    const isPast = index < currentIndex;
    const isCurrent = index === currentIndex;
    const isNext = index === currentIndex + 1;

    return {
      disabledReason: isPast
        ? "Earlier step; completed position does not unlock this gate."
        : !isCurrent && !isNext
          ? "Future gate stays blocked until the current step and prerequisites are satisfied."
          : undefined,
      href: flowHrefs[stepPageId],
      label: flowLabels[stepPageId],
      pageId: stepPageId,
      status: isPast ? "complete" : isCurrent ? "current" : isNext ? "upcoming" : "blocked",
    };
  });
}
