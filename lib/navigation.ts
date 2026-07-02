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
import type { ActorRole } from "@/lib/actor-session";
import {
  isRouteImplementationShellAccessible,
  routePatternToSegments,
  routeScopeForPageId,
  routeToSmokePath,
  screenRoutes,
  type RouteScopeLabel
} from "@/lib/route-registry";
import {
  isUxNavigationWorkspaceVisibleForRole,
  uxNavigationLockedReason,
  uxRoutePolicyForPageId,
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
    items: [],
  },
  {
    key: "area_01_foundation",
    icon: Settings,
    items: [
      {
        pageId: "015",
        activePageIds: ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012", "013", "014", "015", "016", "017", "018", "048", "049", "050", "051"],
        label: "Set up access",
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
        label: "Know the client",
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
        label: "Collect evidence",
        description: "Intake, extraction, review and sufficiency preparation; upload alone is not enough.",
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
        label: "Prepare advice",
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
        activePageIds: ["036", "037", "070", "071"],
        label: "Review advice",
        description: "Advisor review, candidate approvals and compliance handoff.",
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
        label: "Release safely",
        description: "Release, block, evidence request and audit exceptions.",
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
        label: "Record decisions",
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
        label: "Client view",
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
        label: "Export package",
        description: "Content, redaction, preview, approval, generation and delivery stay separate.",
        icon: Upload
      }
    ]
  },
  {
    key: "area_10_operations",
    icon: Wrench,
    tier: "support",
    items: [
      {
        pageId: "059",
        activePageIds: ["059", "060", "068"],
        label: "Run operations",
        description: "Queue, SLA and review-rhythm work with data-quality blockers and audit-safe controls.",
        icon: Wrench
      }
    ]
  },
  {
    key: "area_11_protected_work",
    icon: LockKeyhole,
    lockedLabel: "Protected lane",
    lockedReason: "Deferred, elevated, held and reference routes stay outside current delivery.",
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
      lockedLabel: group.lockedLabel,
      lockedReason: group.lockedReason,
      tier: group.tier ?? "core",
      items
    };
  })
  .filter((group) => group.items.length > 0 || group.lockedReason);

export function navigationGroupsForRole(role: ActorRole) {
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
