import {
  matchRouteBySegments,
  navigationGroupLabels,
  routeScopeForPageId,
  routeToSmokePath,
  screenRoutes,
  type RouteScopeLabel,
  type ScreenRoute,
} from "@/lib/route-registry";
import { uxFlowStepsForPageId, uxRoutePolicyForRoute, type UxFlowStep, type UxWorkspaceKey } from "@/lib/ux-route-policy";
import type { UxDensityTier } from "@/lib/ux-route-policy";

export type OperationalRouteGuidanceLink = {
  href: string;
  label: string;
};

export type OperationalRouteGuidance = {
  area: string;
  ctaState: OperationalRouteGuidanceCtaState;
  densityTier?: UxDensityTier;
  nextStep?: OperationalRouteGuidanceLink;
  primaryAction?: OperationalRouteGuidanceLink;
  purpose: string;
  relatedRoutes: OperationalRouteGuidanceLink[];
  safetyHint: string;
  shortTitle: string;
  steps: UxFlowStep[];
  workbenchStructure?: OperationalRouteGuidanceWorkbenchStructure;
};

export type OperationalRouteGuidanceCtaState = {
  blockedReason?: string;
  primaryAction?: OperationalRouteGuidanceLink;
  recovery?: OperationalRouteGuidanceLink;
  state: "ready" | "guarded" | "locked";
};

export type OperationalRouteGuidanceWorkbenchStructure = {
  actionRail: string;
  context: string;
  queue: string;
  safety: string;
};

type GuidanceOverride = Partial<
  Pick<OperationalRouteGuidance, "area" | "nextStep" | "primaryAction" | "purpose" | "relatedRoutes" | "safetyHint" | "shortTitle">
>;

const routeByPageId = new Map<string, ScreenRoute>(screenRoutes.map((route) => [route.pageId, route]));

function linkForPageId(pageId: string, label: string): OperationalRouteGuidanceLink {
  const route = routeByPageId.get(pageId);

  if (!route) {
    throw new Error(`Guidance route ${pageId} is missing from the route registry.`);
  }

  return {
    href: routeToSmokePath(route.route),
    label,
  };
}

