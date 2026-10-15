import { Router } from "express";
import {
  authLimiter,
  loginPerUserLimiter,
  refreshLimiter,
} from "../middleware/rateLimit.middleware.js";
import { assertRoutesProtected } from "../utils/assertRoutesProtected.js";
import adminRoutes from "./admin.routes.js";
import authRoutes from "./auth.routes.js";
import healthRoutes from "./health.routes.js";

const api = Router();

// Brute-force protection on the public auth endpoints (kept here so the route files
// stay `router.METHOD(path, verifyToken?, handler)`).
api.post("/auth/register", authLimiter);
api.post("/auth/login", authLimiter, loginPerUserLimiter);
api.post(["/auth/refresh", "/auth/logout"], refreshLimiter);

api.use("/health", healthRoutes);
api.use("/auth", authRoutes);
api.use("/admin", adminRoutes);

// Refuse to start if any non-public route lacks verifyToken.
assertRoutesProtected(healthRoutes, "/api/health");
assertRoutesProtected(authRoutes, "/api/auth");
assertRoutesProtected(adminRoutes, "/api/admin");

export default api;
