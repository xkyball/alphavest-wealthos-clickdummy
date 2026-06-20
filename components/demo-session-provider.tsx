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
  session: DemoSession;
  setRole: (roleKey: DemoRoleKey) => void;
  setTenant: (tenantSlug: DemoTenantSlug) => void;
  resetSession: () => void;
};

const DemoSessionContext = createContext<DemoSessionContextValue | null>(null);

type DemoSessionProviderProps = {
  children: React.ReactNode;
};

export function DemoSessionProvider({ children }: DemoSessionProviderProps) {
  const [session, setSession] = useState<DemoSession>(defaultDemoSession);
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
      session,
      setRole: (roleKey) => {
        setSession((current) =>
          createDemoSession({
            roleKey,
            tenantSlug: current.tenant.slug,
          })
        );
      },
      setTenant: (tenantSlug) => {
        setSession((current) =>
          createDemoSession({
            roleKey: current.role.key,
            tenantSlug,
          })
        );
      },
      resetSession: () => {
        setSession(defaultDemoSession);
      },
    }),
    [session]
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
