/** Used when VITE_API_HOST is not set in client/.env. */
export const DEFAULT_API_HOST = "http://localhost:5000";
export const API_PREFIX = "/api";
export const API_TIMEOUT_MS = 15_000;

export const API_ENDPOINTS = {
  login: "/auth/login",
  register: "/auth/register",
  me: "/auth/me",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
  adminDashboard: "/admin/dashboard",
  adminUsers: "/admin/users",
  adminUser: (id: number) => `/admin/users/${id}`,
  adminOrders: "/admin/orders",
  adminOrder: (id: number) => `/admin/orders/${id}`,
  adminOrderStatus: (id: number) => `/admin/orders/${id}/status`,
  adminFrames: "/admin/frames",
  adminFrame: (id: number) => `/admin/frames/${id}`,
} as const;

/** Endpoints where a 401 means "wrong credentials", not "session expired". */
export const PUBLIC_AUTH_ENDPOINTS: readonly string[] = [
  API_ENDPOINTS.login,
  API_ENDPOINTS.register,
  API_ENDPOINTS.refresh,
  API_ENDPOINTS.logout,
];

export const UNEXPECTED_ERROR_MESSAGE =
  "Something went wrong. Please try again.";
export const NETWORK_ERROR_MESSAGE =
  "Cannot reach the server. Please check your connection.";

/** Refresh the access token this long before it expires, instead of waiting for a 401. */
export const TOKEN_REFRESH_BUFFER_MS = 30_000;
