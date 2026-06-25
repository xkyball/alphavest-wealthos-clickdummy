-- Breaking cleanup: first-class internal draft governance spine.
CREATE TYPE "InternalDraftStatus" AS ENUM (
    'CREATED',
    'CLASSIFIED',
    'REVISION_REQUESTED',
    'REJECTED',
    'REBUILT_WITH_EVIDENCE',
    'ADVISOR_READY',
    'ARCHIVED'
);

CREATE TYPE "DraftClassificationKind" AS ENUM (
    'ADVICE_RELEVANT',
    'GUIDANCE',
    'INFORMATION',
    'OUT_OF_SCOPE'
);

CREATE TYPE "DraftRiskLevel" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);

CREATE TYPE "UnsupportedClaimStatus" AS ENUM (
    'NEEDS_EVIDENCE',
    'RESOLVED',
    'WAIVED'
);

CREATE TABLE "internal_drafts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "recommendationId" UUID NOT NULL,
    "clientTenantId" UUID NOT NULL,
    "draftKey" VARCHAR(140) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "draftClientSummary" TEXT NOT NULL,
    "internalRationale" TEXT NOT NULL,
    "processId" VARCHAR(80) NOT NULL,
    "sourceObjectId" UUID NOT NULL,
    "sourceObjectType" "ObjectType" NOT NULL,
    "sourceRefsJson" JSONB NOT NULL,
    "status" "InternalDraftStatus" NOT NULL DEFAULT 'CREATED',
    "createdByUserId" UUID,
    "currentTraceId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "internal_drafts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "draft_classifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "internalDraftId" UUID NOT NULL,
    "classification" "DraftClassificationKind" NOT NULL,
    "riskLevel" "DraftRiskLevel" NOT NULL,
    "unsupportedClaimsClear" BOOLEAN NOT NULL DEFAULT false,
    "classifiedByRoleKey" VARCHAR(120) NOT NULL,
    "classifiedByUserId" UUID,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "draft_classifications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "unsupported_claims" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "internalDraftId" UUID NOT NULL,
    "evidenceRecordId" UUID,
    "claimKey" VARCHAR(140) NOT NULL,
    "evidenceRequirement" TEXT NOT NULL,
    "sourceRef" TEXT NOT NULL,
    "status" "UnsupportedClaimStatus" NOT NULL DEFAULT 'NEEDS_EVIDENCE',
    "createdByRoleKey" VARCHAR(120) NOT NULL,
    "createdByUserId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unsupported_claims_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "draft_traces" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "internalDraftId" UUID NOT NULL,
    "auditEventId" UUID,
    "evidenceRecordId" UUID,
    "traceType" VARCHAR(100) NOT NULL,
    "actorRoleKey" VARCHAR(120) NOT NULL,
    "actorUserId" UUID,
    "reason" TEXT NOT NULL,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "draft_traces_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "internal_drafts_recommendationId_draftKey_key"
    ON "internal_drafts"("recommendationId", "draftKey");

CREATE INDEX "internal_drafts_clientTenantId_status_idx"
    ON "internal_drafts"("clientTenantId", "status");

CREATE INDEX "internal_drafts_recommendationId_createdAt_idx"
    ON "internal_drafts"("recommendationId", "createdAt");

CREATE INDEX "draft_classifications_internalDraftId_createdAt_idx"
    ON "draft_classifications"("internalDraftId", "createdAt");

CREATE UNIQUE INDEX "unsupported_claims_internalDraftId_claimKey_key"
    ON "unsupported_claims"("internalDraftId", "claimKey");

CREATE INDEX "unsupported_claims_internalDraftId_status_idx"
    ON "unsupported_claims"("internalDraftId", "status");

CREATE INDEX "unsupported_claims_evidenceRecordId_idx"
    ON "unsupported_claims"("evidenceRecordId");

CREATE INDEX "draft_traces_internalDraftId_createdAt_idx"
    ON "draft_traces"("internalDraftId", "createdAt");

CREATE INDEX "draft_traces_traceType_idx"
    ON "draft_traces"("traceType");

ALTER TABLE "internal_drafts"
    ADD CONSTRAINT "internal_drafts_recommendationId_fkey"
    FOREIGN KEY ("recommendationId") REFERENCES "recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "internal_drafts"
    ADD CONSTRAINT "internal_drafts_clientTenantId_fkey"
    FOREIGN KEY ("clientTenantId") REFERENCES "client_tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "draft_classifications"
    ADD CONSTRAINT "draft_classifications_internalDraftId_fkey"
    FOREIGN KEY ("internalDraftId") REFERENCES "internal_drafts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "unsupported_claims"
    ADD CONSTRAINT "unsupported_claims_internalDraftId_fkey"
    FOREIGN KEY ("internalDraftId") REFERENCES "internal_drafts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "draft_traces"
    ADD CONSTRAINT "draft_traces_internalDraftId_fkey"
    FOREIGN KEY ("internalDraftId") REFERENCES "internal_drafts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
