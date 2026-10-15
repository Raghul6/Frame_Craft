import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { RoleBasedRouteProps } from "../types/components";
import { PATHS } from "./paths";

const RoleBasedRoute = ({ requiredRoles, children }: RoleBasedRouteProps) => {
  const { user } = useAuth();

  if (
    requiredRoles.length > 0 &&
    (!user || !requiredRoles.includes(user.role))
  ) {
    return <Navigate to={PATHS.home} replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
