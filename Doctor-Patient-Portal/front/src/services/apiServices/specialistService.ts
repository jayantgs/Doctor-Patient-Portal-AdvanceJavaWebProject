/**
 * Specialist service.
 *
 * Wraps the specialist-category endpoints used by the admin console and the
 * doctor edit-profile / add-doctor dropdowns.
 *
 * Backend: SpecialistController  →  /api/specialists
 */

import { apiClient } from '../apiClient';
import { withRetry } from '../../utils/retryHandler';
import { unwrapApiResponse } from '../../utils/errorHandler';
import { API_ENDPOINTS } from '../apiEndpoints';
import type { ApiResponse } from '../../types/apiResponse';
import type { Specialist } from '../../types/specialist';

/** GET /api/specialists — all specialist categories. */
export const getAllSpecialists = async (): Promise<Specialist[]> => {
  const response = await withRetry(() =>
    apiClient.get<ApiResponse<Specialist[]>>(API_ENDPOINTS.SPECIALISTS_ALL),
  );
  return unwrapApiResponse<Specialist[]>(response);
};

/** POST /api/specialists — add a new specialist category. */
export const addSpecialist = async (payload: { specialistName: string }): Promise<Specialist> => {
  const response = await withRetry(() =>
    apiClient.post<ApiResponse<Specialist>>(API_ENDPOINTS.SPECIALIST_ADD, payload),
  );
  return unwrapApiResponse<Specialist>(response);
};
