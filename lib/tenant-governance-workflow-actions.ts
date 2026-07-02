import { createHash } from "node:crypto";
import {
  AuditResult,
  ExportStatus,
  ExportType,
  ObjectType,
  PermissionAction,
  PrismaClient,
  RoleScope,
  Sensitivity,
  TenantStatus,
  UserStatus,
  VisibilityStatus,
  WorkflowStatus,
} from "@prisma/client";

import type { ActorRoleKey, ActorTenantSlug } from "@/lib/actor-session";
import { actorTenants } from "@/lib/actor-session";
import { stableId } from "@/lib/stable-id";
import {
  tenantGovernanceCanonicalApiRoute,
  tenantGovernanceCommandForAction,
  type TenantGovernanceWorkflowAction,
} from "@/lib/tenant-governance-action-contract";
import { runTypedWorkflowMutation } from "@/lib/typed-workflow-command-bus";

export {
  isTenantGovernanceWorkflowAction,
  tenantGovernanceCanonicalApiRoute,
  tenantGovernanceCommandForAction,
  type TenantGovernanceWorkflowAction,
} from "@/lib/tenant-governance-action-contract";

const platformTenantId = stableId("platform:alphavest");
const northbridgeTenantId = tenantId("northbridge");
const northbridgeEvidenceRecordId = evidenceRecordId("northbridge");
const northbridgeAccessRequestId = accessRequestId("northbridge");
const northbridgeExportRequestId = exportRequestId("northbridge");
const northbridgeExternalUserId = userId("northbridge:external");
const northbridgeInvitedUserId = userId("northbridge:emily-roberts");
const northbridgePortfolioManagerRoleId = stableId("role:northbridge:portfolio_manager");
const morganPrincipalUserId = userId("morgan:principal");

export type TenantGovernanceActionScope = {
  roleKey: ActorRoleKey;
  tenantSlug: ActorTenantSlug;
};

type TenantGovernanceResolvedActionScope = TenantGovernanceActionScope & {
  tenantId?: string;
  tenantName?: string;
  tenantStatus?: string | null;
};

type TenantGovernanceActionPolicy = TenantGovernanceActionScope & {
  allowedRoleKeys: readonly ActorRoleKey[];
  allowAnyTenant?: boolean;
};

export class TenantGovernanceScopeMismatchError extends Error {
  constructor() {
    super("Tenant governance action scope does not match the selected workflow object.");
    this.name = "TenantGovernanceScopeMismatchError";
  }
}

export function tenantGovernanceScopeForAction(actionId: TenantGovernanceWorkflowAction): TenantGovernanceActionScope {
  const policy = tenantGovernancePolicyForAction(actionId);

  return {
    roleKey: policy.roleKey,
    tenantSlug: policy.tenantSlug,
  };
}

function tenantGovernancePolicyForAction(actionId: TenantGovernanceWorkflowAction): TenantGovernanceActionPolicy {
  if (
    actionId === "j06.newTenant" ||
    actionId === "j06.continueTenant" ||
    actionId === "j06.assignTeam" ||
    actionId === "j06.openInvitation" ||
    actionId === "j06.sendInvitation" ||
    actionId === "j07.inviteUser" ||
    actionId === "j07.sendInvitation"
  ) {
    return actionId.startsWith("j06.")
      ? { allowAnyTenant: true, allowedRoleKeys: ["admin", "client_success"], roleKey: "admin", tenantSlug: "morgan" }
      : { allowAnyTenant: true, allowedRoleKeys: ["admin"], roleKey: "admin", tenantSlug: "northbridge" };
  }

  if (actionId === "j07.saveRoleChanges" || actionId === "j07.exportAudit") {
    return { allowedRoleKeys: ["security_officer"], roleKey: "security_officer", tenantSlug: "northbridge" };
  }

  return { allowedRoleKeys: ["compliance_officer"], roleKey: "compliance_officer", tenantSlug: "northbridge" };
}

export function assertTenantGovernanceActionScope(
  actionId: TenantGovernanceWorkflowAction,
  scope: TenantGovernanceActionScope,
) {
  const requiredScope = tenantGovernancePolicyForAction(actionId);

  if (
    !requiredScope.allowedRoleKeys.includes(scope.roleKey) ||
    (!requiredScope.allowAnyTenant && scope.tenantSlug !== requiredScope.tenantSlug)
  ) {
    throw new TenantGovernanceScopeMismatchError();
  }
}

function stableEvidenceHash(label: string) {
  return createHash("sha256").update(`alphavest-wealthos:${label}`).digest("hex");
}

