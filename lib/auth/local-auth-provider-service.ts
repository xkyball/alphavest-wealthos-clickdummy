import { createHash } from "node:crypto";

import { AuditResult, ObjectType, PermissionAction, UserStatus, type Prisma, type PrismaClient } from "@prisma/client";

import { authJwtMaxAgeSeconds, authJwtProviderId } from "@/lib/auth/auth-jwt-constants";
import {
  actorPlatformTenantId,
  actorRoles,
  actorTenants,
  actorTenantSlugForClientTenant,
  type ActorTenant,
  type ActorRoleKey,
  type ActorTenantSlug,
} from "@/lib/actor-session";
import { permissionEngine } from "@/lib/permission-engine";
import { stableId } from "@/lib/stable-id";

export const localAuthProviderId = "local-db-provider" as const;
export const localAuthMfaCode = "123456";
const LOCAL_PASSWORD_MIN_LENGTH = 8;
const LOCAL_PASSWORD_CHANGE_EVENT = "auth.local.password.changed";
const LOCAL_INVITE_MIN_DAYS = 1;
const LOCAL_INVITE_MAX_DAYS = 30;

export type LocalAuthUserContext = {
  authSessionId?: string;
  email: string;
  displayName: string;
  inviteToken?: string;
  mfaEnabled: boolean;
  roleKey?: string;
  roleName?: string;
  status: string;
  tenantId?: string;
  tenantName?: string;
  tenantSlug?: string;
  userId: string;
  userRoleId?: string;
};

export type LocalAuthStartResult =
  | {
      ok: true;
      challengeId: string;
      nextStep: "mfa_required" | "invite_acceptance_required";
      provider: typeof localAuthProviderId;
      user: LocalAuthUserContext;
    }
  | {
      ok: false;
      nextStep: "denied";
      provider: typeof localAuthProviderId;
      reasonCode: string;
      safeMessage: string;
    };

export type LocalAuthInviteResult = {
  inviteToken: string;
  invited: boolean;
  user: LocalAuthUserContext;
};

export type LocalAuthInvitePreview = {
  assignmentStatus: string;
  consentRequired: true;
  displayName: string;
  email: string;
  roleKey: string;
  roleName: string;
  status: string;
  tenantId?: string;
  tenantName?: string;
  tenantSlug?: string;
  token: string;
  validUntil?: string;
};

export type LocalAuthInvitePreviewResult = {
  invitation: LocalAuthInvitePreview;
};

export type LocalAuthInviteAcceptResult = {
  accepted: boolean;
  session: LocalAuthUserContext;
};

export type LocalAuthMfaResult = {
  session: LocalAuthUserContext;
};

type LoadedUser = Prisma.UserGetPayload<{
  include: {
    userRoles: {
      include: {
        clientTenant: { select: { displayName: true; id: true; slug: true; status: true } };
        role: { select: { id: true; key: true; name: true; scope: true } };
      };
      orderBy: { updatedAt: "desc" };
    };
  };
}>;

const activeAssignmentStatuses = new Set(["active", "pending", "pending_invite", "invited"]);
const inviteAssignmentStatuses = new Set(["pending", "pending_invite", "invited"]);
const inviteActorRoles = new Set<ActorRoleKey>(["admin", "client_success"]);
type InviteAssignment = LoadedUser["userRoles"][number];

type PreferredRoleAssignmentInput = {
  email?: unknown;
  ipAddress?: unknown;
  roleKey?: unknown;
  tenantSlug?: unknown;
  password?: unknown;
  username?: unknown;
  userAgent?: unknown;
};

