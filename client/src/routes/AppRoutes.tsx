import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Spinner from "../components/common/Spinner";
import MainLayout from "../layouts/MainLayout";
// Home (the landing page) stays in the main bundle; everything else is code-split.
import HomePage from "../pages/Home/HomePage";
import type { RouteConfig } from "../types/routes";
import { generateAdminRoutes } from "./generateRoutes";
import GuestRoute from "./GuestRoute";
import { AdminLayout, LoginPage, RegisterPage } from "./lazyPages";
import { PATHS } from "./paths";
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";

const routeFallback = <Spinner full />;

const renderGuardedRoutes = (routes: RouteConfig[]) =>
  routes.map((route) => (
    <Route
      key={route.path ?? "index"}
      index={route.index}
      path={route.path}
      element={
        <RoleBasedRoute requiredRoles={route.requiredRoles}>
          {route.element}
        </RoleBasedRoute>
      }
    />
  ));

// MainLayout and AdminLayout each wrap their <Outlet /> in Suspense, so this outer
// boundary only shows while a lazy layout itself loads.
const AppRoutes = () => (
  <Suspense fallback={routeFallback}>
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public — no login required */}
        <Route index element={<HomePage />} />

        {/* One login page for everyone; admins are sent to /admin by role */}
        <Route element={<GuestRoute />}>
          <Route path={PATHS.login} element={<LoginPage />} />
          <Route path={PATHS.register} element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path={PATHS.admin.root} element={<AdminLayout />}>
          {renderGuardedRoutes(generateAdminRoutes())}
          <Route
            path="*"
            element={<Navigate to={PATHS.admin.root} replace />}
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={PATHS.home} replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
