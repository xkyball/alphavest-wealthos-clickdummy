import {
  routeImplementationAccessDecision,
  routeScopeForPageId,
  screenRoutes,
  type RouteScopeLabel,
  type ScreenRoute,
} from "@/lib/route-registry";

export const epic16ReferencePageIds = ["061", "062", "063"] as const;
export const epic16HeldPageIds = ["064", "065", "066", "067", "069", "070", "071"] as const;
export const epic16ProductivePageIds = ["068"] as const;

export type Epic16ReferencePageId = (typeof epic16ReferencePageIds)[number];
export type Epic16HeldPageId = (typeof epic16HeldPageIds)[number];
export type Epic16ProductivePageId = (typeof epic16ProductivePageIds)[number];
export type Epic16PageId = Epic16ReferencePageId | Epic16HeldPageId | Epic16ProductivePageId;

export type Epic16RouteClass = "held_pending_decision" | "productive_operational" | "reference_only";

type Epic16RouteBacking = {
  auditPersistence: string;
  commandApi: string;
  commandService: string;
  dbModels: readonly string[];
  readApi: string;
  readService: string;
  screenComponent: string;
};

export const epic16ProductiveRouteBacking = {
  "068": {
    auditPersistence: "AuditEvent rows written by review-monitoring workflow actions",
    commandApi: "app/api/review-monitoring/actions/route.ts",
    commandService: "lib/review-monitoring-workflow-actions.ts",
    dbModels: ["ReviewSchedule", "QueueItem", "Trigger", "ActionItem", "Recommendation", "AuditEvent"],
    readApi: "app/api/review-monitoring/route.ts",
    readService: "lib/review-monitoring-service.ts",
    screenComponent: "components/review-monitoring-screen.tsx",
  },
} as const satisfies Record<Epic16ProductivePageId, Epic16RouteBacking>;

const expectedScopes: Record<Epic16PageId, RouteScopeLabel> = {
  "061": "REFERENCE_ONLY",
  "062": "REFERENCE_ONLY",
  "063": "REFERENCE_ONLY",
  "064": "HOLD_PENDING_DECISION",
  "065": "HOLD_PENDING_DECISION",
  "066": "HOLD_PENDING_DECISION",
  "067": "HOLD_PENDING_DECISION",
  "068": "MVP",
  "069": "HOLD_PENDING_DECISION",
  "070": "HOLD_PENDING_DECISION",
  "071": "HOLD_PENDING_DECISION",
};

export function epic16RouteClassForPageId(pageId: Epic16PageId): Epic16RouteClass {
  if ((epic16ReferencePageIds as readonly string[]).includes(pageId)) return "reference_only";
  if ((epic16HeldPageIds as readonly string[]).includes(pageId)) return "held_pending_decision";
  return "productive_operational";
}

export function epic16RouteByPageId(pageId: Epic16PageId): ScreenRoute {
  const route = screenRoutes.find((candidate) => candidate.pageId === pageId);
  if (!route) {
    throw new Error(`EPIC-16 route ${pageId} is missing from the route registry.`);
  }

  return route;
}

export function allEpic16PageIds() {
  return [...epic16ReferencePageIds, ...epic16HeldPageIds, ...epic16ProductivePageIds] as const;
}

export function evaluateEpic16RouteDifferentiation() {
  return allEpic16PageIds().map((pageId) => {
    const route = epic16RouteByPageId(pageId);
    const decision = routeImplementationAccessDecision(route);
    const expectedClass = epic16RouteClassForPageId(pageId);

    return {
      accessMode: decision.accessMode,
      expectedClass,
      expectedScope: expectedScopes[pageId],
      implementationShellAccessible: decision.implementationShellAccessible,
      pageId,
      route,
      scope: routeScopeForPageId(pageId),
      serviceBacking: expectedClass === "productive_operational" ? epic16ProductiveRouteBacking[pageId as Epic16ProductivePageId] : undefined,
    };
  });
}

export function epic16ContractViolations() {
  return evaluateEpic16RouteDifferentiation().flatMap((row) => {
    const violations: string[] = [];

    if (row.scope !== row.expectedScope) {
      violations.push(`${row.pageId}: expected scope ${row.expectedScope}, got ${row.scope}`);
    }

    if (row.expectedClass !== "productive_operational" && row.implementationShellAccessible) {
      violations.push(`${row.pageId}: protected EPIC-16 route became implementation-shell accessible`);
    }

    if (row.expectedClass === "productive_operational" && !row.implementationShellAccessible) {
      violations.push(`${row.pageId}: productive EPIC-16 route is no longer implementation-shell accessible`);
    }

    if (row.expectedClass === "productive_operational" && !row.serviceBacking) {
      violations.push(`${row.pageId}: productive EPIC-16 route has no service/DB/workflow backing contract`);
    }

    return violations;
  });
}

