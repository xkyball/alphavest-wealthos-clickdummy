DROP INDEX IF EXISTS "search_documents_fulltext_idx";

CREATE INDEX "search_documents_fulltext_idx" ON "search_documents" USING GIN ((
  setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
  setweight(to_tsvector('english', coalesce("status", '')), 'B') ||
  setweight(to_tsvector('english', coalesce("summary", '')), 'C') ||
  setweight(to_tsvector('english', coalesce("content", '')), 'D')
));
