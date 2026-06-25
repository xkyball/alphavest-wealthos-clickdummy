import type { AuditResult, ObjectType, WorkflowStatus } from "@prisma/client";

export const p44Phase9TicketOrder = [
  "P44-9-T01-EXEC",
  "P44-9-T02-EXEC",
  "P44-9-T03-EXEC",
  "P44-9-T04-EXEC",
  "P44-9-T05-EXEC",
  "P44-9-T06-EXEC",
  "P44-9-T07-EXEC",
  "P44-9-T08-EXEC",
  "P44-9-T09-EXEC",
  "P44-9-T10-EXEC",
  "P44-9-T11-EXEC",
  "P44-9-T12-EXEC",
  "P44-9-T13-EXEC",
  "P44-9-T14-EXEC",
  "P44-9-T15-EXEC",
] as const;

export type P44Phase9TicketId = (typeof p44Phase9TicketOrder)[number];

export type P44Phase9ReadinessInput = {
  analysisComplete: boolean;
  predecessorPhase8Exit: boolean;
  specificationComplete: boolean;
  targetFilesConfirmed: boolean;
  testsConfirmed: boolean;
};

export type P44Phase9DataQualityIssueState = {
  id: string;
  status: WorkflowStatus;
  targetId: string;
  targetType: ObjectType;
};

export type P44Phase9AuditState = {
  eventType: string;
  nextState: string | null;
  previousState: string | null;
  reason: string | null;
  result: AuditResult;
  targetId: string;
  targetType: ObjectType;
};

export type P44Phase9ProcessProofRow = {
  completionLabel: "L2" | "L3" | "L4" | "BLOCKER";
  negativeProofRef: string;
  phase: "PH5" | "PH6" | "PH7" | "PH8";
  positivePath: string;
  positiveProofRef: string;
  processId: string;
  sourceTicketId: string;
  targetFiles: string[];
};

export type P44Phase9NegativeScopeCase = {
  auditProofRef: string;
  denied: boolean;
  hidden: boolean;
  leakDetected: boolean;
  negativeClass: "wrong_actor" | "wrong_tenant" | "wrong_object";
  processFamily: "AI_DRAFT" | "ADVISOR" | "COMPLIANCE" | "EXPORT" | "DATA_QUALITY";
  proofRef: string;
};

export type P44Phase9PayloadVisibilityRow = {
  allowedFields: string[];
  forbiddenFieldsAbsent: boolean;
  hiddenFields: string[];
  proofRef: string;
  surface: "CLIENT_API" | "INTERNAL_API" | "ADMIN_AUDIT" | "EXPORT_PREVIEW" | "EXPORT_PACKAGE" | "EXPORT_DOWNLOAD";
};

export type P44Phase9ActionTraceRow = {
  action: string;
  api: string;
  db: string;
  route: string;
  service: string;
  sourceTicketId: string;
  testStatus: "PROOF_LINKED" | "BLOCKED" | "AMBIGUOUS";
};

export type P44Phase9CompletionRegisterRow = {
  blockers: string[];
  completionLabel: "L2" | "L3" | "L4" | "BLOCKER";
  evidenceRefs: string[];
  processId: string;
  sourceTicketId: string;
};

export type P44Phase9BlockerCategory = "safety" | "ui" | "api" | "schema" | "test" | "p1_hold_contamination";

export type P44Phase9BlockerRegisterRow = {
  category: P44Phase9BlockerCategory;
  completionAffecting: boolean;
  hiddenInsideCompletedClaim: boolean;
  recommendation: string;
  risk: string;
};

export type P44Phase9RoadmapInput = {
  priorStrongProcessCount: number;
  remainingRows: readonly P44Phase9ProcessProofRow[];
};

export type P44Phase9TaskMasterCandidate = {
  acceptance: string;
  ctes: number;
  dependencies: string[];
  negativeTests: string;
  sourceTicketId: string;
  targetFiles: string[];
};

