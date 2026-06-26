import { createHash } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AuditResult,
  ComplianceStatus,
  DecisionStatus,
  DocumentStatus,
  EvidenceStatus,
  EntityType,
  ObjectType,
  Prisma,
  PrismaClient,
  RecommendationStatus,
  ReviewStatus,
  Sensitivity,
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
import { fileMetadataService } from "@/lib/file-metadata-service";
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
  | "j03.downloadEvidence"
  | "j04.portalUpload"
  | "j04.openUploadDocument"
  | "j04.uploadDocument"
  | "j04.confirmFinalize"
  | "j04.viewDetails"
  | "j05.createEntity"
  | "j05.continueEntity"
  | "j05.editEntity"
  | "j05.viewDetails"
  | "j05.markReady"
  | "j05.requestInfo"
  | "j09.portalUpload"
  | "j09.submitProfile"
  | "j09.addMember"
  | "j09.saveFamilyChanges"
  | "j09.openFamilyMap"
  | "j09.addRelationship";

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
const bennettPrincipalProfileId = stableId("profile:bennett:principal");
const bennettOliviaFamilyMemberId = familyMemberId("bennett", "olivia");
const bennettPrincipalFamilyMemberId = familyMemberId("bennett", "principal");
const bennettOliviaRelationshipId = stableId("relationship:bennett:principal-olivia-nextgen");
const northbridgeTenantId = tenantId("northbridge");
const northbridgeTriggerId = triggerId("northbridge", "liquidity");
const northbridgeRecommendationId = recommendationId("northbridge");
const northbridgeApprovalId = approvalId("northbridge");
const morganTenantId = tenantId("morgan");
const morganRecommendationId = recommendationId("morgan");
const morganComplianceReviewId = complianceReviewId("morgan");
const morganEvidenceRecordId = evidenceRecordId("morgan");
const morganTaxDocumentId = documentId("morgan", "missing-tax");
const summitTenantId = tenantId("summit");
const summitRecommendationId = recommendationId("summit");
const summitApprovalId = approvalId("summit");
const summitComplianceReviewId = complianceReviewId("summit");
const summitEvidenceRecordId = evidenceRecordId("summit");
const summitPhilanthropyEntityId = entityId("summit", "philanthropy");
const summitActionReadyGateId = actionItemId("summit", "tax-cert");

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

function documentId(slug: string, key: string) {
  return stableId(`document:${slug}:${key}`);
}

function entityId(slug: string, key: string) {
  return stableId(`entity:${slug}:${key}`);
}

function familyMemberId(slug: string, key: string) {
  return stableId(`family:${slug}:${key}`);
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

async function runJ04DocumentNavigationAudit(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "family_cfo",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: morganTenantId,
      eventType:
        actionId === "j04.viewDetails"
          ? "screencast.document.view_details"
          : "screencast.document.open_upload",
      evidenceRecordId: morganEvidenceRecordId,
      metadataJson: {
        noBinaryFileStorage: true,
        phase18FileRealismDeferred: true,
      },
      nextState: actionId === "j04.viewDetails" ? "DETAILS_VIEWED" : "UPLOAD_OPENED",
      permissionAction: "VIEW",
      previousState: "SEEDED_FIXTURE",
      reason:
        actionId === "j04.viewDetails"
          ? "Client viewed document clarification details."
          : "Client opened document upload flow.",
      targetId: morganTaxDocumentId,
      targetType: ObjectType.DOCUMENT,
      tenantSlug: "morgan",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "AWAITING_INFO",
    },
    async () => ({
      clientVisible: false,
      message:
        actionId === "j04.viewDetails"
          ? "Document clarification detail view audited."
          : "Document upload entry audited.",
    }),
  );
}

