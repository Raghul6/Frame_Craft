import type { NextFunction, Request, Response } from "express";
import { ROUTE_ROLE_ACCESS } from "../constants/auth.js";
import { logger } from "../lib/logger.js";
import * as Users from "../models/user.model.js";
import { HttpError } from "../utils/httpError.js";
import { verifyJwt } from "../utils/jwt.js";

const getBearerToken = (req: Request): string | null => {
  const [scheme, token] = (req.headers.authorization ?? "").split(" ");
  return scheme === "Bearer" && token ? token : null;
};

/** Roles allowed for this request's API area (most specific prefix wins), or null if unlisted. */
const allowedRoles = (req: Request) => {
  const path = `${req.baseUrl}${req.path}`;
  const rule = ROUTE_ROLE_ACCESS.filter(
    ({ prefix }) => path === prefix || path.startsWith(`${prefix}/`),
  ).sort((a, b) => b.prefix.length - a.prefix.length)[0];
  return rule?.roles ?? null;
};

/**
 * Put on every protected route: `router.get("/users", verifyToken, listUsers)`.
 *
 * 1. a Bearer token must be present;
 * 2. the token must be valid (utils/jwt.ts → verifyJwt);
 * 3. the user must still exist — the role comes from the database, not the token,
 *    so a deleted or demoted account loses access on its very next request;
 * 4. that role must be allowed for this API area (ROUTE_ROLE_ACCESS).
 */
export async function verifyToken(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const token = getBearerToken(req);
    if (!token) return next(new HttpError(401, "No token provided"));

    let userId: number;
    try {
      userId = verifyJwt(token);
    } catch (err) {
      logger.warn("Failed to verify token", {
        reqId: req.id,
        reason: err instanceof Error ? err.message : String(err),
      });
      return next(new HttpError(401, "Session expired, please log in again"));
    }

    const user = await Users.findAuthUser(userId);
    if (!user)
      return next(new HttpError(401, "Session expired, please log in again"));

    const roles = allowedRoles(req);
    if (!roles) {
      logger.error("No role access rule for protected route", {
        reqId: req.id,
        path: req.originalUrl,
      });
      return next(
        new HttpError(403, "You do not have access to this resource"),
      );
    }
    if (!roles.includes(user.role)) {
      return next(
        new HttpError(403, "You do not have access to this resource"),
      );
    }

    req.auth = { userId: user.id, role: user.role };
    next();
  } catch (err) {
    next(err);
  }
}
