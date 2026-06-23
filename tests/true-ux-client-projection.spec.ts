import { expect, type Page, test } from "@playwright/test";

import { createDemoSession, demoPlatformTenantId } from "../lib/demo-session";
import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";
import { exportService } from "../lib/export-service";
import {
  trueUxClientProjectionNoLeakageContract,
  visibilityEngine,
  type DecisionVisibilityPayload,
  type DocumentVisibilityPayload,
  type RecommendationVisibilityPayload,
} from "../lib/visibility-engine";

async function authenticate(page: Page) {
  await page.context().addCookies([
    {
      domain: "127.0.0.1",
      httpOnly: true,
      name: demoAuthSessionCookieName,
      path: "/",
      sameSite: "Lax",
      value: "av-session-playwright-authenticated",
    },
  ]);
}

function recommendationPayload(overrides: Partial<RecommendationVisibilityPayload> = {}): RecommendationVisibilityPayload {
  const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });

  return {
    assumptionsJson: { source: "true-ux-phase7" },
    clientSummary: "Released client-safe recommendation summary.",
    clientSummaryDraft: "AI Draft: not released.",
    clientTenantId: principal.tenant.id,
    clientVisible: false,
    complianceNotes: "Compliance-only notes.",
    internalRationale: "Internal rationale.",
    recommendationStatus: "AI_DRAFT",
    sensitivity: "RESTRICTED",
    summaryInternal: "Internal analyst summary.",
    visibilityStatus: "ADVISOR_VISIBLE",
    ...overrides,
  };
}

function decisionPayload(overrides: Partial<DecisionVisibilityPayload> = {}): DecisionVisibilityPayload {
  const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });

  return {
    aiDraft: "AI Draft: decision language.",
    assumptionsJson: { model: "internal" },
    clientSummary: "Released decision summary.",
    clientTenantId: principal.tenant.id,
    clientVisible: false,
    complianceNotes: "Compliance note.",
    decisionState: "SUBMITTED",
    evidenceRecordId: "ed6ecbad-2016-5cfd-9c91-c47189afaa0d",
    id: "decision:bennett:true-ux-client-projection",
    internalRationale: "Internal rationale.",
    releasedAt: null,
    sensitivity: "RESTRICTED",
    submittedAt: "2026-06-22T08:00:00.000Z",
    title: "True UX client decision",
    visibilityStatus: "COMPLIANCE_VISIBLE",
    ...overrides,
  };
}

function documentPayload(overrides: Partial<DocumentVisibilityPayload> = {}): DocumentVisibilityPayload {
  const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });

  return {
    checksum: "internal-checksum",
    clientTenantId: principal.tenant.id,
    clientVisible: false,
    documentType: "financial_statement",
    evidenceRecordId: "ed6ecbad-2016-5cfd-9c91-c47189afaa0d",
    evidenceStatus: "CREATED",
    evidenceVisibilityStatus: "INTERNAL_ONLY",
    extractionStatus: "pending",
    fileName: "internal-source.pdf",
    fileSizeBytes: 12000,
    id: "abf468d0-7939-5576-a9e2-7e402d5ae531",
    mimeType: "application/pdf",
    sensitivity: "CONFIDENTIAL",
    status: "UPLOADED",
    storageKey: "internal/storage-key",
    title: "Client evidence request",
    uploadedAt: "2026-06-22T08:10:00.000Z",
    ...overrides,
  };
}

function expectNoForbiddenFields(payload: Record<string, unknown>) {
  for (const field of trueUxClientProjectionNoLeakageContract.forbiddenPayloadFields) {
    expect(payload).not.toHaveProperty(field);
  }
}

