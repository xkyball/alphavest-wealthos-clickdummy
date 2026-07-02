import {
  AuditResult,
  EntityType,
  ObjectType,
  Prisma,
  Sensitivity,
  type PrismaClient,
} from "@prisma/client";

import {
  actorPlatformTenantId,
  actorTenants,
  requireActorSession,
  type ActorRoleKey,
  type ActorTenantSlug,
} from "@/lib/actor-session";
import { permissionEngine } from "@/lib/permission-engine";

export class DbtfValidationError extends Error {
  constructor(readonly issues: string[]) {
    super("Invalid DBTF form request.");
  }
}

export class DbtfPermissionError extends Error {
  constructor(readonly reason: string, readonly auditEventId?: string) {
    super(reason);
  }
}

export class DbtfNotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export type DbtfClientProfile = {
  countryOfResidence: string;
  dateOfBirth: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string;
  relationshipLabel: string;
  sensitivity: string;
  source: "Account profile";
  updatedAt: string;
};

export type DbtfClientAccountProfile = {
  activeSessions: Array<{
    createdAt: string;
    expiresAt: string;
    id: string;
    lastSeenAt: string;
    providerId: string;
    roleKey: string;
  }>;
  actorId: string;
  displayName: string;
  email: string;
  lastLoginAt: string | null;
  mfaEnabled: boolean;
  notificationDigest: boolean;
  notificationEmail: boolean;
  notificationSecurity: boolean;
  preferredLocale: string;
  profileImageUrl: string;
  status: string;
  timezone: string;
};

export type DbtfClientProfileInput = {
  countryOfResidence?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  phone?: unknown;
  relationshipLabel?: unknown;
};

export type DbtfClientAccountProfileInput = {
  displayName?: unknown;
  notificationDigest?: unknown;
  notificationEmail?: unknown;
  notificationSecurity?: unknown;
  preferredLocale?: unknown;
  timezone?: unknown;
};

export type DbtfFamilyMemberInput = {
  displayName?: unknown;
  id?: unknown;
  relationshipType?: unknown;
  taxResidency?: unknown;
};

export type DbtfEntityWizardInput = {
  entityType?: unknown;
  jurisdiction?: unknown;
  name?: unknown;
  ownerSummary?: unknown;
  registrationNumber?: unknown;
  riskRating?: unknown;
  status?: unknown;
};

const profileEditRoles = new Set<ActorRoleKey>([
  "analyst",
  "client_success",
  "compliance_officer",
  "external_advisor",
  "family_cfo",
  "next_gen",
  "principal",
  "senior_wealth_advisor",
  "trustee",
]);
const familyEditRoles = new Set<ActorRoleKey>(["principal", "family_cfo", "client_success", "compliance_officer"]);
const accountEditRoles = new Set<ActorRoleKey>([
  "analyst",
  "client_success",
  "compliance_officer",
  "family_cfo",
  "next_gen",
  "principal",
  "senior_wealth_advisor",
  "trustee",
]);
const entityCreateRoles = new Set<ActorRoleKey>(["family_cfo", "analyst", "senior_wealth_advisor", "compliance_officer"]);

function cleanText(value: unknown, maxLength = 160) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function formatDateOnly(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : "";
}

function formatDateTime(value: Date | null) {
  return value ? value.toISOString() : null;
}

function booleanPreference(value: unknown) {
  return value === true;
}

function mapProfile(profile: {
  countryOfResidence: string | null;
  dateOfBirth: Date | null;
  firstName: string | null;
  id: string;
  lastName: string | null;
  phone: string | null;
  relationshipLabel: string | null;
  sensitivity: Sensitivity;
  updatedAt: Date;
}): DbtfClientProfile {
  return {
    countryOfResidence: profile.countryOfResidence ?? "",
    dateOfBirth: formatDateOnly(profile.dateOfBirth),
    firstName: profile.firstName ?? "",
    id: profile.id,
    lastName: profile.lastName ?? "",
    phone: profile.phone ?? "",
    relationshipLabel: profile.relationshipLabel ?? "",
    sensitivity: profile.sensitivity,
    source: "Account profile",
    updatedAt: profile.updatedAt.toISOString(),
  };
}

