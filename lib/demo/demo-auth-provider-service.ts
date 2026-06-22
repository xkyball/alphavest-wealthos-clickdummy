import { AuditResult, ObjectType, PermissionAction, UserStatus, type Prisma, type PrismaClient } from "@prisma/client";

import {
  demoPlatformTenantId,
  demoRoles,
  demoTenants,
  type DemoRoleKey,
  type DemoTenantSlug,
} from "@/lib/demo-session";
import { permissionEngine } from "@/lib/permission-engine";
import { stableId } from "@/lib/stable-id";

export const demoAuthProviderId = "dummy-db-provider" as const;
export const demoAuthMfaCode = "123456";

export type DemoAuthUserContext = {
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

export type DemoAuthStartResult =
  | {
      ok: true;
      challengeId: string;
      nextStep: "mfa_required" | "invite_acceptance_required";
      provider: typeof demoAuthProviderId;
      user: DemoAuthUserContext;
    }
  | {
      ok: false;
      nextStep: "denied";
      provider: typeof demoAuthProviderId;
      reasonCode: string;
      safeMessage: string;
    };

export type DemoAuthInviteResult = {
  inviteToken: string;
  invited: boolean;
  user: DemoAuthUserContext;
};

export type DemoAuthInviteAcceptResult = {
  accepted: boolean;
  session: DemoAuthUserContext;
};

export type DemoAuthMfaResult = {
  session: DemoAuthUserContext;
  sessionToken: string;
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
const inviteActorRoles = new Set<DemoRoleKey>(["admin", "client_success"]);

export class DemoAuthProviderError extends Error {
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
  return `av-invite-${stableId(`dummy-auth:invite:${user.id}:${user.email.toLowerCase()}`)}`;
}

function challengeIdFor(user: Pick<LoadedUser, "email" | "id">) {
  return stableId(`dummy-auth:mfa:${user.id}:${user.email.toLowerCase()}`);
}

function sessionTokenFor(user: Pick<LoadedUser, "email" | "id">) {
  return `av-session-${stableId(`dummy-auth:session:${user.id}:${user.email.toLowerCase()}`)}`;
}

function tenantSlugFromTenantId(tenantId?: string | null): DemoTenantSlug | undefined {
  return demoTenants.find((tenant) => tenant.id === tenantId)?.slug;
}

function roleKey(value: unknown): DemoRoleKey | undefined {
  return typeof value === "string" && demoRoles.some((role) => role.key === value)
    ? (value as DemoRoleKey)
    : undefined;
}

function tenantSlug(value: unknown): DemoTenantSlug | undefined {
  return typeof value === "string" && demoTenants.some((tenant) => tenant.slug === value)
    ? (value as DemoTenantSlug)
    : undefined;
}

function primaryRoleAssignment(user: LoadedUser) {
  return user.userRoles.find((assignment) => activeAssignmentStatuses.has(assignment.status));
}

function contextForUser(user: LoadedUser, includeInviteToken = false): DemoAuthUserContext {
  const assignment = primaryRoleAssignment(user);
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
      actorRoleKey: input.actorRoleKey ?? "dummy_auth_provider",
      actorUserId: input.actorUserId,
      clientTenantId: input.clientTenantId ?? undefined,
      eventType: input.eventType,
      metadataJson: {
        authProvider: demoAuthProviderId,
        demoMode: true,
        productionAuthClaim: false,
        ...(typeof input.metadataJson === "object" && input.metadataJson ? input.metadataJson : {}),
      },
      nextState: input.nextState,
      platformTenantId: demoPlatformTenantId,
      previousState: input.previousState,
      reason: input.reason,
      result: input.result,
      targetId: input.targetId,
      targetType: input.targetType ?? ObjectType.USER,
    },
  });
}

