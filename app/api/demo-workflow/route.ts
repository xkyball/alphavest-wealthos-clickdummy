import { createHash } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AuditResult,
  ComplianceStatus,
  DecisionStatus,
  EvidenceStatus,
  ObjectType,
  Prisma,
  PrismaClient,
  RecommendationStatus,
  ReviewStatus,
  VisibilityStatus,
  WorkflowStatus,
} from "@prisma/client";
import { NextResponse } from "next/server";

import { failClosedJson } from "@/lib/control-layer/error-envelope";
import {
  wp05LegacyDemoReleaseActionDirectnessFor,
  wp05TypedAdvisorWorkflowDirectnessFor,
} from "@/lib/advisory-workflow-contract";
import {
  demoWorkflowActionBoundaryFor,
  typedAdvisorApprovalWorkflowBoundary,
} from "@/lib/demo-workflow-action-registry";
import { parseDemoWorkflowRequestBody } from "@/lib/demo-workflow-validation";
import { dataQualityService } from "@/lib/data-quality-service";
import {
  AuditPersistenceUnavailableError,
  runDemoWorkflowMutation,
} from "@/lib/typed-workflow-command-bus";
import type { PermissionDecision } from "@/lib/permission-engine";
import { workflowGate } from "@/lib/workflow-gate";
import type {
  ComplianceStatus as DomainComplianceStatus,
  EvidenceStatus as DomainEvidenceStatus,
  RecommendationStatus as DomainRecommendationStatus,
  ReviewStatus as DomainReviewStatus,
} from "@/lib/domain-types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type DemoWorkflowAction =
  | "j01.requestData"
  | "j01.routeToAdvisor"
  | "j01.approveAdvisor"
  | "j01.escalateAdvisor"
  | "j02.requestEvidence"
  | "j02.confirmRequestEvidence"
  | "j02.blockRelease"
  | "j02.releaseClient"
  | "j03.requestMoreInformation"
  | "j03.deferDecision"
  | "j03.rejectDecision"
  | "j03.acceptOption"
  | "j03.viewEvidenceRecord"
  | "j03.downloadEvidence";

type DemoWorkflowActionOptions = {
  auditPersistenceAvailable?: boolean;
};

class UnsupportedLegacyDemoWorkflowActionError extends Error {
  constructor(readonly actionId: string) {
    super(`Unsupported legacy demo workflow action: ${actionId}`);
  }
}

const platformTenantId = stableId("platform:alphavest");
const bennettTenantId = tenantId("bennett");
const bennettRecommendationId = recommendationId("bennett");
const bennettApprovalId = approvalId("bennett");
const bennettComplianceReviewId = complianceReviewId("bennett");
const bennettDecisionId = decisionId("bennett");
const bennettEvidenceRecordId = evidenceRecordId("bennett");
const northbridgeTenantId = tenantId("northbridge");
const northbridgeTriggerId = triggerId("northbridge", "liquidity");
const northbridgeRecommendationId = recommendationId("northbridge");
const northbridgeApprovalId = approvalId("northbridge");
const morganTenantId = tenantId("morgan");
const morganRecommendationId = recommendationId("morgan");
const morganComplianceReviewId = complianceReviewId("morgan");
const morganEvidenceRecordId = evidenceRecordId("morgan");
const summitTenantId = tenantId("summit");
const summitRecommendationId = recommendationId("summit");
const summitApprovalId = approvalId("summit");
const summitComplianceReviewId = complianceReviewId("summit");
const summitEvidenceRecordId = evidenceRecordId("summit");

type DemoWorkflowPrismaGlobal = typeof globalThis & {
  alphaVestDemoWorkflowPrisma?: PrismaClient;
};

type DemoWorkflowAuditWriter = Pick<PrismaClient, "auditEvent">;

function stableId(label: string) {
  const hash = createHash("sha1").update(`alphavest-wealthos:${label}`).digest("hex");
  const variant = ((Number.parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, "0");

  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    `5${hash.slice(13, 16)}`,
    `${variant}${hash.slice(18, 20)}`,
    hash.slice(20, 32),
  ].join("-");
}

function stableEvidenceHash(label: string) {
  return createHash("sha256").update(`alphavest-wealthos:${label}`).digest("hex");
}

function tenantId(slug: string) {
  return stableId(`tenant:${slug}`);
}

function userId(key: string) {
  return stableId(`user:${key}`);
}

