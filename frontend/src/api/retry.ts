import axios from 'axios'

/**
 * Retry only what can succeed on a second try: network failures and 5xx. A 4xx
 * (validation, permission, not found, conflict) will fail the same way again.
 */
export function isRetryable(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false
  const status = error.response?.status
  return status === undefined || status >= 500
}

export const retry = (failureCount: number, error: unknown) => failureCount < 2 && isRetryable(error)
