"use client";

import { LockKeyhole, Route } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useDemoSession } from "@/components/demo-session-provider";
import { cn } from "@/lib/cn";
import {
  uxPrimitiveInteractionAttributesFor,
  uxPrimitiveInteractionClassFor,
} from "@/lib/ux-design-system-foundation";
import { isActiveNavigationItem, navigationGroupsForRole } from "@/lib/navigation";

type ProcessNavigationProps = {
  className?: string;
  onNavigate?: () => void;
  variant?: "compact" | "grouped";
};

type ProcessSidebarProps = {
  className?: string;
  footer?: ReactNode;
};

export function AlphaVestMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-11 place-items-center rounded border border-alphavest-gold/45 bg-alphavest-gold/10 text-lg font-bold text-alphavest-gold">
        A
      </div>
      <div>
        <p className="font-display text-2xl leading-none text-alphavest-ivory">AlphaVest</p>
        <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-alphavest-gold">
          WealthOS
        </p>
      </div>
    </div>
  );
}

export function ProcessRuntimeLink({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = pathname.startsWith("/tenants/demo/setup");

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-12 items-start gap-3 rounded-md border px-3 py-2.5 text-xs transition",
        active
          ? cn("border-alphavest-gold/55 bg-alphavest-gold/12 text-alphavest-gold-soft", uxPrimitiveInteractionClassFor("selected"))
          : "border-alphavest-border/55 bg-alphavest-charcoal/42 text-alphavest-muted hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft",
        uxPrimitiveInteractionClassFor("focus-visible"),
      )}
      data-testid="process-runtime-navigation"
      href="/tenants/demo/setup"
      onClick={onNavigate}
      {...uxPrimitiveInteractionAttributesFor(active ? "selected" : "focus-visible")}
    >
      <Route aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">Operations Setup</span>
        <span className="block line-clamp-2 text-[0.66rem] leading-4 text-alphavest-subtle">
          Demo setup, state history and audit foundations.
        </span>
      </span>
    </Link>
  );
}

export function ProcessNavigation({ className, onNavigate, variant = "grouped" }: ProcessNavigationProps) {
  const pathname = usePathname();
  const { session } = useDemoSession();
  const navigationGroups = navigationGroupsForRole(session.role);

  if (variant === "compact") {
    const navigationItems = navigationGroups.flatMap((group) => group.items);

    return (
      <nav aria-label="Primary navigation" className={cn("mt-8 flex flex-1 flex-col gap-1", className)}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActiveNavigationItem(pathname, item);

          return (
            <a
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-10 items-center gap-3 rounded-md border px-3 py-2 text-sm transition",
                active
                  ? cn("border-alphavest-gold/45 bg-alphavest-gold/12 text-alphavest-gold-soft", uxPrimitiveInteractionClassFor("selected"))
                  : "border-transparent text-alphavest-muted hover:border-alphavest-border hover:bg-alphavest-panel/65 hover:text-alphavest-ivory",
                uxPrimitiveInteractionClassFor("focus-visible"),
              )}
              data-navigation-item-tier={item.tier}
              href={item.href}
              key={item.label}
              onClick={onNavigate}
              {...uxPrimitiveInteractionAttributesFor(active ? "selected" : "focus-visible")}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span className="min-w-0 flex-1 leading-5">{item.label}</span>
            </a>
          );
        })}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Primary navigation"
      className={cn(
        "grid gap-4 pb-1 sm:grid-cols-2 md:grid-cols-3 lg:min-h-0 lg:flex lg:flex-1 lg:flex-col lg:gap-4 lg:overflow-y-auto lg:pr-1",
        className
      )}
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
              <p className="min-w-0 text-left leading-4">{group.label}</p>
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
                  {group.lockedLabel ?? "Role-gated workspace"}
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
                        ? cn("border-alphavest-gold/55 bg-alphavest-gold/12 text-alphavest-gold-soft", uxPrimitiveInteractionClassFor("selected"))
                        : "border-transparent text-alphavest-muted hover:border-alphavest-border hover:bg-alphavest-panel-soft/70 hover:text-alphavest-ivory",
                      item.tier === "secondary" && !active && "text-alphavest-subtle hover:text-alphavest-muted",
                      uxPrimitiveInteractionClassFor("focus-visible"),
                    )}
                    data-navigation-item-tier={item.tier}
                    href={item.href}
                    key={item.label}
                    onClick={onNavigate}
                    {...uxPrimitiveInteractionAttributesFor(active ? "selected" : "focus-visible")}
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
  );
}

export function ProcessSidebar({ className, footer }: ProcessSidebarProps) {
  return (
    <aside
      className={cn(
        "hidden min-h-screen border-r border-alphavest-border/60 bg-alphavest-navy/88 p-5 lg:flex lg:w-[var(--sidebar-width)] lg:flex-col",
        className
      )}
    >
      <AlphaVestMark />
      <ProcessNavigation variant="compact" />
      {footer ? <div className="mt-6">{footer}</div> : null}
    </aside>
  );
}
