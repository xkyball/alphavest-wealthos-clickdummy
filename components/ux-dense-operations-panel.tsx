import { Card, CardContent, CardHeader, CardTitle, StatePanel } from "@/components/ui";
import { cn } from "@/lib/cn";
import { uxDensityForPageId } from "@/lib/ux-density";

type UxDenseOperationsPanelProps = {
  actions?: React.ReactNode;
  children: React.ReactNode;
  chrome?: "standard" | "none";
  className?: string;
  controls?: string[];
  description?: string;
  pageId: string;
  resultLabel: string;
  safetyNote: string;
  title: string;
};

export function UxDenseOperationsPanel({
  actions,
  children,
  chrome = "standard",
  className,
  controls = [],
  description,
  pageId,
  resultLabel,
  safetyNote,
  title,
}: UxDenseOperationsPanelProps) {
  const density = uxDensityForPageId(pageId);

  if (chrome === "none") {
    return (
      <section
        className={cn("space-y-2", className)}
        data-testid="ux-d3-dense-operations"
        data-ux-d3-dense-operations="true"
        data-ux-density-pattern={density.pattern}
        data-ux-density-tier={density.tier}
      >
        {description ? <p className="sr-only">{description}</p> : null}
        {children}
      </section>
    );
  }

  return (
    <section
      className={cn("space-y-3", className)}
      data-testid="ux-d3-dense-operations"
      data-ux-d3-dense-operations="true"
      data-ux-density-pattern={density.pattern}
      data-ux-density-tier={density.tier}
    >
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <CardTitle>{title}</CardTitle>
            {description ? <p className="sr-only">{description}</p> : null}
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">{resultLabel}</p>
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
        </CardHeader>
        {controls.length > 0 ? (
          <CardContent className="pt-0">
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4" data-testid="ux-d3-filter-sort-controls">
              {controls.map((control) => (
                <div
                  aria-label={`${control} table scope`}
                  className="flex h-10 items-center justify-between gap-2 rounded-md border border-alphavest-border bg-alphavest-navy/35 px-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-alphavest-muted"
                  key={control}
                  role="note"
                >
                  <span className="truncate">{control}</span>
                  <span aria-hidden="true" className="text-alphavest-subtle">Scope</span>
                </div>
              ))}
            </div>
          </CardContent>
        ) : null}
      </Card>
      {children}
      <StatePanel detail={safetyNote} state="restricted" title="Dense operations safety gate" />
    </section>
  );
}
