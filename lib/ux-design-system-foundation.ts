export type UxPrimitiveDensity = "compact" | "default" | "comfortable";

export type UxPrimitiveSpacing = "tight" | "regular" | "relaxed";

export type UxPrimitiveTextRole =
  | "body"
  | "caption"
  | "eyebrow"
  | "heading"
  | "metadata";

export type UxPrimitiveStatusFamily =
  | "critical"
  | "info"
  | "internal"
  | "neutral"
  | "restricted"
  | "success"
  | "warning";

export type UxPrimitiveStatusMeaning =
  | "blocked"
  | "destructive"
  | "info"
  | "internal"
  | "neutral"
  | "restricted"
  | "success"
  | "warning";

export type UxPrimitiveStatusHierarchy = "critical" | "standard" | "supporting";

export type UxPrimitiveStatusSeverity = "critical" | "info" | "neutral" | "success" | "warning";

export type UxPrimitiveInteractionState = "active" | "disabled" | "focus-visible" | "selected";

export type UxDesignSystemRuntimeAttributes = Record<`data-${string}`, string>;

export type UxPrimitiveDensityContract = {
  density: UxPrimitiveDensity;
  minBlockSize: string;
  spacing: UxPrimitiveSpacing;
  token: string;
};

export type UxPrimitiveTextRoleContract = {
  role: UxPrimitiveTextRole;
  token: string;
};

export type UxPrimitiveStatusContract = {
  colorOnly: "false";
  family: UxPrimitiveStatusFamily;
  hierarchy: UxPrimitiveStatusHierarchy;
  meaning: UxPrimitiveStatusMeaning;
  nonColorCue: "icon-and-label" | "label";
  severity: UxPrimitiveStatusSeverity;
  token: string;
};

export type UxPrimitiveInteractionContract = {
  cue: "disabled-reason" | "marker-and-label" | "outline-and-shadow";
  focusVisible?: "required";
  state: UxPrimitiveInteractionState;
  token: string;
};

export const uxPrimitiveDensityContracts = {
  compact: {
    density: "compact",
    minBlockSize: "var(--av-density-compact-block)",
    spacing: "tight",
    token: "av-density-compact",
  },
  default: {
    density: "default",
    minBlockSize: "var(--av-density-default-block)",
    spacing: "regular",
    token: "av-density-default",
  },
  comfortable: {
    density: "comfortable",
    minBlockSize: "var(--av-density-comfortable-block)",
    spacing: "relaxed",
    token: "av-density-comfortable",
  },
} as const satisfies Record<UxPrimitiveDensity, UxPrimitiveDensityContract>;

export const uxPrimitiveTextRoleContracts = {
  body: {
    role: "body",
    token: "av-text-body",
  },
  caption: {
    role: "caption",
    token: "av-text-caption",
  },
  eyebrow: {
    role: "eyebrow",
    token: "av-text-eyebrow",
  },
  heading: {
    role: "heading",
    token: "av-text-heading",
  },
  metadata: {
    role: "metadata",
    token: "av-text-metadata",
  },
} as const satisfies Record<UxPrimitiveTextRole, UxPrimitiveTextRoleContract>;

export const uxPrimitiveStatusContracts = {
  critical: {
    colorOnly: "false",
    family: "critical",
    hierarchy: "critical",
    meaning: "destructive",
    nonColorCue: "icon-and-label",
    severity: "critical",
    token: "av-status-critical",
  },
  info: {
    colorOnly: "false",
    family: "info",
    hierarchy: "standard",
    meaning: "info",
    nonColorCue: "icon-and-label",
    severity: "info",
    token: "av-status-info",
  },
  internal: {
    colorOnly: "false",
    family: "internal",
    hierarchy: "standard",
    meaning: "internal",
    nonColorCue: "icon-and-label",
    severity: "warning",
    token: "av-status-internal",
  },
  neutral: {
    colorOnly: "false",
    family: "neutral",
    hierarchy: "supporting",
    meaning: "neutral",
    nonColorCue: "label",
    severity: "neutral",
    token: "av-status-neutral",
  },
  restricted: {
    colorOnly: "false",
    family: "restricted",
    hierarchy: "critical",
    meaning: "blocked",
    nonColorCue: "icon-and-label",
    severity: "warning",
    token: "av-status-restricted",
  },
  success: {
    colorOnly: "false",
    family: "success",
    hierarchy: "standard",
    meaning: "success",
    nonColorCue: "icon-and-label",
    severity: "success",
    token: "av-status-success",
  },
  warning: {
    colorOnly: "false",
    family: "warning",
    hierarchy: "standard",
    meaning: "warning",
    nonColorCue: "icon-and-label",
    severity: "warning",
    token: "av-status-warning",
  },
} as const satisfies Record<UxPrimitiveStatusFamily, UxPrimitiveStatusContract>;

