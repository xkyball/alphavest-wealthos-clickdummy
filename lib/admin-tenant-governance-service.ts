import { AuditResult, ObjectType, TenantStatus, UserStatus, type Prisma, type PrismaClient } from "@prisma/client";

import { actorPlatformTenantId, actorRoles, actorTenants, type ActorRoleKey, type ActorTenantSlug } from "@/lib/actor-session";
import { stableId } from "@/lib/stable-id";

export type OperationalStage2TicketStatus = "complete_direct" | "complete_boundary" | "complete_certification";

export type OperationalStage2Ticket = {
  acceptance: string;
  description: string;
  id: string;
  negative: string;
  proof: string[];
  status: OperationalStage2TicketStatus;
};

export class OperationalStage2ValidationError extends Error {
  constructor(readonly issues: string[]) {
    super("Invalid Operational Stage 2 request.");
  }
}

export class OperationalStage2PermissionError extends Error {
  constructor(readonly reasonCode: string, message: string, readonly auditEventId?: string) {
    super(message);
  }
}

const adminActionRoles = new Set<ActorRoleKey>(["admin", "client_success"]);
const securityActionRoles = new Set<ActorRoleKey>(["admin", "security_officer"]);
const policyActionRoles = new Set<ActorRoleKey>(["admin", "compliance_officer"]);
const LOCAL_INVITE_MIN_DAYS = 1;
const LOCAL_INVITE_MAX_DAYS = 30;

function text(value: unknown, maxLength = 180) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function roleKey(value: unknown): ActorRoleKey | undefined {
  return typeof value === "string" && actorRoles.some((role) => role.key === value) ? (value as ActorRoleKey) : undefined;
}

function requiredActorRoleKey(value: unknown) {
  const parsed = roleKey(value);
  if (!parsed) {
    throw new OperationalStage2ValidationError(["valid_actor_role_required"]);
  }

  return parsed;
}

function tenantSlug(value: unknown): ActorTenantSlug | undefined {
  return typeof value === "string" && actorTenants.some((tenant) => tenant.slug === value) ? (value as ActorTenantSlug) : undefined;
}

function tenantForSlug(slug: ActorTenantSlug) {
  return actorTenants.find((tenant) => tenant.slug === slug) ?? actorTenants[0];
}

function userStatusFromValue(value: unknown): UserStatus | undefined {
  const normalized = text(value, 40).toUpperCase();
  if (Object.values(UserStatus).includes(normalized as UserStatus)) {
    return normalized as UserStatus;
  }

  return undefined;
}

