"use client";

import Link from "next/link";
import { ArrowRight, LockKeyhole, RotateCcw } from "lucide-react";
import { usePathname } from "next/navigation";
import { A11yStatusSupportPanel } from "@/components/ui/a11y-status";
import { DisabledControlReason, disabledControlReasonId } from "@/components/ui/disabled-control-reason";
import { StatusChip, type StatusChipStatus } from "@/components/ui/status-chip";
import { WizardStepper, type WizardStep } from "@/components/ui/wizard-stepper";
import { cn } from "@/lib/cn";
import { matchRouteBySegments } from "@/lib/route-registry";
import {
  uxActionAttributesFor,
  uxActionClassForPriority,
  uxDefaultUnwiredActionReason,
  type UxActionMeaning,
  type UxActionPriority,
} from "@/lib/ux-action-hierarchy-contract";
import { uxFlowStepsForPageId, uxPageflowForPageId, uxRoutePolicyForRoute } from "@/lib/ux-route-policy";

export type PageHeaderAction = {
  disabledReason?: string;
  href?: string;
  label: string;
  meaning?: UxActionMeaning;
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

function routeForPathname(pathname: string) {
  const cleanPath = pathname.split("?")[0]?.split("#")[0] ?? "/";
  const normalized = cleanPath.length > 1 ? cleanPath.replace(/\/+$/, "") : cleanPath;

  if (normalized === "/") return null;

  return matchRouteBySegments(normalized.split("/").filter(Boolean)) ?? null;
}

function HeaderAction({ action, primary = false, recovery = false }: { action: PageHeaderAction; primary?: boolean; recovery?: boolean }) {
  const hasLifecycle = Boolean(action.href || action.onClick);
  const disabledReason = action.disabledReason ?? (!hasLifecycle ? uxDefaultUnwiredActionReason : undefined);
  const disabledReasonId = disabledReason ? disabledControlReasonId(`page-header-${action.label}`) : undefined;
  const priority: Extract<UxActionPriority, "primary" | "recovery" | "secondary"> = primary ? "primary" : recovery ? "recovery" : "secondary";
  const className = cn(
    uxActionClassForPriority(priority, { unavailable: Boolean(disabledReason) }),
  );
  const actionAttrs = uxActionAttributesFor({
    availability: disabledReason ? "blocked_static" : "enabled",
    disabledReason,
    meaning: action.meaning,
    placement: "page_header",
    priority,
  });

  if (disabledReason) {
    return (
      <span
        aria-describedby={disabledReasonId}
        aria-label={`${action.label}: ${disabledReason}`}
        className={className}
        role="status"
        title={disabledReason}
        {...actionAttrs}
        data-ux-secondary-cta={!primary ? "true" : undefined}
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
        onClick={action.onClick}
        type="button"
        {...actionAttrs}
        data-ux-secondary-cta={!primary ? "true" : undefined}
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
      href={action.href}
      {...actionAttrs}
      data-ux-secondary-cta={!primary ? "true" : undefined}
    >
      {action.label}
      {primary ? <ArrowRight aria-hidden="true" className="size-4" /> : null}
      {recovery ? <RotateCcw aria-hidden="true" className="size-4" /> : null}
    </Link>
  );
}

function stage10A11yTasksForRoute(pathname: string, currentPolicy: ReturnType<typeof uxRoutePolicyForRoute> | null) {
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
    currentPolicy?.workspace === "area_04_analyst_workbench" ||
    currentPolicy?.workspace === "area_05_advisor_review" ||
    currentPolicy?.workspace === "area_10_operations" ||
    currentPolicy?.workspace === "area_11_protected_work"
  ) {
    taskIds.add("UX-A11Y-002");
  }

  if (
    cleanPath.startsWith("/client") ||
    cleanPath.startsWith("/documents") ||
    cleanPath.startsWith("/evidence") ||
    currentPolicy?.workspace === "area_02_client_context" ||
    currentPolicy?.workspace === "area_03_evidence_lifecycle" ||
    currentPolicy?.workspace === "area_08_client_visibility"
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
  const currentPageflow = currentRoute ? uxPageflowForPageId(currentRoute.pageId) : null;
  const derivedSteps = steps ?? (currentRoute ? uxFlowStepsForPageId(currentRoute.pageId) : []);
  const previousStep = derivedSteps.filter((step) => step.status === "complete" && step.href).at(-1);
  const effectivePrimaryAction = primaryAction;
  const effectiveSecondaryActions =
    secondaryActions.length > 0 || !previousStep
      ? secondaryActions
      : [{ href: previousStep.href, label: `Back to ${previousStep.label}` }];
  const stage10TaskIds = stage10A11yTasksForRoute(pathname, currentPolicy);
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
          {currentPageflow ? (
            <p className="max-w-xl text-left text-xs font-semibold leading-5 text-alphavest-subtle lg:text-right">
              Journey: <span className="text-alphavest-muted">{currentPageflow.label}</span>
            </p>
          ) : null}
          <StatusChip label={statusLabel ?? "No unapproved advice reaches the client"} status={status} />
          <A11yStatusSupportPanel
            className="max-w-xl"
            routeLabel={currentRoute ? currentRoute.title : title}
            statusAnnouncement={a11yStatusAnnouncement}
            taskIds={stage10TaskIds}
          />
          {effectivePrimaryAction ? (
            <div className="flex flex-wrap justify-start gap-2 lg:justify-end" data-testid="page-header-primary-cta-region" data-ux-stage8-primary-count="1">
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
