import { ApiClientError, isRetryableError, logError } from './errorHandler';

/**
 * Retry wrapper for async operations.
 *
 * Retries on transient failures (network errors, 5xx, 429, timeouts) with
 * exponential backoff.  Non-retryable errors propagate immediately.
 *
 * @param fn         The async function to retry.
 * @param maxAttempts Maximum number of attempts (default 3).
 * @param baseDelayMs Base delay before first retry in ms (default 500).
 */
export const retryAsync = async <T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 500,
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const shouldRetry = isRetryableError(error) && attempt < maxAttempts;

      if (!shouldRetry) {
        logError(error, `retryAsync (attempt ${attempt}/${maxAttempts})`);
        throw error;
      }

      const delay = baseDelayMs * Math.pow(2, attempt - 1); // exponential backoff
      logError(error, `retryAsync (attempt ${attempt}/${maxAttempts}, retrying in ${delay}ms)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Convenience: retry an axios-based API call and unwrap the ApiResponse.
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
): Promise<T> => {
  return retryAsync(fn, maxAttempts);
};

/** Re-export for external consumers that only need the retryable check. */
export { ApiClientError, isRetryableError };
