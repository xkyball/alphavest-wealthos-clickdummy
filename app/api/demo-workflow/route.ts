import { createHash } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AdviceClassification,
  AuditResult,
  ComplianceStatus,
  DecisionStatus,
  DocumentStatus,
  EvidenceStatus,
  EntityType,
  ExportStatus,
  ExportType,
  ObjectType,
  PermissionAction,
  Prisma,
  PrismaClient,
  RecommendationStatus,
  ReviewStatus,
  RoleScope,
  Sensitivity,
  TenantStatus,
  UserStatus,
  VisibilityStatus,
  WorkflowStatus,
} from "@prisma/client";
import { NextResponse } from "next/server";

import { parseDemoWorkflowRequestBody } from "@/lib/demo-workflow-validation";
import { exportPackageService } from "@/lib/export-package-service";
import {
  RecommendationReviewWorkflowError,
  runDemoWorkflowMutation,
  runRecommendationReviewWorkflowMutation,
} from "@/lib/demo-workflow-mutation";
import { exportService } from "@/lib/export-service";
import { fileMetadataService } from "@/lib/file-metadata-service";
import type { DemoRoleKey } from "@/lib/demo-session";
import type { PermissionDecision } from "@/lib/permission-engine";
import { workflowGate } from "@/lib/workflow-gate";
import { suitabilityGateCandidate } from "@/lib/suitability-ips-demo-data";
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
  | "j06.newTenant"
  | "j06.continueTenant"
  | "j06.assignTeam"
  | "j06.openInvitation"
  | "j06.sendInvitation"
  | "j07.inviteUser"
  | "j07.sendInvitation"
  | "j07.saveRoleChanges"
  | "j07.approveAccess"
  | "j07.exportAudit"
  | "j08.selectDataExtract"
  | "j08.clearScope"
  | "j08.confirmApproval"
  | "j08.downloadExport"
  | "j08.shareExport"
  | "j09.portalUpload"
  | "j09.submitProfile"
  | "j09.addMember"
  | "j09.saveFamilyChanges"
  | "j09.openFamilyMap"
  | "j09.addRelationship"
  | "j12.requestKycEvidence"
  | "j12.completeKycReview"
  | "j12.escalateSourceOfWealth"
  | "j12.linkSourceEvidence"
  | "j13.requestSuitabilityEvidence"
  | "j13.markSuitabilityReviewed"
  | "j14.requestIpsMandateChanges"
  | "j14.linkIpsEvidence"
  | "j16.scheduleReview"
  | "j16.escalateOverdueReview"
  | "j17.blockRebalanceTrigger"
  | "j17.routeRebalanceReview"
  | string;

type JourneyTarget = {
  actorRoleKey: string;
  actorUserId: string;
  clientTenantId: string;
  targetType: ObjectType;
  targetId: string;
};

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
const northbridgeEvidenceRecordId = evidenceRecordId("northbridge");
const northbridgeReviewScheduleId = stableId("review-schedule:northbridge:decision");
const northbridgeComplianceQueueId = stableId("queue:northbridge:compliance");
const northbridgeAccessRequestId = accessRequestId("northbridge");
const northbridgeExportRequestId = exportRequestId("northbridge");
const northbridgeExternalUserId = userId("northbridge:external");
const northbridgeInvitedUserId = userId("northbridge:emily-roberts");
const northbridgePortfolioManagerRoleId = stableId("role:northbridge:portfolio_manager");
const morganTenantId = tenantId("morgan");
const morganRecommendationId = recommendationId("morgan");
const morganComplianceReviewId = complianceReviewId("morgan");
const morganEvidenceRecordId = evidenceRecordId("morgan");
const morganTaxDocumentId = documentId("morgan", "missing-tax");
const morganKycComplianceReviewId = stableId("compliance:morgan:kyc-aml-source-of-wealth");
const morganKycEvidenceRecordId = stableId("evidence:morgan:kyc-aml-source-of-wealth");
const morganSourceOfWealthDocumentId = documentId("morgan", "source-of-wealth");
const morganSuitabilityProfileId = stableId("suitability:morgan:profile");
const morganSuitabilityEvidenceRecordId = stableId("evidence:morgan:suitability-profile");
const morganIpsMandateId = stableId("ips:morgan:mandate");
const morganIpsEvidenceRecordId = stableId("evidence:morgan:ips-mandate");
const morganPrincipalUserId = userId("morgan:principal");
const morganReviewScheduleId = stableId("review-schedule:morgan:decision");
const summitTenantId = tenantId("summit");
const summitRecommendationId = recommendationId("summit");
const summitApprovalId = approvalId("summit");
const summitComplianceReviewId = complianceReviewId("summit");
const summitEvidenceRecordId = evidenceRecordId("summit");
const summitExportRequestId = exportRequestId("summit");
const summitGeneratedExportDocumentId = documentId("summit", "generated-export-package");
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

function roleId(key: string) {
  return stableId(`role:${key}`);
}

