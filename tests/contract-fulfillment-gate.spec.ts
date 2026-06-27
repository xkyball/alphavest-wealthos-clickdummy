import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { expect, test } from "@playwright/test";

import {
  contractFulfillmentGateMarkdown,
  contractFulfillmentGateRuleIds,
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
  test("declares the consolidated E12-I3 rule families", () => {
    expect(contractFulfillmentGateRuleIds).toEqual([
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
      "E12-GATE-RELEASE-CONTRACT-CHECK",
    ]);
  });

  test("passes the current ledger integrity rules", () => {
    const report = evaluateContractFulfillmentGate(uxContractLedgerEntries, "2026-06-27T00:00:00.000Z");

    expect(report.status).toBe("pass");
    expect(report.totalEntries).toBe(uxContractLedgerEntries.length);
    expect(report.violations).toEqual([]);
    expect(report.countsByStatus.exception).toBeGreaterThan(0);
    expect(report.countsByFamily.contract_fulfillment).toBe(1);
    expect(report.countsByFamily.release_gate).toBeGreaterThan(0);
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

  test("fails unregistered local action-class and filter exception debt", () => {
    const report = evaluateContractFulfillmentGate(uxContractLedgerEntries, "2026-06-27T00:00:00.000Z", {
      sourceFiles: [
        {
          path: "components/unregistered-actions.tsx",
          text: "const primaryButtonClass = 'rounded-md';",
        },
        {
          path: "components/unregistered-filter.tsx",
          text: '<button data-ux-e10-filter-exception-id="DSF-999" />',
        },
      ],
    });

    expect(report.status).toBe("fail");
    expect(violationIds(report.violations)).toEqual(expect.arrayContaining([
      "E12-GATE-NO-NEW-ACTION-DEBT",
      "E12-GATE-NO-NEW-FAKE-FILTERS",
    ]));
  });

  test("allows registered E10 action and filter debt during the warn-existing transition", () => {
    const report = evaluateContractFulfillmentGate(uxContractLedgerEntries, "2026-06-27T00:00:00.000Z", {
      sourceFiles: [
        {
          path: "components/admin-tenant-setup-screen.tsx",
          text: [
            "const primaryButtonClass = uxActionClassForPriority('primary');",
            '<button data-ux-e10-filter-exception-id="DSF-001" />',
          ].join("\n"),
        },
      ],
    });

    expect(report.status).toBe("pass");
    expect(report.violations).toEqual([]);
  });

  test("fails backend-query-backed ledger entries without API and UI proof anchors", () => {
    const base = uxContractLedgerEntries[0];
    const missingApiAndUiProof = {
      ...base,
      id: "NEGATIVE-BACKEND-META",
      contractFamily: "backend_query_truth",
      evidence: [{ kind: "file", ref: "components/example.tsx", result: "pass" }],
      ownerSurface: [{ kind: "test", ref: "tests/example.spec.ts" }],
      proofType: ["runtime_test"],
      status: "partial",
      targetClass: "backend_query_backed",
    } as UxContractLedgerEntry;
    const report = evaluateContractFulfillmentGate([missingApiAndUiProof], "2026-06-27T00:00:00.000Z", {
      sourceFiles: [],
    });

    expect(report.status).toBe("fail");
    expect(violationIds(report.violations)).toEqual(expect.arrayContaining([
      "E12-GATE-BACKEND-META",
      "E12-GATE-UI-SOURCE-TRUTH",
    ]));
  });

  test("fails retired ProductGuidance imports and soft release capture QA scripts", () => {
    const report = evaluateContractFulfillmentGate(uxContractLedgerEntries, "2026-06-27T00:00:00.000Z", {
      packageJsonText: JSON.stringify({
        scripts: {
          "visual:capture-qa:release": "tsx scripts/capture-qa-contract.ts",
          "release:contract-check": "pnpm guard:source && pnpm test:contract-fulfillment && pnpm test:route-smoke",
        },
      }),
      sourceFiles: [
        {
          path: "components/example.tsx",
          text: 'import { ProductGuidancePanel } from "@/components/product-guidance-panel";',
        },
      ],
    });

    expect(report.status).toBe("fail");
    expect(violationIds(report.violations)).toEqual(expect.arrayContaining([
      "E12-GATE-RETIRED-PROOF-UI",
      "E12-GATE-CAPTURE-RELEASE-WARNINGS",
      "E12-GATE-RELEASE-CONTRACT-CHECK",
    ]));
  });

  test("fails release contract checks that omit required source, truth, route or capture gates", () => {
    const report = evaluateContractFulfillmentGate(uxContractLedgerEntries, "2026-06-27T00:00:00.000Z", {
      packageJsonText: JSON.stringify({
        scripts: {
          "visual:capture-qa:release": "CAPTURE_QA_FAIL_ON_WARNINGS=1 CAPTURE_QA_REQUIRE_CAPTURES=1 CAPTURE_QA_INPUT=artifacts/release-candidate/current CAPTURE_QA_OUTPUT=artifacts/capture-qa/release-current tsx scripts/capture-qa-contract.ts",
          "release:contract-check": "pnpm guard:source && pnpm test:contract-fulfillment",
        },
      }),
      sourceFiles: [],
    });

    expect(report.status).toBe("fail");
    expect(report.violations).toContainEqual(expect.objectContaining({
      entryId: "E12-RELEASE-GATE-001",
      ruleId: "E12-GATE-RELEASE-CONTRACT-CHECK",
    }));
  });
});
