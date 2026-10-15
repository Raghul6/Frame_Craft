import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "../components/common/Spinner";
import { useAuth } from "../hooks/useAuth";
import type { RedirectState } from "../types/auth";
import { getPostLoginPath } from "./paths";

/** Login/register pages: send logged-in users on — admins to /admin, customers back where they came from. */
const GuestRoute = () => {
  const { user, bootstrapped } = useAuth();
  const location = useLocation();

  if (!bootstrapped) return <Spinner full />;
  if (!user) return <Outlet />;

  const from = (location.state as RedirectState | null)?.from;
  return <Navigate to={getPostLoginPath(user.role, from)} replace />;
};

export default GuestRoute;
