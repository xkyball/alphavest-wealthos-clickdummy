import { cn } from "@/lib/cn";

type CardProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className, ...props }: CardProps) {
  return <section className={cn("alpha-card min-w-0 p-[var(--card-padding)]", className)} {...props}>{children}</section>;
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("border-b border-alphavest-border/60 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: CardProps) {
  return <h2 className={cn("font-display text-2xl text-alphavest-ivory", className)} {...props}>{children}</h2>;
}

export function CardDescription({ children, className, ...props }: CardProps) {
  return <p className={cn("mt-1 text-sm leading-6 text-alphavest-muted", className)} {...props}>{children}</p>;
}

export function CardContent({ children, className, ...props }: CardProps) {
  return <div className={cn("mt-5 min-w-0", className)} {...props}>{children}</div>;
}
