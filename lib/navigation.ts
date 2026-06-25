import {
  Archive,
  BriefcaseBusiness,
  ClipboardCheck,
  FolderOpen,
  Home,
  Landmark,
  Settings,
  ShieldCheck,
  Upload,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DemoRole } from "@/lib/demo-session";
import {
  isRouteImplementationShellAccessible,
  routePatternToSegments,
  routeScopeForPageId,
  routeToSmokePath,
  screenRoutes,
  type RouteScopeLabel
} from "@/lib/route-registry";
import {
  isV096CoreWorkspace,
  isUxNavigationWorkspaceVisibleForRole,
  uxNavigationLockedReason,
  uxRoutePolicyForPageId,
  v096CoreWorkspaceKeys,
  uxWorkspaceDescriptions,
  uxWorkspaceLabels,
  type UxWorkspaceKey,
} from "@/lib/ux-route-policy";

export type NavigationItemTier = "primary" | "secondary";
export type NavigationGroupTier = "core" | "support";

export type NavigationItem = {
  pageId: string;
  activePageIds: string[];
  label: string;
  description: string;
  href: string;
  routePattern: string;
  activeRoutePatterns: string[];
  icon: LucideIcon;
  scope: RouteScopeLabel;
  tier: NavigationItemTier;
};

export type NavigationGroup = {
  key: UxWorkspaceKey;
  label: string;
  description: string;
  icon: LucideIcon;
  journeyStage?: number;
  journeyStageLabel?: string;
  lockedReason?: string;
  tier: NavigationGroupTier;
  items: NavigationItem[];
};

type NavigationItemDefinition = {
  pageId: string;
  activePageIds?: readonly string[];
  label: string;
  description: string;
  icon: LucideIcon;
  tier?: NavigationItemTier;
};

type NavigationGroupDefinition = {
  key: UxWorkspaceKey;
  icon: LucideIcon;
  tier?: NavigationGroupTier;
  items: readonly NavigationItemDefinition[];
};

const navigationDefinitions: readonly NavigationGroupDefinition[] = [
  {
    key: "setup",
    icon: Settings,
    items: [
      {
        pageId: "015",
        activePageIds: ["001", "002", "003", "004", "005", "006", "007", "009", "010", "011", "012", "013", "014", "015", "016", "017", "018"],
        label: "Access & tenant setup",
        description: "One governed entry for onboarding, platform controls, tenants, roles and templates.",
        icon: Settings,
        tier: "primary"
      }
    ]
  },
  {
    key: "client_workspace",
    icon: Home,
    items: [
      {
        pageId: "019",
        activePageIds: ["019", "020", "021", "022", "023", "024", "025", "026", "031", "032"],
        label: "Client context",
        description: "Client-safe household, profile, entity, wealth map and action context.",
        icon: Home
      }
    ]
  },
  {
    key: "evidence",
    icon: FolderOpen,
    items: [
      {
        pageId: "028",
        activePageIds: ["027", "028", "029", "030", "046", "047"],
        label: "Evidence workspace",
        description: "Source intake, extraction, verification and evidence record review.",
        icon: FolderOpen
      }
    ]
  },
  {
    key: "advisory_workbench",
    icon: BriefcaseBusiness,
    items: [
      {
        pageId: "034",
        activePageIds: ["033", "034", "035", "036", "037"],
        label: "Internal workbench",
        description: "Signals, internal drafts, trigger review and human sign-off before release.",
        icon: BriefcaseBusiness
      }
    ]
  },
  {
    key: "compliance",
    icon: ShieldCheck,
    items: [
      {
        pageId: "038",
        activePageIds: ["038", "039", "040", "041", "042"],
        label: "Compliance release",
        description: "Queue, review, release, block, evidence request and audit exception gates.",
        icon: ShieldCheck
      }
    ]
  },
  {
    key: "decisions",
    icon: Archive,
    items: [
      {
        pageId: "044",
        activePageIds: ["043", "044", "045"],
        label: "Decision & evidence record",
        description: "Decision list, decision room and submitted evidence package state.",
        icon: ClipboardCheck
      }
    ]
  },
  {
    key: "governance",
    icon: Landmark,
    items: [
      {
        pageId: "048",
        activePageIds: ["008", "048", "049", "050", "051"],
        label: "Governance / RBAC / audit",
        description: "Advice boundary, users, roles, access requests and audit history without bypass.",
        icon: Landmark
      }
    ]
  },
  {
    key: "export",
    icon: Upload,
    items: [
      {
        pageId: "054",
        activePageIds: ["054", "055", "056", "057", "058"],
        label: "Export & redaction",
        description: "Create, scope, redact, preview, approve and deliver as separated controls.",
        icon: Upload
      }
    ]
  }
];

