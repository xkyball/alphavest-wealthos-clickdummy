import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

type CompletionCredit = "full" | "partial" | "none";

type CoverageStep = {
  step_id: string;
  acceptance_state: string;
  completion_credit: CompletionCredit;
  proof_refs: {
    positive: string[];
    negative: string[];
  };
  safety_checks: string[];
};

type CoverageMatrix = {
  summary: {
    retained_p0_step_count: number;
    matrix_step_count: number;
    completion_claim_allowed: boolean;
  };
  coverage_matrix: CoverageStep[];
  validation: {
    status: "PASS" | "FAIL";
  };
};

type CoverageSchema = {
  allowed_acceptance_states: string[];
  completion_credit_by_state: Record<string, CompletionCredit>;
};

type QaReport = {
  gate_outcome: {
    status: "PASS" | "FAIL";
    interpretation: string;
    domain_closure_allowed: boolean;
    route_navigation_completion_claim_allowed: boolean;
    completion_claim_allowed: boolean;
  };
  summary: {
    retained_p0_step_count: number;
    matrix_step_count: number;
    unclassified_step_count: number;
    non_implemented_step_count: number;
    blocked_domain_count: number;
    blocked_area_count: number;
  };
  closure_rule_checks: Array<{ pass: boolean }>;
  domain_closure_matrix: Array<{
    p0_step_count: number;
    closure_allowed: boolean;
    non_implemented_step_count: number;
  }>;
  area_closure_matrix: Array<{
    p0_step_count: number;
    closure_allowed: boolean;
    non_implemented_step_count: number;
  }>;
  errors: string[];
};

const repoRoot = process.cwd();

function readJson<T>(...segments: string[]) {
  return JSON.parse(readFileSync(join(repoRoot, ...segments), "utf8")) as T;
}

test.describe("P0 process coverage matrix QA gate", () => {
  test("classifies every retained P0 step and blocks closure until all steps are implemented with proof", () => {
    const matrix = readJson<CoverageMatrix>("docs", "00-current", "ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX.json");
    const schema = readJson<CoverageSchema>("docs", "00-current", "ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX_SCHEMA.json");
    const report = readJson<QaReport>("docs", "00-current", "ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX_QA_REPORT.json");

    const allowedStates = new Set(schema.allowed_acceptance_states);

    expect(matrix.validation.status).toBe("PASS");
    expect(matrix.summary.retained_p0_step_count).toBe(438);
    expect(matrix.summary.matrix_step_count).toBe(438);
    expect(matrix.coverage_matrix).toHaveLength(438);
    expect(matrix.coverage_matrix.every((step) => allowedStates.has(step.acceptance_state))).toBe(true);
    expect(
      matrix.coverage_matrix.every(
        (step) => step.completion_credit === schema.completion_credit_by_state[step.acceptance_state],
      ),
    ).toBe(true);
    expect(
      matrix.coverage_matrix.every(
        (step) =>
          step.acceptance_state !== "implemented" ||
          (step.proof_refs.positive.length > 0 && (step.safety_checks.length === 0 || step.proof_refs.negative.length > 0)),
      ),
    ).toBe(true);

    expect(report.gate_outcome.status).toBe("PASS");
    expect(report.gate_outcome.interpretation).toBe("integrity_gate_passed_closure_blocked");
    expect(report.summary.unclassified_step_count).toBe(0);
    expect(report.summary.non_implemented_step_count).toBe(
      matrix.coverage_matrix.filter((step) => step.acceptance_state !== "implemented").length,
    );
    expect(report.gate_outcome.completion_claim_allowed).toBe(false);
    expect(report.gate_outcome.domain_closure_allowed).toBe(false);
    expect(report.gate_outcome.route_navigation_completion_claim_allowed).toBe(false);
    expect(matrix.summary.completion_claim_allowed).toBe(false);
    expect(report.closure_rule_checks.every((check) => check.pass)).toBe(true);
    expect(report.errors).toEqual([]);
  });

  test("keeps every non-complete domain and app area blocked from closure", () => {
    const report = readJson<QaReport>("docs", "00-current", "ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX_QA_REPORT.json");
    const activeDomains = report.domain_closure_matrix.filter((domain) => domain.p0_step_count > 0);
    const activeAreas = report.area_closure_matrix.filter((area) => area.p0_step_count > 0);
    const blockedDomains = activeDomains.filter((domain) => !domain.closure_allowed);
    const blockedAreas = activeAreas.filter((area) => !area.closure_allowed);

    expect(report.summary.blocked_domain_count).toBe(blockedDomains.length);
    expect(report.summary.blocked_area_count).toBe(blockedAreas.length);
    expect(blockedDomains.every((domain) => domain.non_implemented_step_count > 0)).toBe(true);
    expect(blockedAreas.every((area) => area.non_implemented_step_count > 0)).toBe(true);
    expect(activeDomains.filter((domain) => domain.closure_allowed).every((domain) => domain.non_implemented_step_count === 0)).toBe(true);
    expect(activeAreas.filter((area) => area.closure_allowed).every((area) => area.non_implemented_step_count === 0)).toBe(true);
  });
});
