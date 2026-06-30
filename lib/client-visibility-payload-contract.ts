export type ClientVisibilityStage6TicketId =
  | "CLIENT_VISIBILITY-P6-T01"
  | "CLIENT_VISIBILITY-P6-T02"
  | "CLIENT_VISIBILITY-P6-T03"
  | "CLIENT_VISIBILITY-P6-T04"
  | "CLIENT_VISIBILITY-P6-T05";

export type ClientVisibilityStage6PayloadClassification =
  | "CLIENT_SAFE_SUMMARY"
  | "RELEASED_EVIDENCE_SUMMARY"
  | "AI_DRAFT"
  | "INTERNAL_RATIONALE"
  | "COMPLIANCE_NOTES"
  | "UNRELEASED_EVIDENCE"
  | "UNRELEASED_RECOMMENDATION"
  | "HIDDEN_FIELD";

export const clientVisibilityStage6TicketOrder: ClientVisibilityStage6TicketId[] = [
  "CLIENT_VISIBILITY-P6-T01",
  "CLIENT_VISIBILITY-P6-T02",
  "CLIENT_VISIBILITY-P6-T03",
  "CLIENT_VISIBILITY-P6-T04",
  "CLIENT_VISIBILITY-P6-T05",
];

export const clientVisibilityStage6PayloadClassifications = [
  "CLIENT_SAFE_SUMMARY",
  "RELEASED_EVIDENCE_SUMMARY",
  "AI_DRAFT",
  "INTERNAL_RATIONALE",
  "COMPLIANCE_NOTES",
  "UNRELEASED_EVIDENCE",
  "UNRELEASED_RECOMMENDATION",
  "HIDDEN_FIELD",
] as const satisfies ClientVisibilityStage6PayloadClassification[];

export const clientVisibilityStage6AllowedClientPayloadFields = [
  "clientSummary",
  "decisionState",
  "documentType",
  "id",
  "latestVersionNumber",
  "releasedAt",
  "status",
  "title",
  "uploadedAt",
  "versionCount",
] as const;

export const clientVisibilityStage6AllowedExportPayloadFields = [
  "clientSummary",
  "decisionState",
  "documentType",
  "id",
  "latestVersionNumber",
  "releasedAt",
  "status",
  "title",
  "uploadedAt",
  "versionCount",
] as const;

export const clientVisibilityStage6SourceUploadMetadataExceptionFields = ["fileName", "fileSizeBytes"] as const;

export const clientVisibilityStage6ForbiddenPayloadFields = [
  "aiDraft",
  "aiDraftText",
  "analystNotes",
  "assumptionsJson",
  "auditActor",
  "auditEventId",
  "auditMetadata",
  "auditReason",
  "checksum",
  "clientSummaryDraft",
  "complianceNotes",
  "complianceReviewNotes",
  "evidenceRecordId",
  "evidenceStatus",
  "evidenceVisibilityStatus",
  "extractionStatus",
  "fileName",
  "fileSizeBytes",
  "internalNotes",
  "internalRationale",
  "internalSummary",
  "latestVersionChecksum",
  "manualOverride",
  "mimeType",
  "modelOutput",
  "modelPrompt",
  "rawFileMetadata",
  "rationaleInternal",
  "sourceFileMetadata",
  "storageKey",
  "summaryInternal",
  "unreleasedEvidence",
  "unreleasedRecommendation",
  "visibilityOverride",
] as const;

export const clientVisibilityStage6PayloadFieldClassifications: Record<string, ClientVisibilityStage6PayloadClassification> = {
  aiDraft: "AI_DRAFT",
  aiDraftText: "AI_DRAFT",
  analystNotes: "INTERNAL_RATIONALE",
  assumptionsJson: "INTERNAL_RATIONALE",
  auditActor: "INTERNAL_RATIONALE",
  auditEventId: "INTERNAL_RATIONALE",
  auditMetadata: "INTERNAL_RATIONALE",
  auditReason: "INTERNAL_RATIONALE",
  checksum: "HIDDEN_FIELD",
  clientSummaryDraft: "AI_DRAFT",
  complianceNotes: "COMPLIANCE_NOTES",
  complianceReviewNotes: "COMPLIANCE_NOTES",
  evidenceRecordId: "UNRELEASED_EVIDENCE",
  evidenceStatus: "UNRELEASED_EVIDENCE",
  evidenceVisibilityStatus: "UNRELEASED_EVIDENCE",
  extractionStatus: "UNRELEASED_EVIDENCE",
  fileName: "HIDDEN_FIELD",
  fileSizeBytes: "HIDDEN_FIELD",
  internalNotes: "INTERNAL_RATIONALE",
  internalRationale: "INTERNAL_RATIONALE",
  internalSummary: "INTERNAL_RATIONALE",
  latestVersionChecksum: "HIDDEN_FIELD",
  manualOverride: "HIDDEN_FIELD",
  mimeType: "HIDDEN_FIELD",
  modelOutput: "AI_DRAFT",
  modelPrompt: "AI_DRAFT",
  rawFileMetadata: "HIDDEN_FIELD",
  rationaleInternal: "INTERNAL_RATIONALE",
  sourceFileMetadata: "HIDDEN_FIELD",
  storageKey: "HIDDEN_FIELD",
  summaryInternal: "INTERNAL_RATIONALE",
  unreleasedEvidence: "UNRELEASED_EVIDENCE",
  unreleasedRecommendation: "UNRELEASED_RECOMMENDATION",
  visibilityOverride: "HIDDEN_FIELD",
};