const routeByPageId = new Map<string, (typeof screenRoutes)[number]>(screenRoutes.map((route) => [route.pageId, route]));

function routeForPageId(pageId: string) {
  const route = routeByPageId.get(pageId);

  if (!route) {
    throw new Error(`Navigation page ${pageId} is missing from the AlphaVest route registry.`);
  }

  return route;
}

function navigationItemForDefinition(definition: NavigationItemDefinition): NavigationItem {
  const route = routeForPageId(definition.pageId);
  if (!isRouteImplementationShellAccessible(route)) {
    throw new Error(`Navigation page ${definition.pageId} is registered-only and cannot appear in implementation navigation.`);
  }

  const activePageIds = [...new Set([definition.pageId, ...(definition.activePageIds ?? [])])];
  const activeRoutePatterns = activePageIds.map((pageId) => routeForPageId(pageId).route);

  return {
    pageId: definition.pageId,
    activePageIds,
    label: definition.label,
    description: definition.description,
    href: routeToSmokePath(route.route),
    routePattern: route.route,
    activeRoutePatterns,
    icon: definition.icon,
    scope: routeScopeForPageId(definition.pageId),
    tier: definition.tier ?? "primary"
  };
}

export const navigationGroups: NavigationGroup[] = navigationDefinitions
  .map((group) => {
    const items = group.items
      .filter((item) => isRouteImplementationShellAccessible(routeForPageId(item.pageId)))
      .map(navigationItemForDefinition);

    return {
      key: group.key,
      label: uxWorkspaceLabels[group.key],
      description: uxWorkspaceDescriptions[group.key],
      icon: group.icon,
      journeyStage: isV096CoreWorkspace(group.key) ? v096CoreWorkspaceKeys.indexOf(group.key as (typeof v096CoreWorkspaceKeys)[number]) + 1 : undefined,
      journeyStageLabel: isV096CoreWorkspace(group.key) ? "Core journey" : undefined,
      tier: group.tier ?? "core",
      items
    };
  })
  .filter((group) => group.items.length > 0);

export function navigationGroupsForRole(role: DemoRole) {
  return navigationGroups
    .map((group) => {
      const visible = isUxNavigationWorkspaceVisibleForRole(group.key, role);
      return {
        ...group,
        lockedReason: visible ? undefined : uxNavigationLockedReason(group.key, role),
        items: visible ? group.items : [],
      };
    })
    .filter((group) => group.items.length > 0 || group.lockedReason);
}

export const productiveNavigationPageIds = navigationGroups.flatMap((group) => group.items.map((item) => item.pageId));

export function uxNavigationPolicyForPageId(pageId: string) {
  return uxRoutePolicyForPageId(pageId);
}

function normalizePathname(pathname: string) {
  const path = pathname.split("?")[0]?.split("#")[0] ?? "/";
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

function pathnameMatchesPattern(pathname: string, pattern: string) {
  const pathSegments = routePatternToSegments(normalizePathname(pathname));
  const patternSegments = routePatternToSegments(pattern);

  return (
    pathSegments.length === patternSegments.length &&
    patternSegments.every((segment, index) => segment.startsWith(":") || segment === pathSegments[index])
  );
}

export function isActiveNavigationItem(
  pathname: string,
  item: Pick<NavigationItem, "href" | "routePattern" | "activeRoutePatterns">
) {
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === normalizePathname(item.href)) {
    return true;
  }

  return item.activeRoutePatterns.some((pattern) => pathnameMatchesPattern(normalizedPathname, pattern));
}
