import type { RootState } from "../../types/store";

export const selectOrdersList = (state: RootState) => state.orders.list;
export const selectOrderDetail = (state: RootState) => state.orders.detail;
export const selectOrderStatusUpdate = (state: RootState) =>
  state.orders.statusUpdate;