const guidanceOverrides: Record<string, GuidanceOverride> = {
  "007": {
    area: "Platform controls",
    safetyHint: "Platform setup does not bypass evidence, release, audit or export checks.",
    primaryAction: linkForPageId("008", "Open advice boundary"),
    relatedRoutes: [linkForPageId("010", "Review security"), linkForPageId("013", "Open tenant directory")],
  },
  "008": {
    area: "Platform controls",
    safetyHint: "Advice boundaries constrain operating behaviour; they do not create client-visible advice.",
    primaryAction: linkForPageId("048", "Review governance users"),
    relatedRoutes: [linkForPageId("049", "Manage roles"), linkForPageId("010", "Review security")],
  },
  "009": {
    area: "Platform controls",
    safetyHint: "Role administration is limited configuration only; it cannot release advice, approve exports or suppress audit.",
    primaryAction: linkForPageId("048", "Review governance users"),
    relatedRoutes: [linkForPageId("049", "Review role changes"), linkForPageId("050", "Review access requests")],
  },
  "013": {
    area: "Tenant setup",
    safetyHint: "Tenant setup prepares context only; it does not expand permissions or client visibility.",
    nextStep: linkForPageId("014", "Create tenant"),
    primaryAction: linkForPageId("014", "Create tenant"),
    relatedRoutes: [linkForPageId("015", "Open setup dashboard"), linkForPageId("018", "Review tenant users")],
  },
  "014": {
    area: "Tenant setup",
    safetyHint: "Creating a tenant does not activate downstream evidence, advice or release checks.",
    nextStep: linkForPageId("015", "Open setup dashboard"),
    primaryAction: linkForPageId("015", "Open setup dashboard"),
    relatedRoutes: [linkForPageId("018", "Review tenant users"), linkForPageId("027", "Open document queue")],
  },
  "015": {
    area: "Tenant setup",
    safetyHint: "Setup status or checklist completion does not grant content or release authority.",
    nextStep: linkForPageId("018", "Review tenant users"),
    primaryAction: linkForPageId("018", "Review tenant users"),
    relatedRoutes: [linkForPageId("027", "Open document queue"), linkForPageId("013", "Back to tenants")],
  },
  "018": {
    area: "Tenant setup",
    safetyHint: "User access supports the work; role assignment is not evidence sufficiency or release.",
    nextStep: linkForPageId("027", "Open document queue"),
    primaryAction: linkForPageId("027", "Open document queue"),
    relatedRoutes: [linkForPageId("028", "Upload source for review"), linkForPageId("048", "Review governance users")],
  },
  "019": {
    area: "Client workspace",
    safetyHint: "Client-facing view: only released, client-safe content should be visible here.",
    nextStep: linkForPageId("027", "Open document library"),
    primaryAction: linkForPageId("028", "Upload source for review"),
    purpose: "Orient the client workspace and surface only controlled, client-safe work after release checks pass.",
    relatedRoutes: [linkForPageId("021", "Review client profile"), linkForPageId("046", "Open evidence vault")],
    shortTitle: "Client portal",
  },
  "021": {
    area: "Client workspace",
    safetyHint: "Client facts support advisory work; they do not release advice by themselves.",
    primaryAction: linkForPageId("024", "Open entities"),
    relatedRoutes: [linkForPageId("027", "Open documents"), linkForPageId("031", "Review wealth map")],
  },
  "027": {
    area: "Evidence intake",
    safetyHint: "Documents feed review. A document row is not reviewed evidence until human checks are complete.",
    nextStep: linkForPageId("028", "Upload source for review"),
    primaryAction: linkForPageId("028", "Upload source for review"),
    relatedRoutes: [linkForPageId("030", "Open verification queue"), linkForPageId("046", "Open evidence vault")],
  },
  "028": {
    area: "Evidence intake",
    safetyHint: "Upload is not evidence sufficiency. Human review, fit, currentness and linkage still have to pass.",
    nextStep: linkForPageId("029", "Review extraction"),
    primaryAction: linkForPageId("029", "Review extraction"),
    purpose: "Collect source documents and keep them locked behind evidence review before release or export checks can use them.",
    relatedRoutes: [linkForPageId("030", "Open verification queue"), linkForPageId("046", "Open evidence vault")],
    shortTitle: "Document upload",
  },
  "029": {
    area: "Evidence intake",
    safetyHint: "Extraction review can link evidence; sufficiency still depends on reviewed, current evidence.",
    nextStep: linkForPageId("030", "Open verification queue"),
    primaryAction: linkForPageId("030", "Open verification queue"),
    relatedRoutes: [linkForPageId("028", "Back to upload"), linkForPageId("038", "Open compliance queue")],
  },
  "030": {
    area: "Evidence intake",
    safetyHint: "Verification prepares reviewed evidence; sufficiency still depends on fit, currentness and linkage.",
    nextStep: linkForPageId("033", "Open signal queue"),
    primaryAction: linkForPageId("033", "Open signal queue"),
    relatedRoutes: [linkForPageId("046", "Open evidence vault"), linkForPageId("034", "Open workbench")],
  },
  "033": {
    area: "Advisory work",
    safetyHint: "Signals are internal inputs. They do not create client-visible advice.",
    nextStep: linkForPageId("034", "Continue in workbench"),
    primaryAction: linkForPageId("034", "Continue in workbench"),
    relatedRoutes: [linkForPageId("036", "Open advisor approval"), linkForPageId("038", "Open compliance queue")],
  },
  "034": {
    area: "Advisory work",
    safetyHint: "Internal draft only. Advisor approval and compliance release are separate downstream checks.",
    nextStep: linkForPageId("036", "Send to advisor review"),
    primaryAction: linkForPageId("036", "Send to advisor review"),
    purpose: "Prepare the recommendation internally, resolve evidence gaps and move only controlled work toward human approval.",
    relatedRoutes: [linkForPageId("028", "Request evidence"), linkForPageId("038", "Open compliance queue")],
    shortTitle: "Workbench",
  },
  "036": {
    area: "Advisory work",
    safetyHint: "Advisor approval is required, but advisor approval is not compliance release.",
    nextStep: linkForPageId("038", "Open compliance queue"),
    primaryAction: linkForPageId("037", "Review advisor item"),
    relatedRoutes: [linkForPageId("034", "Back to workbench"), linkForPageId("039", "Open compliance review")],
  },
  "035": {
    area: "Advisory work",
    safetyHint: "Trigger detail can prepare a recommendation; draft work remains internal.",
    nextStep: linkForPageId("036", "Send to advisor queue"),
    primaryAction: linkForPageId("036", "Send to advisor queue"),
    relatedRoutes: [linkForPageId("034", "Back to workbench"), linkForPageId("028", "Request evidence")],
  },
  "037": {
    area: "Advisory work",
    safetyHint: "Advisor approval records human review only; compliance release remains required.",
    nextStep: linkForPageId("038", "Open compliance queue"),
    primaryAction: linkForPageId("038", "Open compliance queue"),
    relatedRoutes: [linkForPageId("039", "Open compliance review"), linkForPageId("034", "Back to workbench")],
  },
  "038": {
    area: "Compliance and release",
    safetyHint: "Compliance release controls client visibility. Missing evidence or audit blocks release.",
    nextStep: linkForPageId("039", "Open compliance review"),
    primaryAction: linkForPageId("039", "Open compliance review"),
    purpose: "Triage work that can be reviewed, blocked, released or sent back for evidence without exposing unapproved advice.",
    relatedRoutes: [linkForPageId("040", "Open release controls"), linkForPageId("041", "Open block action")],
    shortTitle: "Compliance queue",
  },
  "039": {
    area: "Compliance and release",
    safetyHint: "Compliance can release, block or request evidence only after preconditions are checked.",
    nextStep: linkForPageId("040", "Open release controls"),
    primaryAction: linkForPageId("040", "Open release controls"),
    relatedRoutes: [linkForPageId("041", "Block or request evidence"), linkForPageId("042", "Review audit context")],
  },
  "040": {
    area: "Compliance and release",
    safetyHint: "Release requires explicit confirmation and audit persistence; client acceptance remains separate.",
    nextStep: linkForPageId("043", "Open decision list"),
    primaryAction: linkForPageId("043", "Open decision list"),
    relatedRoutes: [linkForPageId("042", "Review audit context"), linkForPageId("041", "Block or request evidence")],
  },
  "041": {
    area: "Compliance and release",
    safetyHint: "Blocking or requesting evidence keeps client visibility closed until recovery checks pass.",
    nextStep: linkForPageId("028", "Request source upload"),
    primaryAction: linkForPageId("028", "Request source upload"),
    relatedRoutes: [linkForPageId("038", "Back to compliance queue"), linkForPageId("042", "Review audit context")],
  },
  "042": {
    area: "Compliance and release",
    safetyHint: "Audit context supports traceability; audit visibility alone is not release authority.",
    nextStep: linkForPageId("043", "Open decision list"),
    primaryAction: linkForPageId("043", "Open decision list"),
    relatedRoutes: [linkForPageId("039", "Open compliance review"), linkForPageId("051", "Open access audit")],
  },
  "043": {
    area: "Decisions and evidence",
    safetyHint: "Decision records support traceability; they are not client acceptance by themselves.",
    nextStep: linkForPageId("044", "Open decision room"),
    primaryAction: linkForPageId("044", "Open decision room"),
    relatedRoutes: [linkForPageId("046", "Open evidence vault"), linkForPageId("051", "Open audit history")],
  },
  "044": {
    area: "Decisions and evidence",
    safetyHint: "Decision-room action records client decision state; it does not change advice or release checks.",
    nextStep: linkForPageId("045", "Open submitted state"),
    primaryAction: linkForPageId("045", "Open submitted state"),
    relatedRoutes: [linkForPageId("046", "Open evidence vault"), linkForPageId("019", "Open client portal")],
  },
  "045": {
    area: "Decisions and evidence",
    safetyHint: "Submission confirms the recorded decision only; compliance release and client-safe projection remain separate.",
    nextStep: linkForPageId("019", "Open client portal"),
    primaryAction: linkForPageId("019", "Open client portal"),
    relatedRoutes: [linkForPageId("020", "Open mobile home"), linkForPageId("046", "Open evidence vault")],
  },
  "046": {
    area: "Decisions and evidence",
    safetyHint: "Evidence supports traceability. Sufficiency requires reviewed and current evidence.",
    nextStep: linkForPageId("038", "Open compliance queue"),
    primaryAction: linkForPageId("028", "Upload source for review"),
    relatedRoutes: [linkForPageId("029", "Review extraction"), linkForPageId("051", "Open audit history")],
  },
  "048": {
    area: "Governance",
    safetyHint: "Governance controls access, but admin authority does not bypass release, evidence or export checks.",
    nextStep: linkForPageId("049", "Review roles"),
    primaryAction: linkForPageId("049", "Review roles"),
    relatedRoutes: [linkForPageId("050", "Review access requests"), linkForPageId("051", "Open audit history")],
  },
  "049": {
    area: "Governance",
    safetyHint: "Role edits require confirmation and audit; they cannot force release, sufficiency, export approval or visibility.",
    nextStep: linkForPageId("050", "Review access requests"),
    primaryAction: linkForPageId("050", "Review access requests"),
    relatedRoutes: [linkForPageId("048", "Review governance users"), linkForPageId("051", "Open audit history")],
  },
  "050": {
    area: "Governance",
    safetyHint: "Access approval is role-limited only; policy, SOD and audit checks still control the action.",
    nextStep: linkForPageId("051", "Open audit history"),
    primaryAction: linkForPageId("051", "Open audit history"),
    relatedRoutes: [linkForPageId("049", "Review roles"), linkForPageId("008", "Open advice boundary")],
  },
  "051": {
    area: "Governance",
    safetyHint: "Audit visibility supports review only; persistence, retention and export controls remain separate.",
    nextStep: linkForPageId("048", "Review governance users"),
    primaryAction: linkForPageId("048", "Review governance users"),
    relatedRoutes: [linkForPageId("050", "Review access requests"), linkForPageId("042", "Review compliance audit")],
  },
  "054": {
    area: "Export",
    safetyHint: "Export starts with content selection; protection review, preview, approval, download and share remain separate.",
    nextStep: linkForPageId("055", "Select export content"),
    primaryAction: linkForPageId("055", "Select export content"),
    purpose: "Select export content before protection review, preview, approval and delivery can proceed.",
    relatedRoutes: [linkForPageId("056", "Review protection"), linkForPageId("057", "Inspect preview")],
    shortTitle: "New export",
  },
  "055": {
    area: "Export",
    safetyHint: "Content selection is not preview or approval. Only permitted content can move to protection review.",
    nextStep: linkForPageId("056", "Review protection"),
    primaryAction: linkForPageId("056", "Review protection"),
    relatedRoutes: [linkForPageId("057", "Inspect preview"), linkForPageId("058", "Open delivery controls")],
  },
  "056": {
    area: "Export",
    safetyHint: "Protection review is not preview approval, download or share.",
    nextStep: linkForPageId("057", "Inspect preview"),
    primaryAction: linkForPageId("057", "Inspect preview"),
    relatedRoutes: [linkForPageId("055", "Review content"), linkForPageId("058", "Open delivery controls")],
  },
  "057": {
    area: "Export",
    safetyHint: "Preview is not approval. Generation, download, share and client acceptance remain separate.",
    nextStep: linkForPageId("058", "Open delivery controls after approval"),
    primaryAction: linkForPageId("058", "Open delivery controls after approval"),
    relatedRoutes: [linkForPageId("055", "Review content"), linkForPageId("056", "Review protection")],
  },
  "058": {
    area: "Export",
    safetyHint: "Approved delivery still separates download from share and client acceptance.",
    nextStep: linkForPageId("057", "Review approval context"),
    primaryAction: linkForPageId("057", "Review approval context"),
    relatedRoutes: [linkForPageId("055", "Review content"), linkForPageId("056", "Review protection")],
  },
  "052": {
    area: "Communication context",
    safetyHint: "Communication adds context only. Advice-like copy and client delivery remain release-controlled.",
    nextStep: linkForPageId("053", "Open call trigger matrix"),
    primaryAction: linkForPageId("053", "Open call trigger matrix"),
    relatedRoutes: [linkForPageId("034", "Open advisory workbench"), linkForPageId("038", "Open compliance queue")],
    shortTitle: "Communication context",
  },
  "053": {
    area: "Communication context",
    safetyHint: "Call triggers can route work, but they cannot send advice or bypass compliance release.",
    nextStep: linkForPageId("052", "Review communication context"),
    primaryAction: linkForPageId("052", "Review communication context"),
    relatedRoutes: [linkForPageId("033", "Open signal review"), linkForPageId("059", "Open ops queue")],
  },
  "059": {
    area: "Operations support",
    safetyHint: "Ops queues support recovery and escalation. They cannot approve advice, release content or export packages.",
    nextStep: linkForPageId("060", "Open SLA escalation"),
    primaryAction: linkForPageId("060", "Open SLA escalation"),
    relatedRoutes: [linkForPageId("038", "Open compliance queue"), linkForPageId("068", "Open review calendar")],
    shortTitle: "Ops queues",
  },
  "060": {
    area: "Operations support",
    safetyHint: "SLA escalation routes work to owners only; advisory, compliance and export checks stay separate.",
    nextStep: linkForPageId("059", "Back to ops queues"),
    primaryAction: linkForPageId("059", "Back to ops queues"),
    relatedRoutes: [linkForPageId("041", "Open blocked action"), linkForPageId("051", "Review audit history")],
  },
  "064": {
    area: "Elevated reviews",
    safetyHint: "KYC review remains held until a route-specific service, workflow and audit contract is approved.",
    shortTitle: "KYC hold",
  },
  "067": {
    area: "Elevated reviews",
    safetyHint: "IPS decision context remains held until suitability, workflow and audit backing is approved.",
    shortTitle: "IPS hold",
  },
  "068": {
    area: "Review monitoring",
    safetyHint: "Review cadence and rebalance monitoring are operational signals only; they do not create automatic advice.",
    nextStep: linkForPageId("059", "Open ops queue"),
    primaryAction: linkForPageId("059", "Open ops queue"),
    relatedRoutes: [linkForPageId("033", "Open signal review"), linkForPageId("038", "Open compliance queue")],
  },
  "069": {
    area: "Review monitoring",
    safetyHint: "Rebalance detail remains held until service-backed detail commands and audit proof are approved.",
    shortTitle: "Rebalance hold",
  },
  "061": {
    area: "Reference-only workspace",
    safetyHint: "Read-only context. No product action is available.",
  },
  "070": {
    area: "Committee review",
    safetyHint: "Committee review remains held until committee workflow commands, dissent handling and audit proof are approved.",
    shortTitle: "Committee hold",
  },
  "071": {
    area: "Committee review",
    safetyHint: "Committee decision room remains held until decision workflow and audit persistence are approved.",
    shortTitle: "Committee decision hold",
  },
};

