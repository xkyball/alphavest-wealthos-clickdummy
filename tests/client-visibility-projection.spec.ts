import { expect, test } from "@playwright/test";

import {
  projectClientVisibleDecision,
  projectClientVisibleDocument,
  projectClientVisibleRecommendation,
} from "../lib/control-layer/client-visibility";
import { controlLayerActors } from "./fixtures/control-layer-fixtures";

test.describe("WCL WS-06 client visibility projection", () => {
  test("projects released client-safe recommendation payloads", () => {
    const result = projectClientVisibleRecommendation(controlLayerActors.bennettPrincipal, {
      assumptionsJson: { model: "internal-only" },
      clientSummary: "Released client-safe recommendation.",
      clientSummaryDraft: "AI draft must stay hidden.",
      clientTenantId: controlLayerActors.bennettPrincipal.clientTenantId,
      clientVisible: true,
      complianceNotes: "Compliance notes stay hidden.",
      internalRationale: "Internal rationale stays hidden.",
      recommendationStatus: "RELEASED_TO_CLIENT",
      visibilityStatus: "CLIENT_VISIBLE",
    });

    expect(result.allowed).toBe(true);
    if (result.allowed) {
      expect(result.projection.payload).toEqual({
        clientSummary: "Released client-safe recommendation.",
      });
      expect(result.projection.hiddenFields).toEqual([
        "clientSummaryDraft",
        "internalRationale",
        "complianceNotes",
        "assumptionsJson",
      ]);
    }
  });

  test("fails closed for submitted but unreleased decision payloads", () => {
    const result = projectClientVisibleDecision(controlLayerActors.bennettPrincipal, {
      aiDraft: "Internal AI draft.",
      clientSummary: "Not yet released.",
      clientTenantId: controlLayerActors.bennettPrincipal.clientTenantId,
      clientVisible: false,
      complianceNotes: "Compliance notes.",
      decisionState: "SUBMITTED",
      id: "decision:bennett:wcl-client-projection",
      internalRationale: "Internal rationale.",
      title: "Liquidity decision",
      visibilityStatus: "COMPLIANCE_VISIBLE",
    });

    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.reasonCode).toBe("WCL_CLIENT_VISIBILITY_HIDDEN");
      expect(result.hiddenFields).toContain("aiDraft");
      expect(result.hiddenFields).toContain("internalRationale");
      expect(result.hiddenFields).toContain("complianceNotes");
    }
  });

  test("projects document evidence metadata as hidden or client safe without operational internals", () => {
    const blocked = projectClientVisibleDocument(controlLayerActors.bennettPrincipal, {
      checksum: "internal-checksum",
      clientTenantId: controlLayerActors.bennettPrincipal.clientTenantId,
      clientVisible: false,
      documentType: "financial_statement",
      evidenceRecordId: "evidence:bennett:wcl-document",
      evidenceStatus: "CREATED",
      evidenceVisibilityStatus: "INTERNAL_ONLY",
      extractionStatus: "pending",
      fileName: "source.pdf",
      fileSizeBytes: 42000,
      id: "document:bennett:wcl-blocked",
      mimeType: "application/pdf",
      status: "UPLOADED",
      storageKey: "demo/bennett/documents/source.pdf",
      title: "Source statement",
      uploadedAt: "2026-06-23T10:00:00.000Z",
    });

    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.reasonCode).toBe("WCL_CLIENT_VISIBILITY_HIDDEN");
      expect(blocked.hiddenFields).toEqual(expect.arrayContaining([
        "checksum",
        "evidenceRecordId",
        "evidenceStatus",
        "evidenceVisibilityStatus",
        "extractionStatus",
        "fileName",
        "mimeType",
        "storageKey",
      ]));
    }

    const released = projectClientVisibleDocument(controlLayerActors.bennettPrincipal, {
      checksum: "released-internal-checksum",
      clientTenantId: controlLayerActors.bennettPrincipal.clientTenantId,
      clientVisible: true,
      documentType: "financial_statement",
      evidenceRecordId: "evidence:bennett:wcl-released",
      evidenceStatus: "RELEASED",
      evidenceVisibilityStatus: "REDACTED",
      extractionStatus: "complete",
      fileName: "released-source.pdf",
      fileSizeBytes: 42000,
      id: "document:bennett:wcl-released",
      mimeType: "application/pdf",
      status: "VERIFIED",
      storageKey: "demo/bennett/documents/released-source.pdf",
      title: "Released source statement",
      uploadedAt: "2026-06-23T10:30:00.000Z",
    });

    expect(released.allowed).toBe(true);
    if (released.allowed) {
      expect(released.projection.payload).toEqual({
        documentType: "financial_statement",
        id: "document:bennett:wcl-released",
        status: "VERIFIED",
        title: "Released source statement",
        uploadedAt: "2026-06-23T10:30:00.000Z",
      });
      expect(released.projection.payload).not.toHaveProperty("storageKey");
      expect(released.projection.payload).not.toHaveProperty("checksum");
      expect(released.projection.payload).not.toHaveProperty("evidenceStatus");
    }
  });
});
