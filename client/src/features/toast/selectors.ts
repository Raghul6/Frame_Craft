import type { RootState } from "../../types/store";

export const selectToasts = (state: RootState) => state.toast.toasts;
