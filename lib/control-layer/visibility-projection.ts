export type VisibilityFieldPolicy = "visible" | "redacted" | "hidden";

export type VisibilityProjection<T extends Record<string, unknown>> = {
  hiddenFields: string[];
  payload: Partial<T>;
  reasonCode: "WCL_VISIBILITY_PROJECTED";
  redactedFields: string[];
  visible: boolean;
  visibleFields: string[];
};

export function projectPayloadVisibility<T extends Record<string, unknown>>(
  payload: T,
  fieldPolicy: Partial<Record<keyof T, VisibilityFieldPolicy>>,
): VisibilityProjection<T> {
  const projected: Partial<T> = {};
  const hiddenFields: string[] = [];
  const redactedFields: string[] = [];
  const visibleFields: string[] = [];

  for (const [field, value] of Object.entries(payload) as [keyof T, T[keyof T]][]) {
    const policy = fieldPolicy[field] ?? "hidden";

    if (policy === "visible") {
      projected[field] = value;
      visibleFields.push(String(field));
      continue;
    }

    if (policy === "redacted") {
      projected[field] = "[redacted]" as T[keyof T];
      redactedFields.push(String(field));
      continue;
    }

    hiddenFields.push(String(field));
  }

  return {
    hiddenFields,
    payload: projected,
    reasonCode: "WCL_VISIBILITY_PROJECTED",
    redactedFields,
    visible: visibleFields.length > 0 || redactedFields.length > 0,
    visibleFields,
  };
}