function tenantId(slug: string) {
  return stableId(`tenant:${slug}`);
}

function userId(key: string) {
  return stableId(`user:${key}`);
}

function roleId(key: string) {
  return stableId(`role:${key}`);
}

function permissionId(key: string) {
  return stableId(`permission:${key}`);
}

function evidenceRecordId(slug: string) {
  return stableId(`evidence:${slug}:decision-pack`);
}

function documentId(slug: string, key: string) {
  return stableId(`document:${slug}:${key}`);
}

function exportRequestId(slug: string) {
  return stableId(`export:${slug}:evidence-pack`);
}

function accessRequestId(slug: string) {
  return stableId(`access-request:${slug}:external`);
}

function exportExpiryDate(from: Date) {
  const expiryDate = new Date(from);
  expiryDate.setDate(expiryDate.getDate() + 7);
  return expiryDate;
}

type WorkflowTenantContext = {
  id: string;
  displayName: string;
  jurisdiction?: string | null;
  relationshipTier?: string | null;
  riskRating?: string | null;
  slug: ActorTenantSlug;
  status?: string | null;
};

function fallbackTenantContext(scope: TenantGovernanceResolvedActionScope, fallbackSlug: ActorTenantSlug): WorkflowTenantContext {
  const slug = scope.tenantSlug || fallbackSlug;
  const seeded = actorTenants.find((tenant) => tenant.slug === slug);

  return {
    displayName: scope.tenantName ?? seeded?.displayName ?? slug.replaceAll("-", " "),
    id: scope.tenantId ?? seeded?.id ?? tenantId(slug),
    jurisdiction: seeded?.jurisdiction,
    relationshipTier: "Signature",
    riskRating: seeded?.riskRating,
    slug,
    status: scope.tenantStatus ?? seeded?.status,
  };
}

async function resolveWorkflowTenant(
  prisma: PrismaClient,
  scope: TenantGovernanceResolvedActionScope,
  fallbackSlug: ActorTenantSlug,
): Promise<WorkflowTenantContext> {
  const fallback = fallbackTenantContext(scope, fallbackSlug);
  const tenant = await prisma.clientTenant.findFirst({
    select: {
      displayName: true,
      id: true,
      jurisdiction: true,
      relationshipTier: true,
      riskRating: true,
      slug: true,
      status: true,
    },
    where: { id: fallback.id },
  }) ?? await prisma.clientTenant.findFirst({
    select: {
      displayName: true,
      id: true,
      jurisdiction: true,
      relationshipTier: true,
      riskRating: true,
      slug: true,
      status: true,
    },
    where: { slug: fallback.slug },
  });

  return tenant
    ? {
        displayName: tenant.displayName,
        id: tenant.id,
        jurisdiction: tenant.jurisdiction,
        relationshipTier: tenant.relationshipTier,
        riskRating: tenant.riskRating,
        slug: tenant.slug,
        status: tenant.status,
      }
    : fallback;
}

function tenantMutationContext(scope: TenantGovernanceResolvedActionScope, tenant: WorkflowTenantContext) {
  return {
    actorRoleKey: scope.roleKey,
    actorTenantId: tenant.id,
    actorTenantName: tenant.displayName,
    clientTenantId: tenant.id,
    tenantSlug: tenant.slug,
  };
}

function tenantPrincipalInviteTarget(tenant: WorkflowTenantContext) {
  if (tenant.slug === "morgan") {
    return {
      consentId: stableId("consent:morgan:principal:onboarding-invite:2026.06"),
      displayName: "Morgan Principal",
      email: "principal.morgan@morganfamilyoffice.example",
      userId: morganPrincipalUserId,
      userRoleId: stableId("user-role:morgan:principal:principal"),
    };
  }

  return {
    consentId: stableId(`consent:${tenant.slug}:principal:onboarding-invite:2026.06`),
    displayName: `${tenant.displayName} Principal`,
    email: `principal.${tenant.slug}@example.demo`,
    userId: userId(`${tenant.slug}:principal`),
    userRoleId: stableId(`user-role:${tenant.slug}:principal:principal`),
  };
}

function governanceInviteTarget(tenant: WorkflowTenantContext) {
  if (tenant.slug === "northbridge") {
    return {
      displayName: "Emily Roberts",
      email: "emily.roberts@example.test",
      firstName: "Emily",
      lastName: "Roberts",
      profileId: stableId("user-profile:northbridge:emily-roberts"),
      relationshipLabel: "Investment committee delegate",
      userId: northbridgeInvitedUserId,
      userRoleId: stableId("user-role:northbridge:emily-roberts:analyst"),
    };
  }

  return {
    displayName: `${tenant.displayName} Delegate`,
    email: `delegate.${tenant.slug}@example.demo`,
    firstName: "Tenant",
    lastName: "Delegate",
    profileId: stableId(`user-profile:${tenant.slug}:delegate`),
    relationshipLabel: "Tenant governance delegate",
    userId: userId(`${tenant.slug}:delegate`),
    userRoleId: stableId(`user-role:${tenant.slug}:delegate:analyst`),
  };
}

