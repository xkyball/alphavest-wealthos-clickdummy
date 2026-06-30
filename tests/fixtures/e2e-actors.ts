import { resolveActorContext } from "../../lib/control-layer/actor-context";
import {
  actorPlatformTenantId,
  requireActorSession,
  type ActorRoleKey,
  type ActorTenantSlug,
} from "../../lib/actor-session";

export type E2EActorFixture = {
  clientTenantId: string;
  label: string;
  platformTenantId: string;
  roleKey: ActorRoleKey;
  tenantSlug: ActorTenantSlug;
  userId: string;
};

function actorFixture(roleKey: ActorRoleKey, tenantSlug: ActorTenantSlug, label: string): E2EActorFixture {
  const session = requireActorSession({ roleKey, tenantSlug });

  return {
    clientTenantId: session.tenant.id,
    label,
    platformTenantId: actorPlatformTenantId,
    roleKey,
    tenantSlug,
    userId: session.actor.id,
  };
}

export const e2eActorFixtures = {
  bennettPrincipal: actorFixture("principal", "bennett", "CJ-001 invited Bennett principal"),
  morganAnalyst: actorFixture("analyst", "morgan", "CJ-006 scoped Morgan analyst"),
  morganCfo: actorFixture("family_cfo", "morgan", "CJ-004 Morgan client upload actor"),
  morganCompliance: actorFixture("compliance_officer", "morgan", "CJ-010 Morgan compliance officer"),
  morganExternalAdvisor: actorFixture("external_advisor", "morgan", "Scoped Morgan external advisor"),
  morganPrincipal: actorFixture("principal", "morgan", "CJ-011 Morgan principal"),
  morganSeniorAdvisor: actorFixture("senior_wealth_advisor", "morgan", "CJ-009 Morgan senior advisor"),
  platformAdmin: actorFixture("admin", "morgan", "CJ-002 platform admin tenant setup actor"),
  securityAdmin: actorFixture("security_officer", "morgan", "CJ-012 security admin governance actor"),
  summitPrincipal: actorFixture("principal", "summit", "Negative wrong-tenant Summit principal"),
} as const;

export const invalidActorContext = resolveActorContext({
  roleKey: "unknown_demo_role",
  tenantSlug: "morgan",
});

