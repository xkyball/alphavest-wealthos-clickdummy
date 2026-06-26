import { expect, test } from "@playwright/test";

import { createDemoSession, demoPlatformTenantId } from "../lib/demo-session";
import { permissionEngine } from "../lib/permission-engine";
import { inspectPp001ClientPayload } from "../lib/pp001-payload-visibility-contract";
import { screenRoutes } from "../lib/route-registry";
import { visibilityEngine, type RecommendationVisibilityPayload } from "../lib/visibility-engine";

function advisorVisibleRecommendation(clientTenantId: string): RecommendationVisibilityPayload {
  return {
    assumptionsJson: { model: "internal" },
    clientSummary: "Draft client summary, not released.",
    clientSummaryDraft: "AI draft for advisor review.",
    clientTenantId,
    clientVisible: false,
    complianceNotes: "Compliance-only note.",
    internalRationale: "Internal rationale.",
    objectId: "recommendation:bennett:advisor-approval",
    recommendationStatus: "AI_DRAFT",
    sensitivity: "RESTRICTED",
    summaryInternal: "Analyst-only summary.",
    visibilityStatus: "ADVISOR_VISIBLE",
  };
}

test.describe("PP-001 payload negative proof", () => {
  test("route shell and denied action do not produce client payload output", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const advisorApprovalRoute = screenRoutes.find((route) => route.pageId === "037");
    if (!advisorApprovalRoute) throw new Error("Advisor approval detail route missing.");

    const boundary = permissionEngine.evaluateRouteBoundary(
      principal.actor,
      principal.role,
      advisorApprovalRoute,
      {
        clientTenantId: principal.tenant.id,
        objectId: "recommendation:bennett:advisor-approval",
        objectScope: {
          clientTenantId: principal.tenant.id,
          objectIds: ["recommendation:bennett:advisor-approval"],
          objectType: "RECOMMENDATION",
        },
        objectScopeIds: ["recommendation:bennett:advisor-approval"],
        platformTenantId: demoPlatformTenantId,
      },
    );

    const projection = visibilityEngine.projectRecommendationPayload(
      principal.actor,
      principal.role,
      advisorVisibleRecommendation(principal.tenant.id),
      demoPlatformTenantId,
      principal.tenant.id,
    );
    const clientPayloadInspection = inspectPp001ClientPayload(projection.payload);

    expect(boundary.routeShellAccessible).toBe(true);
    expect(boundary.actionDecision.allowed).toBe(false);
    expect(boundary.actionDecision.reasonCode).toBe("DEMO_DENY_ADVISOR_APPROVAL_REQUIRED");
    expect(projection.visible).toBe(false);
    expect(projection.reasonCode).toBe("DEMO_CLIENT_VISIBILITY_FAIL_CLOSED");
    expect(projection.payload).toEqual({});
    expect(clientPayloadInspection.clean).toBe(true);
    expect(projection.hiddenFields).toEqual(
      expect.arrayContaining(["clientSummary", "clientSummaryDraft", "internalRationale", "complianceNotes"]),
    );
  });

  test("admin role cannot expand internal advice payload visibility", () => {
    const admin = createDemoSession({ roleKey: "admin", tenantSlug: "bennett" });
    const projection = visibilityEngine.projectRecommendationPayload(
      admin.actor,
      admin.role,
      advisorVisibleRecommendation(admin.tenant.id),
      demoPlatformTenantId,
      admin.tenant.id,
    );

    expect(projection.visible).toBe(false);
    expect(projection.reasonCode).toBe("DEMO_DENY_ADMIN_ADVICE_PAYLOAD_NON_BYPASS");
    expect(projection.payload).toEqual({});
    expect(inspectPp001ClientPayload(projection.payload).clean).toBe(true);
    expect(projection.hiddenFields).toEqual(
      expect.arrayContaining([
        "clientSummary",
        "clientSummaryDraft",
        "summaryInternal",
        "internalRationale",
        "complianceNotes",
        "assumptionsJson",
      ]),
    );
  });
});
