import {
  createAuditEvent,
  type AuditEvent
} from "./audit";
import {
  createEvidenceLink,
  type EvidenceObjectType
} from "./evidence";
import { evaluatePermission } from "./permissions";
import type { Role } from "./roles";
import {
  canShowClientAdviceLikeOutput,
  evaluateClientVisibility,
  type ReleaseState
} from "./visibility";

export type ClientRouteState = "default" | "loading" | "empty" | "error" | "blocked";

export type ClientAction = {
  id: string;
  title: string;
  summary: string;
  status: "Needs Review" | "Blocked" | "Ready" | "Pending" | "Completed";
  owner: string;
  due: string;
  relatedObject: string;
  evidenceStatus: "Linked" | "Missing" | "Pending";
  triggers: Array<"CALL" | "F2F" | "EVIDENCE" | "REVIEW">;
  href?: string;
};

export type EvidenceRecord = {
  id: string;
  title: string;
  type: EvidenceObjectType;
  status: "Validated" | "Under Review" | "Missing" | "Restricted";
  visibility: "Client Visible" | "Internal Only";
  linkedTo: string;
  auditAction: string;
  restricted?: boolean;
};

export const releasedRecommendation: ReleaseState = {
  advisorApproval: true,
  complianceRelease: true,
  evidenceRecordExists: true,
  permissionCheck: true,
  clientVisibilityState: "released"
};

export const blockedRecommendation: ReleaseState = {
  advisorApproval: true,
  complianceRelease: false,
  evidenceRecordExists: true,
  permissionCheck: true,
  clientVisibilityState: "blocked"
};

export const clientActions: ClientAction[] = [
  {
    id: "act-trust-deed",
    title: "Upload updated trust deed",
    summary: "Required before Trust X review can be completed.",
    status: "Blocked",
    owner: "Principal",
    due: "18 Jun 2026",
    relatedObject: "Trust X",
    evidenceStatus: "Missing",
    triggers: ["EVIDENCE", "REVIEW"],
    href: "/mobile/upload"
  },
  {
    id: "act-insurance",
    title: "Review insurance cover",
    summary: "Advisor needs current policy schedule before the coverage review.",
    status: "Needs Review",
    owner: "Family CFO",
    due: "21 Jun 2026",
    relatedObject: "Insurance portfolio",
    evidenceStatus: "Pending",
    triggers: ["CALL", "EVIDENCE"]
  },
  {
    id: "act-decision",
    title: "Confirm Trust X beneficiary update",
    summary: "Released decision pack is ready for family approval.",
    status: "Ready",
    owner: "Principal",
    due: "24 Jun 2026",
    relatedObject: "Digital Decision Room",
    evidenceStatus: "Linked",
    triggers: ["EVIDENCE", "REVIEW"],
    href: "/decisions"
  }
];

export const evidenceRecords: EvidenceRecord[] = [
  {
    id: "evidence-trust-deed",
    title: "Trust X deed verification",
    type: "Document File",
    status: "Validated",
    visibility: "Client Visible",
    linkedTo: "Trust X",
    auditAction: "document.uploaded"
  },
  {
    id: "evidence-decision-pack",
    title: "Decision pack release record",
    type: "Decision Record",
    status: "Validated",
    visibility: "Client Visible",
    linkedTo: "Beneficiary update",
    auditAction: "decision.submitted"
  },
  {
    id: "evidence-beneficiary-note",
    title: "Beneficiary conflict analyst note",
    type: "Analyst Note",
    status: "Restricted",
    visibility: "Internal Only",
    linkedTo: "Trustee / beneficiary escalation",
    auditAction: "note.added",
    restricted: true
  },
  {
    id: "evidence-missing-tax",
    title: "2026 tax residency certificate",
    type: "Document File",
    status: "Missing",
    visibility: "Internal Only",
    linkedTo: "Residency review",
    auditAction: "document.requested"
  }
];

export const decisionRelease = evaluateClientVisibility(releasedRecommendation);
export const blockedDecisionRelease = evaluateClientVisibility(blockedRecommendation);

export function canShowAdviceLikeContent(release: ReleaseState) {
  return canShowClientAdviceLikeOutput({
    advisorApproval: release.advisorApproval,
    complianceRelease: release.complianceRelease,
    evidenceRecord: release.evidenceRecordExists,
    permissionCheck: release.permissionCheck,
    outputClassification: "decision_pack",
    clientVisibilityState: release.clientVisibilityState
  }).clientVisible;
}

export function sensitiveNodeAccess(role: Role = "Next Gen") {
  return evaluatePermission({
    role,
    action: "view_restricted_evidence",
    objectSensitive: true,
    relationshipAllowed: role !== "Next Gen",
    secondConfirmation: role !== "Next Gen"
  });
}

export function decisionPermission(role: Role = "Principal") {
  return evaluatePermission({
    role,
    action: "view_client_dashboard",
    relationshipAllowed: role !== "External Advisor"
  });
}

export function evidenceAccess(record: EvidenceRecord, role: Role = "Principal") {
  if (!record.restricted) {
    return { allowed: true, reason: "allowed" } as const;
  }

  return evaluatePermission({
    role,
    action: "view_restricted_evidence",
    objectSensitive: true,
    secondConfirmation: true
  });
}

export function evidenceLinkFor(record: EvidenceRecord) {
  return createEvidenceLink(record.type, record.id);
}

export function auditForRecord(record: EvidenceRecord): AuditEvent {
  return createAuditEvent({
    actorRole: "Principal",
    action: record.auditAction,
    objectType: record.type,
    objectId: record.id,
    result: record.status === "Missing" ? "blocked" : "viewed",
    evidenceLink: evidenceLinkFor(record)
  });
}

export function decisionSubmissionAudit(result: "accepted" | "deferred" | "rejected") {
  const evidenceLink = createEvidenceLink("Decision Record", `trust-x-${result}`);

  return createAuditEvent({
    actorRole: "Principal",
    action: "decision.submitted",
    objectType: "Decision Record",
    objectId: `trust-x-${result}`,
    result: "created",
    evidenceLink
  });
}
