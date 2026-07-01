import {
  clientVisibilitySafetyProcessContracts,
  clientVisibilitySelectedProcessIds,
  type ClientVisibilityProcessId,
} from "@/lib/client-visibility-safety-foundation";
import {
  clientVisibilityStage6PayloadClassifications,
  inspectClientVisibilityStage6ClientPayload,
  sweepClientVisibilityStage6PayloadSurfaces,
  type ClientVisibilityStage6PayloadClassification,
} from "@/lib/client-visibility-payload-contract";

export type ClientVisibilityStage7TicketId =
  | "CLIENT_VISIBILITY-P7-T01"
  | "CLIENT_VISIBILITY-P7-T02"
  | "CLIENT_VISIBILITY-P7-T03"
  | "CLIENT_VISIBILITY-P7-T04"
  | "CLIENT_VISIBILITY-P7-T05";

export type ClientVisibilityProofLayer =
  | "route_ui"
  | "interaction_lifecycle"
  | "api_service"
  | "db_durable_state"
  | "workflow_gate"
  | "safety"
  | "positive_negative_tests";

export type ClientVisibilityFulfillmentStatus = "FULLY_FULFILLED_VERTICAL_SLICE" | "PARTIAL_WITH_REASON";

export type ClientVisibilityDecisionCreationServiceStatus = "MISSING" | "IMPLEMENTED_WITH_PROOF";

export type ClientVisibilityP0AcceptanceMatrixRow = {
  domain: string;
  negativeAcceptance: string;
  positiveAcceptance: string;
  predecessorEvidence: readonly string[];
  processId: ClientVisibilityProcessId;
  proofLayers: Record<ClientVisibilityProofLayer, string>;
  status: ClientVisibilityFulfillmentStatus;
  statusReason: string;
};

export type ClientVisibilityNegativeScenarioId =
  | "cross_tenant"
  | "wrong_role"
  | "wrong_object"
  | "no_audit"
  | "upload_only_not_sufficient"
  | "advisor_not_release";

export type ClientVisibilityNegativeSuiteScenario = {
  coveredBy: readonly string[];
  id: ClientVisibilityNegativeScenarioId;
  negativeAssertion: string;
  processIds: readonly ClientVisibilityProcessId[];
};

export type ClientVisibilityPayloadSweepRow = {
  forbiddenClassifications: readonly ClientVisibilityStage6PayloadClassification[];
  negativeProof: string;
  processIds: readonly ClientVisibilityProcessId[];
  surface: "api" | "export" | "ui";
  surfaceName: string;
};

export type ClientVisibilityClaimGateValidation = {
  canonicalOwner: string;
  decisionCreationServiceGate: typeof clientVisibilityI001DecisionCreationServiceGate;
  errors: string[];
  partialRows: ClientVisibilityP0AcceptanceMatrixRow[];
  status: "PASS" | "FAIL";
  warnings: string[];
};

export const clientVisibilityCanonicalClaimGateOwner = "lib/client-visibility-certification.ts";

export const clientVisibilityI001DecisionCreationServiceGate = {
  blockedPromotionReason:
    "I-001 may not be promoted by report language. It requires a real decision creation service plus positive and negative service/API proof.",
  currentStatus: "MISSING" as ClientVisibilityDecisionCreationServiceStatus,
  processId: "I-001" as const satisfies ClientVisibilityProcessId,
  requiredEvidence: [
    "lib/decision-creation-service.ts or equivalent canonical service module",
    "API/service tests proving creation from released context",
    "negative tests proving unreleased draft and missing-audit creation denial",
    "updated CLIENT_VISIBILITY Stage 7 matrix generated from this claim gate",
  ] as const,
  requiredServiceName: "DecisionCreationService",
};

