import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RequestError } from "../../types/api";
import type { User } from "../../types/auth";
import type { AuthState } from "../../types/state";

const initialState: AuthState = {
  user: null,
  status: "idle",
  bootstrapped: false,
  error: null,
  fieldErrors: {},
};

// login and register share the same request lifecycle, so they share these reducers.
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authRequestStart: (state) => {
      state.status = "loading";
      state.error = null;
      state.fieldErrors = {};
    },
    authRequestSuccess: (state, action: PayloadAction<User>) => {
      state.status = "succeeded";
      state.user = action.payload;
    },
    authRequestFail: (state, action: PayloadAction<RequestError>) => {
      state.status = "failed";
      state.error = action.payload.message;
      state.fieldErrors = action.payload.fieldErrors;
    },
    authErrorsCleared: (state) => {
      state.error = null;
      state.fieldErrors = {};
    },
    bootstrapFinished: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.bootstrapped = true;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
      state.fieldErrors = {};
    },
  },
});

export const {
  authRequestStart,
  authRequestSuccess,
  authRequestFail,
  authErrorsCleared,
  bootstrapFinished,
  logoutSuccess,
} = authSlice.actions;
export default authSlice.reducer;
