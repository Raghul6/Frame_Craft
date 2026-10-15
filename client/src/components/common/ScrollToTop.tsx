import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Starts every new page at the top (React Router keeps the old scroll position).
 * Links to a #section are left alone so the browser can jump to the anchor.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