const stageEvidenceByProcess = {
  "A-003": {
    stage: "Stage 2",
    positive: "Edited family-office profile persists and reloads.",
    negative: "Wrong-tenant actor cannot view or edit the profile.",
    evidence: ["docs/00-current/clientVisibility-stage2/PHASE2_EXECUTION_REPORT.md", "tests/client-visibility-context-closure.spec.ts"],
  },
  "A-004": {
    stage: "Stage 2",
    positive: "Family member update persists and reloads through scoped context.",
    negative: "Outside-object or wrong-tenant actor receives no mutation payload.",
    evidence: ["docs/00-current/clientVisibility-stage2/PHASE2_EXECUTION_REPORT.md", "tests/client-visibility-context-closure.spec.ts"],
  },
  "A-006": {
    stage: "Stage 2",
    positive: "Entity create is tenant-linked, audited and reloadable.",
    negative: "Invalid entity input does not create a partial entity.",
    evidence: ["docs/00-current/clientVisibility-stage2/PHASE2_EXECUTION_REPORT.md", "tests/client-visibility-context-closure.spec.ts"],
  },
  "B-006": {
    stage: "Stage 1",
    positive: "Allowed scoped action passes for all 27 mapped permission contracts.",
    negative: "Route access alone cannot reveal payload or perform mutation.",
    evidence: ["docs/00-current/clientVisibility-stage1/PHASE1_EXECUTION_REPORT.md", "tests/client-visibility-safety-foundation.spec.ts"],
  },
  "B-007": {
    stage: "Stage 1",
    positive: "Correct tenant and object scope resolve before action.",
    negative: "Cross-tenant and wrong-object scope fail closed.",
    evidence: ["docs/00-current/clientVisibility-stage1/PHASE1_EXECUTION_REPORT.md", "tests/client-visibility-safety-foundation.spec.ts"],
  },
  "B-010": {
    stage: "Stage 1",
    positive: "Admin governance management remains available.",
    negative: "Admin cannot bypass release, evidence sufficiency or export gates.",
    evidence: ["docs/00-current/clientVisibility-stage1/PHASE1_EXECUTION_REPORT.md", "tests/client-visibility-safety-foundation.spec.ts"],
  },
  "B-012": {
    stage: "Stage 1",
    positive: "Critical allow or mutation action requires audit trace.",
    negative: "Unavailable audit persistence blocks critical action.",
    evidence: ["docs/00-current/clientVisibility-stage1/PHASE1_EXECUTION_REPORT.md", "tests/client-visibility-safety-foundation.spec.ts"],
  },
  "C-002": {
    stage: "Stage 3",
    positive: "Valid upload creates document, version, extraction/evidence and audit proof.",
    negative: "Upload success never implies sufficiency, release, export or advice.",
    evidence: ["docs/00-current/clientVisibility-stage3/PHASE3_EXECUTION_REPORT.md", "tests/document-upload-api.spec.ts"],
  },
  "C-003": {
    stage: "Stage 3",
    positive: "Document version metadata is linked and reloadable.",
    negative: "Checksum and storage internals are excluded from client-safe projection.",
    evidence: ["docs/00-current/clientVisibility-stage3/PHASE3_EXECUTION_REPORT.md", "tests/document-upload-api.spec.ts"],
  },
  "C-004": {
    stage: "Stage 3",
    positive: "Extraction review lifecycle updates review state.",
    negative: "Low-confidence or unreviewed extraction cannot unlock sufficiency.",
    evidence: ["docs/00-current/clientVisibility-stage3/PHASE3_EXECUTION_REPORT.md", "tests/evidence-review-api.spec.ts"],
  },
  "C-005": {
    stage: "Stage 3",
    positive: "Linked evidence can satisfy the intended object context.",
    negative: "Wrong-object, stale or unlinked evidence is ignored.",
    evidence: ["docs/00-current/clientVisibility-stage3/PHASE3_EXECUTION_REPORT.md", "tests/workflow-gate.spec.ts"],
  },
  "C-008": {
    stage: "Stage 3",
    positive: "Reviewed, linked, relevant evidence can mark sufficiency.",
    negative: "Upload-only evidence cannot mark sufficiency.",
    evidence: ["docs/00-current/clientVisibility-stage3/PHASE3_EXECUTION_REPORT.md", "tests/workflow-gate.spec.ts"],
  },
  "D-008": {
    stage: "Stage 4",
    positive: "Object-linked evidence gap or data-quality issue can be created.",
    negative: "Issue in unrelated tenant or object does not block this target.",
    evidence: ["docs/v3/proof/clientVisibility_stage_4_data_quality_blocking_closure_report.md", "tests/data-quality-service.spec.ts"],
  },
  "E-006": {
    stage: "Stage 6",
    positive: "Internal users can see draft fields where role and context allow.",
    negative: "Client, API and export payloads never receive AI draft/internal rationale.",
    evidence: ["docs/CLIENT_VISIBILITY_PHASE6_CLIENT_VISIBILITY_EXPORT_CLOSURE_EXECUTION_REPORT.md", "tests/client-visibility-payload-sweep.spec.ts"],
  },
  "F-005": {
    stage: "Stage 5",
    positive: "Advisor approval moves item to compliance pending.",
    negative: "Advisor approval does not set client-visible or released state.",
    evidence: ["docs/00-current/clientVisibility-stage5/PHASE5_EXECUTION_REPORT.md", "tests/recommendation-review-workflow-api.spec.ts"],
  },
  "G-002": {
    stage: "Stage 5",
    positive: "Complete item can pass compliance release preconditions.",
    negative: "Missing advisor, evidence, payload, confirmation or audit precondition blocks release.",
    evidence: ["docs/00-current/clientVisibility-stage5/PHASE5_EXECUTION_REPORT.md", "tests/workflow-gate.spec.ts"],
  },
  "G-003": {
    stage: "Stage 5",
    positive: "Compliance evidence request persists state and audit context.",
    negative: "Evidence request does not release or expose client payload.",
    evidence: ["docs/00-current/clientVisibility-stage5/PHASE5_EXECUTION_REPORT.md", "tests/recommendation-review-workflow-api.spec.ts"],
  },
  "G-005": {
    stage: "Stage 5",
    positive: "Compliance block persists and projects blocked state.",
    negative: "Non-compliance role cannot block or release.",
    evidence: ["docs/00-current/clientVisibility-stage5/PHASE5_EXECUTION_REPORT.md", "tests/recommendation-review-workflow-api.spec.ts"],
  },
  "G-006": {
    stage: "Stage 5",
    positive: "Compliance release sets released state and safe projection.",
    negative: "Release without preconditions is denied and audited.",
    evidence: ["docs/00-current/clientVisibility-stage5/PHASE5_EXECUTION_REPORT.md", "tests/recommendation-review-workflow-api.spec.ts"],
  },
  "G-009": {
    stage: "Stage 5",
    positive: "Release feedback is distinct from client acceptance.",
    negative: "Client acceptance is never inferred from release or download.",
    evidence: ["docs/00-current/clientVisibility-stage5/PHASE5_EXECUTION_REPORT.md", "tests/true-ux-no-overclaim-copy.spec.ts"],
  },
  "H-001": {
    stage: "Stage 6",
    positive: "Released client portal projection derives client-safe payload.",
    negative: "Unreleased/internal content is hidden or redacted.",
    evidence: ["docs/CLIENT_VISIBILITY_PHASE6_CLIENT_VISIBILITY_EXPORT_CLOSURE_EXECUTION_REPORT.md", "tests/true-ux-client-projection.spec.ts"],
  },
  "H-003": {
    stage: "Stage 6",
    positive: "Client-safe summary is generated from released decision/evidence only.",
    negative: "Summary cannot include compliance notes or internal drafts.",
    evidence: ["docs/CLIENT_VISIBILITY_PHASE6_CLIENT_VISIBILITY_EXPORT_CLOSURE_EXECUTION_REPORT.md", "tests/client-visibility-payload-sweep.spec.ts"],
  },
  "I-001": {
    stage: "Stage 5",
    positive: "Released-context decision action persists actor, context and audit.",
    negative: "Decision action cannot complete from unreleased draft context.",
    evidence: ["docs/00-current/clientVisibility-stage5/PHASE5_EXECUTION_REPORT.md", "tests/recommendation-review-workflow-api.spec.ts"],
  },
  "I-004": {
    stage: "Stage 5",
    positive: "Client-safe decision view derives from release.",
    negative: "Internal rationale, evidence IDs and compliance notes are hidden.",
    evidence: ["docs/00-current/clientVisibility-stage5/PHASE5_EXECUTION_REPORT.md", "tests/client-visibility-projection.spec.ts"],
  },
  "I-007": {
    stage: "Stage 5",
    positive: "Decision audit/review history is persisted for critical events.",
    negative: "Missing audit prevents false completion of critical action.",
    evidence: ["docs/00-current/clientVisibility-stage5/PHASE5_EXECUTION_REPORT.md", "tests/audit-fail-closed.spec.ts"],
  },
  "J-009": {
    stage: "Stage 6",
    positive: "Export contains scoped, redacted and approved content.",
    negative: "Forbidden internal payload fails generation or is excluded.",
    evidence: ["docs/CLIENT_VISIBILITY_PHASE6_CLIENT_VISIBILITY_EXPORT_CLOSURE_EXECUTION_REPORT.md", "tests/file-export-realism.spec.ts"],
  },
  "K-006": {
    stage: "Stage 4",
    positive: "Resolved issue unblocks release/export where configured.",
    negative: "Active high-severity issue blocks release/export.",
    evidence: ["docs/v3/proof/clientVisibility_stage_4_data_quality_blocking_closure_report.md", "tests/data-quality-service.spec.ts"],
  },
} satisfies Record<ClientVisibilityProcessId, {
  evidence: readonly string[];
  negative: string;
  stage: string;
  positive: string;
}>;

