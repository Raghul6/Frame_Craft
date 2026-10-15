import { lazyWithPreload } from "../utils/lazyWithPreload";
import type { AppRoute } from "../types/routes";

// Every page is code-split — each loads on first visit to its route, so storefront
// visitors never download admin code.
export const LoginPage = lazyWithPreload(
  () => import("../pages/Login/LoginPage"),
);
export const RegisterPage = lazyWithPreload(
  () => import("../pages/Register/RegisterPage"),
);
export const AdminLayout = lazyWithPreload(
  () => import("../layouts/AdminLayout"),
);

const AdminDashboard = lazyWithPreload(
  () => import("../pages/admin/Dashboard/AdminDashboardPage"),
);
const AdminOrders = lazyWithPreload(
  () => import("../pages/admin/Orders/AdminOrdersPage"),
);
const AdminOrderDetail = lazyWithPreload(
  () => import("../pages/admin/OrderDetail/AdminOrderDetailPage"),
);
const AdminFrames = lazyWithPreload(
  () => import("../pages/admin/Frames/AdminFramesPage"),
);
const AdminFrameForm = lazyWithPreload(
  () => import("../pages/admin/FrameForm/AdminFrameFormPage"),
);
const AdminUsers = lazyWithPreload(
  () => import("../pages/admin/Users/AdminUsersPage"),
);
const AdminUserDetail = lazyWithPreload(
  () => import("../pages/admin/UserDetail/AdminUserDetailPage"),
);

/** Downloads the admin shell + dashboard ahead of time (once an admin is signed in). */
export const preloadAdmin = () => {
  void AdminLayout.preload();
  void AdminDashboard.preload();
};

/** Downloads the login page ahead of time (hover / focus on the Login button). */
export const preloadLogin = () => {
  void LoginPage.preload();
};

/** Downloads the register page ahead of time (hover / focus on "Create an account"). */
export const preloadRegister = () => {
  void RegisterPage.preload();
};

const routes: AppRoute[] = [
  {
    path: "/admin",
    name: "Dashboard",
    roles: ["admin"],
    component: AdminDashboard,
  },
  {
    path: "/admin/orders",
    name: "Orders",
    roles: ["admin"],
    component: AdminOrders,
  },
  {
    path: "/admin/orders/:id",
    name: "Order Detail",
    roles: ["admin"],
    component: AdminOrderDetail,
  },
  {
    path: "/admin/frames",
    name: "Frames",
    roles: ["admin"],
    component: AdminFrames,
  },
  {
    path: "/admin/frames/new",
    name: "Add Frame",
    roles: ["admin"],
    component: AdminFrameForm,
  },
  {
    path: "/admin/frames/:id",
    name: "Edit Frame",
    roles: ["admin"],
    component: AdminFrameForm,
  },
  {
    path: "/admin/users",
    name: "Users",
    roles: ["admin"],
    component: AdminUsers,
  },
  {
    path: "/admin/users/:id",
    name: "User Detail",
    roles: ["admin"],
    component: AdminUserDetail,
  },
];

export default routes;
