import { routeScopeForPageId, routeToSmokePath, screenRoutes } from "@/lib/route-registry";
import { uxRoutePolicyForPageId } from "@/lib/ux-route-policy";

export type UxHubPriorityTone = "blue" | "gold" | "green" | "red";

export type UxHubPriorityCard = {
  detail: string;
  label: string;
  status: string;
  tone: UxHubPriorityTone;
};

export type UxHubQueueItem = {
  detail: string;
  href: string;
  label: string;
};

export type UxHubGuidance = {
  nextWorkQueue: UxHubQueueItem[];
  primaryQueueItem: UxHubQueueItem;
  priorityCards: UxHubPriorityCard[];
  safetyNote: string;
  statusStrip: string[];
};

const routeByPageId = new Map<string, (typeof screenRoutes)[number]>(screenRoutes.map((route) => [route.pageId, route]));

function linkForPageId(pageId: string, label: string, detail: string): UxHubQueueItem {
  const route = routeByPageId.get(pageId);

  if (!route) {
    throw new Error(`UX-HUB route ${pageId} is missing from the route registry.`);
  }

  return {
    detail,
    href: routeToSmokePath(route.route),
    label,
  };
}

function defaultHubCards(pageId: string): UxHubPriorityCard[] {
  const policy = uxRoutePolicyForPageId(pageId);

  return [
    {
      detail: "Use this page to orient, prioritize and move into the next eligible work surface.",
      label: "Hub role",
      status: policy.pageType,
      tone: "blue",
    },
    {
      detail: policy.safetyReminder,
      label: "Safety boundary",
      status: policy.routePolicyLabels.includes("CLIENT_SAFE_ONLY") ? "Client-safe" : "Internal",
      tone: policy.routePolicyLabels.includes("CLIENT_SAFE_ONLY") ? "green" : "gold",
    },
    {
      detail: "Route visibility never grants payload visibility, release authority or export approval.",
      label: "Authority",
      status: routeScopeForPageId(pageId),
      tone: "red",
    },
  ];
}

