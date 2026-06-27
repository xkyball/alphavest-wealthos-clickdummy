import { cn } from "@/lib/cn";
import {
  uxPrimitiveAttributesFor,
  uxPrimitiveDensityClassFor,
  uxPrimitiveStatusAttributesFor,
  uxPrimitiveStatusClassFor,
  type UxPrimitiveDensity,
  type UxPrimitiveStatusFamily,
  type UxPrimitiveTextRole,
} from "@/lib/ux-design-system-foundation";
import type { HTMLAttributes } from "react";

export type BadgeTone =
  | "blue"
  | "gold"
  | "green"
  | "muted"
  | "purple"
  | "red"
  | "teal";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  ariaLabel?: string;
  children: React.ReactNode;
  className?: string;
  density?: UxPrimitiveDensity;
  statusFamily?: UxPrimitiveStatusFamily;
  textRole?: UxPrimitiveTextRole;
  tone?: BadgeTone;
};

const toneClass: Record<BadgeTone, string> = {
  blue: "border-alphavest-blue/35 bg-alphavest-blue/10 text-alphavest-blue",
  gold: "border-alphavest-gold/40 bg-alphavest-gold/12 text-alphavest-gold-soft",
  green: "border-alphavest-green/35 bg-alphavest-green/10 text-alphavest-green",
  muted: "border-alphavest-border bg-alphavest-charcoal/70 text-alphavest-muted",
  purple: "border-violet-400/35 bg-violet-400/10 text-violet-200",
  red: "border-alphavest-red/35 bg-alphavest-red/10 text-alphavest-red",
  teal: "border-teal-300/35 bg-teal-300/10 text-teal-200"
};

const toneStatusFamily: Record<BadgeTone, UxPrimitiveStatusFamily> = {
  blue: "info",
  gold: "warning",
  green: "success",
  muted: "neutral",
  purple: "restricted",
  red: "critical",
  teal: "success"
};

export function Badge({
  ariaLabel,
  children,
  className,
  density = "compact",
  statusFamily,
  textRole = "metadata",
  tone = "muted",
  ...attributes
}: BadgeProps) {
  const resolvedStatusFamily = statusFamily ?? toneStatusFamily[tone];

  return (
    <span
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-[var(--status-chip-height)] w-fit items-center rounded-full border px-3 text-xs font-semibold",
        uxPrimitiveDensityClassFor(density),
        uxPrimitiveStatusClassFor(resolvedStatusFamily),
        toneClass[tone],
        className
      )}
      data-ux-affordance="static-badge"
      data-ux-interactive="false"
      {...uxPrimitiveAttributesFor({ density, primitive: "badge", textRole })}
      {...uxPrimitiveStatusAttributesFor(resolvedStatusFamily)}
      {...attributes}
    >
      {children}
    </span>
  );
}