async function runJ04UploadDocument(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();
  const fileMetadata = fileMetadataService.prepareDemoFileMetadata({
    category: "documents",
    checksumSeed: "morgan:tax-residency-2026:v1",
    fileName: "morgan-tax-residency-2026.pdf",
    fileSizeBytes: 386240,
    mimeType: "application/pdf",
    tenantSlug: "morgan",
  });

  if (!fileMetadata.valid) {
    throw new Error(`Invalid J04 file metadata: ${fileMetadata.issues.join(", ")}`);
  }

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "family_cfo",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: morganTenantId,
      eventType: "screencast.document.uploaded",
      evidenceRecordId: morganEvidenceRecordId,
      metadataJson: {
        contentAddress: fileMetadata.contentAddress,
        fileName: fileMetadata.fileName,
        metadataValidated: true,
        noBinaryFileStorage: true,
        phase18FileRealismDeferred: true,
      },
      nextState: DocumentStatus.UPLOADED,
      permissionAction: "UPLOAD",
      previousState: DocumentStatus.EMPTY,
      reason: "Demo document upload metadata and version were recorded.",
      targetId: morganTaxDocumentId,
      targetType: ObjectType.DOCUMENT,
      tenantSlug: "morgan",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "AWAITING_INFO",
    },
    async (tx) => {
      const document = await tx.document.updateMany({
        where: { id: morganTaxDocumentId, clientTenantId: morganTenantId },
        data: {
          checksum: fileMetadata.checksum,
          clientVisible: false,
          fileName: fileMetadata.fileName,
          fileSizeBytes: fileMetadata.fileSizeBytes,
          mimeType: fileMetadata.mimeType,
          source: "client",
          status: DocumentStatus.UPLOADED,
          storageKey: fileMetadata.storageKey,
          title: "Morgan 2026 Tax Residency Certificate",
        },
      });
      const version = await tx.documentVersion.upsert({
        where: {
          documentId_versionNumber: {
            documentId: morganTaxDocumentId,
            versionNumber: 1,
          },
        },
        create: {
          id: stableId("document-version:morgan:missing-tax:1"),
          changeReason: "Client uploaded tax residency certificate metadata in J04.",
          checksum: fileMetadata.checksum,
          createdAt: now,
          createdByUserId: userId("morgan:cfo"),
          documentId: morganTaxDocumentId,
          storageKey: fileMetadata.storageKey,
          versionNumber: 1,
        },
        update: {
          changeReason: "Client uploaded tax residency certificate metadata in J04.",
          checksum: fileMetadata.checksum,
          createdByUserId: userId("morgan:cfo"),
          storageKey: fileMetadata.storageKey,
        },
      });
      const extraction = await tx.documentExtraction.upsert({
        where: { id: stableId("document-extraction:morgan:missing-tax") },
        create: {
          id: stableId("document-extraction:morgan:missing-tax"),
          confidenceScore: new Prisma.Decimal("68.50"),
          createdAt: now,
          documentId: morganTaxDocumentId,
          extractedFieldsJson: {
            documentType: "tax_residency_certificate",
            taxResidency: "United Kingdom",
            validThrough: "2026-12-31",
          },
          extractionStatus: "pending",
          isClientVisible: false,
          lowConfidenceFieldsJson: {
            signerAuthority: "requires analyst verification",
          },
          modelVersion: "rules-demo-2026.06",
          updatedAt: now,
        },
        update: {
          confidenceScore: new Prisma.Decimal("68.50"),
          extractedFieldsJson: {
            documentType: "tax_residency_certificate",
            taxResidency: "United Kingdom",
            validThrough: "2026-12-31",
          },
          extractionStatus: "pending",
          isClientVisible: false,
          lowConfidenceFieldsJson: {
            signerAuthority: "requires analyst verification",
          },
          modelVersion: "rules-demo-2026.06",
          updatedAt: now,
        },
      });

      return {
        clientVisible: false,
        documentRows: document.count,
        extractionId: extraction.id,
        message: "Document upload metadata, version and extraction draft saved.",
        versionId: version.id,
      };
    },
  );
}

