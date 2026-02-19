import type { ApiResponse, DataValue } from "./client/lxns-api-client-types.js";

export class LxnsApiError extends Error {
  public readonly code: number;
  public readonly status?: number;
  public readonly success: boolean;
  public readonly data?: DataValue;

  constructor(payload: ApiResponse, status?: number) {
    super(payload.message ?? `Lxns API unknown error (code: ${payload.code})`);
    this.name = "LxnsApiError";
    this.code = payload.code;
    this.status = status;
    this.success = payload.success;
    this.data = payload.data;
  }
}

export function isLxnsApiError(error: unknown): error is LxnsApiError {
  return error instanceof LxnsApiError;
}

export function isNotFoundError(error: unknown): error is LxnsApiError {
  return isLxnsApiError(error) && (error.status ?? error.code) === 404;
}

export function isAuthError(error: unknown): error is LxnsApiError {
  const code = isLxnsApiError(error) ? (error.status ?? error.code) : undefined;
  return code === 401 || code === 403;
}

export function isRateLimitError(error: unknown): error is LxnsApiError {
  return isLxnsApiError(error) && (error.status ?? error.code) === 429;
}

export function isServerError(error: unknown): error is LxnsApiError {
  const code = isLxnsApiError(error) ? (error.status ?? error.code) : undefined;
  return typeof code === "number" && code >= 500;
}
