import type { ProcessUniverseCaptureAction } from "@/lib/process-universe-capture-model";

export type ProcessUniverseProofAuthorityKind =
  | "domain_command_api"
  | "domain_readmodel_api"
  | "negative_boundary_only"
  | "no_executable_authority"
  | "process_runtime";

export type ProcessUniverseUiProjectionStatus = "api_only" | "not_projected" | "visible";

export type ProcessUniverseProofPlan = {
  actor: {
    roleKey: string;
    tenantSlug: string;
  };
  authorityKind: ProcessUniverseProofAuthorityKind;
  classificationAfter: "api_executable" | "blocked_negative_only" | "gap_only" | "visual_reference_only";
  classificationBefore: "api_executable" | "visual_reference_only";
  expectedAssertions: Array<{
    expect: "contains" | "equals" | "matches";
    path: string;
    sourceRef: string;
    value: boolean | number | string;
  }>;
  gapReasons: string[];
  negativeAction?: Extract<ProcessUniverseCaptureAction, { action: "expectBlocked" }>;
  positiveActions: ProcessUniverseCaptureAction[];
  primaryEndpoint: string;
  processId: string;
  projectionTargetClassificationAfter?: "deep_executable";
  projectionWave?: "wave_1";
  proofPlanId: string;
  remainingProjectionGap: string | null;
  screenshotRoutes: string[];
  uiProjection: ProcessUniverseUiProjectionStatus;
  visibleProjectionActions: ProcessUniverseCaptureAction[];
};

export type ProcessUniverseProofPlanInput = {
  domainId: string;
  gapReasons: string[];
  processId: string;
  resolvedRoutes: string[];
  stepIds: string[];
};

const exportPayload = {
  clientSummary: "Released client-safe export summary.",
  decisionState: "Released",
  releasedAt: "2026-06-24T00:00:00.000Z",
  status: "RELEASED_TO_CLIENT",
  title: "Liquidity governance decision",
};

const exportScopeItem = {
  access: "Allowed",
  id: "process-universe-proof-export-scope",
  name: "Released client-safe decision summary",
  payloadClassifications: ["CLIENT_SAFE_SUMMARY", "RELEASED_EVIDENCE_SUMMARY"],
  selected: true,
  type: "DECISION",
};

export const projectionWave1ProcessIds = [
  "BP-025",
  "BP-030",
  "BP-053",
  "BP-054",
  "BP-061",
  "BP-062",
  "BP-066",
  "BP-085",
  "BP-086",
  "BP-088",
  "BP-092",
  "BP-099",
] as const;

const projectionWave1ProcessIdSet = new Set<string>(projectionWave1ProcessIds);

const visibleProjectionProcessIds = new Set([
  "BP-023",
  "BP-025",
  "BP-026",
  "BP-027",
  "BP-028",
  "BP-029",
  "BP-030",
  "BP-032",
  "BP-033",
  "BP-050",
  "BP-051",
  "BP-052",
  "BP-053",
  "BP-054",
  "BP-055",
  "BP-058",
  "BP-059",
  "BP-060",
  "BP-061",
  "BP-062",
  "BP-064",
  "BP-066",
  "BP-075",
  "BP-076",
  "BP-078",
  "BP-081",
  "BP-082",
  "BP-083",
  "BP-085",
  "BP-086",
  "BP-088",
  "BP-089",
  "BP-090",
  "BP-091",
  "BP-092",
  "BP-099",
  "BP-104",
]);

