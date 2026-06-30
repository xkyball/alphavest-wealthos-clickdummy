import { expect, test } from "@playwright/test";

import {
  assertNoFalseClientVisibilityCompletionClaim,
  clientVisibilityCanonicalClaimGateOwner,
  clientVisibilityI001DecisionCreationServiceGate,
  clientVisibilityP0AcceptanceMatrix,
  clientVisibilityPayloadRedactionSweepMatrix,
  clientVisibilityStage7FullTestCommandSet,
  clientVisibilityStage7PredecessorReports,
  clientVisibilityStage7RequiredProofLayers,
  clientVisibilityStage7TicketOrder,
  clientVisibilityRouteActionObjectPayloadNegativeSuite,
  buildClientVisibilityStage7CertificationSummary,
  inspectClientVisibilityStage7ClaimPackCandidate,
  inspectClientVisibilityStage7Payload,
  runClientVisibilityPayloadRedactionProofSamples,
  validateClientVisibilityCanonicalClaimGate,
} from "../lib/client-visibility-certification";
import { clientVisibilitySelectedProcessIds, type ClientVisibilityProcessId } from "../lib/client-visibility-safety-foundation";

test.describe("CLIENT_VISIBILITY Stage 7 cross-process P0 certification", () => {
  test("CLIENT_VISIBILITY-P7-T01 maps all 27 processes to positive and negative acceptance without stale IDs", () => {
    const summary = buildClientVisibilityStage7CertificationSummary();

    expect(summary.processCount).toBe(27);
    expect(summary.missing).toEqual([]);
    expect(summary.duplicates).toEqual([]);
    expect(summary.ticketOrder).toEqual(["CLIENT_VISIBILITY-P7-T01", "CLIENT_VISIBILITY-P7-T02", "CLIENT_VISIBILITY-P7-T03", "CLIENT_VISIBILITY-P7-T04", "CLIENT_VISIBILITY-P7-T05"]);
    expect(clientVisibilityP0AcceptanceMatrix.map((row) => row.processId)).toEqual(clientVisibilitySelectedProcessIds);
    expect(clientVisibilityStage7PredecessorReports).toHaveLength(7);

    for (const row of clientVisibilityP0AcceptanceMatrix) {
      expect(row.positiveAcceptance, `${row.processId} positive acceptance`).not.toHaveLength(0);
      expect(row.negativeAcceptance, `${row.processId} negative acceptance`).not.toHaveLength(0);
      expect(row.predecessorEvidence.length, `${row.processId} predecessor evidence`).toBeGreaterThan(0);
      for (const proofLayer of clientVisibilityStage7RequiredProofLayers) {
        expect(row.proofLayers[proofLayer], `${row.processId} ${proofLayer}`).not.toHaveLength(0);
      }
    }

    expect(summary.partialRows.map((row) => row.processId)).toEqual(["I-001"]);
    expect(summary.fullCount).toBe(26);
  });

  test("CLIENT_VISIBILITY-P7-T01 blocks stale, unmapped or false full-fulfillment claims", () => {
    const good = clientVisibilityP0AcceptanceMatrix.find((row) => row.processId === "G-006");
    const scopedPartial = clientVisibilityP0AcceptanceMatrix.find((row) => row.processId === "I-001");
    expect(good).toBeDefined();
    expect(scopedPartial).toBeDefined();
    if (!good || !scopedPartial) throw new Error("Missing CLIENT_VISIBILITY Stage 7 claim rows");

    expect(assertNoFalseClientVisibilityCompletionClaim(good)).toMatchObject({
      allowed: true,
      reason: "CLIENT_VISIBILITY_PHASE7_CLAIM_ALLOWED",
    });
    expect(assertNoFalseClientVisibilityCompletionClaim(scopedPartial)).toMatchObject({
      allowed: false,
      reason: "CLIENT_VISIBILITY_PHASE7_I001_DECISION_CREATION_SERVICE_REQUIRED",
    });

    const forged = {
      ...good,
      predecessorEvidence: [],
      proofLayers: {
        ...good.proofLayers,
        safety: "",
      },
    };

    expect(assertNoFalseClientVisibilityCompletionClaim(forged)).toMatchObject({
      allowed: false,
      missingProofLayers: ["safety"],
      reason: "CLIENT_VISIBILITY_PHASE7_FALSE_COMPLETION_BLOCKED",
    });

    const forgedI001 = {
      ...scopedPartial,
      status: "FULLY_FULFILLED_VERTICAL_SLICE" as const,
      statusReason: "Report says the decision creation gap is done.",
    };

    expect(assertNoFalseClientVisibilityCompletionClaim(forgedI001)).toMatchObject({
      allowed: false,
      reason: "CLIENT_VISIBILITY_PHASE7_I001_DECISION_CREATION_SERVICE_REQUIRED",
    });
  });

  test("CLIENT_VISIBILITY-P7-T02 covers route/action/object/payload negative scenarios", () => {
    expect(clientVisibilityRouteActionObjectPayloadNegativeSuite.map((scenario) => scenario.id)).toEqual([
      "cross_tenant",
      "wrong_role",
      "wrong_object",
      "no_audit",
      "upload_only_not_sufficient",
      "advisor_not_release",
    ]);

    const coveredProcessIds = new Set(clientVisibilityRouteActionObjectPayloadNegativeSuite.flatMap((scenario) => scenario.processIds));
    const requiredNegativeCoverage: ClientVisibilityProcessId[] = [
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

    for (const scenario of clientVisibilityRouteActionObjectPayloadNegativeSuite) {
      expect(scenario.coveredBy.length, `${scenario.id} coveredBy`).toBeGreaterThan(0);
      expect(scenario.negativeAssertion, `${scenario.id} assertion`).not.toHaveLength(0);
    }
  });

  test("CLIENT_VISIBILITY-P7-T03 sweeps client and export payload redaction proof", () => {
    expect(clientVisibilityPayloadRedactionSweepMatrix.map((row) => row.surface)).toEqual(["api", "ui", "export"]);
    expect(clientVisibilityPayloadRedactionSweepMatrix.flatMap((row) => row.forbiddenClassifications)).toEqual(
      expect.arrayContaining(["AI_DRAFT", "INTERNAL_RATIONALE", "COMPLIANCE_NOTES", "UNRELEASED_EVIDENCE", "HIDDEN_FIELD"]),
    );

    const samples = runClientVisibilityPayloadRedactionProofSamples();
    expect(samples.safeApiClean).toBe(true);
    expect(samples.unsafeUiForbiddenFields).toEqual(["clientSummaryDraft", "unreleasedEvidence", "visibilityOverride"]);
    expect(samples.unsafeExportForbiddenFields).toEqual(["complianceNotes", "internalRationale"]);

    const unsafe = inspectClientVisibilityStage7Payload(
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

  test("CLIENT_VISIBILITY-P7-T04 declares full command set and CLIENT_VISIBILITY-P7-T05 claim pack remains honest", () => {
    expect(clientVisibilityStage7TicketOrder).toHaveLength(5);
    expect(clientVisibilityStage7FullTestCommandSet).toEqual(
      expect.arrayContaining([
        "pnpm guard:source",
        "pnpm test:client-visibility:claims",
        "pnpm typecheck",
        "pnpm lint",
        "pnpm db:validate",
        "pnpm test:client-visibility:no-server",
        "pnpm test:client-visibility:server",
        "pnpm check:full",
      ]),
    );

    const claimPack = inspectClientVisibilityStage7ClaimPackCandidate();
    expect(claimPack.totalRows).toBe(27);
    expect(claimPack.claimableCount).toBe(26);
    expect(claimPack.blockedFullClaimCount).toBe(1);
    expect(claimPack.blockedRows[0].row.processId).toBe("I-001");
  });

  test("canonical claim gate is the only CLIENT_VISIBILITY status claim authority", () => {
    const validation = validateClientVisibilityCanonicalClaimGate();

    expect(clientVisibilityCanonicalClaimGateOwner).toBe("lib/client-visibility-certification.ts");
    expect(validation.status).toBe("PASS");
    expect(validation.errors).toEqual([]);
    expect(validation.partialRows.map((row) => row.processId)).toEqual(["I-001"]);
    expect(clientVisibilityI001DecisionCreationServiceGate).toMatchObject({
      currentStatus: "MISSING",
      processId: "I-001",
      requiredServiceName: "DecisionCreationService",
    });

    const forgedRows = clientVisibilityP0AcceptanceMatrix.map((row) =>
      row.processId === "I-001"
        ? {
            ...row,
            status: "FULLY_FULFILLED_VERTICAL_SLICE" as const,
            statusReason: "Raised by report copy only.",
          }
        : row,
    );

    const forgedValidation = validateClientVisibilityCanonicalClaimGate(forgedRows);
    expect(forgedValidation.status).toBe("FAIL");
    expect(forgedValidation.errors).toContain("I-001 is promoted without implemented DecisionCreationService proof.");
  });
});
