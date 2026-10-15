import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "../components/common/Spinner";
import { useAuth } from "../hooks/useAuth";
import type { RedirectState } from "../types/auth";
import type { ProtectedRouteProps } from "../types/components";
import { PATHS } from "./paths";

/**
 * Wrap only pages that genuinely need an account. Public pages stay outside this,
 * so visitors are never forced to log in on arrival.
 */
const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
  const { user, bootstrapped } = useAuth();
  const location = useLocation();

  if (!bootstrapped) return <Spinner full />;

  if (!user) {
    const state: RedirectState = { from: location.pathname + location.search };
    return <Navigate to={PATHS.login} replace state={state} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={PATHS.home} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
