"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createDemoSession,
  defaultDemoSession,
  type DemoRoleKey,
  type DemoSession,
  type DemoTenantSlug,
} from "@/lib/demo-session";

const storageKey = "alphavest.demoSession.v1";

type DemoSessionContextValue = {
  handoff: DemoActorHandoff | null;
  session: DemoSession;
  setRole: (roleKey: DemoRoleKey) => void;
  setTenant: (tenantSlug: DemoTenantSlug) => void;
  resetSession: () => void;
};

const DemoSessionContext = createContext<DemoSessionContextValue | null>(null);

export type DemoActorHandoff = {
  fromRoleLabel: string;
  fromTenantName: string;
  sequence: number;
  toRoleLabel: string;
  toTenantName: string;
  type: "role" | "tenant" | "reset";
};

type DemoSessionProviderProps = {
  children: React.ReactNode;
};

export function DemoSessionProvider({ children }: DemoSessionProviderProps) {
  const [session, setSession] = useState<DemoSession>(defaultDemoSession);
  const [handoff, setHandoff] = useState<DemoActorHandoff | null>(null);
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const storedSession = window.localStorage.getItem(storageKey);
        if (storedSession) {
          const parsed = JSON.parse(storedSession) as { roleKey?: string; tenantSlug?: string };
          setSession(
            createDemoSession({
              roleKey: parsed.roleKey as DemoRoleKey,
              tenantSlug: parsed.tenantSlug as DemoTenantSlug,
            })
          );
        }
      } catch {
        setSession(defaultDemoSession);
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

  const value = useMemo<DemoSessionContextValue>(
    () => ({
      handoff,
      session,
      setRole: (roleKey) => {
        setSession((current) => {
          const nextSession = createDemoSession({
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
          const nextSession = createDemoSession({
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
            current.role.key !== defaultDemoSession.role.key ||
            current.tenant.slug !== defaultDemoSession.tenant.slug
          ) {
            setHandoff((previous) => ({
              fromRoleLabel: current.role.label,
              fromTenantName: current.tenant.displayName,
              sequence: (previous?.sequence ?? 0) + 1,
              toRoleLabel: defaultDemoSession.role.label,
              toTenantName: defaultDemoSession.tenant.displayName,
              type: "reset",
            }));
          }

          return defaultDemoSession;
        });
      },
    }),
    [handoff, session]
  );

  return <DemoSessionContext.Provider value={value}>{children}</DemoSessionContext.Provider>;
}

export function useDemoSession() {
  const context = useContext(DemoSessionContext);

  if (!context) {
    throw new Error("useDemoSession must be used inside DemoSessionProvider.");
  }

  return context;
}