async function runJ06TenantCreateIntent(
  prisma: PrismaClient,
  actionId: TenantGovernanceWorkflowAction,
  scope: TenantGovernanceResolvedActionScope,
) {
  const tenant = await resolveWorkflowTenant(prisma, scope, "morgan");

  return runTypedWorkflowMutation(
    prisma,
    {
      actionId,
      auditResult: AuditResult.SUCCESS,
      eventType: "tenant_governance.tenant.create_intent",
      metadataJson: {
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
        tenantSlug: tenant.slug,
        workflowGate: "tenant_onboarding_started",
      },
      nextState: TenantStatus.DRAFT,
      permissionAction: "CREATE",
      previousState: TenantStatus.ONBOARDING,
      reason: `Tenant creation flow opened for ${tenant.displayName}.`,
      targetId: tenant.id,
      targetType: ObjectType.TENANT,
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "DRAFT",
      ...tenantMutationContext(scope, tenant),
    },
    async (tx) => {
      const tenantRows = await tx.clientTenant.updateMany({
        where: { id: tenant.id },
        data: {
          onboardingCompletedAt: null,
          status: TenantStatus.DRAFT,
        },
      });

      return {
        clientVisible: false,
        message: "Tenant draft state saved for onboarding.",
        tenantRows: tenantRows.count,
      };
    },
  );
}

async function runJ06ContinueTenant(
  prisma: PrismaClient,
  actionId: TenantGovernanceWorkflowAction,
  scope: TenantGovernanceResolvedActionScope,
) {
  const tenant = await resolveWorkflowTenant(prisma, scope, "morgan");
  const jurisdiction = tenant.jurisdiction ?? "South Africa";
  const relationshipTier = tenant.relationshipTier ?? "Signature";

  return runTypedWorkflowMutation(
    prisma,
    {
      actionId,
      auditResult: AuditResult.SUCCESS,
      eventType: "tenant_governance.tenant.details_saved",
      metadataJson: {
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
        jurisdiction,
        serviceTier: relationshipTier,
        tenantSlug: tenant.slug,
      },
      nextState: TenantStatus.ONBOARDING,
      permissionAction: "EDIT",
      previousState: TenantStatus.DRAFT,
      reason: "Tenant details saved and moved to onboarding setup.",
      targetId: tenant.id,
      targetType: ObjectType.TENANT,
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
      ...tenantMutationContext(scope, tenant),
    },
    async (tx) => {
      const tenantRows = await tx.clientTenant.updateMany({
        where: { id: tenant.id },
        data: {
          dataRegion: jurisdiction === "United Kingdom" ? "EU" : "ZA",
          jurisdiction,
          legalName: tenant.displayName,
          onboardingCompletedAt: null,
          relationshipTier,
          riskRating: tenant.riskRating ?? "Medium",
          status: TenantStatus.ONBOARDING,
        },
      });

      return {
        clientVisible: false,
        message: "Tenant details saved and onboarding setup opened.",
        tenantRows: tenantRows.count,
      };
    },
  );
}

