export type UxLifecycleKind =
  | "base"
  | "modal"
  | "drawer"
  | "confirmation"
  | "capture_review";

export type UxLifecycleCloseSemantics =
  | "escape-backdrop-close-button-safe"
  | "blocked-while-submitting"
  | "not-applicable";

export type UxLifecycleCancelSemantics = "no-submit-no-mutation" | "not-applicable";

export type UxLifecycleSubmitSemantics =
  | "owner-owned-confirmation-only"
  | "owner-owned-where-present"
  | "owner-owned-explicit-action"
  | "not-applicable";

export type UxLifecycleStatusSemantics =
  | "owner-handles-validation-loading-success-error-blocked"
  | "static-state-only"
  | "capture-review-only";

export type UxLifecycleFocusReturn = "parent-context" | "trigger" | "not-applicable";

export type UxLifecycleContract = {
  a11yEscapeBlocked: "blocked" | "blocked-while-submitting" | "not-applicable";
  a11yEscapeEnabled: "enabled" | "not-applicable";
  cancel: UxLifecycleCancelSemantics;
  captureKind: UxLifecycleKind;
  closeBlocked: UxLifecycleCloseSemantics;
  closeEnabled: UxLifecycleCloseSemantics;
  focusReturn: UxLifecycleFocusReturn;
  kind: UxLifecycleKind;
  noOverclaim: "true";
  open: "controlled-by-owner-state" | "static-base-state" | "capture-derived";
  phase10Tasks: string;
  status: UxLifecycleStatusSemantics;
  submit: UxLifecycleSubmitSemantics;
};

export type UxLifecycleRuntimeAttributes = Record<`data-${string}`, string>;

export type UxCaptureFileKind = "screen" | "modal" | "drawer";

export type UxCaptureVariantKind = "base" | "modal" | "drawer" | "confirmation";

export type UxCaptureVariant = {
  fileKind: UxCaptureFileKind;
  isOverlay: boolean;
  lifecycleKind: UxCaptureVariantKind;
  stateLabel: string;
};

export type UxStateFamily =
  | "loading"
  | "empty"
  | "error"
  | "validation"
  | "permission_denied"
  | "blocked"
  | "restricted"
  | "success"
  | "hidden"
  | "reference"
  | "deferred"
  | "audit_unavailable"
  | "export_pending"
  | "export_redaction"
  | "export_failed";

export type UxStateSeverity = "neutral" | "info" | "success" | "warning" | "critical";

export type UxComponentState =
  | "audit-unavailable"
  | "blocked"
  | "denied"
  | "empty"
  | "error"
  | "export-failed"
  | "export-pending"
  | "export-redaction"
  | "hidden"
  | "hold-blocked"
  | "internal-only"
  | "loading"
  | "p1-deferred"
  | "redacted"
  | "reference-only"
  | "restricted"
  | "success"
  | "validation";

export type UxStateContract = {
  captureKind: UxLifecycleKind;
  componentState: UxComponentState;
  family: UxStateFamily;
  lifecycleKind: UxLifecycleKind;
  noOverclaimRule: string;
  severity: UxStateSeverity;
};

