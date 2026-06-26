import { createHash } from "node:crypto";
import {
  AuditResult,
  DocumentStatus,
  EntityType,
  EvidenceStatus,
  ObjectType,
  Prisma,
  type PrismaClient,
  ReviewStatus,
  Sensitivity,
  VisibilityStatus,
  WorkflowStatus,
} from "@prisma/client";

import {
  dataMaintenanceCanonicalApiRoute,
  dataMaintenanceCommandForAction,
  type DataMaintenanceWorkflowAction,
} from "@/lib/data-maintenance-action-contract";
import { fileMetadataService } from "@/lib/file-metadata-service";
import { stableId } from "@/lib/stable-id";
import { runDemoWorkflowMutation } from "@/lib/typed-workflow-command-bus";

export {
  dataMaintenanceCanonicalApiRoute,
  dataMaintenanceCommandForAction,
  isDataMaintenanceWorkflowAction,
  type DataMaintenanceWorkflowAction,
} from "@/lib/data-maintenance-action-contract";

const morganTenantId = tenantId("morgan");
const morganEvidenceRecordId = evidenceRecordId("morgan");
const morganTaxDocumentId = documentId("morgan", "missing-tax");
const summitTenantId = tenantId("summit");
const summitEvidenceRecordId = evidenceRecordId("summit");
const summitPhilanthropyEntityId = entityId("summit", "philanthropy");
const summitActionReadyGateId = actionItemId("summit", "tax-cert");
const bennettTenantId = tenantId("bennett");
const bennettEvidenceRecordId = evidenceRecordId("bennett");
const bennettPrincipalProfileId = stableId("profile:bennett:principal");
const bennettPrincipalFamilyMemberId = familyMemberId("bennett", "principal");
const bennettOliviaFamilyMemberId = familyMemberId("bennett", "olivia");
const bennettOliviaRelationshipId = stableId("relationship:bennett:principal-olivia-nextgen");

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

async function runJ04DocumentNavigationAudit(prisma: PrismaClient, actionId: DataMaintenanceWorkflowAction) {
  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "family_cfo",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: morganTenantId,
      eventType:
        actionId === "j04.viewDetails"
          ? "data_maintenance.document.view_details"
          : "data_maintenance.document.open_upload",
      evidenceRecordId: morganEvidenceRecordId,
      metadataJson: {
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        command: dataMaintenanceCommandForAction(actionId),
        noBinaryFileStorage: true,
        phase18FileRealismDeferred: true,
      },
      nextState: actionId === "j04.viewDetails" ? "DETAILS_VIEWED" : "UPLOAD_OPENED",
      permissionAction: "VIEW",
      previousState: "SEEDED_FIXTURE",
      reason:
        actionId === "j04.viewDetails"
          ? "Client viewed document clarification details through typed data-maintenance command."
          : "Client opened document upload flow through typed data-maintenance command.",
      targetId: morganTaxDocumentId,
      targetType: ObjectType.DOCUMENT,
      tenantSlug: "morgan",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "AWAITING_INFO",
    },
    async () => ({
      clientVisible: false,
      command: dataMaintenanceCommandForAction(actionId),
      message:
        actionId === "j04.viewDetails"
          ? "Document clarification detail view audited."
          : "Document upload entry audited.",
      noAdviceExecution: true,
      noClientRelease: true,
    }),
  );
}

async function runJ04UploadDocument(prisma: PrismaClient, actionId: DataMaintenanceWorkflowAction) {
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
      eventType: "data_maintenance.document.uploaded",
      evidenceRecordId: morganEvidenceRecordId,
      metadataJson: {
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        command: dataMaintenanceCommandForAction(actionId),
        contentAddress: fileMetadata.contentAddress,
        fileName: fileMetadata.fileName,
        metadataValidated: true,
        noBinaryFileStorage: true,
        phase18FileRealismDeferred: true,
      },
      nextState: DocumentStatus.UPLOADED,
      permissionAction: "UPLOAD",
      previousState: DocumentStatus.EMPTY,
      reason: "Document upload metadata and version were recorded through typed data-maintenance command.",
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
          changeReason: "Client uploaded tax residency certificate metadata through typed data-maintenance command.",
          checksum: fileMetadata.checksum,
          createdAt: now,
          createdByUserId: userId("morgan:cfo"),
          documentId: morganTaxDocumentId,
          storageKey: fileMetadata.storageKey,
          versionNumber: 1,
        },
        update: {
          changeReason: "Client uploaded tax residency certificate metadata through typed data-maintenance command.",
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
        command: dataMaintenanceCommandForAction(actionId),
        documentRows: document.count,
        extractionId: extraction.id,
        message: "Document upload metadata, version and extraction draft saved.",
        noAdviceExecution: true,
        noClientRelease: true,
        versionId: version.id,
      };
    },
  );
}

