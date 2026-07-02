ALTER TABLE "client_tenants" ADD COLUMN "slug" VARCHAR(120);

UPDATE "client_tenants"
SET "slug" = CASE
  WHEN "id" = '05f1998b-343e-52b4-9888-176f03ed95ae' THEN 'bennett'
  WHEN "id" = '7870ddd4-4587-58c6-a30b-ed6710109c17' THEN 'morgan'
  WHEN "id" = 'c7fc6b48-0f0c-5a7d-8a12-05e0f0bbc069' THEN 'northbridge'
  WHEN "id" = '68c2dd2e-2322-526f-8a48-2fdadf996c40' THEN 'summit'
  ELSE 'tenant-' || replace("id"::text, '-', '')
END
WHERE "slug" IS NULL;

ALTER TABLE "client_tenants" ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "client_tenants_platformTenantId_slug_key" ON "client_tenants"("platformTenantId", "slug");
