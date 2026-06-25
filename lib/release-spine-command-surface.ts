import type { DataQualityGate } from "@/lib/data-quality-service";
import type { EvidenceSufficiencyDecision } from "@/lib/evidence-service";

export type ReleaseSpineCommand = {
  command: "EVALUATE_RELEASE_PRECONDITIONS";
  input: ReleaseSpineInput;
};

export type ReleaseSpineInput = {
  advisor: {
    approved: boolean;
  };
  audit: {
    persistenceAvailable: boolean;
  };
  compliance: {
    permissionAllowed: boolean;
  };
  dataQualityGate?: DataQualityGate;
  evidence: EvidenceSufficiencyDecision;
  export?: {
    approvalComplete: boolean;
    forbiddenPayloads?: string[];
    redactionProfile?: string | null;
    targetSelected: boolean;
  };
  payload: {
    ready: boolean;
  };
  rationale: {
    captured: boolean;
  };
  redaction: {
    ready: boolean;
  };
};

export type ReleaseSpineMissing =
  | "advisor_approval"
  | "audit_persistence"
  | "data_quality_release_ready"
  | "decision_rationale"
  | "evidence_sufficiency"
  | "export_approval"
  | "export_payload_clean"
  | "export_redaction_profile"
  | "export_target_selected"
  | "payload_ready"
  | "permission_check"
  | "redaction_ready"
  | string;

export type CanonicalReleasePreconditions = {
  advisorApproved: boolean;
  auditPersistenceAvailable: boolean;
  canExportAfterRelease: boolean;
  canRelease: boolean;
  dataQualityReady: boolean;
  evidenceMissing: string[];
  evidenceSufficient: boolean;
  exportApprovalComplete: boolean;
  exportPayloadClean: boolean;
  exportRedactionReady: boolean;
  exportTargetSelected: boolean;
  missing: ReleaseSpineMissing[];
  payloadReady: boolean;
  permissionAllowed: boolean;
  rationaleCaptured: boolean;
  redactionReady: boolean;
};

export type ReleaseSpineCommandResult = {
  commandFamily: "ReleaseSpine";
  command: ReleaseSpineCommand["command"];
  preconditions: CanonicalReleasePreconditions;
};

function uniqueMissing(values: ReleaseSpineMissing[]) {
  return [...new Set(values)];
}

export function buildCanonicalReleasePreconditions(input: ReleaseSpineInput): CanonicalReleasePreconditions {
  const missing: ReleaseSpineMissing[] = [];
  const evidenceMissing = input.evidence.sufficient ? [] : [...input.evidence.missing, "evidence_sufficiency"];
  const dataQualityReady = !input.dataQualityGate || input.dataQualityGate.passed;
  const exportApprovalComplete = input.export?.approvalComplete ?? true;
  const exportRedactionReady = input.export ? Boolean(input.export.redactionProfile?.trim()) : input.redaction.ready;
  const exportTargetSelected = input.export?.targetSelected ?? true;
  const exportPayloadClean = (input.export?.forbiddenPayloads ?? []).length === 0;

  if (!input.advisor.approved) missing.push("advisor_approval");
  if (!input.evidence.sufficient) missing.push(...evidenceMissing);
  if (!input.audit.persistenceAvailable) missing.push("audit_persistence");
  if (!input.redaction.ready) missing.push("redaction_ready");
  if (!input.rationale.captured) missing.push("decision_rationale");
  if (!input.payload.ready) missing.push("payload_ready");
  if (!input.compliance.permissionAllowed) missing.push("permission_check");
  if (!dataQualityReady && input.dataQualityGate) {
    missing.push(input.dataQualityGate.gateName.toLowerCase());
    missing.push(...input.dataQualityGate.missing);
  }
  if (!exportApprovalComplete) missing.push("export_approval");
  if (!exportRedactionReady) missing.push("export_redaction_profile");
  if (!exportTargetSelected) missing.push("export_target_selected");
  if (!exportPayloadClean) missing.push("export_payload_clean");

  const canonicalMissing = uniqueMissing(missing);
  const canRelease =
    input.advisor.approved &&
    input.evidence.sufficient &&
    input.audit.persistenceAvailable &&
    input.redaction.ready &&
    input.rationale.captured &&
    input.payload.ready &&
    input.compliance.permissionAllowed &&
    dataQualityReady;
  const canExportAfterRelease =
    canRelease &&
    exportApprovalComplete &&
    exportRedactionReady &&
    exportTargetSelected &&
    exportPayloadClean;

  return {
    advisorApproved: input.advisor.approved,
    auditPersistenceAvailable: input.audit.persistenceAvailable,
    canExportAfterRelease,
    canRelease,
    dataQualityReady,
    evidenceMissing,
    evidenceSufficient: input.evidence.sufficient,
    exportApprovalComplete,
    exportPayloadClean,
    exportRedactionReady,
    exportTargetSelected,
    missing: canonicalMissing,
    payloadReady: input.payload.ready,
    permissionAllowed: input.compliance.permissionAllowed,
    rationaleCaptured: input.rationale.captured,
    redactionReady: input.redaction.ready,
  };
}

export function runReleaseSpineCommand(command: ReleaseSpineCommand): ReleaseSpineCommandResult {
  return {
    command: command.command,
    commandFamily: "ReleaseSpine",
    preconditions: buildCanonicalReleasePreconditions(command.input),
  };
}
