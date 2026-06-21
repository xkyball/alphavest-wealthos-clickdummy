import { expect, test } from "@playwright/test";

import {
  createDemoSession,
  demoPlatformTenantId,
  demoTenants,
  resolveDemoTenantMembership,
  resolveRole,
  requireDemoSession,
  tryCreateDemoSession,
} from "../lib/demo-session";
import { permissionEngine } from "../lib/permission-engine";

test.describe("Mega-journey Phase 1 providerless scope gate", () => {
  test("resolves mapped demo actor, tenant and role without allowing unknown fallback in strict paths", () => {
    const mapped = tryCreateDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    expect(mapped.ok).toBe(true);
    if (!mapped.ok) throw new Error("Expected mapped demo session.");

    expect(mapped.session.actor.key).toBe("bennett:principal");
    expect(mapped.session.actor.roleKey).toBe("principal");
    expect(mapped.session.tenantMembership).toEqual({
      actorId: mapped.session.actor.id,
      roleKey: "principal",
      scope: "TENANT",
      tenantId: mapped.session.tenant.id,
      tenantSlug: "bennett",
    });
    expect(mapped.session.tenant.slug).toBe("bennett");
    expect(mapped.session.role.key).toBe("principal");

    const unknownRole = tryCreateDemoSession({ roleKey: "anonymous", tenantSlug: "bennett" });
    expect(unknownRole).toEqual({ issues: ["valid_role_key_required"], ok: false });

    const unknownTenant = tryCreateDemoSession({ roleKey: "principal", tenantSlug: "unknown" });
    expect(unknownTenant).toEqual({ issues: ["valid_tenant_slug_required"], ok: false });

    const missingBoth = tryCreateDemoSession({});
    expect(missingBoth).toEqual({
      issues: ["valid_role_key_required", "valid_tenant_slug_required"],
      ok: false,
    });
  });

  test("requires explicit actor role and tenant membership before strict providerless use", () => {
    expect(() => requireDemoSession({ roleKey: "anonymous", tenantSlug: "bennett" })).toThrow(
      /valid_role_key_required/,
    );

    const bennett = demoTenants.find((tenant) => tenant.slug === "bennett");
    const morganPrincipal = createDemoSession({ roleKey: "principal", tenantSlug: "morgan" });
    const principalRole = resolveRole("principal");
    if (!bennett) throw new Error("Bennett tenant missing.");

    expect(resolveDemoTenantMembership(morganPrincipal.actor, principalRole, bennett)).toBeUndefined();
  });

  test("keeps demo UI fallback separate from strict providerless acceptance", () => {
    const demoFallback = createDemoSession({ roleKey: "anonymous", tenantSlug: "unknown" });
    const strictResolution = tryCreateDemoSession({ roleKey: "anonymous", tenantSlug: "unknown" });

    expect(demoFallback.role.key).toBe("compliance_officer");
    expect(demoFallback.tenant.slug).toBe("bennett");
    expect(strictResolution).toEqual({
      issues: ["valid_role_key_required", "valid_tenant_slug_required"],
      ok: false,
    });
  });

  test("denies payload access when route context lacks tenant scope", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const decision = permissionEngine.can(
      principal.actor,
      "VIEW",
      {
        clientTenantId: principal.tenant.id,
        objectType: "DOCUMENT",
        visibilityStatus: "CLIENT_VISIBLE",
      },
      {
        platformTenantId: demoPlatformTenantId,
      },
      principal.role,
    );

    expect(decision.allowed).toBe(false);
    expect(decision.reasonCode).toBe("DEMO_DENY_TENANT_CONTEXT_REQUIRED");
    expect(decision.requiresAudit).toBe(true);
  });

  test("denies mapped client actors when tenant context is switched under them", () => {
    const bennettPrincipal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const morganPrincipal = createDemoSession({ roleKey: "principal", tenantSlug: "morgan" });
    const decision = permissionEngine.can(
      bennettPrincipal.actor,
      "VIEW",
      {
        clientTenantId: morganPrincipal.tenant.id,
        objectType: "DOCUMENT",
        visibilityStatus: "CLIENT_VISIBLE",
      },
      {
        clientTenantId: morganPrincipal.tenant.id,
        platformTenantId: demoPlatformTenantId,
      },
      bennettPrincipal.role,
    );

    expect(decision.allowed).toBe(false);
    expect(decision.reasonCode).toBe("DEMO_DENY_ACTOR_TENANT_CONTEXT_MISMATCH");
    expect(decision.requiresAudit).toBe(true);
  });

  test("keeps route access, action permission and payload visibility independently evaluated", () => {
    const principal = createDemoSession({ roleKey: "principal", tenantSlug: "bennett" });
    const routeLevel = permissionEngine.can(
      principal.actor,
      "VIEW",
      {
        objectType: "DOCUMENT",
        visibilityStatus: "CLIENT_VISIBLE",
      },
      {
        platformTenantId: demoPlatformTenantId,
      },
      principal.role,
    );
    const payloadLevel = permissionEngine.can(
      principal.actor,
      "VIEW",
      {
        clientTenantId: principal.tenant.id,
        objectType: "DOCUMENT",
        visibilityStatus: "CLIENT_VISIBLE",
      },
      {
        clientTenantId: principal.tenant.id,
        platformTenantId: demoPlatformTenantId,
      },
      principal.role,
    );

    expect(routeLevel.allowed).toBe(true);
    expect(payloadLevel.allowed).toBe(true);
    expect(payloadLevel.reasonCode).toBe("DEMO_ROLE_AWARE_ALLOW");
  });

  test("fails closed when object-scoped payload access targets the wrong object", () => {
    const analyst = createDemoSession({ roleKey: "analyst", tenantSlug: "bennett" });
    const decision = permissionEngine.can(
      analyst.actor,
      "VIEW",
      {
        clientTenantId: analyst.tenant.id,
        objectId: "document:bennett:outside-scope",
        objectType: "DOCUMENT",
        visibilityStatus: "INTERNAL_ONLY",
      },
      {
        clientTenantId: analyst.tenant.id,
        objectScope: {
          clientTenantId: analyst.tenant.id,
          objectIds: ["document:bennett:current-scope"],
          objectType: "DOCUMENT",
        },
        platformTenantId: demoPlatformTenantId,
      },
      analyst.role,
    );

    expect(decision.allowed).toBe(false);
    expect(decision.reasonCode).toBe("DEMO_DENY_OBJECT_SCOPE_MISMATCH");
    expect(decision.requiresAudit).toBe(true);
  });

  test("fails closed when object-scoped payload access has no current object scope", () => {
    const analyst = createDemoSession({ roleKey: "analyst", tenantSlug: "bennett" });
    const decision = permissionEngine.can(
      analyst.actor,
      "VIEW",
      {
        clientTenantId: analyst.tenant.id,
        objectId: "recommendation:bennett:current",
        objectType: "RECOMMENDATION",
        visibilityStatus: "COMPLIANCE_VISIBLE",
      },
      {
        clientTenantId: analyst.tenant.id,
        platformTenantId: demoPlatformTenantId,
      },
      analyst.role,
    );

    expect(decision.allowed).toBe(false);
    expect(decision.reasonCode).toBe("DEMO_DENY_OBJECT_SCOPE_REQUIRED");
    expect(decision.requiresAudit).toBe(true);
  });
});