const tierSafetyHints: Record<RouteScopeLabel, string> = {
  MVP: "Current work can continue only when role, object, evidence and release checks allow it.",
  MVP_SUPPORT: "Setup and context can continue; downstream actions still require their own checks.",
  P1_AFTER_MVP: "Not active in this release. No release action is available.",
  REFERENCE_ONLY: "Read-only context. No product action is available.",
  HOLD_PENDING_DECISION: "Blocked until access and safety are explicitly unlocked.",
};

const uxPage002WorkbenchRouteIds = new Set([
  "027",
  "028",
  "029",
  "030",
  "033",
  "036",
  "038",
  "046",
  "048",
  "049",
  "050",
  "051",
  "054",
  "055",
  "056",
]);

function areaForRoute(route: ScreenRoute) {
  const groupLabel = navigationGroupLabels[route.navigationGroup];

  if (route.navigationGroup === "client_workspace") return "Client workspace";
  if (route.navigationGroup === "advisory_workflow") return "Advisory work";
  if (route.navigationGroup === "decisions_evidence") return "Decisions and evidence";
  if (route.navigationGroup === "export") return "Export";
  if (route.navigationGroup === "platform") return "Platform controls";

  return groupLabel;
}

function routeFromPathname(pathname: string) {
  const cleanPath = pathname.split("?")[0]?.split("#")[0] ?? "/";
  const normalized = cleanPath.length > 1 ? cleanPath.replace(/\/+$/, "") : cleanPath;

  if (normalized === "/") {
    return null;
  }

  return matchRouteBySegments(normalized.split("/").filter(Boolean)) ?? null;
}

