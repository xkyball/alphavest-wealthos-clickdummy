import {
  AuditResult,
  DocumentStatus,
  EvidenceStatus,
  ObjectType,
  ReviewStatus,
  type PrismaClient,
  VisibilityStatus,
} from "@prisma/client";

import { demoPlatformTenantId, requireDemoSession, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";
import { evidenceService, type EvidenceSufficiencyDecision } from "@/lib/evidence-service";
import { permissionEngine } from "@/lib/permission-engine";

const reviewerRoleAllowlist = new Set<DemoRoleKey>(["analyst", "senior_wealth_advisor", "compliance_officer"]);

export type EvidenceReviewAction = "mark_reviewed" | "request_clarification" | "accept_sufficiency";

export type ReviewDocumentEvidenceInput = {
  action: EvidenceReviewAction;
  clientSafeAccepted?: boolean;
  currentAccepted?: boolean;
  documentId: string;
  notes?: string;
  relevanceAccepted?: boolean;
  requiredObjectId?: string;
  roleKey: DemoRoleKey;
  scopeAccepted?: boolean;
  tenantSlug: DemoTenantSlug;
};

export class EvidenceReviewValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super("Invalid evidence review request.");
  }
}

export class EvidenceReviewPermissionError extends Error {
  constructor(
    public readonly reason: string,
    public readonly auditEventId: string,
  ) {
    super(reason);
  }
}

export class EvidenceReviewNotFoundError extends Error {
  constructor() {
    super("Document is not available for evidence review.");
  }
}

export class EvidenceReviewInsufficientError extends Error {
  constructor(
    public readonly decision: EvidenceSufficiencyDecision,
    public readonly auditEventId: string,
  ) {
    super("Evidence cannot satisfy the scoped gate.");
  }
}

function validateInput(input: ReviewDocumentEvidenceInput) {
  const issues: string[] = [];

  if (!input.documentId.trim()) {
    issues.push("document_id_required");
  }

  if (!reviewerRoleAllowlist.has(input.roleKey)) {
    issues.push("reviewer_role_required");
  }

  if (input.notes && input.notes.length > 1000) {
    issues.push("notes_too_long");
  }

  if (input.action === "accept_sufficiency") {
    if (!input.relevanceAccepted) issues.push("relevance_acceptance_required");
    if (!input.currentAccepted) issues.push("current_acceptance_required");
    if (!input.scopeAccepted) issues.push("scope_acceptance_required");
    if (!input.clientSafeAccepted) issues.push("client_safe_acceptance_required");
  }

  if (issues.length > 0) {
    throw new EvidenceReviewValidationError(issues);
  }
}

async function writeDeniedAudit(
  prisma: PrismaClient,
  input: {
    actorRoleKey: string;
    actorUserId: string;
    clientTenantId: string;
    documentId: string;
    eventType: string;
    reason: string;
  },
) {
  return prisma.auditEvent.create({
    data: {
      actorRoleKey: input.actorRoleKey,
      actorUserId: input.actorUserId,
      clientTenantId: input.clientTenantId,
      eventType: input.eventType,
      metadataJson: { demoMode: true, phase: "mvp-phase-3" },
      nextState: DocumentStatus.UPLOADED,
      platformTenantId: demoPlatformTenantId,
      previousState: DocumentStatus.UPLOADED,
      reason: input.reason,
      result: AuditResult.DENIED,
      targetId: input.documentId,
      targetType: ObjectType.DOCUMENT,
    },
  });
}

