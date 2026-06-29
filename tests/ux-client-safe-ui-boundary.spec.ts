import { expect, test } from "@playwright/test";

import {
  uxClientSafeAllowedVisibleClasses,
  uxClientSafeSuppressedClasses,
  uxClientSafeUiBoundaryForPageId,
  uxClientSafeUiBoundaryIntegrity,
} from "../lib/ux-client-safe-ui-boundary";

test.describe("E07 client-safe UI boundary contract", () => {
  test("defines allowed client-visible classes and suppresses internal/proof classes", () => {
    expect(uxClientSafeAllowedVisibleClasses).toEqual([
      "client_safe_summary",
      "released_status",
      "redacted_metadata",
      "safe_next_step",
      "fail_closed_state",
      "source_upload_metadata",
    ]);
    expect(uxClientSafeSuppressedClasses).toEqual(expect.arrayContaining([
      "route_context",
      "route_id",
      "ux_task_id",
      "proof_scaffolding",
      "reviewer_scaffolding",
      "debug_metadata",
      "ai_draft",
      "internal_rationale",
      "compliance_note",
      "audit_history_summary",
      "storage_or_checksum",
    ]));
  });

  test("materializes representative client and export package boundaries", () => {
    const clientHome = uxClientSafeUiBoundaryForPageId("019");
    const mobile = uxClientSafeUiBoundaryForPageId("020");
    const decisionRoom = uxClientSafeUiBoundaryForPageId("044");
    const decisionSuccess = uxClientSafeUiBoundaryForPageId("045");
    const documents = uxClientSafeUiBoundaryForPageId("027");
    const exportPackage = uxClientSafeUiBoundaryForPageId("058");

    expect(clientHome.family).toBe("client_portal");
    expect(mobile.family).toBe("mobile_client");
    expect(decisionRoom.family).toBe("decision_client_summary");
    expect(decisionSuccess.family).toBe("decision_client_summary");
    expect(documents.family).toBe("client_portal");
    expect(exportPackage.family).toBe("export_client_package");
    expect(exportPackage.backendSecurityScope).toBe("ui_projection_only_not_rbac");
  });

  test("keeps the minimum representative family map intact", () => {
    expect(uxClientSafeUiBoundaryIntegrity.missingFamilyPageIds).toEqual([]);
    expect(uxClientSafeUiBoundaryIntegrity.missingSuppressionClasses).toEqual([]);
  });
});
