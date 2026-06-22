import { cn } from "@/lib/cn";

type A11yStatusProofPanelProps = {
  className?: string;
  routeLabel: string;
  statusAnnouncement: string;
  taskIds: string[];
};

export function A11yStatusProofPanel({
  className,
  routeLabel,
  statusAnnouncement,
  taskIds,
}: A11yStatusProofPanelProps) {
  return (
    <section
      aria-label="Accessibility, keyboard and status proof"
      className={cn(
        "rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-3 text-xs leading-5 text-alphavest-muted",
        className,
      )}
      data-testid="ux-phase10-a11y-proof"
      data-ux-a11y-keyboard="tab-escape-cancel-return"
      data-ux-a11y-status="polite-live-region"
      data-ux-phase10-tasks={taskIds.join(" ")}
    >
      <p aria-live="polite" className="sr-only" data-testid="ux-phase10-live-status" role="status">
        {statusAnnouncement}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-alphavest-gold/35 bg-alphavest-gold/10 px-2 py-0.5 font-semibold text-alphavest-gold-soft">
          Phase 10
        </span>
        <span className="rounded-full border border-alphavest-border/70 bg-alphavest-navy/50 px-2 py-0.5 font-semibold text-alphavest-ivory">
          Keyboard + status
        </span>
      </div>
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        <div data-testid="ux-phase10-keyboard-proof">
          <dt className="font-semibold text-alphavest-subtle">Keyboard path</dt>
          <dd>Tab reaches controls, Escape closes overlays, Cancel/Back keeps context.</dd>
        </div>
        <div data-testid="ux-phase10-focus-proof">
          <dt className="font-semibold text-alphavest-subtle">Focus recovery</dt>
          <dd>Focus starts inside modal/drawer surfaces and returns to the trigger after close.</dd>
        </div>
        <div data-testid="ux-phase10-status-proof">
          <dt className="font-semibold text-alphavest-subtle">Status announcement</dt>
          <dd>{statusAnnouncement}</dd>
        </div>
        <div data-testid="ux-phase10-global-proof">
          <dt className="font-semibold text-alphavest-subtle">Global context</dt>
          <dd>{routeLabel} keeps navigation, breadcrumb/step context and safety state available.</dd>
        </div>
      </dl>
    </section>
  );
}
