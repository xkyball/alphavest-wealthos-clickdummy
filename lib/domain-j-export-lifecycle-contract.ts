import { exportWorkflowCanonicalApiRoute, exportWorkflowCommandSpinePath, type ExportWorkflowCommandId } from "@/lib/export-workflow-command-service";

export const domainJExportProcessIds = [
  "BP-084",
  "BP-085",
  "BP-086",
  "BP-087",
  "BP-088",
  "BP-089",
  "BP-090",
  "BP-091",
  "BP-092",
] as const;

export type DomainJExportProcessId = (typeof domainJExportProcessIds)[number];

export const domainJExportProcessNames: Record<DomainJExportProcessId, string> = {
  "BP-084": "Export request creation",
  "BP-085": "Export scope selection",
  "BP-086": "Redaction profile application",
  "BP-087": "Export preview",
  "BP-088": "Export approval",
  "BP-089": "Package generation",
  "BP-090": "Download/share",
  "BP-091": "Export audit",
  "BP-092": "Forbidden payload exclusion",
};

export type DomainJExportStepLabel =
  | "Request"
  | "Scope"
  | "Redact"
  | "Preview"
  | "Approve"
  | "Generate"
  | "Download/share"
  | "Audit";

export type DomainJExportRoutePendant = {
  pageId: "054" | "055" | "056" | "057" | "058";
  route: "/export/new" | "/export/:id/scope" | "/export/:id/redaction" | "/export/:id/approval" | "/export/:id/download";
  surface: "area_entry" | "scope_queue" | "redaction_detail" | "approval_preview" | "delivery_detail";
};

export type DomainJExportStepContract = {
  auditFailureProofRefs: readonly string[];
  commandIds: readonly ExportWorkflowCommandId[];
  negativeProofRefs: readonly string[];
  positiveProofRefs: readonly string[];
  processId: DomainJExportProcessId;
  processName: string;
  routePendant: DomainJExportRoutePendant;
  sequence: number;
  stepId: string;
  stepLabel: DomainJExportStepLabel;
  uiPendant: string;
};

const commonPositiveProofRefs = [
  "tests/export-workflow-api.spec.ts",
  "tests/export-command-spine-contract.spec.ts",
  "tests/process-runtime-backbone.spec.ts",
] as const;

const commonNegativeProofRefs = [
  "tests/export-workflow-api.spec.ts",
  "tests/export-safety.spec.ts",
  "tests/true-ux-export-scope-redaction-approval.spec.ts",
] as const;

const commonAuditFailureProofRefs = [
  "tests/export-workflow-api.spec.ts",
  "tests/export-workflow-api.spec.ts",
] as const;

const stepContracts: Array<{
  commandIds: readonly ExportWorkflowCommandId[];
  routePendant: DomainJExportRoutePendant;
  sequence: number;
  stepLabel: DomainJExportStepLabel;
  uiPendant: string;
}> = [
  {
    commandIds: ["SET_SCOPE"],
    routePendant: { pageId: "054", route: "/export/new", surface: "area_entry" },
    sequence: 1,
    stepLabel: "Request",
    uiPendant: "Create export request entry with one next action to content selection.",
  },
  {
    commandIds: ["SET_SCOPE"],
    routePendant: { pageId: "055", route: "/export/:id/scope", surface: "scope_queue" },
    sequence: 2,
    stepLabel: "Scope",
    uiPendant: "Select allowed content and block restricted or forbidden scope rows.",
  },
  {
    commandIds: ["VALIDATE_REDACTION"],
    routePendant: { pageId: "056", route: "/export/:id/redaction", surface: "redaction_detail" },
    sequence: 3,
    stepLabel: "Redact",
    uiPendant: "Validate redaction profile and forbidden payload absence before preview.",
  },
  {
    commandIds: ["PREVIEW"],
    routePendant: { pageId: "057", route: "/export/:id/approval", surface: "approval_preview" },
    sequence: 4,
    stepLabel: "Preview",
    uiPendant: "Preview client-safe package without approval, generation, download or share.",
  },
  {
    commandIds: ["APPROVE"],
    routePendant: { pageId: "057", route: "/export/:id/approval", surface: "approval_preview" },
    sequence: 5,
    stepLabel: "Approve",
    uiPendant: "Compliance approval control that does not generate or deliver a package.",
  },
  {
    commandIds: ["GENERATE"],
    routePendant: { pageId: "058", route: "/export/:id/download", surface: "delivery_detail" },
    sequence: 6,
    stepLabel: "Generate",
    uiPendant: "Generate metadata-only manifest after approval.",
  },
  {
    commandIds: ["DOWNLOAD", "SHARE"],
    routePendant: { pageId: "058", route: "/export/:id/download", surface: "delivery_detail" },
    sequence: 7,
    stepLabel: "Download/share",
    uiPendant: "Record download and explicit external share as separate audited delivery actions.",
  },
  {
    commandIds: ["SET_SCOPE", "VALIDATE_REDACTION", "PREVIEW", "APPROVE", "GENERATE", "DOWNLOAD", "SHARE"],
    routePendant: { pageId: "058", route: "/export/:id/download", surface: "delivery_detail" },
    sequence: 8,
    stepLabel: "Audit",
    uiPendant: "Show source-backed command timeline while audit persistence remains a service gate.",
  },
];

