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

export function uxLifecycleContractForKind(kind: UxLifecycleKind): UxLifecycleContract {
  return uxLifecycleContracts[kind];
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