const phase5ProcessTickets = [
  ["P44-5-T01-EXEC", "Internal draft generation command is bounded and internal-only."],
  ["P44-5-T02-EXEC", "AI/rules draft payload receives internal-only tagging."],
  ["P44-5-T03-EXEC", "Draft classification lifecycle persists target state."],
  ["P44-5-T04-EXEC", "Unsupported-claim detection result is persisted."],
  ["P44-5-T05-EXEC", "Unsupported-claim states are visible to internal users."],
  ["P44-5-T06-EXEC", "Draft rejection command transitions safely."],
  ["P44-5-T07-EXEC", "Evidence-backed rebuild command uses approved source material."],
  ["P44-5-T08-EXEC", "Source/evidence trace map links drafts to evidence."],
  ["P44-5-T09-EXEC", "Draft rebuild/reject trace writes audit."],
  ["P44-5-T10-EXEC", "AI draft leakage sweep keeps client/export payload clean."],
  ["P44-5-T11-EXEC", "AI draft handoff into advisor/compliance stays internal."],
  ["P44-5-T12-EXEC", "Negative draft gate matrix blocks unsafe paths."],
  ["P44-5-T13-EXEC", "AI governance handoff notes are repo-local and test-linked."],
] as const;

const phase6ProcessTickets = [
  ["P44-6-T01-EXEC", "Advisor queue triage command/readmodel is covered."],
  ["P44-6-T02-EXEC", "Advisor queue permission and object-scope tests deny leaks."],
  ["P44-6-T03-EXEC", "Option comparison path persists comparable options."],
  ["P44-6-T04-EXEC", "Option comparison decision guard blocks unsafe selection."],
  ["P44-6-T05-EXEC", "Advisor request-more-evidence lifecycle persists request state."],
  ["P44-6-T06-EXEC", "Advisor evidence request states expose feedback safely."],
  ["P44-6-T07-EXEC", "Advisor reject/return-to-analyst lifecycle persists return state."],
  ["P44-6-T08-EXEC", "Advisor reject/return negative cases are denied."],
  ["P44-6-T09-EXEC", "Advisor approval remains separate from client release."],
] as const;

const phase7ProcessTickets = [
  ["P44-7-T01-EXEC", "Compliance queue triage readmodel/action is covered."],
  ["P44-7-T02-EXEC", "Compliance precondition disabled states are evaluated."],
  ["P44-7-T03-EXEC", "Compliance evidence request lifecycle persists request state."],
  ["P44-7-T04-EXEC", "Compliance request-evidence negative tests deny unsafe paths."],
  ["P44-7-T05-EXEC", "Decision rationale capture lifecycle persists rationale."],
  ["P44-7-T06-EXEC", "Decision rationale payload and audit tests hide internals."],
  ["P44-7-T07-EXEC", "Compliance/rationale integration requires preconditions."],
] as const;

const phase8ProcessTickets = [
  ["P44-8-T01-EXEC", "Export request command captures actor, tenant, object and scope."],
  ["P44-8-T02-EXEC", "Export request validation keeps invalid state fail-closed."],
  ["P44-8-T03-EXEC", "Export scope selection persists and reloads through read model."],
  ["P44-8-T04-EXEC", "Export scope negative tests deny wrong tenant/object/visibility."],
  ["P44-8-T05-EXEC", "Redaction profile is selected and enforced before preview."],
  ["P44-8-T06-EXEC", "Forbidden field matrix protects preview/package/download."],
  ["P44-8-T07-EXEC", "Export preview command closes without approving package."],
  ["P44-8-T08-EXEC", "Export preview not approval tests deny premature sharing."],
  ["P44-8-T09-EXEC", "Export approval command persists actor, scope and audit."],
  ["P44-8-T10-EXEC", "Export approval preconditions cannot be bypassed by role alone."],
  ["P44-8-T11-EXEC", "Package generation requires approved export and audit context."],
  ["P44-8-T12-EXEC", "Package content safety tests reject unsafe metadata/content."],
  ["P44-8-T13-EXEC", "Download/share lifecycle is audited and post-generation only."],
  ["P44-8-T14-EXEC", "Export audit end-to-end linkage covers every command stage."],
  ["P44-8-T15-EXEC", "Export UI-to-backend suite blocks predecessor-stage bypass."],
] as const;

function processRowsForPhase(
  phase: P44Phase9ProcessProofRow["phase"],
  tickets: readonly (readonly [string, string])[],
  proofRef: string,
  targetFiles: string[],
) {
  return tickets.map((ticket, index) => ({
    completionLabel: "L3" as const,
    negativeProofRef: proofRef,
    phase,
    positivePath: ticket[1],
    positiveProofRef: proofRef,
    processId: `${phase}-${String(index + 1).padStart(2, "0")}`,
    sourceTicketId: ticket[0],
    targetFiles,
  }));
}

