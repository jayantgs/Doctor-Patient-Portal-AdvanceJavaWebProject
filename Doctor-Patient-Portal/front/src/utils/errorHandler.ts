import axios, { AxiosError, AxiosResponse } from 'axios';
import type { ApiResponse } from '../types/apiResponse';
import { STORAGE_KEYS } from './constants';
import { localStorage as storage } from './storage';

/**
 * Centralized error-handling utilities.
 *
 * The backend returns errors in two forms:
 *   1. HTTP error status (400 / 401 / 500 …) — always wrapped in `ApiResponse`.
 *   2. Network-level failure (no response / timeout) — caught here.
 *
 * `extractErrorMessage` normalises both into a single user-friendly string.
 */

/* ---------- Error extraction ---------- */

/**
 * Extract a human-readable error message from an Axios error or any thrown
 * error.  Prefers the backend `ApiResponse.message`, falls back to a generic
 * string based on the HTTP status or network state.
 */
export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // The backend always returns a JSON body of type ApiResponse even on error.
    const resp = error.response as AxiosResponse<ApiResponse> | undefined;
    if (resp?.data?.message) {
      return resp.data.message;
    }

    // Network / CORS errors (no response received).
    if (!resp && error.code === 'ERR_NETWORK') {
      return 'Unable to reach the server. Please check your network connection and ensure the backend is running.';
    }
    if (!resp && error.code === 'ECONNABORTED') {
      return 'The request timed out. Please try again.';
    }

    switch (error.response?.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'A conflict occurred. The item may already exist.';
      case 500:
        return 'A server error occurred. Please try again later.';
      default:
        return error.response?.data?.message
          ?? 'An unexpected error occurred. Please try again.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
};

/**
 * Log an error to the console (and potentially a remote logging service).
 * Centralised so the logging strategy can change in one place.
 */
export const logError = (error: unknown, context?: string): void => {
  const prefix = context ? `[${context}]` : '';
  if (import.meta.env.MODE !== 'production') {
    // eslint-disable-next-line no-console
    console.error(prefix, error);
  }
  // In production, errors could be forwarded to an APM / logging service here.
};

/**
 * Extract the `data` field from a successful `ApiResponse`.
 * Throws if `status` is false (business-level failure).
 */
export const unwrapApiResponse = <T = unknown>(response: AxiosResponse<ApiResponse<T>>): T => {
  const { data } = response;
  if (!data.status) {
    throw new ApiClientError(data.message, response.status);
  }
  return data.data;
};

/**
 * A typed error that carries the HTTP status code, enabling callers to branch
 * on status (e.g. redirect to login on 401).
 */
export class ApiClientError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
  }
}

/**
 * Check whether an error is "retryable" — i.e. caused by a transient
 * network or server condition (timeout, 5xx, 429).
 */
export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    if (!error.response) return true; // network error
    const status = error.response.status;
    return [408, 429, 500, 502, 503, 504].includes(status);
  }
  return false;
};

/**
 * Clear all stored auth state — called when a 401 is detected so the UI
 * reflects the logged-out state and redirects to login.
 */
export const clearAuthState = (): void => {
  storage.remove(STORAGE_KEYS.USER);
  storage.remove(STORAGE_KEYS.ROLE);
  storage.clear();
};