function permissionId(key: string) {
  return stableId(`permission:${key}`);
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

function engagementId(slug: string) {
  return stableId(`engagement:${slug}:annual-governance-review`);
}

function entityId(slug: string, key: string) {
  return stableId(`entity:${slug}:${key}`);
}

function familyMemberId(slug: string, key: string) {
  return stableId(`family:${slug}:${key}`);
}

function exportRequestId(slug: string) {
  return stableId(`export:${slug}:evidence-pack`);
}

function accessRequestId(slug: string) {
  return stableId(`access-request:${slug}:external`);
}

function policyDefinitionId(key: string) {
  return stableId(`policy:platform:${key}:v1`);
}

function exportExpiryDate(from: Date) {
  const expiryDate = new Date(from);
  expiryDate.setDate(expiryDate.getDate() + 7);
  return expiryDate;
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

function toSnakeCase(value: string) {
  return value.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

function genericTargetForAction(actionId: string): JourneyTarget {
  const journeyId = actionId.slice(0, 3).toUpperCase();
  switch (journeyId) {
    case "J02":
      return {
        actorRoleKey: "compliance_officer",
        actorUserId: userId("compliance"),
        clientTenantId: tenantId("morgan"),
        targetType: ObjectType.RECOMMENDATION,
        targetId: recommendationId("morgan"),
      };
    case "J03":
      return {
        actorRoleKey: "principal",
        actorUserId: userId("bennett:principal"),
        clientTenantId: tenantId("bennett"),
        targetType: ObjectType.DECISION,
        targetId: decisionId("bennett"),
      };
    case "J04":
      return {
        actorRoleKey: "family_cfo",
        actorUserId: userId("morgan:cfo"),
        clientTenantId: tenantId("morgan"),
        targetType: ObjectType.DOCUMENT,
        targetId: documentId("morgan", "missing-tax"),
      };
    case "J05":
      return {
        actorRoleKey: "principal",
        actorUserId: userId("summit:principal"),
        clientTenantId: tenantId("summit"),
        targetType: ObjectType.ENTITY,
        targetId: entityId("summit", "trust"),
      };
    case "J06":
      return {
        actorRoleKey: "admin",
        actorUserId: userId("admin"),
        clientTenantId: tenantId("morgan"),
        targetType: ObjectType.TENANT,
        targetId: tenantId("morgan"),
      };
    case "J07":
      return {
        actorRoleKey: "principal",
        actorUserId: userId("northbridge:principal"),
        clientTenantId: tenantId("northbridge"),
        targetType: ObjectType.USER,
        targetId: accessRequestId("northbridge"),
      };
    case "J08":
      return {
        actorRoleKey: "principal",
        actorUserId: userId("summit:principal"),
        clientTenantId: tenantId("summit"),
        targetType: ObjectType.EVIDENCE_RECORD,
        targetId: exportRequestId("summit"),
      };
    case "J09":
      return {
        actorRoleKey: "principal",
        actorUserId: userId("bennett:principal"),
        clientTenantId: tenantId("bennett"),
        targetType: ObjectType.FAMILY_MEMBER,
        targetId: stableId("family:bennett:principal"),
      };
    case "J10":
      return {
        actorRoleKey: "security_officer",
        actorUserId: userId("security"),
        clientTenantId: tenantId("northbridge"),
        targetType: ObjectType.PERMISSION,
        targetId: policyDefinitionId("advice-boundary"),
      };
    default:
      return {
        actorRoleKey: "system",
        actorUserId: userId("admin"),
        clientTenantId: northbridgeTenantId,
        targetType: ObjectType.PLATFORM,
        targetId: platformTenantId,
      };
  }
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

async function runJ02ReleaseClient(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "compliance_officer",
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

      const gate = workflowGate.canBecomeClientVisible({
        advisorApprovalStatus: approval.status as DomainReviewStatus,
        complianceStatus: "RELEASED",
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
            "Screencast J02 compliance release. Advisor approval and validated evidence were checked before visibility.",
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
            "Compliance release proof. workflowGate passed before the recommendation became client-visible.",
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
          title: "workflowGate compliance release proof",
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

async function runJ03DecisionAction(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();
  const actionMap = {
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
  }[actionId];

  if (!actionMap) {
    throw new Error(`Unsupported J03 decision action: ${actionId}`);
  }

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: actionMap.auditResult,
      clientTenantId: bennettTenantId,
      eventType: actionMap.eventType,
      evidenceRecordId: bennettEvidenceRecordId,
      metadataJson: {
        decisionAction: actionMap.decisionAction,
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

async function runJ06TenantCreateIntent(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "admin",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: morganTenantId,
      eventType: "screencast.tenant.create_intent",
      metadataJson: {
        tenantSlug: "morgan",
        workflowGate: "tenant_onboarding_started",
      },
      nextState: TenantStatus.DRAFT,
      permissionAction: "CREATE",
      previousState: TenantStatus.ONBOARDING,
      reason: "Admin opened tenant creation flow for the Morgan onboarding fixture.",
      targetId: morganTenantId,
      targetType: ObjectType.TENANT,
      tenantSlug: "morgan",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "DRAFT",
    },
    async (tx) => {
      const tenant = await tx.clientTenant.updateMany({
        where: { id: morganTenantId },
        data: {
          onboardingCompletedAt: null,
          status: TenantStatus.DRAFT,
        },
      });

      return {
        clientVisible: false,
        message: "Tenant draft state saved for onboarding.",
        tenantRows: tenant.count,
      };
    },
  );
}

async function runJ06ContinueTenant(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "admin",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: morganTenantId,
      eventType: "screencast.tenant.details_saved",
      metadataJson: {
        jurisdiction: "United Kingdom",
        serviceTier: "Signature",
        tenantSlug: "morgan",
      },
      nextState: TenantStatus.ONBOARDING,
      permissionAction: "EDIT",
      previousState: TenantStatus.DRAFT,
      reason: "Tenant details saved and moved to onboarding setup.",
      targetId: morganTenantId,
      targetType: ObjectType.TENANT,
      tenantSlug: "morgan",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const tenant = await tx.clientTenant.updateMany({
        where: { id: morganTenantId },
        data: {
          dataRegion: "EU",
          jurisdiction: "United Kingdom",
          legalName: "Morgan Family Office LLP",
          onboardingCompletedAt: null,
          relationshipTier: "Signature",
          riskRating: "Medium",
          status: TenantStatus.ONBOARDING,
        },
      });

      return {
        clientVisible: false,
        message: "Tenant details saved and onboarding setup opened.",
        tenantRows: tenant.count,
      };
    },
  );
}

async function runJ06AssignTeam(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();
  const assignments = [
    ["advisor", "senior_wealth_advisor"],
    ["analyst", "analyst"],
    ["compliance", "compliance_officer"],
    ["success", "client_success"],
  ] as const;

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "admin",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: morganTenantId,
      eventType: "screencast.tenant.team_assigned",
      metadataJson: {
        assignedRoles: assignments.map(([, roleKey]) => roleKey),
        tenantSlug: "morgan",
      },
      nextState: "TEAM_ASSIGNED",
      permissionAction: "ASSIGN",
      previousState: TenantStatus.ONBOARDING,
      reason: "Admin assigned required AlphaVest service team roles.",
      targetId: morganTenantId,
      targetType: ObjectType.TENANT,
      tenantSlug: "morgan",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const tenant = await tx.clientTenant.updateMany({
        where: { id: morganTenantId },
        data: {
          clientSuccessOwnerUserId: userId("success"),
          complianceOwnerUserId: userId("compliance"),
          primaryAdvisorUserId: userId("advisor"),
          primaryAnalystUserId: userId("analyst"),
          status: TenantStatus.ONBOARDING,
        },
      });
      const userRoles = await Promise.all(
        assignments.map(([actorKey, roleKey]) =>
          tx.userRole.upsert({
            where: { id: stableId(`user-role:morgan:${actorKey}:${roleKey}`) },
            create: {
              id: stableId(`user-role:morgan:${actorKey}:${roleKey}`),
              assignedByUserId: userId("admin"),
              clientTenantId: morganTenantId,
              createdAt: now,
              roleId: roleId(roleKey),
              status: "active",
              updatedAt: now,
              userId: userId(actorKey),
              validFrom: now,
            },
            update: {
              assignedByUserId: userId("admin"),
              clientTenantId: morganTenantId,
              roleId: roleId(roleKey),
              status: "active",
              updatedAt: now,
              validFrom: now,
            },
          }),
        ),
      );
      const policy = await tx.policyDefinition.upsert({
        where: {
          platformTenantId_clientTenantId_policyKey_version: {
            clientTenantId: morganTenantId,
            platformTenantId,
            policyKey: "tenant.onboarding_controls",
            version: "2026.06",
          },
        },
        create: {
          id: stableId("policy:morgan:onboarding-controls:v1"),
          category: "onboarding",
          clientTenantId: morganTenantId,
          createdAt: now,
          createdByUserId: userId("admin"),
          effectiveFrom: now,
          name: "Morgan Family Office Onboarding Controls",
          platformTenantId,
          policyKey: "tenant.onboarding_controls",
          rulesJson: {
            auditLoggingRequired: true,
            complianceOwnerRequired: true,
            principalInvitationRequired: true,
            serviceTeamRequired: true,
          },
          status: "active",
          updatedAt: now,
          version: "2026.06",
        },
        update: {
          createdByUserId: userId("admin"),
          effectiveFrom: now,
          rulesJson: {
            auditLoggingRequired: true,
            complianceOwnerRequired: true,
            principalInvitationRequired: true,
            serviceTeamRequired: true,
          },
          status: "active",
          updatedAt: now,
        },
      });

      return {
        clientVisible: false,
        message: "Tenant service team and onboarding controls saved.",
        policyId: policy.id,
        tenantRows: tenant.count,
        userRoleRows: userRoles.length,
      };
    },
  );
}

async function runJ06OpenInvitation(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "admin",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: morganTenantId,
      eventType: "screencast.tenant.invitation_opened",
      metadataJson: {
        inviteEmail: "principal.morgan@example.demo",
        tenantSlug: "morgan",
      },
      nextState: "INVITATION_OPENED",
      permissionAction: "INVITE",
      previousState: TenantStatus.ONBOARDING,
      reason: "Admin opened principal invitation drawer.",
      targetId: morganPrincipalUserId,
      targetType: ObjectType.USER,
      tenantSlug: "morgan",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async () => ({
      clientVisible: false,
      message: "Tenant invitation drawer audited.",
    }),
  );
}

async function runJ06SendInvitation(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "admin",
      auditResult: AuditResult.PENDING,
      clientTenantId: morganTenantId,
      eventType: "screencast.tenant.invitation_sent",
      metadataJson: {
        inviteEmail: "principal.morgan@example.demo",
        noEmailDelivery: true,
        tenantSlug: "morgan",
      },
      nextState: UserStatus.INVITED,
      permissionAction: "INVITE",
      previousState: TenantStatus.ONBOARDING,
      reason: "Admin sent demo principal invitation without real email delivery.",
      targetId: morganPrincipalUserId,
      targetType: ObjectType.USER,
      tenantSlug: "morgan",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const tenant = await tx.clientTenant.updateMany({
        where: { id: morganTenantId },
        data: {
          onboardingCompletedAt: null,
          status: TenantStatus.ONBOARDING,
        },
      });
      const user = await tx.user.updateMany({
        where: { id: morganPrincipalUserId },
        data: {
          lastLoginAt: null,
          mfaEnabled: false,
          status: UserStatus.INVITED,
        },
      });
      const userRole = await tx.userRole.upsert({
        where: { id: stableId("user-role:morgan:principal:principal") },
        create: {
          id: stableId("user-role:morgan:principal:principal"),
          assignedByUserId: userId("admin"),
          clientTenantId: morganTenantId,
          createdAt: now,
          roleId: roleId("principal"),
          status: "pending_invite",
          updatedAt: now,
          userId: morganPrincipalUserId,
          validFrom: now,
        },
        update: {
          assignedByUserId: userId("admin"),
          status: "pending_invite",
          updatedAt: now,
          validFrom: now,
        },
      });
      const consent = await tx.consentRecord.upsert({
        where: { id: stableId("consent:morgan:principal:onboarding-invite:2026.06") },
        create: {
          id: stableId("consent:morgan:principal:onboarding-invite:2026.06"),
          clientTenantId: morganTenantId,
          consentType: "privacy_notice",
          createdAt: now,
          source: "demo_invite",
          status: "pending",
          userId: morganPrincipalUserId,
          version: "2026.06",
        },
        update: {
          acceptedAt: null,
          source: "demo_invite",
          status: "pending",
          withdrawnAt: null,
        },
      });

      return {
        clientVisible: false,
        consentId: consent.id,
        message: "Tenant principal invitation saved in demo state.",
        tenantRows: tenant.count,
        userRoleId: userRole.id,
        userRows: user.count,
      };
    },
  );
}

