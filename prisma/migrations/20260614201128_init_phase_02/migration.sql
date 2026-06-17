-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('DRAFT', 'ONBOARDING', 'ACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ObjectType" AS ENUM ('PLATFORM', 'TENANT', 'USER', 'ROLE', 'PERMISSION', 'FAMILY_MEMBER', 'RELATIONSHIP', 'ENTITY', 'ASSET', 'DOCUMENT', 'TRIGGER', 'ACTION_ITEM', 'RECOMMENDATION', 'DECISION', 'EVIDENCE_RECORD', 'AUDIT_EVENT', 'EXPORT_REQUEST', 'MESSAGE', 'REVIEW_SCHEDULE');

-- CreateEnum
CREATE TYPE "AuditResult" AS ENUM ('SUCCESS', 'DENIED', 'BLOCKED', 'FAILED', 'PENDING', 'WARNING');

-- CreateTable
CREATE TABLE "platform_tenants" (
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "legalName" VARCHAR(220),
    "status" "TenantStatus" NOT NULL DEFAULT 'DRAFT',
    "defaultTimezone" VARCHAR(64) NOT NULL DEFAULT 'Africa/Johannesburg',
    "defaultLocale" VARCHAR(16) NOT NULL DEFAULT 'en-ZA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_tenants" (
    "id" UUID NOT NULL,
    "platformTenantId" UUID NOT NULL,
    "displayName" VARCHAR(180) NOT NULL,
    "legalName" VARCHAR(220),
    "status" "TenantStatus" NOT NULL DEFAULT 'DRAFT',
    "jurisdiction" VARCHAR(80),
    "relationshipTier" VARCHAR(80),
    "dataRegion" VARCHAR(80),
    "riskRating" VARCHAR(40),
    "onboardingCompletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" UUID NOT NULL,
    "platformTenantId" UUID NOT NULL,
    "clientTenantId" UUID,
    "actorUserId" UUID,
    "actorRoleKey" VARCHAR(120),
    "eventType" VARCHAR(120) NOT NULL,
    "targetType" "ObjectType" NOT NULL,
    "targetId" UUID NOT NULL,
    "previousState" VARCHAR(120),
    "nextState" VARCHAR(120),
    "result" "AuditResult" NOT NULL,
    "reason" TEXT,
    "ipAddress" VARCHAR(64),
    "deviceId" UUID,
    "correlationId" UUID,
    "evidenceRecordId" UUID,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "client_tenants_platformTenantId_idx" ON "client_tenants"("platformTenantId");

-- CreateIndex
CREATE INDEX "client_tenants_status_idx" ON "client_tenants"("status");

-- CreateIndex
CREATE INDEX "audit_events_platformTenantId_createdAt_idx" ON "audit_events"("platformTenantId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_events_clientTenantId_createdAt_idx" ON "audit_events"("clientTenantId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_events_targetType_targetId_idx" ON "audit_events"("targetType", "targetId");

-- AddForeignKey
ALTER TABLE "client_tenants" ADD CONSTRAINT "client_tenants_platformTenantId_fkey" FOREIGN KEY ("platformTenantId") REFERENCES "platform_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_platformTenantId_fkey" FOREIGN KEY ("platformTenantId") REFERENCES "platform_tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_clientTenantId_fkey" FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
