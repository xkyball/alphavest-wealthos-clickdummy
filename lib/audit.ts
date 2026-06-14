import type { EvidenceObjectType } from "./evidence";
import { createEvidenceLink } from "./evidence";
import type { Role } from "./roles";

export type AuditEvent = {
  timestamp: string;
  actorId: string;
  actorRole: Role;
  sourceIp: string;
  device: string;
  action: string;
  objectType: EvidenceObjectType;
  objectId: string;
  correlationId: string;
  result: "created" | "updated" | "blocked" | "released" | "viewed";
  evidenceLink: string;
  digitalSeal: string;
};

export function createAuditEvent(input: Partial<Pick<AuditEvent, "actorId" | "sourceIp" | "device" | "correlationId" | "digitalSeal">> & Omit<AuditEvent, "timestamp" | "actorId" | "sourceIp" | "device" | "correlationId" | "digitalSeal">) {
  return {
    timestamp: "2026-06-14T00:00:00.000Z",
    actorId: input.actorId ?? "demo-user",
    sourceIp: input.sourceIp ?? "127.0.0.1",
    device: input.device ?? "click-dummy",
    correlationId: input.correlationId ?? `corr-${input.objectId}`,
    digitalSeal: input.digitalSeal ?? `seal-${input.objectId}`,
    ...input
  } satisfies AuditEvent;
}

export function auditEventForAction(input: {
  actorRole: Role;
  action: string;
  objectType: EvidenceObjectType;
  objectId: string;
  result: AuditEvent["result"];
}) {
  return createAuditEvent({
    ...input,
    evidenceLink: createEvidenceLink(input.objectType, input.objectId)
  });
}
