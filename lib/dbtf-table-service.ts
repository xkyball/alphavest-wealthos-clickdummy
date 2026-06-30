import { EntityType, ObjectType, Sensitivity, type PrismaClient } from "@prisma/client";

import { requireActorSession, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { deriveClientContextVisibility } from "@/lib/client-context-visibility";
import {
  paginateDataSurfaceRows,
  sortDataSurfaceRows,
  type BackendDataSurfaceMeta,
  type DataSurfaceQuery,
} from "@/lib/data-surface-query-contract";

type SortDirection = "asc" | "desc";
export type DbtfFamilyMemberSortKey = "governance" | "name" | "relationship" | "role" | "status" | "taxResidency" | "visibilityStatus" | "year";
export type DbtfEntitySortKey = "jurisdiction" | "missingDocs" | "name" | "ownership" | "risk" | "status" | "type" | "visibilityStatus";
export type DbtfRelationshipSortKey = "confidence" | "from" | "readiness" | "relationship" | "status" | "to" | "type";
export type DbtfContextReadinessState = "blocked" | "incomplete" | "ready";

export type DbtfFamilyMemberRow = {
  contextReadinessReasons: string[];
  contextReadinessState: DbtfContextReadinessState;
  governance: string;
  id: string;
  name: string;
  payloadMode: string;
  relationship: string;
  role: string;
  sensitivity: string;
  status: string;
  taxResidency: string;
  visibilityStatus: string;
  year: string;
};

export type DbtfEntityRow = {
  contextReadinessReasons: string[];
  contextReadinessState: DbtfContextReadinessState;
  id: string;
  jurisdiction: string;
  missingDocs: string;
  name: string;
  ownership: string;
  payloadMode: string;
  risk: string;
  sensitivity: string;
  status: string;
  type: string;
  visibilityStatus: string;
};

export type DbtfRelationshipRow = {
  confidence: string;
  contextReadinessReasons: string[];
  contextReadinessState: DbtfContextReadinessState;
  from: string;
  id: string;
  payloadMode: string;
  readiness: string;
  relationship: string;
  status: string;
  to: string;
  type: string;
  visibilityStatus: string;
};

export type DbtfAuditEventRow = {
  action: string;
  actor: string;
  after: string;
  before: string;
  id: string;
  lineage: string[];
  object: string;
  result: string;
  role: string;
  source: string;
  sourceRef: string;
  sourceState: "source-backed";
  timestamp: string;
};

export type DbtfFamilyMembersPage = {
  familyMembers: DbtfFamilyMemberRow[];
  meta: BackendDataSurfaceMeta<DbtfFamilyMemberSortKey>;
};

export type DbtfEntitiesPage = {
  entities: DbtfEntityRow[];
  facets: {
    jurisdictions: string[];
    risks: string[];
    types: string[];
  };
  meta: BackendDataSurfaceMeta<DbtfEntitySortKey>;
};

export type DbtfRelationshipsPage = {
  meta: BackendDataSurfaceMeta<DbtfRelationshipSortKey>;
  relationships: DbtfRelationshipRow[];
};

function labelFromEnum(value: string | null | undefined) {
  if (!value) {
    return "Unspecified";
  }

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function isRestrictedRole(roleKey: ActorRoleKey) {
  return roleKey === "next_gen" || roleKey === "external_advisor";
}

function roleSensitivityFilter(roleKey: ActorRoleKey) {
  if (!isRestrictedRole(roleKey)) {
    return undefined;
  }

  return { notIn: [Sensitivity.RESTRICTED, Sensitivity.HIGHLY_RESTRICTED, Sensitivity.INTERNAL_ONLY] };
}

function sortRows<T>(rows: T[], key: keyof T, direction: SortDirection) {
  return [...rows].sort((left, right) => {
    const leftValue = String(left[key] ?? "");
    const rightValue = String(right[key] ?? "");
    const result = leftValue.localeCompare(rightValue, "en", { numeric: true, sensitivity: "base" });

    return direction === "desc" ? -result : result;
  });
}

function entityTypeFromFilter(value: string | undefined) {
  if (!value || value === "all") return undefined;
  const normalized = value.trim().toUpperCase().replaceAll(" ", "_");
  return Object.values(EntityType).find((entityType) => entityType === normalized);
}

function contextReadinessFromVisibility(input: {
  missingReasons?: string[];
  payloadMode: string;
  visibilityStatus: string;
}): { contextReadinessReasons: string[]; contextReadinessState: DbtfContextReadinessState } {
  const reasons = [...(input.missingReasons ?? [])];

  if (input.payloadMode === "hidden" || input.visibilityStatus === "INTERNAL_ONLY" || input.visibilityStatus === "RESTRICTED") {
    reasons.unshift("visibility_blocks_downstream_use");
    return {
      contextReadinessReasons: [...new Set(reasons)],
      contextReadinessState: "blocked",
    };
  }

  if (input.visibilityStatus === "REDACTED") {
    reasons.unshift("redacted_context_needs_internal_review");
    return {
      contextReadinessReasons: [...new Set(reasons)],
      contextReadinessState: "blocked",
    };
  }

  if (reasons.length > 0) {
    return {
      contextReadinessReasons: [...new Set(reasons)],
      contextReadinessState: "incomplete",
    };
  }

  return {
    contextReadinessReasons: [],
    contextReadinessState: "ready",
  };
}

async function buildDbtfFamilyMemberRows(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  q?: string,
) {
  const session = requireActorSession({ roleKey, tenantSlug });
  const query = q?.trim();
  const rows = await prisma.familyMember.findMany({
    orderBy: [{ isPrincipal: "desc" }, { displayName: "asc" }],
    where: {
      clientTenantId: session.tenant.id,
      ...(query
        ? {
            OR: [
              { displayName: { contains: query, mode: "insensitive" } },
              { relationshipType: { contains: query, mode: "insensitive" } },
              { taxResidency: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(roleSensitivityFilter(roleKey) ? { sensitivity: roleSensitivityFilter(roleKey) } : {}),
    },
  });
  return rows.flatMap<DbtfFamilyMemberRow>((row) => {
    const visibility = deriveClientContextVisibility(roleKey, row.sensitivity);

    if (!visibility.canRenderPayload) {
      return [];
    }

    const readiness = contextReadinessFromVisibility({
      missingReasons: [
        ...(row.relationshipType ? [] : ["relationship_required"]),
        ...(row.taxResidency ? [] : ["tax_residency_required"]),
        ...(row.dateOfBirth || row.isPrincipal ? [] : ["birth_year_required"]),
      ],
      payloadMode: visibility.payloadMode,
      visibilityStatus: visibility.visibilityStatus,
    });

    return [{
      ...readiness,
      governance: row.isPrincipal ? "Principal" : row.sensitivity === "RESTRICTED" ? "Restricted" : "Family record",
      id: row.id,
      name: row.displayName,
      payloadMode: visibility.payloadMode,
      relationship: labelFromEnum(row.relationshipType),
      role: row.isPrincipal ? "Principal" : labelFromEnum(row.relationshipType),
      sensitivity: labelFromEnum(visibility.sensitivity),
      status: row.sensitivity === "RESTRICTED" || row.sensitivity === "HIGHLY_RESTRICTED" ? "Restricted" : "Active",
      taxResidency: row.taxResidency ?? "Unspecified",
      visibilityStatus: labelFromEnum(visibility.visibilityStatus),
      year: row.dateOfBirth ? String(row.dateOfBirth.getUTCFullYear()) : "n/a",
    }];
  });
}

export async function listDbtfFamilyMembers(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  options: { q?: string; sort?: string } = {},
) {
  const mappedRows = await buildDbtfFamilyMemberRows(prisma, tenantSlug, roleKey, options.q);
  if (options.sort === "name-desc") {
    return sortRows(mappedRows, "name", "desc");
  }

  if (options.sort === "relationship") {
    return sortRows(mappedRows, "relationship", "asc");
  }

  return mappedRows;
}

export async function listDbtfFamilyMembersPage(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  query: DataSurfaceQuery<DbtfFamilyMemberSortKey>,
): Promise<DbtfFamilyMembersPage> {
  const rows = await buildDbtfFamilyMemberRows(prisma, tenantSlug, roleKey, query.q);
  const sortedRows = sortDataSurfaceRows(rows, query, (row, sortKey) => row[sortKey]);
  const page = paginateDataSurfaceRows(sortedRows, query);

  return { familyMembers: page.rows, meta: page.meta };
}

async function buildRelationshipObjectLabelMaps(
  prisma: PrismaClient,
  clientTenantId: string,
  roleKey: ActorRoleKey,
) {
  const [familyMembers, entities] = await Promise.all([
    prisma.familyMember.findMany({
      select: {
        displayName: true,
        id: true,
        sensitivity: true,
      },
      where: {
        clientTenantId,
        ...(roleSensitivityFilter(roleKey) ? { sensitivity: roleSensitivityFilter(roleKey) } : {}),
      },
    }),
    prisma.entity.findMany({
      select: {
        id: true,
        name: true,
        sensitivity: true,
      },
      where: {
        clientTenantId,
        ...(roleSensitivityFilter(roleKey) ? { sensitivity: roleSensitivityFilter(roleKey) } : {}),
      },
    }),
  ]);

  return {
    entities: new Map(entities.map((entity) => [entity.id, { label: entity.name, sensitivity: entity.sensitivity }])),
    familyMembers: new Map(
      familyMembers.map((member) => [member.id, { label: member.displayName, sensitivity: member.sensitivity }]),
    ),
  };
}

function relationshipObjectLabel(
  maps: Awaited<ReturnType<typeof buildRelationshipObjectLabelMaps>>,
  type: ObjectType,
  id: string,
) {
  if (type === ObjectType.FAMILY_MEMBER) return maps.familyMembers.get(id);
  if (type === ObjectType.ENTITY) return maps.entities.get(id);

  return undefined;
}

async function buildDbtfRelationshipRows(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  q?: string,
) {
  const session = requireActorSession({ roleKey, tenantSlug });
  const query = q?.trim().toLowerCase();
  const rows = await prisma.relationship.findMany({
    orderBy: { updatedAt: "desc" },
    where: {
      clientTenantId: session.tenant.id,
    },
  });
  const labelMaps = await buildRelationshipObjectLabelMaps(prisma, session.tenant.id, roleKey);

  const mappedRows = rows.flatMap<DbtfRelationshipRow>((row) => {
    const subject = relationshipObjectLabel(labelMaps, row.subjectType, row.subjectId);
    const object = relationshipObjectLabel(labelMaps, row.objectType, row.objectId);

    if (!subject || !object) {
      return [];
    }

    const lowestSensitivity =
      subject.sensitivity === Sensitivity.RESTRICTED ||
      object.sensitivity === Sensitivity.RESTRICTED ||
      subject.sensitivity === Sensitivity.HIGHLY_RESTRICTED ||
      object.sensitivity === Sensitivity.HIGHLY_RESTRICTED
        ? Sensitivity.RESTRICTED
        : Sensitivity.CONFIDENTIAL;
    const visibility = deriveClientContextVisibility(roleKey, lowestSensitivity);

    if (!visibility.canRenderPayload) {
      return [];
    }

    const confidence = Number(row.confidence ?? 0);
    const readiness = contextReadinessFromVisibility({
      missingReasons: [
        ...(confidence > 0 ? [] : ["confidence_required"]),
        ...(row.sourceDocumentId ? [] : ["supporting_evidence_required"]),
      ],
      payloadMode: visibility.payloadMode,
      visibilityStatus: visibility.visibilityStatus,
    });

    return [{
      ...readiness,
      confidence: confidence > 0 ? `${confidence.toFixed(0)}%` : "Unscored",
      from: subject.label,
      id: row.id,
      payloadMode: visibility.payloadMode,
      readiness: readinessLabelForRow(readiness.contextReadinessState),
      relationship: labelFromEnum(row.relationshipType),
      status: readiness.contextReadinessState === "ready" ? "Verified" : "Evidence needed",
      to: object.label,
      type: `${labelFromEnum(row.subjectType)} to ${labelFromEnum(row.objectType)}`,
      visibilityStatus: labelFromEnum(visibility.visibilityStatus),
    }];
  });

  if (!query) return mappedRows;

  return mappedRows.filter((row) =>
    [row.from, row.to, row.relationship, row.status, row.type, row.visibilityStatus].some((value) =>
      value.toLowerCase().includes(query),
    ),
  );
}

function readinessLabelForRow(value: DbtfContextReadinessState) {
  if (value === "ready") return "Ready";
  if (value === "blocked") return "Blocked";
  return "Incomplete";
}

export async function listDbtfRelationshipsPage(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  query: DataSurfaceQuery<DbtfRelationshipSortKey>,
): Promise<DbtfRelationshipsPage> {
  const rows = await buildDbtfRelationshipRows(prisma, tenantSlug, roleKey, query.q);
  const sortedRows = sortDataSurfaceRows(rows, query, (row, sortKey) => row[sortKey]);
  const page = paginateDataSurfaceRows(sortedRows, query);

  return { relationships: page.rows, meta: page.meta };
}

async function buildDbtfEntityRows(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  options: {
    jurisdiction?: string;
    q?: string;
    risk?: string;
    type?: string;
  } = {},
) {
  const session = requireActorSession({ roleKey, tenantSlug });
  const query = options.q?.trim();
  const entityTypeFilter = entityTypeFromFilter(options.type);
  const invalidEntityTypeFilter = Boolean(options.type && options.type !== "all" && !entityTypeFilter);
  const entities = await prisma.entity.findMany({
    include: {
      participants: {
        select: { ownershipPercent: true },
      },
    },
    orderBy: { name: "asc" },
    where: {
      clientTenantId: session.tenant.id,
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { jurisdiction: { contains: query, mode: "insensitive" } },
              { ownerSummary: { contains: query, mode: "insensitive" } },
              { riskRating: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(options.jurisdiction && options.jurisdiction !== "all" ? { jurisdiction: options.jurisdiction } : {}),
      ...(options.risk && options.risk !== "all" ? { riskRating: options.risk } : {}),
      ...(entityTypeFilter ? { entityType: entityTypeFilter } : {}),
      ...(invalidEntityTypeFilter ? { id: "__invalid_entity_type_filter__" } : {}),
      ...(roleSensitivityFilter(roleKey) ? { sensitivity: roleSensitivityFilter(roleKey) } : {}),
    },
  });
  const documentLinks = await prisma.documentLink.findMany({
    select: { targetId: true },
    where: {
      targetId: { in: entities.map((entity) => entity.id) },
      targetType: ObjectType.ENTITY,
    },
  });
  const documentCountByEntity = new Map<string, number>();

  for (const link of documentLinks) {
    documentCountByEntity.set(link.targetId, (documentCountByEntity.get(link.targetId) ?? 0) + 1);
  }

  return entities.flatMap<DbtfEntityRow>((entity) => {
    const visibility = deriveClientContextVisibility(roleKey, entity.sensitivity);

    if (!visibility.canRenderPayload) {
      return [];
    }

    const ownershipTotal = entity.participants.reduce((total, participant) => {
      return total + Number(participant.ownershipPercent ?? 0);
    }, 0);
    const linkedDocumentCount = documentCountByEntity.get(entity.id) ?? 0;
    const readiness = contextReadinessFromVisibility({
      missingReasons: [
        ...(entity.jurisdiction ? [] : ["jurisdiction_required"]),
        ...(entity.riskRating ? [] : ["risk_rating_required"]),
        ...(ownershipTotal > 0 ? [] : ["ownership_required"]),
        ...(linkedDocumentCount > 0 ? [] : ["supporting_evidence_required"]),
      ],
      payloadMode: visibility.payloadMode,
      visibilityStatus: visibility.visibilityStatus,
    });

    return [{
      ...readiness,
      id: entity.id,
      jurisdiction: entity.jurisdiction ?? "Unspecified",
      missingDocs: linkedDocumentCount > 0 ? "All good" : "Evidence needed",
      name: entity.name,
      ownership: ownershipTotal > 0 ? `${ownershipTotal.toFixed(1).replace(/\.0$/, "")}%` : "Unspecified",
      payloadMode: visibility.payloadMode,
      risk: entity.riskRating ?? "Unrated",
      sensitivity: labelFromEnum(visibility.sensitivity),
      status: labelFromEnum(entity.status),
      type: labelFromEnum(entity.entityType),
      visibilityStatus: labelFromEnum(visibility.visibilityStatus),
    }];
  });
}

export async function listDbtfEntities(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  options: {
    jurisdiction?: string;
    q?: string;
    risk?: string;
    sort?: string;
    type?: string;
  } = {},
) {
  const mappedRows = await buildDbtfEntityRows(prisma, tenantSlug, roleKey, options);
  if (options.sort === "risk") {
    return sortRows(mappedRows, "risk", "asc");
  }

  if (options.sort === "name-desc") {
    return sortRows(mappedRows, "name", "desc");
  }

  return mappedRows;
}

export async function listDbtfEntitiesPage(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  query: DataSurfaceQuery<DbtfEntitySortKey>,
  filters: {
    jurisdiction?: string;
    risk?: string;
    type?: string;
  } = {},
): Promise<DbtfEntitiesPage> {
  const rows = await buildDbtfEntityRows(prisma, tenantSlug, roleKey, {
    ...filters,
    q: query.q,
  });
  const sortedRows = sortDataSurfaceRows(rows, query, (row, sortKey) => row[sortKey]);
  const page = paginateDataSurfaceRows(sortedRows, query);

  return {
    entities: page.rows,
    facets: {
      jurisdictions: Array.from(new Set(rows.map((row) => row.jurisdiction).filter(Boolean))).sort(),
      risks: Array.from(new Set(rows.map((row) => row.risk).filter(Boolean))).sort(),
      types: Array.from(new Set(rows.map((row) => row.type).filter(Boolean))).sort(),
    },
    meta: page.meta,
  };
}

export async function listDbtfAuditEvents(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  options: { result?: string; q?: string } = {},
) {
  const session = requireActorSession({ roleKey, tenantSlug });
  const query = options.q?.trim();
  const events = await prisma.auditEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 25,
    where: {
      clientTenantId: session.tenant.id,
      ...(options.result && options.result !== "all" ? { result: options.result as never } : {}),
      ...(query
        ? {
            OR: [
              { actorRoleKey: { contains: query, mode: "insensitive" } },
              { eventType: { contains: query, mode: "insensitive" } },
              { reason: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
  });

  return events.map<DbtfAuditEventRow>((event) => ({
    action: labelFromEnum(event.eventType),
    actor: event.actorUserId ? event.actorUserId.slice(0, 8) : "System",
    after: event.nextState ?? "Recorded",
    before: event.previousState ?? "n/a",
    id: event.id,
    lineage: ["Tenant scope checked", "Permission context evaluated", "Audit event persisted"],
    object: `${labelFromEnum(event.targetType)} ${event.targetId.slice(0, 8)}`,
    result: labelFromEnum(event.result),
    role: event.actorRoleKey ? labelFromEnum(event.actorRoleKey) : "System",
    source: "AlphaVest DB audit log",
    sourceRef: event.id,
    sourceState: "source-backed",
    timestamp: formatDateTime(event.createdAt),
  }));
}
