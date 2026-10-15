import type { Dispatch } from "@reduxjs/toolkit";
import api, { refreshSession } from "../../api/api";
import { clearAccessToken, setAccessToken } from "../../api/tokenManager";
import { API_ENDPOINTS } from "../../constants/api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "../../types/auth";
import { toRequestError } from "../../utils/apiError";
import { abortAllRequests } from "../shared/latestRequest";
import {
  authRequestFail,
  authRequestStart,
  authRequestSuccess,
  bootstrapFinished,
  logoutSuccess,
} from "./slice";

// Shared lifecycle for the endpoints that answer with a fresh session (login / register).
const sessionRequest = async (
  dispatch: Dispatch,
  url: string,
  payload: LoginPayload | RegisterPayload,
): Promise<User | undefined> => {
  try {
    dispatch(authRequestStart());
    const response = await api.post<AuthResponse>(url, payload);
    setAccessToken(response.data.token);
    dispatch(authRequestSuccess(response.data.user));
    return response.data.user;
  } catch (error) {
    dispatch(authRequestFail(toRequestError(error)));
  }
};

export const login = (payload: LoginPayload) => (dispatch: Dispatch) =>
  sessionRequest(dispatch, API_ENDPOINTS.login, payload);

export const register = (payload: RegisterPayload) => (dispatch: Dispatch) =>
  sessionRequest(dispatch, API_ENDPOINTS.register, payload);

// Restores the session on page load from the httpOnly refresh cookie — one request that
// returns both a fresh access token and the user. No cookie (first visit, logged out) → 401.
export const bootstrapAuth = () => async (dispatch: Dispatch) => {
  try {
    const { user } = await refreshSession();
    dispatch(bootstrapFinished(user));
    return user;
  } catch {
    clearAccessToken();
    dispatch(bootstrapFinished(null));
  }
};

// Revokes the session on the server (so the refresh cookie can't be reused), then
// clears local state even if that request fails.
let loggingOut = false;

export const logout = () => async (dispatch: Dispatch) => {
  if (loggingOut) return;
  loggingOut = true;
  abortAllRequests();
  try {
    await api.post(API_ENDPOINTS.logout);
  } catch {
    // Offline or already logged out — the local logout below still happens.
  } finally {
    clearAccessToken();
    dispatch(logoutSuccess());
    loggingOut = false;
  }
};
