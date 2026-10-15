/**
 * Single place where caught-but-unexpected errors are reported. Today it logs to the console;
 * swap in a monitoring service (Sentry etc.) here later without touching callers.
 */
export function reportError(context: string, err: unknown): void {
  try {
    console.error(`[${context}]`, err);
  } catch {
    // Logging must never throw.
  }
}
