import {
  Archive,
  BadgeCheck,
  Building2,
  BriefcaseBusiness,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  FileSearch,
  FileText,
  FolderOpen,
  Home,
  KeyRound,
  Landmark,
  LockKeyhole,
  Scale,
  Settings,
  ShieldCheck,
  Upload,
  UsersRound
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  routePatternToSegments,
  routeScopeForPageId,
  routeToSmokePath,
  screenRoutes,
  type RouteScopeLabel
} from "@/lib/route-registry";

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
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
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
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
  tier?: NavigationGroupTier;
  items: readonly NavigationItemDefinition[];
};

const navigationDefinitions: readonly NavigationGroupDefinition[] = [
  {
    key: "home",
    label: "Home",
    description: "Start from the client-facing workspace and demo context.",
    icon: Home,
    items: [
      {
        pageId: "019",
        label: "Client portal",
        description: "Client dashboard and next visible work.",
        icon: Home
      },
      {
        pageId: "020",
        label: "Mobile client view",
        description: "Responsive client experience checkpoint.",
        icon: FileText,
        tier: "secondary"
      }
    ]
  },
  {
    key: "client_evidence",
    label: "Client & Evidence",
    description: "Understand the client, collect documents, and verify evidence.",
    icon: FolderOpen,
    items: [
      {
        pageId: "021",
        activePageIds: ["021", "022", "023", "024", "025", "026", "031", "032"],
        label: "Client profile",
        description: "Client facts, relationships, entities, wealth map, and actions.",
        icon: UsersRound
      },
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
    key: "advisory_work",
    label: "Advisory Work",
    description: "Review signals, build the recommendation, and request approval.",
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
    key: "compliance_release",
    label: "Compliance & Release",
    description: "Validate, release, block, or request more evidence.",
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
    key: "decisions_audit",
    label: "Decisions & Audit",
    description: "Inspect decisions, submission state, evidence, and access audit.",
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
    key: "governance",
    label: "Governance",
    description: "Control users, roles, permissions, and advice boundaries.",
    icon: Landmark,
    items: [
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
        pageId: "008",
        label: "Advice boundary",
        description: "Policy guardrail for advice limits.",
        icon: Scale,
        tier: "secondary"
      },
      {
        pageId: "010",
        label: "Security",
        description: "Security configuration and sensitive controls.",
        icon: ShieldCheck,
        tier: "secondary"
      }
    ]
  },
  {
    key: "export",
    label: "Export",
    description: "Prepare a controlled package with scope, redaction, preview, and download.",
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
    key: "soft_unlock",
    label: "Soft-unlocked routes",
    description: "Extended route access with UI-only safety boundaries still in force.",
    icon: ClipboardList,
    tier: "support",
    items: [
      {
        pageId: "052",
        label: "Communication Centre",
        description: "Client communication workspace; delivery authority remains gated.",
        icon: FileText,
        tier: "secondary"
      },
      {
        pageId: "053",
        label: "Call Trigger",
        description: "Communication trigger detail without release or advice authority.",
        icon: ClipboardList,
        tier: "secondary"
      },
      {
        pageId: "059",
        label: "Ops Queues",
        description: "Operational queue view with no client-release authority.",
        icon: Archive,
        tier: "secondary"
      },
      {
        pageId: "060",
        label: "SLA Monitoring",
        description: "Service monitoring view for operational follow-up.",
        icon: FileSearch,
        tier: "secondary"
      },
      {
        pageId: "061",
        label: "Service Blueprint",
        description: "Reference route visible as an internal operating map.",
        icon: FileText,
        tier: "secondary"
      },
      {
        pageId: "062",
        label: "Roadmap",
        description: "Reference roadmap visible without implementation claims.",
        icon: ClipboardList,
        tier: "secondary"
      },
      {
        pageId: "063",
        label: "States",
        description: "State reference visible without lifecycle proof overclaim.",
        icon: BadgeCheck,
        tier: "secondary"
      },
      {
        pageId: "064",
        label: "KYC / AML Review",
        description: "Regulated review surface; no automatic advice or release.",
        icon: ShieldCheck,
        tier: "secondary"
      },
      {
        pageId: "065",
        label: "Source of Wealth",
        description: "Source-of-wealth evidence review with compliance gates intact.",
        icon: FileSearch,
        tier: "secondary"
      },
      {
        pageId: "066",
        label: "Suitability Profile",
        description: "Suitability data view without client-visible advice.",
        icon: Scale,
        tier: "secondary"
      },
      {
        pageId: "067",
        label: "IPS Mandate",
        description: "Mandate workspace; acknowledgement and compliance gates remain required.",
        icon: FileCheck2,
        tier: "secondary"
      },
      {
        pageId: "068",
        label: "Review Calendar",
        description: "Internal review rhythm with no automatic advice execution.",
        icon: ClipboardCheck,
        tier: "secondary"
      },
      {
        pageId: "069",
        label: "Rebalance Monitoring",
        description: "Monitoring view; rebalance execution remains disabled.",
        icon: Scale,
        tier: "secondary"
      },
      {
        pageId: "070",
        label: "Committee Review Queue",
        description: "Committee queue visible while client release stays downstream.",
        icon: UsersRound,
        tier: "secondary"
      },
      {
        pageId: "071",
        label: "Committee Review Detail",
        description: "Committee detail visible with dissent and release gates preserved.",
        icon: BadgeCheck,
        tier: "secondary"
      }
    ]
  },
  {
    key: "setup_admin",
    label: "Setup",
    description: "Operational setup and templates, kept behind the product workflow.",
    icon: Settings,
    tier: "support",
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

export const navigationGroups: NavigationGroup[] = navigationDefinitions.map((group) => ({
  key: group.key,
  label: group.label,
  description: group.description,
  icon: group.icon,
  tier: group.tier ?? "core",
  items: group.items.map(navigationItemForDefinition)
}));

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
