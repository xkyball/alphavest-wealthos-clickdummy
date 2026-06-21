import {
  screenRoutes,
  type ScreenRoute,
} from "@/lib/route-registry";
import { uxRoutePolicyForRoute, type UxDensityTier } from "@/lib/ux-route-policy";

export type UxDensityContract = {
  description: string;
  pattern: string;
  shellClassName: string;
  tier: UxDensityTier;
};

export const uxDensityTierContracts: Record<UxDensityTier, UxDensityContract> = {
  D1: {
    description: "Calm executive surface with a few high-signal cards, released/hidden state and one next-step panel.",
    pattern: "calm-executive",
    shellClassName: "gap-5 p-4 md:p-5",
    tier: "D1",
  },
  D2: {
    description: "Productive workbench with queue, selected context and gate/action rail.",
    pattern: "productive-workbench",
    shellClassName: "gap-4 p-4",
    tier: "D2",
  },
  D3: {
    description: "Dense operations surface for governance, export, audit and RBAC tables.",
    pattern: "dense-operations",
    shellClassName: "gap-3 p-3",
    tier: "D3",
  },
  D4: {
    description: "Focused detail surface with object header, key facts, evidence/audit sections and action rail.",
    pattern: "focused-detail",
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
