"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  actorTenants,
  createActorSession,
  defaultActorSession,
  type ActorRoleKey,
  type ActorSession,
  type ActorTenantSlug,
} from "@/lib/actor-session";

const storageKey = "alphavest.actorSession.v1";

type ActorSessionContextValue = {
  handoff: ActorHandoff | null;
  session: ActorSession;
  setRole: (roleKey: ActorRoleKey) => void;
  setTenant: (tenantSlug: ActorTenantSlug) => void;
  resetSession: () => void;
};

const ActorSessionContext = createContext<ActorSessionContextValue | null>(null);

export type ActorHandoff = {
  fromRoleLabel: string;
  fromTenantName: string;
  sequence: number;
  toRoleLabel: string;
  toTenantName: string;
  type: "role" | "tenant" | "reset";
};

type ActorSessionProviderProps = {
  children: React.ReactNode;
};

function tenantSlugForCurrentUserTenant(tenantId?: string | null) {
  return actorTenants.find((tenant) => tenant.id === tenantId)?.slug;
}

export function ActorSessionProvider({ children }: ActorSessionProviderProps) {
  const [session, setSession] = useState<ActorSession>(defaultActorSession);
  const [handoff, setHandoff] = useState<ActorHandoff | null>(null);
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const storedSession = window.localStorage.getItem(storageKey);
        if (storedSession) {
          const parsed = JSON.parse(storedSession) as { roleKey?: string; tenantSlug?: string };
          setSession(
            createActorSession({
              roleKey: parsed.roleKey as ActorRoleKey,
              tenantSlug: parsed.tenantSlug as ActorTenantSlug,
            })
          );
        }
      } catch {
        setSession(defaultActorSession);
      } finally {
        setStorageLoaded(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        roleKey: session.role.key,
        tenantSlug: session.tenant.slug,
      })
    );
  }, [session.role.key, session.tenant.slug, storageLoaded]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/current-user", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return undefined;

        return response.json() as Promise<{
          currentUser?: {
            role?: { key?: string };
            tenant?: { id?: string };
          };
        }>;
      })
      .then((body) => {
        const roleKey = body?.currentUser?.role?.key as ActorRoleKey | undefined;
        if (!roleKey) return;

        setSession((current) =>
          createActorSession({
            roleKey,
            tenantSlug: tenantSlugForCurrentUserTenant(body?.currentUser?.tenant?.id) ?? current.tenant.slug,
          }),
        );
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
      });

    return () => controller.abort();
  }, []);

  const value = useMemo<ActorSessionContextValue>(
    () => ({
      handoff,
      session,
      setRole: (roleKey) => {
        setSession((current) => {
          const nextSession = createActorSession({
            roleKey,
            tenantSlug: current.tenant.slug,
          });

          if (current.role.key !== nextSession.role.key) {
            setHandoff((previous) => ({
              fromRoleLabel: current.role.label,
              fromTenantName: current.tenant.displayName,
              sequence: (previous?.sequence ?? 0) + 1,
              toRoleLabel: nextSession.role.label,
              toTenantName: nextSession.tenant.displayName,
              type: "role",
            }));
          }

          return nextSession;
        });
      },
      setTenant: (tenantSlug) => {
        setSession((current) => {
          const nextSession = createActorSession({
            roleKey: current.role.key,
            tenantSlug,
          });

          if (current.tenant.slug !== nextSession.tenant.slug) {
            setHandoff((previous) => ({
              fromRoleLabel: current.role.label,
              fromTenantName: current.tenant.displayName,
              sequence: (previous?.sequence ?? 0) + 1,
              toRoleLabel: nextSession.role.label,
              toTenantName: nextSession.tenant.displayName,
              type: "tenant",
            }));
          }

          return nextSession;
        });
      },
      resetSession: () => {
        setSession((current) => {
          if (
            current.role.key !== defaultActorSession.role.key ||
            current.tenant.slug !== defaultActorSession.tenant.slug
          ) {
            setHandoff((previous) => ({
              fromRoleLabel: current.role.label,
              fromTenantName: current.tenant.displayName,
              sequence: (previous?.sequence ?? 0) + 1,
              toRoleLabel: defaultActorSession.role.label,
              toTenantName: defaultActorSession.tenant.displayName,
              type: "reset",
            }));
          }

          return defaultActorSession;
        });
      },
    }),
    [handoff, session]
  );

  return <ActorSessionContext.Provider value={value}>{children}</ActorSessionContext.Provider>;
}

export function useActorSession() {
  const context = useContext(ActorSessionContext);

  if (!context) {
    throw new Error("useActorSession must be used inside ActorSessionProvider.");
  }

  return context;
}
