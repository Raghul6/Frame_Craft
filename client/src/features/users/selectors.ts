import type { RootState } from "../../types/store";

export const selectUsersList = (state: RootState) => state.users.list;
export const selectUserDetail = (state: RootState) => state.users.detail;
