"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/cn";
import type { UxProofReviewerVisibilityMode } from "@/lib/ux-proof-reviewer-mode";
import { Badge } from "./badge";

export type ProofReviewerPanelMetadataItem = {
  label: string;
  tone?: "blue" | "gold" | "green" | "muted" | "purple" | "red" | "teal";
  value: string;
};

type ProofReviewerPanelProps = {
  children?: React.ReactNode;
  className?: string;
  defaultCollapsed?: boolean;
  metadata: readonly ProofReviewerPanelMetadataItem[];
  mode: UxProofReviewerVisibilityMode;
  noOverclaim: string;
  routeId?: string;
  suppressedInClientMode?: readonly string[];
  title: string;
};

export function ProofReviewerPanel({
  children,
  className,
  defaultCollapsed = true,
  metadata,
  mode,
  noOverclaim,
  routeId,
  suppressedInClientMode = [],
  title,
}: ProofReviewerPanelProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [closed, setClosed] = useState(false);

  if (mode !== "reviewer_secondary" || closed) {
    return null;
  }

  return (
    <section
      className={cn("rounded-md border border-alphavest-border/70 bg-alphavest-panel/72 p-4", className)}
      data-testid="proof-reviewer-panel"
      data-ux-proof-default-visible="false"
      data-ux-proof-forbidden-in-client-mode="true"
      data-ux-proof-mode={mode}
      data-ux-proof-panel-collapsed={collapsed ? "true" : "false"}
      data-ux-proof-panel-close-available="true"
      data-ux-proof-route-id={routeId}
      data-ux-proof-suppressed-in-client={suppressedInClientMode.join(" ")}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-gold">Reviewer mode</p>
          <h2 className="mt-1 font-display text-xl text-alphavest-ivory">{title}</h2>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            aria-expanded={!collapsed}
            className="rounded-md border border-alphavest-border/70 px-3 py-2 text-xs font-semibold text-alphavest-muted transition hover:border-alphavest-gold/60 hover:text-alphavest-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alphavest-gold"
            data-ux-proof-panel-toggle="collapse"
            onClick={() => setCollapsed((current) => !current)}
            type="button"
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
          <button
            aria-label="Close reviewer panel"
            className="grid size-9 place-items-center rounded-md border border-alphavest-border/70 text-alphavest-muted transition hover:border-alphavest-red/60 hover:text-alphavest-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alphavest-gold"
            data-ux-proof-panel-toggle="close"
            onClick={() => setClosed(true)}
            type="button"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
      {!collapsed ? (
        <div className="mt-4 space-y-3 text-sm leading-6 text-alphavest-muted">
          <div className="flex flex-wrap gap-2">
            {metadata.map((item) => (
              <Badge data-ux-proof-panel-metadata={item.label} key={`${item.label}-${item.value}`} tone={item.tone ?? "muted"}>
                {item.label}: {item.value}
              </Badge>
            ))}
          </div>
          <p>{noOverclaim}</p>
          {children}
        </div>
      ) : null}
    </section>
  );
}
