-- Wave 0-2 Epic 5: explicit journey evidence sufficiency decisions.
CREATE TYPE "EvidenceSufficiencyDecisionStatus" AS ENUM ('SUFFICIENT', 'INSUFFICIENT');

CREATE TABLE "evidence_sufficiency_decisions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clientTenantId" UUID NOT NULL,
    "journeyInstanceId" UUID NOT NULL,
    "requirementKey" VARCHAR(100) NOT NULL,
    "evidenceRecordId" UUID NOT NULL,
    "decision" "EvidenceSufficiencyDecisionStatus" NOT NULL,
    "decidedByUserId" UUID,
    "decidedByRoleKey" VARCHAR(120),
    "reason" TEXT NOT NULL,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,
    "scopeMatches" BOOLEAN NOT NULL DEFAULT false,
    "relevanceConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "currentnessConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "auditEventId" UUID,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidence_sufficiency_decisions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "evidence_sufficiency_decisions_clientTenantId_createdAt_idx"
    ON "evidence_sufficiency_decisions"("clientTenantId", "createdAt");

CREATE INDEX "evidence_sufficiency_decisions_journeyInstanceId_requirementKey_createdAt_idx"
    ON "evidence_sufficiency_decisions"("journeyInstanceId", "requirementKey", "createdAt");

CREATE INDEX "evidence_sufficiency_decisions_evidenceRecordId_idx"
    ON "evidence_sufficiency_decisions"("evidenceRecordId");

ALTER TABLE "evidence_sufficiency_decisions"
    ADD CONSTRAINT "evidence_sufficiency_decisions_clientTenantId_fkey"
    FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "evidence_sufficiency_decisions"
    ADD CONSTRAINT "evidence_sufficiency_decisions_journeyInstanceId_fkey"
    FOREIGN KEY ("journeyInstanceId") REFERENCES "journey_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "evidence_sufficiency_decisions"
    ADD CONSTRAINT "evidence_sufficiency_decisions_evidenceRecordId_fkey"
    FOREIGN KEY ("evidenceRecordId") REFERENCES "evidence_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;
