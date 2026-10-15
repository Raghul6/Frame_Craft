import type { Request, Response } from "express";
import { checkDatabaseConnection } from "../config/db.js";

/** Liveness: the process is up (for container restarts). */
export function liveness(_req: Request, res: Response) {
  res.json({ status: "ok" });
}

/** Readiness: the API can reach PostgreSQL (for load balancers / deploys). */
export async function readiness(_req: Request, res: Response) {
  try {
    await checkDatabaseConnection();
    res.json({ status: "ready" });
  } catch {
    res.status(503).json({ status: "unavailable" });
  }
}
