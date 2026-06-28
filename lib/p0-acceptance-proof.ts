export type P0ProofStatus = "mapped" | "explicit_blocker";

export type P0AcceptanceProofEntry = {
  foundationIds: string[];
  negativeProof: string[];
  nonClaims: string[];
  positiveProof: string[];
  processId: string;
  processName: string;
  status: P0ProofStatus;
};

export const p0BusinessProcessUniverseReference = {
  artifactName: "ALPHAVEST_DETAILED_BUSINESS_PROCESS_SPECIFICATION_P0_ONLY.json",
  path: "docs/00-current/ALPHAVEST_DETAILED_BUSINESS_PROCESS_SPECIFICATION_P0_ONLY.json",
  referenceKey: "universe:p0-business-process-specification",
  status: "P0_PROCESS_DETAIL_SPECIFICATION_ACCEPTED_AS_FILTERED_VIEW",
  use: "Planning and traceability reference only; not implementation authority.",
} as const;

export const p0ApiRouteUniverse = [
  "app/api/admin-tenants/route.ts",
  "app/api/advice-release-history/actions/route.ts",
  "app/api/advisor-review/actions/route.ts",
  "app/api/audit-events/route.ts",
  "app/api/auth/dummy/route.ts",
  "app/api/auth/logout/route.ts",
  "app/api/auth/mfa/verify/route.ts",
  "app/api/auth/provider-login/route.ts",
  "app/api/auth/providers/route.ts",
  "app/api/current-user/route.ts",
  "app/api/dashboard-metrics/route.ts",
  "app/api/data-maintenance/actions/route.ts",
  "app/api/documents/review/route.ts",
  "app/api/documents/route.ts",
  "app/api/documents/upload/route.ts",
  "app/api/entities/route.ts",
  "app/api/export-workflow/route.ts",
  "app/api/family-members/route.ts",
  "app/api/global-search/route.ts",
  "app/api/ops-sla/route.ts",
  "app/api/platform-admin/actions/route.ts",
  "app/api/processes/[id]/commands/route.ts",
  "app/api/processes/[id]/route.ts",
  "app/api/processes/route.ts",
  "app/api/profile/route.ts",
  "app/api/recommendation-review-workflow/route.ts",
  "app/api/review-monitoring/actions/route.ts",
  "app/api/review-monitoring/route.ts",
  "app/api/tenant-governance/actions/route.ts",
] as const;

export const p0RouteUiStateObligations = [
  {
    obligation: "client visibility fail-closed states",
    proof: "tests/ui-state-boundaries.spec.ts",
    routes: ["/client/home", "/mobile", "/decisions/demo/success"],
  },
  {
    obligation: "document upload is separate from evidence sufficiency",
    proof: "tests/ui-state-boundaries.spec.ts",
    routes: ["/documents/upload"],
  },
  {
    obligation: "export permission, redaction, preview, approval, download and share stay separated",
    proof: "tests/ui-state-boundaries.spec.ts",
    routes: ["/export/demo/scope", "/export/demo/preview", "/export/demo/download"],
  },
  {
    obligation: "process command failures do not advance state without persisted audit proof",
    proof: "tests/process-runtime-db-api.spec.ts",
    routes: ["/api/processes", "/api/processes/:id/commands"],
  },
] as const;

