import type { RoleScope, TenantStatus, UUID } from "@/lib/domain-types";

export type DemoRoleKey =
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

export type DemoTenantSlug = "bennett" | "morgan" | "northbridge" | "summit";

export type DemoActorKey =
  | "admin"
  | "security"
  | "compliance"
  | "advisor"
  | "analyst"
  | "success"
  | "system"
  | `${DemoTenantSlug}:principal`
  | `${DemoTenantSlug}:cfo`
  | `${DemoTenantSlug}:trustee`
  | `${DemoTenantSlug}:nextgen`
  | `${DemoTenantSlug}:external`;

export type DemoRole = {
  key: DemoRoleKey;
  label: string;
  scope: RoleScope;
  description: string;
  internal: boolean;
};

export type DemoTenant = {
  id: UUID;
  slug: DemoTenantSlug;
  displayName: string;
  jurisdiction: string;
  status: TenantStatus;
  riskRating: string;
};

export type DemoActor = {
  id: UUID;
  key: DemoActorKey;
  displayName: string;
  initials: string;
  email: string;
  roleKey: DemoRoleKey;
  tenantSlug?: DemoTenantSlug;
  serviceAccount?: boolean;
};

export type DemoSession = {
  actor: DemoActor;
  role: DemoRole;
  tenant: DemoTenant;
  sessionLabel: string;
  mode: "demo";
};

export type DemoSessionDraft = {
  roleKey?: string | null;
  tenantSlug?: string | null;
};

export const demoPlatformTenantId = "96705b67-40b2-5fb8-aa69-a3f2c106025e";

export const demoRoles: DemoRole[] = [
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

export const demoTenants: DemoTenant[] = [
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

const internalActors: DemoActor[] = [
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

const clientRoleActorKey: Record<Extract<DemoRoleKey, "principal" | "family_cfo" | "trustee" | "next_gen" | "external_advisor">, string> = {
  principal: "principal",
  family_cfo: "cfo",
  trustee: "trustee",
  next_gen: "nextgen",
  external_advisor: "external",
};

const roleToInternalActorKey: Partial<Record<DemoRoleKey, DemoActorKey>> = {
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

const clientRoleKeys: Record<string, DemoRoleKey> = {
  principal: "principal",
  cfo: "family_cfo",
  trustee: "trustee",
  nextgen: "next_gen",
  external: "external_advisor",
};

const seededClientActorIds: Record<DemoTenantSlug, Record<string, UUID>> = {
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

const clientActors: DemoActor[] = demoTenants.flatMap((tenant) =>
  Object.entries(clientRoleLabels).map(([personKey, personLabel]) => {
    const displayName = `${tenant.displayName.replace(" Family Office", "").replace(" Capital", "")} ${personLabel}`;
    const initials = personLabel
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2);

    return {
      id: seededClientActorIds[tenant.slug][personKey],
      key: `${tenant.slug}:${personKey}` as DemoActorKey,
      displayName,
      initials,
      email: `${personKey}.${tenant.slug}@example.demo`,
      roleKey: clientRoleKeys[personKey],
      tenantSlug: tenant.slug,
    };
  })
);

export const demoActors: DemoActor[] = [...internalActors, ...clientActors];

export const defaultDemoSession = createDemoSession({
  roleKey: "compliance_officer",
  tenantSlug: "bennett",
});

export function currentActor(session: DemoSession = defaultDemoSession) {
  return session.actor;
}

export function currentTenant(session: DemoSession = defaultDemoSession) {
  return session.tenant;
}

export function createDemoSession(draft: DemoSessionDraft): DemoSession {
  const tenant = resolveTenant(draft.tenantSlug);
  const role = resolveRole(draft.roleKey);
  const actor = resolveActorForRole(role.key, tenant.slug);

  return {
    actor,
    role,
    tenant,
    sessionLabel: "Demo session",
    mode: "demo",
  };
}

export function resolveTenant(tenantSlug?: string | null) {
  return demoTenants.find((tenant) => tenant.slug === tenantSlug) ?? demoTenants[0];
}

export function resolveRole(roleKey?: string | null) {
  return demoRoles.find((role) => role.key === roleKey) ?? demoRoles.find((role) => role.key === "compliance_officer") ?? demoRoles[0];
}

export function resolveActorForRole(roleKey: DemoRoleKey, tenantSlug: DemoTenantSlug) {
  const clientActorSuffix = clientRoleActorKey[roleKey as keyof typeof clientRoleActorKey];

  if (clientActorSuffix) {
    return (
      demoActors.find((actor) => actor.key === `${tenantSlug}:${clientActorSuffix}`) ??
      demoActors.find((actor) => actor.roleKey === roleKey) ??
      internalActors[0]
    );
  }

  const internalActorKey = roleToInternalActorKey[roleKey];
  return demoActors.find((actor) => actor.key === internalActorKey) ?? internalActors[0];
}
