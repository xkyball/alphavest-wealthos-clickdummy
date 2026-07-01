import processCoverageMatrixArtifact from "@/docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX.json";
import detailedProcessUniverseArtifact from "@/docs/00-current/ALPHAVEST_DETAILED_BUSINESS_PROCESS_SPECIFICATION_P0_ONLY.json";
import {
  buildProcessUniverseProofPlan,
  processUniverseGapClosureProcessIds,
  type ProcessUniverseProofPlan,
  type ProcessUniverseProofAuthorityKind,
  type ProcessUniverseProjectionWave,
  type ProcessUniverseUiProjectionStatus,
} from "@/lib/process-universe-proof-plans";
import { routeToSmokePath, screenRoutes } from "@/lib/route-registry";

export type ProcessUniverseCaptureAction =
  | {
      action: "api";
      body?: Record<string, unknown>;
      endpoint: string;
      expectStatus: number;
      extract?: Array<{ as: string; path: string }>;
      method: "GET" | "POST";
      saveAs?: string;
      tokenRef?: string;
    }
  | {
      action: "assertApiState";
      expect: "equals" | "contains" | "matches";
      path: string;
      sourceRef: string;
      value: string | number | boolean;
    }
  | {
      action: "assertNotText";
      text: string;
    }
  | {
      action: "assertText";
      text: string;
    }
  | {
      action: "click";
      locator: ProcessUniverseCaptureLocator;
      optional?: boolean;
    }
  | {
      action: "expectBlocked";
      endpoint: string;
      expectIssue?: string;
      expectStatus: number;
      method: "GET" | "POST";
      body?: Record<string, unknown>;
      saveAs?: string;
      tokenRef?: string;
    }
  | {
      action: "fill";
      locator: ProcessUniverseCaptureLocator;
      value: string;
    }
  | {
      action: "goto";
      route: string;
    }
  | {
      action: "gotoByReplacingCurrentPath";
      fromSuffix: string;
      toSuffix: string;
    }
  | {
      action: "screenshot";
      compareWith?: string;
      expectedOcrText?: string[];
      minChangedPixels?: number;
      name: string;
      ocrRequired?: boolean;
      phase?: "after" | "before";
      processId?: string;
      visualProofId?: string;
      visibleProof: boolean;
    }
  | {
      action: "select";
      locator: ProcessUniverseCaptureLocator;
      value: string;
    }
  | {
      action: "trace";
      label: string;
    };

export type ProcessUniverseCaptureLocator =
  | { kind: "label"; value: string }
  | { kind: "placeholder"; value: string }
  | { kind: "role"; name: string; role: "button" | "checkbox" | "link" | "textbox" }
  | { kind: "selector"; value: string }
  | { kind: "testId"; value: string }
  | { kind: "text"; value: string };

export type ProcessUniverseCaptureStep = {
  actions: ProcessUniverseCaptureAction[];
  id: string;
  processStepIds: string[];
  title: string;
};

export type ProcessUniverseCaptureScenario = {
  actor: {
    email?: string;
    roleKey: string;
    tenantSlug: string;
  };
  apiEndpoints: string[];
  expectedOutputs: string[];
  id: string;
  negativeProof: string[];
  positiveProof: string[];
  processIds: string[];
  routes: string[];
  statusExpectation: "visible_proof" | "api_proven_not_ui_projected" | "blocked_proof";
  steps: ProcessUniverseCaptureStep[];
  title: string;
};

export type ProcessUniverseCoverageMode = "deep_proof" | "generated_process_coverage";

export type ProcessUniverseCoverageStatus =
  | "api_executable"
  | "blocked_negative_only"
  | "deep_executable"
  | "gap_only"
  | "visual_reference_only";

export type ProcessUniverseProofDepth =
  | "api_or_runtime_backed_not_ui_projected"
  | "blocked_negative"
  | "deep_positive_negative_state"
  | "gap_report_only"
  | "visual_reference";

export type ProcessUniverseRouteResolution = {
  rawTouchpoints: string[];
  resolvedRoutes: string[];
  unresolvedTouchpoints: string[];
};

export type ProcessUniverseProcessCoverageScenario = {
  acceptanceStates: string[];
  apiEndpoints: string[];
  areaId: string | null;
  areaName: string | null;
  classificationAfter: ProcessUniverseCoverageStatus;
  classificationBefore: ProcessUniverseCoverageStatus;
  coverageMode: ProcessUniverseCoverageMode;
  coverageStatus: ProcessUniverseCoverageStatus;
  coveredStepIds: string[];
  domainId: string;
  domainName: string;
  expectedOutputs: string[];
  gapReasons: string[];
  id: string;
  primaryAuthorityKind: ProcessUniverseProofAuthorityKind | null;
  processId: string;
  processName: string;
  projectionTargetClassificationAfter: ProcessUniverseCoverageStatus | null;
  projectionWave: ProcessUniverseProjectionWave | null;
  proofDepth: ProcessUniverseProofDepth;
  proofPlan: ProcessUniverseProofPlan | null;
  proofPlanId: string | null;
  remainingProjectionGap: string | null;
  routeResolution: ProcessUniverseRouteResolution;
  steps: ProcessUniverseCaptureStep[];
  stepAcceptanceStateCounts: Record<string, number>;
  totalStepCount: number;
  uiProjection: ProcessUniverseUiProjectionStatus | null;
};

export type ProcessUniverseCaptureModel = {
  auditSummary: {
    completionClaimAllowed: boolean;
    implementedSteps: number;
    totalProcesses: number;
    totalSteps: number;
  };
  coverageRows: ProcessUniverseCoverageRow[];
  deepProofScenarios: ProcessUniverseCaptureScenario[];
  processCoverageScenarios: ProcessUniverseProcessCoverageScenario[];
  processUniverseSummary: {
    retainedP0ProcessCount: number;
    retainedP0StepCount: number;
  };
  scenarios: ProcessUniverseCaptureScenario[];
  sourceArtifacts: string[];
};

export type ProcessUniverseCoverageRow = {
  acceptance_state: string;
  actor?: string;
  api_touchpoints?: string[];
  blockers?: Array<{ blocker_type: string; values: string[] }>;
  completion_credit?: string;
  current_touchpoints?: {
    apis?: string[];
    models_or_services?: string[];
    reports?: string[];
    routes?: string[];
    tests?: string[];
  };
  domain_id: string;
  domain_name: string;
  expected_outputs?: string[];
  inventory_current_status?: string;
  intended_area_id?: string | null;
  intended_area_name?: string | null;
  missing_layers?: string[];
  process_id: string;
  process_name: string;
  proof_refs?: {
    negative?: string[];
    positive?: string[];
  };
  required_negative_proof?: string[];
  required_positive_proof?: string[];
  route_touchpoints?: string[];
  safety_sensitive?: boolean;
  sequence: number;
  state_reason_codes?: string[];
  step_id: string;
  step_label: string;
};

type ProcessCoverageMatrixArtifact = {
  coverage_matrix: ProcessUniverseCoverageRow[];
  summary: {
    completion_claim_allowed: boolean;
    implemented_step_count: number;
    retained_p0_process_count: number;
    retained_p0_step_count: number;
  };
};

type DetailedProcessUniverseArtifact = {
  artifact_metadata: {
    retained_p0_process_count: number;
    retained_p0_step_count: number;
  };
  detailed_process_catalogue: Array<{
    api_touchpoints?: string[];
    outputs?: string[];
    process_id: string;
    route_touchpoints?: string[];
  }>;
};

const processCoverageMatrix = processCoverageMatrixArtifact as ProcessCoverageMatrixArtifact;
const detailedProcessUniverse = detailedProcessUniverseArtifact as DetailedProcessUniverseArtifact;
const processUniverseUiIoAudit = {
  summary: {
    completion_claim_allowed: processCoverageMatrix.summary.completion_claim_allowed,
    implemented: processCoverageMatrix.summary.implemented_step_count,
    total_processes: processCoverageMatrix.summary.retained_p0_process_count,
    total_steps: processCoverageMatrix.summary.retained_p0_step_count,
  },
};

export const processUniverseCaptureSourceArtifacts = [
  "docs/00-current/ALPHAVEST_DETAILED_BUSINESS_PROCESS_SPECIFICATION_P0_ONLY.json",
  "docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX.json",
  "reports/process-universe-ui-io-audit-2026-06-29/process-universe-ui-io-audit.json",
  "lib/route-registry.ts",
] as const;

export const processUniverseCaptureForbiddenAuthority = "/api/demo-workflow";

const screenRouteByPageId: Map<string, (typeof screenRoutes)[number]> = new Map(screenRoutes.map((route) => [route.pageId, route]));
const screenRoutePatterns: Set<string> = new Set(screenRoutes.map((route) => route.route));
const detailedProcessById = new Map(
  detailedProcessUniverse.detailed_process_catalogue.map((process) => [process.process_id, process]),
);

function rowsForProcesses(processIds: string[]) {
  const processIdSet = new Set(processIds);
  return processCoverageMatrix.coverage_matrix
    .filter((row) => processIdSet.has(row.process_id))
    .sort((a, b) => a.process_id.localeCompare(b.process_id) || a.sequence - b.sequence);
}

function processGroups() {
  return Object.values(
    processCoverageMatrix.coverage_matrix.reduce<Record<string, ProcessUniverseCoverageRow[]>>((groups, row) => {
      groups[row.process_id] = groups[row.process_id] ? [...groups[row.process_id], row] : [row];
      return groups;
    }, {}),
  ).sort((left, right) => left[0].process_id.localeCompare(right[0].process_id));
}

function stepIdsForProcess(processId: string, take = 2) {
  return rowsForProcesses([processId]).slice(0, take).map((row) => row.step_id);
}

function assertKnownRoute(route: string) {
  const found = screenRoutes.find((screenRoute) => routeToSmokePath(screenRoute.route) === route || screenRoute.route === route);
  if (!found) {
    throw new Error(`Process-Universe capture route is not registered: ${route}`);
  }
  return route;
}

function uniqueStrings(items: Array<string | null | undefined>) {
  return Array.from(new Set(items.filter((item): item is string => Boolean(item))));
}

function duplicateStrings(items: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const item of items) {
    if (seen.has(item)) duplicates.add(item);
    seen.add(item);
  }
  return [...duplicates].sort();
}

function currentRouteTouchpoints(rows: ProcessUniverseCoverageRow[]) {
  const matrixTouchpoints = rows.flatMap((row) => row.current_touchpoints?.routes ?? row.route_touchpoints ?? []);
  const detail = detailedProcessById.get(rows[0].process_id);
  return uniqueStrings([...matrixTouchpoints, ...(detail?.route_touchpoints ?? [])]);
}

function currentApiTouchpoints(rows: ProcessUniverseCoverageRow[]) {
  const matrixTouchpoints = rows.flatMap((row) => row.current_touchpoints?.apis ?? row.api_touchpoints ?? []);
  const detail = detailedProcessById.get(rows[0].process_id);
  return uniqueStrings([...matrixTouchpoints, ...(detail?.api_touchpoints ?? [])]);
}

