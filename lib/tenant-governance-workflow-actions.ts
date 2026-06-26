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

import { stableId } from "@/lib/stable-id";
import {
  tenantGovernanceCanonicalApiRoute,
  tenantGovernanceCommandForAction,
  type TenantGovernanceWorkflowAction,
} from "@/lib/tenant-governance-action-contract";
import { runDemoWorkflowMutation } from "@/lib/typed-workflow-command-bus";

export {
  isTenantGovernanceWorkflowAction,
  tenantGovernanceCanonicalApiRoute,
  tenantGovernanceCommandForAction,
  type TenantGovernanceWorkflowAction,
} from "@/lib/tenant-governance-action-contract";

const platformTenantId = stableId("platform:alphavest");
const morganTenantId = tenantId("morgan");
const northbridgeTenantId = tenantId("northbridge");
const northbridgeEvidenceRecordId = evidenceRecordId("northbridge");
const northbridgeAccessRequestId = accessRequestId("northbridge");
const northbridgeExportRequestId = exportRequestId("northbridge");
const northbridgeExternalUserId = userId("northbridge:external");
const northbridgeInvitedUserId = userId("northbridge:emily-roberts");
const northbridgePortfolioManagerRoleId = stableId("role:northbridge:portfolio_manager");
const morganPrincipalUserId = userId("morgan:principal");

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

async function runJ06TenantCreateIntent(prisma: PrismaClient, actionId: TenantGovernanceWorkflowAction) {
  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "admin",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: morganTenantId,
      eventType: "tenant_governance.tenant.create_intent",
      metadataJson: {
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
        tenantSlug: "morgan",
        workflowGate: "tenant_onboarding_started",
      },
      nextState: TenantStatus.DRAFT,
      permissionAction: "CREATE",
      previousState: TenantStatus.ONBOARDING,
      reason: "Admin opened tenant creation flow for the Morgan onboarding fixture.",
      targetId: morganTenantId,
      targetType: ObjectType.TENANT,
      tenantSlug: "morgan",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "DRAFT",
    },
    async (tx) => {
      const tenant = await tx.clientTenant.updateMany({
        where: { id: morganTenantId },
        data: {
          onboardingCompletedAt: null,
          status: TenantStatus.DRAFT,
        },
      });

      return {
        clientVisible: false,
        message: "Tenant draft state saved for onboarding.",
        tenantRows: tenant.count,
      };
    },
  );
}

async function runJ06ContinueTenant(prisma: PrismaClient, actionId: TenantGovernanceWorkflowAction) {
  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "admin",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: morganTenantId,
      eventType: "tenant_governance.tenant.details_saved",
      metadataJson: {
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
        jurisdiction: "United Kingdom",
        serviceTier: "Signature",
        tenantSlug: "morgan",
      },
      nextState: TenantStatus.ONBOARDING,
      permissionAction: "EDIT",
      previousState: TenantStatus.DRAFT,
      reason: "Tenant details saved and moved to onboarding setup.",
      targetId: morganTenantId,
      targetType: ObjectType.TENANT,
      tenantSlug: "morgan",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const tenant = await tx.clientTenant.updateMany({
        where: { id: morganTenantId },
        data: {
          dataRegion: "EU",
          jurisdiction: "United Kingdom",
          legalName: "Morgan Family Office LLP",
          onboardingCompletedAt: null,
          relationshipTier: "Signature",
          riskRating: "Medium",
          status: TenantStatus.ONBOARDING,
        },
      });

      return {
        clientVisible: false,
        message: "Tenant details saved and onboarding setup opened.",
        tenantRows: tenant.count,
      };
    },
  );
}

async function runJ06AssignTeam(prisma: PrismaClient, actionId: TenantGovernanceWorkflowAction) {
  const now = new Date();
  const assignments = [
    ["advisor", "senior_wealth_advisor"],
    ["analyst", "analyst"],
    ["compliance", "compliance_officer"],
    ["success", "client_success"],
  ] as const;

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "admin",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: morganTenantId,
      eventType: "tenant_governance.tenant.team_assigned",
      metadataJson: {
        assignedRoles: assignments.map(([, roleKey]) => roleKey),
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
        tenantSlug: "morgan",
      },
      nextState: "TEAM_ASSIGNED",
      permissionAction: "ASSIGN",
      previousState: TenantStatus.ONBOARDING,
      reason: "Admin assigned required AlphaVest service team roles.",
      targetId: morganTenantId,
      targetType: ObjectType.TENANT,
      tenantSlug: "morgan",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const tenant = await tx.clientTenant.updateMany({
        where: { id: morganTenantId },
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
            where: { id: stableId(`user-role:morgan:${actorKey}:${roleKey}`) },
            create: {
              id: stableId(`user-role:morgan:${actorKey}:${roleKey}`),
              assignedByUserId: userId("admin"),
              clientTenantId: morganTenantId,
              createdAt: now,
              roleId: roleId(roleKey),
              status: "active",
              updatedAt: now,
              userId: userId(actorKey),
              validFrom: now,
            },
            update: {
              assignedByUserId: userId("admin"),
              clientTenantId: morganTenantId,
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
            clientTenantId: morganTenantId,
            platformTenantId,
            policyKey: "tenant.onboarding_controls",
            version: "2026.06",
          },
        },
        create: {
          id: stableId("policy:morgan:onboarding-controls:v1"),
          category: "onboarding",
          clientTenantId: morganTenantId,
          createdAt: now,
          createdByUserId: userId("admin"),
          effectiveFrom: now,
          name: "Morgan Family Office Onboarding Controls",
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
        tenantRows: tenant.count,
        userRoleRows: userRoles.length,
      };
    },
  );
}