async function runJ04ConfirmFinalize(prisma: PrismaClient, actionId: DataMaintenanceWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "family_cfo",
      auditResult: AuditResult.PENDING,
      clientTenantId: morganTenantId,
      eventType: "data_maintenance.document.extraction_confirmed",
      evidenceRecordId: morganEvidenceRecordId,
      metadataJson: {
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        command: dataMaintenanceCommandForAction(actionId),
        extractionCorrection: "Tax residency: United Kingdom",
        noBinaryFileStorage: true,
        phase18FileRealismDeferred: true,
      },
      nextState: DocumentStatus.ANALYST_REVIEW_PENDING,
      permissionAction: "REVIEW",
      previousState: DocumentStatus.UPLOADED,
      reason: "Client confirmed extraction draft and sent document to analyst verification through typed data-maintenance command.",
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
        command: dataMaintenanceCommandForAction(actionId),
        documentLinkId: documentLink.id,
        documentRows: document.count,
        evidenceItemId: evidenceItem.id,
        extractionId: extraction.id,
        message: "Extraction confirmed and analyst verification queued.",
        noAdviceExecution: true,
        noClientRelease: true,
        reviewId: review.id,
      };
    },
  );
}

async function runJ05CreateEntityIntent(prisma: PrismaClient, actionId: DataMaintenanceWorkflowAction) {
  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: summitTenantId,
      eventType: "data_maintenance.entity.create_intent",
      evidenceRecordId: summitEvidenceRecordId,
      metadataJson: {
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        command: dataMaintenanceCommandForAction(actionId),
        entityName: "Summit Ridge Philanthropy LLC",
        sensitiveJurisdictionReviewRequired: true,
      },
      nextState: "ENTITY_DRAFT_STARTED",
      permissionAction: "CREATE",
      previousState: "NO_ENTITY_DRAFT",
      reason: "Client started an entity creation workflow through typed data-maintenance command.",
      sensitivity: "RESTRICTED",
      targetId: summitPhilanthropyEntityId,
      targetType: ObjectType.ENTITY,
      tenantSlug: "summit",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "DRAFT",
    },
    async () => ({
      clientVisible: false,
      command: dataMaintenanceCommandForAction(actionId),
      message: "Entity creation intent audited.",
      noAdviceExecution: true,
      noClientRelease: true,
    }),
  );
}

async function runJ05ContinueEntity(prisma: PrismaClient, actionId: DataMaintenanceWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.PENDING,
      clientTenantId: summitTenantId,
      eventType: "data_maintenance.entity.created_legal_review_required",
      evidenceRecordId: summitEvidenceRecordId,
      metadataJson: {
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        command: dataMaintenanceCommandForAction(actionId),
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
        command: dataMaintenanceCommandForAction(actionId),
        entityId: entity.id,
        evidenceItemId: evidenceItem.id,
        message: "Entity draft created and legal review gate recorded.",
        noAdviceExecution: true,
        noClientRelease: true,
        participantId: participant.id,
      };
    },
  );
}

async function runJ05EditEntity(prisma: PrismaClient, actionId: DataMaintenanceWorkflowAction) {
  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: summitTenantId,
      eventType: "data_maintenance.entity.edit_viewed",
      evidenceRecordId: summitEvidenceRecordId,
      metadataJson: {
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        command: dataMaintenanceCommandForAction(actionId),
        wealthMapDrawerOpened: true,
      },
      nextState: "WEALTH_MAP_DRAWER_OPENED",
      permissionAction: "EDIT",
      previousState: "LEGAL_REVIEW_REQUIRED",
      reason: "Client opened the entity for scoped wealth-map inspection through typed data-maintenance command.",
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
        command: dataMaintenanceCommandForAction(actionId),
        entityRows: entity.count,
        message: "Entity wealth-map review state saved.",
        noAdviceExecution: true,
        noClientRelease: true,
      };
    },
  );
}

