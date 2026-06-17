"use client";

import { CircleCheck, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { navigationGroups } from "@/lib/navigation";
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

  return (
    <>
      <AlphaVestMark />

      <nav className="grid gap-3 pb-1 sm:grid-cols-2 md:grid-cols-3 lg:min-h-0 lg:flex lg:flex-1 lg:flex-col lg:gap-5 lg:overflow-y-auto lg:pr-1">
        {navigationGroups.map((group) => {
          const GroupIcon = group.icon;

          return (
            <div className="min-w-0" key={group.label}>
              <div className="mb-2 flex items-center gap-2 px-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-alphavest-subtle">
                <GroupIcon aria-hidden="true" className="size-3.5" />
                <p>{group.label}</p>
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;

                  return (
                    <a
                      className={[
                        "flex h-9 items-center gap-3 rounded-md border px-3 text-xs transition",
                        active
                          ? "border-alphavest-gold/55 bg-alphavest-gold/12 text-alphavest-gold-soft"
                          : "border-transparent text-alphavest-muted hover:border-alphavest-border hover:bg-alphavest-panel-soft/70 hover:text-alphavest-ivory"
                      ].join(" ")}
                      href={item.href}
                      key={item.label}
                      onClick={onNavigate}
                    >
                      <Icon aria-hidden="true" className="size-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
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
          "fixed inset-y-0 left-0 z-50 flex w-[min(21rem,calc(100vw-1.5rem))] flex-col gap-6 overflow-y-auto border-r border-alphavest-border bg-alphavest-panel p-4 shadow-2xl transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
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