function triggerId(slug: string, key: string) {
  return stableId(`trigger:${slug}:${key}`);
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

function prismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return undefined;

  const globalForPrisma = globalThis as DemoWorkflowPrismaGlobal;
  globalForPrisma.alphaVestDemoWorkflowPrisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  return globalForPrisma.alphaVestDemoWorkflowPrisma;
}

async function writeAuditEvent(
  prisma: DemoWorkflowAuditWriter,
  input: {
    actorUserId: string;
    actorRoleKey: string;
    eventType: string;
    targetType: ObjectType;
    targetId: string;
    clientTenantId?: string;
    previousState: string;
    nextState: string;
    reason: string;
    actionId: DemoWorkflowAction;
  }
) {
  await prisma.auditEvent.create({
    data: {
      platformTenantId,
      clientTenantId: input.clientTenantId ?? northbridgeTenantId,
      actorUserId: input.actorUserId,
      actorRoleKey: input.actorRoleKey,
      eventType: input.eventType,
      targetType: input.targetType,
      targetId: input.targetId,
      previousState: input.previousState,
      nextState: input.nextState,
      result: AuditResult.SUCCESS,
      reason: input.reason,
      metadataJson: {
        actionId: input.actionId,
        demoScope: "screencast",
        noClientRelease: true,
      },
    },
  });
}

