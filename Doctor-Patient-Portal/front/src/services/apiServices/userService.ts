/**
 * User (patient) service.
 *
 * Wraps the user self-service endpoints.  These are called by the patient-side
 * components (registration form, appointment booking, password change).
 *
 * Backend: UserController  →  /api/users/*
 */

import { apiClient } from '../apiClient';
import { withRetry } from '../../utils/retryHandler';
import { unwrapApiResponse } from '../../utils/errorHandler';
import { API_ENDPOINTS } from '../apiEndpoints';
import type { ApiResponse } from '../../types/apiResponse';
import type { User, UserRegisterPayload } from '../../types/user';

/**
 * Register a new patient.
 * POST /api/users/register
 */
export const registerUser = async (payload: UserRegisterPayload): Promise<User> => {
  const response = await withRetry(() =>
    apiClient.post<ApiResponse<User>>(API_ENDPOINTS.USER_REGISTER, payload),
  );
  return unwrapApiResponse<User>(response);
};
