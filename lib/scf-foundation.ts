import type { RouteScopeLabel } from "@/lib/route-registry";

export type ScfFoundationPhaseId =
  | "P00"
  | "P01"
  | "P02"
  | "P03"
  | "P04"
  | "P05"
  | "P06"
  | "P07"
  | "P08"
  | "P09";

export type ScfFoundationTaskId =
  | "SCF-P00-T001"
  | "SCF-P00-T002"
  | "SCF-P01-T001"
  | "SCF-P01-T002"
  | "SCF-P02-T001"
  | "SCF-P02-T002"
  | "SCF-P03-T001"
  | "SCF-P03-T002"
  | "SCF-P04-T001"
  | "SCF-P04-T002"
  | "SCF-P04-T003"
  | "SCF-P05-T001"
  | "SCF-P05-T002"
  | "SCF-P05-T003"
  | "SCF-P06-T001"
  | "SCF-P06-T002"
  | "SCF-P07-T001"
  | "SCF-P07-T002"
  | "SCF-P08-T001"
  | "SCF-P08-T002"
  | "SCF-P09-T001"
  | "SCF-P09-T002";

export type ScfDecisionQueueKey =
  | "implement"
  | "staticExplicit"
  | "defer"
  | "referenceOnly"
  | "hold";

export type ScfDoNotImplementEntry = {
  id: string;
  pageIds: string[];
  treatment: "defer" | "reference_only" | "hold" | "static_explicit";
  owningTask: Extract<ScfFoundationTaskId, "SCF-P02-T001" | "SCF-P02-T002">;
  rule: string;
};

export type ScfMasterTaskDetail = {
  apiDependencies?: string;
  dependencyOrder: string;
  dod?: string;
  id: ScfFoundationTaskId;
  implementationIntent: string;
  negativeAcceptance: string;
  nonGoals?: string;
  phase: ScfFoundationPhaseId;
  positiveAcceptance: string;
  proofRequired: string;
  safetyDependencies?: string;
  schemaDependencies?: string;
  sourceAffordanceIds?: string;
  sourceCapabilityIds?: string;
  sourceFlowIds?: string;
  sourceOrphanIds?: string;
  sourceRouteIds: string;
  sourceThreadIds?: string;
  status: "blocked" | "implementation_candidate";
  subtaskCount: 3 | 4 | 5;
  targetAreas: string[];
  taskName: string;
  taskPriority: "P0" | "P1" | "Hold";
  taskType: string;
  testObligation: string;
  uxStateDependencies?: string;
};

export type ScfSubtaskDetail = {
  acceptance: string;
  actionDetail: string;
  dependency: string;
  id: string;
  notes: string;
  parentTaskId: ScfFoundationTaskId;
  proof: string;
  subtaskName: string;
  targetArea: string;
};

