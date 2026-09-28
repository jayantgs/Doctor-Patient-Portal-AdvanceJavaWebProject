/**
 * Auth request interceptor.
 *
 * The backend uses session-based authentication (cookie).  When the user
 * logs in, the session cookie is set automatically by the browser because we
 * call `withCredentials` on the axios instance.
 *
 * This interceptor is a hook point for injecting an Authorization header if
 * the backend migrates to token-based auth (JWT) in the future.  For now it
 * is a transparent pass-through that logs the outgoing request in dev mode.
 */

import type { InternalAxiosRequestConfig } from 'axios';

export const authInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // If a bearer token were stored, it would be attached here:
  //   const token = localStorage.get<string>('authToken');
  //   if (token) config.headers.Authorization = `Bearer ${token}`;

  if (import.meta.env.MODE !== 'production') {
    // eslint-disable-next-line no-console
    console.debug(`[API] → ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
};
