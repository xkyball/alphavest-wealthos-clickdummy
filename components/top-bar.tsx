"use client";

import { Bell, ChevronDown, Menu, RotateCcw, Search, ShieldCheck, UserRound } from "lucide-react";
import { useDemoSession } from "@/components/demo-session-provider";
import { demoRoles, demoTenants, type DemoRoleKey, type DemoTenantSlug } from "@/lib/demo-session";

type TopBarProps = {
  onOpenNavigation?: () => void;
};

export function TopBar({ onOpenNavigation }: TopBarProps) {
  const { session, setRole, setTenant, resetSession } = useDemoSession();

  return (
    <header className="av-topbar sticky top-0 z-40 px-4 py-3 md:px-6">
      <div className="av-page flex min-h-12 flex-col gap-3 lg:flex-row lg:items-center lg:justify-end 2xl:justify-between">
        <div className="flex min-w-0 items-center justify-between gap-3 2xl:flex-1 2xl:justify-start">
          <button
            className="relative z-50 grid size-10 place-items-center rounded-md border border-alphavest-border bg-alphavest-charcoal/70 text-alphavest-muted transition hover:border-alphavest-gold hover:text-alphavest-gold lg:hidden"
            onClick={onOpenNavigation}
            type="button"
          >
            <Menu aria-hidden="true" className="size-5" />
            <span className="sr-only">Open navigation</span>
          </button>
          <div className="hidden min-w-0 flex-1 items-center gap-3 2xl:flex">
            <div className="grid size-10 place-items-center rounded-full border border-alphavest-gold/40 bg-alphavest-gold/10 text-alphavest-gold">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-alphavest-ivory">
                {session.sessionLabel}
              </p>
              <p className="text-xs text-alphavest-muted">
                Real authentication deferred; context is demo-local
              </p>
            </div>
          </div>
          <div className="min-w-0 text-right lg:hidden">
            <p className="truncate text-sm font-semibold text-alphavest-ivory">{session.tenant.displayName}</p>
            <p className="text-xs text-alphavest-muted">{session.role.label}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
          <label className="relative hidden min-w-56 sm:block">
            <span className="sr-only">Search</span>
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
            <input
              className="h-10 w-full rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-9 text-sm text-alphavest-ivory outline-none transition placeholder:text-alphavest-subtle focus:border-alphavest-gold"
              placeholder="Search workspace..."
              type="search"
            />
          </label>

          <div className="grid gap-2 sm:grid-cols-2 lg:flex">
            <label className="relative">
              <span className="sr-only">Tenant context</span>
              <UserRound aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-gold" />
              <select
                className="h-10 w-full appearance-none rounded-md border border-alphavest-border bg-alphavest-charcoal/70 py-0 pl-9 pr-8 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold lg:w-60"
                onChange={(event) => setTenant(event.target.value as DemoTenantSlug)}
                value={session.tenant.slug}
              >
                {demoTenants.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.displayName}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
            </label>

            <label className="relative">
              <span className="sr-only">Role context</span>
              <ShieldCheck aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-gold" />
              <select
                className="h-10 w-full appearance-none rounded-md border border-alphavest-border bg-alphavest-charcoal/70 py-0 pl-9 pr-8 text-sm text-alphavest-ivory outline-none focus:border-alphavest-gold lg:w-52"
                onChange={(event) => setRole(event.target.value as DemoRoleKey)}
                value={session.role.key}
              >
                {demoRoles.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-alphavest-subtle" />
            </label>
          </div>

          <button
            className="grid size-10 place-items-center rounded-full border border-alphavest-border bg-alphavest-charcoal/70 text-alphavest-muted transition hover:border-alphavest-gold hover:text-alphavest-gold"
            onClick={resetSession}
            title="Reset demo session"
            type="button"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            <span className="sr-only">Reset demo session</span>
          </button>

          <button
            className="grid size-10 place-items-center rounded-full border border-alphavest-border bg-alphavest-charcoal/70 text-alphavest-muted transition hover:border-alphavest-gold hover:text-alphavest-gold"
            title="Notifications"
            type="button"
          >
            <Bell aria-hidden="true" className="size-4" />
            <span className="sr-only">Notifications</span>
          </button>

          <div className="flex items-center gap-3 rounded-full border border-alphavest-border bg-alphavest-charcoal/70 py-1 pl-1 pr-3">
            <div className="grid size-9 place-items-center rounded-full border border-alphavest-gold/45 text-sm font-semibold text-alphavest-gold">
              {session.actor.initials}
            </div>
            <div className="hidden leading-tight md:block">
              <p className="text-sm font-semibold text-alphavest-ivory">
                {session.actor.displayName}
              </p>
              <p className="text-xs text-alphavest-muted">{session.role.label}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
