"use client";

import { useEffect, useId, useRef } from "react";
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

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function Modal({ children, className, context, description, footer, onClose, open, title }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const firstFocusable = dialog?.querySelector<HTMLElement>(focusableSelector);
    (firstFocusable ?? dialog)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose?.();
        return;
      }

      if (event.key !== "Tab" || !dialog) {
        return;
      }

      const focusableElements = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) => !element.hasAttribute("disabled") && element.offsetParent !== null
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedRef.current?.focus();
      previouslyFocusedRef.current = null;
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-alphavest-navy/68 p-4 backdrop-blur-sm" onMouseDown={onClose ? onClose : undefined}>
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn(
          "max-h-[min(100dvh-2rem,calc(100vh-1.5rem))] w-full max-w-[min(var(--modal-width),calc(100vw-1.25rem))] overflow-hidden rounded-md border border-alphavest-gold/38 bg-alphavest-panel/95 shadow-2xl",
          className
        )}
        ref={dialogRef}
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
        tabIndex={-1}
      >
        <div className="flex min-h-0 items-start justify-between gap-4 border-b border-alphavest-border/60 px-5 py-5 md:px-6">
          <div>
            <h2 className="font-display text-2xl text-alphavest-ivory" id={titleId}>{title}</h2>
            {description ? <p className="mt-1 text-sm leading-6 text-alphavest-muted">{description}</p> : null}
          </div>
          {onClose ? (
            <button
              className="grid size-9 shrink-0 place-items-center rounded-full border border-alphavest-border text-alphavest-muted transition hover:border-alphavest-gold hover:text-alphavest-gold"
              onClick={onClose}
              type="button"
            >
              <X aria-hidden="true" className="size-4" />
              <span className="sr-only">Close</span>
            </button>
          ) : null}
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
