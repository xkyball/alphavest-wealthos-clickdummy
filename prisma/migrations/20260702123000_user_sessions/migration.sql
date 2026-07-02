CREATE TABLE "user_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "clientTenantId" UUID,
    "userRoleId" UUID,
    "roleKey" VARCHAR(120),
    "providerId" VARCHAR(80) NOT NULL,
    "status" VARCHAR(40) NOT NULL DEFAULT 'ACTIVE',
    "ipAddress" VARCHAR(64),
    "userAgent" VARCHAR(260),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "revokedReason" VARCHAR(160),

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "user_sessions_userId_status_expiresAt_idx" ON "user_sessions"("userId", "status", "expiresAt");
CREATE INDEX "user_sessions_clientTenantId_idx" ON "user_sessions"("clientTenantId");
CREATE INDEX "user_sessions_userRoleId_idx" ON "user_sessions"("userRoleId");

ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
