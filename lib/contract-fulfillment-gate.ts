import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  duplicateContractLedgerIds,
  e10DataSurfaceFilterLedgerEntries,
  e10RegisteredActionFiles,
  fulfilledEntriesWithManualDecisionOnlyEvidence,
  fulfilledEntriesWithMarkdownOnlyEvidence,
  ledgerEntriesByContractFamily,
  ledgerEntriesByStatus,
  ledgerEntriesMissingOwnerSurface,
  ledgerEntriesMissingRequiredFollowUp,
  screenshotOnlyApiTruthEntries,
  uxContractLedgerEntries,
  uxContractMetaContract,
  type ContractFamily,
  type FulfillmentStatus,
  type UxContractLedgerEntry,
} from "@/lib/ux-contract-ledger";

export type ContractFulfillmentGateSeverity = "failure" | "warning";

export type ContractFulfillmentGateViolation = {
  entryId?: string;
  message: string;
  ruleId: string;
  severity: ContractFulfillmentGateSeverity;
};

export type ContractFulfillmentGateReport = {
  countsByFamily: Record<ContractFamily, number>;
  countsByStatus: Record<FulfillmentStatus, number>;
  generatedAt: string;
  releaseCommands: string[];
  status: "pass" | "warn" | "fail";
  totalEntries: number;
  violations: ContractFulfillmentGateViolation[];
};

export const contractFulfillmentGateRuleIds = [
  "E12-GATE-ID-UNIQUENESS",
  "E12-GATE-REQUIRED-FIELDS",
  "E12-GATE-FOLLOWUP-REQUIRED",
  "E12-GATE-FULFILLED-EVIDENCE",
  "E12-GATE-MANUAL-DECISION-NOT-FULFILLMENT",
  "E12-GATE-SCREENSHOT-NOT-API-PROOF",
  "E12-GATE-NO-NEW-ACTION-DEBT",
  "E12-GATE-NO-NEW-FAKE-FILTERS",
  "E12-GATE-BACKEND-META",
  "E12-GATE-UI-SOURCE-TRUTH",
  "E12-GATE-RETIRED-PROOF-UI",
  "E12-GATE-CAPTURE-RELEASE-WARNINGS",
] as const;

export type ContractFulfillmentGateSourceFile = {
  path: string;
  text: string;
};

export type ContractFulfillmentGateOptions = {
  packageJsonText?: string;
  sourceFiles?: readonly ContractFulfillmentGateSourceFile[];
  sourceRoot?: string;
};

const requiredLedgerFields = [
  "id",
  "title",
  "source",
  "contractFamily",
  "ownerSurface",
  "obligation",
  "proofType",
  "status",
  "evidence",
  "gateBehavior",
] as const satisfies Array<keyof UxContractLedgerEntry>;

function isBlankRequiredField(entry: UxContractLedgerEntry, field: keyof UxContractLedgerEntry) {
  const value = entry[field];

  if (Array.isArray(value)) return value.length === 0;
  return value === undefined || value === null || value === "";
}

function countsByFamily(entries: readonly UxContractLedgerEntry[]) {
  return Object.fromEntries(
    Object.entries(ledgerEntriesByContractFamily(entries)).map(([family, familyEntries]) => [family, familyEntries.length]),
  ) as Record<ContractFamily, number>;
}

function countsByStatus(entries: readonly UxContractLedgerEntry[]) {
  return Object.fromEntries(
    Object.entries(ledgerEntriesByStatus(entries)).map(([status, statusEntries]) => [status, statusEntries.length]),
  ) as Record<FulfillmentStatus, number>;
}

function collectSourceFiles(root: string, relativeDir: string): ContractFulfillmentGateSourceFile[] {
  const absoluteDir = path.join(root, relativeDir);

  if (!existsSync(absoluteDir)) return [];

  return readdirSync(absoluteDir).flatMap((entry) => {
    const relativePath = path.join(relativeDir, entry);
    const absolutePath = path.join(root, relativePath);
    const stat = statSync(absolutePath);

    if (stat.isDirectory()) return collectSourceFiles(root, relativePath);
    if (!/\.(tsx|ts)$/.test(entry)) return [];

    return [{
      path: relativePath.split(path.sep).join("/"),
      text: readFileSync(absolutePath, "utf8"),
    }];
  });
}

function sourceFilesForOptions(options: ContractFulfillmentGateOptions) {
  const root = options.sourceRoot ?? process.cwd();

  return options.sourceFiles ?? [
    ...collectSourceFiles(root, "components"),
    ...collectSourceFiles(root, "lib"),
  ];
}

function componentSourceFilesForOptions(options: ContractFulfillmentGateOptions) {
  return options.sourceFiles ?? collectSourceFiles(options.sourceRoot ?? process.cwd(), "components");
}

