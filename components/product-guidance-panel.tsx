import { cn } from "@/lib/cn";

export function ProductGuidancePanel() {
  return null;
}

export function ProductGuidanceContent({
  children,
  containerClassName = "av-page",
}: {
  children: React.ReactNode;
  containerClassName?: string;
}) {
  return (
    <div
      className={cn(containerClassName, "flex flex-col")}
      data-testid="ux-operational-default-surface"
      data-ux-operational-default="true"
      data-ux-proof-debug-default-visible="false"
      data-ux-proof-mode="operational_default"
      data-ux-reviewer-secondary-surface="not-rendered"
    >
      {children}
    </div>
  );
}
