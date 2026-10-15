import { AlertTriangle } from "lucide-react";
import { useEffect, useId, useRef, type MouseEvent } from "react";
import type { ConfirmDialogProps } from "../../types/components";
import ButtonLabel from "./ButtonLabel";
import { ICON_SIZE } from "../../constants/ui";

/**
 * The app's own confirmation popup (instead of the browser's `confirm()` box).
 * Built on <dialog>: focus stays inside while open and starts on Cancel (so Enter never
 * deletes by accident), Escape / Cancel / a click on the backdrop closes it, and the
 * confirm button locks while the action runs.
 */
const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel,
  busyLabel,
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // A click on the dimmed backdrop lands on the <dialog> element itself.
  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget && !busy) onCancel();
  };

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      // Escape key: keep our state in charge instead of the browser closing it.
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onCancel();
      }}
      onClick={handleBackdropClick}
    >
      <div className="confirm-dialog-body">
        {danger && (
          <span className="confirm-dialog-icon" aria-hidden>
            <AlertTriangle size={ICON_SIZE.xl} />
          </span>
        )}
        <div>
          <h2 id={titleId}>{title}</h2>
          <p id={messageId}>{message}</p>
        </div>
      </div>
      <div className="confirm-dialog-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </button>
        <button
          type="button"
          className={`btn btn-primary${danger ? " btn-danger" : ""}`}
          onClick={onConfirm}
          disabled={busy}
        >
          <ButtonLabel
            loading={busy}
            label={confirmLabel}
            loadingLabel={busyLabel ?? confirmLabel}
          />
        </button>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;
