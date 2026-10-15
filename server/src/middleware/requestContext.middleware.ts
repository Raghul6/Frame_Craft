import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { REQUEST_ID_PATTERN } from "../constants/app.js";
import { logger } from "../lib/logger.js";

/**
 * Gives every request an id (reusing a safe X-Request-Id from a proxy), echoes it in the
 * response, and writes one access-log line when the response finishes.
 */
export function requestContext(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const incoming = req.get("x-request-id");
  req.id =
    incoming && REQUEST_ID_PATTERN.test(incoming) ? incoming : randomUUID();
  res.setHeader("X-Request-Id", req.id);

  const startedAt = process.hrtime.bigint();
  res.on("finish", () => {
    const ms = Number(process.hrtime.bigint() - startedAt) / 1e6;
    const fields = {
      reqId: req.id,
      method: req.method,
      path: req.originalUrl.split("?")[0],
      status: res.statusCode,
      ms: Math.round(ms * 10) / 10,
      userId: req.auth?.userId,
    };
    if (res.statusCode >= 500) logger.error("request", fields);
    else if (res.statusCode >= 400) logger.warn("request", fields);
    else logger.info("request", fields);
  });
  next();
}