export async function reviewDocumentEvidence(prisma: PrismaClient, input: ReviewDocumentEvidenceInput) {
  validateInput(input);

  const session = requireDemoSession({ roleKey: input.roleKey, tenantSlug: input.tenantSlug });
  const document = await prisma.document.findFirst({
    include: {
      extractions: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    where: {
      clientTenantId: session.tenant.id,
      id: input.documentId,
    },
  });

  if (!document) {
    throw new EvidenceReviewNotFoundError();
  }

  const evidenceRecord = await prisma.evidenceRecord.findFirst({
    where: {
      clientTenantId: session.tenant.id,
      relatedObjectId: document.id,
      relatedObjectType: ObjectType.DOCUMENT,
    },
  });

  if (!evidenceRecord) {
    throw new EvidenceReviewValidationError(["evidence_record_required"]);
  }

  const permissionAction = input.action === "accept_sufficiency" ? "APPROVE" : "REVIEW";
  const permissionObjectType = input.action === "accept_sufficiency" ? "EVIDENCE_RECORD" : "DOCUMENT";
  const permission = permissionEngine.can(
    session.actor,
    permissionAction,
    {
      clientTenantId: session.tenant.id,
      objectId: input.action === "accept_sufficiency" ? evidenceRecord.id : document.id,
      objectType: permissionObjectType,
      sensitivity: document.sensitivity,
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: document.status,
    },
    {
      clientTenantId: session.tenant.id,
      platformTenantId: demoPlatformTenantId,
      sensitivity: document.sensitivity,
      workflowState: document.status,
    },
    session.role,
  );

  if (!permission.allowed || !reviewerRoleAllowlist.has(input.roleKey)) {
    const reason = !reviewerRoleAllowlist.has(input.roleKey)
      ? `${session.role.label} cannot review evidence in the current demo policy.`
      : permission.reason;
    const audit = await writeDeniedAudit(prisma, {
      actorRoleKey: session.role.key,
      actorUserId: session.actor.id,
      clientTenantId: session.tenant.id,
      documentId: document.id,
      eventType: "document.evidence_review.denied",
      reason,
    });

    throw new EvidenceReviewPermissionError(reason, audit.id);
  }

  const now = new Date();
  const reviewStatus = input.action === "request_clarification" ? ReviewStatus.REQUEST_MORE_DATA : ReviewStatus.APPROVED;
  const nextDocumentStatus =
    input.action === "request_clarification"
      ? DocumentStatus.NEEDS_CLARIFICATION
      : input.action === "accept_sufficiency"
        ? DocumentStatus.LINKED_TO_EVIDENCE
        : DocumentStatus.VERIFIED;
  const nextEvidenceStatus = input.action === "accept_sufficiency" ? EvidenceStatus.VALIDATED : EvidenceStatus.LINKED;
  const visibilityStatus = input.action === "accept_sufficiency" ? VisibilityStatus.REDACTED : VisibilityStatus.INTERNAL_ONLY;
  const relatedObjectId = input.requiredObjectId ?? document.id;
  const sufficiencyDecision = evidenceService.evaluateEvidenceSufficiency({
    accepted: input.action === "accept_sufficiency",
    current: input.currentAccepted,
    relatedObjectId: document.id,
    relatedObjectType: "DOCUMENT",
    requiredObjectId: relatedObjectId,
    requiredObjectType: "DOCUMENT",
    reviewed: input.action !== "request_clarification",
    status: nextEvidenceStatus,
    visibilityStatus,
  });

  if (input.action === "accept_sufficiency" && !sufficiencyDecision.sufficient) {
    const audit = await prisma.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: session.tenant.id,
        eventType: "document.evidence_sufficiency.blocked",
        evidenceRecordId: evidenceRecord.id,
        metadataJson: {
          demoMode: true,
          missing: sufficiencyDecision.missing,
          phase: "mvp-phase-3",
        },
        nextState: evidenceRecord.status,
        platformTenantId: demoPlatformTenantId,
        previousState: evidenceRecord.status,
        reason: "Evidence acceptance was blocked because scoped sufficiency checks did not pass.",
        result: AuditResult.BLOCKED,
        targetId: evidenceRecord.id,
        targetType: ObjectType.EVIDENCE_RECORD,
      },
    });

    throw new EvidenceReviewInsufficientError(sufficiencyDecision, audit.id);
  }

  return prisma.$transaction(async (tx) => {
    const review = await tx.documentReview.create({
      data: {
        clientVisibleSummary:
          input.action === "accept_sufficiency"
            ? "Document evidence reviewed and accepted for scoped gate support."
            : null,
        documentId: document.id,
        notes: input.notes?.trim() || null,
        reviewType: input.action === "accept_sufficiency" ? "Evidence sufficiency acceptance" : "Extraction review",
        reviewedAt: reviewStatus === ReviewStatus.APPROVED ? now : null,
        reviewerUserId: session.actor.id,
        status: reviewStatus,
      },
    });
    const updatedDocument = await tx.document.update({
      data: {
        status: nextDocumentStatus,
      },
      where: { id: document.id },
    });
    const extraction = document.extractions[0]
      ? await tx.documentExtraction.update({
          data: {
            extractionStatus: input.action === "request_clarification" ? "needs_clarification" : "reviewed",
            isClientVisible: false,
            lowConfidenceFieldsJson:
              input.action === "request_clarification"
                ? { reviewerNote: input.notes?.trim() || "Clarification requested." }
                : {},
          },
          where: { id: document.extractions[0].id },
        })
      : null;
    const link = await tx.documentLink.create({
      data: {
        createdByUserId: session.actor.id,
        documentId: document.id,
        relationship: input.action === "accept_sufficiency" ? "sufficiency_support" : "review_link",
        targetId: evidenceRecord.id,
        targetType: ObjectType.EVIDENCE_RECORD,
      },
    });
    const updatedEvidence = await tx.evidenceRecord.update({
      data: {
        status: nextEvidenceStatus,
        summary:
          input.action === "accept_sufficiency"
            ? "Reviewed, scoped, current and client-safe evidence accepted for this specific gate. No client release occurred."
            : "Document reviewed and linked. Evidence still requires compliance acceptance before sufficiency.",
        visibilityStatus,
      },
      where: { id: evidenceRecord.id },
    });
    const evidenceItem = await tx.evidenceItem.create({
      data: {
        evidenceRecordId: evidenceRecord.id,
        itemType: input.action === "accept_sufficiency" ? "evidence_sufficiency_review" : "document_review",
        sourceObjectId: review.id,
        sourceObjectType: ObjectType.DOCUMENT,
        title:
          input.action === "accept_sufficiency"
            ? "Compliance evidence sufficiency acceptance"
            : "Document extraction review",
        visibilityStatus,
      },
    });
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: session.tenant.id,
        eventType:
          input.action === "accept_sufficiency"
            ? "document.evidence_sufficiency.accepted"
            : input.action === "request_clarification"
              ? "document.evidence_review.clarification_requested"
              : "document.evidence_review.linked",
        evidenceRecordId: evidenceRecord.id,
        metadataJson: {
          demoMode: true,
          documentLinkId: link.id,
          evidenceItemId: evidenceItem.id,
          extractionId: extraction?.id ?? null,
          noClientRelease: true,
          permission,
          phase: "mvp-phase-3",
          sufficiencyDecision,
        },
        nextState: updatedEvidence.status,
        platformTenantId: demoPlatformTenantId,
        previousState: evidenceRecord.status,
        reason:
          input.action === "accept_sufficiency"
            ? "Reviewed, linked, relevant, current and scoped evidence accepted without client release."
            : "Document review state recorded without evidence sufficiency or client release.",
        result: AuditResult.SUCCESS,
        targetId: input.action === "accept_sufficiency" ? evidenceRecord.id : document.id,
        targetType: input.action === "accept_sufficiency" ? ObjectType.EVIDENCE_RECORD : ObjectType.DOCUMENT,
      },
    });

    return {
      auditEventId: audit.id,
      documentId: updatedDocument.id,
      documentLinkId: link.id,
      documentStatus: updatedDocument.status,
      evidenceItemId: evidenceItem.id,
      evidenceRecordId: updatedEvidence.id,
      evidenceStatus: updatedEvidence.status,
      evidenceVisibilityStatus: updatedEvidence.visibilityStatus,
      extractionId: extraction?.id ?? null,
      reviewId: review.id,
      reviewStatus: review.status,
      safety: {
        clientVisible: false,
        evidenceSufficiency: sufficiencyDecision.sufficient,
        exportUnlocked: false,
        gateSupport: sufficiencyDecision.sufficient,
        noClientRelease: true,
        releaseUnlocked: false,
        uploadOnly: false,
      },
      sufficiencyDecision,
    };
  });
}
