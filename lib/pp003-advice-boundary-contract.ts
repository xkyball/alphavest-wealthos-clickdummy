import {
  clientVisibilityStage6AllowedClientPayloadFields,
  clientVisibilityStage6ForbiddenPayloadFields,
  classifyClientVisibilityStage6PayloadField,
  type ClientVisibilityStage6PayloadClassification,
} from "@/lib/client-visibility-payload-contract";

export type Pp003AdviceBoundaryClass =
  | "AI_DRAFT_INTERNAL_ONLY"
  | "CLIENT_REDACTED_AUDIT"
  | "CLIENT_SAFE_CANDIDATE"
  | "COMPLIANCE_INTERNAL_ONLY"
  | "HIDDEN_TECHNICAL_FIELD"
  | "INTERNAL_ASSUMPTION_ONLY"
  | "INTERNAL_EVIDENCE_DETAIL"
  | "INTERNAL_RATIONALE_ONLY"
  | "UNRELEASED_RECOMMENDATION_INTERNAL_ONLY"
  | "UNSUPPORTED_CLAIM_INTERNAL_ONLY"
  | "REQUIRES_DECISION";

export type Pp003Surface =
  | "client_api"
  | "client_portal_mobile"
  | "decision_projection"
  | "demo_workflow_response"
  | "export_candidate"
  | "internal_workbench";

export type Pp003SurfaceRule = "allow" | "allow_internal_only" | "block" | "hide" | "redact";
export type Pp003DraftLifecycleStatus =
  | "ADVISOR_READY"
  | "ARCHIVED"
  | "CLASSIFIED"
  | "CREATED"
  | "REBUILT_WITH_EVIDENCE"
  | "REJECTED"
  | "REVISION_REQUESTED";
export type Pp003UnsupportedClaimStatus = "NEEDS_EVIDENCE" | "RESOLVED" | "WAIVED";
export type Pp003CanonicalEvidencePath = "PP002_CANONICAL_PROCESS" | "LEGACY_OR_Operational" | "NONE";
export type Pp003DraftPromotionTarget =
  | "advisor_candidate"
  | "client_safe_summary_candidate"
  | "client_visible_release"
  | "internal_review";

export type Pp003FieldClassification = {
  clientVisibilityClass?: ClientVisibilityStage6PayloadClassification;
  field: string;
  pp003Class: Pp003AdviceBoundaryClass;
  rationale: string;
};

export type Pp003SurfaceInspection = {
  clean: boolean;
  fieldResults: Array<{
    field: string;
    pp003Class: Pp003AdviceBoundaryClass;
    rule: Pp003SurfaceRule;
  }>;
  forbiddenFields: string[];
  missing: string[];
  surface: Pp003Surface;
  unknownFields: string[];
};

export type Pp003DraftLifecycleGateInput = {
  canonicalEvidenceAudited: boolean;
  canonicalEvidencePath: Pp003CanonicalEvidencePath;
  canonicalEvidenceSufficient: boolean;
  classified: boolean;
  clientVisible: boolean;
  draftStatus: Pp003DraftLifecycleStatus;
  promotionTarget: Pp003DraftPromotionTarget;
  unsupportedClaims: Array<{ status: Pp003UnsupportedClaimStatus }>;
};

export type Pp003DraftLifecycleGate = {
  allowed: boolean;
  missing: string[];
  target: Pp003DraftPromotionTarget;
};

const aiDraftFields = [
  "aiDraft",
  "aiDraftText",
  "clientSummaryDraft",
  "draftClientSummary",
  "modelOutput",
  "modelPrompt",
] as const;

const internalRationaleFields = [
  "analystNotes",
  "internalNotes",
  "internalRationale",
  "internalSummary",
  "rationaleInternal",
  "summaryInternal",
] as const;

const internalAssumptionFields = ["assumptionsJson", "confidence", "confidenceScore"] as const;
const complianceInternalFields = ["complianceNotes", "complianceReviewNotes"] as const;
const unsupportedClaimFields = ["unsupportedClaim", "unsupportedClaimReason", "unsupportedClaims"] as const;
const clientRedactedAuditFields = ["auditActor", "auditEventId", "auditMetadata", "auditReason"] as const;

const internalEvidenceDetailFields = [
  "evidenceDecisionReason",
  "evidenceRecordId",
  "evidenceStatus",
  "evidenceVisibilityStatus",
  "extractionStatus",
  "unreleasedEvidence",
] as const;

const hiddenTechnicalFields = [
  "checksum",
  "fileName",
  "fileSizeBytes",
  "latestVersionChecksum",
  "manualOverride",
  "mimeType",
  "rawFileMetadata",
  "sourceFileMetadata",
  "storageKey",
  "visibilityOverride",
] as const;

const unreleasedRecommendationFields = ["unreleasedRecommendation"] as const;

