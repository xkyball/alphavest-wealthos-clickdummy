import type { ActorContext } from "@/lib/control-layer/actor-context";
import type { ObjectScope } from "@/lib/control-layer/scope-resolver";
import {
  permissionEngine,
  type PermissionDecision,
  type PermissionSubject,
} from "@/lib/permission-engine";
import type { PermissionAction } from "@/lib/domain-types";

export type ControlPermissionDecision = PermissionDecision & {
  action: PermissionAction;
  controlLayer: "WCL-03";
  objectScopeApplied: boolean;
};

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
    objectScopeApplied: Boolean(input.objectScope),
  };
}