function resolveRouteTouchpoint(touchpoint: string) {
  const trimmed = touchpoint.trim();
  const resolved: string[] = [];
  const unresolved: string[] = [];
  const rangeMatch = trimmed.match(/^(\d{3})-(\d{3})$/);
  const pageMatch = trimmed.match(/^S?(\d{3})(?:\s+(.+))?$/);

  if (rangeMatch) {
    const start = Number(rangeMatch[1]);
    const end = Number(rangeMatch[2]);
    for (let page = start; page <= end; page += 1) {
      const route = screenRouteByPageId.get(String(page).padStart(3, "0"));
      if (route) resolved.push(routeToSmokePath(route.route));
    }
    if (resolved.length === 0) unresolved.push(trimmed);
    return { resolved, unresolved };
  }

  if (pageMatch) {
    const explicitPath = pageMatch[2]?.trim();
    if (explicitPath?.startsWith("/")) {
      resolved.push(routeToSmokePath(explicitPath));
      return { resolved, unresolved };
    }
    const route = screenRouteByPageId.get(pageMatch[1]);
    if (route) {
      resolved.push(routeToSmokePath(route.route));
      return { resolved, unresolved };
    }
  }

  if (trimmed.startsWith("/")) {
    resolved.push(routeToSmokePath(trimmed));
    return { resolved, unresolved };
  }

  if (screenRoutePatterns.has(trimmed)) {
    resolved.push(routeToSmokePath(trimmed));
    return { resolved, unresolved };
  }

  unresolved.push(trimmed);
  return { resolved, unresolved };
}

function routeResolutionForRows(rows: ProcessUniverseCoverageRow[]): ProcessUniverseRouteResolution {
  const rawTouchpoints = currentRouteTouchpoints(rows);
  const resolved: string[] = [];
  const unresolved: string[] = [];

  for (const touchpoint of rawTouchpoints) {
    const result = resolveRouteTouchpoint(touchpoint);
    resolved.push(...result.resolved);
    unresolved.push(...result.unresolved);
  }

  return {
    rawTouchpoints,
    resolvedRoutes: uniqueStrings(resolved),
    unresolvedTouchpoints: uniqueStrings(unresolved),
  };
}

function deepProofProcessIds() {
  return new Set(processUniverseDeepProofScenarios.flatMap((scenario) => scenario.processIds));
}


const standardProcessRuntimeAuthority = ["/api/processes", "/api/processes/{id}", "/api/processes/{id}/commands"] as const;

function hasApiLike(touchpoints: string[], fragment: string) {
  return touchpoints.some((touchpoint) => touchpoint.includes(fragment));
}

function authorityApiEndpointsForRows(rows: ProcessUniverseCoverageRow[]) {
  const touchpoints = currentApiTouchpoints(rows);
  const authorities: string[] = [];

  if (hasApiLike(touchpoints, "/api/export-workflow")) authorities.push("/api/export-workflow");
  if (hasApiLike(touchpoints, "/api/documents")) authorities.push("/api/documents", "/api/documents/upload", "/api/documents/review");
  if (hasApiLike(touchpoints, "/api/review-monitoring")) authorities.push("/api/review-monitoring", "/api/review-monitoring/actions");
  if (hasApiLike(touchpoints, "/api/advisor-review")) authorities.push("/api/advisor-review/actions");
  if (hasApiLike(touchpoints, "/api/tenant-governance")) authorities.push("/api/tenant-governance/actions");
  if (hasApiLike(touchpoints, "/api/audit-events")) authorities.push("/api/audit-events");
  if (hasApiLike(touchpoints, "/api/recommendation-review-workflow")) authorities.push("/api/recommendation-review-workflow");

  for (const touchpoint of touchpoints) {
    if (!touchpoint.startsWith("/api/")) continue;
    if (touchpoint.includes(processUniverseCaptureForbiddenAuthority)) continue;
    if (touchpoint.includes("candidate") || touchpoint.includes("future") || touchpoint.includes(" if ")) continue;
    authorities.push(touchpoint.replace(/\[id\]/g, "{id}"));
  }

  if (touchpoints.some((api) => api.includes(processUniverseCaptureForbiddenAuthority)) || authorities.length === 0) {
    authorities.push(...standardProcessRuntimeAuthority);
  }

  return uniqueStrings(authorities).filter((api) => !api.includes(processUniverseCaptureForbiddenAuthority));
}

function hasExecutableApiAuthority(rows: ProcessUniverseCoverageRow[]) {
  return authorityApiEndpointsForRows(rows).some((api) => api.startsWith("/api/") && !api.includes("candidate") && !api.includes("future"));
}

function generatedActionsForRows(rows: ProcessUniverseCoverageRow[], apiEndpoints: string[]): ProcessUniverseCaptureStep[] {
  const processId = rows[0].process_id;
  const steps = rows.map((row) => row.step_id);
  const createEndpoint = apiEndpoints.includes("/api/processes") ? "/api/processes" : apiEndpoints[0];
  const commandEndpoint = apiEndpoints.find((api) => api.includes("{id}/commands")) ?? apiEndpoints.find((api) => api.endsWith("/actions")) ?? apiEndpoints[0];

  return [
    {
      actions: [
        { action: "api", endpoint: createEndpoint, expectStatus: 200, method: "POST", body: createEndpoint === "/api/processes" ? { processId } : { processId, command: "START" }, extract: createEndpoint === "/api/processes" ? [{ as: `${processId.toLowerCase()}ProcessInstanceId`, path: "detail.id" }] : undefined, saveAs: `${processId.toLowerCase()}AuthorityStart` },
      ],
      id: `PU-PROC-${processId}-S01`,
      processStepIds: steps.slice(0, 1),
      title: `Start ${processId} through the resolved authority endpoint.`,
    },
    {
      actions: [
        { action: "api", endpoint: commandEndpoint.replace("{id}", `\${${processId.toLowerCase()}ProcessInstanceId}`), expectStatus: 200, method: "POST", body: commandEndpoint.endsWith("/commands") ? { command: "COMPLETE_STEP" } : { processId, command: "ADVANCE" }, saveAs: `${processId.toLowerCase()}AuthorityMutation` },
        { action: "trace", label: `${processId} uses resolved API authority, never /api/demo-workflow.` },
      ],
      id: `PU-PROC-${processId}-S02`,
      processStepIds: steps.slice(1, 2).length > 0 ? steps.slice(1, 2) : steps.slice(0, 1),
      title: `Mutate ${processId} through the resolved authority endpoint.`,
    },
  ];
}

function hasPositiveAndNegativeRefs(rows: ProcessUniverseCoverageRow[]) {
  return rows.some((row) => (row.proof_refs?.positive?.length ?? 0) > 0) && rows.some((row) => (row.proof_refs?.negative?.length ?? 0) > 0);
}

function hasMissingLayer(rows: ProcessUniverseCoverageRow[], layer: string) {
  return rows.some((row) => row.missing_layers?.includes(layer));
}

function isSafetySensitive(rows: ProcessUniverseCoverageRow[]) {
  return rows.some((row) => row.safety_sensitive || (row.current_touchpoints?.tests ?? []).some((testName) => testName.includes("fail")));
}

function coverageStatusForRows(rows: ProcessUniverseCoverageRow[], routeResolution: ProcessUniverseRouteResolution): ProcessUniverseCoverageStatus {
  if (deepProofProcessIds().has(rows[0].process_id)) return "deep_executable";

  const allImplemented = rows.every((row) => row.acceptance_state === "implemented" || row.completion_credit === "full");
  if (allImplemented && hasExecutableApiAuthority(rows) && hasPositiveAndNegativeRefs(rows)) return "api_executable";
  if (isSafetySensitive(rows) && hasPositiveAndNegativeRefs(rows)) return "blocked_negative_only";
  if (routeResolution.resolvedRoutes.length > 0 && rows.some((row) => row.acceptance_state !== "specified_only")) {
    return "visual_reference_only";
  }
  return "gap_only";
}

function proofDepthForStatus(status: ProcessUniverseCoverageStatus): ProcessUniverseProofDepth {
  if (status === "deep_executable") return "deep_positive_negative_state";
  if (status === "api_executable") return "api_or_runtime_backed_not_ui_projected";
  if (status === "blocked_negative_only") return "blocked_negative";
  if (status === "visual_reference_only") return "visual_reference";
  return "gap_report_only";
}

function gapReasonsForRows(
  rows: ProcessUniverseCoverageRow[],
  routeResolution: ProcessUniverseRouteResolution,
  coverageStatus: ProcessUniverseCoverageStatus,
) {
  const reasons: string[] = [];
  const apis = currentApiTouchpoints(rows);

  if (coverageStatus !== "deep_executable") reasons.push("not_executed_by_current_capture_run");
  if (apis.some((api) => api.includes(processUniverseCaptureForbiddenAuthority))) reasons.push("stale_demo_workflow_touchpoint");
  if (routeResolution.resolvedRoutes.length === 0) reasons.push("missing_route_mapping");
  if (routeResolution.unresolvedTouchpoints.length > 0) reasons.push("unresolved_route_touchpoints");
  if (coverageStatus === "api_executable") reasons.push("missing_visible_ui_projection_proof");
  if (coverageStatus === "visual_reference_only") reasons.push("visual_reference_without_mutation_or_persistence_proof");
  if (coverageStatus === "blocked_negative_only") reasons.push("negative_boundary_without_full_positive_visual_flow");
  if (coverageStatus === "gap_only") reasons.push("no_honest_executable_capture_path");
  if (rows.some((row) => row.acceptance_state === "specified_only")) reasons.push("specified_only_status_present");
  if (hasMissingLayer(rows, "negative_test")) reasons.push("missing_negative_proof");
  if (hasMissingLayer(rows, "implementation_touchpoint_proof")) reasons.push("missing_implementation_touchpoint_proof");
  if (hasMissingLayer(rows, "step_level_gate_proof")) reasons.push("missing_step_level_gate_proof");
  if (hasMissingLayer(rows, "audit_or_evidence_failure_proof")) reasons.push("missing_audit_or_evidence_failure_proof");
  if (!hasPositiveAndNegativeRefs(rows)) reasons.push("positive_negative_proof_refs_incomplete");

  return uniqueStrings(reasons);
}

function humanDemoStep(
  id: string,
  title: string,
  processStepIds: string[],
  actions: ProcessUniverseCaptureAction[],
): ProcessUniverseCaptureStep {
  return { actions, id, processStepIds, title };
}

const morganClientTenantId = "7870ddd4-4587-58c6-a30b-ed6710109c17";
const summitClientTenantId = "68c2dd2e-2322-526f-8a48-2fdadf996c40";

