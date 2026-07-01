import { AuditResult, ObjectType, WorkflowStatus, type PrismaClient } from "@prisma/client";

import { requireActorSession, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";

export type ClientHomeWorkItem = {
  href: string;
  id: string;
  label: string;
  meta: string;
  status: string;
};

export type ClientHomeActivityItem = {
  href: string;
  id: string;
  label: string;
  meta: string;
  status: string;
};

export type ClientHomeWorkReadModel = {
  activities: ClientHomeActivityItem[];
  noClientRelease: true;
  openWork: ClientHomeWorkItem[];
  sourceTruth: "workflow_db_readmodel";
  tenantSlug: ActorTenantSlug;
};

const openWorkStatuses = [WorkflowStatus.NEW, WorkflowStatus.IN_REVIEW, WorkflowStatus.AWAITING_INFO, WorkflowStatus.BLOCKED] as const;
const clientSafeActivityTargets = [
  ObjectType.DECISION,
  ObjectType.DOCUMENT,
  ObjectType.ENTITY,
  ObjectType.EVIDENCE_RECORD,
  ObjectType.FAMILY_MEMBER,
  ObjectType.RELATIONSHIP,
] as const;

function labelFromEnum(value: string | null | undefined) {
  return (value ?? "recorded")
    .toLowerCase()
    .split(/[._-]+|_/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function hrefForObject(type: ObjectType) {
  if (type === ObjectType.DOCUMENT || type === ObjectType.EVIDENCE_RECORD) return "/documents/upload";
  if (type === ObjectType.ENTITY) return "/entities";
  if (type === ObjectType.FAMILY_MEMBER) return "/client/family-members";
  if (type === ObjectType.RELATIONSHIP) return "/relationships";
  if (type === ObjectType.DECISION || type === ObjectType.RECOMMENDATION) return "/decisions";

  return "/client/home";
}

function hrefForActionItem(input: { evidenceStatus: string | null; title: string; triggerId: string | null }) {
  const title = input.title.toLowerCase();

  if (input.evidenceStatus || title.includes("evidence") || title.includes("document") || title.includes("certificate")) {
    return "/documents/upload";
  }

  if (title.includes("relationship")) return "/relationships";
  if (title.includes("entity") || title.includes("trust") || title.includes("holding")) return "/entities";
  if (title.includes("profile") || title.includes("family")) return "/client/family-members";
  if (input.triggerId) return "/advisory";

  return "/client/home";
}

export async function getClientHomeWorkReadModel(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
): Promise<ClientHomeWorkReadModel> {
  const session = requireActorSession({ roleKey, tenantSlug });
  const clientVisibleFilter = session.role.internal ? {} : { clientVisible: true };

  const [openWork, activities] = await Promise.all([
    prisma.actionItem.findMany({
      orderBy: [{ dueDate: "asc" }, { updatedAt: "desc" }],
      select: {
        assignedRoleKey: true,
        blockedReason: true,
        clientVisible: true,
        description: true,
        evidenceStatus: true,
        id: true,
        priority: true,
        status: true,
        title: true,
        triggerId: true,
      },
      take: 3,
      where: {
        clientTenantId: session.tenant.id,
        status: { in: [...openWorkStatuses] },
        ...clientVisibleFilter,
      },
    }),
    prisma.auditEvent.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        eventType: true,
        id: true,
        nextState: true,
        result: true,
        targetType: true,
      },
      take: 3,
      where: {
        clientTenantId: session.tenant.id,
        result: { in: [AuditResult.SUCCESS, AuditResult.PENDING, AuditResult.BLOCKED] },
        targetType: { in: [...clientSafeActivityTargets] },
      },
    }),
  ]);

  return {
    activities: activities.map((event) => ({
      href: hrefForObject(event.targetType),
      id: event.id,
      label: `${labelFromEnum(event.targetType)} updated`,
      meta: labelFromEnum(event.eventType),
      status: labelFromEnum(event.nextState ?? event.result),
    })),
    noClientRelease: true,
    openWork: openWork.map((item) => ({
      href: hrefForActionItem(item),
      id: item.id,
      label: item.title,
      meta: item.description ?? (item.assignedRoleKey ? `${labelFromEnum(item.assignedRoleKey)} task` : `${labelFromEnum(item.priority)} priority`),
      status: labelFromEnum(item.blockedReason ? "blocked" : item.status),
    })),
    sourceTruth: "workflow_db_readmodel",
    tenantSlug,
  };
}
