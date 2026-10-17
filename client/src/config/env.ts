import { API_PREFIX, DEFAULT_API_HOST } from "../constants/api";

// Backend host comes from client/.env (VITE_API_HOST). Restart `npm run dev` after changing it.
// A production build without it calls its own site ("/api"), which vercel.json forwards
// to the API — so the refresh cookie stays first-party.
const apiHost = (
  import.meta.env.VITE_API_HOST ??
  (import.meta.env.PROD ? "" : DEFAULT_API_HOST)
).replace(/\/+$/, "");

export const env = {
  apiUrl: `${apiHost}${API_PREFIX}`,
};
