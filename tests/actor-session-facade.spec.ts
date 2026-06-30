import { expect, test } from "@playwright/test";

import {
  actorPlatformTenantId,
  actorRoles,
  actorTenants,
  createActorSession,
  defaultActorSession,
  requireActorSession,
  tryCreateActorSession,
} from "../lib/actor-session";
import {
  createDemoSession,
  defaultDemoSession,
  demoPlatformTenantId,
  demoRoles,
  demoTenants,
  requireDemoSession,
  tryCreateDemoSession,
} from "../lib/demo-session";

test.describe("actor session facade", () => {
  test("preserves seeded actor, tenant and role runtime contract", () => {
    expect(actorPlatformTenantId).toBe(demoPlatformTenantId);
    expect(actorRoles).toEqual(demoRoles);
    expect(actorTenants).toEqual(demoTenants);
    expect(defaultActorSession).toEqual(defaultDemoSession);

    const draft = { roleKey: "compliance_officer", tenantSlug: "bennett" };

    expect(createActorSession(draft)).toEqual(createDemoSession(draft));
    expect(tryCreateActorSession(draft)).toEqual(tryCreateDemoSession(draft));
    expect(requireActorSession(draft)).toEqual(requireDemoSession(draft));
  });
});
