import type { RouteAccessRule } from "../types/auth.js";

// Keep these rules in sync with client/src/utils/validators.ts on the frontend.

/** bcrypt cost factor used for every password hash. */
export const SALT_ROUNDS = 12;

/** Hashed once at startup and compared against when a username doesn't exist (timing-safe login). */
export const DUMMY_PASSWORD = "framecraft-dummy-password";

export const USERNAME_REGEX = /^[a-zA-Z0-9_.]{3,30}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Optional leading +, then 10–15 digits (spaces/dashes are stripped before checking)
export const MOBILE_REGEX = /^\+?\d{10,15}$/;

export const PASSWORD_MIN_LENGTH = 8;
/** bcrypt only uses the first 72 *bytes* of a password (multi-byte characters count more than once). */
export const PASSWORD_MAX_BYTES = 72;

/** Rate limits (per 15 minutes). Login is also limited per IP + username against password guessing. */
export const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const AUTH_RATE_LIMIT_MAX = 20;
export const LOGIN_PER_USER_RATE_LIMIT_MAX = 10;
export const REFRESH_RATE_LIMIT_MAX = 120;

/** Refresh-token cookie: random bytes, stored only as a SHA-256 hash. */
export const REFRESH_TOKEN_BYTES = 32;
export const REFRESH_COOKIE_NAME = "fc_refresh";
/** The cookie is only sent to the auth endpoints, never to the rest of the API. */
export const REFRESH_COOKIE_PATH = "/api/auth";
/** Stored user-agent strings are cut to the column size. */
export const USER_AGENT_MAX_LENGTH = 255;

/** Access tokens are HMAC-signed with JWT_SECRET; only this algorithm is accepted. */
export const JWT_ALGORITHM = "HS256";
/** Production refuses to start with a JWT_SECRET shorter than this. */
export const MIN_JWT_SECRET_LENGTH = 32;
export const JWT_ISSUER = "framecraft-api";
export const JWT_AUDIENCE = "framecraft-client";

/**
 * Role-based access for every protected API, checked inside verifyToken. The most
 * specific prefix wins; a protected route whose prefix isn't listed is DENIED, so a new
 * area can't be opened by accident.
 */
export const ROUTE_ROLE_ACCESS: readonly RouteAccessRule[] = [
  { prefix: "/api/admin", roles: ["admin"] },
  { prefix: "/api/auth", roles: ["admin", "customer"] },
];

/**
 * The only routes allowed to skip verifyToken ("METHOD /full/path"). The server refuses
 * to start if any other route is missing it (see utils/assertRoutesProtected.ts).
 */
export const PUBLIC_ROUTES: readonly string[] = [
  "GET /api/health",
  "GET /api/health/ready",
  "POST /api/auth/register",
  "POST /api/auth/login",
  "POST /api/auth/refresh",
  "POST /api/auth/logout",
];
