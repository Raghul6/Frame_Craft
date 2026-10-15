import {
  LayoutDashboard,
  LogOut,
  Menu,
  User as UserIcon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { STORE_NAV_LINKS } from "../../constants/navigation";
import {
  BRAND_NAME,
  ICON_SIZE,
  LOGO,
  NAV_DESKTOP_MEDIA_QUERY,
} from "../../constants/ui";
import { logout } from "../../features/auth/thunks";
import { useAuth } from "../../hooks/useAuth";
import { preloadAdmin, preloadLogin } from "../../routes/routes";
import { reportError } from "../../utils/errors";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { user, isAdmin, bootstrapped } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close on Escape and when resizing up to desktop.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);

    // Older Safari has no addEventListener on MediaQueryList; the menu still works without it.
    let desktop: MediaQueryList | null = null;
    const onResize = () => desktop?.matches && setMenuOpen(false);
    try {
      desktop = window.matchMedia(NAV_DESKTOP_MEDIA_QUERY);
      desktop.addEventListener("change", onResize);
    } catch (err) {
      reportError("navbar.matchMedia", err);
      desktop = null;
    }

    return () => {
      window.removeEventListener("keydown", onKey);
      try {
        desktop?.removeEventListener("change", onResize);
      } catch (err) {
        reportError("navbar.matchMedia.cleanup", err);
      }
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    dispatch(logout());
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo" onClick={closeMenu}>
        <img
          src={LOGO.src}
          srcSet={LOGO.srcSet}
          width={LOGO.width}
          height={LOGO.height}
          alt={`${BRAND_NAME} Logo`}
          className="nav-logo-img"
          fetchPriority="high"
        />
      </Link>

      <button
        type="button"
        className="nav-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
      >
        {menuOpen ? (
          <X size={ICON_SIZE.menu} />
        ) : (
          <Menu size={ICON_SIZE.menu} />
        )}
      </button>

      <div
        id="primary-navigation"
        className={`nav-links${menuOpen ? " open" : ""}`}
      >
        {STORE_NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}

        {bootstrapped &&
          (user ? (
            <div className="nav-user">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="nav-admin-link"
                  onClick={closeMenu}
                  onMouseEnter={preloadAdmin}
                  onFocus={preloadAdmin}
                >
                  <LayoutDashboard size={ICON_SIZE.sm} /> Admin panel
                </Link>
              )}
              <span className="nav-username">
                <UserIcon size={ICON_SIZE.sm} /> {user.username}
              </span>
              <button
                type="button"
                className="nav-logout"
                onClick={handleLogout}
              >
                <LogOut size={ICON_SIZE.sm} /> Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="nav-login-btn"
              onClick={closeMenu}
              onMouseEnter={preloadLogin}
              onFocus={preloadLogin}
              onTouchStart={preloadLogin}
            >
              Login
            </NavLink>
          ))}
      </div>
    </nav>
  );
};

export default Navbar;
