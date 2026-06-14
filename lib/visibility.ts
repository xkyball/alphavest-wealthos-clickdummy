import type { PermissionDecision } from "./permissions";

export type ReleaseState = {
  advisorApproval: boolean;
  complianceRelease: boolean;
  evidenceRecordExists: boolean;
  permissionCheck: boolean;
  clientVisibilityState: "draft" | "blocked" | "released";
};

export type AdviceLikeOutputClassification = "advice" | "recommendation" | "decision_pack" | "communication" | "information";

export type AdviceVisibilityInput = {
  advisorApproval: boolean;
  complianceRelease: boolean;
  evidenceRecord: boolean | { id: string; locked?: boolean };
  permissionCheck: boolean | PermissionDecision;
  outputClassification: AdviceLikeOutputClassification;
  clientVisibilityState: "draft" | "blocked" | "released";
};

export function canShowClientAdviceLikeOutput(input: AdviceVisibilityInput) {
  const evidenceRecordExists = Boolean(input.evidenceRecord);
  const permissionAllowed =
    typeof input.permissionCheck === "boolean" ? input.permissionCheck : input.permissionCheck.allowed;
  const checks = {
    advisorApproval: input.advisorApproval,
    complianceRelease: input.complianceRelease,
    evidenceRecordExists,
    permissionCheck: permissionAllowed,
    releasedState: input.clientVisibilityState === "released"
  };
  const missing = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([key]) => key);

  return {
    clientVisible: missing.length === 0,
    missing,
    badge: missing.length === 0 ? "CLIENT" : "BLOCKED",
    outputClassification: input.outputClassification
  } as const;
}

export function evaluateClientVisibility(state: ReleaseState) {
  return canShowClientAdviceLikeOutput({
    advisorApproval: state.advisorApproval,
    complianceRelease: state.complianceRelease,
    evidenceRecord: state.evidenceRecordExists,
    permissionCheck: state.permissionCheck,
    outputClassification: "recommendation",
    clientVisibilityState: state.clientVisibilityState
  });
}