function packageJsonTextForOptions(options: ContractFulfillmentGateOptions) {
  if (options.packageJsonText !== undefined) return options.packageJsonText;

  const packagePath = path.join(options.sourceRoot ?? process.cwd(), "package.json");
  if (!existsSync(packagePath)) return "{}";

  return readFileSync(packagePath, "utf8");
}

function addActionAndFilterDebtViolations(
  violations: ContractFulfillmentGateViolation[],
  sourceFiles: readonly ContractFulfillmentGateSourceFile[],
) {
  const registeredActionFiles = new Set(e10RegisteredActionFiles);
  const registeredFilterExceptionIds = new Set(
    e10DataSurfaceFilterLedgerEntries.map((entry) => entry.sourceRegisterId).filter((id): id is string => Boolean(id)),
  );
  const localActionAliasPattern = /const\s+(primaryButtonClass|secondaryButtonClass|staticButtonClass|destructiveButtonClass)\s*=/;
  const filterExceptionPattern = /data-ux-e10-filter-exception-id="([^"]+)"/g;

  for (const sourceFile of sourceFiles) {
    if (localActionAliasPattern.test(sourceFile.text) && !registeredActionFiles.has(sourceFile.path)) {
      violations.push({
        message: `Unregistered local action-class vocabulary found in ${sourceFile.path}.`,
        ruleId: "E12-GATE-NO-NEW-ACTION-DEBT",
        severity: "failure",
      });
    }

    for (const match of sourceFile.text.matchAll(filterExceptionPattern)) {
      const id = match[1];
      if (!registeredFilterExceptionIds.has(id)) {
        violations.push({
          entryId: id,
          message: `Unregistered disabled/static filter debt found in ${sourceFile.path}: ${id}.`,
          ruleId: "E12-GATE-NO-NEW-FAKE-FILTERS",
          severity: "failure",
        });
      }
    }
  }
}

function addBackendTruthViolations(
  violations: ContractFulfillmentGateViolation[],
  entries: readonly UxContractLedgerEntry[],
) {
  for (const entry of entries) {
    if (entry.targetClass !== "backend_query_backed") continue;

    const hasApiOrReadmodelOwner = entry.ownerSurface.some((surface) =>
      surface.kind === "api" || (surface.kind === "file" && /readmodel|service|route\.ts$/.test(surface.ref))
    );
    const hasUiOwner = entry.ownerSurface.some((surface) =>
      surface.kind === "file" && surface.ref.startsWith("components/")
    );
    const hasApiProof = entry.proofType.includes("api_test") && entry.evidence.some((anchor) =>
      anchor.kind === "api" || (anchor.kind === "test" && anchor.ref.includes("e11-backend-data-surface-truth"))
    );

    if (!hasApiOrReadmodelOwner || !hasApiProof) {
      violations.push({
        entryId: entry.id,
        message: `Backend query surface ${entry.id} lacks required API metadata proof.`,
        ruleId: "E12-GATE-BACKEND-META",
        severity: "failure",
      });
    }

    if (!hasUiOwner) {
      violations.push({
        entryId: entry.id,
        message: `Backend query surface ${entry.id} lacks UI source-truth consumption proof.`,
        ruleId: "E12-GATE-UI-SOURCE-TRUTH",
        severity: "failure",
      });
    }
  }
}

function addRetiredProofUiViolations(
  violations: ContractFulfillmentGateViolation[],
  sourceFiles: readonly ContractFulfillmentGateSourceFile[],
) {
  const retiredPaths = new Set([
    "components/product-guidance-panel.tsx",
    "lib/product-guidance.ts",
  ]);
  const retiredImportPattern = /from\s+["'][^"']*(?:product-guidance|components\/product-guidance-panel)["']/;

  for (const sourceFile of sourceFiles) {
    if (retiredPaths.has(sourceFile.path) || retiredImportPattern.test(sourceFile.text)) {
      violations.push({
        message: `Retired ProductGuidance proof UI path re-entered active code: ${sourceFile.path}.`,
        ruleId: "E12-GATE-RETIRED-PROOF-UI",
        severity: "failure",
      });
    }
  }
}

function addCaptureReleaseViolations(
  violations: ContractFulfillmentGateViolation[],
  packageJsonText: string,
) {
  const parsed = JSON.parse(packageJsonText) as { scripts?: Record<string, string> };
  const releaseScript = parsed.scripts?.["visual:capture-qa:release"] ?? "";

  if (!releaseScript.includes("CAPTURE_QA_FAIL_ON_WARNINGS=1") || !releaseScript.includes("scripts/capture-qa-contract.ts")) {
    violations.push({
      message: "Release capture proof must run with CAPTURE_QA_FAIL_ON_WARNINGS=1.",
      ruleId: "E12-GATE-CAPTURE-RELEASE-WARNINGS",
      severity: "failure",
    });
  }
}