function entriesFor(
  fields: readonly string[],
  pp003Class: Pp003AdviceBoundaryClass,
  rationale: string,
): Pp003FieldClassification[] {
  return fields.map((field) => ({
    clientVisibilityClass: classifyClientVisibilityStage6PayloadField(field),
    field,
    pp003Class,
    rationale,
  }));
}

function uniqEntries(entries: Pp003FieldClassification[]) {
  const byField = new Map<string, Pp003FieldClassification>();

  for (const entry of entries) {
    byField.set(entry.field, entry);
  }

  return [...byField.values()].sort((left, right) => left.field.localeCompare(right.field));
}

export const pp003AllowedClientSafeCandidateFields = [...clientVisibilityStage6AllowedClientPayloadFields] as const;

export const pp003FieldClassificationRegister = uniqEntries([
  ...entriesFor(
    ["noClientRelease"],
    "CLIENT_SAFE_CANDIDATE",
    "Safety signal allowed in demo/API responses; it does not make content client-visible.",
  ),
  ...entriesFor(
    pp003AllowedClientSafeCandidateFields,
    "CLIENT_SAFE_CANDIDATE",
    "Allowed only after release, visibility, evidence and redaction gates pass.",
  ),
  ...entriesFor(aiDraftFields, "AI_DRAFT_INTERNAL_ONLY", "AI/rules draft content remains internal-only."),
  ...entriesFor(internalRationaleFields, "INTERNAL_RATIONALE_ONLY", "Internal rationale is scoped to internal roles."),
  ...entriesFor(internalAssumptionFields, "INTERNAL_ASSUMPTION_ONLY", "Assumptions and confidence are internal model context."),
  ...entriesFor(complianceInternalFields, "COMPLIANCE_INTERNAL_ONLY", "Compliance notes are internal-only."),
  ...entriesFor(unsupportedClaimFields, "UNSUPPORTED_CLAIM_INTERNAL_ONLY", "Unsupported claims block promotion until canonical evidence resolves them."),
  ...entriesFor(clientRedactedAuditFields, "CLIENT_REDACTED_AUDIT", "Audit internals are redacted or hidden from clients."),
  ...entriesFor(internalEvidenceDetailFields, "INTERNAL_EVIDENCE_DETAIL", "Internal evidence details are not client-safe by existence."),
  ...entriesFor(hiddenTechnicalFields, "HIDDEN_TECHNICAL_FIELD", "Technical metadata is hidden from client/export projections."),
  ...entriesFor(
    unreleasedRecommendationFields,
    "UNRELEASED_RECOMMENDATION_INTERNAL_ONLY",
    "Unreleased recommendations are internal until approved release gates pass.",
  ),
  ...clientVisibilityStage6ForbiddenPayloadFields
    .filter(
      (field) =>
        ![
          ...aiDraftFields,
          ...internalRationaleFields,
          ...internalAssumptionFields,
          ...complianceInternalFields,
          ...unsupportedClaimFields,
          ...clientRedactedAuditFields,
          ...internalEvidenceDetailFields,
          ...hiddenTechnicalFields,
          ...unreleasedRecommendationFields,
        ].includes(field),
    )
    .map((field) => ({
      clientVisibilityClass: classifyClientVisibilityStage6PayloadField(field),
      field,
      pp003Class: "HIDDEN_TECHNICAL_FIELD" as const,
      rationale: "Inherited forbidden payload field; hidden until a PP003-specific decision says otherwise.",
    })),
]);

export const pp003ClassByField = Object.fromEntries(
  pp003FieldClassificationRegister.map((entry) => [entry.field, entry.pp003Class]),
) as Record<string, Pp003AdviceBoundaryClass>;

export function classifyPp003AdviceBoundaryField(field: string): Pp003AdviceBoundaryClass {
  return pp003ClassByField[field] ?? "REQUIRES_DECISION";
}

export function pp003FieldsForClass(pp003Class: Pp003AdviceBoundaryClass) {
  return pp003FieldClassificationRegister
    .filter((entry) => entry.pp003Class === pp003Class)
    .map((entry) => entry.field);
}

const hideFromExternalSurfaces: Record<Pp003Surface, Pp003SurfaceRule> = {
  client_api: "hide",
  client_portal_mobile: "hide",
  decision_projection: "hide",
  demo_workflow_response: "hide",
  export_candidate: "block",
  internal_workbench: "allow_internal_only",
};

