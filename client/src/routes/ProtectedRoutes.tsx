import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../components/common/Spinner";
import { BRAND_NAME } from "../constants/ui";
import { useAuth } from "../hooks/useAuth";
import type { RedirectState } from "../types/auth";
import type { ProtectedRoutesProps } from "../types/components";

/**
 * Renders a protected page only for a signed-in user whose role is allowed, and
 * names the browser tab after the route.
 * Signed out → /login (and back here after login); wrong role → home.
 */
const ProtectedRoutes = ({
  component: Component,
  roles,
  name,
}: ProtectedRoutesProps) => {
  const { user, bootstrapped } = useAuth();
  const location = useLocation();

  // The route's name becomes the browser tab title, e.g. "Orders · FrameCraft".
  useEffect(() => {
    if (name) document.title = `${name} · ${BRAND_NAME}`;
  }, [name]);

  if (!bootstrapped) return <Spinner full />;

  if (!user) {
    const state: RedirectState = { from: location.pathname + location.search };
    return <Navigate to="/login" replace state={state} />;
  }

  if (!roles.includes(user.role)) return <Navigate to="/" replace />;

  return <Component />;
};

export default ProtectedRoutes;
