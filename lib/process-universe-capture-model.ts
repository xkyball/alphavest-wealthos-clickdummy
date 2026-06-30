import processCoverageMatrixArtifact from "@/docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX.json";
import detailedProcessUniverseArtifact from "@/docs/00-current/ALPHAVEST_DETAILED_BUSINESS_PROCESS_SPECIFICATION_P0_ONLY.json";
import {
  buildProcessUniverseProofPlan,
  type ProcessUniverseProofPlan,
  type ProcessUniverseProofAuthorityKind,
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
      action: "screenshot";
      name: string;
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
  projectionWave: "wave_1" | null;
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
    routes: [assertKnownRoute("/login"), assertKnownRoute("/mfa"), assertKnownRoute("/tenants/demo/setup")],
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
          { action: "goto", route: "/tenants/demo/setup" },
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
    routes: [assertKnownRoute("/documents/review-queue"), assertKnownRoute("/documents/demo/review")],
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
          { action: "goto", route: "/documents/demo/review" },
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
    routes: [assertKnownRoute("/compliance/reviews/demo/decision-room")],
    statusExpectation: "blocked_proof",
    steps: [
      {
        actions: [
          { action: "api", endpoint: "/api/auth/provider-login", expectStatus: 200, method: "POST", body: { email: "naledi.compliance@alphavest.demo", providerId: "db-user-jwt" }, saveAs: "complianceAuthStart" },
          { action: "api", endpoint: "/api/auth/mfa/verify", expectStatus: 200, method: "POST", body: { code: "123456", email: "naledi.compliance@alphavest.demo", providerId: "db-user-jwt" }, extract: [{ as: "complianceJwt", path: "jwt" }], saveAs: "complianceAuthVerified" },
          { action: "api", endpoint: "/api/processes", expectStatus: 200, method: "POST", tokenRef: "complianceJwt", body: { clientTenantId: "7870ddd4-4587-58c6-a30b-ed6710109c17", processId: "BP-063" }, extract: [{ as: "bp063ProcessInstanceId", path: "detail.id" }], saveAs: "bp063Created" },
          { action: "expectBlocked", endpoint: "/api/processes/${bp063ProcessInstanceId}/commands", expectIssue: "domain_spine_authorization_required", expectStatus: 403, method: "POST", tokenRef: "complianceJwt", body: { command: "COMPLETE_STEP" }, saveAs: "bp063GenericCompleteDenied" },
          { action: "goto", route: "/compliance/reviews/demo/decision-room" },
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
    routes: [assertKnownRoute("/decisions/demo"), assertKnownRoute("/decisions/demo/success")],
    statusExpectation: "visible_proof",
    steps: [
      {
        actions: [
          { action: "goto", route: "/decisions/demo" },
          { action: "assertNotText", text: "internal draft" },
          { action: "assertNotText", text: "analyst note" },
          { action: "assertNotText", text: "compliance note" },
          { action: "screenshot", name: "client-visibility-decision-fail-closed", visibleProof: true },
          { action: "goto", route: "/decisions/demo/success" },
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
    routes: [assertKnownRoute("/export/demo/approval"), assertKnownRoute("/export/demo/download")],
    statusExpectation: "blocked_proof",
    steps: [
      {
        actions: [
          { action: "expectBlocked", endpoint: "/api/export-workflow?tenantSlug=unknown&roleKey=pretend_role", expectIssue: "valid_tenant_slug_required", expectStatus: 400, method: "GET", saveAs: "exportInvalidScopeDenied" },
          { action: "api", endpoint: "/api/export-workflow", expectStatus: 200, method: "POST", body: { command: "SET_SCOPE", reason: "Select client-safe released objects for export authority proof.", redactionProfile: "client-safe-redacted", roleKey: "compliance_officer", scopeItems: [{ access: "Allowed", id: "process-universe-capture-export-scope", name: "Released client-safe decision summary", payloadClassifications: ["CLIENT_SAFE_SUMMARY", "RELEASED_EVIDENCE_SUMMARY"], selected: true, type: "DECISION" }], tenantSlug: "summit" }, extract: [{ as: "exportRequestId", path: "exportRequestId" }], saveAs: "exportScopeSelected" },
          { action: "api", endpoint: "/api/export-workflow", expectStatus: 200, method: "POST", body: { command: "VALIDATE_REDACTION", exportRequestId: "${exportRequestId}", payload: { clientSummary: "Released client-safe export summary.", decisionState: "Released", releasedAt: "2026-06-24T00:00:00.000Z", status: "RELEASED_TO_CLIENT", title: "Liquidity governance decision" }, reason: "Validate allowlisted fields before preview.", redactionProfile: "client-safe-redacted", roleKey: "compliance_officer", tenantSlug: "summit" }, saveAs: "exportRedactionValidated" },
          { action: "api", endpoint: "/api/export-workflow", expectStatus: 200, method: "POST", body: { command: "PREVIEW", exportRequestId: "${exportRequestId}", payload: { clientSummary: "Released client-safe export summary.", decisionState: "Released", releasedAt: "2026-06-24T00:00:00.000Z", status: "RELEASED_TO_CLIENT", title: "Liquidity governance decision" }, reason: "Preview client-safe export package before authority proof.", redactionProfile: "client-safe-redacted", roleKey: "compliance_officer", tenantSlug: "summit" }, saveAs: "exportPreviewed" },
          { action: "expectBlocked", endpoint: "/api/export-workflow", expectIssue: "DEMO_DENY_EXPORT_APPROVAL_REQUIRED", expectStatus: 403, method: "POST", body: { command: "APPROVE", exportRequestId: "${exportRequestId}", payload: { clientSummary: "Released client-safe export summary.", decisionState: "Released", releasedAt: "2026-06-24T00:00:00.000Z", status: "RELEASED_TO_CLIENT", title: "Liquidity governance decision" }, reason: "Family CFO must not approve restricted export packages.", redactionProfile: "client-safe-redacted", roleKey: "family_cfo", tenantSlug: "summit" }, saveAs: "exportWrongRoleDenied" },
          { action: "goto", route: "/export/demo/approval" },
          { action: "screenshot", name: "export-approval-negative-authority", visibleProof: true },
          { action: "goto", route: "/export/demo/download" },
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
    const proofPlan =
      coverageStatus === "api_executable" || coverageStatus === "visual_reference_only"
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
  }

  return {
    errors,
    ok: errors.length === 0,
    warnings,
  };
}
