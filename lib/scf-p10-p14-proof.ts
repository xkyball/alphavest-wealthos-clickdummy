import {
  scfDoNotImplementRegister,
  scfFoundationStages,
  scfMasterTasksForStages,
  scfSubtasksForStages,
  type ScfFoundationStageId,
} from "@/lib/scf-foundation";

export const scfP10P14StageIds = ["P10", "P11", "P12", "P13", "P14"] satisfies ScfFoundationStageId[];
export const scfP10P14UnsupportedRequestedStages = ["P15"] as const;
const scfP10P14StageSet = new Set<ScfFoundationStageId>(scfP10P14StageIds);

const p10P14MasterTasks = scfMasterTasksForStages(scfP10P14StageIds);
const p10P14Subtasks = scfSubtasksForStages(scfP10P14StageIds);

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
    "ALPHAVEST_SCREEN_CAPABILITY_E2E_SOURCE_PROMPT_PACK.md",
  ],
  proofCommands: [
    "pnpm typecheck",
    "pnpm lint",
    "pnpm db:validate",
    "pnpm build",
    "pnpm exec playwright test tests/scf-p10-p14-closure.spec.ts tests/p0-acceptance.spec.ts tests/p0-api-contract.spec.ts tests/document-upload-api.spec.ts tests/interaction-lifecycle.spec.ts tests/confirmation-lifecycle.spec.ts --workers=1",
  ],
  requestedStages: scfP10P14StageIds,
  unsupportedRequestedStages: scfP10P14UnsupportedRequestedStages,
};

export function buildScfP10P14ProofPackage() {
  const p14Tasks = p10P14MasterTasks.filter((task) => task.stage === "P14");

  return {
    ...scfP10P14ClosureProof,
    masterTaskCount: p10P14MasterTasks.length,
    stageRecords: scfFoundationStages.filter((stage) => scfP10P14StageSet.has(stage.id)),
    promptPackStatus:
      p14Tasks.every((task) => task.status === "blocked_until_QA") ? "QA_GATED_DERIVATION_ONLY" : "READY_FOR_EXECUTION",
    p14TaskStatuses: p14Tasks.map((task) => ({ id: task.id, status: task.status })),
    subtaskCount: p10P14Subtasks.length,
    taskIds: p10P14MasterTasks.map((task) => task.id),
  };
}

export const scfP10P14ProofPackage = buildScfP10P14ProofPackage();