export const uxPrimitiveInteractionContracts = {
  active: {
    cue: "marker-and-label",
    state: "active",
    token: "av-active-state",
  },
  disabled: {
    cue: "disabled-reason",
    state: "disabled",
    token: "av-disabled-state",
  },
  "focus-visible": {
    cue: "outline-and-shadow",
    focusVisible: "required",
    state: "focus-visible",
    token: "av-focus-ring",
  },
  selected: {
    cue: "marker-and-label",
    state: "selected",
    token: "av-selected-state",
  },
} as const satisfies Record<UxPrimitiveInteractionState, UxPrimitiveInteractionContract>;

export const uxPrimitiveDensities = Object.keys(uxPrimitiveDensityContracts) as UxPrimitiveDensity[];

export const uxPrimitiveTextRoles = Object.keys(uxPrimitiveTextRoleContracts) as UxPrimitiveTextRole[];

export const uxPrimitiveStatusFamilies = Object.keys(uxPrimitiveStatusContracts) as UxPrimitiveStatusFamily[];

export const uxPrimitiveInteractionStates = Object.keys(uxPrimitiveInteractionContracts) as UxPrimitiveInteractionState[];

export function uxPrimitiveDensityContractFor(density: UxPrimitiveDensity): UxPrimitiveDensityContract {
  return uxPrimitiveDensityContracts[density];
}

export function uxPrimitiveTextRoleContractFor(role: UxPrimitiveTextRole): UxPrimitiveTextRoleContract {
  return uxPrimitiveTextRoleContracts[role];
}

export function uxPrimitiveStatusContractFor(family: UxPrimitiveStatusFamily): UxPrimitiveStatusContract {
  return uxPrimitiveStatusContracts[family];
}

export function uxPrimitiveInteractionContractFor(state: UxPrimitiveInteractionState): UxPrimitiveInteractionContract {
  return uxPrimitiveInteractionContracts[state];
}

export function uxPrimitiveAttributesFor(input: {
  density?: UxPrimitiveDensity;
  primitive: string;
  textRole?: UxPrimitiveTextRole;
}): UxDesignSystemRuntimeAttributes {
  const density = input.density ? uxPrimitiveDensityContractFor(input.density) : null;
  const textRole = input.textRole ? uxPrimitiveTextRoleContractFor(input.textRole) : null;

  return {
    "data-ux-primitive": input.primitive,
    ...(density
      ? {
          "data-ux-primitive-density": density.density,
          "data-ux-primitive-spacing": density.spacing,
        }
      : {}),
    ...(textRole ? { "data-ux-text-role": textRole.role } : {}),
  };
}

export function uxPrimitiveStatusAttributesFor(
  family: UxPrimitiveStatusFamily,
  overrides: {
    hierarchy?: UxPrimitiveStatusHierarchy;
    meaning?: UxPrimitiveStatusMeaning;
  } = {},
): UxDesignSystemRuntimeAttributes {
  const contract = uxPrimitiveStatusContractFor(family);

  return {
    "data-ux-status-color-only": contract.colorOnly,
    "data-ux-status-family": contract.family,
    "data-ux-status-hierarchy": overrides.hierarchy ?? contract.hierarchy,
    "data-ux-status-meaning": overrides.meaning ?? contract.meaning,
    "data-ux-status-non-color-cue": contract.nonColorCue,
    "data-ux-status-severity": contract.severity,
  };
}

export function uxPrimitiveInteractionAttributesFor(state: UxPrimitiveInteractionState): UxDesignSystemRuntimeAttributes {
  const contract = uxPrimitiveInteractionContractFor(state);

  return {
    "data-ux-interaction-state": contract.state,
    ...(contract.focusVisible ? { "data-ux-focus-visible": contract.focusVisible } : {}),
    ...(state === "selected" ? { "data-ux-selected-cue": contract.cue } : {}),
    ...(state === "active" ? { "data-ux-active-cue": contract.cue } : {}),
    ...(state === "disabled" ? { "data-ux-disabled-cue": contract.cue } : {}),
  };
}

export function uxPrimitiveDensityClassFor(density: UxPrimitiveDensity) {
  return uxPrimitiveDensityContractFor(density).token;
}

export function uxPrimitiveTextClassFor(role: UxPrimitiveTextRole) {
  return uxPrimitiveTextRoleContractFor(role).token;
}

export function uxPrimitiveStatusClassFor(family: UxPrimitiveStatusFamily) {
  return uxPrimitiveStatusContractFor(family).token;
}

export function uxPrimitiveInteractionClassFor(state: UxPrimitiveInteractionState) {
  return uxPrimitiveInteractionContractFor(state).token;
}