async function runJ06AssignTeam(
  prisma: PrismaClient,
  actionId: TenantGovernanceWorkflowAction,
  scope: TenantGovernanceResolvedActionScope,
) {
  const tenant = await resolveWorkflowTenant(prisma, scope, "morgan");
  const now = new Date();
  const assignments = [
    ["advisor", "senior_wealth_advisor"],
    ["analyst", "analyst"],
    ["compliance", "compliance_officer"],
    ["success", "client_success"],
  ] as const;

  return runTypedWorkflowMutation(
    prisma,
    {
      actionId,
      auditResult: AuditResult.SUCCESS,
      eventType: "tenant_governance.tenant.team_assigned",
      metadataJson: {
        assignedRoles: assignments.map(([, roleKey]) => roleKey),
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
        tenantSlug: tenant.slug,
      },
      nextState: "TEAM_ASSIGNED",
      permissionAction: "ASSIGN",
      previousState: TenantStatus.ONBOARDING,
      reason: "Admin assigned required AlphaVest service team roles.",
      targetId: tenant.id,
      targetType: ObjectType.TENANT,
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
      ...tenantMutationContext(scope, tenant),
    },
    async (tx) => {
      const tenantRows = await tx.clientTenant.updateMany({
        where: { id: tenant.id },
        data: {
          clientSuccessOwnerUserId: userId("success"),
          complianceOwnerUserId: userId("compliance"),
          primaryAdvisorUserId: userId("advisor"),
          primaryAnalystUserId: userId("analyst"),
          status: TenantStatus.ONBOARDING,
        },
      });
      const userRoles = await Promise.all(
        assignments.map(([actorKey, roleKey]) =>
          tx.userRole.upsert({
            where: { id: stableId(`user-role:${tenant.slug}:${actorKey}:${roleKey}`) },
            create: {
              id: stableId(`user-role:${tenant.slug}:${actorKey}:${roleKey}`),
              assignedByUserId: userId("admin"),
              clientTenantId: tenant.id,
              createdAt: now,
              roleId: roleId(roleKey),
              status: "active",
              updatedAt: now,
              userId: userId(actorKey),
              validFrom: now,
            },
            update: {
              assignedByUserId: userId("admin"),
              clientTenantId: tenant.id,
              roleId: roleId(roleKey),
              status: "active",
              updatedAt: now,
              validFrom: now,
            },
          }),
        ),
      );
      const policy = await tx.policyDefinition.upsert({
        where: {
          platformTenantId_clientTenantId_policyKey_version: {
            clientTenantId: tenant.id,
            platformTenantId,
            policyKey: "tenant.onboarding_controls",
            version: "2026.06",
          },
        },
        create: {
          id: stableId(`policy:${tenant.slug}:onboarding-controls:v1`),
          category: "onboarding",
          clientTenantId: tenant.id,
          createdAt: now,
          createdByUserId: userId("admin"),
          effectiveFrom: now,
          name: `${tenant.displayName} Onboarding Controls`,
          platformTenantId,
          policyKey: "tenant.onboarding_controls",
          rulesJson: {
            auditLoggingRequired: true,
            complianceOwnerRequired: true,
            principalInvitationRequired: true,
            serviceTeamRequired: true,
          },
          status: "active",
          updatedAt: now,
          version: "2026.06",
        },
        update: {
          createdByUserId: userId("admin"),
          effectiveFrom: now,
          rulesJson: {
            auditLoggingRequired: true,
            complianceOwnerRequired: true,
            principalInvitationRequired: true,
            serviceTeamRequired: true,
          },
          status: "active",
          updatedAt: now,
        },
      });

      return {
        clientVisible: false,
        message: "Tenant service team and onboarding controls saved.",
        policyId: policy.id,
        tenantRows: tenantRows.count,
        userRoleRows: userRoles.length,
      };
    },
  );
}

async function runJ06OpenInvitation(
  prisma: PrismaClient,
  actionId: TenantGovernanceWorkflowAction,
  scope: TenantGovernanceResolvedActionScope,
) {
  const tenant = await resolveWorkflowTenant(prisma, scope, "morgan");
  const inviteTarget = tenantPrincipalInviteTarget(tenant);

  return runTypedWorkflowMutation(
    prisma,
    {
      actionId,
      auditResult: AuditResult.SUCCESS,
      eventType: "tenant_governance.tenant.invitation_opened",
      metadataJson: {
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
        inviteEmail: inviteTarget.email,
        tenantSlug: tenant.slug,
      },
      nextState: "INVITATION_OPENED",
      permissionAction: "INVITE",
      previousState: TenantStatus.ONBOARDING,
      reason: "Admin opened principal invitation drawer.",
      targetId: inviteTarget.userId,
      targetType: ObjectType.USER,
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
      ...tenantMutationContext(scope, tenant),
    },
    async () => ({
      clientVisible: false,
      message: "Tenant invitation drawer audited.",
    }),
  );
}