export const scfFoundationPhases: Array<{
  acceptance: string[];
  id: ScfFoundationPhaseId;
  name: string;
  tasks: ScfFoundationTaskId[];
}> = [
  {
    id: "P00",
    name: "Repo / Artefact Intake & Baseline Verification",
    tasks: ["SCF-P00-T001", "SCF-P00-T002"],
    acceptance: ["Counts match or are blocked as TO_VERIFY", "Proof commands are named"],
  },
  {
    id: "P01",
    name: "SCF Normalization & Task Rebase",
    tasks: ["SCF-P01-T001", "SCF-P01-T002"],
    acceptance: ["Every route ID is workset-owned", "SCF decisions are split into work queues"],
  },
  {
    id: "P02",
    name: "Hide / Remove / Static / Defer / Hold Cleanup",
    tasks: ["SCF-P02-T001", "SCF-P02-T002"],
    acceptance: ["Static controls do not imply mutation", "Do-Not-Implement register exists"],
  },
  {
    id: "P03",
    name: "Foundation: User / Tenant / Role / Object Scope",
    tasks: ["SCF-P03-T001", "SCF-P03-T002"],
    acceptance: [
      "Mapped user sees own tenant and role context",
      "Route access, action permission, object scope and payload visibility are separate",
    ],
  },
  {
    id: "P04",
    name: "Primary Customer Need Flow: Evidence Request -> Upload -> Review",
    tasks: ["SCF-P04-T001", "SCF-P04-T002", "SCF-P04-T003"],
    acceptance: [
      "Evidence request leads to upload and review queue",
      "Upload success remains upload-only and insufficient evidence blocks release",
      "Reviewer can mark scoped evidence sufficiency explicitly",
    ],
  },
  {
    id: "P05",
    name: "Advisory Signal Flow: Signal -> Analyst -> Internal Draft -> Advisor",
    tasks: ["SCF-P05-T001", "SCF-P05-T002", "SCF-P05-T003"],
    acceptance: [
      "Analyst classification creates internal-only workflow items",
      "Client, API and export projections do not expose internal drafts or rationale",
      "Advisor approval creates compliance-pending state without client release",
    ],
  },
  {
    id: "P06",
    name: "Compliance Release / Block / Request Evidence",
    tasks: ["SCF-P06-T001", "SCF-P06-T002"],
    acceptance: [
      "Compliance release passes only with advisor, evidence, payload, permission and audit gates",
      "Block and request-evidence states remain fail-closed for client visibility",
      "Critical gate actions produce actor, role, target, previous, next, result and reason audit rows",
    ],
  },
  {
    id: "P07",
    name: "Client-safe Visibility Projection & Decision Record Closure",
    tasks: ["SCF-P07-T001", "SCF-P07-T002"],
    acceptance: [
      "Released decisions project only client-safe summaries",
      "Submitted but unreleased decisions remain internal and fail closed for client roles",
      "AI drafts, internal rationale, compliance notes and unreleased evidence stay out of client payloads",
    ],
  },
  {
    id: "P08",
    name: "Role / Access Request Governance & Cross-tenant Denial",
    tasks: ["SCF-P08-T001", "SCF-P08-T002"],
    acceptance: [
      "Governed access changes require scoped roles, audit and second confirmation where sensitive",
      "Admin and security roles cannot bypass release, export, visibility or evidence sufficiency gates",
      "Cross-tenant object and payload access denies without leaking row details",
    ],
  },
  {
    id: "P09",
    name: "Export Scope / Redaction / Approval Trust Output",
    tasks: ["SCF-P09-T001", "SCF-P09-T002"],
    acceptance: [
      "Approved exports contain only scoped, redacted, released client-safe content",
      "Preview-only, unredacted or internal payloads block generation, download and share",
      "Forbidden payload assertions cover client views and export packages",
    ],
  },
];

export const scfDecisionQueues: Record<ScfDecisionQueueKey, number> = {
  implement: 363,
  staticExplicit: 80,
  defer: 26,
  referenceOnly: 11,
  hold: 42,
};

export const scfBaselineCounts = {
  apiRouteFilesMinimum: 4,
  registeredRoutes: 71,
  routeWorksets: {
    HOLD_PENDING_DECISION: 7,
    MVP: 31,
    MVP_SUPPORT: 25,
    P1_AFTER_MVP: 5,
    REFERENCE_ONLY: 3,
  } satisfies Record<RouteScopeLabel, number>,
  visualReferencePngsMinimum: 63,
};

export const scfProofCommandBaseline = [
  "pnpm typecheck",
  "pnpm lint",
  "pnpm db:validate",
  "pnpm build",
  "pnpm test:permissions",
  "pnpm test:providerless-scope",
  "pnpm test:route-smoke",
  "pnpm exec playwright test tests/document-upload-api.spec.ts tests/document-upload-flow.spec.ts tests/workflow-gate.spec.ts tests/demo-workflow-api.spec.ts tests/phase6-audit-persistence.spec.ts",
  "pnpm exec playwright test tests/client-visibility-proof.spec.ts tests/governance-non-bypass.spec.ts tests/permission-engine.spec.ts tests/file-export-realism.spec.ts tests/phase8-export-workflow-api.spec.ts tests/p0-acceptance.spec.ts --workers=1",
] as const;

