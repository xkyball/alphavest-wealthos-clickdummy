import { createHash } from "node:crypto";
import {
  AuditResult,
  ComplianceStatus,
  DecisionStatus,
  EvidenceStatus,
  ObjectType,
  type Prisma,
  type PrismaClient,
  RecommendationStatus,
  ReviewStatus,
  VisibilityStatus,
  WorkflowStatus,
} from "@prisma/client";

import { dataQualityService } from "@/lib/data-quality-service";
import type {
  AdviceReleaseHistoryWorkflowAction,
} from "@/lib/advice-release-history-action-contract";
import {
  adviceReleaseHistoryCanonicalApiRoute,
  adviceReleaseHistoryCommandForAction,
  isAdviceReleaseHistoryWorkflowAction,
} from "@/lib/advice-release-history-action-contract";
import type { PermissionDecision } from "@/lib/permission-engine";
import { stableId } from "@/lib/stable-id";
import { runTypedWorkflowMutation } from "@/lib/typed-workflow-command-bus";
import { workflowGate } from "@/lib/workflow-gate";
import type {
  ComplianceStatus as DomainComplianceStatus,
  EvidenceStatus as DomainEvidenceStatus,
  RecommendationStatus as DomainRecommendationStatus,
  ReviewStatus as DomainReviewStatus,
} from "@/lib/domain-types";

export {
  adviceReleaseHistoryCanonicalApiRoute,
  adviceReleaseHistoryCommandForAction,
  isAdviceReleaseHistoryWorkflowAction,
};

type AdviceReleaseHistoryActionOptions = {
  auditPersistenceAvailable?: boolean;
};

const bennettTenantId = tenantId("bennett");
const bennettRecommendationId = recommendationId("bennett");
const bennettApprovalId = approvalId("bennett");
const bennettComplianceReviewId = complianceReviewId("bennett");
const bennettDecisionId = decisionId("bennett");
const bennettEvidenceRecordId = evidenceRecordId("bennett");
const morganTenantId = tenantId("morgan");
const morganRecommendationId = recommendationId("morgan");
const morganComplianceReviewId = complianceReviewId("morgan");
const morganEvidenceRecordId = evidenceRecordId("morgan");
const summitTenantId = tenantId("summit");
const summitRecommendationId = recommendationId("summit");
const summitApprovalId = approvalId("summit");
const summitComplianceReviewId = complianceReviewId("summit");
const summitEvidenceRecordId = evidenceRecordId("summit");

function stableEvidenceHash(label: string) {
  return createHash("sha256").update(`alphavest-wealthos:${label}`).digest("hex");
}

function tenantId(slug: string) {
  return stableId(`tenant:${slug}`);
}

function userId(key: string) {
  return stableId(`user:${key}`);
}

function actionItemId(slug: string, key: string) {
  return stableId(`action:${slug}:${key}`);
}

function recommendationId(slug: string) {
  return stableId(`recommendation:${slug}:liquidity-review`);
}

function approvalId(slug: string) {
  return stableId(`approval:${slug}:advisor`);
}

function complianceReviewId(slug: string) {
  return stableId(`compliance:${slug}:liquidity-review`);
}

function decisionId(slug: string) {
  return stableId(`decision:${slug}:liquidity-review`);
}

function evidenceRecordId(slug: string) {
  return stableId(`evidence:${slug}:decision-pack`);
}