async function runJ02RequestEvidence(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();
  const isConfirmation = actionId === "j02.confirmRequestEvidence";

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "compliance_officer",
      auditResult: AuditResult.PENDING,
      clientTenantId: morganTenantId,
      eventType: isConfirmation
        ? "screencast.compliance.confirm_request_evidence"
        : "screencast.compliance.request_evidence",
      evidenceRecordId: morganEvidenceRecordId,
      metadataJson: {
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
          releaseNotes: "Screencast J02 requested ROA, refreshed tax certificate and source proof.",
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

async function runJ02BlockRelease(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "compliance_officer",
      auditResult: AuditResult.BLOCKED,
      clientTenantId: morganTenantId,
      eventType: "screencast.compliance.block_release",
      evidenceRecordId: morganEvidenceRecordId,
      metadataJson: {
        clientVisible: false,
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
            "Screencast J02 blocked client release until missing compliance evidence is supplied.",
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
          blockedReason: "Compliance block recorded in J02. Release requires missing evidence.",
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
  actionId: DemoWorkflowAction,
  options: DemoWorkflowActionOptions = {},
) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "compliance_officer",
      auditPersistenceAvailable: options.auditPersistenceAvailable,
      auditResult: AuditResult.SUCCESS,
      clientTenantId: summitTenantId,
      eventType: "screencast.compliance.release_client",
      evidenceRecordId: summitEvidenceRecordId,
      metadataJson: {
        workflowGateEnforced: true,
        workflowGatePhase: "before_client_visibility",
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
            "Screencast J02 compliance release. Advisor approval, validated evidence and high-severity data-quality blockers were checked before visibility.",
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
  actionId: DemoWorkflowAction,
  options: DemoWorkflowActionOptions = {},
) {
  const now = new Date();
  const actionConfigs: Partial<Record<DemoWorkflowAction, {
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
  }>> = {
    "j03.acceptOption": {
      auditResult: AuditResult.SUCCESS,
      decisionAction: "accept",
      decisionReason: "Accepted after reviewing the released evidence package.",
      decisionStatus: DecisionStatus.ACCEPTED,
      eventType: "screencast.decision.accepted",
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
      eventType: "screencast.decision.deferred",
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
      eventType: "screencast.decision.rejected",
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
      eventType: "screencast.decision.request_more_information",
      evidenceItemType: "decision_more_information",
      evidenceTitle: "Client request for more information recorded",
      message: "Client request for more information saved.",
      participantStatus: ReviewStatus.REQUEST_MORE_DATA,
      recommendationStatus: RecommendationStatus.CLIENT_DEFERRED,
    },
  };

  const actionMap = actionConfigs[actionId];

  if (!actionMap) {
    throw new Error(`Unsupported J03 decision action: ${actionId}`);
  }

  return runDemoWorkflowMutation(
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
        decisionAction: actionMap.decisionAction,
        decisionRecord: {
          action: actionMap.decisionAction,
          decisionId: bennettDecisionId,
          evidenceRecordId: bennettEvidenceRecordId,
          nextStatus: actionMap.decisionStatus,
          previousStatus: DecisionStatus.RELEASED_TO_CLIENT,
          recommendationId: bennettRecommendationId,
        },
        phasePackage: "BP-09",
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

async function runJ03EvidenceAudit(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const isDownload = actionId === "j03.downloadEvidence";

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: bennettTenantId,
      eventType: isDownload ? "screencast.evidence.download" : "screencast.evidence.view",
      evidenceRecordId: bennettEvidenceRecordId,
      metadataJson: {
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

async function runDemoWorkflowAction(
  prisma: PrismaClient,
  actionId: DemoWorkflowAction,
  options: DemoWorkflowActionOptions = {},
) {
  const now = new Date();

  switch (actionId) {
    case "j01.requestData": {
      const result = await prisma.$transaction(async (tx) => {
        const trigger = await tx.trigger.updateMany({
          where: { id: northbridgeTriggerId, clientTenantId: northbridgeTenantId },
          data: {
            status: WorkflowStatus.AWAITING_INFO,
            clientVisible: false,
          },
        });
        const blockedReleaseAction = await tx.actionItem.updateMany({
          where: {
            id: actionItemId("northbridge", "blocked-release"),
            clientTenantId: northbridgeTenantId,
          },
          data: {
            status: WorkflowStatus.AWAITING_INFO,
            clientVisible: false,
            blockedReason: "Screencast J01 requested ownership, wire purpose and source-of-funds confirmation.",
          },
        });
        await writeAuditEvent(tx, {
          actorUserId: userId("analyst"),
          actorRoleKey: "analyst",
          eventType: "screencast.trigger.request_data",
          targetType: ObjectType.TRIGGER,
          targetId: northbridgeTriggerId,
          previousState: WorkflowStatus.ANALYST_REVIEW,
          nextState: WorkflowStatus.AWAITING_INFO,
          reason: "Requested missing information before analyst routing.",
          actionId,
        });
        return { actionItemRows: blockedReleaseAction.count, triggerRows: trigger.count };
      });

      return { message: "Request-data state saved.", ...result };
    }

    case "j01.routeToAdvisor": {
      const result = await prisma.$transaction(async (tx) => {
        const trigger = await tx.trigger.updateMany({
          where: { id: northbridgeTriggerId, clientTenantId: northbridgeTenantId },
          data: {
            status: WorkflowStatus.ADVISOR_REVIEW,
            clientVisible: false,
          },
        });
        const recommendation = await tx.recommendation.updateMany({
          where: { id: northbridgeRecommendationId, clientTenantId: northbridgeTenantId },
          data: {
            status: RecommendationStatus.ADVISOR_PENDING,
            clientVisible: false,
          },
        });
        const approval = await tx.approval.updateMany({
          where: { id: northbridgeApprovalId, clientTenantId: northbridgeTenantId },
          data: {
            status: ReviewStatus.IN_REVIEW,
            notes: "Routed to senior wealth advisor for screencast J01. Compliance release remains required.",
          },
        });
        await writeAuditEvent(tx, {
          actorUserId: userId("analyst"),
          actorRoleKey: "analyst",
          eventType: "screencast.trigger.route_to_advisor",
          targetType: ObjectType.RECOMMENDATION,
          targetId: northbridgeRecommendationId,
          previousState: RecommendationStatus.BLOCKED,
          nextState: RecommendationStatus.ADVISOR_PENDING,
          reason: "Routed advisor package without client visibility.",
          actionId,
        });
        return {
          approvalRows: approval.count,
          recommendationRows: recommendation.count,
          triggerRows: trigger.count,
        };
      });

      return { message: "Advisor routing state saved.", ...result };
    }

    case "j01.approveAdvisor": {
      const result = await prisma.$transaction(async (tx) => {
        const approval = await tx.approval.updateMany({
          where: { id: northbridgeApprovalId, clientTenantId: northbridgeTenantId },
          data: {
            status: ReviewStatus.APPROVED,
            notes: "Advisor approved in screencast J01. Client release is still blocked by compliance.",
            approvedAt: now,
          },
        });
        const recommendation = await tx.recommendation.updateMany({
          where: { id: northbridgeRecommendationId, clientTenantId: northbridgeTenantId },
          data: {
            status: RecommendationStatus.ADVISOR_APPROVED,
            clientVisible: false,
          },
        });
        await writeAuditEvent(tx, {
          actorUserId: userId("advisor"),
          actorRoleKey: "senior_wealth_advisor",
          eventType: "screencast.approval.approve",
          targetType: ObjectType.RECOMMENDATION,
          targetId: northbridgeRecommendationId,
          previousState: ReviewStatus.IN_REVIEW,
          nextState: ReviewStatus.APPROVED,
          reason: "Advisor approved the package; compliance release remains required.",
          actionId,
        });
        return { approvalRows: approval.count, recommendationRows: recommendation.count };
      });

      return { message: "Advisor approval saved. Compliance release is still required.", ...result };
    }

    case "j01.escalateAdvisor": {
      const result = await prisma.$transaction(async (tx) => {
        const approval = await tx.approval.updateMany({
          where: { id: northbridgeApprovalId, clientTenantId: northbridgeTenantId },
          data: {
            status: ReviewStatus.ESCALATED_TO_CALL,
            notes: "Advisor escalated the non-release alternative to a call in screencast J01.",
          },
        });
        const recommendation = await tx.recommendation.updateMany({
          where: { id: northbridgeRecommendationId, clientTenantId: northbridgeTenantId },
          data: {
            status: RecommendationStatus.BLOCKED,
            clientVisible: false,
          },
        });
        await writeAuditEvent(tx, {
          actorUserId: userId("advisor"),
          actorRoleKey: "senior_wealth_advisor",
          eventType: "screencast.approval.escalate_to_call",
          targetType: ObjectType.RECOMMENDATION,
          targetId: northbridgeRecommendationId,
          previousState: ReviewStatus.APPROVED,
          nextState: ReviewStatus.ESCALATED_TO_CALL,
          reason: "Escalated to call as a non-release alternative.",
          actionId,
        });
        return { approvalRows: approval.count, recommendationRows: recommendation.count };
      });

      return { message: "Advisor escalation saved. No client release was created.", ...result };
    }

    case "j02.requestEvidence":
    case "j02.confirmRequestEvidence":
      return runJ02RequestEvidence(prisma, actionId);

    case "j02.blockRelease":
      return runJ02BlockRelease(prisma, actionId);

    case "j02.releaseClient":
      return runJ02ReleaseClient(prisma, actionId, options);

    case "j03.requestMoreInformation":
    case "j03.deferDecision":
    case "j03.rejectDecision":
    case "j03.acceptOption":
      return runJ03DecisionAction(prisma, actionId, options);

    case "j03.viewEvidenceRecord":
    case "j03.downloadEvidence":
      return runJ03EvidenceAudit(prisma, actionId);


    default:
      throw new UnsupportedLegacyDemoWorkflowActionError(actionId as string);
  }
}

export async function POST(request: Request) {
  const prisma = prismaClient();
  if (!prisma) {
    return failClosedJson(
      {
        error: "DATABASE_URL is required for demo workflow actions.",
        reasonCode: "DATABASE_URL_REQUIRED",
        retryAllowed: true,
      },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => undefined);
  const parsedBody = parseDemoWorkflowRequestBody(body);
  if (!parsedBody.ok) {
    return failClosedJson(
      {
        error: "Invalid demo workflow request.",
        issues: parsedBody.issues,
        reasonCode: "INVALID_REQUEST",
      },
      { status: 400 },
    );
  }

  const parsedValue = parsedBody.value;

  if ("workflowType" in parsedValue && parsedValue.workflowType === "advisor-approval") {
    return failClosedJson(
      {
        action: parsedValue.action,
        canonicalApiRoute: typedAdvisorApprovalWorkflowBoundary.canonicalApiRoute,
        demoWorkflowBoundary: typedAdvisorApprovalWorkflowBoundary,
        error:
          "Typed advisor approval workflow actions have moved out of /api/demo-workflow. Use /api/recommendation-review-workflow.",
        legacyReasonCode: typedAdvisorApprovalWorkflowBoundary.reasonCode,
        proofDirectness: wp05TypedAdvisorWorkflowDirectnessFor(parsedValue.action),
        reasonCode: "SAFE_ERROR",
        workflowType: "advisor-approval",
      },
      { status: 410 },
    );
  }

  if (!("actionId" in parsedValue)) {
    return failClosedJson(
      {
        error: "Invalid demo workflow request.",
        reasonCode: "INVALID_REQUEST",
      },
      { status: 400 },
    );
  }

  const actionId = parsedValue.actionId;
  const demoWorkflowBoundary = demoWorkflowActionBoundaryFor(actionId);

  if (demoWorkflowBoundary.classification === "MOVED_TO_TYPED_PRODUCT_COMMAND") {
      const movedActionSafety =
        demoWorkflowBoundary.canonicalApiRoute === "/api/export-workflow"
          ? {
            commandExecuted: false,
            hiddenRowsDisclosed: false,
            noClientRelease: true,
            noExportApproval: true,
            noExportDownload: true,
            scoped: false,
          }
        : demoWorkflowBoundary.canonicalApiRoute === "/api/tenant-governance/actions" ||
            demoWorkflowBoundary.canonicalApiRoute === "/api/platform-admin/actions" ||
            demoWorkflowBoundary.canonicalApiRoute === "/api/data-maintenance/actions"
          ? {
              commandExecuted: false,
              hiddenRowsDisclosed: false,
              noAdviceExecution: true,
              noClientRelease: true,
              scoped: false,
            }
        : undefined;
    return failClosedJson(
      {
        actionId,
        canonicalApiRoute: demoWorkflowBoundary.canonicalApiRoute,
        demoWorkflowBoundary,
        error:
          demoWorkflowBoundary.canonicalApiRoute === "/api/export-workflow"
            ? "Legacy demo export actions are retired from /api/demo-workflow. Use the typed export workflow API."
            : demoWorkflowBoundary.canonicalApiRoute === "/api/journeys/[id]/commands"
              ? "Legacy Phase B/C demo actions are retired from /api/demo-workflow. Use the typed journey command API."
              : demoWorkflowBoundary.canonicalApiRoute === "/api/tenant-governance/actions"
                ? "Legacy tenant governance demo actions are retired from /api/demo-workflow. Use /api/tenant-governance/actions."
                : demoWorkflowBoundary.canonicalApiRoute === "/api/platform-admin/actions"
                  ? "Legacy platform admin demo actions are retired from /api/demo-workflow. Use /api/platform-admin/actions."
                  : demoWorkflowBoundary.canonicalApiRoute === "/api/data-maintenance/actions"
                    ? "Legacy data-maintenance demo actions are retired from /api/demo-workflow. Use /api/data-maintenance/actions."
                    : "Review monitoring actions have moved out of /api/demo-workflow. Use /api/review-monitoring/actions.",
        legacyReasonCode: demoWorkflowBoundary.reasonCode,
        reasonCode: "SAFE_ERROR",
        ...(movedActionSafety ? { safety: movedActionSafety } : {}),
      },
      { status: 410 },
    );
  }

  if (demoWorkflowBoundary.classification === "UNSUPPORTED_REQUIRES_TYPED_COMMAND") {
    return failClosedJson(
      {
        actionId,
        canonicalApiRoute: demoWorkflowBoundary.canonicalApiRoute,
        demoWorkflowBoundary,
        error:
          "Unsupported demo workflow actions are blocked. Move real journey commands to the typed journey command API before enabling them.",
        legacyReasonCode: demoWorkflowBoundary.reasonCode,
        reasonCode: "SAFE_ERROR",
      },
      { status: 410 },
    );
  }

  const demoWorkflowActionId = actionId as DemoWorkflowAction;
  const proofDirectness = wp05LegacyDemoReleaseActionDirectnessFor(actionId);

  try {
    const result = await runDemoWorkflowAction(prisma, demoWorkflowActionId, {
      auditPersistenceAvailable:
        parsedValue.simulateAuditPersistenceFailure === true ? false : undefined,
    });
    const releasedToClient =
      typeof result === "object" &&
      result !== null &&
      "clientVisible" in result &&
      result.clientVisible === true;

    return NextResponse.json({
      actionId,
      demoWorkflowBoundary,
      demoOnly: true,
      noClientRelease: !releasedToClient,
      ok: true,
      productCommandAllowed: false,
      proofDirectness,
      result,
    });
  } catch (error) {
    if (error instanceof UnsupportedLegacyDemoWorkflowActionError) {
      return failClosedJson(
        {
          actionId: error.actionId,
          canonicalApiRoute: "/api/journeys/[id]/commands",
          error:
            "Unsupported demo workflow actions are blocked. Move real journey commands to the typed journey command API before enabling them.",
          legacyReasonCode: "UNSUPPORTED_DEMO_WORKFLOW_ACTION_BLOCKED",
          reasonCode: "SAFE_ERROR",
        },
        { status: 410 },
      );
    }

    if (error instanceof AuditPersistenceUnavailableError) {
      return failClosedJson(
        {
          actionId,
          auditPersistenceRequired: true,
          error: error.message,
          reasonCode: "AUDIT_PERSISTENCE_UNAVAILABLE",
        },
        { status: 409 },
      );
    }

    return failClosedJson(
      {
        actionId,
        error: "Demo workflow action failed.",
        reasonCode: "SAFE_ERROR",
      },
      { status: 409 },
    );
  }
}