function workbenchStructureForRoute(route: ScreenRoute, guidance: Pick<OperationalRouteGuidance, "area" | "primaryAction" | "safetyHint" | "shortTitle">) {
  if (!uxPage002WorkbenchRouteIds.has(route.pageId)) return undefined;

  return {
    actionRail: guidance.primaryAction
      ? `Next allowed action: ${guidance.primaryAction.label}.`
      : "No productive action is exposed until route and role prerequisites are clear.",
    context: `${guidance.shortTitle} selected in ${guidance.area}.`,
    queue: `${guidance.shortTitle} open items and blocked states.`,
    safety: `${guidance.safetyHint} Controls stay blocked until the required check passes.`,
  } satisfies OperationalRouteGuidanceWorkbenchStructure;
}

function fallbackPrimaryActionForRoute(route: ScreenRoute, tier: RouteScopeLabel, steps: UxFlowStep[]): OperationalRouteGuidanceLink | undefined {
  if (tier !== "MVP" && tier !== "MVP_SUPPORT") return undefined;

  const routeHref = routeToSmokePath(route.route);
  const nextOpenStep = steps.find((step) => step.status === "upcoming" && !step.disabledReason);

  if (nextOpenStep) {
    return {
      href: nextOpenStep.href,
      label: `Continue to ${nextOpenStep.label}`,
    };
  }

  return {
    href: routeHref,
    label: `Open ${route.title}`,
  };
}