async function runJ04ConfirmFinalize(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "family_cfo",
      auditResult: AuditResult.PENDING,
      clientTenantId: morganTenantId,
      eventType: "screencast.document.extraction_confirmed",
      evidenceRecordId: morganEvidenceRecordId,
      metadataJson: {
        extractionCorrection: "Tax residency: United Kingdom",
        noBinaryFileStorage: true,
        phase18FileRealismDeferred: true,
      },
      nextState: DocumentStatus.ANALYST_REVIEW_PENDING,
      permissionAction: "REVIEW",
      previousState: DocumentStatus.UPLOADED,
      reason: "Client confirmed extraction draft and sent document to analyst verification.",
      targetId: morganTaxDocumentId,
      targetType: ObjectType.DOCUMENT,
      tenantSlug: "morgan",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "AWAITING_INFO",
    },
    async (tx) => {
      const document = await tx.document.updateMany({
        where: { id: morganTaxDocumentId, clientTenantId: morganTenantId },
        data: {
          clientVisible: false,
          status: DocumentStatus.ANALYST_REVIEW_PENDING,
        },
      });
      const extraction = await tx.documentExtraction.upsert({
        where: { id: stableId("document-extraction:morgan:missing-tax") },
        create: {
          id: stableId("document-extraction:morgan:missing-tax"),
          confidenceScore: new Prisma.Decimal("89.40"),
          createdAt: now,
          documentId: morganTaxDocumentId,
          extractedFieldsJson: {
            documentType: "tax_residency_certificate",
            taxResidency: "United Kingdom",
            validThrough: "2026-12-31",
          },
          extractionStatus: "completed",
          isClientVisible: false,
          lowConfidenceFieldsJson: {},
          modelVersion: "rules-demo-2026.06",
          updatedAt: now,
        },
        update: {
          confidenceScore: new Prisma.Decimal("89.40"),
          extractedFieldsJson: {
            documentType: "tax_residency_certificate",
            taxResidency: "United Kingdom",
            validThrough: "2026-12-31",
          },
          extractionStatus: "completed",
          isClientVisible: false,
          lowConfidenceFieldsJson: {},
          updatedAt: now,
        },
      });
      const review = await tx.documentReview.upsert({
        where: { id: stableId("document-review:morgan:missing-tax") },
        create: {
          id: stableId("document-review:morgan:missing-tax"),
          createdAt: now,
          documentId: morganTaxDocumentId,
          notes: "Client-confirmed extraction requires analyst verification before evidence release.",
          reviewType: "Extraction review",
          reviewerUserId: userId("analyst"),
          status: ReviewStatus.IN_REVIEW,
        },
        update: {
          notes: "Client-confirmed extraction requires analyst verification before evidence release.",
          reviewType: "Extraction review",
          reviewerUserId: userId("analyst"),
          status: ReviewStatus.IN_REVIEW,
        },
      });
      const documentLink = await tx.documentLink.upsert({
        where: { id: stableId("document-link:morgan:missing-tax:evidence") },
        create: {
          id: stableId("document-link:morgan:missing-tax:evidence"),
          createdAt: now,
          createdByUserId: userId("morgan:cfo"),
          documentId: morganTaxDocumentId,
          relationship: "evidence_placeholder",
          targetId: morganEvidenceRecordId,
          targetType: ObjectType.EVIDENCE_RECORD,
        },
        update: {
          createdByUserId: userId("morgan:cfo"),
          relationship: "evidence_placeholder",
          targetId: morganEvidenceRecordId,
          targetType: ObjectType.EVIDENCE_RECORD,
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: morganEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: "document_extraction_review",
          sourceObjectId: morganTaxDocumentId,
          sourceObjectType: ObjectType.DOCUMENT,
          title: "Document extraction review queued",
          visibilityStatus: VisibilityStatus.COMPLIANCE_VISIBLE,
        },
      });

      return {
        clientVisible: false,
        documentLinkId: documentLink.id,
        documentRows: document.count,
        evidenceItemId: evidenceItem.id,
        extractionId: extraction.id,
        message: "Extraction confirmed and analyst verification queued.",
        reviewId: review.id,
      };
    },
  );
}

