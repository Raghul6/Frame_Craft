import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MAX_LIST_PAGE, SEARCH_DEBOUNCE_MS } from "../constants/ui";
import type { ListFilterKey, ListFilters } from "../types/hooks";
import { useDebounce } from "./useDebounce";

const parsePage = (value: string | null): number => {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? Math.min(page, MAX_LIST_PAGE) : 1;
};

/**
 * List filters (page, search, one extra filter) live in the URL so back/forward,
 * refresh and shared links keep the admin's place. The search box is debounced
 * and replaces the history entry, so typing doesn't fill the back button.
 */
export const useListFilters = (filterKey: ListFilterKey): ListFilters => {
  const [params, setParams] = useSearchParams();
  const page = parsePage(params.get("page"));
  const search = params.get("search") ?? "";
  const filter = params.get(filterKey) ?? "";

  const update = useCallback(
    (changes: Record<string, string | number>, replace = false) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(changes).forEach(([key, value]) => {
            if (value === "" || (key === "page" && value === 1))
              next.delete(key);
            else next.set(key, String(value));
          });
          return next;
        },
        { replace },
      );
    },
    [setParams],
  );

  // Re-seed the box when the URL changes from outside (back/forward) — but not
  // when it only differs by trailing spaces the user is still typing.
  const [searchInput, setSearchInput] = useState(search);
  const [seededFrom, setSeededFrom] = useState(search);
  if (seededFrom !== search) {
    setSeededFrom(search);
    if (searchInput.trim() !== search) setSearchInput(search);
  }

  const debounced = useDebounce(searchInput.trim(), SEARCH_DEBOUNCE_MS);
  // Remembers the last debounced value we saw, so the effect below reacts only when
  // the *debounced box value* changes — never when `search` changes from elsewhere
  // (back/forward, Enter), which would push a stale box value over the URL.
  const seenDebounced = useRef(debounced);
  useEffect(() => {
    if (debounced === seenDebounced.current) return;
    seenDebounced.current = debounced;
    if (debounced !== search) update({ search: debounced, page: 1 }, true);
  }, [debounced, search, update]);

  // Enter applies the box immediately instead of waiting for the debounce.
  const submitSearch = useCallback(() => {
    const value = searchInput.trim();
    if (value !== search) update({ search: value, page: 1 }, true);
  }, [searchInput, search, update]);

  return {
    page,
    search,
    searchInput,
    filter,
    setPage: useCallback((p: number) => update({ page: p }), [update]),
    setSearchInput,
    submitSearch,
    setFilter: useCallback(
      (value: string) => update({ [filterKey]: value, page: 1 }),
      [filterKey, update],
    ),
  };
};
