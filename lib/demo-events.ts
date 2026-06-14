import { auditEventForAction } from "./audit";
import { evidenceForEvent } from "./evidence";

export const demoGovernanceEvidence = evidenceForEvent("access.changed", {
  actorRole: "Principal",
  objectId: "access-772"
});

export const demoGovernanceAudit = auditEventForAction({
  actorRole: "Principal",
  action: "access.changed",
  objectType: "Access Change Record",
  objectId: "access-772",
  result: "updated"
});

export const demoDecisionEvidence = evidenceForEvent("decision.submitted", {
  actorRole: "Principal",
  objectId: "trust-x-accepted"
});
