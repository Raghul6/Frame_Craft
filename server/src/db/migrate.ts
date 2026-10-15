/**
 * Applies pending SQL files from ./migrations in name order (001_…, 002_…), each in its
 * own transaction, and records them in schema_migrations so none runs twice.
 *
 *   npm run db:migrate
 */
import { readdir, readFile } from "node:fs/promises";
import { pool } from "../config/db.js";
import { logger } from "../lib/logger.js";

/** Arbitrary constant: concurrent deploys wait for each other instead of migrating twice. */
const MIGRATION_LOCK_ID = 727_271;
const migrationsDir = new URL("./migrations/", import.meta.url);

const client = await pool.connect();
try {
  await client.query("SELECT pg_advisory_lock($1)", [MIGRATION_LOCK_ID]);
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version    VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )`);

  const { rows } = await client.query<{ version: string }>(
    "SELECT version FROM schema_migrations",
  );
  const applied = new Set(rows.map((r) => r.version));
  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith(".sql"))
    .sort();
  const pending = files.filter((f) => !applied.has(f));

  for (const file of pending) {
    const sql = await readFile(new URL(file, migrationsDir), "utf8");
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query(
        "INSERT INTO schema_migrations (version) VALUES ($1)",
        [file],
      );
      await client.query("COMMIT");
      logger.info("Applied migration", { file });
    } catch (err) {
      await client.query("ROLLBACK");
      throw new Error(
        `Migration ${file} failed: ${err instanceof Error ? err.message : err}`,
        {
          cause: err,
        },
      );
    }
  }

  logger.info(
    pending.length ? "Migrations complete" : "Database schema is up to date",
    {
      applied: pending.length,
    },
  );
} catch (err) {
  logger.error("Migration failed", { err });
  process.exitCode = 1;
} finally {
  try {
    await client.query("SELECT pg_advisory_unlock($1)", [MIGRATION_LOCK_ID]);
  } catch {
    // connection already gone — the lock is released with it
  }
  client.release();
  await pool.end();
}
