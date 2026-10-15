import type { Dispatch } from "@reduxjs/toolkit";
import type { ToastType } from "../../types/toast";
import { toastShown } from "./slice";

/**
 * Shows the common toast popup from anywhere (thunks, pages):
 * `showToast(dispatch, "success", TOAST_MESSAGES.frameSaved(name))`.
 */
export const showToast = (
  dispatch: Dispatch,
  type: ToastType,
  message: string,
) => {
  dispatch(toastShown(type, message));
};
