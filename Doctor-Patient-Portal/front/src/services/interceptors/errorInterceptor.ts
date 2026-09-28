/**
 * Error response interceptor.
 *
 * Centralised response-error handling:
 *   - 401 → clear stored auth state and redirect to the appropriate login page.
 *   - All errors are normalised via `extractErrorMessage` and re-thrown as
 *     `ApiClientError` so service-layer callers receive a consistent type.
 */

import type { AxiosError } from 'axios';
import { extractErrorMessage, ApiClientError, clearAuthState, logError } from '../../utils/errorHandler';
import { USER_ROLE, STORAGE_KEYS } from '../../utils/constants';
import type { UserRole } from '../../types/auth';
import { localStorage as storage } from '../../utils/storage';
import { API_PATHS } from '../apiEndpoints';

/** Window-like object used for redirects so this can be unit tested. */
interface RedirectTarget {
  location: { href: string };
}

/**
 * Response (error) interceptor factory.
 *
 * Uses `window.location.href` for the 401 redirect because the axios error
 * interceptor sits outside the React component tree and cannot call the
 * router's `navigate()` directly.  A full-page redirect on auth expiry is the
 * simplest, most reliable approach.
 *
 * @param redirect  Defaults to `window`.
 * @returns An Axios error interceptor function.
 */
export const createErrorInterceptor =
  (redirect: RedirectTarget = window) =>
  (error: AxiosError): Promise<never> => {
    const message = extractErrorMessage(error);
    const status = error.response?.status ?? 0;

    logError(error, 'apiClient');

    if (status === 401) {
      clearAuthState();
      const role = storage.get<UserRole>(STORAGE_KEYS.ROLE) ?? USER_ROLE.USER;
      const loginPath =
        role === USER_ROLE.ADMIN
          ? API_PATHS.ADMIN_LOGIN_PAGE
          : role === USER_ROLE.DOCTOR
            ? API_PATHS.DOCTOR_LOGIN_PAGE
            : API_PATHS.USER_LOGIN_PAGE;
      redirect.location.href = loginPath;
    }

    throw new ApiClientError(message, status);
  };
