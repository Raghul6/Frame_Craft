/** Resolves after `ms` milliseconds (e.g. to let an exit animation finish). */
export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));
