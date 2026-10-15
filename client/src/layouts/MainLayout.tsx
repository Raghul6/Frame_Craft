import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { useHasNavigated } from "../hooks/useHasNavigated";
import Spinner from "../components/common/Spinner";
import Navbar from "../components/layout/Navbar";

const MainLayout = () => {
  const { pathname } = useLocation();
  const hasNavigated = useHasNavigated();

  return (
    <div className="app">
      <Navbar />
      {/* A crashing page keeps the navbar usable; navigating away clears the error. */}
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
    </div>
  );
};

export default MainLayout;
