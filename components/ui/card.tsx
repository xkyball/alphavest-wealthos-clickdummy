import { cn } from "@/lib/cn";
import {
  uxPrimitiveAttributesFor,
  uxPrimitiveDensityClassFor,
  uxPrimitiveTextClassFor,
  type UxPrimitiveDensity,
} from "@/lib/ux-design-system-foundation";

type CardProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  className?: string;
};

type CardRootProps = CardProps & {
  density?: UxPrimitiveDensity;
};

export function Card({ children, className, density = "comfortable", ...props }: CardRootProps) {
  return (
    <section
      data-ux-affordance="static-card"
      data-ux-density-readability="true"
      data-ux-interactive="false"
      {...uxPrimitiveAttributesFor({ density, primitive: "card", textRole: "body" })}
      {...props}
      className={cn("alpha-card av-readable-surface min-w-0", uxPrimitiveDensityClassFor(density), className)}
    >
      {children}
    </section>
  );
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("border-b border-alphavest-border/60 pb-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: CardProps) {
  return <h2 className={cn("font-display text-xl text-alphavest-ivory md:text-2xl", uxPrimitiveTextClassFor("heading"), className)} {...props}>{children}</h2>;
}

export function CardDescription({ children, className, ...props }: CardProps) {
  return <p className={cn("av-readable-secondary mt-1 text-sm", uxPrimitiveTextClassFor("body"), className)} {...props}>{children}</p>;
}

export function CardContent({ children, className, ...props }: CardProps) {
  return <div className={cn("mt-4 min-w-0", className)} {...props}>{children}</div>;
}