async function runJ07InviteUser(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "admin",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: northbridgeTenantId,
      eventType: "screencast.governance.invite_opened",
      metadataJson: {
        inviteEmail: "emily.roberts@example.test",
        roleScopeRequired: true,
      },
      nextState: "INVITE_DRAWER_OPENED",
      permissionAction: "INVITE",
      previousState: "NO_INVITE_STARTED",
      reason: "Admin opened a scoped governance invitation workflow.",
      sensitivity: "RESTRICTED",
      targetId: northbridgeInvitedUserId,
      targetType: ObjectType.USER,
      tenantSlug: "northbridge",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async () => ({
      clientVisible: false,
      message: "Governance invitation drawer audited.",
    }),
  );
}

async function runJ07SendInvitation(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "admin",
      auditResult: AuditResult.PENDING,
      clientTenantId: northbridgeTenantId,
      eventType: "screencast.governance.invitation_sent",
      metadataJson: {
        inviteEmail: "emily.roberts@example.test",
        noEmailDelivery: true,
        scopedRole: "analyst",
      },
      nextState: UserStatus.INVITED,
      permissionAction: "INVITE",
      previousState: "INVITE_DRAWER_OPENED",
      reason: "Admin sent a scoped governance invite without real email delivery.",
      sensitivity: "RESTRICTED",
      targetId: northbridgeInvitedUserId,
      targetType: ObjectType.USER,
      tenantSlug: "northbridge",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const user = await tx.user.upsert({
        where: { id: northbridgeInvitedUserId },
        create: {
          id: northbridgeInvitedUserId,
          displayName: "Emily Roberts",
          email: "emily.roberts@example.test",
          isServiceAccount: false,
          lastLoginAt: null,
          mfaEnabled: false,
          platformTenantId,
          preferredLocale: "en-ZA",
          status: UserStatus.INVITED,
          timezone: "Africa/Johannesburg",
        },
        update: {
          displayName: "Emily Roberts",
          email: "emily.roberts@example.test",
          lastLoginAt: null,
          mfaEnabled: false,
          status: UserStatus.INVITED,
        },
      });
      const profile = await tx.userProfile.upsert({
        where: { id: stableId("user-profile:northbridge:emily-roberts") },
        create: {
          id: stableId("user-profile:northbridge:emily-roberts"),
          clientTenantId: northbridgeTenantId,
          countryOfResidence: "South Africa",
          firstName: "Emily",
          lastName: "Roberts",
          relationshipLabel: "Investment committee delegate",
          sensitivity: Sensitivity.CONFIDENTIAL,
          userId: user.id,
        },
        update: {
          clientTenantId: northbridgeTenantId,
          countryOfResidence: "South Africa",
          firstName: "Emily",
          lastName: "Roberts",
          relationshipLabel: "Investment committee delegate",
          sensitivity: Sensitivity.CONFIDENTIAL,
        },
      });
      const userRole = await tx.userRole.upsert({
        where: { id: stableId("user-role:northbridge:emily-roberts:analyst") },
        create: {
          id: stableId("user-role:northbridge:emily-roberts:analyst"),
          assignedByUserId: userId("admin"),
          clientTenantId: northbridgeTenantId,
          createdAt: now,
          roleId: roleId("analyst"),
          status: "pending_invite",
          updatedAt: now,
          userId: user.id,
          validFrom: now,
        },
        update: {
          assignedByUserId: userId("admin"),
          clientTenantId: northbridgeTenantId,
          roleId: roleId("analyst"),
          status: "pending_invite",
          updatedAt: now,
          validFrom: now,
        },
      });

      return {
        clientVisible: false,
        message: "Scoped governance invitation saved in demo state.",
        profileId: profile.id,
        userId: user.id,
        userRoleId: userRole.id,
      };
    },
  );
}

async function runJ07SaveRoleChanges(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();
  const expiresAt = exportExpiryDate(now);
  const permissionKeys = ["documents.review", "exports.create", "audit.view"];

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "security_officer",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: northbridgeTenantId,
      eventType: "screencast.governance.role_sensitive_change_confirmed",
      metadataJson: {
        confirmationPhrase: "PORTFOLIO MANAGER",
        requiresSecondConfirmation: true,
        sensitivePermissionCount: permissionKeys.length,
      },
      nextState: "SENSITIVE_ROLE_CONFIRMED",
      permissionAction: "MANAGE",
      previousState: "SENSITIVE_ROLE_CHANGE_PENDING",
      reason: "Security confirmed sensitive Portfolio Manager permission changes.",
      sensitivity: "HIGHLY_RESTRICTED",
      targetId: northbridgePortfolioManagerRoleId,
      targetType: ObjectType.ROLE,
      tenantSlug: "northbridge",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const role = await tx.role.upsert({
        where: {
          platformTenantId_clientTenantId_key: {
            clientTenantId: northbridgeTenantId,
            key: "portfolio_manager",
            platformTenantId,
          },
        },
        create: {
          id: northbridgePortfolioManagerRoleId,
          clientTenantId: northbridgeTenantId,
          description:
            "Tenant-scoped portfolio manager role confirmed through J07 second confirmation.",
          isSystemRole: false,
          key: "portfolio_manager",
          name: "Portfolio Manager",
          platformTenantId,
          requiresSecondConfirmation: true,
          scope: RoleScope.TENANT,
          segregationGroup: "investment-management",
        },
        update: {
          description:
            "Tenant-scoped portfolio manager role confirmed through J07 second confirmation.",
          isSystemRole: false,
          name: "Portfolio Manager",
          requiresSecondConfirmation: true,
          scope: RoleScope.TENANT,
          segregationGroup: "investment-management",
        },
      });
      const rolePermissions = await Promise.all(
        permissionKeys.map((permissionKey) =>
          tx.rolePermission.upsert({
            where: {
              roleId_permissionId: {
                permissionId: permissionId(permissionKey),
                roleId: role.id,
              },
            },
            create: {
              id: stableId(`role-permission:northbridge:portfolio_manager:${permissionKey}`),
              conditionJson: {
                demo: true,
                secondConfirmationId: stableId("second-confirmation:northbridge:portfolio-manager-role"),
                tenantScoped: true,
              },
              effect: "allow",
              permissionId: permissionId(permissionKey),
              roleId: role.id,
            },
            update: {
              conditionJson: {
                demo: true,
                secondConfirmationId: stableId("second-confirmation:northbridge:portfolio-manager-role"),
                tenantScoped: true,
              },
              effect: "allow",
            },
          }),
        ),
      );
      const secondConfirmation = await tx.secondConfirmation.upsert({
        where: { id: stableId("second-confirmation:northbridge:portfolio-manager-role") },
        create: {
          id: stableId("second-confirmation:northbridge:portfolio-manager-role"),
          action: PermissionAction.MANAGE,
          actorUserId: userId("admin"),
          clientTenantId: northbridgeTenantId,
          confirmationPhrase: "PORTFOLIO MANAGER",
          confirmedAt: now,
          confirmedByUserId: userId("security"),
          createdAt: now,
          expiresAt,
          status: "confirmed",
          targetObjectId: role.id,
          targetObjectType: ObjectType.ROLE,
        },
        update: {
          action: PermissionAction.MANAGE,
          actorUserId: userId("admin"),
          confirmationPhrase: "PORTFOLIO MANAGER",
          confirmedAt: now,
          confirmedByUserId: userId("security"),
          expiresAt,
          status: "confirmed",
          targetObjectId: role.id,
          targetObjectType: ObjectType.ROLE,
        },
      });

      return {
        clientVisible: false,
        message: "Sensitive role changes saved with second confirmation.",
        roleId: role.id,
        rolePermissionRows: rolePermissions.length,
        secondConfirmationId: secondConfirmation.id,
      };
    },
  );
}

