import {
  routeImplementationAccessDecision,
  routeScopeForPageId,
  screenRoutes,
  type RouteScopeLabel,
  type ScreenRoute,
} from "@/lib/route-registry";

export const domain16ReferencePageIds = ["061", "062", "063"] as const;
export const domain16HeldPageIds = ["064", "065", "066", "067", "070", "071"] as const;
export const domain16ProductivePageIds = ["068", "069"] as const;

export type Domain16ReferencePageId = (typeof domain16ReferencePageIds)[number];
export type Domain16HeldPageId = (typeof domain16HeldPageIds)[number];
export type Domain16ProductivePageId = (typeof domain16ProductivePageIds)[number];
export type Domain16PageId = Domain16ReferencePageId | Domain16HeldPageId | Domain16ProductivePageId;

export type Domain16RouteClass = "held_pending_decision" | "productive_operational" | "reference_only";

type Domain16RouteBacking = {
  auditPersistence: string;
  commandApi: string;
  commandService: string;
  dbModels: readonly string[];
  readApi: string;
  readService: string;
  screenComponent: string;
};

export const domain16ProductiveRouteBacking = {
  "068": {
    auditPersistence: "AuditEvent rows written by review-monitoring workflow actions",
    commandApi: "app/api/review-monitoring/actions/route.ts",
    commandService: "lib/review-monitoring-workflow-actions.ts",
    dbModels: ["ReviewSchedule", "QueueItem", "Trigger", "ActionItem", "Recommendation", "AuditEvent"],
    readApi: "app/api/review-monitoring/route.ts",
    readService: "lib/review-monitoring-service.ts",
    screenComponent: "components/review-monitoring-screen.tsx",
  },
  "069": {
    auditPersistence: "AuditEvent rows written by rebalance monitoring workflow actions",
    commandApi: "app/api/review-monitoring/actions/route.ts",
    commandService: "lib/review-monitoring-workflow-actions.ts",
    dbModels: ["Trigger", "ActionItem", "QueueItem", "Recommendation", "AuditEvent"],
    readApi: "app/api/review-monitoring/route.ts?surface=rebalance",
    readService: "lib/review-monitoring-service.ts",
    screenComponent: "components/review-monitoring-screen.tsx",
  },
} as const satisfies Record<Domain16ProductivePageId, Domain16RouteBacking>;

const expectedScopes: Record<Domain16PageId, RouteScopeLabel> = {
  "061": "REFERENCE_ONLY",
  "062": "REFERENCE_ONLY",
  "063": "REFERENCE_ONLY",
  "064": "HOLD_PENDING_DECISION",
  "065": "HOLD_PENDING_DECISION",
  "066": "HOLD_PENDING_DECISION",
  "067": "HOLD_PENDING_DECISION",
  "068": "MVP",
  "069": "MVP_SUPPORT",
  "070": "HOLD_PENDING_DECISION",
  "071": "HOLD_PENDING_DECISION",
};

export function domain16RouteClassForPageId(pageId: Domain16PageId): Domain16RouteClass {
  if ((domain16ReferencePageIds as readonly string[]).includes(pageId)) return "reference_only";
  if ((domain16HeldPageIds as readonly string[]).includes(pageId)) return "held_pending_decision";
  return "productive_operational";
}

export function domain16RouteByPageId(pageId: Domain16PageId): ScreenRoute {
  const route = screenRoutes.find((candidate) => candidate.pageId === pageId);
  if (!route) {
    throw new Error(`DOMAIN-16 route ${pageId} is missing from the route registry.`);
  }

  return route;
}

export function allDomain16PageIds() {
  return [...domain16ReferencePageIds, ...domain16HeldPageIds, ...domain16ProductivePageIds] as const;
}

export function evaluateDomain16RouteDifferentiation() {
  return allDomain16PageIds().map((pageId) => {
    const route = domain16RouteByPageId(pageId);
    const decision = routeImplementationAccessDecision(route);
    const expectedClass = domain16RouteClassForPageId(pageId);

    return {
      accessMode: decision.accessMode,
      expectedClass,
      expectedScope: expectedScopes[pageId],
      implementationShellAccessible: decision.implementationShellAccessible,
      pageId,
      route,
      scope: routeScopeForPageId(pageId),
      serviceBacking: expectedClass === "productive_operational" ? domain16ProductiveRouteBacking[pageId as Domain16ProductivePageId] : undefined,
    };
  });
}

export function domain16ContractViolations() {
  return evaluateDomain16RouteDifferentiation().flatMap((row) => {
    const violations: string[] = [];

    if (row.scope !== row.expectedScope) {
      violations.push(`${row.pageId}: expected scope ${row.expectedScope}, got ${row.scope}`);
    }

    if (row.expectedClass !== "productive_operational" && row.implementationShellAccessible) {
      violations.push(`${row.pageId}: protected DOMAIN-16 route became implementation-shell accessible`);
    }

    if (row.expectedClass === "productive_operational" && !row.implementationShellAccessible) {
      violations.push(`${row.pageId}: productive DOMAIN-16 route is no longer implementation-shell accessible`);
    }

    if (row.expectedClass === "productive_operational" && !row.serviceBacking) {
      violations.push(`${row.pageId}: productive DOMAIN-16 route has no service/DB/workflow backing contract`);
    }

    return violations;
  });
}