function actionIdForProcess(processId: string) {
  const actionIds: Record<string, string> = {
    "BP-002": "j06.newTenant",
    "BP-003": "j09.submitProfile",
    "BP-004": "j09.addMember",
    "BP-005": "j09.addRelationship",
    "BP-006": "j05.createEntity",
    "BP-008": "j09.openFamilyMap",
    "BP-010": "j05.editEntity",
    "BP-013": "j07.inviteUser",
    "BP-015": "j07.saveRoleChanges",
    "BP-016": "j07.approveAccess",
    "BP-018": "j07.inviteUser",
    "BP-019": "j07.sendInvitation",
    "BP-020": "j10.reviewPermission",
    "BP-022": "j07.exportAudit",
    "BP-023": "j04.requestClarification",
    "BP-025": "j04.uploadDocument",
    "BP-026": "j04.confirmFinalize",
    "BP-027": "j04.refreshReviewQueue",
    "BP-028": "j04.requestClarification",
    "BP-029": "j04.viewDetails",
    "BP-030": "j04.confirmFinalize",
    "BP-032": "j03.viewEvidenceRecord",
    "BP-033": "j04.requestClarification",
    "BP-034": "j17.routeRebalanceReview",
    "BP-038": "j01.routeToAdvisor",
    "BP-039": "j01.requestData",
    "BP-040": "j01.requestData",
    "BP-041": "j17.blockRebalanceTrigger",
    "BP-042": "j01.routeToAdvisor",
    "BP-043": "j01.requestData",
    "BP-044": "j01.escalateAdvisor",
    "BP-045": "j01.escalateAdvisor",
    "BP-046": "j01.requestData",
    "BP-047": "j01.requestData",
    "BP-048": "j01.routeToAdvisor",
    "BP-050": "j01.routeToAdvisor",
    "BP-051": "j01.routeToAdvisor",
    "BP-052": "j01.routeToAdvisor",
    "BP-053": "j01.requestData",
    "BP-054": "j01.routeToAdvisor",
    "BP-055": "j01.escalateAdvisor",
    "BP-058": "j02.requestEvidence",
    "BP-059": "j02.blockRelease",
    "BP-060": "j02.requestEvidence",
    "BP-061": "j02.requestEvidence",
    "BP-062": "j02.blockRelease",
    "BP-064": "j03.viewEvidenceRecord",
    "BP-066": "j02.blockRelease",
    "BP-075": "j03.acceptOption",
    "BP-076": "j03.viewEvidenceRecord",
    "BP-078": "j03.deferDecision",
    "BP-081": "j03.viewEvidenceRecord",
    "BP-082": "j03.viewEvidenceRecord",
    "BP-083": "j03.requestMoreInformation",
    "BP-099": "j17.blockRebalanceTrigger",
    "BP-100": "j17.routeRebalanceReview",
    "BP-103": "j10.savePlatform",
    "BP-104": "j10.saveSecurity",
    "BP-105": "j10.savePlatform",
    "BP-106": "j10.viewAudit",
    "BP-107": "j10.reviewPermission",
    "BP-109": "j06.assignTeam",
  };

  return actionIds[processId];
}

function endpointForProcess(processId: string, domainId: string) {
  if (processId === "BP-002") return "/api/tenant-governance/actions";
  if (processId === "BP-034" || processId === "BP-041") return "/api/review-monitoring/actions";
  if (domainId === "DOMAIN-J") return "/api/export-workflow";
  if (processId === "BP-032" || domainId === "DOMAIN-G" || domainId === "DOMAIN-I") return "/api/advice-release-history/actions";
  if (domainId === "DOMAIN-C" || domainId === "DOMAIN-A") return "/api/data-maintenance/actions";
  if (domainId === "DOMAIN-B") return processId === "BP-020" ? "/api/platform-admin/actions" : "/api/tenant-governance/actions";
  if (domainId === "DOMAIN-D" || domainId === "DOMAIN-E" || domainId === "DOMAIN-F") return "/api/advisor-review/actions";
  if (domainId === "DOMAIN-K") return "/api/review-monitoring/actions";
  if (domainId === "DOMAIN-L") return processId === "BP-109" ? "/api/tenant-governance/actions" : "/api/platform-admin/actions";
  return "/api/processes";
}

