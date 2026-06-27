import { StatePanel, type ComponentState } from "@/components/ui/state-panel";
import type { UxLifecycleKind } from "@/lib/ux-lifecycle-state-contract";

export type StateBoundaryKind =
  | "blocked"
  | "empty"
  | "error"
  | "internal-only"
  | "loading"
  | "permission-denied"
  | "success";

type StateBoundaryProps = {
  className?: string;
  detail: string;
  kind: StateBoundaryKind;
  lifecycleKind?: UxLifecycleKind;
  testId?: string;
  title: string;
};

export const stateBoundaryToComponentState = {
  blocked: "blocked",
  empty: "empty",
  error: "error",
  "internal-only": "internal-only",
  loading: "loading",
  "permission-denied": "denied",
  success: "success",
} as const satisfies Record<StateBoundaryKind, ComponentState>;

export const standardStateBoundaryKinds = Object.keys(stateBoundaryToComponentState) as StateBoundaryKind[];

export function StateBoundary({
  className,
  detail,
  kind,
  lifecycleKind,
  testId = "ux-state-boundary",
  title,
}: StateBoundaryProps) {
  const state = stateBoundaryToComponentState[kind];

  return (
    <div
      data-testid={testId}
      data-ux-state-boundary="standard"
      data-ux-state-boundary-kind={kind}
      data-ux-state-boundary-state={state}
    >
      <StatePanel
        className={className}
        detail={detail}
        lifecycleKind={lifecycleKind}
        state={state}
        testId={`${testId}-panel`}
        title={title}
      />
    </div>
  );
}
