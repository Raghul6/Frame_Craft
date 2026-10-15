import type { OrderStatus } from "../types/admin";
import { capitalize } from "../utils/text";

/** Text for the common toast popup — one place for every action's message. */
export const TOAST_MESSAGES = {
  frameCreated: (name: string) => `Frame "${name}" created`,
  frameSaved: (name: string) => `Changes to "${name}" saved`,
  frameDeleted: (name: string) => `Frame "${name}" deleted`,
  orderStatusUpdated: (id: number, status: OrderStatus) =>
    `Order #${id} marked as ${capitalize(status)}`,

  frameSaveFailed: "Could not save the frame",
  frameDeleteFailed: "Could not delete the frame",
  orderStatusFailed: "Could not update the order status",
} as const;

/** Text for the common confirmation dialog. */
export const CONFIRM_MESSAGES = {
  deleteFrame: (name: string) => ({
    title: `Delete "${name}"?`,
    message:
      "This removes the frame and all its sizes. Past orders keep their copy of the details.",
    confirmLabel: "Delete",
    busyLabel: "Deleting…",
  }),
} as const;

/** Shown when a page's data can't be loaded (the server's own message wins when it sends one). */
export const LOAD_ERROR_MESSAGES = {
  dashboard: "Could not load the dashboard",
  frames: "Could not load frames",
  frame: "Could not load this frame",
  orders: "Could not load orders",
  order: "Could not load this order",
  users: "Could not load users",
  user: "Could not load this user",
} as const;

/** Form validation messages (keep in sync with server/src/utils/validators.ts). */
export const VALIDATION_MESSAGES = {
  usernameRequired: "Username is required",
  usernameFormat: "3–30 characters: letters, numbers, _ or .",
  passwordRequired: "Password is required",
  passwordWeak: "Password does not meet all the requirements below",
  confirmPasswordRequired: "Please confirm your password",
  passwordsMismatch: "Passwords do not match",
  emailRequired: "Email is required",
  emailInvalid: "Enter a valid email address",
  mobileRequired: "Mobile number is required",
  mobileInvalid: "Enter a valid mobile number (10–15 digits)",
  frameNameRequired: "Frame name is required",
  imageUrlInvalid: "Image URL must start with https://",
  sizesRequired: "Add at least one size",
  widthInvalid: "Width > 0",
  heightInvalid: "Height > 0",
  priceRequired: "Enter a price",
  stockInvalid: "Whole number",
  sizeDuplicate: "Duplicate size",
} as const;

/** A detail page opened with an id that isn't a number ("/admin/orders/abc"). */
export const INVALID_LINK_MESSAGES = {
  frame: "That frame link is not valid.",
  order: "That order link is not valid.",
  user: "That user link is not valid.",
} as const;

/** Empty-state text for lists and tables. */
export const EMPTY_MESSAGES = {
  framesFiltered: "No frames match these filters.",
  framesNone: "No frames yet.",
  ordersFiltered: "No orders match these filters.",
  ordersNone: "No orders yet.",
  usersFiltered: "No users match these filters.",
  userOrders: "This user hasn't placed any orders.",
  orderItems: "This order has no items.",
} as const;

/** Button text: normal label + the "…ing" text shown with the spinner. */
export const BUTTON_LABELS = {
  login: { label: "Log in", loadingLabel: "Signing in…" },
  register: { label: "Create account", loadingLabel: "Creating account…" },
  createFrame: { label: "Create frame", loadingLabel: "Saving…" },
  saveFrame: { label: "Save changes", loadingLabel: "Saving…" },
  updateStatus: { label: "Update", loadingLabel: "Saving…" },
} as const;

/** Shown by the error boundary when part of a page crashes while rendering. */
export const ERROR_FALLBACK_TEXT = {
  title: "Something went wrong",
  message:
    "This part of the page failed to load. You can try again, or go back to the home page.",
} as const;
