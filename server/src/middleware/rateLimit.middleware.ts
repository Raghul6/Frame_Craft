import type { Request } from "express";
import rateLimit, { ipKeyGenerator, type Options } from "express-rate-limit";
import {
  API_RATE_LIMIT_MAX,
  API_RATE_LIMIT_WINDOW_MS,
} from "../constants/app.js";
import {
  AUTH_RATE_LIMIT_MAX,
  AUTH_RATE_LIMIT_WINDOW_MS,
  LOGIN_PER_USER_RATE_LIMIT_MAX,
  REFRESH_RATE_LIMIT_MAX,
} from "../constants/auth.js";

const limiter = (
  windowMs: number,
  limit: number,
  extra: Partial<Options> = {},
) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      message: "Too many requests. Please try again in a few minutes.",
    },
    ...extra,
  });

/** Every /api request, per IP — a ceiling against floods and scrapers. */
export const apiLimiter = limiter(API_RATE_LIMIT_WINDOW_MS, API_RATE_LIMIT_MAX);

/** Login and register, per IP. */
export const authLimiter = limiter(
  AUTH_RATE_LIMIT_WINDOW_MS,
  AUTH_RATE_LIMIT_MAX,
);

/** Login, per IP + username — stops password guessing on one account from rotating IPs slowly. */
export const loginPerUserLimiter = limiter(
  AUTH_RATE_LIMIT_WINDOW_MS,
  LOGIN_PER_USER_RATE_LIMIT_MAX,
  {
    keyGenerator: (req: Request) => {
      const username =
        typeof req.body?.username === "string"
          ? req.body.username.trim().toLowerCase()
          : "";
      return `${ipKeyGenerator(req.ip ?? "")}:${username}`;
    },
    skipSuccessfulRequests: true,
  },
);

/** Token refresh, per IP. */
export const refreshLimiter = limiter(
  AUTH_RATE_LIMIT_WINDOW_MS,
  REFRESH_RATE_LIMIT_MAX,
);
