import { lazy, type ComponentType } from "react";
import type { PreloadableComponent } from "../types/routes";
import { IDLE_FALLBACK_MS, IDLE_TIMEOUT_MS } from "../constants/ui";

/**
 * React.lazy plus a `.preload()` that starts downloading the chunk early (on hover,
 * on idle, …) so the page is usually ready before the user actually clicks.
 */
export const lazyWithPreload = <P extends object>(
  factory: () => Promise<{ default: ComponentType<P> }>,
): PreloadableComponent<P> => {
  let pending: Promise<{ default: ComponentType<P> }> | null = null;
  const load = () => {
    pending ??= factory().catch((err: unknown) => {
      pending = null; // allow a retry after a network error
      throw err;
    });
    return pending;
  };
  return Object.assign(lazy(load), { preload: load });
};

/** Runs `task` when the browser is idle (falls back to a short timeout). */
export const whenIdle = (task: () => void): void => {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(task, { timeout: IDLE_TIMEOUT_MS });
  } else {
    window.setTimeout(task, IDLE_FALLBACK_MS);
  }
};
