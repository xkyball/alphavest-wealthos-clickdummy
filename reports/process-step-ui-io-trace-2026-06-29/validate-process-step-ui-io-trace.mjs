import fs from "node:fs";
import path from "node:path";

const baseDir = path.dirname(new URL(import.meta.url).pathname);
const schemaPath = path.join(baseDir, "ALPHAVEST_PROCESS_STEP_UI_IO_TRACE_SCHEMA.json");
const tracePath = path.join(baseDir, "ALPHAVEST_PROCESS_STEP_UI_IO_TRACE.json");
const reportPath = path.join(baseDir, "ALPHAVEST_PROCESS_STEP_UI_IO_TRACE_VALIDATION_REPORT.json");

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const trace = JSON.parse(fs.readFileSync(tracePath, "utf8"));

const enumSets = {
  gap_priority: new Set(Object.keys(schema.gap_priorities)),
  readiness_state: new Set(schema.readiness_states),
  service_backing_state: new Set(schema.service_backing_states),
  ui_representation_state: new Set(schema.ui_representation_states),
};

const errors = [];
const warnings = [];
const review = [];
const missingLayerCounts = {};
const readinessStateCounts = {};
const gapPriorityCounts = {};
const highRiskSamples = [];

function count(bucket, key) {
  bucket[key] = (bucket[key] ?? 0) + 1;
}

function hasProof(row, kind) {
  return [
    ...(row.positive_proof_refs ?? []),
    ...(row.negative_proof_refs ?? []),
    ...(row.audit_or_evidence_refs ?? []),
  ].some((ref) => ref.proof_kind === kind && ref.verified === true);
}

if (!Array.isArray(trace.rows)) {
  errors.push("Trace artifact must expose rows[].");
} else if (trace.rows.length !== schema.scope.expected_step_count) {
  errors.push(`Expected ${schema.scope.expected_step_count} rows, got ${trace.rows.length}.`);
}

const traceIds = new Set();

for (const [index, row] of (trace.rows ?? []).entries()) {
  for (const field of schema.trace_row_required_fields) {
    if (!(field in row)) {
      errors.push(`Row ${index} is missing required field ${field}.`);
    }
  }

  if (traceIds.has(row.trace_id)) {
    errors.push(`Duplicate trace_id ${row.trace_id}.`);
  }
  traceIds.add(row.trace_id);

  for (const [field, allowed] of Object.entries(enumSets)) {
    if (!allowed.has(row[field])) {
      errors.push(`Row ${row.trace_id} has invalid ${field}: ${row[field]}.`);
    }
  }

  count(readinessStateCounts, row.readiness_state);
  count(gapPriorityCounts, row.gap_priority);
  for (const layer of row.missing_layers ?? []) {
    count(missingLayerCounts, layer);
  }

  if (row.route_touchpoints?.length && !row.component_touchpoints?.length) {
    if (!row.missing_layers?.includes("route_only_claim")) {
      errors.push(`Row ${row.trace_id} has route-only evidence without route_only_claim missing layer.`);
    }
  }

  if (row.readiness_state === "implemented") {
    const implementedFailures = [];
    if (!row.required_inputs?.length) implementedFailures.push("required_inputs");
    if (!row.expected_outputs?.length) implementedFailures.push("expected_outputs");
    if (!row.component_touchpoints?.length) implementedFailures.push("component_touchpoints");
    if (!["workflow_backed", "persisted"].includes(row.service_backing_state)) implementedFailures.push("workflow_or_persisted_service_backing");
    if (!row.positive_proof_refs?.some((ref) => ref.verified === true)) implementedFailures.push("verified_positive_proof");
    if (!hasProof(row, "output_state")) implementedFailures.push("verified_output_state_proof");
    if (row.safety_sensitive && !row.negative_proof_refs?.some((ref) => ref.verified === true)) implementedFailures.push("verified_negative_proof");
    if (row.safety_sensitive && !row.audit_or_evidence_refs?.some((ref) => ref.verified === true)) implementedFailures.push("verified_audit_or_evidence_proof");
    if (implementedFailures.length) {
      errors.push(`Row ${row.trace_id} is implemented without ${implementedFailures.join(", ")}.`);
    }
  }

  if (row.safety_sensitive && !row.negative_proof_refs?.length) {
    warnings.push(`Safety-sensitive row ${row.trace_id} has no negative proof refs.`);
  }

  if (row.gap_priority === "P0" && highRiskSamples.length < 20) {
    highRiskSamples.push({
      trace_id: row.trace_id,
      process_id: row.process_id,
      step_id: row.step_id,
      readiness_state: row.readiness_state,
      missing_layers: row.missing_layers,
      downgrade_reasons: row.downgrade_reasons,
      next_target: row.next_target,
    });
  }
}

const implementedClaims = (trace.rows ?? []).filter((row) => row.readiness_state === "implemented").length;
const routeOnlyClaims = missingLayerCounts.route_only_claim ?? 0;
const emptyProofRows = (trace.rows ?? []).filter((row) => !row.positive_proof_refs?.length && !row.negative_proof_refs?.length).length;

if (implementedClaims > 0) {
  review.push("Implemented claims exist; inspect all implemented rows before any Process-First MVP claim.");
}

const report = {
  artifact_kind: "alphavest_process_step_ui_io_trace_validation_report",
  generated_at: "2026-06-29",
  status: errors.length ? "FAIL" : "PASS",
  trace_file: path.basename(tracePath),
  schema_file: path.basename(schemaPath),
  total_rows: trace.rows?.length ?? 0,
  expected_rows: schema.scope.expected_step_count,
  implemented_claims: implementedClaims,
  route_only_claim_rows: routeOnlyClaims,
  empty_proof_rows: emptyProofRows,
  readiness_state_counts: readinessStateCounts,
  gap_priority_counts: gapPriorityCounts,
  missing_layer_counts: missingLayerCounts,
  high_risk_samples: highRiskSamples,
  errors,
  warnings,
  review,
  no_overclaim_result: implementedClaims === 0 ? "PASS_NO_IMPLEMENTED_TRACE_CLAIMS" : "REVIEW_IMPLEMENTED_TRACE_CLAIMS",
};

fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  status: report.status,
  total_rows: report.total_rows,
  implemented_claims: report.implemented_claims,
  route_only_claim_rows: report.route_only_claim_rows,
  empty_proof_rows: report.empty_proof_rows,
  error_count: errors.length,
  warning_count: warnings.length,
  report: reportPath,
}, null, 2));

if (errors.length) {
  process.exit(1);
}
