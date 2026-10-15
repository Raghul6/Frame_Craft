import { DEFAULT_PAGE_SIZE } from "../../constants/ui";
import type { ListState, Paginated } from "../../types/api";

// Shared reducer logic for every paginated admin list (users, orders, frames),
// so each slice only names its actions.

export const createListState = <T>(): ListState<T> => ({
  items: [],
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  total: 0,
  status: "idle",
  error: null,
});

export const listStarted = <T>(list: ListState<T>): void => {
  list.status = "loading";
  list.error = null;
};

export const listLoaded = <T>(list: ListState<T>, page: Paginated<T>): void => {
  list.items = page.items;
  list.page = page.page;
  list.limit = page.limit;
  list.total = page.total;
  list.status = "succeeded";
};

export const listFailed = <T>(list: ListState<T>, message: string): void => {
  list.status = "failed";
  list.error = message;
};
