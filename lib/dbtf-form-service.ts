import {
  AuditResult,
  EntityType,
  ObjectType,
  Prisma,
  Sensitivity,
  type PrismaClient,
} from "@prisma/client";

import {
  demoPlatformTenantId,
  demoTenants,
  requireDemoSession,
  type DemoRoleKey,
  type DemoTenantSlug,
} from "@/lib/demo-session";
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
  source: "UserProfile";
  updatedAt: string;
};

export type DbtfClientProfileInput = {
  countryOfResidence?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  phone?: unknown;
  relationshipLabel?: unknown;
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

const profileEditRoles = new Set<DemoRoleKey>(["principal", "family_cfo", "client_success", "compliance_officer"]);
const familyEditRoles = new Set<DemoRoleKey>(["principal", "family_cfo", "client_success", "compliance_officer"]);
const entityCreateRoles = new Set<DemoRoleKey>(["family_cfo", "analyst", "senior_wealth_advisor", "compliance_officer"]);

function cleanText(value: unknown, maxLength = 160) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function formatDateOnly(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : "";
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
    source: "UserProfile",
    updatedAt: profile.updatedAt.toISOString(),
  };
}

async function writeAudit(
  prisma: PrismaClient | Prisma.TransactionClient,
  input: {
    actorRoleKey: DemoRoleKey;
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

function assertRole(roleKey: DemoRoleKey, allowedRoles: Set<DemoRoleKey>, label: string) {
  if (!allowedRoles.has(roleKey)) {
    throw new DbtfPermissionError(`${label} is not allowed for ${roleKey}.`);
  }
}

function targetTenant(tenantSlug: DemoTenantSlug) {
  return demoTenants.find((tenant) => tenant.slug === tenantSlug) ?? demoTenants[0];
}

async function assertActorCanUseTargetTenant(
  prisma: PrismaClient,
  input: {
    actorTenantSlug?: DemoTenantSlug;
    eventType: string;
    roleKey: DemoRoleKey;
    targetId: string;
    targetTenantSlug: DemoTenantSlug;
    targetType: ObjectType;
    writeDeniedAudit?: boolean;
  },
) {
  const target = targetTenant(input.targetTenantSlug);
  const actorSession = requireDemoSession({
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
        platformTenantId: demoPlatformTenantId,
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
  tenantSlug: DemoTenantSlug,
  roleKey: DemoRoleKey,
  actorTenantSlug?: DemoTenantSlug,
) {
  const { target } = await assertActorCanUseTargetTenant(prisma, {
    actorTenantSlug,
    eventType: "dbtf_profile_view_denied",
    roleKey,
    targetId: targetTenant(tenantSlug).id,
    targetTenantSlug: tenantSlug,
    targetType: ObjectType.TENANT,
  });
  const principal = await prisma.familyMember.findFirst({
    select: { userId: true },
    where: { clientTenantId: target.id, isPrincipal: true },
  });

  if (!principal?.userId) {
    throw new DbtfNotFoundError("No principal profile is seeded for this tenant.");
  }

  const profile = await prisma.userProfile.findFirst({
    where: {
      clientTenantId: target.id,
      userId: principal.userId,
    },
  });

  if (!profile) {
    throw new DbtfNotFoundError("No profile is seeded for this tenant.");
  }

  return mapProfile(profile);
}

export async function saveDbtfClientProfile(
  prisma: PrismaClient,
  tenantSlug: DemoTenantSlug,
  roleKey: DemoRoleKey,
  input: DbtfClientProfileInput,
  mode: "save_draft" | "submit_review",
  actorTenantSlug?: DemoTenantSlug,
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
      platformTenantId: demoPlatformTenantId,
      reason: `${roleKey} cannot edit client profile fields.`,
      result: AuditResult.DENIED,
      targetId: target.id,
      targetType: ObjectType.TENANT,
    }).catch(() => undefined);
    throw new DbtfPermissionError(`${roleKey} cannot edit client profile fields.`, audit?.id);
  }

  const principal = await prisma.familyMember.findFirst({
    select: { userId: true },
    where: { clientTenantId: target.id, isPrincipal: true },
  });

  if (!principal?.userId) {
    throw new DbtfNotFoundError("No principal profile is seeded for this tenant.");
  }

  const profile = await prisma.userProfile.findFirst({
    where: {
      clientTenantId: target.id,
      userId: principal.userId,
    },
  });

  if (!profile) {
    throw new DbtfNotFoundError("No profile is seeded for this tenant.");
  }

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
      platformTenantId: demoPlatformTenantId,
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

export async function updateDbtfFamilyMember(
  prisma: PrismaClient,
  tenantSlug: DemoTenantSlug,
  roleKey: DemoRoleKey,
  input: DbtfFamilyMemberInput,
  actorTenantSlug?: DemoTenantSlug,
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
      platformTenantId: demoPlatformTenantId,
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
      platformTenantId: demoPlatformTenantId,
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
  tenantSlug: DemoTenantSlug,
  roleKey: DemoRoleKey,
  input: DbtfEntityWizardInput,
  mode: "save_draft" | "submit",
  actorTenantSlug?: DemoTenantSlug,
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
      platformTenantId: demoPlatformTenantId,
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

export async function getDbtfDashboardMetrics(prisma: PrismaClient, tenantSlug: DemoTenantSlug, roleKey: DemoRoleKey) {
  const session = requireDemoSession({ roleKey, tenantSlug });
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
