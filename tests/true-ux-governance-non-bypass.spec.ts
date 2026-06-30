import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import { createDemoSession, demoPlatformTenantId } from "../lib/demo-session";
import { permissionEngine } from "../lib/permission-engine";

test.describe("V0.96 WP-09 governance admin non-bypass UX", () => {
  test("admin/governance UI exposes allowed capability and does-not-grant boundaries", () => {
    const governanceSource = readFileSync("components/decisions-governance-screen.tsx", "utf8");
    const adminSource = readFileSync("components/admin-tenant-setup-screen.tsx", "utf8");

    expect(governanceSource).toContain("Governance access boundary");
    expect(governanceSource).toContain("Admin configuration does not publish advice, complete evidence review or prepare export downloads.");
    expect(governanceSource).toContain("Allowed governance actions");
    expect(governanceSource).toContain("Does not grant");
    expect(governanceSource).toContain("Publish advice");
    expect(governanceSource).toContain("Complete evidence review");
    expect(governanceSource).toContain("Prepare export downloads");
    expect(governanceSource).toContain("Hide audit records");
    expect(governanceSource).toContain("workflow09-governance-capability-boundary");

    expect(adminSource).toContain("Admin configuration does not grant");
    expect(adminSource).toContain("Compliance release");
    expect(adminSource).toContain("Evidence sufficiency");
    expect(adminSource).toContain("Client visibility");
    expect(adminSource).toContain("Cross-tenant data access");
    expect(adminSource).toContain("workflow09-admin-does-not-grant");
  });

  test("governance role and access drawers keep scoped action lifecycle instead of downstream gate success", () => {
    const source = readFileSync("components/decisions-governance-screen.tsx", "utf8");

    expect(source).toContain('data-testid="uxp3-role-drawer-lifecycle"');
    expect(source).toContain('data-testid="uxp3-role-confirmation-lifecycle"');
    expect(source).toContain('data-testid="uxp3-access-request-drawer-lifecycle"');
    expect(source).toContain("Confirm role change");
    expect(source).toContain("Approve access request");
    expect(source).toContain("This role change cannot release advice, mark evidence review complete, approve export or bypass audit persistence.");
    expect(source).toContain("Access approval remains constrained by visible policy, SOD and audit checks.");
    expect(source).not.toMatch(/admin override|force release|release to client|download ready|audit suppressed/i);
  });

  test("permission engine still denies admin downstream safety-gate bypasses", () => {
    const admin = createDemoSession({ roleKey: "admin", tenantSlug: "bennett" });

    const adminRelease = permissionEngine.can(
      admin.actor,
      "RELEASE",
      {
        clientTenantId: admin.tenant.id,
        objectType: "RECOMMENDATION",
        sensitivity: "RESTRICTED",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: admin.tenant.id,
        platformTenantId: demoPlatformTenantId,
      },
      admin.role,
    );

    expect(adminRelease.allowed).toBe(false);
    expect(adminRelease.reasonCode).toBe("DEMO_DENY_COMPLIANCE_RELEASE_REQUIRED");
    expect(adminRelease.requiresAudit).toBe(true);
    expect(adminRelease.requiresSecondConfirmation).toBe(true);

    const adminExport = permissionEngine.can(
      admin.actor,
      "EXPORT",
      {
        clientTenantId: admin.tenant.id,
        objectType: "EXPORT_REQUEST",
        sensitivity: "RESTRICTED",
        visibilityStatus: "REDACTED",
      },
      {
        clientTenantId: admin.tenant.id,
        platformTenantId: demoPlatformTenantId,
      },
      admin.role,
    );

    expect(adminExport.allowed).toBe(false);
    expect(adminExport.reasonCode).toBe("DEMO_DENY_ADMIN_NON_BYPASS");
    expect(adminExport.requiresSecondConfirmation).toBe(true);
  });
});
