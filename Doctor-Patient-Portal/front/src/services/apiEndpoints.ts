/**
 * Centralised API endpoint definitions.
 *
 * Mirrors the REST routes defined in the backend controllers:
 *   UserController       → /api/users/*
 *   DoctorController     → /api/doctors/*
 *   AppointmentController → /api/appointments/*
 *   AdminController      → /api/admin/*
 *   SpecialistController → /api/specialists/*
 *
 * @see back/src/main/java/com/hms/controller/
 */

export const API_ENDPOINTS = {
  /* ---- User (patient) auth & self-service ---- */
  USER_REGISTER: '/api/users/register',
  USER_LOGIN: '/api/users/login',
  USER_LOGOUT: '/api/users/logout',
  USER_CHANGE_PASSWORD: (userId: number) => `/api/users/${userId}/change-password`,

  /* ---- Doctor ---- */
  DOCTOR_LOGIN: '/api/doctors/login',
  DOCTOR_LOGOUT: '/api/doctors/logout',
  DOCTORS_ALL: '/api/doctors',
  DOCTOR_BY_ID: (id: number) => `/api/doctors/${id}`,
  DOCTOR_APPOINTMENTS: (id: number) => `/api/doctors/${id}/appointments`,
  DOCTOR_EDIT_PROFILE: (id: number) => `/api/doctors/${id}/profile`,
  DOCTOR_CHANGE_PASSWORD: (id: number) => `/api/doctors/${id}/change-password`,
  DOCTOR_DASHBOARD: (id: number) => `/api/doctors/${id}/dashboard`,

  /* ---- Appointment ---- */
  APPOINTMENT_CREATE: '/api/appointments',
  APPOINTMENTS_ALL: '/api/appointments/all',
  APPOINTMENTS_BY_USER: (userId: number) => `/api/appointments/user/${userId}`,
  APPOINTMENTS_BY_DOCTOR: (doctorId: number) => `/api/appointments/doctor/${doctorId}`,
  APPOINTMENT_BY_ID: (id: number) => `/api/appointments/${id}`,
  APPOINTMENT_UPDATE_STATUS: (id: number) => `/api/appointments/${id}/status`,

  /* ---- Admin ---- */
  ADMIN_LOGIN: '/api/admin/login',
  ADMIN_LOGOUT: '/api/admin/logout',
  ADMIN_DASHBOARD: '/api/admin/dashboard',
  ADMIN_ADD_DOCTOR: '/api/admin/doctors',
  ADMIN_UPDATE_DOCTOR: (id: number) => `/api/admin/doctors/${id}`,
  ADMIN_DELETE_DOCTOR: (id: number) => `/api/admin/doctors/${id}`,

  /* ---- Specialist ---- */
  SPECIALISTS_ALL: '/api/specialists',
  SPECIALIST_ADD: '/api/specialists',
} as const;

export const API_PATHS = {
  USER_LOGIN_PAGE: '/user/login',
  DOCTOR_LOGIN_PAGE: '/doctor/login',
  ADMIN_LOGIN_PAGE: '/admin/login',
} as const;