async function runJ07ApproveAccess(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "compliance_officer",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: northbridgeTenantId,
      eventType: "screencast.governance.access_approved",
      evidenceRecordId: northbridgeEvidenceRecordId,
      metadataJson: {
        policyChecksPassed: true,
        scopedAccessOnly: true,
        sodReviewRequired: true,
      },
      nextState: WorkflowStatus.COMPLETED,
      permissionAction: "ASSIGN",
      previousState: WorkflowStatus.IN_REVIEW,
      reason: "Compliance approved scoped external-advisor document access after policy checks.",
      sensitivity: "RESTRICTED",
      targetId: northbridgeAccessRequestId,
      targetType: ObjectType.PERMISSION,
      tenantSlug: "northbridge",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const accessRequest = await tx.accessRequest.updateMany({
        where: { id: northbridgeAccessRequestId, clientTenantId: northbridgeTenantId },
        data: {
          decisionAt: now,
          reviewerUserId: userId("compliance"),
          status: WorkflowStatus.COMPLETED,
        },
      });
      const secondConfirmation = await tx.secondConfirmation.updateMany({
        where: {
          clientTenantId: northbridgeTenantId,
          id: stableId("second-confirmation:northbridge:external-access"),
        },
        data: {
          confirmedAt: now,
          confirmedByUserId: userId("security"),
          status: "confirmed",
        },
      });
      const userRole = await tx.userRole.upsert({
        where: { id: stableId("user-role:northbridge:external:statement-review") },
        create: {
          id: stableId("user-role:northbridge:external:statement-review"),
          assignedByUserId: userId("compliance"),
          clientTenantId: northbridgeTenantId,
          createdAt: now,
          objectId: documentId("northbridge", "statement"),
          objectType: ObjectType.DOCUMENT,
          roleId: roleId("external_advisor"),
          status: "active",
          updatedAt: now,
          userId: northbridgeExternalUserId,
          validFrom: now,
          validUntil: exportExpiryDate(now),
        },
        update: {
          assignedByUserId: userId("compliance"),
          clientTenantId: northbridgeTenantId,
          objectId: documentId("northbridge", "statement"),
          objectType: ObjectType.DOCUMENT,
          roleId: roleId("external_advisor"),
          status: "active",
          updatedAt: now,
          validFrom: now,
          validUntil: exportExpiryDate(now),
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: northbridgeEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: "access_request_approved",
          sourceObjectId: documentId("northbridge", "statement"),
          sourceObjectType: ObjectType.DOCUMENT,
          title: "Scoped access request approved",
          visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
        },
      });

      return {
        accessRequestRows: accessRequest.count,
        clientVisible: false,
        evidenceItemId: evidenceItem.id,
        message: "Scoped access approved after policy and second-confirmation checks.",
        secondConfirmationRows: secondConfirmation.count,
        userRoleId: userRole.id,
      };
    },
  );
}

async function runJ07ExportAudit(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "security_officer",
      auditResult: AuditResult.PENDING,
      clientTenantId: northbridgeTenantId,
      eventType: "screencast.governance.audit_export_controlled",
      evidenceRecordId: northbridgeEvidenceRecordId,
      metadataJson: {
        auditExportControlled: true,
        exportCannotBypassControls: true,
      },
      nextState: ExportStatus.APPROVAL_REQUIRED,
      permissionAction: "EXPORT",
      previousState: "AUDIT_HISTORY_VIEWED",
      reason: "Audit export stayed controlled and requires export approval.",
      sensitivity: "RESTRICTED",
      targetId: northbridgeExportRequestId,
      targetType: ObjectType.EXPORT_REQUEST,
      tenantSlug: "northbridge",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const exportRequest = await tx.exportRequest.updateMany({
        where: { id: northbridgeExportRequestId, clientTenantId: northbridgeTenantId },
        data: {
          approvalRequired: true,
          approvedByUserId: null,
          exportType: ExportType.ACTIVITY_LOG_EXPORT,
          generatedFileDocumentId: null,
          redactionProfile: "compliance-internal",
          scopeJson: {
            auditEventIds: [
              stableId("audit:northbridge:export"),
              stableId("audit:northbridge:compliance-release"),
              stableId("audit:northbridge:profile"),
            ],
            auditExportControlledAt: now.toISOString(),
            exportCannotBypassControls: true,
            phase18FileRealismDeferred: true,
            tenant: "Northbridge Family Office",
          },
          status: ExportStatus.APPROVAL_REQUIRED,
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: northbridgeEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: "audit_export_controlled",
          sourceObjectId: northbridgeExportRequestId,
          sourceObjectType: ObjectType.EXPORT_REQUEST,
          title: "Audit export control recorded",
          visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
        },
      });

      return {
        clientVisible: false,
        evidenceItemId: evidenceItem.id,
        exportRows: exportRequest.count,
        message: "Audit export remains approval-gated.",
      };
    },
  );
}

async function runJ08SelectDataExtract(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: summitTenantId,
      eventType: "screencast.export.created",
      evidenceRecordId: summitEvidenceRecordId,
      metadataJson: {
        exportTypeLabel: "Data Extract",
        phase18FileRealismDeferred: true,
        realFileGenerated: false,
      },
      nextState: ExportStatus.DRAFT,
      permissionAction: "EXPORT",
      previousState: "SEEDED_FIXTURE",
      reason: "Client principal started a permission-scoped data extract export.",
      sensitivity: "RESTRICTED",
      targetId: summitExportRequestId,
      targetType: ObjectType.EXPORT_REQUEST,
      tenantSlug: "summit",
      visibilityStatus: "RESTRICTED",
      workflowState: "DRAFT",
    },
    async (tx) => {
      const exportRequest = await tx.exportRequest.updateMany({
        where: { id: summitExportRequestId, clientTenantId: summitTenantId },
        data: {
          approvalRequired: true,
          approvedByUserId: null,
          exportType: ExportType.EXTERNAL_ADVISOR_DATA_ROOM,
          generatedFileDocumentId: null,
          redactionProfile: "external-limited",
          scopeJson: {
            blockedItemIncluded: false,
            createdAt: now.toISOString(),
            exportTypeLabel: "Data Extract",
            phase18FileRealismDeferred: true,
            selectedObjects: [],
            tenant: "Summit Family Office",
          },
          status: ExportStatus.DRAFT,
        },
      });

      return {
        clientVisible: false,
        exportRows: exportRequest.count,
        message: "Export draft started with approval and redaction required.",
        realFileGenerated: false,
      };
    },
  );
}

async function runJ08ScopeSelected(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.PENDING,
      clientTenantId: summitTenantId,
      eventType: "screencast.export.scope_selected",
      evidenceRecordId: summitEvidenceRecordId,
      metadataJson: {
        blockedItemIncluded: false,
        objectScopeChecked: true,
        redactionRequired: true,
      },
      nextState: ExportStatus.REDACTION_PENDING,
      permissionAction: "EDIT",
      previousState: ExportStatus.DRAFT,
      reason: "Object scope was checked and restricted objects were excluded before redaction.",
      sensitivity: "RESTRICTED",
      targetId: summitExportRequestId,
      targetType: ObjectType.EXPORT_REQUEST,
      tenantSlug: "summit",
      visibilityStatus: "RESTRICTED",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const exportRequest = await tx.exportRequest.updateMany({
        where: { id: summitExportRequestId, clientTenantId: summitTenantId },
        data: {
          approvalRequired: true,
          redactionProfile: "external-limited",
          scopeJson: {
            blockedItemIncluded: false,
            excludedObjects: [
              {
                id: entityId("summit", "foundation"),
                reason: "restricted_entity_access",
                type: "entity",
              },
            ],
            objectScopeCheckedAt: now.toISOString(),
            phase18FileRealismDeferred: true,
            redactionRequired: true,
            selectedObjects: [
              { id: summitRecommendationId, type: "recommendation" },
              { id: summitEvidenceRecordId, type: "evidence_record" },
              { id: stableId("audit:summit:export"), type: "audit_event" },
            ],
            tenant: "Summit Family Office",
          },
          status: ExportStatus.REDACTION_PENDING,
        },
      });

      return {
        blockedItemIncluded: false,
        clientVisible: false,
        exportRows: exportRequest.count,
        message: "Export scope saved and redaction review is pending.",
      };
    },
  );
}

