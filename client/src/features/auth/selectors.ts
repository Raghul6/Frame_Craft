import type { RootState } from "../../types/store";

export const selectUser = (state: RootState) => state.auth.user;
export const selectBootstrapped = (state: RootState) => state.auth.bootstrapped;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthFieldErrors = (state: RootState) =>
  state.auth.fieldErrors;
