import type { Server } from "node:http";

let server: Server | undefined;
let cleanupTimer: NodeJS.Timeout | undefined;

async function start() {
  // Imported here so a bad .env (thrown while loading config) is caught and reported below.
  const [
    { default: app },
    { env },
    { checkDatabaseConnection },
    { logger },
    constants,
    sessions,
  ] = await Promise.all([
    import("./app.js"),
    import("./config/env.js"),
    import("./config/db.js"),
    import("./lib/logger.js"),
    import("./constants/app.js"),
    import("./services/session.service.js"),
  ]);

  await checkDatabaseConnection();

  // Express 5 also calls app.listen's callback on failure, so use the server's own events.
  server = app.listen(env.port);
  server.requestTimeout = constants.HTTP_REQUEST_TIMEOUT_MS;
  server.headersTimeout = constants.HTTP_HEADERS_TIMEOUT_MS;
  server.keepAliveTimeout = constants.HTTP_KEEP_ALIVE_TIMEOUT_MS;

  server.on("listening", () => {
    logger.info("FrameCraft API listening", {
      port: env.port,
      env: env.nodeEnv,
    });
  });
  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      logger.error(
        `Port ${env.port} is already in use. Stop the other process or change PORT in server/.env.`,
      );
    } else {
      logger.error("HTTP server error", { err });
    }
    process.exit(1);
  });

  // Housekeeping: expired refresh tokens are removed hourly (doesn't keep the process alive).
  cleanupTimer = setInterval(async () => {
    try {
      const removed = await sessions.purgeExpiredSessions();
      if (removed) logger.info("Purged expired refresh tokens", { removed });
    } catch (err) {
      logger.error("Refresh token cleanup failed", { err });
    }
  }, constants.TOKEN_CLEANUP_INTERVAL_MS);
  cleanupTimer.unref();
}

async function shutdown(signal: string) {
  // Plain console here: the logger module may be what failed to load.
  console.log(`${signal} received, shutting down…`);
  try {
    if (cleanupTimer) clearInterval(cleanupTimer);
    await new Promise<void>((resolve, reject) => {
      if (!server) return resolve();
      server.close((err) => (err ? reject(err) : resolve()));
      // Let in-flight keep-alive connections finish their current request, then close.
      server.closeIdleConnections();
    });
    const { pool } = await import("./config/db.js");
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

// Last-resort logging for errors that escaped every try/catch.
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

start().catch((err: unknown) => {
  console.error(
    "Failed to start the API:",
    err instanceof Error ? err.message : err,
  );
  process.exit(1);
});
