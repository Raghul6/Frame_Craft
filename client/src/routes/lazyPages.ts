import { lazyWithPreload } from "../utils/lazyWithPreload";

// Every page here is code-split — each loads on first visit to its route, so
// storefront visitors never download admin code.

export const LoginPage = lazyWithPreload(
  () => import("../pages/Login/LoginPage"),
);
export const RegisterPage = lazyWithPreload(
  () => import("../pages/Register/RegisterPage"),
);
export const AdminLayout = lazyWithPreload(
  () => import("../layouts/AdminLayout"),
);

export const AdminDashboard = lazyWithPreload(
  () => import("../pages/admin/Dashboard/AdminDashboardPage"),
);
export const AdminOrders = lazyWithPreload(
  () => import("../pages/admin/Orders/AdminOrdersPage"),
);
export const AdminOrderDetail = lazyWithPreload(
  () => import("../pages/admin/OrderDetail/AdminOrderDetailPage"),
);
export const AdminFrames = lazyWithPreload(
  () => import("../pages/admin/Frames/AdminFramesPage"),
);
export const AdminFrameForm = lazyWithPreload(
  () => import("../pages/admin/FrameForm/AdminFrameFormPage"),
);
export const AdminUsers = lazyWithPreload(
  () => import("../pages/admin/Users/AdminUsersPage"),
);
export const AdminUserDetail = lazyWithPreload(
  () => import("../pages/admin/UserDetail/AdminUserDetailPage"),
);

/** Downloads the admin shell + dashboard ahead of time (called once an admin is known). */
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
