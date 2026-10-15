import axios, { type InternalAxiosRequestConfig } from "axios";
import {
  API_ENDPOINTS,
  API_TIMEOUT_MS,
  PUBLIC_AUTH_ENDPOINTS,
} from "../constants/api";
import { env } from "../config/env";
import type { AuthResponse } from "../types/auth";
import {
  clearAccessToken,
  getAccessToken,
  isAccessTokenExpiringSoon,
  notifyUnauthorized,
  setAccessToken,
} from "./tokenManager";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retried?: boolean;
  }
}

const api = axios.create({
  baseURL: env.apiUrl,
  timeout: API_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
  // Sends the httpOnly refresh cookie to /auth/refresh and /auth/logout.
  withCredentials: true,
});

let refreshPromise: Promise<AuthResponse> | null = null;

/**
 * Swaps the refresh cookie for a new access token. Concurrent callers share one request:
 * refresh tokens rotate on use, so two parallel refreshes would invalidate each other.
 */
export const refreshSession = (): Promise<AuthResponse> => {
  refreshPromise ??= axios
    .post<AuthResponse>(`${env.apiUrl}${API_ENDPOINTS.refresh}`, null, {
      withCredentials: true,
      timeout: API_TIMEOUT_MS,
    })
    .then((res) => {
      setAccessToken(res.data.token);
      return res.data;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
};

const isPublicAuthCall = (url = "") => PUBLIC_AUTH_ENDPOINTS.includes(url);

// Refresh proactively just before the token expires, so requests don't bounce off a 401.
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (!isPublicAuthCall(config.url) && isAccessTokenExpiringSoon()) {
    try {
      await refreshSession();
    } catch {
      // Let the request go; a real 401 is handled below.
    }
  }
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// A 401 on a protected call: refresh once and retry; if that fails, the session is over.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config: InternalAxiosRequestConfig | undefined = error?.config;
    if (
      error?.response?.status !== 401 ||
      !config ||
      config._retried ||
      isPublicAuthCall(config.url)
    ) {
      return Promise.reject(error);
    }
    config._retried = true;
    try {
      const { token } = await refreshSession();
      config.headers.Authorization = `Bearer ${token}`;
      return api(config);
    } catch (refreshError) {
      clearAccessToken();
      notifyUnauthorized();
      return Promise.reject(refreshError);
    }
  },
);

export default api;
