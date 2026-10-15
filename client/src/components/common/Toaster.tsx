import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  ERROR_TOAST_DURATION_MS,
  ICON_SIZE,
  TOAST_DURATION_MS,
} from "../../constants/ui";
import { selectToasts } from "../../features/toast/selectors";
import { toastDismissed } from "../../features/toast/slice";
import type { ToastItemProps } from "../../types/components";

const ICONS = { success: CheckCircle2, error: XCircle, info: Info } as const;

/** One toast: closes itself after a few seconds, but waits while the pointer is on it. */
const ToastItem = ({ toast, onDismiss }: ToastItemProps) => {
  const [paused, setPaused] = useState(false);
  const Icon = ICONS[toast.type];

  useEffect(() => {
    if (paused) return;
    const duration =
      toast.type === "error" ? ERROR_TOAST_DURATION_MS : TOAST_DURATION_MS;
    const timer = window.setTimeout(() => onDismiss(toast.id), duration);
    return () => window.clearTimeout(timer);
  }, [paused, toast.id, toast.type, onDismiss]);

  return (
    <div
      className={`toast toast-${toast.type}`}
      role={toast.type === "error" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Icon size={ICON_SIZE.lg} className="toast-icon" aria-hidden />
      <span className="toast-message">{toast.message}</span>
      <button
        type="button"
        className="toast-close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <X size={ICON_SIZE.sm} />
      </button>
    </div>
  );
};

/**
 * The one popup area for the whole app (mounted in App.tsx). Every success / error
 * message — save, edit, delete, status change — comes through here; only the text changes.
 */
const Toaster = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(selectToasts);
  // Stable, so a new toast arriving doesn't restart the timers of the ones already shown.
  const dismiss = useCallback(
    (id: number) => dispatch(toastDismissed(id)),
    [dispatch],
  );

  return (
    <div className="toaster" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
};

export default Toaster;
