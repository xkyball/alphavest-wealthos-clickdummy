import { readFileSync, writeFileSync } from "node:fs";

type JsonRecord = Record<string, unknown>;

type CompletionCredit = "full" | "partial" | "none";

type CoverageStep = {
  step_id: string;
  domain_id: string;
  domain_name: string;
  intended_area_id: string;
  intended_area_name: string | null;
  acceptance_state: string;
  completion_credit: CompletionCredit;
  proof_refs: {
    positive: string[];
    negative: string[];
  };
  safety_checks: string[];
};

type CoverageMatrix = {
  artifact_kind: "p0_process_coverage_matrix";
  summary: {
    retained_p0_process_count: number;
    retained_p0_step_count: number;
    matrix_step_count: number;
    acceptance_state_counts: Record<string, number>;
    implemented_step_count: number;
    completion_claim_allowed: boolean;
  };
  domain_summary: JsonRecord[];
  area_summary: JsonRecord[];
  coverage_matrix: CoverageStep[];
  validation: {
    status: "PASS" | "FAIL";
    errors: string[];
  };
};

type CoverageSchema = {
  allowed_acceptance_states: string[];
  completion_credit_by_state: Record<string, CompletionCredit>;
};

type ClosureSubject = {
  subject_type: "domain" | "area";
  subject_id: string;
  subject_name: string | null;
  p0_step_count: number;
  implemented_step_count: number;
  non_implemented_step_count: number;
  acceptance_state_counts: Record<string, number>;
  closure_allowed: boolean;
  closure_status: "blocked_by_incomplete_p0_steps" | "ready_for_domain_domain_closure" | "not_applicable_no_p0_steps";
  blocking_reason_codes: string[];
};

type QaReport = {
  artifact_kind: "p0_process_coverage_matrix_qa_report";
  ticket_id: "DOMAIN-02-QA-01";
  ticket_title: string;
  generated_at: string;
  machine_readable: true;
  sources: {
    coverage_matrix: string;
    schema: string;
  };
  gate_outcome: {
    status: "PASS" | "FAIL";
    interpretation: "integrity_gate_passed_closure_blocked" | "integrity_gate_failed";
    domain_domain_closure_allowed: boolean;
    route_navigation_completion_claim_allowed: boolean;
    completion_claim_allowed: boolean;
  };
  summary: {
    retained_p0_process_count: number;
    retained_p0_step_count: number;
    matrix_step_count: number;
    unclassified_step_count: number;
    implemented_step_count: number;
    non_implemented_step_count: number;
    blocked_domain_count: number;
    blocked_area_count: number;
    acceptance_state_counts: Record<string, number>;
  };
  closure_rule_checks: Array<{
    rule_id: string;
    severity: "error";
    pass: boolean;
    description: string;
  }>;
  domain_closure_matrix: ClosureSubject[];
  area_closure_matrix: ClosureSubject[];
  errors: string[];
  next_decision_gate: {
    required_decisions: string[];
    recommended_approval_token: string;
  };
};

const matrixPath = "docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX.json";
const schemaPath = "docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX_SCHEMA.json";
const reportPath = "docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX_QA_REPORT.json";

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

function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.map(String) : [];
}

function hasBooleanClosureClaim(summary: JsonRecord) {
  return summary.closure_allowed === true || summary.completion_claim_allowed === true || summary.domain_domain_closure_allowed === true;
}

function hasTextualClosureClaim(summary: JsonRecord) {
  const status = String(summary.coverage_status ?? summary.closure_status ?? summary.status ?? "").toUpperCase();
  return status === "IMPLEMENTED" || status === "COMPLETE" || status === "READY_FOR_CLOSURE" || status === "CLOSED";
}

function closureSubjectFor(
  subjectType: "domain" | "area",
  subjectId: string,
  subjectName: string | null,
  steps: CoverageStep[],
): ClosureSubject {
  const acceptanceStateCounts = countBy(steps, (step) => step.acceptance_state);
  const implementedStepCount = acceptanceStateCounts.implemented ?? 0;
  const nonImplementedStepCount = steps.length - implementedStepCount;
  const closureAllowed = steps.length > 0 && nonImplementedStepCount === 0;
  return {
    subject_type: subjectType,
    subject_id: subjectId,
    subject_name: subjectName,
    p0_step_count: steps.length,
    implemented_step_count: implementedStepCount,
    non_implemented_step_count: nonImplementedStepCount,
    acceptance_state_counts: acceptanceStateCounts,
    closure_allowed: closureAllowed,
    closure_status:
      steps.length === 0
        ? "not_applicable_no_p0_steps"
        : closureAllowed
          ? "ready_for_domain_domain_closure"
          : "blocked_by_incomplete_p0_steps",
    blocking_reason_codes:
      steps.length === 0
        ? ["NO_P0_STEPS_IN_AREA"]
        : closureAllowed
          ? []
          : ["P0_STEPS_NOT_FULLY_IMPLEMENTED", "POSITIVE_AND_NEGATIVE_PROOF_NOT_COMPLETE"],
  };
}

