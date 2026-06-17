import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

type WizardStep = {
  label: string;
  status: "complete" | "current" | "upcoming";
};

type WizardStepperProps = {
  steps: WizardStep[];
};

export function WizardStepper({ steps }: WizardStepperProps) {
  return (
    <ol className="flex flex-col gap-3 md:flex-row md:items-center">
      {steps.map((step, index) => {
        const isComplete = step.status === "complete";
        const isCurrent = step.status === "current";

        return (
          <li className="flex min-w-0 flex-1 items-center gap-3" key={step.label}>
            <div
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-full border text-sm font-semibold",
                isComplete && "border-alphavest-gold bg-alphavest-gold/10 text-alphavest-gold",
                isCurrent && "border-alphavest-gold bg-alphavest-gold text-alphavest-navy",
                step.status === "upcoming" && "border-alphavest-border text-alphavest-subtle"
              )}
            >
              {isComplete ? <Check aria-hidden="true" className="size-4" /> : index + 1}
            </div>
            <span className={cn("truncate text-sm", isCurrent ? "font-semibold text-alphavest-ivory" : "text-alphavest-muted")}>
              {step.label}
            </span>
            {index < steps.length - 1 ? (
              <span className="hidden h-px flex-1 bg-alphavest-border md:block" aria-hidden="true" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
