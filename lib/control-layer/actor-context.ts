import {
  demoPlatformTenantId,
  tryCreateDemoSession,
  type DemoRoleKey,
  type DemoSession,
  type DemoSessionIssue,
  type DemoTenantSlug,
} from "@/lib/demo-session";
import type { UUID } from "@/lib/domain-types";

export type ActorContext = {
  actorUserId: UUID;
  clientTenantId: UUID;
  demoMode: true;
  platformTenantId: UUID;
  roleKey: DemoRoleKey;
  session: DemoSession;
  tenantSlug: DemoTenantSlug;
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
      demoMode: true,
      platformTenantId: demoPlatformTenantId,
      roleKey: resolution.session.role.key,
      session: resolution.session,
      tenantSlug: resolution.session.tenant.slug,
    },
    reasonCode: "WCL_ACTOR_CONTEXT_RESOLVED",
  };
}

export function requireActorContext(input: {
  roleKey?: string | null;
  tenantSlug?: string | null;
}): ActorContext {
  const result = resolveActorContext(input);

  if (!result.allowed) {
    throw new Error(result.reason);
  }

  return result.actorContext;
}
