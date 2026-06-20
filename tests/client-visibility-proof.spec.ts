import { expect, test } from "@playwright/test";

import { createDemoSession, demoPlatformTenantId } from "../lib/demo-session";
import { exportService } from "../lib/export-service";
import { visibilityEngine, type RecommendationVisibilityPayload } from "../lib/visibility-engine";

const forbiddenClientPayloadFields = [
  "clientSummaryDraft",
  "summaryInternal",
  "internalRationale",
  "complianceNotes",
  "assumptionsJson",
] as const;

function recommendationPayload(
  overrides: Partial<RecommendationVisibilityPayload> = {},
): RecommendationVisibilityPayload {
  const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });

  return {
    assumptionsJson: { model: "rules-draft", reviewer: "analyst" },
    clientSummary: "Released client-safe next step.",
    clientSummaryDraft: "AI Draft: rebalance offshore exposure.",
    clientTenantId: principal.tenant.id,
    clientVisible: false,
    complianceNotes: "Compliance-only release notes.",
    internalRationale: "Internal rationale for advisor and compliance review.",
    recommendationStatus: "AI_DRAFT",
    sensitivity: "RESTRICTED",
    summaryInternal: "Analyst-only working summary.",
    visibilityStatus: "ADVISOR_VISIBLE",
    ...overrides,
  };
}

function expectNoForbiddenClientFields(payload: Record<string, unknown>) {
  for (const field of forbiddenClientPayloadFields) {
    expect(payload).not.toHaveProperty(field);
  }
}