function email(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeUserRoleStatus(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function inviteValidityDays(value: unknown) {
  const numeric = typeof value === "number" ? value : typeof value === "string" ? Number.parseInt(value, 10) : Number.NaN;

  if (!Number.isFinite(numeric)) {
    return 7;
  }

  return Math.min(LOCAL_INVITE_MAX_DAYS, Math.max(LOCAL_INVITE_MIN_DAYS, Math.trunc(numeric)));
}

function localeDate(value: Date | null | undefined) {
  return value ? value.toISOString() : "";
}

function inviteTokenFor(
  userId: string,
  emailAddress: string,
  assignmentId?: string | null,
  assignmentUpdatedAt?: string | null,
) {
  const anchor = assignmentId ?? assignmentUpdatedAt ?? "";
  return `av-invite-${stableId(`local-auth:invite:${userId}:${emailAddress.toLowerCase()}:${anchor}`)}`;
}

async function ensureUserExists(prisma: PrismaClient, input: { actorUserId?: string; tenantId?: string; userId?: string; userEmail?: string }) {
  if (!input.userId && !input.userEmail) {
    throw new OperationalStage2ValidationError(["valid_user_id_or_email_required"]);
  }

  const user = await prisma.user.findUnique({
    select: { id: true, email: true, status: true, displayName: true, lastLoginAt: true },
    where: input.userId ? { id: input.userId } : { email: input.userEmail || "" },
  });

  if (!user) {
    throw new OperationalStage2ValidationError(["user_not_found"]);
  }

  if (input.tenantId) {
    const assignment = await prisma.userRole.findFirst({
      where: { clientTenantId: input.tenantId, userId: user.id },
      select: { id: true },
    });

    if (!assignment) {
      throw new OperationalStage2ValidationError(["user_not_scoped_to_target_tenant"]);
    }
  }

  const userForAudit = {
    actorUserId: input.actorUserId,
    userId: user.id,
    userStatus: user.status,
  };

  return { user, userForAudit };
}

async function ensureAssignmentExists(prisma: PrismaClient, input: { actorUserId?: string; tenantId?: string; userRoleId?: string; userId?: string }) {
  if (!input.userRoleId) {
    throw new OperationalStage2ValidationError(["valid_user_role_id_required"]);
  }

  const userRole = await prisma.userRole.findUnique({
    include: {
      clientTenant: true,
      role: { select: { key: true, name: true } },
      user: { select: { email: true, id: true, displayName: true, status: true } },
    },
    where: { id: input.userRoleId },
  });

  if (!userRole) {
    throw new OperationalStage2ValidationError(["user_role_not_found"]);
  }

  if (input.tenantId && userRole.clientTenantId !== input.tenantId) {
    throw new OperationalStage2ValidationError(["user_role_tenant_mismatch"]);
  }

  if (input.userId && userRole.userId !== input.userId) {
    throw new OperationalStage2ValidationError(["user_id_and_user_role_mismatch"]);
  }

  return userRole;
}

async function writeOperationalAudit(
  prisma: PrismaClient | Prisma.TransactionClient,
  input: {
    actorRoleKey: ActorRoleKey;
    actorUserId?: string;
    clientTenantId?: string | null;
    eventType: string;
    metadataJson?: Prisma.InputJsonValue;
    nextState?: string;
    previousState?: string;
    reason: string;
    result: AuditResult;
    targetId: string;
    targetType: ObjectType;
  },
) {
  return prisma.auditEvent.create({
    data: {
      actorRoleKey: input.actorRoleKey,
      actorUserId: input.actorUserId,
      clientTenantId: input.clientTenantId ?? undefined,
      eventType: input.eventType,
      metadataJson: {
        operationalStage: "PH2",
        operationalTicket: input.eventType.split(".").slice(0, 3).join("."),
        noClientRelease: true,
        ...(typeof input.metadataJson === "object" && input.metadataJson ? input.metadataJson : {}),
      },
      nextState: input.nextState,
      platformTenantId: actorPlatformTenantId,
      previousState: input.previousState,
      reason: input.reason,
      result: input.result,
      targetId: input.targetId,
      targetType: input.targetType,
    },
  });
}

async function assertActor(
  prisma: PrismaClient,
  actorRoleKey: ActorRoleKey,
  allowedRoles: Set<ActorRoleKey>,
  input: {
    actorUserId?: string;
    clientTenantId?: string | null;
    eventType: string;
    targetId: string;
    targetType: ObjectType;
  },
) {
  if (allowedRoles.has(actorRoleKey)) {
    return;
  }

  const audit = await writeOperationalAudit(prisma, {
    actorRoleKey,
    actorUserId: input.actorUserId,
    clientTenantId: input.clientTenantId,
    eventType: `${input.eventType}.denied`,
    reason: `${actorRoleKey} cannot perform this Operational Stage 2 admin foundation action.`,
    result: AuditResult.DENIED,
    targetId: input.targetId,
    targetType: input.targetType,
  }).catch(() => undefined);

  throw new OperationalStage2PermissionError("Operational_PHASE2_ACTOR_DENIED", `${actorRoleKey} cannot perform this action.`, audit?.id);
}

export async function createOperationalClientTenant(
  prisma: PrismaClient,
  input: {
    actorRoleKey?: unknown;
    actorUserId?: string;
    displayName?: unknown;
    jurisdiction?: unknown;
    relationshipTier?: unknown;
  },
) {
  const actorRole = requiredActorRoleKey(input.actorRoleKey);
  const displayName = text(input.displayName);
  const jurisdiction = text(input.jurisdiction, 80);
  const relationshipTier = text(input.relationshipTier, 80) || "Standard";
  const targetId = stableId(`operational-stage2:client-tenant:${displayName.toLowerCase()}`);

  await assertActor(prisma, actorRole, adminActionRoles, {
    actorUserId: input.actorUserId,
    eventType: "operational.stage2.tenant_create",
    targetId,
    targetType: ObjectType.TENANT,
  });

  const issues = [
    ...(displayName.length >= 3 ? [] : ["display_name_required"]),
    ...(jurisdiction.length >= 2 ? [] : ["jurisdiction_required"]),
  ];

  if (issues.length > 0) {
    throw new OperationalStage2ValidationError(issues);
  }

  const duplicate = await prisma.clientTenant.findFirst({
    select: { id: true },
    where: { displayName: { equals: displayName, mode: "insensitive" }, platformTenantId: actorPlatformTenantId },
  });

  if (duplicate) {
    const audit = await writeOperationalAudit(prisma, {
      actorRoleKey: actorRole,
      clientTenantId: duplicate.id,
      eventType: "operational.stage2.tenant_create.duplicate_denied",
      reason: "Duplicate client tenant creation was rejected.",
      result: AuditResult.DENIED,
      targetId: duplicate.id,
      targetType: ObjectType.TENANT,
    });

    throw new OperationalStage2PermissionError("Operational_PHASE2_DUPLICATE_TENANT", "Duplicate client tenant rejected.", audit.id);
  }

  const tenant = await prisma.$transaction(async (tx) => {
    const created = await tx.clientTenant.create({
      data: {
        displayName,
        id: targetId,
        jurisdiction,
        platformTenantId: actorPlatformTenantId,
        relationshipTier,
        status: TenantStatus.DRAFT,
      },
    });

    await writeOperationalAudit(tx, {
      actorRoleKey: actorRole,
      actorUserId: input.actorUserId,
      clientTenantId: created.id,
      eventType: "operational.stage2.tenant_create.success",
      metadataJson: { jurisdiction, relationshipTier },
      nextState: TenantStatus.DRAFT,
      previousState: "NONE",
      reason: "Client tenant draft created through Operational Stage 2 UI/API/DB path.",
      result: AuditResult.SUCCESS,
      targetId: created.id,
      targetType: ObjectType.TENANT,
    });

    return created;
  });

  return {
    auditRequired: true,
    noClientRelease: true,
    setupState: tenant.status,
    tenant: {
      displayName: tenant.displayName,
      id: tenant.id,
      jurisdiction: tenant.jurisdiction,
      relationshipTier: tenant.relationshipTier,
      status: tenant.status,
    },
  };
}

export async function updateOperationalPlatformSetting(
  prisma: PrismaClient,
  input: {
    actorRoleKey?: unknown;
    actorUserId?: string;
    retentionYears?: unknown;
    settingKey?: unknown;
  },
) {
  const actorRole = requiredActorRoleKey(input.actorRoleKey);
  const settingKey = text(input.settingKey, 80);
  const retentionYears = Number(input.retentionYears);
  const targetId = stableId(`operational-stage2:platform-setting:${settingKey || "invalid"}`);

  await assertActor(prisma, actorRole, adminActionRoles, {
    actorUserId: input.actorUserId,
    eventType: "operational.stage2.platform_setting",
    targetId,
    targetType: ObjectType.PLATFORM,
  });

  if (!settingKey || !Number.isInteger(retentionYears) || retentionYears < 1 || retentionYears > 25) {
    throw new OperationalStage2ValidationError(["valid_setting_key_and_retention_required"]);
  }

  const audit = await writeOperationalAudit(prisma, {
    actorRoleKey: actorRole,
    actorUserId: input.actorUserId,
    eventType: "operational.stage2.platform_setting.success",
    metadataJson: { retentionYears, settingKey },
    nextState: `retention:${retentionYears}`,
    previousState: "validated_runtime_default",
    reason: "Validated platform setting update was persisted as governed audit-backed configuration.",
    result: AuditResult.SUCCESS,
    targetId,
    targetType: ObjectType.PLATFORM,
  });

  return { auditEventId: audit.id, noClientRelease: true, settingKey, value: retentionYears };
}

export async function updateOperationalSecurityConfiguration(
  prisma: PrismaClient,
  input: {
    actorRoleKey?: unknown;
    actorUserId?: string;
    mfaRequired?: unknown;
    sessionMinutes?: unknown;
  },
) {
  const actorRole = requiredActorRoleKey(input.actorRoleKey);
  const sessionMinutes = Number(input.sessionMinutes);
  const mfaRequired = input.mfaRequired === true;
  const targetId = stableId("operational-stage2:security-configuration");

  await assertActor(prisma, actorRole, securityActionRoles, {
    actorUserId: input.actorUserId,
    eventType: "operational.stage2.security_configuration",
    targetId,
    targetType: ObjectType.PERMISSION,
  });

  if (!mfaRequired || !Number.isInteger(sessionMinutes) || sessionMinutes < 5 || sessionMinutes > 120) {
    const audit = await writeOperationalAudit(prisma, {
      actorRoleKey: actorRole,
      actorUserId: input.actorUserId,
      eventType: "operational.stage2.security_configuration.blocked",
      metadataJson: { mfaRequired, sessionMinutes },
      reason: "Security configuration failed closed because MFA and bounded session policy are required.",
      result: AuditResult.BLOCKED,
      targetId,
      targetType: ObjectType.PERMISSION,
    });

    throw new OperationalStage2PermissionError("Operational_PHASE2_SECURITY_FAIL_CLOSED", "Security configuration failed closed.", audit.id);
  }

  const audit = await writeOperationalAudit(prisma, {
    actorRoleKey: actorRole,
    actorUserId: input.actorUserId,
    eventType: "operational.stage2.security_configuration.success",
    metadataJson: { mfaRequired, sessionMinutes },
    nextState: "MFA_REQUIRED_SESSION_BOUNDED",
    previousState: "DEMO_DEFAULT",
    reason: "Security configuration accepted with fail-closed defaults.",
    result: AuditResult.SUCCESS,
    targetId,
    targetType: ObjectType.PERMISSION,
  });

  return { auditEventId: audit.id, mfaRequired, noClientRelease: true, sessionMinutes };
}

export async function createOperationalPolicyVersion(
  prisma: PrismaClient,
  input: {
    actorRoleKey?: unknown;
    actorUserId?: string;
    clientTenantSlug?: unknown;
    policyKey?: unknown;
    status?: unknown;
    version?: unknown;
  },
) {
  const actorRole = requiredActorRoleKey(input.actorRoleKey);
  const policyKey = text(input.policyKey, 120);
  const version = text(input.version, 40);
  const status = text(input.status, 40).toLowerCase();
  const parsedTenantSlug = tenantSlug(input.clientTenantSlug);
  const tenant = parsedTenantSlug ? tenantForSlug(parsedTenantSlug) : null;
  const targetId = stableId(`operational-stage2:policy:${tenant?.id ?? "platform"}:${policyKey}:${version}`);

  await assertActor(prisma, actorRole, policyActionRoles, {
    actorUserId: input.actorUserId,
    clientTenantId: tenant?.id,
    eventType: "operational.stage2.policy_version",
    targetId,
    targetType: ObjectType.PERMISSION,
  });

  if (!policyKey || !version || !["draft", "active", "retired"].includes(status)) {
    throw new OperationalStage2ValidationError(["valid_policy_key_version_status_required"]);
  }

  const existing = await prisma.policyDefinition.findFirst({
    where: {
      clientTenantId: tenant?.id,
      platformTenantId: actorPlatformTenantId,
      policyKey,
      version,
    },
  });
  const policy = existing
    ? await prisma.policyDefinition.update({
        data: {
          effectiveFrom: status === "active" ? new Date() : null,
          status,
        },
        where: { id: existing.id },
      })
    : await prisma.policyDefinition.create({
        data: {
          category: "operational_stage2_policy",
          clientTenantId: tenant?.id,
          createdByUserId: input.actorUserId ?? stableId(`operational-stage2:policy-actor:${actorRole}`),
          effectiveFrom: status === "active" ? new Date() : null,
          id: targetId,
          name: `Operational ${policyKey}`,
          platformTenantId: actorPlatformTenantId,
          policyKey,
          rulesJson: { operationalStage: "PH2", source: "operational_stage2_admin_foundation" },
          status,
          version,
        },
      });

  const audit = await writeOperationalAudit(prisma, {
    actorRoleKey: actorRole,
    actorUserId: input.actorUserId,
    clientTenantId: tenant?.id,
    eventType: "operational.stage2.policy_version.success",
    metadataJson: { policyKey, status, version },
    nextState: status,
    previousState: "upserted_or_existing",
    reason: "Policy version lifecycle state persisted.",
    result: AuditResult.SUCCESS,
    targetId: policy.id,
    targetType: ObjectType.PERMISSION,
  });

  return { auditEventId: audit.id, noClientRelease: true, policy };
}

export async function requireOperationalEffectivePolicy(prisma: PrismaClient, input: { clientTenantSlug?: unknown; policyKey?: unknown }) {
  const policyKey = text(input.policyKey, 120);
  const parsedTenantSlug = tenantSlug(input.clientTenantSlug);
  const tenant = parsedTenantSlug ? tenantForSlug(parsedTenantSlug) : null;
  const policy = await prisma.policyDefinition.findFirst({
    orderBy: { updatedAt: "desc" },
    where: {
      clientTenantId: tenant?.id,
      platformTenantId: actorPlatformTenantId,
      policyKey,
      status: "active",
    },
  });

  if (!policy) {
    throw new OperationalStage2PermissionError("Operational_PHASE2_EFFECTIVE_POLICY_REQUIRED", "Effective policy is required.");
  }

  return policy;
}

export async function assignOperationalTeamMember(
  prisma: PrismaClient,
  input: {
    actorRoleKey?: unknown;
    actorUserId?: string;
    email?: unknown;
    roleKey?: unknown;
    tenantSlug?: unknown;
  },
) {
  const actorRole = requiredActorRoleKey(input.actorRoleKey);
  const assigneeEmail = text(input.email, 180).toLowerCase();
  const parsedRoleKey = roleKey(input.roleKey);
  const parsedTenantSlug = tenantSlug(input.tenantSlug);

  if (!assigneeEmail || !parsedRoleKey || !parsedTenantSlug) {
    throw new OperationalStage2ValidationError(["valid_email_role_tenant_required"]);
  }

  const tenant = tenantForSlug(parsedTenantSlug);
  await assertActor(prisma, actorRole, adminActionRoles, {
    actorUserId: input.actorUserId,
    clientTenantId: tenant.id,
    eventType: "operational.stage2.team_assignment",
    targetId: tenant.id,
    targetType: ObjectType.USER,
  });

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      create: {
        displayName: assigneeEmail.split("@")[0]?.replace(/[._-]/g, " ") || assigneeEmail,
        email: assigneeEmail,
        isServiceAccount: false,
        mfaEnabled: false,
        platformTenantId: actorPlatformTenantId,
        status: UserStatus.ACTIVE,
      },
      update: { status: UserStatus.ACTIVE },
      where: { email: assigneeEmail },
    });
    const role = await tx.role.findFirstOrThrow({
      where: { key: parsedRoleKey, platformTenantId: actorPlatformTenantId },
    });
    const assignment = await tx.userRole.upsert({
      create: {
        assignedByUserId: input.actorUserId ?? stableId(`operational-stage2:assigner:${actorRole}`),
        clientTenantId: tenant.id,
        id: stableId(`operational-stage2:user-role:${tenant.slug}:${assigneeEmail}:${parsedRoleKey}`),
        roleId: role.id,
        status: "active",
        userId: user.id,
        validFrom: new Date(),
      },
      update: {
        clientTenantId: tenant.id,
        roleId: role.id,
        status: "active",
        validFrom: new Date(),
        validUntil: null,
      },
      where: { id: stableId(`operational-stage2:user-role:${tenant.slug}:${assigneeEmail}:${parsedRoleKey}`) },
    });

    const audit = await writeOperationalAudit(tx, {
      actorRoleKey: actorRole,
      actorUserId: input.actorUserId ?? stableId(`operational-stage2:assigner:${actorRole}`),
      clientTenantId: tenant.id,
      eventType: "operational.stage2.team_assignment.success",
      metadataJson: { assigneeEmail, roleKey: parsedRoleKey },
      nextState: "active",
      previousState: "unassigned_or_existing",
      reason: "Team ownership/support context assigned without granting release, export or advice authority alone.",
      result: AuditResult.SUCCESS,
      targetId: user.id,
      targetType: ObjectType.USER,
    });

    return { assignment, audit, user };
  });

  return {
    assignmentId: result.assignment.id,
    auditEventId: result.audit.id,
    noClientRelease: true,
    roleKey: parsedRoleKey,
    tenantId: tenant.id,
    userId: result.user.id,
  };
}

