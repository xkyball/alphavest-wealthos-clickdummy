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
    <div className={cn(containerClassName, "flex flex-col")}>
      {children}
    </div>
  );
}