function exportPositiveActions(processId: string): ProcessUniverseCaptureAction[] {
  const exportRequestRef = `${processId.toLowerCase()}ExportRequestId`;
  return [
    {
      action: "api",
      body: {
        command: "SET_SCOPE",
        reason: `${processId} selects client-safe export scope for Process-Universe proof.`,
        redactionProfile: "client-safe-redacted",
        roleKey: "compliance_officer",
        scopeItems: [exportScopeItem],
        tenantSlug: "summit",
      },
      endpoint: "/api/export-workflow",
      expectStatus: 200,
      extract: [{ as: exportRequestRef, path: "exportRequestId" }],
      method: "POST",
      saveAs: `${processId.toLowerCase()}ProofScope`,
    },
    {
      action: "api",
      body: {
        command: "VALIDATE_REDACTION",
        exportRequestId: `\${${exportRequestRef}}`,
        payload: exportPayload,
        reason: `${processId} validates redaction before preview through the canonical command spine.`,
        redactionProfile: "client-safe-redacted",
        roleKey: "compliance_officer",
        tenantSlug: "summit",
      },
      endpoint: "/api/export-workflow",
      expectStatus: 200,
      method: "POST",
      saveAs: `${processId.toLowerCase()}ProofRedaction`,
    },
    {
      action: "api",
      body: {
        command: "PREVIEW",
        exportRequestId: `\${${exportRequestRef}}`,
        payload: exportPayload,
        reason: `${processId} previews export package only after redaction validation.`,
        redactionProfile: "client-safe-redacted",
        roleKey: "compliance_officer",
        tenantSlug: "summit",
      },
      endpoint: "/api/export-workflow",
      expectStatus: 200,
      method: "POST",
      saveAs: `${processId.toLowerCase()}ProofMutation`,
    },
  ];
}

function processRuntimeActions(processId: string): ProcessUniverseCaptureAction[] {
  const processInstanceRef = `${processId.toLowerCase()}ProcessInstanceId`;
  return [
    {
      action: "api",
      body: { clientTenantId: "7870ddd4-4587-58c6-a30b-ed6710109c17", processId },
      endpoint: "/api/processes",
      expectStatus: 200,
      extract: [{ as: processInstanceRef, path: "detail.id" }],
      method: "POST",
      saveAs: `${processId.toLowerCase()}ProofCreated`,
      tokenRef: "clientSuccessJwt",
    },
    {
      action: "api",
      body: { command: "COMPLETE_STEP" },
      endpoint: `/api/processes/\${${processInstanceRef}}/commands`,
      expectStatus: 200,
      method: "POST",
      saveAs: `${processId.toLowerCase()}ProofMutation`,
      tokenRef: "clientSuccessJwt",
    },
  ];
}

function domainPositiveActions(processId: string, endpoint: string): ProcessUniverseCaptureAction[] {
  if (endpoint === "/api/export-workflow") return exportPositiveActions(processId);
  if (endpoint === "/api/processes") return processRuntimeActions(processId);

  const actionId = actionIdForProcess(processId);
  if (!actionId) return processRuntimeActions(processId);
  return [
    {
      action: "api",
      body: { actionId },
      endpoint,
      expectStatus: 200,
      method: "POST",
      saveAs: `${processId.toLowerCase()}ProofMutation`,
    },
  ];
}

function negativeAction(processId: string, endpoint: string): Extract<ProcessUniverseCaptureAction, { action: "expectBlocked" }> {
  if (endpoint === "/api/export-workflow") {
    const exportRequestRef = `${processId.toLowerCase()}ExportRequestId`;

    return {
      action: "expectBlocked",
      body: {
        command: "APPROVE",
        exportRequestId: `\${${exportRequestRef}}`,
        payload: exportPayload,
        reason: `${processId} wrong-role approval must fail closed.`,
        redactionProfile: "client-safe-redacted",
        roleKey: "family_cfo",
        tenantSlug: "summit",
      },
      endpoint,
      expectIssue: "DEMO_DENY_EXPORT_APPROVAL_REQUIRED",
      expectStatus: 403,
      method: "POST",
      saveAs: `${processId.toLowerCase()}NegativeBoundary`,
    };
  }

  return {
    action: "expectBlocked",
    body: { actionId: "__invalid_process_universe_capture_action__" },
    endpoint,
    expectIssue: "INVALID_REQUEST",
    expectStatus: 400,
    method: "POST",
    saveAs: `${processId.toLowerCase()}NegativeBoundary`,
  };
}