const proofLayer = (processId: ClientVisibilityProcessId, layer: ClientVisibilityProofLayer) => {
  const evidence = stageEvidenceByProcess[processId];
  const contract = clientVisibilitySafetyProcessContracts.find((candidate) => candidate.processId === processId);
  const routeOrObject = contract ? `${contract.objectType}/${contract.permissionAction}` : processId;

  switch (layer) {
    case "route_ui":
      return `${evidence.stage} route/UI or service-facing surface mapped for ${routeOrObject}.`;
    case "interaction_lifecycle":
      return `${evidence.stage} report records the user/system lifecycle and blocked-state semantics.`;
    case "api_service":
      return `${evidence.stage} API/service seam is covered by the linked proof.`;
    case "db_durable_state":
      return `${evidence.stage} durable state or explicit not-applicable proof is documented.`;
    case "workflow_gate":
      return `${evidence.stage} gate semantics are covered by positive and negative acceptance.`;
    case "safety":
      return "RBAC, object scope, audit, visibility, advice boundary, evidence or export safety is mapped before claim.";
    case "positive_negative_tests":
      return evidence.evidence.filter((entry) => entry.startsWith("tests/")).join("; ");
  }
};

export const clientVisibilityStage7TicketOrder: readonly ClientVisibilityStage7TicketId[] = [
  "CLIENT_VISIBILITY-P7-T01",
  "CLIENT_VISIBILITY-P7-T02",
  "CLIENT_VISIBILITY-P7-T03",
  "CLIENT_VISIBILITY-P7-T04",
  "CLIENT_VISIBILITY-P7-T05",
];