async function runJ02RequestEvidence(
  prisma: PrismaClient,
  actionId: Extract<AdviceReleaseHistoryWorkflowAction, "j02.requestEvidence" | "j02.confirmRequestEvidence">,
) {
  const now = new Date();
  const isConfirmation = actionId === "j02.confirmRequestEvidence";

  return runTypedWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "compliance_officer",
      auditResult: AuditResult.PENDING,
      clientTenantId: morganTenantId,
      eventType: isConfirmation
        ? "advice_release_history.compliance.confirm_request_evidence"
        : "advice_release_history.compliance.request_evidence",
      evidenceRecordId: morganEvidenceRecordId,
      metadataJson: {
        command: adviceReleaseHistoryCommandForAction(actionId),
        releaseBlocked: true,
        workflowGateEnforced: true,
      },
      nextState: ComplianceStatus.NEEDS_EVIDENCE,
      permissionAction: "BLOCK",
      previousState: ComplianceStatus.NEEDS_EVIDENCE,
      reason: "Compliance requested missing evidence before client release.",
      targetId: morganRecommendationId,
      targetType: ObjectType.RECOMMENDATION,
      tenantSlug: "morgan",
      visibilityStatus: "COMPLIANCE_VISIBLE",
      workflowState: "COMPLIANCE_PENDING",
    },
    async (tx) => {
      const complianceReview = await tx.complianceReview.updateMany({
        where: { id: morganComplianceReviewId, clientTenantId: morganTenantId },
        data: {
          blockedAt: null,
          evidenceComplete: false,
          releaseNotes: "Compliance requested ROA, refreshed tax certificate and source proof.",
          releasedAt: null,
          status: ComplianceStatus.NEEDS_EVIDENCE,
        },
      });
      const recommendation = await tx.recommendation.updateMany({
        where: { id: morganRecommendationId, clientTenantId: morganTenantId },
        data: {
          clientVisible: false,
          status: RecommendationStatus.COMPLIANCE_PENDING,
        },
      });
      const evidenceRecord = await tx.evidenceRecord.updateMany({
        where: { id: morganEvidenceRecordId, clientTenantId: morganTenantId },
        data: {
          status: EvidenceStatus.PLACEHOLDER,
          summary:
            "Compliance requested missing evidence. The recommendation remains hidden from the client.",
          visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: morganEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: isConfirmation ? "compliance_request_confirmed" : "compliance_request",
          sourceObjectId: morganRecommendationId,
          sourceObjectType: ObjectType.RECOMMENDATION,
          title: isConfirmation
            ? "Compliance evidence request confirmed"
            : "Compliance evidence request recorded",
          visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
        },
      });

      return {
        clientVisible: false,
        complianceReviewRows: complianceReview.count,
        evidenceItemId: evidenceItem.id,
        evidenceRecordRows: evidenceRecord.count,
        gatePassed: false,
        message: "Compliance evidence request saved. Client visibility remains blocked.",
        recommendationRows: recommendation.count,
      };
    },
  );
}

async function runJ02BlockRelease(prisma: PrismaClient, actionId: "j02.blockRelease") {
  const now = new Date();

  return runTypedWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "compliance_officer",
      auditResult: AuditResult.BLOCKED,
      clientTenantId: morganTenantId,
      eventType: "advice_release_history.compliance.block_release",
      evidenceRecordId: morganEvidenceRecordId,
      metadataJson: {
        clientVisible: false,
        command: adviceReleaseHistoryCommandForAction(actionId),
        workflowGateEnforced: true,
      },
      nextState: ComplianceStatus.BLOCKED,
      permissionAction: "BLOCK",
      previousState: ComplianceStatus.NEEDS_EVIDENCE,
      reason: "Compliance blocked release because required evidence is incomplete.",
      targetId: morganRecommendationId,
      targetType: ObjectType.RECOMMENDATION,
      tenantSlug: "morgan",
      visibilityStatus: "COMPLIANCE_VISIBLE",
      workflowState: "COMPLIANCE_PENDING",
    },
    async (tx) => {
      const complianceReview = await tx.complianceReview.updateMany({
        where: { id: morganComplianceReviewId, clientTenantId: morganTenantId },
        data: {
          blockedAt: now,
          evidenceComplete: false,
          releaseNotes:
            "Client release blocked until missing compliance evidence is supplied.",
          releasedAt: null,
          status: ComplianceStatus.BLOCKED,
        },
      });
      const recommendation = await tx.recommendation.updateMany({
        where: { id: morganRecommendationId, clientTenantId: morganTenantId },
        data: {
          clientVisible: false,
          status: RecommendationStatus.BLOCKED,
        },
      });
      const actionItem = await tx.actionItem.updateMany({
        where: {
          clientTenantId: morganTenantId,
          id: actionItemId("morgan", "blocked-release"),
        },
        data: {
          blockedReason: "Compliance block recorded. Release requires missing evidence.",
          clientVisible: false,
          evidenceStatus: EvidenceStatus.RESTRICTED,
          status: WorkflowStatus.BLOCKED,
        },
      });
      const evidenceRecord = await tx.evidenceRecord.updateMany({
        where: { id: morganEvidenceRecordId, clientTenantId: morganTenantId },
        data: {
          status: EvidenceStatus.RESTRICTED,
          summary:
            "Compliance block proof. Missing ROA/tax/source evidence prevents client visibility.",
          visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: morganEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: "compliance_block",
          sourceObjectId: morganRecommendationId,
          sourceObjectType: ObjectType.RECOMMENDATION,
          title: "Compliance release block recorded",
          visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
        },
      });

      return {
        actionItemRows: actionItem.count,
        clientVisible: false,
        complianceReviewRows: complianceReview.count,
        evidenceItemId: evidenceItem.id,
        evidenceRecordRows: evidenceRecord.count,
        gatePassed: false,
        message: "Compliance block saved. No client visibility was created.",
        recommendationRows: recommendation.count,
      };
    },
  );
}

