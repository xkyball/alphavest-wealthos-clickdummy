import { expect, test } from "@playwright/test";

import { forbiddenClientVisibilityStage6PayloadFieldsPresent } from "../lib/client-visibility-payload-contract";
import { createActorSession, actorPlatformTenantId } from "../lib/actor-session";
import { exportService } from "../lib/export-service";
import {
  visibilityEngine,
  type DecisionVisibilityPayload,
  type RecommendationVisibilityPayload,
} from "../lib/visibility-engine";

function recommendationPayload(
  overrides: Partial<RecommendationVisibilityPayload> = {},
): RecommendationVisibilityPayload {
  const principal = createActorSession({ roleKey: "principal", tenantSlug: "bennett" });

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

function decisionPayload(overrides: Partial<DecisionVisibilityPayload> = {}): DecisionVisibilityPayload {
  const principal = createActorSession({ roleKey: "principal", tenantSlug: "bennett" });

  return {
    aiDraft: "AI Draft: client-facing decision language still requires human release.",
    assumptionsJson: { source: "decision-workbench", visibility: "internal" },
    clientSummary: "Proceed with the reviewed governance update.",
    clientTenantId: principal.tenant.id,
    clientVisible: false,
    complianceNotes: "Compliance-only decision notes.",
    decisionState: "SUBMITTED",
    evidenceRecordId: "ed6ecbad-2016-5cfd-9c91-c47189afaa0d",
    id: "decision:bennett:governance-update",
    internalRationale: "Internal decision rationale.",
    releasedAt: null,
    sensitivity: "RESTRICTED",
    submittedAt: "2026-06-21T08:30:00.000Z",
    title: "Governance update decision",
    visibilityStatus: "COMPLIANCE_VISIBLE",
    ...overrides,
  };
}

function expectNoForbiddenClientFields(payload: Record<string, unknown>) {
  for (const field of forbiddenClientVisibilityStage6PayloadFieldsPresent(payload)) {
    expect(payload).not.toHaveProperty(field);
  }
}

function expectHiddenFieldsForPayload(hiddenFields: string[], payload: Record<string, unknown>, extraFields: string[] = []) {
  expect(hiddenFields).toEqual(expect.arrayContaining([...extraFields, ...forbiddenClientVisibilityStage6PayloadFieldsPresent(payload)]));
}

test.describe("Minimum path Prompt 05 client visibility proof", () => {
  test("allows scoped internal actors to see internal recommendation states", () => {
    const analyst = createActorSession({ roleKey: "analyst", tenantSlug: "bennett" });
    const payload = recommendationPayload({ clientTenantId: analyst.tenant.id });

    const projection = visibilityEngine.projectRecommendationPayload(
      analyst.actor,
      analyst.role,
      payload,
      actorPlatformTenantId,
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
    const principal = createActorSession({ roleKey: "principal", tenantSlug: "bennett" });
    const payload = recommendationPayload({ clientTenantId: principal.tenant.id });

    const projection = visibilityEngine.projectRecommendationPayload(
      principal.actor,
      principal.role,
      payload,
      actorPlatformTenantId,
      principal.tenant.id,
    );

    expect(projection.visible).toBe(false);
    expect(projection.reasonCode).toBe("DEMO_CLIENT_VISIBILITY_FAIL_CLOSED");
    expect(projection.payload).toEqual({});
    expectHiddenFieldsForPayload(projection.hiddenFields, payload, ["clientSummary"]);
  });

  test("projects only safe redacted output after compliance release", () => {
    const principal = createActorSession({ roleKey: "principal", tenantSlug: "bennett" });
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
      actorPlatformTenantId,
      principal.tenant.id,
    );

    expect(projection.visible).toBe(true);
    expect(projection.reasonCode).toBe("DEMO_CLIENT_SAFE_PROJECTION");
    expect(projection.payload).toEqual({ clientSummary: payload.clientSummary });
    expectNoForbiddenClientFields(projection.payload);
    expectHiddenFieldsForPayload(projection.hiddenFields, payload);

    const safety = visibilityEngine.assertClientProjectionClean(projection);
    expect(safety.clean).toBe(true);
    expect(safety.forbiddenFieldsPresent).toEqual([]);
  });

  test("keeps submitted decisions internal and releases only client-safe decision summaries", () => {
    const principal = createActorSession({ roleKey: "principal", tenantSlug: "bennett" });
    const analyst = createActorSession({ roleKey: "analyst", tenantSlug: "bennett" });
    const submitted = decisionPayload({ clientTenantId: principal.tenant.id });

    const submittedClientProjection = visibilityEngine.projectDecisionPayload(
      principal.actor,
      principal.role,
      submitted,
      actorPlatformTenantId,
      principal.tenant.id,
    );

    expect(submittedClientProjection.visible).toBe(false);
    expect(submittedClientProjection.reasonCode).toBe("DEMO_CLIENT_DECISION_FAIL_CLOSED");
    expect(submittedClientProjection.payload).toEqual({});
    expect(submittedClientProjection.hiddenFields).toEqual([
      "clientSummary",
      "aiDraft",
      "internalRationale",
      "complianceNotes",
      "evidenceRecordId",
      "assumptionsJson",
    ]);

    const internalProjection = visibilityEngine.projectDecisionPayload(
      analyst.actor,
      analyst.role,
      submitted,
      actorPlatformTenantId,
      analyst.tenant.id,
    );

    expect(internalProjection.visible).toBe(true);
    expect(internalProjection.reasonCode).toBe("DEMO_INTERNAL_DECISION_PROJECTION");
    expect(internalProjection.payload.aiDraft).toBe(submitted.aiDraft);
    expect(internalProjection.payload.internalRationale).toBe(submitted.internalRationale);

    const releasedClientProjection = visibilityEngine.projectDecisionPayload(
      principal.actor,
      principal.role,
      decisionPayload({
        clientTenantId: principal.tenant.id,
        clientVisible: true,
        decisionState: "RELEASED",
        releasedAt: "2026-06-21T09:15:00.000Z",
        visibilityStatus: "CLIENT_VISIBLE",
      }),
      actorPlatformTenantId,
      principal.tenant.id,
    );

    expect(releasedClientProjection.visible).toBe(true);
    expect(releasedClientProjection.reasonCode).toBe("DEMO_CLIENT_DECISION_SAFE_PROJECTION");
    expect(releasedClientProjection.payload).toEqual({
      clientSummary: "Proceed with the reviewed governance update.",
      decisionState: "RELEASED",
      id: "decision:bennett:governance-update",
      releasedAt: "2026-06-21T09:15:00.000Z",
      title: "Governance update decision",
    });

    const safety = visibilityEngine.assertClientProjectionClean(releasedClientProjection);
    expect(safety.clean).toBe(true);
    expect(safety.hiddenFields).toEqual([
      "aiDraft",
      "internalRationale",
      "complianceNotes",
      "evidenceRecordId",
      "assumptionsJson",
    ]);
  });

  test("projects document payloads as redacted/fail-closed for client roles", () => {
    const principal = createActorSession({ roleKey: "principal", tenantSlug: "bennett" });
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
      actorPlatformTenantId,
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
      actorPlatformTenantId,
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
    const principal = createActorSession({ roleKey: "principal", tenantSlug: "bennett" });
    const payload = recommendationPayload({
      assumptionsJson: {
        aiDraftInternalOnly: true,
        evidenceBackedRebuild: true,
        stage4RebuildEvidenceIds: ["cd681455-89ef-5ebb-96c7-8464f0dcb721"],
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
      actorPlatformTenantId,
      principal.tenant.id,
    );

    expect(projection.visible).toBe(false);
    expect(projection.reasonCode).toBe("DEMO_CLIENT_VISIBILITY_FAIL_CLOSED");
    expect(projection.payload).toEqual({});
    expectHiddenFieldsForPayload(projection.hiddenFields, payload, ["clientSummary"]);

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
    const bennettPrincipal = createActorSession({ roleKey: "principal", tenantSlug: "bennett" });
    const morganPrincipal = createActorSession({ roleKey: "principal", tenantSlug: "morgan" });
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
      actorPlatformTenantId,
      bennettPrincipal.tenant.id,
    );

    expect(projection.visible).toBe(false);
    expect(projection.reasonCode).toBe("DEMO_DENY_CROSS_TENANT");
    expect(projection.payload).toEqual({});
    expectHiddenFieldsForPayload(projection.hiddenFields, payload, ["clientSummary"]);
  });

  test("fails closed for wrong internal roles and forbidden export payloads", () => {
    const admin = createActorSession({ roleKey: "admin", tenantSlug: "bennett" });
    const clientSuccess = createActorSession({ roleKey: "client_success", tenantSlug: "bennett" });
    const payload = recommendationPayload({ clientTenantId: admin.tenant.id });

    for (const session of [admin, clientSuccess]) {
      const projection = visibilityEngine.projectRecommendationPayload(
        session.actor,
        session.role,
        payload,
        actorPlatformTenantId,
        session.tenant.id,
      );

      expect(projection.visible).toBe(false);
      expect(projection.payload).toEqual({});
      expectHiddenFieldsForPayload(projection.hiddenFields, payload, ["clientSummary"]);
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
    const principal = createActorSession({ roleKey: "principal", tenantSlug: "bennett" });
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
      actorPlatformTenantId,
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
    expect(unsafeProjection.payloadClassifications).toContain("COMPLIANCE_NOTES");
  });
});