function actorForEndpoint(endpoint: string) {
  if (endpoint === "/api/platform-admin/actions") return { roleKey: "admin", tenantSlug: "morgan" };
  if (endpoint === "/api/tenant-governance/actions") return { roleKey: "admin", tenantSlug: "morgan" };
  if (endpoint === "/api/export-workflow") return { roleKey: "compliance_officer", tenantSlug: "summit" };
  if (endpoint === "/api/advice-release-history/actions") return { roleKey: "compliance_officer", tenantSlug: "summit" };
  if (endpoint === "/api/advisor-review/actions") return { roleKey: "senior_wealth_advisor", tenantSlug: "northbridge" };
  if (endpoint === "/api/review-monitoring/actions") return { roleKey: "analyst", tenantSlug: "northbridge" };
  return { roleKey: "client_success", tenantSlug: "morgan" };
}

function saveAsFor(action: ProcessUniverseCaptureAction) {
  return action.action === "api" || action.action === "expectBlocked" ? action.saveAs : undefined;
}

function visibleProjectionActionsForProcess(processId: string): ProcessUniverseCaptureAction[] {
  const screenshotName = `${processId.toLowerCase()}-projection-wave-1-visible`;
  const byProcess: Record<string, ProcessUniverseCaptureAction[]> = {
    "BP-025": [
      { action: "goto", route: "/documents/review-queue" },
      { action: "assertText", text: "Bennett Tax Residency Certificate 2026.pdf" },
      { action: "assertText", text: "Lifecycle: Review Pending" },
      { action: "screenshot", name: screenshotName, visibleProof: true },
    ],
    "BP-030": [
      { action: "goto", route: "/documents/review-queue" },
      { action: "assertText", text: "Review & Sufficiency" },
      { action: "assertText", text: "Run sufficiency check" },
      { action: "assertText", text: "persisted review commands unlock after a real upload is present" },
      { action: "screenshot", name: screenshotName, visibleProof: true },
    ],
    "BP-053": [
      { action: "goto", route: "/advisor/reviews/demo" },
      { action: "fill", locator: { kind: "testId", value: "advisor-rationale-input" }, value: "Evidence follow-up requested for source documents." },
      { action: "assertText", text: "Request evidence follow-up" },
      { action: "assertText", text: "Check the recommendation summary, evidence list and notes, then choose the next step for this package." },
      { action: "screenshot", name: screenshotName, visibleProof: true },
    ],
    "BP-054": [
      { action: "goto", route: "/advisor/reviews/demo" },
      { action: "fill", locator: { kind: "testId", value: "advisor-rationale-input" }, value: "Package evidence reviewed for compliance handoff." },
      { action: "assertText", text: "Approve for compliance review" },
      { action: "assertText", text: "No client release" },
      { action: "screenshot", name: screenshotName, visibleProof: true },
    ],
    "BP-061": [
      { action: "goto", route: "/compliance/reviews/demo/decision-room" },
      { action: "assertText", text: "Risk evidence is missing. Request evidence or hold release." },
      { action: "click", locator: { kind: "testId", value: "j02-request-evidence" } },
      { action: "assertText", text: "Request Evidence" },
      { action: "screenshot", name: screenshotName, visibleProof: true },
    ],
    "BP-062": [
      { action: "goto", route: "/compliance/reviews/demo/decision-room" },
      { action: "assertText", text: "Release unavailable" },
      { action: "click", locator: { kind: "testId", value: "j02-block-release" } },
      { action: "assertText", text: "Hold Release" },
      { action: "screenshot", name: screenshotName, visibleProof: true },
    ],
    "BP-066": [
      { action: "goto", route: "/compliance/reviews/demo/release" },
      { action: "assertText", text: "Release action pending" },
      { action: "assertText", text: "Client-safe candidate ready" },
      { action: "screenshot", name: screenshotName, visibleProof: true },
    ],
    "BP-085": [
      { action: "goto", route: "/export/demo/scope" },
      { action: "assertText", text: "Selected Content" },
      { action: "assertText", text: "included for the next review" },
      { action: "screenshot", name: screenshotName, visibleProof: true },
    ],
    "BP-086": [
      { action: "goto", route: "/export/demo/redaction" },
      { action: "assertText", text: "Protection Checklist" },
      { action: "assertText", text: "sensitive areas covered" },
      { action: "screenshot", name: screenshotName, visibleProof: true },
    ],
    "BP-088": [
      { action: "goto", route: "/export/demo/approval" },
      { action: "assertText", text: "Ready for approval review" },
      { action: "assertText", text: "Approval records reviewer intent only" },
      { action: "screenshot", name: screenshotName, visibleProof: true },
    ],
    "BP-092": [
      { action: "goto", route: "/export/demo/redaction" },
      { action: "assertText", text: "Protection Checklist" },
      { action: "assertText", text: "4 sensitive areas covered" },
      { action: "assertNotText", text: "internal draft" },
      { action: "assertNotText", text: "analyst note" },
      { action: "screenshot", name: screenshotName, visibleProof: true },
    ],
    "BP-099": [
      { action: "goto", route: "/ops" },
      { action: "assertText", text: "Release Support" },
      { action: "assertText", text: "High-severity blockers" },
      { action: "assertText", text: "Review monitoring" },
      { action: "screenshot", name: screenshotName, visibleProof: true },
    ],
  };

  return byProcess[processId] ?? [];
}