async function runJ05CreateEntityIntent(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: summitTenantId,
      eventType: "screencast.entity.create_intent",
      evidenceRecordId: summitEvidenceRecordId,
      metadataJson: {
        entityName: "Summit Ridge Philanthropy LLC",
        sensitiveJurisdictionReviewRequired: true,
      },
      nextState: "ENTITY_DRAFT_STARTED",
      permissionAction: "CREATE",
      previousState: "NO_ENTITY_DRAFT",
      reason: "Client started an entity creation workflow for Summit.",
      sensitivity: "RESTRICTED",
      targetId: summitPhilanthropyEntityId,
      targetType: ObjectType.ENTITY,
      tenantSlug: "summit",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "DRAFT",
    },
    async () => ({
      clientVisible: false,
      message: "Entity creation intent audited.",
    }),
  );
}

async function runJ05ContinueEntity(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.PENDING,
      clientTenantId: summitTenantId,
      eventType: "screencast.entity.created_legal_review_required",
      evidenceRecordId: summitEvidenceRecordId,
      metadataJson: {
        entityName: "Summit Ridge Philanthropy LLC",
        registrationNumber: "SRP-2026-001",
        reviewGate: "sensitive_jurisdiction",
      },
      nextState: "LEGAL_REVIEW_REQUIRED",
      permissionAction: "CREATE",
      previousState: "ENTITY_DRAFT_STARTED",
      reason: "Entity was created as a draft and routed to legal review before readiness.",
      sensitivity: "RESTRICTED",
      targetId: summitPhilanthropyEntityId,
      targetType: ObjectType.ENTITY,
      tenantSlug: "summit",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const entity = await tx.entity.upsert({
        where: { id: summitPhilanthropyEntityId },
        create: {
          id: summitPhilanthropyEntityId,
          clientTenantId: summitTenantId,
          dataQualityScore: 54,
          entityType: EntityType.COMPANY,
          jurisdiction: "Cayman Islands",
          name: "Summit Ridge Philanthropy LLC",
          ownerSummary: "Draft philanthropic holding entity. Ownership and evidence require review.",
          registrationNumber: "SRP-2026-001",
          riskRating: "High",
          sensitivity: Sensitivity.RESTRICTED,
          status: "legal_review_required",
        },
        update: {
          dataQualityScore: 54,
          entityType: EntityType.COMPANY,
          jurisdiction: "Cayman Islands",
          name: "Summit Ridge Philanthropy LLC",
          ownerSummary: "Draft philanthropic holding entity. Ownership and evidence require review.",
          registrationNumber: "SRP-2026-001",
          riskRating: "High",
          sensitivity: Sensitivity.RESTRICTED,
          status: "legal_review_required",
        },
      });
      const participant = await tx.entityParticipant.upsert({
        where: { id: stableId("entity-participant:summit:philanthropy-principal") },
        create: {
          id: stableId("entity-participant:summit:philanthropy-principal"),
          clientTenantId: summitTenantId,
          createdAt: now,
          effectiveFrom: now,
          entityId: entity.id,
          ownershipPercent: new Prisma.Decimal("100.000"),
          participantId: familyMemberId("summit", "principal"),
          participantType: ObjectType.FAMILY_MEMBER,
          roleLabel: "Founder",
          sourceDocumentId: documentId("summit", "trust-deed"),
        },
        update: {
          effectiveFrom: now,
          entityId: entity.id,
          ownershipPercent: new Prisma.Decimal("100.000"),
          participantId: familyMemberId("summit", "principal"),
          participantType: ObjectType.FAMILY_MEMBER,
          roleLabel: "Founder",
          sourceDocumentId: documentId("summit", "trust-deed"),
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: summitEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: "entity_created_legal_review_required",
          sourceObjectId: entity.id,
          sourceObjectType: ObjectType.ENTITY,
          title: "Entity created with legal review gate",
          visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
        },
      });

      return {
        clientVisible: false,
        entityId: entity.id,
        evidenceItemId: evidenceItem.id,
        message: "Entity draft created and legal review gate recorded.",
        participantId: participant.id,
      };
    },
  );
}

