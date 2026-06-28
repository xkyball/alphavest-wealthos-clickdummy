-- Process Runtime Backbone.
-- This replaces Journey/Mega-Journey as the canonical runtime authority for P0 process state/history.

ALTER TYPE "ObjectType" ADD VALUE 'PROCESS';
ALTER TYPE "ObjectType" ADD VALUE 'PROCESS_STEP';

CREATE TYPE "ProcessDefinitionStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'DEFERRED', 'RETIRED');
CREATE TYPE "ProcessInstanceStatus" AS ENUM ('CREATED', 'ACTIVE', 'BLOCKED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "ProcessStepStatus" AS ENUM ('LOCKED', 'READY', 'ACTIVE', 'BLOCKED', 'COMPLETED', 'SKIPPED');
CREATE TYPE "ProcessObjectLinkRole" AS ENUM (
    'PRIMARY_CONTEXT',
    'SUPPORTING_EVIDENCE',
    'RECOMMENDATION',
    'DECISION',
    'EXPORT',
    'AUDIT_REFERENCE',
    'SOURCE_OBJECT'
);

CREATE TABLE "process_definitions" (
    "id" UUID NOT NULL,
    "processId" VARCHAR(40) NOT NULL,
    "processName" VARCHAR(220) NOT NULL,
    "domainId" VARCHAR(40) NOT NULL,
    "domainName" VARCHAR(220) NOT NULL,
    "intendedAreaId" VARCHAR(40),
    "intendedArea" VARCHAR(220),
    "status" "ProcessDefinitionStatus" NOT NULL,
    "sourceArtifact" VARCHAR(220) NOT NULL,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "process_definitions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "process_step_definitions" (
    "id" UUID NOT NULL,
    "processDefinitionId" UUID NOT NULL,
    "stepId" VARCHAR(60) NOT NULL,
    "stepLabel" VARCHAR(220) NOT NULL,
    "sequence" INTEGER NOT NULL,
    "actor" VARCHAR(160),
    "action" TEXT,
    "gateType" VARCHAR(120),
    "decisionPoint" BOOLEAN NOT NULL DEFAULT false,
    "acceptanceState" VARCHAR(80) NOT NULL,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "process_step_definitions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "process_instances" (
    "id" UUID NOT NULL,
    "processDefinitionId" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "ownerUserId" UUID,
    "status" "ProcessInstanceStatus" NOT NULL DEFAULT 'CREATED',
    "currentStepId" VARCHAR(60),
    "currentSequence" INTEGER,
    "blockerCode" VARCHAR(120),
    "blockerReason" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "process_instances_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "process_step_instances" (
    "id" UUID NOT NULL,
    "processInstanceId" UUID NOT NULL,
    "stepId" VARCHAR(60) NOT NULL,
    "stepLabel" VARCHAR(220) NOT NULL,
    "actor" VARCHAR(160),
    "status" "ProcessStepStatus" NOT NULL,
    "blockerCode" VARCHAR(120),
    "blockerReason" TEXT,
    "sequence" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "process_step_instances_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "process_object_links" (
    "id" UUID NOT NULL,
    "processInstanceId" UUID NOT NULL,
    "objectType" "ObjectType" NOT NULL,
    "objectId" UUID NOT NULL,
    "linkRole" "ProcessObjectLinkRole" NOT NULL,
    "title" VARCHAR(220),
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "process_object_links_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "process_command_runs" (
    "id" UUID NOT NULL,
    "processInstanceId" UUID NOT NULL,
    "commandKey" VARCHAR(100) NOT NULL,
    "actorUserId" UUID,
    "actorRoleKey" VARCHAR(120),
    "fromStepId" VARCHAR(60),
    "toStepId" VARCHAR(60),
    "previousState" VARCHAR(120),
    "nextState" VARCHAR(120),
    "result" "AuditResult" NOT NULL,
    "reason" TEXT,
    "auditEventId" UUID,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "process_command_runs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "process_definitions_processId_key" ON "process_definitions"("processId");
CREATE INDEX "process_definitions_domainId_status_idx" ON "process_definitions"("domainId", "status");
CREATE INDEX "process_definitions_intendedAreaId_idx" ON "process_definitions"("intendedAreaId");

CREATE UNIQUE INDEX "process_step_definitions_stepId_key" ON "process_step_definitions"("stepId");
CREATE INDEX "process_step_definitions_processDefinitionId_sequence_idx"
    ON "process_step_definitions"("processDefinitionId", "sequence");
CREATE INDEX "process_step_definitions_acceptanceState_idx" ON "process_step_definitions"("acceptanceState");

CREATE INDEX "process_instances_clientTenantId_status_idx" ON "process_instances"("clientTenantId", "status");
CREATE INDEX "process_instances_processDefinitionId_idx" ON "process_instances"("processDefinitionId");

CREATE UNIQUE INDEX "process_step_instances_processInstanceId_stepId_key"
    ON "process_step_instances"("processInstanceId", "stepId");
CREATE INDEX "process_step_instances_processInstanceId_status_idx"
    ON "process_step_instances"("processInstanceId", "status");

CREATE INDEX "process_object_links_processInstanceId_idx" ON "process_object_links"("processInstanceId");
CREATE INDEX "process_object_links_objectType_objectId_idx" ON "process_object_links"("objectType", "objectId");

CREATE INDEX "process_command_runs_processInstanceId_createdAt_idx"
    ON "process_command_runs"("processInstanceId", "createdAt");
CREATE INDEX "process_command_runs_commandKey_idx" ON "process_command_runs"("commandKey");

ALTER TABLE "process_step_definitions"
    ADD CONSTRAINT "process_step_definitions_processDefinitionId_fkey"
    FOREIGN KEY ("processDefinitionId") REFERENCES "process_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "process_instances"
    ADD CONSTRAINT "process_instances_processDefinitionId_fkey"
    FOREIGN KEY ("processDefinitionId") REFERENCES "process_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "process_instances"
    ADD CONSTRAINT "process_instances_clientTenantId_fkey"
    FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "process_step_instances"
    ADD CONSTRAINT "process_step_instances_processInstanceId_fkey"
    FOREIGN KEY ("processInstanceId") REFERENCES "process_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "process_object_links"
    ADD CONSTRAINT "process_object_links_processInstanceId_fkey"
    FOREIGN KEY ("processInstanceId") REFERENCES "process_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "process_command_runs"
    ADD CONSTRAINT "process_command_runs_processInstanceId_fkey"
    FOREIGN KEY ("processInstanceId") REFERENCES "process_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "evidence_sufficiency_decisions"
    ALTER COLUMN "journeyInstanceId" DROP NOT NULL,
    ADD COLUMN "processInstanceId" UUID;

CREATE INDEX "evidence_sufficiency_decisions_processInstanceId_requirementKey_createdAt_idx"
    ON "evidence_sufficiency_decisions"("processInstanceId", "requirementKey", "createdAt");

ALTER TABLE "evidence_sufficiency_decisions"
    ADD CONSTRAINT "evidence_sufficiency_decisions_processInstanceId_fkey"
    FOREIGN KEY ("processInstanceId") REFERENCES "process_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