export class LocalAuthProviderError extends Error {
  constructor(
    readonly reasonCode: string,
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeUsername(value: unknown) {
  return cleanText(value, 120).toLowerCase();
}

function normalizeId(value: unknown) {
  return cleanText(value, 120);
}

function cleanText(value: unknown, maxLength = 160) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizePassword(value: unknown) {
  return cleanText(value, 80);
}

function inviteValidityDays(value: unknown) {
  const numeric = typeof value === "number" ? value : typeof value === "string" ? Number.parseInt(value, 10) : Number.NaN;

  if (!Number.isFinite(numeric)) {
    return 7;
  }

  return Math.min(LOCAL_INVITE_MAX_DAYS, Math.max(LOCAL_INVITE_MIN_DAYS, Math.trunc(numeric)));
}

function passwordForEmail(value: string) {
  return value.split("@")[0] ?? "";
}

function usernameForEmail(value: string) {
  return passwordForEmail(value).toLowerCase();
}

function passwordHash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function inviteTokenFor(user: Pick<LoadedUser, "email" | "id" | "updatedAt">, assignment?: InviteAssignment | null) {
  const anchor = assignment ? assignment.id : user.updatedAt.toISOString();
  return `av-invite-${stableId(`local-auth:invite:${user.id}:${user.email.toLowerCase()}:${anchor}`)}`;
}

function challengeIdFor(user: Pick<LoadedUser, "email" | "id">) {
  return stableId(`local-auth:mfa:${user.id}:${user.email.toLowerCase()}`);
}

function tenantSlugFromTenant(tenant?: { displayName?: string | null; id?: string | null } | null): ActorTenantSlug | undefined {
  return tenant?.id ? actorTenantSlugForClientTenant(tenant) : undefined;
}

function roleKey(value: unknown): ActorRoleKey | undefined {
  return typeof value === "string" && actorRoles.some((role) => role.key === value)
    ? (value as ActorRoleKey)
    : undefined;
}

function tenantIdForSlug(user: LoadedUser, slug?: string | null) {
  if (!slug) return undefined;

  return (
    actorTenants.find((tenant) => tenant.slug === slug)?.id ??
      user.userRoles.find((assignment) => actorTenantSlugForClientTenant(assignment.clientTenant ?? {}) === slug)
      ?.clientTenantId ??
    undefined
  );
}

async function resolveClientTenantBySlug(prisma: PrismaClient, slug: string): Promise<ActorTenant | undefined> {
  const seeded = actorTenants.find((tenant) => tenant.slug === slug);
  if (seeded) return seeded;

  const candidates = await prisma.clientTenant.findMany({
    select: {
      displayName: true,
      id: true,
      jurisdiction: true,
      riskRating: true,
      slug: true,
      status: true,
    },
    where: { platformTenantId: actorPlatformTenantId },
  });
  const candidate = candidates.find((tenant) => actorTenantSlugForClientTenant(tenant) === slug);
  if (!candidate) return undefined;

  return {
    displayName: candidate.displayName,
    id: candidate.id,
    jurisdiction: candidate.jurisdiction ?? "Unassigned",
    riskRating: candidate.riskRating ?? "Unassigned",
      slug,
    status: candidate.status,
  };
}

function sessionExpiresAt(now = new Date()) {
  return new Date(now.getTime() + authJwtMaxAgeSeconds * 1000);
}

function safeIpAddress(value: unknown) {
  const raw = cleanText(value, 64);

  return raw.split(",")[0]?.trim() || null;
}

function safeUserAgent(value: unknown) {
  return cleanText(value, 260) || null;
}

function primaryRoleAssignment(user: LoadedUser, preferred: PreferredRoleAssignmentInput = {}) {
  const preferredRoleKey = roleKey(preferred.roleKey);
  const preferredTenantId = tenantIdForSlug(user, cleanText(preferred.tenantSlug, 120));
  const activeAssignments = user.userRoles.filter((assignment) => activeAssignmentStatuses.has(assignment.status));
  const tenantAssignments = activeAssignments.filter((assignment) => assignment.clientTenantId && assignment.clientTenant);
  const roleTenantAssignments = tenantAssignments.filter((assignment) => !preferredRoleKey || assignment.role.key === preferredRoleKey);
  const roleAssignments = activeAssignments.filter((assignment) => !preferredRoleKey || assignment.role.key === preferredRoleKey);

  return (
    tenantAssignments.find((assignment) => assignment.role.key === preferredRoleKey && assignment.clientTenantId === preferredTenantId) ??
    roleTenantAssignments.find((assignment) => assignment.clientTenant?.status === "ONBOARDING") ??
    roleTenantAssignments[0] ??
    tenantAssignments.find((assignment) => assignment.clientTenantId === preferredTenantId && !preferredRoleKey) ??
    roleAssignments[0] ??
    activeAssignments[0]
  );
}

function pendingInviteAssignment(user: LoadedUser) {
  return user.userRoles.find((candidate) => inviteAssignmentStatuses.has(candidate.status));
}

function contextForUser(
  user: LoadedUser,
  includeInviteToken = false,
  preferred: PreferredRoleAssignmentInput = {},
  authSessionId?: string,
): LocalAuthUserContext {
  const assignment = primaryRoleAssignment(user, preferred);
  const slug = tenantSlugFromTenant(assignment?.clientTenant);
  const inviteAssignment = pendingInviteAssignment(user);

  return {
    ...(authSessionId ? { authSessionId } : {}),
    email: user.email,
    displayName: user.displayName,
    ...(includeInviteToken && inviteAssignment ? { inviteToken: inviteTokenFor(user, inviteAssignment) } : {}),
    mfaEnabled: user.mfaEnabled,
    roleKey: assignment?.role.key,
    roleName: assignment?.role.name,
    status: user.status,
    tenantId: assignment?.clientTenantId ?? undefined,
    tenantName: assignment?.clientTenant?.displayName,
    tenantSlug: slug,
    userId: user.id,
    userRoleId: assignment?.id,
  };
}

function previewForInvite(user: LoadedUser, assignment: InviteAssignment, token: string): LocalAuthInvitePreview {
  return {
    assignmentStatus: assignment.status,
    consentRequired: true,
    displayName: user.displayName,
    email: user.email,
    roleKey: assignment.role.key,
    roleName: assignment.role.name,
    status: user.status,
    tenantId: assignment.clientTenantId ?? undefined,
    tenantName: assignment.clientTenant?.displayName,
    tenantSlug: tenantSlugFromTenant(assignment.clientTenant),
    token,
    validUntil: assignment.validUntil?.toISOString(),
  };
}

async function loadUserByEmail(prisma: PrismaClient | Prisma.TransactionClient, email: string) {
  return prisma.user.findUnique({
    include: {
      userRoles: {
        include: {
          clientTenant: { select: { displayName: true, id: true, slug: true, status: true } },
          role: { select: { id: true, key: true, name: true, scope: true } },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
    where: { email },
  });
}

async function resolveLocalInvite(
  prisma: PrismaClient,
  input: { email?: unknown; token?: unknown },
  options: { auditBlocked: boolean },
) {
  const email = normalizeEmail(input.email);
  const token = cleanText(input.token, 80);
  const user = email ? await loadUserByEmail(prisma, email) : null;
  const now = new Date();

  const inviteAssignment = user
    ? user.userRoles.find((assignment) => token === inviteTokenFor(user, assignment))
    : null;
  if (!user || !inviteAssignment) {
    throw new LocalAuthProviderError("LOCAL_INVITE_INVALID_TOKEN", "Invite token is invalid or expired.", 404);
  }

  if (inviteAssignment.validUntil && inviteAssignment.validUntil.getTime() <= now.getTime()) {
    if (options.auditBlocked) {
      await writeAuthAudit(prisma, {
        actorUserId: user.id,
        clientTenantId: inviteAssignment.clientTenantId,
        eventType: "auth.local.invitation.blocked",
        metadataJson: {
          assignmentStatus: inviteAssignment.status,
          assignmentValidUntil: inviteAssignment.validUntil.toISOString(),
          blockedReason: "invite_expired",
        },
        reason: "Invite acceptance blocked because the invitation window has expired.",
        result: AuditResult.BLOCKED,
        targetId: user.id,
      });
    }

    throw new LocalAuthProviderError("LOCAL_INVITE_EXPIRED", "Invite token has expired.", 410);
  }

  if (user.status !== UserStatus.INVITED || !inviteAssignmentStatuses.has(inviteAssignment.status)) {
    if (options.auditBlocked) {
      await writeAuthAudit(prisma, {
        actorUserId: user.id,
        clientTenantId: inviteAssignment.clientTenantId,
        eventType: "auth.local.invitation.blocked",
        metadataJson: {
          assignmentStatus: inviteAssignment.status,
          attemptedStatus: user.status,
          blockedReason: "already_accepted_or_inactive",
        },
        reason: "Invite acceptance replay blocked for a user that is no longer pending invitation.",
        result: AuditResult.BLOCKED,
        targetId: user.id,
      });
    }

    throw new LocalAuthProviderError("LOCAL_INVITE_ALREADY_ACCEPTED", "Invite token is no longer acceptable.", 409);
  }

  return { assignment: inviteAssignment, now, token, user };
}

async function loadUserByLoginIdentifier(prisma: PrismaClient | Prisma.TransactionClient, identifier: string) {
  if (identifier.includes("@")) {
    return loadUserByEmail(prisma, identifier);
  }

  const users = await prisma.user.findMany({
    include: {
      userRoles: {
        include: {
          clientTenant: { select: { displayName: true, id: true, slug: true, status: true } },
          role: { select: { id: true, key: true, name: true, scope: true } },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
    take: 2,
    where: { email: { startsWith: `${identifier}@` } },
  });

  return users.length === 1 ? users[0] : null;
}

async function loadUserById(prisma: PrismaClient | Prisma.TransactionClient, userId: string) {
  return prisma.user.findUnique({
    include: {
      userRoles: {
        include: {
          clientTenant: { select: { displayName: true, id: true, slug: true, status: true } },
          role: { select: { id: true, key: true, name: true, scope: true } },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
    where: { id: userId },
  });
}

function currentPasswordHashForUser(user: LoadedUser) {
  return user.localPasswordHash ?? passwordHash(usernameForEmail(user.email));
}

async function writeAuthAudit(
  prisma: PrismaClient | Prisma.TransactionClient,
  input: {
    actorRoleKey?: string;
    actorUserId?: string;
    clientTenantId?: string | null;
    eventType: string;
    metadataJson?: Prisma.InputJsonValue;
    nextState?: string;
    previousState?: string;
    reason: string;
    result: AuditResult;
    targetId: string;
    targetType?: ObjectType;
  },
) {
  return prisma.auditEvent.create({
    data: {
      actorRoleKey: input.actorRoleKey ?? "local_auth_provider",
      actorUserId: input.actorUserId,
      clientTenantId: input.clientTenantId ?? undefined,
      eventType: input.eventType,
      metadataJson: {
        authProvider: localAuthProviderId,
        localSeedMode: true,
        productionAuthClaim: false,
        ...(typeof input.metadataJson === "object" && input.metadataJson ? input.metadataJson : {}),
      },
      nextState: input.nextState,
      platformTenantId: actorPlatformTenantId,
      previousState: input.previousState,
      reason: input.reason,
      result: input.result,
      targetId: input.targetId,
      targetType: input.targetType ?? ObjectType.USER,
    },
  });
}

export async function startLocalProviderLogin(
  prisma: PrismaClient,
  input: PreferredRoleAssignmentInput,
): Promise<LocalAuthStartResult> {
  const loginIdentifier = normalizeUsername(input.username) || normalizeEmail(input.email);
  const password = normalizePassword(input.password);
  const denied = async (reasonCode: string, reason: string, targetId = stableId(`local-auth:unknown:${loginIdentifier || "empty"}`)) => {
    await writeAuthAudit(prisma, {
      eventType: "auth.local.login.denied",
      metadataJson: { reasonCode },
      reason,
      result: AuditResult.DENIED,
      targetId,
    }).catch(() => undefined);

    return {
      ok: false as const,
      nextStep: "denied" as const,
      provider: localAuthProviderId,
      reasonCode,
      safeMessage: "If this account is eligible, the next sign-in step will be shown.",
    };
  };

  if (!loginIdentifier) {
    return denied("LOCAL_AUTH_USERNAME_REQUIRED", "Username is required for local provider login.");
  }

  if (!password) {
    return denied("LOCAL_AUTH_PASSWORD_REQUIRED", "Password is required for local provider login.", stableId(`local-auth:unknown:${loginIdentifier}`));
  }

  const user = await loadUserByLoginIdentifier(prisma, loginIdentifier);
  if (!user) {
    return denied("LOCAL_AUTH_UNKNOWN_USERNAME", "Local provider denied an unknown username.");
  }

  const requiredPasswordHash = currentPasswordHashForUser(user);
  if (passwordHash(password) !== requiredPasswordHash) {
    return denied("LOCAL_AUTH_INVALID_PASSWORD", "Local provider password did not match the username credential format.", user.id);
  }

  if (user.status === UserStatus.SUSPENDED || user.status === UserStatus.LOCKED || user.status === UserStatus.ARCHIVED) {
    return denied("LOCAL_AUTH_USER_NOT_ACTIVE", `Local provider denied ${user.status.toLowerCase()} user.`, user.id);
  }

  const assignment = primaryRoleAssignment(user, input);
  if (!assignment) {
    return denied("LOCAL_AUTH_ROLE_CONTEXT_REQUIRED", "Local provider requires a configured role assignment.", user.id);
  }

  const nextStep = user.status === UserStatus.INVITED ? "invite_acceptance_required" : "mfa_required";

  await writeAuthAudit(prisma, {
    actorUserId: user.id,
    clientTenantId: assignment.clientTenantId,
    eventType: nextStep === "mfa_required" ? "auth.local.mfa.challenge.created" : "auth.local.invite.challenge.created",
    metadataJson: { roleKey: assignment.role.key, tenantSlug: tenantSlugFromTenant(assignment.clientTenant) },
    nextState: nextStep,
    previousState: user.status,
    reason: "Local provider accepted existing DB user and role context.",
    result: AuditResult.PENDING,
    targetId: user.id,
  });

  return {
    ok: true,
    challengeId: challengeIdFor(user),
    nextStep,
    provider: localAuthProviderId,
    user: contextForUser(user, nextStep === "invite_acceptance_required", input),
  };
}

export async function changeLocalAuthPassword(
  prisma: PrismaClient,
  input: {
    actorRoleKey?: unknown;
    actorUserId?: unknown;
    currentPassword?: unknown;
    nextPassword?: unknown;
    confirmPassword?: unknown;
  },
) {
  const actorRole = roleKey(input.actorRoleKey);
  const actorUserId = normalizeId(input.actorUserId);
  const currentPassword = normalizePassword(input.currentPassword);
  const nextPassword = normalizePassword(input.nextPassword);
  const confirmPassword = normalizePassword(input.confirmPassword);

  if (!actorUserId) {
    throw new LocalAuthProviderError("LOCAL_AUTH_PASSWORD_CHANGE_USER_REQUIRED", "Password change requires an authenticated user context.", 401);
  }

  if (!currentPassword) {
    throw new LocalAuthProviderError("LOCAL_AUTH_PASSWORD_CURRENT_REQUIRED", "Current password is required.", 400);
  }

  if (!nextPassword) {
    throw new LocalAuthProviderError("LOCAL_AUTH_PASSWORD_NEXT_REQUIRED", "New password is required.", 400);
  }

  if (nextPassword.length < LOCAL_PASSWORD_MIN_LENGTH) {
    throw new LocalAuthProviderError(
      "LOCAL_AUTH_PASSWORD_MIN_LENGTH",
      `New password must be at least ${LOCAL_PASSWORD_MIN_LENGTH} characters long.`,
      400,
    );
  }

  if (nextPassword !== confirmPassword) {
    throw new LocalAuthProviderError("LOCAL_AUTH_PASSWORD_CONFIRM_MISMATCH", "New password and confirmation do not match.", 409);
  }

  const user = await loadUserById(prisma, actorUserId);
  if (!user) {
    throw new LocalAuthProviderError("LOCAL_AUTH_PASSWORD_USER_UNKNOWN", "Current actor could not be resolved for password update.", 404);
  }

  const activeAssignment = user.userRoles.find((candidate) => inviteAssignmentStatuses.has(candidate.status) || candidate.status === "active");
  const expectedPasswordHash = currentPasswordHashForUser(user);
  const currentPasswordHash = passwordHash(currentPassword);
  const nextPasswordHash = passwordHash(nextPassword);

  if (currentPasswordHash !== expectedPasswordHash) {
    throw new LocalAuthProviderError("LOCAL_AUTH_PASSWORD_INVALID_CURRENT", "Current password did not match this user's active credentials.", 403);
  }

  if (nextPasswordHash === expectedPasswordHash) {
    throw new LocalAuthProviderError("LOCAL_AUTH_PASSWORD_NOT_CHANGED", "New password must be different from the current one.", 409);
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      data: {
        localPasswordHash: nextPasswordHash,
        localPasswordUpdatedAt: new Date(),
      },
      where: { id: user.id },
    });

    await writeAuthAudit(tx, {
      actorRoleKey: actorRole,
      actorUserId: user.id,
      clientTenantId: activeAssignment?.clientTenantId,
      eventType: LOCAL_PASSWORD_CHANGE_EVENT,
      metadataJson: {
        passwordVersion: "local-sha256-v1",
        roleKey: activeAssignment?.role.key,
      },
      nextState: "password_set",
      previousState: "active_password",
      reason: "Local authentication password was changed successfully.",
      result: AuditResult.SUCCESS,
      targetId: user.id,
    });
  });

  return {
    ok: true as const,
    passwordChanged: true,
    user: { userId: user.id, email: user.email },
  };
}

export async function verifyLocalMfa(
  prisma: PrismaClient,
  input: { code?: unknown; email?: unknown } & PreferredRoleAssignmentInput,
): Promise<LocalAuthMfaResult> {
  const email = normalizeEmail(input.email);
  const code = cleanText(input.code, 12);
  const user = email ? await loadUserByEmail(prisma, email) : null;

  if (!user) {
    throw new LocalAuthProviderError("LOCAL_AUTH_MFA_UNKNOWN_EMAIL", "MFA verification requires a known DB user.", 404);
  }

  const assignment = primaryRoleAssignment(user, input);
  if (!assignment) {
    await writeAuthAudit(prisma, {
      actorUserId: user.id,
      eventType: "auth.local.mfa.denied",
      reason: "MFA denied because no role context is configured.",
      result: AuditResult.DENIED,
      targetId: user.id,
    });
    throw new LocalAuthProviderError("LOCAL_AUTH_ROLE_CONTEXT_REQUIRED", "MFA verification requires a configured role.", 403);
  }

  if (code !== localAuthMfaCode) {
    await writeAuthAudit(prisma, {
      actorUserId: user.id,
      clientTenantId: assignment.clientTenantId,
      eventType: "auth.local.mfa.failed",
      metadataJson: { roleKey: assignment.role.key, tenantSlug: tenantSlugFromTenant(assignment.clientTenant) },
      reason: "Local MFA code did not match the accepted local challenge.",
      result: AuditResult.DENIED,
      targetId: user.id,
    });
    throw new LocalAuthProviderError("LOCAL_AUTH_MFA_INVALID_CODE", "MFA verification failed.", 403);
  }

  const { updated, userSession } = await prisma.$transaction(async (tx) => {
    const now = new Date();
    const saved = await tx.user.update({
      data: {
        lastLoginAt: now,
        mfaEnabled: true,
      },
      include: {
        userRoles: {
          include: {
            clientTenant: { select: { displayName: true, id: true, slug: true, status: true } },
            role: { select: { id: true, key: true, name: true, scope: true } },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
      where: { id: user.id },
    });
    const createdSession = await tx.userSession.create({
      data: {
        clientTenantId: assignment.clientTenantId,
        expiresAt: sessionExpiresAt(now),
        ipAddress: safeIpAddress(input.ipAddress),
        providerId: authJwtProviderId,
        roleKey: assignment.role.key,
        status: "ACTIVE",
        userAgent: safeUserAgent(input.userAgent),
        userId: user.id,
        userRoleId: assignment.id,
      },
    });

    await writeAuthAudit(tx, {
      actorUserId: user.id,
      clientTenantId: assignment.clientTenantId,
      eventType: "auth.local.mfa.verified",
      metadataJson: { roleKey: assignment.role.key, sessionId: createdSession.id, tenantSlug: tenantSlugFromTenant(assignment.clientTenant) },
      nextState: "session_issued",
      previousState: user.status,
      reason: "Local MFA challenge verified and session context issued.",
      result: AuditResult.SUCCESS,
      targetId: user.id,
    });

    return { updated: saved, userSession: createdSession };
  });

  return {
    session: contextForUser(updated, false, input, userSession.id),
  };
}

export async function inviteLocalAuthUser(
  prisma: PrismaClient,
  input: {
    actorRoleKey?: unknown;
    actorUserId?: string;
    displayName?: unknown;
    email?: unknown;
    roleKey?: unknown;
    tenantSlug?: unknown;
    validForDays?: unknown;
  },
): Promise<LocalAuthInviteResult> {
  const parsedActorRole = roleKey(input.actorRoleKey);
  const parsedRoleKey = roleKey(input.roleKey);
  const parsedTenantSlug = cleanText(input.tenantSlug, 120);
  const email = normalizeEmail(input.email);
  const displayName = cleanText(input.displayName) || email;

  if (!email || !parsedActorRole || !parsedRoleKey || !parsedTenantSlug) {
    throw new LocalAuthProviderError("LOCAL_INVITE_INVALID_INPUT", "Invite requires actor, email, role and tenant.", 400);
  }

  if (!inviteActorRoles.has(parsedActorRole)) {
    throw new LocalAuthProviderError("LOCAL_INVITE_ACTOR_DENIED", "Actor cannot invite users.", 403);
  }

  const tenant = await resolveClientTenantBySlug(prisma, parsedTenantSlug);
  const role = actorRoles.find((candidate) => candidate.key === parsedRoleKey);
  if (!tenant || !role) {
    throw new LocalAuthProviderError("LOCAL_INVITE_SCOPE_NOT_FOUND", "Invite scope could not be resolved.", 404);
  }

  const actorSession = {
    actor: {
      id: input.actorUserId ?? stableId(`local-auth:actor:${parsedActorRole}`),
      key: "admin" as const,
      displayName: "Admin Invite Actor",
      initials: "AI",
      email: "admin.invite@alphavest.demo",
      roleKey: parsedActorRole,
    },
    role: actorRoles.find((candidate) => candidate.key === parsedActorRole) ?? actorRoles[9],
  };
  const decision = permissionEngine.can(
    actorSession.actor,
    PermissionAction.INVITE,
    {
      clientTenantId: tenant.id,
      objectType: ObjectType.USER,
      visibilityStatus: "INTERNAL_ONLY",
    },
    {
      clientTenantId: tenant.id,
      platformTenantId: actorPlatformTenantId,
    },
    actorSession.role,
  );

  if (!decision.allowed) {
    throw new LocalAuthProviderError("LOCAL_INVITE_PERMISSION_DENIED", decision.reason, 403);
  }

  const now = new Date();
  const validityDays = inviteValidityDays(input.validForDays);
  const tokenExpiresAt = new Date(now.getTime() + validityDays * 24 * 60 * 60 * 1000);
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      create: {
        displayName,
        email,
        isServiceAccount: false,
        localPasswordHash: passwordHash(passwordForEmail(email)),
        localPasswordUpdatedAt: now,
        mfaEnabled: false,
        platformTenantId: actorPlatformTenantId,
        status: UserStatus.INVITED,
        timezone: "Africa/Johannesburg",
      },
      include: {
        userRoles: {
          include: {
            clientTenant: { select: { displayName: true, id: true, slug: true, status: true } },
            role: { select: { id: true, key: true, name: true, scope: true } },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
      update: {
        displayName,
        status: UserStatus.INVITED,
        updatedAt: now,
      },
      where: { email },
    });
    const dbRole = await tx.role.findFirst({
      where: {
        key: parsedRoleKey,
        platformTenantId: actorPlatformTenantId,
      },
    });

    if (!dbRole) {
      throw new LocalAuthProviderError("LOCAL_INVITE_ROLE_NOT_SEEDED", "Invite role is not seeded.", 404);
    }

    await tx.userRole.upsert({
      create: {
        assignedByUserId: input.actorUserId,
        clientTenantId: tenant.id,
        id: stableId(`local-auth:user-role:${tenant.slug}:${email}:${parsedRoleKey}`),
        roleId: dbRole.id,
        status: "pending",
        userId: user.id,
        validFrom: now,
        validUntil: tokenExpiresAt,
      },
      update: {
        clientTenantId: tenant.id,
        roleId: dbRole.id,
        status: "pending",
        validFrom: now,
        validUntil: tokenExpiresAt,
      },
      where: {
        id: stableId(`local-auth:user-role:${tenant.slug}:${email}:${parsedRoleKey}`),
      },
    });

    const reloaded = await loadUserByEmail(tx, user.email);
    if (!reloaded) {
      throw new LocalAuthProviderError("LOCAL_INVITE_RELOAD_FAILED", "Invited user could not be reloaded.", 500);
    }

    await writeAuthAudit(tx, {
      actorRoleKey: parsedActorRole,
      actorUserId: input.actorUserId,
      clientTenantId: tenant.id,
      eventType: "auth.local.invitation.created",
      metadataJson: { inviteValidForDays: validityDays, roleKey: parsedRoleKey },
      nextState: "INVITED",
      previousState: "NONE_OR_EXISTING",
      reason: "Admin created DB-backed local-provider invitation.",
      result: AuditResult.SUCCESS,
      targetId: reloaded.id,
    });

    return reloaded;
  });

  return {
    inviteToken: inviteTokenFor(result, pendingInviteAssignment(result)),
    invited: true,
    user: contextForUser(result, true),
  };
}

export async function previewLocalInvite(
  prisma: PrismaClient,
  input: { email?: unknown; token?: unknown },
): Promise<LocalAuthInvitePreviewResult> {
  const { assignment, token, user } = await resolveLocalInvite(prisma, input, { auditBlocked: false });

  return {
    invitation: previewForInvite(user, assignment, token),
  };
}

export async function acceptLocalInvite(
  prisma: PrismaClient,
  input: { consentAccepted?: unknown; email?: unknown; ipAddress?: unknown; token?: unknown; userAgent?: unknown },
): Promise<LocalAuthInviteAcceptResult> {
  const consentAccepted = input.consentAccepted === true;
  const { assignment, user } = await resolveLocalInvite(prisma, input, { auditBlocked: true });

  if (!consentAccepted) {
    await writeAuthAudit(prisma, {
      actorUserId: user.id,
      clientTenantId: assignment.clientTenantId,
      eventType: "auth.local.invitation.blocked",
      reason: "Invite acceptance blocked until required consent is accepted.",
      result: AuditResult.BLOCKED,
      targetId: user.id,
    });
    throw new LocalAuthProviderError("LOCAL_INVITE_CONSENT_REQUIRED", "Consent is required before invite acceptance.", 409);
  }

  const { accepted, userSession } = await prisma.$transaction(async (tx) => {
    const now = new Date();
    await tx.user.update({
      data: {
        lastLoginAt: now,
        mfaEnabled: true,
        status: UserStatus.ACTIVE,
      },
      where: { id: user.id },
    });
    await tx.userRole.updateMany({
      data: {
        status: "active",
        validFrom: now,
        validUntil: null,
      },
      where: {
        status: { in: ["pending", "pending_invite", "invited"] },
        userId: user.id,
      },
    });

    await tx.consentRecord.upsert({
      create: {
        acceptedAt: new Date(),
        clientTenantId: assignment.clientTenantId,
        consentType: "local_provider_onboarding",
        id: stableId(`local-auth:consent:${user.id}:onboarding`),
        ipAddress: "127.0.0.1",
        source: "local-auth-provider",
        status: "accepted",
        userId: user.id,
        version: "2026.06",
      },
      update: {
        acceptedAt: new Date(),
        status: "accepted",
      },
      where: { id: stableId(`local-auth:consent:${user.id}:onboarding`) },
    });
    const createdSession = await tx.userSession.create({
      data: {
        clientTenantId: assignment.clientTenantId,
        expiresAt: sessionExpiresAt(now),
        ipAddress: safeIpAddress(input.ipAddress),
        providerId: authJwtProviderId,
        roleKey: assignment.role.key,
        status: "ACTIVE",
        userAgent: safeUserAgent(input.userAgent),
        userId: user.id,
        userRoleId: assignment.id,
      },
    });

    await writeAuthAudit(tx, {
      actorUserId: user.id,
      clientTenantId: assignment.clientTenantId,
      eventType: "auth.local.invitation.accepted",
      metadataJson: { roleKey: assignment.role.key, sessionId: createdSession.id },
      nextState: "ACTIVE",
      previousState: user.status,
      reason: "Invited user accepted DB-backed local-provider invitation with MFA and consent.",
      result: AuditResult.SUCCESS,
      targetId: user.id,
    });

    const reloaded = await loadUserByEmail(tx, user.email);
    if (!reloaded) {
      throw new LocalAuthProviderError("LOCAL_INVITE_RELOAD_FAILED", "Accepted user could not be reloaded.", 500);
    }

    return { accepted: reloaded, userSession: createdSession };
  });

  return {
    accepted: true,
    session: contextForUser(accepted, false, {}, userSession.id),
  };
}
