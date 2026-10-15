import type { RouteConfig } from "../types/routes";
import {
  AdminDashboard,
  AdminFrameForm,
  AdminFrames,
  AdminOrderDetail,
  AdminOrders,
  AdminUserDetail,
  AdminUsers,
} from "./lazyPages";

// Rendered under /admin (AdminLayout) — admin role required. Paths are relative to /admin.
export const generateAdminRoutes = (): RouteConfig[] => [
  { index: true, element: <AdminDashboard />, requiredRoles: ["admin"] },
  { path: "orders", element: <AdminOrders />, requiredRoles: ["admin"] },
  {
    path: "orders/:id",
    element: <AdminOrderDetail />,
    requiredRoles: ["admin"],
  },
  { path: "frames", element: <AdminFrames />, requiredRoles: ["admin"] },
  // Different keys so going from "new" to the saved frame remounts the form.
  {
    path: "frames/new",
    element: <AdminFrameForm key="create" />,
    requiredRoles: ["admin"],
  },
  {
    path: "frames/:id",
    element: <AdminFrameForm key="edit" />,
    requiredRoles: ["admin"],
  },
  { path: "users", element: <AdminUsers />, requiredRoles: ["admin"] },
  { path: "users/:id", element: <AdminUserDetail />, requiredRoles: ["admin"] },
];
