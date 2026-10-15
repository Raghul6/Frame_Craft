import type { CookieOptions, Request, Response } from "express";
import { REFRESH_COOKIE_NAME, REFRESH_COOKIE_PATH } from "../constants/auth.js";
import { env } from "../config/env.js";

/** Reads one cookie from the Cookie header (no cookie-parser dependency needed). */
function readCookie(req: Request, name: string): string | null {
  const header = req.headers.cookie;
  if (!header) return null;
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    if (part.slice(0, index).trim() === name) {
      try {
        return decodeURIComponent(part.slice(index + 1).trim());
      } catch {
        return null;
      }
    }
  }
  return null;
}

// httpOnly: page scripts (and XSS) can't read it. SameSite=Strict: other sites can't
// make the browser send it (CSRF). Path: only sent to the auth endpoints that need it.
const refreshCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: env.refreshToken.secureCookie,
  sameSite: "strict",
  path: REFRESH_COOKIE_PATH,
});

export const setRefreshCookie = (
  res: Response,
  token: string,
  expiresAt: Date,
) => {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    ...refreshCookieOptions(),
    expires: expiresAt,
  });
};

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions());
};

export const readRefreshCookie = (req: Request) =>
  readCookie(req, REFRESH_COOKIE_NAME);
