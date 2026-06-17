import type { DemoActor, DemoRole } from "@/lib/demo-session";
import type {
  ClientVisibilityCandidate,
  WorkflowGateResult,
} from "@/lib/workflow-gate";
import { canBecomeClientVisible } from "@/lib/workflow-gate";
import type { ObjectType, Sensitivity, UUID, VisibilityStatus } from "@/lib/domain-types";
import type { PermissionDecision } from "@/lib/permission-engine";
import { permissionEngine } from "@/lib/permission-engine";

export type VisibilitySubject = {
  objectType: ObjectType;
  objectId?: UUID;
  clientTenantId?: UUID;
  sensitivity?: Sensitivity;
  visibilityStatus: VisibilityStatus;
  clientVisible?: boolean;
};

export type VisibilityDecision = {
  visible: boolean;
  reasonCode: string;
  reason: string;
  permission: PermissionDecision;
};

function canView(
  actor: DemoActor,
  role: DemoRole,
  subject: VisibilitySubject,
  platformTenantId: UUID,
  clientTenantId?: UUID
): VisibilityDecision {
  const permission = permissionEngine.can(
    actor,
    "VIEW",
    subject,
    {
      platformTenantId,
      clientTenantId,
      sensitivity: subject.sensitivity,
      clientVisibilityState: subject.visibilityStatus,
    },
    role
  );

  const restrictedClientView =
    !role.internal && ["INTERNAL_ONLY", "ADVISOR_VISIBLE", "COMPLIANCE_VISIBLE"].includes(subject.visibilityStatus);

  return {
    visible: permission.allowed && !restrictedClientView,
    reasonCode: restrictedClientView ? "DEMO_CLIENT_RESTRICTED" : permission.reasonCode,
    reason: restrictedClientView
      ? "Client-side demo roles cannot view internal-only, advisor-only or compliance-only records."
      : permission.reason,
    permission,
  };
}

function clientRelease(candidate: ClientVisibilityCandidate): WorkflowGateResult {
  return canBecomeClientVisible(candidate);
}

export const visibilityEngine = {
  canView,
  canBecomeClientVisible: clientRelease,
};

