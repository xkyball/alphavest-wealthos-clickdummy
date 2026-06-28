import { readFileSync, writeFileSync } from "node:fs";

type JsonRecord = Record<string, unknown>;

type InventoryStep = {
  step_id: string;
  process_id: string;
  process_name: string;
  domain_id: string;
  domain_name: string;
  intended_area_id: string;
  intended_area_name: string | null;
  sequence: number;
  step_label: string;
  actor: string;
  action: string;
  decision_point: boolean;
  gate_type: string | null;
  safety_checks: string[];
  evidence_or_audit_events: string[];
  current_status: string;
  current_touchpoints: {
    routes: string[];
    apis: string[];
    models_or_services: string[];
    tests: string[];
  };
  acceptance: {
    positive: string[];
    negative: string[];
    user_feedback_requirement: string;
  };
  open_decisions: string[];
  known_gaps: string[];
  proof_gaps: string[];
  implementation_readiness: string;
  p0_scope: string;
};

type InventoryArtifact = {
  summary: {
    retained_p0_process_count: number;
    retained_p0_step_count: number;
  };
  domain_summary: JsonRecord[];
  area_summary: JsonRecord[];
  process_inventory: JsonRecord[];
  step_inventory: InventoryStep[];
};

type StateContract = {
  acceptance_states: Array<{ state_id: string; completion_credit: "full" | "partial" | "none" }>;
  safety_gate_acceptance_requirements: Record<string, string[]>;
  matrix_generation_contract: {
    required_output_fields_per_step: string[];
  };
};

type SchemaContract = {
  allowed_acceptance_states: string[];
  completion_credit_by_state: Record<string, "full" | "partial" | "none">;
  required_step_fields: string[];
};

type CoverageStep = {
  step_id: string;
  process_id: string;
  process_name: string;
  domain_id: string;
  domain_name: string;
  intended_area_id: string;
  intended_area_name: string | null;
  step_label: string;
  sequence: number;
  actor: string;
  action: string;
  decision_point: boolean;
  gate_type: string | null;
  safety_checks: string[];
  inventory_current_status: string;
  acceptance_state: string;
  completion_credit: "full" | "partial" | "none";
  state_reason_codes: string[];
  current_touchpoints: InventoryStep["current_touchpoints"];
  missing_layers: string[];
  required_positive_proof: string[];
  required_negative_proof: string[];
  proof_refs: {
    positive: string[];
    negative: string[];
  };
  blockers: Array<{ blocker_type: string; values: string[] }>;
  next_implementation_target: string;
};

type CoverageArtifact = {
  artifact_kind: "p0_process_coverage_matrix";
  ticket_id: "EPIC-02-IMPL-01";
  ticket_title: string;
  status: "generated";
  generated_at: string;
  machine_readable: true;
  sources: JsonRecord;
  summary: JsonRecord;
  domain_summary: JsonRecord[];
  area_summary: JsonRecord[];
  gap_index: JsonRecord[];
  next_ticket_derivation: JsonRecord[];
  coverage_matrix: CoverageStep[];
  validation: {
    status: "PASS" | "FAIL";
    errors: string[];
    checks: JsonRecord[];
  };
};

const inventoryPath = "reports/process-first-refactoring-masterplan-2026-06-28/EPIC-02-ANALYSIS-01_P0_PROCESS_STEP_INVENTORY.json";
const stateContractPath = "docs/00-current/ALPHAVEST_P0_PROCESS_STEP_ACCEPTANCE_STATES_CONTRACT.json";
const schemaPath = "docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX_SCHEMA.json";
const outputPath = "docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX.json";

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function countBy<T>(items: T[], keyFor: (item: T) => string) {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyFor(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)));
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function hasAnyTouchpoint(step: InventoryStep) {
  const touchpoints = step.current_touchpoints;
  return (
    touchpoints.routes.length > 0 ||
    touchpoints.apis.length > 0 ||
    touchpoints.models_or_services.length > 0 ||
    touchpoints.tests.length > 0
  );
}

