/**
 * Doctor service.
 *
 * Wraps the doctor-portal and admin doctor-management endpoints.
 *
 * Backend: DoctorController   →  /api/doctors/*
 *          AdminController    →  /api/admin/doctors/*
 */

import { apiClient } from '../apiClient';
import { withRetry } from '../../utils/retryHandler';
import { unwrapApiResponse } from '../../utils/errorHandler';
import { API_ENDPOINTS } from '../apiEndpoints';
import type { ApiResponse, DashboardCounts } from '../../types';
import type { Doctor, DoctorPayload } from '../../types/doctor';

/** GET /api/doctors — all doctors (used by appointment-booking dropdown + admin lists). */
export const getAllDoctors = async (): Promise<Doctor[]> => {
  const response = await withRetry(() => apiClient.get<ApiResponse<Doctor[]>>(API_ENDPOINTS.DOCTORS_ALL));
  return unwrapApiResponse<Doctor[]>(response);
};

/** GET /api/doctors/{id} — single doctor (admin edit prefill, doctor profile refresh). */
export const getDoctorById = async (id: number): Promise<Doctor> => {
  const response = await withRetry(() => apiClient.get<ApiResponse<Doctor>>(API_ENDPOINTS.DOCTOR_BY_ID(id)));
  return unwrapApiResponse<Doctor>(response);
};

/** GET /api/doctors/{id}/appointments — appointments assigned to a doctor. */
export const getDoctorAppointments = async (doctorId: number): Promise<unknown[]> => {
  const response = await withRetry(() =>
    apiClient.get<ApiResponse<unknown[]>>(API_ENDPOINTS.DOCTOR_APPOINTMENTS(doctorId)),
  );
  return unwrapApiResponse<unknown[]>(response);
};

/** GET /api/doctors/{id}/dashboard — doctor dashboard counts. */
export const getDoctorDashboard = async (doctorId: number): Promise<DashboardCounts> => {
  const response = await withRetry(() =>
    apiClient.get<ApiResponse<DashboardCounts>>(API_ENDPOINTS.DOCTOR_DASHBOARD(doctorId)),
  );
  return unwrapApiResponse<DashboardCounts>(response);
};

/** PUT /api/doctors/{id}/profile — update doctor profile (password not changed). */
export const updateDoctorProfile = async (id: number, payload: DoctorPayload): Promise<Doctor> => {
  const response = await withRetry(() =>
    apiClient.put<ApiResponse<Doctor>>(API_ENDPOINTS.DOCTOR_EDIT_PROFILE(id), payload),
  );
  return unwrapApiResponse<Doctor>(response);
};

/* ---------- Admin doctor management ---- */

/** POST /api/admin/doctors — register a new doctor. */
export const addDoctor = async (payload: DoctorPayload): Promise<Doctor> => {
  const response = await withRetry(() =>
    apiClient.post<ApiResponse<Doctor>>(API_ENDPOINTS.ADMIN_ADD_DOCTOR, payload),
  );
  return unwrapApiResponse<Doctor>(response);
};

/** PUT /api/admin/doctors/{id} — update doctor (including password). */
export const updateDoctor = async (id: number, payload: DoctorPayload): Promise<void> => {
  await withRetry(() => apiClient.put<ApiResponse>(API_ENDPOINTS.ADMIN_UPDATE_DOCTOR(id), payload));
};

/** DELETE /api/admin/doctors/{id} — delete a doctor. */
export const deleteDoctor = async (id: number): Promise<void> => {
  await withRetry(() => apiClient.delete<ApiResponse>(API_ENDPOINTS.ADMIN_DELETE_DOCTOR(id)));
};