export const pp003SurfaceRedactionMatrix = {
  AI_DRAFT_INTERNAL_ONLY: hideFromExternalSurfaces,
  CLIENT_REDACTED_AUDIT: {
    client_api: "redact",
    client_portal_mobile: "redact",
    decision_projection: "redact",
    demo_workflow_response: "hide",
    export_candidate: "block",
    internal_workbench: "allow_internal_only",
  },
  CLIENT_SAFE_CANDIDATE: {
    client_api: "allow",
    client_portal_mobile: "allow",
    decision_projection: "allow",
    demo_workflow_response: "allow",
    export_candidate: "allow",
    internal_workbench: "allow",
  },
  COMPLIANCE_INTERNAL_ONLY: hideFromExternalSurfaces,
  HIDDEN_TECHNICAL_FIELD: {
    client_api: "hide",
    client_portal_mobile: "hide",
    decision_projection: "hide",
    demo_workflow_response: "hide",
    export_candidate: "block",
    internal_workbench: "allow_internal_only",
  },
  INTERNAL_ASSUMPTION_ONLY: hideFromExternalSurfaces,
  INTERNAL_EVIDENCE_DETAIL: {
    client_api: "hide",
    client_portal_mobile: "hide",
    decision_projection: "redact",
    demo_workflow_response: "hide",
    export_candidate: "block",
    internal_workbench: "allow_internal_only",
  },
  INTERNAL_RATIONALE_ONLY: hideFromExternalSurfaces,
  UNRELEASED_RECOMMENDATION_INTERNAL_ONLY: hideFromExternalSurfaces,
  UNSUPPORTED_CLAIM_INTERNAL_ONLY: hideFromExternalSurfaces,
  REQUIRES_DECISION: {
    client_api: "block",
    client_portal_mobile: "block",
    decision_projection: "block",
    demo_workflow_response: "block",
    export_candidate: "block",
    internal_workbench: "block",
  },
} as const satisfies Record<Pp003AdviceBoundaryClass, Record<Pp003Surface, Pp003SurfaceRule>>;

export function pp003SurfaceRuleForField(field: string, surface: Pp003Surface): Pp003SurfaceRule {
  return pp003SurfaceRedactionMatrix[classifyPp003AdviceBoundaryField(field)][surface];
}

function isViolation(rule: Pp003SurfaceRule) {
  return rule === "block" || rule === "hide" || rule === "redact";
}

export function inspectPp003PayloadSurface(
  surface: Pp003Surface,
  payload: Record<string, unknown>,
): Pp003SurfaceInspection {
  const fieldResults = Object.keys(payload)
    .sort()
    .map((field) => {
      const pp003Class = classifyPp003AdviceBoundaryField(field);

      return {
        field,
        pp003Class,
        rule: pp003SurfaceRedactionMatrix[pp003Class][surface],
      };
    });
  const forbiddenFields = fieldResults.filter((result) => isViolation(result.rule)).map((result) => result.field);
  const unknownFields = fieldResults
    .filter((result) => result.pp003Class === "REQUIRES_DECISION")
    .map((result) => result.field);
  const missing = [
    ...forbiddenFields.map((field) => `pp003_forbidden_surface_field:${surface}:${field}`),
    ...unknownFields.map((field) => `pp003_requires_decision:${field}`),
  ];

  return {
    clean: missing.length === 0,
    fieldResults,
    forbiddenFields,
    missing,
    surface,
    unknownFields,
  };
}

export function evaluatePp003DraftLifecycleGate(input: Pp003DraftLifecycleGateInput): Pp003DraftLifecycleGate {
  const missing: string[] = [];
  const openUnsupportedClaims = input.unsupportedClaims.filter((claim) => claim.status === "NEEDS_EVIDENCE");

  if (input.clientVisible) {
    missing.push("pp003_draft_must_not_be_client_visible");
  }

  if (input.promotionTarget === "internal_review") {
    return {
      allowed: missing.length === 0,
      missing,
      target: input.promotionTarget,
    };
  }

  if (input.promotionTarget === "client_visible_release") {
    missing.push("pp003_does_not_authorize_client_visible_release");
  }

  if (!input.classified) {
    missing.push("draft_classification_required");
  }

  if (input.draftStatus !== "REBUILT_WITH_EVIDENCE" && input.draftStatus !== "ADVISOR_READY") {
    missing.push("evidence_backed_rebuild_required");
  }

  if (openUnsupportedClaims.length > 0) {
    missing.push("unsupported_claims_require_evidence");
  }

  if (input.unsupportedClaims.some((claim) => claim.status === "WAIVED")) {
    missing.push("unsupported_claim_waiver_not_pp003_canonical_proof");
  }

  if (input.canonicalEvidencePath !== "PP002_CANONICAL_PROCESS") {
    missing.push("pp002_canonical_process_evidence_required");
  }

  if (!input.canonicalEvidenceSufficient) {
    missing.push("canonical_evidence_sufficiency_required");
  }

  if (!input.canonicalEvidenceAudited) {
    missing.push("canonical_evidence_audit_required");
  }

  return {
    allowed: missing.length === 0,
    missing: [...new Set(missing)],
    target: input.promotionTarget,
  };
}
