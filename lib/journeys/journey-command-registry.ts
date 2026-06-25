export const journeyCommandIds = [
  "START",
  "COMPLETE_STEP",
  "BLOCK",
  "RESUME",
  "CANCEL",
  "LINK_EVIDENCE",
  "DECIDE_EVIDENCE_SUFFICIENCY",
  "AI_DRAFT_INTERNAL",
  "ADVISOR_APPROVE",
  "COMPLIANCE_BLOCK",
  "COMPLIANCE_REQUEST_EVIDENCE",
  "COMPLIANCE_RELEASE",
] as const;

export type JourneyCommandId = (typeof journeyCommandIds)[number];

export type JourneyCommandRequest = {
  command: JourneyCommandId;
  clientSafeSummary?: string;
  confirmationPhrase?: string;
  currentnessConfirmed?: boolean;
  decision?: "SUFFICIENT" | "INSUFFICIENT";
  evidenceRecordId?: string;
  fromStepKey?: string;
  relevanceConfirmed?: boolean;
  requirementKey?: string;
  reason?: string;
  reviewed?: boolean;
  scopeMatches?: boolean;
  simulateAuditPersistenceFailure?: boolean;
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

function optionalBoolean(value: unknown) {
  return value === undefined || typeof value === "boolean";
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
    ...(!optionalString(record.requirementKey) ? ["requirement_key_must_be_string"] : []),
    ...(!optionalString(record.evidenceRecordId) ? ["evidence_record_id_must_be_string"] : []),
    ...(!optionalString(record.confirmationPhrase) ? ["confirmation_phrase_must_be_string"] : []),
    ...(!optionalString(record.clientSafeSummary) ? ["client_safe_summary_must_be_string"] : []),
    ...(!optionalBoolean(record.reviewed) ? ["reviewed_must_be_boolean"] : []),
    ...(!optionalBoolean(record.scopeMatches) ? ["scope_matches_must_be_boolean"] : []),
    ...(!optionalBoolean(record.relevanceConfirmed) ? ["relevance_confirmed_must_be_boolean"] : []),
    ...(!optionalBoolean(record.currentnessConfirmed) ? ["currentness_confirmed_must_be_boolean"] : []),
    ...(!optionalBoolean(record.simulateAuditPersistenceFailure) ? ["simulate_audit_persistence_failure_must_be_boolean"] : []),
  ];

  if (record.command === "BLOCK" && typeof record.reason !== "string") {
    issues.push("block_reason_required");
  }

  if (record.command === "LINK_EVIDENCE") {
    if (typeof record.requirementKey !== "string") issues.push("requirement_key_required");
    if (typeof record.evidenceRecordId !== "string") issues.push("evidence_record_id_required");
  }

  if (record.command === "DECIDE_EVIDENCE_SUFFICIENCY") {
    if (typeof record.requirementKey !== "string") issues.push("requirement_key_required");
    if (typeof record.evidenceRecordId !== "string") issues.push("evidence_record_id_required");
    if (record.decision !== "SUFFICIENT" && record.decision !== "INSUFFICIENT") {
      issues.push("sufficiency_decision_required");
    }
    if (typeof record.reason !== "string") issues.push("sufficiency_reason_required");
  }

  if (
    ["COMPLIANCE_BLOCK", "COMPLIANCE_REQUEST_EVIDENCE", "COMPLIANCE_RELEASE", "ADVISOR_APPROVE"].includes(
      String(record.command),
    ) &&
    typeof record.reason !== "string"
  ) {
    issues.push("gate_reason_required");
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
      command: record.command as JourneyCommandId,
      ...(typeof record.clientSafeSummary === "string" ? { clientSafeSummary: record.clientSafeSummary } : {}),
      ...(typeof record.confirmationPhrase === "string" ? { confirmationPhrase: record.confirmationPhrase } : {}),
      ...(typeof record.currentnessConfirmed === "boolean" ? { currentnessConfirmed: record.currentnessConfirmed } : {}),
      ...(record.decision === "SUFFICIENT" || record.decision === "INSUFFICIENT" ? { decision: record.decision } : {}),
      ...(typeof record.evidenceRecordId === "string" ? { evidenceRecordId: record.evidenceRecordId } : {}),
      ...(typeof record.fromStepKey === "string" ? { fromStepKey: record.fromStepKey } : {}),
      ...(typeof record.relevanceConfirmed === "boolean" ? { relevanceConfirmed: record.relevanceConfirmed } : {}),
      ...(typeof record.requirementKey === "string" ? { requirementKey: record.requirementKey } : {}),
      ...(typeof record.reason === "string" ? { reason: record.reason } : {}),
      ...(typeof record.reviewed === "boolean" ? { reviewed: record.reviewed } : {}),
      ...(typeof record.scopeMatches === "boolean" ? { scopeMatches: record.scopeMatches } : {}),
      ...(typeof record.simulateAuditPersistenceFailure === "boolean"
        ? { simulateAuditPersistenceFailure: record.simulateAuditPersistenceFailure }
        : {}),
      ...(typeof record.toStepKey === "string" ? { toStepKey: record.toStepKey } : {}),
    },
  };
}
