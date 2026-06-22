import {
  Archive,
  BadgeCheck,
  Building2,
  BriefcaseBusiness,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  FileSearch,
  FileText,
  FolderOpen,
  Gauge,
  Gavel,
  Home,
  KeyRound,
  Landmark,
  LockKeyhole,
  MessageSquare,
  Scale,
  Settings,
  ShieldCheck,
  Upload,
  UsersRound
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
  scope: RouteScopeLabel;
  tier: NavigationItemTier;
};

export type NavigationGroup = {
  key: UxWorkspaceKey;
  label: string;
  description: string;
  icon: LucideIcon;
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
        pageId: "003",
        activePageIds: ["001", "002", "003", "004", "005", "006"],
        label: "User onboarding",
        description: "Login, MFA, invite, identity, consent, and role confirmation.",
        icon: LockKeyhole,
        tier: "secondary"
      },
      {
        pageId: "007",
        label: "Platform settings",
        description: "Global platform configuration.",
        icon: Settings,
        tier: "secondary"
      },
      {
        pageId: "009",
        label: "Role templates",
        description: "Reusable global role templates.",
        icon: KeyRound,
        tier: "secondary"
      },
      {
        pageId: "010",
        label: "Security",
        description: "Security configuration and sensitive controls.",
        icon: ShieldCheck,
        tier: "secondary"
      },
      {
        pageId: "011",
        label: "Evidence templates",
        description: "Evidence template administration.",
        icon: FileText,
        tier: "secondary"
      },
      {
        pageId: "012",
        label: "Export templates",
        description: "Export and redaction template administration.",
        icon: FileSearch,
        tier: "secondary"
      },
      {
        pageId: "013",
        activePageIds: ["013", "014"],
        label: "Tenant directory",
        description: "Tenant list and tenant creation.",
        icon: Building2,
        tier: "secondary"
      },
      {
        pageId: "015",
        activePageIds: ["015", "016", "017", "018"],
        label: "Tenant setup",
        description: "Tenant setup, team, policies, and users.",
        icon: UsersRound,
        tier: "secondary"
      }
    ]
  },
  {
    key: "client_workspace",
    icon: Home,
    items: [
      {
        pageId: "019",
        label: "Client portal",
        description: "Client-safe dashboard and next visible work.",
        icon: Home
      },
      {
        pageId: "020",
        label: "Mobile client view",
        description: "Responsive client-safe experience checkpoint.",
        icon: FileText,
        tier: "secondary"
      },
      {
        pageId: "021",
        activePageIds: ["021", "022", "023", "024", "025", "026", "031", "032"],
        label: "Client profile",
        description: "Client facts, relationships, entities, wealth map, and actions.",
        icon: UsersRound
      }
    ]
  },
  {
    key: "evidence",
    icon: FolderOpen,
    items: [
      {
        pageId: "027",
        label: "Document library",
        description: "Client documents already in the workspace.",
        icon: FileText
      },
      {
        pageId: "028",
        activePageIds: ["028", "029", "030"],
        label: "Evidence intake",
        description: "Upload, extraction review, and verification queue.",
        icon: Upload
      },
      {
        pageId: "046",
        activePageIds: ["046", "047"],
        label: "Evidence vault",
        description: "Auditable evidence records and record detail.",
        icon: Archive
      }
    ]
  },
  {
    key: "advisory_workbench",
    icon: BriefcaseBusiness,
    items: [
      {
        pageId: "033",
        label: "Signal review",
        description: "New portfolio and advice signals.",
        icon: Scale
      },
      {
        pageId: "034",
        activePageIds: ["034", "035"],
        label: "Workbench",
        description: "Advisor work area with trigger detail folded in.",
        icon: ClipboardList
      },
      {
        pageId: "036",
        activePageIds: ["036", "037"],
        label: "Advisor approval",
        description: "Human review before compliance release.",
        icon: BadgeCheck
      }
    ]
  },
  {
    key: "elevated_workflows",
    icon: ShieldCheck,
    items: [
      {
        pageId: "064",
        activePageIds: ["064", "065", "066", "067"],
        label: "KYC and suitability",
        description: "KYC, source-of-wealth, suitability and IPS review gates.",
        icon: ShieldCheck
      },
      {
        pageId: "068",
        activePageIds: ["068", "069"],
        label: "Review monitoring",
        description: "Review calendar and rebalance monitoring without automatic advice.",
        icon: CalendarClock
      },
      {
        pageId: "070",
        activePageIds: ["070", "071"],
        label: "Committee review",
        description: "Peer review and decision-room context before downstream release.",
        icon: Gavel
      }
    ]
  },
  {
    key: "compliance",
    icon: ShieldCheck,
    items: [
      {
        pageId: "038",
        label: "Compliance queue",
        description: "Review queue for controlled release work.",
        icon: ShieldCheck
      },
      {
        pageId: "039",
        label: "Compliance review",
        description: "Detailed review before any client-visible release.",
        icon: FileSearch
      },
      {
        pageId: "040",
        activePageIds: ["040", "041", "042"],
        label: "Release controls",
        description: "Release, block, request evidence, and audit exceptions.",
        icon: FileCheck2
      }
    ]
  },
  {
    key: "governance",
    icon: Landmark,
    items: [
      {
        pageId: "008",
        label: "Advice boundary",
        description: "Policy guardrail for advice limits.",
        icon: Scale,
        tier: "secondary"
      },
      {
        pageId: "048",
        label: "Governance users",
        description: "Manage users in the governed workspace.",
        icon: UsersRound
      },
      {
        pageId: "049",
        label: "Roles",
        description: "Role management and permissions.",
        icon: KeyRound
      },
      {
        pageId: "050",
        label: "Access requests",
        description: "Review and decide permission requests.",
        icon: LockKeyhole
      },
      {
        pageId: "051",
        label: "Audit history",
        description: "Trace sensitive access and governance actions.",
        icon: Archive
      }
    ]
  },
  {
    key: "decisions",
    icon: Archive,
    items: [
      {
        pageId: "043",
        label: "Decision list",
        description: "Submitted and in-progress advice decisions.",
        icon: ClipboardCheck
      },
      {
        pageId: "044",
        activePageIds: ["044", "045"],
        label: "Decision room",
        description: "Decision detail with submitted state folded in.",
        icon: BadgeCheck
      }
    ]
  },
  {
    key: "export",
    icon: Upload,
    items: [
      {
        pageId: "054",
        label: "New export",
        description: "Start a client-safe export package.",
        icon: Upload
      },
      {
        pageId: "055",
        label: "Scope selection",
        description: "Choose what enters the export.",
        icon: ClipboardList
      },
      {
        pageId: "056",
        label: "Redaction",
        description: "Apply redaction policy before preview.",
        icon: FileSearch
      },
      {
        pageId: "057",
        label: "Preview",
        description: "Inspect the package before download.",
        icon: FileCheck2
      },
      {
        pageId: "058",
        label: "Download / share",
        description: "Download or share the reviewed package.",
        icon: Archive
      }
    ]
  },
  {
    key: "communication",
    icon: MessageSquare,
    tier: "support",
    items: [
      {
        pageId: "052",
        label: "Communication context",
        description: "Message and call context without advice or release authority.",
        icon: MessageSquare
      },
      {
        pageId: "053",
        label: "Call trigger matrix",
        description: "Trigger context that routes work without sending advice.",
        icon: ClipboardList
      }
    ]
  },
  {
    key: "ops",
    icon: Gauge,
    tier: "support",
    items: [
      {
        pageId: "059",
        label: "Ops queues",
        description: "Support and recovery queue for blocked workflow work.",
        icon: Gauge
      },
      {
        pageId: "060",
        label: "SLA escalation",
        description: "Operational escalation detail without release or approval bypass.",
        icon: CalendarClock
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
