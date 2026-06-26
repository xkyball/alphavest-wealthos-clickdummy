import { AuditResult, ObjectType, type Prisma, type PrismaClient } from "@prisma/client";

import { demoPlatformTenantId, type DemoRoleKey } from "@/lib/demo-session";
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
  actorRoleKey: DemoRoleKey;
  eventType: string;
  metadataJson: Prisma.InputJsonObject;
  nextState: string;
  previousState: string;
  reason: string;
  targetId: string;
  targetType: ObjectType;
};

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
        targetId: stableId("platform-admin:security-configuration"),
        targetType: ObjectType.PERMISSION,
      };
  }
}

export async function runPlatformAdminWorkflowAction(
  prisma: PrismaClient,
  actionId: PlatformAdminWorkflowAction,
) {
  const command = platformAdminCommandForAction(actionId);
  const spec = specForAction(actionId);
  const audit = await prisma.auditEvent.create({
    data: {
      actorRoleKey: spec.actorRoleKey,
      actorUserId: stableId(`platform-admin:actor:${spec.actorRoleKey}`),
      eventType: spec.eventType,
      metadataJson: {
        ...spec.metadataJson,
        clientVisible: false,
        noAdviceExecution: true,
        noClientRelease: true,
      },
      nextState: spec.nextState,
      platformTenantId: demoPlatformTenantId,
      previousState: spec.previousState,
      reason: spec.reason,
      result: AuditResult.SUCCESS,
      targetId: spec.targetId,
      targetType: spec.targetType,
    },
  });

  return {
    auditEventId: audit.id,
    auditRows: 1,
    canonicalApiRoute: platformAdminCanonicalApiRoute,
    clientVisible: false,
    command,
    message: "Platform admin command recorded. No advice, release, export approval or client visibility was created.",
    noAdviceExecution: true,
    noClientRelease: true,
  };
}
