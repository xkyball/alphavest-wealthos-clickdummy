import { ObjectType, Sensitivity, type PrismaClient } from "@prisma/client";

import { requireDemoSession, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";

type SortDirection = "asc" | "desc";

export type DbtfFamilyMemberRow = {
  governance: string;
  id: string;
  name: string;
  relationship: string;
  role: string;
  sensitivity: string;
  status: string;
  taxResidency: string;
  year: string;
};

export type DbtfEntityRow = {
  id: string;
  jurisdiction: string;
  missingDocs: string;
  name: string;
  ownership: string;
  risk: string;
  status: string;
  type: string;
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

function isRestrictedRole(roleKey: DemoRoleKey) {
  return roleKey === "next_gen" || roleKey === "external_advisor";
}

function roleSensitivityFilter(roleKey: DemoRoleKey) {
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

export async function listDbtfFamilyMembers(
  prisma: PrismaClient,
  tenantSlug: DemoTenantSlug,
  roleKey: DemoRoleKey,
  options: { q?: string; sort?: string } = {},
) {
  const session = requireDemoSession({ roleKey, tenantSlug });
  const query = options.q?.trim();
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
  const mappedRows: DbtfFamilyMemberRow[] = rows.map((row) => ({
    governance: row.isPrincipal ? "Principal" : row.sensitivity === "RESTRICTED" ? "Restricted" : "Family record",
    id: row.id,
    name: row.displayName,
    relationship: labelFromEnum(row.relationshipType),
    role: row.isPrincipal ? "Principal" : labelFromEnum(row.relationshipType),
    sensitivity: labelFromEnum(row.sensitivity),
    status: row.sensitivity === "RESTRICTED" || row.sensitivity === "HIGHLY_RESTRICTED" ? "Restricted" : "Active",
    taxResidency: row.taxResidency ?? "Unspecified",
    year: row.dateOfBirth ? String(row.dateOfBirth.getUTCFullYear()) : "n/a",
  }));

  if (options.sort === "name-desc") {
    return sortRows(mappedRows, "name", "desc");
  }

  if (options.sort === "relationship") {
    return sortRows(mappedRows, "relationship", "asc");
  }

  return mappedRows;
}

export async function listDbtfEntities(
  prisma: PrismaClient,
  tenantSlug: DemoTenantSlug,
  roleKey: DemoRoleKey,
  options: {
    jurisdiction?: string;
    q?: string;
    risk?: string;
    sort?: string;
    type?: string;
  } = {},
) {
  const session = requireDemoSession({ roleKey, tenantSlug });
  const query = options.q?.trim();
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
      ...(options.type && options.type !== "all" ? { entityType: options.type as never } : {}),
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

  const mappedRows: DbtfEntityRow[] = entities.map((entity) => {
    const ownershipTotal = entity.participants.reduce((total, participant) => {
      return total + Number(participant.ownershipPercent ?? 0);
    }, 0);
    const linkedDocumentCount = documentCountByEntity.get(entity.id) ?? 0;

    return {
      id: entity.id,
      jurisdiction: entity.jurisdiction ?? "Unspecified",
      missingDocs: linkedDocumentCount > 0 ? "All good" : "Evidence needed",
      name: entity.name,
      ownership: ownershipTotal > 0 ? `${ownershipTotal.toFixed(1).replace(/\.0$/, "")}%` : "Unspecified",
      risk: entity.riskRating ?? "Unrated",
      status: labelFromEnum(entity.status),
      type: labelFromEnum(entity.entityType),
    };
  });

  if (options.sort === "risk") {
    return sortRows(mappedRows, "risk", "asc");
  }

  if (options.sort === "name-desc") {
    return sortRows(mappedRows, "name", "desc");
  }

  return mappedRows;
}

export async function listDbtfAuditEvents(
  prisma: PrismaClient,
  tenantSlug: DemoTenantSlug,
  roleKey: DemoRoleKey,
  options: { result?: string; q?: string } = {},
) {
  const session = requireDemoSession({ roleKey, tenantSlug });
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
