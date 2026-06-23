export type PilotCriticalEventKey =
  | "DENIED_ACTION"
  | "UPLOAD_FAILURE"
  | "AUDIT_FAILURE"
  | "EXPORT_FAILURE"
  | "RELEASE_ATTEMPT";

export type PilotCriticalEventControl = {
  key: PilotCriticalEventKey;
  owner: "compliance" | "ops" | "security" | "support";
  safeSignal: string;
  severity: "P1" | "P2" | "P3";
  mustNotLog: string[];
};

export const pilotCriticalEventControls: PilotCriticalEventControl[] = [
  {
    key: "DENIED_ACTION",
    owner: "security",
    safeSignal: "actor, role, action, target type, decision reason and correlation id",
    severity: "P2",
    mustNotLog: ["rawPayload", "documentBytes", "internalRationale", "aiDraft"],
  },
  {
    key: "UPLOAD_FAILURE",
    owner: "support",
    safeSignal: "tenant slug, document type, validation reason, role and correlation id",
    severity: "P3",
    mustNotLog: ["rawPayload", "documentBytes", "fullFileName", "extractedText"],
  },
  {
    key: "AUDIT_FAILURE",
    owner: "ops",
    safeSignal: "gate name, target type, result, reason code and correlation id",
    severity: "P1",
    mustNotLog: ["rawPayload", "documentBytes", "internalRationale", "clientNotes"],
  },
  {
    key: "EXPORT_FAILURE",
    owner: "compliance",
    safeSignal: "export request id, redaction profile, payload classification result and correlation id",
    severity: "P1",
    mustNotLog: ["rawPayload", "unredactedExport", "internalRationale", "aiDraft"],
  },
  {
    key: "RELEASE_ATTEMPT",
    owner: "compliance",
    safeSignal: "recommendation id, previous state, next state, gate result and correlation id",
    severity: "P1",
    mustNotLog: ["rawPayload", "internalRationale", "aiDraft", "complianceNotes"],
  },
];

export const pilotEnvironmentBoundaries = {
  allowedDataMode: "demo",
  realClientDataAllowed: false,
  releaseStages: ["local_demo", "docker_demo", "closed_pilot_demo"] as const,
  productionClaim: "not_ga_not_production_ready",
};

export function pilotCriticalEventControlFor(key: PilotCriticalEventKey) {
  return pilotCriticalEventControls.find((control) => control.key === key);
}
