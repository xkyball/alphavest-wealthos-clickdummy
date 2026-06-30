import type { ActorRole } from "@/lib/actor-session";
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

export type UxPageflow = {
  description: string;
  id: string;
  label: string;
  pageIds: readonly string[];
  supportLane?: boolean;
};

export const uxWorkspaceLabels: Record<UxWorkspaceKey, string> = {
  area_00_command_center: "Operations Setup",
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
  area_00_command_center: "Current work, readiness health, blockers and recoverable next actions.",
  area_01_foundation: "Setup, identity, tenant administration, governance and access controls.",
  area_02_client_context: "Client, family, entity and relationship context that can continue into evidence intake.",
  area_03_evidence_lifecycle: "Document intake, extraction, review and sufficiency before advisory work.",
  area_04_analyst_workbench: "Signals, trigger triage, internal draft work and advisor handoff.",
  area_05_advisor_review: "Advisor queue, recommendation review, evidence follow-up and compliance handoff.",
  area_06_compliance_release: "Compliance queue, decision room, block, evidence request, release and audit.",
  area_07_decision_record: "Decision record, rationale, evidence vault and client-safe history.",
  area_08_client_visibility: "Released-only client-safe projection with fail-closed visibility.",
  area_09_export_delivery: "Guarded export flow from scope through redaction, approval, package and audit.",
  area_10_operations: "Data-quality, SLA and monitoring support without approval, release or export powers.",
  area_11_protected_work: "Deferred, elevated, held and reference surfaces outside current delivery.",
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
  area_10_operations: ["059", "060", "068"],
  area_11_protected_work: ["052", "053", "061", "062", "063", "064", "065", "066", "067", "069", "070", "071"],
};

const workspaceByPageId = new Map<string, UxWorkspaceKey>(
  Object.entries(workspacePageIds).flatMap(([workspace, pageIds]) =>
    pageIds.map((pageId) => [pageId, workspace as UxWorkspaceKey])
  )
);

const detailPageIds = new Set(["035", "037", "039", "040", "041", "042", "044", "045", "047", "056", "057", "065", "066", "067", "069", "071"]);
const hubPageIds = new Set(["007", "015", "019", "020", "024", "031", "033", "034", "043", "046", "048", "052", "054", "064", "070"]);
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
  if (workspace === "area_00_command_center") return "One recovery or routing step; cards never claim completion.";
  if (workspace === "area_01_foundation") return "One foundation next step; admin actions never bypass release, evidence, audit or export checks.";
  if (workspace === "area_03_evidence_lifecycle") return "One evidence next step; upload never claims sufficiency.";
  if (workspace === "area_04_analyst_workbench") return "One analyst next step; internal drafts stay internal.";
  if (workspace === "area_05_advisor_review") return "One advisor review next step with compliance handoff.";
  if (workspace === "area_06_compliance_release") return "One compliance next step; release, block and evidence request stay controlled.";
  if (workspace === "area_08_client_visibility") return "One released-only client visibility step; fail closed when release or redaction is missing.";
  if (workspace === "area_09_export_delivery") return "One export lifecycle next step; preview, approval and delivery stay separate.";
  if (workspace === "area_10_operations") return "One recovery next step; ops cannot approve, release or export advice.";
  if (workspace === "area_11_protected_work") return "No productive current-release CTA; render deferred, reference or hold state only.";
  return "One primary next step with blocked reason and recovery where needed.";
}

