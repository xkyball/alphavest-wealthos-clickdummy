import { AuditResult, ObjectType, Prisma, type PrismaClient } from "@prisma/client";

import {
  createDemoSession,
  demoPlatformTenantId,
  demoRoles,
  demoTenants,
  type DemoRoleKey,
  type DemoTenantSlug,
} from "@/lib/demo-session";

export type GlobalSearchResult = {
  description: string;
  href: string;
  id: string;
  label: string;
  status: string;
  type: string;
};

type SearchResultRow = GlobalSearchResult & {
  rank: number;
};

const maxQueryLength = 80;

export function normalizeGlobalSearchQuery(value: string | null | undefined) {
  return (value ?? "").trim().slice(0, maxQueryLength);
}

const productLabelOverrides: Record<string, string> = {
  AI_EXTRACTED: "Extraction review",
  ACTIVE: "Active",
  ANALYST_REVIEW_PENDING: "Analyst review pending",
  APPROVED: "Approved",
  ARCHIVED: "Archived",
  AWAITING_REVIEW: "Awaiting review",
  BLOCKED: "Blocked",
  CLIENT_RELEASED: "Client released",
  COMPLIANCE_PENDING: "Compliance pending",
  COMPLETE: "Complete",
  DRAFT: "Draft",
  EMPTY: "Awaiting document",
  FAMILY_CFO: "Family CFO",
  INACTIVE: "Inactive",
  IN_PROGRESS: "In progress",
  INTERNAL_ONLY: "Internal only",
  LINKED_TO_EVIDENCE: "Linked to evidence",
  NEEDS_CLARIFICATION: "Needs clarification",
  OPEN: "Open",
  PENDING: "Pending",
  READY_FOR_DOWNLOAD: "Ready for download",
  READY_FOR_RELEASE: "Ready for release",
  RELEASED_TO_CLIENT: "Released to client",
  RESTRICTED: "Restricted",
  SUCCESS: "Success",
  VERIFIED: "Verified",
};

const labelAcronyms: Record<string, string> = {
  aml: "AML",
  cfo: "CFO",
  ips: "IPS",
  kyc: "KYC",
  llc: "LLC",
  ubo: "UBO",
};

function productSegmentLabel(value: string) {
  const trimmed = value.trim();
  const exactOverride = productLabelOverrides[trimmed] ?? productLabelOverrides[trimmed.toUpperCase()];

  if (exactOverride) {
    return exactOverride;
  }

  if (!/^([A-Za-z0-9]+[_-])+[A-Za-z0-9]+$/.test(trimmed) && !/^[A-Z0-9 ]+$/.test(trimmed)) {
    return value;
  }

  return trimmed
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part, index) => labelAcronyms[part] ?? (index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(" ");
}

function productSearchLabel(value: string) {
  return value.split(" / ").map(productSegmentLabel).join(" / ");
}

function roleCanSearchPlatform(roleKey: DemoRoleKey) {
  const role = demoRoles.find((item) => item.key === roleKey);

  return role?.scope === "PLATFORM";
}

const tenantScopedPredicate = (tenantIds: string[]) => Prisma.sql`"clientTenantId" IN (${Prisma.join(tenantIds)})`;

