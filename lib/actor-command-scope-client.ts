"use client";

import type { ActorRoleKey, ActorTenantSlug } from "@/lib/actor-session";

const actorSessionStorageKey = "alphavest.actorSession.v1";

export type ActorCommandScope = {
  roleKey: ActorRoleKey;
  tenantSlug: ActorTenantSlug;
};

export function readActorCommandScope(): Partial<ActorCommandScope> {
  if (typeof window === "undefined") {
    return {};
  }

  const stored = window.localStorage.getItem(actorSessionStorageKey);
  if (!stored) {
    return {};
  }

  try {
    const parsed = JSON.parse(stored) as Partial<ActorCommandScope>;

    return {
      roleKey: parsed.roleKey,
      tenantSlug: parsed.tenantSlug,
    };
  } catch {
    return {};
  }
}
