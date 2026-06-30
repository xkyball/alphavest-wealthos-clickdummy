import type { ScreenRoute, VisualMode } from "@/lib/route-registry";

export const forbiddenVisualChromeTerms = [
  "Stage 05",
  "Stage 06",
  "Detailed screen implementations",
  "public/reference",
  "Visual reference",
  "Annotation rail",
  "Route label"
] as const;

export type VisualState =
  | "base"
  | "approval"
  | "block"
  | "confirm"
  | "drawer"
  | "invite"
  | "permission"
  | "release";

export const visualModeCaptureStates: Partial<Record<VisualMode, VisualState>> = {
  BLOCK_OR_REQUEST_EVIDENCE_MODAL_STATE: "block",
  DOWNLOAD_CONFIRMATION_STATE: "confirm",
  PAGE_WITH_APPROVAL_OR_EXPORT_CONFIRMATION_MODAL: "approval",
  PAGE_WITH_DECISION_CONFIRMATION_MODAL_OPTION: "approval",
  PAGE_WITH_INVITE_ROLE_MODAL: "invite",
  PAGE_WITH_PERMISSION_MODAL: "permission",
  PAGE_WITH_ROLE_DRAWER_AND_SECOND_CONFIRMATION_MODAL: "confirm",
  PAGE_WITH_SECOND_CONFIRMATION_MODAL: "confirm",
  PAGE_WITH_SIDE_DRAWER: "drawer",
  PAGE_WITH_USER_DRAWER_OR_MODAL: "drawer",
  RELEASE_CONFIRMATION_MODAL_STATE: "release"
};

export function normalizeVisualState(value: string | string[] | undefined): VisualState | undefined {
  const raw = Array.isArray(value) ? value[0] : value;

  if (!raw) {
    return undefined;
  }

  const normalized = raw.trim().toLowerCase();
  const states: VisualState[] = ["approval", "base", "block", "confirm", "drawer", "invite", "permission", "release"];

  return states.find((state) => state === normalized);
}

export function visualStateForRoute(route: ScreenRoute, requestedState?: VisualState): VisualState {
  if (requestedState) {
    return requestedState;
  }

  return "base";
}
