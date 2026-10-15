/** Fallbacks used by config/env.ts when the matching environment variable is unset. */
export const DEFAULTS = {
  port: 5000,
  clientOrigin: "http://localhost:5173",
  dbPort: 5432,
  dbUser: "postgres",
  dbName: "framecraft",
  dbPoolMax: 10,
  accessTokenTtl: "15m",
  refreshTokenTtlDays: 7,
  logLevel: "info",
} as const;

/** Max size of a JSON request body. */
export const JSON_BODY_LIMIT = "50kb";

/** PostgreSQL error code for unique_violation. */
export const PG_UNIQUE_VIOLATION = "23505";

/** Connection pool tuning (milliseconds). */
export const DB_IDLE_TIMEOUT_MS = 30_000;
export const DB_CONNECTION_TIMEOUT_MS = 5_000;
/** A single query is cancelled by PostgreSQL after this long. */
export const DB_STATEMENT_TIMEOUT_MS = 10_000;
/** A transaction left open and idle this long is killed (protects the pool). */
export const DB_IDLE_IN_TRANSACTION_TIMEOUT_MS = 15_000;
/** Queries slower than this are logged as warnings. */
export const SLOW_QUERY_MS = 200;
export const DB_APPLICATION_NAME = "framecraft-api";

/** HTTP server timeouts (milliseconds). keepAlive must exceed a typical proxy's 60s. */
export const HTTP_REQUEST_TIMEOUT_MS = 30_000;
export const HTTP_HEADERS_TIMEOUT_MS = 65_000;
export const HTTP_KEEP_ALIVE_TIMEOUT_MS = 61_000;

/** How often expired refresh tokens are purged. */
export const TOKEN_CLEANUP_INTERVAL_MS = 60 * 60 * 1000;

/** Global API rate limit (per IP). */
export const API_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const API_RATE_LIMIT_MAX = 600;

/** Search terms longer than this are cut (no legitimate search needs more). */
export const MAX_SEARCH_LENGTH = 100;

export const DAY_MS = 24 * 60 * 60 * 1000;

/** Accepted format for an incoming X-Request-Id header (otherwise a fresh UUID is used). */
export const REQUEST_ID_PATTERN = /^[\w-]{8,64}$/;
