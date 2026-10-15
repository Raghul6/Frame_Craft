import { useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * True once the user has moved to another page in this layout. Used to skip the
 * page-enter animation on the very first load, so it never delays the first paint.
 */
export const useHasNavigated = (): boolean => {
  const { pathname } = useLocation();
  const [initialPath] = useState(pathname);
  const [hasNavigated, setHasNavigated] = useState(false);
  if (!hasNavigated && pathname !== initialPath) setHasNavigated(true);
  return hasNavigated;
};
