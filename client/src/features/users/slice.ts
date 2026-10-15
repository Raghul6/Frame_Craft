import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AdminUser, UserDetailResponse } from "../../types/admin";
import type { Paginated } from "../../types/api";
import type { UsersState } from "../../types/state";
import { logoutSuccess } from "../auth/slice";
import {
  createListState,
  listFailed,
  listLoaded,
  listStarted,
} from "../shared/listState";

const initialState: UsersState = {
  list: createListState<AdminUser>(),
  detail: { user: null, orders: null, status: "idle", error: null },
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    usersStart: (state) => listStarted(state.list),
    usersSuccess: (state, action: PayloadAction<Paginated<AdminUser>>) =>
      listLoaded(state.list, action.payload),
    usersFail: (state, action: PayloadAction<string>) =>
      listFailed(state.list, action.payload),

    userDetailStart: (state, action: PayloadAction<number>) => {
      state.detail.status = "loading";
      state.detail.error = null;
      // Clear stale data when switching to a different user.
      if (state.detail.user?.id !== action.payload) {
        state.detail.user = null;
        state.detail.orders = null;
      }
    },
    userDetailSuccess: (state, action: PayloadAction<UserDetailResponse>) => {
      state.detail.status = "succeeded";
      state.detail.user = action.payload.user;
      state.detail.orders = action.payload.orders;
    },
    userDetailFail: (state, action: PayloadAction<string>) => {
      state.detail.status = "failed";
      state.detail.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutSuccess, () => initialState);
  },
});

export const {
  usersStart,
  usersSuccess,
  usersFail,
  userDetailStart,
  userDetailSuccess,
  userDetailFail,
} = usersSlice.actions;
export default usersSlice.reducer;
