-- Purge legacy Journey/Mega-Journey runtime.
-- Process Runtime is now the only workflow state/history authority.

DROP INDEX IF EXISTS "evidence_sufficiency_decisions_journeyInstanceId_requirementKey_createdAt_idx";

ALTER TABLE "evidence_sufficiency_decisions"
    DROP CONSTRAINT IF EXISTS "evidence_sufficiency_decisions_journeyInstanceId_fkey";

ALTER TABLE "evidence_sufficiency_decisions"
    DROP COLUMN IF EXISTS "journeyInstanceId",
    ALTER COLUMN "processInstanceId" SET NOT NULL;

DROP TABLE IF EXISTS "journey_command_runs";
DROP TABLE IF EXISTS "journey_object_links";
DROP TABLE IF EXISTS "journey_step_instances";
DROP TABLE IF EXISTS "journey_evidence_requirements";
DROP TABLE IF EXISTS "journey_instances";
DROP TABLE IF EXISTS "journey_definitions";

DROP TYPE IF EXISTS "JourneyObjectLinkRole";
DROP TYPE IF EXISTS "JourneyStepStatus";
DROP TYPE IF EXISTS "JourneyInstanceStatus";
DROP TYPE IF EXISTS "JourneyDefinitionStatus";

ALTER TYPE "ObjectType" RENAME TO "ObjectType_old";

CREATE TYPE "ObjectType" AS ENUM (
    'PLATFORM',
    'TENANT',
    'USER',
    'ROLE',
    'PERMISSION',
    'FAMILY_MEMBER',
    'RELATIONSHIP',
    'ENGAGEMENT',
    'ENTITY',
    'ASSET',
    'DOCUMENT',
    'TRIGGER',
    'ACTION_ITEM',
    'RECOMMENDATION',
    'DECISION',
    'EVIDENCE_RECORD',
    'AUDIT_EVENT',
    'EXPORT_REQUEST',
    'PROCESS',
    'PROCESS_STEP',
    'MESSAGE',
    'REVIEW_SCHEDULE',
    'POLICY',
    'QUEUE_ITEM',
    'DATA_QUALITY_ISSUE'
);

ALTER TABLE "permissions"
    ALTER COLUMN "objectType" TYPE "ObjectType" USING "objectType"::text::"ObjectType";
ALTER TABLE "user_roles"
    ALTER COLUMN "objectType" TYPE "ObjectType" USING "objectType"::text::"ObjectType";
ALTER TABLE "access_requests"
    ALTER COLUMN "objectType" TYPE "ObjectType" USING "objectType"::text::"ObjectType";
ALTER TABLE "second_confirmations"
    ALTER COLUMN "targetObjectType" TYPE "ObjectType" USING "targetObjectType"::text::"ObjectType";
ALTER TABLE "relationships"
    ALTER COLUMN "subjectType" TYPE "ObjectType" USING "subjectType"::text::"ObjectType",
    ALTER COLUMN "objectType" TYPE "ObjectType" USING "objectType"::text::"ObjectType";
ALTER TABLE "entity_participants"
    ALTER COLUMN "participantType" TYPE "ObjectType" USING "participantType"::text::"ObjectType";
ALTER TABLE "document_links"
    ALTER COLUMN "targetType" TYPE "ObjectType" USING "targetType"::text::"ObjectType";
ALTER TABLE "evidence_items"
    ALTER COLUMN "sourceObjectType" TYPE "ObjectType" USING "sourceObjectType"::text::"ObjectType";
ALTER TABLE "approvals"
    ALTER COLUMN "targetType" TYPE "ObjectType" USING "targetType"::text::"ObjectType";
ALTER TABLE "compliance_reviews"
    ALTER COLUMN "targetType" TYPE "ObjectType" USING "targetType"::text::"ObjectType";
ALTER TABLE "process_object_links"
    ALTER COLUMN "objectType" TYPE "ObjectType" USING "objectType"::text::"ObjectType";
ALTER TABLE "evidence_records"
    ALTER COLUMN "relatedObjectType" TYPE "ObjectType" USING "relatedObjectType"::text::"ObjectType";
ALTER TABLE "audit_events"
    ALTER COLUMN "targetType" TYPE "ObjectType" USING "targetType"::text::"ObjectType";
ALTER TABLE "review_schedules"
    ALTER COLUMN "targetType" TYPE "ObjectType" USING "targetType"::text::"ObjectType";
ALTER TABLE "message_threads"
    ALTER COLUMN "relatedObjectType" TYPE "ObjectType" USING "relatedObjectType"::text::"ObjectType";
ALTER TABLE "call_events"
    ALTER COLUMN "relatedObjectType" TYPE "ObjectType" USING "relatedObjectType"::text::"ObjectType";
ALTER TABLE "queue_items"
    ALTER COLUMN "targetType" TYPE "ObjectType" USING "targetType"::text::"ObjectType";
ALTER TABLE "data_quality_issues"
    ALTER COLUMN "targetType" TYPE "ObjectType" USING "targetType"::text::"ObjectType";
ALTER TABLE "internal_drafts"
    ALTER COLUMN "sourceObjectType" TYPE "ObjectType" USING "sourceObjectType"::text::"ObjectType";
ALTER TABLE "draft_traces"
    ALTER COLUMN "targetType" TYPE "ObjectType" USING "targetType"::text::"ObjectType";

DROP TYPE "ObjectType_old";
