import { EntityType, Sensitivity, WorkflowStatus, type PrismaClient } from "@prisma/client";

import { requireActorSession, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { deriveClientContextVisibility } from "@/lib/client-context-visibility";

export type WealthMapNodeTone = "blue" | "gold" | "green" | "muted" | "purple" | "red" | "restricted" | "teal";
export type WealthMapConnectionKind = "conflict" | "normal" | "restricted";

export type WealthMapNode = {
  detail: string;
  documents: string;
  flags: string[];
  id: string;
  label: string;
  relationships: string;
  status: string;
  tone: WealthMapNodeTone;
  type: string;
  value: string;
  x: number;
  y: number;
};

export type WealthMapConnection = {
  from: [number, number];
  kind: WealthMapConnectionKind;
  to: [number, number];
};

export type WealthMapAlert = {
  action: string;
  detail: string;
  title: string;
  tone: "blue" | "gold" | "red";
};

export type WealthMapDecision = {
  due: string;
  owner: string;
  status: string;
  title: string;
};

export type WealthMapReadModel = {
  alerts: WealthMapAlert[];
  connections: WealthMapConnection[];
  decisions: WealthMapDecision[];
  meta: {
    sourceTruth: "wealth_map_db_readmodel";
    totalActionItems: number;
    totalAssets: number;
    totalDocuments: number;
    totalEntities: number;
    totalFamilyMembers: number;
    totalRelationships: number;
    updatedAt: string;
  };
  nodes: WealthMapNode[];
  selectedNode: WealthMapNode | null;
  sourceTruth: "wealth_map_db_readmodel";
  workspace: {
    household: string;
    jurisdiction: string;
    lastUpdated: string;
    relationshipTier: string;
    riskRating: string;
  };
};

function labelFromValue(value: string | null | undefined, fallback = "Unspecified") {
  if (!value) return fallback;

  return value
    .toLowerCase()
    .split(/[._-]+|_/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isoDate(value: Date | null | undefined) {
  return value ? value.toISOString().slice(0, 10) : "Not recorded";
}

function compactValueBand(value: string | null | undefined) {
  if (!value) return "";

  return value.replace(/USD\s*/i, "").trim();
}

function nodeToneForEntity(input: { entityType: EntityType; riskRating: string | null; sensitivity: Sensitivity }) {
  if (input.sensitivity === Sensitivity.RESTRICTED || input.sensitivity === Sensitivity.HIGHLY_RESTRICTED) return "restricted";
  if ((input.riskRating ?? "").toLowerCase().includes("high")) return "red";
  if (input.entityType === EntityType.TRUST || input.entityType === EntityType.FOUNDATION) return "gold";

  return "blue";
}

function nodeToneForAsset(input: { assetType: string; riskRating: string | null; sensitivity: Sensitivity }) {
  if (input.sensitivity === Sensitivity.RESTRICTED || input.sensitivity === Sensitivity.HIGHLY_RESTRICTED) return "restricted";
  if (input.assetType === "REAL_ESTATE") return "red";
  if (input.assetType === "INSURANCE_POLICY") return "teal";
  if ((input.riskRating ?? "").toLowerCase().includes("high")) return "gold";

  return "green";
}

function pointFor(index: number, total: number, y: number): [number, number] {
  if (total <= 1) return [50, y];

  const span = 72;
  const start = 14;

  return [start + (span / Math.max(total - 1, 1)) * index, y];
}

function connectionKind(input: { readinessIssue: boolean; restricted: boolean }): WealthMapConnectionKind {
  if (input.restricted) return "restricted";
  if (input.readinessIssue) return "conflict";

  return "normal";
}

export async function buildWealthMapReadModel(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
): Promise<WealthMapReadModel> {
  const session = requireActorSession({ roleKey, tenantSlug });
  const [
    tenant,
    familyMembers,
    relationships,
    entities,
    assets,
    documentLinks,
    actionItems,
  ] = await Promise.all([
    prisma.clientTenant.findUniqueOrThrow({
      select: {
        displayName: true,
        jurisdiction: true,
        relationshipTier: true,
        riskRating: true,
        updatedAt: true,
      },
      where: { id: session.tenant.id },
    }),
    prisma.familyMember.findMany({
      orderBy: [{ isPrincipal: "desc" }, { displayName: "asc" }],
      select: {
        displayName: true,
        id: true,
        isPrincipal: true,
        relationshipType: true,
        sensitivity: true,
        updatedAt: true,
      },
      where: { clientTenantId: session.tenant.id },
      take: 5,
    }),
    prisma.relationship.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        confidence: true,
        id: true,
        objectId: true,
        relationshipType: true,
        sourceDocumentId: true,
        subjectId: true,
      },
      where: { clientTenantId: session.tenant.id },
      take: 12,
    }),
    prisma.entity.findMany({
      orderBy: [{ entityType: "asc" }, { name: "asc" }],
      select: {
        dataQualityScore: true,
        entityType: true,
        id: true,
        jurisdiction: true,
        name: true,
        riskRating: true,
        sensitivity: true,
        status: true,
        updatedAt: true,
      },
      where: { clientTenantId: session.tenant.id },
      take: 8,
    }),
    prisma.asset.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        assetType: true,
        entityId: true,
        id: true,
        name: true,
        riskRating: true,
        sensitivity: true,
        status: true,
        updatedAt: true,
        valueBand: true,
      },
      where: { clientTenantId: session.tenant.id },
      take: 8,
    }),
    prisma.documentLink.findMany({
      select: { targetId: true, targetType: true },
      where: { document: { clientTenantId: session.tenant.id } },
    }),
    prisma.actionItem.findMany({
      orderBy: [{ priority: "asc" }, { updatedAt: "desc" }],
      select: {
        assignedRoleKey: true,
        blockedReason: true,
        dueDate: true,
        evidenceStatus: true,
        priority: true,
        status: true,
        title: true,
        updatedAt: true,
      },
      where: {
        clientTenantId: session.tenant.id,
        status: { in: [WorkflowStatus.AWAITING_INFO, WorkflowStatus.BLOCKED, WorkflowStatus.IN_REVIEW, WorkflowStatus.NEW] },
      },
      take: 6,
    }),
  ]);
  const documentsByTarget = new Map<string, number>();

  for (const link of documentLinks) {
    documentsByTarget.set(link.targetId, (documentsByTarget.get(link.targetId) ?? 0) + 1);
  }

  const familyPoints = familyMembers.map((member, index) => ({ id: member.id, point: pointFor(index, familyMembers.length, 12) }));
  const entityPoints = entities.map((entity, index) => ({ id: entity.id, point: pointFor(index, entities.length, 45) }));
  const assetPoints = assets.map((asset, index) => ({ id: asset.id, point: pointFor(index, assets.length, 72) }));
  const pointById = new Map<string, [number, number]>([
    ...familyPoints.map((item) => [item.id, item.point] as const),
    ...entityPoints.map((item) => [item.id, item.point] as const),
    ...assetPoints.map((item) => [item.id, item.point] as const),
  ]);
  const relationshipCounts = new Map<string, number>();

  for (const relationship of relationships) {
    relationshipCounts.set(relationship.subjectId, (relationshipCounts.get(relationship.subjectId) ?? 0) + 1);
    relationshipCounts.set(relationship.objectId, (relationshipCounts.get(relationship.objectId) ?? 0) + 1);
  }

  const familyNodes = familyMembers.flatMap<WealthMapNode>((member, index) => {
    const visibility = deriveClientContextVisibility(roleKey, member.sensitivity);

    if (!visibility.canRenderPayload) return [];

    const [x, y] = familyPoints[index].point;

    return [{
      detail: member.isPrincipal ? "Principal" : labelFromValue(member.relationshipType),
      documents: String(documentsByTarget.get(member.id) ?? 0),
      flags: member.isPrincipal ? ["Principal"] : [],
      id: member.id,
      label: member.displayName,
      relationships: String(relationshipCounts.get(member.id) ?? 0),
      status: labelFromValue(visibility.visibilityStatus),
      tone: visibility.payloadMode === "redacted" ? "restricted" : "purple",
      type: "Family member",
      value: "",
      x,
      y,
    }];
  });
  const entityNodes = entities.flatMap<WealthMapNode>((entity, index) => {
    const visibility = deriveClientContextVisibility(roleKey, entity.sensitivity);

    if (!visibility.canRenderPayload) return [];

    const documentCount = documentsByTarget.get(entity.id) ?? 0;
    const [x, y] = entityPoints[index].point;

    return [{
      detail: labelFromValue(entity.entityType),
      documents: String(documentCount),
      flags: [
        ...(entity.dataQualityScore !== null && entity.dataQualityScore < 80 ? ["Gap"] : []),
        ...(documentCount === 0 ? ["Gap"] : []),
      ],
      id: entity.id,
      label: entity.name,
      relationships: String(relationshipCounts.get(entity.id) ?? 0),
      status: labelFromValue(entity.status),
      tone: visibility.payloadMode === "redacted" ? "restricted" : nodeToneForEntity(entity),
      type: labelFromValue(entity.entityType),
      value: entity.jurisdiction ?? entity.riskRating ?? "",
      x,
      y,
    }];
  });
  const assetNodes = assets.flatMap<WealthMapNode>((asset, index) => {
    const visibility = deriveClientContextVisibility(roleKey, asset.sensitivity);

    if (!visibility.canRenderPayload) return [];

    const [x, y] = assetPoints[index].point;

    return [{
      detail: labelFromValue(asset.assetType),
      documents: String(documentsByTarget.get(asset.id) ?? 0),
      flags: asset.riskRating?.toLowerCase().includes("high") ? ["Gap"] : [],
      id: asset.id,
      label: asset.name,
      relationships: asset.entityId ? "1" : "0",
      status: labelFromValue(asset.status),
      tone: visibility.payloadMode === "redacted" ? "restricted" : nodeToneForAsset({ ...asset, assetType: String(asset.assetType) }),
      type: labelFromValue(asset.assetType),
      value: compactValueBand(asset.valueBand),
      x,
      y,
    }];
  });
  const nodes = [...familyNodes, ...entityNodes, ...assetNodes];
  const visibleNodeIds = new Set(nodes.map((node) => node.id));
  const relationshipConnections = relationships.flatMap<WealthMapConnection>((relationship) => {
    const from = pointById.get(relationship.subjectId);
    const to = pointById.get(relationship.objectId);

    if (!from || !to || !visibleNodeIds.has(relationship.subjectId) || !visibleNodeIds.has(relationship.objectId)) return [];

    return [{
      from,
      kind: connectionKind({
        readinessIssue: !relationship.sourceDocumentId || Number(relationship.confidence ?? 0) < 95,
        restricted: false,
      }),
      to,
    }];
  });
  const assetConnections = assets.flatMap<WealthMapConnection>((asset) => {
    if (!asset.entityId) return [];

    const from = pointById.get(asset.entityId);
    const to = pointById.get(asset.id);

    if (!from || !to || !visibleNodeIds.has(asset.entityId) || !visibleNodeIds.has(asset.id)) return [];

    return [{ from, kind: connectionKind({ readinessIssue: !asset.valueBand, restricted: asset.sensitivity === Sensitivity.RESTRICTED || asset.sensitivity === Sensitivity.HIGHLY_RESTRICTED }), to }];
  });
  const selectedNode = entityNodes[0] ?? nodes[0] ?? null;
  const alerts: WealthMapAlert[] = [
    ...actionItems.filter((item) => item.blockedReason).slice(0, 2).map((item) => ({
      action: "Review",
      detail: item.blockedReason ?? "Action is blocked",
      title: item.title,
      tone: "red" as const,
    })),
    ...entities.filter((entity) => entity.dataQualityScore !== null && entity.dataQualityScore < 80).slice(0, 2).map((entity) => ({
      action: "Open entity",
      detail: `Data quality ${entity.dataQualityScore}%`,
      title: entity.name,
      tone: "gold" as const,
    })),
    ...actionItems.filter((item) => !item.blockedReason).slice(0, 2).map((item) => ({
      action: item.dueDate ? isoDate(item.dueDate) : "Review",
      detail: `${labelFromValue(item.status)} / ${labelFromValue(item.evidenceStatus, "Evidence pending")}`,
      title: item.title,
      tone: "blue" as const,
    })),
  ].slice(0, 4);
  const decisions = actionItems.slice(0, 4).map((item) => ({
    due: item.dueDate ? `Due ${isoDate(item.dueDate)}` : "No due date",
    owner: labelFromValue(item.assignedRoleKey, "Ops").slice(0, 2).toUpperCase(),
    status: labelFromValue(item.status),
    title: item.title,
  }));
  const updatedCandidates = [
    tenant.updatedAt,
    ...familyMembers.map((member) => member.updatedAt),
    ...entities.map((entity) => entity.updatedAt),
    ...assets.map((asset) => asset.updatedAt),
    ...actionItems.map((item) => item.updatedAt),
  ];
  const updatedAt = new Date(Math.max(...updatedCandidates.map((value) => value.getTime())));

  return {
    alerts,
    connections: [...relationshipConnections, ...assetConnections],
    decisions,
    meta: {
      sourceTruth: "wealth_map_db_readmodel",
      totalActionItems: actionItems.length,
      totalAssets: assets.length,
      totalDocuments: documentLinks.length,
      totalEntities: entities.length,
      totalFamilyMembers: familyMembers.length,
      totalRelationships: relationships.length,
      updatedAt: isoDate(updatedAt),
    },
    nodes,
    selectedNode,
    sourceTruth: "wealth_map_db_readmodel",
    workspace: {
      household: tenant.displayName,
      jurisdiction: tenant.jurisdiction ?? session.tenant.jurisdiction,
      lastUpdated: isoDate(updatedAt),
      relationshipTier: tenant.relationshipTier ?? "Standard",
      riskRating: tenant.riskRating ?? session.tenant.riskRating,
    },
  };
}