async function runJ02ReleaseClient(
  prisma: PrismaClient,
  actionId: "j02.releaseClient",
  options: AdviceReleaseHistoryActionOptions = {},
) {
  const now = new Date();

  return runTypedWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "compliance_officer",
      auditPersistenceAvailable: options.auditPersistenceAvailable,
      auditResult: AuditResult.SUCCESS,
      clientTenantId: summitTenantId,
      eventType: "advice_release_history.compliance.release_client",
      evidenceRecordId: summitEvidenceRecordId,
      metadataJson: {
        command: adviceReleaseHistoryCommandForAction(actionId),
        workflowGateEnforced: true,
        workflowGateStage: "before_client_visibility",
      },
      nextState: ComplianceStatus.RELEASED,
      permissionAction: "RELEASE",
      previousState: ComplianceStatus.PENDING,
      reason: "Compliance released the recommendation after workflowGate passed.",
      targetId: summitRecommendationId,
      targetType: ObjectType.RECOMMENDATION,
      tenantSlug: "summit",
      visibilityStatus: "COMPLIANCE_VISIBLE",
      workflowState: "COMPLIANCE_PENDING",
    },
    async (tx, { permission }) => {
      const [approval, evidenceRecord] = await Promise.all([
        tx.approval.findFirst({
          where: {
            clientTenantId: summitTenantId,
            id: summitApprovalId,
            targetId: summitRecommendationId,
            targetType: ObjectType.RECOMMENDATION,
          },
        }),
        tx.evidenceRecord.findFirst({
          where: { id: summitEvidenceRecordId, clientTenantId: summitTenantId },
        }),
      ]);

      if (!approval || !evidenceRecord) {
        throw new Error("J02 release fixture is incomplete.");
      }

      const dataQualitySnapshot = await dataQualityService.buildDataQualitySnapshot(tx, {
        clientTenantId: summitTenantId,
      });
      const dataQualityGate = dataQualityService.evaluateDataQualityReleaseGate(dataQualitySnapshot);

      const gate = workflowGate.canBecomeClientVisible({
        advisorApprovalStatus: approval.status as DomainReviewStatus,
        complianceStatus: "RELEASED",
        dataQualityGate,
        evidenceStatus: evidenceRecord.status as DomainEvidenceStatus,
        permission,
        recommendationStatus: "RELEASED_TO_CLIENT",
      });

      if (!gate.passed) {
        throw new Error(`workflowGate blocked client visibility: ${gate.missing.join(", ")}`);
      }

      const complianceReview = await tx.complianceReview.updateMany({
        where: { id: summitComplianceReviewId, clientTenantId: summitTenantId },
        data: {
          blockedAt: null,
          evidenceComplete: true,
          releaseNotes:
            "Compliance release. Advisor approval, validated evidence and high-severity data-quality blockers were checked before visibility.",
          releasedAt: now,
          status: ComplianceStatus.RELEASED,
        },
      });
      const recommendation = await tx.recommendation.updateMany({
        where: { id: summitRecommendationId, clientTenantId: summitTenantId },
        data: {
          clientVisible: true,
          status: RecommendationStatus.RELEASED_TO_CLIENT,
        },
      });
      const updatedEvidenceRecord = await tx.evidenceRecord.updateMany({
        where: { id: summitEvidenceRecordId, clientTenantId: summitTenantId },
        data: {
          status: EvidenceStatus.RELEASED,
          summary:
            "Compliance release recorded. workflowGate passed before the recommendation became client-visible.",
          visibilityStatus: VisibilityStatus.CLIENT_VISIBLE,
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: summitEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: "compliance_release",
          sourceObjectId: summitRecommendationId,
          sourceObjectType: ObjectType.RECOMMENDATION,
          title: "workflowGate compliance release",
          visibilityStatus: VisibilityStatus.CLIENT_VISIBLE,
        },
      });

      return {
        clientVisible: true,
        complianceReviewRows: complianceReview.count,
        evidenceItemId: evidenceItem.id,
        evidenceRecordRows: updatedEvidenceRecord.count,
        gateMissing: gate.missing,
        gatePassed: gate.passed,
        highSeverityDataQualityBlockers: dataQualitySnapshot.highSeverityOpenCount,
        message: "Compliance release saved after workflowGate passed.",
        recommendationRows: recommendation.count,
      };
    },
  );
}