function nameParts(displayName: string) {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

async function loadOrCreateActorProfile(
  prisma: PrismaClient | Prisma.TransactionClient,
  input: {
    clientTenantId: string;
    userId: string;
  },
) {
  const existing = await prisma.userProfile.findFirst({
    where: {
      clientTenantId: input.clientTenantId,
      userId: input.userId,
    },
  });

  if (existing) {
    return existing;
  }

  const user = await prisma.user.findUnique({
    select: { displayName: true },
    where: { id: input.userId },
  });
  const names = nameParts(user?.displayName ?? "");

  return prisma.userProfile.create({
    data: {
      clientTenantId: input.clientTenantId,
      countryOfResidence: "",
      firstName: names.firstName || null,
      lastName: names.lastName || null,
      relationshipLabel: "Account owner",
      sensitivity: Sensitivity.CONFIDENTIAL,
      userId: input.userId,
    },
  });
}

function mapClientAccountProfile(profile: {
  userSessions?: Array<{
    createdAt: Date;
    expiresAt: Date;
    id: string;
    lastSeenAt: Date;
    providerId: string;
    roleKey: string | null;
  }>;
  displayName: string;
  email: string;
  id: string;
  lastLoginAt: Date | null;
  mfaEnabled: boolean;
  notificationDigest: boolean;
  notificationEmail: boolean;
  notificationSecurity: boolean;
  preferredLocale: string | null;
  profileImageStorageKey: string | null;
  status: string;
  timezone: string | null;
  updatedAt: Date;
}): DbtfClientAccountProfile {
  return {
    activeSessions: (profile.userSessions ?? []).map((session) => ({
      createdAt: formatDateTime(session.createdAt) ?? "",
      expiresAt: formatDateTime(session.expiresAt) ?? "",
      id: session.id,
      lastSeenAt: formatDateTime(session.lastSeenAt) ?? "",
      providerId: session.providerId,
      roleKey: session.roleKey ?? "account",
    })),
    actorId: profile.id,
    displayName: profile.displayName,
    email: profile.email,
    lastLoginAt: formatDateTime(profile.lastLoginAt),
    mfaEnabled: profile.mfaEnabled,
    notificationDigest: profile.notificationDigest,
    notificationEmail: profile.notificationEmail,
    notificationSecurity: profile.notificationSecurity,
    preferredLocale: profile.preferredLocale ?? "",
    profileImageUrl: profile.profileImageStorageKey ? `/api/profile/avatar?v=${encodeURIComponent(profile.updatedAt.toISOString())}` : "",
    status: profile.status,
    timezone: profile.timezone ?? "",
  };
}

async function writeAudit(
  prisma: PrismaClient | Prisma.TransactionClient,
  input: {
    actorRoleKey: ActorRoleKey;
    actorUserId?: string;
    clientTenantId: string;
    eventType: string;
    nextState?: string;
    platformTenantId: string;
    previousState?: string;
    reason?: string;
    result: AuditResult;
    targetId: string;
    targetType: ObjectType;
  },
) {
  return prisma.auditEvent.create({
    data: {
      actorRoleKey: input.actorRoleKey,
      actorUserId: input.actorUserId,
      clientTenantId: input.clientTenantId,
      eventType: input.eventType,
      nextState: input.nextState,
      platformTenantId: input.platformTenantId,
      previousState: input.previousState,
      reason: input.reason,
      result: input.result,
      targetId: input.targetId,
      targetType: input.targetType,
    },
  });
}

function assertRole(roleKey: ActorRoleKey, allowedRoles: Set<ActorRoleKey>, label: string) {
  if (!allowedRoles.has(roleKey)) {
    throw new DbtfPermissionError(`${label} is not allowed for ${roleKey}.`);
  }
}

function targetTenant(tenantSlug: ActorTenantSlug) {
  return actorTenants.find((tenant) => tenant.slug === tenantSlug) ?? actorTenants[0];
}

async function assertActorCanUseTargetTenant(
  prisma: PrismaClient,
  input: {
    actorTenantSlug?: ActorTenantSlug;
    eventType: string;
    roleKey: ActorRoleKey;
    targetId: string;
    targetTenantSlug: ActorTenantSlug;
    targetType: ObjectType;
    writeDeniedAudit?: boolean;
  },
) {
  const target = targetTenant(input.targetTenantSlug);
  const actorSession = requireActorSession({
    roleKey: input.roleKey,
    tenantSlug: input.actorTenantSlug ?? input.targetTenantSlug,
  });

  if (actorSession.tenant.id === target.id) {
    return { actorSession, target };
  }

  const reason = `${input.roleKey} actor from ${actorSession.tenant.slug} cannot access ${target.slug} client context.`;
  const audit = input.writeDeniedAudit
    ? await writeAudit(prisma, {
        actorRoleKey: input.roleKey,
        actorUserId: actorSession.actor.id,
        clientTenantId: target.id,
        eventType: input.eventType,
        platformTenantId: actorPlatformTenantId,
        reason,
        result: AuditResult.DENIED,
        targetId: input.targetId,
        targetType: input.targetType,
      }).catch(() => undefined)
    : undefined;

  throw new DbtfPermissionError(reason, audit?.id);
}

export async function getDbtfClientProfile(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  actorTenantSlug?: ActorTenantSlug,
) {
  const { actorSession: session, target } = await assertActorCanUseTargetTenant(prisma, {
    actorTenantSlug,
    eventType: "dbtf_profile_view_denied",
    roleKey,
    targetId: targetTenant(tenantSlug).id,
    targetTenantSlug: tenantSlug,
    targetType: ObjectType.TENANT,
  });
  const profile = await loadOrCreateActorProfile(prisma, {
    clientTenantId: target.id,
    userId: session.actor.id,
  });

  return mapProfile(profile);
}

export async function getDbtfClientAccountProfile(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  actorTenantSlug?: ActorTenantSlug,
) {
  const { actorSession: session } = await assertActorCanUseTargetTenant(prisma, {
    actorTenantSlug,
    eventType: "dbtf_account_profile_view_denied",
    roleKey,
    targetId: targetTenant(tenantSlug).id,
    targetTenantSlug: tenantSlug,
    targetType: ObjectType.USER,
  });
  const actor = await prisma.user.findUnique({
    select: {
      displayName: true,
      email: true,
      id: true,
      lastLoginAt: true,
      mfaEnabled: true,
      notificationDigest: true,
      notificationEmail: true,
      notificationSecurity: true,
      preferredLocale: true,
      profileImageStorageKey: true,
      status: true,
      timezone: true,
      updatedAt: true,
      userSessions: {
        orderBy: { createdAt: "desc" },
        select: {
          createdAt: true,
          expiresAt: true,
          id: true,
          lastSeenAt: true,
          providerId: true,
          roleKey: true,
        },
        take: 5,
        where: {
          expiresAt: { gt: new Date() },
          revokedAt: null,
          status: "ACTIVE",
        },
      },
    },
    where: { id: session.actor.id },
  });

  if (!actor) {
    throw new DbtfNotFoundError("No authenticated account is available for this context.");
  }

  return mapClientAccountProfile(actor);
}

export async function saveDbtfClientProfile(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  input: DbtfClientProfileInput,
  mode: "save_draft" | "submit_review",
  actorTenantSlug?: ActorTenantSlug,
) {
  const { actorSession: session, target } = await assertActorCanUseTargetTenant(prisma, {
    actorTenantSlug,
    eventType: "dbtf_profile_edit_denied_cross_tenant",
    roleKey,
    targetId: targetTenant(tenantSlug).id,
    targetTenantSlug: tenantSlug,
    targetType: ObjectType.TENANT,
    writeDeniedAudit: true,
  });
  const issues = [
    ...(cleanText(input.firstName, 80) ? [] : ["first_name_required"]),
    ...(cleanText(input.lastName, 80) ? [] : ["last_name_required"]),
    ...(cleanText(input.countryOfResidence, 80) ? [] : ["country_required"]),
    ...(cleanText(input.relationshipLabel, 80) ? [] : ["relationship_required"]),
  ];

  if (issues.length > 0) {
    throw new DbtfValidationError(issues);
  }

  if (!profileEditRoles.has(roleKey)) {
    const audit = await writeAudit(prisma, {
      actorRoleKey: roleKey,
      actorUserId: session.actor.id,
      clientTenantId: target.id,
      eventType: "dbtf_profile_edit_denied",
      platformTenantId: actorPlatformTenantId,
      reason: `${roleKey} cannot edit client profile fields.`,
      result: AuditResult.DENIED,
      targetId: target.id,
      targetType: ObjectType.TENANT,
    }).catch(() => undefined);
    throw new DbtfPermissionError(`${roleKey} cannot edit client profile fields.`, audit?.id);
  }

  const profile = await loadOrCreateActorProfile(prisma, {
    clientTenantId: target.id,
    userId: session.actor.id,
  });

  const updated = await prisma.$transaction(async (tx) => {
    const savedProfile = await tx.userProfile.update({
      data: {
        countryOfResidence: cleanText(input.countryOfResidence, 80),
        firstName: cleanText(input.firstName, 80),
        lastName: cleanText(input.lastName, 80),
        phone: cleanText(input.phone, 40) || null,
        relationshipLabel: cleanText(input.relationshipLabel, 80),
      },
      where: { id: profile.id },
    });

    await writeAudit(tx, {
      actorRoleKey: roleKey,
      actorUserId: session.actor.id,
      clientTenantId: target.id,
      eventType: mode === "submit_review" ? "dbtf_profile_submitted_for_review" : "dbtf_profile_saved_draft",
      nextState: mode === "submit_review" ? "IN_REVIEW" : "DRAFT",
      platformTenantId: actorPlatformTenantId,
      previousState: "DRAFT",
      result: AuditResult.SUCCESS,
      targetId: savedProfile.userId,
      targetType: ObjectType.USER,
    });

    return savedProfile;
  });

  return {
    mode,
    mutated: true,
    noClientRelease: true,
    profile: mapProfile(updated),
  };
}

export async function saveDbtfClientAccount(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  input: DbtfClientAccountProfileInput,
  actorTenantSlug?: ActorTenantSlug,
) {
  const { actorSession: session, target } = await assertActorCanUseTargetTenant(prisma, {
    actorTenantSlug,
    eventType: "dbtf_account_profile_edit_denied_cross_tenant",
    roleKey,
    targetId: targetTenant(tenantSlug).id,
    targetTenantSlug: tenantSlug,
    targetType: ObjectType.USER,
    writeDeniedAudit: true,
  });
  const hasDisplayName = Object.prototype.hasOwnProperty.call(input, "displayName");
  const hasNotificationDigest = Object.prototype.hasOwnProperty.call(input, "notificationDigest");
  const hasNotificationEmail = Object.prototype.hasOwnProperty.call(input, "notificationEmail");
  const hasNotificationSecurity = Object.prototype.hasOwnProperty.call(input, "notificationSecurity");
  const hasPreferredLocale = Object.prototype.hasOwnProperty.call(input, "preferredLocale");
  const hasTimezone = Object.prototype.hasOwnProperty.call(input, "timezone");
  const displayName = cleanText(input.displayName, 160);
  const preferredLocale = cleanText(input.preferredLocale, 16);
  const timezone = cleanText(input.timezone, 64);
  const updates: Prisma.UserUpdateInput = {};

  if (hasDisplayName) {
    updates.displayName = displayName;
  }
  if (hasNotificationDigest) {
    updates.notificationDigest = booleanPreference(input.notificationDigest);
  }
  if (hasNotificationEmail) {
    updates.notificationEmail = booleanPreference(input.notificationEmail);
  }
  if (hasNotificationSecurity) {
    updates.notificationSecurity = booleanPreference(input.notificationSecurity);
  }
  if (hasPreferredLocale) {
    updates.preferredLocale = preferredLocale || null;
  }
  if (hasTimezone) {
    updates.timezone = timezone || null;
  }

  const issues = [
    ...(hasDisplayName && !displayName ? ["display_name_required"] : []),
    ...(Object.keys(updates).length === 0 ? ["account_update_payload_empty"] : []),
  ];

  if (issues.length > 0) {
    throw new DbtfValidationError(issues);
  }

  if (!accountEditRoles.has(roleKey)) {
    const audit = await writeAudit(prisma, {
      actorRoleKey: roleKey,
      actorUserId: session.actor.id,
      clientTenantId: target.id,
      eventType: "dbtf_account_profile_edit_denied",
      platformTenantId: actorPlatformTenantId,
      reason: `${roleKey} cannot edit account profile fields.`,
      result: AuditResult.DENIED,
      targetId: session.actor.id,
      targetType: ObjectType.USER,
    });
    throw new DbtfPermissionError(`${roleKey} cannot edit account profile fields.`, audit.id);
  }

  const actor = await prisma.user.findUnique({
    where: { id: session.actor.id },
    select: {
      displayName: true,
      email: true,
      id: true,
      lastLoginAt: true,
      mfaEnabled: true,
      notificationDigest: true,
      notificationEmail: true,
      notificationSecurity: true,
      preferredLocale: true,
      profileImageStorageKey: true,
      status: true,
      timezone: true,
      updatedAt: true,
    },
  });

  if (!actor) {
    throw new DbtfNotFoundError("Current account is not available for this actor context.");
  }

  const updated = await prisma.$transaction(async (tx) => {
    const updatedActor = await tx.user.update({
      data: {
        ...updates,
      },
      where: { id: session.actor.id },
    });

    await writeAudit(tx, {
      actorRoleKey: roleKey,
      actorUserId: session.actor.id,
      clientTenantId: target.id,
      eventType: "dbtf_account_profile_saved",
      nextState: "UPDATED",
      platformTenantId: actorPlatformTenantId,
      previousState: actor.displayName,
      result: AuditResult.SUCCESS,
      targetId: updatedActor.id,
      targetType: ObjectType.USER,
    });

    return updatedActor;
  });

  return {
    mode: "save_account",
    account: mapClientAccountProfile(updated),
    mutated: true,
    noClientRelease: true,
  };
}

export async function updateDbtfFamilyMember(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  input: DbtfFamilyMemberInput,
  actorTenantSlug?: ActorTenantSlug,
) {
  const { actorSession: session, target } = await assertActorCanUseTargetTenant(prisma, {
    actorTenantSlug,
    eventType: "dbtf_family_member_edit_denied_cross_tenant",
    roleKey,
    targetId: cleanText(input.id, 80) || targetTenant(tenantSlug).id,
    targetTenantSlug: tenantSlug,
    targetType: cleanText(input.id, 80) ? ObjectType.FAMILY_MEMBER : ObjectType.TENANT,
    writeDeniedAudit: true,
  });
  const id = cleanText(input.id, 80);
  const issues = [
    ...(id ? [] : ["family_member_id_required"]),
    ...(cleanText(input.displayName, 160) ? [] : ["display_name_required"]),
    ...(cleanText(input.relationshipType, 80) ? [] : ["relationship_required"]),
    ...(cleanText(input.taxResidency, 80) ? [] : ["tax_residency_required"]),
  ];

  if (issues.length > 0) {
    throw new DbtfValidationError(issues);
  }

  const member = await prisma.familyMember.findFirst({
    where: {
      clientTenantId: target.id,
      id,
    },
  });

  if (!member) {
    throw new DbtfNotFoundError("Family member is not available for this tenant.");
  }

  const decision = permissionEngine.can(
    session.actor,
    "EDIT",
    {
      clientTenantId: target.id,
      objectId: member.id,
      objectType: "FAMILY_MEMBER",
      sensitivity: member.sensitivity,
    },
    {
      clientTenantId: target.id,
      objectScope: {
        clientTenantId: target.id,
        objectIds: [member.id],
        objectType: "FAMILY_MEMBER",
      },
      platformTenantId: "96705b67-40b2-5fb8-aa69-a3f2c106025e",
    },
    session.role,
  );

  if (!decision.allowed || !familyEditRoles.has(roleKey)) {
    const audit = await writeAudit(prisma, {
      actorRoleKey: roleKey,
      actorUserId: session.actor.id,
      clientTenantId: target.id,
      eventType: "dbtf_family_member_edit_denied",
      platformTenantId: actorPlatformTenantId,
      reason: decision.allowed ? `${roleKey} is not permitted for family member edits.` : decision.reason,
      result: AuditResult.DENIED,
      targetId: member.id,
      targetType: ObjectType.FAMILY_MEMBER,
    });
    throw new DbtfPermissionError(decision.allowed ? `${roleKey} is not permitted for family member edits.` : decision.reason, audit.id);
  }

  const updated = await prisma.$transaction(async (tx) => {
    const savedMember = await tx.familyMember.update({
      data: {
        displayName: cleanText(input.displayName, 160),
        relationshipType: cleanText(input.relationshipType, 80),
        taxResidency: cleanText(input.taxResidency, 80),
      },
      where: { id: member.id },
    });

    await writeAudit(tx, {
      actorRoleKey: roleKey,
      actorUserId: session.actor.id,
      clientTenantId: target.id,
      eventType: "dbtf_family_member_saved",
      nextState: "UPDATED",
      platformTenantId: actorPlatformTenantId,
      previousState: member.relationshipType,
      result: AuditResult.SUCCESS,
      targetId: savedMember.id,
      targetType: ObjectType.FAMILY_MEMBER,
    });

    return savedMember;
  });

  return {
    familyMember: updated,
    mutated: true,
    noClientRelease: true,
  };
}

function entityType(value: unknown) {
  const raw = cleanText(value, 80).toUpperCase();

  return raw in EntityType ? (raw as EntityType) : undefined;
}

export async function saveDbtfEntityWizard(
  prisma: PrismaClient,
  tenantSlug: ActorTenantSlug,
  roleKey: ActorRoleKey,
  input: DbtfEntityWizardInput,
  mode: "save_draft" | "submit",
  actorTenantSlug?: ActorTenantSlug,
) {
  const { actorSession: session, target } = await assertActorCanUseTargetTenant(prisma, {
    actorTenantSlug,
    eventType: "dbtf_entity_wizard_denied_cross_tenant",
    roleKey,
    targetId: targetTenant(tenantSlug).id,
    targetTenantSlug: tenantSlug,
    targetType: ObjectType.TENANT,
    writeDeniedAudit: true,
  });
  const parsedEntityType = entityType(input.entityType);
  const name = cleanText(input.name, 180);
  const jurisdiction = cleanText(input.jurisdiction, 80);
  const issues = [
    ...(parsedEntityType ? [] : ["valid_entity_type_required"]),
    ...(name ? [] : ["legal_name_required"]),
    ...(jurisdiction ? [] : ["jurisdiction_required"]),
  ];

  if (mode === "submit" && !cleanText(input.registrationNumber, 120)) {
    issues.push("registration_number_required_for_submit");
  }

  if (issues.length > 0) {
    throw new DbtfValidationError(issues);
  }

  if (!parsedEntityType) {
    throw new DbtfValidationError(["valid_entity_type_required"]);
  }

  assertRole(roleKey, entityCreateRoles, "Entity wizard submission");

  const status = mode === "submit" ? "in_review" : "draft";
  const entity = await prisma.$transaction(async (tx) => {
    const createdEntity = await tx.entity.create({
      data: {
        clientTenantId: target.id,
        entityType: parsedEntityType,
        jurisdiction,
        name,
        ownerSummary: cleanText(input.ownerSummary, 500) || "DBTF wizard draft created from the focused entity form.",
        registrationNumber: cleanText(input.registrationNumber, 120) || null,
        riskRating: cleanText(input.riskRating, 40) || "Medium",
        sensitivity: Sensitivity.CONFIDENTIAL,
        status,
      },
    });

    await writeAudit(tx, {
      actorRoleKey: roleKey,
      actorUserId: session.actor.id,
      clientTenantId: target.id,
      eventType: mode === "submit" ? "dbtf_entity_wizard_submitted" : "dbtf_entity_wizard_saved_draft",
      nextState: status,
      platformTenantId: actorPlatformTenantId,
      previousState: "new",
      result: AuditResult.SUCCESS,
      targetId: createdEntity.id,
      targetType: ObjectType.ENTITY,
    });

    return createdEntity;
  });

  return {
    entity,
    mode,
    mutated: true,
    noClientRelease: true,
  };
}

export async function getDbtfDashboardMetrics(prisma: PrismaClient, tenantSlug: ActorTenantSlug, roleKey: ActorRoleKey) {
  const session = requireActorSession({ roleKey, tenantSlug });
  const [documentCount, linkedDocuments, openActions, evidenceCount, releasedEvidence, compliancePending, visibleRecommendations] =
    await Promise.all([
      prisma.document.count({ where: { clientTenantId: session.tenant.id } }),
      prisma.document.count({ where: { clientTenantId: session.tenant.id, status: "LINKED_TO_EVIDENCE" } }),
      prisma.actionItem.count({ where: { clientTenantId: session.tenant.id, status: { in: ["NEW", "IN_REVIEW", "AWAITING_INFO", "BLOCKED"] } } }),
      prisma.evidenceRecord.count({ where: { clientTenantId: session.tenant.id } }),
      prisma.evidenceRecord.count({ where: { clientTenantId: session.tenant.id, visibilityStatus: "CLIENT_VISIBLE" } }),
      prisma.complianceReview.count({ where: { clientTenantId: session.tenant.id, status: { in: ["PENDING", "IN_REVIEW", "NEEDS_EVIDENCE"] } } }),
      prisma.recommendation.count({ where: { clientTenantId: session.tenant.id, clientVisible: true } }),
    ]);

  const readiness = documentCount === 0 ? 0 : Math.round((linkedDocuments / documentCount) * 100);
  const evidenceCoverage = evidenceCount === 0 ? 0 : Math.round((releasedEvidence / evidenceCount) * 100);

  return {
    cards: [
      { label: "DB readiness", tone: "green", value: `${readiness}%` },
      { label: "Documents linked", tone: "blue", value: `${linkedDocuments}/${documentCount}` },
      { label: "Open actions", tone: "gold", value: String(openActions) },
      { label: "Compliance pending", tone: "red", value: String(compliancePending) },
    ],
    evidenceCoverage,
    noClientRelease: true,
    readiness,
    tenantSlug,
    visibleRecommendations,
  };
}
