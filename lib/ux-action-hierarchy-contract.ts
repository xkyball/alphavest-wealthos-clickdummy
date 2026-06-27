export type UxActionPriority =
  | "primary"
  | "secondary"
  | "tertiary"
  | "recovery"
  | "destructive"
  | "blocked";

export type UxActionMeaning =
  | "navigate"
  | "save_draft"
  | "submit_review"
  | "approve"
  | "release"
  | "block"
  | "request_evidence"
  | "export_scope"
  | "export_redaction"
  | "export_approval"
  | "export_generate"
  | "download"
  | "share"
  | "client_acceptance";

export type UxActionPlacement =
  | "page_header"
  | "inline_cluster"
  | "adjacent_rail"
  | "sticky_rail"
  | "modal_footer"
  | "table_row";

export type UxActionAvailability =
  | "enabled"
  | "disabled"
  | "hidden"
  | "blocked_static"
  | "loading"
  | "success"
  | "error";

export type UxActionMeaningContract = {
  defaultPriority: UxActionPriority;
  downstreamSeparation: string;
  meaning: UxActionMeaning;
  noOverclaimRule: string;
  requiresAudit: boolean;
  requiresConfirmation: boolean;
  riskLevel: "low" | "medium" | "high";
};

export type UxActionRuntimeAttributes = Record<`data-${string}`, string | undefined>;

export type UxActionProjectionInput = {
  availability: UxActionAvailability;
  disabledMessage?: "accessible" | "visible";
  disabledReason?: string;
  meaning?: UxActionMeaning;
  placement: UxActionPlacement;
  priority: UxActionPriority;
  requiresAudit?: boolean;
  requiresConfirmation?: boolean;
  requiresPermission?: boolean;
};

export const uxDefaultUnwiredActionReason = "This action is held until an authorized lifecycle is wired.";

export const uxActionMeaningContracts = {
  approve: {
    defaultPriority: "primary",
    downstreamSeparation: "Approval is not release, export, download, share or client acceptance.",
    meaning: "approve",
    noOverclaimRule: "Approval records only the approval step and cannot imply downstream release.",
    requiresAudit: true,
    requiresConfirmation: true,
    riskLevel: "high",
  },
  block: {
    defaultPriority: "destructive",
    downstreamSeparation: "Block is a protective stop and not a successful workflow completion.",
    meaning: "block",
    noOverclaimRule: "Blocking prevents downstream completion until explicit owner gates pass.",
    requiresAudit: true,
    requiresConfirmation: true,
    riskLevel: "high",
  },
  client_acceptance: {
    defaultPriority: "primary",
    downstreamSeparation: "Client acceptance is separate from internal approval, release, export and download.",
    meaning: "client_acceptance",
    noOverclaimRule: "Client acceptance cannot be implied by any internal workflow action.",
    requiresAudit: true,
    requiresConfirmation: true,
    riskLevel: "high",
  },
  download: {
    defaultPriority: "primary",
    downstreamSeparation: "Download is not share, delivery, client acceptance or advice release.",
    meaning: "download",
    noOverclaimRule: "Download records only the controlled download step.",
    requiresAudit: true,
    requiresConfirmation: true,
    riskLevel: "medium",
  },
  export_approval: {
    defaultPriority: "primary",
    downstreamSeparation: "Export approval is not generation, download, share or client acceptance.",
    meaning: "export_approval",
    noOverclaimRule: "Export approval records only approval to proceed with the export lifecycle.",
    requiresAudit: true,
    requiresConfirmation: true,
    riskLevel: "high",
  },
  export_generate: {
    defaultPriority: "primary",
    downstreamSeparation: "Export generation is not download, share or client acceptance.",
    meaning: "export_generate",
    noOverclaimRule: "Export generation cannot imply delivery or client acceptance.",
    requiresAudit: true,
    requiresConfirmation: true,
    riskLevel: "medium",
  },
  export_redaction: {
    defaultPriority: "primary",
    downstreamSeparation: "Redaction review is not export approval or delivery.",
    meaning: "export_redaction",
    noOverclaimRule: "Redaction review cannot imply export approval, download or share.",
    requiresAudit: true,
    requiresConfirmation: false,
    riskLevel: "medium",
  },
  export_scope: {
    defaultPriority: "primary",
    downstreamSeparation: "Scope selection is not export approval, generation or delivery.",
    meaning: "export_scope",
    noOverclaimRule: "Export scope selection cannot imply approval or delivery.",
    requiresAudit: false,
    requiresConfirmation: false,
    riskLevel: "medium",
  },
  navigate: {
    defaultPriority: "secondary",
    downstreamSeparation: "Navigation does not mutate workflow state.",
    meaning: "navigate",
    noOverclaimRule: "Navigation cannot imply approval, release, export or client acceptance.",
    requiresAudit: false,
    requiresConfirmation: false,
    riskLevel: "low",
  },
  release: {
    defaultPriority: "primary",
    downstreamSeparation: "Release is not export approval, download, share or client acceptance.",
    meaning: "release",
    noOverclaimRule: "Release controls client visibility only through its explicit audited gate.",
    requiresAudit: true,
    requiresConfirmation: true,
    riskLevel: "high",
  },
  request_evidence: {
    defaultPriority: "recovery",
    downstreamSeparation: "Evidence request is not evidence sufficiency or release.",
    meaning: "request_evidence",
    noOverclaimRule: "Requesting evidence cannot imply evidence sufficiency.",
    requiresAudit: true,
    requiresConfirmation: false,
    riskLevel: "medium",
  },
  save_draft: {
    defaultPriority: "secondary",
    downstreamSeparation: "Draft save is not submission, approval or release.",
    meaning: "save_draft",
    noOverclaimRule: "Draft save cannot imply review completion.",
    requiresAudit: false,
    requiresConfirmation: false,
    riskLevel: "low",
  },
  share: {
    defaultPriority: "primary",
    downstreamSeparation: "Share is separate from download and client acceptance.",
    meaning: "share",
    noOverclaimRule: "Share cannot imply client acceptance or advice finality.",
    requiresAudit: true,
    requiresConfirmation: true,
    riskLevel: "high",
  },
  submit_review: {
    defaultPriority: "primary",
    downstreamSeparation: "Review submission is not approval, release or client visibility.",
    meaning: "submit_review",
    noOverclaimRule: "Review submission cannot imply downstream approval.",
    requiresAudit: false,
    requiresConfirmation: false,
    riskLevel: "medium",
  },
} as const satisfies Record<UxActionMeaning, UxActionMeaningContract>;