export const uxLifecycleContracts = {
  base: {
    a11yEscapeBlocked: "not-applicable",
    a11yEscapeEnabled: "not-applicable",
    cancel: "not-applicable",
    captureKind: "base",
    closeBlocked: "not-applicable",
    closeEnabled: "not-applicable",
    focusReturn: "not-applicable",
    kind: "base",
    noOverclaim: "true",
    open: "static-base-state",
    phase10Tasks: "UX-A11Y-004",
    status: "static-state-only",
    submit: "not-applicable",
  },
  modal: {
    a11yEscapeBlocked: "blocked-while-submitting",
    a11yEscapeEnabled: "enabled",
    cancel: "no-submit-no-mutation",
    captureKind: "modal",
    closeBlocked: "blocked-while-submitting",
    closeEnabled: "escape-backdrop-close-button-safe",
    focusReturn: "parent-context",
    kind: "modal",
    noOverclaim: "true",
    open: "controlled-by-owner-state",
    phase10Tasks: "UX-A11Y-001 UX-A11Y-003",
    status: "owner-handles-validation-loading-success-error-blocked",
    submit: "owner-owned-confirmation-only",
  },
  drawer: {
    a11yEscapeBlocked: "blocked",
    a11yEscapeEnabled: "enabled",
    cancel: "no-submit-no-mutation",
    captureKind: "drawer",
    closeBlocked: "blocked-while-submitting",
    closeEnabled: "escape-backdrop-close-button-safe",
    focusReturn: "trigger",
    kind: "drawer",
    noOverclaim: "true",
    open: "controlled-by-owner-state",
    phase10Tasks: "UX-A11Y-001 UX-A11Y-002",
    status: "owner-handles-validation-loading-success-error-blocked",
    submit: "owner-owned-where-present",
  },
  confirmation: {
    a11yEscapeBlocked: "blocked-while-submitting",
    a11yEscapeEnabled: "enabled",
    cancel: "no-submit-no-mutation",
    captureKind: "confirmation",
    closeBlocked: "blocked-while-submitting",
    closeEnabled: "escape-backdrop-close-button-safe",
    focusReturn: "parent-context",
    kind: "confirmation",
    noOverclaim: "true",
    open: "controlled-by-owner-state",
    phase10Tasks: "UX-A11Y-001 UX-A11Y-003",
    status: "owner-handles-validation-loading-success-error-blocked",
    submit: "owner-owned-explicit-action",
  },
  capture_review: {
    a11yEscapeBlocked: "not-applicable",
    a11yEscapeEnabled: "not-applicable",
    cancel: "not-applicable",
    captureKind: "capture_review",
    closeBlocked: "not-applicable",
    closeEnabled: "not-applicable",
    focusReturn: "not-applicable",
    kind: "capture_review",
    noOverclaim: "true",
    open: "capture-derived",
    phase10Tasks: "UX-A11Y-004",
    status: "capture-review-only",
    submit: "not-applicable",
  },
} as const satisfies Record<UxLifecycleKind, UxLifecycleContract>;

export const uxLifecycleKinds = Object.keys(uxLifecycleContracts) as UxLifecycleKind[];

export const uxStateContracts = {
  "audit-unavailable": {
    captureKind: "base",
    componentState: "audit-unavailable",
    family: "audit_unavailable",
    lifecycleKind: "base",
    noOverclaimRule: "Audit visibility or outage state is not proof of audit persistence.",
    severity: "critical",
  },
  blocked: {
    captureKind: "base",
    componentState: "blocked",
    family: "blocked",
    lifecycleKind: "base",
    noOverclaimRule: "Blocked state prevents downstream completion until owner gates pass.",
    severity: "critical",
  },
  denied: {
    captureKind: "base",
    componentState: "denied",
    family: "permission_denied",
    lifecycleKind: "base",
    noOverclaimRule: "Permission denied state is fail-closed and cannot imply bypass authority.",
    severity: "critical",
  },
  empty: {
    captureKind: "base",
    componentState: "empty",
    family: "empty",
    lifecycleKind: "base",
    noOverclaimRule: "Empty state is absence of available content, not product completion.",
    severity: "neutral",
  },
  error: {
    captureKind: "base",
    componentState: "error",
    family: "error",
    lifecycleKind: "base",
    noOverclaimRule: "Error state blocks downstream success claims.",
    severity: "critical",
  },
  "export-failed": {
    captureKind: "base",
    componentState: "export-failed",
    family: "export_failed",
    lifecycleKind: "base",
    noOverclaimRule: "Export failure cannot imply approval, download, share or client acceptance.",
    severity: "critical",
  },
  "export-pending": {
    captureKind: "base",
    componentState: "export-pending",
    family: "export_pending",
    lifecycleKind: "base",
    noOverclaimRule: "Export pending is not approval, download, share or client acceptance.",
    severity: "info",
  },
  "export-redaction": {
    captureKind: "base",
    componentState: "export-redaction",
    family: "export_redaction",
    lifecycleKind: "base",
    noOverclaimRule: "Redaction review is not export approval or delivery.",
    severity: "warning",
  },
  hidden: {
    captureKind: "base",
    componentState: "hidden",
    family: "hidden",
    lifecycleKind: "base",
    noOverclaimRule: "Hidden state suppresses content and must not imply client-safe availability.",
    severity: "warning",
  },
  "hold-blocked": {
    captureKind: "base",
    componentState: "hold-blocked",
    family: "blocked",
    lifecycleKind: "base",
    noOverclaimRule: "Hold state remains blocked until an explicit scope unlock exists.",
    severity: "critical",
  },
  "internal-only": {
    captureKind: "base",
    componentState: "internal-only",
    family: "restricted",
    lifecycleKind: "base",
    noOverclaimRule: "Internal-only state is not client-visible output.",
    severity: "warning",
  },
  loading: {
    captureKind: "base",
    componentState: "loading",
    family: "loading",
    lifecycleKind: "base",
    noOverclaimRule: "Loading state is pending work, not completion.",
    severity: "info",
  },
  "p1-deferred": {
    captureKind: "base",
    componentState: "p1-deferred",
    family: "deferred",
    lifecycleKind: "base",
    noOverclaimRule: "Deferred state is registered context only and not MVP readiness.",
    severity: "warning",
  },
  redacted: {
    captureKind: "base",
    componentState: "redacted",
    family: "hidden",
    lifecycleKind: "base",
    noOverclaimRule: "Redacted state hides content and does not prove release completion.",
    severity: "warning",
  },
  "reference-only": {
    captureKind: "base",
    componentState: "reference-only",
    family: "reference",
    lifecycleKind: "base",
    noOverclaimRule: "Reference state is visual/context only and not product workflow capability.",
    severity: "neutral",
  },
  restricted: {
    captureKind: "base",
    componentState: "restricted",
    family: "restricted",
    lifecycleKind: "base",
    noOverclaimRule: "Restricted state limits access and cannot imply bypass authority.",
    severity: "warning",
  },
  success: {
    captureKind: "base",
    componentState: "success",
    family: "success",
    lifecycleKind: "base",
    noOverclaimRule: "Success state is local to the stated action and cannot imply downstream completion.",
    severity: "success",
  },
  validation: {
    captureKind: "base",
    componentState: "validation",
    family: "validation",
    lifecycleKind: "base",
    noOverclaimRule: "Validation state blocks submission until the owner workflow accepts inputs.",
    severity: "warning",
  },
} as const satisfies Record<UxComponentState, UxStateContract>;

