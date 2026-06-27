import { Suspense } from "react";

import { cn } from "@/lib/cn";
import { ProofReviewerModeSlot } from "@/components/proof-reviewer-mode-slot";

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
      data-ux-proof-debug-default-visible="false"
      data-ux-proof-mode="operational_default"
      data-ux-reviewer-secondary-surface="not-rendered"
    >
      {children}
      <Suspense fallback={null}>
        <ProofReviewerModeSlot />
      </Suspense>
    </div>
  );
}
