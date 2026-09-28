import { useState, useCallback } from 'react';
import { ApiClientError } from '../utils/errorHandler';

/**
 * React hook for data fetching with loading / error / data states.
 *
 * Wraps an async function and manages its lifecycle.  When the returned
 * `execute` function is called:
 *   1. `loading` is set to `true`.
 *   2. The async function runs.
 *   3. On success `data` is set; on failure `error` (an `ApiClientError`) is set.
 *
 * Usage:
 *   const { data, error, loading, execute } = useApi(doctorService.getAllDoctors);
 *   useEffect(() => { execute(); }, []);
 */

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiClientError | null;
}

export interface ApiController<T> extends ApiState<T> {
  execute: (...args: unknown[]) => Promise<T | undefined>;
  reset: () => void;
}

export const useApi = <T = unknown>(
  asyncFn: (...args: unknown[]) => Promise<T>,
  autoExecute = false,
): ApiController<T> => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: autoExecute,
    error: null,
  });

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | undefined> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await asyncFn(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const apiError =
          error instanceof ApiClientError
            ? error
            : new ApiClientError(
                error instanceof Error ? error.message : 'An error occurred',
                0,
              );
        setState({ data: null, loading: false, error: apiError });
        throw apiError;
      }
    },
    [asyncFn],
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
};
