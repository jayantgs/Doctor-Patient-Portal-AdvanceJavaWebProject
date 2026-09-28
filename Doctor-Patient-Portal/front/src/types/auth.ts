import type { User } from './user';
import type { Doctor } from './doctor';

/**
 * Authentication roles supported by the portal.
 *
 * The backend enforces three mutually-exclusive roles via session-scoped
 * attributes: `userObj` (User), `doctorObj` (Doctor), `adminObj` (Admin).
 */
export type UserRole = 'admin' | 'doctor' | 'user';

/**
 * Login request body — identical shape for all three login endpoints.
 * @see back/src/main/java/com/hms/dto/LoginRequest.java
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Password-change request body — identical shape for user and doctor change-password.
 * @see back/src/main/java/com/hms/dto/ChangePasswordRequest.java
 */
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

/**
 * The authenticated principal stored in the auth context.
 * The `role` field discriminates which dashboard / layout to show.
 */
export interface AuthUser {
  role: UserRole;
  user: User | Doctor;
}

/**
 * The reactive auth state consumed by the AuthContext.
 */
export interface AuthState {
  /** The authenticated user, or `null` when not logged in. */
  user: AuthUser | null;
  /** Convenience: true when `user` is non-null. */
  isAuthenticated: boolean;
  /** True while a login/logout request is in flight. */
  isLoading: boolean;
  /** Error message from the last auth attempt, or null. */
  error: string | null;
}

/** Actions dispatched to the auth reducer. */
export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };
