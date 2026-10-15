import { env } from "../config/env.js";
import type { LogFields, LogLevel } from "../types/app.js";

const LEVELS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};
const minLevel = LEVELS[env.logLevel];

const serializeError = (err: unknown): unknown => {
  if (!(err instanceof Error)) return err;
  return {
    name: err.name,
    message: err.message,
    ...("code" in err ? { code: err.code } : {}),
    stack: env.isProduction ? undefined : err.stack,
    ...(err.cause ? { cause: serializeError(err.cause) } : {}),
  };
};

const write = (level: LogLevel, message: string, fields: LogFields = {}) => {
  if (LEVELS[level] < minLevel) return;
  const data = Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      key === "err" ? serializeError(value) : value,
    ]),
  );
  const stream =
    level === "error" || level === "warn" ? process.stderr : process.stdout;

  if (env.isProduction) {
    // One JSON object per line — what log collectors (CloudWatch, Loki, Datadog…) expect.
    stream.write(
      `${JSON.stringify({ level, time: new Date().toISOString(), msg: message, ...data })}\n`,
    );
  } else {
    const extra = Object.keys(data).length ? ` ${JSON.stringify(data)}` : "";
    stream.write(
      `${new Date().toISOString().slice(11, 23)} ${level.toUpperCase().padEnd(5)} ${message}${extra}\n`,
    );
  }
};

export const logger = {
  debug: (message: string, fields?: LogFields) =>
    write("debug", message, fields),
  info: (message: string, fields?: LogFields) => write("info", message, fields),
  warn: (message: string, fields?: LogFields) => write("warn", message, fields),
  error: (message: string, fields?: LogFields) =>
    write("error", message, fields),
};
