"use client";

import { useEffect, useId, useRef } from "react";
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

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function Drawer({ children, className, context, description, footer, onClose, open, title }: DrawerProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const panel = panelRef.current;
    const firstFocusable = panel?.querySelector<HTMLElement>(focusableSelector);
    (firstFocusable ?? panel)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose?.();
        return;
      }

      if (event.key !== "Tab" || !panel) {
        return;
      }

      const focusableElements = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) => !element.hasAttribute("disabled") && element.offsetParent !== null
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        panel.focus();
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
      const previouslyFocused = previouslyFocusedRef.current;
      window.setTimeout(() => {
        previouslyFocused?.focus();
        window.setTimeout(() => previouslyFocused?.focus(), 40);
      }, 0);
      previouslyFocusedRef.current = null;
    };
  }, [onClose, open]);

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
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-[min(100vw,var(--drawer-width))] flex-col overflow-hidden border-l border-alphavest-border bg-alphavest-panel shadow-2xl",
          "sm:w-[min(100vw-1.25rem,var(--drawer-width))]",
          className
        )}
        data-testid="ux-a11y-drawer"
        data-ux-a11y-escape={onClose ? "enabled" : "blocked"}
        data-ux-a11y-focus-return="trigger"
        data-ux-phase10-tasks="UX-A11Y-001 UX-A11Y-002"
        ref={panelRef}
        role="complementary"
        onMouseDown={(event) => event.stopPropagation()}
        tabIndex={-1}
      >
        <div className="flex min-h-0 items-start justify-between gap-4 border-b border-alphavest-border/60 p-5 md:p-6">
          <div>
            <h2 className="font-display text-2xl text-alphavest-ivory" id={titleId}>{title}</h2>
            {description ? (
              <p className="mt-1 text-sm leading-6 text-alphavest-muted" id={descriptionId}>{description}</p>
            ) : (
              <p className="sr-only" id={descriptionId}>Drawer is keyboard trapped; Escape and Close recover context when available.</p>
            )}
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
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6 md:py-6">
          <p aria-live="polite" className="sr-only" data-testid="ux-phase10-drawer-status" role="status">
            Drawer opened. Focus is inside the drawer; use Tab for controls, Escape or Cancel to recover context.
          </p>
          {context ? <div className="mb-5 rounded-md border border-alphavest-border/70 bg-alphavest-navy/38 p-4">{context}</div> : null}
          {children}
        </div>
        {footer ? <div className="border-t border-alphavest-border/60 px-5 py-4 md:px-6 md:py-5">{footer}</div> : null}
      </aside>
    </>
  );
}
