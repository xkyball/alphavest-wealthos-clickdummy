import type { LocalAuthUserContext } from "@/lib/auth/local-auth-provider-service";

export const authProviders = [
  {
    id: "db-user-jwt",
    label: "DB user JWT",
    mode: "MVP_LOCAL_DB",
    mfa: "stub-123456",
    productionIdp: false,
  },
] as const;

export type AuthProviderId = (typeof authProviders)[number]["id"];

export function isAuthProviderId(value: unknown): value is AuthProviderId {
  return typeof value === "string" && authProviders.some((provider) => provider.id === value);
}

export function safeUserClaimsFromLocalContext(session: LocalAuthUserContext) {
  return {
    email: session.email,
    name: session.displayName,
    roleKey: session.roleKey,
    sub: session.userId,
    tenantId: session.tenantId,
    tenantSlug: session.tenantSlug,
    userRoleId: session.userRoleId,
  };
}
