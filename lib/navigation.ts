import {
  Activity,
  Archive,
  BadgeCheck,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  LockKeyhole,
  MessageSquareText,
  Scale,
  ShieldCheck,
  Upload,
  UsersRound
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  groupedScreenRoutes,
  routeToSmokePath,
  type NavigationGroupKey
} from "@/lib/route-registry";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type NavigationGroup = {
  key: NavigationGroupKey;
  label: string;
  icon: LucideIcon;
  items: NavigationItem[];
};

const groupIcons: Record<NavigationGroupKey, LucideIcon> = {
  access: LockKeyhole,
  platform: ShieldCheck,
  tenant_setup: UsersRound,
  client_workspace: Home,
  wealth_actions: LayoutDashboard,
  advisory_workflow: BriefcaseBusiness,
  decisions_evidence: BadgeCheck,
  communication: MessageSquareText,
  export: Upload,
  operations: Activity
};

const itemIcons: Partial<Record<NavigationGroupKey, LucideIcon>> = {
  client_workspace: FileText,
  decisions_evidence: Archive,
  advisory_workflow: Scale,
  operations: ClipboardList
};

const compactNavigationLabels: Record<string, string> = {
  "002": "MFA",
  "012": "Export Templates",
  "037": "Advisor Detail",
  "039": "Compliance Review",
  "041": "Evidence Request",
  "042": "Audit Log",
  "058": "Export Download",
  "063": "States Reference"
};

export const navigationGroups: NavigationGroup[] = groupedScreenRoutes.map((group) => ({
  key: group.key,
  label: group.label,
  icon: groupIcons[group.key],
  items: group.routes.map((route) => ({
    label: compactNavigationLabels[route.pageId] ?? route.title,
    href: routeToSmokePath(route.route),
    icon: itemIcons[group.key] ?? groupIcons[group.key]
  }))
}));
