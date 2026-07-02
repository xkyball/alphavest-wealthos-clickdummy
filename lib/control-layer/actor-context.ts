import {
  actorPlatformTenantId,
  tryCreateActorSession,
  type ActorRoleKey,
  type ActorSession,
  type ActorSessionIssue,
  type ActorTenantSlug,
} from "@/lib/actor-session";
import type { RoleScope, UUID } from "@/lib/domain-types";
import { stableId } from "@/lib/stable-id";

export type ActorContextScopes = {
  roleScope: RoleScope;
  tenant: {
    clientTenantId: UUID;
    platformTenantId: UUID;
    tenantSlug: ActorTenantSlug;
  };
};

export type ActorContext = {
  actorUserId: UUID;
  clientTenantId: UUID;
  correlationId: string;
  demoMode: true;
  pilotMode: "controlled_paid_pilot_candidate";
  platformTenantId: UUID;
  roleKey: ActorRoleKey;
  roleKeys: ActorRoleKey[];
  scopes: ActorContextScopes;
  session: ActorSession;
  tenantSlug: ActorTenantSlug;
  userId: UUID;
};

export type ActorDeniedResult = {
  allowed: false;
  auditRequired: true;
  issues: ActorSessionIssue[];
  reason: string;
  reasonCode: "WCL_ACTOR_CONTEXT_DENIED";
};

export type ActorContextResult =
  | {
      allowed: true;
      actorContext: ActorContext;
      reasonCode: "WCL_ACTOR_CONTEXT_RESOLVED";
    }
  | ActorDeniedResult;

export function resolveActorContext(input: {
  correlationId?: string | null;
  roleKey?: string | null;
  tenantId?: string | null;
  tenantName?: string | null;
  tenantSlug?: string | null;
}): ActorContextResult {
  const resolution = tryCreateActorSession(input);

  if (!resolution.ok) {
    return {
      allowed: false,
      auditRequired: true,
      issues: resolution.issues,
      reason: `Actor context denied: ${resolution.issues.join(", ")}`,
      reasonCode: "WCL_ACTOR_CONTEXT_DENIED",
    };
  }

  return {
    allowed: true,
    actorContext: {
      actorUserId: resolution.session.actor.id,
      clientTenantId: resolution.session.tenant.id,
      correlationId:
        input.correlationId?.trim() ||
        `wcl-actor-${stableId(
          `${resolution.session.actor.id}:${resolution.session.tenant.id}:${resolution.session.role.key}`,
        )}`,
      demoMode: true,
      pilotMode: "controlled_paid_pilot_candidate",
      platformTenantId: actorPlatformTenantId,
      roleKey: resolution.session.role.key,
      roleKeys: [resolution.session.role.key],
      scopes: {
        roleScope: resolution.session.role.scope,
        tenant: {
          clientTenantId: resolution.session.tenant.id,
          platformTenantId: actorPlatformTenantId,
          tenantSlug: resolution.session.tenant.slug,
        },
      },
      session: resolution.session,
      tenantSlug: resolution.session.tenant.slug,
      userId: resolution.session.actor.id,
    },
    reasonCode: "WCL_ACTOR_CONTEXT_RESOLVED",
  };
}

export function requireActorContext(input: {
  correlationId?: string | null;
  roleKey?: string | null;
  tenantId?: string | null;
  tenantName?: string | null;
  tenantSlug?: string | null;
}): ActorContext {
  const result = resolveActorContext(input);

  if (!result.allowed) {
    throw new Error(result.reason);
  }

  return result.actorContext;
}