export const domainJExportLifecycleContract: readonly DomainJExportStepContract[] = domainJExportProcessIds.flatMap((processId) =>
  stepContracts.map((step) => ({
    auditFailureProofRefs: commonAuditFailureProofRefs,
    commandIds: step.commandIds,
    negativeProofRefs: commonNegativeProofRefs,
    positiveProofRefs: commonPositiveProofRefs,
    processId,
    processName: domainJExportProcessNames[processId],
    routePendant: step.routePendant,
    sequence: step.sequence,
    stepId: `${processId}-S${String(step.sequence).padStart(2, "0")}`,
    stepLabel: step.stepLabel,
    uiPendant: step.uiPendant,
  })),
);

export const domainJExportLifecycleAuthority = {
  apiRoute: exportWorkflowCanonicalApiRoute,
  commandService: exportWorkflowCommandSpinePath,
  domainId: "DOMAIN-J",
  matrixSource: "docs/00-current/ALPHAVEST_P0_PROCESS_COVERAGE_MATRIX.json",
  processIds: domainJExportProcessIds,
  routePageIds: ["054", "055", "056", "057", "058"] as const,
} as const;

export function domainJExportLifecycleIntegrity(steps: readonly DomainJExportStepContract[] = domainJExportLifecycleContract) {
  const expectedStepIds = new Set(
    domainJExportProcessIds.flatMap((processId) =>
      Array.from({ length: 8 }, (_, index) => `${processId}-S${String(index + 1).padStart(2, "0")}`),
    ),
  );
  const actualStepIds = new Set(steps.map((step) => step.stepId));
  const missingStepIds = [...expectedStepIds].filter((stepId) => !actualStepIds.has(stepId));
  const duplicateStepIds = steps
    .map((step) => step.stepId)
    .filter((stepId, index, all) => all.indexOf(stepId) !== index);
  const missingProofStepIds = steps
    .filter(
      (step) =>
        step.commandIds.length === 0 ||
        step.positiveProofRefs.length === 0 ||
        step.negativeProofRefs.length === 0 ||
        step.auditFailureProofRefs.length === 0 ||
        !step.uiPendant ||
        !step.routePendant.pageId,
    )
    .map((step) => step.stepId);

  return {
    authority: domainJExportLifecycleAuthority,
    duplicateStepIds,
    expectedStepCount: 72,
    missingProofStepIds,
    missingStepIds,
    status:
      steps.length === 72 && missingStepIds.length === 0 && duplicateStepIds.length === 0 && missingProofStepIds.length === 0
        ? "DOMAIN_J_EXPORT_LIFECYCLE_READY"
        : "DOMAIN_J_EXPORT_LIFECYCLE_BLOCKED",
    stepCount: steps.length,
  };
}