async function runJ02ControlledExportAudit(prisma: PrismaClient, actionId: "j02.exportControlled") {
  return runTypedWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "compliance_officer",
      auditResult: AuditResult.BLOCKED,
      clientTenantId: morganTenantId,
      eventType: "advice_release_history.release_history.export_controlled",
      evidenceRecordId: morganEvidenceRecordId,
      metadataJson: {
        command: adviceReleaseHistoryCommandForAction(actionId),
        controlledExportOnly: true,
        exportDownloadCreated: false,
        exportRequiresSeparateApproval: true,
      },
      nextState: "EXPORT_CONTROLLED",
      permissionAction: "EXPORT",
      previousState: "EXPORT_LOCKED",
      reason: "Controlled release-history export was audited without approving or generating a download.",
      targetId: stableId("export-request:release-history:controlled"),
      targetType: ObjectType.EXPORT_REQUEST,
      tenantSlug: "morgan",
      visibilityStatus: "COMPLIANCE_VISIBLE",
      workflowState: "COMPLIANCE_PENDING",
    },
    async () => ({
      clientVisible: false,
      exportApproved: false,
      exportDownloadCreated: false,
      gatePassed: false,
      message: "Controlled export attempt audited. No export approval or download was created.",
    }),
  );
}

function decisionReviewDate(from: Date) {
  const reviewDate = new Date(from);
  reviewDate.setDate(reviewDate.getDate() + 90);
  return reviewDate;
}

async function assertReleasedDecisionContext(
  tx: Prisma.TransactionClient,
  permission: PermissionDecision,
) {
  const [recommendation, approval, complianceReview, evidenceRecord, decision] = await Promise.all([
    tx.recommendation.findFirst({
      where: { id: bennettRecommendationId, clientTenantId: bennettTenantId },
    }),
    tx.approval.findFirst({
      where: {
        clientTenantId: bennettTenantId,
        id: bennettApprovalId,
        targetId: bennettRecommendationId,
        targetType: ObjectType.RECOMMENDATION,
      },
    }),
    tx.complianceReview.findFirst({
      where: { id: bennettComplianceReviewId, clientTenantId: bennettTenantId },
    }),
    tx.evidenceRecord.findFirst({
      where: { id: bennettEvidenceRecordId, clientTenantId: bennettTenantId },
    }),
    tx.decision.findFirst({
      where: { id: bennettDecisionId, clientTenantId: bennettTenantId },
    }),
  ]);

  if (!recommendation || !approval || !complianceReview || !evidenceRecord || !decision) {
    throw new Error("J03 decision fixture is incomplete.");
  }

  const postReleaseRecommendationStatuses = new Set<RecommendationStatus>([
    RecommendationStatus.RELEASED_TO_CLIENT,
    RecommendationStatus.CLIENT_ACCEPTED,
    RecommendationStatus.CLIENT_DEFERRED,
    RecommendationStatus.CLIENT_REJECTED,
  ]);
  const releaseQualifiedRecommendationStatus =
    recommendation.clientVisible &&
    postReleaseRecommendationStatuses.has(recommendation.status)
      ? "RELEASED_TO_CLIENT"
      : recommendation.status;

  const gate = workflowGate.canBecomeClientVisible({
    advisorApprovalStatus: approval.status as DomainReviewStatus,
    complianceStatus: complianceReview.status as DomainComplianceStatus,
    evidenceStatus: evidenceRecord.status as DomainEvidenceStatus,
    permission,
    recommendationStatus: releaseQualifiedRecommendationStatus as DomainRecommendationStatus,
  });

  if (!gate.passed || !recommendation.clientVisible) {
    const missing = gate.missing.length > 0 ? gate.missing.join(", ") : "client_visible_recommendation";
    throw new Error(`workflowGate blocked client decision action: ${missing}`);
  }

  return { decision, evidenceRecord, gate, recommendation };
}

