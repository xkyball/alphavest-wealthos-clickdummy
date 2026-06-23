import {
  demoPlatformTenantId,
  tryCreateDemoSession,
  type DemoRoleKey,
  type DemoSession,
  type DemoSessionIssue,
  type DemoTenantSlug,
} from "@/lib/demo-session";
import type { RoleScope, UUID } from "@/lib/domain-types";
import { stableId } from "@/lib/stable-id";

export type ActorContextScopes = {
  roleScope: RoleScope;
  tenant: {
    clientTenantId: UUID;
    platformTenantId: UUID;
    tenantSlug: DemoTenantSlug;
  };
};

export type ActorContext = {
  actorUserId: UUID;
  clientTenantId: UUID;
  correlationId: string;
  demoMode: true;
  pilotMode: "controlled_paid_pilot_candidate";
  platformTenantId: UUID;
  roleKey: DemoRoleKey;
  roleKeys: DemoRoleKey[];
  scopes: ActorContextScopes;
  session: DemoSession;
  tenantSlug: DemoTenantSlug;
  userId: UUID;
};

export type ActorDeniedResult = {
  allowed: false;
  auditRequired: true;
  issues: DemoSessionIssue[];
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
  tenantSlug?: string | null;
}): ActorContextResult {
  const resolution = tryCreateDemoSession(input);

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
      platformTenantId: demoPlatformTenantId,
      roleKey: resolution.session.role.key,
      roleKeys: [resolution.session.role.key],
      scopes: {
        roleScope: resolution.session.role.scope,
        tenant: {
          clientTenantId: resolution.session.tenant.id,
          platformTenantId: demoPlatformTenantId,
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
  tenantSlug?: string | null;
}): ActorContext {
  const result = resolveActorContext(input);

  if (!result.allowed) {
    throw new Error(result.reason);
  }

  return result.actorContext;
}
