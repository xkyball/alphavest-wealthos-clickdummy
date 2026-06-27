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

export type ContractFulfillmentGateSourceFile = {
  path: string;
  text: string;
};

export type ContractFulfillmentGateOptions = {
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

function collectSourceFiles(root: string, relativeDir = "components"): ContractFulfillmentGateSourceFile[] {
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
  return options.sourceFiles ?? collectSourceFiles(options.sourceRoot ?? process.cwd());
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

  addActionAndFilterDebtViolations(violations, sourceFilesForOptions(options));

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