function touchpointLayerCount(step: InventoryStep) {
  const touchpoints = step.current_touchpoints;
  return [
    touchpoints.routes.length > 0,
    touchpoints.apis.length > 0,
    touchpoints.models_or_services.length > 0,
    touchpoints.tests.length > 0,
  ].filter(Boolean).length;
}

function classifyStep(step: InventoryStep): { acceptanceState: string; reasonCodes: string[] } {
  const reasonCodes: string[] = [];

  if (!hasAnyTouchpoint(step)) {
    return {
      acceptanceState: "missing",
      reasonCodes: ["NO_CURRENT_APP_TOUCHPOINT"],
    };
  }

  if (step.current_status === "specified_not_proven") {
    return {
      acceptanceState: "specified_only",
      reasonCodes: ["PROCESS_UNIVERSE_SPECIFIED_WITHOUT_SUFFICIENT_CURRENT_PROOF"],
    };
  }

  if (
    step.current_status === "partial_current_app_representation" ||
    step.current_status === "partial_domain_representation" ||
    step.current_status === "strong_partial_domain_representation" ||
    step.current_status === "strong_partial_current_app_representation"
  ) {
    reasonCodes.push("CURRENT_APP_TOUCHPOINTS_EXIST");
    reasonCodes.push("POSITIVE_AND_NEGATIVE_STEP_PROOF_INCOMPLETE");
    if (step.current_status.startsWith("strong_partial")) reasonCodes.push("STRONG_PARTIAL_STILL_REQUIRES_STEP_LEVEL_PROOF");
    return { acceptanceState: "partially_implemented", reasonCodes };
  }

  return {
    acceptanceState: "specified_only",
    reasonCodes: ["UNRECOGNIZED_INVENTORY_STATUS_TREATED_AS_SPECIFIED_ONLY"],
  };
}

function missingLayersFor(step: InventoryStep, acceptanceState: string) {
  const missing: string[] = [];
  if (step.current_touchpoints.routes.length === 0) missing.push("route_or_entrypoint");
  if (step.current_touchpoints.apis.length === 0) missing.push("domain_service_or_api");
  if (step.current_touchpoints.models_or_services.length === 0) missing.push("persistence_or_model");
  if (step.safety_checks.length > 0) missing.push("step_level_gate_proof");
  if (step.evidence_or_audit_events.length > 0) missing.push("audit_or_evidence_failure_proof");
  if (step.current_touchpoints.tests.length === 0) missing.push("positive_test");
  missing.push("negative_test");
  if (acceptanceState === "specified_only") missing.push("implementation_touchpoint_proof");
  if (acceptanceState === "missing") missing.push("implementation_target");
  return unique(missing);
}

function blockersFor(step: InventoryStep) {
  const blockers: CoverageStep["blockers"] = [];
  if (step.open_decisions.length > 0) blockers.push({ blocker_type: "open_decisions", values: step.open_decisions });
  if (step.known_gaps.length > 0) blockers.push({ blocker_type: "known_gaps", values: step.known_gaps });
  if (step.proof_gaps.length > 0) blockers.push({ blocker_type: "proof_gaps", values: step.proof_gaps });
  return blockers;
}

function nextTargetFor(acceptanceState: string) {
  if (acceptanceState === "not_authorized" || acceptanceState === "blocked_by_decision") return "decision_or_scope_update";
  if (acceptanceState === "blocked_by_schema") return "schema_or_api_contract_decision";
  if (acceptanceState === "missing" || acceptanceState === "specified_only") return "define_or_build_step_behavior";
  if (acceptanceState === "visual_only") return "replace_visual_only_with_behavior_and_proof";
  if (acceptanceState === "partially_implemented") return "close_missing_layers_and_positive_negative_proof";
  return "maintain_regression_proof";
}

function requiredNegativeProof(step: InventoryStep, stateContract: StateContract) {
  const gateProof = step.safety_checks.flatMap((gate) => stateContract.safety_gate_acceptance_requirements[gate] ?? []);
  return unique([...step.acceptance.negative, ...gateProof, "no downstream gate overclaim"]);
}

