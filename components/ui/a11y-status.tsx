import { cn } from "@/lib/cn";

type A11yStatusSupportPanelProps = {
  className?: string;
  routeLabel: string;
  statusAnnouncement: string;
  taskIds: string[];
};

export function A11yStatusSupportPanel({
  className,
  routeLabel,
  statusAnnouncement,
  taskIds,
}: A11yStatusSupportPanelProps) {
  return (
    <section
      aria-label="Keyboard and status support"
      className={cn(
        "sr-only",
        className,
      )}
      data-testid="ux-phase10-a11y-support"
      data-ux-a11y-keyboard="tab-escape-cancel-return"
      data-ux-a11y-status="polite-live-region"
      data-ux-phase10-tasks={taskIds.join(" ")}
    >
      <p aria-live="polite" className="sr-only" data-testid="ux-phase10-live-status" role="status">
        {statusAnnouncement}
      </p>
      <span data-testid="ux-phase10-route-label" hidden>{routeLabel}</span>
    </section>
  );
}
