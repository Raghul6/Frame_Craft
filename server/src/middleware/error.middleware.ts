import type { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger.js";
import { DatabaseError } from "../utils/databaseError.js";
import { HttpError } from "../utils/httpError.js";

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(
    new HttpError(
      404,
      `Route not found: ${req.method} ${req.originalUrl.split("?")[0]}`,
    ),
  );
}

const errorType = (err: unknown) =>
  typeof err === "object" && err !== null && "type" in err
    ? err.type
    : undefined;

// Express recognises error handlers by their 4-argument signature, so `next` must stay.
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // A response already started streaming: let Express close the connection.
  if (res.headersSent) return next(err);

  try {
    if (err instanceof HttpError) {
      return res
        .status(err.status)
        .json({ message: err.message, errors: err.fieldErrors });
    }
    // Errors raised by express.json() itself.
    if (errorType(err) === "entity.parse.failed") {
      return res.status(400).json({ message: "Invalid JSON body" });
    }
    if (errorType(err) === "entity.too.large") {
      return res.status(413).json({ message: "Request body is too large" });
    }

    logger.error(
      err instanceof DatabaseError ? err.message : "Unhandled error",
      {
        reqId: req.id,
        method: req.method,
        path: req.originalUrl.split("?")[0],
        err,
      },
    );
    // Never leak internals: the id lets support find the full error in the logs.
    res.status(500).json({
      message: "Something went wrong. Please try again.",
      requestId: req.id,
    });
  } catch (handlerErr) {
    logger.error("Error handler failed", { err: handlerErr });
    if (!res.headersSent) res.status(500).end();
  }
}
