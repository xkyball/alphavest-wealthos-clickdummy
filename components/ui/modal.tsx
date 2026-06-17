"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/cn";

type ModalProps = {
  children: React.ReactNode;
  className?: string;
  context?: React.ReactNode;
  description?: string;
  footer?: React.ReactNode;
  onClose?: () => void;
  open: boolean;
  title: string;
};

export function Modal({ children, className, context, description, footer, onClose, open, title }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-alphavest-navy/68 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <section
        aria-modal="true"
        className={cn(
          "max-h-[min(100dvh-2rem,calc(100vh-1.5rem))] w-full max-w-[min(var(--modal-width),calc(100vw-1.25rem))] overflow-hidden rounded-md border border-alphavest-gold/38 bg-alphavest-panel/95 shadow-2xl",
          className
        )}
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex min-h-0 items-start justify-between gap-4 border-b border-alphavest-border/60 px-5 py-5 md:px-6">
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
        <div className="flex min-h-0 flex-col gap-5 overflow-y-auto px-5 py-5 md:px-6">
          {context ? <div className="rounded-md border border-alphavest-border/70 bg-alphavest-navy/38 p-4">{context}</div> : null}
          <div>{children}</div>
          {footer ? <div className="flex flex-wrap justify-end gap-3 border-t border-alphavest-border/60 pt-4">{footer}</div> : null}
        </div>
      </section>
    </div>
  );
}
