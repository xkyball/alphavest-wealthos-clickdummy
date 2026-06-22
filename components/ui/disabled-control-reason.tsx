import { cn } from "@/lib/cn";

type DisabledControlReasonProps = {
  className?: string;
  id?: string;
  reason: string;
  testId?: string;
  visible?: boolean;
};

export function disabledControlReasonId(seed: string) {
  return `${seed.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase()}-disabled-reason`;
}

export function DisabledControlReason({
  className,
  id,
  reason,
  testId = "ux-disabled-control-reason",
  visible = false,
}: DisabledControlReasonProps) {
  return (
    <span
      className={cn(visible ? "text-xs leading-5 text-alphavest-muted" : "sr-only", className)}
      data-testid={testId}
      data-ux-disabled-reason={reason}
      id={id}
    >
      Unavailable: {reason}
    </span>
  );
}
