import { Router } from "express";
import {
  login,
  logout,
  me,
  refresh,
  register,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

// Public — a signed-out visitor must reach these (rate limits: routes/index.ts).
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh); // authenticated by the httpOnly refresh cookie
router.post("/logout", logout); // authenticated by the httpOnly refresh cookie

// Protected
router.get("/me", verifyToken, me);

export default router;