async function runJ05EditEntity(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: summitTenantId,
      eventType: "screencast.entity.edit_viewed",
      evidenceRecordId: summitEvidenceRecordId,
      metadataJson: {
        wealthMapDrawerOpened: true,
      },
      nextState: "WEALTH_MAP_DRAWER_OPENED",
      permissionAction: "EDIT",
      previousState: "LEGAL_REVIEW_REQUIRED",
      reason: "Client opened the entity for scoped wealth-map inspection.",
      sensitivity: "RESTRICTED",
      targetId: summitPhilanthropyEntityId,
      targetType: ObjectType.ENTITY,
      tenantSlug: "summit",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const entity = await tx.entity.updateMany({
        where: { id: summitPhilanthropyEntityId, clientTenantId: summitTenantId },
        data: {
          dataQualityScore: 62,
          status: "wealth_map_review",
        },
      });

      return {
        clientVisible: false,
        entityRows: entity.count,
        message: "Entity wealth-map review state saved.",
      };
    },
  );
}

async function runJ05ViewDetails(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.PENDING,
      clientTenantId: summitTenantId,
      eventType: "screencast.wealth_map.conflict_viewed",
      evidenceRecordId: summitEvidenceRecordId,
      metadataJson: {
        conflictVisibleAsStatusOnly: true,
        noAdviceOutput: true,
      },
      nextState: WorkflowStatus.IN_REVIEW,
      permissionAction: "VIEW",
      previousState: WorkflowStatus.IN_REVIEW,
      reason: "Client viewed a conflict/status path without receiving advice output.",
      sensitivity: "RESTRICTED",
      targetId: summitActionReadyGateId,
      targetType: ObjectType.ACTION_ITEM,
      tenantSlug: "summit",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const actionItem = await tx.actionItem.updateMany({
        where: { id: summitActionReadyGateId, clientTenantId: summitTenantId },
        data: {
          blockedReason: "Client approval evidence is missing before ready state.",
          clientVisible: true,
          evidenceStatus: EvidenceStatus.PLACEHOLDER,
          status: WorkflowStatus.IN_REVIEW,
        },
      });

      return {
        actionItemRows: actionItem.count,
        clientVisible: false,
        message: "Wealth-map conflict view audited without release.",
      };
    },
  );
}

async function runJ05MarkReady(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.BLOCKED,
      clientTenantId: summitTenantId,
      eventType: "screencast.action.ready_blocked",
      evidenceRecordId: summitEvidenceRecordId,
      metadataJson: {
        blockedByMissingEvidence: true,
        readyStateDenied: true,
      },
      nextState: WorkflowStatus.BLOCKED,
      permissionAction: "REVIEW",
      previousState: WorkflowStatus.IN_REVIEW,
      reason: "Ready state was blocked because required client approval evidence is missing.",
      sensitivity: "RESTRICTED",
      targetId: summitActionReadyGateId,
      targetType: ObjectType.ACTION_ITEM,
      tenantSlug: "summit",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const actionItem = await tx.actionItem.updateMany({
        where: { id: summitActionReadyGateId, clientTenantId: summitTenantId },
        data: {
          blockedReason: "Missing Client Approval evidence prevents ready state.",
          clientVisible: true,
          evidenceStatus: EvidenceStatus.PLACEHOLDER,
          status: WorkflowStatus.BLOCKED,
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: summitEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: "action_ready_blocked",
          sourceObjectId: summitActionReadyGateId,
          sourceObjectType: ObjectType.ACTION_ITEM,
          title: "Action ready gate blocked by missing evidence",
          visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
        },
      });

      return {
        actionItemRows: actionItem.count,
        clientVisible: false,
        evidenceItemId: evidenceItem.id,
        message: "Action ready state blocked by missing evidence.",
      };
    },
  );
}

