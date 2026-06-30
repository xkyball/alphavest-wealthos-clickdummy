CREATE TABLE "search_documents" (
    "id" UUID NOT NULL,
    "clientTenantId" UUID,
    "objectType" "ObjectType" NOT NULL,
    "objectId" UUID NOT NULL,
    "processInstanceId" UUID,
    "title" VARCHAR(240) NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "href" VARCHAR(500) NOT NULL,
    "status" VARCHAR(120) NOT NULL,
    "visibilityScope" VARCHAR(80) NOT NULL DEFAULT 'INTERNAL',
    "source" VARCHAR(120) NOT NULL DEFAULT 'search_index_rebuild',
    "metadataJson" JSONB,
    "indexedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_documents_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "search_documents_objectType_objectId_visibilityScope_key" ON "search_documents"("objectType", "objectId", "visibilityScope");
CREATE INDEX "search_documents_clientTenantId_objectType_idx" ON "search_documents"("clientTenantId", "objectType");
CREATE INDEX "search_documents_processInstanceId_idx" ON "search_documents"("processInstanceId");
CREATE INDEX "search_documents_visibilityScope_idx" ON "search_documents"("visibilityScope");
CREATE INDEX "search_documents_fulltext_idx" ON "search_documents" USING GIN (to_tsvector('english', coalesce("title", '') || ' ' || coalesce("summary", '') || ' ' || coalesce("content", '') || ' ' || coalesce("status", '')));
