"use client";

import Link from "next/link";
import { ArrowRight, LockKeyhole, RotateCcw } from "lucide-react";
import { usePathname } from "next/navigation";
import { A11yStatusSupportPanel } from "@/components/ui/a11y-status";
import { DisabledControlReason, disabledControlReasonId } from "@/components/ui/disabled-control-reason";
import { StatusChip, type StatusChipStatus } from "@/components/ui/status-chip";
import { WizardStepper, type WizardStep } from "@/components/ui/wizard-stepper";
import { cn } from "@/lib/cn";
import { matchRouteBySegments, routeScopeForPageId, routeScopeLabels } from "@/lib/route-registry";
import { uxFlowStepsForPageId, uxRoutePolicyForRoute, uxWorkspaceLabels } from "@/lib/ux-route-policy";

export type PageHeaderAction = {
  disabledReason?: string;
  href?: string;
  label: string;
  onClick?: () => void;
};

type PageHeaderProps = {
  blockedReason?: string;
  chrome?: "full" | "compact";
  eyebrow?: string;
  primaryAction?: PageHeaderAction;
  recoveryAction?: PageHeaderAction;
  secondaryActions?: PageHeaderAction[];
  status?: StatusChipStatus;
  statusLabel?: string;
  steps?: WizardStep[];
  title: string;
  description: string;
};

const defaultUnwiredActionReason = "This action is held until an authorized lifecycle is wired.";

function routeForPathname(pathname: string) {
  const cleanPath = pathname.split("?")[0]?.split("#")[0] ?? "/";
  const normalized = cleanPath.length > 1 ? cleanPath.replace(/\/+$/, "") : cleanPath;

  if (normalized === "/") return null;

  return matchRouteBySegments(normalized.split("/").filter(Boolean)) ?? null;
}

function HeaderAction({ action, primary = false, recovery = false }: { action: PageHeaderAction; primary?: boolean; recovery?: boolean }) {
  const hasLifecycle = Boolean(action.href || action.onClick);
  const disabledReason = action.disabledReason ?? (!hasLifecycle ? defaultUnwiredActionReason : undefined);
  const disabledReasonId = disabledReason ? disabledControlReasonId(`page-header-${action.label}`) : undefined;
  const className = cn(
    "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition",
    primary
      ? "bg-alphavest-gold text-alphavest-navy hover:bg-alphavest-gold-soft"
      : "border border-alphavest-border bg-alphavest-charcoal/70 text-alphavest-ivory hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft",
    disabledReason && "cursor-not-allowed opacity-60 hover:border-alphavest-border hover:text-alphavest-ivory"
  );

  if (disabledReason) {
    return (
      <span
        aria-describedby={disabledReasonId}
        aria-label={`${action.label}: ${disabledReason}`}
        className={className}
        data-ux-cta-kind={primary ? "primary" : recovery ? "recovery" : "secondary"}
        data-ux-disabled-message="accessible"
        data-ux-disabled-reason={disabledReason}
        data-ux-interactive="false"
        data-ux-primary-cta={primary ? "true" : undefined}
        data-ux-secondary-cta={!primary ? "true" : undefined}
        role="status"
        title={disabledReason}
      >
        <LockKeyhole aria-hidden="true" className="size-4" />
        {action.label}
        {recovery ? <RotateCcw aria-hidden="true" className="size-4" /> : null}
        <DisabledControlReason id={disabledReasonId} reason={disabledReason} />
      </span>
    );
  }

  if (!action.href) {
    return (
      <button
        className={className}
        data-ux-cta-kind={primary ? "primary" : recovery ? "recovery" : "secondary"}
        data-ux-interactive="true"
        data-ux-primary-cta={primary ? "true" : undefined}
        data-ux-secondary-cta={!primary ? "true" : undefined}
        onClick={action.onClick}
        type="button"
      >
        {action.label}
        {primary ? <ArrowRight aria-hidden="true" className="size-4" /> : null}
        {recovery ? <RotateCcw aria-hidden="true" className="size-4" /> : null}
      </button>
    );
  }

  return (
    <Link
      className={className}
      data-ux-cta-kind={primary ? "primary" : recovery ? "recovery" : "secondary"}
      data-ux-interactive="true"
      data-ux-primary-cta={primary ? "true" : undefined}
      data-ux-secondary-cta={!primary ? "true" : undefined}
      href={action.href}
    >
      {action.label}
      {primary ? <ArrowRight aria-hidden="true" className="size-4" /> : null}
      {recovery ? <RotateCcw aria-hidden="true" className="size-4" /> : null}
    </Link>
  );
}

function phase10A11yTasksForRoute(pathname: string, currentPolicy: ReturnType<typeof uxRoutePolicyForRoute> | null) {
  const cleanPath = pathname.split("?")[0]?.split("#")[0] ?? pathname;
  const taskIds = new Set<string>();

  if (
    cleanPath.includes("decision-room") ||
    cleanPath.includes("approval") ||
    cleanPath.includes("release") ||
    cleanPath.includes("block") ||
    cleanPath.includes("vote") ||
    currentPolicy?.pageType === "Modal"
  ) {
    taskIds.add("UX-A11Y-001");
  }

  if (
    cleanPath.includes("review-queue") ||
    currentPolicy?.pageType === "Workbench" ||
    currentPolicy?.workspace === "advisory_workbench" ||
    currentPolicy?.workspace === "elevated_workflows" ||
    currentPolicy?.workspace === "governance" ||
    currentPolicy?.workspace === "ops"
  ) {
    taskIds.add("UX-A11Y-002");
  }

  if (
    cleanPath.startsWith("/client") ||
    cleanPath.startsWith("/documents") ||
    cleanPath.startsWith("/evidence") ||
    currentPolicy?.workspace === "client_workspace" ||
    currentPolicy?.workspace === "evidence"
  ) {
    taskIds.add("UX-A11Y-003");
  }

  taskIds.add("UX-A11Y-004");
  return Array.from(taskIds);
}

