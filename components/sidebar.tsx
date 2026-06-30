"use client";

import { CircleCheck, X } from "lucide-react";
import { AlphaVestMark, ProcessNavigation } from "@/components/process-navigation";
import { cn } from "@/lib/cn";

function NavigationContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <AlphaVestMark />
      <ProcessNavigation onNavigate={onNavigate} />

      <div className="hidden rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/72 p-4 lg:block">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-alphavest-gold-soft">
          <CircleCheck aria-hidden="true" className="size-4" />
          System status
        </div>
        <p className="text-xs leading-5 text-alphavest-muted">
          Workspace services operational. Important actions remain audited.
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