export const scfDoNotImplementRegister: ScfDoNotImplementEntry[] = [
  {
    id: "DNI-P1-001",
    pageIds: ["052", "053", "059", "060", "068"],
    owningTask: "SCF-P02-T002",
    treatment: "defer",
    rule: "P1-after-MVP routes stay registered for smoke coverage but cannot become MVP product tasks.",
  },
  {
    id: "DNI-REF-001",
    pageIds: ["061", "062", "063"],
    owningTask: "SCF-P02-T002",
    treatment: "reference_only",
    rule: "Reference-only pages stay non-product reference surfaces.",
  },
  {
    id: "DNI-HOLD-001",
    pageIds: ["064", "065", "066", "067", "069", "070", "071"],
    owningTask: "SCF-P02-T002",
    treatment: "hold",
    rule: "Held regulated or high-risk routes stay blocked until a dedicated unlock prompt exists.",
  },
  {
    id: "DNI-STATIC-001",
    pageIds: [],
    owningTask: "SCF-P02-T001",
    treatment: "static_explicit",
    rule: "Static-explicit controls must be disabled, labelled, hidden or deferred until behavior is implemented and proven.",
  },
];

export const scfP01P06MasterTaskDetails: ScfMasterTaskDetail[] = [
  {
    id: "SCF-P01-T001",
    phase: "P01",
    taskName: "SCF IDs normalisieren und Task-Backlog aus 522 Affordances bilden",
    taskType: "Planning",
    taskPriority: "P1",
    sourceRouteIds: "001-071",
    targetAreas: ["SCF artefacts"],
    implementationIntent:
      "Normalisiere Affordance-, Capability-, Thread-, Orphan- und Flow-IDs in ein taskfähiges Register.",
    positiveAcceptance: "Jede ID ist einem Workset zugeordnet.",
    negativeAcceptance: "Unbekannte ID wird nicht gebaut.",
    testObligation: "SCF foundation task/register assertions",
    dependencyOrder: "SCF-P00-T001",
    proofRequired: "Traceability is represented in code, tests and reports before downstream build claims.",
    status: "implementation_candidate",
    subtaskCount: 3,
  },
  {
    id: "SCF-P01-T002",
    phase: "P01",
    taskName: "SCF-Entscheidungen in Implement/Static/Hide/Remove/Defer/Hold splitten",
    taskType: "Planning",
    taskPriority: "P1",
    sourceRouteIds: "001-071",
    targetAreas: ["SCF artefacts", "lib/scf-foundation.ts"],
    implementationIntent: "Erzeuge Plan-Queues: 363 implement, 80 static explicit, 26 defer, 42 hold, 11 reference/static.",
    positiveAcceptance: "Alle Entscheidungen sind in Work Queues.",
    negativeAcceptance: "P1/Hold bleibt blockiert.",
    testObligation: "SCF queue and Do-Not-Implement assertions",
    dependencyOrder: "SCF-P01-T001",
    proofRequired: "Queue counts are represented in code, tests and reports.",
    status: "implementation_candidate",
    subtaskCount: 3,
  },
  {
    id: "SCF-P02-T001",
    phase: "P02",
    taskName: "Static-explicit UI cleanup planen",
    taskType: "Cleanup/UI",
    taskPriority: "P1",
    sourceRouteIds: "MVP_SUPPORT/P1/reference",
    targetAreas: ["components/*", "components/ui/*", "lib/scf-foundation.ts"],
    implementationIntent:
      "Markiere sichtbare aber nicht zu bauende Controls als statisch, disabled oder explanatory, damit kein falscher Funktionsanspruch entsteht.",
    positiveAcceptance: "Statische Controls sind klar als nicht interaktiv gekennzeichnet.",
    negativeAcceptance: "Nutzer kann keine Mutation/Filterung erwarten.",
    testObligation: "Route smoke and no-overclaim boundary assertions",
    dependencyOrder: "SCF-P01-T002",
    proofRequired: "Static-explicit treatment is represented by the Do-Not-Implement/static register.",
    status: "implementation_candidate",
    subtaskCount: 4,
  },
  {
    id: "SCF-P02-T002",
    phase: "P02",
    taskName: "P1/Reference/Hold Do-Not-Implement Register umsetzen",
    taskType: "Cleanup/Scope",
    taskPriority: "Hold",
    sourceRouteIds: "052,053,059,060,061,062,063,064,065,066,067,068,069,070,071",
    targetAreas: ["lib/scf-foundation.ts", "lib/route-registry.ts", "components/route-skeleton-page.tsx"],
    implementationIntent: "Sichere P1, Reference-only und Hold Routen gegen versehentliche MVP-Tasks.",
    positiveAcceptance: "Do-Not-Implement Register existiert.",
    negativeAcceptance: "Codex würde Hold nicht bauen.",
    testObligation: "route-smoke and P0 acceptance register assertions",
    dependencyOrder: "SCF-P01-T002",
    proofRequired: "P1, Reference and Hold scopes stay registered-only and excluded from MVP navigation/product tasks.",
    status: "blocked",
    subtaskCount: 4,
  },
  {
    id: "SCF-P03-T001",
    phase: "P03",
    taskName: "Providerless mapped current user und tenant context härten",
    taskType: "Foundation/Safety",
    taskPriority: "P0",
    sourceRouteIds: "001-006,013-018",
    targetAreas: ["components/demo-session-provider.tsx", "lib/demo-session.ts", "lib/permission-engine.ts", "prisma/seed.ts"],
    implementationIntent:
      "Provider kann technisch stub bleiben, aber UI/API/Services müssen deterministischen User, Tenant, Rollen, Membership und Object Scope nutzen.",
    positiveAcceptance: "Mapped user sieht eigene Tenant/Role Contexts.",
    negativeAcceptance: "Unknown/wrong tenant fail-closed und kein Payload-Leak.",
    testObligation: "permission-engine.spec.ts; providerless-scope and route-smoke targeted assertions",
    dependencyOrder: "SCF-P02-T002",
    proofRequired: "Session context is deterministic, tenant-scoped and represented in permission tests.",
    status: "implementation_candidate",
    subtaskCount: 5,
  },
  {
    id: "SCF-P03-T002",
    phase: "P03",
    taskName: "Route/action/object/payload permission boundary implementieren",
    taskType: "Foundation/Safety",
    taskPriority: "P0",
    sourceRouteIds: "001-071",
    targetAreas: ["lib/permission-engine.ts", "lib/visibility-engine.ts", "components/app-shell.tsx"],
    implementationIntent: "Trenne Route Shell, Action Permission, Object Scope und Payload Visibility für alle MVP/MVP_SUPPORT Flows.",
    positiveAcceptance: "Permitted actor sees allowed route/action only.",
    negativeAcceptance: "Route shell ohne action/payload permission bleibt hidden/denied.",
    testObligation: "permission-engine.spec.ts; route smoke negative candidates",
    dependencyOrder: "SCF-P03-T001",
    proofRequired: "Route access, action permission, object scope and payload visibility are separate in code/tests.",
    status: "implementation_candidate",
    subtaskCount: 5,
  },
  {
    id: "SCF-P04-T001",
    phase: "P04",
    taskName: "Evidence Request Status und Needs-Evidence States einführen",
    taskType: "Evidence/UI/API",
    taskPriority: "P0",
    sourceRouteIds: "027,028,029,030,038,041,046,047",
    targetAreas: ["components/client-intake-screen.tsx", "components/decisions-governance-screen.tsx", "lib/evidence-service.ts"],
    implementationIntent: "Plane UI/API/State für Evidence Request, Review Pending, Linked, Sufficient/Insufficient ohne Upload-Overclaim.",
    positiveAcceptance: "Evidence Request führt zu Upload und Review Queue.",
    negativeAcceptance: "Upload success bleibt upload-only; insufficient evidence blockt release.",
    testObligation: "document-upload-api/flow + evidence sufficiency negatives",
    dependencyOrder: "SCF-P03-T002",
    proofRequired: "Evidence lifecycle has explicit states and P0 tests.",
    status: "implementation_candidate",
    subtaskCount: 5,
  },
  {
    id: "SCF-P04-T002",
    phase: "P04",
    taskName: "Document Upload UX und API Validierung komplettieren",
    taskType: "Evidence/API/UI",
    taskPriority: "P0",
    sourceRouteIds: "028,027",
    targetAreas: ["components/client-intake-screen.tsx", "app/api/documents/upload/route.ts", "lib/document-upload-service.ts"],
    implementationIntent: "Harte Validierung für file type/size/tenant/role/context, Retry, Fehler und reload-proof Liste.",
    positiveAcceptance: "Valid upload erzeugt Document/Version/Extraction/Evidence/Audit und erscheint in Liste.",
    negativeAcceptance: "Forbidden role/unsupported file/wrong tenant erzeugt keine sichtbare Row; denied audit.",
    testObligation: "document-upload-api.spec.ts; document-upload-flow.spec.ts",
    dependencyOrder: "SCF-P04-T001",
    proofRequired: "Upload is robust, reloadable and still not evidence sufficiency.",
    status: "implementation_candidate",
    subtaskCount: 5,
  },
  {
    id: "SCF-P04-T003",
    phase: "P04",
    taskName: "Evidence Review/Link/Sufficiency Entscheidung planen",
    taskType: "Evidence/Workflow",
    taskPriority: "P0",
    sourceRouteIds: "029,030,046,047,038,039,041",
    targetAreas: ["lib/evidence-service.ts", "lib/workflow-gate.ts", "components/decisions-governance-screen.tsx"],
    implementationIntent: "Erstelle Work Package für Review, Link zu Recommendation/Decision/Compliance und Sufficiency Entscheidung.",
    positiveAcceptance: "Reviewer kann Evidence linking/sufficiency begründet markieren.",
    negativeAcceptance: "Unlinked/stale/unreviewed evidence blockiert Release.",
    testObligation: "workflow-gate.spec.ts update; evidence-service negative candidates",
    dependencyOrder: "SCF-P04-T001",
    proofRequired: "Sufficiency is explicit, scoped and testable.",
    status: "implementation_candidate",
    subtaskCount: 5,
  },
  {
    id: "SCF-P05-T001",
    phase: "P05",
    taskName: "Signal Review und Analyst Classification schließen",
    taskType: "Signal/Workflow",
    taskPriority: "P0",
    sourceRouteIds: "033,034,035",
    targetAreas: ["components/internal-workflow-screen.tsx", "lib/internal-workflow-demo-data.ts", "lib/demo-workflow-mutation.ts"],
    implementationIntent: "Signal/Trigger wird intern klassifiziert, priorisiert und zur Draft/Review-Arbeit geroutet.",
    positiveAcceptance: "Analyst klassifiziert Signal und erzeugt internal-only workflow item.",
    negativeAcceptance: "Signal erzeugt keinen client-visible payload.",
    testObligation: "demo-workflow-api.spec.ts; workflow-gate.spec.ts",
    dependencyOrder: "SCF-P03-T002",
    proofRequired: "Signal flow remains internal-only.",
    status: "implementation_candidate",
    subtaskCount: 5,
  },
  {
    id: "SCF-P05-T002",
    phase: "P05",
    taskName: "AI/rules draft internal-only payload boundary implementieren",
    taskType: "Signal/Safety",
    taskPriority: "P0",
    sourceRouteIds: "033,034,035,036,037,019,020,054-058",
    targetAreas: ["lib/visibility-engine.ts", "lib/export-service.ts", "components/internal-workflow-screen.tsx"],
    implementationIntent: "Stelle sicher, dass AI/rules draft, internal rationale, analyst notes und compliance notes nur intern bleiben.",
    positiveAcceptance: "Advisor/Analyst sieht interne Drafts.",
    negativeAcceptance: "Client/API/export sieht keine Drafts/internal rationale.",
    testObligation: "client-visibility-proof.spec.ts; file-export-realism.spec.ts",
    dependencyOrder: "SCF-P05-T001",
    proofRequired: "AI Draft leakage is negatively tested.",
    status: "implementation_candidate",
    subtaskCount: 5,
  },
  {
    id: "SCF-P05-T003",
    phase: "P05",
    taskName: "Advisor Approval getrennt von Release implementieren",
    taskType: "Workflow/Safety",
    taskPriority: "P0",
    sourceRouteIds: "036,037,038,039,040,043,044,045",
    targetAreas: ["components/internal-workflow-screen.tsx", "components/decisions-governance-screen.tsx", "lib/workflow-gate.ts"],
    implementationIntent: "Advisor approval setzt nur compliance-pending; Release bleibt Compliance-only.",
    positiveAcceptance: "Advisor approval erzeugt pending compliance state.",
    negativeAcceptance: "Client visibility bleibt hidden bis Compliance Release.",
    testObligation: "workflow-gate.spec.ts; demo-workflow-api.spec.ts negative",
    dependencyOrder: "SCF-P05-T002",
    proofRequired: "Advisor approval is proven not to be release.",
    status: "implementation_candidate",
    subtaskCount: 5,
  },
  {
    id: "SCF-P06-T001",
    phase: "P06",
    taskName: "Compliance Release/Block/Request Evidence Gate implementieren",
    taskType: "Workflow/Safety",
    taskPriority: "P0",
    sourceRouteIds: "038,039,040,041,042,043,044,045",
    targetAreas: ["components/internal-workflow-screen.tsx", "components/decisions-governance-screen.tsx", "lib/workflow-gate.ts", "lib/audit-service.ts"],
    implementationIntent: "Compliance kann Release, Block oder Request Evidence nur nach advisor/evidence/audit/precondition checks durchführen.",
    positiveAcceptance: "Compliance released nur vollständige Fälle.",
    negativeAcceptance: "Missing advisor/evidence/audit blocks release and hides client payload.",
    testObligation: "workflow-gate.spec.ts; demo-workflow-api.spec.ts compliance negatives",
    dependencyOrder: "SCF-P04-T003, SCF-P05-T003",
    proofRequired: "Compliance gate is fail-closed.",
    status: "implementation_candidate",
    subtaskCount: 5,
  },
  {
    id: "SCF-P06-T002",
    phase: "P06",
    taskName: "Critical Gate Audit Persistence sicherstellen",
    taskType: "Safety/Audit",
    taskPriority: "P0",
    sourceRouteIds: "036-045,048-051,054-058",
    targetAreas: ["lib/audit-service.ts", "prisma/schema.prisma", "tests/*"],
    implementationIntent: "Jede kritische Aktion schreibt AuditEvent oder bleibt pending/denied. Audit display zählt nicht als persistence.",
    positiveAcceptance: "Gate actions produce actor/role/target/result/prev/next/reason audit rows.",
    negativeAcceptance: "Audit failure prevents release/export/permission mutation.",
    testObligation: "permission-engine.spec.ts; document-upload-api.spec.ts; phase6-audit-persistence.spec.ts",
    dependencyOrder: "SCF-P06-T001",
    proofRequired: "Audit persistence is a prerequisite for safety proof.",
    status: "implementation_candidate",
    subtaskCount: 5,
  },
];