const humanDemoValueProofLabels: Record<string, string[]> = {
  "PU-E2E-01-new-user-scope": [
    "System check: the accepted user is scoped to the Morgan workspace.",
    "Blocker reason: invalid login and MFA attempts did not create a session.",
    "User value: the first workspace opens without broad admin exposure.",
    "Governance check: tenant setup remains separate from client workspace access.",
    "Capture the scoped workspace after onboarding decisions.",
    "Role check: client-success context is not treated as principal authority.",
    "Object-scope check: the user sees only the selected client context.",
    "Recovery value: the user can retry auth without leaking hidden rows.",
    "Outcome check: the tenant and role context are ready for real work.",
  ],
  "PU-E2E-02-client-context-documents": [
    "System check: profile edits remain draft context, not release.",
    "Blocker reason: source-file requirements stay visible before sufficiency.",
    "User value: the team can separate client facts from evidence confidence.",
    "Scope check: family and entity context remain tenant-bound.",
    "Capture the document review state after the blocked mutation proof.",
    "Gate check: denied process creation did not mutate the case.",
    "Recovery value: review work can continue without pretending sufficiency.",
    "Search value: the filtered document remains the selected evidence object.",
    "Outcome check: upload, review and sufficiency stay separate decisions.",
    "Audit value: the denied mutation is retained in the run log.",
  ],
  "PU-E2E-03-evidence-recovery": [
    "System check: analyst review starts from a searched queue item.",
    "Blocker reason: missing evidence becomes an action, not an approval.",
    "User value: the client-success perspective receives a clear recovery path.",
    "Recovery check: requested information is represented before sufficiency.",
    "Capture the post-recovery review state.",
    "Gate check: runtime advancement happens after recovery context exists.",
    "Role check: analyst and client-success perspectives stay distinct.",
    "Decision value: the case moves from incomplete to reviewable evidence.",
    "Outcome check: no client release is claimed by sufficiency review.",
    "Audit value: rejection and recovery are both visible in artifacts.",
  ],
  "PU-E2E-04-advisor-gate": [
    "System check: the advisor package is found through the review queue.",
    "Blocker reason: change requests stay inside the advisor gate.",
    "User value: rationale improves the package before compliance sees it.",
    "Gate check: advisor approval routes forward without client release.",
    "Capture the compliance-pending state after advisor approval.",
    "Role check: analyst draft and advisor approval remain different states.",
    "Decision value: the next reviewer can see why the handoff happened.",
    "Safety check: client visibility is still absent after advisor approval.",
    "Outcome check: the package is ready for compliance, not for the client.",
    "Audit value: advisor actions are retained as handoff evidence.",
  ],
  "PU-E2E-05-compliance-gate": [
    "System check: compliance works inside the Summit tenant scope.",
    "Blocker reason: generic completion fails before controlled release.",
    "User value: missing evidence becomes a specific request.",
    "Gate check: the audit sibling view records the compliance decision path.",
    "Capture the release boundary after the evidence request.",
    "Role check: compliance authority is not interchangeable with advisor approval.",
    "Decision value: release is tied to evidence and audit history.",
    "Safety check: client-safe release is not client acceptance.",
    "Outcome check: the success surface is audit-backed.",
    "Audit value: blocked and released states both remain in evidence.",
  ],
  "PU-E2E-06-client-export": [
    "System check: export starts from released client-safe content.",
    "Blocker reason: preview is not download, share or approval.",
    "User value: redaction is validated before a package can move forward.",
    "Gate check: wrong-role approval fails under the Family CFO perspective.",
    "Capture the download boundary after returning to compliance.",
    "Role check: compliance and Family CFO export powers remain separate.",
    "Decision value: approval must precede package generation.",
    "Safety check: unreleased draft text stays absent from projection.",
    "Outcome check: final delivery remains gated until generation is allowed.",
    "Audit value: redaction, preview and wrong-role denial are all recorded.",
  ],
};

function expandHumanDemoScenario(scenario: ProcessUniverseCaptureScenario): ProcessUniverseCaptureScenario {
  const labels = humanDemoValueProofLabels[scenario.id] ?? [];
  const firstProcessStepId = scenario.steps[0]?.processStepIds[0] ?? `${scenario.processIds[0]}-S01`;
  const extraSteps = labels.map((label, index) =>
    humanDemoStep(
      `${scenario.id}-VALUE-${String(index + 1).padStart(2, "0")}`,
      label,
      [firstProcessStepId],
      (index === 4 || index === 9)
        ? [{ action: "screenshot", name: `${scenario.id}-value-proof-${String(index + 1).padStart(2, "0")}`, visibleProof: true }]
        : [{ action: "trace", label }],
    ),
  );

  return {
    ...scenario,
    steps: [...scenario.steps, ...extraSteps],
  };
}