export function evaluateContractFulfillmentGate(
  entries: readonly UxContractLedgerEntry[] = uxContractLedgerEntries,
  generatedAt = new Date().toISOString(),
  options: ContractFulfillmentGateOptions = {},
): ContractFulfillmentGateReport {
  const violations: ContractFulfillmentGateViolation[] = [];

  for (const id of duplicateContractLedgerIds(entries)) {
    violations.push({
      entryId: id,
      message: `Duplicate contract ledger id: ${id}.`,
      ruleId: "E12-GATE-ID-UNIQUENESS",
      severity: "failure",
    });
  }

  for (const entry of entries) {
    for (const field of requiredLedgerFields) {
      if (isBlankRequiredField(entry, field)) {
        violations.push({
          entryId: entry.id,
          message: `Contract ${entry.id || "<missing-id>"} is missing required field ${field}.`,
          ruleId: "E12-GATE-REQUIRED-FIELDS",
          severity: "failure",
        });
      }
    }
  }

  for (const entry of ledgerEntriesMissingOwnerSurface(entries)) {
    violations.push({
      entryId: entry.id,
      message: `Contract ${entry.id} is missing ownerSurface.`,
      ruleId: "E12-GATE-REQUIRED-FIELDS",
      severity: "failure",
    });
  }

  for (const entry of ledgerEntriesMissingRequiredFollowUp(entries)) {
    violations.push({
      entryId: entry.id,
      message: `Contract ${entry.id} is ${entry.status} without expiresOrFollowUp.`,
      ruleId: "E12-GATE-FOLLOWUP-REQUIRED",
      severity: "failure",
    });
  }

  for (const entry of fulfilledEntriesWithMarkdownOnlyEvidence(entries)) {
    violations.push({
      entryId: entry.id,
      message: `Contract ${entry.id} is fulfilled without non-markdown evidence.`,
      ruleId: "E12-GATE-FULFILLED-EVIDENCE",
      severity: "failure",
    });
  }

  for (const entry of fulfilledEntriesWithManualDecisionOnlyEvidence(entries)) {
    violations.push({
      entryId: entry.id,
      message: `Contract ${entry.id} is fulfilled by manual decision only.`,
      ruleId: "E12-GATE-MANUAL-DECISION-NOT-FULFILLMENT",
      severity: "failure",
    });
  }

  for (const entry of screenshotOnlyApiTruthEntries(entries)) {
    violations.push({
      entryId: entry.id,
      message: `Contract ${entry.id} uses screenshot evidence for API/filter/pagination truth.`,
      ruleId: "E12-GATE-SCREENSHOT-NOT-API-PROOF",
      severity: "failure",
    });
  }

  const sourceFiles = sourceFilesForOptions(options);

  addActionAndFilterDebtViolations(violations, componentSourceFilesForOptions(options));
  addBackendTruthViolations(violations, entries);
  addRetiredProofUiViolations(violations, sourceFiles);
  addCaptureReleaseViolations(violations, packageJsonTextForOptions(options));

  const hasFailures = violations.some((violation) => violation.severity === "failure");
  const hasWarnings = violations.some((violation) => violation.severity === "warning");

  return {
    countsByFamily: countsByFamily(entries),
    countsByStatus: countsByStatus(entries),
    generatedAt,
    releaseCommands: uxContractMetaContract.releaseRelevantCommands,
    status: hasFailures ? "fail" : hasWarnings ? "warn" : "pass",
    totalEntries: entries.length,
    violations,
  };
}

export function contractFulfillmentGateMarkdown(report: ContractFulfillmentGateReport) {
  const violationRows = report.violations.length
    ? report.violations.map((violation) =>
      `| ${violation.severity} | ${violation.ruleId} | ${violation.entryId ?? "n/a"} | ${violation.message} |`
    ).join("\n")
    : "| none | none | n/a | No violations. |";

  return [
    "# E12 Contract Fulfillment Gate Report",
    "",
    `Generated: ${report.generatedAt}`,
    `Status: \`${report.status}\``,
    `Total entries: ${report.totalEntries}`,
    "",
    "## Violations",
    "",
    "| Severity | Rule | Entry | Message |",
    "| --- | --- | --- | --- |",
    violationRows,
    "",
    "## Release Commands",
    "",
    ...report.releaseCommands.map((command) => `- \`${command}\``),
    "",
  ].join("\n");
}

export function writeContractFulfillmentGateReport(
  report: ContractFulfillmentGateReport,
  paths = {
    json: "reports/contract-fulfillment/latest.json",
    markdown: "docs/v3/proof/e12_contract_fulfillment_report.md",
  },
) {
  mkdirSync(path.dirname(paths.json), { recursive: true });
  mkdirSync(path.dirname(paths.markdown), { recursive: true });
  writeFileSync(paths.json, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(paths.markdown, contractFulfillmentGateMarkdown(report));
}
