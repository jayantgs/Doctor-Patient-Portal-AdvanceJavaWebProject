/**
 * Authentication service.
 *
 * Wraps the three login endpoints (user, doctor, admin) and logout.
 * The backend uses session-based auth (HTTP-only cookie), so `withCredentials`
 * is enabled on the axios instance — the session cookie is managed by the
 * browser automatically.  The frontend only needs to persist the *role* and
 * a lightweight user object so the UI can render role-aware navigation.
 *
 * @see services/apiClient.ts  (axios instance with withCredentials)
 */

import { apiClient } from '../apiClient';
import { API_ENDPOINTS, API_PATHS } from '../apiEndpoints';
import { withRetry } from '../../utils/retryHandler';
import { unwrapApiResponse } from '../../utils/errorHandler';
import type { LoginRequest, ChangePasswordRequest, AuthUser, UserRole } from '../../types';
import type { User } from '../../types/user';
import type { Doctor } from '../../types/doctor';
import type { ApiResponse } from '../../types/apiResponse';

/** Result of a login attempt. */
export interface LoginResult {
  success: boolean;
  user: AuthUser;
  message: string;
}

/**
 * Authenticate a user (patient).
 * POST /api/users/login → sets session "userObj".
 */
export const loginUser = async (request: LoginRequest): Promise<LoginResult> => {
  const response = await withRetry(() => apiClient.post<ApiResponse<User>>(API_ENDPOINTS.USER_LOGIN, request));
  const user = unwrapApiResponse<User>(response);
  return {
    success: true,
    user: { role: 'user', user },
    message: response.data.message,
  };
};

/**
 * Authenticate a doctor.
 * POST /api/doctors/login → sets session "doctorObj".
 */
export const loginDoctor = async (request: LoginRequest): Promise<LoginResult> => {
  const response = await withRetry(() => apiClient.post<ApiResponse<Doctor>>(API_ENDPOINTS.DOCTOR_LOGIN, request));
  const doctor = unwrapApiResponse<Doctor>(response);
  return {
    success: true,
    user: { role: 'doctor', user: doctor },
    message: response.data.message,
  };
};

/**
 * Authenticate an admin (hardcoded admin@gmail.com / admin).
 * POST /api/admin/login → sets session "adminObj".
 */
export const loginAdmin = async (request: LoginRequest): Promise<LoginResult> => {
  const response = await withRetry(() => apiClient.post<ApiResponse>(API_ENDPOINTS.ADMIN_LOGIN, request));
  // Admin login returns no `data` payload — only a success boolean + message.
  return {
    success: true,
    user: { role: 'admin', user: { id: 0, fullName: 'Admin', email: request.email, password: '' } as User },
    message: response.data.message,
  };
};

/**
 * Log out the current session (clears the session cookie on the server side).
 * The role-specific logout endpoint is chosen here; the auth context handles
 * client-side state cleanup.
 */
export const logout = async (role: UserRole): Promise<string> => {
  const endpoint =
    role === 'admin'
      ? API_ENDPOINTS.ADMIN_LOGOUT
      : role === 'doctor'
        ? API_ENDPOINTS.DOCTOR_LOGOUT
        : API_ENDPOINTS.USER_LOGOUT;
  await withRetry(() => apiClient.post<ApiResponse>(endpoint, {}));
  return 'Logout successful';
};

/** Convenience: resolve which login path to navigate to for a role. */
export const getLoginPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return API_PATHS.ADMIN_LOGIN_PAGE;
    case 'doctor':
      return API_PATHS.DOCTOR_LOGIN_PAGE;
    case 'user':
    default:
      return API_PATHS.USER_LOGIN_PAGE;
  }
};

/**
 * Change password for a user or doctor.
 * PUT /api/users/{id}/change-password  or  /api/doctors/{id}/change-password
 */
export const changePassword = async (
  role: 'user' | 'doctor',
  id: number,
  request: ChangePasswordRequest,
): Promise<string> => {
  const endpoint =
    role === 'doctor'
      ? API_ENDPOINTS.DOCTOR_CHANGE_PASSWORD(id)
      : API_ENDPOINTS.USER_CHANGE_PASSWORD(id);
  const response = await withRetry(() =>
    apiClient.put<ApiResponse>(endpoint, request),
  );
  return response.data.message;
};
