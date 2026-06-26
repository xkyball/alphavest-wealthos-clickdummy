import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { captureModelContextForRoute, captureScreenModelAuditBaseline } from "@/lib/capture-screen-model-context";
import { screenRoutes } from "@/lib/route-registry";

export type CapabilityReportDriftViolation = {
  detail: string;
  file: string;
  line?: number;
  ruleId:
    | "REPORT_FILE_MISSING"
    | "ROUTE_COUNT_DRIFT"
    | "SCHEMA_MODEL_COUNT_DRIFT"
    | "STALE_49_MODEL_CLAIM"
    | "COMPLETE_VERTICAL_SLICE_OVERCLAIM"
    | "MISSING_REQUIRED_CURRENT_TRUTH"
    | "MISSING_CAPTURE_STATUS_COVERAGE";
};

export type CapabilityReportInput = {
  path: string;
  text: string;
};

export type CapabilityReportDriftGateResult = {
  checkedReports: string[];
  requiredCapabilityStatuses: string[];
  schemaModels: number;
  status: "PASS" | "FAIL";
  violations: CapabilityReportDriftViolation[];
};

export const defaultCapabilityReportDriftGatePaths = [
  captureScreenModelAuditBaseline.capabilityReport,
  captureScreenModelAuditBaseline.codebaseInventory,
] as const;

function isAllowedNegativeCompleteSliceLine(line: string) {
  return /\b(avoid|avoids|without|no|not|forbid|forbidden|overclaim|risk|required correction|do not|before claiming|fail|fails|reject|rejects)\b/i.test(line);
}

function isAllowedHistorical49Line(line: string) {
  return /\b(previously|stale|corrected|reject|drift|warning|resolved)\b/i.test(line);
}

function lineHasTableStatus(line: string, status: string) {
  return line.trim().startsWith("|") && line.includes(`\`${status}\``);
}

function requiredTruthsForReport(reportPath: string) {
  if (reportPath.endsWith("05_capability_reality_report.md")) {
    return [
      "71 registered routes",
      "53 models",
      "STRONG_VERTICAL_CANDIDATE",
      "SERVICE_BACKED_INTERNAL",
      "TYPED_COMMAND_BACKED_PARTIAL",
      "LEGACY_DEMO_ONLY_BOUNDARY",
      "/api/demo-workflow",
      "/api/export-workflow",
      "/api/advice-release-history/actions",
      "/api/data-maintenance/actions",
      "/api/platform-admin/actions",
      "/api/tenant-governance/actions",
    ];
  }

  if (reportPath.endsWith("02_codebase_inventory.md")) {
    return [
      "Registered routes | 71",
      "Models | 53",
      "Enums | 31",
      "API route files found: `33`",
      "app/api/advice-release-history/actions/route.ts",
      "app/api/data-maintenance/actions/route.ts",
      "app/api/platform-admin/actions/route.ts",
      "app/api/tenant-governance/actions/route.ts",
    ];
  }

  return ["53", "71"];
}

export function validateCapabilityReportDriftFromInputs(inputs: CapabilityReportInput[]): CapabilityReportDriftGateResult {
  const violations: CapabilityReportDriftViolation[] = [];
  const contexts = screenRoutes.map((route) => captureModelContextForRoute(route));
  const requiredCapabilityStatuses = Array.from(new Set(contexts.map((context) => context.capability.status))).sort();

  if (screenRoutes.length !== captureScreenModelAuditBaseline.registeredRoutes) {
    violations.push({
      detail: `Route registry has ${screenRoutes.length}; capture baseline expects ${captureScreenModelAuditBaseline.registeredRoutes}.`,
      file: "lib/route-registry.ts",
      ruleId: "ROUTE_COUNT_DRIFT",
    });
  }

  if (captureScreenModelAuditBaseline.schemaModels !== 53) {
    violations.push({
      detail: `Capture baseline schemaModels is ${captureScreenModelAuditBaseline.schemaModels}; expected current 53-model truth.`,
      file: "lib/capture-screen-model-context.ts",
      ruleId: "SCHEMA_MODEL_COUNT_DRIFT",
    });
  }

  for (const input of inputs) {
    const lines = input.text.split(/\r?\n/);

    for (const [index, line] of lines.entries()) {
      const lineNumber = index + 1;
      if (/\b49[- ]models?\b/i.test(line) && !isAllowedHistorical49Line(line)) {
        violations.push({
          detail: "Stale 49-model wording is only allowed when explicitly marked historical/corrected/rejected.",
          file: input.path,
          line: lineNumber,
          ruleId: "STALE_49_MODEL_CLAIM",
        });
      }

      if (line.includes("COMPLETE_VERTICAL_SLICE") && !isAllowedNegativeCompleteSliceLine(line)) {
        violations.push({
          detail: "Report line promotes COMPLETE_VERTICAL_SLICE without current-run proof guard language.",
          file: input.path,
          line: lineNumber,
          ruleId: "COMPLETE_VERTICAL_SLICE_OVERCLAIM",
        });
      }

      if (lineHasTableStatus(line, "COMPLETE_VERTICAL_SLICE") && !isAllowedNegativeCompleteSliceLine(line)) {
        violations.push({
          detail: "Capability table must not use COMPLETE_VERTICAL_SLICE as a status from generated report output.",
          file: input.path,
          line: lineNumber,
          ruleId: "COMPLETE_VERTICAL_SLICE_OVERCLAIM",
        });
      }
    }

    for (const truth of requiredTruthsForReport(input.path)) {
      if (!input.text.includes(truth)) {
        violations.push({
          detail: `Missing current truth marker: ${truth}`,
          file: input.path,
          ruleId: "MISSING_REQUIRED_CURRENT_TRUTH",
        });
      }
    }
  }

  const combinedReportText = inputs.map((input) => input.text).join("\n");
  for (const status of requiredCapabilityStatuses) {
    if (!combinedReportText.includes(status)) {
      violations.push({
        detail: `Report set does not mention capture-derived capability status ${status}.`,
        file: "REPORT_SET",
        ruleId: "MISSING_CAPTURE_STATUS_COVERAGE",
      });
    }
  }

  return {
    checkedReports: inputs.map((input) => input.path),
    requiredCapabilityStatuses,
    schemaModels: captureScreenModelAuditBaseline.schemaModels,
    status: violations.length === 0 ? "PASS" : "FAIL",
    violations,
  };
}

export function validateCapabilityReportDrift(
  reportPaths: readonly string[] = defaultCapabilityReportDriftGatePaths,
  cwd = process.cwd(),
) {
  const violations: CapabilityReportDriftViolation[] = [];
  const inputs: CapabilityReportInput[] = [];

  for (const reportPath of reportPaths) {
    const absolutePath = path.join(cwd, reportPath);
    if (!existsSync(absolutePath)) {
      violations.push({
        detail: "Capability report drift gate input file does not exist.",
        file: reportPath,
        ruleId: "REPORT_FILE_MISSING",
      });
      continue;
    }
    inputs.push({ path: reportPath, text: readFileSync(absolutePath, "utf8") });
  }

  const result = validateCapabilityReportDriftFromInputs(inputs);
  return {
    ...result,
    checkedReports: reportPaths.map(String),
    status: violations.length || result.violations.length ? "FAIL" as const : "PASS" as const,
    violations: [...violations, ...result.violations],
  };
}