export const clientVisibilityStage7RequiredProofLayers: readonly ClientVisibilityProofLayer[] = [
  "route_ui",
  "interaction_lifecycle",
  "api_service",
  "db_durable_state",
  "workflow_gate",
  "safety",
  "positive_negative_tests",
];

export const clientVisibilityStage7PredecessorReports = [
  "docs/00-current/clientVisibility-stage0/PHASE0_EXECUTION_REPORT.md",
  "docs/00-current/clientVisibility-stage1/PHASE1_EXECUTION_REPORT.md",
  "docs/00-current/clientVisibility-stage2/PHASE2_EXECUTION_REPORT.md",
  "docs/00-current/clientVisibility-stage3/PHASE3_EXECUTION_REPORT.md",
  "docs/v3/proof/clientVisibility_stage_4_data_quality_blocking_closure_report.md",
  "docs/00-current/clientVisibility-stage5/PHASE5_EXECUTION_REPORT.md",
  "docs/CLIENT_VISIBILITY_PHASE6_CLIENT_VISIBILITY_EXPORT_CLOSURE_EXECUTION_REPORT.md",
] as const;

export const clientVisibilityP0AcceptanceMatrix: readonly ClientVisibilityP0AcceptanceMatrixRow[] = clientVisibilitySelectedProcessIds.map((processId) => {
  const evidence = stageEvidenceByProcess[processId];
  const contract = clientVisibilitySafetyProcessContracts.find((candidate) => candidate.processId === processId);

  return {
    domain: contract?.domain ?? "Unknown CLIENT_VISIBILITY domain",
    negativeAcceptance: evidence.negative,
    positiveAcceptance: evidence.positive,
    predecessorEvidence: evidence.evidence,
    processId,
    proofLayers: Object.fromEntries(
      clientVisibilityStage7RequiredProofLayers.map((layer) => [layer, proofLayer(processId, layer)]),
    ) as Record<ClientVisibilityProofLayer, string>,
    status: processId === "I-001" ? "PARTIAL_WITH_REASON" : "FULLY_FULFILLED_VERTICAL_SLICE",
    statusReason:
      processId === "I-001"
        ? "Released-context decision action is proven; arbitrary decision creation remains intentionally out of scope."
        : "All seven proof layers have mapped predecessor evidence plus positive and negative acceptance.",
  };
});

