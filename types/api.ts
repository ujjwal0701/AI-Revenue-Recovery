/**
 * Standard successful API response wrapper
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data?: T;
  message?: string;
  count?: number;
}

/**
 * Standard error API response wrapper
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

/**
 * Unified API response type
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Pagination query parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