async function runJ06OpenInvitation(prisma: PrismaClient, actionId: TenantGovernanceWorkflowAction) {
  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "admin",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: morganTenantId,
      eventType: "tenant_governance.tenant.invitation_opened",
      metadataJson: {
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
        inviteEmail: "principal.morgan@example.demo",
        tenantSlug: "morgan",
      },
      nextState: "INVITATION_OPENED",
      permissionAction: "INVITE",
      previousState: TenantStatus.ONBOARDING,
      reason: "Admin opened principal invitation drawer.",
      targetId: morganPrincipalUserId,
      targetType: ObjectType.USER,
      tenantSlug: "morgan",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async () => ({
      clientVisible: false,
      message: "Tenant invitation drawer audited.",
    }),
  );
}

async function runJ06SendInvitation(prisma: PrismaClient, actionId: TenantGovernanceWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "admin",
      auditResult: AuditResult.PENDING,
      clientTenantId: morganTenantId,
      eventType: "tenant_governance.tenant.invitation_sent",
      metadataJson: {
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
        inviteEmail: "principal.morgan@example.demo",
        noEmailDelivery: true,
        tenantSlug: "morgan",
      },
      nextState: UserStatus.INVITED,
      permissionAction: "INVITE",
      previousState: TenantStatus.ONBOARDING,
      reason: "Admin sent demo principal invitation without real email delivery.",
      targetId: morganPrincipalUserId,
      targetType: ObjectType.USER,
      tenantSlug: "morgan",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const tenant = await tx.clientTenant.updateMany({
        where: { id: morganTenantId },
        data: {
          onboardingCompletedAt: null,
          status: TenantStatus.ONBOARDING,
        },
      });
      const user = await tx.user.updateMany({
        where: { id: morganPrincipalUserId },
        data: {
          lastLoginAt: null,
          mfaEnabled: false,
          status: UserStatus.INVITED,
        },
      });
      const userRole = await tx.userRole.upsert({
        where: { id: stableId("user-role:morgan:principal:principal") },
        create: {
          id: stableId("user-role:morgan:principal:principal"),
          assignedByUserId: userId("admin"),
          clientTenantId: morganTenantId,
          createdAt: now,
          roleId: roleId("principal"),
          status: "pending_invite",
          updatedAt: now,
          userId: morganPrincipalUserId,
          validFrom: now,
        },
        update: {
          assignedByUserId: userId("admin"),
          status: "pending_invite",
          updatedAt: now,
          validFrom: now,
        },
      });
      const consent = await tx.consentRecord.upsert({
        where: { id: stableId("consent:morgan:principal:onboarding-invite:2026.06") },
        create: {
          id: stableId("consent:morgan:principal:onboarding-invite:2026.06"),
          clientTenantId: morganTenantId,
          consentType: "privacy_notice",
          createdAt: now,
          source: "demo_invite",
          status: "pending",
          userId: morganPrincipalUserId,
          version: "2026.06",
        },
        update: {
          acceptedAt: null,
          source: "demo_invite",
          status: "pending",
          withdrawnAt: null,
        },
      });

      return {
        clientVisible: false,
        consentId: consent.id,
        message: "Tenant principal invitation saved in demo state.",
        tenantRows: tenant.count,
        userRoleId: userRole.id,
        userRows: user.count,
      };
    },
  );
}

async function runJ07InviteUser(prisma: PrismaClient, actionId: TenantGovernanceWorkflowAction) {
  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "admin",
      auditResult: AuditResult.SUCCESS,
      clientTenantId: northbridgeTenantId,
      eventType: "tenant_governance.governance.invite_opened",
      metadataJson: {
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
        inviteEmail: "emily.roberts@example.test",
        roleScopeRequired: true,
      },
      nextState: "INVITE_DRAWER_OPENED",
      permissionAction: "INVITE",
      previousState: "NO_INVITE_STARTED",
      reason: "Admin opened a scoped governance invitation workflow.",
      sensitivity: "RESTRICTED",
      targetId: northbridgeInvitedUserId,
      targetType: ObjectType.USER,
      tenantSlug: "northbridge",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async () => ({
      clientVisible: false,
      message: "Governance invitation drawer audited.",
    }),
  );
}

