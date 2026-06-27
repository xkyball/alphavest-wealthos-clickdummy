import { OperationalDefaultSurface } from "@/components/operational-default-surface";

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
  return <OperationalDefaultSurface containerClassName={containerClassName}>{children}</OperationalDefaultSurface>;
}
