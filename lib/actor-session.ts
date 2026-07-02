import type { RoleScope, TenantStatus, UUID } from "@/lib/domain-types";
import { stableId } from "@/lib/stable-id";

export type ActorRoleKey =
  | "principal"
  | "family_cfo"
  | "trustee"
  | "next_gen"
  | "external_advisor"
  | "analyst"
  | "senior_wealth_advisor"
  | "compliance_officer"
  | "client_success"
  | "admin"
  | "security_officer";

export type SeedActorTenantSlug = "bennett" | "morgan" | "northbridge" | "summit";
export type ActorTenantSlug = string;

export type ActorKey =
  | "admin"
  | "security"
  | "compliance"
  | "advisor"
  | "analyst"
  | "success"
  | "system"
  | `${ActorTenantSlug}:principal`
  | `${ActorTenantSlug}:cfo`
  | `${ActorTenantSlug}:trustee`
  | `${ActorTenantSlug}:nextgen`
  | `${ActorTenantSlug}:external`;

export type ActorRole = {
  key: ActorRoleKey;
  label: string;
  scope: RoleScope;
  description: string;
  internal: boolean;
};

export type ActorTenant = {
  id: UUID;
  slug: ActorTenantSlug;
  displayName: string;
  jurisdiction: string;
  status: TenantStatus;
  riskRating: string;
};

export type Actor = {
  id: UUID;
  key: ActorKey;
  displayName: string;
  initials: string;
  email: string;
  roleKey: ActorRoleKey;
  tenantSlug?: ActorTenantSlug;
  serviceAccount?: boolean;
};

export type ActorSession = {
  actor: Actor;
  role: ActorRole;
  tenantMembership: ActorTenantMembership;
  tenant: ActorTenant;
  sessionLabel: string;
  mode: "seed";
};

export type ActorTenantMembership = {
  actorId: UUID;
  roleKey: ActorRoleKey;
  scope: RoleScope;
  tenantId: UUID;
  tenantSlug: ActorTenantSlug;
};

export type ActorSessionDraft = {
  roleKey?: string | null;
  tenantId?: string | null;
  tenantName?: string | null;
  tenantSlug?: string | null;
};

export type ActorSessionIssue =
  | "valid_role_key_required"
  | "valid_tenant_slug_required"
  | "mapped_actor_required"
  | "actor_role_context_mismatch"
  | "actor_tenant_membership_required";

export type ActorSessionResolution =
  | {
      ok: true;
      session: ActorSession;
    }
  | {
      issues: ActorSessionIssue[];
      ok: false;
    };

export const actorPlatformTenantId = "96705b67-40b2-5fb8-aa69-a3f2c106025e";

export const actorRoles: ActorRole[] = [
  {
    key: "principal",
    label: "Principal",
    scope: "TENANT",
    description: "Client principal reviewing released decisions and evidence.",
    internal: false,
  },
  {
    key: "family_cfo",
    label: "Family CFO",
    scope: "TENANT",
    description: "Client-side finance lead for documents and structure data.",
    internal: false,
  },
  {
    key: "trustee",
    label: "Trustee",
    scope: "ENTITY",
    description: "Scoped governance participant for trust/entity approvals.",
    internal: false,
  },
  {
    key: "next_gen",
    label: "Next Gen",
    scope: "TENANT",
    description: "Family member with limited client-visible access.",
    internal: false,
  },
  {
    key: "external_advisor",
    label: "External Advisor",
    scope: "DOCUMENT",
    description: "Scoped external collaborator for source documents.",
    internal: false,
  },
  {
    key: "analyst",
    label: "Analyst",
    scope: "TENANT",
    description: "Internal analyst reviewing signals, documents and evidence.",
    internal: true,
  },
  {
    key: "senior_wealth_advisor",
    label: "Senior Wealth Advisor",
    scope: "TENANT",
    description: "Human advisor approval role. Approval alone does not release to client.",
    internal: true,
  },
  {
    key: "compliance_officer",
    label: "Compliance Officer",
    scope: "TENANT",
    description: "Compliance release/block role for advice-like content.",
    internal: true,
  },
  {
    key: "client_success",
    label: "Client Success",
    scope: "TENANT",
    description: "Tenant onboarding and data follow-up role.",
    internal: true,
  },
  {
    key: "admin",
    label: "Admin",
    scope: "PLATFORM",
    description: "Platform setup and tenant administration role.",
    internal: true,
  },
  {
    key: "security_officer",
    label: "Security Officer",
    scope: "PLATFORM",
    description: "Security controls and second-confirmation role.",
    internal: true,
  },
];