async function runJ05RequestInfo(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.PENDING,
      clientTenantId: summitTenantId,
      eventType: "screencast.action.request_more_info",
      evidenceRecordId: summitEvidenceRecordId,
      metadataJson: {
        remediationPath: "request_info",
        releaseCreated: false,
      },
      nextState: WorkflowStatus.AWAITING_INFO,
      permissionAction: "REVIEW",
      previousState: WorkflowStatus.BLOCKED,
      reason: "Client requested the missing information package instead of releasing the action.",
      sensitivity: "RESTRICTED",
      targetId: summitActionReadyGateId,
      targetType: ObjectType.ACTION_ITEM,
      tenantSlug: "summit",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "AWAITING_INFO",
    },
    async (tx) => {
      const actionItem = await tx.actionItem.updateMany({
        where: { id: summitActionReadyGateId, clientTenantId: summitTenantId },
        data: {
          blockedReason: "Requested missing client approval evidence before readiness.",
          clientVisible: true,
          evidenceStatus: EvidenceStatus.PLACEHOLDER,
          status: WorkflowStatus.AWAITING_INFO,
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: summitEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: "action_more_info_requested",
          sourceObjectId: summitActionReadyGateId,
          sourceObjectType: ObjectType.ACTION_ITEM,
          title: "Action remediation request recorded",
          visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
        },
      });

      return {
        actionItemRows: actionItem.count,
        clientVisible: false,
        evidenceItemId: evidenceItem.id,
        message: "Missing information requested without release.",
      };
    },
  );
}

async function runJ09PortalUpload(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: bennettTenantId,
      eventType: "screencast.profile.portal_upload_entry",
      evidenceRecordId: bennettEvidenceRecordId,
      metadataJson: {
        profileIntakeStarted: true,
        releaseCreated: false,
      },
      nextState: "PROFILE_INTAKE_OPENED",
      permissionAction: "VIEW",
      previousState: "PORTAL_ACTION_SELECTED",
      reason: "Client opened the profile intake path from the portal.",
      targetId: bennettPrincipalProfileId,
      targetType: ObjectType.USER,
      tenantSlug: "bennett",
      visibilityStatus: "CLIENT_VISIBLE",
      workflowState: "IN_REVIEW",
    },
    async () => ({
      clientVisible: false,
      message: "Profile intake entry audited.",
    }),
  );
}

async function runJ09SubmitProfile(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.PENDING,
      clientTenantId: bennettTenantId,
      eventType: "screencast.profile.submitted",
      evidenceRecordId: bennettEvidenceRecordId,
      metadataJson: {
        profileUpdateNote: "Updated governance contact details.",
        submittedForReview: true,
      },
      nextState: "PROFILE_SUBMITTED_FOR_REVIEW",
      permissionAction: "EDIT",
      previousState: "SEEDED_PROFILE",
      reason: "Client submitted updated profile and governance contact details for review.",
      sensitivity: "CONFIDENTIAL",
      targetId: bennettPrincipalProfileId,
      targetType: ObjectType.USER,
      tenantSlug: "bennett",
      visibilityStatus: "CLIENT_VISIBLE",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const profile = await tx.userProfile.updateMany({
        where: { id: bennettPrincipalProfileId, clientTenantId: bennettTenantId },
        data: {
          countryOfResidence: "South Africa",
          phone: "+27 10 555 0199",
          relationshipLabel: "Principal / governance contact",
          sensitivity: Sensitivity.CONFIDENTIAL,
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: bennettEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: "profile_updated",
          sourceObjectId: bennettPrincipalProfileId,
          sourceObjectType: ObjectType.USER,
          title: "Client profile update submitted",
          visibilityStatus: VisibilityStatus.CLIENT_VISIBLE,
        },
      });

      return {
        clientVisible: false,
        evidenceItemId: evidenceItem.id,
        message: "Profile update submitted for review.",
        profileRows: profile.count,
      };
    },
  );
}