function ctaBlockedReasonForWorkspace(workspace: UxWorkspaceKey) {
  if (workspace === "area_00_command_center") return "Operations setup cards can route work but cannot complete downstream checks.";
  if (workspace === "area_01_foundation") return "Foundation changes do not bypass evidence, release, audit or export checks.";
  if (workspace === "area_02_client_context") return "Client context does not make content released or evidence sufficient.";
  if (workspace === "area_03_evidence_lifecycle") return "Upload and review do not complete evidence readiness.";
  if (workspace === "area_04_analyst_workbench") return "Draft work stays internal until advisor review and compliance release pass.";
  if (workspace === "area_05_advisor_review") return "Advisor approval can route to compliance but cannot release client-visible content.";
  if (workspace === "area_06_compliance_release") return "Client visibility stays blocked until compliance release passes.";
  if (workspace === "area_07_decision_record") return "Decision records require released, evidence-backed context before client use.";
  if (workspace === "area_08_client_visibility") return "Only released, redacted and client-safe content may be visible here.";
  if (workspace === "area_09_export_delivery") return "Preview, approval, download and share stay separate.";
  if (workspace === "area_10_operations") return "Ops escalation cannot approve, release or export client-visible work.";
  if (workspace === "area_11_protected_work") return "Protected work remains deferred, reference-only or held until explicitly unlocked.";

  return "No productive action is available in the current release.";
}