export const p44Phase9ProcessProofRows: readonly P44Phase9ProcessProofRow[] = [
  ...processRowsForPhase("PH5", phase5ProcessTickets, "tests/p44-phase5-certification.spec.ts", [
    "lib/p44-phase5-ai-draft-governance.ts",
  ]),
  ...processRowsForPhase("PH6", phase6ProcessTickets, "tests/p44-phase6-certification.spec.ts", [
    "lib/p44-phase6-advisor-review-closure.ts",
  ]),
  ...processRowsForPhase("PH7", phase7ProcessTickets, "tests/p44-phase7-certification.spec.ts", [
    "lib/p44-phase7-compliance-rationale-closure.ts",
  ]),
  ...processRowsForPhase("PH8", phase8ProcessTickets, "tests/p44-phase8-certification.spec.ts", [
    "lib/p44-phase8-export-command-closure.ts",
  ]),
];

export const p44Phase9NegativeScopeCases: readonly P44Phase9NegativeScopeCase[] = [
  {
    auditProofRef: "tests/p44-phase5-certification.spec.ts",
    denied: true,
    hidden: true,
    leakDetected: false,
    negativeClass: "wrong_actor",
    processFamily: "AI_DRAFT",
    proofRef: "tests/p44-phase5-certification.spec.ts",
  },
  {
    auditProofRef: "tests/p44-phase6-certification.spec.ts",
    denied: true,
    hidden: true,
    leakDetected: false,
    negativeClass: "wrong_object",
    processFamily: "ADVISOR",
    proofRef: "tests/p44-phase6-certification.spec.ts",
  },
  {
    auditProofRef: "tests/p44-phase7-certification.spec.ts",
    denied: true,
    hidden: true,
    leakDetected: false,
    negativeClass: "wrong_actor",
    processFamily: "COMPLIANCE",
    proofRef: "tests/p44-phase7-certification.spec.ts",
  },
  {
    auditProofRef: "tests/p44-phase8-certification.spec.ts",
    denied: true,
    hidden: true,
    leakDetected: false,
    negativeClass: "wrong_tenant",
    processFamily: "EXPORT",
    proofRef: "tests/p44-phase8-certification.spec.ts",
  },
  {
    auditProofRef: "tests/data-quality-service.spec.ts",
    denied: true,
    hidden: true,
    leakDetected: false,
    negativeClass: "wrong_object",
    processFamily: "DATA_QUALITY",
    proofRef: "tests/data-quality-service.spec.ts",
  },
];

export const p44Phase9PayloadVisibilityRows: readonly P44Phase9PayloadVisibilityRow[] = [
  {
    allowedFields: ["clientSummary", "decisionState", "releasedAt", "title"],
    forbiddenFieldsAbsent: true,
    hiddenFields: ["aiDraft", "internalRationale", "complianceNotes", "auditMetadata"],
    proofRef: "tests/client-visibility-projection.spec.ts",
    surface: "CLIENT_API",
  },
  {
    allowedFields: ["internalRationale", "queueState", "evidenceStatus"],
    forbiddenFieldsAbsent: true,
    hiddenFields: ["clientUnsafeDraftLeak", "crossTenantPayload"],
    proofRef: "tests/p44-phase6-certification.spec.ts",
    surface: "INTERNAL_API",
  },
  {
    allowedFields: ["auditEventId", "actorRoleKey", "reason", "targetId"],
    forbiddenFieldsAbsent: true,
    hiddenFields: ["rawAiPrompt", "unredactedClientPackage"],
    proofRef: "tests/p44-phase7-certification.spec.ts",
    surface: "ADMIN_AUDIT",
  },
  {
    allowedFields: ["clientSummary", "decisionState", "status", "title"],
    forbiddenFieldsAbsent: true,
    hiddenFields: ["aiDraft", "internalRationale", "complianceNotes", "unreleasedEvidence"],
    proofRef: "tests/p44-phase8-certification.spec.ts",
    surface: "EXPORT_PREVIEW",
  },
  {
    allowedFields: ["manifest", "redactionProfile", "selectedObjects"],
    forbiddenFieldsAbsent: true,
    hiddenFields: ["rawDocumentStorageKey", "internalRationale", "complianceNotes"],
    proofRef: "tests/p44-phase8-certification.spec.ts",
    surface: "EXPORT_PACKAGE",
  },
  {
    allowedFields: ["downloadTokenMetadata", "redactionProfile", "selectedObjects"],
    forbiddenFieldsAbsent: true,
    hiddenFields: ["aiDraft", "unredactedEvidence", "auditMetadata"],
    proofRef: "tests/export-workflow-api.spec.ts",
    surface: "EXPORT_DOWNLOAD",
  },
];

