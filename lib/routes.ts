import type { WorkflowBadge } from "./status";

export type BoardRoute = {
  number: string;
  path: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  referenceImage: string;
  surface: string;
  plannedModules: string[];
  annotations: {
    userRole: string;
    coreAction: string;
    systemReaction: string;
    outcome: string;
  };
  workflow: WorkflowBadge[];
};

const baseWorkflow: WorkflowBadge[] = [
  "AI-DRAFT",
  "ANALYST",
  "ADVISOR",
  "COMPLIANCE",
  "CLIENT",
  "EVIDENCE",
  "REVIEW"
];

export const boardRoutes: BoardRoute[] = [
  {
    number: "01",
    path: "/presentation",
    shortLabel: "Presentation",
    title: "Product Ecosystem Overview",
    subtitle:
      "One digital platform. Multiple interfaces. Human review behind every sensitive decision.",
    referenceImage:
      "/reference/wireframes/board-01-product-ecosystem-overview.png",
    surface: "Product story and ecosystem entry",
    plannedModules: [
      "Four application surfaces",
      "Shared WealthOS services",
      "Advice boundary callout",
      "Workflow badge legend",
      "Start Click-Dummy entry point"
    ],
    annotations: {
      userRole: "Presenter / AlphaVest team",
      coreAction: "Introduce WealthOS as the command center for global family wealth.",
      systemReaction: "Frames every later route as digital-first, human-reviewed and evidence-backed.",
      outcome: "Audience understands the product surfaces and the no-unapproved-advice boundary."
    },
    workflow: baseWorkflow
  },
  {
    number: "02",
    path: "/mobile",
    shortLabel: "Mobile",
    title: "Mobile App Home / Next Step Today",
    subtitle: "Your day, in focus. Clear next steps. Human-reviewed guidance.",
    referenceImage:
      "/reference/wireframes/board-02-mobile-app-home-next-step-today.png",
    surface: "Mobile client experience",
    plannedModules: [
      "Next step today card stack",
      "Family Steward greeting",
      "Recommendation preview route",
      "Document upload route",
      "Advisor access route"
    ],
    annotations: {
      userRole: "Family Principal / Family Steward",
      coreAction: "Review daily next steps and move to the right surface.",
      systemReaction: "Only approved and compliance-reviewed recommendations become client-visible.",
      outcome: "Clear action without unnecessary meetings."
    },
    workflow: baseWorkflow
  },
  {
    number: "03",
    path: "/mobile/upload",
    shortLabel: "Upload",
    title: "Mobile Document Upload Flow",
    subtitle:
      "Capture. Extract. Verify. Link. A secure document intake path for trusted records.",
    referenceImage:
      "/reference/wireframes/board-03-mobile-document-upload-flow.png",
    surface: "Mobile document intake",
    plannedModules: [
      "Three-step phone flow",
      "Document type selection",
      "Extracted information review",
      "Verification pending state",
      "Blocked low-confidence state"
    ],
    annotations: {
      userRole: "Client / Family Principal / Advisor",
      coreAction: "Upload a document and confirm extracted fields.",
      systemReaction: "Classifies and routes documents for analyst review.",
      outcome: "Verified documents can be linked to entities, assets and decisions."
    },
    workflow: ["CLIENT", "AUTO", "AI-DRAFT", "ANALYST", "ADVISOR", "EVIDENCE"]
  },
  {
    number: "04",
    path: "/portal",
    shortLabel: "Portal",
    title: "Client Web Portal Dashboard",
    subtitle:
      "Your command center for visibility, actions, decisions and review.",
    referenceImage:
      "/reference/wireframes/board-04-client-web-portal-dashboard.png",
    surface: "Client web portal",
    plannedModules: [
      "Structure completeness score",
      "Open actions",
      "Pending decisions",
      "Missing documents",
      "Evidence and governance status"
    ],
    annotations: {
      userRole: "Principal / Family CFO / Authorized Family Member",
      coreAction: "Open structure gaps and route to the wealth map.",
      systemReaction: "Highlights structural and documentation gaps.",
      outcome: "Client can take targeted action to improve readiness."
    },
    workflow: ["AUTO", "ANALYST", "CLIENT", "COMPLIANCE", "REVIEW"]
  },
  {
    number: "05",
    path: "/wealth-map",
    shortLabel: "Wealth Map",
    title: "Live Global Wealth Map",
    subtitle:
      "Interactive graph of your wealth structure, connections and oversight in real time.",
    referenceImage:
      "/reference/wireframes/board-05-live-global-wealth-map.png",
    surface: "Client structure graph",
    plannedModules: [
      "Trust X central graph",
      "Jurisdiction filters",
      "Entity detail drawer",
      "Relationship legend",
      "Risk and focus summary"
    ],
    annotations: {
      userRole: "Principal / Advisor / Family Office Operator",
      coreAction: "Inspect Trust X and related connections.",
      systemReaction: "Displays linked data, alerts and actions.",
      outcome: "Structure is understandable and action-ready."
    },
    workflow: ["AUTO", "ANALYST", "ADVISOR", "COMPLIANCE", "EVIDENCE"]
  },
  {
    number: "06",
    path: "/actions",
    shortLabel: "Actions",
    title: "Action Board / Next Best Action",
    subtitle:
      "Prioritized actions across people, entities and assets with a clear path to decision.",
    referenceImage:
      "/reference/wireframes/board-06-action-board-next-best-action.png",
    surface: "Action orchestration board",
    plannedModules: [
      "Workflow-stage columns",
      "Action cards with owners",
      "Human review stage status",
      "Evidence status",
      "Recommendation card route"
    ],
    annotations: {
      userRole: "Client / Principal / Family Office Operator",
      coreAction: "Create, review, approve or defer an action.",
      systemReaction: "Routes work to the right owner and workflow stage.",
      outcome: "Tasks are captured, evidenced and reduced to decisions."
    },
    workflow: baseWorkflow
  },
  {
    number: "07",
    path: "/signals",
    shortLabel: "Signals",
    title: "Signal & Trigger Engine",
    subtitle: "Intelligent monitoring. Context-aware triggers. Review-ready outcomes.",
    referenceImage:
      "/reference/wireframes/board-07-signal-trigger-engine.png",
    surface: "Trigger detection and review boundaries",
    plannedModules: [
      "Signal sources",
      "Processing layer",
      "Trigger outputs",
      "Client-visible boundary",
      "Internal-only guardrails"
    ],
    annotations: {
      userRole: "Consultant / Advisor / Admin",
      coreAction: "Select a signal source and inspect related trigger outputs.",
      systemReaction: "Classifies review points without producing final advice.",
      outcome: "Noise is reduced into meaningful review points."
    },
    workflow: ["AUTO", "AI-DRAFT", "ANALYST", "ADVISOR", "COMPLIANCE", "CLIENT"]
  },
  {
    number: "08",
    path: "/decisions",
    shortLabel: "Decisions",
    title: "Digital Decision Room",
    subtitle:
      "A secure collaborative workspace to evaluate, decide and document with confidence.",
    referenceImage:
      "/reference/wireframes/board-08-digital-decision-room.png",
    surface: "Client decision workflow",
    plannedModules: [
      "Decision summary",
      "Accept / Defer / Reject actions",
      "Family approvals",
      "Advisor comments",
      "Evidence record notice"
    ],
    annotations: {
      userRole: "Principal / Family Council / Advisor",
      coreAction: "Review an advisor-approved recommendation and record a decision.",
      systemReaction: "Logs approval and updates evidence record.",
      outcome: "Major decisions become explained, approved, documented and reviewable."
    },
    workflow: baseWorkflow
  },
  {
    number: "09",
    path: "overlay:evidence-preview",
    shortLabel: "Evidence Preview",
    title: "Evidence Vault Preview / Decision Record",
    subtitle: "Secure documents, verified decisions and immutable evidence inside the active workflow.",
    referenceImage:
      "/reference/wireframes/board-09-evidence-vault-decision-record.png",
    surface: "Contextual evidence preview drawer",
    plannedModules: [
      "Source document preview",
      "Decision and audit record metadata",
      "Restricted-record state",
      "Missing-evidence escalation state",
      "Workflow lifecycle timeline"
    ],
    annotations: {
      userRole: "Client / Advisor / Compliance",
      coreAction: "Review documents and decision evidence.",
      systemReaction: "Validates, links and locks evidence to decisions.",
      outcome: "Evidence replaces assumption for accountable decisions."
    },
    workflow: ["AUTO", "ANALYST", "ADVISOR", "COMPLIANCE", "EVIDENCE"]
  },
  {
    number: "10",
    path: "/workbench",
    shortLabel: "Workbench",
    title: "Consultant Workbench",
    subtitle:
      "Internal workbench for analysts and client success teams to manage triggers and recommendations.",
    referenceImage:
      "/reference/wireframes/board-10-consultant-workbench.png",
    surface: "Internal consultant workspace",
    plannedModules: [
      "Client queue",
      "Data quality score",
      "Trigger review queue",
      "Draft recommendations",
      "Publish readiness checklist"
    ],
    annotations: {
      userRole: "AlphaVest Analyst / Senior Advisor / Client Success",
      coreAction: "Prepare recommendations only after all gates are complete.",
      systemReaction: "Keeps publish disabled until approval, compliance, evidence and permission exist.",
      outcome: "Internal teams can work quickly without bypassing controls."
    },
    workflow: baseWorkflow
  },
  {
    number: "11",
    path: "/advisor-approval",
    shortLabel: "Advisor",
    title: "Advisor Approval Screen",
    subtitle:
      "A senior-review workspace for validating logic, checking evidence and deciding what moves forward.",
    referenceImage:
      "/reference/wireframes/board-11-advisor-approval-screen.png",
    surface: "Advisor approval gate",
    plannedModules: [
      "Trigger summary",
      "AI draft recommendation",
      "Analyst notes",
      "Advisor decision actions",
      "Compliance next-gate status"
    ],
    annotations: {
      userRole: "Principal Advisor",
      coreAction: "Approve, revise, request more data or escalate to a call.",
      systemReaction: "Advisor approval records the decision but does not publish to the client.",
      outcome: "Client visibility remains blocked until compliance review is complete."
    },
    workflow: ["AI-DRAFT", "ANALYST", "ADVISOR", "COMPLIANCE", "CLIENT", "CALL"]
  },
  {
    number: "12",
    path: "/compliance",
    shortLabel: "Compliance",
    title: "Compliance / Advice Boundary Console",
    subtitle:
      "A governance control layer that classifies outputs, enforces approvals and prevents unreviewed advice.",
    referenceImage:
      "/reference/wireframes/board-12-compliance-advice-boundary-console.png",
    surface: "Compliance and advice boundary",
    plannedModules: [
      "Compliance queue",
      "Advice boundary classification",
      "Record of advice status",
      "Client visibility control",
      "Release or block workflow"
    ],
    annotations: {
      userRole: "Compliance Officer",
      coreAction: "Classify, approve or block outputs before client release.",
      systemReaction: "Checks approvals, evidence, disclaimers and publish permission.",
      outcome: "Only compliant, approved outputs are published."
    },
    workflow: ["COMPLIANCE", "ADVISOR", "EVIDENCE", "CLIENT", "REVIEW"]
  },
  {
    number: "13",
    path: "/governance",
    shortLabel: "Governance",
    title: "Role-Based Access & Family Governance",
    subtitle:
      "Permissioned visibility and family decision rights across principals, relatives, trustees and specialists.",
    referenceImage:
      "/reference/wireframes/board-13-role-based-access-family-governance.png",
    surface: "Access and governance controls",
    plannedModules: [
      "Role permission matrix",
      "Sensitive document access",
      "Family governance center",
      "Audit trail snapshot",
      "Second confirmation flow"
    ],
    annotations: {
      userRole: "Family Steward / Principal",
      coreAction: "Grant access with appropriate approval rights.",
      systemReaction: "Applies role permissions and requires second confirmation for sensitive access.",
      outcome: "Access is logged, enforceable and reviewable."
    },
    workflow: ["CLIENT", "COMPLIANCE", "CALL", "REVIEW", "EVIDENCE"]
  },
  {
    number: "14",
    path: "/communication",
    shortLabel: "Communication",
    title: "Client Communication & Call Trigger Flow",
    subtitle:
      "Digital-first communication, with human interaction introduced only when complexity or judgment requires it.",
    referenceImage:
      "/reference/wireframes/board-14-client-communication-call-trigger-flow.png",
    surface: "Client communication routing",
    plannedModules: [
      "Digital-only lane",
      "Advisor call lane",
      "Face-to-face workshop lane",
      "Complexity scoring",
      "Evidence-backed communication layer"
    ],
    annotations: {
      userRole: "Client / Analyst / Advisor / Specialist",
      coreAction: "Route communication into digital, call or workshop lanes.",
      systemReaction: "Scores complexity and recommends the least intrusive next step.",
      outcome: "Meetings happen only when judgment, trust or conflict requires them."
    },
    workflow: ["CLIENT", "AUTO", "ANALYST", "ADVISOR", "CALL", "F2F", "EVIDENCE"]
  },
  {
    number: "15",
    path: "/journey",
    shortLabel: "Journey",
    title: "End-to-End Client Journey",
    subtitle:
      "From onboarding to review rhythm: what the family sees, what the platform does and what AlphaVest does in the background.",
    referenceImage:
      "/reference/wireframes/board-15-end-to-end-client-journey.png",
    surface: "Full client journey map",
    plannedModules: [
      "12 journey stages",
      "Client-visible swimlane",
      "Human/internal swimlane",
      "Governance/evidence swimlane",
      "Journey summary"
    ],
    annotations: {
      userRole: "Presenter / Client / AlphaVest team",
      coreAction: "Walk through the end-to-end operating rhythm.",
      systemReaction: "Shows provenance and accountability at every step.",
      outcome: "The audience sees digital speed with human judgment and evidence."
    },
    workflow: ["CLIENT", "AUTO", "ANALYST", "ADVISOR", "COMPLIANCE", "EVIDENCE", "REVIEW"]
  },
  {
    number: "16",
    path: "/roadmap",
    shortLabel: "Roadmap",
    title: "MVP Scope vs Future Vision",
    subtitle:
      "What ships first, what comes next and how the platform evolves from useful core product to advanced WealthOS.",
    referenceImage:
      "/reference/wireframes/board-16-mvp-scope-vs-future-vision.png",
    surface: "Scope and sequencing",
    plannedModules: [
      "MVP scope",
      "Phase 2 growth",
      "Future vision",
      "Roadmap milestones",
      "Build principle"
    ],
    annotations: {
      userRole: "AlphaVest leadership / Delivery team",
      coreAction: "Clarify MVP scope and later-phase growth.",
      systemReaction: "Keeps the build focused on useful, safe and human-reviewable foundations.",
      outcome: "The roadmap is credible without overpromising automation."
    },
    workflow: ["CLIENT", "ADVISOR", "COMPLIANCE", "EVIDENCE", "REVIEW"]
  }
];

export function getBoardRoute(path: string) {
  return boardRoutes.find((route) => route.path === path);
}
