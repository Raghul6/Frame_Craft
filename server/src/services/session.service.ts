import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import { withTransaction } from "../config/db.js";
import { env } from "../config/env.js";
import { DAY_MS } from "../constants/app.js";
import { REFRESH_TOKEN_BYTES } from "../constants/auth.js";
import { logger } from "../lib/logger.js";
import * as RefreshTokens from "../models/refreshToken.model.js";
import * as Users from "../models/user.model.js";
import type { PublicUser, Session, SessionMeta } from "../types/auth.js";
import { HttpError } from "../utils/httpError.js";
import { generateToken } from "../utils/jwt.js";

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const sessionExpired = () =>
  new HttpError(401, "Session expired, please log in again");

/** Issues a refresh token in `familyId` and returns the full session. */
async function issue(
  user: PublicUser,
  familyId: string,
  meta: SessionMeta,
  client?: PoolClient,
): Promise<Session> {
  const refreshToken = randomBytes(REFRESH_TOKEN_BYTES).toString("base64url");
  const refreshExpiresAt = new Date(
    Date.now() + env.refreshToken.ttlDays * DAY_MS,
  );
  await RefreshTokens.insertRefreshToken(
    {
      userId: user.id,
      familyId,
      tokenHash: hashToken(refreshToken),
      expiresAt: refreshExpiresAt,
      userAgent: meta.userAgent,
      ip: meta.ip,
    },
    client,
  );
  return {
    user,
    accessToken: generateToken(user.id, user.role),
    refreshToken,
    refreshExpiresAt,
  };
}

/** New login (or registration): a fresh token family. */
export const startSession = (user: PublicUser, meta: SessionMeta) =>
  issue(user, randomUUID(), meta);

/**
 * Swaps a refresh token for a new one (rotation). Presenting a token that was already
 * rotated means it was copied — the whole family is revoked and the user must log in again.
 */
export async function refreshSession(
  rawToken: string,
  meta: SessionMeta,
): Promise<Session> {
  // The transaction returns null instead of throwing for an invalid token, so that a
  // reuse-revocation inside it is COMMITTED (a throw would roll it back).
  const session = await withTransaction(async (client) => {
    const stored = await RefreshTokens.findRefreshTokenForUpdate(
      client,
      hashToken(rawToken),
    );
    if (!stored) return null;

    if (stored.revoked_at) {
      await RefreshTokens.revokeRefreshFamily(stored.family_id, client);
      logger.warn("Refresh token reuse detected; session family revoked", {
        userId: stored.user_id,
        familyId: stored.family_id,
      });
      return null;
    }
    if (stored.expires_at.getTime() <= Date.now()) return null;

    const row = await Users.findById(stored.user_id);
    if (!row) return null;

    await RefreshTokens.revokeRefreshToken(client, stored.id);
    return issue(Users.toPublicUser(row), stored.family_id, meta, client);
  });
  if (!session) throw sessionExpired();
  return session;
}

/** Logout: revokes every token of this login. Unknown tokens are ignored. */
export async function endSession(rawToken: string): Promise<void> {
  const familyId = await RefreshTokens.findRefreshFamilyByHash(
    hashToken(rawToken),
  );
  if (familyId) await RefreshTokens.revokeRefreshFamily(familyId);
}

export const purgeExpiredSessions = () =>
  RefreshTokens.deleteExpiredRefreshTokens();
