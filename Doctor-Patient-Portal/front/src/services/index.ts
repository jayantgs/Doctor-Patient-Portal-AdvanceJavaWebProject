/**
 * Service-layer barrel.
 *
 * Re-exports all API service modules so callers can do:
 *   import { authService, userService } from '@/services';
 *   await authService.loginUser(...);
 */

import * as auth from './apiServices/authService';
import * as users from './apiServices/userService';
import * as doctors from './apiServices/doctorService';
import * as appointments from './apiServices/appointmentService';
import * as specialists from './apiServices/specialistService';
import { apiClient } from './apiClient';
import { API_ENDPOINTS, API_PATHS } from './apiEndpoints';

export { apiClient, API_ENDPOINTS, API_PATHS };
export type { LoginResult } from './apiServices/authService';

export const authService = auth;
export const userService = users;
export const doctorService = doctors;
export const appointmentService = appointments;
export const specialistService = specialists;

export default {
  auth: auth,
  users: users,
  doctors: doctors,
  appointments: appointments,
  specialists: specialists,
};