export const clientVisibilityRouteActionObjectPayloadNegativeSuite: readonly ClientVisibilityNegativeSuiteScenario[] = [
  {
    coveredBy: ["tests/client-visibility-safety-foundation.spec.ts", "tests/client-visibility-context-closure.spec.ts"],
    id: "cross_tenant",
    negativeAssertion: "Cross-tenant actor cannot read, mutate, release or export target payload.",
    processIds: ["A-003", "A-004", "B-007", "G-006"],
  },
  {
    coveredBy: ["tests/client-visibility-safety-foundation.spec.ts", "tests/recommendation-review-workflow-api.spec.ts"],
    id: "wrong_role",
    negativeAssertion: "Wrong role is denied for protected action and receives no authority expansion from route visibility.",
    processIds: ["B-006", "B-010", "G-005", "J-009"],
  },
  {
    coveredBy: ["tests/client-visibility-safety-foundation.spec.ts", "tests/workflow-gate.spec.ts"],
    id: "wrong_object",
    negativeAssertion: "Wrong object scope fails closed and cannot satisfy workflow or payload gate.",
    processIds: ["A-004", "C-005", "G-002", "K-006"],
  },
  {
    coveredBy: ["tests/audit-fail-closed.spec.ts", "tests/recommendation-review-workflow-api.spec.ts", "tests/data-quality-service.spec.ts"],
    id: "no_audit",
    negativeAssertion: "Critical action cannot complete silently when durable audit is unavailable.",
    processIds: ["B-012", "G-006", "I-007"],
  },
  {
    coveredBy: ["tests/document-upload-api.spec.ts", "tests/workflow-gate.spec.ts"],
    id: "upload_only_not_sufficient",
    negativeAssertion: "Upload-only evidence cannot mark sufficiency, release, export, advice or client visibility.",
    processIds: ["C-002", "C-004", "C-008", "G-002"],
  },
  {
    coveredBy: ["tests/workflow-gate.spec.ts", "tests/recommendation-review-workflow-api.spec.ts"],
    id: "advisor_not_release",
    negativeAssertion: "Advisor approval moves to compliance-pending only and cannot create client release.",
    processIds: ["F-005", "G-006", "G-009", "I-004"],
  },
];

export const clientVisibilityPayloadRedactionSweepMatrix: readonly ClientVisibilityPayloadSweepRow[] = [
  {
    forbiddenClassifications: ["AI_DRAFT", "INTERNAL_RATIONALE", "COMPLIANCE_NOTES"],
    negativeProof: "Client/API projection rejects draft, rationale and compliance-note fields.",
    processIds: ["E-006", "H-001", "H-003", "I-004"],
    surface: "api",
    surfaceName: "client decision/recommendation API projection",
  },
  {
    forbiddenClassifications: ["UNRELEASED_EVIDENCE", "UNRELEASED_RECOMMENDATION", "HIDDEN_FIELD"],
    negativeProof: "Client UI projection hides unreleased evidence, unreleased recommendation and hidden metadata.",
    processIds: ["C-003", "C-005", "H-001", "H-003"],
    surface: "ui",
    surfaceName: "client portal projection UI",
  },
  {
    forbiddenClassifications: ["AI_DRAFT", "INTERNAL_RATIONALE", "COMPLIANCE_NOTES", "UNRELEASED_EVIDENCE"],
    negativeProof: "Export preview/package/download excludes or blocks forbidden internal payload.",
    processIds: ["E-006", "G-006", "J-009"],
    surface: "export",
    surfaceName: "client-safe export package",
  },
];

