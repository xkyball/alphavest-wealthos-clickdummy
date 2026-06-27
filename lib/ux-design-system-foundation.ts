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

export type UxPrimitiveStatusSeverity = "critical" | "info" | "neutral" | "success" | "warning";

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
  nonColorCue: "icon-and-label" | "label";
  severity: UxPrimitiveStatusSeverity;
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
    nonColorCue: "icon-and-label",
    severity: "critical",
    token: "av-status-critical",
  },
  info: {
    colorOnly: "false",
    family: "info",
    nonColorCue: "icon-and-label",
    severity: "info",
    token: "av-status-info",
  },
  internal: {
    colorOnly: "false",
    family: "internal",
    nonColorCue: "icon-and-label",
    severity: "warning",
    token: "av-status-internal",
  },
  neutral: {
    colorOnly: "false",
    family: "neutral",
    nonColorCue: "label",
    severity: "neutral",
    token: "av-status-neutral",
  },
  restricted: {
    colorOnly: "false",
    family: "restricted",
    nonColorCue: "icon-and-label",
    severity: "warning",
    token: "av-status-restricted",
  },
  success: {
    colorOnly: "false",
    family: "success",
    nonColorCue: "icon-and-label",
    severity: "success",
    token: "av-status-success",
  },
  warning: {
    colorOnly: "false",
    family: "warning",
    nonColorCue: "icon-and-label",
    severity: "warning",
    token: "av-status-warning",
  },
} as const satisfies Record<UxPrimitiveStatusFamily, UxPrimitiveStatusContract>;

export const uxPrimitiveDensities = Object.keys(uxPrimitiveDensityContracts) as UxPrimitiveDensity[];

export const uxPrimitiveTextRoles = Object.keys(uxPrimitiveTextRoleContracts) as UxPrimitiveTextRole[];

export const uxPrimitiveStatusFamilies = Object.keys(uxPrimitiveStatusContracts) as UxPrimitiveStatusFamily[];

export function uxPrimitiveDensityContractFor(density: UxPrimitiveDensity) {
  return uxPrimitiveDensityContracts[density];
}

export function uxPrimitiveTextRoleContractFor(role: UxPrimitiveTextRole) {
  return uxPrimitiveTextRoleContracts[role];
}

export function uxPrimitiveStatusContractFor(family: UxPrimitiveStatusFamily) {
  return uxPrimitiveStatusContracts[family];
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

export function uxPrimitiveStatusAttributesFor(family: UxPrimitiveStatusFamily): UxDesignSystemRuntimeAttributes {
  const contract = uxPrimitiveStatusContractFor(family);

  return {
    "data-ux-status-color-only": contract.colorOnly,
    "data-ux-status-family": contract.family,
    "data-ux-status-non-color-cue": contract.nonColorCue,
    "data-ux-status-severity": contract.severity,
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