async function runJ03DecisionAction(
  prisma: PrismaClient,
  actionId: Extract<
    AdviceReleaseHistoryWorkflowAction,
    "j03.requestMoreInformation" | "j03.deferDecision" | "j03.rejectDecision" | "j03.acceptOption"
  >,
  options: AdviceReleaseHistoryActionOptions = {},
) {
  const now = new Date();
  const actionConfigs: Record<typeof actionId, {
    auditResult: AuditResult;
    decisionAction: string;
    decisionReason: string;
    decisionStatus: DecisionStatus;
    eventType: string;
    evidenceItemType: string;
    evidenceTitle: string;
    message: string;
    participantStatus: ReviewStatus;
    recommendationStatus: RecommendationStatus;
  }> = {
    "j03.acceptOption": {
      auditResult: AuditResult.SUCCESS,
      decisionAction: "accept",
      decisionReason: "Accepted after reviewing the released evidence package.",
      decisionStatus: DecisionStatus.ACCEPTED,
      eventType: "advice_release_history.decision.accepted",
      evidenceItemType: "decision_acceptance",
      evidenceTitle: "Client decision acceptance recorded",
      message: "Client decision accepted and evidence package updated.",
      participantStatus: ReviewStatus.COMPLETED,
      recommendationStatus: RecommendationStatus.CLIENT_ACCEPTED,
    },
    "j03.deferDecision": {
      auditResult: AuditResult.PENDING,
      decisionAction: "defer",
      decisionReason: "Deferred pending a family council review.",
      decisionStatus: DecisionStatus.DEFERRED,
      eventType: "advice_release_history.decision.deferred",
      evidenceItemType: "decision_defer",
      evidenceTitle: "Client decision deferral recorded",
      message: "Client decision deferred and audit proof saved.",
      participantStatus: ReviewStatus.PENDING,
      recommendationStatus: RecommendationStatus.CLIENT_DEFERRED,
    },
    "j03.rejectDecision": {
      auditResult: AuditResult.BLOCKED,
      decisionAction: "reject",
      decisionReason: "Rejected after reviewing released assumptions.",
      decisionStatus: DecisionStatus.REJECTED,
      eventType: "advice_release_history.decision.rejected",
      evidenceItemType: "decision_rejection",
      evidenceTitle: "Client decision rejection recorded",
      message: "Client decision rejected and audit proof saved.",
      participantStatus: ReviewStatus.REJECTED,
      recommendationStatus: RecommendationStatus.CLIENT_REJECTED,
    },
    "j03.requestMoreInformation": {
      auditResult: AuditResult.PENDING,
      decisionAction: "request_more_information",
      decisionReason: "Client requested more information before a final decision.",
      decisionStatus: DecisionStatus.DEFERRED,
      eventType: "advice_release_history.decision.request_more_information",
      evidenceItemType: "decision_more_information",
      evidenceTitle: "Client request for more information recorded",
      message: "Client request for more information saved.",
      participantStatus: ReviewStatus.REQUEST_MORE_DATA,
      recommendationStatus: RecommendationStatus.CLIENT_DEFERRED,
    },
  };
  const actionMap = actionConfigs[actionId];

  return runTypedWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditPersistenceAvailable: options.auditPersistenceAvailable,
      auditResult: actionMap.auditResult,
      clientTenantId: bennettTenantId,
      eventType: actionMap.eventType,
      evidenceRecordId: bennettEvidenceRecordId,
      metadataJson: {
        command: adviceReleaseHistoryCommandForAction(actionId),
        decisionAction: actionMap.decisionAction,
        decisionRecord: {
          action: actionMap.decisionAction,
          decisionId: bennettDecisionId,
          evidenceRecordId: bennettEvidenceRecordId,
          nextStatus: actionMap.decisionStatus,
          previousStatus: DecisionStatus.RELEASED_TO_CLIENT,
          recommendationId: bennettRecommendationId,
        },
        stagePackage: "BP-09",
        releasedContentOnly: true,
        workflowGateEnforced: true,
      },
      nextState: actionMap.decisionStatus,
      permissionAction: "REVIEW",
      previousState: DecisionStatus.RELEASED_TO_CLIENT,
      reason: actionMap.decisionReason,
      targetId: bennettDecisionId,
      targetType: ObjectType.DECISION,
      tenantSlug: "bennett",
      visibilityStatus: "CLIENT_VISIBLE",
      workflowState: "CLIENT_VISIBLE",
    },
    async (tx, { permission }) => {
      const { gate } = await assertReleasedDecisionContext(tx, permission);
      const decision = await tx.decision.updateMany({
        where: { id: bennettDecisionId, clientTenantId: bennettTenantId },
        data: {
          decisionAction: actionMap.decisionAction,
          decisionAt: now,
          decisionByUserId: userId("bennett:principal"),
          decisionReason: actionMap.decisionReason,
          evidenceRecordId: bennettEvidenceRecordId,
          reviewDate: decisionReviewDate(now),
          status: actionMap.decisionStatus,
        },
      });
      const participant = await tx.decisionParticipant.updateMany({
        where: {
          decisionId: bennettDecisionId,
          userId: userId("bennett:principal"),
        },
        data: {
          actedAt: now,
          status: actionMap.participantStatus,
        },
      });
      const recommendation = await tx.recommendation.updateMany({
        where: { id: bennettRecommendationId, clientTenantId: bennettTenantId },
        data: {
          clientVisible: true,
          status: actionMap.recommendationStatus,
        },
      });
      const evidenceRecord = await tx.evidenceRecord.updateMany({
        where: { id: bennettEvidenceRecordId, clientTenantId: bennettTenantId },
        data: {
          status: EvidenceStatus.RELEASED,
          summary: `${actionMap.evidenceTitle}. Source recommendation stayed client-visible and released before action.`,
          visibilityStatus: VisibilityStatus.CLIENT_VISIBLE,
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: bennettEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: actionMap.evidenceItemType,
          sourceObjectId: bennettDecisionId,
          sourceObjectType: ObjectType.DECISION,
          title: actionMap.evidenceTitle,
          visibilityStatus: VisibilityStatus.CLIENT_VISIBLE,
        },
      });

      return {
        clientVisible: true,
        decisionRows: decision.count,
        evidenceItemId: evidenceItem.id,
        evidenceRecordRows: evidenceRecord.count,
        gateMissing: gate.missing,
        gatePassed: gate.passed,
        message: actionMap.message,
        participantRows: participant.count,
        recommendationRows: recommendation.count,
      };
    },
  );
}

