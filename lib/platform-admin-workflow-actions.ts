import { AuditResult, ObjectType, type Prisma, type PrismaClient } from "@prisma/client";

import { actorPlatformTenantId, type ActorRoleKey } from "@/lib/actor-session";
import {
  platformAdminCanonicalApiRoute,
  platformAdminCommandForAction,
  type PlatformAdminWorkflowAction,
} from "@/lib/platform-admin-action-contract";
import { stableId } from "@/lib/stable-id";

export {
  isPlatformAdminWorkflowAction,
  platformAdminCanonicalApiRoute,
  platformAdminCommandForAction,
  type PlatformAdminWorkflowAction,
} from "@/lib/platform-admin-action-contract";

type PlatformAdminActionSpec = {
  actorRoleKey: ActorRoleKey;
  eventType: string;
  metadataJson: Prisma.InputJsonObject;
  nextState: string;
  previousState: string;
  reason: string;
  targetLabel: string;
  targetId: string;
  targetType: ObjectType;
};

const morganTenantId = stableId("tenant:morgan");
const adminUserId = stableId("user:admin");

function specForAction(actionId: PlatformAdminWorkflowAction): PlatformAdminActionSpec {
  const command = platformAdminCommandForAction(actionId);

  switch (actionId) {
    case "j10.savePlatform":
      return {
        actorRoleKey: "admin",
        eventType: "platform_admin.platform.settings_saved",
        metadataJson: {
          canonicalApiRoute: platformAdminCanonicalApiRoute,
          command,
          retentionYears: 7,
          settingKey: "audit_retention_years",
        },
        nextState: "retention:7",
        previousState: "validated_runtime_default",
        reason: "Platform setting update recorded through typed platform-admin command.",
        targetLabel: "Audit retention",
        targetId: stableId("platform-admin:platform-setting:audit_retention_years"),
        targetType: ObjectType.PLATFORM,
      };
    case "j10.viewAudit":
      return {
        actorRoleKey: "admin",
        eventType: "platform_admin.platform.audit_viewed",
        metadataJson: {
          canonicalApiRoute: platformAdminCanonicalApiRoute,
          command,
          routeIntent: "/admin/roles",
        },
        nextState: "AUDIT_CONTEXT_VIEWED",
        previousState: "POLICY_MATRIX_VISIBLE",
        reason: "Platform audit context was opened through typed platform-admin command.",
        targetLabel: "Audit context",
        targetId: stableId("platform-admin:audit-context"),
        targetType: ObjectType.PLATFORM,
      };
    case "j10.reviewPermission":
      return {
        actorRoleKey: "security_officer",
        eventType: "platform_admin.permission.review_started",
        metadataJson: {
          canonicalApiRoute: platformAdminCanonicalApiRoute,
          command,
          routeIntent: "/admin/security",
        },
        nextState: "PERMISSION_REVIEW_STARTED",
        previousState: "ROLE_MATRIX_VISIBLE",
        reason: "Permission review was started through typed platform-admin command.",
        targetLabel: "Permission review",
        targetId: stableId("platform-admin:permission-review"),
        targetType: ObjectType.PERMISSION,
      };
    case "j10.saveSecurity":
      return {
        actorRoleKey: "security_officer",
        eventType: "platform_admin.security.configuration_saved",
        metadataJson: {
          canonicalApiRoute: platformAdminCanonicalApiRoute,
          command,
          mfaRequired: true,
          sessionMinutes: 30,
        },
        nextState: "MFA_REQUIRED_SESSION_BOUNDED",
        previousState: "DEMO_DEFAULT",
        reason: "Security configuration accepted through typed platform-admin command.",
        targetLabel: "Security configuration",
        targetId: stableId("platform-admin:security-configuration"),
        targetType: ObjectType.PERMISSION,
      };
    case "j10.versionPolicy":
      return {
        actorRoleKey: "admin",
        eventType: "platform_admin.policy.version_created",
        metadataJson: {
          canonicalApiRoute: platformAdminCanonicalApiRoute,
          command,
          policyKey: "tenant.onboarding_controls",
          reviewRequired: true,
          version: "2026.07-draft",
        },
        nextState: "POLICY_VERSION_DRAFT_HELD",
        previousState: "POLICY_VERSION_ACTIVE",
        reason: "Tenant policy draft version was recorded and held for review through typed platform-admin command.",
        targetLabel: "Tenant onboarding policy",
        targetId: stableId("policy:morgan:onboarding-controls:v2"),
        targetType: ObjectType.POLICY,
      };
  }
}

export async function runPlatformAdminWorkflowAction(
  prisma: PrismaClient,
  actionId: PlatformAdminWorkflowAction,
) {
  const command = platformAdminCommandForAction(actionId);
  const spec = specForAction(actionId);

  const result = await prisma.$transaction(async (tx) => {
    const policy =
      actionId === "j10.versionPolicy"
        ? await tx.policyDefinition.upsert({
            where: {
              platformTenantId_clientTenantId_policyKey_version: {
                clientTenantId: morganTenantId,
                platformTenantId: actorPlatformTenantId,
                policyKey: "tenant.onboarding_controls",
                version: "2026.07-draft",
              },
            },
            create: {
              id: stableId("policy:morgan:onboarding-controls:v2"),
              category: "onboarding",
              clientTenantId: morganTenantId,
              createdByUserId: adminUserId,
              effectiveFrom: null,
              name: "Morgan Family Office Onboarding Controls",
              platformTenantId: actorPlatformTenantId,
              policyKey: "tenant.onboarding_controls",
              rulesJson: {
                auditLoggingRequired: true,
                complianceOwnerRequired: true,
                principalInvitationRequired: true,
                reviewRequiredBeforeActivation: true,
                serviceTeamRequired: true,
              },
              status: "draft_review",
              version: "2026.07-draft",
            },
            update: {
              createdByUserId: adminUserId,
              effectiveFrom: null,
              rulesJson: {
                auditLoggingRequired: true,
                complianceOwnerRequired: true,
                principalInvitationRequired: true,
                reviewRequiredBeforeActivation: true,
                serviceTeamRequired: true,
              },
              status: "draft_review",
            },
          })
        : null;

    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: spec.actorRoleKey,
        actorUserId: stableId(`platform-admin:actor:${spec.actorRoleKey}`),
        eventType: spec.eventType,
        metadataJson: {
          ...spec.metadataJson,
          clientVisible: false,
          noAdviceExecution: true,
          noClientRelease: true,
          policyDefinitionId: policy?.id,
        },
        nextState: spec.nextState,
        platformTenantId: actorPlatformTenantId,
        previousState: spec.previousState,
        reason: spec.reason,
        result: AuditResult.SUCCESS,
        targetId: policy?.id ?? spec.targetId,
        targetType: spec.targetType,
      },
    });

    return { audit, policy };
  });

  return {
    auditEventId: result.audit.id,
    auditRows: 1,
    canonicalApiRoute: platformAdminCanonicalApiRoute,
    clientVisible: false,
    command,
    message: "Platform admin command recorded. No advice, release, export approval or client visibility was created.",
    noAdviceExecution: true,
    noClientRelease: true,
    policyDefinitionId: result.policy?.id,
    targetLabel: spec.targetLabel,
  };
}
