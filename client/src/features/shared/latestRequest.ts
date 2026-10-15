import type { LatestRequest } from "../../types/api";

// Fast typing / paging fires overlapping requests for the same data. Aborting the
// previous one guarantees a slow earlier response can never overwrite a newer one.

const allTrackers = new Set<LatestRequest>();

export const createLatestRequest = (): LatestRequest => {
  let current: AbortController | null = null;
  const tracker: LatestRequest = {
    start: () => {
      current?.abort();
      current = new AbortController();
      return current;
    },
    finish: (controller) => {
      if (current === controller) current = null;
    },
    abort: () => {
      current?.abort();
      current = null;
    },
  };
  allTrackers.add(tracker);
  return tracker;
};

/**
 * Cancels every in-flight tracked request. Called on logout so a response that
 * arrives afterwards can't put admin data back into the store.
 */
export const abortAllRequests = (): void => {
  allTrackers.forEach((tracker) => tracker.abort());
};

/** Drops empty filters so the URL stays clean (`?page=2`, not `?page=2&search=`). */
export const toQueryParams = (query: object): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(query).filter(([, v]) => v !== undefined && v !== ""),
  );