function validateCoverageMatrix(matrix: CoverageMatrix, schema: CoverageSchema): QaReport {
  const errors: string[] = [];
  const allowedStates = new Set(schema.allowed_acceptance_states);
  const steps = matrix.coverage_matrix;
  const unclassifiedSteps = steps.filter((step) => !allowedStates.has(step.acceptance_state));
  const nonImplementedSteps = steps.filter((step) => step.acceptance_state !== "implemented");
  const implementedSteps = steps.filter((step) => step.acceptance_state === "implemented");

  if (matrix.validation.status !== "PASS") {
    errors.push("Coverage matrix self-validation is not PASS.");
  }
  if (steps.length !== matrix.summary.retained_p0_step_count || steps.length !== matrix.summary.matrix_step_count) {
    errors.push("Coverage matrix step count does not match summary retained/matrix counts.");
  }
  for (const step of steps) {
    if (!allowedStates.has(step.acceptance_state)) {
      errors.push(`${step.step_id} has no allowed acceptance_state.`);
    }
    const expectedCredit = schema.completion_credit_by_state[step.acceptance_state];
    if (step.completion_credit !== expectedCredit) {
      errors.push(`${step.step_id} has completion_credit ${step.completion_credit} but expected ${expectedCredit}.`);
    }
    if (step.completion_credit === "full" && step.acceptance_state !== "implemented") {
      errors.push(`${step.step_id} has full completion credit without implemented state.`);
    }
    if (step.acceptance_state === "implemented" && step.proof_refs.positive.length === 0) {
      errors.push(`${step.step_id} is implemented without positive proof references.`);
    }
    if (step.acceptance_state === "implemented" && step.safety_checks.length > 0 && step.proof_refs.negative.length === 0) {
      errors.push(`${step.step_id} is safety-sensitive implemented without negative proof references.`);
    }
  }

  const allStepsImplemented = steps.length > 0 && nonImplementedSteps.length === 0;
  if (matrix.summary.completion_claim_allowed !== allStepsImplemented) {
    errors.push("summary.completion_claim_allowed does not match derived all-steps-implemented state.");
  }

  const domainClosureMatrix = matrix.domain_summary.map((domain) => {
    const domainId = String(domain.domain_id);
    const domainSteps = steps.filter((step) => step.domain_id === domainId);
    const subject = closureSubjectFor("domain", domainId, String(domain.domain_name ?? ""), domainSteps);
    if (!subject.closure_allowed && (hasBooleanClosureClaim(domain) || hasTextualClosureClaim(domain))) {
      errors.push(`${domainId} carries a closure/completion claim while P0 steps remain incomplete.`);
    }
    return subject;
  });

  const areaClosureMatrix = matrix.area_summary.map((area) => {
    const areaId = String(area.area_id);
    const areaSteps = steps.filter((step) => step.intended_area_id === areaId);
    const subject = closureSubjectFor("area", areaId, String(area.area_name ?? ""), areaSteps);
    if (!subject.closure_allowed && (hasBooleanClosureClaim(area) || hasTextualClosureClaim(area))) {
      errors.push(`${areaId} carries a closure/completion claim while P0 steps remain incomplete.`);
    }
    return subject;
  });

  const domainDomainsClosable = domainClosureMatrix
    .filter((subject) => subject.p0_step_count > 0)
    .every((subject) => subject.closure_allowed);
  const routeNavigationCompletionClaimAllowed = allStepsImplemented && domainDomainsClosable;

  const checks = [
    {
      rule_id: "P0-COVERAGE-QA-001",
      severity: "error" as const,
      pass: unclassifiedSteps.length === 0,
      description: "Every retained P0 step must be classified with an allowed acceptance_state.",
    },
    {
      rule_id: "P0-COVERAGE-QA-002",
      severity: "error" as const,
      pass: matrix.summary.completion_claim_allowed === allStepsImplemented,
      description: "Global completion claims are allowed only when every retained P0 step is implemented.",
    },
    {
      rule_id: "P0-COVERAGE-QA-003",
      severity: "error" as const,
      pass: domainClosureMatrix.every((domain) => domain.closure_allowed || domain.non_implemented_step_count > 0),
      description: "Domain domain closure is blocked while any domain P0 step is not implemented.",
    },
    {
      rule_id: "P0-COVERAGE-QA-004",
      severity: "error" as const,
      pass: areaClosureMatrix.every((area) => area.closure_allowed || area.non_implemented_step_count > 0 || area.p0_step_count === 0),
      description: "App-area closure is blocked while any mapped P0 step is not implemented.",
    },
    {
      rule_id: "P0-COVERAGE-QA-005",
      severity: "error" as const,
      pass: steps.every((step) => step.completion_credit === schema.completion_credit_by_state[step.acceptance_state]),
      description: "Completion credit must exactly match the acceptance-state contract.",
    },
    {
      rule_id: "P0-COVERAGE-QA-006",
      severity: "error" as const,
      pass: implementedSteps.every((step) => step.proof_refs.positive.length > 0 && (step.safety_checks.length === 0 || step.proof_refs.negative.length > 0)),
      description: "Implemented steps require positive proof and safety-sensitive implemented steps require negative proof.",
    },
  ];

  for (const check of checks) {
    if (!check.pass) errors.push(`${check.rule_id} failed.`);
  }

  return {
    artifact_kind: "p0_process_coverage_matrix_qa_report",
    ticket_id: "DOMAIN-02-QA-01",
    ticket_title: "Coverage matrix integrity gate",
    generated_at: "2026-06-28",
    machine_readable: true,
    sources: {
      coverage_matrix: matrixPath,
      schema: schemaPath,
    },
    gate_outcome: {
      status: errors.length === 0 ? "PASS" : "FAIL",
      interpretation: errors.length === 0 ? "integrity_gate_passed_closure_blocked" : "integrity_gate_failed",
      domain_domain_closure_allowed: domainDomainsClosable,
      route_navigation_completion_claim_allowed: routeNavigationCompletionClaimAllowed,
      completion_claim_allowed: allStepsImplemented,
    },
    summary: {
      retained_p0_process_count: matrix.summary.retained_p0_process_count,
      retained_p0_step_count: matrix.summary.retained_p0_step_count,
      matrix_step_count: steps.length,
      unclassified_step_count: unclassifiedSteps.length,
      implemented_step_count: implementedSteps.length,
      non_implemented_step_count: nonImplementedSteps.length,
      blocked_domain_count: domainClosureMatrix.filter((domain) => domain.closure_status === "blocked_by_incomplete_p0_steps").length,
      blocked_area_count: areaClosureMatrix.filter((area) => area.closure_status === "blocked_by_incomplete_p0_steps").length,
      acceptance_state_counts: countBy(steps, (step) => step.acceptance_state),
    },
    closure_rule_checks: checks,
    domain_closure_matrix: domainClosureMatrix,
    area_closure_matrix: areaClosureMatrix,
    errors,
    next_decision_gate: {
      required_decisions: ["DEC-FINAL-NAVIGATION-BLUEPRINT", "DEC-ROUTE-NAV-APPROVAL"],
      recommended_approval_token: "APPROVE_DEC-FINAL-NAVIGATION-BLUEPRINT_DEC-ROUTE-NAV-APPROVAL_CONTINUE_TO_DOMAIN-01-IMPL-01",
    },
  };
}

const checkOnly = process.argv.includes("--check");
const matrix = readJson<CoverageMatrix>(matrixPath);
const schema = readJson<CoverageSchema>(schemaPath);
const report = validateCoverageMatrix(matrix, schema);

if (checkOnly) {
  const existing = readJson<QaReport>(reportPath);
  if (JSON.stringify(existing) !== JSON.stringify(report)) {
    console.error(JSON.stringify({ status: "FAIL", reason: "QA report is stale", expected: reportPath }, null, 2));
    process.exit(1);
  }
}

if (report.gate_outcome.status !== "PASS") {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}

if (!checkOnly) {
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

console.log(
  JSON.stringify(
    {
      status: "PASS",
      mode: checkOnly ? "check" : "write",
      report: reportPath,
      gate_outcome: report.gate_outcome,
      summary: report.summary,
      closed_claims_blocked: toStringArray(report.next_decision_gate.required_decisions).length > 0,
    },
    null,
    2,
  ),
);
