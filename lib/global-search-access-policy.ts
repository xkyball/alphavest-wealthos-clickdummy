import type { Prisma } from "@prisma/client";

import { actorTenants, type ActorRoleKey, type ActorSession } from "@/lib/actor-session";

export type SearchVisibilityScope = "CLIENT_SAFE" | "PLATFORM_INTERNAL" | "TENANT_INTERNAL";

export type GlobalSearchAccessPolicy = {
  actorId: string;
  roleKey: ActorRoleKey;
  tenantIds: string[];
  tenantSlug: string;
  visibilityScopes: SearchVisibilityScope[];
};

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

export function resolveGlobalSearchAccessPolicy(session: ActorSession): GlobalSearchAccessPolicy {
  return {
    actorId: session.actor.id,
    roleKey: session.role.key,
    tenantIds: tenantIdsForSearchSession(session),
    tenantSlug: session.tenant.slug,
    visibilityScopes: visibilityScopesForSearchSession(session),
  };
}

export function assertSearchPolicyCanReachRow(
  policy: GlobalSearchAccessPolicy,
  row: Pick<Prisma.SearchDocumentCreateManyInput, "clientTenantId" | "visibilityScope">,
) {
  return (
    typeof row.clientTenantId === "string" &&
    policy.tenantIds.includes(row.clientTenantId) &&
    policy.visibilityScopes.includes(row.visibilityScope as SearchVisibilityScope)
  );
}