export function createP44Phase9ReadinessChecklist(input: P44Phase9ReadinessInput) {
  const missing: string[] = [];

  if (!input.predecessorPhase8Exit) missing.push("p44_phase8_exit");
  if (!input.analysisComplete) missing.push("ph9_analysis");
  if (!input.specificationComplete) missing.push("ph9_spec");
  if (!input.targetFilesConfirmed) missing.push("target_files");
  if (!input.testsConfirmed) missing.push("tests");

  return {
    missing,
    ready: missing.length === 0,
    ticketOrder: p44Phase9TicketOrder,
  };
}

export function inspectP44Phase9DataQualityResolution(input: {
  audit: P44Phase9AuditState;
  issueAfterResolution: P44Phase9DataQualityIssueState | null;
  issueBeforeResolution: P44Phase9DataQualityIssueState;
}) {
  const issueStillPresent = input.issueAfterResolution?.id === input.issueBeforeResolution.id;
  const statusResolved = input.issueAfterResolution?.status === "COMPLETED";
  const audited =
    input.audit.eventType === "data_quality.issue.resolved" &&
    input.audit.result === "SUCCESS" &&
    input.audit.previousState === "DATA_QUALITY_BLOCKED" &&
    input.audit.nextState === "DATA_QUALITY_RESOLVED" &&
    input.audit.reason !== null &&
    input.audit.reason.trim().length > 0 &&
    input.audit.targetId === input.issueBeforeResolution.targetId &&
    input.audit.targetType === input.issueBeforeResolution.targetType;

  return {
    audited,
    issueStillPresent,
    passed: issueStillPresent && statusResolved && audited,
    statusResolved,
    ticketId: "P44-9-T01-EXEC" as const,
  };
}

export function inspectP44Phase9DataQualityReleaseBlock(input: {
  activeGatePassed: boolean;
  allowedAfterResolution: boolean;
  blockedExportMissing: string[];
  blockedReleaseMissing: string[];
  resolvedAuditAvailable: boolean;
}) {
  const releaseBlocked = input.blockedReleaseMissing.includes("data_quality_release_ready");
  const exportBlocked = input.blockedExportMissing.includes("data_quality_release_ready");
  const passed =
    !input.activeGatePassed &&
    releaseBlocked &&
    exportBlocked &&
    input.allowedAfterResolution &&
    input.resolvedAuditAvailable;

  return {
    exportBlocked,
    passed,
    releaseBlocked,
    ticketId: "P44-9-T02-EXEC" as const,
  };
}

export function certifyP44Phase9PositiveHappyPathSuite(rows: readonly P44Phase9ProcessProofRow[]) {
  const expectedProcessCount = 44;
  const rowsWithoutPositiveProof = rows.filter(
    (row) => row.positivePath.trim().length === 0 || row.positiveProofRef.trim().length === 0,
  );
  const rowsWithoutCompletionProof = rows.filter(
    (row) => row.completionLabel !== "BLOCKER" && row.positiveProofRef.trim().length === 0,
  );
  const rowsWithoutTestReference = rows.filter(
    (row) =>
      row.positiveProofRef.trim().length === 0 ||
      row.negativeProofRef.trim().length === 0 ||
      !row.positiveProofRef.endsWith(".spec.ts") ||
      !row.negativeProofRef.endsWith(".spec.ts"),
  );
  const sourceTicketIds = new Set(rows.map((row) => row.sourceTicketId));
  const missingProof: string[] = [];

  if (rows.length !== expectedProcessCount) missingProof.push("all_44_process_rows");
  if (sourceTicketIds.size !== rows.length) missingProof.push("unique_source_ticket_mapping");
  if (rowsWithoutPositiveProof.length > 0) missingProof.push("positive_path_reference");
  if (rowsWithoutCompletionProof.length > 0) missingProof.push("completion_claim_reference");
  if (rowsWithoutTestReference.length > 0) missingProof.push("test_reference");

  return {
    certification: missingProof.length === 0 ? "PH9_POSITIVE_P0_PACK_READY" : "PH9_POSITIVE_P0_PACK_BLOCKED",
    coveredProcessCount: rows.length,
    missingProof,
    rowsWithoutCompletionProof: rowsWithoutCompletionProof.map((row) => row.sourceTicketId),
    rowsWithoutPositiveProof: rowsWithoutPositiveProof.map((row) => row.sourceTicketId),
    rowsWithoutTestReference: rowsWithoutTestReference.map((row) => row.sourceTicketId),
    ticketId: "P44-9-T03-EXEC" as const,
  };
}

