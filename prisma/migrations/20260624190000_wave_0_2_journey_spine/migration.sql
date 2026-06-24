-- Wave 0-2 Journey Orchestration and Database Spine.
-- Additive only: no committee/KYC/suitability schema and no baseline replacement.

ALTER TYPE "ObjectType" ADD VALUE 'JOURNEY';
ALTER TYPE "ObjectType" ADD VALUE 'JOURNEY_STEP';

CREATE TYPE "JourneyDefinitionStatus" AS ENUM ('ACTIVE', 'HOLD_LOCKED', 'DEFERRED');
CREATE TYPE "JourneyInstanceStatus" AS ENUM ('CREATED', 'ACTIVE', 'BLOCKED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "JourneyStepStatus" AS ENUM ('LOCKED', 'READY', 'ACTIVE', 'BLOCKED', 'COMPLETED', 'SKIPPED');
CREATE TYPE "JourneyObjectLinkRole" AS ENUM ('PRIMARY_CONTEXT', 'SUPPORTING_EVIDENCE', 'RECOMMENDATION', 'DECISION', 'EXPORT', 'AUDIT_REFERENCE');

CREATE TABLE "journey_definitions" (
    "id" UUID NOT NULL,
    "journeyKey" VARCHAR(40) NOT NULL,
    "title" VARCHAR(220) NOT NULL,
    "description" TEXT NOT NULL,
    "wave" VARCHAR(40) NOT NULL,
    "status" "JourneyDefinitionStatus" NOT NULL,
    "holdReason" TEXT,
    "routePageIds" JSONB,
    "actorRoleKeys" JSONB,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_definitions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "journey_instances" (
    "id" UUID NOT NULL,
    "definitionId" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "ownerUserId" UUID,
    "status" "JourneyInstanceStatus" NOT NULL DEFAULT 'CREATED',
    "currentStepKey" VARCHAR(80),
    "currentStageKey" VARCHAR(80),
    "blockerCode" VARCHAR(80),
    "blockerReason" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_instances_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "journey_step_instances" (
    "id" UUID NOT NULL,
    "journeyInstanceId" UUID NOT NULL,
    "stepKey" VARCHAR(80) NOT NULL,
    "stageKey" VARCHAR(80) NOT NULL,
    "title" VARCHAR(220) NOT NULL,
    "actorRoleKey" VARCHAR(120),
    "status" "JourneyStepStatus" NOT NULL,
    "blockerCode" VARCHAR(80),
    "blockerReason" TEXT,
    "sortOrder" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journey_step_instances_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "journey_object_links" (
    "id" UUID NOT NULL,
    "journeyInstanceId" UUID NOT NULL,
    "objectType" "ObjectType" NOT NULL,
    "objectId" UUID NOT NULL,
    "linkRole" "JourneyObjectLinkRole" NOT NULL,
    "title" VARCHAR(220),
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journey_object_links_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "journey_evidence_requirements" (
    "id" UUID NOT NULL,
    "journeyDefinitionId" UUID NOT NULL,
    "requirementKey" VARCHAR(100) NOT NULL,
    "title" VARCHAR(220) NOT NULL,
    "requiredObjectType" "ObjectType" NOT NULL,
    "requiredForStepKey" VARCHAR(80) NOT NULL,
    "minEvidenceStatus" "EvidenceStatus",
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journey_evidence_requirements_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "journey_command_runs" (
    "id" UUID NOT NULL,
    "journeyInstanceId" UUID NOT NULL,
    "commandKey" VARCHAR(80) NOT NULL,
    "actorUserId" UUID,
    "actorRoleKey" VARCHAR(120),
    "fromStepKey" VARCHAR(80),
    "toStepKey" VARCHAR(80),
    "result" "AuditResult" NOT NULL,
    "reason" TEXT,
    "auditEventId" UUID,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journey_command_runs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "journey_definitions_journeyKey_key" ON "journey_definitions"("journeyKey");
CREATE INDEX "journey_definitions_status_idx" ON "journey_definitions"("status");
CREATE INDEX "journey_instances_clientTenantId_status_idx" ON "journey_instances"("clientTenantId", "status");
CREATE INDEX "journey_instances_definitionId_idx" ON "journey_instances"("definitionId");
CREATE UNIQUE INDEX "journey_step_instances_journeyInstanceId_stepKey_key" ON "journey_step_instances"("journeyInstanceId", "stepKey");
CREATE INDEX "journey_step_instances_journeyInstanceId_status_idx" ON "journey_step_instances"("journeyInstanceId", "status");
CREATE INDEX "journey_object_links_journeyInstanceId_idx" ON "journey_object_links"("journeyInstanceId");
CREATE INDEX "journey_object_links_objectType_objectId_idx" ON "journey_object_links"("objectType", "objectId");
CREATE UNIQUE INDEX "journey_evidence_requirements_journeyDefinitionId_requireme_key" ON "journey_evidence_requirements"("journeyDefinitionId", "requirementKey");
CREATE INDEX "journey_evidence_requirements_requiredObjectType_idx" ON "journey_evidence_requirements"("requiredObjectType");
CREATE INDEX "journey_command_runs_journeyInstanceId_createdAt_idx" ON "journey_command_runs"("journeyInstanceId", "createdAt");
CREATE INDEX "journey_command_runs_commandKey_idx" ON "journey_command_runs"("commandKey");

ALTER TABLE "journey_instances" ADD CONSTRAINT "journey_instances_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "journey_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "journey_instances" ADD CONSTRAINT "journey_instances_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "journey_step_instances" ADD CONSTRAINT "journey_step_instances_journeyInstanceId_fkey" FOREIGN KEY ("journeyInstanceId") REFERENCES "journey_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "journey_object_links" ADD CONSTRAINT "journey_object_links_journeyInstanceId_fkey" FOREIGN KEY ("journeyInstanceId") REFERENCES "journey_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "journey_evidence_requirements" ADD CONSTRAINT "journey_evidence_requirements_journeyDefinitionId_fkey" FOREIGN KEY ("journeyDefinitionId") REFERENCES "journey_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "journey_command_runs" ADD CONSTRAINT "journey_command_runs_journeyInstanceId_fkey" FOREIGN KEY ("journeyInstanceId") REFERENCES "journey_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
