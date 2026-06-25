export type Av27Phase6TicketId =
  | "AV27-P6-T01"
  | "AV27-P6-T02"
  | "AV27-P6-T03"
  | "AV27-P6-T04"
  | "AV27-P6-T05";

export type Av27Phase6PayloadClassification =
  | "CLIENT_SAFE_SUMMARY"
  | "RELEASED_EVIDENCE_SUMMARY"
  | "AI_DRAFT"
  | "INTERNAL_RATIONALE"
  | "COMPLIANCE_NOTES"
  | "UNRELEASED_EVIDENCE"
  | "UNRELEASED_RECOMMENDATION"
  | "HIDDEN_FIELD";

export const av27Phase6TicketOrder: Av27Phase6TicketId[] = [
  "AV27-P6-T01",
  "AV27-P6-T02",
  "AV27-P6-T03",
  "AV27-P6-T04",
  "AV27-P6-T05",
];

export const av27Phase6PayloadClassifications = [
  "CLIENT_SAFE_SUMMARY",
  "RELEASED_EVIDENCE_SUMMARY",
  "AI_DRAFT",
  "INTERNAL_RATIONALE",
  "COMPLIANCE_NOTES",
  "UNRELEASED_EVIDENCE",
  "UNRELEASED_RECOMMENDATION",
  "HIDDEN_FIELD",
] as const satisfies Av27Phase6PayloadClassification[];

export const av27Phase6AllowedClientPayloadFields = [
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

export const av27Phase6AllowedExportPayloadFields = [
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

export const av27Phase6SourceUploadMetadataExceptionFields = ["fileName", "fileSizeBytes"] as const;

export const av27Phase6ForbiddenPayloadFields = [
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

export const av27Phase6PayloadFieldClassifications: Record<string, Av27Phase6PayloadClassification> = {
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

const allowedClientPayloadFields = new Set<string>(av27Phase6AllowedClientPayloadFields);
const allowedExportPayloadFields = new Set<string>(av27Phase6AllowedExportPayloadFields);
const forbiddenPayloadFields = new Set<string>(av27Phase6ForbiddenPayloadFields);
const payloadClassifications = new Set<string>(av27Phase6PayloadClassifications);
const sourceUploadMetadataExceptionFields = new Set<string>(av27Phase6SourceUploadMetadataExceptionFields);

export type Av27Phase6PayloadInspection = {
  allowedFields: string[];
  clean: boolean;
  forbiddenFields: string[];
  missing: string[];
  payloadClassifications: Av27Phase6PayloadClassification[];
};

export function classifyAv27Phase6PayloadField(field: string): Av27Phase6PayloadClassification {
  return av27Phase6PayloadFieldClassifications[field] ?? "HIDDEN_FIELD";
}

export function isAv27Phase6PayloadClassification(value: unknown): value is Av27Phase6PayloadClassification {
  return typeof value === "string" && payloadClassifications.has(value);
}

export function isAv27Phase6ForbiddenPayloadField(field: string) {
  return forbiddenPayloadFields.has(field) || !allowedClientPayloadFields.has(field);
}

export function forbiddenAv27Phase6PayloadFieldsPresent(payload: Record<string, unknown>) {
  return av27Phase6ForbiddenPayloadFields.filter((field) => field in payload);
}

export function inspectAv27Phase6ClientPayload(
  payload: Record<string, unknown>,
  options: { allowSourceUploadMetadata?: boolean; surface?: "api" | "export" | "ui" } = {},
): Av27Phase6PayloadInspection {
  const allowedFields: string[] = [];
  const forbiddenFields: string[] = [];
  const missing: string[] = [];
  const payloadClassifications: Av27Phase6PayloadClassification[] = [];
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
    payloadClassifications.push(classifyAv27Phase6PayloadField(field));
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

export function sweepAv27Phase6PayloadSurfaces(
  surfaces: Array<{
    allowSourceUploadMetadata?: boolean;
    name: string;
    payload: Record<string, unknown>;
    surface: "api" | "export" | "ui";
  }>,
) {
  return surfaces.map((surface) => ({
    ...surface,
    inspection: inspectAv27Phase6ClientPayload(surface.payload, {
      allowSourceUploadMetadata: surface.allowSourceUploadMetadata,
      surface: surface.surface,
    }),
  }));
}
