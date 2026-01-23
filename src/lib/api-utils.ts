import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/api';

type AxiosErrorWithApiResponse = AxiosError<ApiErrorResponse>;

export function getApiErrorMessage(error: unknown): string {
  const axiosError = error as AxiosErrorWithApiResponse;

  const responseData = axiosError?.response?.data;
  if (responseData?.message) {
    return responseData.message;
  }

  if (axiosError?.message) {
    return axiosError.message;
  }

  return 'An unexpected error occurred';
}

export function getApiErrorCode(error: unknown): string | undefined {
  const axiosError = error as AxiosErrorWithApiResponse;
  return axiosError?.response?.data?.error;
}

export function getApiErrorData<T = Record<string, unknown>>(error: unknown): T | null {
  const axiosError = error as AxiosErrorWithApiResponse;
  return (axiosError?.response?.data?.data as T) ?? null;
}

export function hasErrorCode(error: unknown, code: string): boolean {
  return getApiErrorCode(error) === code;
}