async function runJ07SendInvitation(prisma: PrismaClient, actionId: TenantGovernanceWorkflowAction) {
  const now = new Date();

  return runDemoWorkflowMutation(
    prisma,
    {
      actionId,
      actorRoleKey: "admin",
      auditResult: AuditResult.PENDING,
      clientTenantId: northbridgeTenantId,
      eventType: "tenant_governance.governance.invitation_sent",
      metadataJson: {
        canonicalApiRoute: tenantGovernanceCanonicalApiRoute,
        command: tenantGovernanceCommandForAction(actionId),
        inviteEmail: "emily.roberts@example.test",
        noEmailDelivery: true,
        scopedRole: "analyst",
      },
      nextState: UserStatus.INVITED,
      permissionAction: "INVITE",
      previousState: "INVITE_DRAWER_OPENED",
      reason: "Admin sent a scoped governance invite without real email delivery.",
      sensitivity: "RESTRICTED",
      targetId: northbridgeInvitedUserId,
      targetType: ObjectType.USER,
      tenantSlug: "northbridge",
      visibilityStatus: "INTERNAL_ONLY",
      workflowState: "IN_REVIEW",
    },
    async (tx) => {
      const user = await tx.user.upsert({
        where: { id: northbridgeInvitedUserId },
        create: {
          id: northbridgeInvitedUserId,
          displayName: "Emily Roberts",
          email: "emily.roberts@example.test",
          isServiceAccount: false,
          lastLoginAt: null,
          mfaEnabled: false,
          platformTenantId,
          preferredLocale: "en-ZA",
          status: UserStatus.INVITED,
          timezone: "Africa/Johannesburg",
        },
        update: {
          displayName: "Emily Roberts",
          email: "emily.roberts@example.test",
          lastLoginAt: null,
          mfaEnabled: false,
          status: UserStatus.INVITED,
        },
      });
      const profile = await tx.userProfile.upsert({
        where: { id: stableId("user-profile:northbridge:emily-roberts") },
        create: {
          id: stableId("user-profile:northbridge:emily-roberts"),
          clientTenantId: northbridgeTenantId,
          countryOfResidence: "South Africa",
          firstName: "Emily",
          lastName: "Roberts",
          relationshipLabel: "Investment committee delegate",
          sensitivity: Sensitivity.CONFIDENTIAL,
          userId: user.id,
        },
        update: {
          clientTenantId: northbridgeTenantId,
          countryOfResidence: "South Africa",
          firstName: "Emily",
          lastName: "Roberts",
          relationshipLabel: "Investment committee delegate",
          sensitivity: Sensitivity.CONFIDENTIAL,
        },
      });
      const userRole = await tx.userRole.upsert({
        where: { id: stableId("user-role:northbridge:emily-roberts:analyst") },
        create: {
          id: stableId("user-role:northbridge:emily-roberts:analyst"),
          assignedByUserId: userId("admin"),
          clientTenantId: northbridgeTenantId,
          createdAt: now,
          roleId: roleId("analyst"),
          status: "pending_invite",
          updatedAt: now,
          userId: user.id,
          validFrom: now,
        },
        update: {
          assignedByUserId: userId("admin"),
          clientTenantId: northbridgeTenantId,
          roleId: roleId("analyst"),
          status: "pending_invite",
          updatedAt: now,
          validFrom: now,
        },
      });

      return {
        clientVisible: false,
        message: "Scoped governance invitation saved in demo state.",
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

  return runDemoWorkflowMutation(
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

  return runDemoWorkflowMutation(
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

  return runDemoWorkflowMutation(
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
            phase18FileRealismDeferred: true,
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
) {
  const command = tenantGovernanceCommandForAction(actionId);
  const result =
    actionId === "j06.newTenant"
      ? await runJ06TenantCreateIntent(prisma, actionId)
      : actionId === "j06.continueTenant"
        ? await runJ06ContinueTenant(prisma, actionId)
        : actionId === "j06.assignTeam"
          ? await runJ06AssignTeam(prisma, actionId)
          : actionId === "j06.openInvitation"
            ? await runJ06OpenInvitation(prisma, actionId)
            : actionId === "j06.sendInvitation"
              ? await runJ06SendInvitation(prisma, actionId)
              : actionId === "j07.inviteUser"
                ? await runJ07InviteUser(prisma, actionId)
                : actionId === "j07.sendInvitation"
                  ? await runJ07SendInvitation(prisma, actionId)
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