async function runJ08ConfirmApproval(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();
  const expiryDate = exportExpiryDate(now);
  const fileMetadata = fileMetadataService.prepareDemoFileMetadata({
    category: "exports",
    checksumSeed: "summit:export-package:2026-06-16",
    fileName: "EXP-2026-06-16-0087-redacted.zip",
    fileSizeBytes: 9123840,
    mimeType: "application/zip",
    tenantSlug: "summit",
  });

  if (!fileMetadata.valid) {
    throw new Error(`Invalid J08 export package metadata: ${fileMetadata.issues.join(", ")}`);
  }

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "compliance_officer",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: summitTenantId,
      eventType: "screencast.export.approved_generated",
      evidenceRecordId: summitEvidenceRecordId,
      metadataJson: {
        approvalRequired: true,
        generatedFileIsMetadataOnly: true,
        redactionProfile: "external-limited",
      },
      nextState: ExportStatus.GENERATED,
      permissionAction: "APPROVE",
      previousState: ExportStatus.REDACTION_PENDING,
      reason: "Compliance approved the redacted export and generated package metadata.",
      sensitivity: "RESTRICTED",
      targetId: summitExportRequestId,
      targetType: ObjectType.EXPORT_REQUEST,
      tenantSlug: "summit",
      visibilityStatus: "REDACTED",
      workflowState: "IN_REVIEW",
    },
    async (tx, { session }) => {
      const currentExport = await tx.exportRequest.findFirst({
        where: { id: summitExportRequestId, clientTenantId: summitTenantId },
      });

      if (!currentExport) {
        throw new Error("J08 export fixture is incomplete.");
      }

      if (currentExport.redactionProfile !== "external-limited") {
        throw new Error("J08 export approval requires the external-limited redaction profile.");
      }

      const exportGate = exportService.canGenerateExport({
        actor: session.actor,
        approvalComplete: true,
        clientTenantId: summitTenantId,
        externalShare: false,
        platformTenantId,
        redactionProfile: currentExport.redactionProfile,
        role: session.role,
        targetId: summitExportRequestId,
        targetType: "EXPORT_REQUEST",
      });

      if (!exportGate.allowedToGenerate) {
        throw new Error(`Export generation blocked: ${exportGate.missing.join(", ")}`);
      }

      const exportPackage = exportPackageService.buildExportPackageManifest({
        approvalRequired: true,
        approved: true,
        expiresAt: expiryDate,
        exportRequestId: summitExportRequestId,
        externalShare: false,
        file: fileMetadata,
        redactionProfile: currentExport.redactionProfile,
        selectedObjectCount: 3,
        tenantSlug: "summit",
        watermark: true,
      });

      if (!exportPackage.valid) {
        throw new Error(`Invalid J08 export package manifest: ${exportPackage.issues.join(", ")}`);
      }

      const generatedDocument = await tx.document.upsert({
        where: { id: summitGeneratedExportDocumentId },
        create: {
          id: summitGeneratedExportDocumentId,
          checksum: fileMetadata.checksum,
          clientTenantId: summitTenantId,
          clientVisible: false,
          documentType: "export_package",
          engagementId: engagementId("summit"),
          expiresAt: expiryDate,
          fileName: fileMetadata.fileName,
          fileSizeBytes: fileMetadata.fileSizeBytes,
          mimeType: fileMetadata.mimeType,
          retentionPolicy: "export-package-7-years",
          sensitivity: Sensitivity.RESTRICTED,
          source: "generated_export_metadata",
          status: DocumentStatus.LINKED_TO_EVIDENCE,
          storageKey: fileMetadata.storageKey,
          title: "Summit redacted export package",
          uploadedByUserId: userId("compliance"),
        },
        update: {
          checksum: fileMetadata.checksum,
          clientVisible: false,
          expiresAt: expiryDate,
          fileName: fileMetadata.fileName,
          fileSizeBytes: fileMetadata.fileSizeBytes,
          mimeType: fileMetadata.mimeType,
          retentionPolicy: "export-package-7-years",
          sensitivity: Sensitivity.RESTRICTED,
          source: "generated_export_metadata",
          status: DocumentStatus.LINKED_TO_EVIDENCE,
          storageKey: fileMetadata.storageKey,
          title: "Summit redacted export package",
          uploadedByUserId: userId("compliance"),
        },
      });
      const version = await tx.documentVersion.upsert({
        where: {
          documentId_versionNumber: {
            documentId: summitGeneratedExportDocumentId,
            versionNumber: 1,
          },
        },
        create: {
          id: stableId("document-version:summit:export-package:1"),
          changeReason: "Generated redacted export package metadata in J08.",
          checksum: fileMetadata.checksum,
          createdAt: now,
          createdByUserId: userId("compliance"),
          documentId: summitGeneratedExportDocumentId,
          storageKey: fileMetadata.storageKey,
          versionNumber: 1,
        },
        update: {
          changeReason: "Generated redacted export package metadata in J08.",
          checksum: fileMetadata.checksum,
          createdByUserId: userId("compliance"),
          storageKey: fileMetadata.storageKey,
        },
      });
      const exportRequest = await tx.exportRequest.updateMany({
        where: { id: summitExportRequestId, clientTenantId: summitTenantId },
        data: {
          approvalRequired: true,
          approvedByUserId: userId("compliance"),
          expiresAt: expiryDate,
          generatedFileDocumentId: generatedDocument.id,
          scopeJson: {
            approval: {
              approvedAt: now.toISOString(),
              approvedByUserId: userId("compliance"),
              approvalRequired: true,
            },
            blockedItemIncluded: false,
            exportGate,
            generatedFileIsMetadataOnly: true,
            package: exportPackage.manifest,
            phase18FileRealismDeferred: true,
            redactionProfile: "external-limited",
            selectedObjects: [
              { id: summitRecommendationId, type: "recommendation" },
              { id: summitEvidenceRecordId, type: "evidence_record" },
              { id: stableId("audit:summit:export"), type: "audit_event" },
            ],
            tenant: "Summit Family Office",
          },
          status: ExportStatus.GENERATED,
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: summitEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: "export_package_generated",
          sourceObjectId: summitExportRequestId,
          sourceObjectType: ObjectType.EXPORT_REQUEST,
          title: "Redacted export package generated",
          visibilityStatus: VisibilityStatus.REDACTED,
        },
      });

      return {
        clientVisible: false,
        documentId: generatedDocument.id,
        evidenceItemId: evidenceItem.id,
        exportGate,
        exportManifestVersion: exportPackage.manifest.manifestVersion,
        exportRows: exportRequest.count,
        message: "Export approved and package metadata generated.",
        realFileGenerated: false,
        versionId: version.id,
      };
    },
  );
}

async function runJ08DownloadExport(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: summitTenantId,
      eventType: "screencast.export.downloaded",
      evidenceRecordId: summitEvidenceRecordId,
      metadataJson: {
        downloadWatermarked: true,
        generatedFileIsMetadataOnly: true,
      },
      nextState: ExportStatus.DOWNLOADED,
      permissionAction: "EXPORT",
      previousState: ExportStatus.GENERATED,
      reason: "Client principal downloaded the approved redacted export package metadata.",
      sensitivity: "RESTRICTED",
      targetId: summitExportRequestId,
      targetType: ObjectType.EXPORT_REQUEST,
      tenantSlug: "summit",
      visibilityStatus: "REDACTED",
      workflowState: "COMPLETED",
    },
    async (tx) => {
      const currentExport = await tx.exportRequest.findFirst({
        where: { id: summitExportRequestId, clientTenantId: summitTenantId },
      });

      if (!currentExport?.generatedFileDocumentId || !currentExport.approvedByUserId) {
        throw new Error("J08 download requires approved generated export metadata.");
      }

      const exportRequest = await tx.exportRequest.updateMany({
        where: { id: summitExportRequestId, clientTenantId: summitTenantId },
        data: {
          scopeJson: {
            downloadedAt: now.toISOString(),
            downloadWatermarked: true,
            generatedFileDocumentId: currentExport.generatedFileDocumentId,
            generatedFileIsMetadataOnly: true,
            phase18FileRealismDeferred: true,
            redactionProfile: currentExport.redactionProfile,
            tenant: "Summit Family Office",
          },
          status: ExportStatus.DOWNLOADED,
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: summitEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: "export_download",
          sourceObjectId: summitExportRequestId,
          sourceObjectType: ObjectType.EXPORT_REQUEST,
          title: "Watermarked export download recorded",
          visibilityStatus: VisibilityStatus.REDACTED,
        },
      });

      return {
        clientVisible: false,
        evidenceItemId: evidenceItem.id,
        exportRows: exportRequest.count,
        message: "Export download recorded with watermark and audit proof.",
      };
    },
  );
}