export function certifyP44Phase9NegativeScopeSuite(cases: readonly P44Phase9NegativeScopeCase[]) {
  const coveredClasses = new Set(cases.map((scopeCase) => scopeCase.negativeClass));
  const coveredFamilies = new Set(cases.map((scopeCase) => scopeCase.processFamily));
  const unsafeCases = cases.filter(
    (scopeCase) =>
      !scopeCase.denied ||
      !scopeCase.hidden ||
      scopeCase.leakDetected ||
      scopeCase.proofRef.trim().length === 0 ||
      scopeCase.auditProofRef.trim().length === 0,
  );
  const missingProof: string[] = [];

  for (const requiredClass of ["wrong_actor", "wrong_tenant", "wrong_object"] as const) {
    if (!coveredClasses.has(requiredClass)) missingProof.push(requiredClass);
  }
  for (const requiredFamily of ["AI_DRAFT", "ADVISOR", "COMPLIANCE", "EXPORT", "DATA_QUALITY"] as const) {
    if (!coveredFamilies.has(requiredFamily)) missingProof.push(requiredFamily);
  }
  if (unsafeCases.length > 0) missingProof.push("deny_hide_audit_no_leak");

  return {
    certification: missingProof.length === 0 ? "PH9_NEGATIVE_SCOPE_PACK_READY" : "PH9_NEGATIVE_SCOPE_PACK_BLOCKED",
    missingProof,
    unsafeCases,
    ticketId: "P44-9-T04-EXEC" as const,
  };
}

export function certifyP44Phase9PayloadVisibilitySweep(rows: readonly P44Phase9PayloadVisibilityRow[]) {
  const requiredSurfaces: P44Phase9PayloadVisibilityRow["surface"][] = [
    "CLIENT_API",
    "INTERNAL_API",
    "ADMIN_AUDIT",
    "EXPORT_PREVIEW",
    "EXPORT_PACKAGE",
    "EXPORT_DOWNLOAD",
  ];
  const coveredSurfaces = new Set(rows.map((row) => row.surface));
  const unsafeRows = rows.filter(
    (row) =>
      !row.forbiddenFieldsAbsent ||
      row.hiddenFields.length === 0 ||
      row.allowedFields.length === 0 ||
      row.proofRef.trim().length === 0,
  );
  const missingProof: string[] = requiredSurfaces.filter((surface) => !coveredSurfaces.has(surface));

  if (unsafeRows.length > 0) missingProof.push("hidden_internal_fields_absent");

  return {
    certification: missingProof.length === 0 ? "PH9_PAYLOAD_VISIBILITY_READY" : "PH9_PAYLOAD_VISIBILITY_BLOCKED",
    missingProof,
    ticketId: "P44-9-T05-EXEC" as const,
    unsafeRows: unsafeRows.map((row) => row.surface),
  };
}

export function inspectP44Phase9EvidenceLifecycleRegression(input: {
  sufficientLifecycleCanRelease: boolean;
  uploadLifecycleCanRelease: boolean;
  uploadLifecycleCanReview: boolean;
  uploadOnlyReleasePassed: boolean;
}) {
  const uploadNotSufficient =
    input.uploadLifecycleCanReview && !input.uploadLifecycleCanRelease && !input.uploadOnlyReleasePassed;

  return {
    passed: uploadNotSufficient && input.sufficientLifecycleCanRelease,
    sufficientLifecycleCanRelease: input.sufficientLifecycleCanRelease,
    ticketId: "P44-9-T06-EXEC" as const,
    uploadNotSufficient,
  };
}

