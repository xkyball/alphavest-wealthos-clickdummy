import {
  routeImplementationAccessDecision,
  routeScopeLabels,
  routeWorksetIntegrity,
  screenRoutes,
  type RouteScopeLabel,
} from "@/lib/route-registry";
import { scfDecisionQueues, scfDoNotImplementRegister } from "@/lib/scf-foundation";

export type ScopeControlMetric = {
  detail: string;
  label: string;
  value: string;
};

export type ScopeControlRow = {
  count: number;
  label: string;
  status: "active" | "held" | "reference" | "static";
  treatment: string;
};

export type StaticWorkspaceControl = {
  id: string;
  location: string;
  name: string;
  treatment: string;
};

export const staticWorkspaceControls: StaticWorkspaceControl[] = [
  {
    id: "app-shell-search",
    location: "Global header",
    name: "Workspace search",
    treatment: "Disabled until tenant-aware indexing and row filtering are implemented.",
  },
  {
    id: "tenant-directory-filters",
    location: "Tenant directory",
    name: "Jurisdiction, tier and status filters",
    treatment: "Displayed as locked static controls; they do not imply live filtering.",
  },
  {
    id: "role-template-create",
    location: "Role templates",
    name: "New role template",
    treatment: "Disabled until governed role lifecycle and second confirmation are wired.",
  },
  {
    id: "tenant-user-filters",
    location: "Tenant users",
    name: "Access filters",
    treatment: "Displayed as locked static controls; row access remains role- and tenant-limited.",
  },
];

const routeScopeOrder: RouteScopeLabel[] = [
  "MVP",
  "MVP_SUPPORT",
  "P1_AFTER_MVP",
  "REFERENCE_ONLY",
  "HOLD_PENDING_DECISION",
];

function statusForScope(scope: RouteScopeLabel): ScopeControlRow["status"] {
  if (scope === "MVP" || scope === "MVP_SUPPORT") return "active";
  if (scope === "REFERENCE_ONLY") return "reference";
  return "held";
}

export function buildScopeControlSnapshot() {
  const firstBuildRoutes = screenRoutes.filter((route) => routeImplementationAccessDecision(route).accessMode === "FIRST_BUILD");
  const registeredOnlyRoutes = screenRoutes.filter((route) => routeImplementationAccessDecision(route).accessMode === "REGISTERED_ONLY");
  const guardedRouteCount = scfDoNotImplementRegister.reduce((sum, entry) => sum + entry.pageIds.length, 0);

  const metrics: ScopeControlMetric[] = [
    {
      label: "Registered workspaces",
      value: String(screenRoutes.length),
      detail: "Every route is assigned to exactly one runtime workset.",
    },
    {
      label: "First-build workspaces",
      value: String(firstBuildRoutes.length),
      detail: "MVP and support routes can render product shells.",
    },
    {
      label: "Registered-only workspaces",
      value: String(registeredOnlyRoutes.length),
      detail: "Deferred, reference and held routes stay out of product implementation.",
    },
    {
      label: "Static controls",
      value: String(scfDecisionQueues.staticExplicit),
      detail: "Visible controls require disabled or static treatment until proven.",
    },
  ];

  const worksetRows: ScopeControlRow[] = routeScopeOrder.map((scope) => ({
    count: routeWorksetIntegrity.counts[scope],
    label: routeScopeLabels[scope],
    status: statusForScope(scope),
    treatment:
      scope === "MVP" || scope === "MVP_SUPPORT"
        ? "Product shell enabled with permission checks."
        : scope === "REFERENCE_ONLY"
          ? "Reference surface only; no product capability is claimed."
          : "Registered only; no mutation or lifecycle capability is exposed.",
  }));

  const guardRows: ScopeControlRow[] = scfDoNotImplementRegister.map((entry) => ({
    count: entry.pageIds.length,
    label: entry.id,
    status: entry.treatment === "static_explicit" ? "static" : entry.treatment === "reference_only" ? "reference" : "held",
    treatment: entry.rule,
  }));

  return {
    guardRows,
    guardedRouteCount,
    metrics,
    staticControls: staticWorkspaceControls,
    worksetRows,
  };
}