async function runJ08ShareExport(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();
  const expiryDate = exportExpiryDate(now);
  const shareToken = "SHARE-9F3B-7A2C";

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: summitTenantId,
      eventType: "screencast.export.share_created",
      evidenceRecordId: summitEvidenceRecordId,
      metadataJson: {
        externalShareApprovalRequired: true,
        shareToken,
      },
      nextState: "SHARE_CREATED",
      permissionAction: "EXPORT",
      previousState: ExportStatus.DOWNLOADED,
      reason: "Client principal created a time-limited approved share link for the redacted export.",
      sensitivity: "RESTRICTED",
      targetId: summitExportRequestId,
      targetType: ObjectType.EXPORT_REQUEST,
      tenantSlug: "summit",
      visibilityStatus: "REDACTED",
      workflowState: "COMPLETED",
    },
    async (tx, { session }) => {
      const currentExport = await tx.exportRequest.findFirst({
        where: { id: summitExportRequestId, clientTenantId: summitTenantId },
      });

      if (!currentExport?.generatedFileDocumentId || !currentExport.approvedByUserId) {
        throw new Error("J08 share requires approved generated export metadata.");
      }

      const exportGate = exportService.canGenerateExport({
        actor: session.actor,
        approvalComplete: true,
        clientTenantId: summitTenantId,
        externalShare: true,
        platformTenantId,
        redactionProfile: currentExport.redactionProfile,
        role: session.role,
        targetId: summitExportRequestId,
        targetType: "EXPORT_REQUEST",
      });

      if (!exportGate.allowedToGenerate) {
        throw new Error(`Export share blocked: ${exportGate.missing.join(", ")}`);
      }

      const exportRequest = await tx.exportRequest.updateMany({
        where: { id: summitExportRequestId, clientTenantId: summitTenantId },
        data: {
          expiresAt: expiryDate,
          scopeJson: {
            externalShare: {
              approvedLinkHolders: true,
              createdAt: now.toISOString(),
              expiresAt: expiryDate.toISOString(),
              shareToken,
              watermark: true,
            },
            exportGate,
            generatedFileDocumentId: currentExport.generatedFileDocumentId,
            generatedFileIsMetadataOnly: true,
            phase18FileRealismDeferred: true,
            redactionProfile: currentExport.redactionProfile,
            tenant: "Summit Family Office",
          },
          status: ExportStatus.DOWNLOADED,
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: summitEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: "export_share_created",
          sourceObjectId: summitExportRequestId,
          sourceObjectType: ObjectType.EXPORT_REQUEST,
          title: "Time-limited export share link created",
          visibilityStatus: VisibilityStatus.REDACTED,
        },
      });

      return {
        clientVisible: false,
        evidenceItemId: evidenceItem.id,
        exportRows: exportRequest.count,
        expiresAt: expiryDate.toISOString(),
        message: "Export share link recorded with expiry and audit proof.",
        shareToken,
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

async function upsertKycDocument(
  tx: Prisma.TransactionClient,
  input: {
    documentId: string;
    documentType: string;
    fileName: string;
    status: DocumentStatus;
    title: string;
  },
) {
  return tx.document.upsert({
    where: { id: input.documentId },
    create: {
      id: input.documentId,
      checksum: stableEvidenceHash(`document:${input.documentId}:demo-checksum`),
      clientTenantId: morganTenantId,
      clientVisible: false,
      documentType: input.documentType,
      fileName: input.fileName,
      fileSizeBytes: 428_000,
      mimeType: "application/pdf",
      retentionPolicy: "KYC_REVIEW_7Y",
      sensitivity: Sensitivity.RESTRICTED,
      source: "demo_phase_b_kyc",
      status: input.status,
      storageKey: `demo/morgan/kyc/${input.fileName}`,
      title: input.title,
      uploadedByUserId: userId("morgan:cfo"),
    },
    update: {
      clientVisible: false,
      documentType: input.documentType,
      fileName: input.fileName,
      mimeType: "application/pdf",
      retentionPolicy: "KYC_REVIEW_7Y",
      sensitivity: Sensitivity.RESTRICTED,
      source: "demo_phase_b_kyc",
      status: input.status,
      title: input.title,
    },
  });
}

async function runJ12KycWorkflow(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const isSourceAction = actionId === "j12.escalateSourceOfWealth" || actionId === "j12.linkSourceEvidence";
  const isCompleteAction = actionId === "j12.completeKycReview" || actionId === "j12.linkSourceEvidence";
  const targetDocumentId = isSourceAction ? morganSourceOfWealthDocumentId : morganTaxDocumentId;
  const documentStatus = isCompleteAction ? DocumentStatus.LINKED_TO_EVIDENCE : DocumentStatus.NEEDS_CLARIFICATION;
  const previousState = isSourceAction ? "SOURCE_REVIEW_PENDING" : "KYC_REVIEW_PENDING";
  const nextState = isCompleteAction ? "EVIDENCE_LINKED" : "AWAITING_INFO";
  const evidenceStatus = isCompleteAction ? EvidenceStatus.LINKED : EvidenceStatus.CREATED;
  const complianceStatus = isCompleteAction ? ComplianceStatus.IN_REVIEW : ComplianceStatus.NEEDS_EVIDENCE;
  const actorRoleKey = actionId === "j12.completeKycReview" ? "compliance_officer" : "analyst";

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey,
      auditResult: isCompleteAction ? AuditResult.SUCCESS : AuditResult.PENDING,
      clientTenantId: morganTenantId,
      eventType: isSourceAction ? "phase_b.source_of_wealth.reviewed" : "phase_b.kyc_aml.reviewed",
      evidenceRecordId: morganKycEvidenceRecordId,
      metadataJson: {
        demoMode: true,
        evidenceBoundary: "Demo evidence record/item persisted by J12 handler.",
        imageGenReferenceOnly: true,
        noClientRelease: true,
        noProductionProviderClaim: true,
        phase: "B",
        tickets: ["B-01", "B-02", "B-03", "B-08", "B-09", "B-10", "B-11", "B-12"],
      },
      nextState,
      permissionAction: "REVIEW",
      permissionObjectType: ObjectType.DOCUMENT,
      previousState,
      reason: isCompleteAction
        ? "Phase B KYC/Source-of-Wealth evidence package linked for compliance review; client release remains blocked."
        : "Phase B KYC/Source-of-Wealth evidence gap recorded and routed for human review.",
      sensitivity: "RESTRICTED",
      targetId: targetDocumentId,
      targetType: ObjectType.DOCUMENT,
      tenantSlug: "morgan",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: isCompleteAction ? "IN_REVIEW" : "AWAITING_INFO",
    },
    async (tx) => {
      const document = await upsertKycDocument(tx, {
        documentId: targetDocumentId,
        documentType: isSourceAction ? "source_of_wealth" : "kyc_fica",
        fileName: isSourceAction ? "morgan-source-of-wealth-trail.pdf" : "morgan-kyc-fica-pack.pdf",
        status: documentStatus,
        title: isSourceAction ? "Morgan Source-of-Wealth Trail" : "Morgan KYC/FICA Review Pack",
      });

      const complianceReview = await tx.complianceReview.upsert({
        where: { id: morganKycComplianceReviewId },
        create: {
          id: morganKycComplianceReviewId,
          adviceClassification: AdviceClassification.WORKFLOW,
          clientTenantId: morganTenantId,
          evidenceComplete: isCompleteAction,
          kycFicaStatus: isCompleteAction ? "review_ready" : "needs_evidence",
          popiaConsentStatus: "verified",
          recordOfAdviceRequired: false,
          releaseNotes: "Phase B KYC/AML/Source-of-Wealth workflow is internal only. No client advice or release.",
          reviewerUserId: userId("compliance"),
          status: complianceStatus,
          targetId: targetDocumentId,
          targetType: ObjectType.DOCUMENT,
        },
        update: {
          evidenceComplete: isCompleteAction,
          kycFicaStatus: isCompleteAction ? "review_ready" : "needs_evidence",
          popiaConsentStatus: "verified",
          releaseNotes: "Phase B KYC/AML/Source-of-Wealth workflow is internal only. No client advice or release.",
          status: complianceStatus,
          targetId: targetDocumentId,
          targetType: ObjectType.DOCUMENT,
        },
      });

      const evidenceRecord = await tx.evidenceRecord.upsert({
        where: { id: morganKycEvidenceRecordId },
        create: {
          id: morganKycEvidenceRecordId,
          clientTenantId: morganTenantId,
          createdByUserId: userId("compliance"),
          relatedObjectId: targetDocumentId,
          relatedObjectType: ObjectType.DOCUMENT,
          retentionPolicy: "KYC_REVIEW_7Y",
          status: evidenceStatus,
          summary: "Demo Phase B KYC/AML/Source-of-Wealth evidence package. Internal only; not client advice.",
          title: "Morgan KYC/AML/Source-of-Wealth Evidence Package",
          visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
        },
        update: {
          relatedObjectId: targetDocumentId,
          relatedObjectType: ObjectType.DOCUMENT,
          retentionPolicy: "KYC_REVIEW_7Y",
          status: evidenceStatus,
          summary: "Demo Phase B KYC/AML/Source-of-Wealth evidence package. Internal only; not client advice.",
          visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
        },
      });

      const evidenceItem = await tx.evidenceItem.upsert({
        where: { id: stableId(`evidence-item:morgan:phase-b:${actionId}`) },
        create: {
          id: stableId(`evidence-item:morgan:phase-b:${actionId}`),
          evidenceRecordId: evidenceRecord.id,
          hash: stableEvidenceHash(`phase-b:${actionId}:${targetDocumentId}`),
          itemType: isSourceAction ? "source_of_wealth_review" : "kyc_aml_review",
          sourceObjectId: document.id,
          sourceObjectType: ObjectType.DOCUMENT,
          title: isSourceAction ? "Source-of-wealth review action" : "KYC/AML review action",
          visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
        },
        update: {
          hash: stableEvidenceHash(`phase-b:${actionId}:${targetDocumentId}`),
          sourceObjectId: document.id,
          sourceObjectType: ObjectType.DOCUMENT,
          title: isSourceAction ? "Source-of-wealth review action" : "KYC/AML review action",
          visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
        },
      });

      return {
        clientVisible: false,
        complianceReviewId: complianceReview.id,
        complianceStatus: complianceReview.status,
        documentId: document.id,
        documentStatus: document.status,
        evidenceItemId: evidenceItem.id,
        evidenceRecordId: evidenceRecord.id,
        evidenceStatus: evidenceRecord.status,
        message: isCompleteAction
          ? "Phase B evidence package linked for compliance review. No client release occurred."
          : "Phase B evidence gap recorded for human review. No client release occurred.",
        workflowState: nextState,
      };
    },
  );
}