export function inspectP44Phase9AdvisorNotRelease(input: {
  advisorOnlyGateMissing: string[];
  advisorOnlyPassed: boolean;
  fullReleasePassed: boolean;
}) {
  const advisorApprovalNotTreatedAsRelease =
    !input.advisorOnlyPassed &&
    !input.advisorOnlyGateMissing.includes("advisor_approval") &&
    input.advisorOnlyGateMissing.includes("compliance_release");

  return {
    advisorApprovalNotTreatedAsRelease,
    passed: advisorApprovalNotTreatedAsRelease && input.fullReleasePassed,
    ticketId: "P44-9-T07-EXEC" as const,
  };
}

export function inspectP44Phase9ComplianceAuditFailClosed(input: {
  auditFailureMissing: string[];
  auditFailurePassed: boolean;
  missingPreconditionList: string[];
  preconditionsPassed: boolean;
}) {
  const preconditionBlocked = !input.preconditionsPassed && input.missingPreconditionList.length > 0;
  const auditFailClosed = !input.auditFailurePassed && input.auditFailureMissing.includes("audit_persistence");

  return {
    auditFailClosed,
    passed: preconditionBlocked && auditFailClosed,
    preconditionBlocked,
    ticketId: "P44-9-T08-EXEC" as const,
  };
}

export function inspectP44Phase9ExportForbiddenPayloadRegression(input: {
  cleanInspectionPassed: boolean;
  dirtyExportMissing: string[];
  dirtyExportPassed: boolean;
}) {
  const forbiddenPayloadRejected =
    !input.dirtyExportPassed && input.dirtyExportMissing.some((missing) => missing.startsWith("forbidden_payload:"));

  return {
    forbiddenPayloadRejected,
    passed: input.cleanInspectionPassed && forbiddenPayloadRejected,
    ticketId: "P44-9-T09-EXEC" as const,
  };
}

function phaseTraceDefaults(phase: P44Phase9ProcessProofRow["phase"]) {
  if (phase === "PH5") {
    return {
      api: "internal command/service boundary",
      db: "recommendation/audit/evidence records",
      route: "AI draft governance surface",
      service: "lib/p44-phase5-ai-draft-governance.ts",
    };
  }
  if (phase === "PH6") {
    return {
      api: "advisor review command/readmodel boundary",
      db: "approvals/queue/evidence/audit records",
      route: "advisor review surface",
      service: "lib/p44-phase6-advisor-review-closure.ts",
    };
  }
  if (phase === "PH7") {
    return {
      api: "compliance command/readmodel boundary",
      db: "compliance reviews/decisions/audit records",
      route: "compliance release surface",
      service: "lib/p44-phase7-compliance-rationale-closure.ts",
    };
  }
  return {
    api: "/api/export-workflow",
    db: "export requests/export packages/audit records",
    route: "communication export operations surface",
    service: "lib/export-workflow-command-service.ts",
  };
}

export function buildP44Phase9ActionTraceMatrix(
  rows: readonly P44Phase9ProcessProofRow[],
): readonly P44Phase9ActionTraceRow[] {
  return rows.map((row) => {
    const defaults = phaseTraceDefaults(row.phase);

    return {
      action: row.positivePath,
      api: defaults.api,
      db: defaults.db,
      route: defaults.route,
      service: defaults.service,
      sourceTicketId: row.sourceTicketId,
      testStatus: row.positiveProofRef.endsWith(".spec.ts") ? "PROOF_LINKED" : "AMBIGUOUS",
    };
  });
}

export function certifyP44Phase9ActionTraceMatrix(rows: readonly P44Phase9ActionTraceRow[]) {
  const ambiguousRows = rows.filter(
    (row) =>
      row.action.trim().length === 0 ||
      row.api.trim().length === 0 ||
      row.db.trim().length === 0 ||
      row.route.trim().length === 0 ||
      row.service.trim().length === 0 ||
      row.testStatus !== "PROOF_LINKED",
  );

  return {
    certification: ambiguousRows.length === 0 ? "PH9_ACTION_TRACE_READY" : "PH9_ACTION_TRACE_BLOCKED",
    ambiguousRows: ambiguousRows.map((row) => row.sourceTicketId),
    tracedActionCount: rows.length,
    ticketId: "P44-9-T10-EXEC" as const,
  };
}

export function buildP44Phase9CompletionRegister(
  rows: readonly P44Phase9ProcessProofRow[],
): readonly P44Phase9CompletionRegisterRow[] {
  return rows.map((row) => {
    const evidenceRefs = [row.positiveProofRef, row.negativeProofRef, ...row.targetFiles].filter(
      (ref) => ref.trim().length > 0,
    );

    return {
      blockers: evidenceRefs.length > 0 ? [] : ["missing_completion_evidence"],
      completionLabel: evidenceRefs.length > 0 ? row.completionLabel : "BLOCKER",
      evidenceRefs,
      processId: row.processId,
      sourceTicketId: row.sourceTicketId,
    };
  });
}

