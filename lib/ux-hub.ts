import { routeToSmokePath, screenRoutes } from "@/lib/route-registry";

export type UxHubTone = "blue" | "gold" | "green" | "red";

export type UxHubCard = {
  detail: string;
  label: string;
  tone: UxHubTone;
  value: string;
};

export type UxHubLink = {
  detail: string;
  href: string;
  label: string;
};

export type UxHubDefinition = {
  eyebrow: string;
  pageId: string;
  primaryAction: UxHubLink;
  priorityCards: UxHubCard[];
  queue: UxHubLink[];
  safetyNote: string;
  sourceSummaries: string[];
  statusStrip: string[];
  summary: string;
  title: string;
};

const routeByPageId = new Map<string, (typeof screenRoutes)[number]>(screenRoutes.map((route) => [route.pageId, route]));

function linkForPageId(pageId: string, label: string, detail: string): UxHubLink {
  const route = routeByPageId.get(pageId);
  if (!route) throw new Error(`UX-HUB route ${pageId} is missing from the route registry.`);

  return {
    detail,
    href: routeToSmokePath(route.route),
    label,
  };
}

export const uxHubDefinitions: Record<string, UxHubDefinition> = {
  "013": {
    eyebrow: "Setup hub",
    pageId: "013",
    primaryAction: linkForPageId("014", "Open tenant wizard", "Move tenant creation into the dedicated setup wizard."),
    priorityCards: [
      { detail: "Tenant onboarding needs one next owner before deeper setup begins.", label: "Next tenant", tone: "blue", value: "1 ready" },
      { detail: "Access and policy checks stay in governance routes, not the directory hub.", label: "Governance scope", tone: "gold", value: "Scoped" },
      { detail: "Directory visibility does not grant downstream role or payload authority.", label: "Safety", tone: "red", value: "No bypass" },
    ],
    queue: [
      linkForPageId("015", "Continue setup", "Review tenant readiness without forcing gates."),
      linkForPageId("016", "Assign team", "Move AlphaVest team assignment to the setup route."),
      linkForPageId("050", "Review access requests", "Handle permission work in governance."),
    ],
    safetyNote: "Tenant directory hub aggregates setup readiness only; it cannot suppress audit, expand RBAC payloads or force client visibility.",
    sourceSummaries: ["Tenant list", "Onboarding readiness", "Access request signal"],
    statusStrip: ["Directory", "Setup next", "No gate override"],
    summary: "A tenant hub should answer which tenant needs setup next, not expose the full tenant administration workflow.",
    title: "Tenant Directory Hub",
  },
  "015": {
    eyebrow: "Setup hub",
    pageId: "015",
    primaryAction: linkForPageId("016", "Open team assignment", "Continue setup in the team assignment workbench."),
    priorityCards: [
      { detail: "Team, policies and users are separate setup surfaces.", label: "Setup lanes", tone: "blue", value: "3 lanes" },
      { detail: "Tenant setup is support context only.", label: "Scope", tone: "gold", value: "Support" },
      { detail: "Setup completion does not release advice or approve exports.", label: "Gate safety", tone: "red", value: "Blocked" },
    ],
    queue: [
      linkForPageId("017", "Review policies", "Configure tenant policy context safely."),
      linkForPageId("018", "Manage users", "Handle scoped user setup."),
      linkForPageId("013", "Back to directory", "Return to tenant overview."),
    ],
    safetyNote: "Tenant setup can coordinate readiness but cannot become an advice, release, export or client-visibility gate.",
    sourceSummaries: ["Team setup", "Policy setup", "User readiness"],
    statusStrip: ["Tenant setup", "Next lane", "No release"],
    summary: "This hub curates setup lanes and hands users to the next setup surface instead of rendering every setup control at once.",
    title: "Tenant Setup Hub",
  },
  "019": {
    eyebrow: "Client hub",
    pageId: "019",
    primaryAction: linkForPageId("027", "Open document status", "Review client-safe document status and evidence requests."),
    priorityCards: [
      { detail: "Only released or redacted client-safe content belongs here.", label: "Released view", tone: "green", value: "Client-safe" },
      { detail: "Internal rationale, compliance notes and AI draft fields stay hidden.", label: "Hidden state", tone: "red", value: "Fail closed" },
      { detail: "Evidence upload is input only, never sufficiency.", label: "Next action", tone: "blue", value: "Scoped" },
    ],
    queue: [
      linkForPageId("028", "Upload evidence source", "Provide source material without claiming sufficiency."),
      linkForPageId("021", "Review profile", "Inspect client facts."),
      linkForPageId("046", "Open evidence vault", "Use evidence context only when permitted."),
    ],
    safetyNote: "Client hub content must not leak internal notes, compliance comments, unreleased evidence or draft advice.",
    sourceSummaries: ["Released summary", "Evidence request state", "Open client actions"],
    statusStrip: ["Released only", "Evidence request", "No internal leakage"],
    summary: "The client hub gives calm orientation and safe next work, not an internal operations dashboard.",
    title: "Client Executive Hub",
  },
  "020": {
    eyebrow: "Mobile hub",
    pageId: "020",
    primaryAction: linkForPageId("019", "Open full portal", "Continue in the full client portal."),
    priorityCards: [
      { detail: "Compact mobile summary focuses on the one safe next step.", label: "Mobile focus", tone: "blue", value: "One step" },
      { detail: "Released-view constraints match the desktop client hub.", label: "Visibility", tone: "green", value: "Client-safe" },
      { detail: "Internal workflow detail remains hidden on mobile.", label: "Leakage guard", tone: "red", value: "Hidden" },
    ],
    queue: [
      linkForPageId("027", "Review documents", "Inspect client-safe document status."),
      linkForPageId("028", "Upload evidence", "Provide scoped evidence input."),
      linkForPageId("046", "Open evidence", "Review permitted evidence context."),
    ],
    safetyNote: "Mobile home is orientation only; it does not expose internal workflow detail or release controls.",
    sourceSummaries: ["Next step today", "Priority actions", "Released mobile summary"],
    statusStrip: ["Mobile", "Released view", "No internal detail"],
    summary: "The mobile hub strips the client workspace down to a safe next step and a few visible priorities.",
    title: "Mobile Client Hub",
  },
  "024": {
    eyebrow: "Client structure hub",
    pageId: "024",
    primaryAction: linkForPageId("025", "Create entity", "Move entity creation into the dedicated work surface."),
    priorityCards: [
      { detail: "Entity work is summarized by risk, evidence and ownership gaps.", label: "Entity signal", tone: "blue", value: "Prioritized" },
      { detail: "The list does not grant broader object visibility.", label: "Object scope", tone: "gold", value: "Tenant scoped" },
      { detail: "Mutations remain on entity detail or create routes.", label: "Action safety", tone: "red", value: "No bypass" },
    ],
    queue: [
      linkForPageId("026", "Inspect entity detail", "Open entity context without changing gates."),
      linkForPageId("031", "Review wealth map", "Orient relationship context."),
      linkForPageId("021", "Review profile", "Return to client facts."),
    ],
    safetyNote: "Entity hub aggregates structure and evidence gaps; it does not become a broad mutation or payload surface.",
    sourceSummaries: ["Entity risk", "Missing evidence", "Ownership structure"],
    statusStrip: ["Entity overview", "Scoped handoff", "No payload expansion"],
    summary: "The entity hub helps users decide which structure item needs work next, then routes to the right surface.",
    title: "Entity Hub",
  },
  "031": {
    eyebrow: "Wealth map hub",
    pageId: "031",
    primaryAction: linkForPageId("021", "Review client profile", "Move from map context into client facts."),
    priorityCards: [
      { detail: "Relationship and asset gaps are summarized before map exploration.", label: "Map signal", tone: "blue", value: "Context" },
      { detail: "Drawers can contextualize; full workflows stay elsewhere.", label: "Depth", tone: "gold", value: "Drawer only" },
      { detail: "Map context does not release advice or exports.", label: "Safety", tone: "red", value: "No release" },
    ],
    queue: [
      linkForPageId("024", "Open entities", "Work on scoped structure data."),
      linkForPageId("032", "Review actions", "Inspect next actions without implying release."),
      linkForPageId("023", "Open relationships", "Review relationship facts."),
    ],
    safetyNote: "Wealth map hub orients relationships and gaps only; it must not become a full workflow or release surface.",
    sourceSummaries: ["Relationship map", "Asset gaps", "Open structure actions"],
    statusStrip: ["Map orientation", "Context drawer", "Scoped next work"],
    summary: "The wealth map hub gives relationship orientation and points users to the next structured work surface.",
    title: "Wealth Map Hub",
  },
  "034": {
    eyebrow: "Advisory hub",
    pageId: "034",
    primaryAction: linkForPageId("035", "Open next trigger", "Inspect the next review item before advisor handoff."),
    priorityCards: [
      { detail: "One recommendation or signal should be clearly next.", label: "Next review", tone: "blue", value: "Queued" },
      { detail: "Evidence gaps stay visible and block downstream release.", label: "Evidence", tone: "gold", value: "Required" },
      { detail: "Draft and rationale content remain internal only.", label: "Advice boundary", tone: "red", value: "Internal" },
    ],
    queue: [
      linkForPageId("036", "Send to advisor review", "Move to advisor approval without claiming release."),
      linkForPageId("038", "Open compliance queue", "Use compliance only after prerequisites are ready."),
      linkForPageId("033", "Review signals", "Return to signal intake."),
    ],
    safetyNote: "Advisory hub may route to review, but advisor approval is still not compliance release.",
    sourceSummaries: ["Client queue", "Trigger queue", "Evidence gaps"],
    statusStrip: ["Priority review", "Evidence gaps", "Internal draft only"],
    summary: "The advisory hub triages internal work and routes to review/detail; it does not expose drafts to clients.",
    title: "Advisory Review Hub",
  },
  "043": {
    eyebrow: "Decision hub",
    pageId: "043",
    primaryAction: linkForPageId("044", "Open decision room", "Review the decision detail before downstream state changes."),
    priorityCards: [
      { detail: "Decision records are summarized by status and owner.", label: "Decision queue", tone: "blue", value: "Prioritized" },
      { detail: "Evidence links are context, not acceptance proof.", label: "Evidence", tone: "gold", value: "Linked" },
      { detail: "Decision submission is not client acceptance.", label: "Boundary", tone: "red", value: "No acceptance" },
    ],
    queue: [
      linkForPageId("046", "Open evidence vault", "Check evidence context without exposing internal rationale."),
      linkForPageId("051", "Review audit history", "Inspect traceability from governance."),
      linkForPageId("045", "Review submitted state", "Inspect submitted-state detail."),
    ],
    safetyNote: "Decision hub routes to detail and evidence; final decision state remains governed by detail and release controls.",
    sourceSummaries: ["Decision status", "Evidence links", "Owner queue"],
    statusStrip: ["Decision overview", "Evidence linked", "No client acceptance claim"],
    summary: "The decision hub helps users decide which decision needs detail work next without implying acceptance.",
    title: "Decision Hub",
  },
  "054": {
    eyebrow: "Export hub",
    pageId: "054",
    primaryAction: linkForPageId("055", "Select export scope", "Begin export scope selection before redaction or preview."),
    priorityCards: [
      { detail: "Scope must be selected before redaction, preview or delivery.", label: "Scope", tone: "blue", value: "First" },
      { detail: "Redaction and approval stay separate from preview.", label: "Lifecycle", tone: "gold", value: "Separated" },
      { detail: "Download and share stay outside this hub.", label: "Delivery", tone: "red", value: "Not here" },
    ],
    queue: [
      linkForPageId("056", "Review redaction", "Apply redaction before preview."),
      linkForPageId("057", "Open preview", "Preview is inspection only."),
      linkForPageId("058", "Open delivery controls", "Delivery remains gated after approval."),
    ],
    safetyNote: "Export hub cannot approve, download, share or imply client acceptance.",
    sourceSummaries: ["Scope readiness", "Redaction state", "Preview status"],
    statusStrip: ["Scope first", "Redaction next", "Preview is not approval"],
    summary: "The export hub separates lifecycle stages and sends users to the correct gated export step.",
    title: "Export Hub",
  },
};

export function uxHubDefinitionForPageId(pageId: string) {
  return uxHubDefinitions[pageId] ?? null;
}
