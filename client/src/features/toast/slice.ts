import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { MAX_TOASTS } from "../../constants/ui";
import type { Toast, ToastType, ToastState } from "../../types/toast";

let nextToastId = 1;

const initialState: ToastState = { toasts: [] };

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    toastShown: {
      reducer: (state, action: PayloadAction<Toast>) => {
        state.toasts.push(action.payload);
        if (state.toasts.length > MAX_TOASTS) state.toasts.shift();
      },
      // The id is created here so components can dismiss a specific toast.
      prepare: (type: ToastType, message: string) => ({
        payload: { id: nextToastId++, type, message },
      }),
    },
    toastDismissed: (state, action: PayloadAction<number>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { toastShown, toastDismissed } = toastSlice.actions;
export default toastSlice.reducer;
