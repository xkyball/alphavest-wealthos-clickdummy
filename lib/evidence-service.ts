import type { Actor } from "@/lib/actor-session";
import type { EvidenceStatus, ObjectType, UUID, VisibilityStatus } from "@/lib/domain-types";

export type EvidenceRecordDraft = {
  clientTenantId: UUID;
  title: string;
  status: EvidenceStatus;
  relatedObjectType: ObjectType;
  relatedObjectId?: UUID;
  visibilityStatus: VisibilityStatus;
  createdByUserId: UUID;
  summary: string;
  demoMode: true;
};

export type EvidenceSufficiencyInput = {
  accepted?: boolean;
  current?: boolean;
  relatedObjectId?: UUID;
  relatedObjectType: ObjectType;
  requiredObjectId?: UUID;
  requiredObjectType: ObjectType;
  reviewed?: boolean;
  status: EvidenceStatus;
  visibilityStatus: VisibilityStatus;
};

export type EvidenceSufficiencyDecision = {
  exportImpact: "EXPORT_ALLOWED_FOR_SCOPED_GATE" | "EXPORT_BLOCKED_NEEDS_EVIDENCE";
  label: "EVIDENCE_SUFFICIENT" | "EVIDENCE_INSUFFICIENT" | "EVIDENCE_REVIEW_PENDING";
  missing: string[];
  releaseImpact: "RELEASE_ALLOWED_FOR_SCOPED_GATE" | "RELEASE_BLOCKED_NEEDS_EVIDENCE";
  sufficient: boolean;
};

export type EvidenceLifecycleStatus =
  | "uploaded"
  | "extraction_pending"
  | "review_pending"
  | "insufficient"
  | "rejected"
  | "linked"
  | "sufficient";

export type EvidenceLifecycleStatusInput = {
  documentStatus?: string | null;
  evidenceStatus?: EvidenceStatus | null;
  extractionStatus?: string | null;
  sufficiencyDecision?: Pick<EvidenceSufficiencyDecision, "sufficient"> | null;
};

export type EvidenceLifecycleStage =
  | "NEEDS_EVIDENCE"
  | "UPLOAD_RECEIVED"
  | "REVIEW_PENDING"
  | "LINKED_NOT_SUFFICIENT"
  | "SUFFICIENT_FOR_SCOPED_GATE";

export type EvidenceLifecycleDecision = {
  canEnterReviewQueue: boolean;
  canSupportComplianceRelease: boolean;
  stage: EvidenceLifecycleStage;
  statusLabel: string;
  missing: string[];
  noUploadToReleaseShortcut: true;
};

const sufficientEvidenceStatuses = new Set<EvidenceStatus>(["VALIDATED", "RELEASED"]);
const evidenceStatusRank: Record<EvidenceStatus, number> = {
  ARCHIVED: 0,
  PLACEHOLDER: 0,
  SUPERSEDED: 0,
  CREATED: 1,
  LINKED: 2,
  VALIDATED: 3,
  RELEASED: 4,
  RESTRICTED: 0,
};

function hasSufficientEvidenceStatus(status: EvidenceStatus) {
  return sufficientEvidenceStatuses.has(status);
}

function evidenceStatusMeetsMinimum(status: EvidenceStatus, minimum: EvidenceStatus) {
  return evidenceStatusRank[status] >= evidenceStatusRank[minimum];
}

function evaluateRequirementSufficiency(input: {
  auditEventId?: UUID | null;
  currentnessConfirmed?: boolean;
  evidenceStatus: EvidenceStatus;
  linked?: boolean;
  minEvidenceStatus?: EvidenceStatus | null;
  relevanceConfirmed?: boolean;
  requireAuditEvent?: boolean;
  reviewed?: boolean;
  scopeMatches?: boolean;
  visibilityStatus: VisibilityStatus;
}): EvidenceSufficiencyDecision {
  const missing: string[] = [];
  const minimum = input.minEvidenceStatus ?? "VALIDATED";

  if (!input.linked) {
    missing.push("evidence_requirement_link");
  }

  if (!input.reviewed) {
    missing.push("evidence_review");
  }

  if (!input.scopeMatches) {
    missing.push("evidence_scope");
  }

  if (!input.relevanceConfirmed) {
    missing.push("evidence_relevance");
  }

  if (!input.currentnessConfirmed) {
    missing.push("evidence_current");
  }

  if (!evidenceStatusMeetsMinimum(input.evidenceStatus, minimum)) {
    missing.push("evidence_status");
  }

  if (input.visibilityStatus === "INTERNAL_ONLY" || input.visibilityStatus === "RESTRICTED") {
    missing.push("client_safe_visibility");
  }

  if (input.requireAuditEvent && !input.auditEventId) {
    missing.push("evidence_decision_audit");
  }

  const uniqueMissing = [...new Set(missing)];
  const sufficient = uniqueMissing.length === 0;

  return {
    exportImpact: sufficient ? "EXPORT_ALLOWED_FOR_SCOPED_GATE" : "EXPORT_BLOCKED_NEEDS_EVIDENCE",
    label: sufficient ? "EVIDENCE_SUFFICIENT" : "EVIDENCE_INSUFFICIENT",
    missing: uniqueMissing,
    releaseImpact: sufficient ? "RELEASE_ALLOWED_FOR_SCOPED_GATE" : "RELEASE_BLOCKED_NEEDS_EVIDENCE",
    sufficient,
  };
}

