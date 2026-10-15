import type { RootState } from "../../types/store";

export const selectDashboardStats = (state: RootState) => state.dashboard.stats;
export const selectDashboardStatus = (state: RootState) =>
  state.dashboard.status;
export const selectDashboardError = (state: RootState) => state.dashboard.error;
