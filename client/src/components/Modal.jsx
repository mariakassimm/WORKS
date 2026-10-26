import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";


export default function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const titleId = useId();
  // Keep the latest onClose without re-running the open/close effect (and
  // re-stealing focus) every time a parent re-renders with a new function.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      const onKeyDown = (e) => {
        if (e.key === "Escape") {
          onCloseRef.current();
          return;
        }
        // Focus trap: keep Tab / Shift+Tab inside the dialog.
        if (e.key === "Tab" && dialogRef.current) {
          const focusable = dialogRef.current.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]):not([tabindex="-1"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          } else if (!dialogRef.current.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";

      // Move focus into the dialog once it's mounted.
      const frame = requestAnimationFrame(() => {
        // Prefer the first form field; fall back to any button (e.g. the success view's Close).
      const dialog = dialogRef.current;
      const target =
        dialog?.querySelector("input:not([readonly]):not([tabindex='-1']):not([disabled]), textarea, select") ||
        dialog?.querySelector("button:not([aria-label='Close'])") ||
        dialog?.querySelector("button");
      target?.focus();
      });

      return () => {
        document.removeEventListener("keydown", onKeyDown);
        document.body.style.overflow = "";
        cancelAnimationFrame(frame);
        triggerRef.current?.focus?.();
      };
    }
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-onyx/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-sm border border-steel bg-graphite p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <h2 id={titleId} className="font-display text-xl font-medium text-alloy">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 rounded-sm p-1 text-ash transition-colors hover:text-crimson focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
