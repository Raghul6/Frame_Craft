import axios, { isAxiosError } from "axios";
import {
  NETWORK_ERROR_MESSAGE,
  UNEXPECTED_ERROR_MESSAGE,
} from "../constants/api";
import type { ApiErrorBody, FieldErrors, RequestError } from "../types/api";
import { reportError } from "./errors";

/** True when the request was cancelled (e.g. a newer search replaced it). */
export const isAbortError = (err: unknown): boolean => axios.isCancel(err);

/**
 * The backend's `message` for a failed API call, a network message when the
 * server couldn't be reached, or `fallback` for anything else.
 */
export const extractError = (
  err: unknown,
  fallback = UNEXPECTED_ERROR_MESSAGE,
): string => {
  if (isAxiosError<ApiErrorBody>(err)) {
    if (err.response?.data?.message) return err.response.data.message;
    if (!err.response) return NETWORK_ERROR_MESSAGE;
    return fallback;
  }
  reportError("api.unexpected", err);
  return fallback;
};

/** Per-field validation errors from a 400/409 response, if any. */
const extractFieldErrors = (err: unknown): FieldErrors =>
  (isAxiosError<ApiErrorBody>(err) && err.response?.data?.errors) || {};

/** `extractError` + `extractFieldErrors` in the shape every `...Fail` action takes. */
export const toRequestError = (
  err: unknown,
  fallback?: string,
): RequestError => ({
  message: extractError(err, fallback),
  fieldErrors: extractFieldErrors(err),
});
