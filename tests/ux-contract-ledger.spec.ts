import { expect, test } from "@playwright/test";

import {
  contractLedgerEntryById,
  duplicateContractLedgerIds,
  fulfilledEntriesWithManualDecisionOnlyEvidence,
  fulfilledEntriesWithMarkdownOnlyEvidence,
  ledgerEntriesByContractFamily,
  ledgerEntriesByStatus,
  ledgerEntriesMissingOwnerSurface,
  ledgerEntriesMissingRequiredFollowUp,
  requiredSeedContractIds,
  screenshotOnlyApiTruthEntries,
  uxContractLedgerEntries,
  uxContractLedgerIntegrity,
  uxContractMetaContract,
  type UxContractLedgerEntry,
} from "../lib/ux-contract-ledger";

test.describe("E12 canonical contract ledger", () => {
  test("records the approved D1 policy in the meta-contract", () => {
    expect(uxContractMetaContract.approvalToken).toBe(
      "APPROVE_E12_HYBRID_LEDGER_WARN_EXISTING_FAIL_NEW_GENERATE_MARKDOWN_AFTER_Q1",
    );
    expect(uxContractMetaContract.exceptionPolicy).toEqual({
      existingRegisteredDebt: "warn_existing",
      newUnregisteredDebt: "fail_new",
      requireExpiresOrFollowUp: true,
    });
    expect(uxContractMetaContract.markdownPolicy).toBe("hybrid_transition");
    expect(uxContractMetaContract.stageCheckPolicy).toBe("add_contract_script_first_hardwire_after_q1");
    expect(uxContractMetaContract.releaseRelevantCommands).toContain("pnpm test:contract-fulfillment");
  });

  test("seeds every E00-E12 contract family required by E12-I1", () => {
    expect(uxContractLedgerEntries.length).toBeGreaterThanOrEqual(requiredSeedContractIds.length);
    expect(uxContractLedgerIntegrity.missingSeedIds).toEqual([]);

    for (const id of requiredSeedContractIds) {
      const entry = contractLedgerEntryById(id);

      expect(entry, id).toBeDefined();
      expect(entry?.source.length, `${id} source`).toBeGreaterThan(0);
      expect(entry?.ownerSurface.length, `${id} owner surfaces`).toBeGreaterThan(0);
      expect(entry?.obligation, `${id} obligation`).toContain(" ");
      expect(entry?.evidence.length, `${id} evidence`).toBeGreaterThan(0);
    }
  });

  test("keeps ledger invariants clean for the initial seed", () => {
    expect(uxContractLedgerIntegrity.duplicateIds).toEqual([]);
    expect(uxContractLedgerIntegrity.missingFollowUps).toEqual([]);
    expect(uxContractLedgerIntegrity.missingOwnerSurfaces).toEqual([]);
    expect(uxContractLedgerIntegrity.markdownOnlyFulfilled).toEqual([]);
    expect(uxContractLedgerIntegrity.manualDecisionOnlyFulfilled).toEqual([]);
    expect(uxContractLedgerIntegrity.screenshotOnlyApiTruth).toEqual([]);
  });

  test("classifies current debt without pretending markdown registers are fulfillment", () => {
    expect(contractLedgerEntryById("E10-ACTION-ZONE-REGISTER")).toMatchObject({
      gateBehavior: "warn_existing",
      status: "exception",
    });
    expect(contractLedgerEntryById("E10-DATA-SURFACE-FILTER-REGISTER")).toMatchObject({
      gateBehavior: "warn_existing",
      status: "exception",
    });
    expect(contractLedgerEntryById("E11-BACKEND-DATA-SURFACE-TRUTH")).toMatchObject({
      contractFamily: "backend_query_truth",
      status: "partial",
    });
    expect(contractLedgerEntryById("E10-RETIRED-PROOF-UI-REGISTER")).toMatchObject({
      gateBehavior: "pass",
      status: "fulfilled",
    });
  });

  test("groups entries by family and status for the future gate report", () => {
    const byFamily = ledgerEntriesByContractFamily();
    const byStatus = ledgerEntriesByStatus();

    expect(byFamily.register_debt.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      "E10-ACTION-ZONE-REGISTER",
      "E10-DATA-SURFACE-FILTER-REGISTER",
      "E10-RETIRED-PROOF-UI-REGISTER",
      "E10-AZ-001",
      "E10-AZ-011",
    ]));
    expect(byStatus.exception.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      "E10-ACTION-ZONE-REGISTER",
      "E10-DATA-SURFACE-FILTER-REGISTER",
      "E10-AZ-001",
      "E10-AZ-011",
    ]));
    expect(byStatus.fulfilled.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      "E01-OPERATING-MODEL",
      "E03-PROOF-REVIEWER-SEPARATION",
      "E04-LIFECYCLE-STATE",
      "E10-RETIRED-PROOF-UI-REGISTER",
    ]));
  });

  test("validation helpers catch negative ledger fixtures", () => {
    const base = uxContractLedgerEntries[0];
    const duplicateEntries = [...uxContractLedgerEntries, { ...base }];
    const missingFollowUp: UxContractLedgerEntry = {
      ...base,
      id: "NEGATIVE-MISSING-FOLLOWUP",
      expiresOrFollowUp: null,
      status: "exception",
    };
    const missingOwner: UxContractLedgerEntry = {
      ...base,
      id: "NEGATIVE-MISSING-OWNER",
      ownerSurface: [],
      status: "partial",
    };
    const markdownOnlyFulfilled: UxContractLedgerEntry = {
      ...base,
      id: "NEGATIVE-MARKDOWN-ONLY",
      evidence: [{ kind: "file", ref: "docs/ux/example.md", result: "pass" }],
      status: "fulfilled",
    };
    const decisionOnlyFulfilled: UxContractLedgerEntry = {
      ...base,
      id: "NEGATIVE-DECISION-ONLY",
      evidence: [{ kind: "decision", ref: "APPROVED", result: "pass" }],
      status: "fulfilled",
    };
    const screenshotOnlyApiTruth: UxContractLedgerEntry = {
      ...base,
      id: "NEGATIVE-SCREENSHOT-API",
      contractFamily: "backend_query_truth",
      proofType: ["screenshot"],
      status: "fulfilled",
    };

    expect(duplicateContractLedgerIds(duplicateEntries)).toContain(base.id);
    expect(ledgerEntriesMissingRequiredFollowUp([missingFollowUp]).map((entry) => entry.id)).toEqual([
      "NEGATIVE-MISSING-FOLLOWUP",
    ]);
    expect(ledgerEntriesMissingOwnerSurface([missingOwner]).map((entry) => entry.id)).toEqual([
      "NEGATIVE-MISSING-OWNER",
    ]);
    expect(fulfilledEntriesWithMarkdownOnlyEvidence([markdownOnlyFulfilled]).map((entry) => entry.id)).toEqual([
      "NEGATIVE-MARKDOWN-ONLY",
    ]);
    expect(fulfilledEntriesWithManualDecisionOnlyEvidence([decisionOnlyFulfilled]).map((entry) => entry.id)).toEqual([
      "NEGATIVE-DECISION-ONLY",
    ]);
    expect(screenshotOnlyApiTruthEntries([screenshotOnlyApiTruth]).map((entry) => entry.id)).toEqual([
      "NEGATIVE-SCREENSHOT-API",
    ]);
  });
});