function safetyReminderForWorkspace(workspace: UxWorkspaceKey) {
  if (workspace === "area_01_foundation") return "Visible access does not expand action or data authority.";
  if (workspace === "area_02_client_context") return "Client context is not evidence sufficiency or client-visible release.";
  if (workspace === "area_03_evidence_lifecycle") return "Upload is intake only; sufficiency requires reviewed, linked and current evidence.";
  if (workspace === "area_04_analyst_workbench") return "Internal drafts stay internal; no unapproved advice reaches the client.";
  if (workspace === "area_05_advisor_review") return "Advisor approval routes work to compliance review.";
  if (workspace === "area_06_compliance_release") return "Compliance release controls client visibility.";
  if (workspace === "area_08_client_visibility") return "Client visibility fails closed until release, redaction and content safety pass.";
  if (workspace === "area_09_export_delivery") return "Export preview is not approval, download or client acceptance.";
  if (workspace === "area_10_operations") return "Operations can escalate recovery work but cannot bypass advice or release checks.";
  if (workspace === "area_11_protected_work") return "Protected routes remain deferred, reference-only or held until explicitly unlocked.";
  return "Client visibility and audit release remain separate from visible navigation.";
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

export function isUxNavigationWorkspaceVisibleForRole(workspace: UxWorkspaceKey, role: ActorRole) {
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

export function uxNavigationLockedReason(workspace: UxWorkspaceKey, role: ActorRole) {
  if (workspace === "area_11_protected_work") return "Deferred, reference and held routes stay outside productive MVP navigation.";
  if (isUxNavigationWorkspaceVisibleForRole(workspace, role)) return undefined;

  return `${role.label} uses a client-safe navigation view. ${uxWorkspaceLabels[workspace]} remains governed by role, object and content permissions.`;
}

export const uxPageflows: readonly UxPageflow[] = [
  {
    description: "Build client context, then request or review evidence without jumping into admin work.",
    id: "client-context-evidence",
    label: "Client context to evidence",
    pageIds: ["019", "022", "023", "024", "028", "029"],
  },
  {
    description: "Move reviewed evidence into analyst trigger review and advisor-ready draft work.",
    id: "evidence-advisory",
    label: "Evidence to advisory",
    pageIds: ["028", "029", "030", "033", "034", "035"],
  },
  {
    description: "Resolve draft gaps, route the package to advisor review, then hand off to compliance.",
    id: "advisory-advisor-compliance",
    label: "Advisory to compliance",
    pageIds: ["033", "034", "035", "036", "037", "038", "039"],
  },
  {
    description: "Keep advisor approval separate from compliance release and client visibility.",
    id: "advisor-compliance-release",
    label: "Advisor review to release",
    pageIds: ["036", "037", "038", "039", "041", "040", "043"],
  },
  {
    description: "Publish only released, redacted and client-safe decision state.",
    id: "release-client-visibility",
    label: "Released client view",
    pageIds: ["039", "040", "043", "044", "045", "020"],
  },
  {
    description: "Prepare, protect, approve, package and audit export delivery.",
    id: "export-delivery",
    label: "Export delivery",
    pageIds: ["054", "055", "056", "057", "058"],
  },
  {
    description: "Configure guardrails and monitor data quality without interrupting the main client journey.",
    id: "governance-admin-ops",
    label: "Governance and operations",
    pageIds: ["007", "010", "009", "050", "016", "017", "059", "060"],
    supportLane: true,
  },
] as const;

const flowChains: readonly string[][] = uxPageflows.map((flow) => [...flow.pageIds]);

const flowLabels: Record<string, string> = {
  "007": "Platform",
  "009": "Roles",
  "010": "Security",
  "016": "Team",
  "017": "Policies",
  "019": "Context",
  "020": "Client",
  "022": "Family",
  "023": "Relations",
  "024": "Entities",
  "027": "Documents",
  "028": "Upload",
  "029": "Extract",
  "030": "Verify",
  "033": "Signals",
  "034": "Draft",
  "035": "Trigger",
  "036": "Advisor",
  "037": "Detail",
  "038": "Compliance",
  "039": "Review",
  "041": "Hold",
  "040": "Release",
  "043": "Decision",
  "044": "Rationale",
  "045": "Submitted",
  "046": "Evidence",
  "050": "Access",
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
  "065": "Wealth",
  "066": "Suitability",
  "067": "IPS",
  "068": "Reviews",
  "069": "Monitor",
  "070": "Committee",
  "071": "Decision",
};

const flowHrefs: Record<string, string> = {
  "007": "/admin/platform",
  "009": "/admin/roles",
  "010": "/admin/security",
  "016": "/tenants/morgan/team",
  "017": "/tenants/morgan/policies",
  "019": "/client/home",
  "020": "/mobile",
  "022": "/client/family-members",
  "023": "/relationships",
  "024": "/entities",
  "027": "/documents",
  "028": "/documents/upload",
  "029": "/documents/review-queue",
  "030": "/documents/morgan-tax-residency/review",
  "033": "/advisory",
  "034": "/advisory/review-queue",
  "035": "/advisory/triggers/liquidity-drift/review",
  "036": "/advisor/reviews",
  "037": "/advisor/reviews/current",
  "038": "/compliance/reviews",
  "039": "/compliance/reviews/current/decision-room",
  "040": "/compliance/reviews/current/release",
  "041": "/compliance/reviews/current/block",
  "043": "/decisions",
  "044": "/decisions/liquidity-governance",
  "045": "/decisions/liquidity-governance/success",
  "046": "/evidence",
  "050": "/governance/access-requests/external-advisor",
  "052": "/communication/client-follow-up/context",
  "053": "/communication/call-trigger",
  "054": "/export/new",
  "055": "/export/client-package/scope",
  "056": "/export/client-package/redaction",
  "057": "/export/client-package/approval",
  "058": "/export/client-package/download",
  "059": "/ops",
  "060": "/ops/sla/release-readiness",
  "064": "/kyc/reviews",
  "065": "/kyc/source-of-wealth",
  "066": "/suitability/profile",
  "067": "/ips/mandate-review/decision-room",
  "068": "/reviews",
  "069": "/reviews/rebalance-review",
  "070": "/committee/reviews",
  "071": "/committee/reviews/rebalance-review/decision-room",
};

const uxPageflowPreferredIds: Record<string, string> = {
  "038": "advisor-compliance-release",
  "039": "advisor-compliance-release",
  "040": "advisor-compliance-release",
  "041": "advisor-compliance-release",
  "043": "release-client-visibility",
  "044": "release-client-visibility",
  "045": "release-client-visibility",
};

export function uxPageflowForPageId(pageId: string) {
  const preferredId = uxPageflowPreferredIds[pageId];
  if (preferredId) {
    return uxPageflows.find((flow) => flow.id === preferredId);
  }

  return uxPageflows.find((flow) => flow.pageIds.includes(pageId));
}

export function uxFlowStepsForPageId(pageId: string): UxFlowStep[] {
  const pageflow = uxPageflowForPageId(pageId);
  const chain = pageflow ? [...pageflow.pageIds] : flowChains.find((candidate) => candidate.includes(pageId));
  if (!chain) return [];

  const currentIndex = chain.indexOf(pageId);

  return chain.map((stepPageId, index) => {
    const isPast = index < currentIndex;
    const isCurrent = index === currentIndex;
    const isNext = index === currentIndex + 1;

    return {
      disabledReason: isPast
        ? "Earlier step; completed position does not unlock this check."
        : !isCurrent && !isNext
          ? "Future check stays blocked until the current step and prerequisites are satisfied."
          : undefined,
      href: flowHrefs[stepPageId],
      label: flowLabels[stepPageId],
      pageId: stepPageId,
      status: isPast ? "complete" : isCurrent ? "current" : isNext ? "upcoming" : "blocked",
    };
  });
}
