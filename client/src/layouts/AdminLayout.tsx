import { LogOut, Store } from "lucide-react";
import { Suspense } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { useHasNavigated } from "../hooks/useHasNavigated";
import Spinner from "../components/common/Spinner";
import { ADMIN_NAV } from "../constants/admin";
import { ADMIN_LOGO_SIZE, BRAND_NAME, ICON_SIZE, LOGO } from "../constants/ui";
import { logout } from "../features/auth/thunks";
import { useAuth } from "../hooks/useAuth";
import "../styles/admin.css";

const AdminLayout = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const hasNavigated = useHasNavigated();

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <Link to="/admin" className="admin-brand">
          <img
            src={LOGO.src}
            alt=""
            width={ADMIN_LOGO_SIZE}
            height={ADMIN_LOGO_SIZE}
          />
          <span>
            {BRAND_NAME} <small>Admin</small>
          </span>
        </Link>
        <div className="admin-topbar-actions">
          <Link to="/" className="admin-topbar-link">
            <Store size={ICON_SIZE.md} /> <span>View store</span>
          </Link>
          <span className="admin-topbar-user" title={user?.username}>
            {user?.username}
          </span>
          <button
            type="button"
            className="admin-topbar-link"
            onClick={() => dispatch(logout())}
          >
            <LogOut size={ICON_SIZE.md} /> <span>Logout</span>
          </button>
        </div>
      </header>

      <nav className="admin-nav" aria-label="Admin">
        {ADMIN_NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className="admin-nav-link">
            <Icon size={ICON_SIZE.lg} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <main className="admin-main">
        <ErrorBoundary resetKey={pathname} inline>
          <Suspense fallback={<Spinner full />}>
            {/* Keyed by path so each page plays its enter animation (not on first load). */}
            <div
              key={pathname}
              className={hasNavigated ? "route-transition" : undefined}
            >
              <Outlet />
            </div>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default AdminLayout;
