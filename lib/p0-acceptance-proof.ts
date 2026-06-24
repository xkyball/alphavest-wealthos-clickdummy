export type P0ProofStatus = "mapped" | "explicit_blocker";

export type P0AcceptanceProofEntry = {
  foundationIds: string[];
  journeyId: string;
  journeyName: string;
  negativeProof: string[];
  nonClaims: string[];
  positiveProof: string[];
  status: P0ProofStatus;
};

export const p0ApiRouteUniverse = [
  "app/api/admin-tenants/route.ts",
  "app/api/audit-events/route.ts",
  "app/api/auth/dummy/route.ts",
  "app/api/auth/logout/route.ts",
  "app/api/auth/mfa/verify/route.ts",
  "app/api/auth/provider-login/route.ts",
  "app/api/auth/providers/route.ts",
  "app/api/current-user/route.ts",
  "app/api/dashboard-metrics/route.ts",
  "app/api/demo-workflow/route.ts",
  "app/api/documents/review/route.ts",
  "app/api/documents/route.ts",
  "app/api/documents/upload/route.ts",
  "app/api/entities/route.ts",
  "app/api/export-workflow/route.ts",
  "app/api/family-members/route.ts",
  "app/api/global-search/route.ts",
  "app/api/ops-sla/route.ts",
  "app/api/profile/route.ts",
  "app/api/review-monitoring/route.ts",
] as const;

export const p0RouteUiStateObligations = [
  {
    obligation: "client visibility fail-closed states",
    proof: "tests/ui-state-boundaries.spec.ts",
    routes: ["/client/home", "/client/home", "/decisions/demo/success"],
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
    obligation: "audit-sensitive feedback does not claim persistence without proof",
    proof: "tests/ui-state-boundaries.spec.ts",
    routes: ["/governance/roles/:id", "/decisions/demo/success"],
  },
] as const;