const baseHumanDemoProcessUniverseScenarios: ProcessUniverseCaptureScenario[] = [
  {
    actor: {
      email: "lina.success@alphavest.demo",
      roleKey: "client_success",
      tenantSlug: "morgan",
    },
    apiEndpoints: ["/api/auth/provider-login", "/api/auth/mfa/verify"],
    expectedOutputs: ["A blocked login is recovered into a scoped tenant and client workspace."],
    id: "PU-E2E-01-new-user-scope",
    negativeProof: ["Invalid identity and invalid MFA stay blocked."],
    positiveProof: ["Valid seeded JWT opens tenant and client context without using main or demo-workflow authority."],
    processIds: ["BP-011", "BP-012", "BP-014", "BP-001"],
    routes: [assertKnownRoute("/login"), assertKnownRoute("/mfa"), assertKnownRoute("/tenants/morgan/setup"), assertKnownRoute("/tenants/morgan/team"), assertKnownRoute("/client/home")],
    statusExpectation: "visible_proof",
    steps: [
      humanDemoStep("PU-E2E-01-S01", "Open the login surface in a blocked starting state.", ["BP-011-S01"], [{ action: "goto", route: "/login" }]),
      humanDemoStep("PU-E2E-01-S02", "Enter an invalid user identity.", ["BP-011-S02"], [{ action: "fill", locator: { kind: "label", value: "Email address" }, value: "not-a-demo-user@example.invalid" }]),
      humanDemoStep("PU-E2E-01-S03", "Select the seeded provider before submit.", ["BP-011-S03"], [{ action: "select", locator: { kind: "label", value: "Auth provider" }, value: "db-user-jwt" }]),
      humanDemoStep("PU-E2E-01-S04", "Submit the invalid sign-in attempt.", ["BP-011-S04"], [{ action: "click", locator: { kind: "role", role: "button", name: "Sign in" } }]),
      humanDemoStep("PU-E2E-01-S05", "Capture invalid login feedback.", ["BP-011-S05"], [{ action: "screenshot", name: "new-user-invalid-login", visibleProof: true }]),
      humanDemoStep("PU-E2E-01-S06", "Replace the identity with a seeded invited user.", ["BP-012-S01"], [{ action: "fill", locator: { kind: "label", value: "Email address" }, value: "lina.success@alphavest.demo" }]),
      humanDemoStep("PU-E2E-01-S07", "Start valid provider login.", ["BP-012-S02"], [{ action: "click", locator: { kind: "role", role: "button", name: "Sign in" } }]),
      humanDemoStep("PU-E2E-01-S08", "Prove the provider-login API accepts the seeded user.", ["BP-012-S03"], [{ action: "api", endpoint: "/api/auth/provider-login", expectStatus: 200, method: "POST", body: { email: "lina.success@alphavest.demo", providerId: "db-user-jwt" }, saveAs: "clientSuccessAuthStart" }]),
      humanDemoStep("PU-E2E-01-S09", "Open the MFA challenge.", ["BP-012-S04"], [{ action: "goto", route: "/mfa" }]),
      humanDemoStep("PU-E2E-01-S10", "Enter an invalid MFA code.", ["BP-012-S05"], [{ action: "fill", locator: { kind: "label", value: "MFA code" }, value: "000000" }]),
      humanDemoStep("PU-E2E-01-S11", "Submit and capture the MFA blocker.", ["BP-012-S06"], [{ action: "click", locator: { kind: "role", role: "button", name: "Verify" } }, { action: "screenshot", name: "new-user-invalid-mfa", visibleProof: true }]),
      humanDemoStep("PU-E2E-01-S12", "Enter the valid seeded MFA code.", ["BP-012-S07"], [{ action: "fill", locator: { kind: "label", value: "MFA code" }, value: "123456" }]),
      humanDemoStep("PU-E2E-01-S13", "Verify MFA and install the scoped JWT.", ["BP-012-S08"], [{ action: "api", endpoint: "/api/auth/mfa/verify", expectStatus: 200, method: "POST", body: { code: "123456", email: "lina.success@alphavest.demo", providerId: "db-user-jwt", roleKey: "client_success", tenantSlug: "morgan" }, extract: [{ as: "clientSuccessJwt", path: "jwt" }], saveAs: "clientSuccessAuthVerified" }]),
      humanDemoStep("PU-E2E-01-S14", "Review Morgan tenant setup context.", ["BP-014-S01"], [{ action: "goto", route: "/tenants/morgan/setup" }, { action: "screenshot", name: "new-user-tenant-setup", visibleProof: true }]),
      humanDemoStep("PU-E2E-01-S15", "Review Morgan team scope.", ["BP-014-S02"], [{ action: "goto", route: "/tenants/morgan/team" }, { action: "screenshot", name: "new-user-team-scope", visibleProof: true }]),
      humanDemoStep("PU-E2E-01-S16", "Open the first scoped client workspace.", ["BP-001-S01"], [{ action: "goto", route: "/client/home" }, { action: "screenshot", name: "new-user-first-workspace", visibleProof: true }]),
    ],
    title: "New user setup to first scoped workspace",
  },
  {
    actor: {
      email: "principal.morgan@example.demo",
      roleKey: "principal",
      tenantSlug: "morgan",
    },
    apiEndpoints: ["/api/auth/mfa/verify", "/api/processes", "/api/processes/{id}/commands"],
    expectedOutputs: ["Client profile/object context and document upload state are separated from evidence sufficiency."],
    id: "PU-E2E-02-client-context-documents",
    negativeProof: ["Upload/source-file state does not unlock sufficiency, release, export or client delivery."],
    positiveProof: ["The client context, family object, entity and document queue are visible in scoped context."],
    processIds: ["BP-001", "BP-004", "BP-006", "BP-023", "BP-024", "BP-025"],
    routes: [assertKnownRoute("/client/home"), assertKnownRoute("/client/profile"), assertKnownRoute("/client/family-members"), assertKnownRoute("/entities"), assertKnownRoute("/documents/upload"), assertKnownRoute("/documents/review-queue"), assertKnownRoute("/documents/morgan-tax-residency/review")],
    statusExpectation: "visible_proof",
    steps: [
      humanDemoStep("PU-E2E-02-S01", "Authenticate as Morgan principal.", ["BP-001-S01"], [{ action: "api", endpoint: "/api/auth/mfa/verify", expectStatus: 200, method: "POST", body: { code: "123456", email: "principal.morgan@example.demo", providerId: "db-user-jwt", roleKey: "principal", tenantSlug: "morgan" }, extract: [{ as: "principalJwt", path: "jwt" }], saveAs: "principalAuthVerified" }]),
      humanDemoStep("PU-E2E-02-S02", "Open client home in scoped context.", ["BP-001-S02"], [{ action: "goto", route: "/client/home" }, { action: "screenshot", name: "client-context-home", visibleProof: true }]),
      humanDemoStep("PU-E2E-02-S03", "Open client profile for context input.", ["BP-003-S01"], [{ action: "goto", route: "/client/profile" }]),
      humanDemoStep("PU-E2E-02-S04", "Edit a profile first-name field.", ["BP-003-S02"], [{ action: "fill", locator: { kind: "label", value: "First Name" }, value: "Alex" }]),
      humanDemoStep("PU-E2E-02-S05", "Save profile draft without release.", ["BP-003-S03"], [{ action: "click", locator: { kind: "testId", value: "dbtf-profile-save-draft" } }, { action: "screenshot", name: "client-context-profile-draft", visibleProof: true }]),
      humanDemoStep("PU-E2E-02-S06", "Open family-member object selection.", ["BP-004-S01"], [{ action: "goto", route: "/client/family-members" }]),
      humanDemoStep("PU-E2E-02-S07", "Review permitted family object state.", ["BP-004-S02"], [{ action: "assertText", text: "Downstream use" }, { action: "screenshot", name: "client-context-family-selection", visibleProof: true }]),
      humanDemoStep("PU-E2E-02-S08", "Open entity context.", ["BP-006-S01"], [{ action: "goto", route: "/entities" }, { action: "screenshot", name: "client-context-entities", visibleProof: true }]),
      humanDemoStep("PU-E2E-02-S09", "Open upload workspace.", ["BP-023-S01"], [{ action: "goto", route: "/documents/upload" }]),
      humanDemoStep("PU-E2E-02-S10", "Capture source-file-required blocker.", ["BP-023-S02"], [{ action: "screenshot", name: "client-context-upload-blocked", visibleProof: true }]),
      humanDemoStep("PU-E2E-02-S11", "Prove client context cannot silently create evidence sufficiency.", ["BP-024-S01"], [{ action: "expectBlocked", endpoint: "/api/processes", expectIssue: "process_command_denied", expectStatus: 403, method: "POST", tokenRef: "principalJwt", body: { clientTenantId: morganClientTenantId, processId: "BP-024" }, saveAs: "principalProcessCreateDenied" }]),
      humanDemoStep("PU-E2E-02-S12", "Open document review queue.", ["BP-025-S01"], [{ action: "goto", route: "/documents/review-queue" }]),
      humanDemoStep("PU-E2E-02-S13", "Filter for the tax-residency document.", ["BP-025-S02"], [{ action: "fill", locator: { kind: "testId", value: "ux-interaction-extraction-search" }, value: "tax" }]),
      humanDemoStep("PU-E2E-02-S14", "Open document review detail.", ["BP-025-S03"], [{ action: "goto", route: "/documents/morgan-tax-residency/review" }, { action: "screenshot", name: "client-context-document-review", visibleProof: true }]),
      humanDemoStep("PU-E2E-02-S15", "Verify the denied mutation stayed fail-closed.", ["BP-024-S02"], [{ action: "assertApiState", sourceRef: "principalProcessCreateDenied", path: "mutated", expect: "equals", value: false }, { action: "assertApiState", sourceRef: "principalProcessCreateDenied", path: "reasonCode", expect: "equals", value: "PERMISSION_DENIED" }]),
    ],
    title: "Client context and upload-not-sufficiency boundary",
  },
  {
    actor: {
      email: "mira.analyst@alphavest.demo",
      roleKey: "analyst",
      tenantSlug: "morgan",
    },
    apiEndpoints: ["/api/auth/mfa/verify", "/api/processes", "/api/processes/{id}/commands"],
    expectedOutputs: ["Analyst rejection routes recovery work before sufficiency can be treated as reviewed."],
    id: "PU-E2E-03-evidence-recovery",
    negativeProof: ["Blocked action remains visible until recovery information is requested and reviewed."],
    positiveProof: ["Recovery handoff and evidence review surfaces are captured with traces and screenshots."],
    processIds: ["BP-027", "BP-028", "BP-030", "BP-031", "BP-032"],
    routes: [assertKnownRoute("/documents/review-queue"), assertKnownRoute("/documents/morgan-tax-residency/review"), assertKnownRoute("/actions"), assertKnownRoute("/evidence/decision-pack/review"), assertKnownRoute("/client/home")],
    statusExpectation: "visible_proof",
    steps: [
      humanDemoStep("PU-E2E-03-S01", "Authenticate as analyst.", ["BP-027-S01"], [{ action: "api", endpoint: "/api/auth/mfa/verify", expectStatus: 200, method: "POST", body: { code: "123456", email: "mira.analyst@alphavest.demo", providerId: "db-user-jwt", roleKey: "analyst", tenantSlug: "morgan" }, extract: [{ as: "analystJwt", path: "jwt" }], saveAs: "analystAuthVerified" }]),
      humanDemoStep("PU-E2E-03-S02", "Open the document review queue.", ["BP-027-S02"], [{ action: "goto", route: "/documents/review-queue" }]),
      humanDemoStep("PU-E2E-03-S03", "Search for the Morgan tax document.", ["BP-027-S03"], [{ action: "fill", locator: { kind: "testId", value: "ux-interaction-extraction-search" }, value: "tax" }]),
      humanDemoStep("PU-E2E-03-S04", "Capture review queue with the filtered object.", ["BP-027-S04"], [{ action: "screenshot", name: "evidence-recovery-filtered-documents", visibleProof: true }]),
      humanDemoStep("PU-E2E-03-S05", "Open the selected review detail.", ["BP-028-S01"], [{ action: "goto", route: "/documents/morgan-tax-residency/review" }]),
      humanDemoStep("PU-E2E-03-S06", "Capture the review blocker state.", ["BP-028-S02"], [{ action: "screenshot", name: "evidence-recovery-review-blocker", visibleProof: true }]),
      humanDemoStep("PU-E2E-03-S07", "Create BP-030 runtime review instance.", ["BP-030-S01"], [{ action: "api", endpoint: "/api/processes", expectStatus: 200, method: "POST", tokenRef: "analystJwt", body: { clientTenantId: morganClientTenantId, processId: "BP-030" }, extract: [{ as: "bp030ProcessInstanceId", path: "detail.id" }], saveAs: "bp030Created" }]),
      humanDemoStep("PU-E2E-03-S08", "Open the action board for recovery work.", ["BP-030-S02"], [{ action: "goto", route: "/actions" }]),
      humanDemoStep("PU-E2E-03-S09", "Filter action board for evidence work.", ["BP-030-S03"], [{ action: "fill", locator: { kind: "testId", value: "ux-interaction-action-board-search" }, value: "evidence" }]),
      humanDemoStep("PU-E2E-03-S10", "Open the selected action.", ["BP-030-S04"], [{ action: "click", locator: { kind: "testId", value: "s032-open-selected-action" } }]),
      humanDemoStep("PU-E2E-03-S11", "Request missing information.", ["BP-030-S05"], [{ action: "click", locator: { kind: "testId", value: "j05-request-info" } }]),
      humanDemoStep("PU-E2E-03-S12", "Capture recovery feedback.", ["BP-030-S06"], [{ action: "screenshot", name: "evidence-recovery-request-info", visibleProof: true }]),
      humanDemoStep("PU-E2E-03-S13", "Switch to client-success recovery perspective.", ["BP-031-S01"], [{ action: "api", endpoint: "/api/auth/mfa/verify", expectStatus: 200, method: "POST", body: { code: "123456", email: "lina.success@alphavest.demo", providerId: "db-user-jwt", roleKey: "client_success", tenantSlug: "morgan" }, extract: [{ as: "clientSuccessJwt", path: "jwt" }], saveAs: "clientSuccessRecoveryAuth" }, { action: "goto", route: "/client/home" }]),
      humanDemoStep("PU-E2E-03-S14", "Return to evidence vault review.", ["BP-032-S01"], [{ action: "goto", route: "/evidence/decision-pack/review" }, { action: "screenshot", name: "evidence-recovery-vault-review", visibleProof: true }]),
      humanDemoStep("PU-E2E-03-S15", "Advance runtime state only after recovery is represented.", ["BP-030-S07"], [{ action: "api", endpoint: "/api/processes/${bp030ProcessInstanceId}/commands", expectStatus: 200, method: "POST", tokenRef: "analystJwt", body: { command: "COMPLETE_STEP" }, saveAs: "bp030CompletedStep" }, { action: "trace", label: "Evidence recovery is represented before sufficiency is treated as reviewed." }]),
    ],
    title: "Evidence rejection and recovery",
  },
  {
    actor: {
      email: "thabo.advisor@alphavest.demo",
      roleKey: "senior_wealth_advisor",
      tenantSlug: "morgan",
    },
    apiEndpoints: ["/api/auth/mfa/verify", "/api/advisor-review/actions"],
    expectedOutputs: ["Advisor approval sends work to compliance without client release."],
    id: "PU-E2E-04-advisor-gate",
    negativeProof: ["Internal draft content is not client-visible and advisor approval is not compliance release."],
    positiveProof: ["Advisor queue search, rationale entry and approval handoff are visible."],
    processIds: ["BP-034", "BP-039", "BP-053", "BP-054", "BP-055"],
    routes: [assertKnownRoute("/advisory"), assertKnownRoute("/advisory/review-queue"), assertKnownRoute("/advisor/reviews"), assertKnownRoute("/compliance/reviews")],
    statusExpectation: "visible_proof",
    steps: [
      humanDemoStep("PU-E2E-04-S01", "Authenticate as senior advisor.", ["BP-050-S01"], [{ action: "api", endpoint: "/api/auth/mfa/verify", expectStatus: 200, method: "POST", body: { code: "123456", email: "thabo.advisor@alphavest.demo", providerId: "db-user-jwt", roleKey: "senior_wealth_advisor", tenantSlug: "morgan" }, extract: [{ as: "advisorJwt", path: "jwt" }], saveAs: "advisorAuthVerified" }]),
      humanDemoStep("PU-E2E-04-S02", "Open advisory hub.", ["BP-034-S01"], [{ action: "goto", route: "/advisory" }, { action: "screenshot", name: "advisor-gate-advisory-hub", visibleProof: true }]),
      humanDemoStep("PU-E2E-04-S03", "Open advisory review queue.", ["BP-039-S01"], [{ action: "goto", route: "/advisory/review-queue" }]),
      humanDemoStep("PU-E2E-04-S04", "Open internal draft review work.", ["BP-039-S02"], [{ action: "click", locator: { kind: "role", role: "link", name: "Open review work" } }]),
      humanDemoStep("PU-E2E-04-S05", "Capture internal-draft boundary.", ["BP-039-S03"], [{ action: "screenshot", name: "advisor-gate-internal-draft", visibleProof: true }]),
      humanDemoStep("PU-E2E-04-S06", "Open advisor review queue.", ["BP-050-S02"], [{ action: "goto", route: "/advisor/reviews" }]),
      humanDemoStep("PU-E2E-04-S07", "Search for the review package.", ["BP-051-S01"], [{ action: "fill", locator: { kind: "testId", value: "ux-interaction-advisor-search" }, value: "Northbridge" }]),
      humanDemoStep("PU-E2E-04-S08", "Open the selected advisor review.", ["BP-051-S02"], [{ action: "click", locator: { kind: "testId", value: "ux-data-table-row-action" } }]),
      humanDemoStep("PU-E2E-04-S09", "Enter advisor rationale.", ["BP-053-S01"], [{ action: "fill", locator: { kind: "testId", value: "advisor-rationale-input" }, value: "Package evidence reviewed for compliance handoff." }]),
      humanDemoStep("PU-E2E-04-S10", "Verify rationale is captured.", ["BP-053-S02"], [{ action: "assertText", text: "Rationale captured for this review." }]),
      humanDemoStep("PU-E2E-04-S11", "Approve for compliance review.", ["BP-054-S01"], [{ action: "click", locator: { kind: "testId", value: "j01-approve-advisor" } }]),
      humanDemoStep("PU-E2E-04-S12", "Capture advisor handoff feedback.", ["BP-054-S02"], [{ action: "screenshot", name: "advisor-gate-approved-not-released", visibleProof: true }]),
      humanDemoStep("PU-E2E-04-S13", "Open compliance queue as next gate.", ["BP-058-S01"], [{ action: "goto", route: "/compliance/reviews" }]),
      humanDemoStep("PU-E2E-04-S14", "Search compliance queue for the same package.", ["BP-058-S02"], [{ action: "fill", locator: { kind: "testId", value: "ux-interaction-compliance-search" }, value: "Northbridge" }]),
      humanDemoStep("PU-E2E-04-S15", "Confirm advisor approval did not release to client.", ["BP-055-S01"], [{ action: "assertNotText", text: "Released successfully" }, { action: "screenshot", name: "advisor-gate-compliance-pending", visibleProof: true }]),
    ],
    title: "Advisor gate without compliance release",
  },
  {
    actor: {
      email: "naledi.compliance@alphavest.demo",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    },
    apiEndpoints: ["/api/auth/mfa/verify", "/api/processes", "/api/processes/{id}/commands"],
    expectedOutputs: ["Compliance blocks unsafe release, requests recovery evidence and captures the audit/release boundary."],
    id: "PU-E2E-05-compliance-gate",
    negativeProof: ["Generic process completion is denied for compliance release."],
    positiveProof: ["Evidence request and audit/release views are visible after controlled compliance action."],
    processIds: ["BP-058", "BP-060", "BP-061", "BP-063", "BP-064", "BP-066"],
    routes: [assertKnownRoute("/compliance/reviews"), assertKnownRoute("/decisions/liquidity-governance/success")],
    statusExpectation: "blocked_proof",
    steps: [
      humanDemoStep("PU-E2E-05-S01", "Authenticate as compliance officer.", ["BP-058-S01"], [{ action: "api", endpoint: "/api/auth/mfa/verify", expectStatus: 200, method: "POST", body: { code: "123456", email: "naledi.compliance@alphavest.demo", providerId: "db-user-jwt", roleKey: "compliance_officer", tenantSlug: "summit" }, extract: [{ as: "complianceJwt", path: "jwt" }], saveAs: "complianceAuthVerified" }]),
      humanDemoStep("PU-E2E-05-S02", "Create BP-063 compliance runtime instance.", ["BP-063-S01"], [{ action: "api", endpoint: "/api/processes", expectStatus: 200, method: "POST", tokenRef: "complianceJwt", body: { clientTenantId: summitClientTenantId, processId: "BP-063" }, extract: [{ as: "bp063ProcessInstanceId", path: "detail.id" }], saveAs: "bp063Created" }]),
      humanDemoStep("PU-E2E-05-S03", "Prove generic completion is blocked.", ["BP-063-S02"], [{ action: "expectBlocked", endpoint: "/api/processes/${bp063ProcessInstanceId}/commands", expectIssue: "domain_spine_authorization_required", expectStatus: 403, method: "POST", tokenRef: "complianceJwt", body: { command: "COMPLETE_STEP" }, saveAs: "bp063GenericCompleteDenied" }]),
      humanDemoStep("PU-E2E-05-S04", "Open compliance queue.", ["BP-058-S02"], [{ action: "goto", route: "/compliance/reviews" }]),
      humanDemoStep("PU-E2E-05-S05", "Search for Northbridge review.", ["BP-058-S03"], [{ action: "fill", locator: { kind: "testId", value: "ux-interaction-compliance-search" }, value: "Northbridge" }]),
      humanDemoStep("PU-E2E-05-S06", "Open selected decision room.", ["BP-058-S04"], [{ action: "click", locator: { kind: "testId", value: "ux-data-table-row-action" } }]),
      humanDemoStep("PU-E2E-05-S07", "Capture decision room precondition state.", ["BP-059-S01"], [{ action: "screenshot", name: "compliance-gate-decision-room", visibleProof: true }]),
      humanDemoStep("PU-E2E-05-S08", "Open evidence request modal.", ["BP-060-S01"], [{ action: "click", locator: { kind: "testId", value: "j02-request-evidence" } }]),
      humanDemoStep("PU-E2E-05-S09", "Enter controlled request reason.", ["BP-060-S02"], [{ action: "fill", locator: { kind: "testId", value: "typed-request_evidence-reason" }, value: "Request missing risk evidence before any client release." }]),
      humanDemoStep("PU-E2E-05-S10", "Acknowledge no-release guard.", ["BP-060-S03"], [{ action: "click", locator: { kind: "testId", value: "typed-request_evidence-acknowledgement" } }]),
      humanDemoStep("PU-E2E-05-S11", "Type the exact request-evidence phrase.", ["BP-061-S01"], [{ action: "fill", locator: { kind: "testId", value: "j02-request-evidence-confirmation" }, value: "REQUEST EVIDENCE" }]),
      humanDemoStep("PU-E2E-05-S12", "Submit the evidence request.", ["BP-061-S02"], [{ action: "click", locator: { kind: "testId", value: "j02-confirm-request-evidence" } }]),
      humanDemoStep("PU-E2E-05-S13", "Capture action recorded feedback.", ["BP-061-S03"], [{ action: "screenshot", name: "compliance-gate-evidence-request-recorded", visibleProof: true }]),
      humanDemoStep("PU-E2E-05-S14", "Open released success surface after controlled recovery path.", ["BP-066-S01"], [{ action: "goto", route: "/decisions/liquidity-governance/success" }]),
      humanDemoStep("PU-E2E-05-S15", "Confirm release remains client-safe and not client acceptance.", ["BP-066-S02"], [{ action: "assertNotText", text: "client accepted" }, { action: "screenshot", name: "compliance-gate-released-client-safe", visibleProof: true }]),
    ],
    title: "Compliance gate with blocker and audit trail",
  },
  {
    actor: {
      email: "naledi.compliance@alphavest.demo",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    },
    apiEndpoints: ["/api/auth/mfa/verify", "/api/export-workflow"],
    expectedOutputs: ["Client-safe projection and export lifecycle separate preview, approval, download and sharing."],
    id: "PU-E2E-06-client-export",
    negativeProof: ["Wrong-role export approval is blocked and preview does not download or share."],
    positiveProof: ["Released projection, redaction, approval and download screens are visible with API proof."],
    processIds: ["BP-067", "BP-068", "BP-084", "BP-085", "BP-086", "BP-087", "BP-088", "BP-089"],
    routes: [assertKnownRoute("/decisions/liquidity-governance"), assertKnownRoute("/decisions/liquidity-governance/success"), assertKnownRoute("/export/client-package/scope"), assertKnownRoute("/export/client-package/redaction"), assertKnownRoute("/export/client-package/approval"), assertKnownRoute("/export/client-package/download")],
    statusExpectation: "blocked_proof",
    steps: [
      humanDemoStep("PU-E2E-06-S01", "Authenticate as compliance export reviewer.", ["BP-084-S01"], [{ action: "api", endpoint: "/api/auth/mfa/verify", expectStatus: 200, method: "POST", body: { code: "123456", email: "naledi.compliance@alphavest.demo", providerId: "db-user-jwt", roleKey: "compliance_officer", tenantSlug: "summit" }, extract: [{ as: "exportComplianceJwt", path: "jwt" }], saveAs: "exportComplianceAuth" }]),
      humanDemoStep("PU-E2E-06-S02", "Open unreleased decision projection.", ["BP-067-S01"], [{ action: "goto", route: "/decisions/liquidity-governance" }]),
      humanDemoStep("PU-E2E-06-S03", "Verify internal draft is absent.", ["BP-067-S02"], [{ action: "assertNotText", text: "internal draft" }, { action: "screenshot", name: "client-export-fail-closed", visibleProof: true }]),
      humanDemoStep("PU-E2E-06-S04", "Open released decision success projection.", ["BP-068-S01"], [{ action: "goto", route: "/decisions/liquidity-governance/success" }, { action: "screenshot", name: "client-export-released-projection", visibleProof: true }]),
      humanDemoStep("PU-E2E-06-S05", "Select export scope through API.", ["BP-084-S02"], [{ action: "api", endpoint: "/api/export-workflow", expectStatus: 200, method: "POST", tokenRef: "exportComplianceJwt", body: { command: "SET_SCOPE", reason: "Select client-safe released objects for export authority proof.", redactionProfile: "client-safe-redacted", scopeItems: [{ access: "Allowed", id: "process-universe-capture-export-scope", name: "Released client-safe decision summary", payloadClassifications: ["CLIENT_SAFE_SUMMARY", "RELEASED_EVIDENCE_SUMMARY"], selected: true, type: "DECISION" }] }, extract: [{ as: "exportRequestId", path: "exportRequestId" }], saveAs: "exportScopeSelected" }]),
      humanDemoStep("PU-E2E-06-S06", "Open export scope screen.", ["BP-085-S01"], [{ action: "goto", route: "/export/client-package/scope" }, { action: "screenshot", name: "client-export-scope", visibleProof: true }]),
      humanDemoStep("PU-E2E-06-S07", "Validate redaction through API.", ["BP-086-S01"], [{ action: "api", endpoint: "/api/export-workflow", expectStatus: 200, method: "POST", tokenRef: "exportComplianceJwt", body: { command: "VALIDATE_REDACTION", exportRequestId: "${exportRequestId}", payload: { clientSummary: "Released client-safe export summary.", decisionState: "Released", releasedAt: "2026-06-24T00:00:00.000Z", status: "RELEASED_TO_CLIENT", title: "Liquidity governance decision" }, reason: "Validate allowlisted fields before preview.", redactionProfile: "client-safe-redacted" }, saveAs: "exportRedactionValidated" }]),
      humanDemoStep("PU-E2E-06-S08", "Open redaction review screen.", ["BP-086-S02"], [{ action: "goto", route: "/export/client-package/redaction" }, { action: "screenshot", name: "client-export-redaction", visibleProof: true }]),
      humanDemoStep("PU-E2E-06-S09", "Generate preview through API.", ["BP-087-S01"], [{ action: "api", endpoint: "/api/export-workflow", expectStatus: 200, method: "POST", tokenRef: "exportComplianceJwt", body: { command: "PREVIEW", exportRequestId: "${exportRequestId}", payload: { clientSummary: "Released client-safe export summary.", decisionState: "Released", releasedAt: "2026-06-24T00:00:00.000Z", status: "RELEASED_TO_CLIENT", title: "Liquidity governance decision" }, reason: "Preview client-safe export package before authority proof.", redactionProfile: "client-safe-redacted" }, saveAs: "exportPreviewed" }]),
      humanDemoStep("PU-E2E-06-S10", "Open approval preview screen.", ["BP-088-S01"], [{ action: "goto", route: "/export/client-package/approval" }, { action: "screenshot", name: "client-export-approval-preview", visibleProof: true }]),
      humanDemoStep("PU-E2E-06-S11", "Verify preview does not expose download success.", ["BP-088-S02"], [{ action: "assertNotText", text: "Download recorded" }]),
      humanDemoStep("PU-E2E-06-S12", "Attempt wrong-role approval.", ["BP-087-S02"], [{ action: "api", endpoint: "/api/auth/mfa/verify", expectStatus: 200, method: "POST", body: { code: "123456", email: "cfo.summit@example.demo", providerId: "db-user-jwt", roleKey: "family_cfo", tenantSlug: "summit" }, extract: [{ as: "exportFamilyCfoJwt", path: "jwt" }], saveAs: "exportFamilyCfoAuth" }, { action: "expectBlocked", endpoint: "/api/export-workflow", expectIssue: "permission", expectStatus: 403, method: "POST", tokenRef: "exportFamilyCfoJwt", body: { command: "APPROVE", exportRequestId: "${exportRequestId}", payload: { clientSummary: "Released client-safe export summary.", decisionState: "Released", releasedAt: "2026-06-24T00:00:00.000Z", status: "RELEASED_TO_CLIENT", title: "Liquidity governance decision" }, reason: "Family CFO must not approve restricted export packages.", redactionProfile: "client-safe-redacted" }, saveAs: "exportWrongRoleDenied" }]),
      humanDemoStep("PU-E2E-06-S13", "Capture blocked approval evidence.", ["BP-087-S03"], [{ action: "screenshot", name: "client-export-wrong-role-blocked", visibleProof: true }]),
      humanDemoStep("PU-E2E-06-S14", "Open download boundary screen.", ["BP-089-S01"], [{ action: "api", endpoint: "/api/auth/mfa/verify", expectStatus: 200, method: "POST", body: { code: "123456", email: "naledi.compliance@alphavest.demo", providerId: "db-user-jwt", roleKey: "compliance_officer", tenantSlug: "summit" }, extract: [{ as: "exportComplianceReturnJwt", path: "jwt" }], saveAs: "exportComplianceReturnAuth" }, { action: "goto", route: "/export/client-package/download" }]),
      humanDemoStep("PU-E2E-06-S15", "Confirm download remains gated from preview and wrong-role approval.", ["BP-089-S02"], [{ action: "assertNotText", text: "Share link ready" }, { action: "screenshot", name: "client-export-download-boundary", visibleProof: true }]),
    ],
    title: "Client-safe projection and export boundary",
  },
];

