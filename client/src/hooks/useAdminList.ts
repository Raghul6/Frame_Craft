import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import type { UseAdminListOptions } from "../types/hooks";
import { useListFilters } from "./useListFilters";

/**
 * Everything an admin list page needs: URL-synced filters, a fetch whenever they
 * change (older requests are aborted by the thunk), and the list from the store.
 */
export const useAdminList = <T>({
  selectList,
  fetchList,
  filterKey,
}: UseAdminListOptions<T>) => {
  const dispatch = useAppDispatch();
  const list = useAppSelector(selectList);
  const filters = useListFilters(filterKey);
  const { page, search, filter, setPage } = filters;

  const reload = useCallback(
    () => dispatch(fetchList({ page, search, [filterKey]: filter })),
    [dispatch, fetchList, filterKey, page, search, filter],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  // A page past the end (old link, rows deleted elsewhere) jumps to the last page.
  const lastPage = Math.max(1, Math.ceil(list.total / list.limit));
  useEffect(() => {
    if (list.status === "succeeded" && list.total > 0 && page > lastPage) {
      setPage(lastPage);
    }
  }, [list.status, list.total, page, lastPage, setPage]);

  return { list, reload, ...filters };
};