export async function startDemoProviderLogin(
  prisma: PrismaClient,
  input: { email?: unknown },
): Promise<DemoAuthStartResult> {
  const email = normalizeEmail(input.email);
  const denied = async (reasonCode: string, reason: string, targetId = stableId(`dummy-auth:unknown:${email || "empty"}`)) => {
    await writeAuthAudit(prisma, {
      eventType: "auth.dummy.login.denied",
      metadataJson: { reasonCode },
      reason,
      result: AuditResult.DENIED,
      targetId,
    }).catch(() => undefined);

    return {
      ok: false as const,
      nextStep: "denied" as const,
      provider: demoAuthProviderId,
      reasonCode,
      safeMessage: "If this email is eligible, the next sign-in step will be shown.",
    };
  };

  if (!email) {
    return denied("DUMMY_AUTH_EMAIL_REQUIRED", "Email is required for dummy provider login.");
  }

  const user = await loadUserByEmail(prisma, email);
  if (!user) {
    return denied("DUMMY_AUTH_UNKNOWN_EMAIL", "Dummy provider denied an unknown email address.");
  }

  if (user.status === UserStatus.SUSPENDED || user.status === UserStatus.LOCKED || user.status === UserStatus.ARCHIVED) {
    return denied("DUMMY_AUTH_USER_NOT_ACTIVE", `Dummy provider denied ${user.status.toLowerCase()} user.`, user.id);
  }

  const assignment = primaryRoleAssignment(user);
  if (!assignment) {
    return denied("DUMMY_AUTH_ROLE_CONTEXT_REQUIRED", "Dummy provider requires a configured role assignment.", user.id);
  }

  const nextStep = user.status === UserStatus.INVITED ? "invite_acceptance_required" : "mfa_required";

  await writeAuthAudit(prisma, {
    actorUserId: user.id,
    clientTenantId: assignment.clientTenantId,
    eventType: nextStep === "mfa_required" ? "auth.dummy.mfa.challenge.created" : "auth.dummy.invite.challenge.created",
    metadataJson: { roleKey: assignment.role.key },
    nextState: nextStep,
    previousState: user.status,
    reason: "Dummy provider accepted existing DB user and role context.",
    result: AuditResult.PENDING,
    targetId: user.id,
  });

  return {
    ok: true,
    challengeId: challengeIdFor(user),
    nextStep,
    provider: demoAuthProviderId,
    user: contextForUser(user, nextStep === "invite_acceptance_required"),
  };
}

export async function verifyDemoMfa(
  prisma: PrismaClient,
  input: { code?: unknown; email?: unknown },
): Promise<DemoAuthMfaResult> {
  const email = normalizeEmail(input.email);
  const code = cleanText(input.code, 12);
  const user = email ? await loadUserByEmail(prisma, email) : null;

  if (!user) {
    throw new DemoAuthProviderError("DUMMY_AUTH_MFA_UNKNOWN_EMAIL", "MFA verification requires a known DB user.", 404);
  }

  const assignment = primaryRoleAssignment(user);
  if (!assignment) {
    await writeAuthAudit(prisma, {
      actorUserId: user.id,
      eventType: "auth.dummy.mfa.denied",
      reason: "MFA denied because no role context is configured.",
      result: AuditResult.DENIED,
      targetId: user.id,
    });
    throw new DemoAuthProviderError("DUMMY_AUTH_ROLE_CONTEXT_REQUIRED", "MFA verification requires a configured role.", 403);
  }

  if (code !== demoAuthMfaCode) {
    await writeAuthAudit(prisma, {
      actorUserId: user.id,
      clientTenantId: assignment.clientTenantId,
      eventType: "auth.dummy.mfa.failed",
      metadataJson: { roleKey: assignment.role.key },
      reason: "Dummy MFA code did not match the accepted demo challenge.",
      result: AuditResult.DENIED,
      targetId: user.id,
    });
    throw new DemoAuthProviderError("DUMMY_AUTH_MFA_INVALID_CODE", "MFA verification failed.", 403);
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
      eventType: "auth.dummy.mfa.verified",
      metadataJson: { roleKey: assignment.role.key },
      nextState: "session_issued",
      previousState: user.status,
      reason: "Dummy MFA challenge verified and session context issued.",
      result: AuditResult.SUCCESS,
      targetId: user.id,
    });

    return saved;
  });

  return {
    session: contextForUser(updated),
    sessionToken: sessionTokenFor(updated),
  };
}

