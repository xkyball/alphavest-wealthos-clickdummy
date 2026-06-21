import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { uxSupportDensityForPageId } from "@/lib/ux-support-density";

type UxSupportDensityStripProps = {
  className?: string;
  pageId: string;
};

export function UxSupportDensityStrip({ className, pageId }: UxSupportDensityStripProps) {
  const density = uxSupportDensityForPageId(pageId);

  if (!density) {
    return null;
  }

  const nextStep = density.href ? (
    <Link
      className="inline-flex min-h-10 items-center justify-between gap-3 rounded-md border border-alphavest-gold/45 bg-alphavest-gold/10 px-3 py-2 text-sm font-semibold text-alphavest-gold-soft transition hover:border-alphavest-gold"
      data-testid="ux-complexity-support-next-step"
      href={density.href}
    >
      {density.nextStep}
      <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
    </Link>
  ) : (
    <span
      className="inline-flex min-h-10 items-center rounded-md border border-alphavest-gold/45 bg-alphavest-gold/10 px-3 py-2 text-sm font-semibold text-alphavest-gold-soft"
      data-testid="ux-complexity-support-next-step"
    >
      {density.nextStep}
    </span>
  );

  return (
    <section
      aria-label="Support page density"
      className={cn("rounded-md border border-alphavest-border/70 bg-alphavest-panel/68 p-3", className)}
      data-testid="ux-complexity-support-density"
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_13rem_minmax(14rem,0.42fr)]">
        <div className="min-w-0 rounded-md border border-alphavest-border/55 bg-alphavest-charcoal/35 p-3" data-testid="ux-complexity-support-job">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Current job</p>
          <p className="mt-1 text-sm font-semibold text-alphavest-ivory">{density.job}</p>
        </div>
        <div className="rounded-md border border-alphavest-border/55 bg-alphavest-charcoal/35 p-3" data-testid="ux-complexity-support-status">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-alphavest-subtle">Status</p>
          <p className="mt-1 text-sm font-semibold text-alphavest-ivory">{density.status}</p>
        </div>
        <div className="min-w-0">{nextStep}</div>
      </div>
      <div className="mt-3 flex gap-2 rounded-md border border-alphavest-gold/30 bg-alphavest-gold/10 px-3 py-2 text-xs leading-5 text-alphavest-gold-soft" data-testid="ux-complexity-support-safety">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
        <span>{density.safety} Visible support status is orientation, not gate-completion proof.</span>
      </div>
    </section>
  );
}
