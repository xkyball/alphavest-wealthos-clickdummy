import { routeImplementationAccessDecision, routeScopeForPageId } from "../route-registry";

export const wave02SourceLock = {
  acceptedSource: "ALPHAVEST_PROCESS_RUNTIME_BACKBONE",
  targetBranch: "full-workflow",
  forbiddenTargetTruth: ["main", "uploaded source snapshots", "visual media packages", "previous bundles"],
  noGenerationRules: ["NO_SCREEN_GENERATION", "NO_STATE_SCREEN_GENERATION", "NO_IMAGE_GENERATION"],
  noBlindSchemaReplacement: true,
} as const;

export const wave02HoldRoutePageIds = ["064", "065", "066", "067"] as const;

export const wave02BlockedProcesses = [
  {
    processId: "HOLD-KYC-SUITABILITY",
    label: "Regulated KYC / SoW / Suitability / IPS hold surface",
    reason: "Regulated suitability routes remain registered-only until backed by process commands, history and audit proof.",
    routePageIds: ["064", "065", "066", "067"],
  },
] as const;

export const wave02ExecutableProcessIds = ["BP-001", "BP-017", "BP-020", "BP-024", "BP-046", "BP-054", "BP-055", "BP-088", "BP-099"] as const;

export type Wave02ProcessId =
  | (typeof wave02BlockedProcesses)[number]["processId"]
  | (typeof wave02ExecutableProcessIds)[number];

export function wave02BlockedProcessFor(processId: string) {
  return wave02BlockedProcesses.find((process) => process.processId === processId);
}

export function isWave02ProcessExecutable(processId: string) {
  return wave02ExecutableProcessIds.some((candidate) => candidate === processId) && !wave02BlockedProcessFor(processId);
}

export function assertWave02ProcessExecutable(processId: string) {
  const blocked = wave02BlockedProcessFor(processId);

  if (blocked) {
    throw new Error(`${processId} is blocked by Wave 0-2 source lock: ${blocked.reason}`);
  }

  if (!isWave02ProcessExecutable(processId)) {
    throw new Error(`${processId} is not authorized for Wave 0-2 execution.`);
  }
}

export function wave02HoldRouteAssertions() {
  return wave02HoldRoutePageIds.map((pageId) => ({
    pageId,
    routeScope: routeScopeForPageId(pageId),
    access: routeImplementationAccessDecision({ pageId }),
  }));
}