async function runJ13J14SuitabilityIpsWorkflow(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const isIpsAction = actionId.startsWith("j14.");
  const isEvidenceLinkAction = actionId === "j13.markSuitabilityReviewed" || actionId === "j14.linkIpsEvidence";
  const targetId = isIpsAction ? morganIpsMandateId : morganSuitabilityProfileId;
  const targetType = isIpsAction ? ObjectType.POLICY : ObjectType.ENGAGEMENT;
  const evidenceRecordId = isIpsAction ? morganIpsEvidenceRecordId : morganSuitabilityEvidenceRecordId;
  const evidenceStatus = isEvidenceLinkAction ? EvidenceStatus.LINKED : EvidenceStatus.CREATED;
  const previousState = isIpsAction ? "IPS_DRAFT" : "SUITABILITY_IN_REVIEW";
  const nextState = isEvidenceLinkAction ? "EVIDENCE_LINKED_FOR_REVIEW" : "AWAITING_SUITABILITY_EVIDENCE";
  const gate = workflowGate.canReleaseAdviceWithSuitabilityIps(suitabilityGateCandidate);

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: isIpsAction ? "senior_wealth_advisor" : "analyst",
      auditResult: isEvidenceLinkAction ? AuditResult.SUCCESS : AuditResult.PENDING,
      clientTenantId: morganTenantId,
      eventType: isIpsAction ? "phase_c.ips_mandate.reviewed" : "phase_c.suitability_profile.reviewed",
      evidenceRecordId,
      metadataJson: {
        demoMode: true,
        gateName: gate.gateName,
        gateMissing: gate.missing,
        gatePassed: gate.passed,
        noClientRelease: true,
        noProductionProviderClaim: true,
        phase: "C",
        tickets: ["C-01", "C-02", "C-03", "C-08", "C-09", "C-04", "C-05", "C-06", "C-07", "C-10", "C-11", "C-12"],
      },
      nextState,
      permissionAction: "REVIEW",
      permissionObjectType: targetType,
      previousState,
      reason: isEvidenceLinkAction
        ? "Phase C Suitability/IPS evidence was linked for human review; client release remains blocked by local gate."
        : "Phase C Suitability/IPS evidence gap was recorded; client release remains blocked by local gate.",
      sensitivity: "RESTRICTED",
      targetId,
      targetType,
      tenantSlug: "morgan",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: isEvidenceLinkAction ? "IN_REVIEW" : "AWAITING_INFO",
    },
    async (tx) => {
      const evidenceRecord = await tx.evidenceRecord.upsert({
        where: { id: evidenceRecordId },
        create: {
          id: evidenceRecordId,
          clientTenantId: morganTenantId,
          createdByUserId: userId(isIpsAction ? "advisor" : "analyst"),
          relatedObjectId: targetId,
          relatedObjectType: targetType,
          retentionPolicy: isIpsAction ? "IPS_MANDATE_7Y" : "SUITABILITY_PROFILE_7Y",
          status: evidenceStatus,
          summary: isIpsAction
            ? "Demo Phase C IPS mandate evidence package. Internal only; not client advice."
            : "Demo Phase C suitability profile evidence package. Internal only; not client advice.",
          title: isIpsAction ? "Morgan IPS / Mandate Evidence Package" : "Morgan Suitability Profile Evidence Package",
          visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
        },
        update: {
          relatedObjectId: targetId,
          relatedObjectType: targetType,
          retentionPolicy: isIpsAction ? "IPS_MANDATE_7Y" : "SUITABILITY_PROFILE_7Y",
          status: evidenceStatus,
          summary: isIpsAction
            ? "Demo Phase C IPS mandate evidence package. Internal only; not client advice."
            : "Demo Phase C suitability profile evidence package. Internal only; not client advice.",
          visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
        },
      });

      const evidenceItem = await tx.evidenceItem.upsert({
        where: { id: stableId(`evidence-item:morgan:phase-c:${actionId}`) },
        create: {
          id: stableId(`evidence-item:morgan:phase-c:${actionId}`),
          evidenceRecordId: evidenceRecord.id,
          hash: stableEvidenceHash(`phase-c:${actionId}:${targetId}`),
          itemType: isIpsAction ? "ips_mandate_review" : "suitability_profile_review",
          sourceObjectId: targetId,
          sourceObjectType: targetType,
          title: isIpsAction ? "IPS mandate review action" : "Suitability profile review action",
          visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
        },
        update: {
          hash: stableEvidenceHash(`phase-c:${actionId}:${targetId}`),
          sourceObjectId: targetId,
          sourceObjectType: targetType,
          title: isIpsAction ? "IPS mandate review action" : "Suitability profile review action",
          visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
        },
      });

      return {
        clientVisible: false,
        evidenceItemId: evidenceItem.id,
        evidenceRecordId: evidenceRecord.id,
        evidenceStatus: evidenceRecord.status,
        gateMissing: gate.missing,
        gateName: gate.gateName,
        gatePassed: gate.passed,
        message: isEvidenceLinkAction
          ? "Phase C evidence linked for review. No client release occurred."
          : "Phase C evidence gap recorded. No client release occurred.",
        targetId,
        targetType,
        workflowState: nextState,
      };
    },
  );
}

async function runJ16ReviewCalendarWorkflow(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const now = new Date();
  const isEscalation = actionId === "j16.escalateOverdueReview";
  const targetReviewScheduleId = isEscalation ? northbridgeReviewScheduleId : morganReviewScheduleId;
  const targetTenantId = isEscalation ? northbridgeTenantId : morganTenantId;
  const targetQueueId = isEscalation ? northbridgeComplianceQueueId : stableId("queue:morgan:compliance");
  const nextReviewDate = isEscalation ? new Date("2026-06-16T00:00:00.000Z") : new Date("2026-06-24T00:00:00.000Z");

  const result = await prisma.$transaction(async (tx) => {
    const reviewSchedule = await tx.reviewSchedule.updateMany({
      where: {
        clientTenantId: targetTenantId,
        id: targetReviewScheduleId,
      },
      data: {
        nextReviewDate,
        status: WorkflowStatus.IN_REVIEW,
        lastCompletedAt: isEscalation ? null : now,
      },
    });
    const queueItem = await tx.queueItem.updateMany({
      where: {
        clientTenantId: targetTenantId,
        id: targetQueueId,
      },
      data: {
        escalated: isEscalation,
        slaDueAt: isEscalation ? new Date("2026-06-16T12:00:00.000Z") : new Date("2026-06-24T12:00:00.000Z"),
        status: isEscalation ? WorkflowStatus.BLOCKED : WorkflowStatus.IN_REVIEW,
      },
    });
    await writeAuditEvent(tx, {
      actorUserId: userId("analyst"),
      actorRoleKey: "analyst",
      eventType: isEscalation ? "phase_d.review_calendar.escalate_overdue" : "phase_d.review_calendar.schedule_human_review",
      targetType: ObjectType.REVIEW_SCHEDULE,
      targetId: targetReviewScheduleId,
      clientTenantId: targetTenantId,
      previousState: isEscalation ? "DUE_SOON" : "SCHEDULED",
      nextState: isEscalation ? "OVERDUE_ESCALATED" : "HUMAN_REVIEW_SCHEDULED",
      reason: isEscalation
        ? "Phase D overdue review escalated for internal follow-up. No client release occurred."
        : "Phase D human review was scheduled from review calendar. No client release occurred.",
      actionId,
    });

    return {
      queueRows: queueItem.count,
      reviewRows: reviewSchedule.count,
    };
  });

  return {
    auditRows: 1,
    clientVisible: false,
    message: isEscalation
      ? "Overdue review escalated. Internal audit state recorded; no client release occurred."
      : "Human review scheduled. Internal audit state recorded; no client release occurred.",
    noClientRelease: true,
    targetReviewScheduleId,
    ...result,
  };
}

