import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardStats } from "../../types/admin";
import type { DashboardState } from "../../types/state";
import { logoutSuccess } from "../auth/slice";

const initialState: DashboardState = {
  stats: null,
  status: "idle",
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    dashboardStart: (state) => {
      state.status = "loading";
      state.error = null;
    },
    dashboardSuccess: (state, action: PayloadAction<DashboardStats>) => {
      state.status = "succeeded";
      state.stats = action.payload;
    },
    dashboardFail: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutSuccess, () => initialState);
  },
});

export const { dashboardStart, dashboardSuccess, dashboardFail } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
