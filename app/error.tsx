"use client";

import { RotateCcw } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { StatePanel } from "@/components/ui/state-panel";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <AppShell>
      <div className="space-y-4">
        <StatePanel
          detail={error.digest ? `Reference ${error.digest}` : "The current view could not be rendered."}
          state="error"
          title="Workspace error"
        />
        <button
          className="inline-flex items-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal px-3 py-2 text-sm font-semibold text-alphavest-ink transition hover:border-alphavest-blue/70 hover:text-white"
          onClick={reset}
          type="button"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          Retry
        </button>
      </div>
    </AppShell>
  );
}
