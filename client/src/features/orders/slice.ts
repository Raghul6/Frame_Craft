import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OrderDetail, OrderSummary } from "../../types/admin";
import type { Paginated } from "../../types/api";
import type { OrdersState } from "../../types/state";
import { logoutSuccess } from "../auth/slice";
import {
  createListState,
  listFailed,
  listLoaded,
  listStarted,
} from "../shared/listState";

const initialState: OrdersState = {
  list: createListState<OrderSummary>(),
  detail: { order: null, status: "idle", error: null },
  statusUpdate: { status: "idle", error: null },
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    ordersStart: (state) => listStarted(state.list),
    ordersSuccess: (state, action: PayloadAction<Paginated<OrderSummary>>) =>
      listLoaded(state.list, action.payload),
    ordersFail: (state, action: PayloadAction<string>) =>
      listFailed(state.list, action.payload),

    orderDetailStart: (state, action: PayloadAction<number>) => {
      state.detail.status = "loading";
      state.detail.error = null;
      state.statusUpdate = { status: "idle", error: null };
      if (state.detail.order?.id !== action.payload) state.detail.order = null;
    },
    orderDetailSuccess: (state, action: PayloadAction<OrderDetail>) => {
      state.detail.status = "succeeded";
      state.detail.order = action.payload;
    },
    orderDetailFail: (state, action: PayloadAction<string>) => {
      state.detail.status = "failed";
      state.detail.error = action.payload;
    },

    orderStatusStart: (state) => {
      state.statusUpdate = { status: "loading", error: null };
    },
    orderStatusSuccess: (state, action: PayloadAction<OrderDetail>) => {
      state.statusUpdate.status = "succeeded";
      state.detail.order = action.payload;
      const row = state.list.items.find((o) => o.id === action.payload.id);
      if (row) row.status = action.payload.status;
    },
    orderStatusFail: (state, action: PayloadAction<string>) => {
      state.statusUpdate = { status: "failed", error: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutSuccess, () => initialState);
  },
});

export const {
  ordersStart,
  ordersSuccess,
  ordersFail,
  orderDetailStart,
  orderDetailSuccess,
  orderDetailFail,
  orderStatusStart,
  orderStatusSuccess,
  orderStatusFail,
} = ordersSlice.actions;
export default ordersSlice.reducer;
