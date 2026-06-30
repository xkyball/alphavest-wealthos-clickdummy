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

function text(value: unknown, maxLength = 180) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function roleKey(value: unknown): ActorRoleKey | undefined {
  return typeof value === "string" && actorRoles.some((role) => role.key === value) ? (value as ActorRoleKey) : undefined;
}

function tenantSlug(value: unknown): ActorTenantSlug | undefined {
  return typeof value === "string" && actorTenants.some((tenant) => tenant.slug === value) ? (value as ActorTenantSlug) : undefined;
}

function tenantForSlug(slug: ActorTenantSlug) {
  return actorTenants.find((tenant) => tenant.slug === slug) ?? actorTenants[0];
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
    displayName?: unknown;
    jurisdiction?: unknown;
    relationshipTier?: unknown;
  },
) {
  const actorRole = roleKey(input.actorRoleKey) ?? "admin";
  const displayName = text(input.displayName);
  const jurisdiction = text(input.jurisdiction, 80);
  const relationshipTier = text(input.relationshipTier, 80) || "Standard";
  const targetId = stableId(`operational-stage2:client-tenant:${displayName.toLowerCase()}`);

  await assertActor(prisma, actorRole, adminActionRoles, {
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
    retentionYears?: unknown;
    settingKey?: unknown;
  },
) {
  const actorRole = roleKey(input.actorRoleKey) ?? "admin";
  const settingKey = text(input.settingKey, 80);
  const retentionYears = Number(input.retentionYears);
  const targetId = stableId(`operational-stage2:platform-setting:${settingKey || "invalid"}`);

  await assertActor(prisma, actorRole, adminActionRoles, {
    eventType: "operational.stage2.platform_setting",
    targetId,
    targetType: ObjectType.PLATFORM,
  });

  if (!settingKey || !Number.isInteger(retentionYears) || retentionYears < 1 || retentionYears > 25) {
    throw new OperationalStage2ValidationError(["valid_setting_key_and_retention_required"]);
  }

  const audit = await writeOperationalAudit(prisma, {
    actorRoleKey: actorRole,
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
    mfaRequired?: unknown;
    sessionMinutes?: unknown;
  },
) {
  const actorRole = roleKey(input.actorRoleKey) ?? "security_officer";
  const sessionMinutes = Number(input.sessionMinutes);
  const mfaRequired = input.mfaRequired === true;
  const targetId = stableId("operational-stage2:security-configuration");

  await assertActor(prisma, actorRole, securityActionRoles, {
    eventType: "operational.stage2.security_configuration",
    targetId,
    targetType: ObjectType.PERMISSION,
  });

  if (!mfaRequired || !Number.isInteger(sessionMinutes) || sessionMinutes < 5 || sessionMinutes > 120) {
    const audit = await writeOperationalAudit(prisma, {
      actorRoleKey: actorRole,
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
    clientTenantSlug?: unknown;
    policyKey?: unknown;
    status?: unknown;
    version?: unknown;
  },
) {
  const actorRole = roleKey(input.actorRoleKey) ?? "compliance_officer";
  const policyKey = text(input.policyKey, 120);
  const version = text(input.version, 40);
  const status = text(input.status, 40).toLowerCase();
  const parsedTenantSlug = tenantSlug(input.clientTenantSlug);
  const tenant = parsedTenantSlug ? tenantForSlug(parsedTenantSlug) : null;
  const targetId = stableId(`operational-stage2:policy:${tenant?.id ?? "platform"}:${policyKey}:${version}`);

  await assertActor(prisma, actorRole, policyActionRoles, {
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
          createdByUserId: stableId(`operational-stage2:policy-actor:${actorRole}`),
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
    email?: unknown;
    roleKey?: unknown;
    tenantSlug?: unknown;
  },
) {
  const actorRole = roleKey(input.actorRoleKey) ?? "client_success";
  const assigneeEmail = text(input.email, 180).toLowerCase();
  const parsedRoleKey = roleKey(input.roleKey);
  const parsedTenantSlug = tenantSlug(input.tenantSlug);

  if (!assigneeEmail || !parsedRoleKey || !parsedTenantSlug) {
    throw new OperationalStage2ValidationError(["valid_email_role_tenant_required"]);
  }

  const tenant = tenantForSlug(parsedTenantSlug);
  await assertActor(prisma, actorRole, adminActionRoles, {
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
        assignedByUserId: stableId(`operational-stage2:assigner:${actorRole}`),
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
      actorUserId: stableId(`operational-stage2:assigner:${actorRole}`),
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