function buildMatrix(inventory: InventoryArtifact, stateContract: StateContract, schema: SchemaContract): CoverageArtifact {
  const completionByState = schema.completion_credit_by_state;
  const coverageMatrix = inventory.step_inventory.map((step) => {
    const classification = classifyStep(step);
    const acceptanceState = classification.acceptanceState;
    return {
      step_id: step.step_id,
      process_id: step.process_id,
      process_name: step.process_name,
      domain_id: step.domain_id,
      domain_name: step.domain_name,
      intended_area_id: step.intended_area_id,
      intended_area_name: step.intended_area_name,
      step_label: step.step_label,
      sequence: step.sequence,
      actor: step.actor,
      action: step.action,
      decision_point: step.decision_point,
      gate_type: step.gate_type,
      safety_checks: step.safety_checks,
      inventory_current_status: step.current_status,
      acceptance_state: acceptanceState,
      completion_credit: completionByState[acceptanceState] ?? "none",
      state_reason_codes: classification.reasonCodes,
      current_touchpoints: step.current_touchpoints,
      missing_layers: missingLayersFor(step, acceptanceState),
      required_positive_proof: step.acceptance.positive,
      required_negative_proof: requiredNegativeProof(step, stateContract),
      proof_refs: {
        positive: [],
        negative: [],
      },
      blockers: blockersFor(step),
      next_implementation_target: nextTargetFor(acceptanceState),
    } satisfies CoverageStep;
  });

  const gapIndex = Object.entries(countBy(coverageMatrix.flatMap((step) => step.missing_layers), (layer) => layer)).map(
    ([gap_id, step_count]) => ({ gap_id, step_count }),
  );
  const nextTicketDerivation = Object.entries(countBy(coverageMatrix, (step) => step.intended_area_id)).map(
    ([area_id, step_count]) => ({
      area_id,
      step_count,
      recommended_ticket_family: area_id === "AREA-01" ? "EPIC-06_OR_FOUNDATION" : `PROCESS_FILL_${area_id}`,
    }),
  );
  const statusCounts = countBy(coverageMatrix, (step) => step.acceptance_state);
  const validation = validateMatrix(coverageMatrix, inventory, schema);

  return {
    artifact_kind: "p0_process_coverage_matrix",
    ticket_id: "EPIC-02-IMPL-01",
    ticket_title: "Generate repo-local P0 process coverage matrix artifact",
    status: "generated",
    generated_at: "2026-06-28",
    machine_readable: true,
    sources: {
      inventory: inventoryPath,
      acceptance_states_contract: stateContractPath,
      schema: schemaPath,
    },
    summary: {
      retained_p0_process_count: inventory.summary.retained_p0_process_count,
      retained_p0_step_count: inventory.summary.retained_p0_step_count,
      matrix_step_count: coverageMatrix.length,
      acceptance_state_counts: statusCounts,
      completion_credit_counts: countBy(coverageMatrix, (step) => step.completion_credit),
      decision_step_count: coverageMatrix.filter((step) => step.decision_point).length,
      safety_step_count: coverageMatrix.filter((step) => step.safety_checks.length > 0).length,
      implemented_step_count: statusCounts.implemented ?? 0,
      completion_claim_allowed: (statusCounts.implemented ?? 0) === coverageMatrix.length,
    },
    domain_summary: inventory.domain_summary.map((domain) => {
      const domainId = String(domain.domain_id);
      const domainSteps = coverageMatrix.filter((step) => step.domain_id === domainId);
      return {
        ...domain,
        acceptance_state_counts: countBy(domainSteps, (step) => step.acceptance_state),
        missing_layer_counts: countBy(domainSteps.flatMap((step) => step.missing_layers), (layer) => layer),
      };
    }),
    area_summary: inventory.area_summary.map((area) => {
      const areaId = String(area.area_id);
      const areaSteps = coverageMatrix.filter((step) => step.intended_area_id === areaId);
      return {
        ...area,
        acceptance_state_counts: countBy(areaSteps, (step) => step.acceptance_state),
        missing_layer_counts: countBy(areaSteps.flatMap((step) => step.missing_layers), (layer) => layer),
      };
    }),
    gap_index: gapIndex,
    next_ticket_derivation: nextTicketDerivation,
    coverage_matrix: coverageMatrix,
    validation,
  };
}

