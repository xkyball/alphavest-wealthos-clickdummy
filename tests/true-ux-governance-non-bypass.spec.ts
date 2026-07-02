import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import { createActorSession, actorPlatformTenantId } from "../lib/actor-session";
import { permissionEngine } from "../lib/permission-engine";

test.describe("V0.96 WP-09 governance admin non-bypass UX", () => {
  test("admin/governance UI exposes product-native approval and separate-approval states", () => {
    const governanceSource = readFileSync("components/decisions-governance-screen.tsx", "utf8");
    const adminSource = readFileSync("components/admin-tenant-setup-screen.tsx", "utf8");

    expect(governanceSource).toContain("Review coverage");
    expect(governanceSource).toContain("Role and access changes are checked before any account update.");
    expect(governanceSource).toContain("Access work");
    expect(governanceSource).toContain("Separate work");
    expect(governanceSource).toContain("Change held");
    expect(governanceSource).toContain("Access held");
    expect(governanceSource).toContain("Publish advice");
    expect(governanceSource).toContain("Complete evidence review");
    expect(governanceSource).toContain("Prepare export downloads");
    expect(governanceSource).toContain("Hide audit records");
    expect(governanceSource).toContain("workflow09-governance-capability-boundary");
    expect(governanceSource).not.toContain("Governance access boundary");
    expect(governanceSource).not.toContain("Allowed governance actions");
    expect(governanceSource).not.toContain("Does not grant");
    expect(governanceSource).not.toContain("Available actions");
    expect(governanceSource).not.toContain("Separate approvals");
    expect(governanceSource).not.toContain("Selected Request");
    expect(governanceSource).not.toContain("Role review is not role activation");
    expect(governanceSource).not.toContain("Access is not granted yet");

    expect(adminSource).toContain("Role configuration shapes access requests only.");
    expect(adminSource).toContain("Admin role edits do not bypass release, evidence, audit or export controls.");
    expect(adminSource).toContain("Permission change applies to this role template only.");
    expect(adminSource).toContain("It cannot release advice, mark evidence review complete, approve export, or skip audit persistence.");
  });

  test("governance role and access drawers keep scoped action lifecycle instead of downstream gate success", () => {
    const source = readFileSync("components/decisions-governance-screen.tsx", "utf8");

    expect(source).toContain('data-testid="uxp3-role-drawer-lifecycle"');
    expect(source).toContain('data-testid="uxp3-role-confirmation-lifecycle"');
    expect(source).toContain('data-testid="uxp3-access-request-drawer-lifecycle"');
    expect(source).toContain("Confirm role change");
    expect(source).toContain("Approve access request");
    expect(source).toContain("This role change cannot release advice, mark evidence review complete, approve export or bypass audit persistence.");
    expect(source).toContain("Access remains held until policy, role-conflict and audit checks are satisfied.");
    expect(source).not.toMatch(/admin override|force release|release to client|download ready|audit suppressed/i);
  });

  test("permission engine still denies admin downstream safety-gate bypasses", () => {
    const admin = createActorSession({ roleKey: "admin", tenantSlug: "bennett" });

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
        platformTenantId: actorPlatformTenantId,
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
        platformTenantId: actorPlatformTenantId,
      },
      admin.role,
    );

    expect(adminExport.allowed).toBe(false);
    expect(adminExport.reasonCode).toBe("DEMO_DENY_ADMIN_NON_BYPASS");
    expect(adminExport.requiresSecondConfirmation).toBe(true);
  });
});
