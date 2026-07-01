CREATE TABLE "document_derivatives" (
  "id" UUID NOT NULL,
  "documentId" UUID NOT NULL,
  "versionId" UUID,
  "kind" VARCHAR(40) NOT NULL,
  "status" VARCHAR(40) NOT NULL,
  "mimeType" VARCHAR(120),
  "storageKey" VARCHAR(500),
  "width" INTEGER,
  "height" INTEGER,
  "pageNumber" INTEGER,
  "byteSize" INTEGER,
  "generationStrategy" VARCHAR(80),
  "errorCode" VARCHAR(120),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "document_derivatives_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "document_derivatives_documentId_kind_status_idx" ON "document_derivatives"("documentId", "kind", "status");
CREATE INDEX "document_derivatives_versionId_idx" ON "document_derivatives"("versionId");

ALTER TABLE "document_derivatives"
  ADD CONSTRAINT "document_derivatives_documentId_fkey"
  FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "document_derivatives"
  ADD CONSTRAINT "document_derivatives_versionId_fkey"
  FOREIGN KEY ("versionId") REFERENCES "document_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