export const actorTenants: ActorTenant[] = [
  {
    id: "05f1998b-343e-52b4-9888-176f03ed95ae",
    slug: "bennett",
    displayName: "Bennett Family Office",
    jurisdiction: "South Africa",
    status: "ACTIVE",
    riskRating: "Moderate",
  },
  {
    id: "7870ddd4-4587-58c6-a30b-ed6710109c17",
    slug: "morgan",
    displayName: "Morgan Family Office",
    jurisdiction: "United Kingdom",
    status: "ONBOARDING",
    riskRating: "Medium",
  },
  {
    id: "c7fc6b48-0f0c-5a7d-8a12-05e0f0bbc069",
    slug: "northbridge",
    displayName: "Northbridge Family Office",
    jurisdiction: "Switzerland",
    status: "ACTIVE",
    riskRating: "High",
  },
  {
    id: "68c2dd2e-2322-526f-8a48-2fdadf996c40",
    slug: "summit",
    displayName: "Summit Ridge Capital",
    jurisdiction: "United States",
    status: "ACTIVE",
    riskRating: "Medium",
  },
];

const internalActors: Actor[] = [
  {
    id: "417ef50a-9410-5cf8-89a9-f6246996904d",
    key: "admin",
    displayName: "Ava Naidoo",
    initials: "AN",
    email: "ava.admin@alphavest.demo",
    roleKey: "admin",
  },
  {
    id: "4dceb5d8-cb19-5c66-b33f-91457b4c1916",
    key: "security",
    displayName: "Sam Jacobs",
    initials: "SJ",
    email: "sam.security@alphavest.demo",
    roleKey: "security_officer",
  },
  {
    id: "185923a2-c1c3-550f-b064-f6cafd6d79e1",
    key: "compliance",
    displayName: "Naledi Mokoena",
    initials: "NM",
    email: "naledi.compliance@alphavest.demo",
    roleKey: "compliance_officer",
  },
  {
    id: "958214f4-894b-5ac5-a25d-9248fe94695d",
    key: "advisor",
    displayName: "Thabo Khumalo",
    initials: "TK",
    email: "thabo.advisor@alphavest.demo",
    roleKey: "senior_wealth_advisor",
  },
  {
    id: "e5b9b712-e161-535f-a691-0720cb18ec2e",
    key: "analyst",
    displayName: "Mira Patel",
    initials: "MP",
    email: "mira.analyst@alphavest.demo",
    roleKey: "analyst",
  },
  {
    id: "d667590a-4128-5531-b519-552703da2b93",
    key: "success",
    displayName: "Lina Botha",
    initials: "LB",
    email: "lina.success@alphavest.demo",
    roleKey: "client_success",
  },
];

const clientRoleActorKey: Record<Extract<ActorRoleKey, "principal" | "family_cfo" | "trustee" | "next_gen" | "external_advisor">, string> = {
  principal: "principal",
  family_cfo: "cfo",
  trustee: "trustee",
  next_gen: "nextgen",
  external_advisor: "external",
};

const roleToInternalActorKey: Partial<Record<ActorRoleKey, ActorKey>> = {
  analyst: "analyst",
  senior_wealth_advisor: "advisor",
  compliance_officer: "compliance",
  client_success: "success",
  admin: "admin",
  security_officer: "security",
};

const clientRoleLabels: Record<string, string> = {
  principal: "Principal",
  cfo: "Family CFO",
  trustee: "Trustee",
  nextgen: "Next Gen",
  external: "External Advisor",
};

const clientRoleKeys: Record<string, ActorRoleKey> = {
  principal: "principal",
  cfo: "family_cfo",
  trustee: "trustee",
  nextgen: "next_gen",
  external: "external_advisor",
};

