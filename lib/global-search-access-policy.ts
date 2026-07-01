import { ObjectType, type Prisma } from "@prisma/client";

import { actorTenants, type ActorRoleKey, type ActorSession } from "@/lib/actor-session";

export type SearchVisibilityScope = "CLIENT_SAFE" | "PLATFORM_INTERNAL" | "TENANT_INTERNAL";

export type GlobalSearchAccessPolicy = {
  actorId: string;
  objectTypes: ObjectType[];
  roleKey: ActorRoleKey;
  tenantIds: string[];
  tenantSlug: string;
  visibilityScopes: SearchVisibilityScope[];
};

const clientWorkspaceObjectTypes = [
  ObjectType.TENANT,
  ObjectType.USER,
  ObjectType.FAMILY_MEMBER,
  ObjectType.RELATIONSHIP,
  ObjectType.ENTITY,
  ObjectType.ASSET,
  ObjectType.DOCUMENT,
  ObjectType.TRIGGER,
  ObjectType.ACTION_ITEM,
  ObjectType.RECOMMENDATION,
  ObjectType.DECISION,
  ObjectType.EVIDENCE_RECORD,
] as const;

const externalAdvisorObjectTypes = [
  ObjectType.DOCUMENT,
  ObjectType.DECISION,
  ObjectType.EVIDENCE_RECORD,
] as const;

const tenantInternalObjectTypes = [
  ...clientWorkspaceObjectTypes,
  ObjectType.ENGAGEMENT,
  ObjectType.REVIEW_SCHEDULE,
  ObjectType.EXPORT_REQUEST,
  ObjectType.PROCESS,
  ObjectType.QUEUE_ITEM,
  ObjectType.DATA_QUALITY_ISSUE,
  ObjectType.ROLE,
  ObjectType.POLICY,
  ObjectType.AUDIT_EVENT,
] as const;

const platformObjectTypes = Object.values(ObjectType);

export function visibilityScopesForSearchSession(session: ActorSession): SearchVisibilityScope[] {
  if (session.role.scope === "PLATFORM") return ["CLIENT_SAFE", "TENANT_INTERNAL", "PLATFORM_INTERNAL"];
  if (session.role.internal) return ["CLIENT_SAFE", "TENANT_INTERNAL"];

  return ["CLIENT_SAFE"];
}

export function tenantIdsForSearchSession(session: ActorSession) {
  if (session.role.scope === "PLATFORM") {
    return actorTenants.map((tenant) => tenant.id);
  }

  return [session.tenant.id];
}

export function objectTypesForSearchSession(session: ActorSession): ObjectType[] {
  if (session.role.scope === "PLATFORM") return platformObjectTypes;
  if (session.role.internal) return [...tenantInternalObjectTypes];
  if (session.role.key === "external_advisor") return [...externalAdvisorObjectTypes];

  return [...clientWorkspaceObjectTypes];
}

export function resolveGlobalSearchAccessPolicy(session: ActorSession): GlobalSearchAccessPolicy {
  return {
    actorId: session.actor.id,
    objectTypes: objectTypesForSearchSession(session),
    roleKey: session.role.key,
    tenantIds: tenantIdsForSearchSession(session),
    tenantSlug: session.tenant.slug,
    visibilityScopes: visibilityScopesForSearchSession(session),
  };
}

export function assertSearchPolicyCanReachRow(
  policy: GlobalSearchAccessPolicy,
  row: Pick<Prisma.SearchDocumentCreateManyInput, "clientTenantId" | "objectType" | "visibilityScope">,
) {
  return (
    typeof row.clientTenantId === "string" &&
    policy.objectTypes.includes(row.objectType) &&
    policy.tenantIds.includes(row.clientTenantId) &&
    policy.visibilityScopes.includes(row.visibilityScope as SearchVisibilityScope)
  );
}