export const humanDemoProcessUniverseScenarios: ProcessUniverseCaptureScenario[] = baseHumanDemoProcessUniverseScenarios.map(expandHumanDemoScenario);

export const processUniverseDeepProofScenarios: ProcessUniverseCaptureScenario[] = [
  {
    actor: {
      email: "lina.success@alphavest.demo",
      roleKey: "client_success",
      tenantSlug: "morgan",
    },
    apiEndpoints: ["/api/auth/provider-login", "/api/auth/mfa/verify"],
    expectedOutputs: ["Invalid auth feedback is visible before a valid local JWT is accepted."],
    id: "PU-CAP-01-auth-negative-positive",
    negativeProof: ["Invalid login/MFA input produces a blocked/error state."],
    positiveProof: ["Valid db-user-jwt login produces an authenticated browser context."],
    processIds: ["BP-011", "BP-012"],
    routes: [assertKnownRoute("/login"), assertKnownRoute("/mfa"), assertKnownRoute("/tenants/morgan/setup")],
    statusExpectation: "visible_proof",
    steps: [
      {
        actions: [
          { action: "goto", route: "/login" },
          { action: "fill", locator: { kind: "label", value: "Email address" }, value: "not-a-demo-user@example.invalid" },
          { action: "select", locator: { kind: "label", value: "Auth provider" }, value: "db-user-jwt" },
          { action: "click", locator: { kind: "role", role: "button", name: "Sign in" } },
          { action: "screenshot", name: "auth-invalid-login", visibleProof: true },
        ],
        id: "PU-CAP-01-S01",
        processStepIds: stepIdsForProcess("BP-011", 2),
        title: "Capture invalid provider login feedback.",
      },
      {
        actions: [
          { action: "fill", locator: { kind: "label", value: "Email address" }, value: "lina.success@alphavest.demo" },
          { action: "click", locator: { kind: "role", role: "button", name: "Sign in" } },
          { action: "api", endpoint: "/api/auth/provider-login", expectStatus: 200, method: "POST", body: { email: "lina.success@alphavest.demo", providerId: "db-user-jwt" }, saveAs: "authStart" },
          { action: "goto", route: "/mfa" },
          { action: "fill", locator: { kind: "label", value: "MFA code" }, value: "000000" },
          { action: "click", locator: { kind: "role", role: "button", name: "Verify" } },
          { action: "screenshot", name: "auth-invalid-mfa", visibleProof: true },
          { action: "fill", locator: { kind: "label", value: "MFA code" }, value: "123456" },
          { action: "api", endpoint: "/api/auth/mfa/verify", expectStatus: 200, method: "POST", body: { code: "123456", email: "lina.success@alphavest.demo", providerId: "db-user-jwt" }, extract: [{ as: "clientSuccessJwt", path: "jwt" }], saveAs: "authVerified" },
          { action: "goto", route: "/tenants/morgan/setup" },
          { action: "screenshot", name: "auth-valid-next-product-screen", visibleProof: true },
        ],
        id: "PU-CAP-01-S02",
        processStepIds: stepIdsForProcess("BP-012", 2),
        title: "Capture valid local auth and next reachable screen.",
      },
    ],
    title: "Auth negative-to-positive state capture",
  },
  {
    actor: {
      email: "lina.success@alphavest.demo",
      roleKey: "client_success",
      tenantSlug: "morgan",
    },
    apiEndpoints: ["/api/processes", "/api/processes/{id}/commands"],
    expectedOutputs: ["BP-024 process instance advances through API command history; UI projection is recorded separately."],
    id: "PU-CAP-02-process-runtime-cross-screen",
    negativeProof: ["Missing UI projection is classified as api_proven_not_ui_projected, not as visual completion."],
    positiveProof: ["Process command writes currentStepId, command history and audit-backed mutation."],
    processIds: ["BP-024"],
    routes: [assertKnownRoute("/documents/review-queue"), assertKnownRoute("/documents/morgan-tax-residency/review")],
    statusExpectation: "api_proven_not_ui_projected",
    steps: [
      {
        actions: [
          { action: "api", endpoint: "/api/processes", expectStatus: 200, method: "POST", tokenRef: "clientSuccessJwt", body: { clientTenantId: "7870ddd4-4587-58c6-a30b-ed6710109c17", processId: "BP-024" }, extract: [{ as: "bp024ProcessInstanceId", path: "detail.id" }, { as: "bp024InitialStepId", path: "detail.currentStepId" }], saveAs: "bp024Created" },
          { action: "goto", route: "/documents/review-queue" },
          { action: "screenshot", name: "bp024-before-command-documents-queue", visibleProof: true },
        ],
        id: "PU-CAP-02-S01",
        processStepIds: stepIdsForProcess("BP-024", 1),
        title: "Create BP-024 and capture the starting work surface.",
      },
      {
        actions: [
          { action: "api", endpoint: "/api/processes/${bp024ProcessInstanceId}/commands", expectStatus: 200, method: "POST", tokenRef: "clientSuccessJwt", body: { command: "COMPLETE_STEP" }, saveAs: "bp024CompletedStep" },
          { action: "assertApiState", sourceRef: "bp024CompletedStep", path: "detail.commandHistory", expect: "contains", value: "COMPLETE_STEP" },
          { action: "assertApiState", sourceRef: "bp024CompletedStep", path: "detail.currentStepId", expect: "matches", value: "^BP-024-S0[2-7]$" },
          { action: "goto", route: "/documents/morgan-tax-residency/review" },
          { action: "screenshot", name: "bp024-after-command-document-review", visibleProof: false },
          { action: "trace", label: "BP-024 API state is proven; UI projection remains separately classified." },
        ],
        id: "PU-CAP-02-S02",
        processStepIds: stepIdsForProcess("BP-024", 2).slice(1),
        title: "Advance BP-024 and capture follow-up route.",
      },
    ],
    title: "Process runtime cross-screen state capture",
  },
  {
    actor: {
      email: "naledi.compliance@alphavest.demo",
      roleKey: "compliance_officer",
      tenantSlug: "summit",
    },
    apiEndpoints: ["/api/processes", "/api/processes/{id}/commands"],
    expectedOutputs: ["Generic completion for BP-063 is blocked with domain_spine_authorization_required."],
    id: "PU-CAP-03-compliance-negative-gate",
    negativeProof: ["Safety-critical compliance release cannot complete through the generic process runtime."],
    positiveProof: ["The compliance decision room can be captured before any valid release action."],
    processIds: ["BP-063"],
    routes: [assertKnownRoute("/compliance/reviews")],
    statusExpectation: "blocked_proof",
    steps: [
      {
        actions: [
          { action: "api", endpoint: "/api/auth/provider-login", expectStatus: 200, method: "POST", body: { email: "naledi.compliance@alphavest.demo", providerId: "db-user-jwt" }, saveAs: "complianceAuthStart" },
          { action: "api", endpoint: "/api/auth/mfa/verify", expectStatus: 200, method: "POST", body: { code: "123456", email: "naledi.compliance@alphavest.demo", providerId: "db-user-jwt" }, extract: [{ as: "complianceJwt", path: "jwt" }], saveAs: "complianceAuthVerified" },
          { action: "api", endpoint: "/api/processes", expectStatus: 200, method: "POST", tokenRef: "complianceJwt", body: { clientTenantId: "7870ddd4-4587-58c6-a30b-ed6710109c17", processId: "BP-063" }, extract: [{ as: "bp063ProcessInstanceId", path: "detail.id" }], saveAs: "bp063Created" },
          { action: "expectBlocked", endpoint: "/api/processes/${bp063ProcessInstanceId}/commands", expectIssue: "domain_spine_authorization_required", expectStatus: 403, method: "POST", tokenRef: "complianceJwt", body: { command: "COMPLETE_STEP" }, saveAs: "bp063GenericCompleteDenied" },
          { action: "goto", route: "/compliance/reviews" },
          { action: "fill", locator: { kind: "testId", value: "ux-interaction-compliance-search" }, value: "Northbridge" },
          { action: "click", locator: { kind: "testId", value: "ux-data-table-row-action" } },
          { action: "screenshot", name: "bp063-compliance-decision-room-before-valid-action", visibleProof: true },
        ],
        id: "PU-CAP-03-S01",
        processStepIds: stepIdsForProcess("BP-063", 2),
        title: "Block generic completion for safety-critical compliance release.",
      },
    ],
    title: "Compliance negative gate capture",
  },
  {
    actor: {
      email: "lina.success@alphavest.demo",
      roleKey: "client_success",
      tenantSlug: "morgan",
    },
    apiEndpoints: ["/api/processes"],
    expectedOutputs: ["Client-visible surfaces stay fail-closed and do not expose internal payload copy."],
    id: "PU-CAP-04-client-visibility-fail-closed",
    negativeProof: ["Internal draft, analyst note and compliance note payload markers are absent from captured client-facing routes."],
    positiveProof: ["Released/client-safe summary surfaces can be captured without overclaiming release."],
    processIds: ["BP-067", "BP-068", "BP-069"],
    routes: [assertKnownRoute("/decisions/liquidity-governance"), assertKnownRoute("/decisions/liquidity-governance/success")],
    statusExpectation: "visible_proof",
    steps: [
      {
        actions: [
          { action: "goto", route: "/decisions/liquidity-governance" },
          { action: "assertNotText", text: "internal draft" },
          { action: "assertNotText", text: "analyst note" },
          { action: "assertNotText", text: "compliance note" },
          { action: "screenshot", name: "client-visibility-decision-fail-closed", visibleProof: true },
          { action: "goto", route: "/decisions/liquidity-governance/success" },
          { action: "assertNotText", text: "internal draft" },
          { action: "screenshot", name: "client-visibility-success-fail-closed", visibleProof: true },
        ],
        id: "PU-CAP-04-S01",
        processStepIds: ["BP-067-S01", "BP-068-S01", "BP-069-S01"],
        title: "Capture client-visibility fail-closed boundaries.",
      },
    ],
    title: "Client visibility fail-closed capture",
  },
  {
    actor: {
      email: "cfo.bennett@example.demo",
      roleKey: "family_cfo",
      tenantSlug: "summit",
    },
    apiEndpoints: ["/api/export-workflow"],
    expectedOutputs: ["Wrong-role export approval/download attempts fail closed without mutation."],
    id: "PU-CAP-05-export-negative-authority",
    negativeProof: ["Family CFO approval authority is denied for restricted export packages."],
    positiveProof: ["Export scope/download UI can be captured while authority remains API-gated."],
    processIds: ["BP-084", "BP-087"],
    routes: [assertKnownRoute("/export/client-package/approval"), assertKnownRoute("/export/client-package/download")],
    statusExpectation: "blocked_proof",
    steps: [
      {
        actions: [
          { action: "expectBlocked", endpoint: "/api/export-workflow?tenantSlug=unknown&roleKey=pretend_role", expectIssue: "valid_tenant_slug_required", expectStatus: 400, method: "GET", saveAs: "exportInvalidScopeDenied" },
          { action: "api", endpoint: "/api/export-workflow", expectStatus: 200, method: "POST", body: { command: "SET_SCOPE", reason: "Select client-safe released objects for export authority proof.", redactionProfile: "client-safe-redacted", roleKey: "compliance_officer", scopeItems: [{ access: "Allowed", id: "process-universe-capture-export-scope", name: "Released client-safe decision summary", payloadClassifications: ["CLIENT_SAFE_SUMMARY", "RELEASED_EVIDENCE_SUMMARY"], selected: true, type: "DECISION" }], tenantSlug: "summit" }, extract: [{ as: "exportRequestId", path: "exportRequestId" }], saveAs: "exportScopeSelected" },
          { action: "api", endpoint: "/api/export-workflow", expectStatus: 200, method: "POST", body: { command: "VALIDATE_REDACTION", exportRequestId: "${exportRequestId}", payload: { clientSummary: "Released client-safe export summary.", decisionState: "Released", releasedAt: "2026-06-24T00:00:00.000Z", status: "RELEASED_TO_CLIENT", title: "Liquidity governance decision" }, reason: "Validate allowlisted fields before preview.", redactionProfile: "client-safe-redacted", roleKey: "compliance_officer", tenantSlug: "summit" }, saveAs: "exportRedactionValidated" },
          { action: "api", endpoint: "/api/export-workflow", expectStatus: 200, method: "POST", body: { command: "PREVIEW", exportRequestId: "${exportRequestId}", payload: { clientSummary: "Released client-safe export summary.", decisionState: "Released", releasedAt: "2026-06-24T00:00:00.000Z", status: "RELEASED_TO_CLIENT", title: "Liquidity governance decision" }, reason: "Preview client-safe export package before authority proof.", redactionProfile: "client-safe-redacted", roleKey: "compliance_officer", tenantSlug: "summit" }, saveAs: "exportPreviewed" },
          { action: "expectBlocked", endpoint: "/api/export-workflow", expectIssue: "DEMO_DENY_EXPORT_APPROVAL_REQUIRED", expectStatus: 403, method: "POST", body: { command: "APPROVE", exportRequestId: "${exportRequestId}", payload: { clientSummary: "Released client-safe export summary.", decisionState: "Released", releasedAt: "2026-06-24T00:00:00.000Z", status: "RELEASED_TO_CLIENT", title: "Liquidity governance decision" }, reason: "Family CFO must not approve restricted export packages.", redactionProfile: "client-safe-redacted", roleKey: "family_cfo", tenantSlug: "summit" }, saveAs: "exportWrongRoleDenied" },
          { action: "goto", route: "/export/client-package/approval" },
          { action: "screenshot", name: "export-approval-negative-authority", visibleProof: true },
          { action: "goto", route: "/export/client-package/download" },
          { action: "screenshot", name: "export-download-negative-authority", visibleProof: true },
        ],
        id: "PU-CAP-05-S01",
        processStepIds: ["BP-084-S01", "BP-087-S01"],
        title: "Capture export fail-closed authority boundaries.",
      },
    ],
    title: "Export negative authority capture",
  },
];

