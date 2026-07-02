ALTER TABLE "users"
ADD COLUMN "profileImageStorageKey" VARCHAR(500),
ADD COLUMN "profileImageMimeType" VARCHAR(100),
ADD COLUMN "localPasswordHash" VARCHAR(128),
ADD COLUMN "localPasswordUpdatedAt" TIMESTAMP(3),
ADD COLUMN "notificationEmail" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notificationSecurity" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notificationDigest" BOOLEAN NOT NULL DEFAULT true;
