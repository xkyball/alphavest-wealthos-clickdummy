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
      { detail: "Access and policy checks stay in governance routes, not the directory hub.", label: "Governance access", tone: "gold", value: "Limited" },
      { detail: "Directory visibility does not grant downstream role or data authority.", label: "Safety", tone: "red", value: "No bypass" },
    ],
    queue: [
      linkForPageId("015", "Continue setup", "Review tenant readiness without forcing controls."),
      linkForPageId("016", "Assign team", "Move AlphaVest team assignment to the setup route."),
      linkForPageId("050", "Review access requests", "Handle permission work in governance."),
    ],
    safetyNote: "Tenant directory hub aggregates setup readiness only; it cannot suppress audit, expand RBAC data access or force client visibility.",
    sourceSummaries: ["Tenant list", "Onboarding readiness", "Access request signal"],
    statusStrip: ["Directory", "Setup next", "No override"],
    summary: "A tenant hub should answer which tenant needs setup next, not expose the full tenant administration surface.",
    title: "Tenant Directory Hub",
  },
  "015": {
    eyebrow: "Setup hub",
    pageId: "015",
    primaryAction: linkForPageId("016", "Open team assignment", "Continue setup in the team assignment workbench."),
    priorityCards: [
      { detail: "Team, policies and users are separate setup surfaces.", label: "Setup lanes", tone: "blue", value: "3 lanes" },
      { detail: "Tenant setup is support context only.", label: "Access", tone: "gold", value: "Support" },
      { detail: "Setup completion does not release advice or approve exports.", label: "Control safety", tone: "red", value: "Blocked" },
    ],
    queue: [
      linkForPageId("017", "Review policies", "Configure tenant policy context safely."),
      linkForPageId("018", "Manage users", "Handle permitted user setup."),
      linkForPageId("013", "Back to directory", "Return to tenant overview."),
    ],
    safetyNote: "Tenant setup can coordinate readiness but cannot become an advice, release, export or client-visibility check.",
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
      { detail: "Restricted working notes and draft fields stay hidden.", label: "Hidden state", tone: "red", value: "Fail closed" },
      { detail: "Evidence upload is input only, never sufficiency.", label: "Next action", tone: "blue", value: "Limited" },
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
      { detail: "Internal review detail remains hidden on mobile.", label: "Leakage guard", tone: "red", value: "Hidden" },
    ],
    queue: [
      linkForPageId("027", "Review documents", "Inspect client-safe document status."),
      linkForPageId("028", "Upload evidence", "Provide permitted evidence input."),
      linkForPageId("046", "Open evidence", "Review permitted evidence context."),
    ],
    safetyNote: "Mobile home hides Internal review detail and release controls.",
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
      { detail: "The list does not grant broader object visibility.", label: "Object access", tone: "gold", value: "Tenant-limited" },
      { detail: "Mutations remain on entity detail or create routes.", label: "Action safety", tone: "red", value: "No bypass" },
    ],
    queue: [
      linkForPageId("026", "Inspect entity detail", "Open entity context without changing controls."),
      linkForPageId("031", "Review wealth map", "Orient relationship context."),
      linkForPageId("021", "Review profile", "Return to client facts."),
    ],
    safetyNote: "Entity hub aggregates structure and evidence gaps; it does not become a broad mutation or data surface.",
    sourceSummaries: ["Entity risk", "Missing evidence", "Ownership structure"],
    statusStrip: ["Entity overview", "Permitted handoff", "No data expansion"],
    summary: "The entity hub helps users decide which structure item needs work next, then routes to the right surface.",
    title: "Entity Hub",
  },
  "031": {
    eyebrow: "Wealth map hub",
    pageId: "031",
    primaryAction: linkForPageId("021", "Review client profile", "Move from map context into client facts."),
    priorityCards: [
      { detail: "Relationship and asset gaps are summarized before map exploration.", label: "Map signal", tone: "blue", value: "Context" },
      { detail: "Drawers can contextualize; full review flows stay elsewhere.", label: "Depth", tone: "gold", value: "Drawer only" },
      { detail: "Map context does not release advice or exports.", label: "Safety", tone: "red", value: "No release" },
    ],
    queue: [
      linkForPageId("024", "Open entities", "Work on permitted structure data."),
      linkForPageId("032", "Review actions", "Inspect next actions without implying release."),
      linkForPageId("023", "Open relationships", "Review relationship facts."),
    ],
    safetyNote: "Wealth map hub orients relationships and gaps only; it must not become a full review flow or release surface.",
    sourceSummaries: ["Relationship map", "Asset gaps", "Open structure actions"],
    statusStrip: ["Map orientation", "Context drawer", "Permitted next work"],
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
  "038": {
    eyebrow: "Compliance hub",
    pageId: "038",
    primaryAction: linkForPageId("039", "Open decision room", "Review one compliance package before release or block."),
    priorityCards: [
      { detail: "Compliance packages are prioritized by release blocker and evidence state.", label: "Review queue", tone: "blue", value: "Ready" },
      { detail: "Evidence request, block and release are separate controlled actions.", label: "Control split", tone: "gold", value: "Separated" },
      { detail: "Advisor approval does not create client visibility.", label: "Release safety", tone: "red", value: "Blocked" },
    ],
    queue: [
      linkForPageId("040", "Review release checks", "Inspect release prerequisites without skipping evidence."),
      linkForPageId("041", "Open block state", "Review blocked release reason and recovery."),
      linkForPageId("042", "Open audit context", "Check traceability before sensitive action."),
    ],
    safetyNote: "Compliance hub can orient release work; it cannot collapse review, block, release, evidence request or audit checks.",
    sourceSummaries: ["Compliance queue", "Evidence readiness", "Audit trail"],
    statusStrip: ["Compliance hub", "Release controlled", "Advisor approval != release"],
    summary: "The compliance hub routes reviewers to the correct decision surface while keeping release, block and audit responsibilities separate.",
    title: "Compliance Release Hub",
  },
  "033": {
    eyebrow: "Advisory hub",
    pageId: "033",
    primaryAction: linkForPageId("034", "Open advisory queue", "Move from signal orientation into the advisory review queue."),
    priorityCards: [
      { detail: "Signals are prioritized before a human opens a permitted review item.", label: "Signal triage", tone: "blue", value: "28" },
      { detail: "Unsupported claims require evidence before advisor handoff.", label: "Evidence gaps", tone: "gold", value: "Open" },
      { detail: "Signal routing never becomes client-visible advice.", label: "Advice boundary", tone: "red", value: "Internal" },
    ],
    queue: [
      linkForPageId("035", "Inspect trigger detail", "Open one trigger review without releasing advice."),
      linkForPageId("036", "Advisor review queue", "Route ready work to advisor approval."),
      linkForPageId("038", "Compliance queue", "Use compliance only after prerequisites are met."),
    ],
    safetyNote: "Advisory hub orientation cannot publish recommendations, approve advice or expose AI rationale to clients.",
    sourceSummaries: ["Signal queue", "Data quality gaps", "Draft review readiness"],
    statusStrip: ["Signal hub", "Internal only", "No release"],
    summary: "The advisory hub chooses the next internal review path instead of mixing signal intake, draft handling and approval checks.",
    title: "Advisory Signal Hub",
  },
  "046": {
    eyebrow: "Evidence hub",
    pageId: "046",
    primaryAction: linkForPageId("047", "Open evidence review", "Inspect one evidence record and its sufficiency context."),
    priorityCards: [
      { detail: "Reviewed and linked evidence is separated from uploaded intake.", label: "Reviewed evidence", tone: "green", value: "Linked" },
      { detail: "Pending extraction remains in document review, not release checks.", label: "Extraction queue", tone: "gold", value: "Pending" },
      { detail: "Upload success is never treated as sufficiency.", label: "Safety", tone: "red", value: "No shortcut" },
    ],
    queue: [
      linkForPageId("027", "Open documents", "Review document status before evidence sufficiency."),
      linkForPageId("029", "Open extraction queue", "Resolve extracted data before linking evidence."),
      linkForPageId("030", "Verify document", "Complete verification before sufficiency claims."),
    ],
    safetyNote: "Evidence hub can orient and route, but it cannot claim sufficiency without reviewed, permitted, current and client-safe evidence.",
    sourceSummaries: ["Evidence vault", "Document review queue", "Sufficiency blockers"],
    statusStrip: ["Evidence hub", "Upload != sufficiency", "Client-safe only"],
    summary: "The evidence hub separates intake, extraction, verification and sufficiency so users reach the right evidence work surface.",
    title: "Evidence Orientation Hub",
  },
  "048": {
    eyebrow: "Governance hub",
    pageId: "048",
    primaryAction: linkForPageId("050", "Review access request", "Open the access request queue before any permission change."),
    priorityCards: [
      { detail: "Access requests are prioritized before role or policy mutation.", label: "Access queue", tone: "blue", value: "8" },
      { detail: "Role changes require second confirmation and audit context.", label: "Role safety", tone: "gold", value: "Bounded" },
      { detail: "Admin navigation never expands content or release authority.", label: "No bypass", tone: "red", value: "Enforced" },
    ],
    queue: [
      linkForPageId("049", "Review role detail", "Inspect role access without bypassing policy checks."),
      linkForPageId("051", "Open audit history", "Review traceability before broad governance action."),
      linkForPageId("008", "Review policy boundary", "Inspect advice-boundary policy context."),
    ],
    safetyNote: "Governance hub can coordinate access work; it cannot bypass RBAC, audit, evidence, release or export controls.",
    sourceSummaries: ["Access requests", "Role access", "Audit history"],
    statusStrip: ["Governance hub", "Permissioned admin", "No bypass"],
    summary: "The governance hub turns users toward the next safe access or audit surface instead of acting as a flat admin console.",
    title: "Governance Control Hub",
  },
  "043": {
    eyebrow: "Decision hub",
    pageId: "043",
    primaryAction: linkForPageId("044", "Open decision room", "Review the decision detail before downstream state changes."),
    priorityCards: [
      { detail: "Decision records are summarized by status and owner.", label: "Decision queue", tone: "blue", value: "Prioritized" },
      { detail: "Evidence links are context, not acceptance evidence.", label: "Evidence", tone: "gold", value: "Linked" },
      { detail: "Decision submission is not client acceptance.", label: "Boundary", tone: "red", value: "No acceptance" },
    ],
    queue: [
      linkForPageId("046", "Open evidence vault", "Check evidence context without exposing restricted working notes."),
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
    primaryAction: linkForPageId("055", "Select export items", "Begin export item selection before redaction or preview."),
    priorityCards: [
      { detail: "Access must be selected before redaction, preview or delivery.", label: "Access", tone: "blue", value: "First" },
      { detail: "Redaction and approval stay separate from preview.", label: "Lifecycle", tone: "gold", value: "Separated" },
      { detail: "Download and share stay outside this hub.", label: "Delivery", tone: "red", value: "Not here" },
    ],
    queue: [
      linkForPageId("056", "Review redaction", "Apply redaction before preview."),
      linkForPageId("057", "Open preview", "Preview is inspection only."),
      linkForPageId("058", "Open delivery controls", "Delivery remains controlled after approval."),
    ],
    safetyNote: "Export hub cannot approve, download, share or imply client acceptance.",
    sourceSummaries: ["Access readiness", "Redaction state", "Preview status"],
    statusStrip: ["Access first", "Redaction next", "Preview is not approval"],
    summary: "The export hub separates lifecycle stages and sends users to the correct controlled export step.",
    title: "Export Hub",
  },
  "052": {
    eyebrow: "Communication hub",
    pageId: "052",
    primaryAction: linkForPageId("053", "Open call trigger matrix", "Review the trigger context before any communication follow-up."),
    priorityCards: [
      { detail: "Communication context is intake and routing, not advice generation.", label: "Context", tone: "blue", value: "3 paths" },
      { detail: "Client-facing copy remains approval and release controlled.", label: "Release control", tone: "gold", value: "Required" },
      { detail: "Call triggers cannot bypass advisory or compliance checks.", label: "Safety", tone: "red", value: "No bypass" },
    ],
    queue: [
      linkForPageId("034", "Open advisory review", "Route advice-like context to internal advisory review."),
      linkForPageId("038", "Open compliance queue", "Escalate regulated communication context safely."),
      linkForPageId("046", "Open evidence vault", "Check evidence before communication decisions."),
    ],
    safetyNote: "Communication hubs may show context and trigger routing only; no unapproved advice or release can happen here.",
    sourceSummaries: ["Communication log", "Call trigger matrix", "Evidence context"],
    statusStrip: ["Communication hub", "Context only", "No advice"],
    summary: "The communication hub keeps client contact context separate from advisory drafting, approval and release.",
    title: "Communication Context Hub",
  },
  "059": {
    eyebrow: "Operations hub",
    pageId: "059",
    primaryAction: linkForPageId("060", "Open SLA escalation", "Inspect the SLA detail before any recovery escalation."),
    priorityCards: [
      { detail: "Operational queues are prioritized by recovery need.", label: "Recovery queue", tone: "blue", value: "18" },
      { detail: "Escalations route work without approving advice or exports.", label: "Escalation", tone: "gold", value: "Limited" },
      { detail: "Ops cannot bypass compliance, evidence or client visibility checks.", label: "Safety", tone: "red", value: "Blocked" },
    ],
    queue: [
      linkForPageId("041", "Open compliance block", "Route blocked recovery work to compliance context."),
      linkForPageId("038", "Open compliance queue", "Review release blockers safely."),
      linkForPageId("046", "Open evidence vault", "Check evidence blockers before recovery escalation."),
    ],
    safetyNote: "Operations hub can route recovery work but cannot approve, release, export or publish advice.",
    sourceSummaries: ["Ops queues", "SLA breach risk", "Compliance blockers"],
    statusStrip: ["Ops hub", "Recovery routing", "No bypass"],
    summary: "The operations hub directs support teams to the next recovery surface while keeping product and compliance controls intact.",
    title: "Operations Recovery Hub",
  },
  "064": {
    eyebrow: "KYC hub",
    pageId: "064",
    primaryAction: linkForPageId("065", "Open source-of-wealth review", "Inspect source-of-wealth evidence before suitability or IPS checks."),
    priorityCards: [
      { detail: "KYC review cases are prioritized by risk and missing evidence.", label: "KYC queue", tone: "blue", value: "3" },
      { detail: "Source-of-wealth gaps remain internal until evidence is resolved.", label: "Evidence", tone: "gold", value: "Required" },
      { detail: "KYC notes are never client-visible by default.", label: "Visibility", tone: "red", value: "Internal" },
    ],
    queue: [
      linkForPageId("067", "Open IPS decision room", "Move to IPS only after suitability prerequisites."),
      linkForPageId("070", "Open committee review", "Escalate high-risk advice to peer review."),
      linkForPageId("046", "Open evidence vault", "Check evidence readiness."),
    ],
    safetyNote: "KYC hub unlocks orientation only; it cannot finalize suitability, IPS, committee or client release checks.",
    sourceSummaries: ["KYC case risk", "Source-of-wealth evidence", "Suitability prerequisites"],
    statusStrip: ["KYC hub", "Internal review", "No release"],
    summary: "The KYC hub prioritizes internal review work and routes users to the next safety surface without approving advice.",
    title: "KYC and Suitability Hub",
  },
  "068": {
    eyebrow: "Review monitoring hub",
    pageId: "068",
    primaryAction: linkForPageId("069", "Open rebalance monitoring", "Inspect one monitoring item without automatic action."),
    priorityCards: [
      { detail: "Review cadence shows which households require attention.", label: "Due reviews", tone: "blue", value: "Due" },
      { detail: "Monitoring triggers are routed for review, not automatic advice.", label: "Trigger routing", tone: "gold", value: "Internal" },
      { detail: "Monitoring never creates client release by itself.", label: "Safety", tone: "red", value: "No release" },
    ],
    queue: [
      linkForPageId("034", "Open advisory review", "Route reviewed triggers to internal advisory work."),
      linkForPageId("038", "Open compliance queue", "Escalate release-sensitive blockers."),
      linkForPageId("046", "Open evidence vault", "Check evidence context for monitoring."),
    ],
    safetyNote: "Review monitoring is operational evidence only; it cannot execute rebalance advice or publish client content.",
    sourceSummaries: ["Review cadence", "Rebalance triggers", "Audit-ready monitoring"],
    statusStrip: ["Monitoring hub", "Internal only", "No auto advice"],
    summary: "The review monitoring hub shows review rhythm and sends users to a permitted monitoring or advisory surface.",
    title: "Review Monitoring Hub",
  },
  "070": {
    eyebrow: "Committee hub",
    pageId: "070",
    primaryAction: linkForPageId("071", "Open committee decision room", "Review votes, dissent and evidence before downstream compliance."),
    priorityCards: [
      { detail: "High-risk packages need independent peer review.", label: "Peer queue", tone: "blue", value: "Pending" },
      { detail: "Dissent remains visible and blocks completion.", label: "Dissent", tone: "gold", value: "Open" },
      { detail: "Committee review cannot bypass compliance release.", label: "Safety", tone: "red", value: "No bypass" },
    ],
    queue: [
      linkForPageId("038", "Open compliance queue", "Use compliance only after committee prerequisites."),
      linkForPageId("043", "Open decisions", "Inspect decision records without client acceptance."),
      linkForPageId("046", "Open evidence vault", "Review evidence package readiness."),
    ],
    safetyNote: "Committee hub coordinates peer review but does not approve client release, export or final advice visibility.",
    sourceSummaries: ["Committee queue", "Vote coverage", "Evidence and dissent"],
    statusStrip: ["Committee hub", "Peer review", "Compliance still required"],
    summary: "The committee hub orients high-risk peer review and routes to the decision room without collapsing downstream controls.",
    title: "Committee Review Hub",
  },
};

export function uxHubDefinitionForPageId(pageId: string) {
  return uxHubDefinitions[pageId] ?? null;
}
