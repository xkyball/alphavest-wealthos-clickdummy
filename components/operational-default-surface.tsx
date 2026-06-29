import { cn } from "@/lib/cn";

type OperationalDefaultSurfaceProps = {
  children: React.ReactNode;
  containerClassName?: string;
};

export function OperationalDefaultSurface({
  children,
  containerClassName = "av-page",
}: OperationalDefaultSurfaceProps) {
  return (
    <div
      className={cn(containerClassName, "flex flex-col")}
      data-testid="ux-operational-default-surface"
      data-ux-operational-default="true"
    >
      {children}
    </div>
  );
}
