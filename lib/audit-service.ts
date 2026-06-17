import type { DemoActor, DemoRole } from "@/lib/demo-session";
import type { AuditResult, ObjectType, PermissionAction, UUID } from "@/lib/domain-types";
import type { PermissionDecision } from "@/lib/permission-engine";

export type AuditEventDraft = {
  platformTenantId: UUID;
  clientTenantId?: UUID;
  actorUserId: UUID;
  actorRoleKey: string;
  eventType: string;
  targetType: ObjectType;
  targetId?: UUID;
  action: PermissionAction;
  result: AuditResult;
  reason: string;
  metadata: Record<string, unknown>;
};

function previewEvent(input: {
  actor: DemoActor;
  role: DemoRole;
  platformTenantId: UUID;
  clientTenantId?: UUID;
  targetType: ObjectType;
  targetId?: UUID;
  action: PermissionAction;
  permission: PermissionDecision;
  result?: AuditResult;
}): AuditEventDraft {
  return {
    platformTenantId: input.platformTenantId,
    clientTenantId: input.clientTenantId,
    actorUserId: input.actor.id,
    actorRoleKey: input.role.key,
    eventType: `demo.${input.targetType.toLowerCase()}.${input.action.toLowerCase()}`,
    targetType: input.targetType,
    targetId: input.targetId,
    action: input.action,
    result: input.result ?? (input.permission.allowed ? "SUCCESS" : "DENIED"),
    reason: input.permission.reason,
    metadata: {
      demoMode: true,
      requiresAudit: input.permission.requiresAudit,
      requiresSecondConfirmation: input.permission.requiresSecondConfirmation,
      requiresComplianceReview: input.permission.requiresComplianceReview,
    },
  };
}

export const auditService = {
  previewEvent,
};

