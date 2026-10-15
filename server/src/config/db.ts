import pg, { type PoolClient, type QueryResultRow } from "pg";
import {
  DB_APPLICATION_NAME,
  DB_CONNECTION_TIMEOUT_MS,
  DB_IDLE_IN_TRANSACTION_TIMEOUT_MS,
  DB_IDLE_TIMEOUT_MS,
  DB_STATEMENT_TIMEOUT_MS,
  SLOW_QUERY_MS,
} from "../constants/app.js";
import { logger } from "../lib/logger.js";
import { env } from "./env.js";

// Return NUMERIC (prices, sizes) and BIGINT (COUNT/SUM) as JS numbers instead of strings.
pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value) =>
  Number.parseFloat(value),
);
pg.types.setTypeParser(pg.types.builtins.INT8, (value) =>
  Number.parseInt(value, 10),
);

export const pool = new pg.Pool({
  ...env.db,
  application_name: DB_APPLICATION_NAME,
  idleTimeoutMillis: DB_IDLE_TIMEOUT_MS,
  connectionTimeoutMillis: DB_CONNECTION_TIMEOUT_MS,
  // Server-side limits: a runaway query or a stuck transaction can't hold a connection forever.
  statement_timeout: DB_STATEMENT_TIMEOUT_MS,
  idle_in_transaction_session_timeout: DB_IDLE_IN_TRANSACTION_TIMEOUT_MS,
  keepAlive: true,
});

// An idle client can lose its connection (DB restart, network drop). Without a listener
// this 'error' event would crash the process; the pool drops the client and reconnects later.
pool.on("error", (err) => {
  logger.error("PostgreSQL idle client error", { err });
});

const logIfSlow = (text: string, startedAt: number) => {
  const ms = Date.now() - startedAt;
  if (ms >= SLOW_QUERY_MS) {
    logger.warn("Slow query", {
      ms,
      sql: text.replace(/\s+/g, " ").trim().slice(0, 300),
    });
  }
};

export const query = async <T extends QueryResultRow>(
  text: string,
  params?: unknown[],
) => {
  const startedAt = Date.now();
  try {
    return await pool.query<T>(text, params);
  } finally {
    logIfSlow(text, startedAt);
  }
};

/** Runs `work` inside BEGIN/COMMIT, rolling back if it throws. */
export async function withTransaction<T>(
  work: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackErr) {
      // Keep the original error; a failed rollback usually means the connection is gone.
      logger.error("ROLLBACK failed", { err: rollbackErr });
    }
    throw err;
  } finally {
    client.release();
  }
}

/** Checks the database is reachable (startup and the readiness probe). */
export async function checkDatabaseConnection(): Promise<void> {
  try {
    await pool.query("SELECT 1");
  } catch (err) {
    throw new Error(
      `Cannot connect to PostgreSQL: ${err instanceof Error ? err.message : String(err)}`,
      { cause: err },
    );
  }
}