async function runJ06SendInvitation(
  prisma: PrismaClient,
  actionId: TenantGovernanceWorkflowAction,
  scope: TenantGovernanceResolvedActionScope,
) {
  const tenant = await resolveWorkflowTenant(prisma, scope, "morgan");
  const inviteTarget = tenantPrincipalInviteTarget(tenant);
  const now = new Date();

  return runTypedWorkflowMutation(
    prisma,
    {
      actionId,
      auditResult: AuditResult.PENDING,
      eventType: "tenant_governance.tenant.invitation_sent",
      metadataJson: {
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
        inviteEmail: inviteTarget.email,
        noEmailDelivery: true,
        tenantSlug: tenant.slug,
      },
      nextState: UserStatus.INVITED,
      permissionAction: "INVITE",
      previousState: TenantStatus.ONBOARDING,
      reason: "Admin sent principal invitation; external email delivery is held for the local provider.",
      targetId: inviteTarget.userId,
      targetType: ObjectType.USER,
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
      ...tenantMutationContext(scope, tenant),
    },
    async (tx) => {
      const tenantRows = await tx.clientTenant.updateMany({
        where: { id: tenant.id },
        data: {
          onboardingCompletedAt: null,
          status: TenantStatus.ONBOARDING,
        },
      });
      const user = await tx.user.upsert({
        where: { id: inviteTarget.userId },
        create: {
          id: inviteTarget.userId,
          displayName: inviteTarget.displayName,
          email: inviteTarget.email,
          isServiceAccount: false,
          lastLoginAt: null,
          mfaEnabled: false,
          platformTenantId,
          preferredLocale: "en-ZA",
          status: UserStatus.INVITED,
          timezone: "Africa/Johannesburg",
        },
        update: {
          displayName: inviteTarget.displayName,
          email: inviteTarget.email,
          lastLoginAt: null,
          mfaEnabled: false,
          status: UserStatus.INVITED,
        },
      });
      const userRole = await tx.userRole.upsert({
        where: { id: inviteTarget.userRoleId },
        create: {
          id: inviteTarget.userRoleId,
          assignedByUserId: userId("admin"),
          clientTenantId: tenant.id,
          createdAt: now,
          roleId: roleId("principal"),
          status: "pending_invite",
          updatedAt: now,
          userId: inviteTarget.userId,
          validFrom: now,
        },
        update: {
          assignedByUserId: userId("admin"),
          clientTenantId: tenant.id,
          status: "pending_invite",
          updatedAt: now,
          validFrom: now,
        },
      });
      const consent = await tx.consentRecord.upsert({
        where: { id: inviteTarget.consentId },
        create: {
          id: inviteTarget.consentId,
          clientTenantId: tenant.id,
          consentType: "privacy_notice",
          createdAt: now,
          source: "onboarding_invite",
          status: "pending",
          userId: inviteTarget.userId,
          version: "2026.06",
        },
        update: {
          acceptedAt: null,
          source: "onboarding_invite",
          status: "pending",
          withdrawnAt: null,
        },
      });

      return {
        clientVisible: false,
        consentId: consent.id,
        message: "Tenant principal invitation saved in workflow state.",
        tenantRows: tenantRows.count,
        userRoleId: userRole.id,
        userId: user.id,
        userRows: 1,
      };
    },
  );
}

async function runJ07InviteUser(
  prisma: PrismaClient,
  actionId: TenantGovernanceWorkflowAction,
  scope: TenantGovernanceResolvedActionScope,
) {
  const tenant = await resolveWorkflowTenant(prisma, scope, "northbridge");
  const inviteTarget = governanceInviteTarget(tenant);

  return runTypedWorkflowMutation(
    prisma,
    {
      actionId,
      auditResult: AuditResult.SUCCESS,
      eventType: "tenant_governance.governance.invite_opened",
      metadataJson: {
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
        inviteEmail: inviteTarget.email,
        roleScopeRequired: true,
        tenantSlug: tenant.slug,
      },
      nextState: "INVITE_DRAWER_OPENED",
      permissionAction: "INVITE",
      previousState: "NO_INVITE_STARTED",
      reason: "Admin opened a scoped governance invitation workflow.",
      sensitivity: "RESTRICTED",
      targetId: inviteTarget.userId,
      targetType: ObjectType.USER,
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
      ...tenantMutationContext(scope, tenant),
    },
    async () => ({
      clientVisible: false,
      message: "Governance invitation drawer audited.",
    }),
  );
}