test.describe("UX-CLIENT-PROJECTION phase 7 no-leakage contract", () => {
  test("materializes the task and payload-field contract", () => {
    expect(trueUxClientProjectionNoLeakageContract.taskIds).toEqual([
      "UX-CLIENT-PROJECTION-001",
      "UX-CLIENT-PROJECTION-002",
      "UX-CLIENT-PROJECTION-003",
      "UX-CLIENT-PROJECTION-004",
    ]);
    expect(trueUxClientProjectionNoLeakageContract.forbiddenPayloadFields).toEqual(expect.arrayContaining([
      "aiDraft",
      "assumptionsJson",
      "clientSummaryDraft",
      "complianceNotes",
      "evidenceRecordId",
      "evidenceStatus",
      "internalRationale",
      "storageKey",
    ]));
  });

  test("fails closed for unreleased recommendation projection and exposes only released client summary", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const blocked = visibilityEngine.projectRecommendationPayload(principal.actor, principal.role, recommendationPayload({ clientTenantId: principal.tenant.id }), demoPlatformTenantId, principal.tenant.id);

    expect(blocked.visible).toBe(false);
    expect(blocked.reasonCode).toBe("DEMO_CLIENT_VISIBILITY_FAIL_CLOSED");
    expect(blocked.payload).toEqual({});
    expect(blocked.hiddenFields).toEqual(expect.arrayContaining(["clientSummary", "clientSummaryDraft", "internalRationale", "complianceNotes", "assumptionsJson"]));

    const released = visibilityEngine.projectRecommendationPayload(
      principal.actor,
      principal.role,
      recommendationPayload({
        clientTenantId: principal.tenant.id,
        clientVisible: true,
        recommendationStatus: "RELEASED_TO_CLIENT",
        visibilityStatus: "CLIENT_VISIBLE",
      }),
      demoPlatformTenantId,
      principal.tenant.id,
    );

    expect(released.visible).toBe(true);
    expect(released.payload).toEqual({ clientSummary: "Released client-safe recommendation summary." });
    expectNoForbiddenFields(released.payload);
    expect(visibilityEngine.assertClientProjectionClean(released).clean).toBe(true);
  });

  test("fails closed for unreleased decisions and exposes only released client decision fields", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const blocked = visibilityEngine.projectDecisionPayload(principal.actor, principal.role, decisionPayload({ clientTenantId: principal.tenant.id }), demoPlatformTenantId, principal.tenant.id);

    expect(blocked.visible).toBe(false);
    expect(blocked.reasonCode).toBe("DEMO_CLIENT_DECISION_FAIL_CLOSED");
    expect(blocked.payload).toEqual({});
    expect(blocked.hiddenFields).toEqual(expect.arrayContaining(["aiDraft", "internalRationale", "complianceNotes", "evidenceRecordId", "assumptionsJson"]));

    const released = visibilityEngine.projectDecisionPayload(
      principal.actor,
      principal.role,
      decisionPayload({
        clientTenantId: principal.tenant.id,
        clientVisible: true,
        decisionState: "RELEASED",
        releasedAt: "2026-06-22T09:00:00.000Z",
        visibilityStatus: "CLIENT_VISIBLE",
      }),
      demoPlatformTenantId,
      principal.tenant.id,
    );

    expect(released.visible).toBe(true);
    expect(released.payload).toEqual({
      clientSummary: "Released decision summary.",
      decisionState: "RELEASED",
      id: "decision:bennett:true-ux-client-projection",
      releasedAt: "2026-06-22T09:00:00.000Z",
      title: "True UX client decision",
    });
    expectNoForbiddenFields(released.payload);
    expect(visibilityEngine.assertClientProjectionClean(released).clean).toBe(true);
  });

  test("fails closed for unreleased evidence and allows only redacted released document summaries", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const blocked = visibilityEngine.projectDocumentPayload(principal.actor, principal.role, documentPayload({ clientTenantId: principal.tenant.id }), demoPlatformTenantId, principal.tenant.id);

    expect(blocked.visible).toBe(false);
    expect(blocked.reasonCode).toBe("DEMO_CLIENT_DOCUMENT_FAIL_CLOSED");
    expect(blocked.payload).toEqual({});
    expect(blocked.hiddenFields).toEqual(expect.arrayContaining(["storageKey", "checksum", "evidenceStatus", "extractionStatus"]));

    const released = visibilityEngine.projectDocumentPayload(
      principal.actor,
      principal.role,
      documentPayload({
        clientTenantId: principal.tenant.id,
        clientVisible: true,
        evidenceStatus: "RELEASED",
        evidenceVisibilityStatus: "CLIENT_VISIBLE",
      }),
      demoPlatformTenantId,
      principal.tenant.id,
    );

    expect(released.visible).toBe(true);
    expect(released.payload).toEqual({
      documentType: "financial_statement",
      id: "abf468d0-7939-5576-a9e2-7e402d5ae531",
      status: "UPLOADED",
      title: "Client evidence request",
      uploadedAt: "2026-06-22T08:10:00.000Z",
    });
    expectNoForbiddenFields(released.payload);
    expect(visibilityEngine.assertClientProjectionClean(released).clean).toBe(true);
  });

  test("allows export download only from clean client-safe projections", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const cleanProjection = visibilityEngine.projectRecommendationPayload(
      principal.actor,
      principal.role,
      recommendationPayload({
        clientTenantId: principal.tenant.id,
        clientVisible: true,
        recommendationStatus: "RELEASED_TO_CLIENT",
        visibilityStatus: "CLIENT_VISIBLE",
      }),
      demoPlatformTenantId,
      principal.tenant.id,
    );

    expect(exportService.canUseClientProjectionForExport(cleanProjection).allowed).toBe(true);
    expect(exportService.canUseClientProjectionForExport({
      visible: true,
      payload: { clientSummary: "Released", complianceNotes: "Internal note" },
    }).allowed).toBe(false);
    expect(exportService.canUseClientProjectionForExport({ visible: false, payload: {} }).allowed).toBe(false);
  });
});

test.describe("UX-CLIENT-PROJECTION phase 7 route proof", () => {
  const routes = [
    { path: "/client/home", taskId: "UX-CLIENT-PROJECTION-001" },
    { path: "/decisions/demo", taskId: "UX-CLIENT-PROJECTION-002" },
    { path: "/documents", taskId: "UX-CLIENT-PROJECTION-003" },
    { path: "/export/demo/download", taskId: "UX-CLIENT-PROJECTION-004" },
  ];

  for (const route of routes) {
    test(route.taskId + " " + route.path + " renders fail-closed client projection proof", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1200 });
      await authenticate(page);
      await page.goto(route.path);

      const panel = page.locator('[data-testid="ux-phase7-client-projection"][data-ux-phase7-task="' + route.taskId + '"]').first();
      await expect(panel).toBeVisible();
      await expect(panel.getByTestId("ux-phase7-visibility-engine")).toContainText(/DEMO_CLIENT|client projection|export package/i);
      await expect(panel.getByTestId("ux-phase7-safe-fields")).toContainText(/client|redacted|released|summary|status/i);
      await expect(panel.getByTestId("ux-phase7-forbidden-fields")).toContainText(/No internal payload|AI Draft|unreleased evidence/i);
      await expect(panel.getByTestId("ux-phase7-fail-closed")).toContainText(/blocked|Unavailable|Download stays blocked|hide/i);
      await expect(panel.getByTestId("ux-phase7-recovery")).toBeVisible();
    });
  }
});