function createEvidenceRecordDraft(input: {
  actor: Actor;
  clientTenantId: UUID;
  relatedObjectType: ObjectType;
  relatedObjectId?: UUID;
  title: string;
  visibilityStatus?: VisibilityStatus;
}): EvidenceRecordDraft {
  return {
    clientTenantId: input.clientTenantId,
    title: input.title,
    status: "PLACEHOLDER",
    relatedObjectType: input.relatedObjectType,
    relatedObjectId: input.relatedObjectId,
    visibilityStatus: input.visibilityStatus ?? "INTERNAL_ONLY",
    createdByUserId: input.actor.id,
    summary: "Demo evidence placeholder. Database writes start in later workflow stages.",
    demoMode: true,
  };
}

function evaluateEvidenceSufficiency(input: EvidenceSufficiencyInput): EvidenceSufficiencyDecision {
  const missing: string[] = [];

  if (!hasSufficientEvidenceStatus(input.status)) {
    missing.push(input.status === "CREATED" || input.status === "LINKED" ? "evidence_review" : "evidence_status");
  }

  if (!input.reviewed) {
    missing.push("evidence_review");
  }

  if (!input.accepted) {
    missing.push("evidence_acceptance");
  }

  if (!input.current) {
    missing.push("evidence_current");
  }

  if (input.relatedObjectType !== input.requiredObjectType) {
    missing.push("evidence_object_type_scope");
  }

  if (input.requiredObjectId && input.relatedObjectId !== input.requiredObjectId) {
    missing.push("evidence_object_id_scope");
  }

  if (input.visibilityStatus === "INTERNAL_ONLY" || input.visibilityStatus === "RESTRICTED") {
    missing.push("client_safe_visibility");
  }

  const uniqueMissing = [...new Set(missing)];
  const sufficient = uniqueMissing.length === 0;

  return {
    exportImpact: sufficient ? "EXPORT_ALLOWED_FOR_SCOPED_GATE" : "EXPORT_BLOCKED_NEEDS_EVIDENCE",
    label: sufficient
      ? "EVIDENCE_SUFFICIENT"
      : input.status === "CREATED" || input.status === "LINKED"
        ? "EVIDENCE_REVIEW_PENDING"
        : "EVIDENCE_INSUFFICIENT",
    missing: uniqueMissing,
    releaseImpact: sufficient ? "RELEASE_ALLOWED_FOR_SCOPED_GATE" : "RELEASE_BLOCKED_NEEDS_EVIDENCE",
    sufficient,
  };
}

function evaluateEvidenceLifecycle(input: EvidenceSufficiencyInput & { uploaded?: boolean }): EvidenceLifecycleDecision {
  if (!input.uploaded) {
    return {
      canEnterReviewQueue: false,
      canSupportComplianceRelease: false,
      missing: ["source_document_upload"],
      noUploadToReleaseShortcut: true,
      stage: "NEEDS_EVIDENCE",
      statusLabel: "Evidence requested",
    };
  }

  const sufficiency = evaluateEvidenceSufficiency(input);

  if (input.status === "CREATED") {
    return {
      canEnterReviewQueue: true,
      canSupportComplianceRelease: false,
      missing: sufficiency.missing,
      noUploadToReleaseShortcut: true,
      stage: "UPLOAD_RECEIVED",
      statusLabel: "Upload received, review pending",
    };
  }

  if (!input.reviewed) {
    return {
      canEnterReviewQueue: true,
      canSupportComplianceRelease: false,
      missing: sufficiency.missing,
      noUploadToReleaseShortcut: true,
      stage: "REVIEW_PENDING",
      statusLabel: "Evidence review pending",
    };
  }

  if (!sufficiency.sufficient) {
    return {
      canEnterReviewQueue: true,
      canSupportComplianceRelease: false,
      missing: sufficiency.missing,
      noUploadToReleaseShortcut: true,
      stage: "LINKED_NOT_SUFFICIENT",
      statusLabel: "Linked evidence is not sufficient",
    };
  }

  return {
    canEnterReviewQueue: true,
    canSupportComplianceRelease: true,
    missing: [],
    noUploadToReleaseShortcut: true,
    stage: "SUFFICIENT_FOR_SCOPED_GATE",
    statusLabel: "Evidence ready for scoped gate",
  };
}

function evidenceLifecycleStatusForDocument(input: EvidenceLifecycleStatusInput): EvidenceLifecycleStatus {
  if (input.sufficiencyDecision?.sufficient || input.evidenceStatus === "VALIDATED" || input.evidenceStatus === "RELEASED") {
    return "sufficient";
  }

  if (input.documentStatus === "BLOCKED") {
    return "rejected";
  }

  if (input.documentStatus === "NEEDS_CLARIFICATION" || input.evidenceStatus === "RESTRICTED") {
    return "insufficient";
  }

  if (input.evidenceStatus === "LINKED" || input.documentStatus === "LINKED_TO_EVIDENCE" || input.documentStatus === "VERIFIED") {
    return "linked";
  }

  if (input.extractionStatus === "pending") {
    return "extraction_pending";
  }

  if (input.documentStatus === "UPLOADED" || input.evidenceStatus === "CREATED") {
    return "review_pending";
  }

  return "uploaded";
}

export const evidenceService = {
  createEvidenceRecordDraft,
  evidenceStatusMeetsMinimum,
  evidenceLifecycleStatusForDocument,
  evaluateEvidenceLifecycle,
  evaluateEvidenceSufficiency,
  evaluateRequirementSufficiency,
  hasSufficientEvidenceStatus,
};