test.describe("Minimum path Prompt 05 client visibility proof", () => {
  test("allows scoped internal actors to see internal recommendation states", () => {
    const analyst = createDemoSession({ roleKey: "analyst", tenantSlug: "bennett" });
    const payload = recommendationPayload({ clientTenantId: analyst.tenant.id });

    const projection = visibilityEngine.projectRecommendationPayload(
      analyst.actor,
      analyst.role,
      payload,
      demoPlatformTenantId,
      analyst.tenant.id,
    );

    expect(projection.visible).toBe(true);
    expect(projection.reasonCode).toBe("DEMO_INTERNAL_PROJECTION");
    expect(projection.payload.clientSummaryDraft).toBe(payload.clientSummaryDraft);
    expect(projection.payload.summaryInternal).toBe(payload.summaryInternal);
    expect(projection.payload.internalRationale).toBe(payload.internalRationale);
    expect(projection.payload.complianceNotes).toBe(payload.complianceNotes);
  });

  test("keeps draft, AI Draft and internal rationale hidden from client roles before release", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const payload = recommendationPayload({ clientTenantId: principal.tenant.id });

    const projection = visibilityEngine.projectRecommendationPayload(
      principal.actor,
      principal.role,
      payload,
      demoPlatformTenantId,
      principal.tenant.id,
    );

    expect(projection.visible).toBe(false);
    expect(projection.reasonCode).toBe("DEMO_CLIENT_VISIBILITY_FAIL_CLOSED");
    expect(projection.payload).toEqual({});
    expect(projection.hiddenFields).toEqual(["clientSummary", ...forbiddenClientPayloadFields]);
  });

  test("projects only safe redacted output after compliance release", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const payload = recommendationPayload({
      clientTenantId: principal.tenant.id,
      clientVisible: true,
      recommendationStatus: "RELEASED_TO_CLIENT",
      visibilityStatus: "CLIENT_VISIBLE",
    });

    const projection = visibilityEngine.projectRecommendationPayload(
      principal.actor,
      principal.role,
      payload,
      demoPlatformTenantId,
      principal.tenant.id,
    );

    expect(projection.visible).toBe(true);
    expect(projection.reasonCode).toBe("DEMO_CLIENT_SAFE_PROJECTION");
    expect(projection.payload).toEqual({ clientSummary: payload.clientSummary });
    expectNoForbiddenClientFields(projection.payload);
    expect(projection.hiddenFields).toEqual([...forbiddenClientPayloadFields]);
  });

  test("projects document payloads as redacted/fail-closed for client roles", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const internalDocument = {
      checksum: "internal-checksum",
      clientTenantId: principal.tenant.id,
      clientVisible: false,
      documentType: "financial_statement",
      evidenceRecordId: "ed6ecbad-2016-5cfd-9c91-c47189afaa0d",
      evidenceStatus: "CREATED",
      evidenceVisibilityStatus: "INTERNAL_ONLY" as const,
      extractionStatus: "pending",
      fileName: "bennett-internal-statement.pdf",
      fileSizeBytes: 128000,
      id: "abf468d0-7939-5576-a9e2-7e402d5ae531",
      mimeType: "application/pdf",
      sensitivity: "CONFIDENTIAL" as const,
      status: "UPLOADED",
      storageKey: "demo/bennett/documents/bennett-internal-statement.pdf",
      title: "Bennett internal statement",
      uploadedAt: "2026-06-20T00:00:00.000Z",
    };

    const blockedProjection = visibilityEngine.projectDocumentPayload(
      principal.actor,
      principal.role,
      internalDocument,
      demoPlatformTenantId,
      principal.tenant.id,
    );

    expect(blockedProjection.visible).toBe(false);
    expect(blockedProjection.visibilityState).toBe("NO_AVAILABLE_CONTENT");
    expect(blockedProjection.reasonCode).toBe("DEMO_CLIENT_DOCUMENT_FAIL_CLOSED");
    expect(blockedProjection.payload).toEqual({});
    expect(blockedProjection.hiddenFields).toContain("storageKey");
    expect(blockedProjection.hiddenFields).toContain("checksum");

    const releasedProjection = visibilityEngine.projectDocumentPayload(
      principal.actor,
      principal.role,
      {
        ...internalDocument,
        clientVisible: true,
        evidenceStatus: "RELEASED",
        evidenceVisibilityStatus: "CLIENT_VISIBLE",
      },
      demoPlatformTenantId,
      principal.tenant.id,
    );

    expect(releasedProjection.visible).toBe(true);
    expect(releasedProjection.reasonCode).toBe("DEMO_CLIENT_DOCUMENT_SAFE_PROJECTION");
    expect(releasedProjection.payload).toEqual({
      documentType: "financial_statement",
      id: internalDocument.id,
      status: "UPLOADED",
      title: "Bennett internal statement",
      uploadedAt: "2026-06-20T00:00:00.000Z",
    });
    expect(releasedProjection.payload).not.toHaveProperty("storageKey");
    expect(releasedProjection.payload).not.toHaveProperty("checksum");
  });

  test("keeps evidence-backed internal rebuild hidden until release", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const payload = recommendationPayload({
      assumptionsJson: {
        aiDraftInternalOnly: true,
        evidenceBackedRebuild: true,
        phase4RebuildEvidenceIds: ["cd681455-89ef-5ebb-96c7-8464f0dcb721"],
      },
      clientSummaryDraft: "Internal draft rebuilt with accepted evidence. Compliance release remains required.",
      clientTenantId: principal.tenant.id,
      clientVisible: false,
      recommendationStatus: "ANALYST_REVIEWED",
      summaryInternal: "Evidence-backed internal draft rebuilt by analyst.",
      visibilityStatus: "COMPLIANCE_VISIBLE",
    });

    const projection = visibilityEngine.projectRecommendationPayload(
      principal.actor,
      principal.role,
      payload,
      demoPlatformTenantId,
      principal.tenant.id,
    );

    expect(projection.visible).toBe(false);
    expect(projection.reasonCode).toBe("DEMO_CLIENT_VISIBILITY_FAIL_CLOSED");
    expect(projection.payload).toEqual({});
    expect(projection.hiddenFields).toEqual(["clientSummary", ...forbiddenClientPayloadFields]);

    const forbiddenExportPayloads = exportService.forbiddenExportPayloads([
      "CLIENT_SAFE_SUMMARY",
      "INTERNAL_RATIONALE",
      "UNRELEASED_RECOMMENDATION",
      "HIDDEN_FIELD",
    ]);

    expect(forbiddenExportPayloads).toEqual([
      "INTERNAL_RATIONALE",
      "UNRELEASED_RECOMMENDATION",
      "HIDDEN_FIELD",
    ]);

    const blockedExportProjection = exportService.canUseClientProjectionForExport(projection);

    expect(blockedExportProjection.allowed).toBe(false);
    expect(blockedExportProjection.missing).toContain("client_safe_projection_visible");
    expect(blockedExportProjection.payloadClassifications).toContain("UNRELEASED_RECOMMENDATION");
  });

  test("fails closed for cross-tenant client access", () => {
    const bennettPrincipal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const morganPrincipal = createDemoSession({ roleKey: "principal", tenantSlug: "morgan" });
    const payload = recommendationPayload({
      clientTenantId: morganPrincipal.tenant.id,
      clientVisible: true,
      recommendationStatus: "RELEASED_TO_CLIENT",
      visibilityStatus: "CLIENT_VISIBLE",
    });

    const projection = visibilityEngine.projectRecommendationPayload(
      bennettPrincipal.actor,
      bennettPrincipal.role,
      payload,
      demoPlatformTenantId,
      bennettPrincipal.tenant.id,
    );

    expect(projection.visible).toBe(false);
    expect(projection.reasonCode).toBe("DEMO_DENY_CROSS_TENANT");
    expect(projection.payload).toEqual({});
    expect(projection.hiddenFields).toEqual(["clientSummary", ...forbiddenClientPayloadFields]);
  });

  test("fails closed for wrong internal roles and forbidden export payloads", () => {
    const admin = createDemoSession({ roleKey: "admin", tenantSlug: "bennett" });
    const clientSuccess = createDemoSession({ roleKey: "client_success", tenantSlug: "bennett" });
    const payload = recommendationPayload({ clientTenantId: admin.tenant.id });

    for (const session of [admin, clientSuccess]) {
      const projection = visibilityEngine.projectRecommendationPayload(
        session.actor,
        session.role,
        payload,
        demoPlatformTenantId,
        session.tenant.id,
      );

      expect(projection.visible).toBe(false);
      expect(projection.payload).toEqual({});
      expect(projection.hiddenFields).toEqual(["clientSummary", ...forbiddenClientPayloadFields]);
    }

    const forbiddenExportPayloads = exportService.forbiddenExportPayloads([
      "CLIENT_SAFE_SUMMARY",
      "AI_DRAFT",
      "INTERNAL_RATIONALE",
      "COMPLIANCE_NOTES",
      "UNRELEASED_EVIDENCE",
    ]);

    expect(forbiddenExportPayloads).toEqual([
      "AI_DRAFT",
      "INTERNAL_RATIONALE",
      "COMPLIANCE_NOTES",
      "UNRELEASED_EVIDENCE",
    ]);
  });

  test("allows export input only from visible client-safe projection payloads", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const payload = recommendationPayload({
      clientTenantId: principal.tenant.id,
      clientVisible: true,
      recommendationStatus: "RELEASED_TO_CLIENT",
      visibilityStatus: "CLIENT_VISIBLE",
    });
    const projection = visibilityEngine.projectRecommendationPayload(
      principal.actor,
      principal.role,
      payload,
      demoPlatformTenantId,
      principal.tenant.id,
    );

    const exportProjection = exportService.canUseClientProjectionForExport(projection);

    expect(exportProjection.allowed).toBe(true);
    expect(exportProjection.missing).toEqual([]);
    expect(exportProjection.payloadClassifications).toEqual(["CLIENT_SAFE_SUMMARY"]);

    const unsafeProjection = exportService.canUseClientProjectionForExport({
      visible: true,
      payload: {
        clientSummary: "Released summary.",
        complianceNotes: "Internal compliance note.",
      },
    });

    expect(unsafeProjection.allowed).toBe(false);
    expect(unsafeProjection.missing).toContain("forbidden_projection_field:complianceNotes");
    expect(unsafeProjection.payloadClassifications).toContain("HIDDEN_FIELD");
  });
});
