import {
  av27Phase6AllowedClientPayloadFields,
  av27Phase6ForbiddenPayloadFields,
  type Av27Phase6PayloadClassification,
  classifyAv27Phase6PayloadField,
} from "@/lib/av27-phase6-payload-contract";

export type Pp001PayloadVisibilityClass =
  | "client_safe_released_only"
  | "hidden"
  | "internal_only"
  | "redacted"
  | "visible";

const internalOnlyClassifications = new Set<Av27Phase6PayloadClassification>([
  "AI_DRAFT",
  "COMPLIANCE_NOTES",
  "INTERNAL_RATIONALE",
  "UNRELEASED_EVIDENCE",
  "UNRELEASED_RECOMMENDATION",
]);

const redactedClientAuditFields = new Set(["auditActor", "auditEventId", "auditMetadata", "auditReason"]);

function uniq(values: readonly string[]) {
  return [...new Set(values)].sort();
}

export const pp001PayloadVisibilityMatrix = {
  clientSafeReleasedOnlyFields: uniq(av27Phase6AllowedClientPayloadFields),
  hiddenFields: uniq(
    av27Phase6ForbiddenPayloadFields.filter((field) => {
      const classification = classifyAv27Phase6PayloadField(field);
      return !internalOnlyClassifications.has(classification) && !redactedClientAuditFields.has(field);
    }),
  ),
  internalOnlyFields: uniq(
    av27Phase6ForbiddenPayloadFields.filter((field) =>
      internalOnlyClassifications.has(classifyAv27Phase6PayloadField(field)),
    ),
  ),
  redactedFields: uniq([...redactedClientAuditFields]),
  visibleFields: [] as string[],
} as const;

export function classifyPp001PayloadField(field: string): Pp001PayloadVisibilityClass {
  if (pp001PayloadVisibilityMatrix.clientSafeReleasedOnlyFields.includes(field)) {
    return "client_safe_released_only";
  }

  if (pp001PayloadVisibilityMatrix.redactedFields.includes(field)) {
    return "redacted";
  }

  if (pp001PayloadVisibilityMatrix.internalOnlyFields.includes(field)) {
    return "internal_only";
  }

  if (pp001PayloadVisibilityMatrix.hiddenFields.includes(field)) {
    return "hidden";
  }

  return "hidden";
}

export function pp001ForbiddenClientPayloadFields() {
  return uniq([
    ...pp001PayloadVisibilityMatrix.hiddenFields,
    ...pp001PayloadVisibilityMatrix.internalOnlyFields,
    ...pp001PayloadVisibilityMatrix.redactedFields,
  ]);
}

export function inspectPp001ClientPayload(payload: Record<string, unknown>) {
  const forbiddenFields = Object.keys(payload).filter((field) =>
    pp001ForbiddenClientPayloadFields().includes(field),
  );

  return {
    clean: forbiddenFields.length === 0,
    forbiddenFields,
    fieldClasses: Object.fromEntries(
      Object.keys(payload).map((field) => [field, classifyPp001PayloadField(field)]),
    ) as Record<string, Pp001PayloadVisibilityClass>,
  };
}
