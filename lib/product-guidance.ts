import {
  matchRouteBySegments,
  navigationGroupLabels,
  routeScopeForPageId,
  routeScopeLabels,
  routeToSmokePath,
  screenRoutes,
  type RouteScopeLabel,
  type ScreenRoute,
} from "@/lib/route-registry";
import { uxFlowStepsForPageId, uxRoutePolicyForRoute, type UxFlowStep, type UxWorkspaceKey } from "@/lib/ux-route-policy";
import type { UxDensityTier } from "@/lib/ux-route-policy";

export type ProductGuidanceLink = {
  href: string;
  label: string;
};

export type ProductGuidance = {
  area: string;
  ctaState: ProductGuidanceCtaState;
  densityTier?: UxDensityTier;
  gateHint: string;
  nextStep?: ProductGuidanceLink;
  primaryAction?: ProductGuidanceLink;
  purpose: string;
  relatedRoutes: ProductGuidanceLink[];
  routeId?: string;
  routePolicyLabels: string[];
  shortTitle: string;
  steps: UxFlowStep[];
  tier: RouteScopeLabel | "ROOT";
  tierLabel: string;
  workbenchStructure?: ProductGuidanceWorkbenchStructure;
};

export type ProductGuidanceCtaState = {
  blockedReason?: string;
  primaryAction?: ProductGuidanceLink;
  recovery?: ProductGuidanceLink;
  state: "ready" | "guarded" | "locked";
};

export type ProductGuidanceWorkbenchStructure = {
  actionRail: string;
  context: string;
  queue: string;
  safety: string;
};

type GuidanceOverride = Partial<
  Pick<ProductGuidance, "area" | "gateHint" | "nextStep" | "primaryAction" | "purpose" | "relatedRoutes" | "shortTitle">
>;

const routeByPageId = new Map<string, ScreenRoute>(screenRoutes.map((route) => [route.pageId, route]));