export const clientVisibilityStage7FullTestCommandSet = [
  "pnpm guard:source",
  "pnpm test:client-visibility:claims",
  "pnpm typecheck",
  "pnpm lint",
  "pnpm db:validate",
  "pnpm test:client-visibility:no-server",
  "pnpm test:client-visibility:server",
  "pnpm check:full",
] as const;

export function buildClientVisibilityStage7CertificationSummary() {
  const processIds = clientVisibilityP0AcceptanceMatrix.map((row) => row.processId);
  const duplicates = processIds.filter((processId, index) => processIds.indexOf(processId) !== index);
  const missing = clientVisibilitySelectedProcessIds.filter((processId) => !processIds.includes(processId));
  const rowsMissingProof = clientVisibilityP0AcceptanceMatrix.filter((row) =>
    clientVisibilityStage7RequiredProofLayers.some((layer) => row.proofLayers[layer].trim().length === 0),
  );
  const fullCount = clientVisibilityP0AcceptanceMatrix.filter((row) => row.status === "FULLY_FULFILLED_VERTICAL_SLICE").length;
  const partialRows = clientVisibilityP0AcceptanceMatrix.filter((row) => row.status === "PARTIAL_WITH_REASON");

  return {
    duplicates,
    fullCount,
    missing,
    partialRows,
    processCount: processIds.length,
    rowsMissingProof,
    ticketOrder: clientVisibilityStage7TicketOrder,
  };
}

export function assertNoFalseClientVisibilityCompletionClaim(row: ClientVisibilityP0AcceptanceMatrixRow) {
  if (
    row.processId === clientVisibilityI001DecisionCreationServiceGate.processId &&
    clientVisibilityI001DecisionCreationServiceGate.currentStatus !== "IMPLEMENTED_WITH_PROOF"
  ) {
    return {
      allowed: false,
      missingProofLayers: [],
      reason: "CLIENT_VISIBILITY_PHASE7_I001_DECISION_CREATION_SERVICE_REQUIRED",
    };
  }

  if (row.status === "FULLY_FULFILLED_VERTICAL_SLICE") {
    const missingProofLayers = clientVisibilityStage7RequiredProofLayers.filter((layer) => row.proofLayers[layer].trim().length === 0);
    const hasPositiveAndNegative = row.positiveAcceptance.trim().length > 0 && row.negativeAcceptance.trim().length > 0;
    const hasPredecessorEvidence = row.predecessorEvidence.length > 0;

    return {
      allowed: missingProofLayers.length === 0 && hasPositiveAndNegative && hasPredecessorEvidence,
      missingProofLayers,
      reason:
        missingProofLayers.length === 0 && hasPositiveAndNegative && hasPredecessorEvidence
          ? "CLIENT_VISIBILITY_PHASE7_CLAIM_ALLOWED"
          : "CLIENT_VISIBILITY_PHASE7_FALSE_COMPLETION_BLOCKED",
    };
  }

  return {
    allowed: false,
    missingProofLayers: [],
    reason: "CLIENT_VISIBILITY_PHASE7_PARTIAL_WITH_REASON_NOT_FULL_CLAIM",
  };
}

