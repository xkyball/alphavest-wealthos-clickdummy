import { routeImplementationAccessDecision, routeScopeForPageId } from "../route-registry";

export const wave02SourceLock = {
  acceptedSource: "ALPHAVEST_PROCESS_RUNTIME_BACKBONE",
  targetBranch: "full-workflow",
  forbiddenTargetTruth: ["main", "uploaded source snapshots", "visual media packages", "previous bundles"],
  noGenerationRules: ["NO_SCREEN_GENERATION", "NO_STATE_SCREEN_GENERATION", "NO_IMAGE_GENERATION"],
  noBlindSchemaReplacement: true,
} as const;

export const wave02HoldRoutePageIds = ["064", "065", "066", "067", "069", "070", "071"] as const;

export const wave02BlockedJourneys = [
  {
    journeyId: "BP-070",
    label: "Committee review hold surface",
    reason: "Committee UI routes remain registered-only until a process-backed committee command slice exists.",
    routePageIds: ["070", "071"],
  },
  {
    journeyId: "BP-071",
    label: "Regulated KYC / SoW / Suitability / IPS hold surface",
    reason: "Regulated suitability routes remain registered-only until backed by process commands, history and audit proof.",
    routePageIds: ["064", "065", "066", "067"],
  },
] as const;

export const wave02ExecutableJourneyIds = ["BP-001", "BP-017", "BP-020", "BP-024", "BP-046", "BP-088", "BP-099"] as const;

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
