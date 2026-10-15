import { API_PREFIX, DEFAULT_API_HOST } from "../constants/api";

// Backend host comes from client/.env (VITE_API_HOST). Restart `npm run dev` after changing it.
const apiHost = (import.meta.env.VITE_API_HOST ?? DEFAULT_API_HOST).replace(
  /\/+$/,
  "",
);

export const env = {
  apiUrl: `${apiHost}${API_PREFIX}`,
};
