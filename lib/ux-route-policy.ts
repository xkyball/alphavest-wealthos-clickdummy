import type { DemoRole } from "@/lib/demo-session";
import {
  routeScopeForPageId,
  type RouteScopeLabel,
  type ScreenRoute,
} from "@/lib/route-registry";

export type UxWorkspaceKey =
  | "setup"
  | "client_workspace"
  | "evidence"
  | "advisory_workbench"
  | "compliance"
  | "decisions"
  | "governance"
  | "export"
  | "elevated_workflows"
  | "communication"
  | "ops"
  | "registered_only";

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
  advisory_workbench: "Advisory Workbench",
  client_workspace: "Client Workspace",
  communication: "Communication",
  compliance: "Compliance",
  decisions: "Decisions",
  evidence: "Evidence",
  elevated_workflows: "Elevated Reviews",
  export: "Export",
  governance: "Governance",
  ops: "Operations",
  registered_only: "Registered Only",
  setup: "Setup",
};

export const uxWorkspaceDescriptions: Record<UxWorkspaceKey, string> = {
  advisory_workbench: "Signals, internal drafts and analyst review without client-visible advice.",
  client_workspace: "Client-safe context, portal and family workspace surfaces.",
  communication: "Communication and call-trigger context without advice or release authority.",
  compliance: "Compliance review, release, block, evidence request and audit gates.",
  decisions: "Released decision records, decision room and client-safe evidence context.",
  evidence: "Document intake, extraction review, verification and evidence vault.",
  elevated_workflows: "KYC, suitability, committee and review monitoring as internal safety workstreams.",
  export: "Scope, redaction, preview, approval and delivery as separate steps.",
  governance: "Users, roles, access requests and audit history without admin bypass.",
  ops: "Operations and SLA context for support, recovery and escalation.",
  registered_only: "Deferred, reference and held routes kept out of productive MVP navigation.",
  setup: "Access, onboarding, tenant setup and platform configuration.",
};

const workspacePageIds: Record<UxWorkspaceKey, readonly string[]> = {
  advisory_workbench: ["033", "034", "035", "036", "037"],
  client_workspace: ["019", "020", "021", "022", "023", "024", "025", "026", "031", "032"],
  communication: ["052", "053"],
  compliance: ["038", "039", "040", "041", "042"],
  decisions: ["043", "044", "045"],
  evidence: ["027", "028", "029", "030", "046", "047"],
  elevated_workflows: ["064", "065", "066", "067", "068", "069", "070", "071"],
  export: ["054", "055", "056", "057", "058"],
  governance: ["008", "048", "049", "050", "051"],
  ops: ["059", "060"],
  registered_only: ["061", "062", "063"],
  setup: ["001", "002", "003", "004", "005", "006", "007", "009", "010", "011", "012", "013", "014", "015", "016", "017", "018"],
};

const workspaceByPageId = new Map<string, UxWorkspaceKey>(
  Object.entries(workspacePageIds).flatMap(([workspace, pageIds]) =>
    pageIds.map((pageId) => [pageId, workspace as UxWorkspaceKey])
  )
);

const detailPageIds = new Set(["035", "037", "039", "040", "041", "042", "044", "045", "047", "057", "058", "065", "066", "067", "069", "071"]);
const hubPageIds = new Set(["007", "013", "015", "019", "020", "024", "031", "033", "034", "043", "046", "048", "052", "054", "059", "064", "068", "070"]);
const modalPageIds = new Set(["002", "005", "009", "010", "040", "041", "045", "049", "057", "058"]);
const d1PageIds = new Set(["019", "020", "061", "062", "063"]);
const d2PageIds = new Set(["054"]);
const d3PageIds = new Set(["042"]);
const d4PageIds = detailPageIds;
const d3Workspaces = new Set<UxWorkspaceKey>(["elevated_workflows", "governance", "export"]);

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
  if (workspace === "evidence") return "One evidence next step; upload never claims sufficiency.";
  if (workspace === "compliance") return "One compliance next step; release, block and evidence request stay gated.";
  if (workspace === "communication") return "One communication context step; no advice, release or delivery shortcut.";
  if (workspace === "elevated_workflows") return "One internal review next step; no client-facing advice or automatic release.";
  if (workspace === "export") return "One export lifecycle next step; preview, approval and delivery stay separate.";
  if (workspace === "governance") return "One governance next step; admin actions never bypass release, evidence, audit or export gates.";
  if (workspace === "ops") return "One recovery next step; ops cannot approve, release or export advice.";
  if (workspace === "registered_only") return "No productive MVP CTA; render deferred, reference or hold state only.";
  return "One primary next step with blocked reason and recovery where needed.";
}

function safetyReminderForWorkspace(workspace: UxWorkspaceKey) {
  if (workspace === "client_workspace") return "Client-facing content must be released, redacted and client-safe.";
  if (workspace === "advisory_workbench") return "Internal drafts stay internal; no unapproved advice reaches the client.";
  if (workspace === "communication") return "Communication is context only; client-facing copy remains release-controlled.";
  if (workspace === "evidence") return "Upload is intake only; sufficiency requires reviewed, linked and current evidence.";
  if (workspace === "elevated_workflows") return "Elevated reviews remain internal and safety-gated.";
  if (workspace === "compliance") return "Compliance release controls client visibility.";
  if (workspace === "export") return "Export preview is not approval, download or client acceptance.";
  if (workspace === "governance") return "Visible access does not expand action or payload authority.";
  if (workspace === "ops") return "Operations can escalate recovery work but cannot bypass advice or release gates.";
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
  if (workspace === "registered_only") return false;
  if (role.internal) return true;

  return workspace === "client_workspace" || workspace === "communication" || workspace === "decisions" || workspace === "evidence";
}

export function uxNavigationLockedReason(workspace: UxWorkspaceKey, role: DemoRole) {
  if (workspace === "registered_only") return "Deferred, reference and held routes stay outside productive MVP navigation.";
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
  "055": "Scope",
  "056": "Redact",
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
