export type ApiPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiResponse<T = unknown> = {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: ApiPaginationMeta;
};

export type ApiErrorResponse<T = Record<string, unknown> | null> = {
  success: false;
  statusCode: number;
  message: string;
  error: string;
  data: T;
};

export const ApiErrorCodes = {
  VERIFICATION_REQUIRED: 'verification_required',
  PENDING_APPROVAL: 'pending_approval',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not_found',
  CONFLICT: 'conflict',
  BAD_REQUEST: 'bad_request',
} as const;

export type ApiErrorCode = (typeof ApiErrorCodes)[keyof typeof ApiErrorCodes];
