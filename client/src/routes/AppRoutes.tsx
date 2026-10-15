import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Spinner from "../components/common/Spinner";
import MainLayout from "../layouts/MainLayout";
// Home (the landing page) stays in the main bundle; everything else is code-split.
import HomePage from "../pages/Home/HomePage";
import GuestRoute from "./GuestRoute";
import ProtectedRoutes from "./ProtectedRoutes";
import routes, { AdminLayout, LoginPage, RegisterPage } from "./routes";

// MainLayout and AdminLayout each wrap their <Outlet /> in Suspense, so this outer
// boundary only shows while a lazy layout itself loads.
const AppRoutes = () => (
  <Suspense fallback={<Spinner full />}>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        {/* Logged-in users are sent on from these (admins → /admin). */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route
        path="/admin"
        element={<ProtectedRoutes component={AdminLayout} roles={["admin"]} />}
      >
        {routes.map(({ component, path, roles, name }) => (
          <Route
            key={path}
            path={path}
            // Keyed by path so e.g. "Add Frame" → "Edit Frame" mounts a fresh form.
            element={
              <ProtectedRoutes
                key={path}
                component={component}
                roles={roles}
                name={name}
              />
            }
          />
        ))}
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Route>

      <Route path="/*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