async function runJ05ActionGate(prisma: PrismaClient, actionId: DataMaintenanceWorkflowAction) {
  const now = new Date();
  const isView = actionId === "j05.viewDetails";
  const isMarkReady = actionId === "j05.markReady";

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: isMarkReady ? AuditResult.BLOCKED : AuditResult.PENDING,
      clientTenantId: summitTenantId,
      eventType: isView
        ? "data_maintenance.wealth_map.conflict_viewed"
        : isMarkReady
          ? "data_maintenance.action.ready_blocked"
          : "data_maintenance.action.request_more_info",
      evidenceRecordId: summitEvidenceRecordId,
      metadataJson: {
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        command: dataMaintenanceCommandForAction(actionId),
        noAdviceOutput: true,
        releaseCreated: false,
      },
      nextState: isMarkReady ? WorkflowStatus.BLOCKED : isView ? WorkflowStatus.IN_REVIEW : WorkflowStatus.AWAITING_INFO,
      permissionAction: "REVIEW",
      previousState: isMarkReady ? WorkflowStatus.IN_REVIEW : WorkflowStatus.BLOCKED,
      reason: isView
        ? "Client viewed a conflict/status path without receiving advice output."
        : isMarkReady
          ? "Ready state was blocked because required client approval evidence is missing."
          : "Client requested the missing information package instead of releasing the action.",
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
          blockedReason: isView
            ? "Client approval evidence is missing before ready state."
            : isMarkReady
              ? "Missing Client Approval evidence prevents ready state."
              : "Requested missing client approval evidence before readiness.",
          clientVisible: true,
          evidenceStatus: EvidenceStatus.PLACEHOLDER,
          status: isMarkReady ? WorkflowStatus.BLOCKED : isView ? WorkflowStatus.IN_REVIEW : WorkflowStatus.AWAITING_INFO,
        },
      });
      const evidenceItem = isView
        ? null
        : await tx.evidenceItem.create({
            data: {
              evidenceRecordId: summitEvidenceRecordId,
              hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
              itemType: isMarkReady ? "action_ready_blocked" : "action_more_info_requested",
              sourceObjectId: summitActionReadyGateId,
              sourceObjectType: ObjectType.ACTION_ITEM,
              title: isMarkReady ? "Action ready gate blocked by missing evidence" : "Missing action information requested",
              visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
            },
          });

      return {
        actionItemRows: actionItem.count,
        clientVisible: false,
        command: dataMaintenanceCommandForAction(actionId),
        evidenceItemId: evidenceItem?.id,
        message: isView
          ? "Wealth-map conflict view audited without release."
          : isMarkReady
            ? "Action ready state blocked by missing evidence."
            : "Missing information requested without release.",
        noAdviceExecution: true,
        noClientRelease: true,
      };
    },
  );
}

async function runJ09PortalUpload(prisma: PrismaClient, actionId: DataMaintenanceWorkflowAction) {
  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: bennettTenantId,
      eventType: "data_maintenance.profile.portal_upload_entry",
      evidenceRecordId: bennettEvidenceRecordId,
      metadataJson: {
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        command: dataMaintenanceCommandForAction(actionId),
        profileIntakeStarted: true,
        releaseCreated: false,
      },
      nextState: "PROFILE_INTAKE_OPENED",
      permissionAction: "VIEW",
      previousState: "PORTAL_ACTION_SELECTED",
      reason: "Client opened the profile intake path from the portal through typed data-maintenance command.",
      targetId: bennettPrincipalProfileId,
      targetType: ObjectType.USER,
      tenantSlug: "bennett",
      visibilityStatus: "CLIENT_VISIBLE",
      workflowState: "IN_REVIEW",
    },
    async () => ({
      clientVisible: false,
      command: dataMaintenanceCommandForAction(actionId),
      message: "Profile intake entry audited.",
      noAdviceExecution: true,
      noClientRelease: true,
    }),
  );
}

async function runJ09SubmitProfile(prisma: PrismaClient, actionId: DataMaintenanceWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.PENDING,
      clientTenantId: bennettTenantId,
      eventType: "data_maintenance.profile.submitted",
      evidenceRecordId: bennettEvidenceRecordId,
      metadataJson: {
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        command: dataMaintenanceCommandForAction(actionId),
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
        command: dataMaintenanceCommandForAction(actionId),
        evidenceItemId: evidenceItem.id,
        message: "Profile update submitted for review.",
        noAdviceExecution: true,
        noClientRelease: true,
        profileRows: profile.count,
      };
    },
  );
}