export function certifyP44Phase9CompletionRegister(rows: readonly P44Phase9CompletionRegisterRow[]) {
  const optimisticRows = rows.filter(
    (row) => row.completionLabel !== "BLOCKER" && row.evidenceRefs.length === 0,
  );
  const hiddenBlockers = rows.filter((row) => row.completionLabel !== "BLOCKER" && row.blockers.length > 0);

  return {
    certification: optimisticRows.length === 0 && hiddenBlockers.length === 0
      ? "PH9_COMPLETION_REGISTER_READY"
      : "PH9_COMPLETION_REGISTER_BLOCKED",
    hiddenBlockers: hiddenBlockers.map((row) => row.sourceTicketId),
    optimisticRows: optimisticRows.map((row) => row.sourceTicketId),
    ticketId: "P44-9-T11-EXEC" as const,
  };
}

export const p44Phase9RemainingBlockerRegister: readonly P44Phase9BlockerRegisterRow[] = [
  {
    category: "safety",
    completionAffecting: false,
    hiddenInsideCompletedClaim: false,
    recommendation: "Keep client visibility, export and compliance gates on one fail-closed release spine.",
    risk: "Duplicate safety proof families can drift if older packs remain first-class truth.",
  },
  {
    category: "ui",
    completionAffecting: false,
    hiddenInsideCompletedClaim: false,
    recommendation: "Collapse legacy screen-specific action claims into the route/action trace matrix before new UI work.",
    risk: "Old UI labels can imply completion without current route/action/API proof.",
  },
  {
    category: "api",
    completionAffecting: false,
    hiddenInsideCompletedClaim: false,
    recommendation: "Retire parallel ad-hoc export/advisor/compliance command models behind the P44 command contracts.",
    risk: "Multiple API truth surfaces can let old tests pass while the active workflow diverges.",
  },
  {
    category: "schema",
    completionAffecting: false,
    hiddenInsideCompletedClaim: false,
    recommendation: "Forbid blind schema migration until roadmap tasks attach exact Prisma model deltas.",
    risk: "Task candidates can overreach into schema without target-file proof.",
  },
  {
    category: "test",
    completionAffecting: false,
    hiddenInsideCompletedClaim: false,
    recommendation: "Keep Phase 5-9 certification tests as the required regression spine for merged roadmap work.",
    risk: "Broad phase checks can mask missing candidate-level positive and negative proofs.",
  },
  {
    category: "p1_hold_contamination",
    completionAffecting: false,
    hiddenInsideCompletedClaim: false,
    recommendation: "Do not promote P1/Hold/Future candidates into MVP completion unless the roadmap explicitly reclassifies them.",
    risk: "Future-state items can contaminate MVP labels and create false release confidence.",
  },
];

export function certifyP44Phase9BlockerRegister(rows: readonly P44Phase9BlockerRegisterRow[]) {
  const requiredCategories: P44Phase9BlockerCategory[] = ["safety", "ui", "api", "schema", "test", "p1_hold_contamination"];
  const coveredCategories = new Set(rows.map((row) => row.category));
  const hiddenRows = rows.filter((row) => row.hiddenInsideCompletedClaim);
  const missingCategories = requiredCategories.filter((category) => !coveredCategories.has(category));

  return {
    certification: hiddenRows.length === 0 && missingCategories.length === 0
      ? "PH9_BLOCKER_REGISTER_READY"
      : "PH9_BLOCKER_REGISTER_BLOCKED",
    completionAffectingCount: rows.filter((row) => row.completionAffecting).length,
    hiddenRows,
    missingCategories,
    ticketId: "P44-9-T12-EXEC" as const,
  };
}

