import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import { ApiClientError, unwrapApiResponse } from '../utils/errorHandler';
import { authInterceptor } from './interceptors/authInterceptor';
import { createErrorInterceptor } from './interceptors/errorInterceptor';
import { API_BASE_URL, API_TIMEOUT } from '../utils/constants';
import type { ApiResponse } from '../types/apiResponse';

/**
 * Factory that creates a configured Axios instance.
 *
 * Configuration:
 *   - `baseURL`  → VITE_API_BASE_URL (defaults to `/api`, proxied to backend).
 *   - `withCredentials` → `true` so the session cookie is sent on every request,
 *     matching the backend's session-based authentication.
 *   - `timeout`  → 10 s.
 *   - Request interceptor → auth token injection (hook point for JWT migration).
 *   - Response interceptor → 401 redirect + error normalisation.
 *
 * The factory pattern lets callers override the base URL / timeout (e.g. for
 * tests) without mutating the shared default instance.
 */
function createApiClient(config?: Partial<AxiosRequestConfig>): AxiosInstance {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
    // Required for session-cookie based auth.
    withCredentials: true,
    ...config,
  });

  // Request: inject auth headers (currently a transparent hook point).
  instance.interceptors.request.use(authInterceptor);

  // Response: normalise business-level errors and handle 401s.
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => response,
    createErrorInterceptor(),
  );

  return instance;
}

/** Shared default instance used throughout the app. */
export const apiClient = createApiClient();

/**
 * Execute a request that returns an `ApiResponse` wrapper, automatically
 * unwrapping the `data` payload.  Throws `ApiClientError` on business-level
 * failure (when `status` is `false`).
 *
 * @example
 * const doctors = await apiRequest<Doctor[]>('get', '/api/doctors');
 */
export const apiRequest = async <T = unknown>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await apiClient.request<ApiResponse<T>>({
      method,
      url,
      data: body,
      ...config,
    });
    return unwrapApiResponse<T>(response);
  } catch (error) {
    // Re-throw ApiClientError as-is; wrap anything else.
    if (error instanceof ApiClientError) {
      throw error;
    }
    // AxiosError that slipped through (shouldn't happen — interceptor handles it).
    if (error instanceof AxiosError) {
      throw new ApiClientError(
        error.response?.data?.message ?? error.message,
        error.response?.status ?? 0,
      );
    }
    throw error;
  }
};

export default apiClient;
