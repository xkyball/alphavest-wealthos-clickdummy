"use client";

import { CircleCheck, LockKeyhole, Route, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoSession } from "@/components/demo-session-provider";
import { isActiveNavigationItem, navigationGroupsForRole } from "@/lib/navigation";
import { cn } from "@/lib/cn";

function AlphaVestMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-11 place-items-center rounded border border-alphavest-gold/45 bg-alphavest-gold/10 text-lg font-bold text-alphavest-gold">
        A
      </div>
      <div>
        <p className="font-display text-2xl leading-none text-alphavest-ivory">
          AlphaVest
        </p>
        <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-alphavest-gold">
          WealthOS
        </p>
      </div>
    </div>
  );
}

function NavigationContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { session } = useDemoSession();
  const navigationGroups = navigationGroupsForRole(session.role);

  return (
    <>
      <AlphaVestMark />

      <Link
        aria-current={pathname.startsWith("/journeys") ? "page" : undefined}
        className={cn(
          "flex min-h-12 items-start gap-3 rounded-md border px-3 py-2.5 text-xs transition",
          pathname.startsWith("/journeys")
            ? "border-alphavest-gold/55 bg-alphavest-gold/12 text-alphavest-gold-soft"
            : "border-alphavest-border/55 bg-alphavest-charcoal/42 text-alphavest-muted hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft"
        )}
        data-testid="journey-first-navigation"
        href="/journeys"
        onClick={onNavigate}
      >
        <Route aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold">Client work</span>
          <span className="block line-clamp-2 text-[0.66rem] leading-4 text-alphavest-subtle">
            Worklist, stages and safe next actions.
          </span>
        </span>
      </Link>

      <nav
        aria-label="Primary navigation"
        className="grid gap-4 pb-1 sm:grid-cols-2 md:grid-cols-3 lg:min-h-0 lg:flex lg:flex-1 lg:flex-col lg:gap-4 lg:overflow-y-auto lg:pr-1"
      >
        {navigationGroups.map((group) => {
          const GroupIcon = group.icon;
          const groupActive = group.items.some((item) => isActiveNavigationItem(pathname, item));

          return (
            <section
              aria-label={group.label}
              className={cn(
                "min-w-0 rounded-md border px-2.5 py-2.5",
                group.lockedReason
                  ? "border-alphavest-border/35 bg-alphavest-charcoal/24 opacity-80"
                  : group.tier === "support"
                  ? "border-alphavest-border/35 bg-alphavest-charcoal/30"
                  : "border-transparent bg-transparent"
              )}
              data-ux-role-gated={group.lockedReason ? "true" : undefined}
              data-ux-workspace-key={group.key}
              key={group.label}
            >
              <div
                className={cn(
                  "mb-1 flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.14em] transition",
                  groupActive ? "text-alphavest-gold-soft" : "text-alphavest-subtle"
                )}
              >
                {group.lockedReason ? (
                  <LockKeyhole aria-hidden="true" className="size-3.5" />
                ) : (
                  <GroupIcon aria-hidden="true" className="size-3.5" />
                )}
                <p className="truncate">{group.label}</p>
                {group.journeyStage ? (
                  <span
                    className="ml-auto inline-flex h-5 shrink-0 items-center gap-1 rounded-full border border-alphavest-gold/35 bg-alphavest-gold/10 px-2 text-[0.58rem] font-semibold normal-case tracking-normal text-alphavest-gold-soft"
                    data-testid="v096-core-journey-stage"
                    data-ux-core-journey-stage={group.journeyStage}
                  >
                    <span>{group.journeyStage}</span>
                    <span>{group.journeyStageLabel}</span>
                  </span>
                ) : null}
              </div>
              <p
                className={cn(
                  "mb-2 line-clamp-2 text-[0.68rem] leading-4",
                  group.tier === "support" ? "text-alphavest-subtle" : "text-alphavest-muted"
                )}
              >
                {group.description}
              </p>
              {group.lockedReason ? (
                <div
                  className="rounded-md border border-alphavest-border/50 bg-alphavest-navy/35 p-2 text-[0.66rem] leading-4 text-alphavest-subtle"
                  data-testid="role-gated-workspace"
                >
                  <p className="mb-1 flex items-center gap-1.5 font-semibold text-alphavest-gold-soft">
                    <LockKeyhole aria-hidden="true" className="size-3" />
                    Role-gated workspace
                  </p>
                  <p>{group.lockedReason}</p>
                </div>
              ) : null}
              <div className="space-y-1" data-navigation-tier={group.tier}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActiveNavigationItem(pathname, item);

                  return (
                    <a
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex min-h-9 items-start gap-3 rounded-md border text-xs transition",
                        item.tier === "secondary" ? "ml-2 px-2.5 py-1.5" : "px-3 py-2",
                        active
                          ? "border-alphavest-gold/55 bg-alphavest-gold/12 text-alphavest-gold-soft"
                          : "border-transparent text-alphavest-muted hover:border-alphavest-border hover:bg-alphavest-panel-soft/70 hover:text-alphavest-ivory",
                        item.tier === "secondary" &&
                          !active &&
                          "text-alphavest-subtle hover:text-alphavest-muted"
                      )}
                      data-navigation-item-tier={item.tier}
                      href={item.href}
                      key={item.label}
                      onClick={onNavigate}
                    >
                      <Icon
                        aria-hidden="true"
                        className={cn("mt-0.5 shrink-0", item.tier === "secondary" ? "size-3.5 opacity-70" : "size-4")}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{item.label}</span>
                        <span className="block line-clamp-2 text-[0.66rem] leading-4 text-alphavest-subtle group-hover:text-alphavest-muted">
                          {item.description}
                        </span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </section>
          );
        })}
      </nav>

      <div className="hidden rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/72 p-4 lg:block">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-alphavest-gold-soft">
          <CircleCheck aria-hidden="true" className="size-4" />
          System status
        </div>
        <p className="text-xs leading-5 text-alphavest-muted">
          All demo services operational. Important actions remain audited.
        </p>
      </div>
    </>
  );
}

type SidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  return (
    <>
      <aside className="alpha-panel hidden w-full flex-col gap-7 border-x-0 border-t-0 p-4 lg:flex lg:h-screen lg:min-h-0 lg:w-[var(--sidebar-width)] lg:overflow-y-auto lg:border-y-0 lg:border-l-0 lg:p-5 lg:overscroll-contain lg:pb-6">
        <NavigationContent />
      </aside>

      <div
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-0 z-40 bg-alphavest-navy/72 backdrop-blur-sm transition lg:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onMobileClose}
      />
      <aside
        aria-label="Mobile navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[min(21rem,calc(100vw-1.5rem))] flex-col gap-6 overflow-y-auto border-r border-alphavest-border bg-alphavest-panel p-4 shadow-2xl transition-transform lg:hidden",
          mobileOpen ? "flex translate-x-0" : "hidden -translate-x-full"
        )}
      >
        <div className="flex justify-end">
          <button
            className="grid size-9 place-items-center rounded-full border border-alphavest-border text-alphavest-muted transition hover:border-alphavest-gold hover:text-alphavest-gold"
            onClick={onMobileClose}
            type="button"
          >
            <X aria-hidden="true" className="size-4" />
            <span className="sr-only">Close navigation</span>
          </button>
        </div>
        <NavigationContent onNavigate={onMobileClose} />
      </aside>
    </>
  );
}