async function runJ17RebalanceMonitoringWorkflow(prisma: PrismaClient, actionId: DemoWorkflowAction) {
  const isBlockAction = actionId === "j17.blockRebalanceTrigger";
  const result = await prisma.$transaction(async (tx) => {
    const trigger = await tx.trigger.updateMany({
      where: {
        clientTenantId: northbridgeTenantId,
        id: northbridgeTriggerId,
      },
      data: {
        clientVisible: false,
        status: isBlockAction ? WorkflowStatus.BLOCKED : WorkflowStatus.ADVISOR_REVIEW,
      },
    });
    const actionItem = await tx.actionItem.updateMany({
      where: {
        clientTenantId: northbridgeTenantId,
        id: actionItemId("northbridge", "blocked-release"),
      },
      data: {
        blockedReason: isBlockAction
          ? "Phase D rebalance monitoring blocked productive action pending human review."
          : "Phase D rebalance monitoring routed for human advisor review.",
        clientVisible: false,
        status: isBlockAction ? WorkflowStatus.BLOCKED : WorkflowStatus.IN_REVIEW,
      },
    });
    const queueItem = await tx.queueItem.updateMany({
      where: {
        clientTenantId: northbridgeTenantId,
        id: northbridgeComplianceQueueId,
      },
      data: {
        escalated: isBlockAction,
        status: isBlockAction ? WorkflowStatus.BLOCKED : WorkflowStatus.ADVISOR_REVIEW,
      },
    });
    const recommendation = await tx.recommendation.updateMany({
      where: {
        clientTenantId: northbridgeTenantId,
        id: northbridgeRecommendationId,
      },
      data: {
        clientVisible: false,
        status: isBlockAction ? RecommendationStatus.BLOCKED : RecommendationStatus.ADVISOR_PENDING,
      },
    });
    await writeAuditEvent(tx, {
      actorUserId: userId("analyst"),
      actorRoleKey: "analyst",
      eventType: isBlockAction ? "phase_d.rebalance_monitoring.block_trigger" : "phase_d.rebalance_monitoring.route_human_review",
      targetType: ObjectType.TRIGGER,
      targetId: northbridgeTriggerId,
      clientTenantId: northbridgeTenantId,
      previousState: "ANALYST_REVIEW",
      nextState: isBlockAction ? "BLOCKED" : "ADVISOR_REVIEW",
      reason: isBlockAction
        ? "Phase D rebalance trigger was blocked before any advice or execution path."
        : "Phase D rebalance trigger was routed for human review without client release.",
      actionId,
    });

    return {
      actionItemRows: actionItem.count,
      queueRows: queueItem.count,
      recommendationRows: recommendation.count,
      triggerRows: trigger.count,
    };
  });

  return {
    auditRows: 1,
    clientVisible: false,
    message: isBlockAction
      ? "Rebalance trigger blocked. Trigger/action/queue state recorded; no client release occurred."
      : "Rebalance trigger routed for human review. No client release occurred.",
    noClientRelease: true,
    targetTriggerId: northbridgeTriggerId,
    ...result,
  };
}

async function runDemoWorkflowAction(prisma: PrismaClient, actionId: DemoWorkflowAction) {
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
      return runJ02ReleaseClient(prisma, actionId);

    case "j03.requestMoreInformation":
    case "j03.deferDecision":
    case "j03.rejectDecision":
    case "j03.acceptOption":
      return runJ03DecisionAction(prisma, actionId);

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

    case "j06.newTenant":
      return runJ06TenantCreateIntent(prisma, actionId);

    case "j06.continueTenant":
      return runJ06ContinueTenant(prisma, actionId);

    case "j06.assignTeam":
      return runJ06AssignTeam(prisma, actionId);

    case "j06.openInvitation":
      return runJ06OpenInvitation(prisma, actionId);

    case "j06.sendInvitation":
      return runJ06SendInvitation(prisma, actionId);

    case "j07.inviteUser":
      return runJ07InviteUser(prisma, actionId);

    case "j07.sendInvitation":
      return runJ07SendInvitation(prisma, actionId);

    case "j07.saveRoleChanges":
      return runJ07SaveRoleChanges(prisma, actionId);

    case "j07.approveAccess":
      return runJ07ApproveAccess(prisma, actionId);

    case "j07.exportAudit":
      return runJ07ExportAudit(prisma, actionId);

    case "j08.selectDataExtract":
      return runJ08SelectDataExtract(prisma, actionId);

    case "j08.clearScope":
      return runJ08ScopeSelected(prisma, actionId);

    case "j08.confirmApproval":
      return runJ08ConfirmApproval(prisma, actionId);

    case "j08.downloadExport":
      return runJ08DownloadExport(prisma, actionId);

    case "j08.shareExport":
      return runJ08ShareExport(prisma, actionId);

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

    case "j12.requestKycEvidence":
    case "j12.completeKycReview":
    case "j12.escalateSourceOfWealth":
    case "j12.linkSourceEvidence":
      return runJ12KycWorkflow(prisma, actionId);

    case "j13.requestSuitabilityEvidence":
    case "j13.markSuitabilityReviewed":
    case "j14.requestIpsMandateChanges":
    case "j14.linkIpsEvidence":
      return runJ13J14SuitabilityIpsWorkflow(prisma, actionId);

    case "j16.scheduleReview":
    case "j16.escalateOverdueReview":
      return runJ16ReviewCalendarWorkflow(prisma, actionId);

    case "j17.blockRebalanceTrigger":
    case "j17.routeRebalanceReview":
      return runJ17RebalanceMonitoringWorkflow(prisma, actionId);

    default: {
      const target = genericTargetForAction(actionId);
      const [journeyToken, actionToken] = actionId.split(".");
      await writeAuditEvent(prisma, {
        actorUserId: target.actorUserId,
        actorRoleKey: target.actorRoleKey,
        eventType: `screencast.${journeyToken}.${toSnakeCase(actionToken ?? "action")}`,
        targetType: target.targetType,
        targetId: target.targetId,
        clientTenantId: target.clientTenantId,
        previousState: "SEEDED_FIXTURE",
        nextState: actionToken ? toSnakeCase(actionToken).toUpperCase() : "ACTION_RECORDED",
        reason: "Screencast demo action recorded against deterministic fixture data.",
        actionId,
      });
      return {
        message: "Screencast demo action recorded.",
        auditRows: 1,
        targetType: target.targetType,
        targetId: target.targetId,
      };
    }
  }
}

export async function POST(request: Request) {
  const prisma = prismaClient();
  if (!prisma) {
    return NextResponse.json(
      {
        error: "DATABASE_URL is required for demo workflow actions.",
        mutated: false,
        noClientRelease: true,
        ok: false,
      },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => undefined);
  const parsedBody = parseDemoWorkflowRequestBody(body);
  if (!parsedBody.ok) {
    return NextResponse.json(
      {
        error: "Invalid demo workflow request.",
        issues: parsedBody.issues,
        mutated: false,
        noClientRelease: true,
        ok: false,
      },
      { status: 400 },
    );
  }

  const parsedValue = parsedBody.value;

  if ("workflowType" in parsedValue && parsedValue.workflowType === "recommendation-review") {
    try {
      const result = await runRecommendationReviewWorkflowMutation(prisma, {
        action: parsedValue.action,
        actorRoleKey: parsedValue.actorRole as DemoRoleKey,
        confirmationText: parsedValue.confirmationText,
        evidenceIds: parsedValue.evidenceIds,
        reason: parsedValue.reason,
        targetId: parsedValue.targetId,
      });

      return NextResponse.json({
        action: parsedValue.action,
        noClientRelease: !result.clientVisible,
        ok: true,
        result,
        workflowType: "recommendation-review",
      });
    } catch (error) {
      return NextResponse.json(
        {
          action: parsedValue.action,
          error:
            error instanceof RecommendationReviewWorkflowError
              ? error.message
              : "Recommendation review workflow action failed.",
          gateMissing: error instanceof RecommendationReviewWorkflowError ? error.details?.gateMissing : undefined,
          mutated: false,
          noClientRelease: true,
          ok: false,
          releasePreconditions:
            error instanceof RecommendationReviewWorkflowError
              ? error.details?.releasePreconditions
              : undefined,
          workflowType: "recommendation-review",
        },
        { status: error instanceof RecommendationReviewWorkflowError ? error.status : 409 },
      );
    }
  }

  if (!("actionId" in parsedValue)) {
    return NextResponse.json(
      {
        error: "Invalid demo workflow request.",
        mutated: false,
        noClientRelease: true,
        ok: false,
      },
      { status: 400 },
    );
  }

  const actionId = parsedValue.actionId as DemoWorkflowAction;

  try {
    const result = await runDemoWorkflowAction(prisma, actionId);
    const releasedToClient =
      typeof result === "object" &&
      result !== null &&
      "clientVisible" in result &&
      result.clientVisible === true;

    return NextResponse.json({
      actionId,
      noClientRelease: !releasedToClient,
      ok: true,
      result,
    });
  } catch {
    return NextResponse.json(
      {
        actionId,
        error: "Demo workflow action failed.",
        mutated: false,
        noClientRelease: true,
        ok: false,
      },
      { status: 409 },
    );
  }
}