async function runJ09AddMember(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.PENDING,
      clientTenantId: bennettTenantId,
      eventType: "screencast.family_member.created",
      evidenceRecordId: bennettEvidenceRecordId,
      metadataJson: {
        familyMemberName: "Olivia Bennett",
        relationshipLabel: "Next Gen",
      },
      nextState: "FAMILY_MEMBER_DRAFT",
      permissionAction: "CREATE",
      previousState: "FAMILY_MEMBER_NOT_CREATED",
      reason: "Client added Olivia Bennett as a next-generation family member.",
      sensitivity: "CONFIDENTIAL",
      targetId: bennettOliviaFamilyMemberId,
      targetType: ObjectType.FAMILY_MEMBER,
      tenantSlug: "bennett",
      visibilityStatus: "CLIENT_VISIBLE",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const member = await tx.familyMember.upsert({
        where: { id: bennettOliviaFamilyMemberId },
        create: {
          id: bennettOliviaFamilyMemberId,
          clientTenantId: bennettTenantId,
          displayName: "Olivia Bennett",
          isPrincipal: false,
          relationshipType: "Next Gen",
          sensitivity: Sensitivity.CONFIDENTIAL,
          taxResidency: null,
        },
        update: {
          displayName: "Olivia Bennett",
          isPrincipal: false,
          relationshipType: "Next Gen",
          sensitivity: Sensitivity.CONFIDENTIAL,
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: bennettEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: "family_member_created",
          sourceObjectId: member.id,
          sourceObjectType: ObjectType.FAMILY_MEMBER,
          title: "Family member draft created",
          visibilityStatus: VisibilityStatus.CLIENT_VISIBLE,
        },
      });

      return {
        clientVisible: false,
        evidenceItemId: evidenceItem.id,
        familyMemberId: member.id,
        message: "Family member draft created.",
      };
    },
  );
}

async function runJ09SaveFamilyChanges(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();
  const dateOfBirth = new Date("2003-04-14T00:00:00.000Z");

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: bennettTenantId,
      eventType: "screencast.family_member.updated",
      evidenceRecordId: bennettEvidenceRecordId,
      metadataJson: {
        governanceRole: "Next Gen",
        taxResidency: "South Africa",
      },
      nextState: "FAMILY_MEMBER_UPDATED",
      permissionAction: "EDIT",
      previousState: "FAMILY_MEMBER_DRAFT",
      reason: "Client saved family member details and governance role.",
      sensitivity: "CONFIDENTIAL",
      targetId: bennettOliviaFamilyMemberId,
      targetType: ObjectType.FAMILY_MEMBER,
      tenantSlug: "bennett",
      visibilityStatus: "CLIENT_VISIBLE",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const member = await tx.familyMember.upsert({
        where: { id: bennettOliviaFamilyMemberId },
        create: {
          id: bennettOliviaFamilyMemberId,
          clientTenantId: bennettTenantId,
          dateOfBirth,
          displayName: "Olivia Bennett",
          isPrincipal: false,
          relationshipType: "Next Gen",
          sensitivity: Sensitivity.CONFIDENTIAL,
          taxResidency: "South Africa",
        },
        update: {
          dateOfBirth,
          displayName: "Olivia Bennett",
          relationshipType: "Next Gen",
          sensitivity: Sensitivity.CONFIDENTIAL,
          taxResidency: "South Africa",
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: bennettEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: "family_member_updated",
          sourceObjectId: member.id,
          sourceObjectType: ObjectType.FAMILY_MEMBER,
          title: "Family member details saved",
          visibilityStatus: VisibilityStatus.CLIENT_VISIBLE,
        },
      });

      return {
        clientVisible: false,
        evidenceItemId: evidenceItem.id,
        familyMemberId: member.id,
        message: "Family member details saved.",
      };
    },
  );
}

async function runJ09OpenFamilyMap(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: bennettTenantId,
      eventType: "screencast.relationship.family_map_opened",
      evidenceRecordId: bennettEvidenceRecordId,
      metadataJson: {
        familyMapOpened: true,
        restrictedRelationshipsRemainScoped: true,
      },
      nextState: "FAMILY_MAP_OPENED",
      permissionAction: "VIEW",
      previousState: "FAMILY_MEMBER_UPDATED",
      reason: "Client opened the family relationship map.",
      sensitivity: "CONFIDENTIAL",
      targetId: bennettPrincipalFamilyMemberId,
      targetType: ObjectType.FAMILY_MEMBER,
      tenantSlug: "bennett",
      visibilityStatus: "CLIENT_VISIBLE",
      workflowState: "IN_REVIEW",
    },
    async () => ({
      clientVisible: false,
      message: "Family map view audited.",
    }),
  );
}

