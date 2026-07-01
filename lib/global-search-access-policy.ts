import { ObjectType, type Prisma } from "@prisma/client";

import { actorRoles, actorTenants, type ActorRoleKey, type ActorSession } from "@/lib/actor-session";
import { deriveClientContextVisibility } from "@/lib/client-context-visibility";

export type SearchVisibilityScope = "CLIENT_SAFE" | "PLATFORM_INTERNAL" | "TENANT_INTERNAL";

export type GlobalSearchAccessPolicy = {
  actorId: string;
  objectTypes: ObjectType[];
  roleKey: ActorRoleKey;
  tenantIds: string[];
  tenantSlug: string;
  visibilityScopes: SearchVisibilityScope[];
};

export type SearchAccessMetadata = {
  allowedActorIds: string[];
  allowedRoleKeys: ActorRoleKey[];
  objectGrantRequiredRoleKeys: ActorRoleKey[];
  tenantId: string | null;
  version: "search_acl_v1";
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
const objectGrantRequiredRoleKeys = new Set<ActorRoleKey>(["external_advisor", "next_gen", "trustee"]);

function roleFor(roleKey: ActorRoleKey) {
  const role = actorRoles.find((candidate) => candidate.key === roleKey);

  if (!role) {
    throw new Error(`Unknown actor role: ${roleKey}`);
  }

  return role;
}

export function visibilityScopesForSearchRole(roleKey: ActorRoleKey): SearchVisibilityScope[] {
  const role = roleFor(roleKey);

  if (role.scope === "PLATFORM") return ["CLIENT_SAFE", "TENANT_INTERNAL", "PLATFORM_INTERNAL"];
  if (role.internal || roleKey === "external_advisor") return ["CLIENT_SAFE", "TENANT_INTERNAL"];

  return ["CLIENT_SAFE"];
}

export function visibilityScopesForSearchSession(session: ActorSession): SearchVisibilityScope[] {
  return visibilityScopesForSearchRole(session.role.key);
}

export function tenantIdsForSearchSession(session: ActorSession) {
  if (session.role.scope === "PLATFORM") {
    return actorTenants.map((tenant) => tenant.id);
  }

  return [session.tenant.id];
}

export function objectTypesForSearchRole(roleKey: ActorRoleKey): ObjectType[] {
  const role = roleFor(roleKey);

  if (role.scope === "PLATFORM") return platformObjectTypes;
  if (role.internal) return [...tenantInternalObjectTypes];
  if (roleKey === "external_advisor") return [...externalAdvisorObjectTypes];

  return [...clientWorkspaceObjectTypes];
}

export function objectTypesForSearchSession(session: ActorSession): ObjectType[] {
  return objectTypesForSearchRole(session.role.key);
}

export function searchRoleRequiresObjectGrant(roleKey: ActorRoleKey) {
  return objectGrantRequiredRoleKeys.has(roleKey);
}

export function allowedSearchRoleKeysForIndexedObject(input: {
  objectType: ObjectType;
  sensitivity?: string | null;
  visibilityScope: SearchVisibilityScope;
}): ActorRoleKey[] {
  return actorRoles
    .filter((role) => visibilityScopesForSearchRole(role.key).includes(input.visibilityScope))
    .filter((role) => objectTypesForSearchRole(role.key).includes(input.objectType))
    .filter((role) => {
      if (!input.sensitivity) return true;

      return deriveClientContextVisibility(role.key, input.sensitivity).canRenderPayload;
    })
    .map((role) => role.key);
}

export function buildSearchAccessMetadata(input: {
  allowedActorIds?: string[];
  allowedRoleKeys?: ActorRoleKey[];
  clientTenantId: string | null;
  objectType: ObjectType;
  visibilityScope: SearchVisibilityScope;
}): SearchAccessMetadata {
  const baseAllowedRoleKeys = allowedSearchRoleKeysForIndexedObject({
    objectType: input.objectType,
    visibilityScope: input.visibilityScope,
  });
  const allowedRoleKeys = [...new Set(input.allowedRoleKeys ?? baseAllowedRoleKeys)]
    .filter((roleKey) => baseAllowedRoleKeys.includes(roleKey))
    .sort();
  const objectGrantRequiredRoleKeys = allowedRoleKeys.filter(searchRoleRequiresObjectGrant);

  return {
    allowedActorIds: [...new Set(input.allowedActorIds ?? [])].sort(),
    allowedRoleKeys,
    objectGrantRequiredRoleKeys,
    tenantId: input.clientTenantId,
    version: "search_acl_v1",
  };
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
