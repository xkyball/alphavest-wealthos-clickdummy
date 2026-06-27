import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { expect, test } from "@playwright/test";

import {
  contractFulfillmentGateMarkdown,
  evaluateContractFulfillmentGate,
  writeContractFulfillmentGateReport,
  type ContractFulfillmentGateViolation,
} from "../lib/contract-fulfillment-gate";
import {
  uxContractLedgerEntries,
  type UxContractLedgerEntry,
} from "../lib/ux-contract-ledger";

function violationIds(violations: ContractFulfillmentGateViolation[]) {
  return violations.map((violation) => violation.ruleId);
}

test.describe("E12 contract fulfillment gate", () => {
  test("passes the current ledger integrity rules", () => {
    const report = evaluateContractFulfillmentGate(uxContractLedgerEntries, "2026-06-27T00:00:00.000Z");

    expect(report.status).toBe("pass");
    expect(report.totalEntries).toBe(uxContractLedgerEntries.length);
    expect(report.violations).toEqual([]);
    expect(report.countsByStatus.exception).toBeGreaterThan(0);
    expect(report.countsByFamily.contract_fulfillment).toBe(1);
  });

  test("fails duplicate IDs, missing fields and missing follow-ups", () => {
    const base = uxContractLedgerEntries[0];
    const missingFields = {
      ...base,
      id: "NEGATIVE-MISSING-FIELDS",
      evidence: [],
      ownerSurface: [],
      source: [],
    } as UxContractLedgerEntry;
    const missingFollowUp = {
      ...base,
      id: "NEGATIVE-MISSING-FOLLOWUP",
      expiresOrFollowUp: null,
      status: "exception",
    } as UxContractLedgerEntry;
    const report = evaluateContractFulfillmentGate([
      base,
      { ...base },
      missingFields,
      missingFollowUp,
    ]);

    expect(report.status).toBe("fail");
    expect(violationIds(report.violations)).toEqual(expect.arrayContaining([
      "E12-GATE-ID-UNIQUENESS",
      "E12-GATE-REQUIRED-FIELDS",
      "E12-GATE-FOLLOWUP-REQUIRED",
    ]));
  });

  test("fails markdown-only, decision-only and screenshot-only API fulfillment", () => {
    const base = uxContractLedgerEntries[0];
    const markdownOnly = {
      ...base,
      id: "NEGATIVE-MARKDOWN-ONLY",
      evidence: [{ kind: "file", ref: "docs/ux/example.md", result: "pass" }],
      status: "fulfilled",
    } as UxContractLedgerEntry;
    const decisionOnly = {
      ...base,
      id: "NEGATIVE-DECISION-ONLY",
      evidence: [{ kind: "decision", ref: "APPROVED", result: "pass" }],
      status: "fulfilled",
    } as UxContractLedgerEntry;
    const screenshotOnly = {
      ...base,
      id: "NEGATIVE-SCREENSHOT-API",
      contractFamily: "backend_query_truth",
      proofType: ["screenshot"],
      status: "fulfilled",
    } as UxContractLedgerEntry;
    const report = evaluateContractFulfillmentGate([markdownOnly, decisionOnly, screenshotOnly]);

    expect(report.status).toBe("fail");
    expect(violationIds(report.violations)).toEqual(expect.arrayContaining([
      "E12-GATE-FULFILLED-EVIDENCE",
      "E12-GATE-MANUAL-DECISION-NOT-FULFILLMENT",
      "E12-GATE-SCREENSHOT-NOT-API-PROOF",
    ]));
  });

  test("writes machine-readable JSON and markdown reports", () => {
    const tempDir = mkdtempSync(path.join(tmpdir(), "e12-contract-gate-"));
    const report = evaluateContractFulfillmentGate(uxContractLedgerEntries, "2026-06-27T00:00:00.000Z");
    const jsonPath = path.join(tempDir, "latest.json");
    const markdownPath = path.join(tempDir, "report.md");

    writeContractFulfillmentGateReport(report, {
      json: jsonPath,
      markdown: markdownPath,
    });

    expect(JSON.parse(readFileSync(jsonPath, "utf8"))).toMatchObject({
      status: "pass",
      totalEntries: uxContractLedgerEntries.length,
    });
    expect(readFileSync(markdownPath, "utf8")).toContain("E12 Contract Fulfillment Gate Report");
    expect(contractFulfillmentGateMarkdown(report)).toContain("No violations.");
  });
});
