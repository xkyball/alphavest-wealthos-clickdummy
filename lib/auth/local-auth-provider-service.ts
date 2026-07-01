import { AuditResult, ObjectType, PermissionAction, UserStatus, type Prisma, type PrismaClient } from "@prisma/client";

import {
  actorPlatformTenantId,
  actorRoles,
  actorTenants,
  type ActorRoleKey,
  type ActorTenantSlug,
} from "@/lib/actor-session";
import { permissionEngine } from "@/lib/permission-engine";
import { stableId } from "@/lib/stable-id";

export const localAuthProviderId = "local-db-provider" as const;
export const localAuthMfaCode = "123456";

export type LocalAuthUserContext = {
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
        clientTenant: { select: { displayName: true; id: true } };
        role: { select: { id: true; key: true; name: true; scope: true } };
      };
      orderBy: { updatedAt: "desc" };
    };
  };
}>;

const activeAssignmentStatuses = new Set(["active", "pending", "invited"]);
const inviteActorRoles = new Set<ActorRoleKey>(["admin", "client_success"]);

type PreferredRoleAssignmentInput = {
  roleKey?: unknown;
  tenantSlug?: unknown;
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

function cleanText(value: unknown, maxLength = 160) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function inviteTokenFor(user: Pick<LoadedUser, "email" | "id">) {
  return `av-invite-${stableId(`local-auth:invite:${user.id}:${user.email.toLowerCase()}`)}`;
}

function challengeIdFor(user: Pick<LoadedUser, "email" | "id">) {
  return stableId(`local-auth:mfa:${user.id}:${user.email.toLowerCase()}`);
}

function tenantSlugFromTenantId(tenantId?: string | null): ActorTenantSlug | undefined {
  return actorTenants.find((tenant) => tenant.id === tenantId)?.slug;
}

function roleKey(value: unknown): ActorRoleKey | undefined {
  return typeof value === "string" && actorRoles.some((role) => role.key === value)
    ? (value as ActorRoleKey)
    : undefined;
}

function tenantSlug(value: unknown): ActorTenantSlug | undefined {
  return typeof value === "string" && actorTenants.some((tenant) => tenant.slug === value)
    ? (value as ActorTenantSlug)
    : undefined;
}

function tenantIdForSlug(slug?: ActorTenantSlug) {
  return actorTenants.find((tenant) => tenant.slug === slug)?.id;
}

function primaryRoleAssignment(user: LoadedUser, preferred: PreferredRoleAssignmentInput = {}) {
  const preferredRoleKey = roleKey(preferred.roleKey);
  const preferredTenantId = tenantIdForSlug(tenantSlug(preferred.tenantSlug));
  const activeAssignments = user.userRoles.filter((assignment) => activeAssignmentStatuses.has(assignment.status));

  return (
    activeAssignments.find((assignment) => assignment.role.key === preferredRoleKey && assignment.clientTenantId === preferredTenantId) ??
    activeAssignments.find((assignment) => assignment.role.key === preferredRoleKey && !preferredTenantId) ??
    activeAssignments.find((assignment) => assignment.clientTenantId === preferredTenantId && !preferredRoleKey) ??
    activeAssignments[0]
  );
}

function contextForUser(user: LoadedUser, includeInviteToken = false, preferred: PreferredRoleAssignmentInput = {}): LocalAuthUserContext {
  const assignment = primaryRoleAssignment(user, preferred);
  const slug = tenantSlugFromTenantId(assignment?.clientTenantId);

  return {
    email: user.email,
    displayName: user.displayName,
    ...(includeInviteToken ? { inviteToken: inviteTokenFor(user) } : {}),
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

async function loadUserByEmail(prisma: PrismaClient | Prisma.TransactionClient, email: string) {
  return prisma.user.findUnique({
    include: {
      userRoles: {
        include: {
          clientTenant: { select: { displayName: true, id: true } },
          role: { select: { id: true, key: true, name: true, scope: true } },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
    where: { email },
  });
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
  input: { email?: unknown } & PreferredRoleAssignmentInput,
): Promise<LocalAuthStartResult> {
  const email = normalizeEmail(input.email);
  const denied = async (reasonCode: string, reason: string, targetId = stableId(`local-auth:unknown:${email || "empty"}`)) => {
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
      safeMessage: "If this email is eligible, the next sign-in step will be shown.",
    };
  };

  if (!email) {
    return denied("LOCAL_AUTH_EMAIL_REQUIRED", "Email is required for local provider login.");
  }

  const user = await loadUserByEmail(prisma, email);
  if (!user) {
    return denied("LOCAL_AUTH_UNKNOWN_EMAIL", "Local provider denied an unknown email address.");
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
    metadataJson: { roleKey: assignment.role.key, tenantSlug: tenantSlugFromTenantId(assignment.clientTenantId) },
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
      metadataJson: { roleKey: assignment.role.key, tenantSlug: tenantSlugFromTenantId(assignment.clientTenantId) },
      reason: "Local MFA code did not match the accepted local challenge.",
      result: AuditResult.DENIED,
      targetId: user.id,
    });
    throw new LocalAuthProviderError("LOCAL_AUTH_MFA_INVALID_CODE", "MFA verification failed.", 403);
  }

  const updated = await prisma.$transaction(async (tx) => {
    const saved = await tx.user.update({
      data: {
        lastLoginAt: new Date(),
        mfaEnabled: true,
      },
      include: {
        userRoles: {
          include: {
            clientTenant: { select: { displayName: true, id: true } },
            role: { select: { id: true, key: true, name: true, scope: true } },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
      where: { id: user.id },
    });

    await writeAuthAudit(tx, {
      actorUserId: user.id,
      clientTenantId: assignment.clientTenantId,
      eventType: "auth.local.mfa.verified",
      metadataJson: { roleKey: assignment.role.key, tenantSlug: tenantSlugFromTenantId(assignment.clientTenantId) },
      nextState: "session_issued",
      previousState: user.status,
      reason: "Local MFA challenge verified and session context issued.",
      result: AuditResult.SUCCESS,
      targetId: user.id,
    });

    return saved;
  });

  return {
    session: contextForUser(updated, false, input),
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
  },
): Promise<LocalAuthInviteResult> {
  const parsedActorRole = roleKey(input.actorRoleKey);
  const parsedRoleKey = roleKey(input.roleKey);
  const parsedTenantSlug = tenantSlug(input.tenantSlug);
  const email = normalizeEmail(input.email);
  const displayName = cleanText(input.displayName) || email;

  if (!email || !parsedActorRole || !parsedRoleKey || !parsedTenantSlug) {
    throw new LocalAuthProviderError("LOCAL_INVITE_INVALID_INPUT", "Invite requires actor, email, role and tenant.", 400);
  }

  if (!inviteActorRoles.has(parsedActorRole)) {
    throw new LocalAuthProviderError("LOCAL_INVITE_ACTOR_DENIED", "Actor cannot invite users.", 403);
  }

  const tenant = actorTenants.find((candidate) => candidate.slug === parsedTenantSlug);
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

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      create: {
        displayName,
        email,
        isServiceAccount: false,
        mfaEnabled: false,
        platformTenantId: actorPlatformTenantId,
        status: UserStatus.INVITED,
        timezone: "Africa/Johannesburg",
      },
      include: {
        userRoles: {
          include: {
            clientTenant: { select: { displayName: true, id: true } },
            role: { select: { id: true, key: true, name: true, scope: true } },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
      update: {
        displayName,
        status: UserStatus.INVITED,
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
        validFrom: new Date(),
      },
      update: {
        clientTenantId: tenant.id,
        roleId: dbRole.id,
        status: "pending",
        validFrom: new Date(),
        validUntil: null,
      },
      where: {
        id: stableId(`local-auth:user-role:${tenant.slug}:${email}:${parsedRoleKey}`),
      },
    });

    const reloaded = await loadUserByEmail(tx, email);
    if (!reloaded) {
      throw new LocalAuthProviderError("LOCAL_INVITE_RELOAD_FAILED", "Invited user could not be reloaded.", 500);
    }

    await writeAuthAudit(tx, {
      actorRoleKey: parsedActorRole,
      actorUserId: input.actorUserId,
      clientTenantId: tenant.id,
      eventType: "auth.local.invitation.created",
      metadataJson: { roleKey: parsedRoleKey },
      nextState: "INVITED",
      previousState: "NONE_OR_EXISTING",
      reason: "Admin created DB-backed local-provider invitation.",
      result: AuditResult.SUCCESS,
      targetId: reloaded.id,
    });

    return reloaded;
  });

  return {
    inviteToken: inviteTokenFor(result),
    invited: true,
    user: contextForUser(result, true),
  };
}

export async function acceptLocalInvite(
  prisma: PrismaClient,
  input: { consentAccepted?: unknown; email?: unknown; token?: unknown },
): Promise<LocalAuthInviteAcceptResult> {
  const email = normalizeEmail(input.email);
  const token = cleanText(input.token, 80);
  const consentAccepted = input.consentAccepted === true;
  const user = email ? await loadUserByEmail(prisma, email) : null;

  if (!user || token !== inviteTokenFor(user)) {
    throw new LocalAuthProviderError("LOCAL_INVITE_INVALID_TOKEN", "Invite token is invalid or expired.", 404);
  }

  const assignment = primaryRoleAssignment(user);
  if (!assignment) {
    throw new LocalAuthProviderError("LOCAL_INVITE_ROLE_CONTEXT_REQUIRED", "Invite acceptance requires a configured role.", 409);
  }

  if (user.status !== UserStatus.INVITED || !["pending", "invited"].includes(assignment.status)) {
    await writeAuthAudit(prisma, {
      actorUserId: user.id,
      clientTenantId: assignment.clientTenantId,
      eventType: "auth.local.invitation.blocked",
      metadataJson: {
        assignmentStatus: assignment.status,
        attemptedStatus: user.status,
        blockedReason: "already_accepted_or_inactive",
      },
      reason: "Invite acceptance replay blocked for a user that is no longer pending invitation.",
      result: AuditResult.BLOCKED,
      targetId: user.id,
    });
    throw new LocalAuthProviderError("LOCAL_INVITE_ALREADY_ACCEPTED", "Invite token is no longer acceptable.", 409);
  }

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

  const accepted = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      data: {
        lastLoginAt: new Date(),
        mfaEnabled: true,
        status: UserStatus.ACTIVE,
      },
      where: { id: user.id },
    });
    await tx.userRole.updateMany({
      data: {
        status: "active",
        validFrom: new Date(),
      },
      where: {
        status: { in: ["pending", "invited"] },
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

    await writeAuthAudit(tx, {
      actorUserId: user.id,
      clientTenantId: assignment.clientTenantId,
      eventType: "auth.local.invitation.accepted",
      metadataJson: { roleKey: assignment.role.key },
      nextState: "ACTIVE",
      previousState: user.status,
      reason: "Invited user accepted DB-backed local-provider invitation with MFA and consent.",
      result: AuditResult.SUCCESS,
      targetId: user.id,
    });

    const reloaded = await loadUserByEmail(tx, email);
    if (!reloaded) {
      throw new LocalAuthProviderError("LOCAL_INVITE_RELOAD_FAILED", "Accepted user could not be reloaded.", 500);
    }

    return reloaded;
  });

  return {
    accepted: true,
    session: contextForUser(accepted),
  };
}
