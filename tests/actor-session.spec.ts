import { expect, test } from "@playwright/test";

import {
  actorPlatformTenantId,
  actorRoles,
  actors,
  actorTenants,
  createActorSession,
  defaultActorSession,
  requireActorSession,
  tryCreateActorSession,
} from "../lib/actor-session";

test.describe("actor session catalog", () => {
  test("exposes seeded actor, tenant and role runtime contract", () => {
    expect(actorPlatformTenantId).toMatch(/^[0-9a-f-]{36}$/);
    expect(actorRoles.map((role) => role.key)).toEqual(
      expect.arrayContaining(["principal", "family_cfo", "analyst", "compliance_officer", "admin"]),
    );
    expect(actorTenants.map((tenant) => tenant.slug)).toEqual(
      expect.arrayContaining(["bennett", "morgan", "northbridge", "summit"]),
    );
    expect(actors.some((actor) => actor.key === "compliance")).toBe(true);
    expect(defaultActorSession).toMatchObject({
      mode: "seed",
      role: { key: "compliance_officer" },
      tenant: { slug: "bennett" },
    });
  });

  test("resolves mapped actor sessions without compatibility fallback in strict paths", () => {
    const draft = { roleKey: "compliance_officer", tenantSlug: "bennett" };
    const session = createActorSession(draft);
    const strict = tryCreateActorSession(draft);

    expect(session).toMatchObject({
      actor: { key: "compliance", roleKey: "compliance_officer" },
      mode: "seed",
      role: { key: "compliance_officer" },
      tenant: { slug: "bennett" },
      tenantMembership: { roleKey: "compliance_officer", tenantSlug: "bennett" },
    });
    expect(strict).toEqual({ ok: true, session });
    expect(requireActorSession(draft)).toEqual(session);
  });

  test("fails strict resolution for unknown actor context but keeps local fallback explicit", () => {
    expect(tryCreateActorSession({ roleKey: "unknown", tenantSlug: "bennett" })).toEqual({
      issues: ["valid_role_key_required"],
      ok: false,
    });
    expect(tryCreateActorSession({ roleKey: "principal", tenantSlug: "unknown" })).toEqual({
      issues: ["valid_tenant_slug_required"],
      ok: false,
    });
    expect(() => requireActorSession({ roleKey: "unknown", tenantSlug: "bennett" })).toThrow(
      /Session context is not mapped/,
    );

    const fallback = createActorSession({ roleKey: "unknown", tenantSlug: "unknown" });
    expect(fallback).toMatchObject({
      mode: "seed",
      role: { key: "compliance_officer" },
      tenant: { slug: "bennett" },
    });
  });
});