function linkForPageId(pageId: string, label: string): ProductGuidanceLink {
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
    gateHint: "Support route: platform setup does not bypass evidence, release, audit or export gates.",
    primaryAction: linkForPageId("008", "Open advice boundary"),
    relatedRoutes: [linkForPageId("010", "Review security"), linkForPageId("013", "Open tenant directory")],
  },
  "008": {
    area: "Platform controls",
    gateHint: "Advice boundaries constrain workflow behaviour; they do not create client-visible advice.",
    primaryAction: linkForPageId("048", "Review governance users"),
    relatedRoutes: [linkForPageId("049", "Manage roles"), linkForPageId("010", "Review security")],
  },
  "009": {
    area: "Platform controls",
    gateHint: "Role administration is scoped configuration only; it cannot release advice, approve exports or suppress audit.",
    primaryAction: linkForPageId("048", "Review governance users"),
    relatedRoutes: [linkForPageId("049", "Review role changes"), linkForPageId("050", "Review access requests")],
  },
  "013": {
    area: "Tenant setup",
    gateHint: "Tenant setup prepares context only; it does not expand permissions or client visibility.",
    nextStep: linkForPageId("014", "Create tenant"),
    primaryAction: linkForPageId("014", "Create tenant"),
    relatedRoutes: [linkForPageId("015", "Open setup dashboard"), linkForPageId("018", "Review tenant users")],
  },
  "014": {
    area: "Tenant setup",
    gateHint: "Creating a tenant does not activate downstream evidence, advice or release gates.",
    nextStep: linkForPageId("015", "Open setup dashboard"),
    primaryAction: linkForPageId("015", "Open setup dashboard"),
    relatedRoutes: [linkForPageId("018", "Review tenant users"), linkForPageId("027", "Open document queue")],
  },
  "015": {
    area: "Tenant setup",
    gateHint: "Setup status or checklist completion does not grant payload or release authority.",
    nextStep: linkForPageId("018", "Review tenant users"),
    primaryAction: linkForPageId("018", "Review tenant users"),
    relatedRoutes: [linkForPageId("027", "Open document queue"), linkForPageId("013", "Back to tenants")],
  },
  "018": {
    area: "Tenant setup",
    gateHint: "User access supports the workflow; role assignment is not evidence sufficiency or release.",
    nextStep: linkForPageId("027", "Open document queue"),
    primaryAction: linkForPageId("027", "Open document queue"),
    relatedRoutes: [linkForPageId("028", "Upload source for review"), linkForPageId("048", "Review governance users")],
  },
  "019": {
    area: "Client workspace",
    gateHint: "Client-facing view: only released, client-safe content should be visible here.",
    nextStep: linkForPageId("027", "Open document library"),
    primaryAction: linkForPageId("028", "Upload source for review"),
    purpose: "Orient the client workspace and surface only controlled, client-safe work after release gates pass.",
    relatedRoutes: [linkForPageId("021", "Review client profile"), linkForPageId("046", "Open evidence vault")],
    shortTitle: "Client portal",
  },
  "021": {
    area: "Client workspace",
    gateHint: "Client facts support advisory work; they do not release advice by themselves.",
    primaryAction: linkForPageId("024", "Open entities"),
    relatedRoutes: [linkForPageId("027", "Open documents"), linkForPageId("031", "Review wealth map")],
  },
  "027": {
    area: "Evidence intake",
    gateHint: "Documents feed review. A document row is not reviewed evidence until the evidence lifecycle says so.",
    nextStep: linkForPageId("028", "Upload source for review"),
    primaryAction: linkForPageId("028", "Upload source for review"),
    relatedRoutes: [linkForPageId("030", "Open verification queue"), linkForPageId("046", "Open evidence vault")],
  },
  "028": {
    area: "Evidence intake",
    gateHint: "Upload is not evidence sufficiency. Human review, scope, currentness and linkage still have to pass.",
    nextStep: linkForPageId("029", "Review extraction"),
    primaryAction: linkForPageId("029", "Review extraction"),
    purpose: "Collect source documents and keep them locked behind evidence review before any release or export gate can use them.",
    relatedRoutes: [linkForPageId("030", "Open verification queue"), linkForPageId("046", "Open evidence vault")],
    shortTitle: "Document upload",
  },
  "029": {
    area: "Evidence intake",
    gateHint: "Extraction review can link evidence; sufficiency still depends on reviewed, scoped, current evidence.",
    nextStep: linkForPageId("030", "Open verification queue"),
    primaryAction: linkForPageId("030", "Open verification queue"),
    relatedRoutes: [linkForPageId("028", "Back to upload"), linkForPageId("038", "Open compliance queue")],
  },
  "030": {
    area: "Evidence intake",
    gateHint: "Verification prepares reviewed evidence; sufficiency still depends on scope, currentness and linkage.",
    nextStep: linkForPageId("033", "Open signal queue"),
    primaryAction: linkForPageId("033", "Open signal queue"),
    relatedRoutes: [linkForPageId("046", "Open evidence vault"), linkForPageId("034", "Open workbench")],
  },
  "033": {
    area: "Advisory workflow",
    gateHint: "Signals are internal inputs. They do not create client-visible advice.",
    nextStep: linkForPageId("034", "Continue in workbench"),
    primaryAction: linkForPageId("034", "Continue in workbench"),
    relatedRoutes: [linkForPageId("036", "Open advisor approval"), linkForPageId("038", "Open compliance queue")],
  },
  "034": {
    area: "Advisory workflow",
    gateHint: "Internal draft only. Advisor approval and compliance release are separate downstream gates.",
    nextStep: linkForPageId("036", "Send to advisor review"),
    primaryAction: linkForPageId("036", "Send to advisor review"),
    purpose: "Prepare the recommendation internally, resolve evidence gaps and move only controlled work toward human approval.",
    relatedRoutes: [linkForPageId("028", "Request evidence"), linkForPageId("038", "Open compliance queue")],
    shortTitle: "Workbench",
  },
  "036": {
    area: "Advisory workflow",
    gateHint: "Advisor approval is required, but advisor approval is not compliance release.",
    nextStep: linkForPageId("038", "Open compliance queue"),
    primaryAction: linkForPageId("037", "Review advisor item"),
    relatedRoutes: [linkForPageId("034", "Back to workbench"), linkForPageId("039", "Open compliance review")],
  },
  "035": {
    area: "Advisory workflow",
    gateHint: "Trigger detail can prepare a recommendation; draft work remains internal.",
    nextStep: linkForPageId("036", "Send to advisor queue"),
    primaryAction: linkForPageId("036", "Send to advisor queue"),
    relatedRoutes: [linkForPageId("034", "Back to workbench"), linkForPageId("028", "Request evidence")],
  },
  "037": {
    area: "Advisory workflow",
    gateHint: "Advisor approval records human review only; compliance release remains required.",
    nextStep: linkForPageId("038", "Open compliance queue"),
    primaryAction: linkForPageId("038", "Open compliance queue"),
    relatedRoutes: [linkForPageId("039", "Open compliance review"), linkForPageId("034", "Back to workbench")],
  },
  "038": {
    area: "Compliance and release",
    gateHint: "Compliance release controls client visibility. Missing evidence or audit blocks release.",
    nextStep: linkForPageId("039", "Open compliance review"),
    primaryAction: linkForPageId("039", "Open compliance review"),
    purpose: "Triage work that can be reviewed, blocked, released or sent back for evidence without exposing unapproved advice.",
    relatedRoutes: [linkForPageId("040", "Open release controls"), linkForPageId("041", "Open block action")],
    shortTitle: "Compliance queue",
  },
  "039": {
    area: "Compliance and release",
    gateHint: "Compliance can release, block or request evidence only after preconditions are checked.",
    nextStep: linkForPageId("040", "Open release controls"),
    primaryAction: linkForPageId("040", "Open release controls"),
    relatedRoutes: [linkForPageId("041", "Block or request evidence"), linkForPageId("042", "Review audit context")],
  },
  "040": {
    area: "Compliance and release",
    gateHint: "Release requires explicit confirmation and audit persistence; client acceptance remains separate.",
    nextStep: linkForPageId("043", "Open decision list"),
    primaryAction: linkForPageId("043", "Open decision list"),
    relatedRoutes: [linkForPageId("042", "Review audit context"), linkForPageId("041", "Block or request evidence")],
  },
  "041": {
    area: "Compliance and release",
    gateHint: "Blocking or requesting evidence keeps client visibility closed until recovery gates pass.",
    nextStep: linkForPageId("028", "Request source upload"),
    primaryAction: linkForPageId("028", "Request source upload"),
    relatedRoutes: [linkForPageId("038", "Back to compliance queue"), linkForPageId("042", "Review audit context")],
  },
  "042": {
    area: "Compliance and release",
    gateHint: "Audit context supports traceability; audit visibility alone is not release authority.",
    nextStep: linkForPageId("043", "Open decision list"),
    primaryAction: linkForPageId("043", "Open decision list"),
    relatedRoutes: [linkForPageId("039", "Open compliance review"), linkForPageId("051", "Open access audit")],
  },
  "043": {
    area: "Decisions and evidence",
    gateHint: "Decision records support traceability; they are not client acceptance by themselves.",
    nextStep: linkForPageId("044", "Open decision room"),
    primaryAction: linkForPageId("044", "Open decision room"),
    relatedRoutes: [linkForPageId("046", "Open evidence vault"), linkForPageId("051", "Open audit history")],
  },
  "044": {
    area: "Decisions and evidence",
    gateHint: "Decision-room action records client decision state; it does not change advice or release gates.",
    nextStep: linkForPageId("045", "Open submitted state"),
    primaryAction: linkForPageId("045", "Open submitted state"),
    relatedRoutes: [linkForPageId("046", "Open evidence vault"), linkForPageId("019", "Open client portal")],
  },
  "045": {
    area: "Decisions and evidence",
    gateHint: "Submission confirms the recorded decision only; compliance release and client-safe projection remain separate.",
    nextStep: linkForPageId("019", "Open client portal"),
    primaryAction: linkForPageId("019", "Open client portal"),
    relatedRoutes: [linkForPageId("020", "Open mobile home"), linkForPageId("046", "Open evidence vault")],
  },
  "046": {
    area: "Decisions and evidence",
    gateHint: "Evidence supports traceability. Sufficiency requires reviewed, scoped and current evidence.",
    nextStep: linkForPageId("038", "Open compliance queue"),
    primaryAction: linkForPageId("028", "Upload source for review"),
    relatedRoutes: [linkForPageId("029", "Review extraction"), linkForPageId("051", "Open audit history")],
  },
  "048": {
    area: "Governance",
    gateHint: "Governance controls access, but admin authority does not bypass release, evidence or export gates.",
    nextStep: linkForPageId("049", "Review scoped roles"),
    primaryAction: linkForPageId("049", "Review scoped roles"),
    relatedRoutes: [linkForPageId("050", "Review policy-checked requests"), linkForPageId("051", "Open audit history")],
  },
  "049": {
    area: "Governance",
    gateHint: "Role edits require confirmation and audit; they cannot force release, sufficiency, export approval or visibility.",
    nextStep: linkForPageId("050", "Review access requests"),
    primaryAction: linkForPageId("050", "Review access requests"),
    relatedRoutes: [linkForPageId("048", "Review governance users"), linkForPageId("051", "Open audit history")],
  },
  "050": {
    area: "Governance",
    gateHint: "Access approval is role-scoped only; policy, SOD and audit gates still control the action.",
    nextStep: linkForPageId("051", "Open audit history"),
    primaryAction: linkForPageId("051", "Open audit history"),
    relatedRoutes: [linkForPageId("049", "Review roles"), linkForPageId("008", "Open advice boundary")],
  },
  "051": {
    area: "Governance",
    gateHint: "Audit visibility supports review only; persistence, retention and export controls remain separate.",
    nextStep: linkForPageId("048", "Review governance users"),
    primaryAction: linkForPageId("048", "Review governance users"),
    relatedRoutes: [linkForPageId("050", "Review access requests"), linkForPageId("042", "Review compliance audit")],
  },
  "054": {
    area: "Export",
    gateHint: "Export requires scope, redaction and approval. Preview is not approval or client acceptance.",
    nextStep: linkForPageId("055", "Select export scope"),
    primaryAction: linkForPageId("055", "Select export scope"),
    purpose: "Prepare a controlled package by selecting scope, redacting internal content and approving delivery steps separately.",
    relatedRoutes: [linkForPageId("056", "Review redaction"), linkForPageId("057", "Open export preview")],
    shortTitle: "New export",
  },
  "055": {
    area: "Export",
    gateHint: "Only scoped, permitted content can move toward redaction and preview.",
    nextStep: linkForPageId("056", "Review redaction"),
    primaryAction: linkForPageId("056", "Review redaction"),
    relatedRoutes: [linkForPageId("057", "Open preview"), linkForPageId("058", "Open delivery state")],
  },
  "057": {
    area: "Export",
    gateHint: "Preview is not approval. Generation, download, share and client acceptance remain separate.",
    nextStep: linkForPageId("058", "Open delivery controls"),
    primaryAction: linkForPageId("058", "Open delivery controls"),
    relatedRoutes: [linkForPageId("055", "Review scope"), linkForPageId("056", "Review redaction")],
  },
  "052": {
    area: "Registered-only communication",
    gateHint: "P1 / later: not part of the current MVP workflow. Message delivery and client visibility remain held outside this release.",
  },
  "061": {
    area: "Reference-only workspace",
    gateHint: "Read-only context. No product action is available.",
  },
  "070": {
    area: "Held committee review",
    gateHint: "Blocked until scope and safety are explicitly unlocked.",
  },
};

