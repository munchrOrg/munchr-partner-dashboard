import type { UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { Cuisine } from './types';
import { useQuery } from '@tanstack/react-query';
import { partnerKeys } from './keys';
import { partnerService } from './service';

type ApiErrorResponse = {
  message?: string;
  error?: string;
  statusCode?: number;
};

type QueryOptions<TData> = Omit<
  UseQueryOptions<TData, AxiosError<ApiErrorResponse>, TData>,
  'queryKey' | 'queryFn'
>;

export const useCuisines = (options?: QueryOptions<Cuisine[]>) =>
  useQuery({
    queryKey: partnerKeys.cuisines(),
    queryFn: partnerService.getCuisines,
    staleTime: 5 * 60 * 1000, // 5 minutes - cuisines don't change often
    ...options,
  });