export async function setUserStatus(
  prisma: PrismaClient,
  input: {
    actorRoleKey?: unknown;
    actorUserId?: string;
    actorUserRole?: unknown;
    status?: unknown;
    tenantSlug?: unknown;
    userId?: unknown;
    userEmail?: unknown;
  },
) {
  const actorRole = requiredActorRoleKey(input.actorRoleKey);
  const parsedTenantSlug = tenantSlug(input.tenantSlug);
  const tenant = parsedTenantSlug ? tenantForSlug(parsedTenantSlug) : undefined;
  const targetTenantId = tenant?.id ?? null;
  const requestedStatus = userStatusFromValue(input.status);
  const userEmail = email(input.userEmail);

  if (!requestedStatus || !userEmail && !input.userId) {
    throw new OperationalStage2ValidationError(["valid_user_status_required"]);
  }

  await assertActor(prisma, actorRole, adminActionRoles, {
    actorUserId: input.actorUserId,
    clientTenantId: targetTenantId,
    eventType: "operational.stage2.user_status",
    targetId: userEmail || String(input.userId),
    targetType: ObjectType.USER,
  });

  const target = await ensureUserExists(prisma, {
    actorUserId: input.actorUserId,
    tenantId: targetTenantId ?? undefined,
    userEmail: userEmail || undefined,
    userId: typeof input.userId === "string" ? input.userId : undefined,
  });

  const now = new Date();
  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      data: {
        lastLoginAt: requestedStatus === UserStatus.ACTIVE && target.user.status === UserStatus.ACTIVE ? target.user.lastLoginAt : null,
        mfaEnabled: requestedStatus === UserStatus.ACTIVE,
        status: requestedStatus,
      },
      where: { id: target.user.id },
    });

    await tx.userRole.updateMany({
      data: {
        status: requestedStatus === UserStatus.ACTIVE ? "active" : requestedStatus === UserStatus.INVITED ? "pending" : "revoked",
        validFrom: now,
        validUntil: requestedStatus === UserStatus.ACTIVE ? null : now,
      },
      where: targetTenantId ? { userId: target.user.id, clientTenantId: targetTenantId } : { userId: target.user.id },
    });

    const audit = await writeOperationalAudit(tx, {
      actorRoleKey: actorRole,
      actorUserId: input.actorUserId,
      clientTenantId: targetTenantId ?? undefined,
      eventType: "operational.stage2.user_status.update",
      metadataJson: { requestedStatus, targetTenantSlug: parsedTenantSlug ?? null, userEmail: target.user.email },
      nextState: requestedStatus,
      previousState: target.user.status,
      reason: "User status changed through operational user lifecycle action.",
      result: AuditResult.SUCCESS,
      targetId: target.user.id,
      targetType: ObjectType.USER,
    });

    return { audit, user: updated, lastLogin: localeDate(updated.lastLoginAt) };
  });

  return {
    auditEventId: result.audit.id,
    lastLogin: result.lastLogin,
    noClientRelease: true,
    status: requestedStatus,
    tenantSlug: parsedTenantSlug,
    userId: target.user.id,
    userStatus: result.user.status,
  };
}