export const uxActionPriorities = [
  "primary",
  "secondary",
  "tertiary",
  "recovery",
  "destructive",
  "blocked",
] as const satisfies readonly UxActionPriority[];

export const uxActionMeanings = Object.keys(uxActionMeaningContracts) as UxActionMeaning[];

const baseActionClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition";

export const uxActionPriorityClasses = {
  blocked: `${baseActionClass} cursor-default border border-alphavest-border bg-alphavest-charcoal/55 text-alphavest-muted`,
  destructive: `${baseActionClass} border border-alphavest-red/45 bg-alphavest-red/12 text-alphavest-red hover:border-alphavest-red/65 hover:bg-alphavest-red/15`,
  primary: `${baseActionClass} bg-alphavest-gold text-alphavest-navy hover:bg-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55`,
  recovery: `${baseActionClass} border border-alphavest-gold/55 bg-alphavest-gold/10 text-alphavest-gold-soft hover:border-alphavest-gold hover:bg-alphavest-gold/15`,
  secondary: `${baseActionClass} border border-alphavest-border bg-alphavest-charcoal/70 text-alphavest-ivory hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft disabled:cursor-not-allowed disabled:opacity-55`,
  tertiary: `${baseActionClass} border border-transparent bg-transparent text-alphavest-muted hover:text-alphavest-gold-soft`,
} as const satisfies Record<UxActionPriority, string>;

export function uxActionMeaningContractFor(meaning: UxActionMeaning): UxActionMeaningContract {
  return uxActionMeaningContracts[meaning];
}

export function uxActionClassForPriority(
  priority: UxActionPriority,
  options: { unavailable?: boolean } = {},
) {
  return [
    uxActionPriorityClasses[priority],
    options.unavailable ? "cursor-not-allowed opacity-60 hover:border-alphavest-border hover:text-alphavest-ivory" : "",
  ].filter(Boolean).join(" ");
}

export function uxActionAttributesFor(input: UxActionProjectionInput): UxActionRuntimeAttributes {
  const meaning = input.meaning ?? "navigate";
  const meaningContract = uxActionMeaningContractFor(meaning);
  const disabledMessage =
    input.disabledReason
      ? input.disabledMessage ?? "accessible"
      : undefined;

  return {
    "data-ux-action-availability": input.availability,
    "data-ux-action-meaning": meaning,
    "data-ux-action-no-overclaim-rule": meaningContract.noOverclaimRule,
    "data-ux-action-placement": input.placement,
    "data-ux-action-priority": input.priority,
    "data-ux-action-separation": meaningContract.downstreamSeparation,
    "data-ux-cta-kind": input.priority,
    "data-ux-disabled-message": disabledMessage,
    "data-ux-disabled-reason": input.disabledReason,
    "data-ux-interactive": input.availability === "enabled" ? "true" : "false",
    "data-ux-no-overclaim": "true",
    "data-ux-primary-cta": input.priority === "primary" ? "true" : undefined,
    "data-ux-recovery-cta": input.priority === "recovery" ? "true" : undefined,
    "data-ux-requires-audit": (input.requiresAudit ?? meaningContract.requiresAudit) ? "true" : "false",
    "data-ux-requires-confirmation": (input.requiresConfirmation ?? meaningContract.requiresConfirmation) ? "true" : "false",
    "data-ux-requires-permission": input.requiresPermission === false ? "false" : "true",
    "data-ux-secondary-cta": input.priority === "secondary" || input.priority === "tertiary" ? "true" : undefined,
  };
}
