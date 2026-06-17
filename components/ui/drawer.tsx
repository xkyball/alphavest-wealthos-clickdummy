"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/cn";

type DrawerProps = {
  children: React.ReactNode;
  className?: string;
  context?: React.ReactNode;
  description?: string;
  footer?: React.ReactNode;
  onClose?: () => void;
  open: boolean;
  title: string;
};

export function Drawer({ children, className, context, description, footer, onClose, open, title }: DrawerProps) {
  if (!open) {
    return null;
  }

  return (
    <>
      <div
        aria-hidden={!onClose}
        className={cn(
          "fixed inset-0 z-40 bg-alphavest-navy/62 backdrop-blur-sm transition",
          onClose ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onMouseDown={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-[min(100vw,var(--drawer-width))] flex-col overflow-hidden border-l border-alphavest-border bg-alphavest-panel shadow-2xl",
          "sm:w-[min(100vw-1.25rem,var(--drawer-width))]",
          className
        )}
        role="complementary"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex min-h-0 items-start justify-between gap-4 border-b border-alphavest-border/60 p-5 md:p-6">
          <div>
            <h2 className="font-display text-2xl text-alphavest-ivory">{title}</h2>
            {description ? <p className="mt-1 text-sm leading-6 text-alphavest-muted">{description}</p> : null}
          </div>
          <button
            className="grid size-9 shrink-0 place-items-center rounded-full border border-alphavest-border text-alphavest-muted transition hover:border-alphavest-gold hover:text-alphavest-gold"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="size-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6 md:py-6">
          {context ? <div className="mb-5 rounded-md border border-alphavest-border/70 bg-alphavest-navy/38 p-4">{context}</div> : null}
          {children}
        </div>
        {footer ? <div className="border-t border-alphavest-border/60 px-5 py-4 md:px-6 md:py-5">{footer}</div> : null}
      </aside>
    </>
  );
}
