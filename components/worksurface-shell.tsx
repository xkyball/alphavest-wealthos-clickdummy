import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, StatePanel, type BadgeTone } from "@/components/ui";
import { cn } from "@/lib/cn";
import { uxPageTemplateForPageId } from "@/lib/ux-page-template-system";

type WorksurfaceStatusItem = {
  label: string;
  tone?: BadgeTone;
  value: string;
};

type WorksurfaceShellProps = {
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  description: string;
  eyebrow: string;
  primary: React.ReactNode;
  rail?: React.ReactNode;
  routeId: string;
  safetyNote: string;
  secondary?: React.ReactNode;
  statusItems?: WorksurfaceStatusItem[];
  title: string;
  worksurfaceId: string;
};

type WorksurfacePanelProps = {
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  description?: string;
  testId?: string;
  title: string;
};

export function WorksurfacePanel({ actions, children, className, description, testId, title }: WorksurfacePanelProps) {
  return (
    <Card className={className} data-testid={testId}>
      <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <CardTitle className="text-xl">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function WorksurfaceShell({
  actions,
  children,
  className,
  description,
  eyebrow,
  primary,
  rail,
  routeId,
  safetyNote,
  secondary,
  statusItems = [],
  title,
  worksurfaceId,
}: WorksurfaceShellProps) {
  const template = uxPageTemplateForPageId(routeId);

  return (
    <section
      className={cn("mx-auto max-w-[112rem] space-y-4", className)}
      data-testid="wp02-worksurface-shell"
      data-ux-page-template-action-zone={template.actionZoneBehavior}
      data-ux-page-template-family={template.family}
      data-ux-page-template-long-page={template.longPageBehavior}
      data-ux-page-template-proof-audit={template.proofAuditPlacement}
      data-ux-page-template-required-zones={template.requiredZones.join(" ")}
      data-wp02-route-id={routeId}
      data-wp02-worksurface={worksurfaceId}
    >
      <div className="rounded-md border border-alphavest-border/70 bg-alphavest-panel/58 p-4">
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-start 2xl:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-gold">{eyebrow}</p>
            <h2 className="mt-2 font-display text-3xl leading-tight text-alphavest-ivory">{title}</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-alphavest-muted">{description}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 lg:items-end">
            {statusItems.length ? (
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {statusItems.map((item) => (
                  <Badge key={`${item.label}-${item.value}`} tone={item.tone ?? "muted"}>
                    {item.label}: {item.value}
                  </Badge>
                ))}
              </div>
            ) : null}
            {actions ? <div className="flex flex-wrap gap-2 lg:justify-end">{actions}</div> : null}
          </div>
        </div>
      </div>
      <div className={cn("grid gap-4", rail ? "2xl:grid-cols-[minmax(0,1fr)_24rem]" : "")}>
        <div className="min-w-0 space-y-4">
          {primary}
          {secondary}
          {children}
        </div>
        {rail ? (
          <aside className="min-w-0 space-y-4 2xl:sticky 2xl:top-24 2xl:self-start" data-testid="wp02-worksurface-rail">
            {rail}
          </aside>
        ) : null}
      </div>
      <StatePanel
        detail={safetyNote}
        state="restricted"
        testId="wp02-worksurface-safety-boundary"
        title="Worksurface safety boundary"
      />
    </section>
  );
}