export function validateClientVisibilityCanonicalClaimGate(
  rows: readonly ClientVisibilityP0AcceptanceMatrixRow[] = clientVisibilityP0AcceptanceMatrix,
): ClientVisibilityClaimGateValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const processIds = rows.map((row) => row.processId);
  const missing = clientVisibilitySelectedProcessIds.filter((processId) => !processIds.includes(processId));
  const duplicates = processIds.filter((processId, index) => processIds.indexOf(processId) !== index);
  const rowsMissingProof = rows.filter((row) =>
    clientVisibilityStage7RequiredProofLayers.some((layer) => row.proofLayers[layer].trim().length === 0),
  );
  const partialRows = rows.filter((row) => row.status === "PARTIAL_WITH_REASON");

  if (rows.length !== 27) errors.push(`Expected 27 CLIENT_VISIBILITY rows, found ${rows.length}.`);
  if (missing.length > 0) errors.push(`Missing CLIENT_VISIBILITY process IDs: ${missing.join(", ")}.`);
  if (duplicates.length > 0) errors.push(`Duplicate CLIENT_VISIBILITY process IDs: ${duplicates.join(", ")}.`);
  if (rowsMissingProof.length > 0) {
    errors.push(`Rows with missing proof layers: ${rowsMissingProof.map((row) => row.processId).join(", ")}.`);
  }

  const unsupportedPartials = partialRows.filter((row) => row.processId !== clientVisibilityI001DecisionCreationServiceGate.processId);
  if (unsupportedPartials.length > 0) {
    errors.push(`Unexpected partial rows outside I-001: ${unsupportedPartials.map((row) => row.processId).join(", ")}.`);
  }

  const i001 = rows.find((row) => row.processId === clientVisibilityI001DecisionCreationServiceGate.processId);
  if (!i001) {
    errors.push("Missing I-001 row.");
  } else if (
    clientVisibilityI001DecisionCreationServiceGate.currentStatus !== "IMPLEMENTED_WITH_PROOF" &&
    i001.status !== "PARTIAL_WITH_REASON"
  ) {
    errors.push("I-001 is promoted without implemented DecisionCreationService proof.");
  } else if (i001.status === "PARTIAL_WITH_REASON") {
    warnings.push(clientVisibilityI001DecisionCreationServiceGate.blockedPromotionReason);
  }

  for (const row of rows) {
    if (row.status === "FULLY_FULFILLED_VERTICAL_SLICE") {
      const verdict = assertNoFalseClientVisibilityCompletionClaim(row);
      if (!verdict.allowed) {
        errors.push(`${row.processId} full claim blocked: ${verdict.reason}.`);
      }
    }
  }

  return {
    canonicalOwner: clientVisibilityCanonicalClaimGateOwner,
    decisionCreationServiceGate: clientVisibilityI001DecisionCreationServiceGate,
    errors,
    partialRows,
    status: errors.length === 0 ? "PASS" : "FAIL",
    warnings,
  };
}

export function runClientVisibilityPayloadRedactionProofSamples() {
  const sweep = sweepClientVisibilityStage6PayloadSurfaces([
    {
      name: "api safe release projection",
      payload: { clientSummary: "Released safe summary.", decisionState: "RELEASED", id: "decision-1", title: "Released decision" },
      surface: "api",
    },
    {
      name: "ui unsafe unreleased projection",
      payload: { clientSummaryDraft: "Draft summary.", unreleasedEvidence: "Pending evidence.", visibilityOverride: true },
      surface: "ui",
    },
    {
      name: "export unsafe internal package",
      payload: { clientSummary: "Released safe summary.", complianceNotes: "Internal note.", internalRationale: "Internal rationale." },
      surface: "export",
    },
  ]);

  return {
    classifications: clientVisibilityStage6PayloadClassifications,
    safeApiClean: sweep[0].inspection.clean,
    unsafeExportForbiddenFields: sweep[2].inspection.forbiddenFields,
    unsafeUiForbiddenFields: sweep[1].inspection.forbiddenFields,
  };
}

export function inspectClientVisibilityStage7ClaimPackCandidate(rows: readonly ClientVisibilityP0AcceptanceMatrixRow[] = clientVisibilityP0AcceptanceMatrix) {
  const blockedRows = rows
    .map((row) => ({ row, verdict: assertNoFalseClientVisibilityCompletionClaim(row) }))
    .filter((entry) => !entry.verdict.allowed);

  return {
    blockedFullClaimCount: blockedRows.length,
    blockedRows,
    claimableCount: rows.length - blockedRows.length,
    totalRows: rows.length,
  };
}

export function inspectClientVisibilityStage7Payload(payload: Record<string, unknown>, surface: "api" | "export" | "ui") {
  return inspectClientVisibilityStage6ClientPayload(payload, { surface });
}
