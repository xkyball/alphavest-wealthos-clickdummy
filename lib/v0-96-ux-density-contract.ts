import {
  routeToSmokePath,
  screenRoutes,
  type RouteScopeLabel,
  type ScreenRoute,
} from "@/lib/route-registry";
import {
  uxPageContractForRoute,
  type UxPageContract,
} from "@/lib/ux-page-contract";
import type { UxDensityTier } from "@/lib/ux-route-policy";

export type V096PageType =
  | "HUB"
  | "WORKBENCH_QUEUE"
  | "DETAIL_REVIEW"
  | "DECISION_ROOM"
  | "CLIENT_PROJECTION"
  | "REFERENCE"
  | "HOLD_GUARD";

export type V096UxDensityContract = {
  currentPath: string;
  densityTier: UxDensityTier;
  pageId: string;
  routeScope: RouteScopeLabel;
  sourcePageType: UxPageContract["pageType"];
  sourcePath: string;
  v096PageType: V096PageType;
  v096RouteLabel: string;
};

const v096PageTypeByPageId: Record<string, V096PageType> = {
  "019": "CLIENT_PROJECTION",
  "027": "WORKBENCH_QUEUE",
  "034": "WORKBENCH_QUEUE",
  "035": "DETAIL_REVIEW",
  "037": "DETAIL_REVIEW",
  "039": "DECISION_ROOM",
  "042": "DETAIL_REVIEW",
  "055": "WORKBENCH_QUEUE",
  "056": "DETAIL_REVIEW",
  "057": "DECISION_ROOM",
  "061": "REFERENCE",
  "063": "REFERENCE",
};

const v096RouteLabelsByPageId: Record<string, string> = {
  "019": "/portal",
  "027": "/documents",
  "034": "/workbench",
  "035": "/workbench/triggers/:id",
  "037": "/advisor-approval/:id",
  "039": "/compliance/:id/review",
  "042": "/compliance/:id/audit",
  "055": "/export/:id/scope",
  "056": "/export/:id/redaction",
  "057": "/export/:id/preview",
  "061": "REFERENCE",
  "063": "REFERENCE",
};

export const v096TouchedDensityPageIds = [
  "027",
  "034",
  "035",
  "037",
  "039",
  "042",
  "055",
  "056",
  "057",
  "019",
] as const;

const routeByPageId = new Map<string, ScreenRoute>(screenRoutes.map((route) => [route.pageId, route]));

export function v096UxDensityContractForPageId(pageId: string): V096UxDensityContract {
  const route = routeByPageId.get(pageId);

  if (!route) {
    throw new Error(`V0.96 density contract route ${pageId} is missing from the route registry.`);
  }

  const contract = uxPageContractForRoute(route);
  const v096PageType = v096PageTypeByPageId[pageId] ?? (
    contract.routeScope === "REFERENCE_ONLY"
      ? "REFERENCE"
      : contract.routeScope === "HOLD_PENDING_DECISION"
        ? "HOLD_GUARD"
        : contract.pageType === "Hub"
          ? "HUB"
          : contract.pageType === "Detail" || contract.pageType === "Modal"
            ? "DETAIL_REVIEW"
            : "WORKBENCH_QUEUE"
  );

  return {
    currentPath: routeToSmokePath(route.route),
    densityTier: contract.densityTier,
    pageId,
    routeScope: contract.routeScope,
    sourcePageType: contract.pageType,
    sourcePath: route.route,
    v096PageType,
    v096RouteLabel: v096RouteLabelsByPageId[pageId] ?? route.route,
  };
}

export const v096TouchedDensityContracts = v096TouchedDensityPageIds.map(v096UxDensityContractForPageId);
