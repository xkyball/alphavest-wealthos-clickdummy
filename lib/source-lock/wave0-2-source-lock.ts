import { routeImplementationAccessDecision, routeScopeForPageId } from "../route-registry";

export const wave02SourceLock = {
  acceptedSource: "ALPHAVEST_JOURNEY_FIRST_BOC_CTES_TICKET_ARCHITECT_OUTPUT_WAVE_0_2",
  targetBranch: "full-workflow",
  forbiddenTargetTruth: ["main", "uploaded source snapshots", "visual media packages", "previous bundles"],
  noGenerationRules: ["NO_SCREEN_GENERATION", "NO_STATE_SCREEN_GENERATION", "NO_IMAGE_GENERATION"],
  noBlindSchemaReplacement: true,
} as const;

export const wave02HoldRoutePageIds = ["064", "065", "066", "067", "069", "070", "071"] as const;

export const wave02BlockedJourneys = [
  {
    journeyId: "MJ-004",
    label: "Committee review",
    reason: "Hold unlock was rejected for Wave 0-2; committee routes remain registered-only.",
    routePageIds: ["070", "071"],
  },
  {
    journeyId: "MJ-007",
    label: "KYC / SoW / Suitability / IPS",
    reason: "Hold unlock was rejected for Wave 0-2; elevated KYC and suitability routes remain registered-only.",
    routePageIds: ["064", "065", "066", "067"],
  },
] as const;

export const wave02ExecutableJourneyIds = ["MJ-001", "MJ-002", "MJ-003", "MJ-005", "MJ-006", "MJ-010", "MJ-012"] as const;

export type Wave02JourneyId =
  | (typeof wave02BlockedJourneys)[number]["journeyId"]
  | (typeof wave02ExecutableJourneyIds)[number];

export function wave02BlockedJourneyFor(journeyId: string) {
  return wave02BlockedJourneys.find((journey) => journey.journeyId === journeyId);
}

export function isWave02JourneyExecutable(journeyId: string) {
  return wave02ExecutableJourneyIds.some((candidate) => candidate === journeyId) && !wave02BlockedJourneyFor(journeyId);
}

export function assertWave02JourneyExecutable(journeyId: string) {
  const blocked = wave02BlockedJourneyFor(journeyId);

  if (blocked) {
    throw new Error(`${journeyId} is blocked by Wave 0-2 source lock: ${blocked.reason}`);
  }

  if (!isWave02JourneyExecutable(journeyId)) {
    throw new Error(`${journeyId} is not authorized for Wave 0-2 execution.`);
  }
}

export function wave02HoldRouteAssertions() {
  return wave02HoldRoutePageIds.map((pageId) => ({
    pageId,
    routeScope: routeScopeForPageId(pageId),
    access: routeImplementationAccessDecision({ pageId }),
  }));
}
