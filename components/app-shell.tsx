"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { DemoSessionProvider } from "@/components/demo-session-provider";
import { OperationalDefaultSurface } from "@/components/operational-default-surface";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [navigationOpen, setNavigationOpen] = useState(false);

  return (
    <DemoSessionProvider>
      <div className="av-surface av-surface-app av-shell-grid overflow-x-hidden">
        <Sidebar mobileOpen={navigationOpen} onMobileClose={() => setNavigationOpen(false)} />
        <div className="min-w-0">
          <TopBar onOpenNavigation={() => setNavigationOpen(true)} />
          <main className="min-w-0 px-4 py-5 md:px-6 lg:px-8 lg:py-7">
            <OperationalDefaultSurface>{children}</OperationalDefaultSurface>
          </main>
        </div>
      </div>
    </DemoSessionProvider>
  );
}
