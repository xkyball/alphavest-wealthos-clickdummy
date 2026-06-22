"use client";

import Link from "next/link";
import { ArrowRight, Compass, LockKeyhole, RotateCcw, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { useDemoSession } from "@/components/demo-session-provider";
import { UxSupportDensityStrip } from "@/components/ux-support-density-strip";
import { WizardStepper } from "@/components/ui/wizard-stepper";
import { cn } from "@/lib/cn";
import { uxDensityTierContracts } from "@/lib/ux-density";
import { productGuidanceForPathname, type ProductGuidanceLink } from "@/lib/product-guidance";

const primaryActionClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft";

const secondaryActionClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft";

function GuidanceLink({ link, variant }: { link: ProductGuidanceLink; variant: "primary" | "secondary" }) {
  return (
    <Link
      className={variant === "primary" ? primaryActionClass : secondaryActionClass}
      data-testid={variant === "primary" ? "ux-nav-primary-next-step" : undefined}
      data-ux-cta-kind={variant}
      data-ux-primary-cta={variant === "primary" ? "true" : undefined}
      data-ux-secondary-cta={variant === "secondary" ? "true" : undefined}
      href={link.href}
    >
      {link.label}
      <ArrowRight aria-hidden="true" className="size-4" />
    </Link>
  );
}

export function ProductGuidancePanel() {
  const pathname = usePathname();
  const { session } = useDemoSession();
  const guidance = productGuidanceForPathname(pathname);
  const density = guidance.densityTier ? uxDensityTierContracts[guidance.densityTier] : null;
  const primaryAction = guidance.ctaState.primaryAction ?? guidance.primaryAction;
  const recoveryAction = guidance.ctaState.recovery;
  const hasActions = primaryAction || guidance.nextStep || guidance.relatedRoutes.length > 0 || guidance.ctaState.blockedReason;

  return (
    <section
      aria-label="Product workflow guidance"
      className="mb-4 rounded-md border border-alphavest-border/75 bg-alphavest-panel/72 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.18)] md:mb-5 md:p-5"
      data-ux-d2-productive-workbench={density?.tier === "D2" && guidance.workbenchStructure ? "true" : undefined}
      data-ux-density-above-fold="true"
      data-ux-density-pattern={density?.pattern}
      data-ux-density-tier={density?.tier}
      data-testid="product-guidance"
      data-ux-content-tier="must-see"
    >
      <div className="grid gap-3 md:gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2 md:mb-3">
            <span className="inline-flex h-7 items-center gap-2 rounded-full border border-alphavest-gold/35 bg-alphavest-gold/10 px-3 text-xs font-semibold text-alphavest-gold-soft">
              <Compass aria-hidden="true" className="size-3.5" />
              {guidance.area}
            </span>
            <span
              className={cn(
                "inline-flex h-7 items-center rounded-full border px-3 text-xs font-semibold",
                guidance.tier === "MVP"
                  ? "border-alphavest-green/35 bg-alphavest-green/10 text-alphavest-green"
                  : guidance.tier === "MVP_SUPPORT" || guidance.tier === "ROOT"
                    ? "border-alphavest-blue/35 bg-alphavest-blue/10 text-alphavest-blue"
                  : "border-alphavest-gold/35 bg-alphavest-gold/10 text-alphavest-gold-soft"
              )}
              data-testid="ux-density-status"
            >
              {guidance.tierLabel}
            </span>
          </div>

          <div className="grid gap-2 md:gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.5fr)]">
            <div>
              <h2 className="font-display text-xl text-alphavest-ivory md:text-3xl" data-testid="ux-density-page-job">
                {guidance.shortTitle}
              </h2>
              <p className="sr-only">
                {guidance.purpose}
              </p>
            </div>
            <div className="hidden rounded-md border border-alphavest-gold/25 bg-alphavest-gold/10 p-2.5 sm:block md:p-3" data-testid="ux-nav-gate-guidance">
              <div className="flex items-center gap-2 text-sm font-semibold text-alphavest-gold-soft">
                <LockKeyhole aria-hidden="true" className="size-4" />
                Current gate
              </div>
              <p className="mt-1 text-sm leading-5 text-alphavest-muted md:mt-2 md:leading-6">{guidance.gateHint}</p>
            </div>
          </div>

          <div className="mt-4 hidden flex-wrap items-center gap-2 text-xs text-alphavest-muted sm:flex">
            <ShieldCheck aria-hidden="true" className="size-4 text-alphavest-gold" />
            <span>Context: {session.tenant.displayName} · {session.role.label}</span>
          </div>
          {guidance.steps.length > 0 ? (
            <div className="mt-4 rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/35 p-3" data-testid="ux-nav-flow-rail" data-ux-content-tier="secondary">
              <WizardStepper steps={guidance.steps} />
            </div>
          ) : null}
          {guidance.workbenchStructure ? (
            <div
              className={cn("mt-4 grid gap-3 lg:grid-cols-3", density?.tier === "D2" && "gap-2 md:grid-cols-3")}
              data-testid="ux-page-workbench-triad"
              data-ux-content-tier="secondary"
              data-ux-density-pattern={density?.pattern}
              data-ux-density-tier={density?.tier}
            >
              <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/40 p-3" data-testid="ux-page-queue">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Priority Queue</p>
                <p className="mt-2 text-sm leading-6 text-alphavest-muted">{guidance.workbenchStructure.queue}</p>
              </div>
              <div className="rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/40 p-3" data-testid="ux-page-selected-context">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Selected Context</p>
                <p className="mt-2 text-sm leading-6 text-alphavest-muted">{guidance.workbenchStructure.context}</p>
              </div>
              <div className="rounded-md border border-alphavest-gold/35 bg-alphavest-gold/10 p-3" data-testid="ux-page-action-rail">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-gold-soft">Action Rail</p>
                <p className="mt-2 text-sm leading-6 text-alphavest-muted">{guidance.workbenchStructure.actionRail}</p>
                <p className="mt-2 text-xs leading-5 text-alphavest-gold-soft">{guidance.workbenchStructure.safety}</p>
              </div>
            </div>
          ) : null}
          {guidance.routeId ? (
            <UxSupportDensityStrip className="mt-4" pageId={guidance.routeId} />
          ) : null}
        </div>

        {hasActions ? (
          <div
            className="hidden min-w-0 flex-col gap-2 sm:flex xl:w-72"
            data-testid="ux-nav-next-actions"
            data-ux-content-tier="must-see"
            data-ux-cta-state={guidance.ctaState.state}
          >
            {primaryAction ? <GuidanceLink link={primaryAction} variant="primary" /> : null}
            {guidance.nextStep && guidance.nextStep.href !== primaryAction?.href ? (
              <GuidanceLink link={guidance.nextStep} variant="secondary" />
            ) : null}
            {guidance.relatedRoutes.slice(0, 2).map((link) => (
              <GuidanceLink key={`${link.href}:${link.label}`} link={link} variant="secondary" />
            ))}
            {guidance.ctaState.blockedReason ? (
              <div className="rounded-md border border-alphavest-gold/30 bg-alphavest-navy/30 px-3 py-2 text-xs leading-5 text-alphavest-gold-soft" data-testid="ux-cta-blocked-reason">
                <div className="flex items-start gap-2">
                  <LockKeyhole aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                  <span>{guidance.ctaState.blockedReason}</span>
                </div>
                {recoveryAction ? (
                  <Link className="mt-2 inline-flex items-center gap-1 font-semibold text-alphavest-gold" data-testid="ux-cta-recovery-action" href={recoveryAction.href}>
                    <RotateCcw aria-hidden="true" className="size-3.5" />
                    {recoveryAction.label}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function ProductGuidanceContent({
  children,
  containerClassName = "av-page",
}: {
  children: React.ReactNode;
  containerClassName?: string;
}) {
  return (
    <div className={cn(containerClassName, "flex flex-col")}>
      <div className="order-2 sm:order-1">
        <ProductGuidancePanel />
      </div>
      <div className="order-1 sm:order-2">
        {children}
      </div>
    </div>
  );
}