async function runJ03EvidenceAudit(
  prisma: PrismaClient,
  actionId: Extract<AdviceReleaseHistoryWorkflowAction, "j03.viewEvidenceRecord" | "j03.downloadEvidence">,
) {
  const isDownload = actionId === "j03.downloadEvidence";

  return runTypedWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: bennettTenantId,
      eventType: isDownload
        ? "advice_release_history.evidence.download"
        : "advice_release_history.evidence.view",
      evidenceRecordId: bennettEvidenceRecordId,
      metadataJson: {
        command: adviceReleaseHistoryCommandForAction(actionId),
        releasedContentOnly: true,
        workflowGateEnforced: true,
      },
      nextState: isDownload ? "DOWNLOADED" : "VIEWED",
      permissionAction: isDownload ? "EXPORT" : "VIEW",
      previousState: EvidenceStatus.RELEASED,
      reason: isDownload
        ? "Client downloaded the released evidence package."
        : "Client opened the released evidence package.",
      targetId: bennettEvidenceRecordId,
      targetType: ObjectType.EVIDENCE_RECORD,
      tenantSlug: "bennett",
      visibilityStatus: "CLIENT_VISIBLE",
      workflowState: "CLIENT_VISIBLE",
    },
    async (tx, { permission }) => {
      const { gate } = await assertReleasedDecisionContext(tx, permission);
      return {
        clientVisible: true,
        gateMissing: gate.missing,
        gatePassed: gate.passed,
        message: isDownload ? "Evidence package download audited." : "Evidence package view audited.",
      };
    },
  );
}

export async function runAdviceReleaseHistoryWorkflowAction(
  prisma: PrismaClient,
  actionId: AdviceReleaseHistoryWorkflowAction,
  options: AdviceReleaseHistoryActionOptions = {},
) {
  switch (actionId) {
    case "j02.requestEvidence":
    case "j02.confirmRequestEvidence":
      return runJ02RequestEvidence(prisma, actionId);

    case "j02.blockRelease":
      return runJ02BlockRelease(prisma, actionId);

    case "j02.releaseClient":
      return runJ02ReleaseClient(prisma, actionId, options);

    case "j02.exportControlled":
      return runJ02ControlledExportAudit(prisma, actionId);

    case "j03.requestMoreInformation":
    case "j03.deferDecision":
    case "j03.rejectDecision":
    case "j03.acceptOption":
      return runJ03DecisionAction(prisma, actionId, options);

    case "j03.viewEvidenceRecord":
    case "j03.downloadEvidence":
      return runJ03EvidenceAudit(prisma, actionId);
  }
}