async function runJ07SendInvitation(
  prisma: PrismaClient,
  actionId: TenantGovernanceWorkflowAction,
  scope: TenantGovernanceResolvedActionScope,
) {
  const tenant = await resolveWorkflowTenant(prisma, scope, "northbridge");
  const inviteTarget = governanceInviteTarget(tenant);
  const now = new Date();

  return runTypedWorkflowMutation(
    prisma,
    {
      actionId,
      auditResult: AuditResult.PENDING,
      eventType: "tenant_governance.governance.invitation_sent",
      metadataJson: {
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
        inviteEmail: inviteTarget.email,
        noEmailDelivery: true,
        scopedRole: "analyst",
        tenantSlug: tenant.slug,
      },
      nextState: UserStatus.INVITED,
      permissionAction: "INVITE",
      previousState: "INVITE_DRAWER_OPENED",
      reason: "Admin sent a scoped governance invite without real email delivery.",
      sensitivity: "RESTRICTED",
      targetId: inviteTarget.userId,
      targetType: ObjectType.USER,
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
      ...tenantMutationContext(scope, tenant),
    },
    async (tx) => {
      const user = await tx.user.upsert({
        where: { id: inviteTarget.userId },
        create: {
          id: inviteTarget.userId,
          displayName: inviteTarget.displayName,
          email: inviteTarget.email,
          isServiceAccount: false,
          lastLoginAt: null,
          mfaEnabled: false,
          platformTenantId,
          preferredLocale: "en-ZA",
          status: UserStatus.INVITED,
          timezone: "Africa/Johannesburg",
        },
        update: {
          displayName: inviteTarget.displayName,
          email: inviteTarget.email,
          lastLoginAt: null,
          mfaEnabled: false,
          status: UserStatus.INVITED,
        },
      });
      const profile = await tx.userProfile.upsert({
        where: { id: inviteTarget.profileId },
        create: {
          id: inviteTarget.profileId,
          clientTenantId: tenant.id,
          countryOfResidence: tenant.jurisdiction ?? "South Africa",
          firstName: inviteTarget.firstName,
          lastName: inviteTarget.lastName,
          relationshipLabel: inviteTarget.relationshipLabel,
          sensitivity: Sensitivity.CONFIDENTIAL,
          userId: user.id,
        },
        update: {
          clientTenantId: tenant.id,
          countryOfResidence: tenant.jurisdiction ?? "South Africa",
          firstName: inviteTarget.firstName,
          lastName: inviteTarget.lastName,
          relationshipLabel: inviteTarget.relationshipLabel,
          sensitivity: Sensitivity.CONFIDENTIAL,
        },
      });
      const userRole = await tx.userRole.upsert({
        where: { id: inviteTarget.userRoleId },
        create: {
          id: inviteTarget.userRoleId,
          assignedByUserId: userId("admin"),
          clientTenantId: tenant.id,
          createdAt: now,
          roleId: roleId("analyst"),
          status: "pending_invite",
          updatedAt: now,
          userId: user.id,
          validFrom: now,
        },
        update: {
          assignedByUserId: userId("admin"),
          clientTenantId: tenant.id,
          roleId: roleId("analyst"),
          status: "pending_invite",
          updatedAt: now,
          validFrom: now,
        },
      });

      return {
        clientVisible: false,
        message: "Scoped governance invitation saved in workflow state.",
        profileId: profile.id,
        userId: user.id,
        userRoleId: userRole.id,
      };
    },
  );
}

