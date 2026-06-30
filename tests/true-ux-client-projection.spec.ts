import { expect, type Page, test } from "@playwright/test";

import { createDemoSession, demoPlatformTenantId } from "../lib/demo-session";
import { demoAuthSessionCookieName } from "../lib/demo/demo-auth-session";
import { exportService } from "../lib/export-service";
import { clientPortalProjectionState } from "../lib/client-portal-projection-state";
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
    assumptionsJson: { source: "true-ux-stage7" },
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

test.describe("UX-CLIENT-PROJECTION stage 7 no-leakage contract", () => {
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
    const blockedState = clientPortalProjectionState("decision", blocked);

    expect(blocked.visible).toBe(false);
    expect(blocked.reasonCode).toBe("DEMO_CLIENT_DECISION_FAIL_CLOSED");
    expect(blocked.payload).toEqual({});
    expect(blocked.hiddenFields).toEqual(expect.arrayContaining(["aiDraft", "internalRationale", "complianceNotes", "evidenceRecordId", "assumptionsJson"]));
    expect(blockedState.state).toBe("empty");
    expect(blockedState.safe).toBe(true);

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
    const releasedState = clientPortalProjectionState("decision", released);

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
    expect(releasedState.state).toBe("released");
    expect(releasedState.allowedPayloadKeys).toEqual(["clientSummary", "decisionState", "id", "releasedAt", "title"]);
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

  test("keeps source-upload metadata as a named client status exception", () => {
    const familyCfo = createDemoSession({ roleKey: "family_cfo", tenantSlug: "bennett" });
    const sourceUpload = visibilityEngine.projectDocumentPayload(
      familyCfo.actor,
      familyCfo.role,
      documentPayload({
        clientTenantId: familyCfo.tenant.id,
        fileName: "family-office-source.pdf",
        fileSizeBytes: 12000,
      }),
      demoPlatformTenantId,
      familyCfo.tenant.id,
    );
    const sourceState = clientPortalProjectionState("document", sourceUpload);

    expect(sourceUpload.visible).toBe(true);
    expect(sourceUpload.reasonCode).toBe("DEMO_CLIENT_SOURCE_DOCUMENT_PROJECTION");
    expect(sourceState.state).toBe("source_upload");
    expect(sourceState.safe).toBe(true);
    expect(sourceUpload.payload).toMatchObject({
      fileName: "family-office-source.pdf",
      fileSizeBytes: 12000,
    });
    expect(sourceUpload.payload).not.toHaveProperty("sensitivity");
    expect(sourceState.forbiddenFieldsPresent).toEqual([]);
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

test.describe("E07 client-safe UI route proof", () => {
  const routes = [
    { family: "client_portal", path: "/client/home", testId: "e07-client-safe-ui-boundary" },
    { family: "client_portal", path: "/documents", testId: "e07-client-safe-ui-boundary" },
    { family: "export_client_package", path: "/export/demo/download", testId: "e07-export-client-package-boundary" },
  ];

  for (const route of routes) {
    test(route.path + " renders client-safe UI boundary without proof scaffolding", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1200 });
      await authenticate(page);
      await page.goto(route.path);

      const boundary = page.getByTestId(route.testId).first();
      await expect(boundary).toBeVisible();
      await expect(boundary).toHaveAttribute("data-e07-client-safe-ui-boundary", "true");
      await expect(boundary).toHaveAttribute("data-e07-client-safe-family", route.family);
      await expect(boundary).toHaveAttribute("data-e07-allowed-visible-classes", /client_safe_summary/);
      await expect(boundary).toHaveAttribute("data-e07-suppressed-classes", /ai_draft/);
      await expect(boundary).toHaveAttribute("data-e07-suppressed-classes", /compliance_note/);
      await expect(page.getByTestId("ux-stage7-client-projection")).toHaveCount(0);
      await expect(page.getByText(/UX-CLIENT-PROJECTION|Forbidden payloads|AI Draft|internal rationale|compliance notes|storage key|checksum/i)).toHaveCount(0);
    });
  }
});

test.describe("V0.96 WP-07 decision record and client-safe projection refactor", () => {
  test("client portal exposes a product-native released update and unavailable fallback", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await authenticate(page);
    await page.goto("/client/home");

    const card = page.getByTestId("workflow07-client-safe-projection-card").first();
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute("data-workflow07-projection-source", "DOMAIN_H_RELEASED_PROJECTION_CONTRACT");
    await expect(card).toHaveAttribute("data-workflow07-projection-state", "released");
    await expect(card).toHaveAttribute("data-workflow07-safe-clean", "true");
    await expect(card.getByRole("heading", { name: "Governance update" })).toBeVisible();
    await expect(card.getByTestId("workflow07-client-safe-summary")).toContainText("Reviewed governance update available for client view.");
    await expect(card.getByTestId("workflow07-client-fail-closed-state")).toContainText("Not ready");
    await expect(card).not.toContainText(/AI Draft|internal rationale|compliance notes|storage key|evidence record id|audit event|client accepted/i);
    await expect(card).not.toContainText(/Client-safe summary|fail-closed fallback|permitted metadata|projection boundary|No released content is available yet/i);
  });

  test("client-safe projection card keeps the same semantic contract in mobile density", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await authenticate(page);
    await page.goto("/mobile");

    const card = page.getByTestId("workflow07-client-safe-projection-card").first();
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute("data-workflow07-mobile-parity", "true");
    await expect(card).toHaveAttribute("data-workflow07-projection-source", "DOMAIN_H_RELEASED_PROJECTION_CONTRACT");
    await expect(card).toHaveAttribute("data-workflow07-safe-clean", "true");
    await expect(card.getByRole("heading", { name: "Governance update" })).toBeVisible();
    await expect(card.getByTestId("workflow07-client-fail-closed-state")).toContainText("Not ready");
  });

  test("internal decision detail does not render the retired traceability explainer card", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await authenticate(page);
    await page.goto("/decisions/demo");

    await expect(page.getByTestId("workflow07-decision-record-traceability")).toHaveCount(0);
    await expect(page.getByTestId("workflow07-decision-client-projection-preview")).toHaveCount(0);
    await expect(page.getByTestId("domain12-decision-room-core")).toBeVisible();
    await expect(page.locator("main")).not.toContainText(/traceability view|projection allowlist|Client view contains decision id/i);
  });
});