const seededClientActorIds: Record<SeedActorTenantSlug, Record<string, UUID>> = {
  bennett: {
    principal: "b68aa544-4075-5d1e-be6e-bb07dc80e683",
    cfo: "a5fe72ad-60f1-5653-997f-68f5c25ce873",
    trustee: "af8e421c-cdf1-52e8-9118-4d34c8ca9f86",
    nextgen: "e5b0c4ec-f731-5070-88dd-71212becf207",
    external: "6ab56c6f-c50a-54ff-a83c-ccf1b56783bd",
  },
  morgan: {
    principal: "0b3d8780-fb9f-5a93-bf10-a79e91169811",
    cfo: "c20fdf88-3785-5077-8d9c-0335a3647842",
    trustee: "ae846561-f3e3-546e-a1e3-33487134a9a6",
    nextgen: "db376f2e-5ac9-5dac-8756-1e17bfeebc62",
    external: "1dc36869-8636-566b-b1a4-2c76c0252ea2",
  },
  northbridge: {
    principal: "9c0b3fe6-ccf1-5b79-a0c7-65dc17e4a579",
    cfo: "16f6fe0a-f09d-54a1-a182-04e7cc02f57a",
    trustee: "b16bbd77-cc9a-56f9-9d4f-b0331f091d5f",
    nextgen: "e3a814e9-2ab0-5e60-8ee4-160a4f991ff2",
    external: "3c0221e5-4288-5484-8d95-442fe6dca6bd",
  },
  summit: {
    principal: "b68cd159-6480-558c-932d-7addebed2821",
    cfo: "8c3cde1d-db3d-5dd8-a1ae-954d856a1455",
    trustee: "90bb890f-eb26-5dc3-9717-affea05b4d3f",
    nextgen: "0ed7e2f0-fc41-546c-9b97-041a38a68a9a",
    external: "9ee6d083-2a4a-52d9-9d5b-dda97ad6699b",
  },
};

const clientActors: Actor[] = actorTenants.flatMap((tenant) =>
  Object.entries(clientRoleLabels).map(([personKey, personLabel]) => {
    const displayName = `${tenant.displayName.replace(" Family Office", "").replace(" Capital", "")} ${personLabel}`;
    const initials = personLabel
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2);

    return {
      id: seededClientActorIds[tenant.slug as SeedActorTenantSlug][personKey],
      key: `${tenant.slug}:${personKey}` as ActorKey,
      displayName,
      initials,
      email: `${personKey}.${tenant.slug}@example.demo`,
      roleKey: clientRoleKeys[personKey],
      tenantSlug: tenant.slug,
    };
  })
);

export const actors: Actor[] = [...internalActors, ...clientActors];

export const defaultActorSession = createActorSession({
  roleKey: "compliance_officer",
  tenantSlug: "bennett",
});

export function currentActor(session: ActorSession = defaultActorSession) {
  return session.actor;
}

export function currentTenant(session: ActorSession = defaultActorSession) {
  return session.tenant;
}

export function createActorSession(draft: ActorSessionDraft): ActorSession {
  const tenant = resolveTenantForDraft(draft) ?? actorTenants[0];
  const role = resolveRole(draft.roleKey);
  const actor = resolveActorForRole(role.key, tenant.slug);
  const tenantMembership =
    resolveActorTenantMembership(actor, role, tenant) ??
    ({
      actorId: actor.id,
      roleKey: role.key,
      scope: role.scope,
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
    } satisfies ActorTenantMembership);

  return {
    actor,
    role,
    tenantMembership,
    tenant,
    sessionLabel: "Local session",
    mode: "seed",
  };
}

export function isActorTenantSlug(value?: string | null): value is ActorTenantSlug {
  return actorTenants.some((tenant) => tenant.slug === value);
}

export function isActorRoleKey(value?: string | null): value is ActorRoleKey {
  return actorRoles.some((role) => role.key === value);
}

export function tryCreateActorSession(draft: ActorSessionDraft): ActorSessionResolution {
  const issues: ActorSessionIssue[] = [];

  if (!isActorRoleKey(draft.roleKey)) {
    issues.push("valid_role_key_required");
  }

  const tenant = resolveTenantForDraft(draft);
  if (!tenant) {
    issues.push("valid_tenant_slug_required");
  }

  if (issues.length > 0) {
    return { issues, ok: false };
  }

  const role = actorRoles.find((candidate) => candidate.key === draft.roleKey);
  if (!tenant || !role) {
    return { issues: ["mapped_actor_required"], ok: false };
  }

  const actor = resolveActorForRole(role.key, tenant.slug);
  if (!actor) {
    return { issues: ["mapped_actor_required"], ok: false };
  }

  const tenantMembership = resolveActorTenantMembership(actor, role, tenant);
  if (!tenantMembership) {
    return { issues: ["actor_tenant_membership_required"], ok: false };
  }

  return {
    ok: true,
    session: {
      actor,
      role,
      tenantMembership,
      tenant,
      sessionLabel: "Local session",
      mode: "seed",
    },
  };
}

export function requireActorSession(draft: ActorSessionDraft): ActorSession {
  const resolution = tryCreateActorSession(draft);

  if (!resolution.ok) {
    throw new Error(`Session context is not mapped: ${resolution.issues.join(", ")}`);
  }

  return resolution.session;
}

