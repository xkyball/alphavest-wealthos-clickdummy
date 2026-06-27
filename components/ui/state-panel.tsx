import { AlertTriangle, Ban, CheckCircle2, EyeOff, FileSearch, LoaderCircle, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  uxFeedbackAttributesFor,
  type UxFeedbackProjectionInput,
} from "@/lib/ux-feedback-message-contract";
import {
  uxStateAttributesForComponentState,
  uxStateContractForComponentState,
  type UxComponentState,
  type UxLifecycleKind,
} from "@/lib/ux-lifecycle-state-contract";
import {
  uxPrimitiveAttributesFor,
  uxPrimitiveDensityClassFor,
  uxPrimitiveStatusAttributesFor,
  uxPrimitiveStatusClassFor,
  uxPrimitiveTextClassFor,
  type UxPrimitiveStatusFamily,
} from "@/lib/ux-design-system-foundation";

export type ComponentState = UxComponentState;

type StatePanelProps = {
  className?: string;
  detail: string;
  feedback?: UxFeedbackProjectionInput;
  lifecycleKind?: UxLifecycleKind;
  state: ComponentState;
  testId?: string;
  title: string;
};

const stateMeta: Record<ComponentState, { icon: LucideIcon; style: string }> = {
  "audit-unavailable": { icon: ShieldAlert, style: "border-alphavest-red/35 bg-alphavest-red/10 text-alphavest-red" },
  blocked: { icon: Ban, style: "border-alphavest-red/35 bg-alphavest-red/10 text-alphavest-red" },
  denied: { icon: Ban, style: "border-alphavest-red/35 bg-alphavest-red/10 text-alphavest-red" },
  empty: { icon: FileSearch, style: "border-alphavest-border bg-alphavest-charcoal/55 text-alphavest-muted" },
  error: { icon: AlertTriangle, style: "border-alphavest-red/35 bg-alphavest-red/10 text-alphavest-red" },
  "export-failed": { icon: AlertTriangle, style: "border-alphavest-red/35 bg-alphavest-red/10 text-alphavest-red" },
  "export-pending": { icon: FileSearch, style: "border-alphavest-blue/35 bg-alphavest-blue/10 text-alphavest-blue" },
  "export-redaction": { icon: EyeOff, style: "border-alphavest-gold/40 bg-alphavest-gold/10 text-alphavest-gold-soft" },
  hidden: { icon: EyeOff, style: "border-alphavest-gold/40 bg-alphavest-gold/10 text-alphavest-gold-soft" },
  "hold-blocked": { icon: Ban, style: "border-alphavest-red/35 bg-alphavest-red/10 text-alphavest-red" },
  "internal-only": { icon: ShieldAlert, style: "border-alphavest-gold/40 bg-alphavest-gold/10 text-alphavest-gold-soft" },
  loading: { icon: LoaderCircle, style: "border-alphavest-blue/35 bg-alphavest-blue/10 text-alphavest-blue" },
  "p1-deferred": { icon: ShieldAlert, style: "border-alphavest-gold/40 bg-alphavest-gold/10 text-alphavest-gold-soft" },
  redacted: { icon: EyeOff, style: "border-alphavest-gold/40 bg-alphavest-gold/10 text-alphavest-gold-soft" },
  "reference-only": { icon: FileSearch, style: "border-alphavest-border bg-alphavest-charcoal/55 text-alphavest-muted" },
  restricted: { icon: EyeOff, style: "border-alphavest-gold/40 bg-alphavest-gold/10 text-alphavest-gold-soft" },
  success: { icon: CheckCircle2, style: "border-alphavest-green/35 bg-alphavest-green/10 text-alphavest-green" },
  validation: { icon: AlertTriangle, style: "border-alphavest-gold/40 bg-alphavest-gold/10 text-alphavest-gold-soft" }
};

const stateFamilyToPrimitiveStatus: Record<ReturnType<typeof uxStateContractForComponentState>["family"], UxPrimitiveStatusFamily> = {
  audit_unavailable: "critical",
  blocked: "critical",
  deferred: "warning",
  empty: "neutral",
  error: "critical",
  export_failed: "critical",
  export_pending: "info",
  export_redaction: "warning",
  hidden: "restricted",
  loading: "info",
  permission_denied: "critical",
  reference: "neutral",
  restricted: "restricted",
  success: "success",
  validation: "warning",
};

export function StatePanel({ className, detail, feedback, lifecycleKind, state, testId, title }: StatePanelProps) {
  const Icon = stateMeta[state].icon;
  const primitiveStatusFamily = stateFamilyToPrimitiveStatus[uxStateContractForComponentState(state).family];
  const stateAttributes = uxStateAttributesForComponentState(state, { lifecycleKind });
  const feedbackAttributes = feedback ? uxFeedbackAttributesFor(feedback) : {};

  return (
    <div
      className={cn(
        "rounded-md border p-4",
        uxPrimitiveDensityClassFor("comfortable"),
        uxPrimitiveStatusClassFor(primitiveStatusFamily),
        stateMeta[state].style,
        className
      )}
      data-testid={testId}
      {...uxPrimitiveAttributesFor({ density: "comfortable", primitive: "state-panel", textRole: "body" })}
      {...uxPrimitiveStatusAttributesFor(primitiveStatusFamily)}
      {...stateAttributes}
      {...feedbackAttributes}
    >
      <div className={cn("flex items-center gap-2 text-sm font-semibold", uxPrimitiveTextClassFor("heading"))}>
        <Icon aria-hidden="true" className={cn("size-4", state === "loading" && "animate-spin")} />
        {title}
      </div>
      <p className={cn("mt-2 text-sm leading-6 text-alphavest-muted", uxPrimitiveTextClassFor("body"))}>{detail}</p>
    </div>
  );
}
