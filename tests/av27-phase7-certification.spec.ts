import { expect, test } from "@playwright/test";

import {
  assertNoFalseAv27CompletionClaim,
  av27CanonicalClaimGateOwner,
  av27I001DecisionCreationServiceGate,
  av27P0AcceptanceMatrix,
  av27PayloadRedactionSweepMatrix,
  av27Phase7FullTestCommandSet,
  av27Phase7PredecessorReports,
  av27Phase7RequiredProofLayers,
  av27Phase7TicketOrder,
  av27RouteActionObjectPayloadNegativeSuite,
  buildAv27Phase7CertificationSummary,
  inspectAv27Phase7ClaimPackCandidate,
  inspectAv27Phase7Payload,
  runAv27PayloadRedactionProofSamples,
  validateAv27CanonicalClaimGate,
} from "../lib/av27-phase7-certification";
import { av27SelectedProcessIds, type Av27ProcessId } from "../lib/av27-safety-foundation";

test.describe("AV27 Phase 7 cross-process P0 certification", () => {
  test("AV27-P7-T01 maps all 27 processes to positive and negative acceptance without stale IDs", () => {
    const summary = buildAv27Phase7CertificationSummary();

    expect(summary.processCount).toBe(27);
    expect(summary.missing).toEqual([]);
    expect(summary.duplicates).toEqual([]);
    expect(summary.ticketOrder).toEqual(["AV27-P7-T01", "AV27-P7-T02", "AV27-P7-T03", "AV27-P7-T04", "AV27-P7-T05"]);
    expect(av27P0AcceptanceMatrix.map((row) => row.processId)).toEqual(av27SelectedProcessIds);
    expect(av27Phase7PredecessorReports).toHaveLength(7);

    for (const row of av27P0AcceptanceMatrix) {
      expect(row.positiveAcceptance, `${row.processId} positive acceptance`).not.toHaveLength(0);
      expect(row.negativeAcceptance, `${row.processId} negative acceptance`).not.toHaveLength(0);
      expect(row.predecessorEvidence.length, `${row.processId} predecessor evidence`).toBeGreaterThan(0);
      for (const proofLayer of av27Phase7RequiredProofLayers) {
        expect(row.proofLayers[proofLayer], `${row.processId} ${proofLayer}`).not.toHaveLength(0);
      }
    }

    expect(summary.partialRows.map((row) => row.processId)).toEqual(["I-001"]);
    expect(summary.fullCount).toBe(26);
  });

  test("AV27-P7-T01 blocks stale, unmapped or false full-fulfillment claims", () => {
    const good = av27P0AcceptanceMatrix.find((row) => row.processId === "G-006");
    const scopedPartial = av27P0AcceptanceMatrix.find((row) => row.processId === "I-001");
    expect(good).toBeDefined();
    expect(scopedPartial).toBeDefined();
    if (!good || !scopedPartial) throw new Error("Missing AV27 Phase 7 claim rows");

    expect(assertNoFalseAv27CompletionClaim(good)).toMatchObject({
      allowed: true,
      reason: "AV27_PHASE7_CLAIM_ALLOWED",
    });
    expect(assertNoFalseAv27CompletionClaim(scopedPartial)).toMatchObject({
      allowed: false,
      reason: "AV27_PHASE7_I001_DECISION_CREATION_SERVICE_REQUIRED",
    });

    const forged = {
      ...good,
      predecessorEvidence: [],
      proofLayers: {
        ...good.proofLayers,
        safety: "",
      },
    };

    expect(assertNoFalseAv27CompletionClaim(forged)).toMatchObject({
      allowed: false,
      missingProofLayers: ["safety"],
      reason: "AV27_PHASE7_FALSE_COMPLETION_BLOCKED",
    });

    const forgedI001 = {
      ...scopedPartial,
      status: "FULLY_FULFILLED_VERTICAL_SLICE" as const,
      statusReason: "Report says the decision creation gap is done.",
    };

    expect(assertNoFalseAv27CompletionClaim(forgedI001)).toMatchObject({
      allowed: false,
      reason: "AV27_PHASE7_I001_DECISION_CREATION_SERVICE_REQUIRED",
    });
  });

  test("AV27-P7-T02 covers route/action/object/payload negative scenarios", () => {
    expect(av27RouteActionObjectPayloadNegativeSuite.map((scenario) => scenario.id)).toEqual([
      "cross_tenant",
      "wrong_role",
      "wrong_object",
      "no_audit",
      "upload_only_not_sufficient",
      "advisor_not_release",
    ]);

    const coveredProcessIds = new Set(av27RouteActionObjectPayloadNegativeSuite.flatMap((scenario) => scenario.processIds));
    const requiredNegativeCoverage: Av27ProcessId[] = [
      "A-003",
      "B-006",
      "B-010",
      "B-012",
      "C-002",
      "C-008",
      "F-005",
      "G-006",
      "G-009",
      "I-004",
      "J-009",
      "K-006",
    ];

    for (const processId of requiredNegativeCoverage) {
      expect(coveredProcessIds.has(processId), `${processId} negative coverage`).toBe(true);
    }

    for (const scenario of av27RouteActionObjectPayloadNegativeSuite) {
      expect(scenario.coveredBy.length, `${scenario.id} coveredBy`).toBeGreaterThan(0);
      expect(scenario.negativeAssertion, `${scenario.id} assertion`).not.toHaveLength(0);
    }
  });

  test("AV27-P7-T03 sweeps client and export payload redaction proof", () => {
    expect(av27PayloadRedactionSweepMatrix.map((row) => row.surface)).toEqual(["api", "ui", "export"]);
    expect(av27PayloadRedactionSweepMatrix.flatMap((row) => row.forbiddenClassifications)).toEqual(
      expect.arrayContaining(["AI_DRAFT", "INTERNAL_RATIONALE", "COMPLIANCE_NOTES", "UNRELEASED_EVIDENCE", "HIDDEN_FIELD"]),
    );

    const samples = runAv27PayloadRedactionProofSamples();
    expect(samples.safeApiClean).toBe(true);
    expect(samples.unsafeUiForbiddenFields).toEqual(["clientSummaryDraft", "unreleasedEvidence", "visibilityOverride"]);
    expect(samples.unsafeExportForbiddenFields).toEqual(["complianceNotes", "internalRationale"]);

    const unsafe = inspectAv27Phase7Payload(
      {
        clientSummary: "Released safe summary.",
        internalRationale: "Internal rationale.",
        modelPrompt: "Internal prompt.",
      },
      "api",
    );
    expect(unsafe.clean).toBe(false);
    expect(unsafe.payloadClassifications).toEqual(["CLIENT_SAFE_SUMMARY", "INTERNAL_RATIONALE", "AI_DRAFT"]);
  });

  test("AV27-P7-T04 declares full command set and AV27-P7-T05 claim pack remains honest", () => {
    expect(av27Phase7TicketOrder).toHaveLength(5);
    expect(av27Phase7FullTestCommandSet).toEqual(
      expect.arrayContaining([
        "pnpm guard:source",
        "pnpm test:av27:claims",
        "pnpm typecheck",
        "pnpm lint",
        "pnpm db:validate",
        "pnpm test:av27:no-server",
        "pnpm test:av27:server",
        "pnpm phase:check",
      ]),
    );

    const claimPack = inspectAv27Phase7ClaimPackCandidate();
    expect(claimPack.totalRows).toBe(27);
    expect(claimPack.claimableCount).toBe(26);
    expect(claimPack.blockedFullClaimCount).toBe(1);
    expect(claimPack.blockedRows[0].row.processId).toBe("I-001");
  });

  test("canonical claim gate is the only AV27 status claim authority", () => {
    const validation = validateAv27CanonicalClaimGate();

    expect(av27CanonicalClaimGateOwner).toBe("lib/av27-phase7-certification.ts");
    expect(validation.status).toBe("PASS");
    expect(validation.errors).toEqual([]);
    expect(validation.partialRows.map((row) => row.processId)).toEqual(["I-001"]);
    expect(av27I001DecisionCreationServiceGate).toMatchObject({
      currentStatus: "MISSING",
      processId: "I-001",
      requiredServiceName: "DecisionCreationService",
    });

    const forgedRows = av27P0AcceptanceMatrix.map((row) =>
      row.processId === "I-001"
        ? {
            ...row,
            status: "FULLY_FULFILLED_VERTICAL_SLICE" as const,
            statusReason: "Raised by report copy only.",
          }
        : row,
    );

    const forgedValidation = validateAv27CanonicalClaimGate(forgedRows);
    expect(forgedValidation.status).toBe("FAIL");
    expect(forgedValidation.errors).toContain("I-001 is promoted without implemented DecisionCreationService proof.");
  });
});