async function runJ07SaveRoleChanges(prisma: PrismaClient, actionId: TenantGovernanceWorkflowAction) {
  const now = new Date();
  const expiresAt = exportExpiryDate(now);
  const permissionKeys = ["documents.review", "exports.create", "audit.view"];

  return runTypedWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "security_officer",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: northbridgeTenantId,
      eventType: "tenant_governance.governance.role_sensitive_change_confirmed",
      metadataJson: {
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
        confirmationPhrase: "PORTFOLIO MANAGER",
        requiresSecondConfirmation: true,
        sensitivePermissionCount: permissionKeys.length,
      },
      nextState: "SENSITIVE_ROLE_CONFIRMED",
      permissionAction: "MANAGE",
      previousState: "SENSITIVE_ROLE_CHANGE_PENDING",
      reason: "Security confirmed sensitive Portfolio Manager permission changes.",
      sensitivity: "HIGHLY_RESTRICTED",
      targetId: northbridgePortfolioManagerRoleId,
      targetType: ObjectType.ROLE,
      tenantSlug: "northbridge",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const role = await tx.role.upsert({
        where: {
          platformTenantId_clientTenantId_key: {
            clientTenantId: northbridgeTenantId,
            key: "portfolio_manager",
            platformTenantId,
          },
        },
        create: {
          id: northbridgePortfolioManagerRoleId,
          clientTenantId: northbridgeTenantId,
          description: "Tenant-scoped portfolio manager role confirmed through J07 second confirmation.",
          isSystemRole: false,
          key: "portfolio_manager",
          name: "Portfolio Manager",
          platformTenantId,
          requiresSecondConfirmation: true,
          scope: RoleScope.TENANT,
          segregationGroup: "investment-management",
        },
        update: {
          description: "Tenant-scoped portfolio manager role confirmed through J07 second confirmation.",
          isSystemRole: false,
          name: "Portfolio Manager",
          requiresSecondConfirmation: true,
          scope: RoleScope.TENANT,
          segregationGroup: "investment-management",
        },
      });
      const rolePermissions = await Promise.all(
        permissionKeys.map((permissionKey) =>
          tx.rolePermission.upsert({
            where: {
              roleId_permissionId: {
                permissionId: permissionId(permissionKey),
                roleId: role.id,
              },
            },
            create: {
              id: stableId(`role-permission:northbridge:portfolio_manager:${permissionKey}`),
              conditionJson: {
                demo: true,
                secondConfirmationId: stableId("second-confirmation:northbridge:portfolio-manager-role"),
                tenantScoped: true,
              },
              effect: "allow",
              permissionId: permissionId(permissionKey),
              roleId: role.id,
            },
            update: {
              conditionJson: {
                demo: true,
                secondConfirmationId: stableId("second-confirmation:northbridge:portfolio-manager-role"),
                tenantScoped: true,
              },
              effect: "allow",
            },
          }),
        ),
      );
      const secondConfirmation = await tx.secondConfirmation.upsert({
        where: { id: stableId("second-confirmation:northbridge:portfolio-manager-role") },
        create: {
          id: stableId("second-confirmation:northbridge:portfolio-manager-role"),
          action: PermissionAction.MANAGE,
          actorUserId: userId("admin"),
          clientTenantId: northbridgeTenantId,
          confirmationPhrase: "PORTFOLIO MANAGER",
          confirmedAt: now,
          confirmedByUserId: userId("security"),
          createdAt: now,
          expiresAt,
          status: "confirmed",
          targetObjectId: role.id,
          targetObjectType: ObjectType.ROLE,
        },
        update: {
          action: PermissionAction.MANAGE,
          actorUserId: userId("admin"),
          confirmationPhrase: "PORTFOLIO MANAGER",
          confirmedAt: now,
          confirmedByUserId: userId("security"),
          expiresAt,
          status: "confirmed",
          targetObjectId: role.id,
          targetObjectType: ObjectType.ROLE,
        },
      });

      return {
        clientVisible: false,
        message: "Sensitive role changes saved with second confirmation.",
        roleId: role.id,
        rolePermissionRows: rolePermissions.length,
        secondConfirmationId: secondConfirmation.id,
      };
    },
  );
}

async function runJ07ApproveAccess(prisma: PrismaClient, actionId: TenantGovernanceWorkflowAction) {
  const now = new Date();

  return runTypedWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "compliance_officer",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: northbridgeTenantId,
      eventType: "tenant_governance.governance.access_approved",
      evidenceRecordId: northbridgeEvidenceRecordId,
      metadataJson: {
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
        policyChecksPassed: true,
        scopedAccessOnly: true,
        sodReviewRequired: true,
      },
      nextState: WorkflowStatus.COMPLETED,
      permissionAction: "ASSIGN",
      previousState: WorkflowStatus.IN_REVIEW,
      reason: "Compliance approved scoped external-advisor document access after policy checks.",
      sensitivity: "RESTRICTED",
      targetId: northbridgeAccessRequestId,
      targetType: ObjectType.PERMISSION,
      tenantSlug: "northbridge",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const accessRequest = await tx.accessRequest.updateMany({
        where: { id: northbridgeAccessRequestId, clientTenantId: northbridgeTenantId },
        data: {
          decisionAt: now,
          reviewerUserId: userId("compliance"),
          status: WorkflowStatus.COMPLETED,
        },
      });
      const secondConfirmation = await tx.secondConfirmation.updateMany({
        where: {
          clientTenantId: northbridgeTenantId,
          id: stableId("second-confirmation:northbridge:external-access"),
        },
        data: {
          confirmedAt: now,
          confirmedByUserId: userId("security"),
          status: "confirmed",
        },
      });
      const userRole = await tx.userRole.upsert({
        where: { id: stableId("user-role:northbridge:external:statement-review") },
        create: {
          id: stableId("user-role:northbridge:external:statement-review"),
          assignedByUserId: userId("compliance"),
          clientTenantId: northbridgeTenantId,
          createdAt: now,
          objectId: documentId("northbridge", "statement"),
          objectType: ObjectType.DOCUMENT,
          roleId: roleId("external_advisor"),
          status: "active",
          updatedAt: now,
          userId: northbridgeExternalUserId,
          validFrom: now,
          validUntil: exportExpiryDate(now),
        },
        update: {
          assignedByUserId: userId("compliance"),
          clientTenantId: northbridgeTenantId,
          objectId: documentId("northbridge", "statement"),
          objectType: ObjectType.DOCUMENT,
          roleId: roleId("external_advisor"),
          status: "active",
          updatedAt: now,
          validFrom: now,
          validUntil: exportExpiryDate(now),
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: northbridgeEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: "access_request_approved",
          sourceObjectId: documentId("northbridge", "statement"),
          sourceObjectType: ObjectType.DOCUMENT,
          title: "Scoped access request approved",
          visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
        },
      });

      return {
        accessRequestRows: accessRequest.count,
        clientVisible: false,
        evidenceItemId: evidenceItem.id,
        message: "Scoped access approved after policy and second-confirmation checks.",
        secondConfirmationRows: secondConfirmation.count,
        userRoleId: userRole.id,
      };
    },
  );
}

