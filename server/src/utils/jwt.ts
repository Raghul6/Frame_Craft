import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { JWT_ALGORITHM } from "../constants/auth.js";
import type { UserRole } from "../types/auth.js";

/**
 * Creates an access token, signed (HS256) with JWT_SECRET.
 * Used by login, register and refresh (services/session.service.ts).
 */
export const generateToken = (userId: number, role: UserRole): string =>
  jwt.sign({ role }, env.jwt.secret, {
    algorithm: JWT_ALGORITHM,
    subject: String(userId),
    expiresIn: env.jwt.accessTtl,
    issuer: env.jwt.issuer,
    audience: env.jwt.audience,
  });

/**
 * Checks a token with JWT_SECRET and returns the user id. Throws for a bad signature,
 * expiry, wrong issuer/audience, or any algorithm other than HS256 (blocks "alg: none").
 */
export const verifyJwt = (token: string): number => {
  const payload = jwt.verify(token, env.jwt.secret, {
    algorithms: [JWT_ALGORITHM],
    issuer: env.jwt.issuer,
    audience: env.jwt.audience,
  });
  const userId = typeof payload === "string" ? Number.NaN : Number(payload.sub);
  if (!Number.isInteger(userId) || userId <= 0)
    throw new Error("Malformed token subject");
  return userId;
};
