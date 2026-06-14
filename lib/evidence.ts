import type { Role } from "./roles";

export type EvidenceObjectType =
  | "Document File"
  | "Extraction Record"
  | "Analyst Note"
  | "Recommendation Draft"
  | "Approval Record"
  | "Compliance Release Record"
  | "Decision Record"
  | "Communication Record"
  | "Access Change Record"
  | "Call Schedule"
  | "Call Outcome";

export type EvidenceVisibility = "Client/Internal by policy" | "Client/Internal" | "Internal-only" | "Participants";

export type EvidenceEventName =
  | "document.uploaded"
  | "extraction.confirmed"
  | "note.added"
  | "recommendation.drafted"
  | "advice.approved"
  | "compliance.released"
  | "compliance.blocked"
  | "client.viewed"
  | "decision.submitted"
  | "communication.sent"
  | "access.changed"
  | "access.blocked"
  | "call.scheduled"
  | "call.completed";

export type EvidenceRecord = {
  id: string;
  event: EvidenceEventName;
  objectType: EvidenceObjectType;
  actorRole: Role;
  objectId: string;
  visibility: EvidenceVisibility;
  reviewNeeded: "No" | "Spot review" | "Advisor review" | "Compliance if applicable";
  link: string;
};

export function createEvidenceLink(objectType: EvidenceObjectType, objectId: string) {
  return `evidence://${objectType.toLowerCase().replaceAll(" ", "-")}/${objectId}`;
}

export function createEvidenceRecord(input: Omit<EvidenceRecord, "link">) {
  return {
    ...input,
    link: createEvidenceLink(input.objectType, input.objectId)
  } satisfies EvidenceRecord;
}

export const evidenceEventTemplates: Record<EvidenceEventName, Pick<EvidenceRecord, "objectType" | "visibility" | "reviewNeeded">> = {
  "document.uploaded": {
    objectType: "Document File",
    visibility: "Client/Internal by policy",
    reviewNeeded: "No"
  },
  "extraction.confirmed": {
    objectType: "Extraction Record",
    visibility: "Internal-only",
    reviewNeeded: "Spot review"
  },
  "note.added": {
    objectType: "Analyst Note",
    visibility: "Internal-only",
    reviewNeeded: "No"
  },
  "recommendation.drafted": {
    objectType: "Recommendation Draft",
    visibility: "Internal-only",
    reviewNeeded: "Advisor review"
  },
  "advice.approved": {
    objectType: "Approval Record",
    visibility: "Internal-only",
    reviewNeeded: "No"
  },
  "compliance.released": {
    objectType: "Compliance Release Record",
    visibility: "Internal-only",
    reviewNeeded: "No"
  },
  "compliance.blocked": {
    objectType: "Compliance Release Record",
    visibility: "Internal-only",
    reviewNeeded: "No"
  },
  "client.viewed": {
    objectType: "Decision Record",
    visibility: "Client/Internal",
    reviewNeeded: "No"
  },
  "decision.submitted": {
    objectType: "Decision Record",
    visibility: "Client/Internal",
    reviewNeeded: "Compliance if applicable"
  },
  "communication.sent": {
    objectType: "Communication Record",
    visibility: "Client/Internal by policy",
    reviewNeeded: "No"
  },
  "access.changed": {
    objectType: "Access Change Record",
    visibility: "Internal-only",
    reviewNeeded: "No"
  },
  "access.blocked": {
    objectType: "Access Change Record",
    visibility: "Internal-only",
    reviewNeeded: "No"
  },
  "call.scheduled": {
    objectType: "Call Schedule",
    visibility: "Participants",
    reviewNeeded: "No"
  },
  "call.completed": {
    objectType: "Call Outcome",
    visibility: "Participants",
    reviewNeeded: "Spot review"
  }
};

export function evidenceForEvent(event: EvidenceEventName, input: { actorRole: Role; objectId: string; id?: string }) {
  const template = evidenceEventTemplates[event];

  return createEvidenceRecord({
    id: input.id ?? `${event}-${input.objectId}`,
    event,
    objectType: template.objectType,
    actorRole: input.actorRole,
    objectId: input.objectId,
    visibility: template.visibility,
    reviewNeeded: template.reviewNeeded
  });
}
