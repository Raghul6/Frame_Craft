import { TOKEN_REFRESH_BUFFER_MS } from "../constants/api";
import type { JwtClaims } from "../types/auth";
import { reportError } from "../utils/errors";

// The access token lives only in memory — never in localStorage — so injected scripts
// can't read it. The session survives reloads through the server's httpOnly refresh
// cookie (see bootstrapAuth).

let accessToken: string | null = null;
let accessTokenExpiresAt: number | null = null;
let onUnauthorized: (() => void) | null = null;

// Reads the JWT's `exp` claim (seconds since epoch) — just enough to refresh in time.
const decodeJwtExpiresAt = (token: string): number | null => {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json) as JwtClaims;
    return typeof exp === "number" ? exp * 1000 : null;
  } catch {
    return null;
  }
};

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (token: string): void => {
  accessToken = token;
  accessTokenExpiresAt = decodeJwtExpiresAt(token);
};

export const clearAccessToken = (): void => {
  accessToken = null;
  accessTokenExpiresAt = null;
};

/** True shortly before expiry, so the request interceptor can refresh first. */
export const isAccessTokenExpiringSoon = (): boolean =>
  accessToken !== null &&
  accessTokenExpiresAt !== null &&
  Date.now() >= accessTokenExpiresAt - TOKEN_REFRESH_BUFFER_MS;

export const setUnauthorizedHandler = (handler: () => void): void => {
  onUnauthorized = handler;
};

export const notifyUnauthorized = (): void => {
  try {
    onUnauthorized?.();
  } catch (err) {
    reportError("tokenManager.notifyUnauthorized", err);
  }
};