async function runJ09FamilyMember(prisma: PrismaClient, actionId: DataMaintenanceWorkflowAction) {
  const now = new Date();
  const isSave = actionId === "j09.saveFamilyChanges";
  const dateOfBirth = new Date("2003-04-14T00:00:00.000Z");

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: isSave ? AuditResult.SUCCESS : AuditResult.PENDING,
      clientTenantId: bennettTenantId,
      eventType: isSave ? "data_maintenance.family_member.updated" : "data_maintenance.family_member.created",
      evidenceRecordId: bennettEvidenceRecordId,
      metadataJson: {
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        command: dataMaintenanceCommandForAction(actionId),
        familyMemberName: "Olivia Bennett",
        relationshipLabel: "Next Gen",
      },
      nextState: isSave ? "FAMILY_MEMBER_UPDATED" : "FAMILY_MEMBER_DRAFT",
      permissionAction: isSave ? "EDIT" : "CREATE",
      previousState: isSave ? "FAMILY_MEMBER_DRAFT" : "FAMILY_MEMBER_NOT_CREATED",
      reason: isSave
        ? "Client saved family member details and governance role through typed data-maintenance command."
        : "Client added Olivia Bennett as a next-generation family member through typed data-maintenance command.",
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
          dateOfBirth: isSave ? dateOfBirth : undefined,
          displayName: "Olivia Bennett",
          isPrincipal: false,
          relationshipType: "Next Gen",
          sensitivity: Sensitivity.CONFIDENTIAL,
          taxResidency: isSave ? "South Africa" : null,
        },
        update: {
          dateOfBirth: isSave ? dateOfBirth : undefined,
          displayName: "Olivia Bennett",
          isPrincipal: false,
          relationshipType: "Next Gen",
          sensitivity: Sensitivity.CONFIDENTIAL,
          taxResidency: isSave ? "South Africa" : undefined,
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: bennettEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: isSave ? "family_member_updated" : "family_member_created",
          sourceObjectId: member.id,
          sourceObjectType: ObjectType.FAMILY_MEMBER,
          title: isSave ? "Family member details saved" : "Family member draft created",
          visibilityStatus: VisibilityStatus.CLIENT_VISIBLE,
        },
      });

      return {
        clientVisible: false,
        command: dataMaintenanceCommandForAction(actionId),
        evidenceItemId: evidenceItem.id,
        familyMemberId: member.id,
        message: isSave ? "Family member details saved." : "Family member draft created.",
        noAdviceExecution: true,
        noClientRelease: true,
      };
    },
  );
}

async function runJ09Relationship(prisma: PrismaClient, actionId: DataMaintenanceWorkflowAction) {
  const now = new Date();
  const isOpen = actionId === "j09.openFamilyMap";

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "principal",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: bennettTenantId,
      eventType: isOpen ? "data_maintenance.relationship.family_map_opened" : "data_maintenance.relationship.created",
      evidenceRecordId: bennettEvidenceRecordId,
      metadataJson: {
        canonicalApiRoute: dataMaintenanceCanonicalApiRoute,
        command: dataMaintenanceCommandForAction(actionId),
        restrictedRelationshipsRemainScoped: true,
      },
      nextState: isOpen ? "FAMILY_MAP_OPENED" : "RELATIONSHIP_CREATED",
      permissionAction: isOpen ? "VIEW" : "CREATE",
      previousState: isOpen ? "FAMILY_MEMBER_UPDATED" : "FAMILY_MAP_OPENED",
      reason: isOpen
        ? "Client opened the family relationship map through typed data-maintenance command."
        : "Client linked Olivia Bennett into the family governance map through typed data-maintenance command.",
      sensitivity: "CONFIDENTIAL",
      targetId: isOpen ? bennettPrincipalFamilyMemberId : bennettOliviaRelationshipId,
      targetType: isOpen ? ObjectType.FAMILY_MEMBER : ObjectType.RELATIONSHIP,
      tenantSlug: "bennett",
      visibilityStatus: "CLIENT_VISIBLE",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      if (isOpen) {
        return {
          clientVisible: false,
          command: dataMaintenanceCommandForAction(actionId),
          message: "Family map view audited.",
          noAdviceExecution: true,
          noClientRelease: true,
        };
      }

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
        command: dataMaintenanceCommandForAction(actionId),
        evidenceItemId: evidenceItem.id,
        message: "Family relationship created.",
        noAdviceExecution: true,
        noClientRelease: true,
        relationshipId: relationship.id,
      };
    },
  );
}

export function runDataMaintenanceWorkflowAction(prisma: PrismaClient, actionId: DataMaintenanceWorkflowAction) {
  switch (actionId) {
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
    case "j05.markReady":
    case "j05.requestInfo":
      return runJ05ActionGate(prisma, actionId);
    case "j09.portalUpload":
      return runJ09PortalUpload(prisma, actionId);
    case "j09.submitProfile":
      return runJ09SubmitProfile(prisma, actionId);
    case "j09.addMember":
    case "j09.saveFamilyChanges":
      return runJ09FamilyMember(prisma, actionId);
    case "j09.openFamilyMap":
    case "j09.addRelationship":
      return runJ09Relationship(prisma, actionId);
  }
}