export const p0AcceptanceProofMap: P0AcceptanceProofEntry[] = [
  {
    foundationIds: ["FND-001", "FND-002", "FND-003", "FND-008", "FND-009", "FND-010", "FND-011"],
    journeyId: "MJ-001",
    journeyName: "New Family Office onboarding to first client-safe decision",
    negativeProof: [
      "tests/demo-workflow-api.spec.ts::release precondition blocks",
      "tests/p0-acceptance.spec.ts::AV-SLICE-P0-03",
      "tests/p0-acceptance.spec.ts::AV-SLICE-P0-08",
      "tests/client-visibility-proof.spec.ts",
      "tests/governance-non-bypass.spec.ts",
    ],
    nonClaims: [
      "No production auth provider claim.",
      "No full 63-route human visual acceptance claim.",
      "No client visibility before compliance release.",
    ],
    positiveProof: [
      "tests/demo-workflow-api.spec.ts::typed recommendation review workflow",
      "tests/p0-acceptance.spec.ts::AV-SLICE-P0-01",
      "tests/p0-acceptance.spec.ts::AV-SLICE-P0-03",
      "tests/ui-state-boundaries.spec.ts",
    ],
    status: "mapped",
  },
  {
    foundationIds: ["FND-005", "FND-009", "FND-011"],
    journeyId: "MJ-002",
    journeyName: "Evidence missing to client upload to release",
    negativeProof: [
      "tests/document-upload-api.spec.ts::rejects invalid document tenant queries",
      "tests/document-upload-api.spec.ts::rejects upload requests with invalid role or tenant metadata",
      "tests/evidence-review-api.spec.ts::denies analyst evidence sufficiency acceptance",
      "tests/p0-acceptance.spec.ts::AV-SLICE-P0-05",
    ],
    nonClaims: [
      "Upload success is not evidence sufficiency.",
      "Document review does not release client visibility by itself.",
    ],
    positiveProof: [
      "tests/document-upload-api.spec.ts::stores multipart document bytes",
      "tests/evidence-review-api.spec.ts::lets compliance accept reviewed scoped evidence",
      "tests/p0-acceptance.spec.ts::AV-SLICE-P0-05",
    ],
    status: "mapped",
  },
  {
    foundationIds: ["FND-006", "FND-007", "FND-008", "FND-010"],
    journeyId: "MJ-003",
    journeyName: "AI draft rejected and rebuilt with evidence",
    negativeProof: [
      "tests/p0-acceptance.spec.ts::AV-SLICE-P0-02",
      "tests/demo-workflow-api.spec.ts::analyst rejects unsupported claim",
      "tests/client-visibility-proof.spec.ts",
      "tests/file-export-realism.spec.ts",
    ],
    nonClaims: [
      "No production AI integration.",
      "No autonomous advice execution.",
    ],
    positiveProof: [
      "tests/demo-workflow-api.spec.ts::submit review persists analyst review state",
      "tests/demo-workflow-api.spec.ts::Phase C J13/J14 actions keep advice visibility blocked",
      "tests/p0-acceptance.spec.ts::AV-SLICE-P0-02",
    ],
    status: "mapped",
  },
  {
    foundationIds: ["FND-012", "FND-010", "FND-011"],
    journeyId: "MJ-005",
    journeyName: "Export and redaction of client-safe package",
    negativeProof: [
      "tests/file-export-realism.spec.ts",
      "tests/phase8-export-workflow-api.spec.ts",
      "tests/p0-acceptance.spec.ts::AV-SLICE-P0-07",
    ],
    nonClaims: [
      "Generated package remains metadata-only.",
      "No production binary ZIP delivery claim.",
      "No production external share-link authorization claim.",
    ],
    positiveProof: [
      "tests/file-export-realism.spec.ts",
      "tests/phase8-export-workflow-api.spec.ts",
      "tests/p0-acceptance.spec.ts::AV-SLICE-P0-07",
    ],
    status: "mapped",
  },
  {
    foundationIds: ["FND-001", "FND-002", "FND-003", "FND-010"],
    journeyId: "MJ-006",
    journeyName: "Tenant and object isolation",
    negativeProof: [
      "tests/providerless-scope.spec.ts",
      "tests/document-upload-api.spec.ts::reloads uploaded documents only for the active tenant",
      "tests/p0-api-contract.spec.ts",
    ],
    nonClaims: [
      "Providerless demo session is not production authentication.",
      "Route shell access is not payload authorization.",
    ],
    positiveProof: [
      "tests/providerless-scope.spec.ts",
      "tests/permission-engine.spec.ts",
      "tests/document-upload-api.spec.ts::reloads uploaded documents only for the active tenant",
    ],
    status: "mapped",
  },
  {
    foundationIds: ["FND-004", "FND-011"],
    journeyId: "MJ-010",
    journeyName: "Admin role change cannot bypass compliance release",
    negativeProof: [
      "tests/governance-non-bypass.spec.ts",
      "tests/p0-acceptance.spec.ts::AV-SLICE-P0-04",
    ],
    nonClaims: [
      "Admin route access does not imply release, evidence sufficiency, export or client-visibility authority.",
    ],
    positiveProof: [
      "tests/governance-non-bypass.spec.ts::allows governance administration",
      "tests/p0-acceptance.spec.ts::AV-SLICE-P0-04",
    ],
    status: "mapped",
  },
  {
    foundationIds: ["FND-013"],
    journeyId: "MJ-012",
    journeyName: "Data-quality support hardening",
    negativeProof: [
      "tests/phase9-support-hardening.spec.ts",
      "tests/data-quality-service.spec.ts",
      "tests/p0-api-contract.spec.ts",
    ],
    nonClaims: [
      "Data quality remains a support-hardening gate, not the primary MVP narrative.",
      "Review monitoring remains internal and does not execute advice.",
    ],
    positiveProof: [
      "tests/phase9-support-hardening.spec.ts",
      "tests/data-quality-service.spec.ts",
      "tests/review-monitoring-service.spec.ts",
    ],
    status: "mapped",
  },
  {
    foundationIds: ["FND-002", "FND-003"],
    journeyId: "MJ-011",
    journeyName: "External advisor object-scope access",
    negativeProof: ["route-scope lock keeps guest access conditional/P1 until explicitly unlocked"],
    nonClaims: ["External advisor guest access is not unlocked in MVP Phase 10."],
    positiveProof: ["explicit blocker: conditional MVP support/P1, not accepted as done"],
    status: "explicit_blocker",
  },
  {
    foundationIds: ["FND-013"],
    journeyId: "MJ-008",
    journeyName: "Review monitoring and rebalance guard",
    negativeProof: ["tests/p0-api-contract.spec.ts", "tests/review-monitoring-service.spec.ts"],
    nonClaims: ["No automatic rebalance, advice execution or client release."],
    positiveProof: ["internal snapshot and J16/J17 audit-only proof only"],
    status: "explicit_blocker",
  },
  {
    foundationIds: ["FND-013"],
    journeyId: "MJ-009",
    journeyName: "Mobile/client communication layer",
    negativeProof: ["route-scope lock keeps communication/mobile advisory workflow P1"],
    nonClaims: ["No first-path client communication/advice workflow is unlocked."],
    positiveProof: ["explicit blocker: P1_DEFERRED"],
    status: "explicit_blocker",
  },
  {
    foundationIds: ["FND-013"],
    journeyId: "MJ-004",
    journeyName: "Committee review",
    negativeProof: ["tests/committee-review-routes.spec.ts"],
    nonClaims: ["Held committee routes 070-071 are not silently elevated."],
    positiveProof: ["explicit blocker: HOLD_PENDING_DECISION"],
    status: "explicit_blocker",
  },
  {
    foundationIds: ["FND-013"],
    journeyId: "MJ-007",
    journeyName: "KYC, source-of-wealth, suitability and IPS",
    negativeProof: ["route-scope lock keeps regulated suitability routes held"],
    nonClaims: ["No regulated suitability/advice logic is unlocked in first-path MVP."],
    positiveProof: ["explicit blocker: HOLD_PENDING_DECISION"],
    status: "explicit_blocker",
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

export function p0MappedJourneyIds(entries = p0AcceptanceProofMap) {
  return entries.filter((entry) => entry.status === "mapped").map((entry) => entry.journeyId).sort();
}
