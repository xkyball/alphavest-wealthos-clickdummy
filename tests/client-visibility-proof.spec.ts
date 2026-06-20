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
});