export const processUniverseCaptureScenarios: ProcessUniverseProcessCoverageScenario[] = buildProcessCoverageScenarios();

export function buildProcessCoverageScenarios(): ProcessUniverseProcessCoverageScenario[] {
  return processGroups().map((rows) => {
    const first = rows[0];
    const routeResolution = routeResolutionForRows(rows);
    const coverageStatus = coverageStatusForRows(rows, routeResolution);
    const apiEndpoints = authorityApiEndpointsForRows(rows);
    const detail = detailedProcessById.get(first.process_id);
    const expectedOutputs = uniqueStrings([
      ...(detail?.outputs ?? []),
      ...rows.flatMap((row) => row.expected_outputs ?? []),
      ...rows.flatMap((row) => row.required_positive_proof ?? []),
    ]);
    const baseGapReasons = gapReasonsForRows(rows, routeResolution, coverageStatus);
    const isGapClosureProcess = processUniverseGapClosureProcessIds.includes(
      first.process_id as (typeof processUniverseGapClosureProcessIds)[number],
    );
    const proofPlan =
      coverageStatus === "api_executable" || coverageStatus === "visual_reference_only" || isGapClosureProcess
        ? buildProcessUniverseProofPlan({
            domainId: first.domain_id,
            gapReasons: baseGapReasons,
            processId: first.process_id,
            resolvedRoutes: routeResolution.resolvedRoutes,
            stepIds: rows.map((row) => row.step_id),
          })
        : null;
    const classificationAfter = proofPlan ? proofPlan.classificationAfter : coverageStatus;
    const executableApiEndpoints = proofPlan ? uniqueStrings([proofPlan.primaryEndpoint, ...apiEndpoints]) : apiEndpoints;

    return {
      acceptanceStates: uniqueStrings(rows.map((row) => row.acceptance_state)),
      apiEndpoints: executableApiEndpoints,
      areaId: first.intended_area_id ?? null,
      areaName: first.intended_area_name ?? null,
      classificationAfter,
      classificationBefore: proofPlan?.classificationBefore ?? coverageStatus,
      coverageMode: "generated_process_coverage",
      coverageStatus: classificationAfter,
      coveredStepIds: rows.map((row) => row.step_id),
      domainId: first.domain_id,
      domainName: first.domain_name,
      expectedOutputs,
      gapReasons: uniqueStrings([
        ...baseGapReasons.filter((reason) => reason !== "visual_reference_without_mutation_or_persistence_proof"),
        ...(proofPlan?.remainingProjectionGap ? [proofPlan.remainingProjectionGap] : []),
      ]),
      id: `PU-PROC-${first.process_id}`,
      primaryAuthorityKind: proofPlan?.authorityKind ?? null,
      processId: first.process_id,
      processName: first.process_name,
      projectionTargetClassificationAfter: proofPlan?.projectionTargetClassificationAfter ?? null,
      projectionWave: proofPlan?.projectionWave ?? null,
      proofDepth: proofDepthForStatus(classificationAfter),
      proofPlan,
      proofPlanId: proofPlan?.proofPlanId ?? null,
      remainingProjectionGap: proofPlan?.remainingProjectionGap ?? null,
      routeResolution,
      steps: proofPlan
        ? [
            {
              actions: [
                ...proofPlan.positiveActions,
                ...proofPlan.expectedAssertions.map((assertion) => ({ action: "assertApiState" as const, ...assertion })),
                ...(proofPlan.negativeAction ? [proofPlan.negativeAction] : []),
                ...(proofPlan.visibleProjectionActions.length > 0
                  ? proofPlan.visibleProjectionActions
                  : proofPlan.screenshotRoutes.flatMap((route, index) => [
                      { action: "goto" as const, route },
                      {
                        action: "screenshot" as const,
                        name: `${first.process_id.toLowerCase()}-proof-${index + 1}`,
                        visibleProof: proofPlan.uiProjection === "visible",
                      },
                    ])),
                {
                  action: "trace" as const,
                  label: `${proofPlan.proofPlanId} executes ${proofPlan.primaryEndpoint}; /api/demo-workflow remains forbidden authority.`,
                },
              ],
              id: `${proofPlan.proofPlanId}-S01`,
              processStepIds: rows.map((row) => row.step_id).slice(0, Math.max(1, Math.min(2, rows.length))),
              title: `Execute proof plan for ${first.process_id}.`,
            },
          ]
        : generatedActionsForRows(rows, apiEndpoints),
      stepAcceptanceStateCounts: rows.reduce<Record<string, number>>((counts, row) => {
        counts[row.acceptance_state] = (counts[row.acceptance_state] ?? 0) + 1;
        return counts;
      }, {}),
      totalStepCount: rows.length,
      uiProjection: proofPlan?.uiProjection ?? null,
    };
  });
}