export const uxComponentStates = Object.keys(uxStateContracts) as UxComponentState[];

export function uxLifecycleContractForKind(kind: UxLifecycleKind): UxLifecycleContract {
  return uxLifecycleContracts[kind];
}

export function uxStateContractForComponentState(componentState: UxComponentState): UxStateContract {
  return uxStateContracts[componentState];
}

export function uxLifecycleCloseForOwner(kind: "modal" | "drawer" | "confirmation", closeAvailable: boolean): UxLifecycleCloseSemantics {
  const contract = uxLifecycleContractForKind(kind);
  return closeAvailable ? contract.closeEnabled : contract.closeBlocked;
}

export function uxLifecycleAttributesForKind(
  kind: "modal" | "drawer" | "confirmation",
  options: { closeAvailable: boolean },
): UxLifecycleRuntimeAttributes {
  const contract = uxLifecycleContractForKind(kind);

  return {
    "data-ux-a11y-escape": options.closeAvailable ? contract.a11yEscapeEnabled : contract.a11yEscapeBlocked,
    "data-ux-a11y-focus-return": contract.focusReturn,
    "data-ux-interaction-lifecycle": contract.kind,
    "data-ux-lifecycle-cancel": contract.cancel,
    "data-ux-lifecycle-capture-kind": contract.captureKind,
    "data-ux-lifecycle-close": uxLifecycleCloseForOwner(kind, options.closeAvailable),
    "data-ux-lifecycle-kind": contract.kind,
    "data-ux-lifecycle-open": contract.open,
    "data-ux-lifecycle-status": contract.status,
    "data-ux-lifecycle-submit": contract.submit,
    "data-ux-no-overclaim": contract.noOverclaim,
    "data-ux-phase10-tasks": contract.phase10Tasks,
  };
}

export function uxStateAttributesForComponentState(
  componentState: UxComponentState,
  options: { lifecycleKind?: UxLifecycleKind } = {},
): UxLifecycleRuntimeAttributes {
  const contract = uxStateContractForComponentState(componentState);
  const lifecycleKind = options.lifecycleKind ?? contract.lifecycleKind;

  return {
    "data-ux-state": contract.componentState,
    "data-ux-state-capture-kind": contract.captureKind,
    "data-ux-state-family": contract.family,
    "data-ux-state-lifecycle-kind": lifecycleKind,
    "data-ux-state-no-overclaim": contract.noOverclaimRule,
    "data-ux-state-severity": contract.severity,
  };
}

export function uxCaptureVariantForFileKind(fileKind: UxCaptureFileKind, stateLabel: string): UxCaptureVariant {
  const normalizedState = stateLabel.toLowerCase();
  const lifecycleKind: UxCaptureVariantKind =
    fileKind === "screen"
      ? "base"
      : normalizedState.includes("confirm") || normalizedState.includes("confirmation")
        ? "confirmation"
        : fileKind;

  return {
    fileKind,
    isOverlay: fileKind !== "screen",
    lifecycleKind,
    stateLabel,
  };
}
