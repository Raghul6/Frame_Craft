export type ToastType = "success" | "error" | "info";

/** One popup message in the common Toaster. */
export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

export interface ToastState {
  toasts: Toast[];
}
