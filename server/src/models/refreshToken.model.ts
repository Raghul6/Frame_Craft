import type { PoolClient } from "pg";
import { query } from "../config/db.js";
import type { NewRefreshToken } from "../types/auth.js";
import type { RefreshTokenRow } from "../types/db.js";
import { withDbErrors } from "../utils/databaseError.js";

export const insertRefreshToken = (
  token: NewRefreshToken,
  client?: PoolClient,
) =>
  withDbErrors("insertRefreshToken", async () => {
    const sql = `INSERT INTO refresh_tokens (user_id, family_id, token_hash, expires_at, user_agent, ip)
                 VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [
      token.userId,
      token.familyId,
      token.tokenHash,
      token.expiresAt,
      token.userAgent,
      token.ip,
    ];
    await (client ? client.query(sql, values) : query(sql, values));
  });

/** Locks the row (FOR UPDATE) so two refreshes with the same token can't both rotate it. */
export const findRefreshTokenForUpdate = (
  client: PoolClient,
  tokenHash: string,
) =>
  withDbErrors("findRefreshTokenForUpdate", async () => {
    const { rows } = await client.query<RefreshTokenRow>(
      `SELECT id, user_id, family_id, expires_at, revoked_at
       FROM refresh_tokens WHERE token_hash = $1 FOR UPDATE`,
      [tokenHash],
    );
    return rows[0] ?? null;
  });

export const revokeRefreshToken = (client: PoolClient, id: number) =>
  withDbErrors("revokeRefreshToken", async () => {
    await client.query(
      "UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1",
      [id],
    );
  });

/** Ends every token of one login (logout, or a stolen token being replayed). */
export const revokeRefreshFamily = (familyId: string, client?: PoolClient) =>
  withDbErrors("revokeRefreshFamily", async () => {
    const sql =
      "UPDATE refresh_tokens SET revoked_at = NOW() WHERE family_id = $1 AND revoked_at IS NULL";
    await (client ? client.query(sql, [familyId]) : query(sql, [familyId]));
  });

export const findRefreshFamilyByHash = (tokenHash: string) =>
  withDbErrors("findRefreshFamilyByHash", async () => {
    const { rows } = await query<Pick<RefreshTokenRow, "family_id">>(
      "SELECT family_id FROM refresh_tokens WHERE token_hash = $1",
      [tokenHash],
    );
    return rows[0]?.family_id ?? null;
  });

/** Housekeeping: drops tokens that expired more than a day ago. Returns how many. */
export const deleteExpiredRefreshTokens = () =>
  withDbErrors("deleteExpiredRefreshTokens", async () => {
    const { rowCount } = await query(
      "DELETE FROM refresh_tokens WHERE expires_at < NOW() - INTERVAL '1 day'",
    );
    return rowCount ?? 0;
  });
