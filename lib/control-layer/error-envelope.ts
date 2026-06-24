import { NextResponse } from "next/server";

export type FailClosedReasonCode =
  | "AUDIT_PERSISTENCE_UNAVAILABLE"
  | "DATABASE_URL_REQUIRED"
  | "INVALID_REQUEST"
  | "PERMISSION_DENIED"
  | "SAFE_ERROR"
  | "SCOPE_DENIED";

export type FailClosedApiState = "AUDIT_FAILURE" | "DENIED" | "ERROR" | "VALIDATION_ERROR";

export type FailClosedErrorEnvelope = {
  apiState: FailClosedApiState;
  error: string;
  issues?: unknown[];
  mutated: false;
  noAdviceExecution: true;
  noClientRelease: true;
  ok: false;
  reasonCode: FailClosedReasonCode;
  retryAllowed: boolean;
  safety: {
    failClosed: true;
    silentStateAdvance: false;
  };
};

function apiStateForReason(reasonCode: FailClosedReasonCode): FailClosedApiState {
  if (reasonCode === "AUDIT_PERSISTENCE_UNAVAILABLE") return "AUDIT_FAILURE";
  if (reasonCode === "INVALID_REQUEST") return "VALIDATION_ERROR";
  if (reasonCode === "PERMISSION_DENIED" || reasonCode === "SCOPE_DENIED") return "DENIED";

  return "ERROR";
}

export function buildFailClosedErrorEnvelope(input: {
  error: string;
  issues?: unknown[];
  reasonCode?: FailClosedReasonCode;
  retryAllowed?: boolean;
}): FailClosedErrorEnvelope {
  const reasonCode = input.reasonCode ?? "SAFE_ERROR";

  return {
    apiState: apiStateForReason(reasonCode),
    error: input.error,
    issues: input.issues,
    mutated: false,
    noAdviceExecution: true,
    noClientRelease: true,
    ok: false,
    reasonCode,
    retryAllowed: input.retryAllowed ?? false,
    safety: {
      failClosed: true,
      silentStateAdvance: false,
    },
  };
}

export function failClosedJson(
  input: Parameters<typeof buildFailClosedErrorEnvelope>[0] & Record<string, unknown>,
  init: { status: number },
) {
  const { error, issues, reasonCode, retryAllowed, safety: extraSafety, ...extra } = input;
  const envelope = buildFailClosedErrorEnvelope({ error, issues, reasonCode, retryAllowed });
  const mergedSafety =
    extraSafety && typeof extraSafety === "object" && !Array.isArray(extraSafety)
      ? {
          ...(extraSafety as Record<string, unknown>),
          ...envelope.safety,
        }
      : envelope.safety;

  return NextResponse.json(
    {
      ...extra,
      ...envelope,
      safety: mergedSafety,
    },
    init,
  );
}
