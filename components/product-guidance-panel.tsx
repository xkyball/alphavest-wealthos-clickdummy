"use client";

import Link from "next/link";
import { ArrowRight, Compass, LockKeyhole, Route, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { useDemoSession } from "@/components/demo-session-provider";
import { WizardStepper } from "@/components/ui/wizard-stepper";
import { cn } from "@/lib/cn";
import { productGuidanceForPathname, type ProductGuidanceLink } from "@/lib/product-guidance";

const primaryActionClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md bg-alphavest-gold px-4 text-sm font-semibold text-alphavest-navy transition hover:bg-alphavest-gold-soft";

const secondaryActionClass =
  "inline-flex h-[var(--button-height)] items-center justify-center gap-2 rounded-md border border-alphavest-border bg-alphavest-charcoal/70 px-4 text-sm font-semibold text-alphavest-ivory transition hover:border-alphavest-gold/60 hover:text-alphavest-gold-soft";

function GuidanceLink({ link, variant }: { link: ProductGuidanceLink; variant: "primary" | "secondary" }) {
  return (
    <Link className={variant === "primary" ? primaryActionClass : secondaryActionClass} data-testid={variant === "primary" ? "ux-nav-primary-next-step" : undefined} href={link.href}>
      {link.label}
      <ArrowRight aria-hidden="true" className="size-4" />
    </Link>
  );
}

export function ProductGuidancePanel() {
  const pathname = usePathname();
  const { session } = useDemoSession();
  const guidance = productGuidanceForPathname(pathname);
  const hasActions = guidance.primaryAction || guidance.nextStep || guidance.relatedRoutes.length > 0;

  return (
    <section
      aria-label="Product workflow guidance"
      className="mb-4 rounded-md border border-alphavest-border/75 bg-alphavest-panel/72 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.18)] md:mb-5 md:p-5"
      data-testid="product-guidance"
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
            >
              {guidance.tierLabel}
            </span>
            {guidance.routeId ? (
              <span className="inline-flex h-7 items-center gap-2 rounded-full border border-alphavest-border bg-alphavest-charcoal/65 px-3 text-xs font-semibold text-alphavest-muted">
                <Route aria-hidden="true" className="size-3.5" />
                Workflow step {guidance.routeId}
              </span>
            ) : null}
          </div>

          <div className="grid gap-2 md:gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.5fr)]">
            <div>
              <h2 className="font-display text-xl text-alphavest-ivory md:text-3xl">
                Page job and next step
              </h2>
              <p className="mt-1 text-sm font-semibold text-alphavest-gold-soft md:text-base">
                {guidance.shortTitle}
              </p>
              <p className="mt-1 hidden max-w-3xl text-sm leading-6 text-alphavest-muted sm:block md:mt-2">
                {guidance.purpose}
              </p>
            </div>
            <div className="hidden rounded-md border border-alphavest-gold/25 bg-alphavest-gold/10 p-2.5 sm:block md:p-3" data-testid="ux-nav-gate-guidance">
              <div className="flex items-center gap-2 text-sm font-semibold text-alphavest-gold-soft">
                <LockKeyhole aria-hidden="true" className="size-4" />
                Gate guidance
              </div>
              <p className="mt-1 text-sm leading-5 text-alphavest-muted md:mt-2 md:leading-6">{guidance.gateHint}</p>
            </div>
          </div>

          <div className="mt-4 hidden flex-wrap items-center gap-2 text-xs text-alphavest-muted sm:flex">
            <ShieldCheck aria-hidden="true" className="size-4 text-alphavest-gold" />
            <span>
              Scenario context: {session.tenant.displayName} · {session.role.label}. This switcher is demo-local and does not claim production authentication.
            </span>
          </div>
          {guidance.steps.length > 0 ? (
            <div className="mt-4 rounded-md border border-alphavest-border/65 bg-alphavest-charcoal/35 p-3" data-testid="ux-nav-flow-rail">
              <WizardStepper steps={guidance.steps} />
            </div>
          ) : null}
          <div className="mt-3 hidden flex-wrap gap-1.5 md:flex">
            {guidance.routePolicyLabels.slice(0, 4).map((label) => (
              <span
                className="rounded-full border border-alphavest-border/60 bg-alphavest-charcoal/45 px-2.5 py-1 text-[0.62rem] font-semibold uppercase text-alphavest-subtle"
                key={label}
              >
                {label.replaceAll("_", " ")}
              </span>
            ))}
          </div>
        </div>

        {hasActions ? (
          <div className="hidden min-w-0 flex-col gap-2 sm:flex xl:w-72" data-testid="ux-nav-next-actions">
            {guidance.primaryAction ? <GuidanceLink link={guidance.primaryAction} variant="primary" /> : null}
            {guidance.nextStep && guidance.nextStep.href !== guidance.primaryAction?.href ? (
              <GuidanceLink link={guidance.nextStep} variant="secondary" />
            ) : null}
            {guidance.relatedRoutes.slice(0, 2).map((link) => (
              <GuidanceLink key={`${link.href}:${link.label}`} link={link} variant="secondary" />
            ))}
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
