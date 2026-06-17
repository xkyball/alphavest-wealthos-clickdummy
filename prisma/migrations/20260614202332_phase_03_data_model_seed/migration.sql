-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('INVITED', 'ACTIVE', 'SUSPENDED', 'LOCKED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RoleScope" AS ENUM ('PLATFORM', 'TENANT', 'ENTITY', 'ENGAGEMENT', 'DOCUMENT', 'DECISION');

-- CreateEnum
CREATE TYPE "PermissionAction" AS ENUM ('VIEW', 'CREATE', 'EDIT', 'DELETE', 'UPLOAD', 'REVIEW', 'APPROVE', 'RELEASE', 'BLOCK', 'EXPORT', 'INVITE', 'ASSIGN', 'REVOKE', 'COMMENT', 'SCHEDULE', 'ESCALATE', 'MANAGE');

-- CreateEnum
CREATE TYPE "Sensitivity" AS ENUM ('PUBLIC', 'CLIENT_VISIBLE', 'CONFIDENTIAL', 'RESTRICTED', 'HIGHLY_RESTRICTED', 'INTERNAL_ONLY');

-- CreateEnum
CREATE TYPE "VisibilityStatus" AS ENUM ('INTERNAL_ONLY', 'ADVISOR_VISIBLE', 'COMPLIANCE_VISIBLE', 'CLIENT_VISIBLE', 'RESTRICTED', 'REDACTED');

-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('DRAFT', 'NEW', 'IN_REVIEW', 'AWAITING_INFO', 'ANALYST_REVIEW', 'ADVISOR_REVIEW', 'COMPLIANCE_PENDING', 'READY_FOR_CLIENT', 'CLIENT_VISIBLE', 'COMPLETED', 'DEFERRED', 'BLOCKED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('EMPTY', 'UPLOADING', 'UPLOADED', 'AI_EXTRACTED', 'CLIENT_CONFIRMED', 'ANALYST_REVIEW_PENDING', 'VERIFIED', 'NEEDS_CLARIFICATION', 'BLOCKED', 'LINKED_TO_EVIDENCE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('NOT_STARTED', 'PENDING', 'IN_REVIEW', 'APPROVED', 'REVISED', 'REJECTED', 'REQUEST_MORE_DATA', 'ESCALATED_TO_CALL', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'IN_REVIEW', 'RELEASED', 'BLOCKED', 'NEEDS_EVIDENCE', 'EXCEPTION', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AdviceClassification" AS ENUM ('INFORMATION', 'WORKFLOW', 'GUIDANCE', 'ADVICE_RELEVANT', 'ADVICE', 'OUT_OF_SCOPE');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('DRAFT', 'AI_DRAFT', 'ANALYST_REVIEWED', 'ADVISOR_PENDING', 'ADVISOR_APPROVED', 'REVISION_REQUESTED', 'MORE_DATA_REQUESTED', 'COMPLIANCE_PENDING', 'RELEASED_TO_CLIENT', 'BLOCKED', 'CLIENT_ACCEPTED', 'CLIENT_DEFERRED', 'CLIENT_REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DecisionStatus" AS ENUM ('DRAFT', 'RELEASED_TO_CLIENT', 'AWAITING_FAMILY_APPROVAL', 'ACCEPTED', 'DEFERRED', 'REJECTED', 'EVIDENCE_CREATED', 'REVIEW_SCHEDULED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EvidenceStatus" AS ENUM ('PLACEHOLDER', 'CREATED', 'LINKED', 'VALIDATED', 'RELEASED', 'RESTRICTED', 'ARCHIVED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "ExportStatus" AS ENUM ('DRAFT', 'SCOPE_SELECTED', 'REDACTION_PENDING', 'APPROVAL_REQUIRED', 'APPROVED', 'GENERATED', 'DOWNLOADED', 'EXPIRED', 'REVOKED', 'FAILED');

-- CreateEnum
CREATE TYPE "CommunicationChannel" AS ENUM ('SECURE_MESSAGE', 'EMAIL', 'PHONE', 'VIDEO', 'IN_PERSON', 'SYSTEM_NOTIFICATION');

-- CreateEnum
CREATE TYPE "EscalationType" AS ENUM ('NONE', 'REQUEST_DATA', 'ADVISOR_CALL', 'F2F_WORKSHOP', 'EXTERNAL_SPECIALIST', 'COMPLIANCE_ESCALATION', 'SECURITY_PRIVACY_REVIEW');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('TRUST', 'COMPANY', 'FOUNDATION', 'PARTNERSHIP', 'INDIVIDUAL', 'FAMILY_OFFICE', 'OTHER');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('PORTFOLIO', 'BANK_ACCOUNT', 'REAL_ESTATE', 'INSURANCE_POLICY', 'BUSINESS_INTEREST', 'LIQUIDITY', 'TAX_RESIDENCY', 'OTHER');

-- CreateEnum
CREATE TYPE "ExportType" AS ENUM ('CLIENT_DECISION_PACK', 'EVIDENCE_PACKAGE', 'COMPLIANCE_AUDIT_PACK', 'EXTERNAL_ADVISOR_DATA_ROOM', 'TENANT_DATA_INVENTORY', 'USER_ACCESS_REPORT', 'ACTIVITY_LOG_EXPORT', 'PILOT_METRICS_EXPORT');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ObjectType" ADD VALUE 'ENGAGEMENT';
ALTER TYPE "ObjectType" ADD VALUE 'POLICY';
ALTER TYPE "ObjectType" ADD VALUE 'QUEUE_ITEM';
ALTER TYPE "ObjectType" ADD VALUE 'DATA_QUALITY_ISSUE';

-- AlterTable
ALTER TABLE "client_tenants" ADD COLUMN     "clientSuccessOwnerUserId" UUID,
ADD COLUMN     "complianceOwnerUserId" UUID,
ADD COLUMN     "policyProfileId" UUID,
ADD COLUMN     "primaryAdvisorUserId" UUID,
ADD COLUMN     "primaryAnalystUserId" UUID;

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "platformTenantId" UUID NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "displayName" VARCHAR(160) NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'INVITED',
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "preferredLocale" VARCHAR(16),
    "timezone" VARCHAR(64),
    "isServiceAccount" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "clientTenantId" UUID,
    "firstName" VARCHAR(80),
    "lastName" VARCHAR(80),
    "phone" VARCHAR(40),
    "relationshipLabel" VARCHAR(80),
    "countryOfResidence" VARCHAR(80),
    "dateOfBirth" DATE,
    "sensitivity" "Sensitivity" NOT NULL DEFAULT 'CONFIDENTIAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "platformTenantId" UUID NOT NULL,
    "clientTenantId" UUID,
    "key" VARCHAR(120) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "scope" "RoleScope" NOT NULL,
    "isSystemRole" BOOLEAN NOT NULL DEFAULT true,
    "requiresSecondConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "segregationGroup" VARCHAR(80),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "key" VARCHAR(160) NOT NULL,
    "objectType" "ObjectType" NOT NULL,
    "action" "PermissionAction" NOT NULL,
    "description" TEXT,
    "defaultSensitivityLimit" "Sensitivity",
    "requiresAudit" BOOLEAN NOT NULL DEFAULT false,
    "requiresSecondConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "requiresComplianceReview" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "clientTenantId" UUID,
    "entityId" UUID,
    "engagementId" UUID,
    "objectType" "ObjectType",
    "objectId" UUID,
    "status" VARCHAR(40) NOT NULL DEFAULT 'active',
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "assignedByUserId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,
    "effect" VARCHAR(20) NOT NULL DEFAULT 'allow',
    "conditionJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_requests" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "requesterUserId" UUID NOT NULL,
    "targetUserId" UUID,
    "objectType" "ObjectType" NOT NULL,
    "objectId" UUID NOT NULL,
    "requestedAction" "PermissionAction" NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "WorkflowStatus" NOT NULL,
    "reviewerUserId" UUID,
    "complianceRequired" BOOLEAN NOT NULL DEFAULT false,
    "decisionAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "access_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "second_confirmations" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID,
    "actorUserId" UUID NOT NULL,
    "targetObjectType" "ObjectType" NOT NULL,
    "targetObjectId" UUID NOT NULL,
    "action" "PermissionAction" NOT NULL,
    "confirmationPhrase" VARCHAR(160),
    "confirmedByUserId" UUID,
    "status" VARCHAR(40) NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "second_confirmations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_records" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID,
    "userId" UUID NOT NULL,
    "consentType" VARCHAR(80) NOT NULL,
    "version" VARCHAR(40) NOT NULL,
    "status" VARCHAR(40) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),
    "source" VARCHAR(80),
    "ipAddress" VARCHAR(64),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engagements" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "type" VARCHAR(80) NOT NULL,
    "status" "WorkflowStatus" NOT NULL,
    "ownerUserId" UUID NOT NULL,
    "advisorUserId" UUID,
    "analystUserId" UUID,
    "complianceUserId" UUID,
    "startDate" DATE,
    "targetEndDate" DATE,
    "closedAt" TIMESTAMP(3),
    "sensitivity" "Sensitivity" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "engagements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_members" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "userId" UUID,
    "displayName" VARCHAR(160) NOT NULL,
    "relationshipType" VARCHAR(80) NOT NULL,
    "dateOfBirth" DATE,
    "taxResidency" VARCHAR(80),
    "isPrincipal" BOOLEAN NOT NULL DEFAULT false,
    "sensitivity" "Sensitivity" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "family_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relationships" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "subjectType" "ObjectType" NOT NULL,
    "subjectId" UUID NOT NULL,
    "relationshipType" VARCHAR(80) NOT NULL,
    "objectType" "ObjectType" NOT NULL,
    "objectId" UUID NOT NULL,
    "startDate" DATE,
    "endDate" DATE,
    "confidence" DECIMAL(5,2),
    "sourceDocumentId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_objectives" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "ownerFamilyMemberId" UUID,
    "category" VARCHAR(80) NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "priority" VARCHAR(40),
    "timeHorizon" VARCHAR(80),
    "status" "WorkflowStatus" NOT NULL,
    "sensitivity" "Sensitivity" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entities" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "jurisdiction" VARCHAR(80),
    "registrationNumber" VARCHAR(120),
    "status" VARCHAR(40) NOT NULL,
    "ownerSummary" TEXT,
    "riskRating" VARCHAR(40),
    "dataQualityScore" INTEGER,
    "sensitivity" "Sensitivity" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entity_participants" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "entityId" UUID NOT NULL,
    "participantType" "ObjectType" NOT NULL,
    "participantId" UUID NOT NULL,
    "roleLabel" VARCHAR(80) NOT NULL,
    "ownershipPercent" DECIMAL(6,3),
    "effectiveFrom" DATE,
    "effectiveUntil" DATE,
    "sourceDocumentId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entity_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "entityId" UUID,
    "assetType" "AssetType" NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "jurisdiction" VARCHAR(80),
    "currency" VARCHAR(3),
    "valueBand" VARCHAR(80),
    "estimatedValue" DECIMAL(18,2),
    "valuationDate" DATE,
    "riskRating" VARCHAR(40),
    "status" VARCHAR(40) NOT NULL,
    "sensitivity" "Sensitivity" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "engagementId" UUID,
    "uploadedByUserId" UUID NOT NULL,
    "documentType" VARCHAR(100) NOT NULL,
    "title" VARCHAR(220) NOT NULL,
    "status" "DocumentStatus" NOT NULL,
    "fileName" VARCHAR(260),
    "mimeType" VARCHAR(120),
    "fileSizeBytes" INTEGER,
    "storageKey" VARCHAR(500),
    "checksum" VARCHAR(128),
    "source" VARCHAR(80),
    "sensitivity" "Sensitivity" NOT NULL,
    "clientVisible" BOOLEAN NOT NULL DEFAULT false,
    "retentionPolicy" VARCHAR(120),
    "expiresAt" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_versions" (
    "id" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "storageKey" VARCHAR(500) NOT NULL,
    "checksum" VARCHAR(128),
    "createdByUserId" UUID NOT NULL,
    "changeReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_extractions" (
    "id" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "extractionStatus" VARCHAR(60) NOT NULL,
    "confidenceScore" DECIMAL(5,2),
    "extractedFieldsJson" JSONB,
    "lowConfidenceFieldsJson" JSONB,
    "modelVersion" VARCHAR(80),
    "isClientVisible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_extractions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_reviews" (
    "id" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "reviewerUserId" UUID NOT NULL,
    "reviewType" VARCHAR(80) NOT NULL,
    "status" "ReviewStatus" NOT NULL,
    "notes" TEXT,
    "clientVisibleSummary" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_links" (
    "id" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "targetType" "ObjectType" NOT NULL,
    "targetId" UUID NOT NULL,
    "relationship" VARCHAR(80) NOT NULL,
    "createdByUserId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "triggers" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "engagementId" UUID,
    "source" VARCHAR(80) NOT NULL,
    "triggerType" VARCHAR(100) NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "description" TEXT,
    "severity" VARCHAR(40) NOT NULL,
    "confidenceScore" DECIMAL(5,2),
    "status" "WorkflowStatus" NOT NULL,
    "clientVisible" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" VARCHAR(80) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "triggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_items" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "engagementId" UUID,
    "triggerId" UUID,
    "title" VARCHAR(180) NOT NULL,
    "description" TEXT,
    "ownerUserId" UUID,
    "assignedRoleKey" VARCHAR(120),
    "priority" VARCHAR(40) NOT NULL,
    "status" "WorkflowStatus" NOT NULL,
    "dueDate" DATE,
    "clientVisible" BOOLEAN NOT NULL DEFAULT false,
    "evidenceStatus" "EvidenceStatus",
    "blockedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "action_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "engagementId" UUID,
    "triggerId" UUID,
    "createdByUserId" UUID,
    "title" VARCHAR(200) NOT NULL,
    "summaryInternal" TEXT,
    "clientSummaryDraft" TEXT,
    "adviceClassification" "AdviceClassification" NOT NULL,
    "status" "RecommendationStatus" NOT NULL,
    "advisorApprovalId" UUID,
    "complianceReviewId" UUID,
    "clientVisible" BOOLEAN NOT NULL DEFAULT false,
    "riskSummary" TEXT,
    "assumptionsJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation_options" (
    "id" UUID NOT NULL,
    "recommendationId" UUID NOT NULL,
    "label" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "prosJson" JSONB,
    "consJson" JSONB,
    "riskLevel" VARCHAR(40),
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "recommendation_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approvals" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "targetType" "ObjectType" NOT NULL,
    "targetId" UUID NOT NULL,
    "approverUserId" UUID NOT NULL,
    "approverRoleKey" VARCHAR(120) NOT NULL,
    "approvalType" VARCHAR(80) NOT NULL,
    "status" "ReviewStatus" NOT NULL,
    "notes" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_reviews" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "targetType" "ObjectType" NOT NULL,
    "targetId" UUID NOT NULL,
    "reviewerUserId" UUID NOT NULL,
    "status" "ComplianceStatus" NOT NULL,
    "adviceClassification" "AdviceClassification" NOT NULL,
    "recordOfAdviceRequired" BOOLEAN NOT NULL DEFAULT false,
    "recordOfAdviceDocumentId" UUID,
    "kycFicaStatus" VARCHAR(80),
    "popiaConsentStatus" VARCHAR(80),
    "evidenceComplete" BOOLEAN NOT NULL DEFAULT false,
    "releaseNotes" TEXT,
    "releasedAt" TIMESTAMP(3),
    "blockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compliance_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decisions" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "recommendationId" UUID,
    "title" VARCHAR(200) NOT NULL,
    "status" "DecisionStatus" NOT NULL,
    "releasedToClientAt" TIMESTAMP(3),
    "decisionByUserId" UUID,
    "decisionAction" VARCHAR(40),
    "decisionReason" TEXT,
    "decisionAt" TIMESTAMP(3),
    "reviewDate" DATE,
    "evidenceRecordId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_participants" (
    "id" UUID NOT NULL,
    "decisionId" UUID NOT NULL,
    "userId" UUID,
    "roleKey" VARCHAR(120),
    "required" BOOLEAN NOT NULL DEFAULT true,
    "status" "ReviewStatus" NOT NULL,
    "actedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decision_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_records" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "engagementId" UUID,
    "title" VARCHAR(220) NOT NULL,
    "status" "EvidenceStatus" NOT NULL,
    "relatedObjectType" "ObjectType" NOT NULL,
    "relatedObjectId" UUID NOT NULL,
    "summary" TEXT,
    "visibilityStatus" "VisibilityStatus" NOT NULL,
    "retentionPolicy" VARCHAR(120),
    "reviewDate" DATE,
    "createdByUserId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evidence_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_items" (
    "id" UUID NOT NULL,
    "evidenceRecordId" UUID NOT NULL,
    "itemType" VARCHAR(80) NOT NULL,
    "sourceObjectType" "ObjectType" NOT NULL,
    "sourceObjectId" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "visibilityStatus" "VisibilityStatus" NOT NULL,
    "hash" VARCHAR(128),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidence_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_schedules" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "targetType" "ObjectType" NOT NULL,
    "targetId" UUID NOT NULL,
    "cadence" VARCHAR(80) NOT NULL,
    "nextReviewDate" DATE NOT NULL,
    "ownerUserId" UUID,
    "status" "WorkflowStatus" NOT NULL,
    "lastCompletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_threads" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "engagementId" UUID,
    "subject" VARCHAR(220) NOT NULL,
    "channel" "CommunicationChannel" NOT NULL,
    "status" "WorkflowStatus" NOT NULL,
    "clientVisible" BOOLEAN NOT NULL DEFAULT false,
    "relatedObjectType" "ObjectType",
    "relatedObjectId" UUID,
    "createdByUserId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "threadId" UUID NOT NULL,
    "senderUserId" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "clientVisible" BOOLEAN NOT NULL DEFAULT false,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "approvalId" UUID,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call_events" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "engagementId" UUID,
    "relatedObjectType" "ObjectType",
    "relatedObjectId" UUID,
    "escalationType" "EscalationType" NOT NULL,
    "scheduledByUserId" UUID NOT NULL,
    "scheduledFor" TIMESTAMP(3),
    "durationMinutes" INTEGER,
    "status" "WorkflowStatus" NOT NULL,
    "outcomeSummary" TEXT,
    "evidenceRecordId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "call_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_requests" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "requestedByUserId" UUID NOT NULL,
    "exportType" "ExportType" NOT NULL,
    "status" "ExportStatus" NOT NULL,
    "scopeJson" JSONB NOT NULL,
    "redactionProfile" VARCHAR(80) NOT NULL,
    "approvalRequired" BOOLEAN NOT NULL DEFAULT false,
    "approvedByUserId" UUID,
    "generatedFileDocumentId" UUID,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "export_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_definitions" (
    "id" UUID NOT NULL,
    "platformTenantId" UUID NOT NULL,
    "clientTenantId" UUID,
    "policyKey" VARCHAR(140) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "version" VARCHAR(40) NOT NULL,
    "category" VARCHAR(80) NOT NULL,
    "rulesJson" JSONB NOT NULL,
    "status" VARCHAR(40) NOT NULL,
    "createdByUserId" UUID NOT NULL,
    "effectiveFrom" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policy_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "queue_items" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "queueName" VARCHAR(120) NOT NULL,
    "targetType" "ObjectType" NOT NULL,
    "targetId" UUID NOT NULL,
    "assignedToUserId" UUID,
    "assignedRoleKey" VARCHAR(120),
    "priority" VARCHAR(40) NOT NULL,
    "status" "WorkflowStatus" NOT NULL,
    "slaDueAt" TIMESTAMP(3),
    "escalated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "queue_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_quality_issues" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "targetType" "ObjectType" NOT NULL,
    "targetId" UUID NOT NULL,
    "severity" VARCHAR(40) NOT NULL,
    "issueType" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "WorkflowStatus" NOT NULL,
    "ownerUserId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_quality_issues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_platformTenantId_idx" ON "users"("platformTenantId");

-- CreateIndex
CREATE INDEX "user_profiles_clientTenantId_idx" ON "user_profiles"("clientTenantId");

-- CreateIndex
CREATE INDEX "roles_platformTenantId_idx" ON "roles"("platformTenantId");

-- CreateIndex
CREATE INDEX "roles_clientTenantId_idx" ON "roles"("clientTenantId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_platformTenantId_clientTenantId_key_key" ON "roles"("platformTenantId", "clientTenantId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- CreateIndex
CREATE INDEX "permissions_objectType_action_idx" ON "permissions"("objectType", "action");

-- CreateIndex
CREATE INDEX "user_roles_userId_idx" ON "user_roles"("userId");

-- CreateIndex
CREATE INDEX "user_roles_roleId_idx" ON "user_roles"("roleId");

-- CreateIndex
CREATE INDEX "user_roles_clientTenantId_idx" ON "user_roles"("clientTenantId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "access_requests_clientTenantId_status_idx" ON "access_requests"("clientTenantId", "status");

-- CreateIndex
CREATE INDEX "second_confirmations_clientTenantId_status_idx" ON "second_confirmations"("clientTenantId", "status");

-- CreateIndex
CREATE INDEX "consent_records_clientTenantId_idx" ON "consent_records"("clientTenantId");

-- CreateIndex
CREATE INDEX "consent_records_userId_idx" ON "consent_records"("userId");

-- CreateIndex
CREATE INDEX "engagements_clientTenantId_status_idx" ON "engagements"("clientTenantId", "status");

-- CreateIndex
CREATE INDEX "family_members_clientTenantId_idx" ON "family_members"("clientTenantId");

-- CreateIndex
CREATE INDEX "relationships_clientTenantId_idx" ON "relationships"("clientTenantId");

-- CreateIndex
CREATE INDEX "relationships_subjectType_subjectId_idx" ON "relationships"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "relationships_objectType_objectId_idx" ON "relationships"("objectType", "objectId");

-- CreateIndex
CREATE INDEX "client_objectives_clientTenantId_idx" ON "client_objectives"("clientTenantId");

-- CreateIndex
CREATE INDEX "entities_clientTenantId_idx" ON "entities"("clientTenantId");

-- CreateIndex
CREATE INDEX "entity_participants_clientTenantId_idx" ON "entity_participants"("clientTenantId");

-- CreateIndex
CREATE INDEX "entity_participants_entityId_idx" ON "entity_participants"("entityId");

-- CreateIndex
CREATE INDEX "assets_clientTenantId_idx" ON "assets"("clientTenantId");

-- CreateIndex
CREATE INDEX "assets_entityId_idx" ON "assets"("entityId");

-- CreateIndex
CREATE INDEX "documents_clientTenantId_status_idx" ON "documents"("clientTenantId", "status");

-- CreateIndex
CREATE INDEX "documents_engagementId_idx" ON "documents"("engagementId");

-- CreateIndex
CREATE UNIQUE INDEX "document_versions_documentId_versionNumber_key" ON "document_versions"("documentId", "versionNumber");

-- CreateIndex
CREATE INDEX "document_extractions_documentId_idx" ON "document_extractions"("documentId");

-- CreateIndex
CREATE INDEX "document_reviews_documentId_status_idx" ON "document_reviews"("documentId", "status");

-- CreateIndex
CREATE INDEX "document_links_targetType_targetId_idx" ON "document_links"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "triggers_clientTenantId_status_idx" ON "triggers"("clientTenantId", "status");

-- CreateIndex
CREATE INDEX "triggers_engagementId_idx" ON "triggers"("engagementId");

-- CreateIndex
CREATE INDEX "action_items_clientTenantId_status_idx" ON "action_items"("clientTenantId", "status");

-- CreateIndex
CREATE INDEX "action_items_triggerId_idx" ON "action_items"("triggerId");

-- CreateIndex
CREATE INDEX "recommendations_clientTenantId_status_idx" ON "recommendations"("clientTenantId", "status");

-- CreateIndex
CREATE INDEX "recommendations_triggerId_idx" ON "recommendations"("triggerId");

-- CreateIndex
CREATE INDEX "recommendation_options_recommendationId_idx" ON "recommendation_options"("recommendationId");

-- CreateIndex
CREATE INDEX "approvals_clientTenantId_idx" ON "approvals"("clientTenantId");

-- CreateIndex
CREATE INDEX "approvals_targetType_targetId_idx" ON "approvals"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "compliance_reviews_clientTenantId_status_idx" ON "compliance_reviews"("clientTenantId", "status");

-- CreateIndex
CREATE INDEX "compliance_reviews_targetType_targetId_idx" ON "compliance_reviews"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "decisions_clientTenantId_status_idx" ON "decisions"("clientTenantId", "status");

-- CreateIndex
CREATE INDEX "decisions_recommendationId_idx" ON "decisions"("recommendationId");

-- CreateIndex
CREATE INDEX "decision_participants_decisionId_idx" ON "decision_participants"("decisionId");

-- CreateIndex
CREATE INDEX "evidence_records_clientTenantId_status_idx" ON "evidence_records"("clientTenantId", "status");

-- CreateIndex
CREATE INDEX "evidence_records_relatedObjectType_relatedObjectId_idx" ON "evidence_records"("relatedObjectType", "relatedObjectId");

-- CreateIndex
CREATE INDEX "evidence_items_evidenceRecordId_idx" ON "evidence_items"("evidenceRecordId");

-- CreateIndex
CREATE INDEX "evidence_items_sourceObjectType_sourceObjectId_idx" ON "evidence_items"("sourceObjectType", "sourceObjectId");

-- CreateIndex
CREATE INDEX "review_schedules_clientTenantId_status_idx" ON "review_schedules"("clientTenantId", "status");

-- CreateIndex
CREATE INDEX "review_schedules_targetType_targetId_idx" ON "review_schedules"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "message_threads_clientTenantId_status_idx" ON "message_threads"("clientTenantId", "status");

-- CreateIndex
CREATE INDEX "messages_threadId_idx" ON "messages"("threadId");

-- CreateIndex
CREATE INDEX "call_events_clientTenantId_status_idx" ON "call_events"("clientTenantId", "status");

-- CreateIndex
CREATE INDEX "export_requests_clientTenantId_status_idx" ON "export_requests"("clientTenantId", "status");

-- CreateIndex
CREATE INDEX "policy_definitions_clientTenantId_idx" ON "policy_definitions"("clientTenantId");

-- CreateIndex
CREATE UNIQUE INDEX "policy_definitions_platformTenantId_clientTenantId_policyKe_key" ON "policy_definitions"("platformTenantId", "clientTenantId", "policyKey", "version");

-- CreateIndex
CREATE INDEX "queue_items_clientTenantId_queueName_idx" ON "queue_items"("clientTenantId", "queueName");

-- CreateIndex
CREATE INDEX "queue_items_status_slaDueAt_idx" ON "queue_items"("status", "slaDueAt");

-- CreateIndex
CREATE INDEX "data_quality_issues_clientTenantId_status_idx" ON "data_quality_issues"("clientTenantId", "status");

-- CreateIndex
CREATE INDEX "data_quality_issues_targetType_targetId_idx" ON "data_quality_issues"("targetType", "targetId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_platformTenantId_fkey" FOREIGN KEY ("platformTenantId") REFERENCES "platform_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_platformTenantId_fkey" FOREIGN KEY ("platformTenantId") REFERENCES "platform_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_requests" ADD CONSTRAINT "access_requests_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "second_confirmations" ADD CONSTRAINT "second_confirmations_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engagements" ADD CONSTRAINT "engagements_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_objectives" ADD CONSTRAINT "client_objectives_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_objectives" ADD CONSTRAINT "client_objectives_ownerFamilyMemberId_fkey" FOREIGN KEY ("ownerFamilyMemberId") REFERENCES "family_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entities" ADD CONSTRAINT "entities_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_participants" ADD CONSTRAINT "entity_participants_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_participants" ADD CONSTRAINT "entity_participants_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "engagements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_extractions" ADD CONSTRAINT "document_extractions_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_reviews" ADD CONSTRAINT "document_reviews_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_links" ADD CONSTRAINT "document_links_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triggers" ADD CONSTRAINT "triggers_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triggers" ADD CONSTRAINT "triggers_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "engagements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_items" ADD CONSTRAINT "action_items_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_items" ADD CONSTRAINT "action_items_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "engagements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_items" ADD CONSTRAINT "action_items_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "triggers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "engagements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "triggers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_options" ADD CONSTRAINT "recommendation_options_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_reviews" ADD CONSTRAINT "compliance_reviews_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "recommendations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_participants" ADD CONSTRAINT "decision_participants_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "decisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_records" ADD CONSTRAINT "evidence_records_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_records" ADD CONSTRAINT "evidence_records_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "engagements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_items" ADD CONSTRAINT "evidence_items_evidenceRecordId_fkey" FOREIGN KEY ("evidenceRecordId") REFERENCES "evidence_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_schedules" ADD CONSTRAINT "review_schedules_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "engagements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "message_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_events" ADD CONSTRAINT "call_events_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_events" ADD CONSTRAINT "call_events_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "engagements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_requests" ADD CONSTRAINT "export_requests_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_requests" ADD CONSTRAINT "export_requests_generatedFileDocumentId_fkey" FOREIGN KEY ("generatedFileDocumentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_definitions" ADD CONSTRAINT "policy_definitions_platformTenantId_fkey" FOREIGN KEY ("platformTenantId") REFERENCES "platform_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_definitions" ADD CONSTRAINT "policy_definitions_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "queue_items" ADD CONSTRAINT "queue_items_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_quality_issues" ADD CONSTRAINT "data_quality_issues_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
