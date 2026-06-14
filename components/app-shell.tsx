"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { v2Routes } from "@/lib/v2-model";
import { regulatoryDisclaimers } from "@/lib/workflows";
import { cn } from "./ui";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-av-midnight text-av-ivory">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-av-gold focus:px-4 focus:py-2 focus:text-av-midnight"
        href="#main-content"
      >
        Skip to content
      </a>
      <div className="border-b border-av-line bg-av-midnight/95 px-4 py-2 text-center text-xs text-av-ivory md:text-sm">
        {regulatoryDisclaimers[0]}
      </div>
      <div className="flex min-h-[calc(100vh-2rem)] flex-col xl:flex-row">
        <aside className="border-b border-av-line bg-av-navy/82 px-4 py-4 xl:sticky xl:top-0 xl:h-screen xl:w-72 xl:border-b-0 xl:border-r">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-lg border border-av-gold text-sm font-semibold text-av-gold">
              AV
            </div>
            <div>
              <p className="font-display text-xl text-av-goldBright">
                AlphaVest WealthOS
              </p>
              <p className="text-xs uppercase text-av-muted">
                v2 UX model
              </p>
            </div>
          </div>
          <nav className="mt-6 grid gap-1 text-sm" aria-label="Demo routes">
            {v2Routes.map((route) => {
              const active = pathname === route.path;

              return (
                <Link
                  key={route.path}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-3 py-2 transition",
                    active
                      ? "border-av-gold bg-av-gold/12 text-av-goldBright"
                      : "border-transparent text-av-muted hover:border-av-line hover:text-av-ivory"
                  )}
                  href={route.path}
                >
                  <span>{route.label}</span>
                  <span className="font-mono text-xs">{route.priority}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 rounded-lg border border-av-line bg-av-panel/60 p-3 text-xs text-av-muted">
            <p className="font-semibold text-av-goldBright">Global guardrails</p>
            <p className="mt-2">{regulatoryDisclaimers[2]}</p>
            <p className="mt-2">{regulatoryDisclaimers[3]}</p>
          </div>
        </aside>
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
