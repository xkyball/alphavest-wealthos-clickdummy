import type { ActorContext } from "@/lib/control-layer/actor-context";
import type { ObjectScope } from "@/lib/control-layer/scope-resolver";
import {
  permissionEngine,
  type PermissionDecision,
  type PermissionSubject,
} from "@/lib/permission-engine";
import type { ObjectType, PermissionAction, UUID } from "@/lib/domain-types";

export type GuardDecisionLayer = "route" | "action" | "object" | "payload";

export type GuardRedactionMode = "none" | "redacted" | "hidden" | "mixed";

export type GuardDecision = {
  action?: PermissionAction;
  allowed: boolean;
  auditRequired: boolean;
  layer: GuardDecisionLayer;
  objectId?: UUID;
  objectType?: ObjectType;
  reason: string;
  reasonCode: string;
  redactionMode: GuardRedactionMode;
  secondConfirmationRequired: boolean;
};

export type ControlPermissionDecision = PermissionDecision & {
  action: PermissionAction;
  controlLayer: "WCL-03";
  guardDecision: GuardDecision;
  objectScopeApplied: boolean;
};

export function toGuardDecision(input: {
  action?: PermissionAction;
  decision: Pick<PermissionDecision, "allowed" | "reason" | "reasonCode" | "requiresAudit" | "requiresSecondConfirmation">;
  layer: GuardDecisionLayer;
  objectId?: UUID;
  objectType?: ObjectType;
  redactionMode?: GuardRedactionMode;
}): GuardDecision {
  return {
    action: input.action,
    allowed: input.decision.allowed,
    auditRequired: input.decision.requiresAudit,
    layer: input.layer,
    objectId: input.objectId,
    objectType: input.objectType,
    reason: input.decision.reason,
    reasonCode: input.decision.reasonCode,
    redactionMode: input.redactionMode ?? (input.layer === "payload" && !input.decision.allowed ? "hidden" : "none"),
    secondConfirmationRequired: input.decision.requiresSecondConfirmation,
  };
}

export function evaluateControlPermission(input: {
  action: PermissionAction;
  actorContext: ActorContext;
  objectScope?: ObjectScope;
  subject: PermissionSubject;
}): ControlPermissionDecision {
  const decision = permissionEngine.can(
    input.actorContext.session.actor,
    input.action,
    input.subject,
    {
      clientTenantId: input.actorContext.clientTenantId,
      objectScope: input.objectScope,
      platformTenantId: input.actorContext.platformTenantId,
      sensitivity: input.subject.sensitivity,
      workflowState: input.subject.workflowState,
    },
    input.actorContext.session.role,
  );

  return {
    ...decision,
    action: input.action,
    controlLayer: "WCL-03",
    guardDecision: toGuardDecision({
      action: input.action,
      decision,
      layer: input.subject.objectId && !decision.allowed ? "object" : "action",
      objectId: input.subject.objectId,
      objectType: input.subject.objectType,
    }),
    objectScopeApplied: Boolean(input.objectScope),
  };
}