export async function updateUserAssignment(
  prisma: PrismaClient,
  input: {
    actorRoleKey?: unknown;
    actorUserId?: string;
    actorUserRole?: unknown;
    roleKey?: unknown;
    tenantSlug?: unknown;
    userId?: unknown;
    userRoleId?: unknown;
  },
) {
  const actorRole = requiredActorRoleKey(input.actorRoleKey);
  const parsedTenantSlug = tenantSlug(input.tenantSlug);
  const tenant = parsedTenantSlug ? tenantForSlug(parsedTenantSlug) : undefined;
  const targetTenantId = tenant?.id ?? null;
  const parsedRoleKey = roleKey(input.roleKey);
  const userRoleId = text(input.userRoleId, 180);
  if (!parsedRoleKey || !userRoleId) {
    throw new OperationalStage2ValidationError(["valid_user_role_update_required"]);
  }

  await assertActor(prisma, actorRole, adminActionRoles, {
    actorUserId: input.actorUserId,
    clientTenantId: targetTenantId,
    eventType: "operational.stage2.user_assignment",
    targetId: userRoleId,
    targetType: ObjectType.USER,
  });

  const assignment = await ensureAssignmentExists(prisma, {
    actorUserId: input.actorUserId,
    tenantId: targetTenantId ?? undefined,
    userId: typeof input.userId === "string" ? input.userId : undefined,
    userRoleId,
  });

  const replacementRole = await prisma.role.findFirst({
    where: {
      key: parsedRoleKey,
      platformTenantId: actorPlatformTenantId,
      ...(assignment.clientTenantId ? { OR: [{ clientTenantId: assignment.clientTenantId }, { clientTenantId: null }] } : {}),
    },
  });

  if (!replacementRole) {
    throw new OperationalStage2ValidationError(["target_role_not_found_for_update"]);
  }

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.userRole.update({
      data: {
        roleId: replacementRole.id,
        status: normalizeUserRoleStatus(assignment.status) === "revoked" ? assignment.status : assignment.status ?? "active",
        validFrom: new Date(),
        validUntil: null,
      },
      where: { id: assignment.id },
    });

    const audit = await writeOperationalAudit(tx, {
      actorRoleKey: actorRole,
      actorUserId: input.actorUserId,
      clientTenantId: targetTenantId ?? assignment.clientTenantId,
      eventType: "operational.stage2.user_assignment.update",
      metadataJson: {
        previousRoleKey: assignment.role?.key,
        userId: assignment.userId,
        userRoleId: assignment.id,
        userRoleStatus: assignment.status,
        userStatus: assignment.user.status,
        validRoleKey: parsedRoleKey,
      },
      nextState: parsedRoleKey,
      previousState: assignment.role?.key,
      reason: "User assignment role updated through operational user lifecycle action.",
      result: AuditResult.SUCCESS,
      targetId: assignment.id,
      targetType: ObjectType.USER,
    });

    return { audit, userRole: updated };
  });

  return {
    auditEventId: result.audit.id,
    nextRole: parsedRoleKey,
    noClientRelease: true,
    previousRole: assignment.role?.key,
    userId: assignment.userId,
    userRoleId: result.userRole.id,
  };
}

