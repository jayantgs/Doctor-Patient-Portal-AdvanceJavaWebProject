/**
 * Authentication context — holds the logged-in user, loading state, and
 * exposes `login` / `logout` actions.
 *
 * The backend uses session-based auth (HTTP-only cookie), so this context
 * stores only the lightweight identity needed for UI rendering (role +
 * basic profile).  The actual session cookie is managed transparently by
 * the browser via the axios `withCredentials` flag.
 *
 * Design: a single context provides both state and actions.  The reducer
 * keeps the state transitions explicit and testable.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type {
  AuthState,
  AuthAction,
  AuthUser,
  UserRole,
  LoginRequest,
} from '../types';
import { authService } from '../services';
import type { LoginResult } from '../services';
import { STORAGE_KEYS } from '../utils/constants';
import { localStorage as storage } from '../utils/storage';

/* ---------- Reducer ---------- */

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false, error: action.payload, isAuthenticated: false };
    case 'LOGOUT':
      return { ...initialState };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

/* ---------- Context type ---------- */

interface AuthContextValue extends AuthState {
  login: (role: UserRole, request: LoginRequest) => Promise<LoginResult>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ---------- Provider ---------- */

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount, hydrate from persisted storage (page refresh).
  useEffect(() => {
    const storedUser = storage.get<AuthUser>(STORAGE_KEYS.USER);
    const storedRole = storage.get<UserRole>(STORAGE_KEYS.ROLE);
    if (storedUser && storedRole) {
      const hydrated: AuthUser = { ...storedUser, role: storedRole };
      dispatch({ type: 'LOGIN_SUCCESS', payload: hydrated });
    }
  }, []);

  const login = async (role: UserRole, request: LoginRequest): Promise<LoginResult> => {
    dispatch({ type: 'LOGIN_START' });
    try {
      let result: LoginResult;
      switch (role) {
        case 'admin':
          result = await authService.loginAdmin(request);
          break;
        case 'doctor':
          result = await authService.loginDoctor(request);
          break;
        case 'user':
        default:
          result = await authService.loginUser(request);
          break;
      }
      storage.set(STORAGE_KEYS.USER, result.user);
      storage.set(STORAGE_KEYS.ROLE, role);
      dispatch({ type: 'LOGIN_SUCCESS', payload: result.user });
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const role = state.user?.role ?? 'user';
      await authService.logout(role);
    } catch {
      /* swallow — we clear local state regardless of server response */
    } finally {
      storage.remove(STORAGE_KEYS.USER);
      storage.remove(STORAGE_KEYS.ROLE);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      clearError,
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ---------- Hooks ---------- */

/** Consume the full auth context (state + actions). */
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

/** Convenience: access only the authenticated user. */
export const useAuthUser = (): AuthUser | null => useAuth().user;
