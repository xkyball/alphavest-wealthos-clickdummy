CREATE INDEX IF NOT EXISTS "search_documents_acl_roles_idx"
  ON "search_documents"
  USING GIN ((("metadataJson"->'searchAccess'->'allowedRoleKeys')) jsonb_path_ops);

CREATE INDEX IF NOT EXISTS "search_documents_acl_object_grants_idx"
  ON "search_documents"
  USING GIN ((("metadataJson"->'searchAccess'->'objectGrantRequiredRoleKeys')) jsonb_path_ops);

CREATE INDEX IF NOT EXISTS "search_documents_acl_actors_idx"
  ON "search_documents"
  USING GIN ((("metadataJson"->'searchAccess'->'allowedActorIds')) jsonb_path_ops);

CREATE INDEX IF NOT EXISTS "search_documents_acl_prefilter_idx"
  ON "search_documents"("clientTenantId", "visibilityScope", "objectType", "updatedAt" DESC);
