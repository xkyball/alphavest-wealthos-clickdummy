import { cn } from "@/lib/cn";
import type { UxPageTemplateRecord } from "@/lib/ux-page-template-system";
import { uxProofReviewerClientSuppressionForPageId } from "@/lib/ux-proof-reviewer-mode";
import { Badge, type BadgeTone } from "./badge";

export type PageTemplateSection = {
  description?: string;
  id: string;
  label: string;
};

type PageTemplateFrameProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  className?: string;
  template: UxPageTemplateRecord;
};

type PageTemplateSectionNavProps = React.HTMLAttributes<HTMLElement> & {
  ariaLabel?: string;
  className?: string;
  sections: readonly PageTemplateSection[];
};

type PageTemplateSummaryRailItem = {
  label: string;
  tone?: BadgeTone;
  value: string;
};

type PageTemplateSummaryRailProps = React.HTMLAttributes<HTMLElement> & {
  actions?: React.ReactNode;
  className?: string;
  items: readonly PageTemplateSummaryRailItem[];
};

export function PageTemplateFrame({ children, className, template, ...props }: PageTemplateFrameProps) {
  const clientSuppression = uxProofReviewerClientSuppressionForPageId(template.pageId);

  return (
    <section
      data-ux-client-mode={clientSuppression.applies ? "client_mode" : undefined}
      data-ux-client-mode-missing-suppression={clientSuppression.missingRequiredSuppressions.join(" ")}
      data-ux-client-mode-suppressed={clientSuppression.suppressedContent.join(" ")}
      data-ux-page-template-action-zone={template.actionZoneBehavior}
      data-ux-page-template-family={template.family}
      data-ux-page-template-long-page={template.longPageBehavior}
      data-ux-page-template-proof-audit={template.proofAuditPlacement}
      data-ux-page-template-required-zones={template.requiredZones.join(" ")}
      data-ux-page-template-renderer="PageTemplateFrame"
      {...props}
      className={cn("mx-auto max-w-[112rem] space-y-4", className)}
    >
      {children}
    </section>
  );
}

export function PageTemplateSectionNav({
  ariaLabel = "Page sections",
  className,
  sections,
  ...props
}: PageTemplateSectionNavProps) {
  if (!sections.length) return null;

  return (
    <nav
      aria-label={ariaLabel}
      data-ux-long-page-section-nav="true"
      {...props}
      className={cn("flex min-w-0 flex-wrap gap-2", className)}
    >
      {sections.map((section) => (
        <a
          className="rounded-md border border-alphavest-border/70 bg-alphavest-panel/64 px-3 py-2 text-xs font-semibold text-alphavest-muted transition hover:border-alphavest-gold/60 hover:text-alphavest-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alphavest-gold"
          data-ux-long-page-section-link={section.id}
          href={`#${section.id}`}
          key={section.id}
          title={section.description}
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
}

export function PageTemplateSummaryRail({
  actions,
  className,
  items,
  ...props
}: PageTemplateSummaryRailProps) {
  if (!items.length && !actions) return null;

  return (
    <aside
      data-ux-page-template-summary-rail="true"
      {...props}
      className={cn("flex shrink-0 flex-col gap-3 lg:items-end", className)}
    >
      {items.length ? (
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {items.map((item) => (
            <Badge data-ux-page-template-summary-item={item.label} key={`${item.label}-${item.value}`} tone={item.tone ?? "muted"}>
              {item.label}: {item.value}
            </Badge>
          ))}
        </div>
      ) : null}
      {actions ? <div className="flex flex-wrap gap-2 lg:justify-end">{actions}</div> : null}
    </aside>
  );
}