function productObjectSearchSql(tenantIds: string[], normalizedQuery: string) {
  const tenantIdList = Prisma.join(tenantIds);

  return Prisma.sql`
    WITH query AS (
      SELECT websearch_to_tsquery('simple', ${normalizedQuery}) AS value
    ),
    rows AS (
      SELECT
        'tenant-' || id::text AS id,
        "displayName" AS label,
        'Tenant' AS type,
        status::text AS status,
        concat_ws(' / ', "displayName", jurisdiction, "relationshipTier") AS description,
        '/tenants' AS href,
        to_tsvector('simple', concat_ws(' ', "displayName", jurisdiction, "relationshipTier", status::text)) AS vector
      FROM client_tenants
      WHERE id IN (${tenantIdList})

      UNION ALL

      SELECT
        'document-' || d.id::text AS id,
        d.title AS label,
        'Document' AS type,
        d.status::text AS status,
        concat_ws(' / ', ct."displayName", d."documentType", d."fileName") AS description,
        '/documents' AS href,
        to_tsvector('simple', concat_ws(' ', ct."displayName", d.title, d."documentType", d."fileName", d.status::text)) AS vector
      FROM documents d
      JOIN client_tenants ct ON ct.id = d."clientTenantId"
      WHERE d.${tenantScopedPredicate(tenantIds)}

      UNION ALL

      SELECT
        'family-' || fm.id::text AS id,
        fm."displayName" AS label,
        'Family' AS type,
        fm."relationshipType" AS status,
        concat_ws(' / ', ct."displayName", fm."relationshipType", fm."taxResidency") AS description,
        '/client/family-members' AS href,
        to_tsvector('simple', concat_ws(' ', ct."displayName", fm."displayName", fm."relationshipType", fm."taxResidency")) AS vector
      FROM family_members fm
      JOIN client_tenants ct ON ct.id = fm."clientTenantId"
      WHERE fm.${tenantScopedPredicate(tenantIds)}

      UNION ALL

      SELECT
        'entity-' || e.id::text AS id,
        e.name AS label,
        'Entity' AS type,
        e.status AS status,
        concat_ws(' / ', ct."displayName", e."entityType"::text, e.jurisdiction, e."riskRating") AS description,
        '/entities' AS href,
        to_tsvector('simple', concat_ws(' ', ct."displayName", e.name, e."entityType"::text, e.jurisdiction, e."riskRating", e.status)) AS vector
      FROM entities e
      JOIN client_tenants ct ON ct.id = e."clientTenantId"
      WHERE e.${tenantScopedPredicate(tenantIds)}

      UNION ALL

      SELECT
        'export-' || er.id::text AS id,
        'Export ' || left(er.id::text, 8) AS label,
        'Export' AS type,
        er.status::text AS status,
        concat_ws(' / ', ct."displayName", er."exportType"::text, er."redactionProfile") AS description,
        '/export/demo/download' AS href,
        to_tsvector('simple', concat_ws(' ', ct."displayName", er."exportType"::text, er."redactionProfile", er.status::text, er.id::text)) AS vector
      FROM export_requests er
      JOIN client_tenants ct ON ct.id = er."clientTenantId"
      WHERE er.${tenantScopedPredicate(tenantIds)}

      UNION ALL

      SELECT
        'queue-' || qi.id::text AS id,
        qi."queueName" AS label,
        'Ops' AS type,
        qi.status::text AS status,
        concat_ws(' / ', ct."displayName", qi."assignedRoleKey", qi.priority) AS description,
        '/ops' AS href,
        to_tsvector('simple', concat_ws(' ', ct."displayName", qi."queueName", qi."assignedRoleKey", qi.priority, qi.status::text, qi.id::text)) AS vector
      FROM queue_items qi
      JOIN client_tenants ct ON ct.id = qi."clientTenantId"
      WHERE qi.${tenantScopedPredicate(tenantIds)}

      UNION ALL

      SELECT
        'dq-' || dqi.id::text AS id,
        dqi."issueType" AS label,
        'Data quality' AS type,
        concat_ws(' / ', dqi.severity, dqi.status::text) AS status,
        concat_ws(' / ', ct."displayName", dqi.description) AS description,
        '/ops/sla/demo' AS href,
        to_tsvector('simple', concat_ws(' ', ct."displayName", dqi."issueType", dqi.description, dqi.severity, dqi.status::text)) AS vector
      FROM data_quality_issues dqi
      JOIN client_tenants ct ON ct.id = dqi."clientTenantId"
      WHERE dqi.${tenantScopedPredicate(tenantIds)}

      UNION ALL

      SELECT
        'audit-' || ae.id::text AS id,
        ae."eventType" AS label,
        'Audit' AS type,
        ae.result::text AS status,
        concat_ws(' / ', ct."displayName", ae.reason, ae."targetType"::text) AS description,
        '/compliance/reviews/demo/audit' AS href,
        to_tsvector('simple', concat_ws(' ', ct."displayName", ae."eventType", ae.reason, ae.result::text, ae."targetType"::text)) AS vector
      FROM audit_events ae
      JOIN client_tenants ct ON ct.id = ae."clientTenantId"
      WHERE ae.${tenantScopedPredicate(tenantIds)}
    )
    SELECT
      id,
      label,
      type,
      status,
      description,
      href,
      ts_rank_cd(vector, query.value) AS rank
    FROM rows, query
    WHERE vector @@ query.value
    ORDER BY rank DESC, lower(label) ASC
    LIMIT 12
  `;
}

export async function searchGlobalDb(
  prisma: PrismaClient,
  tenantSlug: DemoTenantSlug,
  roleKey: DemoRoleKey,
  query: string,
) {
  const tenant = demoTenants.find((item) => item.slug === tenantSlug);
  const normalizedQuery = normalizeGlobalSearchQuery(query);

  if (!tenant || normalizedQuery.length < 2) {
    return [];
  }

  const tenantIds = roleCanSearchPlatform(roleKey) ? demoTenants.map((item) => item.id) : [tenant.id];
  const rows = await prisma.$queryRaw<SearchResultRow[]>(productObjectSearchSql(tenantIds, normalizedQuery));

  return rows.map((row) => ({
    description: productSearchLabel(row.description),
    href: row.href,
    id: row.id,
    label: row.label,
    status: productSearchLabel(row.status),
    type: row.type,
  }));
}

export async function recordGlobalSearchAudit(
  prisma: PrismaClient,
  tenantSlug: DemoTenantSlug,
  roleKey: DemoRoleKey,
  query: string,
  resultCount: number,
) {
  const session = createDemoSession({ roleKey, tenantSlug });
  const normalizedQuery = normalizeGlobalSearchQuery(query);

  if (normalizedQuery.length < 2) {
    return null;
  }

  return prisma.auditEvent.create({
    data: {
      actorRoleKey: session.role.key,
      actorUserId: session.actor.id,
      clientTenantId: session.tenant.id,
      eventType: "global_search.executed",
      metadataJson: {
        noClientRelease: true,
        productObjectsOnly: true,
        query: normalizedQuery,
        resultCount,
        searchMode: "postgres_full_text",
        storageReferencesRendered: false,
      } satisfies Prisma.InputJsonObject,
      nextState: "results_returned",
      platformTenantId: demoPlatformTenantId,
      previousState: "query_submitted",
      reason: "Workspace search executed with tenant, role and product-object scope.",
      result: AuditResult.SUCCESS,
      targetId: session.tenant.id,
      targetType: ObjectType.TENANT,
    },
  });
}
