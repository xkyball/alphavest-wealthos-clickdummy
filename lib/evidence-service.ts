import type { DemoActor } from "@/lib/demo-session";
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

const sufficientEvidenceStatuses = new Set<EvidenceStatus>(["VALIDATED", "RELEASED"]);

function hasSufficientEvidenceStatus(status: EvidenceStatus) {
  return sufficientEvidenceStatuses.has(status);
}

function createEvidenceRecordDraft(input: {
  actor: DemoActor;
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
    summary: "Demo evidence placeholder. Database writes start in later workflow phases.",
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

export const evidenceService = {
  createEvidenceRecordDraft,
  evaluateEvidenceSufficiency,
  hasSufficientEvidenceStatus,
};