const tierGateHints: Record<RouteScopeLabel, string> = {
  MVP: "Current work can continue only when role, object, evidence and release gates allow it.",
  MVP_SUPPORT: "Setup and context can continue; downstream actions still require their own gates.",
  P1_AFTER_MVP: "Not active in this release. No release action is available.",
  REFERENCE_ONLY: "Read-only context. No product action is available.",
  HOLD_PENDING_DECISION: "Blocked until scope and safety are explicitly unlocked.",
};

const guidanceTierLabels: Record<RouteScopeLabel, string> = {
  HOLD_PENDING_DECISION: "Held / not MVP",
  MVP: routeScopeLabels.MVP,
  MVP_SUPPORT: routeScopeLabels.MVP_SUPPORT,
  P1_AFTER_MVP: "P1 / later",
  REFERENCE_ONLY: "Reference only",
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
  if (route.navigationGroup === "advisory_workflow") return "Advisory workflow";
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

function workbenchStructureForRoute(route: ScreenRoute, guidance: Pick<ProductGuidance, "area" | "gateHint" | "primaryAction" | "shortTitle" | "tierLabel">) {
  if (!uxPage002WorkbenchRouteIds.has(route.pageId)) return undefined;

  return {
    actionRail: guidance.primaryAction
      ? `Next allowed action: ${guidance.primaryAction.label}.`
      : "No productive action is exposed until route and role prerequisites are clear.",
    context: `${guidance.shortTitle} selected in ${guidance.area}.`,
    queue: `${guidance.shortTitle} open items and blocked states.`,
    safety: `${guidance.gateHint} Controls stay blocked until the required gate passes.`,
  } satisfies ProductGuidanceWorkbenchStructure;
}

function fallbackPrimaryActionForRoute(route: ScreenRoute, tier: RouteScopeLabel, steps: UxFlowStep[]): ProductGuidanceLink | undefined {
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
  if (workspace === "client_workspace") return "Only released client-safe content may be visible here.";
  if (workspace === "advisory_workbench") return "Draft work stays internal until advisor review and compliance release pass.";
  if (workspace === "approvals") return "Advisor approval does not release work to the client.";
  if (workspace === "compliance") return "Client visibility stays blocked until compliance release passes.";
  if (workspace === "decisions") return "Decision records require released, evidence-backed context before client use.";
  if (workspace === "evidence") return "Upload and review do not prove evidence sufficiency.";
  if (workspace === "export") return "Preview, approval, download and share stay separate.";
  if (workspace === "governance") return "Admin access cannot bypass evidence, release, audit or export gates.";
  if (workspace === "setup") return "Setup changes do not bypass downstream gates.";

  return "No productive action is available in the current release.";
}

function recoveryActionForCta(
  primaryAction: ProductGuidanceLink | undefined,
  nextStep: ProductGuidanceLink | undefined,
  relatedRoutes: ProductGuidanceLink[],
) {
  if (nextStep && nextStep.href !== primaryAction?.href) return nextStep;
  return relatedRoutes.find((route) => route.href !== primaryAction?.href);
}

function ctaStateForRoute(
  tier: RouteScopeLabel,
  workspace: UxWorkspaceKey,
  primaryAction: ProductGuidanceLink | undefined,
  nextStep: ProductGuidanceLink | undefined,
  relatedRoutes: ProductGuidanceLink[],
): ProductGuidanceCtaState {
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

export function productGuidanceForRoute(route: ScreenRoute): ProductGuidance {
  const tier = routeScopeForPageId(route.pageId);
  const policy = uxRoutePolicyForRoute(route);
  const override = guidanceOverrides[route.pageId] ?? {};
  const steps = uxFlowStepsForPageId(route.pageId);
  const baseGuidance = {
    area: override.area ?? areaForRoute(route),
    gateHint: override.gateHint ?? tierGateHints[tier],
    primaryAction: override.primaryAction ?? fallbackPrimaryActionForRoute(route, tier, steps),
    shortTitle: override.shortTitle ?? route.title,
    tierLabel: guidanceTierLabels[tier],
  };
  const relatedRoutes = override.relatedRoutes ?? [];
  const nextStep = override.nextStep;

  return {
    area: baseGuidance.area,
    ctaState: ctaStateForRoute(tier, policy.workspace, baseGuidance.primaryAction, nextStep, relatedRoutes),
    densityTier: policy.densityTier,
    gateHint: baseGuidance.gateHint,
    nextStep,
    primaryAction: baseGuidance.primaryAction,
    purpose: override.purpose ?? route.purpose,
    relatedRoutes,
    routePolicyLabels: policy.routePolicyLabels,
    routeId: route.pageId,
    shortTitle: baseGuidance.shortTitle,
    steps,
    tier,
    tierLabel: baseGuidance.tierLabel,
    workbenchStructure: workbenchStructureForRoute(route, baseGuidance),
  };
}

export function productGuidanceForPathname(pathname: string): ProductGuidance {
  const route = routeFromPathname(pathname);

  if (route) {
    return productGuidanceForRoute(route);
  }

  return {
    area: "Design system",
    ctaState: {
      blockedReason: "Shared components do not prove release, evidence or export state.",
      primaryAction: linkForPageId("019", "Open client portal"),
      recovery: linkForPageId("038", "Open compliance queue"),
      state: "guarded",
    },
    gateHint: "Shared UI primitives support controlled workflow screens; they are not release proof by themselves.",
    primaryAction: linkForPageId("019", "Open client portal"),
    purpose: "Inspect the shared component language used by the AlphaVest workflow implementation.",
    relatedRoutes: [linkForPageId("034", "Open workbench"), linkForPageId("038", "Open compliance queue")],
    routePolicyLabels: ["NO_ROUTE_RECLASSIFICATION", "NO_SCREEN_GENERATION"],
    shortTitle: "Shared UI component library",
    steps: [],
    tier: "ROOT",
    tierLabel: "Support",
  };
}
