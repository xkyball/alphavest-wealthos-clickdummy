import coverageMatrixArtifact from "@/docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX.json";

export type ProcessDefinitionStatus = "ACTIVE" | "BLOCKED" | "DEFERRED" | "RETIRED";
export type ProcessInstanceStatus = "CREATED" | "ACTIVE" | "BLOCKED" | "COMPLETED" | "CANCELLED";
export type ProcessStepStatus = "LOCKED" | "READY" | "ACTIVE" | "BLOCKED" | "COMPLETED" | "SKIPPED";
export type ProcessCommandKey = "START" | "COMPLETE_STEP" | "BLOCK" | "CANCEL";

export type ProcessStepDefinition = {
  acceptanceState: string;
  action: string | null;
  actor: string | null;
  decisionPoint: boolean;
  gateType: string | null;
  sequence: number;
  stepId: string;
  stepLabel: string;
};

export type ProcessDefinition = {
  domainId: string;
  domainName: string;
  intendedAreaId: string | null;
  intendedAreaName: string | null;
  processId: string;
  processName: string;
  sourceArtifact: string;
  status: ProcessDefinitionStatus;
  steps: ProcessStepDefinition[];
};

type CoverageStep = {
  acceptance_state: string;
  action?: string | null;
  actor?: string | null;
  decision_point?: boolean;
  domain_id: string;
  domain_name: string;
  gate_type?: string | null;
  intended_area_id?: string | null;
  intended_area_name?: string | null;
  process_id: string;
  process_name: string;
  sequence: number;
  step_id: string;
  step_label: string;
};

type CoverageMatrixArtifact = {
  coverage_matrix: CoverageStep[];
};

const coverageMatrix = coverageMatrixArtifact as CoverageMatrixArtifact;

function processStatusForSteps(steps: CoverageStep[]): ProcessDefinitionStatus {
  if (steps.every((step) => step.acceptance_state === "specified_only")) return "DEFERRED";
  return "ACTIVE";
}

function processNumber(processId: string) {
  return Number(processId.replace(/^BP-/, ""));
}

export const processRuntimeDefinitions: ProcessDefinition[] = Object.values(
  coverageMatrix.coverage_matrix.reduce<Record<string, CoverageStep[]>>((groups, step) => {
    groups[step.process_id] = groups[step.process_id] ? [...groups[step.process_id], step] : [step];
    return groups;
  }, {}),
)
  .map((steps) => {
    const sortedSteps = [...steps].sort((a, b) => a.sequence - b.sequence || a.step_id.localeCompare(b.step_id));
    const first = sortedSteps[0];

    return {
      domainId: first.domain_id,
      domainName: first.domain_name,
      intendedAreaId: first.intended_area_id ?? null,
      intendedAreaName: first.intended_area_name ?? null,
      processId: first.process_id,
      processName: first.process_name,
      sourceArtifact: "docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX.json",
      status: processStatusForSteps(sortedSteps),
      steps: sortedSteps.map((step) => ({
        acceptanceState: step.acceptance_state,
        action: step.action ?? null,
        actor: step.actor ?? null,
        decisionPoint: Boolean(step.decision_point),
        gateType: step.gate_type ?? null,
        sequence: step.sequence,
        stepId: step.step_id,
        stepLabel: step.step_label,
      })),
    };
  })
  .sort((a, b) => processNumber(a.processId) - processNumber(b.processId));

export const processRuntimeDefinitionById = new Map(
  processRuntimeDefinitions.map((definition) => [definition.processId, definition]),
);

export const genericRuntimeDomainSpineRequiredDomains = new Set(["DOMAIN-G", "DOMAIN-H", "DOMAIN-J"]);

export function requiresDomainSpineForGenericCompletion(definition: ProcessDefinition) {
  return genericRuntimeDomainSpineRequiredDomains.has(definition.domainId);
}

export function requireProcessDefinition(processId: string) {
  const definition = processRuntimeDefinitionById.get(processId);
  if (!definition) {
    throw new Error(`${processId} is not present in the P0 Process Runtime Registry.`);
  }
  return definition;
}

export function processRuntimeIntegrity() {
  const activeKeys = processRuntimeDefinitions.filter((definition) => definition.status === "ACTIVE").map((definition) => definition.processId);
  const deferredKeys = processRuntimeDefinitions.filter((definition) => definition.status === "DEFERRED").map((definition) => definition.processId);
  const totalStepCount = processRuntimeDefinitions.reduce((sum, definition) => sum + definition.steps.length, 0);

  return {
    activeKeys,
    deferredKeys,
    sourceArtifact: "docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX.json",
    totalDefinitions: processRuntimeDefinitions.length,
    totalStepCount,
  };
}
