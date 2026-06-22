import { cn } from "@/lib/cn";

type CardProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  className?: string;
};

type UxDensityProofPanelProps = {
  className?: string;
  densityTier: string;
  hierarchy: string;
  nextStepLabel?: string;
  pageJob: string;
  pattern: string;
  safetyRetention: string;
  statusLabel: string;
  taskId: string;
};

export function Card({ children, className, ...props }: CardProps) {
  return <section className={cn("alpha-card min-w-0 p-[var(--card-padding)]", className)} {...props}>{children}</section>;
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("border-b border-alphavest-border/60 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: CardProps) {
  return <h2 className={cn("font-display text-2xl text-alphavest-ivory", className)} {...props}>{children}</h2>;
}

export function CardDescription({ children, className, ...props }: CardProps) {
  return <p className={cn("mt-1 text-sm leading-6 text-alphavest-muted", className)} {...props}>{children}</p>;
}

export function CardContent({ children, className, ...props }: CardProps) {
  return <div className={cn("mt-5 min-w-0", className)} {...props}>{children}</div>;
}

export function UxDensityProofPanel({
  className,
  densityTier,
  hierarchy,
  nextStepLabel,
  pageJob,
  pattern,
  safetyRetention,
  statusLabel,
  taskId,
}: UxDensityProofPanelProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-alphavest-border/65 bg-alphavest-navy/30 p-3 text-xs leading-5 text-alphavest-muted",
        className,
      )}
      data-testid="ux-phase9-density-proof"
      data-ux-density-pattern={pattern}
      data-ux-density-tier={densityTier}
      data-ux-phase9-task={taskId}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-alphavest-gold/35 bg-alphavest-gold/10 px-2 py-0.5 font-semibold text-alphavest-gold-soft">
          Phase 9
        </span>
        <span className="rounded-full border border-alphavest-border/70 bg-alphavest-charcoal/55 px-2 py-0.5 font-semibold text-alphavest-ivory">
          {densityTier} · {pattern}
        </span>
      </div>
      <dl className="grid gap-2">
        <div data-testid="ux-phase9-page-job">
          <dt className="font-semibold text-alphavest-subtle">Page job</dt>
          <dd className="text-alphavest-ivory">{pageJob}</dd>
        </div>
        <div data-testid="ux-phase9-status">
          <dt className="font-semibold text-alphavest-subtle">Status</dt>
          <dd>{statusLabel}</dd>
        </div>
        <div data-testid="ux-phase9-next-step">
          <dt className="font-semibold text-alphavest-subtle">Next step</dt>
          <dd>{nextStepLabel ?? "Resolve the current gate before any downstream release, export or client-visible claim."}</dd>
        </div>
        <div data-testid="ux-phase9-hierarchy">
          <dt className="font-semibold text-alphavest-subtle">Density hierarchy</dt>
          <dd>{hierarchy}</dd>
        </div>
        <div data-testid="ux-phase9-safety-retained">
          <dt className="font-semibold text-alphavest-subtle">Safety retained</dt>
          <dd>{safetyRetention}</dd>
        </div>
      </dl>
    </div>
  );
}
