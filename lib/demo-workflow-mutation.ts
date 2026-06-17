import {
  AuditResult,
  type ObjectType as PrismaObjectType,
  type Prisma,
  type PrismaClient,
} from "@prisma/client";

import {
  createDemoSession,
  demoPlatformTenantId,
  type DemoRoleKey,
  type DemoTenantSlug,
} from "@/lib/demo-session";
import { permissionEngine } from "@/lib/permission-engine";
import type {
  ObjectType as DomainObjectType,
  PermissionAction,
  Sensitivity,
  VisibilityStatus,
  WorkflowStatus,
} from "@/lib/domain-types";

type DemoWorkflowMutationInput = {
  actionId: string;
  actorRoleKey: DemoRoleKey;
  auditResult?: AuditResult;
  clientTenantId: string;
  eventType: string;
  evidenceRecordId?: string | null;
  metadataJson?: Prisma.InputJsonObject;
  nextState: string;
  permissionAction: PermissionAction;
  permissionObjectType?: DomainObjectType;
  platformTenantId?: string;
  previousState: string;
  reason?: string | null;
  sensitivity?: Sensitivity;
  targetId: string;
  targetType: PrismaObjectType;
  tenantSlug: DemoTenantSlug;
  visibilityStatus?: VisibilityStatus;
  workflowState?: WorkflowStatus;
};

type DemoWorkflowMutationHelpers = {
  permission: Awaited<ReturnType<typeof permissionEngine.can>>;
  session: ReturnType<typeof createDemoSession>;
};

export type DemoWorkflowMutationResult<T extends Record<string, unknown>> = T & {
  auditEventId: string;
  auditRows: number;
  permission: {
    allowed: boolean;
    reason: string;
    requiresAudit: boolean;
    requiresComplianceReview: boolean;
  };
};

export async function runDemoWorkflowMutation<T extends Record<string, unknown>>(
  prisma: PrismaClient,
  input: DemoWorkflowMutationInput,
  mutate: (
    tx: Prisma.TransactionClient,
    helpers: DemoWorkflowMutationHelpers,
  ) => Promise<T>,
): Promise<DemoWorkflowMutationResult<T>> {
  const session = createDemoSession({
    roleKey: input.actorRoleKey,
    tenantSlug: input.tenantSlug,
  });
  const permission = await permissionEngine.can(
    session.actor,
    input.permissionAction,
    {
      objectId: input.targetId,
      objectType: input.permissionObjectType ?? (input.targetType as DomainObjectType),
      sensitivity: input.sensitivity ?? "CONFIDENTIAL",
      clientTenantId: input.clientTenantId,
      visibilityStatus: input.visibilityStatus ?? "COMPLIANCE_VISIBLE",
      workflowState: input.workflowState,
    },
    {
      platformTenantId: input.platformTenantId ?? demoPlatformTenantId,
      clientTenantId: input.clientTenantId,
      workflowState: input.workflowState,
    },
    session.role,
  );

  return prisma.$transaction(async (tx) => {
    if (!permission.allowed) {
      const deniedAudit = await tx.auditEvent.create({
        data: {
          actorRoleKey: session.role.key,
          actorUserId: session.actor.id,
          clientTenantId: input.clientTenantId,
          eventType: input.eventType,
          evidenceRecordId: input.evidenceRecordId ?? null,
          metadataJson: {
            actionId: input.actionId,
            demoMode: true,
            noRealAuth: true,
            permission,
            ...(input.metadataJson ?? {}),
          },
          nextState: input.previousState,
          platformTenantId: input.platformTenantId ?? demoPlatformTenantId,
          previousState: input.previousState,
          reason: permission.reason,
          result: AuditResult.DENIED,
          targetId: input.targetId,
          targetType: input.targetType,
        },
      });

      return {
        auditEventId: deniedAudit.id,
        auditRows: 1,
        permission: {
          allowed: permission.allowed,
          reason: permission.reason,
          requiresAudit: permission.requiresAudit,
          requiresComplianceReview: permission.requiresComplianceReview,
        },
      } as DemoWorkflowMutationResult<T>;
    }

    const mutationResult = await mutate(tx, { permission, session });
    const audit = await tx.auditEvent.create({
      data: {
        actorRoleKey: session.role.key,
        actorUserId: session.actor.id,
        clientTenantId: input.clientTenantId,
        eventType: input.eventType,
        evidenceRecordId: input.evidenceRecordId ?? null,
        metadataJson: {
          actionId: input.actionId,
          demoMode: true,
          noRealAuth: true,
          permission,
          ...(input.metadataJson ?? {}),
        },
        nextState: input.nextState,
        platformTenantId: input.platformTenantId ?? demoPlatformTenantId,
        previousState: input.previousState,
        reason: input.reason ?? permission.reason,
        result: input.auditResult ?? AuditResult.SUCCESS,
        targetId: input.targetId,
        targetType: input.targetType,
      },
    });

    return {
      ...mutationResult,
      auditEventId: audit.id,
      auditRows: 1,
      permission: {
        allowed: permission.allowed,
        reason: permission.reason,
        requiresAudit: permission.requiresAudit,
        requiresComplianceReview: permission.requiresComplianceReview,
      },
    };
  });
}
