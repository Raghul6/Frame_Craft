import { useEffect, useState } from "react";
import { SEARCH_DEBOUNCE_MS } from "../constants/ui";

export const useDebounce = <T>(value: T, delay = SEARCH_DEBOUNCE_MS): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
