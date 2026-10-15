import type { Dispatch } from "@reduxjs/toolkit";
import type { ListQuery, ListState } from "./api";
import type { RootState } from "./store";

/** The URL query key a list page filters on, besides `search` and `page`. */
export type ListFilterKey = "status" | "role";

export interface ListFilters {
  page: number;
  /** Applied search (from the URL). */
  search: string;
  /** What is in the search box right now (applied after a short pause). */
  searchInput: string;
  filter: string;
  setPage: (page: number) => void;
  setSearchInput: (value: string) => void;
  /** Applies the search box immediately (Enter key). */
  submitSearch: () => void;
  setFilter: (value: string) => void;
}

export interface UseAdminListOptions<T> {
  selectList: (state: RootState) => ListState<T>;
  fetchList: (query: ListQuery) => (dispatch: Dispatch) => Promise<unknown>;
  filterKey: ListFilterKey;
}