export function buildProcessUniverseProofPlan(input: ProcessUniverseProofPlanInput): ProcessUniverseProofPlan {
  const endpoint = endpointForProcess(input.processId, input.domainId);
  const hasMissingNegativeProof = input.gapReasons.includes("missing_negative_proof");
  const uiProjection: ProcessUniverseUiProjectionStatus = visibleProjectionProcessIds.has(input.processId) ? "visible" : "api_only";
  const authorityKind: ProcessUniverseProofAuthorityKind = endpoint === "/api/processes" ? "process_runtime" : "domain_command_api";
  const positiveActions = domainPositiveActions(input.processId, endpoint);
  const sourceRef = saveAsFor(positiveActions[positiveActions.length - 1]) ?? `${input.processId.toLowerCase()}ProofMutation`;
  const projectionWave = projectionWave1ProcessIdSet.has(input.processId) ? "wave_1" : undefined;
  const visibleProjectionActions = visibleProjectionActionsForProcess(input.processId);

  return {
    actor: actorForEndpoint(endpoint),
    authorityKind,
    classificationAfter: hasMissingNegativeProof ? "blocked_negative_only" : "api_executable",
    classificationBefore: projectionWave ? "api_executable" : "visual_reference_only",
    expectedAssertions:
      authorityKind === "process_runtime"
        ? [
            { expect: "contains", path: "detail.commandHistory", sourceRef, value: "COMPLETE_STEP" },
            { expect: "matches", path: "detail.currentStepId", sourceRef, value: `^${input.processId}-S0[2-9]$` },
          ]
        : [{ expect: "equals", path: "ok", sourceRef, value: true }],
    gapReasons: input.gapReasons,
    negativeAction: hasMissingNegativeProof || projectionWave ? negativeAction(input.processId, endpoint) : undefined,
    positiveActions,
    primaryEndpoint: endpoint,
    processId: input.processId,
    projectionTargetClassificationAfter: projectionWave ? "deep_executable" : undefined,
    projectionWave,
    proofPlanId: `PU-PROOF-${input.processId}`,
    remainingProjectionGap: uiProjection === "visible" ? null : "missing_visible_ui_projection_proof",
    screenshotRoutes: input.resolvedRoutes.slice(0, uiProjection === "visible" ? 2 : 1),
    uiProjection,
    visibleProjectionActions,
  };
}
