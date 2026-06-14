"use client";

import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-av-midnight text-av-ivory">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-av-gold focus:px-4 focus:py-2 focus:text-av-midnight"
        href="#main-content"
      >
        Skip to content
      </a>
      <main id="main-content">{children}</main>
    </div>
  );
}
