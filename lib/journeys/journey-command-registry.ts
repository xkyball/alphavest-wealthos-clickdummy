import type { JourneyCommandKey } from "./journey-state-machine";

export const journeyCommandIds = ["START", "COMPLETE_STEP", "BLOCK", "RESUME", "CANCEL"] as const;

export type JourneyCommandId = (typeof journeyCommandIds)[number];

export type JourneyCommandRequest = {
  command: JourneyCommandId;
  fromStepKey?: string;
  reason?: string;
  toStepKey?: string;
};

export type JourneyCommandValidationResult =
  | {
      ok: true;
      request: JourneyCommandRequest;
    }
  | {
      issues: string[];
      ok: false;
    };

function isJourneyCommandId(value: unknown): value is JourneyCommandId {
  return typeof value === "string" && journeyCommandIds.some((command) => command === value);
}

function optionalString(value: unknown) {
  return value === undefined || typeof value === "string";
}

export function parseJourneyCommandRequest(body: unknown): JourneyCommandValidationResult {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      issues: ["valid_json_object_required"],
      ok: false,
    };
  }

  const record = body as Record<string, unknown>;
  const issues = [
    ...(!isJourneyCommandId(record.command) ? ["valid_command_required"] : []),
    ...(!optionalString(record.fromStepKey) ? ["from_step_key_must_be_string"] : []),
    ...(!optionalString(record.toStepKey) ? ["to_step_key_must_be_string"] : []),
    ...(!optionalString(record.reason) ? ["reason_must_be_string"] : []),
  ];

  if (record.command === "BLOCK" && typeof record.reason !== "string") {
    issues.push("block_reason_required");
  }

  if (issues.length > 0) {
    return {
      issues,
      ok: false,
    };
  }

  return {
    ok: true,
    request: {
      command: record.command as JourneyCommandKey,
      ...(typeof record.fromStepKey === "string" ? { fromStepKey: record.fromStepKey } : {}),
      ...(typeof record.reason === "string" ? { reason: record.reason } : {}),
      ...(typeof record.toStepKey === "string" ? { toStepKey: record.toStepKey } : {}),
    },
  };
}
