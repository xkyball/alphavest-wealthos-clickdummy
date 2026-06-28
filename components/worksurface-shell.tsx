import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageTemplateFrame,
  PageTemplateSectionNav,
  PageTemplateSummaryRail,
  StatePanel,
  type BadgeTone,
  type PageTemplateSection,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { uxActionAttributesFor } from "@/lib/ux-action-hierarchy-contract";
import { uxClientSafeFamilyForPageId } from "@/lib/ux-client-safe-ui-boundary";
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
  const isClientSafeSurface = Boolean(uxClientSafeFamilyForPageId(routeId));
  const clientSafeStatusItems = isClientSafeSurface
    ? statusItems.filter((item) => !["route", "route id", "page id"].includes(item.label.toLowerCase()))
    : statusItems;
  const railPlacement = template.actionZoneBehavior === "sticky_action_zone" ? "sticky_rail" : "adjacent_rail";
  const sectionIds = {
    action: `${worksurfaceId}-action`,
    primary: `${worksurfaceId}-primary`,
    state: `${worksurfaceId}-state`,
    summary: `${worksurfaceId}-summary`,
  };
  const sections: PageTemplateSection[] = [
    { id: sectionIds.summary, label: "Summary", description: "Template summary zone" },
    { id: sectionIds.primary, label: "Work", description: "Primary work zone" },
    ...(rail ? [{ id: sectionIds.action, label: "Actions", description: "Gated action zone" }] : []),
    { id: sectionIds.state, label: "State", description: "Safety state zone" },
  ];
  const railActionAttributes = uxActionAttributesFor({
    availability: "blocked_static",
    disabledReason: safetyNote,
    meaning: "navigate",
    placement: railPlacement,
    priority: "blocked",
    requiresPermission: false,
  });

  return (
    <PageTemplateFrame
      className={cn("mx-auto max-w-[112rem] space-y-4", className)}
      data-testid="wp02-worksurface-shell"
      template={template}
      data-wp02-route-id={routeId}
      data-wp02-worksurface={worksurfaceId}
    >
      <div
        id={sectionIds.summary}
        className="rounded-md border border-alphavest-border/70 bg-alphavest-panel/58 p-4"
        data-ux-long-page-anchor="summary"
        data-ux-template-zone="summary"
      >
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-start 2xl:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alphavest-gold">{eyebrow}</p>
            <h2 className="mt-2 font-display text-3xl leading-tight text-alphavest-ivory">{title}</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-alphavest-muted">{description}</p>
          </div>
          <PageTemplateSummaryRail actions={actions} items={clientSafeStatusItems} />
        </div>
      </div>
      <PageTemplateSectionNav sections={sections} />
      <div className={cn("grid gap-4", rail ? "xl:grid-cols-[minmax(0,1fr)_24rem]" : "")}>
        <div id={sectionIds.primary} className="min-w-0 space-y-4" data-ux-long-page-anchor="primary" data-ux-template-zone="primary_content">
          {primary}
          {secondary}
          {children}
        </div>
        {rail ? (
          <aside
            id={sectionIds.action}
            className="min-w-0 space-y-4 xl:sticky xl:top-24 xl:self-start"
            data-testid="wp02-worksurface-rail"
            {...railActionAttributes}
            data-ux-long-page-region="sticky_rail"
            data-ux-sticky-action-zone={template.actionZoneBehavior === "adjacent_action_rail" || template.actionZoneBehavior === "sticky_action_zone" ? "true" : undefined}
            data-ux-template-zone="action_zone"
          >
            {rail}
          </aside>
        ) : null}
      </div>
      <div id={sectionIds.state} data-ux-long-page-anchor="state" data-ux-template-zone="state_zone">
        <StatePanel
          detail={safetyNote}
          state="restricted"
          testId="wp02-worksurface-safety-boundary"
          title={isClientSafeSurface ? "Client-safe availability" : "Worksurface safety boundary"}
        />
      </div>
    </PageTemplateFrame>
  );
}
