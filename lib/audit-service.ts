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

export type CriticalAuditActionFamily =
  | "access-denial"
  | "approval"
  | "block"
  | "export"
  | "governance"
  | "release"
  | "review"
  | "upload";

export const firstBuildAuditContract = "FIRST_BUILD_PHASE_6_BP09";

export type AuditPersistencePolicyInput = {
  action: PermissionAction;
  actorUserId?: UUID | null;
  actorRoleKey?: string | null;
  auditPersistenceAvailable?: boolean;
  clientTenantId?: UUID | null;
  eventType: string;
  nextState?: string | null;
  platformTenantId?: UUID | null;
  previousState?: string | null;
  reason?: string | null;
  result: AuditResult;
  targetId?: UUID | null;
  targetType: ObjectType;
};

export class AuditMinimumFieldsError extends Error {
  constructor(public readonly missingFields: string[]) {
    super(`Required audit fields are missing: ${missingFields.join(", ")}`);
  }
}

export class AuditPersistenceRequiredError extends Error {
  constructor(public readonly eventType: string) {
    super("Required audit persistence is unavailable; safety action was not applied.");
  }
}

const criticalAuditActions = new Set<PermissionAction>([
  "UPLOAD",
  "REVIEW",
  "APPROVE",
  "RELEASE",
  "BLOCK",
  "EXPORT",
  "INVITE",
  "ASSIGN",
  "REVOKE",
  "MANAGE",
]);

function criticalActionFamily(input: Pick<AuditPersistencePolicyInput, "action" | "result">): CriticalAuditActionFamily {
  if (input.result === "DENIED") return "access-denial";

  switch (input.action) {
    case "UPLOAD":
      return "upload";
    case "REVIEW":
      return "review";
    case "APPROVE":
      return "approval";
    case "RELEASE":
      return "release";
    case "BLOCK":
      return "block";
    case "EXPORT":
      return "export";
    case "INVITE":
    case "ASSIGN":
    case "REVOKE":
    case "MANAGE":
      return "governance";
    default:
      return "review";
  }
}

function missingAuditFields(input: AuditPersistencePolicyInput) {
  const missing: string[] = [];

  if (!input.platformTenantId) missing.push("platformTenantId");
  if (!input.actorUserId) missing.push("actorUserId");
  if (!input.actorRoleKey) missing.push("actorRoleKey");
  if (!input.eventType) missing.push("eventType");
  if (!input.targetType) missing.push("targetType");
  if (!input.targetId) missing.push("targetId");
  if (!input.action) missing.push("action");
  if (!input.previousState) missing.push("previousState");
  if (!input.nextState) missing.push("nextState");
  if (!input.result) missing.push("result");
  if (!input.reason) missing.push("reason");

  return missing;
}

function assertCriticalAuditWritable(input: AuditPersistencePolicyInput) {
  if (!criticalAuditActions.has(input.action)) {
    return;
  }

  const missing = missingAuditFields(input);
  if (missing.length > 0) {
    throw new AuditMinimumFieldsError(missing);
  }

  if (input.auditPersistenceAvailable === false) {
    throw new AuditPersistenceRequiredError(input.eventType);
  }
}

function criticalAuditMetadata(input: AuditPersistencePolicyInput) {
  const family = criticalActionFamily(input);

  return {
    auditContract: firstBuildAuditContract,
    auditMinimumFields: [
      "actorUserId",
      "actorRoleKey",
      "clientTenantId",
      "targetType",
      "targetId",
      "previousState",
      "nextState",
      "result",
      "reason",
    ],
    criticalActionFamily: family,
    failClosedOnAuditPersistence: criticalAuditActions.has(input.action),
  };
}

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
  assertCriticalAuditWritable,
  criticalAuditMetadata,
  previewEvent,
};
