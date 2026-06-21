import {
  routeToSmokePath,
  screenRoutes,
  type ScreenRoute,
} from "@/lib/route-registry";
import { uxDensityForRoute } from "@/lib/ux-density";
import { uxRoutePolicyForRoute } from "@/lib/ux-route-policy";

export const uxComplexity005SupportPageIds = [
  "001",
  "002",
  "003",
  "004",
  "005",
  "006",
  "007",
  "008",
  "009",
  "010",
  "011",
  "012",
  "013",
  "014",
  "015",
  "016",
  "017",
  "018",
  "021",
  "022",
  "023",
  "024",
  "025",
  "026",
  "031",
  "032",
] as const;

export type UxComplexity005SupportPageId = (typeof uxComplexity005SupportPageIds)[number];

export type UxSupportDensity = {
  href?: string;
  job: string;
  nextStep: string;
  pageId: UxComplexity005SupportPageId;
  pattern: string;
  safety: string;
  status: string;
  tier: string;
};

const supportPageIdSet = new Set<string>(uxComplexity005SupportPageIds);
const routeByPageId = new Map<string, ScreenRoute>(screenRoutes.map((route) => [route.pageId, route]));

const nextStepPageById: Partial<Record<UxComplexity005SupportPageId, string>> = {
  "001": "002",
  "002": "003",
  "003": "004",
  "004": "005",
  "005": "006",
  "006": "019",
  "007": "008",
  "008": "048",
  "009": "050",
  "010": "009",
  "011": "046",
  "012": "054",
  "013": "014",
  "014": "015",
  "015": "016",
  "016": "017",
  "017": "018",
  "018": "050",
  "021": "024",
  "022": "023",
  "023": "031",
  "024": "025",
  "025": "026",
  "026": "031",
  "031": "021",
};

const explicitNextStep: Partial<Record<UxComplexity005SupportPageId, Pick<UxSupportDensity, "href" | "nextStep">>> = {
  "032": {
    href: "/actions?state=drawer",
    nextStep: "Open selected action",
  },
};

function statusForRoute(route: ScreenRoute) {
  const policy = uxRoutePolicyForRoute(route);

  if (policy.pageType === "Hub") return "Orientation hub";
  if (policy.pageType === "Modal") return "Guided step";
  if (policy.pageType === "Detail") return "Focused detail";
  return "Support workbench";
}

function nextStepForPageId(pageId: UxComplexity005SupportPageId) {
  const explicit = explicitNextStep[pageId];
  if (explicit) return explicit;

  const nextPageId = nextStepPageById[pageId];
  const route = nextPageId ? routeByPageId.get(nextPageId) : undefined;

  if (!route) {
    return {
      nextStep: "Review scoped context",
    };
  }

  return {
    href: routeToSmokePath(route.route),
    nextStep: route.title,
  };
}

export function isUxComplexity005SupportPageId(pageId: string): pageId is UxComplexity005SupportPageId {
  return supportPageIdSet.has(pageId);
}

export function uxSupportDensityForPageId(pageId: string): UxSupportDensity | null {
  if (!isUxComplexity005SupportPageId(pageId)) {
    return null;
  }

  const route = routeByPageId.get(pageId);
  if (!route) {
    throw new Error(`UX-COMPLEXITY-005 route ${pageId} is missing from the route registry.`);
  }

  const policy = uxRoutePolicyForRoute(route);
  const density = uxDensityForRoute(route);
  const next = nextStepForPageId(pageId);

  return {
    href: next.href,
    job: route.title,
    nextStep: next.nextStep,
    pageId,
    pattern: density.pattern,
    safety: policy.safetyReminder,
    status: statusForRoute(route),
    tier: density.tier,
  };
}