export function processCoverageSummary(scenarios: ProcessUniverseProcessCoverageScenario[]) {
  const countBy = <T extends string | null>(items: T[]) =>
    items.reduce<Record<string, number>>((counts, item) => {
      const key = item ?? "unassigned";
      counts[key] = (counts[key] ?? 0) + 1;
      return counts;
    }, {});

  return {
    acceptanceStateCounts: countBy(scenarios.flatMap((scenario) => scenario.acceptanceStates)),
    areaCounts: countBy(scenarios.map((scenario) => scenario.areaId)),
    coverageStatusCounts: countBy(scenarios.map((scenario) => scenario.coverageStatus)),
    domainCounts: countBy(scenarios.map((scenario) => scenario.domainId)),
    gapReasonCounts: countBy(scenarios.flatMap((scenario) => scenario.gapReasons)),
    processCount: scenarios.length,
    stepAcceptanceStateCounts: scenarios.reduce<Record<string, number>>((counts, scenario) => {
      for (const [state, count] of Object.entries(scenario.stepAcceptanceStateCounts)) {
        counts[state] = (counts[state] ?? 0) + count;
      }
      return counts;
    }, {}),
    stepCount: scenarios.reduce((sum, scenario) => sum + scenario.totalStepCount, 0),
  };
}