const allowedClientPayloadFields = new Set<string>(clientVisibilityStage6AllowedClientPayloadFields);
const allowedExportPayloadFields = new Set<string>(clientVisibilityStage6AllowedExportPayloadFields);
const forbiddenPayloadFields = new Set<string>(clientVisibilityStage6ForbiddenPayloadFields);
const payloadClassifications = new Set<string>(clientVisibilityStage6PayloadClassifications);
const sourceUploadMetadataExceptionFields = new Set<string>(clientVisibilityStage6SourceUploadMetadataExceptionFields);

export type ClientVisibilityStage6PayloadInspection = {
  allowedFields: string[];
  clean: boolean;
  forbiddenFields: string[];
  missing: string[];
  payloadClassifications: ClientVisibilityStage6PayloadClassification[];
};

export function classifyClientVisibilityStage6PayloadField(field: string): ClientVisibilityStage6PayloadClassification {
  return clientVisibilityStage6PayloadFieldClassifications[field] ?? "HIDDEN_FIELD";
}

export function isClientVisibilityStage6PayloadClassification(value: unknown): value is ClientVisibilityStage6PayloadClassification {
  return typeof value === "string" && payloadClassifications.has(value);
}

export function isClientVisibilityStage6ForbiddenPayloadField(field: string) {
  return forbiddenPayloadFields.has(field) || !allowedClientPayloadFields.has(field);
}

export function forbiddenClientVisibilityStage6PayloadFieldsPresent(payload: Record<string, unknown>) {
  return clientVisibilityStage6ForbiddenPayloadFields.filter((field) => field in payload);
}

export function inspectClientVisibilityStage6ClientPayload(
  payload: Record<string, unknown>,
  options: { allowSourceUploadMetadata?: boolean; surface?: "api" | "export" | "ui" } = {},
): ClientVisibilityStage6PayloadInspection {
  const allowedFields: string[] = [];
  const forbiddenFields: string[] = [];
  const missing: string[] = [];
  const payloadClassifications: ClientVisibilityStage6PayloadClassification[] = [];
  const allowedFieldsForSurface = options.surface === "export" ? allowedExportPayloadFields : allowedClientPayloadFields;

  for (const field of Object.keys(payload)) {
    const sourceUploadMetadataAllowed =
      options.allowSourceUploadMetadata === true && sourceUploadMetadataExceptionFields.has(field);

    if (allowedFieldsForSurface.has(field) || sourceUploadMetadataAllowed) {
      allowedFields.push(field);
      payloadClassifications.push(field === "clientSummary" ? "CLIENT_SAFE_SUMMARY" : "RELEASED_EVIDENCE_SUMMARY");
      continue;
    }

    forbiddenFields.push(field);
    payloadClassifications.push(classifyClientVisibilityStage6PayloadField(field));
    missing.push(`forbidden_projection_field:${field}`);
  }

  if (Object.keys(payload).length === 0) {
    missing.push("client_safe_payload");
    payloadClassifications.push("HIDDEN_FIELD");
  }

  return {
    allowedFields,
    clean: forbiddenFields.length === 0 && missing.length === 0,
    forbiddenFields,
    missing,
    payloadClassifications: [...new Set(payloadClassifications)],
  };
}

export function sweepClientVisibilityStage6PayloadSurfaces(
  surfaces: Array<{
    allowSourceUploadMetadata?: boolean;
    name: string;
    payload: Record<string, unknown>;
    surface: "api" | "export" | "ui";
  }>,
) {
  return surfaces.map((surface) => ({
    ...surface,
    inspection: inspectClientVisibilityStage6ClientPayload(surface.payload, {
      allowSourceUploadMetadata: surface.allowSourceUploadMetadata,
      surface: surface.surface,
    }),
  }));
}
