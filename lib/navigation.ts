import {
  BriefcaseBusiness,
  ClipboardCheck,
  Eye,
  FolderOpen,
  Home,
  LockKeyhole,
  Route,
  Settings,
  ShieldCheck,
  Upload,
  UserCheck,
  Wrench,
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
  scope: RouteScopeLabel | "IMPLEMENTED_APP_ROUTE";
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
  lockedLabel?: string;
  tier: NavigationGroupTier;
  items: NavigationItem[];
};

type NavigationItemDefinition = {
  pageId?: string;
  activePageIds?: readonly string[];
  label: string;
  description: string;
  href?: string;
  routePattern?: string;
  activeRoutePatterns?: readonly string[];
  icon: LucideIcon;
  scope?: RouteScopeLabel | "IMPLEMENTED_APP_ROUTE";
  tier?: NavigationItemTier;
};

type NavigationGroupDefinition = {
  key: UxWorkspaceKey;
  icon: LucideIcon;
  lockedLabel?: string;
  lockedReason?: string;
  tier?: NavigationGroupTier;
  items: readonly NavigationItemDefinition[];
};

const navigationDefinitions: readonly NavigationGroupDefinition[] = [
  {
    key: "area_00_command_center",
    icon: Route,
    items: [
      {
        pageId: "AREA-00",
        href: "/journeys",
        routePattern: "/journeys",
        activeRoutePatterns: ["/journeys", "/journeys/:id"],
        label: "Command Center",
        description: "Current work, blocked gates, process health and next legitimate actions.",
        icon: Route,
        scope: "IMPLEMENTED_APP_ROUTE",
        tier: "primary"
      }
    ]
  },
  {
    key: "area_01_foundation",
    icon: Settings,
    items: [
      {
        pageId: "015",
        activePageIds: ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012", "013", "014", "015", "016", "017", "018", "048", "049", "050", "051"],
        label: "Foundation",
        description: "Setup, identity, tenant controls, governance and RBAC without admin bypass.",
        icon: Settings,
        tier: "primary"
      }
    ]
  },
  {
    key: "area_02_client_context",
    icon: Home,
    items: [
      {
        pageId: "019",
        activePageIds: ["019", "021", "022", "023", "024", "025", "026", "031", "032"],
        label: "Client Context",
        description: "Client and family context without evidence sufficiency or release claims.",
        icon: Home
      }
    ]
  },
  {
    key: "area_03_evidence_lifecycle",
    icon: FolderOpen,
    items: [
      {
        pageId: "028",
        activePageIds: ["027", "028", "029", "030", "046", "047"],
        label: "Evidence Lifecycle",
        description: "Intake, extraction, review and sufficiency preparation; upload is not proof.",
        icon: FolderOpen
      }
    ]
  },
  {
    key: "area_04_analyst_workbench",
    icon: BriefcaseBusiness,
    items: [
      {
        pageId: "034",
        activePageIds: ["033", "034", "035"],
        label: "Analyst Workbench",
        description: "Signals, trigger triage and internal drafts before advisor review.",
        icon: BriefcaseBusiness
      }
    ]
  },
  {
    key: "area_05_advisor_review",
    icon: UserCheck,
    items: [
      {
        pageId: "036",
        activePageIds: ["036", "037"],
        label: "Advisor Review",
        description: "Advisor approval candidate review; advisor approval is not release.",
        icon: UserCheck
      }
    ]
  },
  {
    key: "area_06_compliance_release",
    icon: ShieldCheck,
    items: [
      {
        pageId: "038",
        activePageIds: ["038", "039", "040", "041", "042"],
        label: "Compliance Release",
        description: "Release, block, evidence request and audit exception gates.",
        icon: ShieldCheck
      }
    ]
  },
  {
    key: "area_07_decision_record",
    icon: ClipboardCheck,
    items: [
      {
        pageId: "044",
        activePageIds: ["043", "044", "045", "046", "047"],
        label: "Decision Record",
        description: "Decision rooms, released records and evidence-vault context.",
        icon: ClipboardCheck
      }
    ]
  },
  {
    key: "area_08_client_visibility",
    icon: Eye,
    items: [
      {
        pageId: "020",
        activePageIds: ["020"],
        label: "Client Visibility",
        description: "Released-only client-safe projection; hidden when release or redaction is missing.",
        icon: Eye
      }
    ]
  },
  {
    key: "area_09_export_delivery",
    icon: Upload,
    items: [
      {
        pageId: "054",
        activePageIds: ["054", "055", "056", "057", "058"],
        label: "Export & Delivery",
        description: "Scope, redaction, preview, approval, generation and delivery as separate gates.",
        icon: Upload
      }
    ]
  },
  {
    key: "area_10_operations",
    icon: Wrench,
    lockedLabel: "Support lane",
    lockedReason: "Operations and data-quality routes stay internal support/deep-link work until a route-evolution record authorizes productive navigation.",
    tier: "support",
    items: []
  },
  {
    key: "area_11_protected_work",
    icon: LockKeyhole,
    lockedLabel: "Protected lane",
    lockedReason: "Deferred, elevated, held and reference routes stay outside productive completion proof.",
    tier: "support",
    items: []
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
  if (definition.href && definition.routePattern) {
    return {
      pageId: definition.pageId ?? definition.href,
      activePageIds: definition.activePageIds ? [...definition.activePageIds] : [],
      label: definition.label,
      description: definition.description,
      href: definition.href,
      routePattern: definition.routePattern,
      activeRoutePatterns: [...new Set([definition.routePattern, ...(definition.activeRoutePatterns ?? [])])],
      icon: definition.icon,
      scope: definition.scope ?? "IMPLEMENTED_APP_ROUTE",
      tier: definition.tier ?? "primary"
    };
  }

  if (!definition.pageId) {
    throw new Error(`Navigation item ${definition.label} is missing a pageId or custom href.`);
  }

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
      .filter((item) => item.href || (item.pageId && isRouteImplementationShellAccessible(routeForPageId(item.pageId))))
      .map(navigationItemForDefinition);

    return {
      key: group.key,
      label: uxWorkspaceLabels[group.key],
      description: uxWorkspaceDescriptions[group.key],
      icon: group.icon,
      journeyStage: isV096CoreWorkspace(group.key) ? v096CoreWorkspaceKeys.indexOf(group.key as (typeof v096CoreWorkspaceKeys)[number]) + 1 : undefined,
      journeyStageLabel: isV096CoreWorkspace(group.key) ? "Core journey" : undefined,
      lockedLabel: group.lockedLabel,
      lockedReason: group.lockedReason,
      tier: group.tier ?? "core",
      items
    };
  })
  .filter((group) => group.items.length > 0 || group.lockedReason);

export function navigationGroupsForRole(role: DemoRole) {
  return navigationGroups
    .map((group) => {
      const areaLockedReason = group.lockedReason;
      const visible = !areaLockedReason && isUxNavigationWorkspaceVisibleForRole(group.key, role);
      return {
        ...group,
        lockedReason: areaLockedReason ?? (visible ? undefined : uxNavigationLockedReason(group.key, role)),
        items: visible ? group.items : [],
      };
    })
    .filter((group) => group.items.length > 0 || group.lockedReason);
}

export const productiveNavigationPageIds = navigationGroups.flatMap((group) =>
  group.items.map((item) => item.pageId).filter((pageId) => /^\d+$/.test(pageId))
);

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
