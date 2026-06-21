import type { RouteScopeLabel } from "@/lib/route-registry";

export type ScfFoundationPhaseId = "P00" | "P01" | "P02" | "P03" | "P04" | "P05" | "P06";

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
  | "SCF-P06-T002";

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

export function scfFoundationTaskIds() {
  return scfFoundationPhases.flatMap((phase) => phase.tasks);
}

export function scfRouteScopeIsDoNotImplement(scope: RouteScopeLabel) {
  return scope === "P1_AFTER_MVP" || scope === "REFERENCE_ONLY" || scope === "HOLD_PENDING_DECISION";
}