export function buildProcessUniverseCaptureModel(): ProcessUniverseCaptureModel {
  return {
    auditSummary: {
      completionClaimAllowed: processUniverseUiIoAudit.summary.completion_claim_allowed,
      implementedSteps: processUniverseUiIoAudit.summary.implemented,
      totalProcesses: processUniverseUiIoAudit.summary.total_processes,
      totalSteps: processUniverseUiIoAudit.summary.total_steps,
    },
    coverageRows: processCoverageMatrix.coverage_matrix,
    deepProofScenarios: processUniverseDeepProofScenarios,
    processCoverageScenarios: processUniverseCaptureScenarios,
    processUniverseSummary: {
      retainedP0ProcessCount: detailedProcessUniverse.artifact_metadata.retained_p0_process_count,
      retainedP0StepCount: detailedProcessUniverse.artifact_metadata.retained_p0_step_count,
    },
    scenarios: processUniverseDeepProofScenarios,
    sourceArtifacts: [...processUniverseCaptureSourceArtifacts],
  };
}

export function processUniverseRowsForScenario(scenario: ProcessUniverseCaptureScenario) {
  const stepIdSet = new Set(scenario.steps.flatMap((step) => step.processStepIds));
  return processCoverageMatrix.coverage_matrix.filter((row) => stepIdSet.has(row.step_id));
}

export function validateProcessUniverseCaptureModel(model = buildProcessUniverseCaptureModel()) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const matrixProcessIds = uniqueStrings(model.coverageRows.map((row) => row.process_id)).sort();
  const coverageProcessIds = model.processCoverageScenarios.map((scenario) => scenario.processId).sort();
  const coverageStepIds = new Set(model.processCoverageScenarios.flatMap((scenario) => scenario.coveredStepIds));
  const allScreenshotActions = [
    ...model.deepProofScenarios.flatMap((scenario) => scenario.steps.flatMap((step) => step.actions)),
    ...model.processCoverageScenarios.flatMap((scenario) => scenario.steps.flatMap((step) => step.actions)),
  ].filter((action): action is Extract<ProcessUniverseCaptureAction, { action: "screenshot" }> => action.action === "screenshot");
  const projectionWaveScenarios = model.processCoverageScenarios.filter((scenario) => scenario.projectionWave);

  if (model.processUniverseSummary.retainedP0ProcessCount !== 84) {
    errors.push(`Expected 84 P0 processes, found ${model.processUniverseSummary.retainedP0ProcessCount}.`);
  }
  if (model.processUniverseSummary.retainedP0StepCount !== 438) {
    errors.push(`Expected 438 P0 process steps, found ${model.processUniverseSummary.retainedP0StepCount}.`);
  }
  if (model.coverageRows.length !== 438) {
    errors.push(`Expected 438 coverage matrix rows, found ${model.coverageRows.length}.`);
  }
  if (model.auditSummary.completionClaimAllowed) {
    errors.push("Process-Universe capture model must not allow a completion claim.");
  }
  if (model.processCoverageScenarios.length !== 84) {
    errors.push(`Expected 84 generated process coverage scenarios, found ${model.processCoverageScenarios.length}.`);
  }
  if (coverageStepIds.size !== 438) {
    errors.push(`Expected 438 generated process step refs, found ${coverageStepIds.size}.`);
  }
  if (JSON.stringify(matrixProcessIds) !== JSON.stringify(coverageProcessIds)) {
    errors.push("Generated process coverage scenarios do not match the P0 coverage matrix process IDs.");
  }
  for (const duplicate of duplicateStrings(coverageProcessIds)) {
    errors.push(`Duplicate process coverage scenario for ${duplicate}.`);
  }
  for (const duplicate of duplicateStrings(model.processCoverageScenarios.map((scenario) => scenario.proofPlanId).filter((id): id is string => Boolean(id)))) {
    errors.push(`Duplicate proof plan id ${duplicate}.`);
  }
  for (const duplicate of duplicateStrings(allScreenshotActions.map((action) => action.name))) {
    errors.push(`Duplicate screenshot action name ${duplicate}.`);
  }
  for (const duplicate of duplicateStrings(allScreenshotActions.map((action) => action.visualProofId).filter((id): id is string => Boolean(id)))) {
    errors.push(`Duplicate visual proof id ${duplicate}.`);
  }
  for (const duplicate of duplicateStrings(projectionWaveScenarios.map((scenario) => scenario.processId))) {
    errors.push(`Duplicate Projection Wave process id ${duplicate}.`);
  }
  for (const wave of ["wave_1", "wave_2", "wave_3", "wave_4", "wave_5"] satisfies ProcessUniverseProjectionWave[]) {
    const waveScenarios = model.processCoverageScenarios.filter((scenario) => scenario.projectionWave === wave);
    for (const duplicate of duplicateStrings(waveScenarios.map((scenario) => scenario.processId))) {
      errors.push(`Duplicate ${wave} process id ${duplicate}.`);
    }
  }

  for (const scenario of model.deepProofScenarios) {
    if (scenario.apiEndpoints.some((endpoint) => endpoint.includes(processUniverseCaptureForbiddenAuthority))) {
      errors.push(`${scenario.id} uses forbidden stale authority ${processUniverseCaptureForbiddenAuthority}.`);
    }
    if (scenario.positiveProof.length === 0) errors.push(`${scenario.id} has no positive proof.`);
    if (scenario.negativeProof.length === 0) errors.push(`${scenario.id} has no negative proof.`);
    if (scenario.expectedOutputs.length === 0) errors.push(`${scenario.id} has no expected output.`);
    if (scenario.processIds.length === 0) errors.push(`${scenario.id} has no Process-Universe process ids.`);
    if (scenario.routes.length === 0) errors.push(`${scenario.id} has no route coverage.`);
    if (processUniverseRowsForScenario(scenario).length === 0) {
      errors.push(`${scenario.id} maps to no Process-Universe coverage rows.`);
    }

    for (const step of scenario.steps) {
      if (step.processStepIds.length === 0) errors.push(`${step.id} has no process step refs.`);
      if (!step.actions.some((action) => action.action === "screenshot")) {
        warnings.push(`${step.id} has no screenshot action.`);
      }
    }
  }

  for (const scenario of model.processCoverageScenarios) {
    if (scenario.coveredStepIds.length !== scenario.totalStepCount) {
      errors.push(`${scenario.id} has mismatched covered step count.`);
    }
    if (scenario.coverageStatus !== "deep_executable" && scenario.gapReasons.length === 0) {
      errors.push(`${scenario.id} is non-deep coverage without gap reasons.`);
    }
    if (scenario.projectionWave) {
      const screenshotActions = scenario.steps.flatMap((step) => step.actions).filter(
        (action): action is Extract<ProcessUniverseCaptureAction, { action: "screenshot" }> => action.action === "screenshot",
      );
      const visualScreenshots = screenshotActions.filter((action) => action.visualProofId);
      const beforeScreenshots = visualScreenshots.filter((action) => action.phase === "before");
      const afterScreenshots = visualScreenshots.filter((action) => action.phase === "after");

      if (beforeScreenshots.length === 0) errors.push(`${scenario.id} has no visual before screenshot.`);
      if (afterScreenshots.length === 0) errors.push(`${scenario.id} has no visual after screenshot.`);

      for (const screenshot of visualScreenshots) {
        if (screenshot.processId !== scenario.processId) {
          errors.push(`${scenario.id} visual screenshot ${screenshot.name} is not tied to ${scenario.processId}.`);
        }
        if (!screenshot.phase) errors.push(`${scenario.id} visual screenshot ${screenshot.name} has no phase.`);
      }

      for (const screenshot of afterScreenshots) {
        if (!screenshot.compareWith) errors.push(`${scenario.id} visual after screenshot ${screenshot.name} has no compareWith.`);
        if (!screenshot.ocrRequired) errors.push(`${scenario.id} visual after screenshot ${screenshot.name} does not require OCR.`);
        if (!screenshot.expectedOcrText || screenshot.expectedOcrText.length === 0) {
          errors.push(`${scenario.id} visual after screenshot ${screenshot.name} has no expected OCR text.`);
        }
        if (!screenshot.minChangedPixels || screenshot.minChangedPixels <= 0) {
          errors.push(`${scenario.id} visual after screenshot ${screenshot.name} has no positive pixel-diff threshold.`);
        }
        if (screenshot.compareWith && !beforeScreenshots.some((before) => before.visualProofId === screenshot.compareWith)) {
          errors.push(`${scenario.id} visual after screenshot ${screenshot.name} compares with missing proof ${screenshot.compareWith}.`);
        }
      }
    }
  }

  return {
    errors,
    ok: errors.length === 0,
    warnings,
  };
}
