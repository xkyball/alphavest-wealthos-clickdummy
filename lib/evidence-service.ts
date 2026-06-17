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

export const evidenceService = {
  createEvidenceRecordDraft,
};