export const p0AcceptanceProofMap: P0AcceptanceProofEntry[] = [
  {
    foundationIds: ["FND-001", "FND-002", "FND-003", "FND-008", "FND-009", "FND-010", "FND-011"],
    negativeProof: [
      "tests/process-runtime-db-api.spec.ts::missing JWT fails closed",
      "tests/process-runtime-db-api.spec.ts::BLOCK command requires process.manage",
      "tests/client-visibility-proof.spec.ts",
      "tests/governance-non-bypass.spec.ts",
    ],
    nonClaims: [
      "No production auth provider claim.",
      "No client visibility before compliance release.",
      "No process completion claim from route or card visibility alone.",
    ],
    positiveProof: [
      "tests/process-runtime-db-api.spec.ts::persisted process instances and command history",
      "tests/process-runtime-backbone.spec.ts::process state transitions",
      "tests/schema-alignment.spec.ts::Process Runtime Backbone schema spine",
    ],
    processId: "BP-001",
    processName: "Client relationship intake",
    status: "mapped",
  },
  {
    foundationIds: ["FND-005", "FND-009", "FND-011"],
    negativeProof: [
      "tests/document-upload-api.spec.ts::rejects invalid document tenant queries",
      "tests/evidence-review-api.spec.ts::denies analyst evidence sufficiency acceptance",
      "tests/process-runtime-db-api.spec.ts::legacy runtime tables are absent",
    ],
    nonClaims: [
      "Upload success is not evidence sufficiency.",
      "Document review does not release client visibility by itself.",
    ],
    positiveProof: [
      "tests/document-upload-api.spec.ts::stores multipart document bytes",
      "tests/evidence-review-api.spec.ts::lets compliance accept reviewed scoped evidence",
      "tests/process-runtime-db-api.spec.ts::process-backed sufficiency decisions",
    ],
    processId: "BP-024",
    processName: "Client document upload",
    status: "mapped",
  },
  {
    foundationIds: ["FND-006", "FND-007", "FND-008", "FND-010"],
    negativeProof: [
      "tests/recommendation-review-workflow-api.spec.ts::analyst rejects unsupported claim",
      "tests/client-visibility-proof.spec.ts",
      "tests/file-export-realism.spec.ts",
    ],
    nonClaims: ["No production AI integration.", "No autonomous advice execution."],
    positiveProof: [
      "tests/recommendation-review-workflow-api.spec.ts::submit review persists analyst review state",
      "tests/process-runtime-backbone.spec.ts::P0 matrix-backed process registry",
    ],
    processId: "BP-046",
    processName: "Rebuild with evidence",
    status: "mapped",
  },
  {
    foundationIds: ["FND-004", "FND-011"],
    negativeProof: [
      "tests/governance-non-bypass.spec.ts",
      "tests/process-runtime-db-api.spec.ts::process command requires current-user JWT",
    ],
    nonClaims: [
      "Admin route access does not imply release, evidence sufficiency, export or client-visibility authority.",
    ],
    positiveProof: ["tests/governance-non-bypass.spec.ts::allows governance administration"],
    processId: "BP-020",
    processName: "Admin non-bypass enforcement",
    status: "mapped",
  },
  {
    foundationIds: ["FND-012", "FND-010", "FND-011"],
    negativeProof: ["tests/file-export-realism.spec.ts", "tests/phase8-export-workflow-api.spec.ts"],
    nonClaims: [
      "Generated package remains metadata-only.",
      "No production binary ZIP delivery claim.",
      "No production external share-link authorization claim.",
    ],
    positiveProof: ["tests/file-export-realism.spec.ts", "tests/phase8-export-workflow-api.spec.ts"],
    processId: "BP-088",
    processName: "Export approval",
    status: "mapped",
  },
  {
    foundationIds: ["FND-001", "FND-002", "FND-003", "FND-010"],
    negativeProof: ["tests/providerless-scope.spec.ts", "tests/p0-api-contract.spec.ts"],
    nonClaims: [
      "Providerless demo session is not production authentication.",
      "Route shell access is not payload authorization.",
    ],
    positiveProof: ["tests/providerless-scope.spec.ts", "tests/permission-engine.spec.ts"],
    processId: "BP-017",
    processName: "Object-scope evaluation",
    status: "mapped",
  },
  {
    foundationIds: ["FND-013"],
    negativeProof: ["tests/data-quality-service.spec.ts", "tests/process-runtime-db-api.spec.ts::BLOCK command audit proof"],
    nonClaims: ["Data quality remains a support-hardening gate, not advice execution."],
    positiveProof: ["tests/data-quality-service.spec.ts", "tests/review-monitoring-service.spec.ts"],
    processId: "BP-099",
    processName: "Data quality block",
    status: "mapped",
  },
];

export function p0AcceptanceProofGaps(entries = p0AcceptanceProofMap) {
  return entries.filter((entry) => {
    if (entry.status === "explicit_blocker") {
      return entry.nonClaims.length === 0 || entry.negativeProof.length === 0;
    }

    return entry.positiveProof.length === 0 || entry.negativeProof.length === 0 || entry.nonClaims.length === 0;
  });
}

export function p0MappedProcessIds(entries = p0AcceptanceProofMap) {
  return entries.filter((entry) => entry.status === "mapped").map((entry) => entry.processId).sort();
}