function recoveryActionForCta(
  primaryAction: OperationalRouteGuidanceLink | undefined,
  nextStep: OperationalRouteGuidanceLink | undefined,
  relatedRoutes: OperationalRouteGuidanceLink[],
) {
  if (nextStep && nextStep.href !== primaryAction?.href) return nextStep;
  return relatedRoutes.find((route) => route.href !== primaryAction?.href);
}

function ctaStateForRoute(
  tier: RouteScopeLabel,
  workspace: UxWorkspaceKey,
  primaryAction: OperationalRouteGuidanceLink | undefined,
  nextStep: OperationalRouteGuidanceLink | undefined,
  relatedRoutes: OperationalRouteGuidanceLink[],
): OperationalRouteGuidanceCtaState {
  if (tier !== "MVP" && tier !== "MVP_SUPPORT") {
    return {
      blockedReason: ctaBlockedReasonForWorkspace(workspace),
      state: "locked",
    };
  }

  return {
    blockedReason: ctaBlockedReasonForWorkspace(workspace),
    primaryAction,
    recovery: recoveryActionForCta(primaryAction, nextStep, relatedRoutes),
    state: primaryAction ? "guarded" : "locked",
  };
}

export function operationalRouteGuidanceForRoute(route: ScreenRoute): OperationalRouteGuidance {
  const tier = routeScopeForPageId(route.pageId);
  const policy = uxRoutePolicyForRoute(route);
  const override = guidanceOverrides[route.pageId] ?? {};
  const steps = uxFlowStepsForPageId(route.pageId);
  const productiveTier = tier === "MVP" || tier === "MVP_SUPPORT";
  const baseGuidance = {
    area: override.area ?? areaForRoute(route),
    primaryAction: productiveTier ? override.primaryAction ?? fallbackPrimaryActionForRoute(route, tier, steps) : undefined,
    safetyHint: override.safetyHint ?? tierSafetyHints[tier],
    shortTitle: override.shortTitle ?? route.title,
  };
  const relatedRoutes = productiveTier ? override.relatedRoutes ?? [] : [];
  const nextStep = productiveTier ? override.nextStep : undefined;

  return {
    area: baseGuidance.area,
    ctaState: ctaStateForRoute(tier, policy.workspace, baseGuidance.primaryAction, nextStep, relatedRoutes),
    densityTier: policy.densityTier,
    nextStep,
    primaryAction: baseGuidance.primaryAction,
    purpose: override.purpose ?? route.purpose,
    relatedRoutes,
    safetyHint: baseGuidance.safetyHint,
    shortTitle: baseGuidance.shortTitle,
    steps,
    workbenchStructure: workbenchStructureForRoute(route, baseGuidance),
  };
}

export function operationalRouteGuidanceForPathname(pathname: string): OperationalRouteGuidance {
  const route = routeFromPathname(pathname);

  if (route) {
    return operationalRouteGuidanceForRoute(route);
  }

  return {
    area: "Design system",
    ctaState: {
      blockedReason: "Shared components do not establish release, evidence or export state.",
      primaryAction: linkForPageId("019", "Open client portal"),
      recovery: linkForPageId("038", "Open compliance queue"),
      state: "guarded",
    },
    safetyHint: "Shared UI primitives support controlled work screens; they do not release client-visible work by themselves.",
    primaryAction: linkForPageId("019", "Open client portal"),
    purpose: "Inspect the shared component language used by the AlphaVest implementation.",
    relatedRoutes: [linkForPageId("034", "Open workbench"), linkForPageId("038", "Open compliance queue")],
    shortTitle: "Shared UI component library",
    steps: [],
  };
}