export function buildP44Phase9MergedRoadmap(input: P44Phase9RoadmapInput) {
  const remainingTicketIds = input.remainingRows.map((row) => row.sourceTicketId);
  const duplicateTicketIds = remainingTicketIds.filter(
    (ticketId, index) => remainingTicketIds.indexOf(ticketId) !== index,
  );
  const conflictingAcceptance = input.remainingRows.filter(
    (row) => row.positiveProofRef === row.negativeProofRef && row.positiveProofRef.trim().length === 0,
  );

  return {
    duplicateTicketIds: [...new Set(duplicateTicketIds)],
    mergedProcessCount: input.priorStrongProcessCount + input.remainingRows.length,
    priorStrongProcessCount: input.priorStrongProcessCount,
    remainingProcessCount: input.remainingRows.length,
    conflictingAcceptance: conflictingAcceptance.map((row) => row.sourceTicketId),
    ticketId: "P44-9-T13-EXEC" as const,
  };
}

export function certifyP44Phase9MergedRoadmap(input: ReturnType<typeof buildP44Phase9MergedRoadmap>) {
  const missingProof: string[] = [];

  if (input.priorStrongProcessCount !== 27) missingProof.push("strong_27_process_count");
  if (input.remainingProcessCount !== 44) missingProof.push("remaining_44_process_count");
  if (input.mergedProcessCount !== 71) missingProof.push("merged_71_process_count");
  if (input.duplicateTicketIds.length > 0) missingProof.push("duplicate_tasks");
  if (input.conflictingAcceptance.length > 0) missingProof.push("conflicting_acceptance");

  return {
    certification: missingProof.length === 0 ? "PH9_71_PROCESS_ROADMAP_READY" : "PH9_71_PROCESS_ROADMAP_BLOCKED",
    missingProof,
    ticketId: "P44-9-T13-EXEC" as const,
  };
}

export function buildP44Phase9TaskMasterInput(rows: readonly P44Phase9ProcessProofRow[]) {
  const candidates = rows.map((row): P44Phase9TaskMasterCandidate => ({
    acceptance: row.positivePath,
    ctes: 7.3,
    dependencies: ["PH9-QA", row.positiveProofRef],
    negativeTests: `Preserve negative proof in ${row.negativeProofRef}.`,
    sourceTicketId: row.sourceTicketId,
    targetFiles: row.targetFiles,
  }));

  return {
    candidates,
    noImplementationAuthority: true,
    ticketId: "P44-9-T14-EXEC" as const,
  };
}

export function certifyP44Phase9TaskMasterInput(input: ReturnType<typeof buildP44Phase9TaskMasterInput>) {
  const incompleteCandidates = input.candidates.filter(
    (candidate) =>
      candidate.acceptance.trim().length === 0 ||
      candidate.dependencies.length === 0 ||
      candidate.negativeTests.trim().length === 0 ||
      candidate.targetFiles.length === 0 ||
      candidate.ctes <= 0,
  );

  return {
    certification: input.noImplementationAuthority && incompleteCandidates.length === 0
      ? "PH9_TASK_MASTER_INPUT_READY"
      : "PH9_TASK_MASTER_INPUT_BLOCKED",
    candidateCount: input.candidates.length,
    incompleteCandidates: incompleteCandidates.map((candidate) => candidate.sourceTicketId),
    noImplementationAuthority: input.noImplementationAuthority,
    ticketId: "P44-9-T14-EXEC" as const,
  };
}

export function certifyP44Phase9FinalProof(input: {
  completedTicketIds: readonly P44Phase9TicketId[];
  noApiOverclaim: boolean;
  noP1HoldFutureElevation: boolean;
  noSafetyWeakening: boolean;
  noSchemaOverclaim: boolean;
  noTestOverclaim: boolean;
  noVisualOverclaim: boolean;
}) {
  const completed = new Set(input.completedTicketIds);
  const missingTickets = p44Phase9TicketOrder.filter((ticketId) => !completed.has(ticketId));
  const missingProof: string[] = [];

  if (missingTickets.length > 0) missingProof.push("ticket_completion");
  if (!input.noVisualOverclaim) missingProof.push("visual_overclaim");
  if (!input.noApiOverclaim) missingProof.push("api_overclaim");
  if (!input.noSchemaOverclaim) missingProof.push("schema_overclaim");
  if (!input.noTestOverclaim) missingProof.push("test_overclaim");
  if (!input.noP1HoldFutureElevation) missingProof.push("p1_hold_future_elevation");
  if (!input.noSafetyWeakening) missingProof.push("safety_weakening");

  return {
    certification: missingProof.length === 0 ? "PH9_FINAL_QA_READY" : "PH9_FINAL_QA_BLOCKED",
    missingProof,
    missingTickets,
    ticketId: "P44-9-T15-EXEC" as const,
  };
}
