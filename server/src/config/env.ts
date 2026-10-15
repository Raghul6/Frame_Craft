import type { SignOptions } from "jsonwebtoken";
import type { PoolConfig } from "pg";
import { DEFAULTS } from "../constants/app.js";
import {
  JWT_AUDIENCE,
  JWT_ISSUER,
  MIN_JWT_SECRET_LENGTH,
} from "../constants/auth.js";
import type { LogLevel } from "../types/app.js";

// Node 22's built-in .env loader (replaces the dotenv package). In production the
// variables usually come from the platform, so a missing file is fine.
try {
  process.loadEnvFile();
} catch {
  // no .env file
}

const problems: string[] = [];
const read = (name: string) => process.env[name]?.trim() || undefined;
/** Integer setting; `min` is 1 by default (sizes, ports) or 0 where "none" is valid. */
const int = (name: string, fallback: number, min = 1) => {
  const raw = read(name);
  if (raw === undefined) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min) {
    problems.push(`${name} must be a whole number ≥ ${min}`);
  }
  return value;
};
const bool = (name: string, fallback: boolean) => {
  const raw = read(name)?.toLowerCase();
  return raw === undefined ? fallback : raw === "true" || raw === "1";
};

const nodeEnv = read("NODE_ENV") ?? "development";
const isProduction = nodeEnv === "production";

// One secret both signs and verifies tokens (HS256). Production refuses a short one.
const jwtSecret = read("JWT_SECRET") ?? "";
if (!jwtSecret) {
  problems.push("JWT_SECRET is required (e.g. `openssl rand -hex 64`)");
} else if (isProduction && jwtSecret.length < MIN_JWT_SECRET_LENGTH) {
  problems.push(
    `JWT_SECRET must be at least ${MIN_JWT_SECRET_LENGTH} characters in production`,
  );
}

if (!read("DATABASE_URL") && !read("DB_HOST")) {
  problems.push("set DATABASE_URL, or DB_HOST/DB_USER/DB_PASSWORD/DB_NAME");
}

const logLevel = (read("LOG_LEVEL") ?? DEFAULTS.logLevel) as LogLevel;
if (!["debug", "info", "warn", "error"].includes(logLevel)) {
  problems.push("LOG_LEVEL must be debug, info, warn or error");
}

const dbSsl = bool("DB_SSL", false);
// DATABASE_URL wins when set; otherwise build the config from the DB_* values.
const db: PoolConfig = {
  ...(read("DATABASE_URL")
    ? { connectionString: read("DATABASE_URL") }
    : {
        host: read("DB_HOST"),
        port: int("DB_PORT", DEFAULTS.dbPort),
        user: read("DB_USER") ?? DEFAULTS.dbUser,
        password: process.env.DB_PASSWORD ?? "",
        database: read("DB_NAME") ?? DEFAULTS.dbName,
      }),
  max: int("DB_POOL_MAX", DEFAULTS.dbPoolMax),
  ssl: dbSsl
    ? { rejectUnauthorized: bool("DB_SSL_REJECT_UNAUTHORIZED", true) }
    : undefined,
};

const port = int("PORT", DEFAULTS.port);
const refreshTokenTtlDays = int(
  "REFRESH_TOKEN_TTL_DAYS",
  DEFAULTS.refreshTokenTtlDays,
);
const trustProxy = int("TRUST_PROXY", 0, 0);

if (problems.length) {
  throw new Error(
    `Invalid configuration:\n  - ${problems.join("\n  - ")}\n(copy server/.env.example to server/.env and fill it in)`,
  );
}

export const env = {
  nodeEnv,
  isProduction,
  port,
  logLevel,
  /** Number of reverse proxies in front of the API (0 = none). Needed for correct client IPs. */
  trustProxy,
  clientOrigins: (read("CLIENT_ORIGIN") ?? DEFAULTS.clientOrigin)
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean),
  db,
  jwt: {
    secret: jwtSecret,
    accessTtl: (read("ACCESS_TOKEN_TTL") ??
      DEFAULTS.accessTokenTtl) as NonNullable<SignOptions["expiresIn"]>,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  },
  refreshToken: {
    ttlDays: refreshTokenTtlDays,
    // Cookies marked Secure only travel over https; local http dev needs them off.
    secureCookie: bool("COOKIE_SECURE", isProduction),
  },
};
