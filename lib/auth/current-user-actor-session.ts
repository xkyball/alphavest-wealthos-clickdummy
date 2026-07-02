import {
  actorTenants,
  requireActorSession,
  type ActorRoleKey,
  type ActorSession,
  type ActorTenantSlug,
} from "@/lib/actor-session";
import { resolveCurrentUserFromRequest, type CurrentUserContext } from "@/lib/auth/current-user";
import type { PrismaClient } from "@prisma/client";

export class CurrentUserActorSessionError extends Error {
  constructor(message: string, readonly reasonCode: string, readonly status = 401) {
    super(message);
  }
}

function tenantSlugForId(tenantId?: string | null): ActorTenantSlug | undefined {
  return actorTenants.find((tenant) => tenant.id === tenantId)?.slug;
}

function primaryTenantRole(currentUser: CurrentUserContext) {
  const membership = currentUser.memberships.find((candidate) => candidate.tenant?.id && candidate.role.key);

  return {
    roleKey: currentUser.role?.key ?? membership?.role.key,
    tenantSlug: tenantSlugForId(currentUser.tenant?.id) ?? tenantSlugForId(membership?.tenant?.id),
  };
}

function initialsForDisplayName(displayName: string) {
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || "AV";
}

export async function resolveCurrentUserActorSession(
  prisma: PrismaClient,
  request: Request,
): Promise<{ currentUser: CurrentUserContext; session: ActorSession }> {
  const currentUser = await resolveCurrentUserFromRequest(prisma, request).catch(() => {
    throw new CurrentUserActorSessionError("Current user is not authenticated.", "PERMISSION_DENIED", 401);
  });
  const { roleKey, tenantSlug } = primaryTenantRole(currentUser);

  if (!roleKey || !tenantSlug) {
    throw new CurrentUserActorSessionError(
      "Current user does not have a tenant-scoped role for this operation.",
      "TENANT_SCOPED_ROLE_REQUIRED",
      403,
    );
  }
  const mappedSession = requireActorSession({
    roleKey: roleKey as ActorRoleKey,
    tenantSlug,
  });

  return {
    currentUser,
    session: {
      ...mappedSession,
      actor: {
        ...mappedSession.actor,
        displayName: currentUser.actor.displayName,
        email: currentUser.actor.email,
        id: currentUser.actor.id,
        initials: initialsForDisplayName(currentUser.actor.displayName),
        roleKey: roleKey as ActorRoleKey,
      },
    },
  };
}