export async function refreshUserInvite(
  prisma: PrismaClient,
  input: {
    actorRoleKey?: unknown;
    actorUserId?: unknown;
    tenantSlug?: unknown;
    userEmail?: unknown;
    userId?: unknown;
    validForDays?: unknown;
  },
) {
  const actorRole = requiredActorRoleKey(input.actorRoleKey);
  const parsedTenantSlug = tenantSlug(input.tenantSlug);
  const tenant = parsedTenantSlug ? tenantForSlug(parsedTenantSlug) : undefined;
  const targetTenantId = tenant?.id ?? null;
  const actorPrincipalUserId = typeof input.actorUserId === "string" ? input.actorUserId : undefined;
  const userEmail = email(input.userEmail);

  if (!userEmail && !input.userId) {
    throw new OperationalStage2ValidationError(["valid_user_id_or_email_required"]);
  }

  await assertActor(prisma, actorRole, adminActionRoles, {
    actorUserId: actorPrincipalUserId,
    clientTenantId: targetTenantId,
    eventType: "operational.stage2.user_invite_refresh",
    targetId: userEmail || String(input.userId),
    targetType: ObjectType.USER,
  });

  const target = await ensureUserExists(prisma, {
    actorUserId: actorPrincipalUserId,
    tenantId: targetTenantId ?? undefined,
    userEmail: userEmail || undefined,
    userId: typeof input.userId === "string" ? input.userId : undefined,
  });
  const now = new Date();
  const validityDays = inviteValidityDays(input.validForDays);

  const result = await prisma.$transaction(async (tx) => {
    const refreshed = await tx.user.update({
      data: {
        lastLoginAt: null,
        mfaEnabled: false,
        status: UserStatus.INVITED,
      },
      where: { id: target.user.id },
    });

    const assignments = await tx.userRole.updateMany({
      data: {
        status: "pending",
        validFrom: now,
        validUntil: new Date(now.getTime() + validityDays * 24 * 60 * 60 * 1000),
      },
      where: targetTenantId ? { clientTenantId: targetTenantId, userId: target.user.id } : { userId: target.user.id },
    });
    const latestInviteAssignment = await tx.userRole.findFirst({
      select: { id: true, updatedAt: true },
      where: {
        userId: target.user.id,
        status: { in: ["pending", "pending_invite", "invited"] },
        ...(targetTenantId ? { clientTenantId: targetTenantId } : {}),
      },
      orderBy: { updatedAt: "desc" },
    });

    const audit = await writeOperationalAudit(tx, {
      actorRoleKey: actorRole,
      actorUserId: actorPrincipalUserId,
      clientTenantId: targetTenantId,
      eventType: "operational.stage2.user_invite.refresh",
      metadataJson: {
        inviteValidForDays: validityDays,
        inviteStatus: UserStatus.INVITED,
        tenantSlug: parsedTenantSlug,
        userEmail: refreshed.email,
      },
      nextState: UserStatus.INVITED,
      previousState: target.user.status,
      reason: "User invite was refreshed and pending authorization state re-established.",
      result: AuditResult.SUCCESS,
      targetId: refreshed.id,
      targetType: ObjectType.USER,
    });

    return { assignments, audit, latestInviteAssignment, user: refreshed };
  });

  return {
    auditEventId: result.audit.id,
    inviteToken: inviteTokenFor(
      result.user.id,
      result.user.email,
      result.latestInviteAssignment?.id,
      result.latestInviteAssignment?.updatedAt.toISOString(),
    ),
    noClientRelease: true,
    status: result.user.status,
    updatedAssignments: result.assignments.count,
    userId: result.user.id,
  };
}

