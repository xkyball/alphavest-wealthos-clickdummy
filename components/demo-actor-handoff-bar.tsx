"use client";

import { ArrowRight, ShieldCheck, UsersRound } from "lucide-react";

import { useDemoSession } from "@/components/demo-session-provider";

export function DemoActorHandoffBar() {
  const { handoff, session } = useDemoSession();
  const label =
    handoff?.type === "tenant"
      ? "Tenant handoff"
      : handoff?.type === "reset"
        ? "Context reset"
        : handoff
          ? "Role handoff"
          : "Active actor";

  return (
    <section
      aria-label="Actor handoff"
      className="border-b border-alphavest-border/70 bg-alphavest-navy/75 px-4 py-2 md:px-6"
      data-testid="demo-actor-handoff"
    >
      <div className="mx-auto flex max-w-[1600px] flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2 text-alphavest-muted">
          <span className="inline-flex h-7 items-center gap-2 rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 px-2 font-semibold uppercase tracking-[0.08em] text-alphavest-gold-soft">
            <UsersRound aria-hidden="true" className="size-3.5" />
            {label}
          </span>
          {handoff ? (
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate">{handoff.fromRoleLabel}</span>
              <ArrowRight aria-hidden="true" className="size-3.5 shrink-0 text-alphavest-gold" />
              <span className="truncate font-semibold text-alphavest-ivory">{handoff.toRoleLabel}</span>
            </span>
          ) : (
            <span className="truncate font-semibold text-alphavest-ivory">{session.role.label}</span>
          )}
        </div>
        <div className="flex min-w-0 items-center gap-2 text-alphavest-muted">
          <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0 text-alphavest-green" />
          <span className="truncate" data-testid="demo-actor-handoff-current">
            {session.actor.displayName} · {session.role.label} · {session.tenant.displayName}
          </span>
        </div>
      </div>
    </section>
  );
}