export function resolveTenant(tenantSlug?: string | null) {
  return actorTenants.find((tenant) => tenant.slug === tenantSlug) ?? actorTenants[0];
}

export function actorTenantSlugFromDisplayName(displayName?: string | null) {
  const normalized = (displayName ?? "")
    .trim()
    .replace(/\s+(family office|capital)$/i, "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return normalized || "tenant";
}

export function actorTenantSlugForClientTenant(input: { displayName?: string | null; id?: string | null; slug?: string | null }) {
  const seeded = actorTenants.find((tenant) => tenant.id === input.id);
  return seeded?.slug ?? input.slug?.trim() ?? actorTenantSlugFromDisplayName(input.displayName);
}

export function actorTenantFromClientTenant(input: {
  displayName?: string | null;
  id?: string | null;
  jurisdiction?: string | null;
  riskRating?: string | null;
  slug?: string | null;
  status?: string | null;
}): ActorTenant | undefined {
  const seeded = actorTenants.find((tenant) => tenant.id === input.id);
  if (seeded) return seeded;

  const displayName = input.displayName?.trim();
  const id = input.id?.trim();
  if (!displayName || !id) return undefined;

  return {
    displayName,
    id,
    jurisdiction: input.jurisdiction?.trim() || "Unassigned",
    riskRating: input.riskRating?.trim() || "Unassigned",
    slug: actorTenantSlugForClientTenant({ displayName, id, slug: input.slug }),
    status: isTenantStatus(input.status) ? input.status : "DRAFT",
  };
}

function isTenantStatus(value?: string | null): value is TenantStatus {
  return value === "DRAFT" || value === "ONBOARDING" || value === "ACTIVE" || value === "SUSPENDED" || value === "ARCHIVED";
}

function resolveTenantForDraft(draft: ActorSessionDraft) {
  const seeded = actorTenants.find((tenant) => tenant.slug === draft.tenantSlug);
  if (seeded) return seeded;

  const dynamicTenant = actorTenantFromClientTenant({
    displayName: draft.tenantName,
    id: draft.tenantId,
    slug: draft.tenantSlug,
  });
  if (!dynamicTenant) return undefined;

  return !draft.tenantSlug || dynamicTenant.slug === draft.tenantSlug ? dynamicTenant : undefined;
}

export function resolveRole(roleKey?: string | null) {
  return actorRoles.find((role) => role.key === roleKey) ?? actorRoles.find((role) => role.key === "compliance_officer") ?? actorRoles[0];
}

export function resolveActorForRole(roleKey: ActorRoleKey, tenantSlug: ActorTenantSlug) {
  const clientActorSuffix = clientRoleActorKey[roleKey as keyof typeof clientRoleActorKey];

  if (clientActorSuffix) {
    return (
      actors.find((actor) => actor.key === `${tenantSlug}:${clientActorSuffix}`) ??
      createDynamicClientActor(roleKey, tenantSlug, clientActorSuffix)
    );
  }

  const internalActorKey = roleToInternalActorKey[roleKey];
  return actors.find((actor) => actor.key === internalActorKey) ?? internalActors[0];
}

function createDynamicClientActor(roleKey: ActorRoleKey, tenantSlug: ActorTenantSlug, personKey: string): Actor {
  const roleLabel = clientRoleLabels[personKey] ?? resolveRole(roleKey).label;
  const tenant = resolveTenant(tenantSlug);
  const tenantName = tenant.slug === tenantSlug ? tenant.displayName : titleFromSlug(tenantSlug);
  const tenantLabel = tenantName.replace(/\s+Family Office$/i, "").replace(/\s+Capital$/i, "");
  const initials = roleLabel
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return {
    displayName: `${tenantLabel} ${roleLabel}`,
    email: `${personKey}.${tenantSlug}@example.demo`,
    id: stableId(`actor-session:${tenantSlug}:${personKey}`),
    initials,
    key: `${tenantSlug}:${personKey}` as ActorKey,
    roleKey,
    tenantSlug,
  };
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ") || "Tenant";
}

export function resolveActorTenantMembership(
  actor: Actor,
  role: ActorRole,
  tenant: ActorTenant,
): ActorTenantMembership | undefined {
  if (actor.roleKey !== role.key) {
    return undefined;
  }

  if (!role.internal && actor.tenantSlug !== tenant.slug) {
    return undefined;
  }

  if (actor.tenantSlug && actor.tenantSlug !== tenant.slug) {
    return undefined;
  }

  return {
    actorId: actor.id,
    roleKey: role.key,
    scope: role.scope,
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
  };
}
