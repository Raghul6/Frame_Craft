import { Router } from "express";
import {
  createFrame,
  deleteFrame,
  getDashboard,
  getFrame,
  getOrder,
  getUser,
  listFrames,
  listOrders,
  listUsers,
  updateFrame,
  updateOrderStatus,
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

// Admin role is enforced inside verifyToken (ROUTE_ROLE_ACCESS: /api/admin → admin).
const router = Router();

router.get("/dashboard", verifyToken, getDashboard);

router.get("/users", verifyToken, listUsers);
router.get("/users/:id", verifyToken, getUser);

router.get("/orders", verifyToken, listOrders);
router.get("/orders/:id", verifyToken, getOrder);
router.patch("/orders/:id/status", verifyToken, updateOrderStatus);

router.get("/frames", verifyToken, listFrames);
router.post("/frames", verifyToken, createFrame);
router.get("/frames/:id", verifyToken, getFrame);
router.put("/frames/:id", verifyToken, updateFrame);
router.delete("/frames/:id", verifyToken, deleteFrame);

export default router;