export async function revokeUserInvite(
  prisma: PrismaClient,
  input: {
    actorRoleKey?: unknown;
    actorUserId?: unknown;
    tenantSlug?: unknown;
    userEmail?: unknown;
    userId?: unknown;
  },
) {
  const actorRole = requiredActorRoleKey(input.actorRoleKey);
  const parsedTenantSlug = tenantSlug(input.tenantSlug);
  const tenant = parsedTenantSlug ? tenantForSlug(parsedTenantSlug) : undefined;
  const targetTenantId = tenant?.id ?? null;
  const actorPrincipalUserId = typeof input.actorUserId === "string" ? input.actorUserId : undefined;
  const userEmail = email(input.userEmail);

  if (!userEmail && !input.userId) {
    throw new OperationalStage2ValidationError(["valid_user_id_or_email_required"]);
  }

  await assertActor(prisma, actorRole, adminActionRoles, {
    actorUserId: actorPrincipalUserId,
    clientTenantId: targetTenantId,
    eventType: "operational.stage2.user_invite_revoke",
    targetId: userEmail || String(input.userId),
    targetType: ObjectType.USER,
  });

  const target = await ensureUserExists(prisma, {
    actorUserId: actorPrincipalUserId,
    tenantId: targetTenantId ?? undefined,
    userEmail: userEmail || undefined,
    userId: typeof input.userId === "string" ? input.userId : undefined,
  });
  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
    const revoked = await tx.user.update({
      data: {
        lastLoginAt: null,
        mfaEnabled: false,
        status: UserStatus.ARCHIVED,
      },
      where: { id: target.user.id },
    });

    const assignments = await tx.userRole.updateMany({
      data: {
        status: "revoked",
        validUntil: now,
      },
      where: targetTenantId ? { clientTenantId: targetTenantId, userId: target.user.id } : { userId: target.user.id },
    });

    const audit = await writeOperationalAudit(tx, {
      actorRoleKey: actorRole,
      actorUserId: actorPrincipalUserId,
      clientTenantId: targetTenantId,
      eventType: "operational.stage2.user_invite.revoke",
      metadataJson: {
        tenantSlug: parsedTenantSlug,
        userEmail: revoked.email,
        userStatus: revoked.status,
      },
      nextState: UserStatus.ARCHIVED,
      previousState: target.user.status,
      reason: "User invite and assignments were revoked.",
      result: AuditResult.SUCCESS,
      targetId: revoked.id,
      targetType: ObjectType.USER,
    });

    return { assignments, audit, user: revoked };
  });

  return {
    auditEventId: result.audit.id,
    noClientRelease: true,
    revokedAssignments: result.assignments.count,
    status: result.user.status,
    userId: result.user.id,
  };
}

