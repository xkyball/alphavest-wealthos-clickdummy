import { NextResponse } from "next/server";

export type FailClosedReasonCode =
  | "AUDIT_PERSISTENCE_UNAVAILABLE"
  | "DATABASE_URL_REQUIRED"
  | "INVALID_REQUEST"
  | "PERMISSION_DENIED"
  | "SAFE_ERROR"
  | "SCOPE_DENIED";

export type FailClosedErrorEnvelope = {
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

export function buildFailClosedErrorEnvelope(input: {
  error: string;
  issues?: unknown[];
  reasonCode?: FailClosedReasonCode;
  retryAllowed?: boolean;
}): FailClosedErrorEnvelope {
  return {
    error: input.error,
    issues: input.issues,
    mutated: false,
    noAdviceExecution: true,
    noClientRelease: true,
    ok: false,
    reasonCode: input.reasonCode ?? "SAFE_ERROR",
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
  const { error, issues, reasonCode, retryAllowed, ...extra } = input;

  return NextResponse.json(
    {
      ...buildFailClosedErrorEnvelope({ error, issues, reasonCode, retryAllowed }),
      ...extra,
    },
    init,
  );
}