async function runJ07ExportAudit(prisma: PrismaClient, actionId: TenantGovernanceWorkflowAction) {
  const now = new Date();

  return runTypedWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "security_officer",
      auditResult: AuditResult.PENDING,
      clientTenantId: northbridgeTenantId,
      eventType: "tenant_governance.governance.audit_export_controlled",
      evidenceRecordId: northbridgeEvidenceRecordId,
      metadataJson: {
        auditExportControlled: true,
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
        exportCannotBypassControls: true,
      },
      nextState: ExportStatus.APPROVAL_REQUIRED,
      permissionAction: "EXPORT",
      previousState: "AUDIT_HISTORY_VIEWED",
      reason: "Audit export stayed controlled and requires export approval.",
      sensitivity: "RESTRICTED",
      targetId: northbridgeExportRequestId,
      targetType: ObjectType.EXPORT_REQUEST,
      tenantSlug: "northbridge",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const exportRequest = await tx.exportRequest.updateMany({
        where: { id: northbridgeExportRequestId, clientTenantId: northbridgeTenantId },
        data: {
          approvalRequired: true,
          approvedByUserId: null,
          exportType: ExportType.ACTIVITY_LOG_EXPORT,
          generatedFileDocumentId: null,
          redactionProfile: "compliance-internal",
          scopeJson: {
            auditEventIds: [
              stableId("audit:northbridge:export"),
              stableId("audit:northbridge:compliance-release"),
              stableId("audit:northbridge:profile"),
            ],
            auditExportControlledAt: now.toISOString(),
            exportCannotBypassControls: true,
            stage18FileRealismDeferred: true,
            tenant: "Northbridge Family Office",
          },
          status: ExportStatus.APPROVAL_REQUIRED,
        },
      });
      const evidenceItem = await tx.evidenceItem.create({
        data: {
          evidenceRecordId: northbridgeEvidenceRecordId,
          hash: stableEvidenceHash(`${actionId}:${now.toISOString()}`),
          itemType: "audit_export_controlled",
          sourceObjectId: northbridgeExportRequestId,
          sourceObjectType: ObjectType.EXPORT_REQUEST,
          title: "Audit export control recorded",
          visibilityStatus: VisibilityStatus.INTERNAL_ONLY,
        },
      });

      return {
        clientVisible: false,
        evidenceItemId: evidenceItem.id,
        exportRows: exportRequest.count,
        message: "Audit export remains approval-gated.",
      };
    },
  );
}

export async function runTenantGovernanceWorkflowAction(
  prisma: PrismaClient,
  actionId: TenantGovernanceWorkflowAction,
  scope: TenantGovernanceResolvedActionScope,
) {
  assertTenantGovernanceActionScope(actionId, scope);

  const command = tenantGovernanceCommandForAction(actionId);
  const result =
    actionId === "j06.newTenant"
      ? await runJ06TenantCreateIntent(prisma, actionId, scope)
      : actionId === "j06.continueTenant"
        ? await runJ06ContinueTenant(prisma, actionId, scope)
        : actionId === "j06.assignTeam"
          ? await runJ06AssignTeam(prisma, actionId, scope)
          : actionId === "j06.openInvitation"
            ? await runJ06OpenInvitation(prisma, actionId, scope)
            : actionId === "j06.sendInvitation"
              ? await runJ06SendInvitation(prisma, actionId, scope)
              : actionId === "j07.inviteUser"
                ? await runJ07InviteUser(prisma, actionId, scope)
                : actionId === "j07.sendInvitation"
                  ? await runJ07SendInvitation(prisma, actionId, scope)
                  : actionId === "j07.saveRoleChanges"
                    ? await runJ07SaveRoleChanges(prisma, actionId)
                    : actionId === "j07.approveAccess"
                      ? await runJ07ApproveAccess(prisma, actionId)
                      : await runJ07ExportAudit(prisma, actionId);

  return {
    canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
    clientVisible: false,
    command,
    noClientRelease: true,
    result,
  };
}
