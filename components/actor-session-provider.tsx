"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  actorTenants,
  createActorSession,
  type ActorRoleKey,
  type ActorSession,
  type ActorTenantSlug,
} from "@/lib/actor-session";

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

type CurrentUserResponse = {
  currentUser?: {
    role?: { key?: string; scope?: string };
    tenant?: { displayName?: string; id?: string; slug?: string };
  };
};

function tenantSlugForCurrentUserTenant(tenantId?: string | null) {
  return actorTenants.find((tenant) => tenant.id === tenantId)?.slug;
}

export function ActorSessionProvider({ children }: ActorSessionProviderProps) {
  const [session, setSession] = useState<ActorSession | null>(null);
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/current-user", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return undefined;

        return response.json() as Promise<CurrentUserResponse>;
      })
      .then((body) => {
        const roleKey = body?.currentUser?.role?.key as ActorRoleKey | undefined;
        const tenantSlug =
          body?.currentUser?.tenant?.slug ??
          tenantSlugForCurrentUserTenant(body?.currentUser?.tenant?.id) ??
          (body?.currentUser?.role?.scope === "PLATFORM" ? "bennett" : undefined);

        if (!roleKey || !tenantSlug) {
          setSession(null);
          setAuthState("unauthenticated");
          return;
        }

        setSession(createActorSession({
          roleKey,
          tenantId: body?.currentUser?.tenant?.id,
          tenantName: body?.currentUser?.tenant?.displayName,
          tenantSlug,
        }));
        setAuthState("authenticated");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSession(null);
        setAuthState("unauthenticated");
      });

    return () => controller.abort();
  }, []);

  const value = useMemo<ActorSessionContextValue>(
    () => ({
      handoff: null,
      session: session as ActorSession,
      setRole: () => undefined,
      setTenant: () => undefined,
      resetSession: () => undefined,
    }),
    [session],
  );

  if (!session) {
    return (
      <div className="min-h-screen bg-alphavest-obsidian text-alphavest-ivory">
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-sm font-semibold">{authState === "loading" ? "Loading account context" : "Sign in required"}</p>
          <p className="text-xs leading-5 text-alphavest-muted">
            {authState === "loading"
              ? "Your role and access scope are being resolved."
              : "Open the sign-in flow to restore your role and access scope."}
          </p>
        </div>
      </div>
    );
  }

  return <ActorSessionContext.Provider value={value}>{children}</ActorSessionContext.Provider>;
}

export function useActorSession() {
  const context = useContext(ActorSessionContext);

  if (!context) {
    throw new Error("useActorSession must be used inside ActorSessionProvider.");
  }

  return context;
}