const hubGuidanceByPageId: Record<string, UxHubGuidance> = {
  "013": {
    nextWorkQueue: [
      linkForPageId("014", "Create tenant", "Move from directory orientation into the tenant setup wizard."),
      linkForPageId("015", "Continue tenant setup", "Review setup readiness without changing release or export gates."),
      linkForPageId("050", "Review access requests", "Handle scoped governance work from the proper workbench."),
    ],
    primaryQueueItem: linkForPageId("014", "Create tenant", "Move from directory orientation into the tenant setup wizard."),
    priorityCards: defaultHubCards("013"),
    safetyNote: "Tenant-directory hub actions do not expand RBAC payloads, suppress audit or force client visibility.",
    statusStrip: ["Directory overview", "Setup handoff", "Governance scope only"],
  },
  "015": {
    nextWorkQueue: [
      linkForPageId("016", "Assign team", "Continue setup in the team assignment workbench."),
      linkForPageId("017", "Review policies", "Configure tenant policy context without downstream gate override."),
      linkForPageId("018", "Manage users", "Move user access work to the scoped access workbench."),
    ],
    primaryQueueItem: linkForPageId("016", "Assign team", "Continue setup in the team assignment workbench."),
    priorityCards: defaultHubCards("015"),
    safetyNote: "Tenant setup is support context only; it cannot release advice, approve exports or bypass audit.",
    statusStrip: ["Setup overview", "Next setup task", "No gate override"],
  },
  "019": {
    nextWorkQueue: [
      linkForPageId("027", "Open documents", "Review client-safe document status and evidence requests."),
      linkForPageId("028", "Upload evidence", "Provide source material without claiming evidence sufficiency."),
      linkForPageId("046", "Open evidence vault", "Inspect released or permitted evidence context only."),
    ],
    primaryQueueItem: linkForPageId("027", "Open documents", "Review client-safe document status and evidence requests."),
    priorityCards: [
      {
        detail: "Show released or redacted client-safe information only.",
        label: "Released state",
        status: "Client-safe",
        tone: "green",
      },
      {
        detail: "Unreleased advice, internal rationale and compliance notes remain hidden.",
        label: "Hidden state",
        status: "Fail closed",
        tone: "red",
      },
      {
        detail: "Upload or response actions are scoped inputs, not approval or evidence sufficiency.",
        label: "Next action",
        status: "Scoped",
        tone: "blue",
      },
    ],
    safetyNote: "Client hub content must never leak AI drafts, internal notes, compliance comments or unreleased evidence.",
    statusStrip: ["Released summary", "Evidence request", "Client-safe only"],
  },
  "020": {
    nextWorkQueue: [
      linkForPageId("019", "Open client portal", "Use the full client hub for the same released view."),
      linkForPageId("027", "Review documents", "Inspect document status without exposing internal review notes."),
      linkForPageId("046", "Open evidence", "Move to evidence context only when permitted for the actor."),
    ],
    primaryQueueItem: linkForPageId("019", "Open client portal", "Use the full client hub for the same released view."),
    priorityCards: defaultHubCards("020"),
    safetyNote: "Mobile client home is a compact orientation surface; it does not expose internal workflow detail.",
    statusStrip: ["Mobile overview", "Released view", "No internal leakage"],
  },
  "024": {
    nextWorkQueue: [
      linkForPageId("025", "Create entity", "Move entity creation into the dedicated work surface."),
      linkForPageId("026", "Inspect entity", "Open entity detail context without changing downstream gates."),
      linkForPageId("031", "Review wealth map", "Use the map hub for relationship orientation."),
    ],
    primaryQueueItem: linkForPageId("025", "Create entity", "Move entity creation into the dedicated work surface."),
    priorityCards: defaultHubCards("024"),
    safetyNote: "Entity list orientation does not grant broader object scope or mutation authority.",
    statusStrip: ["Entity overview", "Scoped handoff", "No payload expansion"],
  },
  "031": {
    nextWorkQueue: [
      linkForPageId("021", "Review profile", "Move from map orientation into client facts."),
      linkForPageId("024", "Open entities", "Use entity list for scoped object work."),
      linkForPageId("032", "Review actions", "Inspect next actions without implying release."),
    ],
    primaryQueueItem: linkForPageId("021", "Review profile", "Move from map orientation into client facts."),
    priorityCards: defaultHubCards("031"),
    safetyNote: "Wealth map context can orient relationships but must not become a full workflow or release surface.",
    statusStrip: ["Map orientation", "Context drawer", "Scoped next work"],
  },
  "034": {
    nextWorkQueue: [
      linkForPageId("035", "Open trigger detail", "Inspect the next review item before any advisor handoff."),
      linkForPageId("036", "Send to advisor review", "Move to advisor approval without claiming compliance release."),
      linkForPageId("038", "Open compliance queue", "Use compliance only after preconditions are ready."),
    ],
    primaryQueueItem: linkForPageId("035", "Open trigger detail", "Inspect the next review item before any advisor handoff."),
    priorityCards: [
      {
        detail: "Prioritize the next draft or signal that needs human review.",
        label: "Next review",
        status: "Queued",
        tone: "blue",
      },
      {
        detail: "Evidence gaps stay visible and block release until resolved.",
        label: "Evidence",
        status: "Required",
        tone: "gold",
      },
      {
        detail: "Draft and rationale content remains internal and never client-visible from the hub.",
        label: "Advice boundary",
        status: "Internal only",
        tone: "red",
      },
    ],
    safetyNote: "Advisory hub may hand off to review, but advisor approval is still not compliance release.",
    statusStrip: ["Priority review", "Evidence gaps", "Internal draft only"],
  },
  "043": {
    nextWorkQueue: [
      linkForPageId("044", "Open decision room", "Review the decision in the detail route before any downstream state."),
      linkForPageId("046", "Open evidence vault", "Check evidence context without exposing internal rationale."),
      linkForPageId("051", "Review audit history", "Inspect traceability from the governance workbench."),
    ],
    primaryQueueItem: linkForPageId("044", "Open decision room", "Review the decision in the detail route before any downstream state."),
    priorityCards: defaultHubCards("043"),
    safetyNote: "Decision list is a handoff hub; decision submission is not client acceptance.",
    statusStrip: ["Decision overview", "Evidence linked", "No client acceptance claim"],
  },
  "054": {
    nextWorkQueue: [
      linkForPageId("055", "Select scope", "Begin export scope selection before redaction or preview."),
      linkForPageId("056", "Review redaction", "Apply redaction before any preview or package action."),
      linkForPageId("057", "Open preview", "Preview is inspection only and not approval."),
    ],
    primaryQueueItem: linkForPageId("055", "Select scope", "Begin export scope selection before redaction or preview."),
    priorityCards: [
      {
        detail: "Scope must be selected before redaction, preview or delivery.",
        label: "Scope",
        status: "First",
        tone: "blue",
      },
      {
        detail: "Redaction and approval remain separate from preview and download.",
        label: "Lifecycle",
        status: "Separated",
        tone: "gold",
      },
      {
        detail: "Download and share remain outside this hub.",
        label: "Delivery",
        status: "Not here",
        tone: "red",
      },
    ],
    safetyNote: "Export hub cannot approve, download, share or imply client acceptance.",
    statusStrip: ["Scope first", "Redaction next", "Preview is not approval"],
  },
};

export function uxHubGuidanceForPageId(pageId: string) {
  const policy = uxRoutePolicyForPageId(pageId);
  if (policy.pageType !== "Hub") return null;

  return hubGuidanceByPageId[pageId] ?? null;
}
