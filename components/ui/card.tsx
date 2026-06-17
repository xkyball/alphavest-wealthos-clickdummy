import { cn } from "@/lib/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return <section className={cn("alpha-card min-w-0 p-[var(--card-padding)]", className)}>{children}</section>;
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn("border-b border-alphavest-border/60 pb-4", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: CardProps) {
  return <h2 className={cn("font-display text-2xl text-alphavest-ivory", className)}>{children}</h2>;
}

export function CardDescription({ children, className }: CardProps) {
  return <p className={cn("mt-1 text-sm leading-6 text-alphavest-muted", className)}>{children}</p>;
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn("mt-5 min-w-0", className)}>{children}</div>;
}