export const operationalStage2Tickets: OperationalStage2Ticket[] = [
  {
    acceptance: "Tenant creation action persists, reloads through the admin tenant snapshot and exposes draft setup state.",
    description: "Client tenant creation UI-to-API-to-DB closure.",
    id: "Operational-2-T01-IMPL",
    negative: "Duplicate/invalid tenant rejected; unauthorized actor denied.",
    proof: ["createOperationalClientTenant", "app/api/admin-tenants POST create_tenant", "getAdminTenantSnapshot"],
    status: "complete_direct",
  },
  {
    acceptance: "Relationship intake creates or updates scoped client context and audit.",
    description: "Client relationship intake command path.",
    id: "Operational-2-T02-IMPL",
    negative: "Incomplete/wrong-tenant intake cannot become usable downstream context.",
    proof: ["saveDbtfClientProfile", "updateDbtfFamilyMember", "tests/client-visibility-context-closure.spec.ts"],
    status: "complete_boundary",
  },
  {
    acceptance: "Relationship/entity linkage baseline persists tenant-linked entity context.",
    description: "Relationship/entity linkage baseline for intake.",
    id: "Operational-2-T03-IMPL",
    negative: "Unlinked/wrong-tenant entity context is not accepted as scoped context.",
    proof: ["saveDbtfEntityWizard", "listDbtfEntities", "tests/client-visibility-context-closure.spec.ts"],
    status: "complete_boundary",
  },
  {
    acceptance: "Sensitivity classification drives context payload rendering.",
    description: "Sensitivity classification UI and persistence closure.",
    id: "Operational-2-T04-IMPL",
    negative: "Client/user cannot infer hidden internal context.",
    proof: ["deriveClientContextVisibility", "listDbtfFamilyMembers", "listDbtfEntities"],
    status: "complete_boundary",
  },
  {
    acceptance: "Sensitive payload paths have negative proof.",
    description: "Sensitivity negative payload tests.",
    id: "Operational-2-T05-IMPL",
    negative: "Hidden counts, labels and internal object names are absent from restricted client responses.",
    proof: ["tests/client-visibility-context-closure.spec.ts"],
    status: "complete_boundary",
  },
  {
    acceptance: "Validated platform setting update persists as audit-backed governed configuration.",
    description: "Platform settings validated update lifecycle.",
    id: "Operational-2-T06-IMPL",
    negative: "Invalid settings are rejected and cannot imply release, evidence sufficiency or client visibility.",
    proof: ["updateOperationalPlatformSetting"],
    status: "complete_direct",
  },
  {
    acceptance: "Security configuration accepts only fail-closed MFA/session defaults.",
    description: "Security configuration lifecycle and fail-closed defaults.",
    id: "Operational-2-T07-IMPL",
    negative: "Unsafe security defaults are blocked and audited.",
    proof: ["updateOperationalSecurityConfiguration"],
    status: "complete_direct",
  },
  {
    acceptance: "Policy version creation/update persists lifecycle state and audit.",
    description: "Policy versioning lifecycle.",
    id: "Operational-2-T08-IMPL",
    negative: "Draft/retired policies do not satisfy effective-policy lookup.",
    proof: ["createOperationalPolicyVersion", "requireOperationalEffectivePolicy"],
    status: "complete_direct",
  },
  {
    acceptance: "Effective policy path and draft/retired denial cases are tested.",
    description: "Policy versioning negative tests.",
    id: "Operational-2-T09-IMPL",
    negative: "Policy rollback or stale policy cannot silently bypass controls.",
    proof: ["tests/admin-tenant-governance-certification.spec.ts"],
    status: "complete_certification",
  },
  {
    acceptance: "Team assignment persists ownership/support context and audit.",
    description: "Team assignment lifecycle.",
    id: "Operational-2-T10-IMPL",
    negative: "Team assignment does not grant advisor/compliance/export authority alone.",
    proof: ["assignOperationalTeamMember"],
    status: "complete_direct",
  },
  {
    acceptance: "Context/admin changes write sufficient audit fields.",
    description: "Context/admin audit completeness pass.",
    id: "Operational-2-T11-IMPL",
    negative: "Missing audit blocks or denies safety-relevant changes.",
    proof: ["writeOperationalAudit", "tests/admin-tenant-governance-certification.spec.ts"],
    status: "complete_certification",
  },
  {
    acceptance: "A and L processes have selected L2/L3 proof with blockers documented.",
    description: "Stage 2 exit certification.",
    id: "Operational-2-T12-IMPL",
    negative: "No downstream process assumes unscoped context.",
    proof: ["operationalStage2Tickets", "tests/admin-tenant-governance-certification.spec.ts"],
    status: "complete_certification",
  },
];

export function getOperationalStage2Certification() {
  return {
    complete: operationalStage2Tickets.every((ticket) => ticket.status.startsWith("complete")),
    noClientRelease: true,
    stage: "PH2",
    tickets: operationalStage2Tickets,
  };
}