export function PageHeader({
  blockedReason,
  chrome = "full",
  eyebrow,
  primaryAction,
  recoveryAction,
  secondaryActions = [],
  status = "PENDING",
  statusLabel,
  steps,
  title,
  description,
}: PageHeaderProps) {
  const pathname = usePathname();
  const currentRoute = routeForPathname(pathname);
  const currentPolicy = currentRoute ? uxRoutePolicyForRoute(currentRoute) : null;
  const currentScope = currentRoute ? routeScopeForPageId(currentRoute.pageId) : null;
  const routeIsClientVisibilitySensitive =
    currentRoute && "clientVisibilitySensitive" in currentRoute ? Boolean(currentRoute.clientVisibilitySensitive) : false;
  const derivedSteps = steps ?? (currentRoute ? uxFlowStepsForPageId(currentRoute.pageId) : []);
  const previousStep = derivedSteps.filter((step) => step.status === "complete" && step.href).at(-1);
  const effectivePrimaryAction = primaryAction;
  const effectiveSecondaryActions =
    secondaryActions.length > 0 || !previousStep
      ? secondaryActions
      : [{ href: previousStep.href, label: `Back to ${previousStep.label}` }];
  const phase10TaskIds = phase10A11yTasksForRoute(pathname, currentPolicy);
  const a11yStatusAnnouncement = `${title}: ${statusLabel ?? "No unapproved advice reaches the client"}. Keyboard users can tab through actions and recover without losing context.`;

  if (chrome === "compact") {
    return (
      <header className="flex flex-col gap-2" data-testid="page-header">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alphavest-gold">
            {eyebrow}
          </p>
        ) : null}
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl text-alphavest-ivory md:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-alphavest-muted md:text-base">
            {description}
          </p>
        </div>
      </header>
    );
  }

  return (
    <header className="flex flex-col gap-4" data-testid="page-header">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alphavest-gold">
          {eyebrow}
        </p>
      ) : null}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl text-alphavest-ivory md:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-alphavest-muted md:text-base">
            {description}
          </p>
        </div>
        <div className="flex min-w-0 flex-col items-start gap-2 lg:items-end">
          <StatusChip label={statusLabel ?? "No unapproved advice reaches the client"} status={status} />
          {currentRoute && currentPolicy ? (
            <div className="sr-only" data-testid="page-header-route-context">
              <span
                className="max-w-72 truncate rounded-full border border-alphavest-gold/35 bg-alphavest-gold/10 px-3 py-1 font-semibold text-alphavest-gold-soft"
                data-testid="page-header-page-job"
                title={currentPolicy.pageType}
              >
                {currentPolicy.pageType}
              </span>
              <span
                className="max-w-96 truncate rounded-full border border-alphavest-gold/35 bg-alphavest-gold/10 px-3 py-1 font-semibold text-alphavest-gold-soft"
                data-testid="page-header-current-gate"
                title={currentPolicy.primaryCtaRule}
              >
                {currentPolicy.primaryCtaRule}
              </span>
              <span className="rounded-full border border-alphavest-border bg-alphavest-charcoal/55 px-3 py-1 font-semibold text-alphavest-muted">
                {uxWorkspaceLabels[currentPolicy.workspace]}
              </span>
              <span className="rounded-full border border-alphavest-border bg-alphavest-charcoal/55 px-3 py-1 font-semibold text-alphavest-muted">
                {currentScope ? routeScopeLabels[currentScope] : "Scoped"} · {currentRoute.objectType.replaceAll("_", " ").toLowerCase()}
              </span>
              <span className="rounded-full border border-alphavest-border bg-alphavest-charcoal/55 px-3 py-1 font-semibold text-alphavest-muted">
                {routeIsClientVisibilitySensitive ? "Internal until release" : "Client-safe context"}
              </span>
            </div>
          ) : null}
          <A11yStatusSupportPanel
            className="max-w-xl"
            routeLabel={currentRoute ? currentRoute.title : title}
            statusAnnouncement={a11yStatusAnnouncement}
            taskIds={phase10TaskIds}
          />
          {effectivePrimaryAction ? (
            <div className="flex flex-wrap justify-start gap-2 lg:justify-end" data-testid="page-header-primary-cta-region" data-ux-phase8-primary-count="1">
              <span className="flex h-[var(--button-height)] items-center rounded-md border border-alphavest-border bg-alphavest-charcoal/55 px-3 text-xs font-semibold text-alphavest-muted">
                Action
              </span>
              <HeaderAction action={effectivePrimaryAction} primary />
              {effectiveSecondaryActions.slice(0, 2).map((action) => (
                <HeaderAction action={action} key={`${action.href ?? action.label}:${action.label}`} />
              ))}
            </div>
          ) : null}
          {blockedReason ? (
            <div className="max-w-sm text-left text-xs leading-5 text-alphavest-subtle lg:text-right" data-testid="page-header-cta-blocked-reason">
              <p data-testid="ux-cta-blocked-reason">{blockedReason}</p>
              {recoveryAction ? (
                <div className="mt-2 flex justify-start lg:justify-end">
                  <HeaderAction action={recoveryAction} recovery />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      {derivedSteps.length > 0 ? (
        <div className="rounded-md border border-alphavest-border/70 bg-alphavest-charcoal/45 p-3">
          <WizardStepper steps={derivedSteps} />
        </div>
      ) : null}
    </header>
  );
}
