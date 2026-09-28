/**
 * Appointment service.
 *
 * Wraps the appointment endpoints for users (booking, viewing), doctors
 * (viewing assigned, posting comments), and admins (global view).
 *
 * Backend: AppointmentController  →  /api/appointments/*
 */

import { apiClient } from '../apiClient';
import { withRetry } from '../../utils/retryHandler';
import { unwrapApiResponse } from '../../utils/errorHandler';
import { API_ENDPOINTS } from '../apiEndpoints';
import type { ApiResponse } from '../../types/apiResponse';
import type { Appointment, StatusUpdatePayload } from '../../types/appointment';

/** POST /api/appointments — create a new appointment (server sets status="Pending"). */
export const createAppointment = async (payload: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> => {
  const response = await withRetry(() =>
    apiClient.post<ApiResponse<Appointment>>(API_ENDPOINTS.APPOINTMENT_CREATE, payload),
  );
  return unwrapApiResponse<Appointment>(response);
};

/** GET /api/appointments/all — all appointments (admin). */
export const getAllAppointments = async (): Promise<Appointment[]> => {
  const response = await withRetry(() =>
    apiClient.get<ApiResponse<Appointment[]>>(API_ENDPOINTS.APPOINTMENTS_ALL),
  );
  return unwrapApiResponse<Appointment[]>(response);
};

/** GET /api/appointments/user/{userId} — appointments for a logged-in user. */
export const getAppointmentsByUser = async (userId: number): Promise<Appointment[]> => {
  const response = await withRetry(() =>
    apiClient.get<ApiResponse<Appointment[]>>(API_ENDPOINTS.APPOINTMENTS_BY_USER(userId)),
  );
  return unwrapApiResponse<Appointment[]>(response);
};

/** GET /api/appointments/doctor/{doctorId} — appointments for a logged-in doctor. */
export const getAppointmentsByDoctor = async (doctorId: number): Promise<Appointment[]> => {
  const response = await withRetry(() =>
    apiClient.get<ApiResponse<Appointment[]>>(API_ENDPOINTS.APPOINTMENTS_BY_DOCTOR(doctorId)),
  );
  return unwrapApiResponse<Appointment[]>(response);
};

/** GET /api/appointments/{id} — single appointment (doctor comment prefill). */
export const getAppointmentById = async (id: number): Promise<Appointment> => {
  const response = await withRetry(() =>
    apiClient.get<ApiResponse<Appointment>>(API_ENDPOINTS.APPOINTMENT_BY_ID(id)),
  );
  return unwrapApiResponse<Appointment>(response);
};

/** PUT /api/appointments/{id}/status — doctor posts comment/prescription (overwrites status). */
export const updateAppointmentStatus = async (id: number, payload: StatusUpdatePayload): Promise<void> => {
  await withRetry(() =>
    apiClient.put<ApiResponse>(API_ENDPOINTS.APPOINTMENT_UPDATE_STATUS(id), payload),
  );
};
