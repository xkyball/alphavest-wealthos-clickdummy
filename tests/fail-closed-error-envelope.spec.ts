import { expect, test } from "@playwright/test";

import { buildFailClosedErrorEnvelope } from "../lib/control-layer/error-envelope";

test.describe("WCL WS-10 fail-closed error envelope", () => {
  test("standardizes safe API errors without silent advancement", () => {
    const envelope = buildFailClosedErrorEnvelope({
      error: "Invalid demo workflow request.",
      issues: ["action_required"],
      reasonCode: "INVALID_REQUEST",
    });

    expect(envelope).toEqual({
      error: "Invalid demo workflow request.",
      issues: ["action_required"],
      mutated: false,
      noAdviceExecution: true,
      noClientRelease: true,
      ok: false,
      reasonCode: "INVALID_REQUEST",
      retryAllowed: false,
      safety: {
        failClosed: true,
        silentStateAdvance: false,
      },
    });
  });

  test("marks retryable infrastructure failures without relaxing release gates", () => {
    const envelope = buildFailClosedErrorEnvelope({
      error: "DATABASE_URL is required for demo workflow actions.",
      reasonCode: "DATABASE_URL_REQUIRED",
      retryAllowed: true,
    });

    expect(envelope.retryAllowed).toBe(true);
    expect(envelope.mutated).toBe(false);
    expect(envelope.noAdviceExecution).toBe(true);
    expect(envelope.noClientRelease).toBe(true);
    expect(envelope.safety.silentStateAdvance).toBe(false);
  });
});
