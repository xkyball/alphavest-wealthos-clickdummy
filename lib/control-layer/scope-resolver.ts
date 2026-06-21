import type { ActorContext } from "@/lib/control-layer/actor-context";
import type { ObjectType, UUID } from "@/lib/domain-types";

export type TenantScope = {
  clientTenantId: UUID;
  platformTenantId: UUID;
  tenantSlug: string;
};

export type ObjectScope = {
  clientTenantId: UUID;
  objectIds: UUID[];
  objectType: ObjectType;
};

export type ScopeDeniedResult = {
  allowed: false;
  auditRequired: true;
  reason: string;
  reasonCode:
    | "WCL_SCOPE_TENANT_REQUIRED"
    | "WCL_SCOPE_CROSS_TENANT_DENIED"
    | "WCL_SCOPE_OBJECT_REQUIRED"
    | "WCL_SCOPE_OBJECT_DENIED";
};

export type ScopeResolutionResult =
  | {
      allowed: true;
      objectScope?: ObjectScope;
      reasonCode: "WCL_SCOPE_RESOLVED";
      tenantScope: TenantScope;
    }
  | ScopeDeniedResult;

export function resolveTenantObjectScope(
  actorContext: ActorContext,
  input: {
    allowedObjectIds?: UUID[];
    clientTenantId?: UUID | null;
    objectId?: UUID | null;
    objectType?: ObjectType | null;
    requireObjectScope?: boolean;
  },
): ScopeResolutionResult {
  if (!input.clientTenantId) {
    return {
      allowed: false,
      auditRequired: true,
      reason: "Tenant scope is required before payload or mutation authority is evaluated.",
      reasonCode: "WCL_SCOPE_TENANT_REQUIRED",
    };
  }

  if (input.clientTenantId !== actorContext.clientTenantId) {
    return {
      allowed: false,
      auditRequired: true,
      reason: "Requested tenant scope does not match the resolved actor context.",
      reasonCode: "WCL_SCOPE_CROSS_TENANT_DENIED",
    };
  }

  const tenantScope: TenantScope = {
    clientTenantId: input.clientTenantId,
    platformTenantId: actorContext.platformTenantId,
    tenantSlug: actorContext.tenantSlug,
  };

  if (input.requireObjectScope && (!input.objectId || !input.objectType)) {
    return {
      allowed: false,
      auditRequired: true,
      reason: "Object-scoped actions require an explicit object id and object type.",
      reasonCode: "WCL_SCOPE_OBJECT_REQUIRED",
    };
  }

  if (input.objectId && input.allowedObjectIds && !input.allowedObjectIds.includes(input.objectId)) {
    return {
      allowed: false,
      auditRequired: true,
      reason: "Requested object is outside the current object scope.",
      reasonCode: "WCL_SCOPE_OBJECT_DENIED",
    };
  }

  return {
    allowed: true,
    objectScope:
      input.objectId && input.objectType
        ? {
            clientTenantId: input.clientTenantId,
            objectIds: input.allowedObjectIds ?? [input.objectId],
            objectType: input.objectType,
          }
        : undefined,
    reasonCode: "WCL_SCOPE_RESOLVED",
    tenantScope,
  };
}
