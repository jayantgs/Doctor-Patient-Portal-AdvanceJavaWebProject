/**
 * Application-wide constants.
 *
 * Values mirror the backend configuration:
 *   - server.port=8080           (back/src/main/resources/application.properties)
 *   - session-based auth keys    (userObj / doctorObj / adminObj)
 */

/* ---------- API ---------- */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
export const API_TIMEOUT = 10000; // 10 seconds

/* ---------- Roles & Storage ---------- */
export type { UserRole } from '../types/auth';

export const USER_ROLE = {
  ADMIN: 'admin' as const,
  DOCTOR: 'doctor' as const,
  USER: 'user' as const,
} as const;

export const STORAGE_KEYS = {
  USER: 'hms_user',
  ROLE: 'hms_role',
  THEME_MODE: 'hms_theme_mode',
} as const;

/* ---------- HTTP ---------- */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/* ---------- Retry ---------- */
export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  BASE_DELAY_MS: 500,
  RETRYABLE_STATUSES: [408, 429, 500, 502, 503, 504] as number[],
} as const;