async function runJ09AddRelationship(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: bennettTenantId,
      eventType: "screencast.relationship.created",
      evidenceRecordId: bennettEvidenceRecordId,
      metadataJson: {
        confidence: "88.00",
        relationshipLabel: "Next Gen governance participant",
      },
      nextState: "RELATIONSHIP_CREATED",
      permissionAction: "CREATE",
      previousState: "FAMILY_MAP_OPENED",
      reason: "Client linked Olivia Bennett into the family governance map.",
      sensitivity: "CONFIDENTIAL",
      targetId: bennettOliviaRelationshipId,
      targetType: ObjectType.RELATIONSHIP,
      tenantSlug: "bennett",
      visibilityStatus: "CLIENT_VISIBLE",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const relationship = await tx.relationship.upsert({
        where: { id: bennettOliviaRelationshipId },
        create: {
          id: bennettOliviaRelationshipId,
          clientTenantId: bennettTenantId,
          confidence: new Prisma.Decimal("88.00"),
          objectId: bennettOliviaFamilyMemberId,
          objectType: ObjectType.FAMILY_MEMBER,
          relationshipType: "parent_child_governance",
          sourceDocumentId: documentId("bennett", "trust-deed"),
          subjectId: bennettPrincipalFamilyMemberId,
          subjectType: ObjectType.FAMILY_MEMBER,
        },
        update: {
          confidence: new Prisma.Decimal("88.00"),
          objectId: bennettOliviaFamilyMemberId,
          objectType: ObjectType.FAMILY_MEMBER,
          relationshipType: "parent_child_governance",
          sourceDocumentId: documentId("bennett", "trust-deed"),
          subjectId: bennettPrincipalFamilyMemberId,
          subjectType: ObjectType.FAMILY_MEMBER,
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: bennettEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: "relationship_created",
          sourceObjectId: relationship.id,
          sourceObjectType: ObjectType.RELATIONSHIP,
          title: "Family relationship created",
          visibilityStatus: VisibilityStatus.CLIENT_VISIBLE,
        },
      });

      return {
        clientVisible: false,
        evidenceItemId: evidenceItem.id,
        message: "Family relationship created.",
        relationshipId: relationship.id,
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

    case "j04.portalUpload":
    case "j04.openUploadDocument":
    case "j04.viewDetails":
      return runJ04DocumentNavigationAudit(prisma, actionId);

    case "j04.uploadDocument":
      return runJ04UploadDocument(prisma, actionId);

    case "j04.confirmFinalize":
      return runJ04ConfirmFinalize(prisma, actionId);

    case "j05.createEntity":
      return runJ05CreateEntityIntent(prisma, actionId);

    case "j05.continueEntity":
      return runJ05ContinueEntity(prisma, actionId);

    case "j05.editEntity":
      return runJ05EditEntity(prisma, actionId);

    case "j05.viewDetails":
      return runJ05ViewDetails(prisma, actionId);

    case "j05.markReady":
      return runJ05MarkReady(prisma, actionId);

    case "j05.requestInfo":
      return runJ05RequestInfo(prisma, actionId);

    case "j09.portalUpload":
      return runJ09PortalUpload(prisma, actionId);

    case "j09.submitProfile":
      return runJ09SubmitProfile(prisma, actionId);

    case "j09.addMember":
      return runJ09AddMember(prisma, actionId);

    case "j09.saveFamilyChanges":
      return runJ09SaveFamilyChanges(prisma, actionId);

    case "j09.openFamilyMap":
      return runJ09OpenFamilyMap(prisma, actionId);

    case "j09.addRelationship":
      return runJ09AddRelationship(prisma, actionId);

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
            demoWorkflowBoundary.canonicalApiRoute === "/api/platform-admin/actions"
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
