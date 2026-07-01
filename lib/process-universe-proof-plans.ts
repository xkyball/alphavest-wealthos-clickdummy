import type { ProcessUniverseCaptureAction } from "@/lib/process-universe-capture-model";

export type ProcessUniverseProofAuthorityKind =
  | "domain_command_api"
  | "domain_readmodel_api"
  | "negative_boundary_only"
  | "no_executable_authority"
  | "process_runtime";

export type ProcessUniverseUiProjectionStatus = "api_only" | "not_projected" | "visible";
export type ProcessUniverseProjectionWave = "wave_1" | "wave_2" | "wave_3" | "wave_4" | "wave_5" | "wave_6" | "wave_7";

export type ProcessUniverseProofPlan = {
  actor: {
    roleKey: string;
    tenantSlug: string;
  };
  authorityKind: ProcessUniverseProofAuthorityKind;
  classificationAfter: "api_executable" | "blocked_negative_only" | "gap_only" | "visual_reference_only";
  classificationBefore: "api_executable" | "gap_only" | "visual_reference_only";
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
  projectionWave?: ProcessUniverseProjectionWave;
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

export const projectionWave2ProcessIds = [
  "BP-015",
  "BP-016",
  "BP-018",
  "BP-019",
  "BP-020",
  "BP-022",
  "BP-103",
  "BP-104",
  "BP-105",
  "BP-106",
  "BP-107",
  "BP-109",
] as const;

export const projectionWave3ProcessIds = [
  "BP-050",
  "BP-051",
  "BP-052",
  "BP-055",
  "BP-058",
  "BP-059",
  "BP-060",
  "BP-064",
  "BP-089",
  "BP-090",
  "BP-091",
  "BP-100",
] as const;

export const projectionWave4ProcessIds = [
  "BP-034",
  "BP-038",
  "BP-039",
  "BP-040",
  "BP-041",
  "BP-042",
  "BP-043",
  "BP-044",
  "BP-045",
  "BP-046",
  "BP-047",
  "BP-048",
] as const;

export const projectionWave5ProcessIds = [
  "BP-004",
  "BP-005",
  "BP-006",
  "BP-010",
  "BP-023",
  "BP-026",
  "BP-027",
  "BP-028",
  "BP-029",
  "BP-033",
] as const;

export const projectionWave6ProcessIds = [
  "BP-001",
  "BP-014",
  "BP-017",
  "BP-031",
  "BP-077",
  "BP-108",
] as const;

export const projectionWave7ProcessIds = [
  "BP-002",
  "BP-003",
  "BP-008",
  "BP-013",
  "BP-032",
  "BP-075",
  "BP-076",
  "BP-078",
  "BP-081",
  "BP-082",
  "BP-083",
] as const;

const projectionWave1ProcessIdSet = new Set<string>(projectionWave1ProcessIds);
const projectionWave2ProcessIdSet = new Set<string>(projectionWave2ProcessIds);
const projectionWave3ProcessIdSet = new Set<string>(projectionWave3ProcessIds);
const projectionWave4ProcessIdSet = new Set<string>(projectionWave4ProcessIds);
const projectionWave5ProcessIdSet = new Set<string>(projectionWave5ProcessIds);
const projectionWave6ProcessIdSet = new Set<string>(projectionWave6ProcessIds);
const projectionWave7ProcessIdSet = new Set<string>(projectionWave7ProcessIds);

export const processUniverseGapClosureProcessIds = [...projectionWave6ProcessIds, ...projectionWave7ProcessIds] as const;

const visibleProjectionProcessIds = new Set([
  "BP-004",
  "BP-001",
  "BP-002",
  "BP-003",
  "BP-005",
  "BP-006",
  "BP-008",
  "BP-010",
  "BP-013",
  "BP-023",
  "BP-025",
  "BP-026",
  "BP-027",
  "BP-028",
  "BP-029",
  "BP-030",
  "BP-032",
  "BP-031",
  "BP-033",
  "BP-034",
  "BP-038",
  "BP-039",
  "BP-040",
  "BP-041",
  "BP-042",
  "BP-043",
  "BP-044",
  "BP-045",
  "BP-046",
  "BP-047",
  "BP-048",
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
  "BP-077",
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
  "BP-100",
  "BP-092",
  "BP-099",
  "BP-015",
  "BP-016",
  "BP-018",
  "BP-019",
  "BP-020",
  "BP-022",
  "BP-103",
  "BP-104",
  "BP-105",
  "BP-106",
  "BP-107",
  "BP-109",
  "BP-014",
  "BP-017",
  "BP-108",
]);

function actionIdForProcess(processId: string) {
  const actionIds: Record<string, string> = {
    "BP-001": "j09.startClientIntake",
    "BP-002": "j06.newTenant",
    "BP-003": "j09.submitProfile",
    "BP-004": "j09.addMember",
    "BP-005": "j09.addRelationship",
    "BP-006": "j05.createEntity",
    "BP-008": "j09.openFamilyMap",
    "BP-010": "j05.editEntity",
    "BP-013": "j07.inviteUser",
    "BP-014": "j06.assignTeam",
    "BP-015": "j07.saveRoleChanges",
    "BP-016": "j07.approveAccess",
    "BP-017": "j07.approveAccess",
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
    "BP-031": "j04.clientSafeEvidenceSummary",
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
    "BP-077": "j03.requestMoreInformation",
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
    "BP-108": "j10.versionPolicy",
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

function advisorReviewTargetForAction(actionId: string) {
  if (actionId === "j01.requestData") {
    return {
      targetId: "fcf38ed6-2e1f-52e2-824d-b10b91363bee",
      targetType: "TRIGGER",
    };
  }

  if (actionId === "j01.routeToAdvisor") {
    return {
      targetId: "fcf38ed6-2e1f-52e2-824d-b10b91363bee",
      targetType: "TRIGGER",
    };
  }

  if (actionId === "j01.escalateAdvisor") {
    return {
      targetId: "3f164151-0bc4-54ff-a5a4-b7521c41826b",
      targetType: "RECOMMENDATION",
    };
  }

  return {};
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
  const body =
    endpoint === "/api/advisor-review/actions"
      ? { actionId, ...advisorReviewTargetForAction(actionId) }
      : { actionId };

  return [
    {
      action: "api",
      body,
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

function actorForProcess(processId: string, endpoint: string) {
  if (processId === "BP-030") return { roleKey: "compliance_officer", tenantSlug: "morgan" };
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

function projectionWaveParts(wave: ProcessUniverseProjectionWave) {
  if (wave === "wave_1") return { slug: "wave-1", token: "W1" };
  if (wave === "wave_2") return { slug: "wave-2", token: "W2" };
  if (wave === "wave_3") return { slug: "wave-3", token: "W3" };
  if (wave === "wave_4") return { slug: "wave-4", token: "W4" };
  if (wave === "wave_5") return { slug: "wave-5", token: "W5" };
  if (wave === "wave_6") return { slug: "wave-6", token: "W6" };
  return { slug: "wave-7", token: "W7" };
}

function visualBefore(
  processId: string,
  wave: ProcessUniverseProjectionWave = "wave_1",
): Extract<ProcessUniverseCaptureAction, { action: "screenshot" }> {
  const { slug, token } = projectionWaveParts(wave);
  return {
    action: "screenshot",
    name: `${processId.toLowerCase()}-projection-${slug}-before`,
    phase: "before",
    processId,
    visualProofId: `PU-VISUAL-${processId}-${token}-BEFORE`,
    visibleProof: true,
  };
}

function visualAfter(
  processId: string,
  expectedOcrText: string[],
  wave: ProcessUniverseProjectionWave = "wave_1",
): Extract<ProcessUniverseCaptureAction, { action: "screenshot" }> {
  const { slug, token } = projectionWaveParts(wave);
  return {
    action: "screenshot",
    compareWith: `PU-VISUAL-${processId}-${token}-BEFORE`,
    expectedOcrText,
    minChangedPixels: 500,
    name: `${processId.toLowerCase()}-projection-${slug}-visible`,
    ocrRequired: true,
    phase: "after",
    processId,
    visualProofId: `PU-VISUAL-${processId}-${token}-AFTER`,
    visibleProof: true,
  };
}

function visibleProjectionActionsForProcess(processId: string): ProcessUniverseCaptureAction[] {
  const byProcess: Record<string, ProcessUniverseCaptureAction[]> = {
    "BP-001": [
      { action: "goto", route: "/client/home" },
      visualBefore(processId, "wave_6"),
      { action: "goto", route: "/client/profile" },
      { action: "assertText", text: "Principal / intake in progress" },
      { action: "assertText", text: "Profile save" },
      visualAfter(processId, ["Principal / intake"], "wave_6"),
    ],
    "BP-002": [
      { action: "goto", route: "/admin/tenants" },
      visualBefore(processId, "wave_7"),
      { action: "goto", route: "/tenants/new" },
      { action: "assertText", text: "Create Tenant" },
      { action: "assertText", text: "Tenant draft" },
      visualAfter(processId, ["Create Tenant"], "wave_7"),
    ],
    "BP-003": [
      { action: "goto", route: "/client/home" },
      visualBefore(processId, "wave_7"),
      { action: "goto", route: "/client/profile" },
      { action: "assertText", text: "Profile save" },
      { action: "assertText", text: "Principal / intake in progress" },
      visualAfter(processId, ["Profile save"], "wave_7"),
    ],
    "BP-004": [
      { action: "goto", route: "/client/home" },
      visualBefore(processId, "wave_5"),
      { action: "goto", route: "/client/family-members" },
      { action: "assertText", text: "Family edit state" },
      { action: "assertText", text: "Tenant permitted" },
      { action: "assertText", text: "Downstream use" },
      visualAfter(processId, ["Family edit state"], "wave_5"),
    ],
    "BP-005": [
      { action: "goto", route: "/client/family-members" },
      visualBefore(processId, "wave_5"),
      { action: "goto", route: "/relationships" },
      { action: "assertText", text: "Relationship edges" },
      { action: "assertText", text: "Missing evidence" },
      { action: "assertText", text: "Audit event not created" },
      visualAfter(processId, ["Relationship edges"], "wave_5"),
    ],
    "BP-006": [
      { action: "goto", route: "/entities/new" },
      visualBefore(processId, "wave_5"),
      { action: "goto", route: "/entities" },
      { action: "assertText", text: "View and manage entities" },
      { action: "assertText", text: "Tenant permitted" },
      { action: "assertText", text: "High Risk" },
      visualAfter(processId, ["View and manage entities"], "wave_5"),
    ],
    "BP-008": [
      { action: "goto", route: "/client/family-members" },
      visualBefore(processId, "wave_7"),
      { action: "goto", route: "/relationships" },
      { action: "assertText", text: "Relationship edges" },
      { action: "assertText", text: "Missing evidence" },
      visualAfter(processId, ["Relationship edges"], "wave_7"),
    ],
    "BP-010": [
      { action: "goto", route: "/entities" },
      visualBefore(processId, "wave_5"),
      { action: "goto", route: "/entities/philanthropy-trust" },
      { action: "assertText", text: "Data Sensitivity" },
      { action: "assertText", text: "Private" },
      { action: "assertText", text: "Visibility and advice changes remain held" },
      visualAfter(processId, ["Data Sensitivity"], "wave_5"),
    ],
    "BP-014": [
      { action: "goto", route: "/tenants/morgan/setup" },
      visualBefore(processId, "wave_6"),
      { action: "goto", route: "/tenants/morgan/team" },
      { action: "assertText", text: "Role Assignments" },
      { action: "assertText", text: "Team Summary" },
      visualAfter(processId, ["Role Assignments"], "wave_6"),
    ],
    "BP-013": [
      { action: "goto", route: "/governance" },
      visualBefore(processId, "wave_7"),
      { action: "goto", route: "/governance/access-requests/external-advisor" },
      { action: "assertText", text: "Access is not granted yet" },
      { action: "assertText", text: "Review request" },
      visualAfter(processId, ["Access is not granted yet"], "wave_7"),
    ],
    "BP-017": [
      { action: "goto", route: "/governance" },
      visualBefore(processId, "wave_6"),
      { action: "goto", route: "/governance/access-requests/external-advisor" },
      { action: "assertText", text: "Access is not granted yet" },
      { action: "assertText", text: "Review request" },
      visualAfter(processId, ["Access is not granted yet"], "wave_6"),
    ],
    "BP-023": [
      { action: "goto", route: "/documents" },
      visualBefore(processId, "wave_5"),
      { action: "goto", route: "/documents/upload" },
      { action: "assertText", text: "Upload remains blocked until a source file is selected." },
      { action: "assertText", text: "No evidence, audit, release, export or client visibility changes occur." },
      visualAfter(processId, ["Upload remains blocked"], "wave_5"),
    ],
    "BP-025": [
      { action: "goto", route: "/documents/upload" },
      visualBefore(processId),
      { action: "goto", route: "/documents/review-queue" },
      { action: "assertText", text: "morgan-tax-residency-2026.pdf" },
      { action: "assertText", text: "Lifecycle: Review Pending" },
      visualAfter(processId, ["Lifecycle"]),
    ],
    "BP-030": [
      { action: "goto", route: "/documents/upload" },
      visualBefore(processId),
      { action: "click", locator: { kind: "testId", value: "j04-upload-document" } },
      { action: "goto", route: "/documents/review-queue" },
      { action: "assertText", text: "Review & Sufficiency" },
      { action: "assertText", text: "morgan-tax-residency-2026.pdf" },
      { action: "click", locator: { kind: "testId", value: "stage3-accept-sufficiency" } },
      { action: "assertText", text: "Run sufficiency check" },
      visualAfter(processId, ["Run sufficiency check"]),
    ],
    "BP-031": [
      { action: "goto", route: "/documents" },
      visualBefore(processId, "wave_6"),
      { action: "goto", route: "/client/home" },
      { action: "assertText", text: "Client-safe evidence summary rebuilt" },
      { action: "assertText", text: "Internal draft notes remain excluded" },
      visualAfter(processId, ["Client-safe evidence summary"], "wave_6"),
    ],
    "BP-032": [
      { action: "goto", route: "/decisions" },
      visualBefore(processId, "wave_7"),
      { action: "goto", route: "/evidence/decision-pack/review" },
      { action: "assertText", text: "Evidence Vault" },
      { action: "assertText", text: "Audit Timeline" },
      visualAfter(processId, ["Evidence Vault"], "wave_7"),
    ],
    "BP-026": [
      { action: "goto", route: "/documents" },
      visualBefore(processId, "wave_5"),
      { action: "goto", route: "/documents/upload" },
      { action: "assertText", text: "Version" },
      { action: "assertText", text: "checksum evidence stored internally" },
      visualAfter(processId, ["Version"], "wave_5"),
    ],
    "BP-027": [
      { action: "goto", route: "/documents/upload" },
      visualBefore(processId, "wave_5"),
      { action: "goto", route: "/documents/review-queue" },
      { action: "assertText", text: "Review & Sufficiency" },
      { action: "assertText", text: "Human review required" },
      visualAfter(processId, ["Request clarification"], "wave_5"),
    ],
    "BP-028": [
      { action: "goto", route: "/documents" },
      visualBefore(processId, "wave_5"),
      { action: "goto", route: "/documents/review-queue" },
      { action: "assertText", text: "Review & Sufficiency" },
      { action: "assertText", text: "Request clarification" },
      visualAfter(processId, ["Request clarification"], "wave_5"),
    ],
    "BP-029": [
      { action: "goto", route: "/documents/review-queue" },
      visualBefore(processId, "wave_5"),
      { action: "goto", route: "/documents/morgan-tax-residency/review" },
      { action: "assertText", text: "Verification step" },
      { action: "assertText", text: "View Details" },
      visualAfter(processId, ["Verification step"], "wave_5"),
    ],
    "BP-033": [
      { action: "goto", route: "/documents" },
      visualBefore(processId, "wave_5"),
      { action: "goto", route: "/documents/review-queue" },
      { action: "assertText", text: "Request clarification" },
      { action: "assertText", text: "Lifecycle: Insufficient" },
      visualAfter(processId, ["Request clarification"], "wave_5"),
    ],
    "BP-053": [
      { action: "goto", route: "/advisor/reviews/current" },
      visualBefore(processId),
      { action: "fill", locator: { kind: "testId", value: "advisor-rationale-input" }, value: "Evidence follow-up requested for source documents." },
      { action: "assertText", text: "Rationale captured for this review." },
      { action: "click", locator: { kind: "testId", value: "j01-request-evidence" } },
      { action: "assertText", text: "Evidence request saved. The package remains internal." },
      visualAfter(processId, ["Evidence follow-up", "Rationale captured"]),
    ],
    "BP-054": [
      { action: "goto", route: "/advisor/reviews/current" },
      visualBefore(processId),
      { action: "fill", locator: { kind: "testId", value: "advisor-rationale-input" }, value: "Package evidence reviewed for compliance handoff." },
      { action: "assertText", text: "Rationale captured for this review." },
      { action: "click", locator: { kind: "testId", value: "j01-approve-advisor" } },
      { action: "assertText", text: "Package submitted for compliance review. Client delivery and export were not created." },
      visualAfter(processId, ["compliance review"]),
    ],
    "BP-061": [
      { action: "goto", route: "/compliance/reviews/current/decision-room" },
      { action: "click", locator: { kind: "testId", value: "j02-request-evidence" } },
      { action: "assertText", text: "Confirm Evidence Request - No Client Release" },
      { action: "assertText", text: "Compliance action is blocked until the acknowledgement is checked, a controlled reason is entered and the exact phrase is typed." },
      visualBefore(processId),
      { action: "fill", locator: { kind: "testId", value: "typed-request_evidence-reason" }, value: "Request missing risk evidence before any client release." },
      { action: "click", locator: { kind: "testId", value: "typed-request_evidence-acknowledgement" } },
      { action: "fill", locator: { kind: "testId", value: "j02-request-evidence-confirmation" }, value: "REQUEST EVIDENCE" },
      { action: "click", locator: { kind: "testId", value: "j02-confirm-request-evidence" } },
      { action: "assertText", text: "Action recorded" },
      visualAfter(processId, ["Action recorded"]),
    ],
    "BP-062": [
      { action: "goto", route: "/compliance/reviews/current/decision-room" },
      { action: "click", locator: { kind: "testId", value: "j02-block-release" } },
      { action: "assertText", text: "Confirm Compliance Block - No Client Release" },
      { action: "assertText", text: "Compliance action is blocked until the acknowledgement is checked, a controlled reason is entered and the exact phrase is typed." },
      visualBefore(processId),
      { action: "fill", locator: { kind: "testId", value: "typed-compliance_block-reason" }, value: "Block client release until compliance evidence is complete." },
      { action: "click", locator: { kind: "testId", value: "typed-compliance_block-acknowledgement" } },
      { action: "fill", locator: { kind: "testId", value: "typed-compliance_block-confirmation" }, value: "BLOCK RELEASE" },
      { action: "click", locator: { kind: "testId", value: "typed-compliance_block-submit" } },
      { action: "assertText", text: "Action recorded" },
      visualAfter(processId, ["Action recorded"]),
    ],
    "BP-066": [
      { action: "goto", route: "/compliance/reviews/current/decision-room" },
      visualBefore(processId),
      { action: "goto", route: "/compliance/reviews/current/release" },
      { action: "assertText", text: "Release action pending" },
      { action: "assertText", text: "Client-safe candidate ready" },
      visualAfter(processId, ["Client-safe candidate"]),
    ],
    "BP-077": [
      { action: "goto", route: "/decisions" },
      visualBefore(processId, "wave_6"),
      { action: "goto", route: "/decisions/liquidity-governance" },
      { action: "assertText", text: "Rationale draft" },
      { action: "assertText", text: "Decision status" },
      visualAfter(processId, ["Rationale draft"], "wave_6"),
    ],
    "BP-075": [
      { action: "goto", route: "/decisions" },
      visualBefore(processId, "wave_7"),
      { action: "goto", route: "/decisions/liquidity-governance" },
      { action: "assertText", text: "Decision status" },
      { action: "assertText", text: "Accept option" },
      visualAfter(processId, ["Decision status"], "wave_7"),
    ],
    "BP-076": [
      { action: "goto", route: "/decisions" },
      visualBefore(processId, "wave_7"),
      { action: "goto", route: "/decisions/liquidity-governance" },
      { action: "assertText", text: "Evidence / timeline" },
      { action: "assertText", text: "Audit readiness" },
      visualAfter(processId, ["Evidence / timeline"], "wave_7"),
    ],
    "BP-078": [
      { action: "goto", route: "/decisions" },
      visualBefore(processId, "wave_7"),
      { action: "goto", route: "/decisions/liquidity-governance" },
      { action: "assertText", text: "Decision status" },
      { action: "assertText", text: "Defer decision" },
      visualAfter(processId, ["Defer decision"], "wave_7"),
    ],
    "BP-081": [
      { action: "goto", route: "/decisions/liquidity-governance" },
      visualBefore(processId, "wave_7"),
      { action: "goto", route: "/evidence/decision-pack/review" },
      { action: "assertText", text: "Evidence Vault" },
      { action: "assertText", text: "Linked decision" },
      visualAfter(processId, ["Evidence Vault"], "wave_7"),
    ],
    "BP-082": [
      { action: "goto", route: "/decisions/liquidity-governance" },
      visualBefore(processId, "wave_7"),
      { action: "goto", route: "/compliance/reviews/current/audit" },
      { action: "assertText", text: "Audit Timeline" },
      { action: "assertText", text: "Decision status" },
      visualAfter(processId, ["Audit Timeline"], "wave_7"),
    ],
    "BP-083": [
      { action: "goto", route: "/decisions/liquidity-governance" },
      visualBefore(processId, "wave_7"),
      { action: "goto", route: "/compliance/reviews/current/audit" },
      { action: "assertText", text: "Exception and review history" },
      { action: "assertText", text: "Audit Timeline" },
      visualAfter(processId, ["Exception"], "wave_7"),
    ],
    "BP-085": [
      { action: "goto", route: "/export/client-package/approval" },
      visualBefore(processId),
      { action: "goto", route: "/export/client-package/scope" },
      { action: "assertText", text: "Selected Content" },
      { action: "assertText", text: "included for the next review" },
      visualAfter(processId, ["Selected Content"]),
    ],
    "BP-086": [
      { action: "goto", route: "/export/client-package/scope" },
      visualBefore(processId),
      { action: "goto", route: "/export/client-package/redaction" },
      { action: "assertText", text: "Protection Checklist" },
      { action: "assertText", text: "sensitive areas covered" },
      visualAfter(processId, ["Protection Checklist"]),
    ],
    "BP-088": [
      { action: "goto", route: "/export/client-package/scope" },
      visualBefore(processId),
      { action: "goto", route: "/export/client-package/approval" },
      { action: "assertText", text: "Ready for approval review" },
      { action: "assertText", text: "Approval records reviewer intent only" },
      visualAfter(processId, ["approval review"]),
    ],
    "BP-092": [
      { action: "goto", route: "/export/client-package/approval" },
      visualBefore(processId),
      { action: "goto", route: "/export/client-package/redaction" },
      { action: "assertText", text: "Protection Checklist" },
      { action: "assertText", text: "4 sensitive areas covered" },
      { action: "assertNotText", text: "internal draft" },
      { action: "assertNotText", text: "analyst note" },
      visualAfter(processId, ["sensitive areas"]),
    ],
    "BP-099": [
      { action: "goto", route: "/ops/sla/release-readiness" },
      visualBefore(processId),
      { action: "goto", route: "/ops" },
      { action: "assertText", text: "Release Support" },
      { action: "assertText", text: "High-severity blockers" },
      { action: "assertText", text: "Review monitoring" },
      visualAfter(processId, ["Review monitoring"]),
    ],
    "BP-015": [
      { action: "goto", route: "/governance/roles/portfolio-manager?state=base" },
      { action: "click", locator: { kind: "testId", value: "j07-open-role-drawer" } },
      { action: "assertText", text: "Sensitive permission change" },
      visualBefore(processId, "wave_2"),
      { action: "click", locator: { kind: "selector", value: "[data-testid='uxp3-role-drawer-lifecycle'] input[type='checkbox']" } },
      { action: "assertText", text: "Role drawer valid" },
      { action: "click", locator: { kind: "testId", value: "j07-review-role-changes" } },
      { action: "assertText", text: "Confirm Sensitive Permission Changes" },
      { action: "fill", locator: { kind: "testId", value: "j07-role-confirmation-phrase" }, value: "CONFIRM ROLE CHANGE" },
      { action: "assertText", text: "Role confirmation valid" },
      { action: "click", locator: { kind: "testId", value: "j07-save-role-changes" } },
      { action: "assertText", text: "Role change review routed" },
      { action: "assertText", text: "cannot release advice, mark evidence review complete, approve export or bypass audit persistence" },
      visualAfter(processId, ["Role change review routed"], "wave_2"),
    ],
    "BP-016": [
      { action: "goto", route: "/admin/roles" },
      visualBefore(processId, "wave_2"),
      { action: "click", locator: { kind: "testId", value: "j10-review-permission" } },
      { action: "assertText", text: "Security controls guarded" },
      { action: "assertText", text: "Authentication and access" },
      visualAfter(processId, ["Authentication and access"], "wave_2"),
    ],
    "BP-018": [
      { action: "goto", route: "/governance" },
      visualBefore(processId, "wave_2"),
      { action: "click", locator: { kind: "testId", value: "domain-06-governance-primary-next-action" } },
      { action: "assertText", text: "Access is not granted yet" },
      { action: "click", locator: { kind: "testId", value: "j07-open-access-request-drawer" } },
      { action: "assertText", text: "Access request blocked" },
      visualAfter(processId, ["Access review", "Admin configuration"], "wave_2"),
    ],
    "BP-019": [
      { action: "goto", route: "/governance/roles/portfolio-manager?state=base" },
      { action: "click", locator: { kind: "testId", value: "j07-open-role-drawer" } },
      { action: "assertText", text: "Sensitive permission change" },
      visualBefore(processId, "wave_2"),
      { action: "click", locator: { kind: "selector", value: "[data-testid='uxp3-role-drawer-lifecycle'] input[type='checkbox']" } },
      { action: "click", locator: { kind: "testId", value: "j07-review-role-changes" } },
      { action: "assertText", text: "Confirm Sensitive Permission Changes" },
      { action: "fill", locator: { kind: "testId", value: "j07-role-confirmation-phrase" }, value: "WRONG PHRASE" },
      { action: "assertText", text: "Role confirmation blocked" },
      visualAfter(processId, ["Role confirmation blocked"], "wave_2"),
    ],
    "BP-020": [
      { action: "goto", route: "/admin/roles" },
      visualBefore(processId, "wave_2"),
      { action: "click", locator: { kind: "testId", value: "j10-review-permission" } },
      { action: "assertText", text: "Security controls guarded" },
      visualAfter(processId, ["Authentication and access"], "wave_2"),
    ],
    "BP-022": [
      { action: "goto", route: "/governance/access-requests/external-advisor?state=base" },
      { action: "click", locator: { kind: "testId", value: "j07-open-access-request-drawer" } },
      { action: "assertText", text: "Access review" },
      visualBefore(processId, "wave_2"),
      { action: "click", locator: { kind: "selector", value: "[data-testid='uxp3-access-request-drawer-lifecycle'] input[type='checkbox']" } },
      { action: "assertText", text: "Access request valid" },
      { action: "click", locator: { kind: "testId", value: "j07-approve-access" } },
      { action: "assertText", text: "Access request routed" },
      visualAfter(processId, ["Access request routed"], "wave_2"),
    ],
    "BP-103": [
      { action: "goto", route: "/admin/platform" },
      { action: "click", locator: { kind: "testId", value: "j10-save-platform" } },
      { action: "assertText", text: "Confirm critical change" },
      visualBefore(processId, "wave_2"),
      { action: "fill", locator: { kind: "placeholder", value: "Type the exact phrase above" }, value: "I understand the impact of this change" },
      { action: "assertText", text: "Exact phrase matched" },
      { action: "click", locator: { kind: "role", role: "button", name: "Confirm change" } },
      { action: "assertText", text: "Change recorded" },
      visualAfter(processId, ["Change recorded"], "wave_2"),
    ],
    "BP-104": [
      { action: "goto", route: "/admin/security" },
      { action: "click", locator: { kind: "testId", value: "j10-save-security" } },
      { action: "assertText", text: "Confirm critical security change" },
      visualBefore(processId, "wave_2"),
      { action: "fill", locator: { kind: "placeholder", value: "Type the exact phrase above" }, value: "CONFIRM SECURITY POLICY" },
      { action: "assertText", text: "Exact phrase matched" },
      { action: "click", locator: { kind: "role", role: "button", name: "Confirm change" } },
      { action: "assertText", text: "Change recorded" },
      visualAfter(processId, ["Change recorded"], "wave_2"),
    ],
    "BP-105": [
      { action: "goto", route: "/admin/tenants" },
      visualBefore(processId, "wave_2"),
      { action: "goto", route: "/tenants/morgan/policies" },
      { action: "assertText", text: "Policy Profile" },
      { action: "assertText", text: "Policy creation held" },
      visualAfter(processId, ["Policy creation held"], "wave_2"),
    ],
    "BP-106": [
      { action: "goto", route: "/admin/platform" },
      visualBefore(processId, "wave_2"),
      { action: "goto", route: "/admin/evidence-templates" },
      { action: "assertText", text: "Evidence Templates" },
      { action: "assertText", text: "Template held" },
      visualAfter(processId, ["Template held"], "wave_2"),
    ],
    "BP-107": [
      { action: "goto", route: "/admin/evidence-templates" },
      visualBefore(processId, "wave_2"),
      { action: "goto", route: "/admin/export-templates" },
      { action: "assertText", text: "Export Templates" },
      { action: "assertText", text: "Template held" },
      visualAfter(processId, ["Template held"], "wave_2"),
    ],
    "BP-109": [
      { action: "goto", route: "/tenants/morgan/team" },
      visualBefore(processId, "wave_2"),
      { action: "click", locator: { kind: "testId", value: "j06-assign-team" } },
      { action: "assertText", text: "Policy creation held" },
      visualAfter(processId, ["Policy creation held"], "wave_2"),
    ],
    "BP-108": [
      { action: "goto", route: "/admin/tenants" },
      visualBefore(processId, "wave_6"),
      { action: "goto", route: "/tenants/morgan/policies" },
      { action: "assertText", text: "2026.07-draft" },
      { action: "assertText", text: "Draft review" },
      visualAfter(processId, ["2026.07-draft"], "wave_6"),
    ],
    "BP-050": [
      { action: "goto", route: "/advisor/reviews" },
      visualBefore(processId, "wave_3"),
      { action: "click", locator: { kind: "testId", value: "domain10-s036-primary-next-action" } },
      { action: "assertText", text: "Next action" },
      { action: "assertText", text: "Package summary" },
      visualAfter(processId, ["Next action"], "wave_3"),
    ],
    "BP-051": [
      { action: "goto", route: "/advisor/reviews" },
      visualBefore(processId, "wave_3"),
      { action: "click", locator: { kind: "testId", value: "s036-open-selected-review" } },
      { action: "assertText", text: "Package summary" },
      { action: "assertText", text: "Next action" },
      visualAfter(processId, ["Package summary"], "wave_3"),
    ],
    "BP-052": [
      { action: "goto", route: "/advisor/reviews" },
      visualBefore(processId, "wave_3"),
      { action: "click", locator: { kind: "testId", value: "s036-open-selected-review" } },
      { action: "assertText", text: "Package summary" },
      { action: "assertText", text: "scenario fit" },
      visualAfter(processId, ["Package summary", "scenario fit"], "wave_3"),
    ],
    "BP-055": [
      { action: "goto", route: "/advisor/reviews/current" },
      visualBefore(processId, "wave_3"),
      { action: "fill", locator: { kind: "testId", value: "advisor-rationale-input" }, value: "Return to analyst for revised suitability evidence." },
      { action: "assertText", text: "Rationale captured for this review." },
      { action: "click", locator: { kind: "testId", value: "j01-return-to-analyst" } },
      { action: "assertText", text: "Package returned to analyst review. No client or export state changed." },
      visualAfter(processId, ["returned to analyst"], "wave_3"),
    ],
    "BP-058": [
      { action: "goto", route: "/compliance/reviews" },
      visualBefore(processId, "wave_3"),
      { action: "assertText", text: "Open the selected review. Release remains locked." },
      { action: "click", locator: { kind: "testId", value: "s038-open-selected-review" } },
      { action: "assertText", text: "Release checks" },
      visualAfter(processId, ["Release checks"], "wave_3"),
    ],
    "BP-059": [
      { action: "goto", route: "/compliance/reviews/current/decision-room" },
      visualBefore(processId, "wave_3"),
      { action: "click", locator: { kind: "testId", value: "j02-block-release" } },
      { action: "assertText", text: "Confirm Compliance Block - No Client Release" },
      { action: "assertText", text: "Compliance action is blocked until the acknowledgement is checked, a controlled reason is entered and the exact phrase is typed." },
      visualAfter(processId, ["Compliance action is blocked"], "wave_3"),
    ],
    "BP-060": [
      { action: "goto", route: "/compliance/reviews/current/decision-room" },
      { action: "click", locator: { kind: "testId", value: "j02-request-evidence" } },
      { action: "assertText", text: "Confirm Evidence Request - No Client Release" },
      visualBefore(processId, "wave_3"),
      { action: "fill", locator: { kind: "testId", value: "typed-request_evidence-reason" }, value: "Request missing evidence before any client release." },
      { action: "click", locator: { kind: "testId", value: "typed-request_evidence-acknowledgement" } },
      { action: "fill", locator: { kind: "testId", value: "j02-request-evidence-confirmation" }, value: "REQUEST EVIDENCE" },
      { action: "click", locator: { kind: "testId", value: "j02-confirm-request-evidence" } },
      { action: "assertText", text: "Action recorded" },
      visualAfter(processId, ["Action recorded"], "wave_3"),
    ],
    "BP-064": [
      { action: "goto", route: "/compliance/reviews/current/decision-room" },
      visualBefore(processId, "wave_3"),
      { action: "goto", route: "/compliance/reviews/current/audit" },
      { action: "assertText", text: "Audit review rows" },
      { action: "click", locator: { kind: "testId", value: "j02-export-controlled" } },
      { action: "assertText", text: "Export controlled" },
      visualAfter(processId, ["Audit review rows", "Export controlled"], "wave_3"),
    ],
    "BP-089": [
      { action: "goto", route: "/export/client-package/approval" },
      visualBefore(processId, "wave_3"),
      { action: "goto", route: "/export/client-package/download" },
      { action: "assertText", text: "Download Package" },
      { action: "assertText", text: "Generate package" },
      visualAfter(processId, ["Download Package"], "wave_3"),
    ],
    "BP-090": [
      { action: "goto", route: "/export/client-package/approval" },
      visualBefore(processId, "wave_3"),
      { action: "goto", route: "/export/client-package/download" },
      { action: "assertText", text: "No Share Link" },
      { action: "assertText", text: "No external link yet" },
      visualAfter(processId, ["No Share Link"], "wave_3"),
    ],
    "BP-091": [
      { action: "goto", route: "/export/client-package/download" },
      visualBefore(processId, "wave_3"),
      { action: "goto", route: "/governance/audit?state=drawer" },
      { action: "assertText", text: "Event Details" },
      { action: "click", locator: { kind: "testId", value: "j07-export-audit" } },
      { action: "assertText", text: "Export audit events" },
      visualAfter(processId, ["Export audit events"], "wave_3"),
    ],
    "BP-100": [
      { action: "goto", route: "/ops/sla/release-readiness" },
      visualBefore(processId, "wave_3"),
      { action: "goto", route: "/ops" },
      { action: "assertText", text: "Release Support" },
      { action: "assertText", text: "High-severity blockers" },
      { action: "assertText", text: "Review monitoring" },
      visualAfter(processId, ["Review monitoring"], "wave_3"),
    ],
    "BP-034": [
      { action: "goto", route: "/advisory" },
      visualBefore(processId, "wave_4"),
      { action: "click", locator: { kind: "testId", value: "ux-hub-primary-next-work" } },
      { action: "assertText", text: "Compliance review" },
      { action: "assertText", text: "Open review work" },
      visualAfter(processId, ["Compliance review"], "wave_4"),
    ],
    "BP-038": [
      { action: "goto", route: "/advisory" },
      visualBefore(processId, "wave_4"),
      { action: "goto", route: "/advisory/review-queue" },
      { action: "assertText", text: "Compliance review" },
      { action: "assertText", text: "Client view" },
      visualAfter(processId, ["Client view"], "wave_4"),
    ],
    "BP-039": [
      { action: "goto", route: "/advisory/review-queue" },
      visualBefore(processId, "wave_4"),
      { action: "goto", route: "/advisory/triggers/liquidity-drift/review" },
      { action: "assertText", text: "Next action" },
      { action: "assertText", text: "Request missing evidence" },
      visualAfter(processId, ["Request missing evidence"], "wave_4"),
    ],
    "BP-040": [
      { action: "goto", route: "/advisory" },
      visualBefore(processId, "wave_4"),
      { action: "goto", route: "/advisory/triggers/liquidity-drift/review" },
      { action: "assertText", text: "Missing evidence" },
      { action: "assertText", text: "Request missing evidence" },
      visualAfter(processId, ["Request missing evidence"], "wave_4"),
    ],
    "BP-041": [
      { action: "goto", route: "/ops/sla/release-readiness" },
      visualBefore(processId, "wave_4"),
      { action: "goto", route: "/ops" },
      { action: "assertText", text: "Release Support" },
      { action: "assertText", text: "High-severity blockers" },
      { action: "assertText", text: "Review monitoring" },
      visualAfter(processId, ["High-severity blockers"], "wave_4"),
    ],
    "BP-042": [
      { action: "goto", route: "/advisory" },
      visualBefore(processId, "wave_4"),
      { action: "goto", route: "/advisory/review-queue" },
      { action: "assertText", text: "Draft" },
      { action: "assertText", text: "Compliance review" },
      visualAfter(processId, ["Compliance review"], "wave_4"),
    ],
    "BP-043": [
      { action: "goto", route: "/advisory" },
      visualBefore(processId, "wave_4"),
      { action: "goto", route: "/advisory/review-queue" },
      { action: "assertText", text: "Draft" },
      { action: "assertText", text: "Open review work" },
      visualAfter(processId, ["Draft"], "wave_4"),
    ],
    "BP-044": [
      { action: "goto", route: "/advisory/review-queue" },
      visualBefore(processId, "wave_4"),
      { action: "goto", route: "/advisory/triggers/liquidity-drift/review" },
      { action: "assertText", text: "Missing evidence" },
      { action: "assertText", text: "Request missing evidence" },
      visualAfter(processId, ["Missing evidence"], "wave_4"),
    ],
    "BP-045": [
      { action: "goto", route: "/advisory" },
      visualBefore(processId, "wave_4"),
      { action: "goto", route: "/advisory/triggers/liquidity-drift/review" },
      { action: "assertText", text: "Status" },
      { action: "assertText", text: "Route to advisor review" },
      visualAfter(processId, ["Route to advisor review"], "wave_4"),
    ],
    "BP-046": [
      { action: "goto", route: "/advisory/review-queue" },
      visualBefore(processId, "wave_4"),
      { action: "goto", route: "/advisory/triggers/liquidity-drift/review" },
      { action: "assertText", text: "Request missing evidence" },
      { action: "assertText", text: "Next action" },
      visualAfter(processId, ["Next action"], "wave_4"),
    ],
    "BP-047": [
      { action: "goto", route: "/advisory" },
      visualBefore(processId, "wave_4"),
      { action: "goto", route: "/advisory/review-queue" },
      { action: "assertText", text: "Client view" },
      { action: "assertText", text: "Held" },
      visualAfter(processId, ["Client view"], "wave_4"),
    ],
    "BP-048": [
      { action: "goto", route: "/advisory" },
      visualBefore(processId, "wave_4"),
      { action: "goto", route: "/advisory/triggers/liquidity-drift/review" },
      { action: "assertText", text: "Request missing evidence" },
      { action: "assertText", text: "Trigger detail" },
      visualAfter(processId, ["Request missing evidence"], "wave_4"),
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
  const projectionWave: ProcessUniverseProjectionWave | undefined = projectionWave1ProcessIdSet.has(input.processId)
    ? "wave_1"
    : projectionWave2ProcessIdSet.has(input.processId)
      ? "wave_2"
      : projectionWave3ProcessIdSet.has(input.processId)
        ? "wave_3"
        : projectionWave4ProcessIdSet.has(input.processId)
          ? "wave_4"
          : projectionWave5ProcessIdSet.has(input.processId)
          ? "wave_5"
          : projectionWave6ProcessIdSet.has(input.processId)
            ? "wave_6"
            : projectionWave7ProcessIdSet.has(input.processId)
              ? "wave_7"
              : undefined;
  const visibleProjectionActions = visibleProjectionActionsForProcess(input.processId);
  const classificationBefore = projectionWave6ProcessIdSet.has(input.processId)
    ? "gap_only"
    : projectionWave
      ? "api_executable"
      : "visual_reference_only";

  return {
    actor: actorForProcess(input.processId, endpoint),
    authorityKind,
    classificationAfter: hasMissingNegativeProof ? "blocked_negative_only" : "api_executable",
    classificationBefore,
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
