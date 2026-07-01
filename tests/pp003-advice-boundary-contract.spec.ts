import { expect, test } from "@playwright/test";

import {
  classifyPp003AdviceBoundaryField,
  evaluatePp003DraftLifecycleGate,
  inspectPp003PayloadSurface,
  pp003AllowedClientSafeCandidateFields,
  pp003FieldClassificationRegister,
  pp003FieldsForClass,
  pp003SurfaceRuleForField,
} from "../lib/pp003-advice-boundary-contract";

test.describe("PP-003 advice boundary field contract", () => {
  test("classifies AI draft, rationale, assumptions, unsupported claims and evidence details", () => {
    expect(classifyPp003AdviceBoundaryField("clientSummaryDraft")).toBe("AI_DRAFT_INTERNAL_ONLY");
    expect(classifyPp003AdviceBoundaryField("draftClientSummary")).toBe("AI_DRAFT_INTERNAL_ONLY");
    expect(classifyPp003AdviceBoundaryField("internalRationale")).toBe("INTERNAL_RATIONALE_ONLY");
    expect(classifyPp003AdviceBoundaryField("summaryInternal")).toBe("INTERNAL_RATIONALE_ONLY");
    expect(classifyPp003AdviceBoundaryField("assumptionsJson")).toBe("INTERNAL_ASSUMPTION_ONLY");
    expect(classifyPp003AdviceBoundaryField("unsupportedClaims")).toBe("UNSUPPORTED_CLAIM_INTERNAL_ONLY");
    expect(classifyPp003AdviceBoundaryField("evidenceRecordId")).toBe("INTERNAL_EVIDENCE_DETAIL");
    expect(classifyPp003AdviceBoundaryField("auditMetadata")).toBe("CLIENT_REDACTED_AUDIT");
    expect(classifyPp003AdviceBoundaryField("clientSummary")).toBe("CLIENT_SAFE_CANDIDATE");
  });

  test("marks unknown PP003-adjacent fields as a decision instead of guessing", () => {
    expect(classifyPp003AdviceBoundaryField("llmConfidenceNarrative")).toBe("REQUIRES_DECISION");
  });

  test("keeps the register unique and binds the client-safe allowlist", () => {
    const registeredFields = pp003FieldClassificationRegister.map((entry) => entry.field);

    expect(new Set(registeredFields).size).toBe(registeredFields.length);
    expect(pp003FieldsForClass("CLIENT_SAFE_CANDIDATE")).toEqual(
      [...pp003AllowedClientSafeCandidateFields, "noClientRelease"].sort(),
    );
    expect(pp003FieldsForClass("AI_DRAFT_INTERNAL_ONLY")).toEqual(
      expect.arrayContaining(["aiDraft", "clientSummaryDraft", "draftClientSummary", "modelOutput", "modelPrompt"]),
    );
    expect(pp003FieldsForClass("UNSUPPORTED_CLAIM_INTERNAL_ONLY")).toEqual(
      expect.arrayContaining(["unsupportedClaim", "unsupportedClaimReason", "unsupportedClaims"]),
    );
  });

  test("maps internal-only classes to external surface hide/block rules", () => {
    expect(pp003SurfaceRuleForField("clientSummaryDraft", "client_portal_mobile")).toBe("hide");
    expect(pp003SurfaceRuleForField("internalRationale", "decision_projection")).toBe("hide");
    expect(pp003SurfaceRuleForField("evidenceRecordId", "decision_projection")).toBe("redact");
    expect(pp003SurfaceRuleForField("clientSummaryDraft", "export_candidate")).toBe("block");
    expect(pp003SurfaceRuleForField("clientSummaryDraft", "internal_workbench")).toBe("allow_internal_only");
    expect(pp003SurfaceRuleForField("clientSummary", "client_api")).toBe("allow");
  });

  test("flags forbidden fields on client, decision, export and demo response surfaces", () => {
    const payload = {
      assumptionsJson: { model: "internal" },
      clientSummary: "Released client-safe summary.",
      clientSummaryDraft: "AI draft.",
      evidenceRecordId: "evidence-1",
      internalRationale: "Internal rationale.",
      noClientRelease: true,
    };

    const clientInspection = inspectPp003PayloadSurface("client_api", payload);
    expect(clientInspection.clean).toBe(false);
    expect(clientInspection.forbiddenFields).toEqual([
      "assumptionsJson",
      "clientSummaryDraft",
      "evidenceRecordId",
      "internalRationale",
    ]);
    expect(clientInspection.fieldResults.find((result) => result.field === "clientSummary")?.rule).toBe("allow");
    expect(clientInspection.fieldResults.find((result) => result.field === "noClientRelease")?.rule).toBe("allow");

    const decisionInspection = inspectPp003PayloadSurface("decision_projection", payload);
    expect(decisionInspection.forbiddenFields).toEqual([
      "assumptionsJson",
      "clientSummaryDraft",
      "evidenceRecordId",
      "internalRationale",
    ]);
    expect(decisionInspection.fieldResults.find((result) => result.field === "evidenceRecordId")?.rule).toBe("redact");

    const exportInspection = inspectPp003PayloadSurface("export_candidate", payload);
    expect(exportInspection.forbiddenFields).toEqual([
      "assumptionsJson",
      "clientSummaryDraft",
      "evidenceRecordId",
      "internalRationale",
    ]);
    expect(exportInspection.fieldResults.find((result) => result.field === "clientSummaryDraft")?.rule).toBe("block");

    const demoInspection = inspectPp003PayloadSurface("demo_workflow_response", payload);
    expect(demoInspection.forbiddenFields).toEqual([
      "assumptionsJson",
      "clientSummaryDraft",
      "evidenceRecordId",
      "internalRationale",
    ]);
  });

  test("permits known internal fields only on the internal workbench and blocks unknown fields everywhere", () => {
    const internalInspection = inspectPp003PayloadSurface("internal_workbench", {
      clientSummaryDraft: "Internal draft.",
      internalRationale: "Internal rationale.",
      unsupportedClaims: ["Needs source."],
    });

    expect(internalInspection.clean).toBe(true);

    const unknownInternal = inspectPp003PayloadSurface("internal_workbench", {
      llmConfidenceNarrative: "Unclassified model confidence.",
    });

    expect(unknownInternal.clean).toBe(false);
    expect(unknownInternal.unknownFields).toEqual(["llmConfidenceNarrative"]);
    expect(unknownInternal.missing).toEqual([
      "pp003_forbidden_surface_field:internal_workbench:llmConfidenceNarrative",
      "pp003_requires_decision:llmConfidenceNarrative",
    ]);
  });

  test("allows internal review while keeping draft state internal-only", () => {
    const gate = evaluatePp003DraftLifecycleGate({
      canonicalEvidenceAudited: false,
      canonicalEvidencePath: "NONE",
      canonicalEvidenceSufficient: false,
      classified: false,
      clientVisible: false,
      draftStatus: "CREATED",
      promotionTarget: "internal_review",
      unsupportedClaims: [],
    });

    expect(gate.allowed).toBe(true);
    expect(gate.missing).toEqual([]);
  });

  test("blocks advisor candidate promotion until classified, rebuilt with canonical evidence and unsupported claims are resolved", () => {
    const blocked = evaluatePp003DraftLifecycleGate({
      canonicalEvidenceAudited: false,
      canonicalEvidencePath: "LEGACY_OR_Operational",
      canonicalEvidenceSufficient: false,
      classified: false,
      clientVisible: false,
      draftStatus: "REVISION_REQUESTED",
      promotionTarget: "advisor_candidate",
      unsupportedClaims: [{ status: "NEEDS_EVIDENCE" }],
    });

    expect(blocked.allowed).toBe(false);
    expect(blocked.missing).toEqual([
      "draft_classification_required",
      "evidence_backed_rebuild_required",
      "unsupported_claims_require_evidence",
      "pp002_canonical_process_evidence_required",
      "canonical_evidence_sufficiency_required",
      "canonical_evidence_audit_required",
    ]);

    const allowed = evaluatePp003DraftLifecycleGate({
      canonicalEvidenceAudited: true,
      canonicalEvidencePath: "PP002_CANONICAL_PROCESS",
      canonicalEvidenceSufficient: true,
      classified: true,
      clientVisible: false,
      draftStatus: "REBUILT_WITH_EVIDENCE",
      promotionTarget: "advisor_candidate",
      unsupportedClaims: [{ status: "RESOLVED" }],
    });

    expect(allowed.allowed).toBe(true);
    expect(allowed.missing).toEqual([]);
  });

  test("rejects unsupported claim waivers, legacy evidence and client-visible release in PP003", () => {
    const gate = evaluatePp003DraftLifecycleGate({
      canonicalEvidenceAudited: true,
      canonicalEvidencePath: "LEGACY_OR_Operational",
      canonicalEvidenceSufficient: true,
      classified: true,
      clientVisible: true,
      draftStatus: "ADVISOR_READY",
      promotionTarget: "client_visible_release",
      unsupportedClaims: [{ status: "WAIVED" }],
    });

    expect(gate.allowed).toBe(false);
    expect(gate.missing).toEqual([
      "pp003_draft_must_not_be_client_visible",
      "pp003_does_not_authorize_client_visible_release",
      "unsupported_claim_waiver_not_pp003_canonical_proof",
      "pp002_canonical_process_evidence_required",
    ]);
  });
});
