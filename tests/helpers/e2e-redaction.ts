export const forbiddenClientPayloadFields = [
  "aiDraft",
  "assumptionsJson",
  "checksum",
  "clientSummaryDraft",
  "complianceNotes",
  "evidenceStatus",
  "evidenceVisibilityStatus",
  "extractionStatus",
  "fileName",
  "fileSizeBytes",
  "internalRationale",
  "mimeType",
  "storageKey",
  "summaryInternal",
] as const;

export function forbiddenFieldsPresent(payload: Record<string, unknown>) {
  return forbiddenClientPayloadFields.filter((field) => field in payload);
}

