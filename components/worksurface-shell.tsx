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
import { processFirstUxRouteContractByPageId } from "@/lib/process-first-ux-contract";
import { uxActionAttributesFor } from "@/lib/ux-action-hierarchy-contract";
import { uxClientSafeFamilyForPageId } from "@/lib/ux-client-safe-ui-boundary";
import {
  uxPageTemplateForPageId,
  type UxActiveStep,
  type UxLongScreenException,
  type UxPageJob,
  type UxPageTemplateRecord,
  type UxPageTemplateZone,
} from "@/lib/ux-page-template-system";

type WorksurfaceStatusItem = {
  label: string;
  tone?: BadgeTone;
  value: string;
};

type WorksurfaceShellProps = {
  actions?: React.ReactNode;
  activeStep?: UxActiveStep;
  children?: React.ReactNode;
  childrenPolicy?: WorksurfaceChildrenPolicy;
  className?: string;
  density?: "standard" | "compact";
  description: string;
  eyebrow: string;
  longScreenException?: UxLongScreenException;
  pageJob?: UxPageJob;
  primary: React.ReactNode;
  rail?: React.ReactNode;
  routeId: string;
  safetyNote: string;
  secondary?: React.ReactNode;
  statusItems?: WorksurfaceStatusItem[];
  title: string;
  worksurfaceId: string;
};

type WorksurfaceChildrenPolicy =
  | "proof_audit"
  | "reference_context"
  | "secondary_context"
  | "step_support";

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

function defaultChildrenPolicyForTemplate(template: UxPageTemplateRecord): WorksurfaceChildrenPolicy {
  if (!template.productiveUxEligible) return "reference_context";
  if (template.proofAuditPlacement === "primary_detail_zone" || template.requiredZones.includes("proof_audit_zone")) return "proof_audit";
  if (template.family === "workflow_stepper") return "step_support";

  return "secondary_context";
}

function zoneForChildrenPolicy(policy: WorksurfaceChildrenPolicy): UxPageTemplateZone {
  if (policy === "proof_audit") return "proof_audit_zone";

  return "secondary_content";
}

export function WorksurfaceShell({
  actions,
  activeStep,
  children,
  childrenPolicy,
  className,
  density = "standard",
  description,
  eyebrow,
  longScreenException,
  pageJob,
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
  const isProcessFirstCritical = processFirstUxRouteContractByPageId.has(routeId);
  const isCompact = density === "compact" || isProcessFirstCritical;
  const resolvedActiveStep = activeStep ?? template.activeStep;
  const resolvedChildrenPolicy = childrenPolicy ?? defaultChildrenPolicyForTemplate(template);
  const resolvedChildrenZone = zoneForChildrenPolicy(resolvedChildrenPolicy);
  const resolvedPageJob = pageJob ?? template.pageJob;
  const isClientSafeSurface = Boolean(uxClientSafeFamilyForPageId(routeId));
  const clientSafeStatusItems = isClientSafeSurface
    ? statusItems.filter((item) => !["route", "route id", "page id"].includes(item.label.toLowerCase()))
    : statusItems;
  const railPlacement = template.actionZoneBehavior === "sticky_action_zone" ? "sticky_rail" : "adjacent_rail";
  const sectionIds = {
    action: `${worksurfaceId}-action`,
    children: `${worksurfaceId}-children`,
    primary: `${worksurfaceId}-primary`,
    secondary: `${worksurfaceId}-secondary`,
    state: `${worksurfaceId}-state`,
    summary: `${worksurfaceId}-summary`,
  };
  const sections: PageTemplateSection[] = [
    { id: sectionIds.summary, label: "Summary", description: "Template summary zone" },
    { id: sectionIds.primary, label: "Work", description: "Primary work zone" },
    ...(secondary ? [{ id: sectionIds.secondary, label: "Context", description: "Secondary content slot" }] : []),
    ...(children ? [{ id: sectionIds.children, label: "Support", description: "Classified child slot" }] : []),
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
      className={cn("mx-auto max-w-[112rem]", isCompact ? "space-y-2" : "space-y-4", className)}
      data-testid="wp02-worksurface-shell"
      template={template}
      data-ux-active-step={resolvedActiveStep}
      data-ux-has-classified-children={children ? "true" : "false"}
      data-ux-children-policy={children ? resolvedChildrenPolicy : "none"}
      data-ux-children-zone={children ? resolvedChildrenZone : "none"}
      data-ux-long-screen-exception={longScreenException ? "declared" : "none"}
      data-ux-long-screen-exception-expires={longScreenException?.expiresWhen}
      data-ux-long-screen-exception-follow-up={longScreenException?.followUpTaskId}
      data-ux-long-screen-exception-owner={longScreenException?.owner}
      data-ux-long-screen-exception-reason={longScreenException?.reason}
      data-ux-operational-summary-banner={isCompact ? "none" : "standard"}
      data-ux-page-job={resolvedPageJob}
      data-ux-unbounded-children="false"
      data-wp02-route-id={routeId}
      data-wp02-worksurface={worksurfaceId}
    >
      {isCompact ? null : (
        <div
          id={sectionIds.summary}
          className="rounded-md border border-alphavest-border/70 bg-alphavest-panel/58 p-4"
          data-testid="wp02-worksurface-summary-banner"
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
      )}
      {isCompact ? null : <PageTemplateSectionNav sections={sections} />}
      <div className={cn("grid", isCompact ? "gap-2" : "gap-4", rail ? "xl:grid-cols-[minmax(0,1fr)_24rem]" : "")}>
        <div className={cn("min-w-0", isCompact ? "space-y-2" : "space-y-4")}>
          <section id={sectionIds.primary} data-ux-long-page-anchor="primary" data-ux-template-zone="primary_content">
            {primary}
          </section>
          {secondary ? (
            <section id={sectionIds.secondary} data-ux-long-page-anchor="secondary" data-ux-template-zone="secondary_content">
              {secondary}
            </section>
          ) : null}
          {children ? (
            <section
              id={sectionIds.children}
              data-ux-children-policy={resolvedChildrenPolicy}
              data-ux-classified-children="true"
              data-ux-long-page-anchor={resolvedChildrenZone === "proof_audit_zone" ? "proof-audit" : "secondary"}
              data-ux-template-zone={resolvedChildrenZone}
            >
              {children}
            </section>
          ) : null}
        </div>
        {rail ? (
          <aside
            id={sectionIds.action}
            className={cn("min-w-0 xl:sticky xl:top-24 xl:self-start", isCompact ? "space-y-2" : "space-y-4")}
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
      {isCompact ? null : (
        <div id={sectionIds.state} data-ux-long-page-anchor="state" data-ux-template-zone="state_zone">
          <StatePanel
            detail={safetyNote}
            state="restricted"
            testId="wp02-worksurface-safety-boundary"
            title={isClientSafeSurface ? "Client-safe availability" : "Worksurface safety boundary"}
          />
        </div>
      )}
    </PageTemplateFrame>
  );
}
