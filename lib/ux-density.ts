import {
  screenRoutes,
  type ScreenRoute,
} from "@/lib/route-registry";
import { uxRoutePolicyForRoute, type UxDensityTier } from "@/lib/ux-route-policy";

export type UxDensityContract = {
  description: string;
  hierarchy: string;
  pattern: string;
  safetyRetention: string;
  shellClassName: string;
  tier: UxDensityTier;
};

export const uxDensityTierContracts: Record<UxDensityTier, UxDensityContract> = {
  D1: {
    description: "Calm executive surface with a few high-signal cards, released/hidden state and one next-step panel.",
    hierarchy: "Page job, client-safe status, next step and source summary lead; operational tables stay out of the above-fold calm view.",
    pattern: "calm-executive",
    safetyRetention: "Client visibility, release state, evidence source and hidden-internal-data guardrails remain visible.",
    shellClassName: "gap-5 p-4 md:p-5",
    tier: "D1",
  },
  D2: {
    description: "Productive workbench with queue, selected context and gate/action rail.",
    hierarchy: "Priority queue, selected context and action rail share the first working surface without turning into a card wall.",
    pattern: "productive-workbench",
    safetyRetention: "Safety copy, blocked gates, evidence requirements and recovery actions remain present in the workbench.",
    shellClassName: "gap-4 p-4",
    tier: "D2",
  },
  D3: {
    description: "Dense operations surface for governance, export, audit and RBAC tables.",
    hierarchy: "Dense summary, filter/status rail and table-first scan area lead; secondary cards support rather than compete.",
    pattern: "dense-operations",
    safetyRetention: "Audit, export, redaction, approval and exception controls remain visible beside dense operational data.",
    shellClassName: "gap-3 p-3",
    tier: "D3",
  },
  D4: {
    description: "Focused detail surface with object header, key facts, evidence/audit sections and action rail.",
    hierarchy: "Decision context, evidence/gate state, blocker recovery and next action stay grouped in one focused detail frame.",
    pattern: "focused-detail",
    safetyRetention: "Evidence, audit, blocker, compliance-release and recovery controls stay retained; detail density must not hide risk.",
    shellClassName: "gap-3 p-4",
    tier: "D4",
  },
};

const routeByPageId = new Map<string, ScreenRoute>(screenRoutes.map((route) => [route.pageId, route]));

export function uxDensityForRoute(route: ScreenRoute) {
  const policy = uxRoutePolicyForRoute(route);
  return uxDensityTierContracts[policy.densityTier];
}

export function uxDensityForPageId(pageId: string) {
  const route = routeByPageId.get(pageId);

  if (!route) {
    throw new Error(`UX density route ${pageId} is missing from the route registry.`);
  }

  return uxDensityForRoute(route);
}