const subtaskNamesByStep = [
  "Current Reality und Source IDs verifizieren",
  "Behaviour/API/Schema Contract ausarbeiten",
  "Safety- und UX-State-Anforderungen binden",
  "Positive und negative Tests festlegen",
  "Proof Package und DoD definieren",
] as const;

function subtaskIdsForTask(task: ScfMasterTaskDetail) {
  return Array.from({ length: task.subtaskCount }, (_, index) => `${task.id}-S${String(index + 1).padStart(2, "0")}`);
}

function subtaskDetailFor(task: ScfMasterTaskDetail, id: string, index: number): ScfSubtaskDetail {
  const previousId = index > 0 ? `${task.id}-S${String(index).padStart(2, "0")}` : task.dependencyOrder;
  const isFinalSubtask = index === task.subtaskCount - 1;
  const targetArea = index === task.subtaskCount - 1 ? "proof package" : task.targetAreas.join(", ");

  return {
    acceptance:
      isFinalSubtask
        ? "Code, test, audit, UI, data and regression proof are assigned."
        : index === 0
        ? "Source IDs are confirmed or explicitly TO_VERIFY."
        : index === 1
          ? "Behaviour is represented as an implementation contract without an open product decision."
          : index === 2
            ? "Fail-closed and no-overclaim states are bound to the task."
            : "Positive and negative test obligations are explicit.",
    actionDetail:
      isFinalSubtask
        ? task.proofRequired
        : index === 0
        ? `Verify source routes ${task.sourceRouteIds} and target areas for ${task.id}.`
        : index === 1
          ? task.implementationIntent
          : index === 2
            ? `Bind safety and UX requirements for ${task.taskName}.`
            : `Map positive acceptance "${task.positiveAcceptance}" and negative acceptance "${task.negativeAcceptance}" to tests.`,
    dependency: previousId,
    id,
    notes: index === task.subtaskCount - 1 ? "No completion without proof." : "No visual-as-behaviour or source-ID-less task.",
    parentTaskId: task.id,
    proof:
      isFinalSubtask
        ? "Proof checklist"
        : index === 0
        ? "Traceability matrix"
        : index === 1
          ? "Task detail record"
          : index === 2
            ? "Safety checklist"
            : "P0 test map",
    subtaskName:
      task.phase === "P01" && index === 0
        ? "Source- und Count-Baseline prüfen"
        : task.phase === "P01" && index === 1
          ? "Target Areas plausibilisieren"
          : task.phase === "P01" && index === 2
            ? "Proof- und Stop-Rule-Bindung ergänzen"
            : task.phase === "P02" && index === 0
              ? "Betroffene UI-Items sammeln"
              : task.phase === "P02" && index === 1
                ? "UI-Behandlung spezifizieren"
                : task.phase === "P02" && index === 2
                  ? "Do-Not-Implement Guard definieren"
                  : task.phase === "P02" && index === 3
                    ? "Regression-/Smoke-Kriterien definieren"
                    : subtaskNamesByStep[index],
    targetArea,
  };
}

export function scfMasterTasksForPhases(phases: ScfFoundationPhaseId[]) {
  const phaseSet = new Set(phases);

  return scfP01P06MasterTaskDetails.filter((task) => phaseSet.has(task.phase));
}

export function scfSubtasksForPhases(phases: ScfFoundationPhaseId[]) {
  return scfMasterTasksForPhases(phases).flatMap((task) =>
    subtaskIdsForTask(task).map((id, index) => subtaskDetailFor(task, id, index)),
  );
}

export function scfFoundationTaskIds() {
  return scfFoundationPhases.flatMap((phase) => phase.tasks);
}

export function scfRouteScopeIsDoNotImplement(scope: RouteScopeLabel) {
  return scope === "P1_AFTER_MVP" || scope === "REFERENCE_ONLY" || scope === "HOLD_PENDING_DECISION";
}
