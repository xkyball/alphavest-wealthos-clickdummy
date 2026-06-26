import {
  scfDoNotImplementRegister,
  scfFoundationPhases,
  scfMasterTasksForPhases,
  scfSubtasksForPhases,
  type ScfFoundationPhaseId,
} from "@/lib/scf-foundation";

export const scfP10P14PhaseIds = ["P10", "P11", "P12", "P13", "P14"] satisfies ScfFoundationPhaseId[];
export const scfP10P14UnsupportedRequestedPhases = ["P15"] as const;
const scfP10P14PhaseSet = new Set<ScfFoundationPhaseId>(scfP10P14PhaseIds);

const p10P14MasterTasks = scfMasterTasksForPhases(scfP10P14PhaseIds);
const p10P14Subtasks = scfSubtasksForPhases(scfP10P14PhaseIds);

export const scfP10P14ClosureProof = {
  apiRoutesHardened: ["/api/recommendation-review-workflow", "/api/documents", "/api/documents/upload", "/api/review-monitoring"],
  blockedScopeRegister: scfDoNotImplementRegister.map((entry) => entry.id),
  implementedSurfaces: [
    "/documents search, filters and scoped list",
    "/documents/upload validation and retry states",
    "compliance release modal lifecycle",
    "export preview/download trust panels",
    "review-monitoring fail-closed API metadata",
  ],
  proofArtifacts: [
    "docs/proof/SCF_P10_P14_PROOF_PACKAGE.md",
    "docs/v3/PHASE_EXECUTION_REPORT.md",
    "docs/v3/IMPLEMENTATION_QA_REPORT.md",
    "ALPHAVEST_SCREEN_CAPABILITY_E2E_CODEX_PROMPT_PACK.md",
  ],
  proofCommands: [
    "pnpm typecheck",
    "pnpm lint",
    "pnpm db:validate",
    "pnpm build",
    "pnpm exec playwright test tests/scf-p10-p14-closure.spec.ts tests/p0-acceptance.spec.ts tests/p0-api-contract.spec.ts tests/document-upload-api.spec.ts tests/interaction-lifecycle.spec.ts tests/confirmation-lifecycle.spec.ts --workers=1",
  ],
  requestedPhases: scfP10P14PhaseIds,
  unsupportedRequestedPhases: scfP10P14UnsupportedRequestedPhases,
};

export function buildScfP10P14ProofPackage() {
  const p14Tasks = p10P14MasterTasks.filter((task) => task.phase === "P14");

  return {
    ...scfP10P14ClosureProof,
    masterTaskCount: p10P14MasterTasks.length,
    phaseRecords: scfFoundationPhases.filter((phase) => scfP10P14PhaseSet.has(phase.id)),
    promptPackStatus:
      p14Tasks.every((task) => task.status === "blocked_until_QA") ? "QA_GATED_DERIVATION_ONLY" : "READY_FOR_EXECUTION",
    p14TaskStatuses: p14Tasks.map((task) => ({ id: task.id, status: task.status })),
    subtaskCount: p10P14Subtasks.length,
    taskIds: p10P14MasterTasks.map((task) => task.id),
  };
}

export const scfP10P14ProofPackage = buildScfP10P14ProofPackage();