export async function inviteDemoAuthUser(
  prisma: PrismaClient,
  input: {
    actorRoleKey?: unknown;
    displayName?: unknown;
    email?: unknown;
    roleKey?: unknown;
    tenantSlug?: unknown;
  },
): Promise<DemoAuthInviteResult> {
  const parsedActorRole = roleKey(input.actorRoleKey) ?? "admin";
  const parsedRoleKey = roleKey(input.roleKey);
  const parsedTenantSlug = tenantSlug(input.tenantSlug);
  const email = normalizeEmail(input.email);
  const displayName = cleanText(input.displayName) || email;

  if (!email || !parsedRoleKey || !parsedTenantSlug) {
    throw new DemoAuthProviderError("DUMMY_INVITE_INVALID_INPUT", "Invite requires email, role and tenant.", 400);
  }

  if (!inviteActorRoles.has(parsedActorRole)) {
    throw new DemoAuthProviderError("DUMMY_INVITE_ACTOR_DENIED", "Actor cannot invite users.", 403);
  }

  const tenant = demoTenants.find((candidate) => candidate.slug === parsedTenantSlug);
  const role = demoRoles.find((candidate) => candidate.key === parsedRoleKey);
  if (!tenant || !role) {
    throw new DemoAuthProviderError("DUMMY_INVITE_SCOPE_NOT_FOUND", "Invite scope could not be resolved.", 404);
  }

  const actorSession = {
    actor: {
      id: stableId(`dummy-auth:actor:${parsedActorRole}`),
      key: "admin" as const,
      displayName: "Admin Invite Actor",
      initials: "AI",
      email: "admin.invite@alphavest.demo",
      roleKey: parsedActorRole,
    },
    role: demoRoles.find((candidate) => candidate.key === parsedActorRole) ?? demoRoles[9],
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
      platformTenantId: demoPlatformTenantId,
    },
    actorSession.role,
  );

  if (!decision.allowed) {
    throw new DemoAuthProviderError("DUMMY_INVITE_PERMISSION_DENIED", decision.reason, 403);
  }

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      create: {
        displayName,
        email,
        isServiceAccount: false,
        mfaEnabled: false,
        platformTenantId: demoPlatformTenantId,
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
        platformTenantId: demoPlatformTenantId,
      },
    });

    if (!dbRole) {
      throw new DemoAuthProviderError("DUMMY_INVITE_ROLE_NOT_SEEDED", "Invite role is not seeded.", 404);
    }

    await tx.userRole.upsert({
      create: {
        assignedByUserId: undefined,
        clientTenantId: tenant.id,
        id: stableId(`dummy-auth:user-role:${tenant.slug}:${email}:${parsedRoleKey}`),
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
        id: stableId(`dummy-auth:user-role:${tenant.slug}:${email}:${parsedRoleKey}`),
      },
    });

    const reloaded = await loadUserByEmail(tx, email);
    if (!reloaded) {
      throw new DemoAuthProviderError("DUMMY_INVITE_RELOAD_FAILED", "Invited user could not be reloaded.", 500);
    }

    await writeAuthAudit(tx, {
      actorRoleKey: parsedActorRole,
      clientTenantId: tenant.id,
      eventType: "auth.dummy.invitation.created",
      metadataJson: { roleKey: parsedRoleKey },
      nextState: "INVITED",
      previousState: "NONE_OR_EXISTING",
      reason: "Admin created DB-backed dummy-provider invitation.",
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

export async function acceptDemoInvite(
  prisma: PrismaClient,
  input: { consentAccepted?: unknown; email?: unknown; token?: unknown },
): Promise<DemoAuthInviteAcceptResult> {
  const email = normalizeEmail(input.email);
  const token = cleanText(input.token, 80);
  const consentAccepted = input.consentAccepted === true;
  const user = email ? await loadUserByEmail(prisma, email) : null;

  if (!user || token !== inviteTokenFor(user)) {
    throw new DemoAuthProviderError("DUMMY_INVITE_INVALID_TOKEN", "Invite token is invalid or expired.", 404);
  }

  const assignment = primaryRoleAssignment(user);
  if (!assignment) {
    throw new DemoAuthProviderError("DUMMY_INVITE_ROLE_CONTEXT_REQUIRED", "Invite acceptance requires a configured role.", 409);
  }

  if (!consentAccepted) {
    await writeAuthAudit(prisma, {
      actorUserId: user.id,
      clientTenantId: assignment.clientTenantId,
      eventType: "auth.dummy.invitation.blocked",
      reason: "Invite acceptance blocked until required consent is accepted.",
      result: AuditResult.BLOCKED,
      targetId: user.id,
    });
    throw new DemoAuthProviderError("DUMMY_INVITE_CONSENT_REQUIRED", "Consent is required before invite acceptance.", 409);
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
        consentType: "dummy_provider_onboarding",
        id: stableId(`dummy-auth:consent:${user.id}:onboarding`),
        ipAddress: "127.0.0.1",
        source: "dummy-auth-provider",
        status: "accepted",
        userId: user.id,
        version: "2026.06",
      },
      update: {
        acceptedAt: new Date(),
        status: "accepted",
      },
      where: { id: stableId(`dummy-auth:consent:${user.id}:onboarding`) },
    });

    await writeAuthAudit(tx, {
      actorUserId: user.id,
      clientTenantId: assignment.clientTenantId,
      eventType: "auth.dummy.invitation.accepted",
      metadataJson: { roleKey: assignment.role.key },
      nextState: "ACTIVE",
      previousState: user.status,
      reason: "Invited user accepted DB-backed dummy-provider invitation with MFA and consent.",
      result: AuditResult.SUCCESS,
      targetId: user.id,
    });

    const reloaded = await loadUserByEmail(tx, email);
    if (!reloaded) {
      throw new DemoAuthProviderError("DUMMY_INVITE_RELOAD_FAILED", "Accepted user could not be reloaded.", 500);
    }

    return reloaded;
  });

  return {
    accepted: true,
    session: contextForUser(accepted),
  };
}
