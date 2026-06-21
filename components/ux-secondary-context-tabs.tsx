"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

type UxSecondaryContextTab = {
  content: React.ReactNode;
  id: string;
  label: string;
  tone?: "default" | "warning";
};

type UxSecondaryContextTabsProps = {
  safetyNote: string;
  tabs: UxSecondaryContextTab[];
  title: string;
};

export function UxSecondaryContextTabs({ safetyNote, tabs, title }: UxSecondaryContextTabsProps) {
  const generatedId = useId();
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? "");
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  if (!activeTab) {
    return null;
  }

  return (
    <section className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/30 p-3" data-testid="ux-complexity-secondary-tabs" data-ux-content-tier="tertiary">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-alphavest-gold">{title}</p>
        <p className="text-xs leading-5 text-alphavest-muted" data-testid="ux-complexity-secondary-safety-note" data-ux-content-tier="must-see">{safetyNote}</p>
      </div>
      <div aria-label={title} className="mt-4 flex flex-wrap gap-2" data-testid="ux-complexity-secondary-tablist" role="tablist">
        {tabs.map((tab) => {
          const selected = tab.id === activeTab.id;

          return (
            <button
              aria-controls={`${generatedId}-${tab.id}-panel`}
              aria-selected={selected}
              className={cn(
                "h-9 rounded-md border px-3 text-xs font-semibold transition",
                selected
                  ? "border-alphavest-gold bg-alphavest-gold/12 text-alphavest-gold-soft"
                  : tab.tone === "warning"
                    ? "border-alphavest-red/40 bg-alphavest-red/10 text-alphavest-red"
                    : "border-alphavest-border bg-alphavest-charcoal/65 text-alphavest-muted hover:border-alphavest-gold/45 hover:text-alphavest-ivory",
              )}
              data-testid="ux-complexity-secondary-tab"
              id={`${generatedId}-${tab.id}-tab`}
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        aria-labelledby={`${generatedId}-${activeTab.id}-tab`}
        className="mt-4 rounded-md border border-alphavest-border/60 bg-alphavest-panel/45 p-4"
        data-testid="ux-complexity-secondary-active-panel"
        data-ux-content-tier="secondary"
        id={`${generatedId}-${activeTab.id}-panel`}
        role="tabpanel"
      >
        {activeTab.content}
      </div>
    </section>
  );
}