function validateMatrix(steps: CoverageStep[], inventory: InventoryArtifact, schema: SchemaContract) {
  const errors: string[] = [];
  const allowed = new Set(schema.allowed_acceptance_states);
  for (const step of steps) {
    for (const field of schema.required_step_fields) {
      if (!(field in step)) errors.push(`${step.step_id} missing required field ${field}`);
    }
    if (!allowed.has(step.acceptance_state)) errors.push(`${step.step_id} has invalid acceptance_state ${step.acceptance_state}`);
    if (step.acceptance_state === "implemented" && step.proof_refs.positive.length === 0) {
      errors.push(`${step.step_id} implemented without positive proof`);
    }
    if (step.acceptance_state === "implemented" && step.safety_checks.length > 0 && step.proof_refs.negative.length === 0) {
      errors.push(`${step.step_id} safety-sensitive implemented without negative proof`);
    }
    if (step.acceptance_state === "not_authorized" && step.next_implementation_target !== "decision_or_scope_update") {
      errors.push(`${step.step_id} not_authorized has invalid next target`);
    }
    if (step.acceptance_state === "visual_only" && step.completion_credit !== "none") {
      errors.push(`${step.step_id} visual_only has completion credit`);
    }
  }
  if (steps.length !== inventory.summary.retained_p0_step_count) {
    errors.push(`matrix step count ${steps.length} does not match retained ${inventory.summary.retained_p0_step_count}`);
  }
  return {
    status: errors.length === 0 ? "PASS" : "FAIL",
    errors,
    checks: [
      { check_id: "MATRIX-RULE-001", pass: steps.every((step) => allowed.has(step.acceptance_state)) },
      { check_id: "MATRIX-RULE-002", pass: steps.every((step) => step.acceptance_state !== "implemented" || step.proof_refs.positive.length > 0) },
      { check_id: "MATRIX-RULE-003", pass: steps.every((step) => step.acceptance_state !== "implemented" || step.safety_checks.length === 0 || step.proof_refs.negative.length > 0) },
      { check_id: "MATRIX-RULE-004", pass: steps.every((step) => step.acceptance_state !== "not_authorized" || step.next_implementation_target === "decision_or_scope_update") },
      { check_id: "MATRIX-RULE-005", pass: steps.every((step) => step.acceptance_state !== "visual_only" || step.completion_credit === "none") },
      { check_id: "MATRIX-RULE-006", pass: steps.length === inventory.summary.retained_p0_step_count },
    ],
  } satisfies CoverageArtifact["validation"];
}

const dryRun = process.argv.includes("--dry-run");
const checkOnly = process.argv.includes("--check");
const inventory = readJson<InventoryArtifact>(inventoryPath);
const stateContract = readJson<StateContract>(stateContractPath);
const schema = readJson<SchemaContract>(schemaPath);
const artifact = buildMatrix(inventory, stateContract, schema);

if (artifact.validation.status !== "PASS") {
  console.error(JSON.stringify(artifact.validation, null, 2));
  process.exit(1);
}

if (checkOnly) {
  const existing = readJson<CoverageArtifact>(outputPath);
  const existingValidation = validateMatrix(existing.coverage_matrix, inventory, schema);
  if (existingValidation.status !== "PASS") {
    console.error(JSON.stringify(existingValidation, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ status: "PASS", checked: outputPath }, null, 2));
} else if (dryRun) {
  console.log(JSON.stringify({ status: "PASS", mode: "dry-run", summary: artifact.summary }, null, 2));
} else {
  writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`);
  console.log(JSON.stringify({ status: "PASS", wrote: outputPath, summary: artifact.summary }, null, 2));
}
