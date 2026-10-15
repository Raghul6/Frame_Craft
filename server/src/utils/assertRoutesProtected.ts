import type { Router } from "express";
import { PUBLIC_ROUTES } from "../constants/auth.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import type { RouterLayer } from "../types/app.js";

/**
 * Startup guard: every route on `router` (mounted at `prefix`) must either be listed in
 * PUBLIC_ROUTES or have verifyToken in its middleware. Forgetting it on a new route
 * stops the server from starting instead of shipping an open endpoint.
 */
export function assertRoutesProtected(router: Router, prefix: string): void {
  const unprotected: string[] = [];

  for (const layer of router.stack as RouterLayer[]) {
    if (!layer.route) continue;
    const { path, methods, stack } = layer.route;
    const hasVerify = stack.some((s) => s.handle === verifyToken);

    for (const method of Object.keys(methods)) {
      const id = `${method.toUpperCase()} ${prefix}${path === "/" ? "" : path}`;
      if (!hasVerify && !PUBLIC_ROUTES.includes(id)) unprotected.push(id);
    }
  }

  if (unprotected.length) {
    throw new Error(
      `Routes missing verifyToken (add it, or list them in PUBLIC_ROUTES):\n  - ${unprotected.join("\n  - ")}`,
    );
  }
}
